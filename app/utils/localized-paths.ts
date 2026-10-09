/**
 * Páginas cuyo slug cambia según el idioma. La clave es la ruta base (español,
 * sin prefijo de locale) y cada entrada indica el slug que usa ese locale.
 * Los locales que no aparecen conservan el slug base.
 */
const LOCALIZED_SLUGS: Record<string, Record<string, string>> = {
  "/tecnologia": { "/de": "/technologie" },
  "/garantia-base": { "/de": "/basisgarantie" },
  "/extension-de-garantia": { "/de": "/garantieverlaengerung" },
  "/chair-validation": { "/de": "/stuhl-validierung" },
  "/licencias": { "/de": "/lizenzen" },
  "/desistimiento": { "/de": "/widerruf" },
  "/instrucciones": { "/de": "/anleitungenanleitungen" },
  "/legado": { "/de": "/vermaechtnis" },
  "/devolucion": { "/de": "/ruecksendung" },
  "/contact": { "/de": "/kontakt" },
  "/privacidad": { "/de": "/datenschutz" },
  "/aviso-legal": { "/de": "/rechtlicher-hinweis" },

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
