export type TrackingStatus =
  | 'pre_transit'       // información recibida, paquete aún no recogido
  | 'in_transit'        // en tránsito entre hubs
  | 'out_for_delivery'  // en reparto final
  | 'delivered'         // entregado
  | 'failed'            // intento fallido / no entregado
  | 'exception'         // incidencia (retención, devuelto, dañado…)
  | 'unknown';

export const STATUS_LABELS: Record<TrackingStatus, string> = {
  pre_transit: 'Recogido',
  in_transit: 'En tránsito',
  out_for_delivery: 'En reparto',
  delivered: 'Entregado',
  failed: 'Intento de entrega fallido',
  exception: 'Incidencia',
  unknown: 'Estado desconocido',
};

export interface TrackingEvent {
  timestamp: string;   // ISO 8601
  description: string;
  location?: string;
  status: TrackingStatus;
}

export interface NormalizedTracking {
  carrier: string;
  trackingNumber: string;
  currentStatus: TrackingStatus;
  statusLabel: string;
  estimatedDelivery?: string;  // ISO 8601, solo si el carrier lo proporciona
  events: TrackingEvent[];     // ordenados newest-first
  rawCarrierUrl?: string;      // link directo al tracking del carrier
  error?: string;              // set si el carrier devolvió error o no está configurado
}

export interface TrackingInput {
  trackingNumber?: string | null;
  company?: string | null;          // valor de Shopify fulfillments[].trackingInfo[].company
  referenceNumber?: string | null;  // para Fulfilio (ref. pedido, no AWB)
  language?: string;                // ISO 639-1: 'es' | 'en' | 'de' | 'fr' | 'it'
  // Se pasa el env completo de Oxygen — el resolver solo lee lo que necesita
  env: Record<string, string | undefined>;
}
