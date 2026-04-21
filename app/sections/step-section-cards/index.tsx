import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { Section, layoutInputs } from "~/components/section";
import { backgroundInputs } from "~/components/background-image";
import { selectorPaddingMargin } from "~/utils/general";

interface StepsSectionProps extends HydrogenComponentProps {
  columns: string;
  gap: number;
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
}

function StepsSection(props: StepsSectionProps) {
  const {
    columns,
    gap,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    children,
    ...rest
  } = props;

  const gridCols: Record<string, string> = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-3",
    "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <Section
      {...rest}
      containerClassName="w-full max-w-[1400px] mx-auto overflow-visible"
      style={{
        ...selectorPaddingMargin("padding", paddingSelect, paddingText),
        ...selectorPaddingMargin("margin", marginSelect, marginText),
      }}
    >
      <div
        className={`grid ${gridCols[columns] ?? "grid-cols-1 md:grid-cols-3"}`}
        style={{ gap: `${gap}rem` }}
      >
        {children}
      </div>
    </Section>
  );
}

export default StepsSection;

export const schema = createSchema({
  type: "steps-section",
  title: "Steps Section",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "columns",
          label: "Columns",
          configs: {
            options: [
              { value: "1", label: "1 column" },
              { value: "2", label: "2 columns" },
              { value: "3", label: "3 columns" },
              { value: "4", label: "4 columns" },
            ],
          },
          defaultValue: "3",
        },
        {
          type: "range",
          name: "gap",
          label: "Gap between cards",
          defaultValue: 2,
          configs: { min: 0, max: 8, step: 0.5, unit: "rem" },
        },
        {
          type: "select",
          label: "Padding type",
          name: "paddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "y",
        },
        {
          type: "text",
          label: "Padding value",
          name: "paddingText",
          defaultValue: "4rem",
        },
        {
          type: "select",
          label: "Margin type",
          name: "marginSelect",
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
          label: "Margin value",
          name: "marginText",
        },
      ],
    },
    {
      group: "Background",
      inputs: backgroundInputs,
    },
  ],
  childTypes: ["step-card"],
  presets: {
    columns: "3",
    gap: 2,
    paddingSelect: "y",
    paddingText: "4rem",
    children: [
      {
        type: "step-card",
        stepNumber: "01",
        title: "Captura\nel momento",
        description:
          "Haz una foto potente de tu <strong>Monarch Edición Limitada</strong> o <strong>Monarch Remaster</strong>.<br><br>Cuida el encuadre. Cuida la luz. Haz que el mundo sienta lo que es la precisión absoluta.",
        transitionDelay: 0,
      },
      {
        type: "step-card",
        stepNumber: "02",
        title: "Compártela\nal mundo",
        description:
          "Sube la foto a tus redes. Usa el hashtag <strong>#Phoenix</strong> en la descripción.<br><br>Asegúrate de que la publicación esté configurada como pública.",
        transitionDelay: 100,
        children: [
          { type: "social-tag", label: "Instagram" },
          { type: "social-tag", label: "X (Twitter)" },
          { type: "social-tag", label: "Reddit" },
          { type: "social-tag", label: "TikTok" },
        ],
      },
      {
        type: "step-card",
        stepNumber: "03",
        title: "Envíanos\nla prueba",
        description:
          "Copia el enlace (URL) exacto de tu publicación y envíanoslo a través de la terminal de registro.<br><br>Nosotros haremos el resto.",
        transitionDelay: 200,
      },
    ],
  },
});