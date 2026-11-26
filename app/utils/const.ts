import type { I18nLocale, Localizations } from "~/types/others";

export const COUNTRIES: Localizations = {
  default: {
    label: "Español",
    language: "ES",
    country: "ES",
    currency: "EUR",
  },
  "/en": {
    label: "English",
    language: "EN",
    country: "GB",
    currency: "EUR",
  },
  // "/en-au": {
  //   label: "Australia (AUD $)",
  //   language: "EN",
  //   country: "AU",
  //   currency: "AUD",
  // },
  // "/en-ca": {
  //   label: "Canada (CAD $)",
  //   language: "EN",
  //   country: "CA",
  //   currency: "CAD", 
  // },
  // "/en-cn": {
  //   label: "China (CNY ¥)",
  //   language: "EN",
  //   country: "CN",
  //   currency: "CNY",
  // },
  "/de": {
    label: "Deutsch",
    language: "DE",
    country: "DE",
    currency: "EUR",
  },
  // "/en-es": {
  //   label: "Spain (EUR €)",
  //   language: "EN",
  //   country: "ES",
  //   currency: "EUR",
  // },
  "/fr": {
    label: "français",
    language: "FR",
    country: "FR",
    currency: "EUR",
  },
  // "/en-gb": {
  //   label: "United Kingdom (GBP £)",
  //   language: "EN",
  //   country: "GB",
  //   currency: "GBP",
  // },
  "/it": {
    label: "Italiano",
    language: "IT",
    country: "IT",
    currency: "EUR",
  },
  // "/en-jp": {
  //   label: "Japan (JPY ¥)",
  //   language: "EN",
  //   country: "JP",
  //   currency: "JPY",
  // },

  "/pl": {
    label: "Polski",
    language: "PL",
    country: "PL",
    currency: "EUR",
  },
  "/nl": {
    label: "Nederlands",
    language: "NL",
    country: "NL",
    currency: "EUR",
  },
  // "/en-vn": {
  //   label: "Vietnam (VND ₫)",
  //   language: "EN",
  //   country: "VN",
  //   currency: "VND",
  // },
};

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...COUNTRIES.default,
  pathPrefix: "",
});

/** Dominio público de producción (canonical, hreflang, sitemap). */
export const SITE_ORIGIN = "https://phoenixchairs.eu";

/**
 * Prefijos de idioma servidos, derivados de COUNTRIES ("" = español, raíz).
 * Única fuente para hreflang, sitemap, robots y enlaces: un idioma nuevo en
 * COUNTRIES aparece en todos ellos sin tocar nada más.
 */
export const LOCALE_PREFIXES: string[] = [
  "",
  ...Object.keys(COUNTRIES).filter((key) => key !== "default"),
];

/**
 * Versión a la que apunta hreflang="x-default" (quien busca en un idioma que
 * no tenemos: portugués, sueco, checo...). Si un recurso no existe en ese
 * idioma, se usa la versión española.
 */
export const X_DEFAULT_PREFIX = "/en";

export const FILTER_URL_PREFIX = "filter.";
