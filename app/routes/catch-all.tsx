import type { SeoConfig } from "@shopify/hydrogen";
import { getSeoMeta } from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaArgs } from "react-router";
import { redirect } from "react-router";
import { applyWeaverseSeo } from "~/.server/seo";
import { COUNTRIES } from "~/utils/const";
import { validateWeaverseData, WeaverseContent } from "~/weaverse";

const LOCALE_PREFIXES = Object.keys(COUNTRIES).filter((k) => k !== "default");

export async function loader({ request, context }: LoaderFunctionArgs) {
  const weaverseData = await context.weaverse.loadPage({
    type: "CUSTOM",
  });

  try {
    validateWeaverseData(weaverseData);
  } catch (e) {
    if (e instanceof Response && e.status === 404) {
      const { pathname } = new URL(request.url);
      const segments = pathname.split("/").filter(Boolean);
      const locale = `/${segments[0]}`;

      if (segments.length >= 2 && LOCALE_PREFIXES.includes(locale)) {
        const handle = segments.slice(1).join("/");
        throw redirect(`/${handle}`, 301);
      }
    }
    throw e;
  }

  const seo = applyWeaverseSeo(
    {
      title: "",
      description: "",
      titleTemplate: "%s | PhoenixChairs",
      url: request.url,
      robots: { noIndex: false, noFollow: false },
    },
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
