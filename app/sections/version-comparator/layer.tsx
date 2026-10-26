import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useFoamCard } from "./foam-card";

interface FoamLayerProps extends HydrogenComponentProps {
  label: string;
  value: string;
  percent: number;
  barColor: string;
  ref?: React.Ref<HTMLDivElement>;
}

function FoamLayer(props: FoamLayerProps) {
  const { label, value, percent, barColor, ref, ...rest } = props;
  const { inView } = useFoamCard();

  return (
    <div ref={ref} {...rest} className="mb-4">
      <div
        className="mb-[7px] flex justify-between gap-3 text-[13px]"
        style={{ color: "var(--vc-muted)" }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="vc-bar">
        <i
          style={
            {
              width: inView ? `${percent}%` : 0,
              "--vc-bar-color": barColor || undefined,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

export default FoamLayer;

export const schema = createSchema({
  type: "version-comparator--layer",
  title: "Barra",
  settings: [
    {
      group: "Barra",
      inputs: [
        { type: "text", name: "label", label: "Nombre", defaultValue: "Capa superior" },
        { type: "text", name: "value", label: "Valor", defaultValue: "60 kg/m³" },
        {
          type: "range",
          name: "percent",
          label: "Relleno",
          configs: { min: 0, max: 100, step: 1, unit: "%" },
          defaultValue: 100,
        },
        {
          type: "color",
          name: "barColor",
          label: "Color propio",
          helpText: "Vacío = gris, o acento si la tarjeta está destacada.",
        },
      ],
    },
  ],
});
