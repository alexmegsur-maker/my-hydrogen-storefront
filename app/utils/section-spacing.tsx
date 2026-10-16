import type { InspectorGroup } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { selectorPaddingMargin } from "~/utils/general";

// Padding y margen editables para una sección completa, con valor propio para
// móvil. Mismas opciones de lado que ~/components/heading.tsx.

export interface SectionSpacingData {
  sectionPaddingSelect?: string;
  sectionPaddingText?: string;
  sectionPaddingTextMobile?: string;
  sectionMarginSelect?: string;
  sectionMarginText?: string;
  sectionMarginTextMobile?: string;
}

const SIDE_OPTIONS = [
  { value: "t", label: "Top" },
  { value: "b", label: "Bottom" },
  { value: "l", label: "Left" },
  { value: "r", label: "Right" },
  { value: "x", label: "Inline" },
  { value: "y", label: "Block" },
  { value: "a", label: "Custom" },
];

export const sectionSpacingInputs: InspectorGroup["inputs"] = [
  {
    type: "select",
    name: "sectionPaddingSelect",
    label: "Tipo de padding",
    configs: { options: SIDE_OPTIONS },
    defaultValue: "a",
  },
  {
    type: "text",
    name: "sectionPaddingText",
    label: "Padding (escritorio)",
    placeholder: "40px 48px",
    helpText: "Vacío = padding por defecto de la sección.",
  },
  {
    type: "text",
    name: "sectionPaddingTextMobile",
    label: "Padding (móvil)",
    placeholder: "24px 16px",
    helpText: "Vacío = el mismo que en escritorio.",
  },
  {
    type: "select",
    name: "sectionMarginSelect",
    label: "Tipo de margen",
    configs: { options: SIDE_OPTIONS },
    defaultValue: "a",
  },
  {
    type: "text",
    name: "sectionMarginText",
    label: "Margen (escritorio)",
    placeholder: "0 0 40px",
  },
  {
    type: "text",
    name: "sectionMarginTextMobile",
    label: "Margen (móvil)",
    placeholder: "0 0 24px",
    helpText: "Vacío = el mismo que en escritorio.",
  },
];

export const SECTION_SPACING_KEYS: (keyof SectionSpacingData)[] = [
  "sectionPaddingSelect",
  "sectionPaddingText",
  "sectionPaddingTextMobile",
  "sectionMarginSelect",
  "sectionMarginText",
  "sectionMarginTextMobile",
];

function toCss(style: CSSProperties): string {
  return Object.entries(style)
    .map(
      ([prop, value]) =>
        `${prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value} !important`,
    )
    .join(";");
}

function spacingCss(
  data: SectionSpacingData,
  padding: string | undefined,
  margin: string | undefined,
): string {
  return toCss({
    ...selectorPaddingMargin(
      "padding",
      data.sectionPaddingSelect || "a",
      padding || undefined,
    ),
    ...selectorPaddingMargin(
      "margin",
      data.sectionMarginSelect || "a",
      margin || undefined,
    ),
  });
}

/**
 * <style> con el padding/margen de la sección para escritorio y móvil. Se usa
 * CSS (no JS) para que el valor correcto esté desde el primer render.
 * `selector` debe apuntar solo a esta sección, p. ej. [data-wv-id="..."].
 */
export function SectionSpacingStyle({
  selector,
  data,
}: {
  selector: string;
  data: SectionSpacingData;
}) {
  const desktop = spacingCss(data, data.sectionPaddingText, data.sectionMarginText);
  const mobile = spacingCss(
    data,
    data.sectionPaddingTextMobile || data.sectionPaddingText,
    data.sectionMarginTextMobile || data.sectionMarginText,
  );
  if (!(desktop || mobile)) {
    return null;
  }
  return (
    <style>
      {`${desktop ? `${selector}{${desktop}}` : ""}${
        mobile ? `@media (max-width:47.99em){${selector}{${mobile}}}` : ""
      }`}
    </style>
  );
}

/** Quita los ajustes de espaciado de las props antes de pasarlas al DOM. */
export function omitSectionSpacing<T extends Record<string, unknown>>(
  props: T,
): T {
  const result = { ...props };
  for (const key of SECTION_SPACING_KEYS) {
    delete result[key];
  }
  return result;
}
