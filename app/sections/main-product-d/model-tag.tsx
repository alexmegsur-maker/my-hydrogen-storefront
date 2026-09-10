import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { renderRichText, selectorPaddingMargin } from "~/utils/general";

export interface ModelTagStyle {
  color: string;
  size: string;
  letter: number;
  family: string;
  weight: string;
  bgColor: string;
  radius: string;
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
}

export interface ModelTooltipStyle {
  color: string;
  size: string;
  letter: number;
  family: string;
  weight: string;
  bgColor: string;
  radius: string;
  paddingSelect: string;
  paddingText: string;
}

/** Margen mínimo respecto al borde de la ventana al recolocar el tooltip. */
const VIEWPORT_MARGIN = 12;

/**
 * Etiqueta "de modelo" (custom.model_tag) superpuesta en la esquina de la
 * imagen. Al hacer clic NO debe seleccionar el producto de la tarjeta (que es
 * un <button> que envuelve toda la tarjeta): se para la propagación y, en su
 * lugar, se abre un tooltip con custom.model_description.
 *
 * El tooltip se pinta con un portal a document.body y se posiciona con
 * `position: fixed` a partir del rect de la propia etiqueta — así no lo
 * recorta el `overflow: hidden` del swatch de la tarjeta ni queda atrapado
 * detrás de las tarjetas vecinas. Tras montarse se mide su tamaño real y se
 * recoloca (izquierda/derecha y, si no cabe arriba, debajo de la etiqueta)
 * para que nunca se desborde fuera de la ventana.
 */
export function ModelTag({
  label,
  description,
  tagStyle,
  tooltipStyle,
}: {
  label: string;
  description?: string | null;
  tagStyle: ModelTagStyle;
  tooltipStyle: ModelTooltipStyle;
}) {
  const [open, setOpen] = useState(false);
  const tagRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const handlePointerDown = (event: PointerEvent) => {
      if (tagRef.current?.contains(event.target as Node)) return;
      close();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  // Recoloca el tooltip ya montado (con su ancho/alto reales) para que quepa
  // en la ventana. Se aplica directamente sobre el nodo (en vez de guardar la
  // posición en el estado) porque corre en un layout effect, antes del
  // primer paint: no hay parpadeo ni re-render de más.
  useLayoutEffect(() => {
    if (!open) return;
    const tagEl = tagRef.current;
    const tipEl = tooltipRef.current;
    if (!tagEl || !tipEl) return;

    const tagRect = tagEl.getBoundingClientRect();
    const tipRect = tipEl.getBoundingClientRect();

    let left = Math.min(tagRect.left, window.innerWidth - tipRect.width - VIEWPORT_MARGIN);
    left = Math.max(left, VIEWPORT_MARGIN);

    const fitsAbove = tagRect.top - tipRect.height - 10 >= VIEWPORT_MARGIN;
    const top = fitsAbove ? tagRect.top - 10 : tagRect.bottom + 10;

    tipEl.style.left = `${left}px`;
    tipEl.style.top = `${top}px`;
    tipEl.style.transform = fitsAbove ? "translateY(-100%)" : "translateY(0)";
    tipEl.style.visibility = "visible";

    const arrowEl = arrowRef.current;
    if (arrowEl) {
      const tagCenter = tagRect.left + tagRect.width / 2;
      let arrowLeft = tagCenter - left - 4; // 4 = mitad del ancho de la flecha (8px)
      arrowLeft = Math.min(Math.max(arrowLeft, 10), tipRect.width - 18);
      arrowEl.style.left = `${arrowLeft}px`;
      arrowEl.style.top = fitsAbove ? "auto" : "-4px";
      arrowEl.style.bottom = fitsAbove ? "-4px" : "auto";
    }
  }, [open, description]);

  const toggle = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!description) return;
    setOpen((prev) => !prev);
  };

  return (
    <>
      <span
        ref={tagRef}
        role={description ? "button" : undefined}
        tabIndex={description ? 0 : undefined}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") toggle(event);
        }}
        className="model-tag-trigger flex absolute left-1 top-1 z-10 leading-none"
        style={{
          background: tagStyle.bgColor,
          color: tagStyle.color,
          fontFamily: tagStyle.family,
          fontSize: tagStyle.size,
          fontWeight: tagStyle.weight,
          letterSpacing: tagStyle.letter > 0 ? `${tagStyle.letter}px` : "normal",
          borderRadius: tagStyle.radius,
          cursor: description ? "pointer" : "default",
          ...selectorPaddingMargin("padding", tagStyle.paddingSelect, tagStyle.paddingText),
          ...selectorPaddingMargin("margin", tagStyle.marginSelect, tagStyle.marginText),
        }}
      >
        {label} 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-2 ms-1" style={{transform:"scale(1.7) translateX(1px)"}}>
          <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </span>

      {open && description && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={tooltipRef}
              className="model-tag-tooltip fixed z-100 w-max max-w-[min(240px,calc(100vw-24px))]"
              // Arranca invisible en (0,0): el layout effect mide su tamaño
              // real y lo recoloca dentro de la ventana antes del primer
              // paint, así que nunca llega a verse desbordado.
              style={{
                top: 0,
                left: 0,
                visibility: "hidden",
                color: tooltipStyle.color,
                fontFamily: tooltipStyle.family,
                fontSize: tooltipStyle.size,
                fontWeight: tooltipStyle.weight,
                letterSpacing: tooltipStyle.letter > 0 ? `${tooltipStyle.letter}px` : "normal",
                background: tooltipStyle.bgColor,
                borderRadius: tooltipStyle.radius,
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                ...selectorPaddingMargin("padding", tooltipStyle.paddingSelect, tooltipStyle.paddingText),
              }}
            >
              {/* custom.model_description es rich_text_field: value llega como JSON
                  (nodos paragraph/heading/list), no como texto plano. */}
              <div
                className="[&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: renderRichText(description) }}
              />
              <span
                ref={arrowRef}
                className="absolute block h-2 w-2 rotate-45"
                style={{ background: tooltipStyle.bgColor }}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
