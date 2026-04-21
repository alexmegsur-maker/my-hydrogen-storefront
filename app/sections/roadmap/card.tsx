import {
  createSchema,
  type HydrogenComponentProps,
  type InspectorGroup,
} from "@weaverse/hydrogen";
import { useState, type HTMLAttributes } from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { cn } from "~/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineStatus = "completed" | "active" | "pending";

export interface TimelineCardStyles {
  // Contenido
  date: string;
  title: string;
  description: string;
  status: TimelineStatus;
  // Dot
  dotSize: number;
  dotColorCompleted: string;
  dotColorActive: string;
  dotColorPending: string;
  // Card normal
  cardBg: string;
  cardBorderColor: string;
  cardBorderRadius: number;
  cardPaddingX: number;
  cardPaddingY: number;
  // Card hover
  cardBgHover: string;
  cardBorderColorHover: string;
  // Fecha
  dateFontSize: string;
  dateFontFamily: string;
  dateFontWeight: string;
  dateColor: string;
  dateLetterSpacing: number;
  // Título
  titleFontSize: string;
  titleFontFamily: string;
  titleFontWeight: string;
  titleColor: string;
  // Descripción
  descFontSize: string;
  descColor: string;
  change:boolean;
}

export interface TimelineCardProps
  extends HTMLAttributes<HTMLDivElement>,
    Partial<Omit<HydrogenComponentProps, "children">>,
    Partial<TimelineCardStyles> {}

// ─── Component ────────────────────────────────────────────────────────────────

export function TimelineCard(props: TimelineCardProps) {
  const {
    date = "Mayo 2026",
    title = "Nuevo hito",
    description = "Descripción del hito.",
    status = "pending",
    dotSize = 12,
    dotColorCompleted = "#22c55e",
    dotColorActive = "#ffffff",
    dotColorPending = "#3f3f46",
    cardBg = "rgba(255,255,255,0.02)",
    cardBorderColor = "rgba(255,255,255,0.15)",
    cardBorderRadius = 0,
    cardPaddingX = 32,
    cardPaddingY = 24,
    cardBgHover = "rgba(255,255,255,0.04)",
    cardBorderColorHover = "rgba(255,255,255,0.25)",
    dateFontSize = "0.75rem",
    dateFontFamily = "Outfit, sans-serif",
    dateFontWeight = "400",
    dateColor = "#71717a",
    dateLetterSpacing = 2,
    titleFontSize = "1.1rem",
    titleFontFamily = "Outfit, sans-serif",
    titleFontWeight = "600",
    titleColor = "#ffffff",
    descFontSize = "0.85rem",
    descColor = "#71717a",
    className,
    change,
    style,
    ...rest
  } = props;

  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile(600)

  function dotColor() {
    if (status === "completed") return dotColorCompleted;
    if (status === "active") return dotColorActive;
    return dotColorPending;
  }

  function dotGlow() {
    if (status === "completed") return `0 0 15px rgba(34,197,94,0.5)`;
    if (status === "active") return `0 0 15px rgba(255,255,255,0.6)`;
    return "none";
  }

  return (
    <div
      {...rest}
      className={cn("timeline-card-wrapper", className)}
      style={{
        position: "relative",
        justifyItems:change ? "flex-end":"flex-start",
        width:isMobile? "90%":"100%",
        marginInline:isMobile?"auto":"none",
        zIndex:2,
        ...style,
      }}
    >
      {/* Dot sobre la línea central — el padre RoadmapTimeline lo posiciona */}
      <div
        aria-hidden
        className="timeline-dot"
        data-status={status}
        style={{
          position: "absolute",
          top:`${cardPaddingY}px`,
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          background: dotColor(),
          borderRadius: "50%",
          boxShadow: dotGlow(),
          border: "2px solid transparent",
          animation:isMobile? "none": status === "active" ? "pulse-dot 2s ease-in-out infinite" : "none",
          zIndex: 2,
          justifySelf:"center",
          opacity:isMobile ? 0 :1,
        }}
      />

      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? cardBgHover : cardBg,
          border: `1px solid ${hovered ? cardBorderColorHover : cardBorderColor}`,
          borderRadius: `${cardBorderRadius}px`,
          padding: `${cardPaddingY}px ${cardPaddingX}px`,
          maxWidth: "300px",
          width: "100%",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            fontFamily: dateFontFamily,
            fontSize: dateFontSize,
            fontWeight: dateFontWeight,
            color: dateColor,
            letterSpacing: `${dateLetterSpacing}px`,
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          {date}
        </div>
        <div
          style={{
            fontFamily: titleFontFamily,
            fontSize: titleFontSize,
            fontWeight: titleFontWeight,
            color: titleColor,
            marginBottom: "6px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: descFontSize,
            color: descColor,
            lineHeight: 1.6,
          }}
        >
          {description}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export default TimelineCard;

// ─── Inspector inputs ─────────────────────────────────────────────────────────

export const timelineCardInputs: InspectorGroup["inputs"] = [
  // Contenido
  { type: "heading", label: "Contenido" },
  {
    type:'switch',
    label:'change side',
    name:'change',
    defaultValue:false,
  },
  {
    type: "text",
    name: "date",
    label: "Fecha / estado",
    defaultValue: "Mayo 2026",
    placeholder: "Mayo 2026",
  },
  {
    type: "text",
    name: "title",
    label: "Título",
    defaultValue: "Nuevo hito",
    placeholder: "Nuevo hito",
  },
  {
    type: "textarea",
    name: "description",
    label: "Descripción",
    defaultValue: "Descripción del hito.",
    placeholder: "Descripción del hito.",
  },
  {
    type: "select",
    name: "status",
    label: "Estado",
    configs: {
      options: [
        { value: "completed", label: "✅ Completado" },
        { value: "active",    label: "⚡ Activo (ahora)" },
        { value: "pending",   label: "⏳ Pendiente" },
      ],
    },
    defaultValue: "pending",
  },

  // Dot
  { type: "heading", label: "Dot" },
  {
    type: "range",
    name: "dotSize",
    label: "Tamaño dot",
    defaultValue: 12,
    configs: { min: 6, max: 28, step: 2, unit: "px" },
  },
  {
    type: "color",
    name: "dotColorCompleted",
    label: "Color — completado",
    defaultValue: "#22c55e",
  },
  {
    type: "color",
    name: "dotColorActive",
    label: "Color — activo",
    defaultValue: "#ffffff",
  },
  {
    type: "color",
    name: "dotColorPending",
    label: "Color — pendiente",
    defaultValue: "#3f3f46",
  },

  // Card normal
  { type: "heading", label: "Card" },
  {
    type: "color",
    name: "cardBg",
    label: "Fondo",
    defaultValue: "rgba(255,255,255,0.02)",
  },
  {
    type: "color",
    name: "cardBorderColor",
    label: "Borde",
    defaultValue: "rgba(255,255,255,0.15)",
  },
  {
    type: "range",
    name: "cardBorderRadius",
    label: "Border radius",
    defaultValue: 0,
    configs: { min: 0, max: 24, step: 1, unit: "px" },
  },
  {
    type: "range",
    name: "cardPaddingX",
    label: "Padding horizontal",
    defaultValue: 32,
    configs: { min: 8, max: 80, step: 4, unit: "px" },
  },
  {
    type: "range",
    name: "cardPaddingY",
    label: "Padding vertical",
    defaultValue: 24,
    configs: { min: 8, max: 60, step: 4, unit: "px" },
  },

  // Card hover
  { type: "heading", label: "Card — hover" },
  {
    type: "color",
    name: "cardBgHover",
    label: "Fondo (hover)",
    defaultValue: "rgba(255,255,255,0.04)",
  },
  {
    type: "color",
    name: "cardBorderColorHover",
    label: "Borde (hover)",
    defaultValue: "rgba(255,255,255,0.25)",
  },

  // Tipografía — fecha
  { type: "heading", label: "Tipografía — Fecha" },
  {
    type: "color",
    name: "dateColor",
    label: "Color",
    defaultValue: "#71717a",
  },
  {
    type: "text",
    name: "dateFontSize",
    label: "Tamaño",
    defaultValue: "0.75rem",
  },
  {
    type: "text",
    name: "dateFontFamily",
    label: "Familia",
    defaultValue: "Outfit, sans-serif",
  },
  {
    type: "range",
    name: "dateLetterSpacing",
    label: "Letter spacing",
    defaultValue: 2,
    configs: { min: 0, max: 10, step: 1, unit: "px" },
  },

  // Tipografía — título
  { type: "heading", label: "Tipografía — Título" },
  {
    type: "color",
    name: "titleColor",
    label: "Color",
    defaultValue: "#ffffff",
  },
  {
    type: "text",
    name: "titleFontSize",
    label: "Tamaño",
    defaultValue: "1.1rem",
  },
  {
    type: "text",
    name: "titleFontFamily",
    label: "Familia",
    defaultValue: "Outfit, sans-serif",
  },
  {
    type: "select",
    name: "titleFontWeight",
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
    defaultValue: "600",
  },

  // Tipografía — descripción
  { type: "heading", label: "Tipografía — Descripción" },
  {
    type: "color",
    name: "descColor",
    label: "Color",
    defaultValue: "#71717a",
  },
  {
    type: "text",
    name: "descFontSize",
    label: "Tamaño",
    defaultValue: "0.85rem",
  },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "timeline-card",
  title: "Timeline Card",
  settings: [
    {
      group: "Card",
      inputs: timelineCardInputs,
    },
  ],
  presets: {
    date: "Mayo 2026",
    title: "Nuevo hito",
    description: "Descripción del hito.",
    status: "pending",
    dotSize: 12,
    dotColorCompleted: "#22c55e",
    dotColorActive: "#ffffff",
    dotColorPending: "#3f3f46",
    cardBg: "rgba(255,255,255,0.02)",
    cardBorderColor: "rgba(255,255,255,0.15)",
    cardBorderRadius: 0,
    cardPaddingX: 32,
    cardPaddingY: 24,
    cardBgHover: "rgba(255,255,255,0.04)",
    cardBorderColorHover: "rgba(255,255,255,0.25)",
    dateFontSize: "0.75rem",
    dateFontFamily: "Outfit, sans-serif",
    dateFontWeight: "400",
    dateColor: "#71717a",
    dateLetterSpacing: 2,
    titleFontSize: "1.1rem",
    titleFontFamily: "Outfit, sans-serif",
    titleFontWeight: "600",
    titleColor: "#ffffff",
    descFontSize: "0.85rem",
    descColor: "#71717a",
  },
});