// utils/dataLayer.ts (o al inicio del mismo archivo)
export function pushDoubleShot(currentProd: any, totalPrice: number) {
  if (typeof window === "undefined" || !window.dataLayer) return;

  const variant = currentProd?.selectedVariant;
  if (!variant) return;

  const itemData = {
    item_id: variant.sku || variant.id,
    item_name: currentProd?.product?.title ?? "",
    price: parseFloat(variant.price?.amount ?? "0"),
    item_category: "Sillas Gaming Premium",
    variant: variant.title ?? "",
    quantity: 1,
  };

  // Limpia el ecommerce anterior (buena práctica GTM)
  window.dataLayer.push({ ecommerce: null });

  // 1️⃣ add_to_cart
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "EUR",
      value: totalPrice,
      items: [itemData],
    },
  });

  // Limpia de nuevo antes del segundo evento
  window.dataLayer.push({ ecommerce: null });

  // 2️⃣ begin_checkout
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "EUR",
      value: totalPrice,
      items: [itemData],
    },
  });
}