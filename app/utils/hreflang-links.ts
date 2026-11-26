import {
  COUNTRIES,
  LOCALE_PREFIXES,
  SITE_ORIGIN,
  X_DEFAULT_PREFIX,
} from "~/utils/const";
import {
  getPageAlternates,
  localizeHref,
  splitLocale,
  toBasePath,
} from "~/utils/localized-paths";

/**
 * hreflang compartido por el <head> (root.tsx), el sitemap y los selectores
 * de idioma. Se puede usar en cliente y servidor (sin dependencias .server).
 */
export type HreflangLink = { hreflang: string; href: string };

/** Rutas que no se indexan: no emiten hreflang en ningún idioma. */
const NON_INDEXABLE_PATHS = [
  "/cart",
  "/account",
  "/search",
  "/policies",
  "/api",
  "/discount",
];

/** Rutas que existen con el mismo path en todos los idiomas. */
const INVARIANT_PATHS = ["/", "/products", "/collections"];

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

/** URL absoluta canónica de `path` (sin prefijo) en el idioma `prefix`. */
export function localeUrl(prefix: string, path: string): string {
  return toCanonicalUrl(`${prefix}${path === "/" && prefix ? "" : path}`);
}

/** Código hreflang de un prefijo ("" → "es", "/de" → "de"). */
export function hreflangCode(prefix: string): string {
  return COUNTRIES[prefix || "default"].language.toLowerCase();
}

/**
 * Clúster hreflang a partir de las versiones que EXISTEN de una página
 * (prefijo → ruta sin prefijo). Añade x-default (X_DEFAULT_PREFIX, o el
 * español si esa versión no existe). Con una sola versión no hay clúster.
 */
export function buildHreflangCluster(
  versions: Record<string, string>,
): HreflangLink[] {
  const prefixes = LOCALE_PREFIXES.filter((prefix) => prefix in versions);
  if (prefixes.length < 2) {
    return [];
  }
  const links = prefixes.map((prefix) => ({
    hreflang: hreflangCode(prefix),
    href: localeUrl(prefix, versions[prefix]),
  }));
  const xDefaultPrefix =
    X_DEFAULT_PREFIX in versions
      ? X_DEFAULT_PREFIX
      : "" in versions
        ? ""
        : prefixes[0];
  links.push({
    hreflang: "x-default",
    href: localeUrl(xDefaultPrefix, versions[xDefaultPrefix]),
  });
  return links;
}

function isNonIndexable(path: string): boolean {
  return NON_INDEXABLE_PATHS.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

/**
 * Decide qué clúster hreflang emitir para la URL actual:
 * - Error/404 y rutas no indexables (carrito, cuenta, búsqueda...): nada.
 * - Productos, colecciones, blogs, artículos y pages lo aportan desde su
 *   loader (`hreflang`), con el handle traducido de cada idioma.
 * - Home y listados /products, /collections: los 7 idiomas.
 * - Páginas Weaverse registradas en localized-paths: solo sus versiones
 *   existentes. Las no registradas no emiten nada (mejor omitir que anunciar
 *   versiones que redirigen o dan 404).
 */
export function getHreflangLinks({
  pathname,
  matches,
  hasError,
}: {
  pathname: string;
  matches: ReadonlyArray<{ data?: unknown }>;
  hasError: boolean;
}): HreflangLink[] {
  if (hasError) {
    return [];
  }
  const { prefix, path } = splitLocale(pathname);
  if (isNonIndexable(path)) {
    return [];
  }
  for (const match of matches) {
    const routeHreflang = (match.data as { hreflang?: HreflangLink[] } | null)
      ?.hreflang;
    if (Array.isArray(routeHreflang)) {
      return routeHreflang;
    }
  }
  if (INVARIANT_PATHS.includes(path)) {
    return buildHreflangCluster(
      Object.fromEntries(LOCALE_PREFIXES.map((p) => [p, path])),
    );
  }
  const alternates = getPageAlternates(toBasePath(path, prefix));
  return alternates ? buildHreflangCluster(alternates) : [];
}

/**
 * Ruta (sin dominio) a la que debe llevar el selector de idioma al cambiar a
 * `targetPrefix`: la versión equivalente del clúster hreflang si existe; en
 * rutas que existen en todos los idiomas (carrito, búsqueda, cuenta...), la
 * misma ruta en el nuevo idioma; si no, la home de ese idioma.
 */
export function getLocaleSwitchPath({
  pathname,
  search,
  links,
  targetPrefix,
}: {
  pathname: string;
  search: string;
  links: HreflangLink[];
  targetPrefix: string;
}): string {
  const code = hreflangCode(targetPrefix);
  const alternate = links.find((link) => link.hreflang === code);
  if (alternate) {
    try {
      return `${new URL(alternate.href).pathname}${search}`;
    } catch {
      // href no válido: se usa la lógica de abajo
    }
  }
  const { path } = splitLocale(pathname);
  if (isNonIndexable(path) || INVARIANT_PATHS.includes(path)) {
    return `${localizeHref(path, targetPrefix)}${search}`;
  }
  return targetPrefix || "/";
}
