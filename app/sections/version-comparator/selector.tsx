import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";
import { useReveal } from "./context";
import { SELECTOR_CHILDREN } from "./presets";

interface VersionSelectorProps extends HydrogenComponentProps {
  columns: number;
  gap: number;
  ref?: React.Ref<HTMLDivElement>;
}

function VersionSelector(props: VersionSelectorProps) {
  const { columns, gap, children, ref, ...rest } = props;
  const { ref: revealRef, inView } = useReveal();

  return (
    <div ref={ref} {...rest}>
      <div
        ref={revealRef}
        className={cn(
          "vc-reveal grid grid-cols-1 md:grid-cols-(--vc-cols)",
          inView && "is-in",
        )}
        style={
          {
            "--vc-cols": `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gap}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}

export default VersionSelector;

export const schema = createSchema({
  type: "version-comparator--selector",
  title: "Selector de versión",
  childTypes: ["version-comparator--card"],
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "columns",
          label: "Columnas (escritorio)",
          configs: { min: 1, max: 4, step: 1 },
          defaultValue: 2,
        },
        {
          type: "range",
          name: "gap",
          label: "Separación",
          configs: { min: 0, max: 60, step: 1, unit: "px" },
          defaultValue: 18,
        },
      ],
    },
  ],
  presets: {
    children: SELECTOR_CHILDREN,
  },
});
