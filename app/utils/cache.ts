export function routeHeaders({ loaderHeaders }: { loaderHeaders: Headers }) {
  // Keep the same cache-control headers when loading the page directly
  // versus when transitioning to the page from other areas in the app.
  // No default: route data includes the root loader's cart, so a public
  // default lets the browser serve a stale cart after add-to-cart.
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}
