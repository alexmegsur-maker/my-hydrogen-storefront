import type { Storefront } from "@shopify/hydrogen";
import type {
  CountryCode,
  LanguageCode,
} from "@shopify/hydrogen/storefront-api-types";
import type { LoaderFunctionArgs } from "react-router";
import { COUNTRIES, LOCALE_PREFIXES } from "~/utils/const";
import { buildHreflangCluster, localeUrl } from "~/utils/hreflang-links";
import {
  getPageAlternates,
  getRegisteredPages,
} from "~/utils/localized-paths";

/**
 * Una URL del sitemap con todas sus versiones de idioma. Cada versión se
 * publica como <url> propio y enlaza a las demás con <xhtml:link hreflang>
 * (incluido x-default), igual que el <head> de la página (root.tsx).
 */
interface SitemapUrl {
  /** Versiones que EXISTEN: prefijo de idioma ("" = español) → ruta sin prefijo */
  versions: Record<string, string>;
  /** Fecha real de modificación (YYYY-MM-DD). Si no se conoce, se omite. */
  lastMod?: string;
  priority: string;
}

/**
 * Home (todos los idiomas) y páginas Weaverse registradas en
 * app/utils/localized-paths.ts, solo con sus versiones existentes.
 */
function getStaticRoutes(): SitemapUrl[] {
  const home: SitemapUrl = {
    versions: Object.fromEntries(LOCALE_PREFIXES.map((prefix) => [prefix, "/"])),
    priority: "1.0",
  };
  const pages = getRegisteredPages().map((basePath) => ({
    versions: getPageAlternates(basePath) ?? { "": basePath },
    priority: "0.7",
  }));
  return [home, ...pages];
}

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
};

export async function loader({ context }: LoaderFunctionArgs) {
  const staticRoutes = getStaticRoutes();
  try {
    const shopifyUrls = await getShopifySitemaps(context.storefront);
    const sitemapXml = generateSitemapXml([...staticRoutes, ...shopifyUrls]);
    return new Response(sitemapXml, { headers: SITEMAP_HEADERS });
  } catch (error) {
    console.error('Sitemap loader failed, returning static-only sitemap:', error);
    const fallbackXml = generateSitemapXml(staticRoutes);
    return new Response(fallbackXml, { headers: SITEMAP_HEADERS });
  }
}

const SITEMAP_PRODUCTS_QUERY = `#graphql
  query SitemapProducts($country: CountryCode, $language: LanguageCode, $after: String)
  @inContext(country: $country, language: $language) {
    products(first: 250, after: $after) {
      nodes {
        id
        handle
        updatedAt
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as const;

const SITEMAP_COLLECTIONS_QUERY = `#graphql
  query SitemapCollections($country: CountryCode, $language: LanguageCode, $after: String)
  @inContext(country: $country, language: $language) {
    collections(first: 250, after: $after) {
      nodes {
        id
        handle
        updatedAt
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as const;

const SITEMAP_BLOGS_QUERY = `#graphql
  query SitemapBlogs($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    blogs(first: 50) {
      nodes {
        id
        handle
        articles(first: 250) {
          nodes {
            id
            handle
            publishedAt
          }
        }
      }
    }
  }
` as const;

type CatalogNode = { id: string; handle: string; updatedAt?: string };
type CatalogType = "products" | "collections";

// Tope de seguridad: 40 páginas × 250 = 10.000 elementos por idioma
const MAX_PAGES = 40;

/** País e idioma de Shopify para un prefijo. Sin país, Shopify usa el
 * mercado principal y en fr/it/pl/nl devuelve los handles en español. */
function contextFor(prefix: string) {
  const locale = COUNTRIES[prefix || "default"];
  return {
    country: locale.country as CountryCode,
    language: locale.language as LanguageCode,
  };
}

function toDate(isoDate?: string | null): string | undefined {
  return isoDate ? isoDate.split("T")[0] : undefined;
}

/** Todos los productos o colecciones de un idioma, recorriendo la paginación. */
async function fetchAllNodes(
  storefront: Storefront,
  type: CatalogType,
  country: CountryCode,
  language: LanguageCode,
): Promise<CatalogNode[]> {
  const nodes: CatalogNode[] = [];
  let after: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const variables = { country, language, after };
    const options = { variables, cache: storefront.CacheLong() };
    const connection =
      type === "products"
        ? (await storefront.query(SITEMAP_PRODUCTS_QUERY, options)).products
        : (await storefront.query(SITEMAP_COLLECTIONS_QUERY, options)).collections;

    nodes.push(...connection.nodes);
    if (!connection.pageInfo.hasNextPage) {
      break;
    }
    after = connection.pageInfo.endCursor ?? null;
  }
  return nodes;
}

/**
 * Consulta un tipo de recurso en cada idioma (una consulta por idioma con
 * @inContext, en paralelo) y empareja los resultados por id. En Shopify el
 * handle está traducido, así que cada locale necesita el suyo: replicar el
 * handle español bajo /de, /fr... daría URLs que redirigen con 301.
 */
async function getLocalizedCatalog(
  storefront: Storefront,
  type: CatalogType,
): Promise<SitemapUrl[]> {
  const perLocale = await Promise.all(
    LOCALE_PREFIXES.map(async (prefix) => {
      const { country, language } = contextFor(prefix);
      try {
        return { prefix, nodes: await fetchAllNodes(storefront, type, country, language) };
      } catch (error) {
        console.error(`Sitemap: fallo al consultar ${type} en ${language}:`, error);
        return { prefix, nodes: [] as CatalogNode[] };
      }
    }),
  );

  // id → handle de cada locale. El español manda: define qué recursos existen.
  const byId = new Map<string, SitemapUrl>();
  for (const node of perLocale.find((l) => l.prefix === "")?.nodes ?? []) {
    byId.set(node.id, {
      versions: { "": `/${type}/${node.handle}` },
      lastMod: toDate(node.updatedAt),
      priority: "0.7",
    });
  }
  for (const { prefix, nodes } of perLocale) {
    if (!prefix) continue;
    for (const node of nodes) {
      const entry = byId.get(node.id);
      if (entry) {
        entry.versions[prefix] = `/${type}/${node.handle}`;
      }
    }
  }
  return [...byId.values()];
}

type BlogNode = {
  id: string;
  handle: string;
  articles: { nodes: Array<{ id: string; handle: string; publishedAt?: string }> };
};

/**
 * Blogs y artículos con el handle traducido de cada idioma (blog y artículo),
 * emparejados por id como el catálogo. lastmod del artículo = publicación;
 * el del blog = su artículo más reciente.
 */
async function getLocalizedBlogs(storefront: Storefront): Promise<SitemapUrl[]> {
  const perLocale = await Promise.all(
    LOCALE_PREFIXES.map(async (prefix) => {
      const { country, language } = contextFor(prefix);
      try {
        const data = await storefront.query(SITEMAP_BLOGS_QUERY, {
          variables: { country, language },
          cache: storefront.CacheLong(),
        });
        return { prefix, blogs: (data?.blogs?.nodes ?? []) as BlogNode[] };
      } catch (error) {
        console.error(`Sitemap: fallo al consultar blogs en ${language}:`, error);
        return { prefix, blogs: [] as BlogNode[] };
      }
    }),
  );

  const blogsById = new Map<string, SitemapUrl>();
  const articlesById = new Map<string, SitemapUrl>();
  for (const blog of perLocale.find((l) => l.prefix === "")?.blogs ?? []) {
    const dates = blog.articles.nodes
      .map((a) => toDate(a.publishedAt) ?? "")
      .sort();
    blogsById.set(blog.id, {
      versions: { "": `/blogs/${blog.handle}` },
      lastMod: dates[dates.length - 1] || undefined,
      priority: "0.6",
    });
    for (const article of blog.articles.nodes) {
      articlesById.set(article.id, {
        versions: { "": `/blogs/${blog.handle}/${article.handle}` },
        lastMod: toDate(article.publishedAt),
        priority: "0.6",
      });
    }
  }
  for (const { prefix, blogs } of perLocale) {
    if (!prefix) continue;
    for (const blog of blogs) {
      const blogEntry = blogsById.get(blog.id);
      if (!blogEntry) continue;
      blogEntry.versions[prefix] = `/blogs/${blog.handle}`;
      for (const article of blog.articles.nodes) {
        const articleEntry = articlesById.get(article.id);
        if (articleEntry) {
          articleEntry.versions[prefix] = `/blogs/${blog.handle}/${article.handle}`;
        }
      }
    }
  }
  return [...blogsById.values(), ...articlesById.values()];
}

/**
 * Productos, colecciones, blogs y artículos de Shopify con el handle
 * traducido de cada idioma.
 */
async function getShopifySitemaps(storefront: Storefront | undefined): Promise<SitemapUrl[]> {
  // Si no hay contexto de storefront (error de configuración), devolvemos array vacío para evitar que rompa la app
  if (!storefront) {
    console.error("Storefront context not found in sitemap loader");
    return [];
  }

  const [products, collections, blogs] = await Promise.all([
    getLocalizedCatalog(storefront, "products"),
    getLocalizedCatalog(storefront, "collections"),
    getLocalizedBlogs(storefront),
  ]);
  return [...products, ...collections, ...blogs];
}

/**
 * Construye el XML: cada versión de idioma de cada URL es un <url> que
 * enlaza a las demás versiones existentes con <xhtml:link hreflang>.
 */
function generateSitemapXml(items: SitemapUrl[]): string {
  const xmlEntries = items
    .flatMap((item) => {
      const alternates = buildHreflangCluster(item.versions).map(
        (link) =>
          `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${escapeXml(link.href)}" />`,
      );
      return LOCALE_PREFIXES.filter((prefix) => prefix in item.versions).map(
        (prefix) =>
          [
            "  <url>",
            `    <loc>${escapeXml(localeUrl(prefix, item.versions[prefix]))}</loc>`,
            item.lastMod ? `    <lastmod>${item.lastMod}</lastmod>` : "",
            `    <priority>${item.priority}</priority>`,
            ...alternates,
            "  </url>",
          ]
            .filter(Boolean)
            .join("\n"),
      );
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries}
</urlset>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
