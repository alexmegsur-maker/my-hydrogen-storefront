import { useAnalytics } from '@shopify/hydrogen';
import { useEffect } from 'react';

declare global{
  interface Window{
    dataLayer:any[]
  }
}

/**
 * Puente entre los eventos de Hydrogen y el dataLayer de GTM.
 *
 * add_to_cart se envía SOLO desde aquí (no desde los botones): Hydrogen
 * publica `product_added_to_cart` una vez por línea añadida, sea cual sea
 * el botón (ficha, "comprar ahora", accesorios, cross-sell…).
 * item_id = SKU de la variante, igual que view_item y purchase.
 */
export function GoogleTagManager() {
  const { subscribe, register } = useAnalytics();
  const { ready } = register('GoogleTagManager');

  useEffect(() => {

    window.dataLayer = window.dataLayer || []

    // Page views
    subscribe('page_viewed', (data) => {
      window.dataLayer.push({
        event: 'page_view',
        page_location: window.location.href,
        page_title: document.title,
      });
    });

    // Add to cart
    subscribe('product_added_to_cart', (data) => {
      const line = data.currentLine;
      if (!line) return; // guard: Hydrogen can return null for bulk updates
      const addedQty = line.quantity - (data.prevLine?.quantity ?? 0);
      if (addedQty <= 0) return;
      const merchandise = line.merchandise as typeof line.merchandise & { sku?: string | null };
      const variantId = (merchandise?.id ?? '').split('/').pop() ?? '';
      const price = parseFloat(line.cost?.amountPerQuantity?.amount ?? '0');
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: line.cost?.totalAmount?.currencyCode ?? 'EUR',
          value: price * addedQty,
          items: [{
            item_id: merchandise?.sku || variantId,
            item_name: merchandise?.product?.title,
            item_variant: merchandise?.title,
            item_brand: merchandise?.product?.vendor,
            price,
            quantity: addedQty,
          }],
        },
      });
    });

    // Search
    subscribe('search_viewed', (data) => {
      window.dataLayer.push({
        event: 'search',
        search_term: data.searchTerm,
      });
    });

    ready();
  }, [subscribe,register,ready]);

  return null;
}
