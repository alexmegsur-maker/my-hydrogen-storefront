import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";
import { TEXT_SIZE_CLASS } from "~/utils/text-style";
import { useComparadorLinear } from "./context";

interface ComparadorLinearSpecProps extends HydrogenComponentProps {
  label: string;
  value: string;
  ref?: React.Ref<HTMLDivElement>;
}

function ComparadorLinearSpec(props: ComparadorLinearSpecProps) {
  const { label, value, ref, ...rest } = props;
  const { labelStyle, valueStyle } = useComparadorLinear();

  return (
    <div
      ref={ref}
      {...rest}
      // Móvil (2 columnas): línea bajo cada celda y separador en la columna
      // izquierda. Escritorio (1 fila): separador entre celdas, sin la última.
      className={cn(
        "flex flex-col gap-2 border-(--cl-border) border-b px-4 py-4",
        // max-md: estas reglas son solo para móvil. Sin el límite, odd:pl-0
        // (más específico que md:pl-4) quitaba el padding a la 1.ª, 3.ª y 5.ª
        // celda también en escritorio.
        "max-md:odd:border-r max-md:odd:pl-0",
        "md:border-r md:border-b-0 md:first:pl-0 md:last:border-r-0",
      )}
    >
      {label && (
        <span className={TEXT_SIZE_CLASS} style={labelStyle}>
          {label}
        </span>
      )}
      {value && (
        <span className={TEXT_SIZE_CLASS} style={valueStyle}>
          {value}
        </span>
      )}
    </div>
  );
}

export default ComparadorLinearSpec;

export const schema = createSchema({
  type: "comparador-linear--spec",
  title: "Especificación",
  settings: [
    {
      group: "Especificación",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Nombre",
          defaultValue: "Reclinación",
        },
        {
          type: "text",
          name: "value",
          label: "Valor",
          defaultValue: "[xx-xx°]",
        },
      ],
    },
  ],
});
