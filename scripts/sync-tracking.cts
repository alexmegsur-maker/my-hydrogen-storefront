/// <reference types="node" />
/**
 * sync-tracking.cts
 *
 * Reglas de negocio:
 *   R1 – Filtro estricto: solo pedidos de los últimos DAYS_WINDOW días (doble check: query + código)
 *   R2 – Entregas fallidas: actualiza el metafield Y crea el FulfillmentEvent de fallo
 *   R3 – Verificación de panel: si displayStatus no coincide con el estado real, fuerza la sincronización
 */

// ── Configuración ─────────────────────────────────────────────────────────────

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? process.env.PUBLIC_STORE_DOMAIN ?? '';
const SHOPIFY_TOKEN  = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ?? '';
const DHL_API_KEY    = process.env.DHL_PARCEL_ES_API_KEY ?? '';
const API_VERSION    = process.env.SHOPIFY_API_VERSION ?? '2026-01';
const DRY_RUN        = process.argv.includes('--dry-run');

const MF_NAMESPACE = 'custom';
const MF_KEY       = 'tracking_data';
const DAYS_WINDOW  = 15;   // R1: ventana máxima de días
const MAX_ORDERS   = 30;
const DELAY_MS     = 400;

// ── Tipos ─────────────────────────────────────────────────────────────────────

type TrackingStatus =
  | 'pre_transit'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'exception'
  | 'unknown';

interface TrackingData {
  carrier: string;
  trackingNumber: string;
  status: TrackingStatus;
  lastChecked: string;
}

interface ShopifyOrder {
  id: string;
  name: string;
  createdAt: string;           // R1: para verificación estricta de fecha en código
  fulfillments: Array<{
    id: string;
    status: string;
    displayStatus: string;     // R3: para detectar desincronización con el panel
    trackingInfo: Array<{ company: string | null; number: string | null }>;
  }>;
  metafield: { id: string; value: string } | null;
}

// ── Mapeo de estados ──────────────────────────────────────────────────────────

// Estados que ya no necesitan más seguimiento
const TERMINAL_STATUSES = new Set<TrackingStatus>(['delivered', 'exception', 'failed']);

// R2: estados que representan una entrega fallida
const FAILED_STATUSES = new Set<TrackingStatus>(['failed', 'exception']);

// Nuestro estado → valor REST de Shopify (minúsculas con guiones bajos)
const TO_REST_STATUS: Partial<Record<TrackingStatus, string>> = {
  pre_transit:       'confirmed',
  in_transit:        'in_transit',
  out_for_delivery:  'out_for_delivery',
  delivered:         'delivered',
  failed:            'attempted_delivery',  // R2: intento fallido
  exception:         'failure',             // R2: error/excepción
};

// R3: nuestro estado → displayStatus GraphQL de Shopify (mayúsculas)
const TO_DISPLAY_STATUS: Partial<Record<TrackingStatus, string>> = {
  pre_transit:       'CONFIRMED',
  in_transit:        'IN_TRANSIT',
  out_for_delivery:  'OUT_FOR_DELIVERY',
  delivered:         'DELIVERED',
  failed:            'ATTEMPTED_DELIVERY',
  exception:         'FAILURE',
};

// ── Shopify GraphQL helper ────────────────────────────────────────────────────

async function shopifyGQL<T = any>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shopify GQL HTTP ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown[] };
  if (json.errors?.length) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json.data as T;
}

// ── Shopify REST: crear FulfillmentEvent ──────────────────────────────────────

async function createFulfillmentEvent(
  orderGid: string,
  fulfillmentGid: string,
  restStatus: string,
): Promise<boolean> {
  const orderId       = orderGid.split('/').pop();
  const fulfillmentId = fulfillmentGid.split('/').pop();

  if (!orderId || !fulfillmentId) {
    console.error(`    ❌ GID inválido — Order: ${orderGid} | Fulfillment: ${fulfillmentGid}`);
    return false;
  }

  const url = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/orders/${orderId}/fulfillments/${fulfillmentId}/events.json`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ event: { status: restStatus } }),
  });

  const body = (await res.json()) as any;

  if (!res.ok) {
    console.error(`    ❌ REST FulfillmentEvent HTTP ${res.status}:`, JSON.stringify(body));
    return false;
  }

  const ev = body?.fulfillment_event;
  console.log(`    ✅ Panel Shopify actualizado → ${ev?.status} (event id: ${ev?.id})`);
  return true;
}

// ── Query GraphQL de pedidos ──────────────────────────────────────────────────
// Sin argumentos "first:" en fulfillments ni trackingInfo (son listas planas, no conexiones).
// Incluye createdAt (R1) y displayStatus (R3).

const ORDERS_QUERY = `
  query OrdersForTracking($query: String!) {
    orders(first: 100, query: $query, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        name
        createdAt
        fulfillments {
          id
          status
          displayStatus
          trackingInfo {
            company
            number
          }
        }
        metafield(namespace: "${MF_NAMESPACE}", key: "${MF_KEY}") {
          id
          value
        }
      }
    }
  }
`;

const METAFIELD_SET = `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id }
      userErrors { field message }
    }
  }
`;

// ── DHL Unified Tracking API ──────────────────────────────────────────────────

function mapDhlStatus(code: string | undefined, desc = ''): TrackingStatus {
  if (!code) return 'unknown';
  const c = code.toLowerCase();
  const d = desc.toLowerCase();
  if (c === 'delivered')                                    return 'delivered';
  if (c === 'failure')                                      return 'exception';
  if (c === 'exception')                                    return 'exception';
  if (c === 'pre-transit' || c === 'pre_transit')           return 'pre_transit';
  if (c === 'transit' || c === 'in-transit' || c === 'in_transit') {
    const outKW = ['reparto', 'out for delivery', 'en camino', 'out_for_delivery'];
    return outKW.some(k => d.includes(k)) ? 'out_for_delivery' : 'in_transit';
  }
  if (c === 'out_for_delivery' || c === 'out-for-delivery') return 'out_for_delivery';
  return 'unknown';
}

async function fetchDHL(trackingNumber: string): Promise<TrackingStatus> {
  const url = `https://api-eu.dhl.com/track/shipments?trackingNumber=${encodeURIComponent(trackingNumber)}&language=es`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9_000);

  try {
    const res = await fetch(url, {
      headers: { 'DHL-API-Key': DHL_API_KEY, Accept: 'application/json' },
      signal: controller.signal,
    });

    const text = await res.text();
    console.log(`    [DHL] HTTP ${res.status} para ${trackingNumber}`);

    if (!res.ok) {
      console.warn(`    [DHL] Error: ${text.slice(0, 200)}`);
      return 'unknown';
    }

    const data = JSON.parse(text) as {
      shipments?: Array<{
        status: { statusCode?: string; status?: string; description?: string };
      }>;
    };

    const s = data.shipments?.[0]?.status;
    console.log(`    [DHL] Raw status: ${JSON.stringify(s)}`);

    if (!s) return 'unknown';

    const mapped = mapDhlStatus(s.statusCode ?? s.status, s.description ?? '');
    console.log(`    [DHL] "${s.statusCode ?? s.status}" → ${mapped}`);
    return mapped;
  } catch (e) {
    console.warn(`    [DHL] Error de red: ${e instanceof Error ? e.message : e}`);
    return 'unknown';
  } finally {
    clearTimeout(timer);
  }
}

async function queryCarrier(carrier: string, trackingNumber: string): Promise<TrackingStatus> {
  if (carrier.toLowerCase().includes('dhl')) {
    if (!DHL_API_KEY) { console.warn('    ⚠️  DHL_PARCEL_ES_API_KEY no configurada'); return 'unknown'; }
    return fetchDHL(trackingNumber);
  }
  console.warn(`    ⚠️  Carrier "${carrier}" no integrado`);
  return 'unknown';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function cutoffDate(): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - DAYS_WINDOW);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function pastISODate(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().split('T')[0]!;
}

// ── Script principal ──────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  sync-tracking  ${new Date().toISOString()}`);
  if (DRY_RUN) console.log('  ⚠️  DRY-RUN: no se escribirá nada en Shopify');
  console.log(`${'═'.repeat(60)}\n`);

  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error('Faltan SHOPIFY_STORE_DOMAIN o SHOPIFY_ADMIN_API_ACCESS_TOKEN');
  }
  if (!DHL_API_KEY) console.warn('⚠️  DHL_PARCEL_ES_API_KEY no configurada — pedidos DHL se saltarán\n');

  const since = pastISODate(DAYS_WINDOW);
  const cutoff = cutoffDate();
  console.log(`📅 R1 – Ventana estricta: últimos ${DAYS_WINDOW} días (desde ${since})\n`);

  const { orders } = await shopifyGQL<{ orders: { nodes: ShopifyOrder[] } }>(
    ORDERS_QUERY,
    { query: `created_at:>${since}` },
  );

  const allOrders = orders.nodes;
  console.log(`📦 Pedidos en respuesta Shopify: ${allOrders.length}`);

  const toProcess = allOrders
    .filter(order => {
      // R1: verificación de fecha estricta en código (doble seguridad)
      if (new Date(order.createdAt) < cutoff) return false;

      const fulfillment = order.fulfillments[0];
      if (!fulfillment) return false;

      if (order.metafield?.value) {
        try {
          const mf = JSON.parse(order.metafield.value) as Partial<TrackingData>;
          if (mf.status && TERMINAL_STATUSES.has(mf.status)) return false;
          if (mf.trackingNumber) return true;
        } catch {}
      }

      return !!fulfillment.trackingInfo[0]?.number;
    })
    .slice(0, MAX_ORDERS);

  console.log(`🔍 A procesar: ${toProcess.length} pedidos\n`);

  let updated   = 0;
  let unchanged = 0;
  let errored   = 0;

  for (const order of toProcess) {
    const fulfillment = order.fulfillments[0]!;

    let stored: Partial<TrackingData> = {};
    if (order.metafield?.value) {
      try { stored = JSON.parse(order.metafield.value); } catch {}
    }

    const carrier        = stored.carrier        ?? fulfillment.trackingInfo[0]?.company ?? 'DHL';
    const trackingNumber = stored.trackingNumber  ?? fulfillment.trackingInfo[0]?.number  ?? '';
    const prevStatus     = (stored.status ?? 'unknown') as TrackingStatus;

    console.log(`─── ${order.name}  (creado: ${order.createdAt.slice(0, 10)})`);
    console.log(`    Fulfillment:   ${fulfillment.id.split('/').pop()}  displayStatus: ${fulfillment.displayStatus}`);
    console.log(`    Carrier:       ${carrier}  |  Tracking: ${trackingNumber}`);
    console.log(`    Estado previo: ${prevStatus}`);

    if (!trackingNumber) {
      console.log('    ⏭  Sin tracking — omitido\n');
      unchanged++;
      continue;
    }

    try {
      // ── Llamar al carrier ────────────────────────────────────────────────
      const newStatus = await queryCarrier(carrier, trackingNumber);

      // ── R3: verificar si el panel de Shopify está sincronizado ───────────
      // Comparamos el displayStatus actual del fulfillment con lo que debería mostrar.
      // El estado de referencia es el nuevo si está disponible, o el almacenado si no.
      const referenceStatus: TrackingStatus =
        newStatus !== 'unknown' ? newStatus : prevStatus;

      const expectedDisplay  = TO_DISPLAY_STATUS[referenceStatus];
      const panelOutOfSync   = !!expectedDisplay && expectedDisplay !== fulfillment.displayStatus;

      if (panelOutOfSync) {
        console.log(`    ⚠️  R3 PANEL DESINCRONIZADO — actual: "${fulfillment.displayStatus}"  esperado: "${expectedDisplay}"`);
      }

      // ── Lógica de actualización ──────────────────────────────────────────
      const statusChanged    = newStatus !== 'unknown' && newStatus !== prevStatus;
      const shouldCreateEvent = statusChanged || panelOutOfSync;

      // El estado que se aplicará al panel (preferimos el nuevo; si es unknown, el de referencia)
      const panelStatus: TrackingStatus | null =
        newStatus !== 'unknown' ? newStatus :
        panelOutOfSync          ? referenceStatus :
        null;

      // R2: identificar entrega fallida
      const isFailed = panelStatus !== null && FAILED_STATUSES.has(panelStatus);
      if (isFailed) {
        console.log(`    🚨 R2 ENTREGA FALLIDA (${panelStatus}) — se registrará fallo en metafield y panel`);
      }

      console.log(`    Estado nuevo:  ${newStatus}${statusChanged ? ' ← CAMBIÓ' : ''}${panelOutOfSync ? ' | FORZANDO SYNC' : ''}`);

      // Preparar payload del metafield
      const storedStatusToSave: TrackingStatus =
        newStatus !== 'unknown' ? newStatus : prevStatus;

      const newData: TrackingData = {
        carrier,
        trackingNumber,
        status: storedStatusToSave,
        lastChecked: new Date().toISOString(),
      };

      if (!DRY_RUN) {
        // ① Actualizar metafield JSON (siempre, para registrar lastChecked y estado)
        const mfRes = await shopifyGQL<{
          metafieldsSet: { userErrors: { field: string; message: string }[] };
        }>(METAFIELD_SET, {
          metafields: [{
            ownerId: order.id,
            namespace: MF_NAMESPACE,
            key: MF_KEY,
            type: 'json',
            value: JSON.stringify(newData),
          }],
        });

        if (mfRes.metafieldsSet.userErrors.length) {
          console.error('    ❌ Error metafield:', JSON.stringify(mfRes.metafieldsSet.userErrors));
          errored++;
          console.log('');
          continue;
        }
        console.log(`    ✓ Metafield → { status: "${storedStatusToSave}" }`);

        // ② Crear FulfillmentEvent si el estado cambió o el panel está desincronizado (R3)
        if (shouldCreateEvent && panelStatus !== null) {
          const restStatus = TO_REST_STATUS[panelStatus];
          if (restStatus) {
            const ok = await createFulfillmentEvent(order.id, fulfillment.id, restStatus);
            if (ok) {
              updated++;
            } else {
              // El metafield se actualizó pero el evento REST falló
              errored++;
            }
          } else {
            console.warn(`    ⚠️  Sin mapeo REST para "${panelStatus}"`);
            unchanged++;
          }
        } else {
          console.log('    ✓ Panel ya sincronizado — sin cambios');
          unchanged++;
        }
      } else {
        // Dry-run: mostrar qué haría
        console.log(`    🔵 [DRY-RUN] metafield → ${JSON.stringify(newData)}`);
        if (shouldCreateEvent && panelStatus !== null) {
          const restStatus = TO_REST_STATUS[panelStatus] ?? '?';
          const reason = statusChanged ? 'cambio de estado' : 'forzado R3 (panel desincronizado)';
          console.log(`    🔵 [DRY-RUN] REST /events → { status: "${restStatus}" }  motivo: ${reason}`);
          if (isFailed) console.log(`    🔵 [DRY-RUN] R2 — entrega fallida registrada`);
          updated++;
        } else {
          console.log('    🔵 [DRY-RUN] Panel sincronizado — sin acción');
          unchanged++;
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`    ❌ Error inesperado: ${msg}`);
      errored++;
    }

    console.log('');
    await sleep(DELAY_MS);
  }

  console.log('═'.repeat(60));
  console.log(`  ✅ Panel actualizado:    ${updated}`);
  console.log(`  ✓  Sin cambio/ya sync:  ${unchanged}`);
  console.log(`  ❌ Errores:              ${errored}`);
  console.log(`${'═'.repeat(60)}\n`);
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err);
  process.exit(1);
});
