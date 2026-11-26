import type { SeoConfig } from "@shopify/hydrogen";
import { getSeoMeta } from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaArgs } from "react-router";
import { redirect } from "react-router";
import { applyWeaverseSeo, seoPayload } from "~/.server/seo";
import { routeHeaders } from "~/utils/cache";
import {
  localizeHref,
  pageExistsIn,
  splitLocale,
  toBasePath,
} from "~/utils/localized-paths";
import { validateWeaverseData, WeaverseContent } from "~/weaverse";

export let headers = routeHeaders;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const weaverseData = await context.weaverse.loadPage({
    type: "CUSTOM",
  });

  try {
    validateWeaverseData(weaverseData);
  } catch (e) {
    if (e instanceof Response && e.status === 404) {
      const { pathname, search } = new URL(request.url);
      const { prefix, path } = splitLocale(pathname);

      if (prefix && path !== "/") {
        // La página no existe con este slug en este idioma. Si es una página
        // registrada, se busca su URL correcta: el slug traducido (301,
        // /de/tecnologia → /de/technologie) o, si esa traducción aún no existe,
        // la versión española (302, temporal hasta que se cree en Weaverse).
        const basePath = toBasePath(path, prefix);
        const target = localizeHref(basePath, prefix);
        if (target !== `${prefix}${path}`) {
          const isPermanent = pageExistsIn(basePath, prefix);
          throw redirect(`${target}${search}`, isPermanent ? 301 : 302);
        }
        // Página no registrada: se prueba la versión española (temporal)
        throw redirect(`${basePath}${search}`, 302);
      }
    }
    throw e;
  }

  const seo = applyWeaverseSeo(
    // Canonical normalizado: debe coincidir con su entrada hreflang
    seoPayload.customPage({ url: request.url }),
    weaverseData,
  );

  return { weaverseData, seo };
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  return getSeoMeta(
    ...matches.map((m) => (m.data as any)?.seo as SeoConfig).filter(Boolean),
  );
};

export default function Component() {
  return <WeaverseContent />;
}
