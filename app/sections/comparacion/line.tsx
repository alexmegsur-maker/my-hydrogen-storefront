import { createSchema, useParentInstance } from "@weaverse/hydrogen";
import { useEffect, useState, type CSSProperties } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParentData {
  isHighlighted?: boolean;
}

interface LineItemProps {
  title: string;
  value: string;
  // Title styles
  titleColor?: string;
  titleSize?: string;
  titleFamily?: string;
  titleWeight?: string;
  // Highlighted title styles (overrides when parent isHighlighted=true)
  titleColorHighlighted?: string;
  titleWeightHighlighted?: string;
  // Value styles
  valueColor?: string;
  valueSize?: string;
  valueFamily?: string;
  valueWeight?: string;
  // Dash styles
  dashColor?: string;
  dashColorHighlighted?: string;
  // Row styles
  rowBorderColor?: string;
  rowPaddingY?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

function LineItem(props: LineItemProps) {
  const {
    title,
    value,
    titleColor,
    titleSize,
    titleFamily,
    titleWeight,
    titleColorHighlighted,
    titleWeightHighlighted,
    valueColor,
    valueSize,
    valueFamily,
    valueWeight,
    dashColor,
    dashColorHighlighted,
    rowBorderColor,
    rowPaddingY,
  } = props;

  const parentInstance = useParentInstance();
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (parentInstance) {
      setIsHighlighted((parentInstance.data as ParentData).isHighlighted ?? false);
    }
  }, [parentInstance]);

  const resolvedTitleStyle: CSSProperties = isHighlighted
    ? {
        color: titleColorHighlighted ?? "#FFFFFF",
        fontWeight: titleWeightHighlighted ?? "400",
        fontSize: titleSize ?? "0.95rem",
        fontFamily: titleFamily ?? "'Inter', sans-serif",
      }
    : {
        color: titleColor ?? "#71717A",
        fontWeight: titleWeight ?? "300",
        fontSize: titleSize ?? "0.95rem",
        fontFamily: titleFamily ?? "'Inter', sans-serif",
      };

  const valueStyle: CSSProperties = {
    color: valueColor ?? "#71717A",
    fontSize: valueSize ?? "0.95rem",
    fontFamily: valueFamily ?? "'Inter', sans-serif",
    fontWeight: valueWeight ?? "300",
  };

  const dashStyle: CSSProperties = {
    color: isHighlighted
      ? (dashColorHighlighted ?? "#FFFFFF")
      : (dashColor ?? "#52525B"),
  };

  const rowStyle: CSSProperties = {
    paddingTop: rowPaddingY != null ? `${rowPaddingY}px` : "1.25rem",
    paddingBottom: rowPaddingY != null ? `${rowPaddingY}px` : "1.25rem",
    borderBottomColor: rowBorderColor ?? "rgba(255,255,255,0.05)",
  };

  return (
    <li
      className="flex justify-between items-center border-b gap-4"
      style={rowStyle}
    >
      {/* Dash prefix */}
      <span className="shrink-0" style={dashStyle}>
        —
      </span>

      {/* Feature name */}
      {isHighlighted ? (
        <strong className="flex-1" style={resolvedTitleStyle}>
          {title}
        </strong>
      ) : (
        <span className="flex-1" style={resolvedTitleStyle}>
          {title}
        </span>
      )}

      {/* Value */}
      <span className="shrink-0 text-right" style={valueStyle}>
        {value}
      </span>
    </li>
  );
}

export default LineItem;

// ─── Schema ──────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "comparison-line",
  title: "Line",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Feature",
          defaultValue: "Característica",
        },
        {
          type: "text",
          name: "value",
          label: "Value",
          defaultValue: "Valor",
        },
      ],
    },
    {
      group: "Title style",
      inputs: [
        {
          type: "color",
          name: "titleColor",
          label: "Color (normal)",
          defaultValue: "#71717A",
        },
        {
          type: "color",
          name: "titleColorHighlighted",
          label: "Color (highlighted col)",
          defaultValue: "#FFFFFF",
        },
        {
          type: "text",
          name: "titleSize",
          label: "Font size",
          defaultValue: "0.95rem",
        },
        {
          type: "text",
          name: "titleFamily",
          label: "Font family",
          defaultValue: "'Inter', sans-serif",
        },
        {
          type: "select",
          name: "titleWeight",
          label: "Weight (normal)",
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
          type: "select",
          name: "titleWeightHighlighted",
          label: "Weight (highlighted col)",
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
      ],
    },
    {
      group: "Value style",
      inputs: [
        {
          type: "color",
          name: "valueColor",
          label: "Color",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          name: "valueSize",
          label: "Font size",
          defaultValue: "0.95rem",
        },
        {
          type: "text",
          name: "valueFamily",
          label: "Font family",
          defaultValue: "'Inter', sans-serif",
        },
        {
          type: "select",
          name: "valueWeight",
          label: "Weight",
          configs: {
            options: [
              { value: "100", label: "100 - Thin" },
              { value: "200", label: "200 - Extra Light" },
              { value: "300", label: "300 - Light" },
              { value: "400", label: "400 - Normal" },
              { value: "500", label: "500 - Medium" },
              { value: "600", label: "600 - Semi Bold" },
              { value: "700", label: "700 - Bold" },
            ],
          },
          defaultValue: "300",
        },
      ],
    },
    {
      group: "Row style",
      inputs: [
        {
          type: "color",
          name: "dashColor",
          label: "Dash color (normal)",
          defaultValue: "#52525B",
        },
        {
          type: "color",
          name: "dashColorHighlighted",
          label: "Dash color (highlighted col)",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          name: "rowBorderColor",
          label: "Row border color",
          defaultValue: "rgba(255,255,255,0.05)",
        },
        {
          type: "range",
          name: "rowPaddingY",
          label: "Row padding vertical",
          defaultValue: 20,
          configs: { min: 4, max: 48, step: 2, unit: "px" },
        },
      ],
    },
  ],
  presets: {
    title: "Característica",
    value: "Valor",
  },
});