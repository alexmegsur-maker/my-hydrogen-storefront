import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"

interface CookieTableRowProps extends HydrogenComponentProps {
  rowType: "head" | "body";
  showBorderBottom: boolean;
  borderColor: string;
  bgColor?: string;
}

function CookieTableRow(props: CookieTableRowProps) {
  const { rowType, showBorderBottom, borderColor, bgColor, children, ...rest } = props

  const content = (
    <tr
      {...rest}
      style={{
        borderBottom: showBorderBottom ? `1px solid ${borderColor}` : "unset",
        background: bgColor ?? "transparent",
      }}
    >
      {children}
    </tr>
  )

  // Wrap in thead/tbody so the HTML is semantically correct
  if (rowType === "head") {
    return <thead>{content}</thead>
  }

  return <tbody>{content}</tbody>
}

export default CookieTableRow

export const schema = createSchema({
  type: "cookie-table-row",
  title: "Row",
  childTypes: ["cookie-table-cell"],
  settings: [
    {
      group: "Row",
      inputs: [
        {
          type: "select",
          label: "Row type",
          name: "rowType",
          configs: {
            options: [
              { value: "head", label: "Header (thead)" },
              { value: "body", label: "Body (tbody)" },
            ],
          },
          defaultValue: "body",
        },
        {
          type: "switch",
          label: "Show border bottom",
          name: "showBorderBottom",
          defaultValue: true,
        },
        {
          type: "color",
          label: "Border color",
          name: "borderColor",
          defaultValue: "rgba(255,255,255,0.05)",
        },
        {
          type: "color",
          label: "Row background",
          name: "bgColor",
          defaultValue: "transparent",
        },
      ],
    },
  ],
  presets: {
    rowType: "body",
    showBorderBottom: true,
    borderColor: "rgba(255,255,255,0.05)",
    children: [
      { type: "cookie-table-cell", content: "Celda 1" },
      { type: "cookie-table-cell", content: "Celda 2" },
      { type: "cookie-table-cell", content: "Celda 3" },
    ],
  },
})