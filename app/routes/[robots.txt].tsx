import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isProduction = url.hostname === "phoenixchairs.eu";

  const robotsTxt = [
    "User-agent: *",
    isProduction ? "Allow: /" : "Disallow: /",
    "",
    "Sitemap: https://phoenixchairs.eu/sitemap.xml",
  ].join("\n");

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
