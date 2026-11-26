import { COUNTRIES, LOCALE_PREFIXES } from "~/utils/const";

/**
 * Registro de páginas Weaverse indexables. La clave es la ruta base (español,
 * sin prefijo de locale) y cada entrada indica el slug que usa ese locale.
 * Los locales que no aparecen conservan el slug base.
 *
 * Solo las páginas registradas aquí emiten hreflang y entran en el sitemap:
 * una página Weaverse nueva que exista en varios idiomas debe añadirse
 * (aunque no cambie de slug, con `{}`).
 */
const LOCALIZED_SLUGS: Record<string, Record<string, string>> = {
  "/tecnologia": {
    "/de": "/technologie",
    "/en": "/technology",
    "/fr": "/technologie",
    "/it": "/tecnologia",
    "/nl": "/technologie",
    "/pl": "/technologia"
  },
  "/garantia-base": {
    "/de": "/basisgarantie",
    "/en": "/base-warranty",
    "/fr": "/garantie-de-base",
    "/it": "/garanzia-base",
    "/nl": "/basisgarantie",
    "/pl": "/gwarancja-podstawowa"
  },
  "/extension-de-garantia": {
    "/de": "/garantieverlaengerung",
    "/en": "/extended-warranty",
    "/fr": "/extension-de-garantie",
    "/it": "/estensione-di-garanzia",
    "/nl": "/garantieverlenging",
    "/pl": "/przedluzenie-gwarancji"
  },
  "/chair-validation": {
    "/de": "/stuhl-validierung",
    "/en": "/chair-validation",
    "/fr": "/validation-chaise",
    "/it": "/validazione-sedia",
    "/nl": "/stoelvalidatie",
    "/pl": "/walidacja-krzesla"
  },
  "/licencias": {
    "/de": "/lizenzen",
    "/en": "/licenses",
    "/fr": "/licences",
    "/it": "/licenze",
    "/nl": "/licenties",
    "/pl": "/licencje"
  },
  "/desistimiento": {
    "/de": "/widerruf",
    "/en": "/withdrawal",
    "/fr": "/retractation",
    "/it": "/recesso",
    "/nl": "/herroeping",
    "/pl": "/odstapienie"
  },
  "/instrucciones": {
    "/de": "/anleitungen",
    "/en": "/instructions",
    "/fr": "/instructions",
    "/it": "/istruzioni",
    "/nl": "/instructies",
    "/pl": "/instrukcje"
  },
  "/legado": {
    "/de": "/vermaechtnis",
    "/en": "/legacy",
    "/fr": "/heritage",
    "/it": "/eredita",
    "/nl": "/erfenis",
    "/pl": "/dziedzictwo"
  },
  "/devolucion": {
    "/de": "/ruecksendung",
    "/en": "/returns",
    "/fr": "/retours",
    "/it": "/reso",
    "/nl": "/retour",
    "/pl": "/zwrot"
  },
  "/contact": {
    "/de": "/kontakt",
    "/en": "/contact",
    "/fr": "/contact",
    "/it": "/contatti",
    "/nl": "/contact",
    "/pl": "/kontakt"
  },
  "/privacidad": {
    "/de": "/datenschutz",
    "/en": "/privacy-policy",
    "/fr": "/confidentialite",
    "/it": "/privacy",
    "/nl": "/privacy",
    "/pl": "/prywatnosci"
  },
  "/aviso-legal": {
    "/de": "/rechtlicher-hinweis",
    "/en": "/legal-notice",
    "/fr": "/mentions-legales",
    "/it": "/note-legali",
    "/nl": "/juridische-kennisgeving",
    "/pl": "/nota-prawna"
  },
  "/seguimiento-de-pedidos": {
    "/de": "/bestellverfolgung",
    "/en": "/order-tracking",
    "/fr": "/suivi-de-commande",
    "/it": "/tracciamento-ordine",
    "/nl": "/orderopvolging",
    "/pl": "/sledzenie-zamowien"
  },
  "/comparativa": {
    "/de": "/vergleich",
    "/en": "/comparison",
    "/fr": "/comparatif",
    "/it": "/confronto",
    "/nl": "/vergelijking",
    "/pl": "/porownanie"
  },
  // Mismo slug en todos los idiomas (solo existe en ES y EN, ver abajo)
  "/landing-founders": {},
};

/**
 * Versiones de idioma de LOCALIZED_SLUGS que todavía NO existen en Weaverse
 * (comprobado en producción el 26-11-2026). No se anuncian en hreflang ni en
 * el sitemap, y los enlaces internos van directamente a la versión española.
 * Al crear la página en Weaverse, quita su prefijo de esta lista.
 */
const MISSING_TRANSLATIONS: Record<string, string[]> = {
  "/licencias": ["/fr", "/it"], // pendientes: /fr/licences, /it/licenze
  "/chair-validation": ["/it"], // pendiente: /it/validazione-sedia
  "/seguimiento-de-pedidos": ["/de", "/fr"], // pendientes: /de/bestellverfolgung, /fr/suivi-de-commande
  "/landing-founders": ["/de", "/fr", "/it", "/nl", "/pl"],
};

/** Ruta base → ruta que le corresponde en el locale indicado (sin prefijo). */
export function localizePath(basePath: string, prefix: string): string {
  return LOCALIZED_SLUGS[basePath]?.[prefix] ?? basePath;
}

/** Ruta de un locale (sin prefijo) → ruta base en español. */
export function toBasePath(path: string, prefix: string): string {
  for (const [basePath, slugs] of Object.entries(LOCALIZED_SLUGS)) {
    if (slugs[prefix] === path) {
      return basePath;
    }
  }
  return path;
}

/** Rutas base (español) de todas las páginas registradas, para el sitemap. */
export function getRegisteredPages(): string[] {
  return Object.keys(LOCALIZED_SLUGS);
}

/** ¿Existe la versión de esta página en ese idioma? El español siempre existe. */
export function pageExistsIn(basePath: string, prefix: string): boolean {
  return !(prefix && MISSING_TRANSLATIONS[basePath]?.includes(prefix));
}

/**
 * Versiones existentes de una página registrada: prefijo → ruta sin prefijo.
 * Devuelve null si la página no está registrada (no se sabe en qué idiomas
 * existe, así que no se debe anunciar ninguna alternativa).
 */
export function getPageAlternates(
  basePath: string,
): Record<string, string> | null {
  if (!(basePath in LOCALIZED_SLUGS)) {
    return null;
  }
  const alternates: Record<string, string> = {};
  for (const prefix of LOCALE_PREFIXES) {
    if (pageExistsIn(basePath, prefix)) {
      alternates[prefix] = localizePath(basePath, prefix);
    }
  }
  return alternates;
}

/**
 * Separa el prefijo de idioma de un pathname comparando el primer segmento
 * completo ("/devolucion" no es "/de" + "volucion"). Ignora el sufijo .data
 * de las peticiones de datos de React Router y la barra final.
 */
export function splitLocale(pathname: string): { prefix: string; path: string } {
  // "/_root.data" es la petición de datos de la home española
  const clean = pathname.replace(/\.data$/, "").replace(/^\/_root$/, "/");
  const match = clean.match(/^\/([^/]+)(\/.*)?$/);
  if (match) {
    const candidate = `/${match[1].toLowerCase()}`;
    if (candidate in COUNTRIES) {
      return { prefix: candidate, path: trimTrailingSlash(match[2] || "/") };
    }
  }
  return { prefix: "", path: trimTrailingSlash(clean || "/") };
}

function trimTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") || "/" : path;
}

/**
 * Reescribe los enlaces internos de un HTML (el cuerpo de los artículos de
 * Shopify, escrito una vez en español y traducido) al idioma activo:
 * href="/products/x" o href="https://phoenixchairs.eu/products/x" → "/fr/products/x".
 * Así el lector no salta a la versión española; si el handle es el español,
 * Shopify lo redirige (301) al del idioma.
 */
export function localizeHtmlLinks(html: string, targetPrefix: string): string {
  if (!(html && targetPrefix)) {
    return html;
  }
  return html.replace(
    /href="(?:https?:\/\/(?:www\.)?phoenixchairs\.eu)?(\/[^"]*)"/g,
    (_match, path: string) => `href="${localizeHref(path, targetPrefix)}"`,
  );
}

/**
 * Convierte un enlace interno en su URL para el idioma `targetPrefix`
 * ("" = español). Es idempotente y conserva query y hash:
 * - "/legado" o "/fr/legado" (en /fr) → "/fr/heritage"
 * - "/" (en /fr) → "/fr" (sin barra final)
 * - Página registrada sin traducción en ese idioma → versión española.
 * - Un enlace a OTRO idioma ("/de/..." estando en /fr) se respeta: es intencional.
 * - Externos, anclas y rutas relativas se devuelven tal cual.
 * Los handles de producto/colección no se pueden traducir aquí: Shopify los
 * redirige (301) al handle del idioma.
 */
export function localizeHref(href: string, targetPrefix: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return href;
  }
  const [, pathname = "/", rest = ""] = href.match(/^([^?#]*)(.*)$/) ?? [];
  const { prefix, path } = splitLocale(pathname);
  if (prefix && prefix !== targetPrefix) {
    return href;
  }
  const basePath = toBasePath(path, prefix);
  if (!pageExistsIn(basePath, targetPrefix)) {
    return `${basePath}${rest}`;
  }
  const localized = localizePath(basePath, targetPrefix);
  if (!targetPrefix) {
    return `${localized}${rest}`;
  }
  return `${targetPrefix}${localized === "/" ? "" : localized}${rest}`;
}
