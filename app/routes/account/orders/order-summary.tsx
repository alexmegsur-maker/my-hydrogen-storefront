import { TagIcon } from "@phosphor-icons/react";
import { Money } from "@shopify/hydrogen";
import type {
  OrderFragment,
  OrderLineItemFullFragment,
} from "customer-account-api.generated";

export function OrderSummary({
  order,
  lineItems,
}: {
  order: OrderFragment;
  lineItems: OrderLineItemFullFragment[];
}) {
  let totalDiscount = 0;
  for (const lineItem of lineItems) {
    totalDiscount += lineItem.discountAllocations.reduce(
      (acc, curr) => acc + Number.parseFloat(curr.allocatedAmount.amount),
      0,
    );
  }

  const rows = [
    { label: "Subtotal", value: <Money data={order.subtotal} />, bold: false },
    { label: "Impuestos", value: <Money data={order.totalTax} />, bold: false },
    { label: "Envío", value: <Money data={order.totalShipping} />, bold: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {rows.map(({ label, value, bold }) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <span
            style={{
              fontSize: "0.9rem",
              color: "#A1A1AA",
              fontWeight: bold ? 600 : 400,
            }}
          >
            {label}
          </span>
          <span style={{ fontSize: "0.9rem", color: "#A1A1AA" }}>{value}</span>
        </div>
      ))}

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Total
        </span>
        <span style={{ fontSize: "1.2rem", color: "#FFFFFF", fontWeight: 600 }}>
          <Money data={order.totalPrice} />
        </span>
      </div>

      {totalDiscount > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            padding: "0.75rem 1rem",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "2px",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TagIcon style={{ width: "14px", height: "14px", color: "#A1A1AA" }} />
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.75rem",
                color: "#A1A1AA",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Ahorro total
            </span>
          </div>
          <span style={{ fontSize: "0.9rem", color: "#FFFFFF" }}>
            <Money
              data={{
                amount: totalDiscount.toString(),
                currencyCode: order.totalPrice?.currencyCode,
              }}
            />
          </span>
        </div>
      )}
    </div>
  );
}
