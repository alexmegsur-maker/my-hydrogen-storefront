import type { Storefront } from "@shopify/hydrogen";
import type {
  CountryCode,
  LanguageCode,
} from "@shopify/hydrogen/storefront-api-types";
import { COUNTRIES } from "~/utils/const";
import { SITE_ORIGIN, toCanonicalUrl } from "./seo";

export type HreflangLink = { hreflang: string; href: string };

type LocalizedResourceType = "products" | "collections" | "articles";

// Segmento de URL de cada tipo. Los artículos viven en /blogs/<blog>/<artículo>,
// así que su "handle" localizado incluye ya el handle del blog.
const URL_SEGMENT: Record<LocalizedResourceType, string> = {
  products: "products",
  collections: "collections",
  articles: "blogs",
};

// Prefijos de idioma de COUNTRIES ("" = español, por defecto).
export const LOCALE_PREFIXES: string[] = [
  "",
  ...Object.keys(COUNTRIES).filter((key) => key !== "default"),
];

export function localeForPrefix(prefix: string) {
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

/**
 * Devuelve el handle de un producto, colección o artículo (este último como
 * "<blog>/<artículo>") en cada idioma de COUNTRIES,
 * indexado por prefijo de locale. En Shopify los handles están traducidos, así
 * que reutilizar el handle español bajo /de, /fr... produce URLs que redirigen.
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
        if (type === "articles") {
          const data = await storefront.query(ARTICLE_HANDLE_QUERY, {
            variables: { id, country, language },
            cache: storefront.CacheLong(),
          });
          const node = data?.node as
            | { handle?: string; blog?: { handle?: string } }
            | null
            | undefined;
          const handle =
            node?.handle && node.blog?.handle ? `${node.blog.handle}/${node.handle}` : undefined;
          return [prefix, handle] as const;
        }
        if (type === "products") {
          const data = await storefront.query(PRODUCT_HANDLE_QUERY, {
            variables: { id, country, language },
            cache: storefront.CacheLong(),
          });
          return [prefix, data?.product?.handle] as const;
        }
        const data = await storefront.query(COLLECTION_HANDLE_QUERY, {
          variables: { id, country, language },
          cache: storefront.CacheLong(),
        });
        return [prefix, data?.collection?.handle] as const;
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
 * idioma. Los href pasan por toCanonicalUrl para que coincidan exactamente con
 * el canonical que emite cada versión (mismo host, sin query, mismo encoding).
 */
export function buildResourceHreflang(
  type: LocalizedResourceType,
  handles: Record<string, string>,
): HreflangLink[] {
  const links: HreflangLink[] = LOCALE_PREFIXES.filter(
    (prefix) => handles[prefix],
  ).map((prefix) => ({
    hreflang: localeForPrefix(prefix).language.toLowerCase(),
    href: toCanonicalUrl(`${SITE_ORIGIN}${prefix}/${URL_SEGMENT[type]}/${handles[prefix]}`),
  }));

  // x-default apunta a la versión en español (sin prefijo)
  if (handles[""]) {
    links.push({
      hreflang: "x-default",
      href: toCanonicalUrl(`${SITE_ORIGIN}/${URL_SEGMENT[type]}/${handles[""]}`),
    });
  }
  return links;
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
