import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";

interface FormFieldProps extends HydrogenComponentProps {
  // Field config
  fieldName: string;
  fieldType: "text" | "email" | "tel" | "url" | "number" | "textarea" | "select";
  label: string;
  placeholder: string;
  required: boolean;
  selectOptions: string; // comma-separated options for select type
  rows: number; // for textarea

  // Conditional max length (depende del valor de otro campo del formulario)
  enableConditionalMaxLength: boolean;
  watchFieldName: string; // name (HTML) del campo a observar, ej: properties[comercio_de_compra]
  watchFieldValue: string; // valor que activa la restricción, ej: "Web"
  maxLengthWhenMatch: number; // maxLength aplicado cuando watchFieldName === watchFieldValue

  // Spacing
  marginBottom: number;

  // Label styles
  labelColor: string;
  labelSize: string;
  labelFamily: string;
  labelWeight: string;
  labelLetter: number;
  labelUpper: boolean;

  // Input styles
  inputColor: string;
  inputPlaceholderColor: string;
  inputSize: string;
  inputFamily: string;
  inputWeight: string;
  inputBorderColor: string;
  inputBorderFocusColor: string;
  inputBg: string;
  inputPaddingSelect: string;
  inputPaddingText: string;
}

function FormField(props: FormFieldProps) {
  const {
    fieldName,
    fieldType,
    label,
    placeholder,
    required,
    selectOptions,
    rows,
    enableConditionalMaxLength,
    watchFieldName,
    watchFieldValue,
    maxLengthWhenMatch,
    marginBottom,
    labelColor,
    labelSize,
    labelFamily,
    labelWeight,
    labelLetter,
    labelUpper,
    inputColor,
    inputPlaceholderColor,
    inputSize,
    inputFamily,
    inputWeight,
    inputBorderColor,
    inputBorderFocusColor,
    inputBg,
    inputPaddingSelect,
    inputPaddingText,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [watchedMatches, setWatchedMatches] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Observa el valor de otro campo (mismo <form>) para restringir dinámicamente
  // el maxLength de este input — ej: número de pedido limitado a 4 dígitos
  // solo cuando "comercio de compra" es "Web".
  useEffect(() => {
    if (!enableConditionalMaxLength || !watchFieldName) return;
    const formEl = inputRef.current?.form;
    const watched = formEl?.elements.namedItem(watchFieldName) as
      | HTMLInputElement
      | HTMLSelectElement
      | null;
    if (!watched) return;

    const check = () => setWatchedMatches(watched.value === watchFieldValue);
    check();
    watched.addEventListener("change", check);
    watched.addEventListener("input", check);
    return () => {
      watched.removeEventListener("change", check);
      watched.removeEventListener("input", check);
    };
  }, [enableConditionalMaxLength, watchFieldName, watchFieldValue]);

  const activeMaxLength =
    enableConditionalMaxLength && watchedMatches ? maxLengthWhenMatch : undefined;

  const sharedInputStyle: React.CSSProperties = {
    width: "100%",
    background: inputBg,
    border: "none",
    borderBottom: `1px solid ${isFocused ? inputBorderFocusColor : inputBorderColor}`,
    boxShadow: isFocused ? `0 1px 0 ${inputBorderFocusColor}` : "none",
    padding: inputPaddingText || "1rem 0",
    color: inputColor,
    fontFamily: inputFamily,
    fontSize: inputSize,
    fontWeight: inputWeight,
    outline: "none",
    transition: "all 0.3s ease",
    borderRadius: 0,
    appearance: "none" as const,
  };

  // Parsed select options
  const parsedOptions = selectOptions
    ? selectOptions.split(",").map((o) => o.trim()).filter(Boolean)
    : [];

  const inputId = `field-${fieldName.replace(/[\[\]]/g, "-")}`;

  return (
    <div
      {...rest}
      style={{ marginBottom: `${marginBottom}rem`, position: "relative" }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: "block",
            fontFamily: labelFamily,
            fontSize: labelSize,
            fontWeight: labelWeight,
            color: labelColor,
            textTransform: labelUpper ? "uppercase" : "none",
            letterSpacing: labelLetter > 0 ? `${labelLetter}px` : "normal",
            marginBottom: "0.5rem",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#71717A", marginLeft: "4px" }}>*</span>
          )}
        </label>
      )}

      {fieldType === "textarea" ? (
        <textarea
          id={inputId}
          name={fieldName}
          placeholder={placeholder}
          required={required}
          rows={rows || 4}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...sharedInputStyle,
            resize: "vertical",
            minHeight: `${(rows || 4) * 1.8}rem`,
          }}
        />
      ) : fieldType === "select" ? (
        <select
          id={inputId}
          name={fieldName}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...sharedInputStyle,
            cursor: "pointer",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0 center",
            paddingRight: "1.5rem",
          }}
        >
          <option value="" disabled selected style={{ color: "#3F3F46" }}>
            {placeholder || "Selecciona una opción"}
          </option>
          {parsedOptions.map((opt) => (
            <option
              key={opt}
              value={opt}
              style={{ backgroundColor: "#050505", color: "#FFFFFF" }}
            >
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={inputRef}
          id={inputId}
          type={fieldType}
          name={fieldName}
          placeholder={placeholder}
          required={required}
          maxLength={activeMaxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={sharedInputStyle}
        />
      )}

      {/* Placeholder color via injected style — inline styles can't target ::placeholder */}
      <style>{`
        #${inputId}::placeholder { color: ${inputPlaceholderColor}; }
        #${inputId} option { background-color: #050505; }
      `}</style>
    </div>
  );
}

export default FormField;

export const schema = createSchema({
  type: "form-field",
  title: "Form Field",
  settings: [
    {
      group: "Field Config",
      inputs: [
        {
          type: "text",
          name: "fieldName",
          label: "Field name (HTML name attr)",
          defaultValue: "contact[body]",
          helpText:
            'Shopify contact form fields: contact[name], contact[email], contact[phone], contact[body]. Para campos extra usa contact[body] o añade prefijo properties[nombre].',
        },
        {
          type: "select",
          name: "fieldType",
          label: "Field type",
          configs: {
            options: [
              { value: "text", label: "Text" },
              { value: "email", label: "Email" },
              { value: "tel", label: "Phone / Tel" },
              { value: "url", label: "URL" },
              { value: "number", label: "Number" },
              { value: "textarea", label: "Textarea" },
              { value: "select", label: "Select (dropdown)" },
            ],
          },
          defaultValue: "text",
        },
        {
          type: "text",
          name: "label",
          label: "Label text",
          defaultValue: "Campo",
        },
        {
          type: "text",
          name: "placeholder",
          label: "Placeholder",
          defaultValue: "Escribe aquí...",
        },
        {
          type: "switch",
          name: "required",
          label: "Required",
          defaultValue: false,
        },
        {
          type: "text",
          name: "selectOptions",
          label: "Select options (comma separated)",
          defaultValue: "Opción 1, Opción 2, Opción 3",
          helpText: 'Solo se usa cuando el tipo es "Select (dropdown)".',
          condition: (data: FormFieldProps) => data.fieldType === "select",
        },
        {
          type: "range",
          name: "rows",
          label: "Textarea rows",
          defaultValue: 4,
          configs: { min: 2, max: 12, step: 1, unit: "rows" },
          helpText: 'Solo se usa cuando el tipo es "Textarea".',
          condition: (data: FormFieldProps) => data.fieldType === "textarea",
        },
        {
          type: "range",
          name: "marginBottom",
          label: "Margin bottom",
          defaultValue: 2.5,
          configs: { min: 0, max: 8, step: 0.5, unit: "rem" },
        },
      ],
    },
    {
      group: "Max length condicional",
      inputs: [
        {
          type: "switch",
          name: "enableConditionalMaxLength",
          label: "Limitar longitud según otro campo",
          defaultValue: false,
          helpText:
            'Ej: limitar "Número de pedido" a 4 caracteres solo cuando "Comercio de compra" sea "Web".',
        },
        {
          type: "text",
          name: "watchFieldName",
          label: "Campo a observar (name HTML)",
          placeholder: "properties[comercio_de_compra]",
          condition: (data: FormFieldProps) => data.enableConditionalMaxLength === true,
        },
        {
          type: "text",
          name: "watchFieldValue",
          label: "Valor que activa el límite",
          placeholder: "Web",
          condition: (data: FormFieldProps) => data.enableConditionalMaxLength === true,
        },
        {
          type: "range",
          name: "maxLengthWhenMatch",
          label: "Longitud máxima",
          defaultValue: 4,
          configs: { min: 1, max: 50, step: 1 },
          condition: (data: FormFieldProps) => data.enableConditionalMaxLength === true,
        },
      ],
    },
    {
      group: "Label Style",
      inputs: [
        {
          type: "color",
          name: "labelColor",
          label: "Color",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          name: "labelSize",
          label: "Font size",
          defaultValue: "0.75rem",
        },
        {
          type: "text",
          name: "labelFamily",
          label: "Font family",
          defaultValue: "Inter, sans-serif",
        },
        {
          type: "select",
          name: "labelWeight",
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
          name: "labelLetter",
          label: "Letter spacing",
          defaultValue: 2,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        {
          type: "switch",
          name: "labelUpper",
          label: "Uppercase",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Input Style",
      inputs: [
        {
          type: "color",
          name: "inputColor",
          label: "Text color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          name: "inputPlaceholderColor",
          label: "Placeholder color",
          defaultValue: "#3F3F46",
        },
        {
          type: "color",
          name: "inputBg",
          label: "Background",
          defaultValue: "transparent",
        },
        {
          type: "color",
          name: "inputBorderColor",
          label: "Border color",
          defaultValue: "rgba(255,255,255,0.1)",
        },
        {
          type: "color",
          name: "inputBorderFocusColor",
          label: "Border focus color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "text",
          name: "inputSize",
          label: "Font size",
          defaultValue: "1.1rem",
        },
        {
          type: "text",
          name: "inputFamily",
          label: "Font family",
          defaultValue: "Inter, sans-serif",
        },
        {
          type: "select",
          name: "inputWeight",
          label: "Font weight",
          configs: {
            options: [
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
            ],
          },
          defaultValue: "300",
        },
        {
          type: "text",
          name: "inputPaddingText",
          label: "Input padding (CSS)",
          defaultValue: "1rem 0",
        },
      ],
    },
  ],
  presets: {
    fieldName: "contact[body]",
    fieldType: "text",
    label: "Tu mensaje",
    placeholder: "Escribe aquí...",
    required: false,
    selectOptions: "Opción 1, Opción 2, Opción 3",
    rows: 4,
    enableConditionalMaxLength: false,
    watchFieldName: "",
    watchFieldValue: "",
    maxLengthWhenMatch: 4,
    marginBottom: 2.5,
    labelColor: "#71717A",
    labelSize: "0.75rem",
    labelFamily: "Inter, sans-serif",
    labelWeight: "600",
    labelLetter: 2,
    labelUpper: true,
    inputColor: "#FFFFFF",
    inputPlaceholderColor: "#3F3F46",
    inputBg: "transparent",
    inputBorderColor: "rgba(255,255,255,0.1)",
    inputBorderFocusColor: "#FFFFFF",
    inputSize: "1.1rem",
    inputFamily: "Inter, sans-serif",
    inputWeight: "300",
    inputPaddingText: "1rem 0",
  },
});