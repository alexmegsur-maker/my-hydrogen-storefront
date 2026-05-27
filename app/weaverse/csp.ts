import type { HydrogenRouterContextProvider } from "@shopify/hydrogen";

export function getWeaverseCsp(
  request: Request,
  context: HydrogenRouterContextProvider,
) {
  const url = new URL(request.url);
  const weaverseHost =
    url.searchParams.get("weaverseHost") || context.env.WEAVERSE_HOST;
  const isDesignMode = url.searchParams.get("weaverseHost");
  const weaverseHosts = ["*.weaverse.io", "*.shopify.com", "*.myshopify.com"];
  if (weaverseHost) {
    weaverseHosts.push(weaverseHost);
  }

  const updatedCsp: { [x: string]: string[] | string | boolean } = {
    defaultSrc: [
      "data:",
      "*.youtube.com",
      "*.youtu.be",
      "*.vimeo.com",
      "*.google.com",
      "*.google-analytics.com",
      "*.googletagmanager.com",
      "cdn.alireviews.io",
      "cdn.jsdelivr.net",
      "*.alicdn.com",
      "*.judge.me",
      "cdnwidget.judge.me",
      ...weaverseHosts,
    ],
    scriptSrc: [
      "'self'",
      "https://cdn.shopify.com",
      "*.googletagmanager.com",
      "*.google-analytics.com",
      "*.google.com",
      "*.judge.me",
      "cdnwidget.judge.me",
      "*.weaverse.io",
      ...weaverseHosts,
      "'unsafe-eval'",
      "'unsafe-hashes'",
      "'unsafe-inline'",
      "'sha256-Xv4DFZPbKwth/SyTUfU6tI8sQc1IYZCE8UHPTUKPhYw='",
      "'sha256-wT4ini02jKYQW3youIvCKsg9ACax0pk1uKpAaIy00Yc='",
      "'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc='",
      "https://connect.facebook.net",
      "https://www.facebook.com"
    ],
    styleSrc: [
      ...weaverseHosts,
      "https://studio.weaverse.io",
      "'self'",
      "'unsafe-inline'",
      "https://cdn.shopify.com",
      "http://localhost:*",
      "https://fonts.googleapis.com",
      "*.judge.me",
      "cdnwidget.judge.me",
    ],
    fontSrc: [
      "'self'",
      "data:",
      "https://fonts.gstatic.com",
      "https://fonts.googleapis.com",
      "https://*.gstatic.com",
      "https://*.googleapis.com",
      "https://cdn.shopify.com",
    ],
    connectSrc: [
      "vimeo.com",
      "*.google-analytics.com",
      "*.analytics.google.com",
      "*.googletagmanager.com",
      "www.google.com",
      "'self'",
      "https://monorail-edge.shopifysvc.com",
      "*.judge.me",
      "cdnwidget.judge.me",
      "ws://localhost:*",
      "ws://127.0.0.1:*",
      "ws://*.tryhydrogen.dev:*",
      "https://stats.g.doubleclick.net",
      "https://*.doubleclick.net",
      "https://*.google.com",
      "https://www.facebook.com",
      "https://*.facebook.net",
      ...weaverseHosts,
    ],
    frameSrc: [
      "*.googletagmanager.com",
      "*.google.com",
      "*.youtube.com",
      "*.youtu.be",
      "*.vimeo.com",
      "*.weaverse.io",
      "https://www.facebook.com",
    ],
    frameAncestors: isDesignMode
      ? ["*"]
      : ["'self'", "*.shopify.com", "*.myshopify.com"],
    imgSrc:[
      "'self'",
      "data:",
      "https://www.google.com",
      "https://www.google.es",
      "https://*.google-analytics.com",
      "https://*.doubleclick.net",
      "https://*.facebook.com",
      "https://cdn.shopify.com",
      "https://studio.weaverse.io",
      "*.myshopify.com",
      "https://images.secretlab.co",
    ]
  };

  return updatedCsp;
}