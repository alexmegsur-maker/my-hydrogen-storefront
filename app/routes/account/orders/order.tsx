import { flattenConnection } from "@shopify/hydrogen";
import type { FulfillmentStatus } from "@shopify/hydrogen/customer-account-api-types";
import type { OrderFragment, OrderQuery } from "customer-account-api.generated";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { Link } from "~/components/link";
import { ORDER_STATUS } from "~/routes/account/dashboard/orders-history";
import { OrderLineItem } from "./order-line-item";
import { CUSTOMER_ORDER_QUERY } from "./order-query";
import { OrderSummary } from "./order-summary";

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
    const lineItems = flattenConnection(order.lineItems);
    const discountApplications = flattenConnection(order.discountApplications);
    const firstDiscount = discountApplications[0]?.value;
    const discountValue = firstDiscount?.__typename === "MoneyV2" && firstDiscount;
    const discountPercentage =
      firstDiscount?.__typename === "PricingPercentageValue" && firstDiscount?.percentage;
    const fulfillments = flattenConnection(order.fulfillments);
    const fulfillmentStatus =
      fulfillments.length > 0 ? fulfillments[0].status : ("OPEN" as FulfillmentStatus);
    return { order, lineItems, discountValue, discountPercentage, fulfillmentStatus };
  } catch (error) {
    throw new Response(error instanceof Error ? error.message : undefined, { status: 404 });
  }
}

const statusStyle: Record<string, React.CSSProperties> = {
  SUCCESS: { borderColor: "#A1A1AA", color: "#A1A1AA" },
  CANCELLED: { borderColor: "#A1A1AA", color: "#A1A1AA" },
  OPEN: { borderColor: "#FFFFFF", color: "#FFFFFF", background: "rgba(255,255,255,0.05)", boxShadow: "0 0 10px rgba(255,255,255,0.2)" },
  PENDING: { borderColor: "#FFFFFF", color: "#FFFFFF", background: "rgba(255,255,255,0.05)" },
};

export default function OrderDetails() {
  const { order, lineItems, fulfillmentStatus } = useLoaderData<typeof loader>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
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
          Manifiesto de Orden
        </h1>
        <Link
          to="/account/orders"
          variant="underline"
          style={{ color: "#A1A1AA", fontSize: "0.85rem" }}
        >
          ← Volver a Despliegues
        </Link>
      </div>

      {/* Meta info */}
      <div
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
        {fulfillmentStatus && (
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
      </div>

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
