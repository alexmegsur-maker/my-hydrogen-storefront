import { useGSAP } from "@gsap/react";
import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type CSSProperties } from "react";


// ─── Types ───────────────────────────────────────────────────────────────────

interface ComparisonColProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  colLabel: string;
  isHighlighted: boolean;
  // Label styles
  labelColor?: string;
  labelSize?: string;
  labelFamily?: string;
  labelWeight?: string;
  labelLetterSpacing?: number;
  // Animation
  fadeY?: number;
  fadeDuration?: number;
  fadeDelay?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

function ComparisonCol(props: ComparisonColProps) {
  const {
    colLabel,
    isHighlighted,
    labelColor,
    labelSize,
    labelFamily,
    labelWeight,
    labelLetterSpacing,
    fadeY,
    fadeDuration,
    fadeDelay,
    children,
    ref,
    ...rest
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const el = containerRef.current;
      if (!el) return;

      gsap.set(el, { opacity: 0, y: fadeY ?? 40 });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: fadeDuration ?? 0.8,
        delay: fadeDelay ?? 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef, dependencies: [fadeY, fadeDuration, fadeDelay] }
  );

  const labelStyle: CSSProperties = {
    color: labelColor ?? (isHighlighted ? "#FFFFFF" : "#A1A1AA"),
    fontSize: labelSize ?? "1.2rem",
    fontFamily: labelFamily ?? "'Outfit', sans-serif",
    fontWeight: labelWeight ?? "400",
    letterSpacing:
      labelLetterSpacing != null && labelLetterSpacing > 0
        ? `${labelLetterSpacing}px`
        : "0.1em",
  };

  return (
    <div
      ref={containerRef}
      {...rest}
      className={[
        "comparison-col px-12 py-16 text-left",
        isHighlighted
          ? "bg-white/[0.03] border border-white/20 -m-px z-10"
          : "bg-white/[0.01] border-r border-white/10",
      ].join(" ")}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <h3 className="uppercase mb-8" style={labelStyle}>
        {colLabel}
      </h3>

      <ul className="list-none p-0 m-0">{children}</ul>
    </div>
  );
}

export default ComparisonCol;

// ─── Schema ──────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "comparison-col",
  title: "Comparison Column",
  childTypes: ["comparison-line"],
  settings: [
    {
      group: "Column",
      inputs: [
        {
          type: "text",
          name: "colLabel",
          label: "Column heading",
          defaultValue: "Opción",
        },
        {
          type: "switch",
          name: "isHighlighted",
          label: "Highlighted (featured) column",
          defaultValue: false,
        },
      ],
    },
    {
      group: "Label style",
      inputs: [
        {
          type: "color",
          name: "labelColor",
          label: "Color",
          defaultValue: "#A1A1AA",
        },
        {
          type: "text",
          name: "labelSize",
          label: "Font size",
          defaultValue: "1.2rem",
        },
        {
          type: "text",
          name: "labelFamily",
          label: "Font family",
          defaultValue: "'Outfit', sans-serif",
        },
        {
          type: "select",
          name: "labelWeight",
          label: "Font weight",
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
            ],
          },
          defaultValue: "400",
        },
        {
          type: "range",
          name: "labelLetterSpacing",
          label: "Letter spacing",
          defaultValue: 2,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
      ],
    },
    {
      group: "Animación",
      inputs: [
        {
          type: "range",
          name: "fadeY",
          label: "Desplazamiento inicial (Y)",
          defaultValue: 40,
          configs: { min: 0, max: 120, step: 4, unit: "px" },
        },
        {
          type: "range",
          name: "fadeDuration",
          label: "Duración",
          defaultValue: 0.8,
          configs: { min: 0.2, max: 2.5, step: 0.1, unit: "s" },
        },
        {
          type: "range",
          name: "fadeDelay",
          label: "Delay inicial",
          defaultValue: 0,
          configs: { min: 0, max: 1.5, step: 0.1, unit: "s" },
        },
      ],
    },
  ],
  presets: {
    colLabel: "Opción",
    isHighlighted: false,
  },
});