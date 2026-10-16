import type { InspectorGroup } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { selectorPaddingMargin } from "~/utils/general";

// Ajustes de tipografía por texto, al estilo de ~/components/heading.tsx.
// Cada texto usa un prefijo propio: "tag" → tagColor, tagMobileSize, etc.

export const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";

export interface TextStyle {
  Family: string;
  MobileSize: string;
  DesktopSize: string;
  Weight: string;
  LetterSpacing: number;
  LineHeight: number;
  Transform: "none" | "uppercase" | "lowercase" | "capitalize";
  Color: string;
  PaddingSelect: string;
  PaddingText: string;
  MarginSelect: string;
  MarginText: string;
}

// Mismas opciones que ~/components/heading.tsx (ver selectorPaddingMargin).
const SPACING_SIDE_OPTIONS = [
  { value: "t", label: "Top" },
  { value: "b", label: "Bottom" },
  { value: "l", label: "Left" },
  { value: "r", label: "Right" },
  { value: "x", label: "Inline" },
  { value: "y", label: "Block" },
  { value: "a", label: "Custom" },
];

/** Clase que aplica el tamaño móvil/escritorio sin depender de JS (sin saltos al hidratar). */
export const TEXT_SIZE_CLASS = "text-(length:--ts-m) md:text-(length:--ts-d)";

export function textStyleInputs(
  prefix: string,
  defaults: Partial<TextStyle>,
): InspectorGroup["inputs"] {
  return [
    {
      type: "color",
      name: `${prefix}Color`,
      label: "Color",
      defaultValue: defaults.Color ?? "#ffffff",
    },
    {
      type: "text",
      name: `${prefix}MobileSize`,
      label: "Tamaño móvil",
      defaultValue: defaults.MobileSize ?? "14px",
    },
    {
      type: "text",
      name: `${prefix}DesktopSize`,
      label: "Tamaño escritorio",
      defaultValue: defaults.DesktopSize ?? "14px",
    },
    {
      type: "select",
      name: `${prefix}Weight`,
      label: "Grosor",
      configs: {
        options: [
          { value: "100", label: "100 - Thin" },
          { value: "200", label: "200 - Extra Light" },
          { value: "300", label: "300 - Light" },
          { value: "400", label: "400 - Normal" },
          { value: "500", label: "500 - Medium" },
          { value: "600", label: "600 - Semi Bold" },
          { value: "700", label: "700 - Bold" },
          { value: "800", label: "800 - Extra Bold" },
          { value: "900", label: "900 - Black" },
        ],
      },
      defaultValue: defaults.Weight ?? "400",
    },
    {
      type: "select",
      name: `${prefix}Transform`,
      label: "Mayúsculas",
      configs: {
        options: [
          { value: "none", label: "Como está escrito" },
          { value: "uppercase", label: "MAYÚSCULAS" },
          { value: "lowercase", label: "minúsculas" },
          { value: "capitalize", label: "Primera Letra" },
        ],
      },
      defaultValue: defaults.Transform ?? "none",
    },
    {
      type: "range",
      name: `${prefix}LetterSpacing`,
      label: "Espaciado entre letras",
      configs: { min: 0, max: 20, step: 0.5, unit: "px" },
      defaultValue: defaults.LetterSpacing ?? 0,
    },
    {
      type: "range",
      name: `${prefix}LineHeight`,
      label: "Interlineado (0 = automático)",
      configs: { min: 0, max: 3, step: 0.1 },
      defaultValue: defaults.LineHeight ?? 0,
    },
    {
      type: "text",
      name: `${prefix}Family`,
      label: "Fuente",
      defaultValue: defaults.Family ?? "",
      placeholder: "Montserrat",
      helpText: "Vacío = fuente del tema.",
    },
    {
      type: "select",
      name: `${prefix}PaddingSelect`,
      label: "Tipo de padding",
      configs: { options: SPACING_SIDE_OPTIONS },
      defaultValue: defaults.PaddingSelect ?? "a",
    },
    {
      type: "text",
      name: `${prefix}PaddingText`,
      label: "Padding",
      defaultValue: defaults.PaddingText ?? "",
      placeholder: "10px 20px",
    },
    {
      type: "select",
      name: `${prefix}MarginSelect`,
      label: "Tipo de margen",
      configs: { options: SPACING_SIDE_OPTIONS },
      defaultValue: defaults.MarginSelect ?? "a",
    },
    {
      type: "text",
      name: `${prefix}MarginText`,
      label: "Margen",
      defaultValue: defaults.MarginText ?? "",
      placeholder: "0 0 10px",
    },
  ];
}

/** Estilos inline del texto con ese prefijo. Usar junto a TEXT_SIZE_CLASS. */
export function getTextStyle(
  data: Record<string, unknown>,
  prefix: string,
): CSSProperties {
  const get = <K extends keyof TextStyle>(key: K) =>
    data[`${prefix}${key}`] as TextStyle[K] | undefined;
  const letterSpacing = get("LetterSpacing");
  const lineHeight = get("LineHeight");
  return {
    "--ts-m": get("MobileSize") || undefined,
    "--ts-d": get("DesktopSize") || undefined,
    color: get("Color") || undefined,
    fontWeight: get("Weight") || undefined,
    fontFamily: get("Family") || undefined,
    textTransform: get("Transform") || undefined,
    letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
    lineHeight: lineHeight || undefined,
    // Vacío = sin padding/margen extra (se respeta el diseño por defecto).
    ...selectorPaddingMargin(
      "padding",
      get("PaddingSelect") || "a",
      get("PaddingText") || undefined,
    ),
    ...selectorPaddingMargin(
      "margin",
      get("MarginSelect") || "a",
      get("MarginText") || undefined,
    ),
  } as CSSProperties;
}

const TEXT_STYLE_KEYS: (keyof TextStyle)[] = [
  "Family",
  "MobileSize",
  "DesktopSize",
  "Weight",
  "LetterSpacing",
  "LineHeight",
  "Transform",
  "Color",
  "PaddingSelect",
  "PaddingText",
  "MarginSelect",
  "MarginText",
];

/**
 * Quita los ajustes de tipografía de las props antes de pasarlas al DOM
 * (si no, acaban como atributos HTML: titleColor="#fff", etc.).
 */
export function omitTextStyleProps<T extends Record<string, unknown>>(
  props: T,
  prefixes: string[],
): T {
  const result = { ...props };
  for (const prefix of prefixes) {
    for (const key of TEXT_STYLE_KEYS) {
      delete result[`${prefix}${key}`];
    }
  }
  return result;
}
