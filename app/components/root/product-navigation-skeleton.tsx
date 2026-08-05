import { useNavigation } from "react-router";
import { ProductPageSkeleton } from "~/sections/main-product-j/skeletons";

/**
 * Se muestra mientras React Router está resolviendo el loader de una
 * navegación HACIA una página de producto — es decir, mientras se cargan de
 * verdad los datos (la query de Shopify + weaverse.loadPage), no solo
 * mientras se sincroniza el store en el cliente.
 *
 * Es necesario como componente aparte (no dentro de main-product-j/index.tsx)
 * porque durante esa espera la ruta destino (y por lo tanto esa sección)
 * todavía no ha llegado a montarse — React Router no renderiza la página
 * nueva hasta que su loader resuelve.
 */
export function ProductNavigationSkeleton() {
  const navigation = useNavigation();
  const isNavigatingToProduct =
    navigation.state === "loading" &&
    /\/products\/[^/]+\/?$/.test(navigation.location?.pathname ?? "");

  if (!isNavigatingToProduct) return null;

  return (
    <div className="fixed inset-0 z-40" style={{ background: "#050505" }}>
      <ProductPageSkeleton />
    </div>
  );
}
