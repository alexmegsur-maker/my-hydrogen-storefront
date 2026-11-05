import type { SeoConfig } from "@shopify/hydrogen";
import type {
  Article,
  Blog,
  Page,
  Product,
  ShopPolicy,
} from "@shopify/hydrogen/storefront-api-types";
import type { BreadcrumbList, CollectionPage, Offer } from "schema-dts";
import type {
  CollectionsQuery,
  ProductQuery,
  ShopFragment,
} from "storefront-api.generated";
import { COUNTRIES } from "~/utils/const";

export const SITE_ORIGIN = "https://phoenixchairs.eu";

/**
 * Normaliza una URL a su forma canónica: https, host phoenixchairs.eu, sin
 * query (?Color=Rojo...), sin hash, sin sufijo .data y sin barra final salvo
 * en la raíz. Conserva el prefijo de idioma: cada locale (/en, /de, /fr...)
 * se auto-referencia. Los href de hreflang pasan por aquí también, para que
 * el canonical de cada página coincida exactamente con su entrada hreflang.
 */
export function toCanonicalUrl(url: string): string {
  let pathname = "/";
  try {
    pathname = new URL(url, SITE_ORIGIN).pathname;
  } catch (e) {
    console.error("SEO: URL no válida para canonical:", url, e);
  }
  // Peticiones de datos de React Router: "/_root.data" (home) o "/ruta.data"
  pathname = pathname.replace(/^\/_root\.data$/, "/").replace(/\.data$/, "");
  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, "") || "/";
  }
  return `${SITE_ORIGIN}${pathname}`;
}

/** Prefijo de locale ("/de", "/fr"... o "" para español) de una URL canónica. */
function localePrefixOf(canonicalUrl: string): string {
  const firstSegment = new URL(canonicalUrl).pathname.split("/")[1];
  const prefix = `/${firstSegment}`;
  return firstSegment && prefix in COUNTRIES ? prefix : "";
}

function root({
  shop,
  url,
}: {
  shop: ShopFragment;
  url: Request["url"];
}): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);

  const brandLogoUrl = shop?.brand?.logo?.image?.url;
  return {
    title: shop?.name,
    titleTemplate: "%s | PhoenixChairs",
    description: truncate(shop?.description ?? "Sillas gaming premium con tecnología biomecánica patentada. Envío a toda Europa."),
    handle: "@phoenix_official.eu",
    url: canonicalUrl,
    ...(brandLogoUrl ? { media: { type: "image" as const, url: brandLogoUrl } } : {}),
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: shop.name,
      logo: shop.brand?.logo?.image?.url,
      sameAs: [
        "https://www.instagram.com/phoenix_official.eu/",
        "https://www.tiktok.com/@phoenixtechnologiesspain",
        "https://x.com/Phoenix_es",
        "https://www.youtube.com/@PhoenixChairsEU",
      ],
      url: canonicalUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `https://phoenixchairs.eu/search?q={search_term}`,
        query: "required name='search_term'",
      },
    },
  };
}

function home({ url }: { url?: Request["url"] } = {}): SeoConfig {
  const canonicalUrl = url ? toCanonicalUrl(url) : undefined;
  return {
    title: "Sillas Gaming Premium — Monarch Remaster",
    titleTemplate: "%s | PhoenixChairs",
    description:
      "Sillas gaming de alto rendimiento con biomecánica patentada. Monarch Remaster en ediciones limitadas con licencias oficiales. Envío premium a toda Europa, impuestos incluidos.",
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "PhoenixChairs",
        url: "https://phoenixchairs.eu",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://phoenixchairs.eu/search?q={search_term_string}",
          "query-input": "required name=search_term_string", 
        } as any,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "PhoenixChairs — Sillas Gaming Premium",
        description:
          "Sillas gaming de alto rendimiento con biomecánica patentada. Ediciones limitadas con licencias oficiales. Envío a Europa con impuestos incluidos.",
        url: canonicalUrl ?? "https://phoenixchairs.eu",
        isPartOf: {
          "@type": "WebSite",
          url: "https://phoenixchairs.eu",
        },
        about: {
          "@type": "Organization",
          name: "PhoenixChairs",
          url: "https://phoenixchairs.eu",
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Inicio",
              item: "https://phoenixchairs.eu",
            },
          ],
        },
      },
    ],
  };
}
function productJsonLd({
  product: productData,
  selectedVariant,
  url,
  reviews,
}: {
  product: ProductQuery["product"];
  selectedVariant: ProductQuery["product"]["selectedOrFirstAvailableVariant"];
  url: Request["url"];
  reviews?: { rating: number; count: number };
}): SeoConfig["jsonLd"] {
  // url ya llega canónico (sin query); solo las Offer añaden sus parámetros de variante
  const origin = new URL(url).origin;
  const prefix = localePrefixOf(url);
  const description = truncate(
    productData?.seo?.description ?? productData?.description,
  );

  // Create offers array from adjacent variants
  const offers: Offer[] = [];
  if (productData?.adjacentVariants) {
    for (const variant of productData.adjacentVariants) {
      const variantUrl = new URL(url);
      for (const option of variant.selectedOptions) {
        variantUrl.searchParams.set(option.name, option.value);
      }
      const availability = variant.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";

      offers.push({
        "@type": "Offer",
        availability,
        price: Number.parseFloat(variant.price.amount),
        priceCurrency: variant.price.currencyCode,
        sku: variant?.sku ?? "",
        url: variantUrl.toString(),
      });
    }
  }

  // Asegura que la variante seleccionada siempre tenga su propia oferta,
  // aunque adjacentVariants ya haya aportado otras (antes podía quedar fuera,
  // provocando que el sku de nivel superior no coincidiera con ningún offer).
  const hasSelectedVariantOffer =
    selectedVariant?.sku &&
    offers.some((offer) => offer.sku === selectedVariant.sku);

  if (selectedVariant && !hasSelectedVariantOffer) {
    const availability = selectedVariant.availableForSale
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

    offers.push({
      "@type": "Offer",
      availability,
      price: Number.parseFloat(selectedVariant.price.amount),
      priceCurrency: selectedVariant.price.currencyCode,
      sku: selectedVariant?.sku ?? "",
      url,
    });
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Products",
          item: `${origin}${prefix}/products`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: productData.title,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      brand: {
        "@type": "Brand",
        name: productData.vendor,
      },
      description,
      image: [selectedVariant?.image?.url ?? ""],
      name: productData.title,
      offers,
      sku: selectedVariant?.sku ?? "",
      url,
      ...(reviews && reviews.count > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: reviews.rating,
              reviewCount: reviews.count,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
    },
  ];
}

function product({
  product: productData,
  url,
  reviews,
}: {
  product: ProductQuery["product"];
  url: Request["url"];
  reviews?: { rating: number; count: number };
}): SeoConfig {
  const description = truncate(
    productData?.seo?.description ?? productData?.description ?? "",
  );
  const selectedVariant = productData?.selectedOrFirstAvailableVariant;
  const canonicalUrl = toCanonicalUrl(url);
  return {
    title: truncate(productData?.seo?.title ?? productData?.title ?? "", 48),
    description,
    titleTemplate: "%s — PhoenixChairs",
    handle: "@phoenixchairs",
    url: canonicalUrl,
    media: selectedVariant?.image,
    jsonLd: productJsonLd({ product: productData, selectedVariant, url: canonicalUrl, reviews }),
  };
}

type CollectionRequiredFields = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  seo: {
    title?: string;
    description?: string;
  };
  image?: {
    url: string;
    height?: number;
    width?: number;
    altText?: string;
  } | null;
  products: { nodes: Pick<Product, "handle">[] };
};

function collectionJsonLd({
  url,
  collection: collectionData,
}: {
  url: Request["url"];
  collection: CollectionRequiredFields;
}): SeoConfig["jsonLd"] {
  const siteUrl = new URL(url);
  const prefix = localePrefixOf(url);
  // Los handles de la consulta ya vienen en el idioma del locale activo
  const itemListElement: CollectionPage["mainEntity"] =
    collectionData.products.nodes.map((prod, index) => {
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl.origin}${prefix}/products/${prod.handle}`,
      };
    });

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Collections",
          item: `${siteUrl.origin}${prefix}/collections`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: collectionData.title,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: collectionData?.seo?.title ?? collectionData?.title ?? "",
      description: truncate(
        collectionData?.seo?.description ?? collectionData?.description ?? "",
      ),
      image: collectionData?.image?.url,
      url,
      mainEntity: {
        "@type": "ItemList",
        itemListElement,
      },
    },
  ];
}

function collection({
  collection: collectionData,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request["url"];
}): SeoConfig {
  const rawTitle = collectionData?.seo?.title ?? collectionData?.title ?? "";
  const imageUrl = collectionData?.image?.url;
  const canonicalUrl = toCanonicalUrl(url);
  return {
    title: truncate(rawTitle, 48),
    description: truncate(
      collectionData?.seo?.description ?? collectionData?.description ?? "",
    ),
    titleTemplate: "%s — PhoenixChairs",
    handle: "@Phoenix_es",
    url: canonicalUrl,
    ...(imageUrl ? {
      media: {
        type: "image" as const,
        url: imageUrl,
        height: collectionData?.image?.height,
        width: collectionData?.image?.width,
        altText: collectionData?.image?.altText,
      },
    } : {}),
    jsonLd: collectionJsonLd({ collection: collectionData, url: canonicalUrl }),
  };
}

type CollectionListRequiredFields = CollectionsQuery["collections"];

function collectionsJsonLd({
  url,
  collections,
}: {
  url: Request["url"];
  collections: CollectionListRequiredFields;
}): SeoConfig["jsonLd"] {
  const origin = new URL(url).origin;
  const prefix = localePrefixOf(url);
  const itemListElement: CollectionPage["mainEntity"] = collections.nodes.map(
    (col, index) => {
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `${origin}${prefix}/collections/${col.handle}`,
      };
    },
  );

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Collections",
    description: "All collections",
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement,
    },
  };
}

function listCollections({
  collections,
  url,
}: {
  collections: CollectionListRequiredFields;
  url: Request["url"];
}): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);
  return {
    title: "Collections",
    titleTemplate: "%s — PhoenixChairs",
    description: "All hydrogen collections",
    url: canonicalUrl,
    jsonLd: collectionsJsonLd({ collections, url: canonicalUrl }),
  };
}

function article({
  article: articleData,
  url,
}: {
  article: Pick<
    Article,
    "title" | "contentHtml" | "seo" | "publishedAt" | "excerpt"
  > & {
    image?: null | Pick<
      NonNullable<Article["image"]>,
      "url" | "height" | "width" | "altText"
    >;
  };
  url: Request["url"];
}): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);
  return {
    title: articleData?.seo?.title ?? articleData?.title,
    description: truncate(articleData?.seo?.description ?? ""),
    titleTemplate: "%s — PhoenixChairs",
    url: canonicalUrl,
    media: {
      type: "image",
      url: articleData?.image?.url,
      height: articleData?.image?.height,
      width: articleData?.image?.width,
      altText: articleData?.image?.altText,
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      alternativeHeadline: articleData.title,
      articleBody: articleData.contentHtml,
      datePublished: articleData?.publishedAt,
      description: truncate(
        articleData?.seo?.description || articleData?.excerpt || "",
      ),
      headline: articleData?.seo?.title || "",
      image: articleData?.image?.url,
      url: canonicalUrl,
    },
  };
}

function blog({
  blog: blogData,
  url,
}: {
  blog: Pick<Blog, "seo" | "title">;
  url: Request["url"];
}): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);
  return {
    title: blogData?.seo?.title,
    description: truncate(blogData?.seo?.description || ""),
    titleTemplate: "%s — PhoenixChairs",
    url: canonicalUrl,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: blogData?.seo?.title || blogData?.title || "",
      description: blogData?.seo?.description || "",
      url: canonicalUrl,
    },
  };
}

function page({
  page: pageData,
  url,
}: {
  page: Pick<Page, "title" | "seo">;
  url: Request["url"];
}): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);
  return {
    description: truncate(pageData?.seo?.description || ""),
    title: pageData?.seo?.title ?? pageData?.title,
    titleTemplate: "%s — PhoenixChairs",
    url: canonicalUrl,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageData.title,
      url: canonicalUrl,
    },
  };
}

function policy({
  policy: policyData,
  url,
}: {
  policy: Pick<ShopPolicy, "title" | "body">;
  url: Request["url"];
}): SeoConfig {
  return {
    description: truncate(policyData?.body ?? ""),
    title: policyData?.title,
    titleTemplate: "%s — PhoenixChairs",
    url: toCanonicalUrl(url),
  };
}

function policies({
  policies: policiesData,
  url,
}: {
  policies: Pick<ShopPolicy, "title" | "handle">[];
  url: Request["url"];
}): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);
  const origin = new URL(canonicalUrl).origin;
  const prefix = localePrefixOf(canonicalUrl);
  const itemListElement: BreadcrumbList["itemListElement"] = policiesData
    .filter(Boolean)
    .map((pol, index) => {
      return {
        "@type": "ListItem",
        position: index + 1,
        name: pol.title,
        item: `${origin}${prefix}/policies/${pol.handle}`,
      };
    });
  return {
    title: "Policies",
    titleTemplate: "%s — PhoenixChairs",
    description: "phoenixchairs store policies",
    url: canonicalUrl,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        description: "Phoenixchairs store policies",
        name: "Policies",
        url: canonicalUrl,
      },
    ],
  };
}

/**
 * Overrides a base SeoConfig with any title/description set in the Weaverse editor.
 * Weaverse stores page SEO at weaverseData.page.seo.{ title, description }.
 */
export function applyWeaverseSeo(
  base: SeoConfig,
  weaverseData: unknown,
): SeoConfig {
  const ws = (weaverseData as any)?.page?.seo as
    | { title?: string; description?: string }
    | undefined;
  if (!ws?.title && !ws?.description) return base;
  return {
    ...base,
    ...(ws.title ? { title: ws.title } : {}),
    ...(ws.description ? { description: ws.description } : {}),
  };
}

export const seoPayload = {
  article,
  blog,
  collection,
  home,
  listCollections,
  page,
  policies,
  policy,
  product,
  root,
};

/**
 * Truncate a string to a given length, adding an ellipsis if it was truncated
 * @param str - The string to truncate
 * @param num - The maximum length of the string
 * @returns The truncated string
 * @example
 * ```js
 * truncate('Hello world', 5) // 'Hello...'
 * ```
 */
function truncate(str: string, num = 155): string {
  if (typeof str !== "string") {
    return "";
  }
  if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num - 3)}...`;
}
