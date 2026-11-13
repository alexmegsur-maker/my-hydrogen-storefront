import { useEffect } from "react";
import { getCookieConsent } from "~/components/CookieConsent";
import {
  ATTR_CLICK_COOKIE,
  ATTR_FIRST_COOKIE,
  ATTR_LAST_COOKIE,
  ATTRIBUTION_MAX_AGE,
  type ClickIds,
  clip,
  hostOf,
  parseCookieJson,
  type Touch,
} from "~/utils/attribution";

/** Dominios que no cuentan como "origen" (la propia tienda, checkout, pagos). */
const IGNORED_REFERRER_HOSTS = [
  "myshopify.com",
  "shopify.com",
  "shop.app",
  "paypal.com",
  "stripe.com",
];

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

function writeCookie(name: string, value: unknown): void {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${ATTRIBUTION_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function externalReferrer(): string | undefined {
  const ref = document.referrer;
  if (!ref) return;
  const host = hostOf(ref);
  if (!host) return;
  const ownHost = location.hostname.replace(/^www\./, "");
  if (host === ownHost || host.endsWith(`.${ownHost}`)) return;
  if (IGNORED_REFERRER_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    return;
  }
  return clip(ref);
}

/** gclid/fbclid de la URL de entrada, en memoria hasta que haya consentimiento. */
let pendingClickIds: ClickIds | null = null;

function persistClickIds(): void {
  const consent = getCookieConsent();
  if (!consent?.marketing) {
    // Sin consentimiento de marketing no se guardan (y se borran si existían).
    if (consent) deleteCookie(ATTR_CLICK_COOKIE);
    return;
  }
  if (!pendingClickIds) return;
  const stored = parseCookieJson<ClickIds>(readCookie(ATTR_CLICK_COOKIE)) ?? {};
  writeCookie(ATTR_CLICK_COOKIE, { ...stored, ...pendingClickIds });
  pendingClickIds = null;
}

function captureEntry(): void {
  const params = new URLSearchParams(location.search);
  const utm: Touch = {
    s: clip(params.get("utm_source")),
    m: clip(params.get("utm_medium")),
    c: clip(params.get("utm_campaign")),
    ct: clip(params.get("utm_content")),
    t: clip(params.get("utm_term")),
  };
  const gclid = clip(params.get("gclid"));
  const fbclid = clip(params.get("fbclid"));
  const referrer = externalReferrer();

  const hasUtm = Object.values(utm).some(Boolean);
  const isNewEntry = hasUtm || Boolean(gclid || fbclid || referrer);

  const touch: Touch = {
    ...utm,
    // Sin UTM pero con gclid/fbclid: rellenamos origen igualmente.
    ...(!hasUtm && gclid ? { s: "google", m: "cpc" } : {}),
    ...(!(hasUtm || gclid) && fbclid ? { s: "facebook", m: "paid_social" } : {}),
    r: referrer,
    l: clip(location.pathname + location.search),
    ts: new Date().toISOString(),
  };

  if (!readCookie(ATTR_FIRST_COOKIE)) writeCookie(ATTR_FIRST_COOKIE, touch);
  // Last touch = última entrada no directa (o la primera si no hay otra).
  if (isNewEntry || !readCookie(ATTR_LAST_COOKIE)) {
    writeCookie(ATTR_LAST_COOKIE, touch);
  }

  if (gclid || fbclid) {
    pendingClickIds = {
      ...(gclid ? { gclid } : {}),
      ...(fbclid ? { fbclid } : {}),
    };
  }
  persistClickIds();
}

/** Guarda el origen de la visita para adjuntarlo después al carrito. */
export function AttributionTracker() {
  useEffect(() => {
    try {
      captureEntry();
    } catch {
      // cookies bloqueadas: la atribución es opcional
    }
    const onConsent = () => {
      try {
        persistClickIds();
      } catch {
        // noop
      }
    };
    window.addEventListener("cookie_consent_updated", onConsent);
    return () => window.removeEventListener("cookie_consent_updated", onConsent);
  }, []);

  return null;
}
