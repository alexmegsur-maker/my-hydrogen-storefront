import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useState } from "react";

interface SocialTagProps extends HydrogenComponentProps {
  label: string;
  color: string;
  colorHover: string;
  borderColor: string;
  borderHoverColor: string;
  bgColor: string;
  bgHoverColor: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  letterSpacing: number;
  uppercase: boolean;
  borderRadius: number;
  paddingSelect: string;
  paddingText: string;
}

function SocialTag(props: SocialTagProps) {
  const {
    label,
    color,
    colorHover,
    borderColor,
    borderHoverColor,
    bgColor,
    bgHoverColor,
    fontSize,
    fontFamily,
    fontWeight,
    letterSpacing,
    uppercase,
    borderRadius,
    paddingSelect,
    paddingText,
    ...rest
  } = props;

  const [isHover, setIsHover] = useState(false);

  return (
    <span
      {...rest}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        textTransform: uppercase ? "uppercase" : "none",
        letterSpacing: letterSpacing > 0 ? `${letterSpacing}px` : "normal",
        color: isHover ? colorHover : color,
        backgroundColor: isHover ? bgHoverColor : bgColor,
        border: `1px solid ${isHover ? borderHoverColor : borderColor}`,
        borderRadius: `${borderRadius}px`,
        padding: paddingText || "4px 10px",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      {label}
    </span>
  );
}

export default SocialTag;

export const schema = createSchema({
  type: "social-tag",
  title: "Social Tag",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Label",
          defaultValue: "Instagram",
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "color",
          name: "color",
          label: "Text color",
          defaultValue: "#71717A",
        },
        {
          type: "color",
          name: "colorHover",
          label: "Text color (hover)",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          name: "bgColor",
          label: "Background",
          defaultValue: "transparent",
        },
        {
          type: "color",
          name: "bgHoverColor",
          label: "Background (hover)",
          defaultValue: "transparent",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Border color",
          defaultValue: "rgba(255,255,255,0.1)",
        },
        {
          type: "color",
          name: "borderHoverColor",
          label: "Border color (hover)",
          defaultValue: "rgba(255,255,255,0.3)",
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Border radius",
          defaultValue: 20,
          configs: { min: 0, max: 40, step: 2, unit: "px" },
        },
        {
          type: "text",
          name: "paddingText",
          label: "Padding (CSS shorthand)",
          defaultValue: "4px 10px",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "text",
          name: "fontSize",
          label: "Font size",
          defaultValue: "0.7rem",
        },
        {
          type: "text",
          name: "fontFamily",
          label: "Font family",
          defaultValue: "Inter, sans-serif",
        },
        {
          type: "select",
          name: "fontWeight",
          label: "Font weight",
          configs: {
            options: [
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "range",
          name: "letterSpacing",
          label: "Letter spacing",
          defaultValue: 1,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        {
          type: "switch",
          name: "uppercase",
          label: "Uppercase",
          defaultValue: true,
        },
      ],
    },
  ],
  presets: {
    label: "Instagram",
    color: "#71717A",
    colorHover: "#FFFFFF",
    bgColor: "transparent",
    bgHoverColor: "transparent",
    borderColor: "rgba(255,255,255,0.1)",
    borderHoverColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingText: "4px 10px",
    fontSize: "0.7rem",
    fontFamily: "Inter, sans-serif",
    fontWeight: "400",
    letterSpacing: 1,
    uppercase: true,
  },
});