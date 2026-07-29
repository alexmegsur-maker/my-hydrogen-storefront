// Correos Express — STUB (credenciales OAuth2 recibidas, falta URL base/endpoint)
//
// Ya tenemos ClientId + ClientSecret (portal MuleSoft/Anypoint, asset "trackpub" v2).
// Faltan estos datos del portal de desarrollador antes de poder activar el adaptador:
//
// 1. URL del endpoint de token (grant_type=client_credentials).
//    Típico en MuleSoft: algo como
//    https://<org>.anypoint.mulesoft.com/accounts/api/v2/oauth2/token
//    o un dominio propio de Correos (ej. https://api.correosexpress.com/oauth/token).
//
// 2. URL base + path del endpoint de tracking (el asset "trackpub").
//    Ej. https://api.correosexpress.com/track/v2/shipments/{trackingNumber}
//
// 3. Cómo espera el tracking number: path param, query param (`?shipmentReference=`),
//    o body POST. Y si acepta uno o varios números por llamada.
//
// 4. Formato de respuesta: nombres de campos de fecha/hora, ubicación y,
//    sobre todo, el catálogo de códigos de estado (para mapear a
//    'pre_transit' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'exception').
//
// 5. Si el access_token hay que cachearlo (suele expirar en ~3600s) — con Cloudflare
//    Workers no hay estado en memoria entre requests, así que probablemente conviene
//    pedir un token nuevo en cada llamada salvo que se quiera usar KV/Cache API.
//
// Con esos 4 datos, este stub se completa igual que dhl-parcel-es.server.ts.

import type { NormalizedTracking } from '../types';
import { STATUS_LABELS } from '../types';

// Posible flujo (confirmar con la doc del portal antes de activar):
//
// const TOKEN_URL = 'https://TODO/oauth2/token';
// const TRACKING_BASE = 'https://TODO/track/v2/shipments';
//
// async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
//   const res = await fetch(TOKEN_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: new URLSearchParams({
//       grant_type: 'client_credentials',
//       client_id: clientId,
//       client_secret: clientSecret,
//     }),
//   });
//   const json = await res.json();
//   return json.access_token;
// }

export async function fetchCorreosExpress(
  trackingNumber: string,
  _clientId?: string,
  _clientSecret?: string,
): Promise<NormalizedTracking> {
  // TODO: implementar cuando tengamos la URL base del token + del endpoint de tracking
  return {
    carrier: 'Correos Express',
    trackingNumber,
    currentStatus: 'unknown',
    statusLabel: STATUS_LABELS.unknown,
    events: [],
    error: 'Correos Express: adaptador pendiente de URL base del portal (client_id/secret ya configurados)',
  };
}
