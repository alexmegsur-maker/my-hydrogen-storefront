// CTT Express "Get Shipping Tracking API" — adaptador de tracking.
//
// CONFIRMADO con una petición real que el usuario probó y funciona
// (2026-09-24):
//   GET https://api.cttexpress.com/integrations/trf/item-history-api/history/{code}?view=APITRACK&showItems=false
//   Header: Authorization: Bearer <token>
// Sin parámetro de "Client Center Code" — la ruta es la del ejemplo curl de
// la doc (sin "-info"; la sección "Connection URLs" de la doc lo daba con
// "-info" pero esa variante NO es la que funciona).
//
// El Bearer token es un access token de Cognito (decodificado: iss
// = cognito-idp.eu-central-1.amazonaws.com/eu-central-1_IyoNKUCFs, claim
// client_id = CTT_EXPRESS_CLIENT_ID ya presente en .env, expira a las 24h
// exactas de emitido). Esto sugiere que se puede pedir automáticamente vía
// OAuth2 client_credentials contra el dominio Cognito de CTT, usando
// CTT_EXPRESS_CLIENT_ID + CTT_EXPRESS_CLIENT_SECRET — pero no tenemos
// confirmado el dominio del token endpoint (el "iss" es el emisor para
// validar el JWT, no la URL de token). Mientras tanto, el token se pega a
// mano en CTT_EXPRESS_API_TOKEN y hay que renovarlo cada 24h.
//
// Credenciales en .env (ver .env.example):
//   CTT_EXPRESS_API_TOKEN — el Bearer token vigente (dura 24h).
//   CTT_EXPRESS_ENV       — "test" | "production" (por defecto "production").

import type {
  NormalizedTracking,
  TrackingEvent,
  TrackingStatus,
} from '../types';
import { STATUS_LABELS } from '../types';

const TEST_BASE = 'https://api-test.cttexpress.com';
const PROD_BASE = 'https://api.cttexpress.com';
const TRACKING_PATH = '/integrations/trf/item-history-api/history/';

export interface CttExpressCredentials {
  apiToken?: string;
  env?: string; // "test" | "production"
}

// Tabla de errores oficial — doc "Get Shipping Tracking API v2.0", sección
// "Error Responses". Son códigos de estado HTTP, no cuerpos de error con
// código propio (a diferencia del webservice legacy que asumía la versión
// anterior de este adaptador).
const CTT_HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Argumentos incorrectos',
  401: 'No autenticado o sin autorización para esta acción',
  403: 'Acción prohibida',
  404: 'No se encontró información para ese número de envío',
  405: 'Método no permitido',
  406: 'Not Acceptable',
  409: 'Conflicto con un envío existente',
  412: 'Precondición fallida',
  415: 'Tipo de contenido no soportado',
  500: 'Error del servicio de CTT Express, reintenta más tarde',
  502: 'Bad Gateway',
  504: 'Gateway Timeout',
};

function cttHttpErrorMessage(status: number): string {
  const known = CTT_HTTP_ERROR_MESSAGES[status];
  return known ? `CTT Express (HTTP ${status}): ${known}` : `CTT Express API HTTP ${status}`;
}

// Mapeo de eventos a nuestro TrackingStatus a partir del `code` numérico,
// con las descripciones (`description`) como respaldo por palabras clave.
// El ejemplo de la doc PDF viene en inglés, pero las respuestas reales de
// producción (confirmado 2026-09-24 con un envío real) llegan en ESPAÑOL —
// de ahí que las palabras clave cubran ambos idiomas. Códigos confirmados
// con datos reales: 0000, 0900, 1000, 1200, 1500, 2100; 1600 solo visto en
// el ejemplo de la doc. La tabla completa de códigos vive en un fichero
// descargable aparte ("Download STATUS, INCIDENTS, and MANAGEMENTS codes")
// no incluido en la doc que tenemos — si aparece un código nuevo sin
// clasificar, ampliar KNOWN_CODES abajo.
const KNOWN_CODES: Record<string, TrackingStatus> = {
  '0000': 'pre_transit', // Manifested / Manifestado
  '0900': 'in_transit', // In Transit / En Tránsito
  '1000': 'in_transit', // Delegación de tránsito (confirmado con envío real)
  '1200': 'in_transit', // Destination Branch / Delegación destino
  '1500': 'out_for_delivery', // Out for Delivery / En reparto
  '1600': 'failed', // Failed Delivery (solo visto en el ejemplo de la doc)
  '2100': 'delivered', // Delivered / Entregado
};

const DELIVERED_KW = ['delivered', 'entregado'];
const OUT_FOR_DELIVERY_KW = ['out for delivery', 'en reparto', 'reparto'];
const FAILED_KW = ['failed delivery', 'undelivered', 'cancel', 'anulado', 'fallid'];
const IN_TRANSIT_KW = [
  'in transit',
  'destination branch',
  'transit',
  'tránsito',
  'transito',
  'delegación',
  'delegacion',
];
const PRE_TRANSIT_KW = ['manifested', 'collected', 'pick up', 'pickup', 'manifestado', 'recogid'];

function mapCttStatus(code: string, description: string, eventType: string): TrackingStatus {
  if (KNOWN_CODES[code]) return KNOWN_CODES[code];

  const d = description.toLowerCase();
  if (DELIVERED_KW.some((k) => d.includes(k))) return 'delivered';
  if (FAILED_KW.some((k) => d.includes(k))) return 'failed';
  if (OUT_FOR_DELIVERY_KW.some((k) => d.includes(k))) return 'out_for_delivery';
  if (IN_TRANSIT_KW.some((k) => d.includes(k))) return 'in_transit';
  if (PRE_TRANSIT_KW.some((k) => d.includes(k))) return 'pre_transit';

  // Un evento de tipo INCT (incidencia) sin descripción reconocida se marca
  // como excepción en vez de "unknown" — es información real, solo que no
  // se pudo clasificar en un estado más específico.
  if (eventType === 'INCT') return 'exception';

  return 'unknown';
}

// Forma de la respuesta — tomada literalmente del cuerpo de ejemplo de la
// doc "Get Shipping Tracking API v2.0".
interface CttEventDetail {
  event_longitude_gps?: string;
  event_latitude_gps?: string;
  event_courier_code?: string;
  origin_province_name?: string;
  destin_province_name?: string;
  signee_name?: string;
  delivery_comments?: string;
  incident_type_name?: string;
  incident_type_code?: string;
  incident_type_desc?: string;
  allow_managements?: string;
  management_type?: string;
}

interface CttEventRaw {
  code?: string;
  description?: string;
  type?: string; // STATUS | INCT | INAT (Annex 1) — la tabla de campos dice "STATUS, MANAGEMENTS"
  event_date?: string;
  detail?: CttEventDetail;
}

interface CttTrackingData {
  shipping_code?: string;
  shipping_history?: { events?: CttEventRaw[] };
  committed_delivery_datetime?: string;
  delivery_date?: string;
  origin_name?: string;
  destin_name?: string;
}

interface CttTrackingResponse {
  data?: CttTrackingData;
  error?: string | null;
}

export async function fetchCttExpress(
  trackingNumber: string,
  creds: CttExpressCredentials,
): Promise<NormalizedTracking> {
  const { apiToken, env } = creds;

  if (!apiToken) {
    return makeError(
      trackingNumber,
      'CTT Express: falta CTT_EXPRESS_API_TOKEN en las variables de entorno (el Bearer token de la Get Shipping Tracking API, distinto del client secret del plugin)',
    );
  }

  const base = env === 'test' ? TEST_BASE : PROD_BASE;
  const url = new URL(base + TRACKING_PATH + encodeURIComponent(trackingNumber));
  url.searchParams.set('view', 'APITRACK');
  url.searchParams.set('showItems', 'false');

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    });

    const text = await res.text();

    let parsed: CttTrackingResponse;
    try {
      parsed = text ? (JSON.parse(text) as CttTrackingResponse) : {};
    } catch {
      return makeError(trackingNumber, 'CTT Express devolvió una respuesta no-JSON');
    }

    // La doc dice que un éxito es 201 Created, no 200 — se acepta cualquier 2xx.
    if (!res.ok) {
      return makeError(trackingNumber, cttHttpErrorMessage(res.status));
    }
    if (parsed.error) {
      return makeError(trackingNumber, `CTT Express: ${parsed.error}`);
    }

    const data = parsed.data;
    if (!data) {
      return makeError(trackingNumber, 'CTT Express: respuesta sin datos de envío');
    }

    const events: TrackingEvent[] = (data.shipping_history?.events ?? [])
      .map((ev): TrackingEvent => {
        const status = mapCttStatus(ev.code ?? '', ev.description ?? '', ev.type ?? '');
        const detail = ev.detail;
        // Prioriza la descripción de la incidencia sobre la genérica del
        // evento cuando la hay — es más informativa para el cliente.
        const description = detail?.incident_type_desc || ev.description || 'Sin descripción';
        const location = detail?.destin_province_name || detail?.origin_province_name;
        return {
          timestamp: parseDate(ev.event_date),
          description,
          location,
          status,
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const currentStatus: TrackingStatus = events[0]?.status ?? 'unknown';

    return {
      carrier: 'CTT Express',
      trackingNumber: data.shipping_code || trackingNumber,
      currentStatus,
      statusLabel: STATUS_LABELS[currentStatus],
      estimatedDelivery: parseDateOrUndefined(
        data.delivery_date || data.committed_delivery_datetime,
      ),
      events,
      rawCarrierUrl: `https://www.cttexpress.com/localizador-de-envios/?sc=${encodeURIComponent(trackingNumber)}`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return makeError(trackingNumber, `CTT Express: ${msg}`);
  }
}

function parseDate(raw?: string): string {
  if (!raw) return new Date(0).toISOString();
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

function parseDateOrUndefined(raw?: string): string | undefined {
  if (!raw) return undefined;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
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
