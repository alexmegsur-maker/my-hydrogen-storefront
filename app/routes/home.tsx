import { AnalyticsPageType, getSeoMeta } from "@shopify/hydrogen";
import type { PageType } from "@weaverse/hydrogen";
import type { LoaderFunctionArgs, MetaArgs } from "react-router";
import type { ShopQuery } from "storefront-api.generated";
import { applyWeaverseSeo, seoPayload } from "~/.server/seo";
import { routeHeaders } from "~/utils/cache";
import { validateWeaverseData, WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const { params, context, request } = args;
  const { pathPrefix } = context.storefront.i18n;
  const locale = pathPrefix?.slice(1) || "";
  let type: PageType = "INDEX";
  const isCustomPage =
    !!params.locale && params.locale.toLowerCase() !== locale;

  if (isCustomPage) {
    // Update for Weaverse: if it not locale, it probably is a custom page handle
    type = "CUSTOM";
  }

  // Load async data in parallel for better performance
  const [weaverseData, { shop }] = await Promise.all([
    context.weaverse.loadPage({ type }),
    context.storefront.query<ShopQuery>(SHOP_QUERY),
  ]);

  // Check weaverseData after parallel loading
  validateWeaverseData(weaverseData);

  const seo = applyWeaverseSeo(seoPayload.home({ url: request.url }), weaverseData);

  return {
    shop,
    weaverseData,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  };
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  const tags = getSeoMeta(
    ...matches.map((match) => (match.data as any)?.seo).filter(Boolean),
  );
  return [
    ...tags,
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};
export default function Homepage() {
  return <WeaverseContent />;
}

const SHOP_QUERY = `#graphql
  query shop($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      name
      description
    }
  }
` as const;
