/**
 * sync-tracking.cts  (.cts = CommonJS TypeScript)
 * La extensión .cts fuerza CJS independientemente del "type":"module" del package.json,
 * lo que permite que tsx lo ejecute sin conflictos de ESM.
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

const TO_SHOPIFY_EVENT: Partial<Record<TrackingStatus, string>> = {
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
    throw new Error(`Shopify HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown[] };

  if (json.errors?.length) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

// ── Queries y mutaciones ──────────────────────────────────────────────────────

const ORDERS_QUERY = `
  query OrdersForTracking($query: String!) {
    orders(first: 100, query: $query, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        name
        fulfillments(first: 1) {
          id
          status
          trackingInfo(first: 1) {
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

const FULFILLMENT_EVENT_CREATE = `
  mutation FulfillmentEventCreate($fulfillmentEvent: FulfillmentEventInput!) {
    fulfillmentEventCreate(fulfillmentEvent: $fulfillmentEvent) {
      fulfillmentEvent { id status }
      userErrors { field message }
    }
  }
`;

// ── DHL Unified Tracking API ──────────────────────────────────────────────────

function mapDhlStatus(code: string | undefined, desc = ''): TrackingStatus {
  if (!code) return 'unknown';
  const c = code.toLowerCase();
  const d = desc.toLowerCase();
  if (c === 'delivered')   return 'delivered';
  if (c === 'failure')     return 'failed';
  if (c === 'pre-transit') return 'pre_transit';
  if (c === 'transit') {
    const outKW = ['reparto', 'out for delivery', 'en camino'];
    return outKW.some(k => d.includes(k)) ? 'out_for_delivery' : 'in_transit';
  }
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
    console.log(`    [DHL] HTTP ${res.status}`);

    if (!res.ok) return 'unknown';

    const data = JSON.parse(text) as {
      shipments?: Array<{
        status: { statusCode?: string; status?: string; description?: string };
      }>;
    };

    const s = data.shipments?.[0]?.status;
    if (!s) return 'unknown';

    return mapDhlStatus(s.statusCode ?? s.status, s.description ?? '');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`    [DHL] Error: ${msg}`);
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

  console.warn(`    ⚠️  Carrier "${carrier}" no integrado`);
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
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  sync-tracking  ${new Date().toISOString()}`);
  if (DRY_RUN) console.log('  ⚠️  DRY-RUN: no se escribirá nada en Shopify');
  console.log(`${'═'.repeat(50)}\n`);

  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error('Faltan SHOPIFY_STORE_DOMAIN o SHOPIFY_ADMIN_API_ACCESS_TOKEN');
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
        } catch { /* JSON malformado */ }
      }

      return !!fulfillment.trackingInfo[0]?.number;
    })
    .slice(0, MAX_ORDERS);

  console.log(`🔍 A procesar: ${toProcess.length} pedidos\n`);

  let updated = 0;
  let unchanged = 0;
  let errored  = 0;

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
    console.log(`    Carrier: ${carrier}  |  Tracking: ${trackingNumber}  |  Estado previo: ${prevStatus}`);

    if (!trackingNumber) {
      console.log('    ⏭  Sin número de tracking — omitido\n');
      unchanged++;
      continue;
    }

    try {
      const newStatus = await queryCarrier(carrier, trackingNumber);
      console.log(`    → Estado nuevo: ${newStatus}`);

      const statusChanged = newStatus !== 'unknown' && newStatus !== prevStatus;

      const newData: TrackingData = {
        carrier,
        trackingNumber,
        status: statusChanged ? newStatus : prevStatus,
        lastChecked: new Date().toISOString(),
      };

      if (!DRY_RUN) {
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
          console.error('    ❌ Error metafield:', mfRes.metafieldsSet.userErrors);
          errored++;
          continue;
        }

        if (statusChanged) {
          const eventStatus = TO_SHOPIFY_EVENT[newStatus];
          if (eventStatus) {
            const evRes = await shopifyGQL<{
              fulfillmentEventCreate: { userErrors: { field: string; message: string }[] };
            }>(FULFILLMENT_EVENT_CREATE, {
              fulfillmentEvent: {
                fulfillmentId: fulfillment.id,
                status: eventStatus,
                message: 'Actualizado automáticamente por sync-tracking',
              },
            });

            if (evRes.fulfillmentEventCreate.userErrors.length) {
              console.error('    ❌ Error FulfillmentEvent:', evRes.fulfillmentEventCreate.userErrors);
            } else {
              console.log(`    ✅ Panel Shopify actualizado → ${eventStatus}`);
            }
          }
          updated++;
        } else {
          console.log('    ✓ Sin cambio de estado (lastChecked actualizado)');
          unchanged++;
        }
      } else {
        console.log(`    🔵 [DRY-RUN] metafield → ${JSON.stringify(newData)}`);
        if (statusChanged && TO_SHOPIFY_EVENT[newStatus]) {
          console.log(`    🔵 [DRY-RUN] FulfillmentEvent → ${TO_SHOPIFY_EVENT[newStatus]}`);
          updated++;
        } else {
          unchanged++;
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`    ❌ Error: ${msg}`);
      errored++;
    }

    console.log('');
    await sleep(DELAY_MS);
  }

  console.log('═'.repeat(50));
  console.log(`  ✅ Actualizados:    ${updated}`);
  console.log(`  ✓  Sin cambios:    ${unchanged}`);
  console.log(`  ❌ Errores:         ${errored}`);
  console.log(`${'═'.repeat(50)}\n`);
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err);
  process.exit(1);
});
