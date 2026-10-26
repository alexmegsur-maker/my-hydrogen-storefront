import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { type CSSProperties, useRef, useState } from "react";
import {
  omitSectionSpacing,
  type SectionSpacingData,
  SectionSpacingStyle,
  sectionSpacingInputs,
} from "~/utils/section-spacing";
import { VersionComparatorContext, type VersionFocus } from "./context";
import {
  CHANGES_CHILDREN,
  FEATURES_CHILDREN,
  SELECTOR_CHILDREN,
} from "./presets";
import "./version-comparator.css";

interface VersionComparatorProps extends HydrogenComponentProps {
  labelA: string;
  labelB: string;
  maxWidth: number;
  blocksGap: number;
  bgColor: string;
  surfaceColor: string;
  surfaceColor2: string;
  lineColor: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  fontFamily: string;
  ref?: React.Ref<HTMLElement>;
}

function VersionComparator(props: VersionComparatorProps) {
  const {
    labelA,
    labelB,
    maxWidth,
    blocksGap,
    bgColor,
    surfaceColor,
    surfaceColor2,
    lineColor,
    textColor,
    mutedColor,
    accentColor,
    fontFamily,
    children,
    ref,
    ...rest
  } = props;

  const [focus, setFocus] = useState<VersionFocus>("all");
  const [onlyDiff, setOnlyDiff] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={ref}
      {...omitSectionSpacing(rest)}
      className="vc-section px-5 py-16 md:py-20"
      style={
        {
          "--vc-bg": bgColor,
          "--vc-surface": surfaceColor,
          "--vc-surface-2": surfaceColor2,
          "--vc-line": lineColor,
          "--vc-text": textColor,
          "--vc-muted": mutedColor,
          "--vc-accent": accentColor,
          fontFamily: fontFamily || undefined,
        } as CSSProperties
      }
    >
      <SectionSpacingStyle
        selector={`[data-wv-id="${(rest as Record<string, unknown>)["data-wv-id"]}"]`}
        data={props as SectionSpacingData}
      />
      <VersionComparatorContext.Provider
        value={{
          focus,
          setFocus,
          onlyDiff,
          setOnlyDiff,
          labelA,
          labelB,
          toolbarRef,
        }}
      >
        <div
          className="mx-auto flex flex-col"
          style={{ maxWidth: `${maxWidth}px`, gap: `${blocksGap}px` }}
        >
          {children}
        </div>
      </VersionComparatorContext.Provider>
    </section>
  );
}

export default VersionComparator;

export const schema = createSchema({
  type: "version-comparator",
  title: "Comparador de versiones",
  childTypes: [
    "version-comparator--selector",
    "version-comparator--changes",
    "version-comparator--features",
    "group-elements"
  ],
  settings: [
    {
      group: "Versiones",
      inputs: [
        {
          type: "text",
          name: "labelA",
          label: "Nombre corto versión A",
          defaultValue: "V2",
          helpText: "Se usa en los botones de enfoque y en las etiquetas de móvil.",
        },
        {
          type: "text",
          name: "labelB",
          label: "Nombre corto versión B",
          defaultValue: "V3",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "maxWidth",
          label: "Ancho máximo",
          configs: { min: 600, max: 1600, step: 10, unit: "px" },
          defaultValue: 1120,
        },
        {
          type: "range",
          name: "blocksGap",
          label: "Separación entre bloques",
          configs: { min: 0, max: 160, step: 2, unit: "px" },
          defaultValue: 70,
        },
        {
          type: "text",
          name: "fontFamily",
          label: "Fuente base",
          defaultValue: "Inter, system-ui, sans-serif",
          helpText: "Vacío = fuente del tema.",
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
        { type: "color", name: "bgColor", label: "Fondo", defaultValue: "#08090a" },
        {
          type: "color",
          name: "surfaceColor",
          label: "Tarjetas",
          defaultValue: "#111315",
        },
        {
          type: "color",
          name: "surfaceColor2",
          label: "Tarjetas (hover / barras)",
          defaultValue: "#16191c",
        },
        { type: "color", name: "lineColor", label: "Bordes", defaultValue: "#23272b" },
        { type: "color", name: "textColor", label: "Texto", defaultValue: "#e9ecef" },
        {
          type: "color",
          name: "mutedColor",
          label: "Texto secundario",
          defaultValue: "#8b939b",
        },
        {
          type: "color",
          name: "accentColor",
          label: "Acento",
          defaultValue: "#2fd36b",
        },
      ],
    },
  ],
  presets: {
    children: [
      { type: "version-comparator--selector", children: SELECTOR_CHILDREN },
      { type: "version-comparator--changes", children: CHANGES_CHILDREN },
      { type: "version-comparator--features", children: FEATURES_CHILDREN },
    ],
  },
});
