import {
  createSchema,
  type HydrogenComponentProps,
  type InspectorGroup,
} from "@weaverse/hydrogen";
import { type HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RoadmapLayoutStyles {
  lineColor: string;
  lineWidth: number;
  maxWidth: number;
  itemGap: number;
}

export interface RoadmapTimelineProps
  extends HTMLAttributes<HTMLDivElement>,
    Partial<Omit<HydrogenComponentProps, "children">>,
    Partial<RoadmapLayoutStyles> {
  
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RoadmapTimeline(props: RoadmapTimelineProps) {
  const {
    lineColor = "rgba(255,255,255,0.1)",
    lineWidth = 1,
    maxWidth = 800,
    itemGap = 48,
    children,
    className,
    style,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      className={cn("relative w-full", className)}
      style={{
        maxWidth: `${maxWidth}px`,
        margin: "0 auto",
        ...style,
      }}
    >
      {/* Línea vertical central */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: `${lineWidth}px`,
          background: lineColor,
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Ítems: cada TimelineCard se posiciona alternando izquierda/derecha */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${itemGap}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default RoadmapTimeline;

// ─── Inspector inputs ─────────────────────────────────────────────────────────

export const roadmapLayoutInputs: InspectorGroup["inputs"] = [
  { type: "heading", label: "Línea central" },
  {
    type: "color",
    name: "lineColor",
    label: "Color línea",
    defaultValue: "rgba(255,255,255,0.1)",
  },
  {
    type: "range",
    name: "lineWidth",
    label: "Grosor línea",
    defaultValue: 1,
    configs: { min: 1, max: 6, step: 1, unit: "px" },
  },

  { type: "heading", label: "Layout" },
  {
    type: "range",
    name: "maxWidth",
    label: "Ancho máximo",
    defaultValue: 800,
    configs: { min: 400, max: 1400, step: 50, unit: "px" },
  },
  {
    type: "range",
    name: "itemGap",
    label: "Espaciado entre ítems",
    defaultValue: 48,
    configs: { min: 8, max: 120, step: 8, unit: "px" },
  },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "roadmap-timeline",
  title: "Roadmap Timeline",
  childTypes: ["timeline-card","heading","subheading","paragraph"],
  settings: [
    {
      group: "Timeline",
      inputs: roadmapLayoutInputs,
    },
  ],
  presets: {
    lineColor: "rgba(255,255,255,0.1)",
    lineWidth: 1,
    maxWidth: 800,
    itemGap: 48,
    children: [
      {
        type: "timeline-card",
        date: "Completado",
        title: "Diseño Final",
        description: "Validación de prototipos y ajustes finales de ingeniería.",
        status: "completed",
      },
      {
        type: "timeline-card",
        date: "Completado",
        title: "Producción Iniciada",
        description: "Fabricación de componentes en fábricas certificadas.",
        status: "completed",
      },
      {
        type: "timeline-card",
        date: "Ahora",
        title: "Fase Founders",
        description: "Reserva exclusiva para fundadores con precio preferencial.",
        status: "active",
      },
      {
        type: "timeline-card",
        date: "Mayo 2026",
        title: "Envío Founders",
        description: "Entrega prioritaria a los 500 fundadores.",
        status: "pending",
      },
      {
        type: "timeline-card",
        date: "Junio 2026",
        title: "Lanzamiento Público",
        description: "Disponibilidad general al precio estándar.",
        status: "pending",
      },
    ],
  },
});