import { data } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

const SOFTWARE_METAFIELD_QUERY = `#graphql
  query ProductSoftwareAPI(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      software: metafield(namespace: "custom", key: "software") {
        references(first: 20) {
          nodes {
            ... on GenericFile {
              id
              url
              alt
              mimeType
            }
            ... on MediaImage {
              id
              image { url altText }
            }
          }
        }
      }
    }
  }
` as const;

function getFileName(url: string): string {
  try {
    const segments = new URL(url).pathname.split("/");
    return decodeURIComponent(segments[segments.length - 1] ?? "archivo");
  } catch {
    return url.split("/").pop() ?? "archivo";
  }
}

function parseNodes(nodes: any[]) {
  return nodes
    .map((node: any) => {
      if (node?.url) {
        return {
          id: node.id,
          url: node.url,
          name: node.alt || getFileName(node.url),
          mimeType: node.mimeType ?? null,
        };
      }
      if (node?.image?.url) {
        return {
          id: node.id,
          url: node.image.url,
          name: node.image.altText || getFileName(node.image.url),
          mimeType: "image/*",
        };
      }
      return null;
    })
    .filter(Boolean);
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle");

  if (!handle) return data({ files: [] });

  const { storefront } = context;
  const { country, language } = storefront.i18n;

  try {
    // Race against a 6 s timeout to protect against missing read_files scope
    const queryPromise = storefront.query(SOFTWARE_METAFIELD_QUERY, {
      variables: { handle, country, language },
    });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 6000),
    );

    const result = await Promise.race([queryPromise, timeoutPromise]);
    const nodes: any[] = result?.product?.software?.references?.nodes ?? [];
    return data({ files: parseNodes(nodes) });
  } catch {
    return data({ files: [] });
  }
}
