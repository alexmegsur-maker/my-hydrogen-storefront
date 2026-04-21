import {
  flattenConnection,
  getPaginationVariables,
  Pagination,
} from "@shopify/hydrogen";
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from "customer-account-api.generated";
import type * as React from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, type MetaFunction, useLoaderData } from "react-router";
import { ORDER_STATUS } from "~/routes/account/dashboard/orders-history";

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    totalPrice { amount currencyCode }
    financialStatus
    fulfillmentStatus
    fulfillments(first: 1) { nodes { status } }
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
        Historial de Despliegues
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
            to="/collections"
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

function OrderItem({ order }: { order: OrderItemFragment }) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  const orderId = order.id.split("/").pop();

  const statusColors: Record<string, React.CSSProperties> = {
    SUCCESS: { borderColor: "#A1A1AA", color: "#A1A1AA" },
    CANCELLED: { borderColor: "#A1A1AA", color: "#A1A1AA" },
    OPEN: {
      borderColor: "#FFFFFF",
      color: "#FFFFFF",
      background: "rgba(255,255,255,0.05)",
      boxShadow: "0 0 10px rgba(255,255,255,0.2)",
    },
    PENDING: {
      borderColor: "#FFFFFF",
      color: "#FFFFFF",
      background: "rgba(255,255,255,0.05)",
    },
  };

  const badgeStyle = fulfillmentStatus
    ? (statusColors[fulfillmentStatus] ?? statusColors.OPEN)
    : statusColors.OPEN;

  return (
    <tr style={{ transition: "background 0.3s" }}>
      <td
        style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          color: "#FFFFFF",
          fontSize: "0.9rem",
        }}
      >
        #{order.number}
      </td>
      <td
        style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          fontSize: "0.9rem",
          color: "#A1A1AA",
        }}
      >
        {new Date(order.processedAt).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </td>
      <td
        style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {fulfillmentStatus && (
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
            {ORDER_STATUS[fulfillmentStatus] ?? fulfillmentStatus}
          </span>
        )}
      </td>
      <td
        style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          fontSize: "0.9rem",
          color: "#A1A1AA",
        }}
      >
        {order.totalPrice.amount} {order.totalPrice.currencyCode}
      </td>
      <td
        style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
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
          Ver Manifiesto
        </Link>
      </td>
    </tr>
  );
}
