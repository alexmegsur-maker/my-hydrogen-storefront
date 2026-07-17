// GET /api/tracking?order=1001&email=cliente@email.com[&lang=es]
// GET /api/tracking?trackingNumber=1805152510[&lang=es]
// Busca el pedido vía Admin API, extrae trackingInfo del primer fulfillment
// y llama al resolver para devolver NormalizedTracking al cliente.

import type { LoaderFunctionArgs } from "react-router";
import { resolveTracking } from "~/lib/tracking/resolver.server";

const ORDER_TRACKING_QUERY = `
  query OrderTracking($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          name
          fulfillments(first: 1) {
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

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url          = new URL(request.url);
  const orderNumber  = url.searchParams.get("order")?.trim();
  const email        = url.searchParams.get("email")?.trim();
  const trackingNum  = url.searchParams.get("trackingNumber")?.trim();
  const language     = getLang(request, url);

  // ── Modo 2: número de seguimiento directo → resolver sin buscar el pedido
  if (trackingNum) {
    const tracking = await resolveTracking({
      trackingNumber: trackingNum,
      company: "DHL Express",
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

  try {
    const res = await fetch(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({
          query: ORDER_TRACKING_QUERY,
          variables: { query: `name:#${orderNumber} email:${email}` },
        }),
      },
    );

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

    const tracking = await resolveTracking({
      trackingNumber: trackingInfo.number,
      company: trackingInfo.company,
      language,
      env: context.env as Record<string, string | undefined>,
    });

    return Response.json(tracking);
  } catch (e) {
    console.error("[api/tracking] Error:", e);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
};
