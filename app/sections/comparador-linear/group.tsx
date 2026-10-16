import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { cn } from "~/utils/cn";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  TEXT_SIZE_CLASS,
  textStyleInputs,
} from "~/utils/text-style";
import { ComparadorLinearContext } from "./context";

const TEXT_PREFIXES = ["title", "specLabel", "specValue"];

interface ComparadorLinearGroupProps extends HydrogenComponentProps {
  title: string;
  borderColor: string;
  ref?: React.Ref<HTMLDivElement>;
}

function ComparadorLinearGroup(props: ComparadorLinearGroupProps) {
  const { title, borderColor, children, ref, ...rest } = props;
  const textStyle = (prefix: string) =>
    getTextStyle(props as unknown as Record<string, unknown>, prefix);

  return (
    <div
      ref={ref}
      {...omitTextStyleProps(rest, TEXT_PREFIXES)}
      // Sin color propio, las líneas usan el de la sección (--cl-border).
      style={
        (borderColor ? { "--cl-border": borderColor } : {}) as CSSProperties
      }
      className="flex flex-col gap-3"
    >
      {title && (
        <h3 className={TEXT_SIZE_CLASS} style={textStyle("title")}>
          {title}
        </h3>
      )}
      <ComparadorLinearContext.Provider
        value={{
          labelStyle: textStyle("specLabel"),
          valueStyle: textStyle("specValue"),
        }}
      >
        {/* Móvil: 2 columnas. Escritorio: una fila con tantas columnas como especificaciones. */}
        <div
          className={cn(
            "grid grid-cols-2 border-(--cl-border) border-t",
            "md:auto-cols-fr md:grid-flow-col md:grid-cols-none md:border-b",
          )}
        >
          {children}
        </div>
      </ComparadorLinearContext.Provider>
    </div>
  );
}

export default ComparadorLinearGroup;

export const schema = createSchema({
  type: "comparador-linear--group",
  title: "Grupo de especificaciones",
  childTypes: ["comparador-linear--spec"],
  settings: [
    {
      group: "Grupo",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Título del grupo",
          defaultValue: "Ergonomía",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Color de las líneas",
          helpText: "Vacío = el color de líneas de la sección.",
        },
      ],
    },
    {
      group: "Texto: título del grupo",
      inputs: textStyleInputs("title", {
        Color: "#ffffff",
        MobileSize: "13px",
        DesktopSize: "14px",
        Weight: "700",
        Transform: "uppercase",
        LetterSpacing: 1.5,
      }),
    },
    {
      group: "Texto: nombre de la especificación",
      inputs: textStyleInputs("specLabel", {
        Color: "#c9a24b",
        MobileSize: "10px",
        DesktopSize: "10px",
        Weight: "400",
        Transform: "uppercase",
        LetterSpacing: 2,
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto: valor de la especificación",
      inputs: textStyleInputs("specValue", {
        Color: "#ffffff",
        MobileSize: "14px",
        DesktopSize: "15px",
        Weight: "400",
        Family: MONO_FONT,
      }),
    },
  ],
  presets: {
    title: "Ergonomía",
    children: [
      { type: "comparador-linear--spec", label: "Reclinación", value: "[xx-xx°]" },
      { type: "comparador-linear--spec", label: "Altura asiento", value: "[xx-xx cm]" },
      { type: "comparador-linear--spec", label: "Peso máx. R / XL", value: "[xxx] / [xxx] kg" },
    ],
  },
});
