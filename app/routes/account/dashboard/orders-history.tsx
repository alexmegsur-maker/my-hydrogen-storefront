import { flattenConnection } from "@shopify/hydrogen";
import type { FulfillmentStatus } from "@shopify/hydrogen/customer-account-api-types";
import type { OrderCardFragment } from "customer-account-api.generated";
import { Link } from "react-router";

export const ORDER_STATUS: Record<FulfillmentStatus, string> = {
  SUCCESS: "Completado",
  PENDING: "Pendiente",
  OPEN: "Abierto",
  FAILURE: "Error",
  ERROR: "Error",
  CANCELLED: "Cancelado",
};

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  SUCCESS: { borderColor: "#A1A1AA", color: "#A1A1AA" },
  CANCELLED: { borderColor: "#A1A1AA", color: "#A1A1AA" },
  FAILURE: { borderColor: "#ff4444", color: "#ff4444" },
  ERROR: { borderColor: "#ff4444", color: "#ff4444" },
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
    boxShadow: "0 0 10px rgba(255,255,255,0.2)",
  },
};

type OrderCardsProps = { orders: OrderCardFragment[] };

export function OrdersHistory({ orders }: OrderCardsProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 300,
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#FFFFFF",
        }}
      >
        Archivos de Despliegue
        <span style={{ fontSize: "0.9rem", color: "#A1A1AA", fontWeight: 400 }}>
          {orders.length} {orders.length === 1 ? "Registro" : "Registros"}
        </span>
      </div>

      {orders.length ? (
        <Orders orders={orders} />
      ) : (
        <p style={{ color: "#52525B", fontSize: "0.9rem" }}>
          No hay despliegues registrados.
        </p>
      )}
    </div>
  );
}

function Orders({ orders }: OrderCardsProps) {
  return (
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
        <tbody>
          {orders.map((order) => {
            if (!order?.id) return null;
            const [legacyOrderId, key] =
              order.id.split("/").pop()!.split("?");
            const orderLink = key
              ? `/account/orders/${legacyOrderId}?${key}`
              : `/account/orders/${legacyOrderId}`;

            const fulfillmentStatus =
              flattenConnection(order.fulfillments)[0]?.status ?? "OPEN";

            const statusStyle =
              STATUS_STYLE[fulfillmentStatus] ?? STATUS_STYLE.OPEN;

            return (
              <tr
                key={order.id}
                style={{ transition: "background 0.3s" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement)
                    .querySelectorAll("td")
                    .forEach(
                      (td) =>
                        ((td as HTMLTableCellElement).style.background =
                          "rgba(255,255,255,0.02)"),
                    );
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement)
                    .querySelectorAll("td")
                    .forEach(
                      (td) =>
                        ((td as HTMLTableCellElement).style.background =
                          "transparent"),
                    );
                }}
              >
                <td
                  style={{
                    padding: "1.25rem 1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    fontSize: "0.9rem",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
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
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "2px",
                      fontSize: "0.7rem",
                      fontFamily: "'Outfit', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      border: "1px solid",
                      ...statusStyle,
                    }}
                  >
                    {ORDER_STATUS[fulfillmentStatus] ?? fulfillmentStatus}
                  </span>
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
                    to={orderLink}
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "0.8rem",
                      color: "#FFFFFF",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      textDecoration: "none",
                      borderBottom: "1px dashed rgba(255,255,255,0.2)",
                      paddingBottom: "2px",
                      transition: "border-color 0.3s",
                    }}
                  >
                    Ver Manifiesto
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
