import { type CSSProperties, createContext, useContext } from "react";

/**
 * El grupo define una vez el estilo de etiqueta/valor y lo usan todas sus
 * especificaciones, para no tener que ajustarlo en cada una.
 */
export const ComparadorLinearContext = createContext<{
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
}>({ labelStyle: {}, valueStyle: {} });

export function useComparadorLinear() {
  return useContext(ComparadorLinearContext);
}
