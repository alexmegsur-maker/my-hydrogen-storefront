import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { Children, isValidElement, useState } from "react";
import { useImageSwap } from "~/stores/imageSwapStore";
import { cn } from "~/utils/cn";
import { selectorPaddingMargin } from "~/utils/general";

/**
 * Tabs menu — barra de opciones; cada opción (tabs-menu--item) tiene su propio
 * contenido (group-elements, heading…) y, opcionalmente, una imagen que se
 * muestra en el componente Image de image-with-text con el id indicado.
 */
interface TabsMenuProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  imageTargetId?: string;
  // Menú
  textColor: string;
  activeTextColor: string;
  fontSize: string;
  fontWeight: string;
  activeFontWeight: string;
  fontFamily?: string;
  indicatorColor: string;
  indicatorHeight: number;
  lineColor: string;
  menuGap: string;
  menuPaddingBottom: string;
  // Contenido
  contentPaddingSelect?: string;
  contentPaddingText?: string;
  marginSelect?: string;
  marginText?: string;
}

interface ItemData {
  id: string;
  label?: string;
  image?: WeaverseImage | string;
  targetId?: string;
}

function toImageData(image: ItemData["image"]): Partial<WeaverseImage> | null {
  if (!image) return null;
  return typeof image === "string" ? { url: image } : image;
}

function TabsMenu(props: TabsMenuProps) {
  const {
    ref,
    imageTargetId,
    textColor,
    activeTextColor,
    fontSize,
    fontWeight,
    activeFontWeight,
    fontFamily,
    indicatorColor,
    indicatorHeight,
    lineColor,
    menuGap,
    menuPaddingBottom,
    contentPaddingSelect,
    contentPaddingText,
    marginSelect,
    marginText,
    className,
    children,
    ...rest
  } = props;

  const items: ItemData[] = useChildInstances()
    .map((instance) => instance.data as unknown as ItemData)
    .filter((data) => data?.id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Si la opción elegida se borra en el editor, se vuelve a la primera
  const activeId = items.some((item) => item.id === selectedId)
    ? selectedId
    : items[0]?.id;

  const setSwap = useImageSwap((state) => state.setSwap);
  const clearSwap = useImageSwap((state) => state.clearSwap);

  const select = (item: ItemData) => {
    setSelectedId(item.id);
    const target = (item.targetId || imageTargetId)?.trim();
    if (!target) return;
    const image = toImageData(item.image);
    if (image?.url) {
      setSwap(target, image);
    } else {
      clearSwap(target); // sin imagen propia: vuelve la original
    }
  };

  return (
    <div
      ref={ref}
      {...rest}
      className={cn("flex w-full flex-col", className)}
      style={{ ...selectorPaddingMargin("margin", marginSelect, marginText) }}
    >
      <div
        role="tablist"
        className="flex overflow-x-auto"
        style={{ gap: menuGap, borderBottom: `1px solid ${lineColor}` }}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              id={`tabs-menu-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabs-menu-panel-${item.id}`}
              onClick={() => select(item)}
              className="relative shrink-0 cursor-pointer whitespace-nowrap border-none bg-transparent px-0 transition-colors"
              style={{
                color: isActive ? activeTextColor : textColor,
                fontSize,
                fontWeight: isActive ? activeFontWeight : fontWeight,
                fontFamily: fontFamily || undefined,
                paddingBottom: menuPaddingBottom,
              }}
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-full origin-left transition-transform duration-300"
                style={{
                  height: `${indicatorHeight}px`,
                  // -1px: el indicador tapa la línea gris inferior
                  marginBottom: "-1px",
                  background: indicatorColor,
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          );
        })}
      </div>

      <div style={{ ...selectorPaddingMargin("padding", contentPaddingSelect, contentPaddingText) }}>
        {Children.toArray(children).map((child) => {
          const id = isValidElement<{ id?: string }>(child) ? child.props.id : undefined;
          const isActive = id === activeId;
          return (
            <div
              key={id}
              id={`tabs-menu-panel-${id}`}
              role="tabpanel"
              aria-labelledby={`tabs-menu-tab-${id}`}
              hidden={!isActive}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TabsMenu;

const spacingOptions = [
  { value: "t", label: "Top" },
  { value: "b", label: "Bottom" },
  { value: "l", label: "Left" },
  { value: "r", label: "Right" },
  { value: "x", label: "Inline" },
  { value: "y", label: "Block" },
  { value: "a", label: "Custom" },
];

const weightOptions = ["300", "400", "500", "600", "700"].map((value) => ({
  value,
  label: value,
}));

export const schema = createSchema({
  type: "tabs-menu",
  title: "Tabs menu",
  enabledOn: {
    groups: ["*"],
  },
  childTypes: ["tabs-menu--item"],
  settings: [
    {
      group: "Tabs menu",
      inputs: [
        {
          type: "text",
          name: "imageTargetId",
          label: "Image id",
          helpText:
            'El "id" del componente Image de image-with-text que cambia al seleccionar cada opción.',
        },
        {
          type: "heading",
          label: "Menu",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text color",
          defaultValue: "#6b6b6b",
        },
        {
          type: "color",
          name: "activeTextColor",
          label: "Active text color",
          defaultValue: "#1a1a1a",
        },
        {
          type: "text",
          name: "fontSize",
          label: "Font size",
          defaultValue: "0.85rem",
        },
        {
          type: "select",
          name: "fontWeight",
          label: "Font weight",
          configs: { options: weightOptions },
          defaultValue: "400",
        },
        {
          type: "select",
          name: "activeFontWeight",
          label: "Active font weight",
          configs: { options: weightOptions },
          defaultValue: "500",
        },
        {
          type: "text",
          name: "fontFamily",
          label: "Font family",
          placeholder: "Vacío = fuente del tema",
        },
        {
          type: "color",
          name: "indicatorColor",
          label: "Active indicator color",
          defaultValue: "#1a1a1a",
        },
        {
          type: "range",
          name: "indicatorHeight",
          label: "Active indicator height",
          defaultValue: 2,
          configs: { min: 1, max: 6, step: 1, unit: "px" },
        },
        {
          type: "color",
          name: "lineColor",
          label: "Bottom line color",
          defaultValue: "#bdb8b0",
        },
        {
          type: "text",
          name: "menuGap",
          label: "Gap between options",
          defaultValue: "1.6rem",
        },
        {
          type: "text",
          name: "menuPaddingBottom",
          label: "Option bottom padding",
          defaultValue: "1.4rem",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "contentPaddingSelect",
          label: "Content padding type",
          configs: { options: spacingOptions },
          defaultValue: "t",
        },
        {
          type: "text",
          name: "contentPaddingText",
          label: "Content padding",
          defaultValue: "1.8rem",
        },
        {
          type: "select",
          name: "marginSelect",
          label: "Margin type",
          configs: { options: spacingOptions },
          defaultValue: "b",
        },
        {
          type: "text",
          name: "marginText",
          label: "Margin",
          defaultValue: "0",
        },
      ],
    },
  ],
  presets: {
    children: [
      {
        type: "tabs-menu--item",
        label: "Prime Hybrid™",
        children: [
          {
            type: "group-elements",
            displayDiv: "flex",
            direction: "column",
            mbDisplayDiv: "flex",
            mbDirection: "column",
            showBorder: false,
            children: [
              { type: "heading", content: "Una superficie suave. Un acabado sobrio." },
              {
                type: "paragraph",
                content:
                  "Cuero sintético de tacto suave y textura lisa que realza las formas y las costuras de la silla.",
              },
            ],
          },
        ],
      },
      {
        type: "tabs-menu--item",
        label: "AeroWeave™ 2.0",
        children: [
          {
            type: "group-elements",
            displayDiv: "flex",
            direction: "column",
            mbDisplayDiv: "flex",
            mbDirection: "column",
            showBorder: false,
            children: [
              { type: "heading", content: "Textura acogedora. Contacto transpirable." },
              {
                type: "paragraph",
                content:
                  "La V3 incorpora AeroWeave™ 2.0, un tejido más resistente que mantiene el tacto suave y la transpirabilidad de la tela.",
              },
            ],
          },
        ],
      },
    ],
  },
});
