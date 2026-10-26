import { useChildInstances } from "@weaverse/hydrogen";
import {
  Children,
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
} from "react";
import { useInView } from "react-intersection-observer";

export type VersionFocus = "all" | "a" | "b";

/**
 * Estado compartido entre el selector de versión y las características:
 * al pulsar una tarjeta se enfoca esa versión también en la tabla.
 */
export const VersionComparatorContext = createContext<{
  focus: VersionFocus;
  setFocus: (focus: VersionFocus) => void;
  onlyDiff: boolean;
  setOnlyDiff: (onlyDiff: boolean) => void;
  labelA: string;
  labelB: string;
  /** Barra de herramientas de las características; el selector hace scroll hasta ella. */
  toolbarRef: RefObject<HTMLDivElement | null> | null;
}>({
  focus: "all",
  setFocus: () => {},
  onlyDiff: false,
  setOnlyDiff: () => {},
  labelA: "V2",
  labelB: "V3",
  toolbarRef: null,
});

export function useVersionComparator() {
  return useContext(VersionComparatorContext);
}

/** Aparición al entrar en pantalla (clase .vc-reveal / .vc-row + .is-in). */
export function useReveal() {
  return useInView({ threshold: 0.15, triggerOnce: true });
}

/**
 * Agrupa los hijos de Weaverse por tipo, respetando el orden del editor.
 * Weaverse renderiza `children` en el mismo orden que useChildInstances().
 */
export function useChildrenByType(children: ReactNode) {
  const instances = useChildInstances();
  const nodes = Children.toArray(children);
  return nodes.map((node, index) => ({
    node,
    type: instances[index]?.data?.type as string | undefined,
  }));
}
