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
  /**
   * true mientras haya al menos un `version-selector-d` montado en la
   * página — el filtro por la opción de variante "version" en
   * universe-selector/material-finish-selector solo se aplica si este
   * componente está en uso (si no, esos selectores no deben verse afectados
   * por nada).
   */
  versionFilterEnabled: boolean;
  /**
   * El filtro de versión es el que MANDA sobre qué productos se muestran en
   * universe-selector/material-finish-selector — por eso es un estado propio
   * (se fija solo al pulsar un `version-selector-item`), no algo derivado de
   * la variante seleccionada ahora mismo: así no lo pisa un clic en talla u
   * otro selector, y el resaltado del botón activo usa este MISMO estado que
   * filtra las listas, así que nunca pueden desincronizarse entre sí.
   *
   * "version" es una opción REAL de Shopify (como "Talla"), no un metacampo
   * — por eso se guarda también `versionFilterOptionName` (el nombre exacto
   * de esa opción en Shopify, configurable por si se renombra).
   *
   * No todos los productos tienen la opción "version" (solo los que llevan
   * la variante extra, ej. Monarch Remaster): esos productos "sin opción" se
   * consideran implícitamente el valor por defecto (ej. "Estándar"). Qué
   * valor es ese lo marca el propio `version-selector-item` con su prop
   * `isDefault`, y se guarda aquí en `versionFilterIncludeMissing` para que
   * universe-selector/material-finish-selector sepan si deben incluir
   * también los productos sin la opción al filtrar.
   */
  versionFilterActive: boolean;
  versionFilterOptionName: string;
  versionFilterValue: string;
  versionFilterIncludeMissing: boolean;
  setVersionFilterEnabled: (enabled: boolean) => void;
  selectVersionFilter: (optionName: string, value: string, includeMissing: boolean) => void;
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
