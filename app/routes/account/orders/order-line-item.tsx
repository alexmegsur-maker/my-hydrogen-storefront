import { TagIcon } from "@phosphor-icons/react";
import { Money } from "@shopify/hydrogen";
import type { OrderLineItemFullFragment } from "customer-account-api.generated";
import { Image } from "~/components/image";

export function OrderLineItem({
  lineItem,
}: {
  lineItem: OrderLineItemFullFragment;
}) {
  const hasDiscount =
    lineItem.currentTotalPrice?.amount !== lineItem.totalPrice?.amount;

  return (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Imagen */}
      {lineItem?.image && (
        <div
          style={{
            width: "100px",
            flexShrink: 0,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          <Image
            data={lineItem.image}
            width={500}
            height={500}
            sizes="auto"
            style={{ width: "100%", height: "auto", display: "block", filter: "grayscale(20%)" }}
          />
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ color: "#FFFFFF", fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}>
          {lineItem.title}
        </div>
        {lineItem.variantTitle && (
          <div style={{ fontSize: "0.85rem", color: "#A1A1AA" }}>
            {lineItem.variantTitle}
          </div>
        )}
        <div style={{ fontSize: "0.85rem", color: "#52525B" }}>
          x{lineItem.quantity}
        </div>

        {/* Descuentos */}
        {lineItem.discountAllocations.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
            {lineItem.discountAllocations.map((discount, index) => {
              const discountApp = discount.discountApplication as any;
              const discountTitle = discountApp?.title || discountApp?.code;
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "3px 8px",
                    fontSize: "0.75rem",
                    color: "#A1A1AA",
                    borderRadius: "2px",
                  }}
                >
                  <TagIcon style={{ width: "12px", height: "12px" }} />
                  <span>{discountTitle}</span>
                  <span>
                    (-<Money data={discount.allocatedAmount} />)
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Precio */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto", paddingTop: "0.5rem" }}>
          {hasDiscount && (
            <span style={{ color: "#52525B", textDecoration: "line-through", fontSize: "0.9rem" }}>
              <Money data={lineItem.totalPrice} />
            </span>
          )}
          <span style={{ color: "#FFFFFF", fontSize: "0.9rem" }}>
            <Money data={lineItem.currentTotalPrice} />
          </span>
        </div>
      </div>
    </div>
  );
}
