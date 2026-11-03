/**
 * Páginas cuyo slug cambia según el idioma. La clave es la ruta base (español,
 * sin prefijo de locale) y cada entrada indica el slug que usa ese locale.
 * Los locales que no aparecen conservan el slug base.
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
    "/nl": "/garantie-uitbreiding",
    "/pl": "/przedluzenie-gwarancji"
  },
  "/chair-validation": {
    "/de": "/stuhl-validierung",
    "/en": "/chair-validation",
    "/fr": "/validation-chaise",
    "/it": "/validazione-sedia",
    "/nl": "/stoel-validatie",
    "/pl": "/weryfikacja-fotela"
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
    "/pl": "/odstapienie-od-umowy"
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
    "/nl": "/erfgoed",
    "/pl": "/dziedzictwo"
  },
  "/devolucion": {
    "/de": "/ruecksendung",
    "/en": "/returns",
    "/fr": "/retours",
    "/it": "/reso",
    "/nl": "/retourneren",
    "/pl": "/zwroty"
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
    "/nl": "/privacybeleid",
    "/pl": "/polityka-prywatnosci"
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
    "/nl": "/bestelling-volgen",
    "/pl": "/sledzenie-zamowienia"
  },
  "/comparativa": {
    "/de": "/vergleich",
    "/en": "/comparison",
    "/fr": "/comparatif",
    "/it": "/confronto",
    "/nl": "/vergelijking",
    "/pl": "/porownanie"
  }

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
