import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { XIcon } from "@phosphor-icons/react";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { selectorPaddingMargin } from "~/utils/general";

/** A partir de este ancho se considera "desktop" (coincide con el resto de main-product-d). */
const DESKTOP_BREAKPOINT = 1023;

interface VersionSelectorPopupProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  // disparador — mismo patrón que el enlace de la calculadora en size-selector-d
  triggerText: string;
  trColor: string;
  trSize: string;
  trFamily: string;
  trWeight: string;
  // popup — tamaño
  width: string;
  maxHeight: string;
  /** Si se deja vacío, usa el ancho automático (todo el viewport menos el margen) en vez de `width`. */
  widthMobile: string;
  /** Si se deja vacío, usa el mismo valor que `maxHeight`. */
  maxHeightMobile: string;
  // popup — color
  bgColor: string;
  borderColor: string;
  textColor: string;
  overlayColor: string;
  // popup — forma
  radius: string;
  paddingSelect: string;
  paddingText: string;
  // título (opcional, encima de los hijos)
  title: string;
  titleColor: string;
  titleSize: string;
  titleFamily: string;
  titleWeight: string;
  closeColor: string;
}

/**
 * Disparador + popup modal, componente independiente y repetible (childTypes
 * de `version-selector-d`) — se activa igual que la calculadora de talla en
 * `size-selector-d` (un enlace de texto), pero en vez de desplegar un panel
 * inline abre un modal centrado (Radix Dialog, mismo patrón que
 * `cart-drawer.tsx`/`media-zoom.tsx`). El contenido del popup son sus propios
 * hijos de Weaverse (`childTypes` deliberadamente amplio: bloques de
 * contenido genéricos — encabezados, texto, imágenes, FAQ, tablas…), así que
 * el merchant puede montar dentro lo que necesite (ej. una guía de tallas,
 * condiciones de la reserva, comparativa de versiones…).
 */
export default function VersionSelectorPopup(props: VersionSelectorPopupProps) {
  const {
    ref,
    triggerText,
    trColor,
    trSize,
    trFamily,
    trWeight,
    width,
    maxHeight,
    widthMobile,
    maxHeightMobile,
    bgColor,
    borderColor,
    textColor,
    overlayColor,
    radius,
    paddingSelect,
    paddingText,
    title,
    titleColor,
    titleSize,
    titleFamily,
    titleWeight,
    closeColor,
    children,
    ...rest
  } = props;

  const isMobile = useIsMobile(DESKTOP_BREAKPOINT);
  // En móvil, si no se configuró un ancho propio, se deja sin "width" inline
  // para que mande la clase de Tailwind `w-[calc(100vw-2rem)]` del Content —
  // así un ancho pensado para desktop (ej. "40rem") nunca desborda la
  // pantalla por defecto.
  const resolvedWidth = isMobile ? widthMobile || undefined : width;
  const resolvedMaxHeight = isMobile ? maxHeightMobile || maxHeight : maxHeight;

  return (
    <div ref={ref} {...rest}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <span
            role="button"
            tabIndex={0}
            className="config-link cursor-pointer"
            style={{
              color: trColor,
              fontFamily: trFamily,
              fontSize: trSize,
              fontWeight: trWeight,
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            {triggerText}
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-40 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
            style={{ background: overlayColor }}
          />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-scale-in max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto"
            style={{
              width: resolvedWidth,
              maxHeight: resolvedMaxHeight,
              background: bgColor,
              border: borderColor ? `1px solid ${borderColor}` : undefined,
              borderRadius: radius,
              color: textColor,
              ...selectorPaddingMargin("padding", paddingSelect, paddingText),
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-4 " style={{placeContent:"end"}}>
              {title ? (
                <Dialog.Title
                  style={{
                    color: titleColor,
                    fontFamily: titleFamily,
                    fontSize: titleSize,
                    fontWeight: titleWeight,
                  }}
                >
                  {title}
                </Dialog.Title>
              ) : (
                <VisuallyHidden.Root asChild>
                  <Dialog.Title>{triggerText}</Dialog.Title>
                </VisuallyHidden.Root>
              )}
              <Dialog.Close
                aria-label="Cerrar"
                className="shrink-0 cursor-pointer"
                style={{ color: closeColor }}
              >
                <XIcon size={20} />
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-4">{children}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export const schema = createSchema({
  type: "version-selector-popup",
  title: "Popup",
  childTypes: [
    "heading",
    "subheading",
    "paragraph",
    "button",
    "group-buttons",
    "spacer",
    "image-with-text",
    "image-gallery",
    "faq-section",
    "video-embed",
    "video-embed--item",
    "video-banner",
    "video-column-text",
    "video-slider",
    "videoSliderV2",
    "table",
    "simple-table",
    "testimonials",
    "trust-signal",
    "social-tag",
    "signal",
    "instruction",
    "step-card",
    "steps-section",
    "columns-with-images",
    "card-simple",
    "slideshow",
    "slideshow-slide",
    "promotion-grid",
    "hero-imagev2",
    "hero-video",
    "comparison-wrapper",
    "gridImages",
    "community-grid",
    "principal-card",
    "principal-banner",
    "sub-banner",
    "banner",
  ],
  settings: [
    {
      group: "Disparador",
      inputs: [
        { type: "text", label: "Texto", name: "triggerText", defaultValue: "Más información" },
        { type: "color", label: "Color", name: "trColor", defaultValue: "#A1A1AA" },
        { type: "text", label: "Font size", name: "trSize", defaultValue: "0.7rem" },
        { type: "text", label: "Font family", name: "trFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "trWeight",
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
    {
      group: "Popup · tamaño y forma",
      inputs: [
        { type: "text", label: "Ancho (desktop)", name: "width", defaultValue: "32rem" },
        {
          type: "text",
          label: "Ancho (móvil)",
          name: "widthMobile",
          helpText:
            "Si se deja vacío, usa un ancho automático (todo el viewport menos el margen) para que el ancho de desktop no desborde en pantallas pequeñas.",
        },
        { type: "text", label: "Alto máximo (desktop)", name: "maxHeight", defaultValue: "85vh" },
        {
          type: "text",
          label: "Alto máximo (móvil)",
          name: "maxHeightMobile",
          helpText: "Si se deja vacío, usa el mismo valor que en desktop.",
        },
        { type: "text", label: "Border radius", name: "radius", defaultValue: "8px" },
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
          defaultValue: "a",
        },
        { type: "text", label: "Padding value", name: "paddingText", defaultValue: "2rem" },
      ],
    },
    {
      group: "Popup · color",
      inputs: [
        { type: "color", label: "Background", name: "bgColor", defaultValue: "#0A0A0A" },
        { type: "color", label: "Borde", name: "borderColor", defaultValue: "#ffffff14" },
        { type: "color", label: "Color de texto", name: "textColor", defaultValue: "#D4D4D8" },
        { type: "color", label: "Overlay", name: "overlayColor", defaultValue: "rgba(0,0,0,0.6)" },
        { type: "color", label: "Color botón cerrar", name: "closeColor", defaultValue: "#A1A1AA" },
      ],
    },
    {
      group: "Título del popup (opcional)",
      inputs: [
        {
          type: "text",
          label: "Título",
          name: "title",
          helpText: "Si se deja vacío, se usa el texto del disparador como título accesible (no se muestra visualmente).",
        },
        { type: "color", label: "Color", name: "titleColor", defaultValue: "#FFFFFF" },
        { type: "text", label: "Font size", name: "titleSize", defaultValue: "1.1rem" },
        { type: "text", label: "Font family", name: "titleFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "titleWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "600",
        },
      ],
    },
  ],
  presets: {
    triggerText: "Más información",
    children: [
      { type: "heading", content: "Más información", as: "h3" },
      { type: "paragraph", content: "Añade aquí el contenido del popup." },
    ],
  },
});
