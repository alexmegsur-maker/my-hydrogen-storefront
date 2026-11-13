import type { HydrogenCart } from "@shopify/hydrogen";
import type { AttributeInput } from "@shopify/hydrogen/storefront-api-types";
import {
  ATTR_CLICK_COOKIE,
  ATTR_FIRST_COOKIE,
  ATTR_LAST_COOKIE,
  type ClickIds,
  clip,
  describeTouch,
  MANAGED_CART_ATTRIBUTE_KEYS,
  parseCookieJson,
  type Touch,
} from "~/utils/attribution";

function readCookies(request: Request): Record<string, string> {
  const header = request.headers.get("Cookie") ?? "";
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return out;
}

/** `_ga=GA1.1.123456789.1700000000` → `123456789.1700000000` */
function gaClientId(raw: string | undefined): string | undefined {
  if (!raw) return;
  const parts = decodeURIComponent(raw).split(".");
  return parts.length >= 4 ? parts.slice(2).join(".") : undefined;
}

/**
 * Session id de GA4 desde la cookie `_ga_<ID>`.
 * Formato antiguo: `GS1.1.1700000000.5.1…` · nuevo: `GS2.1.s1700000000$o5$g1…`
 */
function gaSessionId(cookies: Record<string, string>): string | undefined {
  const key = Object.keys(cookies).find((k) => k.startsWith("_ga_"));
  if (!key) return;
  const raw = decodeURIComponent(cookies[key]);
  if (raw.startsWith("GS1.")) return raw.split(".")[2];
  const match = raw.match(/^GS2\.\d+\.s(\d+)/);
  return match?.[1];
}

/** Atributos de origen que debería llevar el carrito según las cookies. */
export function getAttributionAttributes(request: Request): AttributeInput[] {
  const cookies = readCookies(request);
  const first = parseCookieJson<Touch>(cookies[ATTR_FIRST_COOKIE]);
  const last = parseCookieJson<Touch>(cookies[ATTR_LAST_COOKIE]) ?? first;
  const click = parseCookieJson<ClickIds>(cookies[ATTR_CLICK_COOKIE]);

  const values: Record<string, string | undefined> = {
    _utm_source: clip(last?.s),
    _utm_medium: clip(last?.m),
    _utm_campaign: clip(last?.c),
    _utm_content: clip(last?.ct),
    _utm_term: clip(last?.t),
    _landing: clip(last?.l),
    _referrer: clip(last?.r),
    _first_source: describeTouch(first),
    _gclid: clip(click?.gclid),
    _fbclid: clip(click?.fbclid),
    _ga_client_id: clip(gaClientId(cookies._ga)),
    _ga_session_id: clip(gaSessionId(cookies)),
  };

  return Object.entries(values)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, value]) => ({ key, value }));
}

type CartResult = Awaited<ReturnType<HydrogenCart["get"]>>;

/**
 * Escribe los atributos de origen en el carrito si han cambiado.
 * Conserva los atributos que no son de atribución. Nunca lanza: si falla,
 * devuelve el resultado original para no romper el carrito.
 */
export async function syncCartAttribution<
  R extends { cart?: CartResult | null } | undefined,
>(cart: HydrogenCart, request: Request, result: R): Promise<R> {
  const current = result?.cart;
  if (!current?.id) return result;

  try {
    const managed = new Set<string>(MANAGED_CART_ATTRIBUTE_KEYS);
    const existing = (current.attributes ?? []) as AttributeInput[];
    const desired = getAttributionAttributes(request);

    const merged: AttributeInput[] = [
      ...existing
        .filter((a) => !managed.has(a.key))
        .map(({ key, value }) => ({ key, value: value ?? "" })),
      ...desired,
    ];

    const serialize = (attrs: AttributeInput[]) =>
      attrs
        .filter((a) => managed.has(a.key))
        .map((a) => `${a.key}=${a.value ?? ""}`)
        .sort()
        .join("|");

    if (serialize(existing) === serialize(desired)) return result;

    const updated = await cart.updateAttributes(merged, { cartId: current.id });
    return (updated?.cart ? updated : result) as R;
  } catch (error) {
    console.error("[Attribution] No se pudieron guardar los atributos:", error);
    return result;
  }
}
