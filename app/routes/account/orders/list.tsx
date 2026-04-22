import {
  flattenConnection,
  getPaginationVariables,
  Pagination,
} from "@shopify/hydrogen";
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from "customer-account-api.generated";
import * as React from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, type MetaFunction, useLoaderData } from "react-router";
import { ORDER_STATUS, resolveOrderStatus } from "~/routes/account/dashboard/orders-history";

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    totalPrice { amount currencyCode }
    financialStatus
    fulfillmentStatus
    fulfillments(first: 1) { 
      nodes { 
        status
      } 
    }
    id
    number
    processedAt
  }
` as const;

const CUSTOMER_ORDERS_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    orders(
      sortKey: PROCESSED_AT, reverse: true,
      first: $first, last: $last,
      before: $startCursor, after: $endCursor
    ) {
      nodes { ...OrderItem }
      pageInfo { hasPreviousPage hasNextPage endCursor startCursor }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;

const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_ORDERS_FRAGMENT}
  query CustomerOrders(
    $endCursor: String $first: Int $last: Int $startCursor: String
  ) {
    customer { ...CustomerOrders }
  }
` as const;

export const meta: MetaFunction = () => [{ title: "Despliegues | Phoenix" }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, { pageBy: 20 });
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    { variables: { ...paginationVariables } },
  );
  if (errors?.length || !data?.customer) {
    throw new Error("Customer orders not found");
  }
  return { customer: data.customer };
}

export default function Orders() {
  const { customer } = useLoaderData<{ customer: CustomerOrdersFragment }>();
  const { orders } = customer;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 300,
          textTransform: "uppercase",
          letterSpacing: "2px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "1rem",
          color: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Historial de Pedidos
        <span style={{ fontSize: "0.9rem", color: "#A1A1AA", fontWeight: 400 }}>
          {orders.nodes.length} registros
        </span>
      </div>

      {orders.nodes.length ? (
        <PaginatedOrders connection={orders}>
          {({ node: order }) => <OrderItem key={order.id} order={order} />}
        </PaginatedOrders>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p style={{ color: "#52525B", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            No hay despliegues registrados.
          </p>
          <Link
            to="/"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.8rem",
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "2px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "0.8rem 1.5rem",
            }}
          >
            Explorar Arsenal →
          </Link>
        </div>
      )}
    </div>
  );
}

function PaginatedOrders<NodesType>({
  connection,
  children,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>["connection"];
  children: (props: { node: NodesType; index: number }) => React.ReactNode;
}) {
  return (
    <Pagination connection={connection}>
      {({ nodes, isLoading, PreviousLink, NextLink }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <PreviousLink
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.75rem",
              color: "#A1A1AA",
              textTransform: "uppercase",
              letterSpacing: "1px",
              textDecoration: "none",
              alignSelf: "flex-start",
            }}
          >
            {isLoading ? "Cargando..." : "↑ Anteriores"}
          </PreviousLink>

          <div
            style={{
              background: "rgba(10,10,10,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  {["Identificador", "Fecha", "Estado", "Importe", "Acción"].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "0.75rem",
                        color: "#52525B",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        padding: "1.25rem 1rem",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        fontWeight: 400,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{nodes.map((node, index) => children({ node, index }))}</tbody>
            </table>
          </div>

          <NextLink
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.75rem",
              color: "#A1A1AA",
              textTransform: "uppercase",
              letterSpacing: "1px",
              textDecoration: "none",
              alignSelf: "flex-start",
            }}
          >
            {isLoading ? "Cargando..." : "Más registros ↓"}
          </NextLink>
        </div>
      )}
    </Pagination>
  );
}


const ACTIVE: React.CSSProperties = {
  borderColor: "#FFFFFF",
  color: "#FFFFFF",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 0 10px rgba(255,255,255,0.2)",
};
 
const BADGE_STYLES: Record<string, React.CSSProperties> = {
  UNFULFILLED:         ACTIVE,
  PARTIALLY_FULFILLED: ACTIVE,
  IN_PROGRESS:         ACTIVE,
  ON_HOLD:             ACTIVE,
  SCHEDULED:           ACTIVE,
  OPEN:                ACTIVE,
  PENDING:             ACTIVE,
  AUTHORIZED:          ACTIVE,
  FULFILLED:           { borderColor: "#A1A1AA", color: "#A1A1AA" },
  SUCCESS:             { borderColor: "#A1A1AA", color: "#A1A1AA" },
  PAID:                { borderColor: "#A1A1AA", color: "#A1A1AA" },
  CANCELLED:           { borderColor: "rgba(255,68,68,0.6)", color: "rgba(255,68,68,0.9)" },
  VOIDED:              { borderColor: "rgba(255,68,68,0.6)", color: "rgba(255,68,68,0.9)" },
  FAILURE:             { borderColor: "#ff4444", color: "#ff4444" },
  ERROR:               { borderColor: "#ff4444", color: "#ff4444" },
  REFUNDED:            { borderColor: "#52525B", color: "#52525B" },
  PARTIALLY_REFUNDED:  { borderColor: "#52525B", color: "#52525B" },
};

function OrderItem({ order }: { order: OrderItemFragment }) {
  // resolveOrderStatus prioriza: VOIDED→CANCELLED, luego order.fulfillmentStatus,
  // luego fulfillments.nodes[0] (vacío en pedidos sin envío), luego financialStatus
  const effectiveStatus = resolveOrderStatus(order as any);
  const badgeStyle = BADGE_STYLES[effectiveStatus] ?? ACTIVE;
  const badgeLabel = ORDER_STATUS[effectiveStatus] ?? effectiveStatus;
  const orderId = order.id.split("/").pop();
 
  const TD: React.CSSProperties = {
    padding: "1.25rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "0.9rem",
    color: "#A1A1AA",
  };
 
  return (
    <tr
      onMouseEnter={(e) =>
        (e.currentTarget as HTMLTableRowElement)
          .querySelectorAll("td")
          .forEach((td) => ((td as HTMLElement).style.background = "rgba(255,255,255,0.02)"))
      }
      onMouseLeave={(e) =>
        (e.currentTarget as HTMLTableRowElement)
          .querySelectorAll("td")
          .forEach((td) => ((td as HTMLElement).style.background = "transparent"))
      }
    >
      <td style={{ ...TD, color: "#FFFFFF", fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
        #{order.number}
      </td>
      <td style={TD}>
        {new Date(order.processedAt).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </td>
      <td style={TD}>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "2px",
            fontSize: "0.7rem",
            fontFamily: "'Outfit', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px",
            border: "1px solid",
            ...badgeStyle,
          }}
        >
          {badgeLabel}
        </span>
      </td>
      <td style={TD}>
        {order.totalPrice.amount} {order.totalPrice.currencyCode}
      </td>
      <td style={TD}>
        <Link
          to={`/account/orders/${orderId}`}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.8rem",
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "1px",
            textDecoration: "none",
            borderBottom: "1px dashed rgba(255,255,255,0.2)",
            paddingBottom: "2px",
          }}
        >
          Ver Detalles
        </Link>
      </td>
    </tr>
  );
}