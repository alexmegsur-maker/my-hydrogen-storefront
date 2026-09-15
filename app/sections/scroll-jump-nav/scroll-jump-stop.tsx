import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";

interface ScrollJumpStopProps extends HydrogenComponentProps {
  label: string;
  amount: number;
}

/**
 * "Parada" — subcomponente de configuración para `scroll-jump-nav`. No pinta
 * nada: el padre lee su `amount` (vh a saltar) vía `useChildInstances()`.
 * Cada parada que añadas en Studio es un salto más en la secuencia del botón.
 */
export default function ScrollJumpStop(_props: ScrollJumpStopProps) {
  return null;
}

export const schema = createSchema({
  type: "scroll-jump-stop",
  title: "Parada",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "text",
          label: "Nombre",
          name: "label",
          defaultValue: "Parada",
          helpText: "Solo para identificarla en Studio — no se muestra en la web.",
        },
        {
          type: "range",
          label: "Salto (vh)",
          name: "amount",
          defaultValue: 80,
          configs: { min: 10, max: 1000, step: 5, unit: "vh" },
          helpText: "Cuánto \"scroll de ratón\" simular en este salto — aprox. la altura de lo que quieres revelar.",
        },
      ],
    },
  ],
});
