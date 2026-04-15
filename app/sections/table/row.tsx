import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";

interface HwRowProps extends HydrogenComponentProps {
  isFullWidth: boolean;
}

function HwRow(props: HwRowProps) {
  const { isFullWidth, children, ...rest } = props;

  return (
    <div
      style={{
        gridColumn: isFullWidth ? "1 / -1" : undefined,
        borderTop: isFullWidth ? "1px solid rgba(255,255,255,0.1)" : undefined,
        paddingTop: isFullWidth ? "1.5rem" : undefined,
        marginTop: isFullWidth ? "0.5rem" : undefined,
        display: "contents", // Los hijos se despliegan directo en el grid padre
      }}
    >
      {children}
    </div>
  );
}

export default HwRow;

export const schema = createSchema({
  type: "hw-row",
  title: "Row",
  settings: [
    {
      group: "Row",
      inputs: [
        {
          type: "switch",
          name: "isFullWidth",
          label: "Full width (separator row)",
          defaultValue: false,
          helpText:
            "Actívalo para que esta fila ocupe las dos columnas del grid (ideal para el item de accesorios).",
        },
      ],
    },
  ],
  childTypes: ["hw-item"],
  presets: {
    isFullWidth: false,
    children: [
      { type: "hw-item", label: "Componente", quantity: "x1" },
    ],
  },
});