import { flattenConnection } from "@shopify/hydrogen";
import type { FulfillmentStatus } from "@shopify/hydrogen/customer-account-api-types";
import type { OrderFragment, OrderQuery } from "customer-account-api.generated";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Await, defer, redirect, useLoaderData } from "react-router";
import { Suspense, useEffect, useRef } from "react";
import { Link } from "~/components/link";
import { ORDER_STATUS } from "~/routes/account/dashboard/orders-history";
import { resolveTracking } from "~/lib/tracking/resolver.server";
import { OrderTracking, OrderTrackingLoading } from "~/components/OrderTracking";
import { OrderLineItem } from "./order-line-item";
import { CUSTOMER_ORDER_QUERY } from "./order-query";
import { OrderSummary } from "./order-summary";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `Orden ${data?.order?.name} | Phoenix` },
];

 
export async function loader({ request, context, params }: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect(params?.locale ? `${params.locale}/account` : "/account");
  }
  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get("key");
  try {
    const orderId = orderToken
      ? `gid://shopify/Order/${params.id}?key=${orderToken}`
      : `gid://shopify/Order/${params.id}`;
    const { data, errors } = await context.customerAccount.query<OrderQuery>(
      CUSTOMER_ORDER_QUERY,
      { variables: { orderId } },
    );
    if (errors?.length || !data?.order?.lineItems) throw new Error("Order not found");
    const order: OrderFragment = data.order;
    const cancelledAt = order.cancelledAt
    const lineItems = flattenConnection(order.lineItems);
    const discountApplications = flattenConnection(order.discountApplications);
    const firstDiscount = discountApplications[0]?.value;
    const discountValue = firstDiscount?.__typename === "MoneyV2" && firstDiscount;
    const discountPercentage =
      firstDiscount?.__typename === "PricingPercentageValue" && firstDiscount?.percentage;
    const fulfillments = flattenConnection(order.fulfillments);
    const fulfillmentStatus =
      fulfillments.length > 0 ? fulfillments[0].status : ("OPEN" as FulfillmentStatus);

    // La Customer Account API no expone trackingInfo en Fulfillment.
    // Obtenemos el tracking number via Admin API usando el order.name que sí tenemos.
    const trackingPromise = getTrackingViaAdminApi(
      order.name,
      context.env as Record<string, string | undefined>,
      resolveTracking,
      getLangFromRequest(request),
    );

    return defer({
      order,
      lineItems,
      discountValue,
      discountPercentage,
      fulfillmentStatus,
      cancelledAt,
      tracking: trackingPromise,
    });
  } catch (error) {
    throw new Response(error instanceof Error ? error.message : undefined, { status: 404 });
  }
}

// ─── Admin API helper ────────────────────────────────────────────────────────
// La Customer Account API no expone trackingInfo en Fulfillment,
// así que consultamos el Admin API con el order.name (ej: "#3247").

const ADMIN_TRACKING_QUERY = `
  query OrderTracking($query: String!) {
    orders(first: 1, query: $query) {
      edges { node {
        fulfillments(first: 1) {
          trackingInfo(first: 1) { company number url }
        }
      }}
    }
  }
`;

function getLangFromRequest(request: Request): string {
  const match = new URL(request.url).pathname.match(/^\/(en|fr|es|de|it)(\/|$)/i);
  return match ? match[1].toLowerCase() : "es";
}

async function getTrackingViaAdminApi(
  orderName: string,
  env: Record<string, string | undefined>,
  resolver: typeof resolveTracking,
  language: string,
) {
  const shop       = env.PUBLIC_STORE_DOMAIN;
  const adminToken = env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  const apiVersion = env.SHOPIFY_API_VERSION ?? "2026-01";

  if (!shop || !adminToken) return null;

  try {
    const res = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: ADMIN_TRACKING_QUERY,
        variables: { query: `name:${orderName}` },
      }),
    });

    if (!res.ok) return null;

    const { data } = (await res.json()) as any;
    const ti = data?.orders?.edges?.[0]?.node?.fulfillments?.[0]?.trackingInfo?.[0];

    console.log(`[order.tsx] trackingInfo for ${orderName}:`, JSON.stringify(ti));

    if (!ti?.number) return null;

    return resolver({
      trackingNumber: ti.number,
      company: ti.company,
      language,
      env,
    });
  } catch (e) {
    console.error("[order.tsx] getTrackingViaAdminApi error:", e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

const statusStyle: Record<string, React.CSSProperties> = {
  SUCCESS: { borderColor: "#A1A1AA", color: "#A1A1AA" },
  CANCELLED: { borderColor: "#A1A1AA", color: "#A1A1AA" },
  OPEN: { borderColor: "#FFFFFF", color: "#FFFFFF", background: "rgba(255,255,255,0.05)", boxShadow: "0 0 10px rgba(255,255,255,0.2)" },
  PENDING: { borderColor: "#FFFFFF", color: "#FFFFFF", background: "rgba(255,255,255,0.05)" },
};

export default function OrderDetails() {
  const { order, lineItems, fulfillmentStatus, cancelledAt, tracking } = useLoaderData<typeof loader>();
  
  const container = useRef(null)
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
   
    const sections = gsap.utils.toArray('.fade-up-trigger');
    sections.forEach((section:any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 90%", // Empieza cuando el tope de la sección está al 90% del viewport
          toggleActions: "play none none none", // Solo se reproduce una vez al entrar
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
    });


  }, { scope: container });
  return (
    <div ref={container} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Cabecera */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1.5rem" }}>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 300,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#FFFFFF",
            marginBottom: "1rem",
          }}
        >
          Detalles del Pedido
        </h1>
        <Link
          to="/account/orders"
          variant="underline"
          style={{ color: "#A1A1AA", fontSize: "0.85rem" }}
        >
          ← Volver a Historial
        </Link>
      </div>

      {/* Meta info */}
      <div 
        className="fade-up-trigger"
        style={{
          background: "rgba(10,10,10,0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          padding: "2rem",
          backdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#FFFFFF",
              marginBottom: "0.5rem",
            }}
          >
            {order.name}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#A1A1AA" }}>
            Procesado el {new Date(order.processedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        {fulfillmentStatus && !cancelledAt && (
          <span
            style={{
              alignSelf: "flex-start",
              padding: "6px 14px",
              borderRadius: "2px",
              fontSize: "0.75rem",
              fontFamily: "'Outfit', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              border: "1px solid",
              ...(statusStyle[fulfillmentStatus] ?? statusStyle.OPEN),
            }}
          >
            {ORDER_STATUS[fulfillmentStatus] ?? fulfillmentStatus}
          </span>
        )}
        {cancelledAt && (
          <span
            style={{
              alignSelf: "flex-start",
              padding: "6px 14px",
              borderRadius: "2px",
              fontSize: "0.75rem",
              fontFamily: "'Outfit', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              border: "1px solid",
              ...(statusStyle[fulfillmentStatus] ?? statusStyle.OPEN),
            }}
          >
            {ORDER_STATUS["CANCELLED"] }
          </span>
        )}
      </div>

      {/* Tracking */}
      <Suspense fallback={<OrderTrackingLoading />}>
        <Await resolve={tracking}>
          {(data) => <OrderTracking tracking={data} />}
        </Await>
      </Suspense>

      {/* Grid: line items + resumen + dirección */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
        }}
      >
        {/* Line items */}
        <div
          className="fade-up-trigger"
          style={{
            background: "rgba(10,10,10,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
            padding: "2rem",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.75rem",
              color: "#52525B",
              textTransform: "uppercase",
              letterSpacing: "3px",
            }}
          >
            Unidades desplegadas
          </div>
          {lineItems.map((lineItem) => (
            <OrderLineItem key={lineItem.id} lineItem={lineItem} />
          ))}
          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)" }} />
          <OrderSummary order={order} lineItems={lineItems} />
        </div>

        {/* Dirección de envío */}
        {order?.shippingAddress && (
          <div
            className="fade-up-trigger"
            style={{
              background: "rgba(10,10,10,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              padding: "2rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.75rem",
                color: "#52525B",
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: "1rem",
              }}
            >
              Coordenada de envío
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ color: "#FFFFFF", marginBottom: "0.4rem" }}>
                {order.shippingAddress.name}
              </li>
              {order.shippingAddress.formatted?.map((line: string) => (
                <li key={line} style={{ color: "#A1A1AA", fontSize: "0.9rem", lineHeight: 1.8 }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
