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
import { COUNTRIES, SITE_ORIGIN } from "~/utils/const";
import { toCanonicalUrl } from "~/utils/hreflang-links";
import { splitLocale } from "~/utils/localized-paths";
import { translations } from "~/utils/translations";

// Compartidos con el cliente (root.tsx, selectores): viven en ~/utils
export { SITE_ORIGIN, toCanonicalUrl };

/** Prefijo de locale ("/de", "/fr"... o "" para español) de una URL canónica. */
function localePrefixOf(canonicalUrl: string): string {
  return splitLocale(new URL(canonicalUrl).pathname).prefix;
}

/** Idioma de una URL según su prefijo ("ES", "DE"...). */
function languageOf(url: string): string {
  return COUNTRIES[localePrefixOf(url) || "default"].language;
}

/** Textos SEO de fallback en el idioma de la URL. */
function seoTexts(url: string): Record<string, string> {
  return translations[languageOf(url)] ?? translations.ES;
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
      // La organización es siempre el sitio, no la página que se está viendo.
      // (SearchAction retirado: Google dejó de usar el cuadro de búsqueda de
      // sitelinks en noviembre de 2024.)
      url: SITE_ORIGIN,
    },
  };
}

/**
 * Home de cada idioma. Los textos son el fallback de app/utils/translations
 * en el idioma de la URL; el SEO de Weaverse (applyWeaverseSeo) los sustituye.
 */
function home({ url }: { url: Request["url"] }): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);
  const t = seoTexts(url);
  return {
    title: t.seo_homeTitle,
    titleTemplate: "%s | PhoenixChairs",
    description: t.seo_homeDescription,
    url: canonicalUrl,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "PhoenixChairs",
        url: SITE_ORIGIN,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `PhoenixChairs — ${t.seo_homeTitle}`,
        description: t.seo_homeDescription,
        url: canonicalUrl,
        inLanguage: languageOf(url).toLowerCase(),
        isPartOf: {
          "@type": "WebSite",
          url: SITE_ORIGIN,
        },
        about: {
          "@type": "Organization",
          name: "PhoenixChairs",
          url: SITE_ORIGIN,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: t.home,
              item: canonicalUrl,
            },
          ],
        },
      },
    ],
  };
}

/**
 * Página Weaverse personalizada (/tecnologia, /de/technologie...). El título y
 * la descripción vienen del SEO de cada página en Weaverse (applyWeaverseSeo);
 * si faltan, getSeoMeta usa los de la raíz. Nunca hereda los textos de la home.
 */
function customPage({ url }: { url: Request["url"] }): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);
  return {
    title: "",
    description: "",
    titleTemplate: "%s | PhoenixChairs",
    url: canonicalUrl,
    robots: { noIndex: false, noFollow: false },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: canonicalUrl,
      inLanguage: languageOf(url).toLowerCase(),
      isPartOf: {
        "@type": "WebSite",
        url: SITE_ORIGIN,
      },
    },
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
          name: seoTexts(url).seo_products,
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
    // 70 = límite de Hydrogen. Con 48 se cortaba el color/edición y varias
    // fichas (p. ej. tela gris oscuro y gris-negro) acababan con el mismo título
    title: truncate(productData?.seo?.title || productData?.title || "", 70),
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
          name: seoTexts(url).seo_collections,
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
    title: truncate(rawTitle, 70),
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

  const t = seoTexts(url);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.seo_collections,
    description: t.seo_collectionsDescription,
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
  const t = seoTexts(url);
  return {
    title: t.seo_collections,
    titleTemplate: "%s — PhoenixChairs",
    description: t.seo_collectionsDescription,
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
    author?: null | { name?: string | null };
  };
  url: Request["url"];
}): SeoConfig {
  const canonicalUrl = toCanonicalUrl(url);
  const authorName = articleData?.author?.name;
  return {
    title: articleData?.seo?.title || articleData?.title,
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
      // headline es obligatorio para Google: si no hay título SEO, el del artículo
      headline: articleData?.seo?.title || articleData.title,
      image: articleData?.image?.url,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      inLanguage: languageOf(url).toLowerCase(),
      ...(authorName ? { author: { "@type": "Person", name: authorName } } : {}),
      publisher: {
        "@type": "Organization",
        name: "PhoenixChairs",
        url: SITE_ORIGIN,
      },
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
    // Sin título SEO en Shopify la página quedaba sin <title>
    title: blogData?.seo?.title || blogData?.title,
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
    title: pageData?.seo?.title || pageData?.title,
    titleTemplate: "%s — PhoenixChairs",
    url: canonicalUrl,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageData.title,
      url: canonicalUrl,
      inLanguage: languageOf(url).toLowerCase(),
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
  customPage,
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
