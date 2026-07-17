/// <reference types="node" />
/**
 * sync-tracking.cts  (.cts = CommonJS TypeScript)
 * La extensión .cts fuerza CJS independientemente del "type":"module" del package.json.
 *
 * Ejecución local:  npm run sync-tracking:dry
 * Ejecución CI:     ver .github/workflows/sync-tracking.yml
 */

// ── Configuración ─────────────────────────────────────────────────────────────

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? process.env.PUBLIC_STORE_DOMAIN ?? '';
const SHOPIFY_TOKEN  = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ?? '';
const DHL_API_KEY    = process.env.DHL_PARCEL_ES_API_KEY ?? '';
const API_VERSION    = process.env.SHOPIFY_API_VERSION ?? '2026-01';
const DRY_RUN        = process.argv.includes('--dry-run');

const MF_NAMESPACE = 'custom';
const MF_KEY       = 'tracking_data';
const DAYS_WINDOW  = 15;
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
  fulfillments: Array<{
    id: string;
    status: string;
    trackingInfo: Array<{ company: string | null; number: string | null }>;
  }>;
  metafield: { id: string; value: string } | null;
}

// ── Mapeo de estados ──────────────────────────────────────────────────────────

const TERMINAL_STATUSES = new Set<TrackingStatus>(['delivered', 'exception', 'failed']);

// Nuestro estado → valor para la REST API de Shopify (minúsculas con guiones bajos)
const TO_REST_STATUS: Partial<Record<TrackingStatus, string>> = {
  pre_transit:       'confirmed',
  in_transit:        'in_transit',
  out_for_delivery:  'out_for_delivery',
  delivered:         'delivered',
  failed:            'attempted_delivery',
  exception:         'failure',
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

  if (json.errors?.length) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

// ── Shopify REST: crear FulfillmentEvent ──────────────────────────────────────
// Usamos REST porque es más simple y fiable que la mutación GraphQL para este caso.
// El estado visual "Estado de la entrega" en el admin de Shopify se actualiza
// inmediatamente con este endpoint.

async function createFulfillmentEvent(
  orderGid: string,
  fulfillmentGid: string,
  restStatus: string,
): Promise<boolean> {
  // Extraer IDs numéricos del formato GID: gid://shopify/Order/1234567890
  const orderId       = orderGid.split('/').pop();
  const fulfillmentId = fulfillmentGid.split('/').pop();

  if (!orderId || !fulfillmentId) {
    console.error(`    ❌ No se pudo extraer ID numérico de GID. Order: ${orderGid}, Fulfillment: ${fulfillmentGid}`);
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

// ── Queries GraphQL ───────────────────────────────────────────────────────────
// IMPORTANTE: Order.fulfillments y Fulfillment.trackingInfo son listas planas
// en el Admin API (no conexiones paginadas), por lo que NO se usa "first:" aquí.

const ORDERS_QUERY = `
  query OrdersForTracking($query: String!) {
    orders(first: 100, query: $query, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        name
        fulfillments {
          id
          status
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
  if (c === 'delivered')            return 'delivered';
  if (c === 'failure')              return 'failed';
  if (c === 'exception')            return 'exception';
  if (c === 'pre-transit' || c === 'pre_transit') return 'pre_transit';
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
    console.log(`    [DHL] HTTP ${res.status} para tracking ${trackingNumber}`);

    if (!res.ok) {
      console.warn(`    [DHL] Respuesta de error: ${text.slice(0, 200)}`);
      return 'unknown';
    }

    const data = JSON.parse(text) as {
      shipments?: Array<{
        status: { statusCode?: string; status?: string; description?: string };
        events?: Array<{ status?: string; statusCode?: string; description?: string }>;
      }>;
    };

    const s = data.shipments?.[0]?.status;
    console.log(`    [DHL] Raw status object: ${JSON.stringify(s)}`);

    if (!s) {
      console.warn('    [DHL] Sin campo "status" en la respuesta');
      return 'unknown';
    }

    const mapped = mapDhlStatus(s.statusCode ?? s.status, s.description ?? '');
    console.log(`    [DHL] Código "${s.statusCode ?? s.status}" → estado mapeado: ${mapped}`);
    return mapped;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`    [DHL] Error de red: ${msg}`);
    return 'unknown';
  } finally {
    clearTimeout(timer);
  }
}

// ── Consultar carrier ─────────────────────────────────────────────────────────

async function queryCarrier(carrier: string, trackingNumber: string): Promise<TrackingStatus> {
  const c = carrier.toLowerCase();

  if (c.includes('dhl')) {
    if (!DHL_API_KEY) {
      console.warn('    ⚠️  DHL_PARCEL_ES_API_KEY no configurada');
      return 'unknown';
    }
    return fetchDHL(trackingNumber);
  }

  console.warn(`    ⚠️  Carrier "${carrier}" no integrado todavía`);
  return 'unknown';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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
  if (!DHL_API_KEY) {
    console.warn('⚠️  DHL_PARCEL_ES_API_KEY no configurada — los pedidos DHL se saltarán\n');
  }

  const since = pastISODate(DAYS_WINDOW);
  console.log(`📅 Ventana: últimos ${DAYS_WINDOW} días (desde ${since})\n`);

  const { orders } = await shopifyGQL<{ orders: { nodes: ShopifyOrder[] } }>(
    ORDERS_QUERY,
    { query: `created_at:>${since}` },
  );

  const allOrders = orders.nodes;
  console.log(`📦 Pedidos encontrados en ventana: ${allOrders.length}`);

  const toProcess = allOrders
    .filter(order => {
      const fulfillment = order.fulfillments[0];
      if (!fulfillment) return false;

      if (order.metafield?.value) {
        try {
          const mf = JSON.parse(order.metafield.value) as Partial<TrackingData>;
          if (mf.status && TERMINAL_STATUSES.has(mf.status)) return false;
          if (mf.trackingNumber) return true;
        } catch { /* JSON malformado: procesar igualmente */ }
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
    const prevStatus     = stored.status          ?? 'unknown';

    console.log(`─── ${order.name}`);
    console.log(`    Order GID:       ${order.id}`);
    console.log(`    Fulfillment GID: ${fulfillment.id}`);
    console.log(`    Carrier:         ${carrier}`);
    console.log(`    Tracking:        ${trackingNumber}`);
    console.log(`    Estado previo:   ${prevStatus}`);

    if (!trackingNumber) {
      console.log('    ⏭  Sin número de tracking — omitido\n');
      unchanged++;
      continue;
    }

    try {
      const newStatus = await queryCarrier(carrier, trackingNumber);

      // Crear evento si: el estado es real Y (ha cambiado O era desconocido antes)
      const shouldCreateEvent = newStatus !== 'unknown' && newStatus !== prevStatus;

      console.log(`    Estado nuevo:    ${newStatus}${shouldCreateEvent ? ' ← CAMBIÓ' : ''}`);

      const newData: TrackingData = {
        carrier,
        trackingNumber,
        status: newStatus !== 'unknown' ? newStatus : prevStatus,
        lastChecked: new Date().toISOString(),
      };

      if (!DRY_RUN) {
        // ① Actualizar metafield JSON
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
        console.log('    ✓ Metafield actualizado');

        // ② Crear FulfillmentEvent vía REST si el estado cambió
        if (shouldCreateEvent) {
          const restStatus = TO_REST_STATUS[newStatus];
          if (restStatus) {
            const ok = await createFulfillmentEvent(order.id, fulfillment.id, restStatus);
            if (ok) {
              updated++;
            } else {
              // El metafield se actualizó pero el evento falló; contar como error parcial
              errored++;
            }
          } else {
            console.warn(`    ⚠️  Sin mapeo REST para estado "${newStatus}"`);
            unchanged++;
          }
        } else {
          console.log('    ✓ Sin cambio de estado (lastChecked actualizado)');
          unchanged++;
        }
      } else {
        // Dry-run
        console.log(`    🔵 [DRY-RUN] metafield → ${JSON.stringify(newData)}`);
        if (shouldCreateEvent) {
          const restStatus = TO_REST_STATUS[newStatus] ?? '?';
          console.log(`    🔵 [DRY-RUN] REST POST /fulfillments/${fulfillment.id.split('/').pop()}/events → { status: "${restStatus}" }`);
          updated++;
        } else {
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
  console.log(`  ✅ Estado actualizado en panel: ${updated}`);
  console.log(`  ✓  Sin cambio de estado:       ${unchanged}`);
  console.log(`  ❌ Errores:                     ${errored}`);
  console.log(`${'═'.repeat(60)}\n`);
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err);
  process.exit(1);
});
