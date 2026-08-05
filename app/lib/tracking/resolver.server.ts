import type { NormalizedTracking, TrackingInput } from './types';
import { STATUS_LABELS } from './types';
import { fetchDhlParcelEs } from './carriers/dhl-parcel-es.server';
import { fetchCttExpress } from './carriers/ctt-express.server';
import { fetchFulfilio } from './carriers/fulfilio.server';
import { fetchCorreosExpress } from './carriers/correos-express.server';

// Carriers que Shopify a veces "adivina" a partir del formato del número de
// seguimiento cuando el fulfillment se crea sin elegir transportista
// explícitamente (autodetección interna de Shopify). No trabajamos con
// ninguno de estos — si Shopify los detecta, en la práctica siempre es un
// envío real de Correos Express mal etiquetado, así que lo redirigimos.
const MISDETECTED_AS_CORREOS_EXPRESS = ['canada post', 'canadapost'];

// Prefijos de número de seguimiento confirmados por el merchant — son más
// fiables que el nombre de carrier que informa Shopify (que puede venir mal
// autodetectado). Se comprueban ANTES que el nombre de company.
const TRACKING_NUMBER_PREFIXES: {
  prefix: string;
  carrier: 'dhl' | 'ctt' | 'correos_express';
}[] = [
  { prefix: '180', carrier: 'dhl' },
  { prefix: '933', carrier: 'correos_express' },
  { prefix: '001', carrier: 'ctt' },
];

// Nombre "canónico" de cada carrier — usado tanto para mostrarlo en la
// respuesta como para corregir el campo trackingCompany en el pedido.
export const CARRIER_LABELS: Record<
  'dhl' | 'ctt' | 'fulfilio' | 'correos_express',
  string
> = {
  dhl: 'DHL',
  ctt: 'CTT Express',
  fulfilio: 'Fulfilio',
  correos_express: 'Correos Express',
};

export function detectCarrierByTrackingNumber(
  trackingNumber?: string | null,
): 'dhl' | 'ctt' | 'correos_express' | null {
  if (!trackingNumber) return null;
  const n = trackingNumber.trim();
  const match = TRACKING_NUMBER_PREFIXES.find((p) => n.startsWith(p.prefix));
  return match?.carrier ?? null;
}

function detectCarrier(company?: string | null): 'dhl' | 'ctt' | 'fulfilio' | 'correos_express' | null {
  if (!company) return null;
  const c = company.toLowerCase();
  if (c.includes('dhl')) return 'dhl';
  if (c.includes('ctt')) return 'ctt';
  if (c.includes('fulfilio')) return 'fulfilio';
  if (c.includes('correos express') || c.includes('correosexpress') || c === 'cex' || c.includes('correos_express')) {
    return 'correos_express';
  }
  if (MISDETECTED_AS_CORREOS_EXPRESS.some((k) => c.includes(k))) {
    return 'correos_express';
  }
  return null;
}

export async function resolveTracking(
  input: TrackingInput,
): Promise<NormalizedTracking | null> {
  const { trackingNumber, company, referenceNumber, language = 'es', env } = input;

  if (!trackingNumber && !referenceNumber) return null;

  console.log(`[resolveTracking] trackingNumber=${trackingNumber} company=${company}`);

  // El prefijo del número de seguimiento manda sobre el nombre de company
  // que informa Shopify (ver TRACKING_NUMBER_PREFIXES arriba).
  let carrier = detectCarrierByTrackingNumber(trackingNumber) ?? detectCarrier(company);

  // Fallback: si Shopify no informa el carrier pero hay API key de DHL configurada,
  // intentamos DHL directamente (caso habitual: fulfillments creados sin carrier).
  if (!carrier && env.DHL_PARCEL_ES_API_KEY && trackingNumber) {
    console.log('[resolveTracking] company no reconocido, usando DHL como fallback');
    carrier = 'dhl';
  }

  try {
    switch (carrier) {
      case 'dhl': {
        const apiKey = env.DHL_PARCEL_ES_API_KEY;
        if (!apiKey) {
          return {
            carrier: 'DHL',
            trackingNumber: trackingNumber!,
            currentStatus: 'unknown',
            statusLabel: STATUS_LABELS.unknown,
            events: [],
            error: 'DHL_PARCEL_ES_API_KEY no está configurada en las variables de entorno',
          };
        }
        return await fetchDhlParcelEs(trackingNumber!, apiKey, language);
      }

      case 'ctt':
        return await fetchCttExpress(
          trackingNumber!,
          env.CTT_EXPRESS_CLIENT_CODE,
          env.CTT_EXPRESS_USERNAME,
          env.CTT_EXPRESS_PASSWORD,
        );

      case 'fulfilio':
        return await fetchFulfilio(
          referenceNumber ?? trackingNumber!,
          env.FULFILIO_API_KEY,
        );

      case 'correos_express':
        return await fetchCorreosExpress(
          trackingNumber!,
          env.CORREOS_EXPRESS_CLIENT_ID,
          env.CORREOS_EXPRESS_CLIENT_SECRET,
        );

      default:
        return {
          carrier: company ?? 'Transportista',
          trackingNumber: trackingNumber ?? '',
          currentStatus: 'unknown',
          statusLabel: STATUS_LABELS.unknown,
          events: [],
          error: company
            ? `Carrier "${company}" no integrado — agrega su adaptador o configura DHL_PARCEL_ES_API_KEY`
            : 'No hay API key de transportista configurada',
        };
    }
  } catch (e) {
    const msg = e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
    console.error('[resolveTracking] Excepción no controlada:', msg);
    return {
      carrier: company ?? 'Unknown',
      trackingNumber: trackingNumber ?? '',
      currentStatus: 'unknown',
      statusLabel: STATUS_LABELS.unknown,
      events: [],
      error: `Error interno: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}
