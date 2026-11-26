import type { SeoConfig } from "@shopify/hydrogen";
import { getPaginationVariables, getSeoMeta } from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import invariant from "tiny-invariant";
import { seoPayload } from "~/.server/seo";
import { PRODUCT_CARD_FRAGMENT } from "~/graphql/fragments";
import { routeHeaders } from "~/utils/cache";
import { translations } from "~/utils/translations";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader({
  request,
  context: { storefront, weaverse },
}: LoaderFunctionArgs) {
  // Load products data and weaverseData in parallel
  const [data, weaverseData] = await Promise.all([
    storefront.query(ALL_PRODUCTS_QUERY, {
      variables: {
        ...getPaginationVariables(request, { pageBy: 16 }),
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
    weaverse.loadPage({ type: "ALL_PRODUCTS" }),
  ]);

  invariant(data, "No data returned from Shopify API");

  // Título y descripción en el idioma de la URL (antes, texto de plantilla en inglés)
  const t = translations[storefront.i18n.language] ?? translations.ES;
  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: "all-products",
      title: t.seo_products,
      handle: "products",
      description: t.seo_productsDescription,
      seo: {
        title: t.seo_products,
        description: t.seo_productsDescription,
      },
      products: data.products,
    },
  });

  return {
    products: data.products,
    seo,
    weaverseData,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getSeoMeta(data.seo as SeoConfig);
};
export default function AllProducts() {
  return <WeaverseContent />;
}

const ALL_PRODUCTS_QUERY = `#graphql
  query allProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
