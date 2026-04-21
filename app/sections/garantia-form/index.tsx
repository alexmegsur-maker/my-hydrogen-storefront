import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useFetcher } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Section, layoutInputs } from "~/components/section";
import { backgroundInputs } from "~/components/background-image";
import { selectorPaddingMargin } from "~/utils/general";
import { useIsMobile } from "~/hooks/use-is-mobile";

interface ContactFormSectionProps extends HydrogenComponentProps {
  // Header
  eyebrow: string;
  showEyebrow: boolean;
  title: string;
  showTitle: boolean;

  // Header typography
  eyebrowColor: string;
  eyebrowSize: string;
  eyebrowFamily: string;
  eyebrowWeight: string;
  eyebrowLetter: number;
  titleColor: string;
  titleSize: string;
  titleFamily: string;
  titleWeight: string;
  titleLetter: number;
  titleUpper: boolean;

  // Box styles
  boxBg: string;
  boxBorderColor: string;
  boxBorderRadius: number;
  boxPaddingSelect: string;
  boxPaddingText: string;
  boxMaxWidth: string;

  // Section padding
  paddingSelect: string;
  paddingText: string;
  sectionBg: string;
}

function ContactFormSection(props: ContactFormSectionProps) {
  const {
    eyebrow,
    showEyebrow,
    title,
    showTitle,
    eyebrowColor,
    eyebrowSize,
    eyebrowFamily,
    eyebrowWeight,
    eyebrowLetter,
    titleColor,
    titleSize,
    titleFamily,
    titleWeight,
    titleLetter,
    titleUpper,
    boxBg,
    boxBorderColor,
    boxBorderRadius,
    boxPaddingSelect,
    boxPaddingText,
    boxMaxWidth,
    paddingSelect,
    paddingText,
    sectionBg,
    children,
    ...rest
  } = props;

  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile(600)

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const response = fetcher.data as {success?:boolean;error?:string};
      if (response.success) {
        setSubmitted(true);
        setError(null);
        formRef.current?.reset();
      } else if (response.error) {
        setError(response.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Section
      {...rest}
      containerClassName="w-full"
      style={{
        backgroundColor: sectionBg,
        borderTop: "1px solid rgba(255,255,255,0.03)",
        ...selectorPaddingMargin("padding", paddingSelect, isMobile? "0.5rem":paddingText),
      }}
    >
      <div
        style={{
          maxWidth: boxMaxWidth,
          margin: "0 auto",
          backgroundColor: boxBg,
          border: `1px solid ${boxBorderColor}`,
          borderRadius: `${boxBorderRadius}px`,
          ...selectorPaddingMargin("padding", boxPaddingSelect,isMobile? "1.5rem":boxPaddingText),
        }}
      >
        {/* Form header */}
        {(showEyebrow || showTitle) && (
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            {showEyebrow && eyebrow && (
              <span
                style={{
                  display: "block",
                  fontFamily: eyebrowFamily,
                  fontSize: eyebrowSize,
                  fontWeight: eyebrowWeight,
                  color: eyebrowColor,
                  textTransform: "uppercase",
                  letterSpacing:
                    eyebrowLetter > 0 ? `${eyebrowLetter}px` : "normal",
                  marginBottom: "0.75rem",
                }}
              >
                {eyebrow}
              </span>
            )}
            {showTitle && title && (
              <h2
                style={{
                  fontFamily: titleFamily,
                  fontSize: titleSize,
                  fontWeight: titleWeight,
                  color: titleColor,
                  textTransform: titleUpper ? "uppercase" : "none",
                  letterSpacing:
                    titleLetter > 0 ? `${titleLetter}px` : "normal",
                }}
              >
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Success state */}
        {submitted ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "#A1A1AA",
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              style={{
                margin: "0 auto 1.5rem",
                display: "block",
                filter: "drop-shadow(0 0 12px rgba(255,255,255,0.4))",
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p style={{ color: "#FFFFFF", fontSize: "1.2rem", marginBottom: "0.5rem", fontFamily: "Outfit, sans-serif", fontWeight: 300 }}>
              Mensaje enviado.
            </p>
            <p>Te responderemos en un plazo máximo de 5 días hábiles.</p>
            <button
              onClick={() => setSubmitted(false)}
              style={{
                marginTop: "2rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#A1A1AA",
                padding: "10px 24px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
                borderRadius: "2px",
                transition: "all 0.3s ease",
              }}
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          /* The Shopify contact form */
          <fetcher.Form
            ref={formRef}
            method="POST"
            action="/api/extension-garantia"
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0",
              opacity: fetcher.state !== "idle" ? 0.7 : 1,
              transition: "opacity 0.3s ease" 
            }}
          >
            {/* Shopify requires this hidden field */}
            <input type="hidden" name="form_type" value="contact" />
            <input type="hidden" name="utf8" value="✓" />

            {/* Children: form-field & form-submit-button components */}
            {children}

            {/* Error message */}
            {error && (
              <p
                style={{
                  color: "#FF6B6B",
                  fontSize: "0.85rem",
                  fontFamily: "Inter, sans-serif",
                  marginTop: "1rem",
                  padding: "0.75rem 1rem",
                  border: "1px solid rgba(255,107,107,0.2)",
                  borderRadius: "2px",
                  backgroundColor: "rgba(255,107,107,0.05)",
                }}
              >
                {error}
              </p>
            )}

            {/* Loading overlay subtle indicator */}
            {fetcher.state !== "idle" && (
              <p
                style={{
                  color: "#71717A",
                  fontSize: "0.75rem",
                  fontFamily: "Inter, sans-serif",
                  textAlign: "center",
                  marginTop: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Enviando...
              </p>
            )}
          </fetcher.Form>
        )}
      </div>
    </Section>
  );
}

export default ContactFormSection;

export const schema = createSchema({
  type: "garantia-form-section",
  title: "Garantia Form",
  settings: [
    {
      group: "Header",
      inputs: [
        {
          type: "switch",
          name: "showEyebrow",
          label: "Show eyebrow",
          defaultValue: true,
        },
        {
          type: "text",
          name: "eyebrow",
          label: "Eyebrow text",
          defaultValue: "Soporte Phoenix",
        },
        {
          type: "switch",
          name: "showTitle",
          label: "Show title",
          defaultValue: true,
        },
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Registro de Garantía",
        },
      ],
    },
    {
      group: "Eyebrow Typography",
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
          defaultValue: "Inter, sans-serif",
        },
        {
          type: "select",
          name: "eyebrowWeight",
          label: "Font weight",
          configs: {
            options: [
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "600",
        },
        {
          type: "range",
          name: "eyebrowLetter",
          label: "Letter spacing",
          defaultValue: 4,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
      ],
    },
    {
      group: "Title Typography",
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
          defaultValue: "2.5rem",
        },
        {
          type: "text",
          name: "titleFamily",
          label: "Font family",
          defaultValue: "Outfit, sans-serif",
        },
        {
          type: "select",
          name: "titleWeight",
          label: "Font weight",
          configs: {
            options: [
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "600", label: "600" },
              { value: "800", label: "800" },
            ],
          },
          defaultValue: "300",
        },
        {
          type: "range",
          name: "titleLetter",
          label: "Letter spacing",
          defaultValue: 2,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        {
          type: "switch",
          name: "titleUpper",
          label: "Uppercase",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Box Style",
      inputs: [
        {
          type: "color",
          name: "boxBg",
          label: "Box background",
          defaultValue: "#050505",
        },
        {
          type: "color",
          name: "boxBorderColor",
          label: "Box border color",
          defaultValue: "rgba(255,255,255,0.05)",
        },
        {
          type: "range",
          name: "boxBorderRadius",
          label: "Box border radius",
          defaultValue: 4,
          configs: { min: 0, max: 32, step: 2, unit: "px" },
        },
        {
          type: "text",
          name: "boxMaxWidth",
          label: "Box max width",
          defaultValue: "800px",
        },
        {
          type: "select",
          name: "boxPaddingSelect",
          label: "Box padding type",
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
          name: "boxPaddingText",
          label: "Box padding value",
          defaultValue: "5rem 4rem",
        },
      ],
    },
    {
      group: "Section",
      inputs: [
        {
          type: "color",
          name: "sectionBg",
          label: "Section background",
          defaultValue: "#020202",
        },
        {
          type: "select",
          name: "paddingSelect",
          label: "Section padding type",
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
          name: "paddingText",
          label: "Section padding value",
          defaultValue: "4rem 2rem 8rem 2rem",
        },
      ],
    },
    {
      group: "Layout",
      inputs: layoutInputs.filter(({ name }) => name !== "gap"),
    },
  ],
  childTypes: ["form-field", "form-submit-button","slide-elements"],
  presets: {
    showEyebrow: true,
    eyebrow: "Soporte Phoenix",
    showTitle: true,
    title: "Registro de Garantía",
    eyebrowColor: "#71717A",
    eyebrowSize: "0.75rem",
    eyebrowFamily: "Inter, sans-serif",
    eyebrowWeight: "600",
    eyebrowLetter: 4,
    titleColor: "#FFFFFF",
    titleSize: "2.5rem",
    titleFamily: "Outfit, sans-serif",
    titleWeight: "300",
    titleLetter: 2,
    titleUpper: true,
    boxBg: "#050505",
    boxBorderColor: "rgba(255,255,255,0.05)",
    boxBorderRadius: 4,
    boxMaxWidth: "800px",
    boxPaddingSelect: "a",
    boxPaddingText: "5rem 4rem",
    sectionBg: "#020202",
    paddingSelect: "a",
    paddingText: "4rem 2rem 8rem 2rem",
    children: [
      {
        type: "form-field",
        fieldName: "contact[email]",
        fieldType: "email",
        label: "Correo Electrónico de Compra",
        placeholder: "tu@email.com",
        required: true,
      },
      {
        type: "form-field",
        fieldName: "contact[phone]",
        fieldType: "tel",
        label: "Número de Pedido",
        placeholder: "Ej: PHX-1029384",
        required: true,
      },
      {
        type: "form-field",
        fieldName: "contact[body]",
        fieldType: "textarea",
        label: "URL de la Publicación Pública",
        placeholder: "https://instagram.com/p/...",
        required: true,
      },
      {
        type: "form-submit-button",
        buttonText: "Solicitar 5 Años de Garantía",
      },
    ],
  },
});