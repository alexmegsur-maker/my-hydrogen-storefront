import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { createContext, useContext } from "react";
import { cn } from "~/utils/cn";
import { useReveal } from "./context";

/** Las capas solo rellenan su barra cuando la tarjeta entra en pantalla. */
const FoamCardContext = createContext({ inView: true });

export function useFoamCard() {
  return useContext(FoamCardContext);
}

interface FoamCardProps extends HydrogenComponentProps {
  title: string;
  valueLabel: string;
  highlight: boolean;
  firmnessLabel: string;
  firmness: number;
  firmnessMax: number;
  firmnessText: string;
  radius: number;
  padding: number;
  ref?: React.Ref<HTMLDivElement>;
}

function FoamCard(props: FoamCardProps) {
  const {
    title,
    valueLabel,
    highlight,
    firmnessLabel,
    firmness,
    firmnessMax,
    firmnessText,
    radius,
    padding,
    children,
    ref,
    ...rest
  } = props;
  const { ref: revealRef, inView } = useReveal();

  return (
    <div ref={ref} {...rest}>
      <div
        ref={revealRef}
        className={cn("vc-foam-card h-full", highlight && "is-highlight")}
        style={{ borderRadius: `${radius}px`, padding: `${padding}px` }}
      >
        <div className="mb-[22px] flex items-baseline justify-between gap-3">
          <h4 className="font-semibold text-lg">{title}</h4>
          {valueLabel && (
            <span className="font-mono text-[13px]" style={{ color: "var(--vc-muted)" }}>
              {valueLabel}
            </span>
          )}
        </div>

        <FoamCardContext.Provider value={{ inView }}>{children}</FoamCardContext.Provider>

        {firmnessMax > 0 && (
          <div
            className="mt-6 flex items-center gap-3 border-t border-dashed pt-5 text-sm"
            style={{ borderColor: "var(--vc-line)" }}
          >
            <span>{firmnessLabel}</span>
            <span className="vc-dots flex gap-[5px]">
              {Array.from({ length: firmnessMax }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: lista fija de puntos
                <span key={i} className={cn(i < firmness && "is-on")} />
              ))}
            </span>
            {firmnessText && (
              <em className="ml-auto not-italic" style={{ color: "var(--vc-muted)" }}>
                {firmnessText}
              </em>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoamCard;

export const schema = createSchema({
  type: "version-comparator--foam-card",
  title: "Tarjeta de comparación",
  childTypes: ["version-comparator--layer"],
  settings: [
    {
      group: "Contenido",
      inputs: [
        { type: "text", name: "title", label: "Título", defaultValue: "V2 · Core MATRIIX™" },
        {
          type: "text",
          name: "valueLabel",
          label: "Valor (derecha)",
          defaultValue: "60 + 50 kg/m³",
        },
        {
          type: "switch",
          name: "highlight",
          label: "Destacar (barras y puntos en color de acento)",
          defaultValue: false,
        },
      ],
    },
    {
      group: "Escala",
      inputs: [
        { type: "text", name: "firmnessLabel", label: "Etiqueta", defaultValue: "Sentada" },
        {
          type: "range",
          name: "firmness",
          label: "Valor",
          configs: { min: 0, max: 10, step: 1 },
          defaultValue: 4,
        },
        {
          type: "range",
          name: "firmnessMax",
          label: "Total de puntos (0 = ocultar)",
          configs: { min: 0, max: 10, step: 1 },
          defaultValue: 5,
        },
        { type: "text", name: "firmnessText", label: "Texto", defaultValue: "Más firme" },
      ],
    },
    {
      group: "Estilo",
      inputs: [
        {
          type: "range",
          name: "radius",
          label: "Radio del borde",
          configs: { min: 0, max: 40, step: 1, unit: "px" },
          defaultValue: 22,
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          configs: { min: 8, max: 60, step: 1, unit: "px" },
          defaultValue: 28,
        },
      ],
    },
  ],
  presets: {
    title: "V2 · Core MATRIIX™",
    valueLabel: "60 + 50 kg/m³",
    children: [
      { type: "version-comparator--layer", label: "Capa superior", value: "60 kg/m³", percent: 100 },
      { type: "version-comparator--layer", label: "Capa inferior", value: "50 kg/m³", percent: 83 },
    ],
  },
});
