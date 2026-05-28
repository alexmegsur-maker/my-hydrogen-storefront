import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";

const LIVE_ACTIVITY_QUERY = `#graphql
  query LiveActivity($first: Int!) {
    metaobjects(type: "live_system", first: $first, reverse:true) {
      nodes {
        id
        fields {
          key
          value
        }
      }
    }
  }
` as const;

export async function loader({
  request,
  context: { storefront },
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const first = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

  try {
    const result = await storefront.query(LIVE_ACTIVITY_QUERY, {
      variables: { first },
    });

    const { metaobjects } = result

    const items = (metaobjects.nodes as any[]).map((node: any) => {
      const fields: Record<string, string> = {};
      for (const field of node.fields) {
        if (field.value !== null) fields[field.key] = field.value;
      }
      return {
        id: node.id as string,
        nombre: fields.nombre ?? "",
        type: fields.type ?? "",
        date: fields.date ?? "",
        product: fields.product ?? null,
        rating: fields.rating != null ? parseFloat(fields.rating) : null,
      };
    });

    return data({ items });
  } catch (err) {
    console.error("[live-activity]", err);
    return data({ items: [] });
  }
}
