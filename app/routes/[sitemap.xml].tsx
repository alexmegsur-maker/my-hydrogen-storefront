import type { Storefront } from "@shopify/hydrogen";
import type {
  CountryCode,
  LanguageCode,
} from "@shopify/hydrogen/storefront-api-types";
import type { LoaderFunctionArgs } from "react-router";
import { COUNTRIES } from "~/utils/const";
import { localizePath } from "~/utils/localized-paths";

const SITE_ORIGIN = "https://phoenixchairs.eu";

// Prefijos de idioma soportados por la tienda ("" = español, por defecto).
// Se derivan de COUNTRIES (app/utils/const.ts) para que el sitemap nunca
// quede desincronizado de los locales que la app realmente sirve.
const LOCALE_PREFIXES: string[] = [
  "",
  ...Object.keys(COUNTRIES).filter((key) => key !== "default"),
];

// Interfaz para tipar las URLs que vienen de Shopify
interface SitemapUrl {
  /** Ruta sin prefijo de idioma ni dominio, p. ej. "/" o "/products/handle" */
  path: string;
  lastMod?: string;
  /**
   * Si es true, la URL se genera bajo todos los locales de LOCALE_PREFIXES
   * con hreflang cruzado. Si es false, se publica solo en español (raíz),
   * porque no hay confirmación de que exista traducción de esa página.
   */
  localize: boolean;
  /**
   * Ruta (sin prefijo) de cada locale cuando no es la misma en todos: productos
   * y colecciones tienen el handle traducido. Si existe, sustituye a `path` +
   * localizePath, y solo se publican los locales que aparecen aquí.
   */
  localizedPaths?: Record<string, string>;
}

// Rutas estáticas confirmadas en español. No se replican por idioma porque
// no hay confirmación de que estas páginas legales tengan traducción real
// (ver auditoría SEO, punto 8) — pásalas a localize:true en cuanto la haya.
const STATIC_ROUTES: SitemapUrl[] = [
  { path: "/", localize: true },
  { path: "/devolucion", localize: false },
  { path: "/legado", localize: false },
  { path: "/garantia-base", localize: false },
  { path: "/tecnologia", localize: true },
  { path: "/privacidad", localize: false },
  { path: "/extension-de-garantia", localize: false },
  { path: "/aviso-legal", localize: false },
  { path: "/landing-founders", localize: false },
  { path: "/contact", localize: false },
];

const SITEMAP_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
};

export async function loader({ context }: LoaderFunctionArgs) {
  try {
    const shopifyUrls = await getShopifySitemaps(context.storefront);
    const sitemapXml = generateSitemapXml([...STATIC_ROUTES, ...shopifyUrls]);
    return new Response(sitemapXml, { headers: SITEMAP_HEADERS });
  } catch (error) {
    console.error('Sitemap loader failed, returning static-only sitemap:', error);
    const fallbackXml = generateSitemapXml(STATIC_ROUTES);
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

type CatalogNode = { id: string; handle: string; updatedAt?: string };
type CatalogType = "products" | "collections";

// Tope de seguridad: 40 páginas × 250 = 10.000 elementos por idioma
const MAX_PAGES = 40;

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
      const locale = COUNTRIES[prefix || "default"];
      const language = locale.language as LanguageCode;
      // Sin país, Shopify usa el mercado principal y en fr/it/pl/nl devuelve
      // el handle español
      const country = locale.country as CountryCode;
      try {
        return { prefix, nodes: await fetchAllNodes(storefront, type, country, language) };
      } catch (error) {
        console.error(`Sitemap: fallo al consultar ${type} en ${language}:`, error);
        return { prefix, nodes: [] as CatalogNode[] };
      }
    }),
  );

  // id → handle de cada locale. El español manda: define qué recursos existen.
  const byId = new Map<string, { updatedAt?: string; paths: Record<string, string> }>();
  for (const node of perLocale.find((l) => l.prefix === "")?.nodes ?? []) {
    byId.set(node.id, {
      updatedAt: node.updatedAt,
      paths: { "": `/${type}/${node.handle}` },
    });
  }
  for (const { prefix, nodes } of perLocale) {
    if (!prefix) continue;
    for (const node of nodes) {
      const entry = byId.get(node.id);
      if (entry) {
        entry.paths[prefix] = `/${type}/${node.handle}`;
      }
    }
  }

  return [...byId.values()].map(({ updatedAt, paths }) => ({
    path: paths[""],
    lastMod: updatedAt ? updatedAt.split('T')[0] : undefined,
    localize: true,
    localizedPaths: paths,
  }));
}

/**
 * FUNCIÓN 1: Consulta la Storefront API de Shopify para extraer Productos y
 * Colecciones dinámicas, con el handle traducido de cada idioma.
 */
async function getShopifySitemaps(storefront: Storefront | undefined): Promise<SitemapUrl[]> {
  // Si no hay contexto de storefront (error de configuración), devolvemos array vacío para evitar que rompa la app
  if (!storefront) {
    console.error("Storefront context not found in sitemap loader");
    return [];
  }

  const [products, collections] = await Promise.all([
    getLocalizedCatalog(storefront, "products"),
    getLocalizedCatalog(storefront, "collections"),
  ]);
  return [...products, ...collections];
}

function localizedHref(prefix: string, path: string): string {
  if (path === "/") {
    return prefix ? `${SITE_ORIGIN}${prefix}` : `${SITE_ORIGIN}/`;
  }
  return `${SITE_ORIGIN}${prefix}${localizePath(path, prefix)}`;
}

/** URL absoluta de un item en un locale (usa su handle traducido si lo tiene). */
function itemHref(item: SitemapUrl, prefix: string): string {
  const localizedPath = item.localizedPaths?.[prefix];
  return localizedPath
    ? `${SITE_ORIGIN}${prefix}${localizedPath}`
    : localizedHref(prefix, item.path);
}

/**
 * FUNCIÓN 2: Construye el XML del sitemap, replicando cada URL bajo todos los
 * locales soportados (home, productos, colecciones) y enlazándolos entre sí
 * con <xhtml:link hreflang>. Productos y colecciones solo se publican en los
 * locales en los que se obtuvo su handle.
 */
function generateSitemapXml(items: SitemapUrl[]): string {
  const today = new Date().toISOString().split('T')[0];

  const xmlEntries = items
    .map((item) => {
      if (!item.localize) {
        // Solo existe en español: una única entrada, sin alternates de idioma.
        return `  <url>
    <loc>${escapeXml(localizedHref("", item.path))}</loc>
    <lastmod>${item.lastMod || today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${item.path === '/' ? '1.0' : '0.7'}</priority>
  </url>`;
      }

      const prefixes = item.localizedPaths
        ? LOCALE_PREFIXES.filter((prefix) => item.localizedPaths?.[prefix])
        : LOCALE_PREFIXES;

      const alternates = prefixes.map((prefix) => {
        const hreflang = COUNTRIES[prefix || "default"]?.language?.toLowerCase() ?? "es";
        return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(itemHref(item, prefix))}" />`;
      });
      alternates.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(itemHref(item, ""))}" />`,
      );

      return prefixes.map((prefix) => {
        return `  <url>
    <loc>${escapeXml(itemHref(item, prefix))}</loc>
    <lastmod>${item.lastMod || today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${item.path === '/' ? '1.0' : '0.7'}</priority>
${alternates.join('\n')}
  </url>`;
      }).join('\n');
    })
    .join('\n');

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
