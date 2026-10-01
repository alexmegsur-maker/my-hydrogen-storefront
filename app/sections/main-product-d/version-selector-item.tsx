import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useMemo, useState } from "react";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import { useProductConfiguratorD } from "./store";
import { equals, resolveVariantForOption } from "./utils";

interface VersionSelectorItemProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  /** Nombre exacto de la opción en Shopify (ej. "version"). */
  optionName: string;
  /** Valor exacto de esa opción (ej. "version 2"), sin distinguir mayúsculas. */
  value: string;
  /**
   * Márcalo en la opción "por defecto" (ej. "Estándar"): los productos que no
   * tengan la opción `optionName` en absoluto (no llevan la variante extra)
   * se mostrarán también cuando este valor esté seleccionado como filtro.
   */
  isDefault: boolean;
  description: string;
  // tarjeta
  cBgColor: string;
  cBorderColor: string;
  cActiveBorderColor: string;
  cActiveBgColor: string;
  cRadius: string;
  cPaddingSelect: string;
  cPaddingText: string;
  // título
  ctColor: string;
  ctSize: string;
  ctFamily: string;
  ctWeight: string;
  // descripción
  cdColor: string;
  cdSize: string;
  cdFamily: string;
  cdWeight: string;
}

/**
 * Una opción del selector de versión: componente independiente y repetible
 * (childTypes de `version-selector-d`) — cada instancia declara el nombre de
 * la opción de Shopify a comparar (`optionName`, ej. "version") y el valor
 * exacto (`value`, ej. "version 2"). "version" es una opción REAL de
 * variante (como "Talla"), no un metacampo: por eso se reutilizan los mismos
 * helpers que `size-selector-d` (`resolveVariantForOption`,
 * `getSelectedOptionValue`).
 *
 * Al pulsar: (1) resuelve la variante del producto activo que cumple su
 * criterio y la selecciona (`useCurrentProduct.setVariant`), y (2) marca
 * este criterio como EL filtro (`useProductConfiguratorD.selectVersionFilter`)
 * que manda sobre qué productos se muestran en universe-selector/
 * material-finish-selector. Ese filtro es estado propio, no algo derivado de
 * la variante seleccionada — así un clic en talla (u otro selector) no lo
 * pisa, y el resaltado "activo" de este botón lee ese MISMO estado, así que
 * nunca puede desincronizarse de lo que de verdad se está filtrando.
 */
export default function VersionSelectorItem(props: VersionSelectorItemProps) {
  const {
    ref,
    label,
    optionName,
    value,
    isDefault,
    description,
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
  const selectVersionFilter = useProductConfiguratorD((state) => state.selectVersionFilter);
  const filterActive = useProductConfiguratorD((state) => state.versionFilterActive);
  const filterOptionName = useProductConfiguratorD((state) => state.versionFilterOptionName);
  const filterValue = useProductConfiguratorD((state) => state.versionFilterValue);
  const [hovered, setHovered] = useState(false);

  const resolvedOptionName = optionName || "version";

  const variant = useMemo(
    () => resolveVariantForOption(currentProduct, resolvedOptionName, value),
    [currentProduct, resolvedOptionName, value],
  );
  const active =
    filterActive && equals(filterOptionName, resolvedOptionName) && equals(filterValue, value);

  // Siempre se puede pulsar, aunque el producto actual no tenga una variante
  // con este criterio: el filtro manda sobre qué productos se listan en
  // universe-selector/material-finish-selector, así que hace falta poder
  // activarlo para DESCUBRIR esos otros productos aunque el que se esté
  // viendo ahora mismo no encaje (y por eso vaya a desaparecer de esas
  // listas). Si sí hay una variante que encaja, además se selecciona.
  function handleClick() {
    if (variant) setVariant(variant);
    selectVersionFilter(resolvedOptionName, value, Boolean(isDefault));
  }

  return (
    <button
      ref={ref}
      {...rest}
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-version-option={value.toLowerCase()}
      data-active={active}
      className="version-card flex flex-col items-start gap-1 text-left"
      style={{
        background: active ? cActiveBgColor : cBgColor,
        border: `1px solid ${active ? cActiveBorderColor : cBorderColor}`,
        borderRadius: cRadius,
        cursor: "pointer",
        // Atenuado (no deshabilitado) si el producto actual no tiene esta
        // versión: es una pista, no un bloqueo — sigue pudiéndose pulsar
        // para filtrar y descubrir los productos que sí la tienen.
        opacity: active || hovered ? 1 : variant ? 0.7 : 0.5,
        transition: "all 0.3s ease",
        ...selectorPaddingMargin("padding", cPaddingSelect, cPaddingText),
      }}
    >
      <span
        className="version-card-title"
        style={{ color: ctColor, fontFamily: ctFamily, fontSize: ctSize, fontWeight: ctWeight }}
      >
        {label}
      </span>
      {description && (
        <span
          className="version-card-desc"
          style={{ color: cdColor, fontFamily: cdFamily, fontSize: cdSize, fontWeight: cdWeight }}
        >
          {description}
        </span>
      )}
    </button>
  );
}

export const schema = createSchema({
  type: "version-selector-item",
  title: "Version option",
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Etiqueta", name: "label", defaultValue: "Versión 2" },
        {
          type: "text",
          label: "Nombre de la opción",
          name: "optionName",
          defaultValue: "version",
          helpText: "Nombre exacto de la opción en Shopify (ej. \"version\").",
        },
        {
          type: "text",
          label: "Valor",
          name: "value",
          defaultValue: "version 2",
          helpText: "Valor exacto de esa opción tal y como está en Shopify (ej. \"version 2\"), sin distinguir mayúsculas.",
        },
        {
          type: "switch",
          label: "Es el valor por defecto",
          name: "isDefault",
          defaultValue: false,
          helpText:
            "Actívalo en la opción que representa los productos SIN la variante extra (ej. \"Estándar\"): se mostrarán también los productos que no tengan esta opción en absoluto.",
        },
        { type: "text", label: "Descripción", name: "description" },
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
  presets: {
    label: "Versión 2",
    optionName: "version",
    value: "version 2",
  },
});
