import * as remixBuild from "virtual:react-router/server-build"; // Virtual entry point for the app
import { storefrontRedirect } from "@shopify/hydrogen";
import { createRequestHandler } from "@shopify/hydrogen/oxygen";
import { createHydrogenRouterContext } from "~/.server/context";

// Map de país → prefijo de locale (países no listados usan el default = español)
const COUNTRY_TO_LOCALE: Record<string, string> = {
  // Alemán
  DE: "/de",
  AT: "/de",
  // Francés
  FR: "/fr",
  BE: "/fr",
  LU: "/fr",
  MC: "/fr",
  // Italiano
  IT: "/it",
  // Inglés
  US: "/en",
  GB: "/en",
  AU: "/en",
  CA: "/en",
  NZ: "/en",
  IE: "/en",
  IN: "/en",
  SG: "/en",
  ZA: "/en",
  JP: "/en",
  KR: "/en",
  CN: "/en",
  BR: "/en",
  PL: "/en",
  NL: "/en",
  SE: "/en",
  NO: "/en",
  DK: "/en",
  FI: "/en",
  PT: "/en",
  RU: "/en",
  TR: "/en",
};

// Fallback por Accept-Language cuando CF-IPCountry no está disponible (dev local)
const LANGUAGE_TO_LOCALE: Record<string, string> = {
  de: "/de",
  fr: "/fr",
  it: "/it",
  en: "/en",
};

const KNOWN_PREFIXES = ["/en", "/de", "/fr", "/it"];

// Rutas que nunca deben redirigirse
const SKIP_PREFIXES = ["/api/", "/robots.txt", "/sitemap", "/_", "/favicon"];

function shouldAutoRedirect(url: URL): boolean {
  const path = url.pathname;
  if (SKIP_PREFIXES.some((p) => path.startsWith(p))) return false;
  if (KNOWN_PREFIXES.some((p) => path === p || path.startsWith(p + "/")))
    return false;
  return true;
}

function detectTargetLocale(request: Request): string {
  // En Oxygen/Cloudflare, este header contiene el código de país ISO 3166-1
  const cfCountry = request.headers.get("CF-IPCountry");
  if (cfCountry && cfCountry !== "XX" && cfCountry !== "T1") {
    return COUNTRY_TO_LOCALE[cfCountry] ?? "";
  }

  // Fallback para desarrollo local: Accept-Language
  const acceptLang = request.headers.get("Accept-Language") ?? "";
  const primaryLang = acceptLang
    .split(",")[0]
    ?.split(/[-;]/)[0]
    ?.toLowerCase();
  return (primaryLang && LANGUAGE_TO_LOCALE[primaryLang]) || "";
}

function getLocaleCookie(cookieHeader: string): string | null {
  const match = cookieHeader.match(/(?:^|;\s*)locale_pref=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const url = new URL(request.url);

      // Redirección automática por país (solo en rutas de página sin prefijo ya establecido)
      if (shouldAutoRedirect(url)) {
        const cookieHeader = request.headers.get("Cookie") ?? "";
        const savedLocale = getLocaleCookie(cookieHeader);

        // Si el usuario ya eligió manualmente un locale, respetarlo
        const targetPrefix =
          savedLocale !== null ? savedLocale : detectTargetLocale(request);

        if (targetPrefix) {
          const redirectUrl = `${url.origin}${targetPrefix}${url.pathname}${url.search}`;
          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
              "Cache-Control": "no-store",
              "Set-Cookie": `locale_pref=${encodeURIComponent(targetPrefix)}; Path=/; Max-Age=31536000; SameSite=Lax`,
            },
          });
        }
      }

      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      // Cuando el usuario navega a un locale específico, guardar su preferencia
      const currentPrefix = KNOWN_PREFIXES.find(
        (p) => url.pathname === p || url.pathname.startsWith(p + "/"),
      );
      const cookieHeader = request.headers.get("Cookie") ?? "";
      const savedLocale = getLocaleCookie(cookieHeader);

      if (currentPrefix && savedLocale !== currentPrefix) {
        response.headers.append(
          "Set-Cookie",
          `locale_pref=${encodeURIComponent(currentPrefix)}; Path=/; Max-Age=31536000; SameSite=Lax`,
        );
      }

      if (hydrogenContext.session.isPending) {
        response.headers.append(
          "Set-Cookie",
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response("An unexpected error occurred", { status: 500 });
    }
  },
};
