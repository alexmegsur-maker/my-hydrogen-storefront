import type { NormalizedTracking, TrackingInput } from './types';
import { STATUS_LABELS } from './types';
import { fetchDhlParcelEs } from './carriers/dhl-parcel-es.server';
import { fetchCttExpress } from './carriers/ctt-express.server';
import { fetchFulfilio } from './carriers/fulfilio.server';

function detectCarrier(company?: string | null): 'dhl' | 'ctt' | 'fulfilio' | null {
  if (!company) return null;
  const c = company.toLowerCase();
  if (c.includes('dhl')) return 'dhl';
  if (c.includes('ctt')) return 'ctt';
  if (c.includes('fulfilio')) return 'fulfilio';
  return null;
}

export async function resolveTracking(
  input: TrackingInput,
): Promise<NormalizedTracking | null> {
  const { trackingNumber, company, referenceNumber, language = 'es', env } = input;

  if (!trackingNumber && !referenceNumber) return null;

  console.log(`[resolveTracking] trackingNumber=${trackingNumber} company=${company}`);

  let carrier = detectCarrier(company);

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
