import { useGSAP } from "@gsap/react";
import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type CSSProperties } from "react";


// ─── Variants ────────────────────────────────────────────────────────────────

const wrapperVariants = cva(
  "comparison-wrapper relative w-full",
  {
    variants: {
      layout: {
        horizontal: "grid grid-cols-1 sm:grid-cols-2",
        vertical: "grid grid-cols-1",
      },
    },
    defaultVariants: { layout: "horizontal" },
  }
);

// ─── Types ───────────────────────────────────────────────────────────────────

interface ComparisonWrapperProps
  extends VariantProps<typeof wrapperVariants>,
    HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;

  // Content
  eyebrow?: string;
  title?: string;
  note?: string;

  // Section background & padding
  sectionBg?: string;
  sectionPaddingY?: number;
  sectionPaddingX?: number;
  maxWidth?: number;

  // Section border
  sectionBorderColor?: string;
  showSectionBorder?: boolean;

  // Grid border
  gridBorderColor?: string;

  // Eyebrow styles
  eyebrowColor?: string;
  eyebrowSize?: string;
  eyebrowFamily?: string;
  eyebrowLetterSpacing?: number;

  // Title styles
  titleColor?: string;
  titleSize?: string;
  titleFamily?: string;
  titleWeight?: string;
  titleLetterSpacing?: number;

  // Note styles
  noteColor?: string;
  noteSize?: string;

  // VS Badge
  showVsBadge?: boolean;
  vsBadgeText?: string;
  vsBadgeBg?: string;
  vsBadgeColor?: string;
  vsBadgeBorderColor?: string;
  vsBadgeSize?: string;
  vsBadgeFamily?: string;

  // Animation
  fadeY?: number;
  fadeDuration?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

function ComparisonWrapper(props: ComparisonWrapperProps) {
  const {
    eyebrow,
    title,
    note,
    layout,
    sectionBg,
    sectionPaddingY,
    sectionPaddingX,
    maxWidth,
    sectionBorderColor,
    showSectionBorder,
    gridBorderColor,
    eyebrowColor,
    eyebrowSize,
    eyebrowFamily,
    eyebrowLetterSpacing,
    titleColor,
    titleSize,
    titleFamily,
    titleWeight,
    titleLetterSpacing,
    noteColor,
    noteSize,
    showVsBadge,
    vsBadgeText,
    vsBadgeBg,
    vsBadgeColor,
    vsBadgeBorderColor,
    vsBadgeSize,
    vsBadgeFamily,
    fadeY,
    fadeDuration,
    children,
    ref,
    ...rest
  } = props;

  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const el = headerRef.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>(":scope > *", el);
      if (!items.length) return;

      gsap.set(items, { opacity: 0, y: fadeY ?? 30 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: fadeDuration ?? 0.8,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: headerRef, dependencies: [fadeY, fadeDuration] }
  );

  // ── Styles ────────────────────────────────────────────────────────────────

  const sectionStyle: CSSProperties = {
    background: sectionBg ?? "#0A0A0A",
    paddingTop: `${sectionPaddingY ?? 10}rem`,
    paddingBottom: `${sectionPaddingY ?? 10}rem`,
    paddingLeft: `${sectionPaddingX ?? 2}rem`,
    paddingRight: `${sectionPaddingX ?? 2}rem`,
    borderTop: showSectionBorder
      ? `1px solid ${sectionBorderColor ?? "rgba(255,255,255,0.05)"}`
      : undefined,
    borderBottom: showSectionBorder
      ? `1px solid ${sectionBorderColor ?? "rgba(255,255,255,0.05)"}`
      : undefined,
  };

  const containerStyle: CSSProperties = {
    maxWidth: `${maxWidth ?? 1000}px`,
  };

  const eyebrowStyle: CSSProperties = {
    color: eyebrowColor ?? "#71717A",
    fontSize: eyebrowSize ?? "0.75rem",
    fontFamily: eyebrowFamily ?? "'Inter', sans-serif",
    letterSpacing:
      eyebrowLetterSpacing != null
        ? `${eyebrowLetterSpacing}px`
        : "4px",
  };

  const titleStyle: CSSProperties = {
    color: titleColor ?? "#FFFFFF",
    fontSize: titleSize ?? "3rem",
    fontFamily: titleFamily ?? "'Outfit', sans-serif",
    fontWeight: titleWeight ?? "300",
    letterSpacing:
      titleLetterSpacing != null ? `${titleLetterSpacing}px` : "0.1em",
  };

  const noteStyle: CSSProperties = {
    color: noteColor ?? "#71717A",
    fontSize: noteSize ?? "0.9rem",
  };

  const gridStyle: CSSProperties = {
    border: `1px solid ${gridBorderColor ?? "rgba(255,255,255,0.1)"}`,
  };

  const badgeStyle: CSSProperties = {
    background: vsBadgeBg ?? "#050505",
    color: vsBadgeColor ?? "#FFFFFF",
    border: `1px solid ${vsBadgeBorderColor ?? "rgba(255,255,255,0.2)"}`,
    fontSize: vsBadgeSize ?? "0.9rem",
    fontFamily: vsBadgeFamily ?? "'Outfit', sans-serif",
  };

  return (
    <section style={sectionStyle}>
      <div
        className="mx-auto text-center"
        style={containerStyle}
      >
        {/* Header — animated */}
        <div ref={headerRef}>
          {eyebrow && (
            <span
              className="block uppercase mb-6 tracking-widest"
              style={eyebrowStyle}
            >
              {eyebrow}
            </span>
          )}

          {title && (
            <h2
              className="uppercase mb-16"
              style={titleStyle}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Grid */}
        <div
          ref={ref}
          {...rest}
          className={wrapperVariants({ layout })}
          style={gridStyle}
        >
          {children}

          {/* VS Badge */}
          {showVsBadge && layout === "horizontal" && (
            <div
              className="
                hidden sm:flex
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                items-center justify-center
                px-4 py-2 z-10
                uppercase tracking-widest
              "
              style={badgeStyle}
            >
              {vsBadgeText || "VS"}
            </div>
          )}
        </div>

        {/* Note */}
        {note && (
          <p
            className="mt-12 tracking-wide"
            style={noteStyle}
            dangerouslySetInnerHTML={{ __html: note }}
          />
        )}
      </div>
    </section>
  );
}

export default ComparisonWrapper;

// ─── Schema ──────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "comparison-wrapper",
  title: "Comparison Wrapper",
  childTypes: ["comparison-col"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "eyebrow",
          label: "Eyebrow text",
          defaultValue: "Manufactura tier-1. Especificaciones superiores.",
        },
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Ingeniería sin compromiso",
        },
        {
          type: "text",
          name: "note",
          label: "Footer note (HTML allowed)",
          defaultValue:
            "Precio directo: <strong style='color:#fff;font-weight:400'>449 €</strong> · Envío DDP incluido",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "toggle-group",
          name: "layout",
          label: "Grid layout",
          configs: {
            options: [
              { value: "horizontal", label: "Horizontal (2 cols)" },
              { value: "vertical", label: "Vertical (1 col)" },
            ],
          },
          defaultValue: "horizontal",
        },
        {
          type: "range",
          name: "maxWidth",
          label: "Max width container",
          defaultValue: 1000,
          configs: { min: 600, max: 1600, step: 50, unit: "px" },
        },
        {
          type: "range",
          name: "sectionPaddingY",
          label: "Padding vertical",
          defaultValue: 10,
          configs: { min: 2, max: 20, step: 1, unit: "rem" },
        },
        {
          type: "range",
          name: "sectionPaddingX",
          label: "Padding horizontal",
          defaultValue: 2,
          configs: { min: 0, max: 10, step: 0.5, unit: "rem" },
        },
      ],
    },
    {
      group: "Section style",
      inputs: [
        {
          type: "color",
          name: "sectionBg",
          label: "Background color",
          defaultValue: "#0A0A0A",
        },
        {
          type: "switch",
          name: "showSectionBorder",
          label: "Show top/bottom border",
          defaultValue: true,
        },
        {
          type: "color",
          name: "sectionBorderColor",
          label: "Border color",
          defaultValue: "rgba(255,255,255,0.05)",
        },
        {
          type: "color",
          name: "gridBorderColor",
          label: "Grid border color",
          defaultValue: "rgba(255,255,255,0.1)",
        },
      ],
    },
    {
      group: "Eyebrow style",
      inputs: [
        {
          type: "color",
          name: "eyebrowColor",
          label: "Color",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          name: "eyebrowSize",
          label: "Font size",
          defaultValue: "0.75rem",
        },
        {
          type: "text",
          name: "eyebrowFamily",
          label: "Font family",
          defaultValue: "'Inter', sans-serif",
        },
        {
          type: "range",
          name: "eyebrowLetterSpacing",
          label: "Letter spacing",
          defaultValue: 4,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
      ],
    },
    {
      group: "Title style",
      inputs: [
        {
          type: "color",
          name: "titleColor",
          label: "Color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "text",
          name: "titleSize",
          label: "Font size",
          defaultValue: "3rem",
        },
        {
          type: "text",
          name: "titleFamily",
          label: "Font family",
          defaultValue: "'Outfit', sans-serif",
        },
        {
          type: "select",
          name: "titleWeight",
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
          defaultValue: "300",
        },
        {
          type: "range",
          name: "titleLetterSpacing",
          label: "Letter spacing",
          defaultValue: 2,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
      ],
    },
    {
      group: "Note style",
      inputs: [
        {
          type: "color",
          name: "noteColor",
          label: "Color",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          name: "noteSize",
          label: "Font size",
          defaultValue: "0.9rem",
        },
      ],
    },
    {
      group: "VS Badge",
      inputs: [
        {
          type: "switch",
          name: "showVsBadge",
          label: "Show VS badge",
          defaultValue: true,
        },
        {
          type: "text",
          name: "vsBadgeText",
          label: "Badge text",
          defaultValue: "VS",
        },
        {
          type: "color",
          name: "vsBadgeBg",
          label: "Background",
          defaultValue: "#050505",
        },
        {
          type: "color",
          name: "vsBadgeColor",
          label: "Text color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          name: "vsBadgeBorderColor",
          label: "Border color",
          defaultValue: "rgba(255,255,255,0.2)",
        },
        {
          type: "text",
          name: "vsBadgeSize",
          label: "Font size",
          defaultValue: "0.9rem",
        },
        {
          type: "text",
          name: "vsBadgeFamily",
          label: "Font family",
          defaultValue: "'Outfit', sans-serif",
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
          defaultValue: 30,
          configs: { min: 0, max: 120, step: 4, unit: "px" },
        },
        {
          type: "range",
          name: "fadeDuration",
          label: "Duración",
          defaultValue: 0.8,
          configs: { min: 0.2, max: 2.5, step: 0.1, unit: "s" },
        },
      ],
    },
  ],
  presets: {
    eyebrow: "Manufactura tier-1. Especificaciones superiores.",
    title: "Ingeniería sin compromiso",
    layout: "horizontal",
    showVsBadge: true,
    vsBadgeText: "VS",
    showSectionBorder: true,
    note: "Precio directo: <strong style='color:#fff;font-weight:400'>449 €</strong> · Envío DDP incluido",
    children: [
      {
        type: "comparison-col",
        colLabel: "Estándar Premium",
        isHighlighted: false,
      },
      {
        type: "comparison-col",
        colLabel: "Monarch Remaster",
        isHighlighted: true,
      },
    ],
  },
});