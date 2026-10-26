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
import { useChildrenByType, useVersionComparator, type VersionFocus } from "./context";
import { FEATURES_CHILDREN } from "./presets";

const FEATURE_TYPE = "version-comparator--feature";

// Un prefijo por cada texto propio del bloque (ver ~/utils/text-style.ts).
// Color vacío = el de la paleta de la sección (CSS), así siguen los cambios de paleta.
const TEXT_PREFIXES = ["seg", "switch", "head", "improvement", "same", "num", "mlabel"];

/** Textos y estilo comunes a todas las filas (para no repetirlos en cada una). */
const FeaturesContext = createContext<{
  sameLabel: string;
  improvementLabel: string;
  showNumbers: boolean;
  rowRadius: number;
  rowPadding: string;
  improvementStyle: CSSProperties;
  sameStyle: CSSProperties;
  numStyle: CSSProperties;
  mlabelStyle: CSSProperties;
}>({
  sameLabel: "Igual en ambas",
  improvementLabel: "Mejora",
  showNumbers: true,
  rowRadius: 16,
  rowPadding: "22px 24px",
  improvementStyle: {},
  sameStyle: {},
  numStyle: {},
  mlabelStyle: {},
});

export function useFeatures() {
  return useContext(FeaturesContext);
}

interface FeaturesBlockProps extends HydrogenComponentProps {
  showToolbar: boolean;
  stickyToolbar: boolean;
  stickyTop: number;
  compareLabel: string;
  onlyALabel: string;
  onlyBLabel: string;
  onlyDiffLabel: string;
  showHead: boolean;
  colFeatureLabel: string;
  colALabel: string;
  colBLabel: string;
  sameLabel: string;
  improvementLabel: string;
  showNumbers: boolean;
  labelColWidth: number;
  rowsGap: number;
  rowRadius: number;
  rowPadding: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** "Característica a característica": Heading + Paragraph, barra de filtros y filas. */
function FeaturesBlock(props: FeaturesBlockProps) {
  const {
    showToolbar,
    stickyToolbar,
    stickyTop,
    compareLabel,
    onlyALabel,
    onlyBLabel,
    onlyDiffLabel,
    showHead,
    colFeatureLabel,
    colALabel,
    colBLabel,
    sameLabel,
    improvementLabel,
    showNumbers,
    labelColWidth,
    rowsGap,
    rowRadius,
    rowPadding,
    children,
    ref,
    ...rest
  } = props;
  const { focus, setFocus, onlyDiff, setOnlyDiff, toolbarRef } = useVersionComparator();
  const items = useChildrenByType(children);
  const textStyle = (prefix: string) =>
    getTextStyle(props as unknown as Record<string, unknown>, prefix);
  const segStyle = textStyle("seg");

  const intro = items.filter((item) => item.type !== FEATURE_TYPE);
  const rows = items.filter((item) => item.type === FEATURE_TYPE);

  const segments: { value: VersionFocus; label: string }[] = [
    { value: "all", label: compareLabel },
    { value: "a", label: onlyALabel },
    { value: "b", label: onlyBLabel },
  ];

  return (
    <div
      ref={ref}
      {...omitTextStyleProps(rest, TEXT_PREFIXES)}
      style={{ "--vc-label-col": `${labelColWidth}px` } as CSSProperties}
    >
      {intro.map((item) => item.node)}

      {showToolbar && (
        <div
          ref={toolbarRef}
          className={cn(
            "vc-toolbar z-20 -mx-5 mb-5 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5",
            stickyToolbar && "sticky",
          )}
          style={{ top: stickyToolbar ? `${stickyTop}px` : undefined }}
        >
          <div className="vc-seg" role="group">
            {segments.map((segment) => {
              const pressed = focus === segment.value;
              return (
                <button
                  key={segment.value}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setFocus(segment.value)}
                  className={TEXT_SIZE_CLASS}
                  // El botón activo usa los colores invertidos del CSS.
                  style={pressed ? { ...segStyle, color: undefined } : segStyle}
                >
                  {segment.label}
                </button>
              );
            })}
          </div>
          <label className="vc-switch">
            <input
              type="checkbox"
              checked={onlyDiff}
              onChange={(e) => setOnlyDiff(e.target.checked)}
            />
            <span className="vc-track" />
            <span className={TEXT_SIZE_CLASS} style={textStyle("switch")}>
              {onlyDiffLabel}
            </span>
          </label>
        </div>
      )}

      {showHead && (
        <div
          className={cn("vc-grid vc-thead px-6 pb-3.5", TEXT_SIZE_CLASS)}
          style={{ color: "var(--vc-muted)", ...textStyle("head") }}
        >
          <span>{colFeatureLabel}</span>
          <span>{colALabel}</span>
          <span>{colBLabel}</span>
        </div>
      )}

      <FeaturesContext.Provider
        value={{
          sameLabel,
          improvementLabel,
          showNumbers,
          rowRadius,
          rowPadding,
          improvementStyle: textStyle("improvement"),
          sameStyle: textStyle("same"),
          numStyle: textStyle("num"),
          mlabelStyle: textStyle("mlabel"),
        }}
      >
        <div
          className="vc-rows flex flex-col"
          data-focus={focus}
          style={{ gap: `${rowsGap}px` }}
        >
          {rows.map((item) => item.node)}
        </div>
      </FeaturesContext.Provider>
    </div>
  );
}

export default FeaturesBlock;

export const schema = createSchema({
  type: "version-comparator--features",
  title: "Característica a característica",
  childTypes: ["heading", "paragraph", FEATURE_TYPE],
  settings: [
    {
      group: "Barra de filtros",
      inputs: [
        { type: "switch", name: "showToolbar", label: "Mostrar", defaultValue: true },
        {
          type: "switch",
          name: "stickyToolbar",
          label: "Fija al hacer scroll",
          defaultValue: true,
        },
        {
          type: "range",
          name: "stickyTop",
          label: "Distancia al borde superior",
          configs: { min: 0, max: 200, step: 1, unit: "px" },
          defaultValue: 0,
          helpText: "Súbelo si el header fijo de la web tapa la barra.",
        },
        { type: "text", name: "compareLabel", label: "Botón comparar", defaultValue: "Comparar" },
        { type: "text", name: "onlyALabel", label: "Botón versión A", defaultValue: "Solo V2" },
        { type: "text", name: "onlyBLabel", label: "Botón versión B", defaultValue: "Solo V3" },
        {
          type: "text",
          name: "onlyDiffLabel",
          label: "Interruptor diferencias",
          defaultValue: "Solo diferencias",
        },
      ],
    },
    {
      group: "Cabecera de columnas",
      inputs: [
        { type: "switch", name: "showHead", label: "Mostrar", defaultValue: true },
        {
          type: "text",
          name: "colFeatureLabel",
          label: "Columna característica",
          defaultValue: "Característica",
        },
        {
          type: "text",
          name: "colALabel",
          label: "Columna versión A",
          defaultValue: "Monarch Remaster V2",
        },
        {
          type: "text",
          name: "colBLabel",
          label: "Columna versión B",
          defaultValue: "Monarch Remaster V3",
        },
      ],
    },
    {
      group: "Filas",
      inputs: [
        {
          type: "text",
          name: "improvementLabel",
          label: "Etiqueta de mejora",
          defaultValue: "Mejora",
        },
        {
          type: "text",
          name: "sameLabel",
          label: "Etiqueta de igual",
          defaultValue: "Igual en ambas",
        },
        { type: "switch", name: "showNumbers", label: "Numerar filas", defaultValue: true },
        {
          type: "range",
          name: "labelColWidth",
          label: "Ancho columna característica",
          configs: { min: 120, max: 400, step: 5, unit: "px" },
          defaultValue: 220,
        },
        {
          type: "range",
          name: "rowsGap",
          label: "Separación entre filas",
          configs: { min: 0, max: 40, step: 1, unit: "px" },
          defaultValue: 10,
        },
        {
          type: "range",
          name: "rowRadius",
          label: "Radio del borde",
          configs: { min: 0, max: 40, step: 1, unit: "px" },
          defaultValue: 16,
        },
        {
          type: "text",
          name: "rowPadding",
          label: "Padding de fila",
          defaultValue: "22px 24px",
        },
      ],
    },
    {
      group: "Texto · Botones de enfoque",
      inputs: textStyleInputs("seg", {
        Color: "",
        MobileSize: "14px",
        DesktopSize: "14px",
        Weight: "500",
      }),
    },
    {
      group: "Texto · Solo diferencias",
      inputs: textStyleInputs("switch", {
        Color: "",
        MobileSize: "14px",
        DesktopSize: "14px",
      }),
    },
    {
      group: "Texto · Cabecera de columnas",
      inputs: textStyleInputs("head", {
        Color: "",
        MobileSize: "11px",
        DesktopSize: "11px",
        Weight: "500",
        Transform: "uppercase",
        LetterSpacing: 1.5,
        LineHeight: 1,
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto · Etiqueta de mejora",
      inputs: textStyleInputs("improvement", {
        Color: "",
        MobileSize: "10px",
        DesktopSize: "10px",
        Weight: "600",
        Transform: "uppercase",
        LetterSpacing: 1,
        LineHeight: 1,
      }),
    },
    {
      group: "Texto · Etiqueta de igual",
      inputs: textStyleInputs("same", {
        Color: "",
        MobileSize: "10px",
        DesktopSize: "10px",
        Weight: "600",
        Transform: "uppercase",
        LetterSpacing: 1,
        LineHeight: 1,
      }),
    },
    {
      group: "Texto · Número de fila",
      inputs: textStyleInputs("num", {
        Color: "",
        MobileSize: "12px",
        DesktopSize: "12px",
        Weight: "500",
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto · Versión en móvil",
      inputs: textStyleInputs("mlabel", {
        Color: "",
        MobileSize: "10px",
        DesktopSize: "10px",
        Weight: "500",
        Transform: "uppercase",
        LetterSpacing: 1.5,
        Family: MONO_FONT,
      }),
    },
  ],
  presets: {
    children: FEATURES_CHILDREN,
  },
});
