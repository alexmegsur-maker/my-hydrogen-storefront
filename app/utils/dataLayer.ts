// utils/dataLayer.ts (o al inicio del mismo archivo)
export function pushDoubleShot(cartIdsSeo: any, totalPrice: number) {
  if (typeof window === "undefined" || !window.dataLayer) return;


  // Limpia el ecommerce anterior (buena práctica GTM)
  window.dataLayer.push({ ecommerce: null });

  // 1️⃣ add_to_cart
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "EUR",
      value: totalPrice,
      items: [cartIdsSeo],
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
      items: [cartIdsSeo],
    },
  });
}