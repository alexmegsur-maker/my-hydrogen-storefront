import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"

interface CookieTableCellProps extends Partial<HydrogenComponentProps> {
  content: string;
  cellType: "th" | "td";
  color?: string;
  textSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  alignment?: "left" | "center" | "right" | "justify";
  padding?: string;
  lineH?: number;
  colSpan?: number;
}

// Styles that match the original HTML exactly
const TH_STYLES: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#71717A",          // matches .cookie-table th
  textTransform: "uppercase",
  letterSpacing: "2px",
  padding: "1rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
  fontFamily: "Outfit, sans-serif",
}

const TD_STYLES: React.CSSProperties = {
  padding: "1rem",
  fontSize: "0.9rem",
  color: "#A1A1AA",          // matches .cookie-table td
  lineHeight: 1.6,
  fontWeight: 400,
}

function CookieTableCell(props: CookieTableCellProps) {
  const {
    content,
    cellType = "td",
    color,
    textSize,
    fontWeight,
    fontFamily,
    alignment,
    padding,
    lineH,
    colSpan,
    ...rest
  } = props

  const baseStyles = cellType === "th" ? TH_STYLES : TD_STYLES

  const overrides: React.CSSProperties = {
    ...(color      && { color }),
    ...(textSize   && { fontSize: textSize }),
    ...(fontWeight && { fontWeight }),
    ...(fontFamily && { fontFamily }),
    ...(alignment  && { textAlign: alignment }),
    ...(padding    && { padding }),
    ...(lineH && lineH > 0 && { lineHeight: lineH }),
  }

  const finalStyles: React.CSSProperties = { ...baseStyles, ...overrides }

  if (cellType === "th") {
    return (
      <th
        colSpan={colSpan}
        style={finalStyles}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <td
      colSpan={colSpan}
      style={finalStyles}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default CookieTableCell

export const schema = createSchema({
  type: "cookie-table-cell",
  title: "Cell",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "richtext",
          name: "content",
          label: "Content",
          defaultValue: "Contenido de la celda",
          placeholder: "Escribe el contenido aquí...",
        },
        {
          type: "select",
          name: "cellType",
          label: "Cell type",
          configs: {
            options: [
              { value: "th", label: "Header (th)" },
              { value: "td", label: "Data (td)" },
            ],
          },
          defaultValue: "td",
        },
        {
          type: "text",
          name: "colSpan",
          label: "Col span",
          defaultValue: "",
          placeholder: "Ej: 2",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "color",
          name: "color",
          label: "Text color",
          // leave empty → inherits from th/td base styles
        },
        {
          type: "text",
          name: "textSize",
          label: "Font size",
          placeholder: "Ej: 0.9rem",
        },
        {
          type: "select",
          name: "fontWeight",
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
              { value: "900", label: "900 - Black" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "text",
          name: "fontFamily",
          label: "Font family",
          placeholder: "Ej: Outfit, Inter",
        },
        {
          type: "toggle-group",
          name: "alignment",
          label: "Alignment",
          configs: {
            options: [
              { value: "left",    label: "Left",    icon: "align-start-vertical" },
              { value: "center",  label: "Center",  icon: "align-center-vertical" },
              { value: "right",   label: "Right",   icon: "align-end-vertical" },
              { value: "justify", label: "Justify", icon: "align-justify" },
            ],
          },
          defaultValue: "left",
        },
        {
          type: "range",
          name: "lineH",
          label: "Line height",
          defaultValue: 0,
          configs: { min: 0, max: 5, step: 0.1, unit: "u" },
        },
      ],
    },
    {
      group: "Spacing",
      inputs: [
        {
          type: "text",
          name: "padding",
          label: "Padding",
          placeholder: "Ej: 1rem 1.5rem",
        },
      ],
    },
  ],
})