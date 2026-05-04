import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { Section, sectionSettings, type SectionProps } from "~/components/section"

interface CookieTableProps extends SectionProps, Partial<Omit<HydrogenComponentProps, "children">> {
  showBorder: boolean;
  borderColor: string;
  rounded: number;
}

function CookieTable(props: CookieTableProps) {
  const { showBorder, borderColor, rounded, children, ...rest } = props

  return (
    <Section {...rest}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          border: showBorder ? `1px solid ${borderColor}` : "unset",
          borderRadius: `${rounded}px`,
        }}
      >
        {children}
      </table>
    </Section>
  )
}

export default CookieTable

export const schema = createSchema({
  type: "simple-table",
  title: "Simple Table",
  childTypes: ["cookie-table-row"],
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "switch",
          label: "Show border",
          name: "showBorder",
          defaultValue: false,
        },
        {
          type: "color",
          label: "Border color",
          name: "borderColor",
          defaultValue: "rgba(255,255,255,0.1)",
        },
        {
          type: "range",
          label: "Border radius",
          name: "rounded",
          defaultValue: 0,
          configs: { min: 0, max: 100, step: 1, unit: "px" },
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    children: [
      // Header row
      {
        type: "cookie-table-row",
        rowType: "head",
        showBorderBottom: true,
        borderColor: "rgba(255,255,255,0.1)",
        children: [
          { type: "cookie-table-cell", content: "Tipo de Archivo",       cellType: "th" },
          { type: "cookie-table-cell", content: "Propósito Estructural", cellType: "th" },
          { type: "cookie-table-cell", content: "Estado",                cellType: "th" },
        ],
      },
      // Body row 1
      {
        type: "cookie-table-row",
        rowType: "body",
        showBorderBottom: true,
        borderColor: "rgba(255,255,255,0.05)",
        children: [
          { type: "cookie-table-cell", content: "Técnicas (Núcleo)",    cellType: "td", fontWeight: "500", color: "#FFFFFF" },
          { type: "cookie-table-cell", content: "Vitales para mantener tu sesión activa, recordar tu ID de Operador y procesar el carrito de forja. No recopilan datos personales cruzados.", cellType: "td" },
          { type: "cookie-table-cell", content: "Obligatorio",           cellType: "td", color: "#22c55e" },
        ],
      },
      // Body row 2
      {
        type: "cookie-table-row",
        rowType: "body",
        showBorderBottom: true,
        borderColor: "rgba(255,255,255,0.05)",
        children: [
          { type: "cookie-table-cell", content: "Analíticas (Telemetría)", cellType: "td", fontWeight: "500", color: "#FFFFFF" },
          { type: "cookie-table-cell", content: "Analizan flujos de navegación de forma anónima para ayudarnos a detectar cuellos de botella en la interfaz y optimizar el rendimiento del servidor.", cellType: "td" },
          { type: "cookie-table-cell", content: "Opcional",                cellType: "td", color: "#A1A1AA" },
        ],
      },
      // Body row 3
      {
        type: "cookie-table-row",
        rowType: "body",
        showBorderBottom: true,
        borderColor: "rgba(255,255,255,0.05)",
        children: [
          { type: "cookie-table-cell", content: "Marketing (Impacto)", cellType: "td", fontWeight: "500", color: "#FFFFFF" },
          { type: "cookie-table-cell", content: "Módulos de terceros (Píxeles) que evalúan la eficiencia de nuestras campañas y evitan mostrarte información redundante en otras plataformas.", cellType: "td" },
          { type: "cookie-table-cell", content: "Opcional",             cellType: "td", color: "#A1A1AA" },
        ],
      },
    ],
  },
})