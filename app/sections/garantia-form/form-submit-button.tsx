import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useState } from "react";

interface FormSubmitButtonProps extends HydrogenComponentProps {
  buttonText: string;

  // Colors
  bgColor: string;
  bgHoverColor: string;
  textColor: string;
  textHoverColor: string;
  borderColor: string;
  borderHoverColor: string;

  // Typography
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  letterSpacing: number;
  uppercase: boolean;

  // Layout
  paddingSelect: string;
  paddingText: string;
  borderRadius: number;
  fullWidth: boolean;
  marginTop: number;

  // Neon effect
  enableNeonEffect: boolean;
  neonColor: string;
  enableHoverLift: boolean;
}

function FormSubmitButton(props: FormSubmitButtonProps) {
  const {
    buttonText,
    bgColor,
    bgHoverColor,
    textColor,
    textHoverColor,
    borderColor,
    borderHoverColor,
    fontSize,
    fontFamily,
    fontWeight,
    letterSpacing,
    uppercase,
    paddingSelect,
    paddingText,
    borderRadius,
    fullWidth,
    marginTop,
    enableNeonEffect,
    neonColor,
    enableHoverLift,
    ...rest
  } = props;

  const [isHover, setIsHover] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <>
      <button
        {...rest}
        type="submit"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => { setIsHover(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          width: fullWidth ? "100%" : "auto",
          fontFamily,
          fontSize,
          fontWeight,
          textTransform: uppercase ? "uppercase" : "none",
          letterSpacing: letterSpacing > 0 ? `${letterSpacing}px` : "normal",
          padding: paddingText || "22px 40px",
          cursor: "pointer",
          borderRadius: `${borderRadius}px`,
          backgroundColor: isHover ? bgHoverColor : bgColor,
          color: isHover ? textHoverColor : textColor,
          border: `1px solid ${isHover ? borderHoverColor : borderColor}`,
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
          marginTop: `${marginTop}rem`,
          transform: isPressed
            ? "translateY(1px)"
            : isHover && enableHoverLift
            ? "translateY(-3px)"
            : "translateY(0)",
          boxShadow:
            isHover && enableNeonEffect
              ? `0 0 20px ${neonColor}4D, 0 0 40px ${neonColor}1A`
              : "none",
        }}
      >
        {/* Neon scan pseudo-element simulation */}
        {enableNeonEffect && isHover && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "60%",
              background: `linear-gradient(90deg, transparent, ${neonColor}, transparent)`,
              filter: "blur(4px)",
              animation: "btnNeonScan 1.2s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              pointerEvents: "none",
            }}
          />
        )}

        <span style={{ position: "relative", zIndex: 1 }}>{buttonText}</span>
      </button>

      <style>{`
        @keyframes btnNeonScan {
          0%   { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(280%) skewX(-25deg); }
        }
      `}</style>
    </>
  );
}

export default FormSubmitButton;

export const schema = createSchema({
  type: "form-submit-button",
  title: "Submit Button",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Enviar mensaje",
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "bgColor",
          label: "Background",
          defaultValue: "rgba(255,255,255,0.03)",
        },
        {
          type: "color",
          name: "bgHoverColor",
          label: "Background (hover)",
          defaultValue: "#D1D1D6",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          name: "textHoverColor",
          label: "Text color (hover)",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Border color",
          defaultValue: "rgba(255,255,255,0.2)",
        },
        {
          type: "color",
          name: "borderHoverColor",
          label: "Border color (hover)",
          defaultValue: "#FFFFFF",
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
          defaultValue: "0.85rem",
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
          defaultValue: "600",
        },
        {
          type: "range",
          name: "letterSpacing",
          label: "Letter spacing",
          defaultValue: 2,
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
    {
      group: "Layout",
      inputs: [
        {
          type: "switch",
          name: "fullWidth",
          label: "Full width",
          defaultValue: true,
        },
        {
          type: "text",
          name: "paddingText",
          label: "Padding (CSS shorthand)",
          defaultValue: "22px 40px",
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Border radius",
          defaultValue: 2,
          configs: { min: 0, max: 40, step: 2, unit: "px" },
        },
        {
          type: "range",
          name: "marginTop",
          label: "Margin top",
          defaultValue: 2,
          configs: { min: 0, max: 8, step: 0.5, unit: "rem" },
        },
      ],
    },
    {
      group: "Effects",
      inputs: [
        {
          type: "switch",
          name: "enableNeonEffect",
          label: "Enable neon scan on hover",
          defaultValue: true,
        },
        {
          type: "color",
          name: "neonColor",
          label: "Neon scan color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "switch",
          name: "enableHoverLift",
          label: "Lift on hover",
          defaultValue: true,
        },
      ],
    },
  ],
  presets: {
    buttonText: "Enviar mensaje",
    bgColor: "rgba(255,255,255,0.03)",
    bgHoverColor: "#D1D1D6",
    textColor: "#FFFFFF",
    textHoverColor: "#000000",
    borderColor: "rgba(255,255,255,0.2)",
    borderHoverColor: "#FFFFFF",
    fontSize: "0.85rem",
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
    letterSpacing: 2,
    uppercase: true,
    fullWidth: true,
    paddingText: "22px 40px",
    borderRadius: 2,
    marginTop: 2,
    enableNeonEffect: true,
    neonColor: "#FFFFFF",
    enableHoverLift: true,
  },
});