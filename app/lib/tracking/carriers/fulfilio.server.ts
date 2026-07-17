// Fulfilio 3PL — STUB (servicio no contratado aún)
//
// Fulfilio no es un carrier: es un 3PL que internamente usa DHL / GLS / DPD.
// El tracking se consulta por referencia de pedido del cliente, no por AWB.
// Cuando esté contratado, pedir:
//   - URL base API (probablemente https://api.fulfilio.com)
//   - Endpoint de tracking: /v1/orders/{reference}/tracking o similar
//   - Autenticación: Bearer token o API key
//   - Si devuelven el sub-carrier utilizado (así se puede mostrar el logo correcto)

import type { NormalizedTracking } from '../types';
import { STATUS_LABELS } from '../types';

export async function fetchFulfilio(
  orderReference: string,
  _apiKey?: string,
): Promise<NormalizedTracking> {
  // TODO: implementar cuando esté contratado
  return {
    carrier: 'Fulfilio',
    trackingNumber: orderReference,
    currentStatus: 'unknown',
    statusLabel: STATUS_LABELS.unknown,
    events: [],
    error: 'Fulfilio: servicio no contratado aún',
  };
}
