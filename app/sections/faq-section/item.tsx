import {
  createSchema,
  type HydrogenComponentProps,
  type InspectorGroup,
} from "@weaverse/hydrogen";
import { useState, type HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FaqItemStyles {
  // Contenido
  question: string;
  answer: string;
  // Wrapper
  itemBg: string;
  itemBorderColor: string;
  itemBorderRadius: number;
  itemBgHover: string;
  itemBorderColorHover: string;
  // Cabecera
  questionFontSize: string;
  questionFontFamily: string;
  questionFontWeight: string;
  questionColor: string;
  questionPaddingX: number;
  questionPaddingY: number;
  // Icono
  iconColor: string;
  iconColorActive: string;
  iconSize: string;
  // Respuesta
  answerFontSize: string;
  answerColor: string;
  answerLineHeight: number;
  answerPaddingX: number;
  answerPaddingBottom: number;
}

export interface FaqItemProps
  extends HTMLAttributes<HTMLDivElement>,
    Partial<Omit<HydrogenComponentProps, "children">>,
    Partial<FaqItemStyles> {}

// ─── Component ────────────────────────────────────────────────────────────────

export function FaqItem(props: FaqItemProps) {
  const {
    question = "¿Cuál es tu pregunta?",
    answer = "Escribe aquí la respuesta a la pregunta.",
    itemBg = "rgba(255,255,255,0.01)",
    itemBorderColor = "rgba(255,255,255,0.15)",
    itemBorderRadius = 0,
    itemBgHover = "rgba(255,255,255,0.03)",
    itemBorderColorHover = "rgba(255,255,255,0.2)",
    questionFontSize = "1rem",
    questionFontFamily = "Outfit, sans-serif",
    questionFontWeight = "400",
    questionColor = "#ffffff",
    questionPaddingX = 32,
    questionPaddingY = 24,
    iconColor = "#71717a",
    iconColorActive = "#ffffff",
    iconSize = "1.5rem",
    answerFontSize = "0.9rem",
    answerColor = "#71717a",
    answerLineHeight = 1.7,
    answerPaddingX = 32,
    answerPaddingBottom = 24,
    className,
    style,
    ...rest
  } = props;

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      {...rest}
      className={cn(className)}
      style={{
        background: hovered ? itemBgHover : itemBg,
        border: `1px solid ${hovered ? itemBorderColorHover : itemBorderColor}`,
        borderRadius: `${itemBorderRadius}px`,
        overflow: "hidden",
        transition: "all 0.4s ease",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cabecera clickable */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `${questionPaddingY}px ${questionPaddingX}px`,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
        aria-expanded={open}
      >
        <span
          style={{
            fontFamily: questionFontFamily,
            fontSize: questionFontSize,
            fontWeight: questionFontWeight,
            color: questionColor,
            letterSpacing: "0.5px",
          }}
        >
          {question}
        </span>

        {/* Icono + / × */}
        <span
          aria-hidden
          style={{
            fontSize: iconSize,
            color: open ? iconColorActive : iconColor,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease, color 0.3s ease",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>

      {/* Respuesta con altura animada */}
      <div
        style={{
          maxHeight: open ? "400px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <p
          style={{
            padding: `0 ${answerPaddingX}px ${answerPaddingBottom}px`,
            fontSize: answerFontSize,
            color: answerColor,
            lineHeight: answerLineHeight,
            margin: 0,
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

export default FaqItem;

// ─── Inspector inputs ─────────────────────────────────────────────────────────

export const faqItemInputs: InspectorGroup["inputs"] = [
  // Contenido
  { type: "heading", label: "Contenido" },
  {
    type: "text",
    name: "question",
    label: "Pregunta",
    defaultValue: "¿Cuál es tu pregunta?",
    placeholder: "¿Cuál es tu pregunta?",
  },
  {
    type: "textarea",
    name: "answer",
    label: "Respuesta",
    defaultValue: "Escribe aquí la respuesta a la pregunta.",
    placeholder: "Escribe aquí la respuesta.",
  },

  // Wrapper
  { type: "heading", label: "Contenedor" },
  {
    type: "color",
    name: "itemBg",
    label: "Fondo",
    defaultValue: "rgba(255,255,255,0.01)",
  },
  {
    type: "color",
    name: "itemBorderColor",
    label: "Borde",
    defaultValue: "rgba(255,255,255,0.15)",
  },
  {
    type: "range",
    name: "itemBorderRadius",
    label: "Border radius",
    defaultValue: 0,
    configs: { min: 0, max: 24, step: 1, unit: "px" },
  },
  {
    type: "color",
    name: "itemBgHover",
    label: "Fondo (hover)",
    defaultValue: "rgba(255,255,255,0.03)",
  },
  {
    type: "color",
    name: "itemBorderColorHover",
    label: "Borde (hover)",
    defaultValue: "rgba(255,255,255,0.2)",
  },

  // Cabecera
  { type: "heading", label: "Pregunta" },
  {
    type: "color",
    name: "questionColor",
    label: "Color texto",
    defaultValue: "#ffffff",
  },
  {
    type: "text",
    name: "questionFontSize",
    label: "Tamaño fuente",
    defaultValue: "1rem",
  },
  {
    type: "text",
    name: "questionFontFamily",
    label: "Familia fuente",
    defaultValue: "Outfit, sans-serif",
  },
  {
    type: "select",
    name: "questionFontWeight",
    label: "Peso",
    configs: {
      options: [
        { value: "300", label: "300" },
        { value: "400", label: "400" },
        { value: "500", label: "500" },
        { value: "600", label: "600" },
        { value: "700", label: "700" },
        { value: "800", label: "800" },
      ],
    },
    defaultValue: "400",
  },
  {
    type: "range",
    name: "questionPaddingX",
    label: "Padding horizontal",
    defaultValue: 32,
    configs: { min: 8, max: 80, step: 4, unit: "px" },
  },
  {
    type: "range",
    name: "questionPaddingY",
    label: "Padding vertical",
    defaultValue: 24,
    configs: { min: 8, max: 60, step: 4, unit: "px" },
  },

  // Icono
  { type: "heading", label: "Icono" },
  {
    type: "color",
    name: "iconColor",
    label: "Color (cerrado)",
    defaultValue: "#71717a",
  },
  {
    type: "color",
    name: "iconColorActive",
    label: "Color (abierto)",
    defaultValue: "#ffffff",
  },
  {
    type: "text",
    name: "iconSize",
    label: "Tamaño icono",
    defaultValue: "1.5rem",
  },

  // Respuesta
  { type: "heading", label: "Respuesta" },
  {
    type: "color",
    name: "answerColor",
    label: "Color texto",
    defaultValue: "#71717a",
  },
  {
    type: "text",
    name: "answerFontSize",
    label: "Tamaño fuente",
    defaultValue: "0.9rem",
  },
  {
    type: "range",
    name: "answerLineHeight",
    label: "Line height",
    defaultValue: 1.7,
    configs: { min: 1, max: 3, step: 0.1 },
  },
  {
    type: "range",
    name: "answerPaddingX",
    label: "Padding horizontal",
    defaultValue: 32,
    configs: { min: 8, max: 80, step: 4, unit: "px" },
  },
  {
    type: "range",
    name: "answerPaddingBottom",
    label: "Padding inferior",
    defaultValue: 24,
    configs: { min: 8, max: 60, step: 4, unit: "px" },
  },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "faq-item",
  title: "FAQ Item",
  settings: [
    {
      group: "Item",
      inputs: faqItemInputs,
    },
  ],
  presets: {
    question: "¿Cuánto tiempo tarda la entrega?",
    answer:
      "Las entregas para fundadores comienzan en Mayo. Una vez confirmada tu reserva, recibirás actualizaciones mensuales sobre el estado de tu pedido.",
    itemBg: "rgba(255,255,255,0.01)",
    itemBorderColor: "rgba(255,255,255,0.15)",
    itemBorderRadius: 0,
    itemBgHover: "rgba(255,255,255,0.03)",
    itemBorderColorHover: "rgba(255,255,255,0.2)",
    questionFontSize: "1rem",
    questionFontFamily: "Outfit, sans-serif",
    questionFontWeight: "400",
    questionColor: "#ffffff",
    questionPaddingX: 32,
    questionPaddingY: 24,
    iconColor: "#71717a",
    iconColorActive: "#ffffff",
    iconSize: "1.5rem",
    answerFontSize: "0.9rem",
    answerColor: "#71717a",
    answerLineHeight: 1.7,
    answerPaddingX: 32,
    answerPaddingBottom: 24,
  },
});