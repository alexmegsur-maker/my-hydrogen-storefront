import type { SeoConfig } from "@shopify/hydrogen";
import { flattenConnection, getSeoMeta } from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data } from "react-router";
import type { BlogQuery } from "storefront-api.generated";
import invariant from "tiny-invariant";
import { getResourceHreflang } from "~/.server/hreflang";
import { redirectIfHandleIsLocalized } from "~/.server/redirect";
import { applyWeaverseSeo, seoPayload } from "~/.server/seo";
import { routeHeaders } from "~/utils/cache";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export const loader = async (args: LoaderFunctionArgs) => {
  const { params, request, context } = args;
  const storefront = context.storefront;
  const { language, country } = storefront.i18n;
  const blogHandle = params?.blogHandle;

  invariant(blogHandle, "Missing blog handle");

  // Load blog data and weaverseData in parallel
  const [{ blog }, weaverseData] = await Promise.all([
    storefront.query<BlogQuery>(BLOGS_QUERY, {
      variables: { blogHandle, pageBy: 16, language },
    }),
    context.weaverse.loadPage({ type: "BLOG", handle: blogHandle }),
  ]);

  if (!blog?.articles) {
    throw new Response("Not found", { status: 404 });
  }
  redirectIfHandleIsLocalized(request, {
    handle: blogHandle,
    data: blog,
  });

  const articles = flattenConnection(blog.articles).map((article) => {
    const { publishedAt } = article;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(publishedAt)),
    };
  });

  const seo = applyWeaverseSeo(seoPayload.blog({ blog, url: request.url }), weaverseData);
  // Clúster hreflang con el handle traducido del blog en cada idioma (root.tsx)
  const hreflang = await getResourceHreflang(storefront, "blogs", blog.id);

  return data({ blog, articles, seo, hreflang, weaverseData });
};

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return getSeoMeta(loaderData?.seo as SeoConfig);
};

export default function Blogs() {
  return <WeaverseContent />;
}

// country: ver LAYOUT_QUERY (app/.server/root.ts). Hydrogen lo inyecta.
const BLOGS_QUERY = `#graphql
  query blog(
    $country: CountryCode
    $language: LanguageCode
    $blogHandle: String!
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    blog(handle: $blogHandle) {
      id
      title
      handle
      seo {
        title
        description
      }
      articles(first: $pageBy, after: $cursor) {
        edges {
          node {
            ...ArticleCard
          }
        }
      }
    }
  }

  fragment ArticleCard on Article {
    author: authorV2 {
      name
    }
    contentHtml
    excerpt
    excerptHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
  }
` as const;
