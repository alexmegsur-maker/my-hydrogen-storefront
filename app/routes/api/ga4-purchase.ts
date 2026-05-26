// app/routes/api/ga4-purchase.ts
//
// Webhook de Shopify: orders/paid
// Cuando Shopify confirma un pago, llama a este endpoint con los datos del pedido.
// Aquí mandamos el evento "purchase" a GA4 via Measurement Protocol (server-side).
// Así el sandbox del pixel nunca es un problema.

import { type ActionFunctionArgs } from "@shopify/remix-oxygen";

// ─── Constantes ──────────────────────────────────────────────────────────────
const GA4_MEASUREMENT_ID = "G-K4JK3MMR6W";
const GA4_API_SECRET = "ScR1NxE_Q1KvYSfAlXhX3Q";
const SHOPIFY_WEBHOOK_SECRET = "9b68368bae5a0f35beab461ceada5e619962fb9b01359b46ea49490480f98caf";
// ─── Tipos mínimos del payload de Shopify orders/paid ────────────────────────

interface ShopifyLineItem {
  id: number;
  title: string;
  quantity: number;
  price: string;
  sku: string | null;
  variant_id: number | null;
  product_id: number | null;
}

interface ShopifyOrder {
  id: number;
  name: string; // ej: "#1234"
  order_number: number;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  total_shipping_price_set?: {
    shop_money: { amount: string; currency_code: string };
  };
  currency: string;
  customer?: {
    id: number;
    email: string;
  };
  line_items: ShopifyLineItem[];
}

// ─── Verificación HMAC del webhook ───────────────────────────────────────────
// Shopify firma cada webhook con HMAC-SHA256 usando tu webhook secret.
// Si la firma no coincide, rechazamos la petición.

async function verifyShopifyWebhook(
  request: Request,
  rawBody: string
): Promise<boolean> {
  // const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.warn("[ga4-purchase] SHOPIFY_WEBHOOK_SECRET no configurado — omitiendo verificación");
    return true;
  }

  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  if (!hmacHeader) return false;

  // Web Crypto API — compatible con Cloudflare Workers y Oxygen
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SHOPIFY_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(rawBody)
  );

  // Convertir a base64
  const computedHmac = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  );

  // Comparación segura carácter a carácter
  if (computedHmac.length !== hmacHeader.length) return false;
  let mismatch = 0;
  for (let i = 0; i < computedHmac.length; i++) {
    mismatch |= computedHmac.charCodeAt(i) ^ hmacHeader.charCodeAt(i);
  }
  return mismatch === 0;
}

// ─── Envío a GA4 via Measurement Protocol ────────────────────────────────────

async function sendPurchaseToGA4(order: ShopifyOrder): Promise<void> {
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

  // client_id requerido por GA4 — usamos el customer id de Shopify o el order id como fallback
  const clientId = order.customer?.id
    ? `shopify_customer_${order.customer.id}`
    : `shopify_order_${order.id}`;

  const shippingAmount =
    order.total_shipping_price_set?.shop_money?.amount ?? "0";

  const payload = {
    client_id: clientId,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: order.name,           // "#1234"
          value: parseFloat(order.total_price),
          currency: order.currency,
          tax: parseFloat(order.total_tax),
          shipping: parseFloat(shippingAmount),
          items: order.line_items.map((item) => ({
            item_id: item.product_id?.toString() ?? item.variant_id?.toString() ?? String(item.id),
            item_name: item.title,
            price: parseFloat(item.price),
            quantity: item.quantity,
            item_variant: item.variant_id?.toString(),
          })),
        },
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GA4 Measurement Protocol error ${response.status}: ${text}`);
  }

  console.log(`[ga4-purchase] ✅ Evento purchase enviado a GA4 — pedido ${order.name} (${order.total_price} ${order.currency})`);
}

// ─── Action (POST) ────────────────────────────────────────────────────────────
// Shopify solo hace POST a webhooks, nunca GET.
// Si alguien hace GET a esta ruta (ej: en desarrollo) devolvemos 405.

export async function action({ request }: ActionFunctionArgs) {
  console.log("[ga4-purchase] ENV CHECK:", {
    hasWebhookSecret: !!process.env.SHOPIFY_WEBHOOK_SECRET,
    hasGA4Secret: !!process.env.GA4_MEASUREMENT_PROTOCOL_SECRET,
    keys: Object.keys(process.env).filter(k => k.includes('SHOPIFY') || k.includes('GA4')),
  });
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Leemos el body como texto para poder verificar la firma Y parsear el JSON
  const rawBody = await request.text();

  // 1. Verificar que el webhook viene de Shopify
  const isValid = await verifyShopifyWebhook(request, rawBody);
  if (!isValid) {
    console.error("[ga4-purchase] ❌ Firma HMAC inválida — webhook rechazado");
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Parsear el pedido 
  let order: ShopifyOrder;
  try {
    order = JSON.parse(rawBody) as ShopifyOrder;
  } catch {
    return new Response("Bad Request: invalid JSON", { status: 400 });
  }

  // 3. Mandar el evento a GA4
  try {
    await sendPurchaseToGA4(order);
  } catch (err) {
    console.error("[ga4-purchase] Error enviando a GA4:", err);
    // Devolvemos 200 igualmente para que Shopify no reintente el webhook
    return new Response("GA4 error logged", { status: 200 });
  }

  return new Response("OK", { status: 200 });
}

// GET no aplica para webhooks
export async function loader() {
  return new Response("Not Found", { status: 404 });
}