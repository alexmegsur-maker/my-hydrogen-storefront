import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useMemo } from "react";
import { Section } from "~/components/section";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import { parseSpecList, type SpecRow } from "./utils";

interface SpecSheetProps extends HydrogenComponentProps {
  title: string;
  hint: string;
  footnote: string;
  // section
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
  // cabecera: título (izquierda)
  tColor: string;
  tSize: string;
  tLetter: number;
  tUpper: boolean;
  tFamily: string;
  tWeight: string;
  // cabecera: pista (derecha)
  hColor: string;
  hSize: string;
  hLetter: number;
  hUpper: boolean;
  hFamily: string;
  hWeight: string;
  // filas
  rowPaddingSelect: string;
  rowPaddingText: string;
  dividerColor: string;
  lColor: string;
  lSize: string;
  lFamily: string;
  lWeight: string;
  vColor: string;
  vSize: string;
  vFamily: string;
  vWeight: string;
  // nota al pie
  nColor: string;
  nSize: string;
  nFamily: string;
  nWeight: string;
}

/**
 * "Ficha de esta configuración": lee el metafield de variante
 * `custom.especification` (list.single_line_text_field) del producto/variante
 * activos en el store (`useCurrentProduct`) y lo pinta como una tabla de
 * `etiqueta → valor`. Al cambiar de acabado (material-finish-selector) o de
 * talla (size-selector) el store se actualiza y la ficha se recalcula sola.
 */
export default function SpecSheet(props: SpecSheetProps) {
  const {
    title,
    hint,
    footnote,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tWeight,
    hColor,
    hSize,
    hLetter,
    hUpper,
    hFamily,
    hWeight,
    rowPaddingSelect,
    rowPaddingText,
    dividerColor,
    lColor,
    lSize,
    lFamily,
    lWeight,
    vColor,
    vSize,
    vFamily,
    vWeight,
    nColor,
    nSize,
    nFamily,
    nWeight,
    ...rest
  } = props;

  const currentProduct = useCurrentProduct((state) => state.currentProduct);

  const rows = useMemo<SpecRow[]>(() => {
    const selectedId = currentProduct?.selectedVariant?.id;
    const fullVariant =
      currentProduct?.variants?.nodes?.find((variant) => variant.id === selectedId) ??
      currentProduct?.selectedVariant ??
      null;
    return parseSpecList(fullVariant?.especification?.value);
  }, [currentProduct]);

  const showFootnote = useMemo(
    () => Boolean(footnote?.trim()) && rows.some((row) => row.value.includes("*")),
    [footnote, rows],
  );

  if (!rows.length) return null;

  return (
    <Section {...rest}>
      <div
        className="config-section spec-sheet"
        style={{
          ...selectorPaddingMargin("padding", paddingSelect, paddingText),
          ...selectorPaddingMargin("margin", marginSelect, marginText),
        }}
      >
        <div className="spec-sheet-head mb-[0.6rem] flex items-baseline justify-between gap-3">
          <span
            className="spec-sheet-title"
            style={{
              color: tColor,
              fontFamily: tFamily,
              fontSize: tSize,
              fontWeight: tWeight,
              textTransform: tUpper ? "uppercase" : "none",
              letterSpacing: tLetter > 0 ? `${tLetter}px` : "normal",
            }}
          >
            {title}
          </span>
          {hint ? (
            <span
              className="spec-sheet-hint shrink-0 text-right"
              style={{
                color: hColor,
                fontFamily: hFamily,
                fontSize: hSize,
                fontWeight: hWeight,
                textTransform: hUpper ? "uppercase" : "none",
                letterSpacing: hLetter > 0 ? `${hLetter}px` : "normal",
              }}
            >
              {hint}
            </span>
          ) : null}
        </div>

        <div className="spec-sheet-rows">
          {rows.map((row, index) => (
            <div
              key={`${row.label}-${index}`}
              className="spec-sheet-row flex items-baseline justify-between gap-4"
              style={{
                borderBottom: `1px solid ${dividerColor}`,
                ...selectorPaddingMargin("padding", rowPaddingSelect, rowPaddingText),
              }}
            >
              {row.label ? (
                <span
                  className="spec-sheet-label"
                  style={{
                    color: lColor,
                    fontFamily: lFamily,
                    fontSize: lSize,
                    fontWeight: lWeight,
                  }}
                >
                  {row.label}
                </span>
              ) : (
                <span />
              )}
              <span
                className="spec-sheet-value text-right"
                style={{
                  color: vColor,
                  fontFamily: vFamily,
                  fontSize: vSize,
                  fontWeight: vWeight,
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {showFootnote ? (
          <div
            className="spec-sheet-footnote mt-[0.6rem]"
            style={{
              color: nColor,
              fontFamily: nFamily,
              fontSize: nSize,
              fontWeight: nWeight,
            }}
          >
            {footnote}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

const weightOptions = [
  { value: "300", label: "300" },
  { value: "400", label: "400" },
  { value: "500", label: "500" },
  { value: "600", label: "600" },
  { value: "700", label: "700" },
];

const spacingOptions = [
  { value: "t", label: "Top" },
  { value: "b", label: "Bottom" },
  { value: "x", label: "Inline" },
  { value: "y", label: "Block" },
  { value: "a", label: "Custom" },
];

export const schema = createSchema({
  type: "spec-sheet-d",
  title: "Spec sheet",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "text",
          label: "Título",
          name: "title",
          defaultValue: "FICHA DE ESTA CONFIGURACIÓN",
        },
        {
          type: "text",
          label: "Pista (derecha)",
          name: "hint",
          defaultValue: "SE ACTUALIZA AL ELEGIR",
        },
        {
          type: "text",
          label: "Nota al pie",
          name: "footnote",
          defaultValue: "* pendiente del dato de ensayo real",
          helpText: "Solo se muestra si alguna fila contiene un asterisco.",
        },
        {
          type: "select",
          label: "Padding type",
          name: "paddingSelect",
          configs: { options: spacingOptions },
          defaultValue: "b",
        },
        { type: "text", label: "Padding value", name: "paddingText", defaultValue: "2rem" },
        {
          type: "select",
          label: "Margin type",
          name: "marginSelect",
          configs: { options: spacingOptions },
          defaultValue: "a",
        },
        { type: "text", label: "Margin value", name: "marginText" },
      ],
    },
    {
      group: "Cabecera · Título",
      inputs: [
        { type: "color", label: "Color", name: "tColor", defaultValue: "#71717A" },
        { type: "text", label: "Font size", name: "tSize", defaultValue: "0.7rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "tLetter",
          defaultValue: 2,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "switch", label: "Uppercase", name: "tUpper", defaultValue: true },
        { type: "text", label: "Font family", name: "tFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "tWeight",
          configs: { options: weightOptions },
          defaultValue: "500",
        },
      ],
    },
    {
      group: "Cabecera · Pista",
      inputs: [
        { type: "color", label: "Color", name: "hColor", defaultValue: "#52525B" },
        { type: "text", label: "Font size", name: "hSize", defaultValue: "0.6rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "hLetter",
          defaultValue: 1,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "switch", label: "Uppercase", name: "hUpper", defaultValue: true },
        { type: "text", label: "Font family", name: "hFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "hWeight",
          configs: { options: weightOptions },
          defaultValue: "400",
        },
      ],
    },
    {
      group: "Filas",
      inputs: [
        {
          type: "select",
          label: "Padding type",
          name: "rowPaddingSelect",
          configs: { options: spacingOptions },
          defaultValue: "a",
        },
        { type: "text", label: "Padding value", name: "rowPaddingText", defaultValue: "0.6rem 0" },
        { type: "color", label: "Color divisor", name: "dividerColor", defaultValue: "#ffffff14" },
        { type: "color", label: "Color etiqueta", name: "lColor", defaultValue: "#8A8AA0" },
        { type: "text", label: "Font size etiqueta", name: "lSize", defaultValue: "0.8rem" },
        {
          type: "text",
          label: "Font family etiqueta",
          name: "lFamily",
          defaultValue: "ui-monospace, SFMono-Regular, Menlo, monospace",
        },
        {
          type: "select",
          label: "Font weight etiqueta",
          name: "lWeight",
          configs: { options: weightOptions },
          defaultValue: "400",
        },
        { type: "color", label: "Color valor", name: "vColor", defaultValue: "#E4E4E7" },
        { type: "text", label: "Font size valor", name: "vSize", defaultValue: "0.8rem" },
        {
          type: "text",
          label: "Font family valor",
          name: "vFamily",
          defaultValue: "ui-monospace, SFMono-Regular, Menlo, monospace",
        },
        {
          type: "select",
          label: "Font weight valor",
          name: "vWeight",
          configs: { options: weightOptions },
          defaultValue: "500",
        },
      ],
    },
    {
      group: "Nota al pie",
      inputs: [
        { type: "color", label: "Color", name: "nColor", defaultValue: "#52525B" },
        { type: "text", label: "Font size", name: "nSize", defaultValue: "0.6rem" },
        { type: "text", label: "Font family", name: "nFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "nWeight",
          configs: { options: weightOptions },
          defaultValue: "400",
        },
      ],
    },
  ],
});
