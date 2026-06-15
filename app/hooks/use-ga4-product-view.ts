import { useEffect, useRef } from "react";
import { useCurrentProduct } from "~/stores/currentProduct";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function useGA4ProductView() {
  const currentProduct = useCurrentProduct((s) => s.currentProduct);
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentProduct) return;
    if (currentProduct.id === prevIdRef.current) return;
    prevIdRef.current = currentProduct.id;

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "view_product",
      ecommerce: {
        currency: currentProduct.selectedVariant?.price?.currencyCode ?? "EUR",
        value: Number(currentProduct.selectedVariant?.price?.amount ?? 0),
        items: [
          {
            item_id: currentProduct.id,
            item_name: currentProduct.title,
            item_brand: currentProduct.vendor,
            item_variant: currentProduct.selectedVariant?.id ?? "",
            item_variant_sku: currentProduct.selectedVariant?.sku ?? "",
            price: Number(currentProduct.selectedVariant?.price?.amount ?? 0),
            quantity: 1,
          },
        ],
      },
    });
  }, [currentProduct]);
}
