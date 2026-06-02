import type { LoaderFunctionArgs } from "react-router";

const BASE_URL = "https://phoenixchairs.eu";

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const allProducts: any[] = [];
  let cursor: string | null = null;

  do {
    const { products } = await storefront.query(GOOGLE_SHOPPING_QUERY, {
      variables: { first: 250, cursor },
    });
    allProducts.push(...products.nodes);
    cursor = products.pageInfo.hasNextPage ? products.pageInfo.endCursor : null;
  } while (cursor);

  return new Response(generateFeed(allProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateFeed(products: any[]): string {
  const items = products.flatMap((product) => {
    const productIdNumeric = product.id.split("/").pop();
    const productImages: string[] = product.images.nodes.map((img: any) => img.url);

    return product.variants.nodes.map((variant: any) => {
      const variantIdNumeric = variant.id.split("/").pop();
      const isDefaultVariant = variant.title === "Default Title";

      const title = isDefaultVariant
        ? product.title
        : `${product.title} - ${variant.title}`;

      const variantParams = variant.selectedOptions
        .map((opt: any) => `${encodeURIComponent(opt.name)}=${encodeURIComponent(opt.value)}`)
        .join("&");
      const productUrl = isDefaultVariant
        ? `${BASE_URL}/products/${product.handle}`
        : `${BASE_URL}/products/${product.handle}?${variantParams}`;

      const imageUrl = variant.image?.url || product.featuredImage?.url || "";
      const availability = variant.availableForSale ? "in stock" : "out of stock";
      const price = `${Number(variant.price.amount).toFixed(2)} ${variant.price.currencyCode}`;

      const extraImages = productImages
        .filter((url) => url !== imageUrl)
        .slice(0, 9)
        .map((url) => `      <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
        .join("\n");

      const salePriceLine =
        variant.compareAtPrice &&
        Number(variant.compareAtPrice.amount) > Number(variant.price.amount)
          ? `      <g:sale_price>${price}</g:sale_price>\n      <g:original_price>${Number(variant.compareAtPrice.amount).toFixed(2)} ${variant.compareAtPrice.currencyCode}</g:original_price>`
          : "";

      const gtinLine = variant.barcode ? `      <g:gtin>${escapeXml(variant.barcode)}</g:gtin>` : "";
      const mpnLine = variant.sku ? `      <g:mpn>${escapeXml(variant.sku)}</g:mpn>` : "";

      const colorOption = variant.selectedOptions.find((o: any) => o.name.toLowerCase() === "color");
      const colorLine = colorOption ? `      <g:color>${escapeXml(colorOption.value)}</g:color>` : "";

      return [
        "    <item>",
        `      <g:id>${escapeXml(variantIdNumeric)}</g:id>`,
        `      <g:item_group_id>${escapeXml(productIdNumeric)}</g:item_group_id>`,
        `      <title>${escapeXml(title)}</title>`,
        `      <description>${escapeXml(product.description || product.title)}</description>`,
        `      <link>${escapeXml(productUrl)}</link>`,
        `      <g:image_link>${escapeXml(imageUrl)}</g:image_link>`,
        extraImages,
        `      <g:price>${price}</g:price>`,
        salePriceLine,
        `      <g:availability>${availability}</g:availability>`,
        `      <g:condition>new</g:condition>`,
        `      <g:brand>${escapeXml(product.vendor || "Phoenix Chairs")}</g:brand>`,
        gtinLine,
        mpnLine,
        colorLine,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Phoenix Chairs</title>
    <link>${BASE_URL}</link>
    <description>Catálogo de productos Phoenix Chairs</description>
${items.join("\n")}
  </channel>
</rss>`;
}

const GOOGLE_SHOPPING_QUERY = `#graphql
  query GoogleShoppingFeed($first: Int!, $cursor: String) {
    products(first: $first, after: $cursor, query: "status:active") {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        handle
        vendor
        description
        featuredImage {
          url
        }
        images(first: 10) {
          nodes {
            url
          }
        }
        variants(first: 100) {
          nodes {
            id
            title
            sku
            barcode
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
` as const;
