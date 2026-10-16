import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  TEXT_SIZE_CLASS,
  textStyleInputs,
} from "~/utils/text-style";

interface CollectorLicensesProps extends HydrogenComponentProps {
  label: string;
  columns: number;
  mobileColumns: number;
  itemHeight: number;
  mobileItemHeight: number;
  gap: number;
  ref?: React.Ref<HTMLDivElement>;
}

function CollectorLicenses(props: CollectorLicensesProps) {
  const {
    label,
    columns,
    mobileColumns,
    itemHeight,
    mobileItemHeight,
    gap,
    children,
    ref,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      {...omitTextStyleProps(rest, ["label"])}
      className="flex flex-col gap-3"
    >
      {label && (
        <span
          className={TEXT_SIZE_CLASS}
          style={getTextStyle(props as unknown as Record<string, unknown>, "label")}
        >
          {label}
        </span>
      )}
      {/* Columnas y altura por CSS: móvil por defecto, escritorio desde md. */}
      <div
        className="grid grid-cols-(--lic-cols-m) md:grid-cols-(--lic-cols-d) [&>*]:h-(--lic-h-m) md:[&>*]:h-(--lic-h-d)"
        style={
          {
            gap: `${gap ?? 10}px`,
            "--lic-cols-m": `repeat(${mobileColumns || 2}, minmax(0, 1fr))`,
            "--lic-cols-d": `repeat(${columns || 4}, minmax(0, 1fr))`,
            "--lic-h-m": `${mobileItemHeight || 56}px`,
            "--lic-h-d": `${itemHeight || 60}px`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}

export default CollectorLicenses;

export const schema = createSchema({
  type: "collector-editions--licenses",
  title: "Licencias",
  childTypes: ["collector-editions--license"],
  settings: [
    {
      group: "Licencias",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Título",
          defaultValue: "Licencias oficiales",
        },
        {
          type: "range",
          name: "columns",
          label: "Columnas (escritorio)",
          defaultValue: 4,
          configs: { min: 1, max: 8, step: 1 },
        },
        {
          type: "range",
          name: "mobileColumns",
          label: "Columnas (móvil)",
          defaultValue: 2,
          configs: { min: 1, max: 4, step: 1 },
        },
        {
          type: "range",
          name: "itemHeight",
          label: "Alto de cada licencia (escritorio)",
          defaultValue: 60,
          configs: { min: 30, max: 200, step: 2, unit: "px" },
        },
        {
          type: "range",
          name: "mobileItemHeight",
          label: "Alto de cada licencia (móvil)",
          defaultValue: 56,
          configs: { min: 30, max: 200, step: 2, unit: "px" },
        },
        {
          type: "range",
          name: "gap",
          label: "Separación",
          defaultValue: 10,
          configs: { min: 0, max: 40, step: 1, unit: "px" },
        },
      ],
    },
    {
      group: "Texto: título",
      inputs: textStyleInputs("label", {
        Color: "#8a8f98",
        MobileSize: "10px",
        DesktopSize: "10px",
        Transform: "uppercase",
        LetterSpacing: 2,
        Family: MONO_FONT,
      }),
    },
  ],
  presets: {
    children: [
      { type: "collector-editions--license" },
      { type: "collector-editions--license" },
      { type: "collector-editions--license" },
      { type: "collector-editions--license" },
    ],
  },
});
