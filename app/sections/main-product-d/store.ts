import { create } from "zustand";
import type { AccessoryLine, ProductConfiguratorDStore } from "./types";

/**
 * Store del configurador D. Sigue el patrón de `~/stores/*` y de
 * `useVariantOptions` (main-product-j/filter-step.tsx): los subcomponentes
 * escriben aquí y quien necesite el dato (cabecera, CTA, visor) lo lee, sin
 * pasar props entre hermanos.
 *
 * La variante seleccionada NO vive aquí: es `~/stores/currentProduct`, que ya
 * es el estado principal del producto en toda la app.
 */
export const useProductConfiguratorD = create<ProductConfiguratorDStore>((set) => ({
  productId: null,
  accessories: [],
  activeMediaIndex: 0,
  setProductId: (productId: string | null) => {
    set((state) => {
      if (state.productId === productId) return state;
      // Al cambiar de producto se descarta la selección anterior: los
      // accesorios y la media activa no son válidos para el nuevo producto.
      return { productId, accessories: [], activeMediaIndex: 0 };
    });
  },
  toggleAccessory: (accessory: AccessoryLine) => {
    set((state) => {
      const exists = state.accessories.some((elm) => elm.id === accessory.id);
      return {
        accessories: exists
          ? state.accessories.filter((elm) => elm.id !== accessory.id)
          : [...state.accessories, accessory],
      };
    });
  },
  clearAccessories: () => set(() => ({ accessories: [] })),
  setActiveMediaIndex: (index: number) => set(() => ({ activeMediaIndex: index })),
}));
