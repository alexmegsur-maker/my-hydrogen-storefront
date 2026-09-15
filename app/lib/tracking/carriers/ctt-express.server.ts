// CTT Express "Servicios Web" — adaptador de tracking.
//
// Credenciales ya configuradas (ver .env): CTT_EXPRESS_CLIENT_CODE,
// CTT_EXPRESS_CLIENT_ID, CTT_EXPRESS_CLIENT_SECRET, CTT_EXPRESS_USERNAME,
// CTT_EXPRESS_PASSWORD — exactamente los mismos 5 campos que pide el propio
// plugin oficial de CTT Express para Shopify en su pantalla "Cuenta"
// (ID Cliente / Clave secreta cliente / Nombre de usuario / Contraseña /
// Código central cliente — ver guía "Guia_Shopify_CttExpress").
//
// ⚠️ PENDIENTE — igual que con Correos Express (ver correos-express.server.ts):
// esa guía documenta la pantalla de configuración del PLUGIN de Shopify, no
// el contrato técnico (protocolo/URL/operación) del API de "Servicios Web"
// al que ese plugin se conecta por detrás. La guía SÍ confirma, en la sección
// 8 "Códigos de error" (códigos numéricos 1001-1099, mensajes con marcadores
// "%nombre del parámetro%"), que es un webservice de estilo SOAP/WSDL legacy
// — de ahí que TOKEN_URL/TRACKING_URL de abajo sigan sin confirmar.
//
// Para terminar la integración hace falta, del equipo técnico/comercial de
// CTT Express (91 660 22 00 / https://www.cttexpress.com/hazte-cliente/):
//   1. URL del WSDL (o base REST, si ya migraron) del servicio de consulta
//      de expediciones/tracking — no el de creación de envíos del plugin.
//   2. Nombre de la operación/método para consultar el estado de UN envío
//      por número de expedición (awb/tracking number).
//   3. Cómo se usan exactamente client_id/client_secret/usuario/contraseña
//      en esa llamada (¿token previo tipo OAuth2? ¿Basic Auth directo?
//      ¿los 4 van en cada petición?).
//
// En cuanto CTT confirme esto, solo hace falta rellenar TOKEN_URL y
// TRACKING_URL (o eliminar getAccessToken() si no hace falta token previo) —
// el resto del adaptador (credenciales, mapeo de estados, mapeo de errores)
// ya está listo.

import type {
  NormalizedTracking,
  TrackingEvent,
  TrackingStatus,
} from '../types';
import { STATUS_LABELS } from '../types';

// TODO: confirmar con CTT Express — ver bloque de comentarios de arriba.
const TOKEN_URL = 'https://TODO-confirmar-url-token.cttexpress.com';
const TRACKING_URL = 'https://TODO-confirmar-url-tracking.cttexpress.com';

export interface CttExpressCredentials {
  clientCode?: string;
  clientId?: string;
  clientSecret?: string;
  username?: string;
  password?: string;
}

// Tabla de errores oficial — guía "Guia_Shopify_CttExpress", sección 8.
// Los códigos son de estilo SOAP/WSDL legacy; se dejan listos para cuando el
// API de tracking real empiece a devolverlos.
const CTT_ERROR_MESSAGES: Record<string, string> = {
  '1001': 'Usuario inválido o contraseña incorrecta',
  '1002': 'Permiso denegado sobre el método solicitado',
  '1003': 'Parámetros inválidos',
  '1004': 'Información solicitada no encontrada',
  '1005': 'Se ha encontrado más de un resultado con los parámetros informados',
  '1006': 'No tiene permisos sobre la información solicitada',
  '1007': 'No se ha documentado un campo obligatorio',
  '1008': 'No se ha podido determinar el destino/origen del servicio',
  '1009': 'El envío no se puede anular',
  '1010': 'El tipo de servicio no es válido',
  '1011': 'Servicio no autorizado',
  '1012': 'Ha ocurrido un error al insertar',
  '1020': 'El tipo de servicio solicitado no admite los kg indicados',
  '1021': 'Tipo de servicio solicitado no admitido para delegación y país',
  '1098': 'El método es obsoleto',
  '1099': 'Ha ocurrido un error al ejecutar el método',
};

function cttErrorMessage(code: string, fallback: string): string {
  return CTT_ERROR_MESSAGES[code] ? `CTT Express (${code}): ${CTT_ERROR_MESSAGES[code]}` : fallback;
}

// Estados según se ven en el panel del plugin (guía, capturas de "Estado del
// envío" y "Seguimiento"): Preparado, Manifestado, Recogida Fallida, Envío en
// curso, Pendiente De Depositar En Punto Ctt, Entregado, Entregado/Devolución,
// Envío Anulado, Pedido cancelado, En reparto. El API real de tracking podría
// usar otro vocabulario — ajustar aquí en cuanto se vean respuestas reales.
const DELIVERED_KW = ['entregado'];
const OUT_FOR_DELIVERY_KW = ['en reparto', 'reparto'];
const FAILED_KW = ['anulado', 'cancelado', 'recogida fallida'];
const PRE_TRANSIT_KW = ['preparado', 'manifestado', 'pendiente de depositar', 'recogida'];
const IN_TRANSIT_KW = ['en curso', 'tránsito', 'transito'];

function mapCttStatus(desc: string): TrackingStatus {
  const d = desc.toLowerCase();
  if (FAILED_KW.some((k) => d.includes(k))) return 'failed';
  if (DELIVERED_KW.some((k) => d.includes(k))) return 'delivered';
  if (OUT_FOR_DELIVERY_KW.some((k) => d.includes(k))) return 'out_for_delivery';
  if (IN_TRANSIT_KW.some((k) => d.includes(k))) return 'in_transit';
  if (PRE_TRANSIT_KW.some((k) => d.includes(k))) return 'pre_transit';
  return 'unknown';
}

// Forma de respuesta ASUMIDA (no confirmada) para cuando TRACKING_URL esté
// listo — ajustar en cuanto se vea una respuesta real del API.
interface CttTrackingEventRaw {
  fecha?: string;         // asunción: "DD/MM/YYYY HH:mm:ss" o ISO
  descripcion?: string;
  localidad?: string;
}
interface CttTrackingResponse {
  expedicion?: string;
  estado?: string;
  eventos?: CttTrackingEventRaw[];
  error?: { codigo: string; descripcion?: string };
}

async function getAccessToken(creds: Required<Pick<CttExpressCredentials, 'clientId' | 'clientSecret' | 'username' | 'password'>>): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      username: creds.username,
      password: creds.password,
    }),
  });

  if (!res.ok) {
    throw new Error(`No se pudo obtener token de CTT Express (HTTP ${res.status})`);
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error('Respuesta de token de CTT Express sin access_token');
  }
  return json.access_token;
}

function parseDate(raw?: string): string {
  if (!raw) return new Date(0).toISOString();
  // admite "DD/MM/YYYY HH:mm:ss" o cualquier formato que Date entienda directamente
  const slashMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})[ T]?(\d{2}:\d{2}:\d{2})?/);
  if (slashMatch) {
    const [, d, m, y, time] = slashMatch;
    const iso = `${y}-${m}-${d}T${time ?? '00:00:00'}`;
    const parsed = new Date(iso);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

export async function fetchCttExpress(
  trackingNumber: string,
  creds: CttExpressCredentials,
): Promise<NormalizedTracking> {
  const { clientCode, clientId, clientSecret, username, password } = creds;

  if (!clientCode || !clientId || !clientSecret || !username || !password) {
    return makeError(
      trackingNumber,
      'CTT Express: faltan credenciales en las variables de entorno (CTT_EXPRESS_CLIENT_CODE / CLIENT_ID / CLIENT_SECRET / USERNAME / PASSWORD)',
    );
  }

  if (TOKEN_URL.includes('TODO-confirmar') || TRACKING_URL.includes('TODO-confirmar')) {
    return makeError(
      trackingNumber,
      'CTT Express: credenciales configuradas, pero falta confirmar con CTT la URL/protocolo del API de tracking (ver TODO en ctt-express.server.ts)',
    );
  }

  try {
    const token = await getAccessToken({ clientId, clientSecret, username, password });

    const url = new URL(TRACKING_URL);
    url.searchParams.set('codigoCliente', clientCode);
    url.searchParams.set('expedicion', trackingNumber);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const text = await res.text();

    let data: CttTrackingResponse;
    try {
      data = JSON.parse(text) as CttTrackingResponse;
    } catch {
      return makeError(trackingNumber, 'CTT Express devolvió una respuesta no-JSON');
    }

    if (!res.ok || data.error) {
      const code = data.error?.codigo ?? String(res.status);
      return makeError(trackingNumber, cttErrorMessage(code, data.error?.descripcion ?? `CTT Express API HTTP ${res.status}`));
    }

    const events: TrackingEvent[] = (data.eventos ?? [])
      .map((ev): TrackingEvent => ({
        timestamp: parseDate(ev.fecha),
        description: ev.descripcion ?? 'Sin descripción',
        location: ev.localidad,
        status: mapCttStatus(ev.descripcion ?? ''),
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const currentStatus: TrackingStatus = events[0]?.status ?? mapCttStatus(data.estado ?? '');

    return {
      carrier: 'CTT Express',
      trackingNumber,
      currentStatus,
      statusLabel: STATUS_LABELS[currentStatus],
      events,
      rawCarrierUrl: `https://www.cttexpress.com/localizador-de-envios/?sc=${encodeURIComponent(trackingNumber)}`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return makeError(trackingNumber, `CTT Express: ${msg}`);
  }
}

function makeError(trackingNumber: string, error: string): NormalizedTracking {
  return {
    carrier: 'CTT Express',
    trackingNumber,
    currentStatus: 'unknown',
    statusLabel: STATUS_LABELS.unknown,
    events: [],
    error,
  };
}
