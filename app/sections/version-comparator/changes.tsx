import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";
import { useChildrenByType, useReveal } from "./context";
import { CHANGES_CHILDREN } from "./presets";

const CARD_TYPE = "version-comparator--foam-card";

interface ChangesBlockProps extends HydrogenComponentProps {
  columns: number;
  gap: number;
  ref?: React.Ref<HTMLDivElement>;
}

/** "Cambios que vas a notar": Heading + Paragraph arriba y las tarjetas en rejilla. */
function ChangesBlock(props: ChangesBlockProps) {
  const { columns, gap, children, ref, ...rest } = props;
  const items = useChildrenByType(children);
  const { ref: revealRef, inView } = useReveal();

  const intro = items.filter((item) => item.type !== CARD_TYPE);
  const cards = items.filter((item) => item.type === CARD_TYPE);

  return (
    <div ref={ref} {...rest}>
      <div ref={revealRef} className={cn("vc-reveal", inView && "is-in")}>
        {intro.map((item) => item.node)}
        {cards.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-(--vc-cols)"
            style={
              {
                "--vc-cols": `repeat(${columns}, minmax(0, 1fr))`,
                gap: `${gap}px`,
              } as React.CSSProperties
            }
          >
            {cards.map((item) => item.node)}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangesBlock;

export const schema = createSchema({
  type: "version-comparator--changes",
  title: "Cambios que vas a notar",
  childTypes: ["heading", "paragraph", CARD_TYPE],
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "columns",
          label: "Columnas de tarjetas (escritorio)",
          configs: { min: 1, max: 4, step: 1 },
          defaultValue: 2,
        },
        {
          type: "range",
          name: "gap",
          label: "Separación entre tarjetas",
          configs: { min: 0, max: 60, step: 1, unit: "px" },
          defaultValue: 18,
        },
      ],
    },
  ],
  presets: {
    children: CHANGES_CHILDREN,
  },
});
