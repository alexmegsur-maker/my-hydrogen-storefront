import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useId, useState } from "react";
import { useImageSwap } from "~/stores/imageSwapStore";
import { cn } from "~/utils/cn";
import { selectorPaddingMargin } from "~/utils/general";

/**
 * Tab — pestaña desplegable (título + icono +/−) cuyo contenido son hijos
 * libres de Weaverse: group-elements, heading, subheading, paragraph,
 * simple-table, botones… Así cada pestaña se compone y personaliza en el
 * editor sin tocar código.
 */
interface TabProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  title: string;
  defaultOpen: boolean;
  // Título
  titleTag: "h3" | "h4" | "h5" | "h6" | "div" | "p";
  titleColor?: string;
  titleSize: string;
  titleWeight: string;
  titleLetter: number;
  titleFontFamily?: string;
  // Icono
  iconClosed: string;
  iconOpen: string;
  iconColor?: string;
  iconSize: string;
  // Separador
  showBorder: boolean;
  borderColor: string;
  // Espaciados
  headerPaddingSelect?: string;
  headerPaddingText?: string;
  contentPaddingSelect?: string;
  contentPaddingText?: string;
  marginSelect?: string;
  marginText?: string;
  // Animación
  duration: number;
  // Cambio de imagen (igual que image-swap-button)
  swapTargetId?: string;
  swapImage?: WeaverseImage | string;
  swapRestoreOnClose?: boolean;
}

function Tab(props: TabProps) {
  const {
    ref,
    title,
    defaultOpen,
    titleTag: TitleTag = "div",
    titleColor,
    titleSize,
    titleWeight,
    titleLetter,
    titleFontFamily,
    iconClosed,
    iconOpen,
    iconColor,
    iconSize,
    showBorder,
    borderColor,
    headerPaddingSelect,
    headerPaddingText,
    contentPaddingSelect,
    contentPaddingText,
    marginSelect,
    marginText,
    duration,
    swapTargetId,
    swapImage,
    swapRestoreOnClose = true,
    className,
    children,
    ...rest
  } = props;

  const [open, setOpen] = useState(Boolean(defaultOpen));
  const swapTarget = swapTargetId?.trim();
  const swapData: Partial<WeaverseImage> | null = swapImage
    ? typeof swapImage === "string"
      ? { url: swapImage, altText: title }
      : swapImage
    : null;
  const setSwap = useImageSwap((state) => state.setSwap);
  const clearSwap = useImageSwap((state) => state.clearSwap);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (!(swapTarget && swapData?.url)) return;
    if (next) {
      setSwap(swapTarget, swapData);
    } else if (swapRestoreOnClose) {
      // Solo se restaura si la imagen visible sigue siendo la de este tab
      // (otro tab o botón puede haberla cambiado después)
      const current = useImageSwap.getState().swaps[swapTarget];
      if (current?.url === swapData.url) clearSwap(swapTarget);
    }
  };
  const id = useId();
  const contentId = `tab-content-${id}`;
  const buttonId = `tab-button-${id}`;

  return (
    <div
      ref={ref}
      {...rest}
      className={cn("w-full", className)}
      style={{ ...selectorPaddingMargin("margin", marginSelect, marginText) }}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent text-left"
        style={{
          borderBottom: showBorder ? `1px solid ${borderColor}` : "none",
          ...selectorPaddingMargin("padding", headerPaddingSelect, headerPaddingText),
        }}
      >
        <TitleTag
          className="m-0"
          style={{
            color: titleColor,
            fontSize: titleSize,
            fontWeight: titleWeight,
            letterSpacing: titleLetter > 0 ? `${titleLetter}px` : "normal",
            fontFamily: titleFontFamily || undefined,
          }}
        >
          {title}
        </TitleTag>
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center leading-none"
          style={{ color: iconColor, fontSize: iconSize }}
        >
          {open ? iconOpen : iconClosed}
        </span>
      </button>

      {/* grid 0fr → 1fr anima la altura sin medir el contenido */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: `grid-template-rows ${duration}ms ease`,
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            style={{
              ...selectorPaddingMargin("padding", contentPaddingSelect, contentPaddingText),
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tab;

const spacingOptions = [
  { value: "t", label: "Top" },
  { value: "b", label: "Bottom" },
  { value: "l", label: "Left" },
  { value: "r", label: "Right" },
  { value: "x", label: "Inline" },
  { value: "y", label: "Block" },
  { value: "a", label: "Custom" },
];

export const schema = createSchema({
  type: "tab",
  title: "Tab",
  enabledOn: {
    groups: ["*"],
  },
  childTypes: [
    "group-elements",
    "heading",
    "subheading",
    "paragraph",
    "button",
    "simple-table",
    "image-with-text--content",
    "card-simple",
  ],
  settings: [
    {
      group: "Tab",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "¿Qué cambia respecto a V2?",
        },
        {
          type: "switch",
          name: "defaultOpen",
          label: "Open by default",
          helpText: "Útil también para editar el contenido en el editor.",
          defaultValue: false,
        },
        {
          type: "select",
          name: "titleTag",
          label: "Title tag",
          configs: {
            options: [
              { value: "h3", label: "Heading 3" },
              { value: "h4", label: "Heading 4" },
              { value: "h5", label: "Heading 5" },
              { value: "h6", label: "Heading 6" },
              { value: "p", label: "Paragraph" },
              { value: "div", label: "Div" },
            ],
          },
          defaultValue: "div",
        },
        {
          type: "color",
          name: "titleColor",
          label: "Title color",
          defaultValue: "#ffffff",
        },
        {
          type: "text",
          name: "titleSize",
          label: "Title size",
          defaultValue: "0.95rem",
        },
        {
          type: "select",
          name: "titleWeight",
          label: "Title weight",
          configs: {
            options: [
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
            ],
          },
          defaultValue: "500",
        },
        {
          type: "range",
          name: "titleLetter",
          label: "Letter spacing",
          defaultValue: 0,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        {
          type: "text",
          name: "titleFontFamily",
          label: "Title font family",
          placeholder: "Vacío = fuente del tema",
        },
      ],
    },
    {
      group: "Icon",
      inputs: [
        {
          type: "text",
          name: "iconClosed",
          label: "Icon when closed",
          defaultValue: "+",
        },
        {
          type: "text",
          name: "iconOpen",
          label: "Icon when open",
          defaultValue: "−",
        },
        {
          type: "color",
          name: "iconColor",
          label: "Icon color",
          defaultValue: "#ff5e00",
        },
        {
          type: "text",
          name: "iconSize",
          label: "Icon size",
          defaultValue: "0.9rem",
        },
      ],
    },
    {
      group: "Image swap",
      inputs: [
        {
          type: "text",
          name: "swapTargetId",
          label: "Image id",
          helpText:
            'El "id" del componente Image de image-with-text que cambia al abrir este tab. Vacío = no cambia ninguna imagen.',
        },
        {
          type: "image",
          name: "swapImage",
          label: "Image to show",
        },
        {
          type: "switch",
          name: "swapRestoreOnClose",
          label: "Restore original image on close",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "switch",
          name: "showBorder",
          label: "Show bottom border",
          defaultValue: true,
        },
        {
          type: "color",
          name: "borderColor",
          label: "Border color",
          defaultValue: "rgba(255,255,255,0.25)",
          condition: (data: TabProps) => data.showBorder === true,
        },
        {
          type: "select",
          name: "headerPaddingSelect",
          label: "Header padding type",
          configs: { options: spacingOptions },
          defaultValue: "y",
        },
        {
          type: "text",
          name: "headerPaddingText",
          label: "Header padding",
          defaultValue: "1.4rem",
        },
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
          defaultValue: "1.4rem",
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
        {
          type: "range",
          name: "duration",
          label: "Animation duration",
          defaultValue: 300,
          configs: { min: 0, max: 1000, step: 50, unit: "ms" },
        },
      ],
    },
  ],
  presets: {
    children: [
      {
        type: "group-elements",
        displayDiv: "grid",
        columnsGrid: 2,
        mbDisplayDiv: "grid",
        mbColumnsGrid: 2,
        showBorder: true,
        showBorderBottom: true,
        showBorderLeft: true,
        showBorderRight: true,
        colorBorder: "rgba(255,255,255,0.1)",
        children: [
          { type: "subheading", content: "REMASTER V2", alignment: "left" },
          { type: "subheading", content: "REMASTER V3", alignment: "left" },
          { type: "paragraph", content: "Doble densidad 60 + 50 kg/m³" },
          { type: "paragraph", content: "Doble densidad 55 + 45 kg/m³" },
        ],
      },
    ],
  },
});
