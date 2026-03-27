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
    country: "US",
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
    language: "EN",
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
    language: "EN",
    country: "IT",
    currency: "EUR",
    
  },
  // "/en-jp": {
  //   label: "Japan (JPY ¥)",
  //   language: "EN",
  //   country: "JP",
  //   currency: "JPY",
  // },

  // "/en-nl": {
  //   label: "Netherlands (EUR €)",
  //   language: "EN",
  //   country: "NL",
  //   currency: "EUR",
  // },
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

export const FILTER_URL_PREFIX = "filter.";
