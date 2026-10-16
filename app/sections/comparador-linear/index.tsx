import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { cn } from "~/utils/cn";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  TEXT_SIZE_CLASS,
  textStyleInputs,
} from "~/utils/text-style";
import {
  omitSectionSpacing,
  type SectionSpacingData,
  SectionSpacingStyle,
  sectionSpacingInputs,
} from "~/utils/section-spacing";
import { ComparadorLinearContext } from "./context";

// Estilo por defecto (el del grupo) para especificaciones añadidas directamente
// a la sección, como en la primera versión del componente, antes de los grupos.
const LOOSE_SPECS_STYLE = {
  labelStyle: getTextStyle(
    {
      specLabelColor: "#c9a24b",
      specLabelMobileSize: "10px",
      specLabelDesktopSize: "10px",
      specLabelTransform: "uppercase",
      specLabelLetterSpacing: 2,
      specLabelFamily: MONO_FONT,
    },
    "specLabel",
  ),
  valueStyle: getTextStyle(
    {
      specValueColor: "#ffffff",
      specValueMobileSize: "14px",
      specValueDesktopSize: "15px",
      specValueFamily: MONO_FONT,
    },
    "specValue",
  ),
};

const TEXT_PREFIXES = ["tag", "heading", "link"];

interface ComparadorLinearProps extends HydrogenComponentProps {
  tag: string;
  heading: string;
  linkText: string;
  linkUrl: string;
  backgroundColor: string;
  borderColor: string;
  groupsGap: number;
  ref?: React.Ref<HTMLElement>;
}

function ComparadorLinear(props: ComparadorLinearProps) {
  const {
    tag,
    heading,
    linkText,
    linkUrl,
    backgroundColor,
    borderColor,
    groupsGap,
    children,
    ref,
    ...rest
  } = props;

  const hasLooseSpecs = useChildInstances().some(
    (child) => child.data?.type === "comparador-linear--spec",
  );
  const textStyle = (prefix: string) =>
    getTextStyle(props as unknown as Record<string, unknown>, prefix);

  return (
    <section
      ref={ref}
      {...omitSectionSpacing(omitTextStyleProps(rest, TEXT_PREFIXES))}
      style={
        {
          "--cl-bg": backgroundColor,
          "--cl-border": borderColor,
        } as CSSProperties
      }
      className="bg-(--cl-bg) px-4 py-10 md:px-10 lg:px-12"
    >
      <SectionSpacingStyle
        selector={`[data-wv-id="${(rest as Record<string, unknown>)["data-wv-id"]}"]`}
        data={props as SectionSpacingData}
      />
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          {tag && (
            <span className={TEXT_SIZE_CLASS} style={textStyle("tag")}>
              {tag}
            </span>
          )}
          {heading && (
            <h2
              className={cn(TEXT_SIZE_CLASS, "leading-tight")}
              style={textStyle("heading")}
            >
              {heading}
            </h2>
          )}
        </div>
        {linkText && linkUrl && (
          <a
            href={linkUrl}
            className={cn(
              TEXT_SIZE_CLASS,
              "self-start border-current border-b pb-1 md:self-auto",
            )}
            style={textStyle("link")}
          >
            {linkText}
          </a>
        )}
      </div>

      {/* Grupos de especificaciones: cada uno gestiona el estilo de las suyas. */}
      {hasLooseSpecs ? (
        <ComparadorLinearContext.Provider value={LOOSE_SPECS_STYLE}>
          <div className="grid grid-cols-2 border-(--cl-border) border-t md:auto-cols-fr md:grid-flow-col md:grid-cols-none md:border-b">
            {children}
          </div>
        </ComparadorLinearContext.Provider>
      ) : (
        <div className="flex flex-col" style={{ gap: `${groupsGap ?? 32}px` }}>
          {children}
        </div>
      )}
    </section>
  );
}

export default ComparadorLinear;

export const schema = createSchema({
  type: "comparador-linear",
  title: "Comparador lineal",
  childTypes: ["comparador-linear--group"],
  settings: [
    {
      group: "Contenido",
      inputs: [
        {
          type: "text",
          name: "tag",
          label: "Etiqueta",
          defaultValue: "Ficha técnica",
        },
        {
          type: "text",
          name: "heading",
          label: "Título",
          defaultValue: "Compárala con cualquier silla.",
        },
        {
          type: "text",
          name: "linkText",
          label: "Texto del enlace",
          defaultValue: "Ver la ficha técnica completa →",
        },
        {
          type: "url",
          name: "linkUrl",
          label: "Enlace",
          defaultValue: "/",
        },
      ],
    },
    {
      group: "Espaciado de la sección",
      inputs: sectionSpacingInputs,
    },
    {
      group: "Colores",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Fondo",
          defaultValue: "#141519",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Líneas",
          defaultValue: "#2a2c31",
        },
        {
          type: "range",
          name: "groupsGap",
          label: "Separación entre grupos",
          defaultValue: 32,
          configs: { min: 0, max: 120, step: 4, unit: "px" },
        },
      ],
    },
    {
      group: "Texto: etiqueta",
      inputs: textStyleInputs("tag", {
        Color: "#8a8f98",
        MobileSize: "10px",
        DesktopSize: "10px",
        Weight: "400",
        Transform: "uppercase",
        LetterSpacing: 2,
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto: título",
      inputs: textStyleInputs("heading", {
        Color: "#ffffff",
        MobileSize: "22px",
        DesktopSize: "26px",
        Weight: "700",
        Transform: "uppercase",
      }),
    },
    {
      group: "Texto: enlace",
      inputs: textStyleInputs("link", {
        Color: "#ffffff",
        MobileSize: "11px",
        DesktopSize: "11px",
        Weight: "700",
        Transform: "uppercase",
        LetterSpacing: 1,
      }),
    },
  ],
  presets: {
    children: [
      {
        type: "comparador-linear--group",
        title: "",
        children: [
          { type: "comparador-linear--spec", label: "Reclinación", value: "[xx-xx°]" },
          { type: "comparador-linear--spec", label: "Altura asiento", value: "[xx-xx cm]" },
          { type: "comparador-linear--spec", label: "Peso máx. R / XL", value: "[xxx] / [xxx] kg" },
          { type: "comparador-linear--spec", label: "Pistón", value: "[clase]" },
          { type: "comparador-linear--spec", label: "Dimensiones", value: "[ancho × fondo × alto]" },
        ],
      },
    ],
  },
});
