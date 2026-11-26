import type { Storefront } from "@shopify/hydrogen";
import type {
  CountryCode,
  LanguageCode,
} from "@shopify/hydrogen/storefront-api-types";
import { COUNTRIES, LOCALE_PREFIXES } from "~/utils/const";
import {
  buildHreflangCluster,
  type HreflangLink,
} from "~/utils/hreflang-links";

export type { HreflangLink };

type LocalizedResourceType =
  | "products"
  | "collections"
  | "articles"
  | "blogs"
  | "pages";

// Segmento de URL de cada tipo. Los artículos viven en /blogs/<blog>/<artículo>,
// así que su "handle" localizado incluye ya el handle del blog.
const URL_SEGMENT: Record<LocalizedResourceType, string> = {
  products: "products",
  collections: "collections",
  articles: "blogs",
  blogs: "blogs",
  pages: "pages",
};

function localeForPrefix(prefix: string) {
  return COUNTRIES[prefix || "default"];
}

const PRODUCT_HANDLE_QUERY = `#graphql
  query LocalizedProductHandle($id: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(id: $id) {
      handle
    }
  }
` as const;

const COLLECTION_HANDLE_QUERY = `#graphql
  query LocalizedCollectionHandle($id: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(id: $id) {
      handle
    }
  }
` as const;

const ARTICLE_HANDLE_QUERY = `#graphql
  query LocalizedArticleHandle($id: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    node(id: $id) {
      ... on Article {
        handle
        blog {
          handle
        }
      }
    }
  }
` as const;

const BLOG_HANDLE_QUERY = `#graphql
  query LocalizedBlogHandle($id: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    node(id: $id) {
      ... on Blog {
        handle
      }
    }
  }
` as const;

const PAGE_HANDLE_QUERY = `#graphql
  query LocalizedPageHandle($id: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    node(id: $id) {
      ... on Page {
        handle
      }
    }
  }
` as const;

/** Handle de un recurso en un idioma (artículos: "<blog>/<artículo>"). */
async function queryLocalizedHandle(
  storefront: Storefront,
  type: LocalizedResourceType,
  variables: { id: string; country: CountryCode; language: LanguageCode },
): Promise<string | undefined> {
  const cache = storefront.CacheLong();
  switch (type) {
    case "products": {
      const data = await storefront.query(PRODUCT_HANDLE_QUERY, { variables, cache });
      return data?.product?.handle;
    }
    case "collections": {
      const data = await storefront.query(COLLECTION_HANDLE_QUERY, { variables, cache });
      return data?.collection?.handle;
    }
    case "articles": {
      const data = await storefront.query(ARTICLE_HANDLE_QUERY, { variables, cache });
      const node = data?.node as
        | { handle?: string; blog?: { handle?: string } }
        | null
        | undefined;
      return node?.handle && node.blog?.handle
        ? `${node.blog.handle}/${node.handle}`
        : undefined;
    }
    case "blogs": {
      const data = await storefront.query(BLOG_HANDLE_QUERY, { variables, cache });
      return (data?.node as { handle?: string } | null | undefined)?.handle;
    }
    case "pages": {
      const data = await storefront.query(PAGE_HANDLE_QUERY, { variables, cache });
      return (data?.node as { handle?: string } | null | undefined)?.handle;
    }
    default:
      return undefined;
  }
}

/**
 * Devuelve el handle de un producto, colección, blog, page o artículo (este
 * último como "<blog>/<artículo>") en cada idioma de COUNTRIES, indexado por
 * prefijo de locale. En Shopify los handles están traducidos, así que
 * reutilizar el handle español bajo /de, /fr... produce URLs que redirigen.
 * Se consulta por id (no por handle) con una petición por idioma en paralelo.
 * Si un idioma falla o no devuelve el recurso, ese prefijo se omite.
 */
export async function getLocalizedHandles(
  storefront: Storefront,
  type: LocalizedResourceType,
  id: string,
): Promise<Record<string, string>> {
  const results = await Promise.all(
    LOCALE_PREFIXES.map(async (prefix) => {
      const locale = localeForPrefix(prefix);
      const language = locale.language as LanguageCode;
      // El país es necesario: sin él Shopify usa el mercado principal y, en los
      // idiomas que no tiene activos (fr, it, pl, nl), devuelve el handle español
      const country = locale.country as CountryCode;
      try {
        const handle = await queryLocalizedHandle(storefront, type, {
          id,
          country,
          language,
        });
        return [prefix, handle] as const;
      } catch (error) {
        console.error(`Handle localizado no disponible (${type}, ${language}):`, error);
        return [prefix, undefined] as const;
      }
    }),
  );

  const handles: Record<string, string> = {};
  for (const [prefix, handle] of results) {
    if (handle) {
      handles[prefix] = handle;
    }
  }
  return handles;
}

/**
 * Construye el clúster hreflang de un recurso a partir de sus handles por
 * idioma. Los href pasan por toCanonicalUrl (vía buildHreflangCluster) para
 * que coincidan exactamente con el canonical que emite cada versión.
 * x-default apunta a la versión inglesa (o a la española si no existe).
 */
export function buildResourceHreflang(
  type: LocalizedResourceType,
  handles: Record<string, string>,
): HreflangLink[] {
  const versions = Object.fromEntries(
    Object.entries(handles).map(([prefix, handle]) => [
      prefix,
      `/${URL_SEGMENT[type]}/${handle}`,
    ]),
  );
  return buildHreflangCluster(versions);
}

/** Atajo para los loaders: handles por idioma + clúster hreflang. */
export async function getResourceHreflang(
  storefront: Storefront,
  type: LocalizedResourceType,
  id: string,
): Promise<HreflangLink[]> {
  const handles = await getLocalizedHandles(storefront, type, id);
  return buildResourceHreflang(type, handles);
}
