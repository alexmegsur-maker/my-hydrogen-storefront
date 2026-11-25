import { createContext, useContext } from "react";
import type { Swiper as SwiperType } from "swiper";

/** Datos de cada "slide image" que necesita el footer para pintar las muestras de color. */
export interface SlideInfo {
  id: string;
  label: string;
  swatchColor: string;
  swatchImage?: string;
}

interface SliderV3State {
  slides: SlideInfo[];
  setSlides: (slides: SlideInfo[]) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  swiper: SwiperType | null;
  setSwiper: (swiper: SwiperType | null) => void;
}

/**
 * Estado compartido entre "slides" (el carrusel) y "Footer" (las muestras de
 * color), que son hermanos dentro de la sección y no se ven entre sí.
 */
export const SliderV3Context = createContext<SliderV3State | null>(null);

export function useSliderV3() {
  return useContext(SliderV3Context);
}
