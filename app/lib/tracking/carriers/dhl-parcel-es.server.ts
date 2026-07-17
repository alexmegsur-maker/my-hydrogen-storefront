import type { NormalizedTracking, TrackingEvent, TrackingStatus } from '../types';
import { STATUS_LABELS } from '../types';

const DHL_API_BASE = 'https://api-eu.dhl.com/track/shipments';

interface DhlAddress {
  addressLocality?: string;
  countryCode?: string;
}
interface DhlEvent {
  timestamp: string;
  location?: { address?: DhlAddress };
  description: string;
  status?: string;      // descripción larga (a veces ausente)
  statusCode?: string;  // código máquina: "delivered" | "transit" | "pre-transit" | "failure"
}
interface DhlShipment {
  id: string;
  service?: string;
  status: DhlEvent;
  events: DhlEvent[];
  estimatedTimeOfDelivery?: string;
}
interface DhlOkResponse { shipments: DhlShipment[] }
interface DhlErrorResponse { title?: string; status?: number; detail?: string }
type DhlResponse = DhlOkResponse | DhlErrorResponse;

const OUT_FOR_DELIVERY_KW = ['reparto', 'out for delivery', 'en camino al destinatario'];

function mapDhlStatus(s: string | undefined, desc = ''): TrackingStatus {
  if (!s) return 'unknown';
  const st  = s.toLowerCase();
  const d   = desc.toLowerCase();
  if (st === 'delivered')   return 'delivered';
  if (st === 'failure')     return 'failed';
  if (st === 'pre-transit') return 'pre_transit';
  if (st === 'transit') {
    if (OUT_FOR_DELIVERY_KW.some((k) => d.includes(k))) return 'out_for_delivery';
    return 'in_transit';
  }
  return 'unknown';
}

function fmtLoc(loc?: DhlEvent['location']): string | undefined {
  const a = loc?.address;
  if (!a) return undefined;
  return [a.addressLocality, a.countryCode].filter(Boolean).join(', ') || undefined;
}

// Timeout manual compatible con Node 16 y Cloudflare Workers
function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

export async function fetchDhlParcelEs(
  trackingNumber: string,
  apiKey: string,
  language = 'es',
): Promise<NormalizedTracking> {
  const url = new URL(DHL_API_BASE);
  url.searchParams.set('trackingNumber', trackingNumber);
  url.searchParams.set('language', language);
  // Si confirmas que DHL te asigna service "parcel-es", descomenta:
  // url.searchParams.set('service', 'parcel-es');

  let raw: DhlResponse | null = null;

  try {
    const res = await fetchWithTimeout(
      url.toString(),
      {
        headers: {
          'DHL-API-Key': apiKey,
          Accept: 'application/json',
        },
      },
      8_000,
    );

    const text = await res.text();
    console.log(`[DHL] status=${res.status} body=${text.slice(0, 300)}`);

    try {
      raw = JSON.parse(text) as DhlResponse;
    } catch {
      return makeError(trackingNumber, `DHL devolvió respuesta no-JSON (HTTP ${res.status})`);
    }

    if (!res.ok) {
      const err = raw as DhlErrorResponse;
      return makeError(trackingNumber, err.detail ?? `DHL API HTTP ${res.status}`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[DHL] fetch error:', msg);
    return makeError(trackingNumber, `DHL API no disponible: ${msg}`);
  }

  const ok = raw as DhlOkResponse;
  const shipment = ok.shipments?.[0];
  if (!shipment) {
    return makeError(trackingNumber, 'Número de seguimiento no encontrado en DHL');
  }

  const currentStatus = mapDhlStatus(
    shipment.status.statusCode ?? shipment.status.status,
    shipment.status.description,
  );

  const events: TrackingEvent[] = (shipment.events ?? [])
    .map((ev) => ({
      timestamp: ev.timestamp,
      description: ev.description,
      location: fmtLoc(ev.location),
      status: mapDhlStatus(ev.statusCode ?? ev.status, ev.description),
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    carrier: 'DHL',
    trackingNumber,
    currentStatus,
    statusLabel: STATUS_LABELS[currentStatus],
    estimatedDelivery: shipment.estimatedTimeOfDelivery,
    events,
    rawCarrierUrl: `https://www.dhl.com/es-es/home/seguimiento.html?tracking-id=${encodeURIComponent(trackingNumber)}`,
  };
}

function makeError(trackingNumber: string, error: string): NormalizedTracking {
  return {
    carrier: 'DHL',
    trackingNumber,
    currentStatus: 'unknown',
    statusLabel: STATUS_LABELS.unknown,
    events: [],
    error,
  };
}
