import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getSeoMeta,
  useOptimisticVariant,
} from "@shopify/hydrogen";
import { getSelectedProductOptions } from "@weaverse/hydrogen";
import { useEffect } from "react";
import type { LoaderFunctionArgs, MetaArgs } from "react-router";
import { useLoaderData } from "react-router";
import type { ProductQuery } from "storefront-api.generated";
import invariant from "tiny-invariant";
import {
  redirectIfCombinedListing,
  redirectIfHandleIsLocalized,
} from "~/.server/redirect";
import { seoPayload } from "~/.server/seo";
import { routeHeaders } from "~/utils/cache";
import {
  COMBINED_LISTINGS_CONFIGS,
  isCombinedListing,
} from "~/utils/combined-listings";
import { applyWeaverseSeo } from "~/.server/seo";
import { WeaverseContent } from "~/weaverse";
import { useGA4ProductView } from "~/hooks/use-ga4-product-view";
import { getRecommendedProducts } from "./recommended-product";
import { PRODUCT_QUERY } from "~/graphql/queries";

export const headers = routeHeaders;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { productHandle: handle } = params;

  invariant(handle, "Missing productHandle param, check route filename");

  const { storefront, weaverse } = context;
  const selectedOptions = getSelectedProductOptions(request);
  
  // Extendemos la consulta nativa mediante un fragmento o solicitando directamente los metafields de Judge.me
  const [{ shop, product }, weaverseData] = await Promise.all([
    storefront.query<any>(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
    weaverse.loadPage({ type: "PRODUCT", handle }),
  ]);

  if (!product?.id) {
    throw new Response("product", { status: 404 });
  }
  redirectIfHandleIsLocalized(request, { handle, data: product });

  if (COMBINED_LISTINGS_CONFIGS.redirectToFirstVariant) {
    redirectIfCombinedListing(request, product);
  }

  const recommended = getRecommendedProducts(storefront, product.id);

  // Extraer datos de reseñas guardados por Judge.me en los metafields de Shopify
  const reviewsRating = product.metafields?.find((m: any) => m?.key === "reviews_average")?.value || "5.0";
  const reviewsCount = product.metafields?.find((m: any) => m?.key === "reviews_count")?.value || "0";

  return {
    shop,
    product,
    weaverseData,
    storeDomain: shop.primaryDomain.url,
    seo: applyWeaverseSeo(seoPayload.product({ product, url: request.url }), weaverseData),
    recommended,
    selectedOptions,
    language: storefront.i18n.language,
    url: request.url,
    reviews: {
      rating: parseFloat(reviewsRating),
      count: parseInt(reviewsCount, 10),
    },
    modelo: product.modelo?.value ?? null,
  };
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  return [
    ...getSeoMeta(
      ...matches.map((match) => (match.data as any)?.seo).filter(Boolean),
    ),
    { property: "og:type", content: "product" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export default function Product() {
  const { product, reviews, url } = useLoaderData<typeof loader>();
  const combinedListing = isCombinedListing(product);
  useGA4ProductView();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useEffect(() => {
    if (!selectedVariant) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        currency: selectedVariant.price?.currencyCode || 'EUR',
        value: parseFloat(selectedVariant.price?.amount || '0'),
        items: [{
          item_id: selectedVariant.sku || selectedVariant.id,
          item_name: product.title,
          item_variant: selectedVariant.title,
          item_sku: selectedVariant.sku,
          item_brand: "Phoenix Chairs",
          price: parseFloat(selectedVariant.price?.amount || '0'),
          quantity: 1,
        }],
      },
    });
  }, [selectedVariant?.id]);

  useEffect(() => {
    if (!selectedVariant?.selectedOptions || combinedListing) return;

    const currentParams = new URLSearchParams(window.location.search);
    let needsUpdate = false;

    if (window.location.search === "") {
      needsUpdate = true;
    } else {
      for (const option of selectedVariant.selectedOptions) {
        const currentValue = currentParams.get(option.name);
        if (currentValue !== option.value) {
          needsUpdate = true;
          break;
        }
      }
    }

    if (needsUpdate) {
      const updatedParams = new URLSearchParams(currentParams);
      for (const option of selectedVariant.selectedOptions) {
        updatedParams.set(option.name, option.value);
      }
      const newSearch = updatedParams.toString();
      if (newSearch !== window.location.search.slice(1)) {
        window.history.replaceState({}, "", `${location.pathname}?${newSearch}`);
      }
    }
  }, [selectedVariant?.selectedOptions, combinedListing]);

  // Construcción del objeto JSON-LD enriquecido para Googlebot
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": selectedVariant?.image?.url || product.featuredImage?.url,
    "description": product.description,
    "sku": selectedVariant?.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": "Phoenix Chairs",
    },
    ...(reviews.count > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": reviews.rating,
        "reviewCount": reviews.count,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "offers": {
      "@type": "Offer",
      "priceCurrency": selectedVariant?.price?.currencyCode || "EUR",
      "price": selectedVariant?.price?.amount || "0",
      "availability": selectedVariant?.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": url,
    }
  };

  return (
    <>
      {/* Datos Estructurados inyectados nativamente en el HTML para Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <WeaverseContent />
      
      {selectedVariant && (
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || "0",
                vendor: "Phoenix Chairs",
                variantId: selectedVariant?.id || "",
                variantTitle: selectedVariant?.title || "",
                quantity: 1,
              },
            ],
          }}
        />
      )}
    </>
  );
}