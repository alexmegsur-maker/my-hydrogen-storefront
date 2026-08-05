// GET /api/tracking?order=1001&email=cliente@email.com[&lang=es]
// GET /api/tracking?trackingNumber=1805152510[&lang=es]
// Busca el pedido vía Admin API, extrae trackingInfo del primer fulfillment
// y llama al resolver para devolver NormalizedTracking al cliente.

import type { LoaderFunctionArgs } from "react-router";
import {
  CARRIER_LABELS,
  detectCarrierByTrackingNumber,
  resolveTracking,
} from "~/lib/tracking/resolver.server";

const ORDER_TRACKING_QUERY = `
  query OrderTracking($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          name
          fulfillments(first: 1) {
            id
            trackingInfo(first: 1) {
              company
              number
              url
            }
          }
        }
      }
    }
  }
`;

const FULFILLMENT_TRACKING_UPDATE_MUTATION = `
  mutation UpdateFulfillmentTracking($fulfillmentId: ID!, $trackingInfoInput: FulfillmentTrackingInput!) {
    fulfillmentTrackingInfoUpdate(
      fulfillmentId: $fulfillmentId
      trackingInfoInput: $trackingInfoInput
      notifyCustomer: false
    ) {
      fulfillment { id }
      userErrors { field message }
    }
  }
`;

function getLang(request: Request, url: URL): string {
  // 1. Parámetro explícito enviado por el cliente
  const param = url.searchParams.get("lang")?.toLowerCase();
  if (param && /^(es|en|de|fr|it)$/.test(param)) return param;
  // 2. Referer header: el cliente llama desde /en/seguimiento → detectamos el locale
  const referer = request.headers.get("referer") ?? "";
  const match   = referer.match(/\/(en|fr|es|de|it)(\/|$)/i);
  if (match) return match[1].toLowerCase();
  return "es";
}

// Best-effort: corrige el trackingCompany guardado en el propio pedido
// cuando el prefijo del número de seguimiento (fuente fiable) no coincide
// con lo que Shopify tiene guardado (autodetección incorrecta al crear el
// fulfillment sin elegir transportista explícitamente). No bloquea la
// respuesta al cliente si falla.
async function fixFulfillmentCarrierIfNeeded(
  adminUrl: string,
  adminToken: string,
  fulfillment: { id?: string; trackingInfo?: { company?: string; number?: string; url?: string }[] } | undefined,
): Promise<string | undefined> {
  const trackingInfo = fulfillment?.trackingInfo?.[0];
  if (!fulfillment?.id || !trackingInfo?.number) return trackingInfo?.company;

  const detected = detectCarrierByTrackingNumber(trackingInfo.number);
  if (!detected) return trackingInfo.company;

  const correctLabel = CARRIER_LABELS[detected];
  if (trackingInfo.company?.trim().toLowerCase() === correctLabel.toLowerCase()) {
    return trackingInfo.company;
  }

  try {
    const res = await fetch(adminUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: FULFILLMENT_TRACKING_UPDATE_MUTATION,
        variables: {
          fulfillmentId: fulfillment.id,
          trackingInfoInput: {
            number: trackingInfo.number,
            url: trackingInfo.url,
            company: correctLabel,
          },
        },
      }),
    });

    const json = (await res.json()) as any;
    const userErrors = json?.data?.fulfillmentTrackingInfoUpdate?.userErrors;

    if (userErrors?.length) {
      console.error("[api/tracking] Error corrigiendo carrier del pedido:", userErrors);
      return trackingInfo.company;
    }

    console.log(
      `[api/tracking] Carrier corregido en el pedido: "${trackingInfo.company}" -> "${correctLabel}"`,
    );
    return correctLabel;
  } catch (e) {
    console.error("[api/tracking] Excepción corrigiendo carrier del pedido:", e);
    return trackingInfo.company;
  }
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url          = new URL(request.url);
  const orderNumber  = url.searchParams.get("order")?.trim();
  const email        = url.searchParams.get("email")?.trim();
  const trackingNum  = url.searchParams.get("trackingNumber")?.trim();
  const language     = getLang(request, url);

  // ── Modo 2: número de seguimiento directo → resolver sin buscar el pedido
  // (no tenemos el pedido a mano aquí, así que no podemos corregirlo en
  // Shopify — pero resolveTracking igual detecta el carrier correcto por
  // el prefijo del número, sin depender de un company adivinado a ciegas)
  if (trackingNum) {
    const tracking = await resolveTracking({
      trackingNumber: trackingNum,
      language,
      env: context.env as Record<string, string | undefined>,
    });
    return Response.json(tracking);
  }

  if (!orderNumber || !email) {
    return Response.json(
      { error: "Introduce tu número de pedido y correo electrónico." },
      { status: 400 },
    );
  }

  const shop       = context.env.PUBLIC_STORE_DOMAIN;
  const adminToken = context.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  const apiVersion = context.env.SHOPIFY_API_VERSION ?? "2026-01";

  if (!shop || !adminToken) {
    return Response.json(
      { error: "Configuración del servidor incompleta." },
      { status: 500 },
    );
  }

  const adminUrl = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

  try {
    const res = await fetch(adminUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: ORDER_TRACKING_QUERY,
        variables: { query: `name:#${orderNumber} email:${email}` },
      }),
    });

    if (!res.ok) {
      return Response.json({ error: "Error consultando el pedido." }, { status: 500 });
    }

    const { data, errors } = (await res.json()) as any;

    if (errors?.length) {
      return Response.json({ error: "Error consultando el pedido." }, { status: 500 });
    }

    const order = data?.orders?.edges?.[0]?.node ?? null;

    if (!order) {
      return Response.json(
        { error: "No se encontró ningún pedido con esos datos." },
        { status: 404 },
      );
    }

    const fulfillment  = order.fulfillments?.[0];
    const trackingInfo = fulfillment?.trackingInfo?.[0];

    console.log('[api/tracking] fulfillment:', JSON.stringify(fulfillment));
    console.log('[api/tracking] trackingInfo:', JSON.stringify(trackingInfo));

    if (!trackingInfo?.number) {
      return Response.json(
        { error: `El pedido ${order.name} aún no tiene número de seguimiento.` },
        { status: 200 },
      );
    }

    // Corrige (si hace falta) el trackingCompany guardado en el pedido antes
    // de resolver el tracking, para que ambos queden en sincronía.
    const correctedCompany = await fixFulfillmentCarrierIfNeeded(
      adminUrl,
      adminToken,
      fulfillment,
    );

    const tracking = await resolveTracking({
      trackingNumber: trackingInfo.number,
      company: correctedCompany,
      language,
      env: context.env as Record<string, string | undefined>,
    });

    return Response.json(tracking);
  } catch (e) {
    console.error("[api/tracking] Error:", e);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
};
