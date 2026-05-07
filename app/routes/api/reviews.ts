import {data} from "react-router"
import {  type LoaderFunctionArgs } from "@shopify/remix-oxygen";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shopDomain = url.searchParams.get("shop_domain");
  const apiToken = url.searchParams.get("api_token");
  const productHandle = url.searchParams.get("product_handle");
  const perPage = url.searchParams.get("per_page") || "5";

  if (!shopDomain || !apiToken) {
    return data({ error: "Missing parameters" }, { status: 400 });
  }

  const targetUrl = new URL("https://judge.me/api/v1/reviews");
  targetUrl.searchParams.set("shop_domain", shopDomain);
  targetUrl.searchParams.set("api_token", apiToken);
  targetUrl.searchParams.set("per_page", perPage);
  if (productHandle) targetUrl.searchParams.set("product_handle", productHandle);

  try {
    const response = await fetch(targetUrl.toString());
    const res = await response.json();
    return data(res);
  } catch (error) {
    return data({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}