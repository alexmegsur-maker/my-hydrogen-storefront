import { create } from "zustand";

/**
 * Estado abierto/cerrado del menú móvil del header. Vive fuera de
 * `MobileMenu` para que otros botones (ej. el botón flotante de
 * main-product-d, que oculta el header) puedan abrirlo.
 */
interface MobileMenuStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useMobileMenu = create<MobileMenuStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
