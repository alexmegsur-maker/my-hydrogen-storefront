import type { Variants } from "~/types/currentProduct";

/**
 * Tipos compartidos por los subcomponentes del configurador D.
 * Todo el estado "de producto" vive en `~/stores/currentProduct` (variante
 * seleccionada); aquí solo se tipa lo que es propio de esta vista: accesorios
 * elegidos y el índice de media activo del visor.
 */

/** Accesorio del setup, ya normalizado a línea de carrito. */
export interface AccessoryLine {
  /** id del producto de Shopify */
  id: string;
  /** id de la variante que se añade al carrito */
  variantId: string;
  title: string;
  /** precio unitario en número (no string) para poder sumarlo */
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  available: boolean;
  quantity: number;
}

/** Estado del configurador de la vista D. */
export interface ProductConfiguratorDStore {
  /** producto al que pertenece la selección actual (para resetear al navegar) */
  productId: string | null;
  accessories: AccessoryLine[];
  activeMediaIndex: number;
  setProductId: (productId: string | null) => void;
  toggleAccessory: (accessory: AccessoryLine) => void;
  clearAccessories: () => void;
  setActiveMediaIndex: (index: number) => void;
}

/**
 * Valor de una opción de producto (talla, material…) ya resuelto contra las
 * variantes: sabemos a qué variante corresponde, si está disponible y cuánto
 * suma sobre el valor más barato de esa misma opción.
 */
export interface ResolvedOptionValue {
  value: string;
  variant: Variants | null;
  available: boolean;
  price: number;
  /** diferencia con el valor más barato de la opción (0 si es el base) */
  priceDelta: number;
  active: boolean;
}
