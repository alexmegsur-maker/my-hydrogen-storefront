import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { createContext, type CSSProperties, useContext } from "react";
import { cn } from "~/utils/cn";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  TEXT_SIZE_CLASS,
  textStyleInputs,
} from "~/utils/text-style";
import { useReveal } from "./context";

// Un prefijo por cada texto de la tarjeta (ver ~/utils/text-style.ts).
// Los de las barras (layer*) se configuran una vez en la tarjeta y llegan a
// cada barra por contexto, para no repetirlos en cada una.
const TEXT_PREFIXES = ["title", "valueText", "scaleLabel", "scaleText", "layerLabel", "layerValue"];

const MUTED = "var(--vc-muted)";

/**
 * Valores de diseño originales: se usan cuando un ajuste está vacío (color
 * vacío = el de la paleta de la sección) o en tarjetas guardadas antes de
 * tener estos ajustes.
 */
const FALLBACKS: Record<string, CSSProperties> = {
  title: { "--ts-m": "18px", "--ts-d": "18px", fontWeight: "600" } as CSSProperties,
  valueText: { "--ts-m": "13px", "--ts-d": "13px", fontFamily: MONO_FONT, color: MUTED } as CSSProperties,
  scaleLabel: { "--ts-m": "14px", "--ts-d": "14px" } as CSSProperties,
  scaleText: { "--ts-m": "14px", "--ts-d": "14px", color: MUTED } as CSSProperties,
  layerLabel: { "--ts-m": "13px", "--ts-d": "13px", color: MUTED } as CSSProperties,
  layerValue: { "--ts-m": "13px", "--ts-d": "13px", color: MUTED } as CSSProperties,
};

/** Las capas solo rellenan su barra cuando la tarjeta entra en pantalla. */
const FoamCardContext = createContext<{
  inView: boolean;
  layerLabelStyle: CSSProperties;
  layerValueStyle: CSSProperties;
}>({
  inView: true,
  layerLabelStyle: FALLBACKS.layerLabel,
  layerValueStyle: FALLBACKS.layerValue,
});

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
  const textStyle = (prefix: string) =>
    getTextStyle(props as unknown as Record<string, unknown>, prefix, FALLBACKS[prefix]);

  return (
    <div ref={ref} {...omitTextStyleProps(rest, TEXT_PREFIXES)}>
      <div
        ref={revealRef}
        className={cn("vc-foam-card h-full", highlight && "is-highlight")}
        style={{ borderRadius: `${radius}px`, padding: `${padding}px` }}
      >
        <div className="mb-[22px] flex items-baseline justify-between gap-3">
          <h4 className={TEXT_SIZE_CLASS} style={textStyle("title")}>
            {title}
          </h4>
          {valueLabel && (
            <span className={TEXT_SIZE_CLASS} style={textStyle("valueText")}>
              {valueLabel}
            </span>
          )}
        </div>

        <FoamCardContext.Provider
          value={{
            inView,
            layerLabelStyle: textStyle("layerLabel"),
            layerValueStyle: textStyle("layerValue"),
          }}
        >
          {children}
        </FoamCardContext.Provider>

        {firmnessMax > 0 && (
          <div
            className="mt-6 flex items-center gap-3 border-t border-dashed pt-5"
            style={{ borderColor: "var(--vc-line)" }}
          >
            <span className={TEXT_SIZE_CLASS} style={textStyle("scaleLabel")}>
              {firmnessLabel}
            </span>
            <span className="vc-dots flex gap-[5px]">
              {Array.from({ length: firmnessMax }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: lista fija de puntos
                <span key={i} className={cn(i < firmness && "is-on")} />
              ))}
            </span>
            {firmnessText && (
              <em className={cn("ml-auto not-italic", TEXT_SIZE_CLASS)} style={textStyle("scaleText")}>
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
  enabledOn: {
    groups: ["*"],
  },
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
    {
      group: "Texto · Título",
      inputs: textStyleInputs("title", {
        Color: "",
        MobileSize: "18px",
        DesktopSize: "18px",
        Weight: "600",
      }),
    },
    {
      group: "Texto · Valor (derecha)",
      inputs: textStyleInputs("valueText", {
        Color: "",
        MobileSize: "13px",
        DesktopSize: "13px",
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto · Barras: nombre",
      inputs: textStyleInputs("layerLabel", {
        Color: "",
        MobileSize: "13px",
        DesktopSize: "13px",
      }),
    },
    {
      group: "Texto · Barras: valor",
      inputs: textStyleInputs("layerValue", {
        Color: "",
        MobileSize: "13px",
        DesktopSize: "13px",
      }),
    },
    {
      group: "Texto · Escala: etiqueta",
      inputs: textStyleInputs("scaleLabel", {
        Color: "",
        MobileSize: "14px",
        DesktopSize: "14px",
      }),
    },
    {
      group: "Texto · Escala: texto",
      inputs: textStyleInputs("scaleText", {
        Color: "",
        MobileSize: "14px",
        DesktopSize: "14px",
      }),
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
