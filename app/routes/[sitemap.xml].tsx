import type { LoaderFunctionArgs } from "react-router";
import { COUNTRIES } from "~/utils/const";

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
}

// Rutas estáticas confirmadas en español. No se replican por idioma porque
// no hay confirmación de que estas páginas legales tengan traducción real
// (ver auditoría SEO, punto 8) — pásalas a localize:true en cuanto la haya.
const STATIC_ROUTES: SitemapUrl[] = [
  { path: "/", localize: true },
  { path: "/devolucion", localize: false },
  { path: "/legado", localize: false },
  { path: "/garantia-base", localize: false },
  { path: "/tecnologia", localize: false },
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
    const shopifyUrls = await getShopifySitemaps(context);
    const sitemapXml = generateSitemapXml([...STATIC_ROUTES, ...shopifyUrls]);
    return new Response(sitemapXml, { headers: SITEMAP_HEADERS });
  } catch (error) {
    console.error('Sitemap loader failed, returning static-only sitemap:', error);
    const fallbackXml = generateSitemapXml(STATIC_ROUTES);
    return new Response(fallbackXml, { headers: SITEMAP_HEADERS });
  }
}

/**
 * FUNCIÓN 1: Consulta la Storefront API de Shopify para extraer Productos y Colecciones dinámicas.
 * Los handles son los mismos en todos los locales (Shopify no genera slugs distintos por idioma),
 * así que basta con una consulta y luego se reutiliza el path bajo cada prefijo de idioma.
 */
async function getShopifySitemaps(context: any): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];

  // Si no hay contexto de storefront (error de configuración), devolvemos array vacío para evitar que rompa la app
  if (!context?.storefront) {
    console.error("Storefront context not found in sitemap loader");
    return urls;
  }

  try {
    // Ejecutamos la consulta GraphQL pidiendo los primeros 250 productos y colecciones [cite: 226, 228]
    const data: any = await context.storefront.query(`#graphql
      query SitemapCatalog {
        products(first: 250) {
          nodes {
            handle
            updatedAt
          }
        }
        collections(first: 250) {
          nodes {
            handle
            updatedAt
          }
        }
      }
    `);

    if (data?.products?.nodes) {
      data.products.nodes.forEach((product: any) => {
        urls.push({
          path: `/products/${product.handle}`,
          lastMod: product.updatedAt ? product.updatedAt.split('T')[0] : undefined,
          localize: true,
        });
      });
    }

    if (data?.collections?.nodes) {
      data.collections.nodes.forEach((collection: any) => {
        urls.push({
          path: `/collections/${collection.handle}`,
          lastMod: collection.updatedAt ? collection.updatedAt.split('T')[0] : undefined,
          localize: true,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching Shopify catalog for sitemap:", error);
  }

  return urls;
}

function localizedHref(prefix: string, path: string): string {
  if (path === "/") {
    return prefix ? `${SITE_ORIGIN}${prefix}` : `${SITE_ORIGIN}/`;
  }
  return `${SITE_ORIGIN}${prefix}${path}`;
}

/**
 * FUNCIÓN 2: Construye el XML del sitemap, replicando cada URL bajo todos los
 * locales soportados (home, productos, colecciones) y enlazándolos entre sí
 * con <xhtml:link hreflang> — así el sitemap deja de ser "solo español" y
 * además refuerza la señal de hreflang que falta en el <head>.
 */
function generateSitemapXml(items: SitemapUrl[]): string {
  const today = new Date().toISOString().split('T')[0];

  const xmlEntries = items
    .map((item) => {
      if (!item.localize) {
        // Solo existe en español: una única entrada, sin alternates de idioma.
        return `  <url>
    <loc>${localizedHref("", item.path)}</loc>
    <lastmod>${item.lastMod || today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${item.path === '/' ? '1.0' : '0.7'}</priority>
  </url>`;
      }

      const alternates = LOCALE_PREFIXES.map((prefix) => {
        const hreflang = COUNTRIES[prefix || "default"]?.language?.toLowerCase() ?? "es";
        return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${localizedHref(prefix, item.path)}" />`;
      });
      alternates.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedHref("", item.path)}" />`,
      );

      return LOCALE_PREFIXES.map((prefix) => {
        return `  <url>
    <loc>${localizedHref(prefix, item.path)}</loc>
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