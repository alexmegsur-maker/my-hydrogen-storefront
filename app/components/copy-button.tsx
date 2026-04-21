import {
  createSchema,
  type HydrogenComponentProps,
  type InspectorGroup,
} from "@weaverse/hydrogen";
import { useState, type HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FounderTokenStyles {
  // Contenido
  tokenText: string;
  labelText: string;
  copiarText: string;
  // Estado normal
  backgroundColor: string;
  textColor: string;
  shadowBlur: number;
  shadowColor: string;
  shadowOpacity: number;
  // Tipografía
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  letterSpacing: number;
  // Dimensiones
  paddingX: number;
  paddingY: number;
  minWidth: number;
  borderRadius: number;
  // Estado hover
  backgroundColorHover: string;
  textColorHover: string;
  shadowBlurHover: number;
  shadowColorHover: string;
  shadowOpacityHover: number;
  scaleHover: number;
}

export interface FounderTokenData extends Partial<FounderTokenStyles> {}

export interface FounderTokenProps
  extends HTMLAttributes<HTMLDivElement>,
    Partial<Omit<HydrogenComponentProps, "children">>,
    FounderTokenData {}

// ─── Helper ─────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function CopyButton(props: FounderTokenProps) {
  const {
    tokenText ,
    copiarText,
    labelText ,
    backgroundColor = "#ffffff",
    textColor = "#000000",
    shadowBlur = 20,
    shadowColor = "#ffffff",
    shadowOpacity = 0.3,
    fontSize = "1.4rem",
    fontFamily = "Outfit, sans-serif",
    fontWeight = "800",
    letterSpacing = 5,
    paddingX = 30,
    paddingY = 15,
    minWidth = 80,
    borderRadius = 2,
    backgroundColorHover = "#d1d1d6",
    textColorHover = "#000000",
    shadowBlurHover = 30,
    shadowColorHover = "#ffffff",
    shadowOpacityHover = 0.5,
    scaleHover = 1.02,
    className,
    style,
    ...rest
  } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleClick() {
    navigator.clipboard.writeText(copiarText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const baseShadow = `0 0 ${shadowBlur}px ${hexToRgba(shadowColor, shadowOpacity)}`;
  const hoverShadow = `0 0 ${shadowBlurHover}px ${hexToRgba(shadowColorHover, shadowOpacityHover)}`;

  const tokenStyle: React.CSSProperties = {
    backgroundColor: isHovered ? backgroundColorHover : backgroundColor,
    color: isHovered ? textColorHover : textColor,
    fontSize,
    fontFamily,
    fontWeight,
    letterSpacing: `${letterSpacing}px`,
    padding: `${paddingY}px ${paddingX}px`,
    minWidth: `${minWidth}%`,
    borderRadius: `${borderRadius}px`,
    boxShadow: isHovered ? hoverShadow : baseShadow,
    transform: isHovered ? `scale(${scaleHover})` : "scale(1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "inline-block",
    textAlign: "center",
    userSelect: "none",
  };

  return (
    <div
      {...rest}
      className={cn("flex flex-col items-center text-center", className)}
      style={style}
    >
      <div
        style={tokenStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Copiar código ${tokenText}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        {copied ? labelText : tokenText}
      </div>
    </div>
  );
}

export default CopyButton;

// ─── Inspector Inputs ────────────────────────────────────────────────────────

export const founderTokenInputs: InspectorGroup["inputs"] = [
  // Contenido
  {
    type: "text",
    name: "tokenText",
    label: "Texto",
    defaultValue: "FOUNDER",
    placeholder: "FOUNDER",
  },
  {
    type: "text",
    name: "labelText",
    label: "Texto Click",
    defaultValue: "Copiado ✓",
  },
  {
    type: "text",
    name: "copiarText",
    label: "Texto a copiar",
    defaultValue: "Copiado ",
  },

  // Estado normal
  { type: "heading", label: "Estado normal" },
  {
    type: "color",
    name: "backgroundColor",
    label: "Color de fondo",
    defaultValue: "#ffffff",
  },
  {
    type: "color",
    name: "textColor",
    label: "Color de texto",
    defaultValue: "#000000",
  },
  {
    type: "color",
    name: "shadowColor",
    label: "Color de sombra",
    defaultValue: "#ffffff",
  },
  {
    type: "range",
    name: "shadowBlur",
    label: "Blur sombra",
    defaultValue: 20,
    configs: { min: 0, max: 80, step: 2, unit: "px" },
  },
  {
    type: "range",
    name: "shadowOpacity",
    label: "Opacidad sombra",
    defaultValue: 0.3,
    configs: { min: 0, max: 1, step: 0.05 },
  },

  // Estado hover
  { type: "heading", label: "Estado hover" },
  {
    type: "color",
    name: "backgroundColorHover",
    label: "Fondo (hover)",
    defaultValue: "#d1d1d6",
  },
  {
    type: "color",
    name: "textColorHover",
    label: "Texto (hover)",
    defaultValue: "#000000",
  },
  {
    type: "color",
    name: "shadowColorHover",
    label: "Color sombra (hover)",
    defaultValue: "#ffffff",
  },
  {
    type: "range",
    name: "shadowBlurHover",
    label: "Blur sombra (hover)",
    defaultValue: 30,
    configs: { min: 0, max: 80, step: 2, unit: "px" },
  },
  {
    type: "range",
    name: "shadowOpacityHover",
    label: "Opacidad sombra (hover)",
    defaultValue: 0.5,
    configs: { min: 0, max: 1, step: 0.05 },
  },
  {
    type: "range",
    name: "scaleHover",
    label: "Escala (hover)",
    defaultValue: 1.02,
    configs: { min: 0.9, max: 1.2, step: 0.01 },
  },

  // Tipografía
  { type: "heading", label: "Tipografía" },
  {
    type: "text",
    name: "fontSize",
    label: "Tamaño de fuente",
    defaultValue: "1.4rem",
    placeholder: "1.4rem",
  },
  {
    type: "text",
    name: "fontFamily",
    label: "Familia tipográfica",
    defaultValue: "Outfit, sans-serif",
    placeholder: "Outfit, sans-serif",
  },
  {
    type: "select",
    name: "fontWeight",
    label: "Peso tipográfico",
    configs: {
      options: [
        { value: "300", label: "300 — Light" },
        { value: "400", label: "400 — Regular" },
        { value: "500", label: "500 — Medium" },
        { value: "600", label: "600 — Semibold" },
        { value: "700", label: "700 — Bold" },
        { value: "800", label: "800 — Extrabold" },
        { value: "900", label: "900 — Black" },
      ],
    },
    defaultValue: "800",
  },
  {
    type: "range",
    name: "letterSpacing",
    label: "Letter spacing",
    defaultValue: 5,
    configs: { min: 0, max: 20, step: 1, unit: "px" },
  },

  // Dimensiones
  { type: "heading", label: "Dimensiones" },
  {
    type: "range",
    name: "paddingX",
    label: "Padding horizontal",
    defaultValue: 30,
    configs: { min: 8, max: 80, step: 2, unit: "px" },
  },
  {
    type: "range",
    name: "paddingY",
    label: "Padding vertical",
    defaultValue: 15,
    configs: { min: 4, max: 40, step: 2, unit: "px" },
  },
  {
    type: "range",
    name: "minWidth",
    label: "Ancho mínimo",
    defaultValue: 80,
    configs: { min: 20, max: 100, step: 5, unit: "%" },
  },
  {
    type: "range",
    name: "borderRadius",
    label: "Border radius",
    defaultValue: 2,
    configs: { min: 0, max: 50, step: 1, unit: "px" },
  },
];

// ─── Schema ──────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "copybutton",
  title: "Copy button",
  settings: [
    {
      group: "Token",
      inputs: founderTokenInputs,
    },
  ],
  presets: {
    tokenText: "FOUNDER",
    labelText: "Tu clave de acceso (Clic para copiar)",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    shadowBlur: 20,
    shadowColor: "#ffffff",
    shadowOpacity: 0.3,
    fontSize: "1.4rem",
    fontFamily: "Outfit, sans-serif",
    fontWeight: "800",
    letterSpacing: 5,
    paddingX: 30,
    paddingY: 15,
    minWidth: 80,
    borderRadius: 2,
    backgroundColorHover: "#d1d1d6",
    textColorHover: "#000000",
    shadowBlurHover: 30,
    shadowColorHover: "#ffffff",
    shadowOpacityHover: 0.5,
    scaleHover: 1.02,
  },
});