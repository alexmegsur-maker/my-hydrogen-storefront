import { flattenConnection } from "@shopify/hydrogen";
import type { OrderCardFragment } from "customer-account-api.generated";
import { Link } from "react-router";

// ─── Mapa completo de estados ─────────────────────────────────────────────────
// Cubre tanto `fulfillmentStatus` a nivel de orden (Customer API)
// como `financialStatus` para detectar cancelaciones/reembolsos.
export const ORDER_STATUS: Record<string, string> = {
  // fulfillmentStatus (campo raíz de la orden en Customer API)
  UNFULFILLED:          "Preparando envío",
  PARTIALLY_FULFILLED:  "Envío parcial",
  FULFILLED:            "Enviado",
  IN_PROGRESS:          "En producción",
  ON_HOLD:              "En espera",
  SCHEDULED:            "Programado",
  // Estos vienen del nodo fulfillments[0].status (Legacy / Admin API)
  SUCCESS:              "Completado",
  OPEN:                 "En proceso",
  PENDING:              "Pendiente",
  FAILURE:              "Error",
  ERROR:                "Error",
  CANCELLED:            "Cancelado",
  // financialStatus (usado como fallback para cancelaciones)
  VOIDED:               "Cancelado",
  REFUNDED:             "Reembolsado",
  PARTIALLY_REFUNDED:   "Reembolso parcial",
  PAID:                 "Pagado",
  PARTIALLY_PAID:       "Pago parcial",
  AUTHORIZED:           "Autorizado",
};

// ─── Estilos por estado ───────────────────────────────────────────────────────
const ACTIVE: React.CSSProperties = {
  borderColor: "#FFFFFF",
  color: "#FFFFFF",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 0 10px rgba(255,255,255,0.2)",
};
const MUTED: React.CSSProperties = { borderColor: "#A1A1AA", color: "#A1A1AA" };
const DANGER: React.CSSProperties = { borderColor: "rgba(255,68,68,0.6)", color: "rgba(255,68,68,0.9)" };
const DARK: React.CSSProperties  = { borderColor: "#52525B", color: "#52525B" };

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  UNFULFILLED:         ACTIVE,
  PARTIALLY_FULFILLED: ACTIVE,
  IN_PROGRESS:         ACTIVE,
  ON_HOLD:             ACTIVE,
  SCHEDULED:           ACTIVE,
  OPEN:                ACTIVE,
  PENDING:             ACTIVE,
  AUTHORIZED:          ACTIVE,
  FULFILLED:           MUTED,
  SUCCESS:             MUTED,
  PAID:                MUTED,
  CANCELLED:           DANGER,
  VOIDED:              DANGER,
  FAILURE:             DANGER,
  ERROR:               DANGER,
  REFUNDED:            DARK,
  PARTIALLY_REFUNDED:  DARK,
};

// ─── Lógica para resolver el estado efectivo ──────────────────────────────────
//
// Shopify Customer API devuelve TWO campos distintos:
//   1. order.fulfillmentStatus  → UNFULFILLED | PARTIALLY_FULFILLED | FULFILLED | IN_PROGRESS | ON_HOLD | SCHEDULED
//   2. fulfillments.nodes[0].status → SUCCESS | OPEN | PENDING | FAILURE | ERROR | CANCELLED
//      (puede estar vacío aunque fulfillmentStatus esté presente)
//
// Además order.financialStatus → PAID | VOIDED | REFUNDED | PARTIALLY_REFUNDED | AUTHORIZED...
// Los pedidos cancelados llegan con financialStatus = "VOIDED" y
// fulfillmentStatus = "UNFULFILLED" (sin nodo en fulfillments).
//
export function resolveOrderStatus(order: OrderCardFragment): string {
  const financial = (order as any).financialStatus as string | undefined;
  // Cancelaciones y reembolsos tienen prioridad absoluta
  if (financial === "VOIDED")            return "CANCELLED";
  if (financial === "REFUNDED")          return "REFUNDED";
  if (financial === "PARTIALLY_REFUNDED") return "PARTIALLY_REFUNDED";

  // Estado de fulfillment a nivel de orden (el más fiable en Customer API)
  const orderLevel = (order as any).fulfillmentStatus as string | undefined;
  if (orderLevel && ORDER_STATUS[orderLevel]) return orderLevel;

  // Fallback: primer nodo de fulfillments
  const nodeStatus = flattenConnection(order.fulfillments)[0]?.status as string | undefined;
  if (nodeStatus && ORDER_STATUS[nodeStatus]) return nodeStatus;

  // Último recurso: financialStatus
  return financial ?? "UNFULFILLED";
}

// ─── Componentes ─────────────────────────────────────────────────────────────

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
        <OrdersTable orders={orders} />
      ) : (
        <p style={{ color: "#52525B", fontSize: "0.9rem" }}>
          No hay despliegues registrados.
        </p>
      )}
    </div>
  );
}

function OrdersTable({ orders }: OrderCardsProps) {
  const TH: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.75rem",
    color: "#52525B",
    textTransform: "uppercase",
    letterSpacing: "2px",
    padding: "1.25rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    fontWeight: 400,
  };
  const TD: React.CSSProperties = {
    padding: "1.25rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "0.9rem",
    color: "#A1A1AA",
  };

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
              <th key={h} style={TH}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            if (!order?.id) return null;

            const [legacyOrderId, key] = order.id.split("/").pop()!.split("?");
            const orderLink = key
              ? `/account/orders/${legacyOrderId}?${key}`
              : `/account/orders/${legacyOrderId}`;

            const effectiveStatus = resolveOrderStatus(order);
            const badgeStyle = STATUS_STYLE[effectiveStatus] ?? ACTIVE;
            const badgeLabel = ORDER_STATUS[effectiveStatus] ?? effectiveStatus;

            return (
              <tr
                key={order.id}
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
                    day: "numeric", month: "long", year: "numeric",
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
                    }}
                  >
                    Ver Detalles
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