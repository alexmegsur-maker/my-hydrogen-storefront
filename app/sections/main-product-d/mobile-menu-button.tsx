import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useMobileMenu } from "~/stores/mobileMenuStore";
import { selectorPaddingMargin } from "~/utils/general";

export const DEFAULT_MENU_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

export type MenuButtonPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface MobileMenuButtonProps {
  /** SVG del icono. Usa `currentColor` para que mande `iconColor`. */
  iconSvg?: string;
  position?: MenuButtonPosition;
  offsetX?: string;
  offsetY?: string;
  iconSize?: string;
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
  radius?: string;
  paddingSelect?: string;
  paddingText?: string;
  marginSelect?: string;
  marginText?: string;
  /** 0-100 */
  opacity?: number;
  zIndex?: number;
}

/**
 * Botón flotante que abre el menú móvil del header. main-product-d oculta el
 * header (y con él su hamburguesa), así que en móvil este botón es la única
 * forma de llegar al menú. Comparte el estado con `MobileMenu` a través de
 * `useMobileMenu`, de modo que el menú que se abre es el mismo del header
 * (sus items, sus submenús de Weaverse…). Mientras el menú está abierto el
 * botón no se pinta: el menú ya trae su propia X para cerrarse.
 *
 * Va en un portal en <body> (igual que la barra de compra fija) para que
 * ningún `transform` de un ancestro rompa el `position: fixed`.
 */
export function MobileMenuButton(props: MobileMenuButtonProps) {
  const {
    iconSvg,
    position = "top-left",
    offsetX = "1rem",
    offsetY = "1rem",
    iconSize = "1.25rem",
    iconColor = "#FFFFFF",
    bgColor = "transparent",
    borderColor,
    borderWidth = 0,
    radius = "0px",
    paddingSelect = "a",
    paddingText = "0.6rem",
    marginSelect = "a",
    marginText,
    opacity = 100,
    zIndex = 30,
  } = props;

  const open = useMobileMenu((state) => state.open);
  const setOpen = useMobileMenu((state) => state.setOpen);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // El estado del menú es global: si se sale de la página con él abierto no
  // debe aparecer abierto en la siguiente.
  useEffect(() => () => setOpen(false), [setOpen]);

  if (!mounted || open) return null;

  const [vertical, horizontal] = position.split("-") as ["top" | "bottom", "left" | "right"];

  const style: CSSProperties = {
    [vertical]: offsetY,
    [horizontal]: offsetX,
    zIndex,
    color: iconColor,
    background: bgColor,
    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor || iconColor}` : "none",
    borderRadius: radius,
    opacity: opacity / 100,
    ...selectorPaddingMargin("padding", paddingSelect, paddingText),
    ...selectorPaddingMargin("margin", marginSelect, marginText),
  };

  return createPortal(
    <button
      type="button"
      aria-label="Abrir menú"
      onClick={() => setOpen(true)}
      className="fixed flex cursor-pointer items-center justify-center transition-opacity lg:hidden"
      style={style}
    >
      <span
        aria-hidden
        className="block [&_svg]:h-full [&_svg]:w-full"
        style={{ width: iconSize, height: iconSize }}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG configurado por el merchant en Weaverse
        dangerouslySetInnerHTML={{ __html: iconSvg || DEFAULT_MENU_ICON_SVG }}
      />
    </button>,
    document.body,
  );
}
