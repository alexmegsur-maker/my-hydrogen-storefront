import type { LoaderFunctionArgs } from "react-router";
import type {
  CartUpsellBestSellersQuery,
  CartUpsellCollectionQuery,
  CartUpsellProductFragment,
  CartUpsellRecommendationsQuery,
} from "storefront-api.generated";

type Storefront = LoaderFunctionArgs["context"]["storefront"];

export type CartUpsellProduct = CartUpsellProductFragment;

/**
 * Productos de "Añade a tu pedido" en la página de carrito.
 *
 * 1. Recomendaciones complementarias de Shopify (app Search & Discovery →
 *    "Productos complementarios") de los productos que ya están en el carrito.
 * 2. Si no hay suficientes, se completa con la colección indicada en los
 *    ajustes del tema (Cart → "Añade a tu pedido: colección").
 *
 * Nunca muestra productos que ya están en el carrito ni sin stock.
 */
export async function getCartUpsellProducts({
  storefront,
  productIds,
  collectionHandle,
  count,
}: {
  storefront: Storefront;
  productIds: string[];
  collectionHandle?: string;
  count: number;
}): Promise<CartUpsellProduct[]> {
  if (count <= 0) return [];
  const inCart = new Set(productIds);
  const picked = new Map<string, CartUpsellProduct>();
  const add = (products: (CartUpsellProduct | null | undefined)[] | null | undefined) => {
    for (const product of products ?? []) {
      if (picked.size >= count) return;
      if (!product || inCart.has(product.id) || picked.has(product.id)) continue;
      if (!product.selectedOrFirstAvailableVariant?.availableForSale) continue;
      picked.set(product.id, product);
    }
  };

  try {
    // Máximo 3 productos del carrito para no disparar demasiadas consultas
    const recommendations = await Promise.all(
      productIds.slice(0, 3).map((productId) =>
        storefront
          .query<CartUpsellRecommendationsQuery>(CART_UPSELL_RECOMMENDATIONS_QUERY, {
            variables: { productId },
            cache: storefront.CacheShort(),
          })
          .then((res) => res?.productRecommendations ?? [])
          .catch((error) => {
            console.error("[cart-upsell] Recomendaciones fallidas:", error);
            return [];
          }),
      ),
    );
    for (const list of recommendations) add(list);

    const handle = collectionHandle?.trim();
    if (picked.size < count && handle) {
      const res = await storefront
        .query<CartUpsellCollectionQuery>(CART_UPSELL_COLLECTION_QUERY, {
          variables: { handle, first: count + productIds.length + 4 },
          cache: storefront.CacheShort(),
        })
        .catch((error) => {
          console.error("[cart-upsell] Colección fallida:", error);
          return null;
        });
      add(res?.collection?.products?.nodes);
    }

    // Último recurso (p. ej. carrito vacío sin colección configurada): más vendidos
    if (picked.size < count) {
      const res = await storefront
        .query<CartUpsellBestSellersQuery>(CART_UPSELL_BEST_SELLERS_QUERY, {
          variables: { first: count + productIds.length + 4 },
          cache: storefront.CacheShort(),
        })
        .catch((error) => {
          console.error("[cart-upsell] Más vendidos fallidos:", error);
          return null;
        });
      add(res?.products?.nodes);
    }
  } catch (error) {
    console.error("[cart-upsell] Error:", error);
  }

  return [...picked.values()];
}

const CART_UPSELL_PRODUCT_FRAGMENT = `#graphql
  fragment CartUpsellProduct on Product {
    id
    handle
    title
    featuredImage {
      id
      url
      altText
      width
      height
    }
    subtitle: metafield(namespace: "custom", key: "tooltip") {
      value
    }
    selectedOrFirstAvailableVariant {
      id
      availableForSale
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

const CART_UPSELL_RECOMMENDATIONS_QUERY = `#graphql
  query CartUpsellRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId, intent: COMPLEMENTARY) {
      ...CartUpsellProduct
    }
  }
  ${CART_UPSELL_PRODUCT_FRAGMENT}
` as const;

const CART_UPSELL_BEST_SELLERS_QUERY = `#graphql
  query CartUpsellBestSellers(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...CartUpsellProduct
      }
    }
  }
  ${CART_UPSELL_PRODUCT_FRAGMENT}
` as const;

const CART_UPSELL_COLLECTION_QUERY = `#graphql
  query CartUpsellCollection(
    $handle: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          ...CartUpsellProduct
        }
      }
    }
  }
  ${CART_UPSELL_PRODUCT_FRAGMENT}
` as const;
