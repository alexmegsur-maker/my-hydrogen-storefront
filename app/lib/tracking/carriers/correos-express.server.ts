// Correos Express — adaptador para el API legacy "apiRestSeguimientoEnviosk8s"
// (no es el portal MuleSoft/Anypoint "trackpub" v2 que asumía la versión
// anterior de este archivo — ese portal nunca llegó a confirmarse).
//
// CONFIRMADO con una petición real que el usuario probó y funciona
// (2026-09-30):
//   POST https://www.cexpr.es/wsps/apiRestSeguimientoEnviosk8s/json/seguimientoEnvio
//   Header: Authorization: Basic base64(usuario:password)   (usuario acaba en "_WS")
//   Body (JSON): { codigoCliente, dato: <número de envío>, idioma: "ES" }
//
// Credenciales en .env (ver .env.example):
//   CORREOS_EXPRESS_USERNAME    — usuario con sufijo "_WS"
//   CORREOS_EXPRESS_PASSWORD    — contraseña
//   CORREOS_EXPRESS_CLIENT_CODE — codigoCliente (el mismo usuario sin "_WS")
//
// ⚠️ El cuerpo de la respuesta incluye datos personales del remitente y del
// destinatario (nombre, teléfono, dirección) en los campos *Rte/*Dest — NO
// se deben exponer al cliente final. Este adaptador solo traslada al
// NormalizedTracking el estado y el historial de eventos (código, fecha,
// delegación), nunca esos campos.

import type {
  NormalizedTracking,
  TrackingEvent,
  TrackingStatus,
} from '../types';
import { STATUS_LABELS } from '../types';

const TRACKING_URL =
  'https://www.cexpr.es/wsps/apiRestSeguimientoEnviosk8s/json/seguimientoEnvio';

export interface CorreosExpressCredentials {
  username?: string;
  password?: string;
  clientCode?: string;
}

interface CorreosEstadoEvento {
  codEstado?: string;
  descEstado?: string;
  fechaEstado?: string; // "DDMMYYYY" (sin separadores)
  horaEstado?: string; // "HHmmss"
  codIncEstado?: string | null;
  descIncEstado?: string | null;
  idDelegacion?: string;
  nombreDelegacion?: string;
}

interface CorreosSeguimientoResponse {
  error?: number;
  mensajeError?: string | null;
  resultado?: string;
  numEnvio?: string;
  codEstado?: string;
  descEstado?: string;
  fechaEstado?: string;
  horaEstado?: string;
  codIncEstado?: string | null;
  descIncEstado?: string | null;
  estadoEnvios?: CorreosEstadoEvento[];
}

// Códigos vistos con un envío real (0-31092026): 1 SIN RECEPCION, 4 TRANSITO,
// 6 DELEGACION DESTINO, 8 EN REPARTO, 12 ENTREGADO. El API no documenta un
// catálogo cerrado — si aparece un código nuevo sin clasificar, se resuelve
// por palabras clave de `descEstado` y, si tampoco coincide, "in_transit"
// (más seguro que "unknown" para un envío que sigue en curso).
const KNOWN_CODES: Record<string, TrackingStatus> = {
  '1': 'pre_transit', // SIN RECEPCION
  '4': 'in_transit', // TRANSITO
  '6': 'in_transit', // DELEGACION DESTINO
  '8': 'out_for_delivery', // EN REPARTO
  '12': 'delivered', // ENTREGADO
};

const DELIVERED_KW = ['entregado', 'entrega realizada'];
const OUT_FOR_DELIVERY_KW = ['en reparto', 'reparto'];
const FAILED_KW = ['incidencia', 'devuelto', 'no entregado', 'rechazado', 'ausente', 'anulado'];
const PRE_TRANSIT_KW = ['sin recepcion', 'sin recepción', 'admision', 'admisión', 'admitido'];

function mapCorreosStatus(code: string, desc: string): TrackingStatus {
  if (KNOWN_CODES[code]) return KNOWN_CODES[code];

  const d = desc.toLowerCase();
  if (DELIVERED_KW.some((k) => d.includes(k))) return 'delivered';
  if (FAILED_KW.some((k) => d.includes(k))) return 'failed';
  if (OUT_FOR_DELIVERY_KW.some((k) => d.includes(k))) return 'out_for_delivery';
  if (PRE_TRANSIT_KW.some((k) => d.includes(k))) return 'pre_transit';
  return 'in_transit';
}

// "22092026" + "142419" -> ISO 8601. Formato DDMMYYYY/HHmmss, sin separadores
// (distinto del "DD/MM/YYYY" que asumía la versión anterior de este archivo).
function parseCorreosDateTime(date?: string, time?: string): string {
  if (!date || date.length !== 8) return new Date(0).toISOString();
  const d = date.slice(0, 2);
  const m = date.slice(2, 4);
  const y = date.slice(4, 8);
  const hh = time && time.length === 6 ? time.slice(0, 2) : '00';
  const mm = time && time.length === 6 ? time.slice(2, 4) : '00';
  const ss = time && time.length === 6 ? time.slice(4, 6) : '00';
  const parsed = new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}`);
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

export async function fetchCorreosExpress(
  trackingNumber: string,
  creds: CorreosExpressCredentials,
  language = 'ES',
): Promise<NormalizedTracking> {
  const { username, password, clientCode } = creds;

  if (!username || !password || !clientCode) {
    return makeError(
      trackingNumber,
      'Correos Express: faltan CORREOS_EXPRESS_USERNAME / CORREOS_EXPRESS_PASSWORD / CORREOS_EXPRESS_CLIENT_CODE en las variables de entorno',
    );
  }

  try {
    const auth = btoa(`${username}:${password}`);
    const res = await fetch(TRACKING_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        codigoCliente: clientCode,
        dato: trackingNumber,
        idioma: language.toUpperCase(),
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      return makeError(trackingNumber, `Correos Express API HTTP ${res.status}: ${text.slice(0, 300)}`);
    }

    let data: CorreosSeguimientoResponse;
    try {
      data = JSON.parse(text) as CorreosSeguimientoResponse;
    } catch {
      return makeError(trackingNumber, 'Correos Express devolvió una respuesta no-JSON');
    }

    if (data.error) {
      return makeError(trackingNumber, data.mensajeError || `Correos Express: error ${data.error}`);
    }

    const events: TrackingEvent[] = (data.estadoEnvios ?? [])
      .map((ev): TrackingEvent => {
        const code = ev.codEstado ?? '';
        const description = ev.descIncEstado || ev.descEstado || 'Sin descripción';
        return {
          timestamp: parseCorreosDateTime(ev.fechaEstado, ev.horaEstado),
          description,
          location: ev.nombreDelegacion || undefined,
          status: mapCorreosStatus(code, description),
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const currentStatus: TrackingStatus =
      events[0]?.status ?? mapCorreosStatus(data.codEstado ?? '', data.descEstado ?? '');

    return {
      carrier: 'Correos Express',
      trackingNumber: data.numEnvio || trackingNumber,
      currentStatus,
      statusLabel: STATUS_LABELS[currentStatus],
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
