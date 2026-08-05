// Correos Express — adaptador para el API "trackpub" v2 (portal MuleSoft/Anypoint).
//
// Confirmado con la doc real del portal (Detalles API → searchShipping):
//   Base:  https://api1.correos.es/support/trackpub/api/v2
//   GET    /search/{shippingCode}?languageCode=ES
//   Headers requeridos: client_id, client_secret, Authorization: Bearer <JWT>
//
// ⚠️ PENDIENTE: ya se revisaron TODAS las pestañas del portal (Detalles API,
// Documentación API, Avisos) y la pantalla "View" de credenciales de la app
// "tracking-orders" — solo existen Client Id + Client Secret. NO hay un
// endpoint de login/token documentado en ningún lado para obtener el JWT que
// pide la cabecera "Authorization: Bearer <JWT>". Esto ya no se puede sacar
// del self-service del portal — hay que preguntar directamente a soporte:
//
//   dl-mantenimiento-trazabilidad@atos.com
//
// Pregunta sugerida: "Tenemos acceso aprobado a trackpub (app
// 'tracking-orders', client_id b14eab0c...). La doc pide cabecera
// Authorization: Bearer <JWT> pero no encontramos cómo se genera/obtiene
// ese token. ¿Nos indican el endpoint de login o el flujo correcto?"
//
// En cuanto Correos/Atos respondan, rellenar TOKEN_URL abajo (o, si el JWT
// resulta ser un valor fijo que te entregan igual que el client_secret,
// eliminar getAccessToken() y pasarlo directo como 3ra credencial, igual que
// clientId/clientSecret).

import type {
  NormalizedTracking,
  TrackingEvent,
  TrackingStatus,
} from '../types';
import { STATUS_LABELS } from '../types';

const TRACKING_BASE = 'https://api1.correos.es/support/trackpub/api/v2';

// TODO: confirmar. Suposición estándar OAuth2 client_credentials mientras
// no se localice la URL real en la documentación del portal.
const TOKEN_URL = 'https://TODO-confirmar-url-token.correos.es/oauth/token';

interface CorreosEvent {
  eventDate?: string;   // "25/03/2022" (DD/MM/YYYY)
  eventHours?: string;  // "12:09:16"
  eventCode?: string;
  eventDes?: string;
  phase?: string;
  phaseDes?: string;
  summaryText?: string;
  expandedText?: string;
  location?: string;
  province?: string;
  country?: string;
}

interface CorreosSearchResponse {
  code?: string;
  deliveryDate?: string;   // "03/02/2024"
  has_incidence?: string;  // "N" | "S"
  eventResume?: string;
  events?: CorreosEvent[];
  error?: { codError: string; desError: string }[];
}

async function getAccessToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`No se pudo obtener token de Correos Express (HTTP ${res.status})`);
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error('Respuesta de token sin access_token');
  }
  return json.access_token;
}

// "25/03/2022" + "12:09:16" → ISO 8601. Solo fecha ("03/02/2024") también vale.
function parseDateTime(date?: string, time?: string): string | undefined {
  if (!date) return undefined;
  const [d, m, y] = date.split('/');
  if (!d || !m || !y) return undefined;
  const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${time ?? '00:00:00'}`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

// El portal no documenta un catálogo cerrado de códigos/fases, así que se
// clasifica por palabras clave de la descripción del evento (fase/resumen).
// Ajustar esta lista según se vayan viendo descripciones reales.
const DELIVERED_KW = ['entregado', 'entrega realizada'];
const OUT_FOR_DELIVERY_KW = ['en reparto', 'reparto'];
const FAILED_KW = ['incidencia', 'devuelto', 'no entregado', 'rechazado', 'ausente'];
const PRE_TRANSIT_KW = ['pre-admision', 'preadmision', 'prerregistrado', 'admision', 'admitido'];

function mapCorreosStatus(desc: string): TrackingStatus {
  const d = desc.toLowerCase();
  if (DELIVERED_KW.some((k) => d.includes(k))) return 'delivered';
  if (FAILED_KW.some((k) => d.includes(k))) return 'failed';
  if (OUT_FOR_DELIVERY_KW.some((k) => d.includes(k))) return 'out_for_delivery';
  if (PRE_TRANSIT_KW.some((k) => d.includes(k))) return 'pre_transit';
  return 'in_transit';
}

export async function fetchCorreosExpress(
  trackingNumber: string,
  clientId?: string,
  clientSecret?: string,
): Promise<NormalizedTracking> {
  if (!clientId || !clientSecret) {
    return makeError(
      trackingNumber,
      'Correos Express: faltan CORREOS_EXPRESS_CLIENT_ID / CORREOS_EXPRESS_CLIENT_SECRET en las variables de entorno',
    );
  }

  if (TOKEN_URL.includes('TODO-confirmar')) {
    return makeError(
      trackingNumber,
      'Correos Express: falta confirmar la URL del endpoint de login/token JWT (ver comentario en correos-express.server.ts)',
    );
  }

  try {
    const token = await getAccessToken(clientId, clientSecret);

    const url = `${TRACKING_BASE}/search/${encodeURIComponent(trackingNumber)}?languageCode=ES`;
    const res = await fetch(url, {
      headers: {
        client_id: clientId,
        client_secret: clientSecret,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const text = await res.text();

    if (!res.ok) {
      return makeError(trackingNumber, `Correos Express API HTTP ${res.status}: ${text.slice(0, 300)}`);
    }

    let data: CorreosSearchResponse;
    try {
      data = JSON.parse(text) as CorreosSearchResponse;
    } catch {
      return makeError(trackingNumber, 'Correos Express devolvió una respuesta no-JSON');
    }

    if (data.error?.length) {
      return makeError(trackingNumber, data.error.map((e) => e.desError).filter(Boolean).join('; ') || 'Error de Correos Express');
    }

    const events: TrackingEvent[] = (data.events ?? [])
      .map((ev): TrackingEvent => {
        const description = ev.expandedText || ev.eventDes || ev.summaryText || 'Sin descripción';
        return {
          timestamp: parseDateTime(ev.eventDate, ev.eventHours) ?? new Date(0).toISOString(),
          description,
          location: [ev.location, ev.province].filter(Boolean).join(', ') || undefined,
          status: mapCorreosStatus(ev.phaseDes || ev.summaryText || description),
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const currentStatus: TrackingStatus =
      events[0]?.status ?? (data.has_incidence === 'S' ? 'exception' : 'unknown');

    return {
      carrier: 'Correos Express',
      trackingNumber,
      currentStatus,
      statusLabel: STATUS_LABELS[currentStatus],
      estimatedDelivery: parseDateTime(data.deliveryDate),
      events,
      rawCarrierUrl: `https://www.correosexpress.com/es/seguimiento?tracking=${encodeURIComponent(trackingNumber)}`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return makeError(trackingNumber, `Correos Express: ${msg}`);
  }
}

function makeError(trackingNumber: string, error: string): NormalizedTracking {
  return {
    carrier: 'Correos Express',
    trackingNumber,
    currentStatus: 'unknown',
    statusLabel: STATUS_LABELS.unknown,
    events: [],
    error,
  };
}
