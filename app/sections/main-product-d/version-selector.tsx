import { createSchema, useChildInstances, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Children, useEffect } from "react";
import { Section } from "~/components/section";
import { selectorPaddingMargin } from "~/utils/general";
import { useProductConfiguratorD } from "./store";

/** Hijos que se pintan junto al título en vez de en el grid de opciones. */
const HEADER_CHILD_TYPES = ["version-selector-popup"];

interface VersionSelectorProps extends HydrogenComponentProps {
  title: string;
  columns: number;
  // section
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
  // título
  tColor: string;
  tSize: string;
  tLetter: number;
  tUpper: boolean;
  tFamily: string;
  tWeight: string;
}

/**
 * Contenedor del selector de "versión" (metacampo de VARIANTE
 * `custom.version`): cada opción es un componente independiente
 * (`version-selector-item`) que el merchant añade/quita/reordena desde el
 * Studio, exactamente igual que las diapositivas de un slideshow o los ítems
 * de un FAQ — este componente solo pone el título y el grid, cada ítem trae
 * su propio valor a comparar (o "vacío", para agrupar las variantes sin
 * `custom.version` relleno) y su propio estilo.
 */
export default function VersionSelector(props: VersionSelectorProps) {
  const {
    title,
    columns,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tWeight,
    children,
    ...rest
  } = props;

  const setVersionFilterEnabled = useProductConfiguratorD((state) => state.setVersionFilterEnabled);

  // Avisa a universe-selector/material-finish-selector de que hay un filtro
  // de versión activo en la página mientras este componente esté montado —
  // si se quita del Studio, esos selectores vuelven a mostrar todo.
  useEffect(() => {
    setVersionFilterEnabled(true);
    return () => setVersionFilterEnabled(false);
  }, [setVersionFilterEnabled]);

  // Reparte los hijos entre el grid de opciones y la cabecera: el popup (ej.
  // "Más información") se pinta junto al título, igual que el enlace de la
  // calculadora en size-selector-d, en vez de colarse entre las tarjetas.
  const childInstances = useChildInstances();
  const headerChildIds = childInstances
    .filter((instance: any) => HEADER_CHILD_TYPES.includes(instance?.data?.type))
    .map((instance: any) => instance.data.id);
  const isHeaderChild = (child: any) => headerChildIds.includes(child?.props?.id);
  const childArray = Children.toArray(children);
  const headerChildren = childArray.filter(isHeaderChild);
  const gridChildren = childArray.filter((child) => !isHeaderChild(child));

  return (
    <Section {...rest}>
      <div
        className="config-section"
        style={{
          ...selectorPaddingMargin("padding", paddingSelect, paddingText),
          ...selectorPaddingMargin("margin", marginSelect, marginText),
        }}
      >
        <div className="section-header flex justify-between items-baseline mb-[1rem]">
          {title && (
            <div
              className="config-label"
              style={{
                color: tColor,
                fontFamily: tFamily,
                fontSize: tSize,
                fontWeight: tWeight,
                textTransform: tUpper ? "uppercase" : "unset",
                letterSpacing: tLetter > 0 ? `${tLetter}px` : "normal",
              }}
            >
              {title}
            </div>
          )}
          {headerChildren}
        </div>

        <div
          className="version-grid grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns || 2}, minmax(0, 1fr))` }}
        >
          {gridChildren}
        </div>
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "version-selector-d",
  title: "Version selector",
  childTypes: ["version-selector-item", "version-selector-popup"],
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Título", name: "title", defaultValue: "VERSIÓN" },
        {
          type: "range",
          label: "Columnas",
          name: "columns",
          defaultValue: 2,
          configs: { min: 1, max: 4, step: 1 },
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
          defaultValue: "b",
        },
        { type: "text", label: "Padding value", name: "paddingText", defaultValue: "2rem" },
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
        { type: "text", label: "Margin value", name: "marginText" },
      ],
    },
    {
      group: "Título",
      inputs: [
        { type: "color", label: "Color", name: "tColor", defaultValue: "#71717A" },
        { type: "text", label: "Font size", name: "tSize", defaultValue: "0.7rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "tLetter",
          defaultValue: 2,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "switch", label: "Uppercase", name: "tUpper", defaultValue: true },
        { type: "text", label: "Font family", name: "tFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "tWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "500",
        },
      ],
    },
  ],
  presets: {
    title: "VERSIÓN",
    columns: 2,
    children: [
      {
        type: "version-selector-item",
        label: "Estándar",
        optionName: "version",
        value: "estandar",
        isDefault: true,
      },
      { type: "version-selector-item", label: "Versión 2", optionName: "version", value: "version 2" },
    ],
  },
});
