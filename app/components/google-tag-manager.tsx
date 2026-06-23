import { useAnalytics } from '@shopify/hydrogen';
import { useEffect } from 'react';

declare global{
  interface Window{
    dataLayer:any[]
  }
}

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
      const rawId = line?.merchandise?.product?.id ?? '';
      const itemId = rawId.split('/').pop() ?? rawId;
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: line?.cost?.totalAmount?.currencyCode ?? 'EUR',
          value: parseFloat(line?.cost?.totalAmount?.amount ?? '0'),
          items: [{
            item_id: itemId,
            item_name: line?.merchandise?.product?.title,
            item_variant: line?.merchandise?.title,
            price: parseFloat(line?.cost?.amountPerQuantity?.amount ?? '0'),
            quantity: line?.quantity,
          }],
        },
      });
    });

    // Begin checkout — dispara justo antes de ir al checkout de Shopify
    subscribe('cart_viewed', (data) => {
      window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
          currency: data.cart?.cost?.totalAmount?.currencyCode,
          value: parseFloat(data.cart?.cost?.totalAmount?.amount || '0'),
          items: data.cart?.lines?.nodes?.map((line: any) => ({
            item_id: line.merchandise?.product?.id,
            item_name: line.merchandise?.product?.title,
            price: parseFloat(line.cost?.amountPerQuantity?.amount || '0'),
            quantity: line.quantity,
          })),
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