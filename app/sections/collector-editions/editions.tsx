import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
} from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  textStyleInputs,
} from "~/utils/text-style";
import { CollectorEditionsContext, type EditionTextKey } from "./context";

const TEXT_KEYS: EditionTextKey[] = ["eyebrow", "title", "meta", "link"];

interface CollectorEditionsGridProps extends HydrogenComponentProps {
  columns: number;
  tabletColumns: number;
  mobileColumns: number;
  gap: number;
  imageAspectRatio: string;
  eyebrowHoverColor: string;
  titleHoverColor: string;
  metaHoverColor: string;
  linkHoverColor: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** "4/5" → "4 / 5". */
function toAspectRatio(value: string): string {
  const match = value?.match(/^\s*(\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)\s*$/);
  return match ? `${match[1]} / ${match[2]}` : "1 / 1";
}

function CollectorEditionsGrid(props: CollectorEditionsGridProps) {
  const {
    columns,
    tabletColumns,
    mobileColumns,
    gap,
    imageAspectRatio,
    eyebrowHoverColor,
    titleHoverColor,
    metaHoverColor,
    linkHoverColor,
    children,
    ref,
    ...rest
  } = props;

  const data = props as unknown as Record<string, unknown>;

  return (
    <CollectorEditionsContext.Provider
      value={{
        textStyles: {
          eyebrow: getTextStyle(data, "eyebrow"),
          title: getTextStyle(data, "title"),
          meta: getTextStyle(data, "meta"),
          link: getTextStyle(data, "link"),
        },
        hoverColors: {
          eyebrow: eyebrowHoverColor,
          title: titleHoverColor,
          meta: metaHoverColor,
          link: linkHoverColor,
        },
        imageAspectRatio: toAspectRatio(imageAspectRatio),
      }}
    >
      <div
        ref={ref}
        {...omitTextStyleProps(rest, TEXT_KEYS)}
        className="grid grid-cols-(--ed-cols-m) sm:grid-cols-(--ed-cols-t) lg:grid-cols-(--ed-cols-d)"
        style={
          {
            gap: `${gap ?? 10}px`,
            "--ed-cols-m": `repeat(${mobileColumns || 1}, minmax(0, 1fr))`,
            "--ed-cols-t": `repeat(${tabletColumns || 2}, minmax(0, 1fr))`,
            "--ed-cols-d": `repeat(${columns || 4}, minmax(0, 1fr))`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </CollectorEditionsContext.Provider>
  );
}

export default CollectorEditionsGrid;

export const schema = createSchema({
  type: "collector-editions--editions",
  title: "Tarjetas de ediciones",
  childTypes: ["collector-editions--edition"],
  settings: [
    {
      group: "Disposición",
      inputs: [
        {
          type: "range",
          name: "columns",
          label: "Columnas (escritorio)",
          defaultValue: 4,
          configs: { min: 1, max: 6, step: 1 },
        },
        {
          type: "range",
          name: "tabletColumns",
          label: "Columnas (tablet)",
          defaultValue: 2,
          configs: { min: 1, max: 4, step: 1 },
        },
        {
          type: "range",
          name: "mobileColumns",
          label: "Columnas (móvil)",
          defaultValue: 1,
          configs: { min: 1, max: 3, step: 1 },
        },
        {
          type: "range",
          name: "gap",
          label: "Separación",
          defaultValue: 10,
          configs: { min: 0, max: 40, step: 1, unit: "px" },
        },
        {
          type: "text",
          name: "imageAspectRatio",
          label: "Proporción de la imagen",
          defaultValue: "1/1",
          placeholder: "1/1",
          helpText: "Ancho/alto, por ejemplo 1/1 o 4/5.",
        },
      ],
    },
    {
      group: "Colores al pasar el ratón",
      inputs: [
        {
          type: "color",
          name: "eyebrowHoverColor",
          label: "Antetítulo",
          defaultValue: "#c9a24b",
        },
        {
          type: "color",
          name: "titleHoverColor",
          label: "Título",
          defaultValue: "#c9a24b",
        },
        {
          type: "color",
          name: "metaHoverColor",
          label: "Datos (tirada / precio)",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "linkHoverColor",
          label: "Enlace",
          defaultValue: "#c9a24b",
        },
        {
          type: "heading",
          label: "Cada tarjeta puede sobrescribir estos colores.",
        },
      ],
    },
    {
      group: "Texto: antetítulo",
      inputs: textStyleInputs("eyebrow", {
        Color: "#8a8f98",
        MobileSize: "9px",
        DesktopSize: "9px",
        Transform: "uppercase",
        LetterSpacing: 2,
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto: título",
      inputs: textStyleInputs("title", {
        Color: "#ffffff",
        MobileSize: "13px",
        DesktopSize: "13px",
        Weight: "700",
        Transform: "uppercase",
      }),
    },
    {
      group: "Texto: datos (tirada / precio)",
      inputs: textStyleInputs("meta", {
        Color: "#8a8f98",
        MobileSize: "10px",
        DesktopSize: "10px",
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto: enlace",
      inputs: textStyleInputs("link", {
        Color: "#ffffff",
        MobileSize: "10px",
        DesktopSize: "10px",
        Weight: "700",
        Transform: "uppercase",
        LetterSpacing: 1,
      }),
    },
  ],
  presets: {
    children: [
      { type: "collector-editions--edition", image: IMAGES_PLACEHOLDERS.product_1, title: "Monarch · Mordor", eyebrow: "Middle-earth™ · Licencia oficial" },
      { type: "collector-editions--edition", image: IMAGES_PLACEHOLDERS.product_2, title: "Monarch · Solo Leveling", eyebrow: "Solo Leveling · Licencia oficial" },
      { type: "collector-editions--edition", image: IMAGES_PLACEHOLDERS.product_3, title: "Monarch · Black Clover", eyebrow: "Black Clover · Licencia oficial" },
      { type: "collector-editions--edition", image: IMAGES_PLACEHOLDERS.product_4, title: "Monarch · Real Madrid", eyebrow: "Real Madrid · Licencia oficial" },
    ],
  },
});
