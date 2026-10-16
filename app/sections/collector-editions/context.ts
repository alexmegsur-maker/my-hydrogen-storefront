import { type CSSProperties, createContext, useContext } from "react";

export type EditionTextKey = "eyebrow" | "title" | "meta" | "link";

/**
 * El grupo de ediciones define una vez los estilos de texto, los colores al
 * pasar el ratón y la proporción de la imagen; cada tarjeta los usa (y puede
 * sobrescribir los colores de hover).
 */
export const CollectorEditionsContext = createContext<{
  textStyles: Record<EditionTextKey, CSSProperties>;
  hoverColors: Record<EditionTextKey, string>;
  imageAspectRatio: string;
}>({
  textStyles: { eyebrow: {}, title: {}, meta: {}, link: {} },
  hoverColors: { eyebrow: "", title: "", meta: "", link: "" },
  imageAspectRatio: "1 / 1",
});

export function useCollectorEditions() {
  return useContext(CollectorEditionsContext);
}
