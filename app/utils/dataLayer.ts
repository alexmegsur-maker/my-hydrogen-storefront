declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function cleanItemId(id: string): string {
  return id.split("/").pop() ?? id;
}

export function pushAddToCart(items: any[], value: number, currency = "EUR") {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency,
      value,
      items: items.map(i => ({ ...i, item_id: cleanItemId(i.item_id ?? "") })),
    },
  });
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

export function pushViewItem(item: {
  id: string;
  name: string;
  price: string;
  currency: string;
  sku?: string;
  variant?: string;
}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency: item.currency,
      value: parseFloat(item.price),
      items: [{
        item_id: cleanItemId(item.id),
        item_name: item.name,
        item_variant: item.variant ?? "",
        item_variant_sku: item.sku ?? "",
        price: parseFloat(item.price),
        quantity: 1,
      }],
    },
  });
}
