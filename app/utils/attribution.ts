/**
 * Atribución de origen del pedido (first-touch / last-touch).
 *
 * El cliente guarda el origen de la visita en cookies de primera parte
 * (30 días) y el servidor las lee al mutar el carrito para escribirlas
 * como atributos ocultos (`_utm_source`, `_gclid`, …). Así cada pedido de
 * Shopify lleva su origen en "Atributos adicionales".
 */

export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 30; // 30 días
export const ATTR_FIRST_COOKIE = "_attr_first";
export const ATTR_LAST_COOKIE = "_attr_last";
/** gclid / fbclid: solo se guardan con consentimiento de marketing. */
export const ATTR_CLICK_COOKIE = "_attr_click";

export interface Touch {
  /** utm_source */
  s?: string;
  /** utm_medium */
  m?: string;
  /** utm_campaign */
  c?: string;
  /** utm_content */
  ct?: string;
  /** utm_term */
  t?: string;
  /** referrer externo */
  r?: string;
  /** página de entrada (path + query) */
  l?: string;
  /** fecha ISO */
  ts?: string;
}

export interface ClickIds {
  gclid?: string;
  fbclid?: string;
}

/** Claves de atributo del carrito que gestiona este sistema. */
export const MANAGED_CART_ATTRIBUTE_KEYS = [
  "_utm_source",
  "_utm_medium",
  "_utm_campaign",
  "_utm_content",
  "_utm_term",
  "_landing",
  "_referrer",
  "_first_source",
  "_gclid",
  "_fbclid",
  "_ga_client_id",
  "_ga_session_id",
] as const;

const MAX_VALUE_LENGTH = 255;

export function clip(value: string | null | undefined): string | undefined {
  if (!value) return;
  const v = value.trim();
  return v ? v.slice(0, MAX_VALUE_LENGTH) : undefined;
}

export function parseCookieJson<T>(raw: string | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return null;
  }
}

/** Resumen legible "source / medium / campaign" de un touch. */
export function describeTouch(touch: Touch | null): string | undefined {
  if (!touch) return;
  const source = touch.s ?? (touch.r ? hostOf(touch.r) : undefined) ?? "(direct)";
  const medium = touch.m ?? (touch.r ? "referral" : "(none)");
  return clip([source, medium, touch.c].filter(Boolean).join(" / "));
}

export function hostOf(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return;
  }
}
