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
      const price = parseFloat(data.products?.[0]?.price || '0');
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: data.shop?.currency || 'EUR',
          value: price,
          items: data.products?.map((p: any) => ({
            item_id: p.id,
            item_name: p.title,
            item_variant: p.variantTitle,
            price: parseFloat(p.price || '0'),
            item_brand: p.vendor,
            quantity: p.quantity || 1,
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