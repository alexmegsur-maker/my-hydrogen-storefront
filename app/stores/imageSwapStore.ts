import type { WeaverseImage } from "@weaverse/hydrogen";
import { create } from "zustand";

/**
 * Imágenes sustituidas por los botones "Image swap button", indexadas por el
 * id ("identification") del componente imagen de image-with-text.
 */
interface ImageSwapStore {
  swaps: Record<string, Partial<WeaverseImage>>;
  setSwap: (targetId: string, image: Partial<WeaverseImage>) => void;
  clearSwap: (targetId: string) => void;
}

export const useImageSwap = create<ImageSwapStore>((set) => ({
  swaps: {},
  setSwap: (targetId, image) =>
    set((state) => ({ swaps: { ...state.swaps, [targetId]: image } })),
  clearSwap: (targetId) =>
    set((state) => {
      const { [targetId]: _removed, ...swaps } = state.swaps;
      return { swaps };
    }),
}));
