import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { selectorPaddingMargin } from "~/utils/general";
import { TEXT_SIZE_CLASS } from "~/utils/text-style";
import { useFoamCard } from "./foam-card";

interface FoamLayerProps extends HydrogenComponentProps {
  label: string;
  value: string;
  percent: number;
  barColor: string;
  // Espaciados (valores por defecto = diseño original)
  paddingSelect?: string;
  paddingText?: string;
  marginSelect?: string;
  marginText?: string;
  rowPaddingSelect?: string;
  rowPaddingText?: string;
  rowMarginSelect?: string;
  rowMarginText?: string;
  rowGap?: string;
  ref?: React.Ref<HTMLDivElement>;
}

function FoamLayer(props: FoamLayerProps) {
  const {
    label,
    value,
    percent,
    barColor,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    rowPaddingSelect,
    rowPaddingText,
    rowMarginSelect,
    rowMarginText,
    rowGap,
    ref,
    ...rest
  } = props;
  // Tipografía configurada en la tarjeta (Texto · Barras), común a todas sus barras
  const { inView, layerLabelStyle, layerValueStyle } = useFoamCard();

  // `?? valor`: barras guardadas antes de tener estos ajustes conservan el diseño
  return (
    <div
      ref={ref}
      {...rest}
      style={{
        ...selectorPaddingMargin("padding", paddingSelect ?? "a", paddingText ?? "0"),
        ...selectorPaddingMargin("margin", marginSelect ?? "a", marginText ?? "0 0 16px"),
      }}
    >
      <div
        className="flex items-baseline justify-between"
        style={{
          gap: rowGap ?? "12px",
          ...selectorPaddingMargin("padding", rowPaddingSelect ?? "a", rowPaddingText ?? "0"),
          ...selectorPaddingMargin("margin", rowMarginSelect ?? "a", rowMarginText ?? "0 0 7px"),
        }}
      >
        <span className={TEXT_SIZE_CLASS} style={layerLabelStyle}>
          {label}
        </span>
        <span className={TEXT_SIZE_CLASS} style={layerValueStyle}>
          {value}
        </span>
      </div>
      <div className="vc-bar">
        <i
          style={
            {
              width: inView ? `${percent}%` : 0,
              "--vc-bar-color": barColor || undefined,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

export default FoamLayer;

const SPACING_SIDE_OPTIONS = [
  { value: "t", label: "Top" },
  { value: "b", label: "Bottom" },
  { value: "l", label: "Left" },
  { value: "r", label: "Right" },
  { value: "x", label: "Inline" },
  { value: "y", label: "Block" },
  { value: "a", label: "Custom" },
];

export const schema = createSchema({
  type: "version-comparator--layer",
  title: "Barra",
  settings: [
    {
      group: "Barra",
      inputs: [
        { type: "text", name: "label", label: "Nombre", defaultValue: "Capa superior" },
        { type: "text", name: "value", label: "Valor", defaultValue: "60 kg/m³" },
        {
          type: "range",
          name: "percent",
          label: "Relleno",
          configs: { min: 0, max: 100, step: 1, unit: "%" },
          defaultValue: 100,
        },
        {
          type: "color",
          name: "barColor",
          label: "Color propio",
          helpText: "Vacío = gris, o acento si la tarjeta está destacada.",
        },
      ],
    },
    {
      group: "Espaciado",
      inputs: [
        { type: "heading", label: "Bloque completo" },
        {
          type: "select",
          name: "paddingSelect",
          label: "Tipo de padding",
          configs: { options: SPACING_SIDE_OPTIONS },
          defaultValue: "a",
        },
        {
          type: "text",
          name: "paddingText",
          label: "Padding",
          defaultValue: "0",
          placeholder: "10px 20px",
        },
        {
          type: "select",
          name: "marginSelect",
          label: "Tipo de margen",
          configs: { options: SPACING_SIDE_OPTIONS },
          defaultValue: "a",
        },
        {
          type: "text",
          name: "marginText",
          label: "Margen",
          defaultValue: "0 0 16px",
          helpText: "Por defecto 16px abajo: separación con la siguiente barra.",
        },
        { type: "heading", label: "Fila nombre / valor" },
        {
          type: "select",
          name: "rowPaddingSelect",
          label: "Tipo de padding",
          configs: { options: SPACING_SIDE_OPTIONS },
          defaultValue: "a",
        },
        {
          type: "text",
          name: "rowPaddingText",
          label: "Padding",
          defaultValue: "0",
          placeholder: "10px 20px",
        },
        {
          type: "select",
          name: "rowMarginSelect",
          label: "Tipo de margen",
          configs: { options: SPACING_SIDE_OPTIONS },
          defaultValue: "a",
        },
        {
          type: "text",
          name: "rowMarginText",
          label: "Margen",
          defaultValue: "0 0 7px",
          helpText: "Por defecto 7px abajo: separación entre el texto y la barra.",
        },
        {
          type: "text",
          name: "rowGap",
          label: "Separación nombre ↔ valor",
          defaultValue: "12px",
        },
      ],
    },
  ],
});
