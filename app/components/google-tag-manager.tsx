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

    // Product view
    subscribe('product_viewed', (data:any) => {
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: data.products?.[0]?.price?.currencyCode || 'EUR',
          value: parseFloat(data.products?.[0]?.price?.amount  || '0'),
          items: data.products?.map((p) => ({
            item_id: p.id,
            item_name: p.title,
            price: parseFloat(p.price?.amount || '0'),
            item_brand: p.vendor,
          })),
        },
      });
    });

    // Add to cart
    subscribe('product_added_to_cart', (data) => {
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: data.currentLine?.cost?.totalAmount?.currencyCode,
          value: parseFloat(data.currentLine?.cost?.totalAmount?.amount || '0'),
          items: [{
            item_id: data.currentLine?.merchandise?.product?.id,
            item_name: data.currentLine?.merchandise?.product?.title,
            price: parseFloat(data.currentLine?.cost?.amountPerQuantity?.amount || '0'),
            quantity: data.currentLine?.quantity,
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