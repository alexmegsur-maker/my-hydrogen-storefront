import type { LoaderFunctionArgs } from "react-router";

// Interfaz para tipar las URLs que vienen de Shopify
interface SitemapUrl {
  url: string;
  lastMod?: string;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  // 1. Traer URLs de la Storefront API (Productos y Colecciones)
  const shopifySitemaps = await getShopifySitemaps(context);

  // 2. Array de rutas estáticas de Weaverse/Remix con sus variantes de idioma
  const staticRoutes: SitemapUrl[] = [
    // Español (Raíz) [cite: 220]
    { url: 'https://phoenixchairs.eu/' },
    { url: 'https://phoenixchairs.eu/devolucion' },
    { url: 'https://phoenixchairs.eu/legado' },
    { url: 'https://phoenixchairs.eu/garantia-base' },
    { url: 'https://phoenixchairs.eu/private' },
    { url: 'https://phoenixchairs.eu/tecnologia' },
    { url: 'https://phoenixchairs.eu/privacidad' },
    { url: 'https://phoenixchairs.eu/extension-de-garantia' },
    { url: 'https://phoenixchairs.eu/aviso-legal' },
    { url: 'https://phoenixchairs.eu/landing-founders' },
    { url: 'https://phoenixchairs.eu/contact' },
    
    // Inglés [cite: 220]
    { url: 'https://phoenixchairs.eu/en/' },
    { url: 'https://phoenixchairs.eu/en/devolucion' },
    { url: 'https://phoenixchairs.eu/en/legado' },
    { url: 'https://phoenixchairs.eu/en/garantia-base' },
    { url: 'https://phoenixchairs.eu/en/private' },
    { url: 'https://phoenixchairs.eu/en/tecnologia' },
    { url: 'https://phoenixchairs.eu/en/privacidad' },
    { url: 'https://phoenixchairs.eu/en/extension-de-garantia' },
    { url: 'https://phoenixchairs.eu/en/aviso-legal' },
    { url: 'https://phoenixchairs.eu/en/landing-founders' },
    { url: 'https://phoenixchairs.eu/en/contact' },
    
    // Alemán [cite: 220]
    { url: 'https://phoenixchairs.eu/de' },
  ];

  // 3. Fusionar y retornar el XML final [cite: 221]
  const sitemapXml = generateSitemapXml(shopifySitemaps, staticRoutes);

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600, s-maxage=86400', // Cache por 24 horas en Oxygen [cite: 222]
    },
  });
}

/**
 * FUNCIÓN 1: Consulta la Storefront API de Shopify para extraer Productos y Colecciones dinámicas
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

    // Mapeamos los productos dinámicos de Shopify a URLs absolutas 
    if (data?.products?.nodes) {
      data.products.nodes.forEach((product: any) => {
        urls.push({
          url: `https://phoenixchairs.eu/products/${product.handle}`,
          lastMod: product.updatedAt ? product.updatedAt.split('T')[0] : undefined,
        });
      });
    }

    // Mapeamos las colecciones dinámicas de Shopify a URLs absolutas 
    if (data?.collections?.nodes) {
      data.collections.nodes.forEach((collection: any) => {
        urls.push({
          url: `https://phoenixchairs.eu/collections/${collection.handle}`,
          lastMod: collection.updatedAt ? collection.updatedAt.split('T')[0] : undefined,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching Shopify catalog for sitemap:", error);
  }

  return urls;
}

/**
 * FUNCIÓN 2: Toma ambos arrays de URLs y construye la estructura XML estándar que exige Google
 */
function generateSitemapXml(shopifyUrls: SitemapUrl[], staticUrls: SitemapUrl[]): string {
  // Fusionamos ambos mundos en una sola lista única [cite: 217, 221]
  const allUrls = [...staticUrls, ...shopifyUrls];
  
  // Obtenemos la fecha de hoy por si alguna ruta estática no tiene el campo 'lastMod' definido
  const today = new Date().toISOString().split('T')[0];

  // Construimos el string XML puro respetando las directivas del protocolo sitemaps
  const xmlEntries = allUrls
    .map((item) => {
      return `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastMod || today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${item.url === 'https://phoenixchairs.eu/' ? '1.0' : '0.7'}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}