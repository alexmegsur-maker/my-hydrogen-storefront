import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";
import { useVersionComparator } from "./context";
import { cardHeading, cardParagraph } from "./presets";

interface VersionCardProps extends HydrogenComponentProps {
  version: "a" | "b";
  tag: string;
  badge: string;
  highlight: boolean;
  radius: number;
  padding: number;
  ref?: React.Ref<HTMLDivElement>;
}

function VersionCard(props: VersionCardProps) {
  const { version, tag, badge, highlight, radius, padding, children, ref, ...rest } =
    props;
  const { focus, setFocus, toolbarRef } = useVersionComparator();
  const pressed = focus === version;

  function handleClick() {
    const next = pressed ? "all" : version;
    setFocus(next);
    if (next !== "all") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      toolbarRef?.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
  }

  return (
    // div con role="button": un <button> no puede contener los títulos y
    // párrafos (Heading / Paragraph) que lleva dentro.
    <div
      ref={ref}
      {...rest}
      role="button"
      tabIndex={0}
      aria-pressed={pressed}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn("vc-card flex flex-col", highlight && "is-highlight")}
      style={{ borderRadius: `${radius}px`, padding: `${padding}px` }}
    >
      {badge && <span className="vc-badge">{badge}</span>}
      {tag && (
        <span
          className="font-mono text-[11px] uppercase leading-none tracking-[.12em]"
          style={{ color: "var(--vc-muted)" }}
        >
          {tag}
        </span>
      )}
      {/* Heading + Paragraph */}
      {children}
    </div>
  );
}

export default VersionCard;

export const schema = createSchema({
  type: "version-comparator--card",
  title: "Tarjeta de versión",
  childTypes: ["heading", "paragraph"],
  settings: [
    {
      group: "Tarjeta",
      inputs: [
        {
          type: "select",
          name: "version",
          label: "Versión que enfoca",
          configs: {
            options: [
              { value: "a", label: "Versión A" },
              { value: "b", label: "Versión B" },
            ],
          },
          defaultValue: "a",
          helpText: "Al pulsarla, la tabla de características se centra en esta versión.",
        },
        {
          type: "text",
          name: "tag",
          label: "Etiqueta superior",
          defaultValue: "Versión anterior",
        },
        {
          type: "text",
          name: "badge",
          label: "Insignia",
          placeholder: "Nueva",
          helpText: "Vacío = sin insignia.",
        },
        {
          type: "switch",
          name: "highlight",
          label: "Destacar (degradado de acento)",
          defaultValue: false,
        },
        {
          type: "range",
          name: "radius",
          label: "Radio del borde",
          configs: { min: 0, max: 40, step: 1, unit: "px" },
          defaultValue: 22,
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          configs: { min: 8, max: 60, step: 1, unit: "px" },
          defaultValue: 28,
        },
      ],
    },
  ],
  presets: {
    version: "a",
    tag: "Versión anterior",
    children: [
      cardHeading("Remaster V2"),
      cardParagraph("Sentada firme con espuma de doble densidad 60+50 kg/m³."),
    ],
  },
});
