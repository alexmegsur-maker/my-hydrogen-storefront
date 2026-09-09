import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Section } from "~/components/section";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import type { Variants } from "~/types/currentProduct";
import { buildResolvedOptionValues, formatAmount, lookupLine, parseKeyValueLines } from "./utils";

interface SizeSelectorProps extends HydrogenComponentProps {
  title: string;
  optionName: string;
  labels: string;
  descriptions: string;
  // calculadora
  showCalculator: boolean;
  calculatorLabel: string;
  calculatorHideLabel: string;
  heightLabel: string;
  weightLabel: string;
  heightBreakpoint: number;
  weightBreakpoint: number;
  calcBgColor: string;
  calcInputBgColor: string;
  calcInputBorderColor: string;
  // section
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
  // título
  tColor: string;
  tSize: string;
  tLetter: number;
  tUpper: boolean;
  tFamily: string;
  tWeight: string;
  // link calculadora
  bColor: string;
  bSize: string;
  bFamily: string;
  // tarjeta
  cBgColor: string;
  cBorderColor: string;
  cActiveBorderColor: string;
  cActiveBgColor: string;
  cRadius: string;
  cPaddingSelect: string;
  cPaddingText: string;
  // título tarjeta
  ctColor: string;
  ctSize: string;
  ctFamily: string;
  ctWeight: string;
  // descripción tarjeta
  cdColor: string;
  cdSize: string;
  cdFamily: string;
  cdWeight: string;
}

/**
 * Selector de talla: opera SIEMPRE sobre el producto activo del store, que es
 * el que fija el selector de material (cada acabado es un producto distinto).
 * Cada valor de la opción se resuelve a una variante real
 * (`buildResolvedOptionValues`) y al pulsar se notifica al estado principal
 * con `setVariant`, que es lo que leen el resto de subcomponentes.
 */
export default function SizeSelector(props: SizeSelectorProps) {
  const {
    title,
    optionName,
    labels,
    descriptions,
    showCalculator,
    calculatorLabel,
    calculatorHideLabel,
    heightLabel,
    weightLabel,
    heightBreakpoint,
    weightBreakpoint,
    calcBgColor,
    calcInputBgColor,
    calcInputBorderColor,
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
    bColor,
    bSize,
    bFamily,
    cBgColor,
    cBorderColor,
    cActiveBorderColor,
    cActiveBgColor,
    cRadius,
    cPaddingSelect,
    cPaddingText,
    ctColor,
    ctSize,
    ctFamily,
    ctWeight,
    cdColor,
    cdSize,
    cdFamily,
    cdWeight,
    ...rest
  } = props;

  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const setVariant = useCurrentProduct((state) => state.setVariant);

  const [showCalc, setShowCalc] = useState(false);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [hovered, setHovered] = useState<string | null>(null);

  const labelMap = useMemo(() => parseKeyValueLines(labels), [labels]);
  const descriptionMap = useMemo(() => parseKeyValueLines(descriptions), [descriptions]);

  const values = useMemo(
    () => buildResolvedOptionValues(currentProduct, optionName || "Talla"),
    [currentProduct, optionName],
  );

  /**
   * Opción "objetivo" para una altura/peso: la calculadora no compara contra
   * los textos `regularValue`/`largeValue` del schema (frágil si el valor
   * real en Shopify no es literalmente "R"/"XL" — típicamente solo cuadraba
   * al subir de talla, nunca al bajar), sino que usa el primer y el último
   * valor declarado en Shopify para esta opción (se asume orden de menor a
   * mayor talla, igual que ya asumen los mapeos de "Etiquetas"/"Descripciones").
   * Así sube y baja funcionan exactamente igual.
   */
  const targetOptionFor = useCallback(
    (nextHeight: number, nextWeight: number) => {
      if (values.length < 2) return values[0] ?? null;
      const isLarge = nextHeight > (heightBreakpoint ?? 179) || nextWeight > (weightBreakpoint ?? 99);
      return isLarge ? values[values.length - 1] : values[0];
    },
    [values, heightBreakpoint, weightBreakpoint],
  );

  /** Opción recomendada para la altura/peso actuales (solo para mostrarla). */
  const recommended = useMemo(
    () => targetOptionFor(height, weight)?.value ?? null,
    [targetOptionFor, height, weight],
  );

  // Si la variante activa deja de existir para el producto actual (navegación
  // entre productos), no forzamos nada: `currentProduct` ya trae su variante.
  useEffect(() => {
    setHovered(null);
  }, [currentProduct?.id]);

  const changeVariant = (variant: Variants | null) => {
    if (!variant) return;
    setVariant(variant);
  };

  /**
   * Selecciona directamente la variante recomendada (mismo `setVariant` que
   * usa el clic manual en una tarjeta) para una altura/peso concretos — se
   * llama con el valor recién tecleado, así la talla se aplica en vivo según
   * se va escribiendo en la calculadora, sin necesidad de confirmar, tanto al
   * subir como al bajar.
   */
  const applySizeFor = useCallback(
    (nextHeight: number, nextWeight: number) => {
      // Ignora estados transitorios del input (vacío o negativo mientras se escribe).
      if (nextHeight <= 0 || nextWeight <= 0) return;
      const target = targetOptionFor(nextHeight, nextWeight);
      if (target?.variant) changeVariant(target.variant);
    },
    [targetOptionFor, changeVariant],
  );

  /** Valor realmente activo ahora mismo en el producto (confirma que la selección se aplicó). */
  const activeOption = values.find((elm) => elm.active);

  return (
    <Section {...rest}>
      <div
        className="config-section"
        style={{
          ...selectorPaddingMargin("padding", paddingSelect, paddingText),
          ...selectorPaddingMargin("margin", marginSelect, marginText),
        }}
      >
        <div className="section-header flex justify-between items-baseline mb-[1rem]">
          <div
            className="config-label"
            style={{
              color: tColor,
              fontFamily: tFamily,
              fontSize: tSize,
              fontWeight: tWeight,
              textTransform: tUpper ? "uppercase" : "unset",
              letterSpacing: tLetter > 0 ? `${tLetter}px` : "normal",
            }}
          >
            {title}
          </div>
          {showCalculator && (
            <span
              className="config-link cursor-pointer"
              onClick={() => setShowCalc((state) => !state)}
              style={{
                color: bColor,
                fontFamily: bFamily,
                fontSize: bSize,
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              {showCalc ? calculatorHideLabel || "ocultar calculadora" : calculatorLabel}
            </span>
          )}
        </div>

        <div className="size-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
          {values.map((option) => {
            const isHovered = hovered === option.value;
            const label = lookupLine(labelMap, option.value) || option.value;
            const description = lookupLine(descriptionMap, option.value);
            const extra = option.priceDelta > 0 ? ` · +${formatAmount(option.priceDelta)}€` : "";

            return (
              <button
                type="button"
                key={option.value}
                disabled={!option.variant}
                onClick={() => changeVariant(option.variant)}
                onMouseEnter={() => setHovered(option.value)}
                onMouseLeave={() => setHovered(null)}
                data-variante={optionName || "talla"}
                data-variante-option={option.value.toLowerCase()}
                data-active={option.active}
                className="size-card flex flex-col items-start gap-1 text-left"
                style={{
                  background: option.active ? cActiveBgColor : cBgColor,
                  border: `1px solid ${option.active ? cActiveBorderColor : cBorderColor}`,
                  borderRadius: cRadius,
                  cursor: option.variant ? "pointer" : "not-allowed",
                  opacity: option.variant ? (option.active || isHovered ? 1 : 0.7) : 0.35,
                  transition: "all 0.3s ease",
                  ...selectorPaddingMargin("padding", cPaddingSelect, cPaddingText),
                }}
              >
                <span
                  className="size-card-title"
                  style={{
                    color: ctColor,
                    fontFamily: ctFamily,
                    fontSize: ctSize,
                    fontWeight: ctWeight,
                  }}
                >
                  {label}
                  {extra}
                </span>
                {description && (
                  <span
                    className="size-card-desc"
                    style={{
                      color: cdColor,
                      fontFamily: cdFamily,
                      fontSize: cdSize,
                      fontWeight: cdWeight,
                    }}
                  >
                    {description}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showCalculator && showCalc && (
          <div
            className="size-calculator mt-3 flex flex-col gap-3 rounded-[4px] p-4"
            style={{ background: calcBgColor }}
          >
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-2">
                <span
                  style={{
                    color: cdColor,
                    fontFamily: cdFamily,
                    fontSize: cdSize,
                    fontWeight: cdWeight,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {heightLabel || "Estatura (cm)"}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={140}
                  max={210}
                  value={height}
                  onChange={(event) => {
                    const value = Number(event.target.value) || 0;
                    setHeight(value);
                    applySizeFor(value, weight);
                  }}
                  className="w-full outline-none"
                  style={{
                    background: calcInputBgColor,
                    border: `1px solid ${calcInputBorderColor}`,
                    borderRadius: cRadius,
                    color: ctColor,
                    fontFamily: ctFamily,
                    fontSize: ctSize,
                    ...selectorPaddingMargin("padding", "a", "0.7rem 0.8rem"),
                  }}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span
                  style={{
                    color: cdColor,
                    fontFamily: cdFamily,
                    fontSize: cdSize,
                    fontWeight: cdWeight,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {weightLabel || "Peso (kg)"}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={40}
                  max={200}
                  value={weight}
                  onChange={(event) => {
                    const value = Number(event.target.value) || 0;
                    setWeight(value);
                    applySizeFor(height, value);
                  }}
                  className="w-full outline-none"
                  style={{
                    background: calcInputBgColor,
                    border: `1px solid ${calcInputBorderColor}`,
                    borderRadius: cRadius,
                    color: ctColor,
                    fontFamily: ctFamily,
                    fontSize: ctSize,
                    ...selectorPaddingMargin("padding", "a", "0.7rem 0.8rem"),
                  }}
                />
              </label>
            </div>

            <span
              style={{
                color: cdColor,
                fontFamily: cdFamily,
                fontSize: cdSize,
                fontWeight: cdWeight,
              }}
            >
              {activeOption?.value.trim().toLowerCase() === (recommended ?? "").trim().toLowerCase()
                ? `✓ Seleccionado: ${lookupLine(labelMap, activeOption.value) || activeOption.value}`
                : activeOption
                  ? `Este acabado no tiene talla ${lookupLine(labelMap, recommended) || recommended} — sigue en ${lookupLine(labelMap, activeOption.value) || activeOption.value}`
                  : `Este acabado no tiene talla ${lookupLine(labelMap, recommended) || recommended}`}
            </span>
          </div>
        )}
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "size-selector-d",
  title: "Size selector",
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Título", name: "title", defaultValue: "TALLA" },
        {
          type: "text",
          label: "Nombre de la opción",
          name: "optionName",
          defaultValue: "Talla",
          helpText: "Nombre exacto de la opción en Shopify (ej. Talla).",
        },
        {
          type: "textarea",
          label: "Etiquetas por valor",
          name: "labels",
          defaultValue: "Regular|Regular (R)\nXl|Extra Large (XL)",
          helpText:
            "Una línea por valor con el formato valor|etiqueta. La clave (antes de la |) debe ser igual, sin distinguir mayúsculas, al valor real de la opción en Shopify — en tus productos Monarch es literalmente \"Regular\" y \"Xl\".",
        },
        {
          type: "textarea",
          label: "Descripciones por valor",
          name: "descriptions",
          defaultValue: "Regular|1.50–1.85m · hasta 100kg\nXl|1.80–2.05m · hasta 180kg",
          helpText:
            "Una línea por valor con el formato valor|descripción. Misma clave que en Shopify (\"Regular\" / \"Xl\"), si no coincide la descripción no se muestra.",
        },
        {
          type: "select",
          label: "Padding type",
          name: "paddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        { type: "text", label: "Padding value", name: "paddingText", defaultValue: "2rem" },
        {
          type: "select",
          label: "Margin type",
          name: "marginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        { type: "text", label: "Margin value", name: "marginText" },
      ],
    },
    {
      group: "Calculadora de talla",
      inputs: [
        { type: "switch", label: "Mostrar calculadora", name: "showCalculator", defaultValue: true },
        {
          type: "text",
          label: "Texto del enlace (cerrada)",
          name: "calculatorLabel",
          defaultValue: "¿no la sabes? calcúlala",
        },
        {
          type: "text",
          label: "Texto del enlace (abierta)",
          name: "calculatorHideLabel",
          defaultValue: "ocultar calculadora",
        },
        { type: "text", label: "Etiqueta de estatura", name: "heightLabel", defaultValue: "Estatura (cm)" },
        { type: "text", label: "Etiqueta de peso", name: "weightLabel", defaultValue: "Peso (kg)" },
        {
          type: "range",
          label: "Altura límite (cm)",
          name: "heightBreakpoint",
          defaultValue: 179,
          configs: { min: 150, max: 210, step: 1, unit: "cm" },
        },
        {
          type: "range",
          label: "Peso límite (kg)",
          name: "weightBreakpoint",
          defaultValue: 99,
          configs: { min: 50, max: 180, step: 1, unit: "kg" },
          helpText:
            "Por debajo de los límites se aplica el primer valor de la opción (talla más pequeña); por encima, el último (talla más grande) — se asume ese orden tal y como está declarado en Shopify.",
        },
        { type: "color", label: "Fondo del bloque", name: "calcBgColor", defaultValue: "#0A0A0A" },
        { type: "color", label: "Fondo de los campos", name: "calcInputBgColor", defaultValue: "#050505" },
        { type: "color", label: "Borde de los campos", name: "calcInputBorderColor", defaultValue: "#ffffff1f" },
      ],
    },
    {
      group: "Título",
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
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "500",
        },
        { type: "color", label: "Color del enlace", name: "bColor", defaultValue: "#A1A1AA" },
        { type: "text", label: "Font size enlace", name: "bSize", defaultValue: "0.7rem" },
        { type: "text", label: "Font family enlace", name: "bFamily", defaultValue: "Montserrat" },
      ],
    },
    {
      group: "Tarjeta",
      inputs: [
        { type: "color", label: "Background", name: "cBgColor", defaultValue: "#0A0A0A" },
        { type: "color", label: "Borde", name: "cBorderColor", defaultValue: "#ffffff14" },
        { type: "color", label: "Borde activo", name: "cActiveBorderColor", defaultValue: "#C9A227" },
        { type: "color", label: "Background activo", name: "cActiveBgColor", defaultValue: "#12100A" },
        { type: "text", label: "Border radius", name: "cRadius", defaultValue: "4px" },
        {
          type: "select",
          label: "Padding type",
          name: "cPaddingSelect",
          configs: {
            options: [
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        { type: "text", label: "Padding value", name: "cPaddingText", defaultValue: "1rem 1.2rem" },
        { type: "color", label: "Color título", name: "ctColor", defaultValue: "#FFFFFF" },
        { type: "text", label: "Font size título", name: "ctSize", defaultValue: "0.85rem" },
        { type: "text", label: "Font family título", name: "ctFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight título",
          name: "ctWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
            ],
          },
          defaultValue: "600",
        },
        { type: "color", label: "Color descripción", name: "cdColor", defaultValue: "#71717A" },
        { type: "text", label: "Font size descripción", name: "cdSize", defaultValue: "0.7rem" },
        { type: "text", label: "Font family descripción", name: "cdFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight descripción",
          name: "cdWeight",
          configs: {
            options: [
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
            ],
          },
          defaultValue: "400",
        },
      ],
    },
  ],
});
