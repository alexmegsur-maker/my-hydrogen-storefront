import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useState } from "react";
import { selectorPaddingMargin } from "~/utils/general";

interface StepCardProps extends HydrogenComponentProps {
  stepNumber: string;
  title: string;
  description: string;
  transitionDelay: number;

  // Card styles
  bgColor: string;
  borderColor: string;
  borderHoverColor: string;
  borderRadius: number;
  paddingSelect: string;
  paddingText: string;

  // Step number ghost styles
  showStepNumber: boolean;
  strokeStepNumber: boolean;
  stepNumberColor: string;
  stepNumberSize: string;
  stepNumberFamily: string;


  // Title styles
  tColor: string;
  tSize: string;
  tLetter: number;
  tUpper: boolean;
  tFamily: string;
  tWeight: string;
  tPaddingSelect: string;
  tPaddingText: string;
  tMarginSelect: string;
  tMarginText: string;

  // Description styles
  dColor: string;
  dSize: string;
  dLetter: number;
  dUpper: boolean;
  dFamily: string;
  dPaddingSelect: string;
  dPaddingText: string;
  dMarginSelect: string;
  dMarginText: string;
}

function StepCard(props: StepCardProps) {
  const {
    stepNumber,
    title,
    description,
    transitionDelay,
    bgColor,
    borderColor,
    borderHoverColor,
    borderRadius,
    paddingSelect,
    paddingText,
    showStepNumber,
    strokeStepNumber,
    stepNumberColor,
    stepNumberSize,
    stepNumberFamily,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tWeight,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    dColor,
    dSize,
    dLetter,
    dUpper,
    dFamily,
    dPaddingSelect,
    dPaddingText,
    dMarginSelect,
    dMarginText,
    children,
    ...rest
  } = props;

  const [isHover, setIsHover] = useState(false);

  return (
    <div
      {...rest}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${isHover ? borderHoverColor : borderColor}`,
        borderRadius: `${borderRadius}px`,
        position: "relative",
        overflow: "hidden",
        transform: isHover ? "translateY(-5px)" : "translateY(0)",
        transition: `all 0.5s ease ${transitionDelay}ms`,
        ...selectorPaddingMargin("padding", paddingSelect, paddingText),
      }}
    >
      {/* Ghost step number */}
      {showStepNumber && (
        <span
          style={{
            position: "absolute",
            top: "1rem",
            right: "1.5rem",
            fontFamily:stepNumberFamily,
            fontSize: stepNumberSize,
            fontWeight:strokeStepNumber? 800:500,
            color: strokeStepNumber?"transparent":`${isHover ? stepNumberColor : "rgba(255,255,255,0.05)"}`,
            WebkitTextStroke:strokeStepNumber? `1px ${isHover ? stepNumberColor : "rgba(255,255,255,0.05)"}`:"unset",
            lineHeight: 1,
            transition: "all 0.5s ease",
            zIndex: 0,
            pointerEvents: "none",
            transform: isHover ? "scale(1.05)" : "scale(1)",
          }}
        >
          {stepNumber}
        </span>
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Title */}
        <h3
          style={{
            fontFamily: tFamily,
            fontSize: tSize,
            fontWeight: tWeight,
            color: tColor,
            textTransform: tUpper ? "uppercase" : "none",
            letterSpacing: tLetter > 0 ? `${tLetter}px` : "normal",
            whiteSpace: "pre-line",
            ...selectorPaddingMargin("padding", tPaddingSelect, tPaddingText),
            ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
          }}
        >
          {title}
        </h3>

        {/* Description — supports HTML like <strong> and <br> */}
        <p
          dangerouslySetInnerHTML={{ __html: description }}
          style={{
            fontFamily: dFamily,
            fontSize: dSize,
            color: dColor,
            textTransform: dUpper ? "uppercase" : "none",
            letterSpacing: dLetter > 0 ? `${dLetter}px` : "normal",
            lineHeight: 1.7,
            ...selectorPaddingMargin("padding", dPaddingSelect, dPaddingText),
            ...selectorPaddingMargin("margin", dMarginSelect, dMarginText),
          }}
        />

        {/* Social tags slot */}
        {children && (
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default StepCard;

const paddingMarginInputs = (prefix: string, label: string) => [
  {
    type: "select" as const,
    label: `${label} padding type`,
    name: `${prefix}PaddingSelect`,
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
  {
    type: "text" as const,
    label: `${label} padding value`,
    name: `${prefix}PaddingText`,
  },
  {
    type: "select" as const,
    label: `${label} margin type`,
    name: `${prefix}MarginSelect`,
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
  {
    type: "text" as const,
    label: `${label} margin value`,
    name: `${prefix}MarginText`,
    defaultValue: "1.5rem",
  },
];

export const schema = createSchema({
  type: "step-card",
  title: "Step Card",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "stepNumber",
          label: "Step number",
          defaultValue: "01",
        },
        {
          type: "text",
          name: "title",
          label: "Title (use \\n for line break)",
          defaultValue: "Captura\nel momento",
        },
        
        {
          type: "richtext",
          name: "description",
          label: "Description",
          defaultValue:
            "<p>Haz una foto potente de tu <strong>Monarch</strong>.<br><br>Cuida el encuadre. Cuida la luz.</p>",
        },
        {
          type: "range",
          name: "transitionDelay",
          label: "Reveal delay (ms)",
          defaultValue: 0,
          configs: { min: 0, max: 600, step: 50, unit: "ms" },
        },
      ],
    },
    {
      group: "Card Style",
      inputs: [
        {
          type: "color",
          name: "bgColor",
          label: "Background color",
          defaultValue: "rgba(255,255,255,0.01)",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Border color",
          defaultValue: "rgba(255,255,255,0.05)",
        },
        {
          type: "color",
          name: "borderHoverColor",
          label: "Border hover color",
          defaultValue: "rgba(255,255,255,0.2)",
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Border radius",
          defaultValue: 4,
          configs: { min: 0, max: 40, step: 2, unit: "px" },
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
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "paddingText",
          defaultValue: "4rem 3rem",
        },
      ],
    },
    {
      group: "Step Number",
      inputs: [
        {
          type: "switch",
          name: "showStepNumber",
          label: "Show ghost step number",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "strokeStepNumber",
          label: "Stroke ghost step number",
          defaultValue: true,
        },
        {
          type: "color",
          name: "stepNumberColor",
          label: "Ghost number hover color",
          defaultValue: "rgba(255,255,255,0.2)",
        },
        {
          type: "text",
          name: "stepNumberSize",
          label: "Ghost number size",
          defaultValue: "8rem",
        },
        {
          type:'text',
          label:'Ghost number font family',
          name:'stepNumberFamily',
          defaultValue:"Outfit, sans-serif",
        },
      ],
    },
    {
      group: "Title",
      inputs: [
        {
          type: "color",
          name: "tColor",
          label: "Color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "text",
          name: "tSize",
          label: "Font size",
          defaultValue: "2rem",
        },
        {
          type: "range",
          name: "tLetter",
          label: "Letter spacing",
          defaultValue: 1,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        {
          type: "switch",
          name: "tUpper",
          label: "Uppercase",
          defaultValue: true,
        },
        {
          type: "text",
          name: "tFamily",
          label: "Font family",
          defaultValue: "Outfit, sans-serif",
        },
        {
          type: "select",
          name: "tWeight",
          label: "Font weight",
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
        ...paddingMarginInputs("t", "Title"),
      ],
    },
    {
      group: "Description",
      inputs: [
        {
          type: "color",
          name: "dColor",
          label: "Color",
          defaultValue: "#A1A1AA",
        },
        {
          type: "text",
          name: "dSize",
          label: "Font size",
          defaultValue: "1rem",
        },
        {
          type: "range",
          name: "dLetter",
          label: "Letter spacing",
          defaultValue: 0,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        {
          type: "switch",
          name: "dUpper",
          label: "Uppercase",
          defaultValue: false,
        },
        {
          type: "text",
          name: "dFamily",
          label: "Font family",
          defaultValue: "Inter, sans-serif",
        },
        ...paddingMarginInputs("d", "Description"),
      ],
    },
  ],
  childTypes: ["social-tag"],
  presets: {
    stepNumber: "01",
    title: "Captura\nel momento",
    description:
      "Haz una foto potente de tu <strong>Monarch Edición Limitada</strong>.<br><br>Cuida el encuadre y la luz.",
    transitionDelay: 0,
    bgColor: "rgba(255,255,255,0.01)",
    borderColor: "rgba(255,255,255,0.05)",
    borderHoverColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    paddingSelect: "a",
    paddingText: "4rem 3rem",
    showStepNumber: true,
    strokeStepNumber: true,
    stepNumberColor: "rgba(255,255,255,0.2)",
    stepNumberSize: "8rem",
    tColor: "#FFFFFF",
    tSize: "2rem",
    tLetter: 1,
    tUpper: true,
    tFamily: "Outfit, sans-serif",
    tWeight: "400",
    tMarginSelect: "b",
    tMarginText: "1.5rem",
    dColor: "#A1A1AA",
    dSize: "1rem",
    dLetter: 0,
    dUpper: false,
    dFamily: "Inter, sans-serif",
    dWeight: "300",
  },
});