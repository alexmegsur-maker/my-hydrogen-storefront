declare global {
  interface Window {
    dataLayer: any[];
  }
}

function cleanItemId(id: string): string {
  return id.split("/").pop() ?? id;
}

export function pushBeginCheckout(items: any[], value: number, currency = "EUR") {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency,
      value,
      items: items.map(i => ({ ...i, item_id: cleanItemId(i.item_id ?? "") })),
    },
  });
}
