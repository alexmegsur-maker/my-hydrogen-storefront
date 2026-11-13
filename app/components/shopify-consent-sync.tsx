import type { VisitorConsent } from "@shopify/hydrogen";
import { useEffect } from "react";
import { getCookieConsent } from "~/components/CookieConsent";

const CONSENT_KEYS = [
  "analytics",
  "marketing",
  "preferences",
  "sale_of_data",
] as const;

/** Traduce las preferencias de nuestro banner al formato de Shopify. */
function desiredConsent(): VisitorConsent | null {
  const stored = getCookieConsent();
  if (!stored) return null;
  return {
    analytics: stored.analytics,
    marketing: stored.marketing,
    preferences: stored.analytics,
    sale_of_data: stored.marketing,
  };
}

/** currentVisitorConsent devuelve "yes" / "no" / "" aunque el tipo diga boolean. */
function matches(current: unknown, wanted: boolean | undefined): boolean {
  if (current === wanted) return true;
  return current === (wanted ? "yes" : "no");
}

function syncConsent(): void {
  const customerPrivacy = window.Shopify?.customerPrivacy;
  if (!customerPrivacy?.setTrackingConsent) return;
  const wanted = desiredConsent();
  if (!wanted) return;

  const current = customerPrivacy.currentVisitorConsent?.() as
    | Record<string, unknown>
    | undefined;
  const alreadySet =
    current && CONSENT_KEYS.every((k) => matches(current[k], wanted[k]));
  if (alreadySet) return;

  customerPrivacy.setTrackingConsent(wanted, (result) => {
    if (result?.error) {
      console.warn("[Consent] Shopify no aceptó el consentimiento:", result.error);
    }
  });
}

/**
 * Comunica a Shopify (Customer Privacy API) lo que el usuario eligió en
 * nuestro banner. Sin esto, los píxeles de Eventos de clientes (GA4, Meta,
 * Google Ads) no se disparan en el checkout para visitantes de la UE.
 */
export function ShopifyConsentSync() {
  useEffect(() => {
    const run = () => {
      try {
        syncConsent();
      } catch (error) {
        console.warn("[Consent] Error sincronizando con Shopify:", error);
      }
    };
    run();
    document.addEventListener("shopifyCustomerPrivacyApiLoaded", run);
    window.addEventListener("cookie_consent_updated", run);
    return () => {
      document.removeEventListener("shopifyCustomerPrivacyApiLoaded", run);
      window.removeEventListener("cookie_consent_updated", run);
    };
  }, []);

  return null;
}
