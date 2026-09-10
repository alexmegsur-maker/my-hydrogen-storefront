import type { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { Section } from "~/components/section";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { useCurrentProduct } from "~/stores/currentProduct";
import { cn } from "~/utils/cn";
import { pushAddToCart } from "~/utils/dataLayer";
import { selectorPaddingMargin } from "~/utils/general";
import { useProductConfiguratorD } from "./store";
import { formatAmount } from "./utils";

/** A partir de este ancho se considera "desktop" (coincide con `lg:flex` del layout de main-product-d). */
const DESKTOP_BREAKPOINT = 1023;

interface AddToCartSectionProps extends HydrogenComponentProps {
  label: string;
  soldOutLabel: string;
  showTotal: boolean;
  // comportamiento fijo/flotante
  pinBottom: boolean;
  mobileFloat: boolean;
  floatShadow: boolean;
  floatZIndex: number;
  // enlace superior
  showLink: boolean;
  linkText: string;
  linkUrl: string;
  lColor: string;
  lSize: string;
  lFamily: string;
  lWeight: string;
  // financiación
  showFinancing: boolean;
  financingInstallments: number;
  financingText: string;
  financingLinkText: string;
  financingLinkUrl: string;
  finColor: string;
  finSize: string;
  finFamily: string;
  finWeight: string;
  finBadgeColor: string;
  // contenedor
  containerBg: string;
  containerBorder: string;
  paddingSelect: string;
  paddingText: string;
  // CTA
  acColor: string;
  acBgColor: string;
  acDisabledBg: string;
  acDisabledColor: string;
  acSize: string;
  acLetter: number;
  acFamily: string;
  acWeight: string;
  acRadius: string;
  acPaddingSelect: string;
  acPaddingText: string;
}

/**
 * CTA principal del configurador. Compone la línea de carrito con la variante
 * activa (`~/stores/currentProduct`) más los accesorios marcados
 * (`useProductConfiguratorD`) y muestra el total y la financiación.
 */
export default function AddToCartSection(props: AddToCartSectionProps) {
  const {
    label,
    soldOutLabel,
    showTotal,
    pinBottom,
    mobileFloat,
    floatShadow,
    floatZIndex,
    showLink,
    linkText,
    linkUrl,
    lColor,
    lSize,
    lFamily,
    lWeight,
    showFinancing,
    financingInstallments,
    financingText,
    financingLinkText,
    financingLinkUrl,
    finColor,
    finSize,
    finFamily,
    finWeight,
    finBadgeColor,
    containerBg,
    containerBorder,
    paddingSelect,
    paddingText,
    acColor,
    acBgColor,
    acDisabledBg,
    acDisabledColor,
    acSize,
    acLetter,
    acFamily,
    acWeight,
    acRadius,
    acPaddingSelect,
    acPaddingText,
    ...rest
  } = props;

  const { pathname } = useLocation();
  const pathPrefix = pathname.split("/")[1];
  const cartRoute = ["en", "de", "fr", "it"].includes(pathPrefix)
    ? `/${pathPrefix}/cart`
    : "/cart";

  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const accessories = useProductConfiguratorD((state) => state.accessories);

  const variant = currentProduct?.selectedVariant ?? null;
  const isAvailable = Boolean(variant?.availableForSale);
  /** Sin stock pero vendible => se marca como reserva, igual que en buy-buttons de J. */
  const isReserva = isAvailable && (variant?.quantityAvailable ?? 0) <= 0;

  const total = useMemo(() => {
    const variantPrice = Number.parseFloat(variant?.price?.amount ?? "0");
    const accessoriesPrice = accessories.reduce(
      (acc, elm) => acc + elm.price * elm.quantity,
      0,
    );
    return variantPrice + accessoriesPrice;
  }, [variant, accessories]);

  const cartLines = useMemo<CartLineInput[]>(() => {
    const result: CartLineInput[] = [];
    if (variant?.id) {
      result.push({
        merchandiseId: variant.id,
        quantity: 1,
        ...(isReserva ? { attributes: [{ key: "Tipo", value: "Reserva" }] } : {}),
      });
    }
    for (const accessory of accessories) {
      result.push({ merchandiseId: accessory.variantId, quantity: accessory.quantity });
    }
    return result;
  }, [variant, accessories, isReserva]);

  const analyticsItems = useMemo(() => {
    const items = [];
    if (variant && currentProduct) {
      items.push({
        item_id: variant.id,
        item_name: currentProduct.title,
        item_variant:
          variant.selectedOptions?.map((option) => option.value).join(" / ") || "",
        price: Number.parseFloat(variant.price?.amount ?? "0"),
        item_category: "Sillas Gaming Premium",
        quantity: 1,
      });
    }
    for (const accessory of accessories) {
      items.push({
        item_id: accessory.variantId,
        item_name: accessory.title,
        item_variant: accessory.title,
        price: accessory.price,
        item_category: "Accesorios",
        quantity: accessory.quantity,
      });
    }
    return items;
  }, [variant, currentProduct, accessories]);

  const installments = financingInstallments > 0 ? financingInstallments : 3;
  const installmentAmount = total > 0 ? total / installments : 0;

  // --- Comportamiento fijo (desktop) / flotante (mobile) ---------------------
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile(DESKTOP_BREAKPOINT);
  // Ancla que permanece en el flujo normal (spacer en desktop, contenedor real
  // en mobile). Sirve para medir el ancho/posición de la barra fija y para
  // saber, con un IntersectionObserver, si el CTA "inline" ya está a la vista.
  const anchorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ left: number; width: number } | null>(null);
  const [barHeight, setBarHeight] = useState(0);
  const [inlineInView, setInlineInView] = useState(false);

  useEffect(() => setMounted(true), []);

  const desktopPinned = mounted && !isMobile && pinBottom;
  const showFloatingButton = mounted && isMobile && mobileFloat && !inlineInView;

  // Desktop: la barra va `fixed` al fondo del panel derecho. Se alinea con el
  // ancla (mismo left/width que ocupa el CTA en el flujo) y se recalcula al
  // redimensionar o al cambiar el layout.
  useEffect(() => {
    if (!desktopPinned) {
      setRect(null);
      return;
    }
    const measure = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect((prev) =>
        prev && Math.abs(prev.left - r.left) < 0.5 && Math.abs(prev.width - r.width) < 0.5
          ? prev
          : { left: r.left, width: r.width },
      );
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const observer = new ResizeObserver(measure);
    if (anchorRef.current) observer.observe(anchorRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      observer.disconnect();
    };
  }, [desktopPinned]);

  // Desktop: el spacer en el flujo reserva la altura real de la barra fija
  // para que el contenido de arriba se pueda desplazar sin quedar tapado.
  useEffect(() => {
    if (!desktopPinned) {
      setBarHeight(0);
      return;
    }
    const el = barRef.current;
    if (!el) return;
    const update = () => setBarHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [desktopPinned]);

  // Mobile: el botón flotante se oculta en cuanto el CTA "inline" entra en
  // pantalla ("hasta que llegue a su componente").
  useEffect(() => {
    if (!mounted || !isMobile || !mobileFloat) {
      setInlineInView(false);
      return;
    }
    const el = anchorRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInlineInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, isMobile, mobileFloat]);

  const containerStyle: CSSProperties = {
    background: containerBg,
    borderTop: containerBorder ? `1px solid ${containerBorder}` : undefined,
    ...selectorPaddingMargin("padding", paddingSelect, paddingText),
  };

  const ctaButton = (floating = false) => (
    <AddToCartButton
      disabled={!isAvailable}
      route={cartRoute}
      lines={cartLines}
      onClick={() => {
        if (isAvailable) pushAddToCart(analyticsItems, total);
      }}
      className={cn(
        "flex items-center justify-center w-full border-none cursor-pointer",
        !floating && "e2e-button-confirm-selection",
      )}
      style={{
        color: isAvailable ? acColor : acDisabledColor,
        background: isAvailable ? acBgColor : acDisabledBg,
        fontFamily: acFamily,
        fontSize: acSize,
        fontWeight: acWeight,
        letterSpacing: acLetter > 0 ? `${acLetter}px` : "normal",
        borderRadius: acRadius,
        textTransform: "uppercase",
        ...selectorPaddingMargin("padding", acPaddingSelect, acPaddingText),
      }}
    >
      <span data-context="pdp-addtocart">
        {isAvailable ? label : soldOutLabel}
        {isAvailable && showTotal && total > 0 ? ` — ${formatAmount(total)} €` : ""}
      </span>
    </AddToCartButton>
  );

  const barContent = (
    <>
      {showLink && linkText && (
        <Link
          to={linkUrl || "#"}
          className="cta-link"
          style={{
            color: lColor,
            fontFamily: lFamily,
            fontSize: lSize,
            fontWeight: lWeight,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
          }}
        >
          {linkText}
        </Link>
      )}

      {ctaButton()}

      {showFinancing && total > 0 && (
        <div
          className="cta-financing flex items-center gap-2"
          style={{
            color: finColor,
            fontFamily: finFamily,
            fontSize: finSize,
            fontWeight: finWeight,
          }}
        >
            <svg
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="20"
              viewBox="0 0 71.25 30"
              aria-label="Klarna"
              version="2.1"
            >
              <g clip-path="url(#a)">
                <path
                  fill="#FFA8CD"
                  d="M62.7688 0H8.48123C3.79718 0 0 3.79718 0 8.48123V21.5188C0 26.2028 3.79718 30 8.48123 30H62.7688c4.684 0 8.4812-3.7972 8.4812-8.4812V8.48123C71.25 3.79718 67.4528 0 62.7688 0Z"
                ></path>
                <path
                  fill="#0B051D"
                  d="M57.412 19.1418c-1.2436 0-2.2134-1.0286-2.2134-2.2776 0-1.2491.9698-2.2776 2.2134-2.2776 1.2441 0 2.2135 1.0285 2.2135 2.2776 0 1.249-.9694 2.2776-2.2135 2.2776Zm-.6215 2.4062c1.0608 0 2.4145-.4041 3.1645-1.9837l.0731.0367c-.329.8633-.329 1.3776-.329 1.5062v.202h2.6704v-8.8901h-2.6704v.2021c0 .1286 0 .6428.329 1.5061l-.0731.0368c-.75-1.5797-2.1037-1.9838-3.1645-1.9838-2.543 0-4.3355 2.0205-4.3355 4.6839 0 2.6633 1.7925 4.6838 4.3355 4.6838Zm-8.9822-9.3677c-1.2073 0-2.1586.4225-2.9268 1.9838l-.0732-.0368c.3292-.8633.3292-1.3775.3292-1.5061v-.2021h-2.6708v8.8901h2.744v-4.6838c0-1.2307.7134-2.0021 1.8659-2.0021 1.1526 0 1.7193.6612 1.7193 1.9837v4.7022H51.54v-5.6573c0-2.0205-1.5731-3.4716-3.7317-3.4716Zm-9.3112 1.9838-.0731-.0368c.3293-.8633.3293-1.3775.3293-1.5061v-.2021h-2.6708v8.8901h2.7439l.0183-4.2797c0-1.249.6586-2.0021 1.7379-2.0021.2926 0 .5305.0367.8048.1102v-2.7185c-1.2073-.2571-2.2866.2021-2.8903 1.745Zm-8.7257 4.9777c-1.244 0-2.2135-1.0286-2.2135-2.2776 0-1.2491.9695-2.2776 2.2135-2.2776 1.2439 0 2.2134 1.0285 2.2134 2.2776 0 1.249-.9695 2.2776-2.2134 2.2776Zm-.622 2.4062c1.061 0 2.4147-.4041 3.1647-1.9837l.0732.0367c-.3293.8633-.3293 1.3776-.3293 1.5062v.202h2.6708v-8.8901H32.058v.2021c0 .1286 0 .6428.3293 1.5061l-.0732.0368c-.75-1.5797-2.1037-1.9838-3.1647-1.9838-2.5428 0-4.3355 2.0205-4.3355 4.6839 0 2.6633 1.7927 4.6838 4.3355 4.6838Zm-8.1588-.2388h2.744V8.45166h-2.744V21.3092ZM18.9784 8.45166h-2.7988c0 2.29594-1.4086 4.35314-3.5489 5.82264l-.8415.5878V8.45166H8.88062V21.3092h2.90858v-6.3736l4.8111 6.3736h3.5489L15.521 15.211c2.1037-1.5245 3.4757-3.894 3.4574-6.75934Z"
                ></path>
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h71.25v30H0z"></path>
                </clipPath>
              </defs>
            </svg>
            <span>
              {financingText
                .replace("{installments}", String(installments))
                .replace("{amount}", formatAmount(Math.round(installmentAmount)))}{" "}
              {financingLinkText && (
                <Link
                  to={financingLinkUrl || "#"}
                  style={{ color: finColor, textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  {financingLinkText}
                </Link>
              )}
            </span>
          </div>
        )}
    </>
  );

  return (
    <Section {...rest}>
      {desktopPinned ? (
        <>
          <div
            ref={anchorRef}
            aria-hidden
            className="cta-spacer"
            style={{ height: barHeight }}
          />
          {typeof document !== "undefined" &&
            createPortal(
              <div
                ref={barRef}
                className="cta-container cta-container--pinned flex flex-col gap-3"
                style={{
                  ...containerStyle,
                  position: "fixed",
                  bottom: 0,
                  left: rect?.left ?? 0,
                  width: rect?.width ?? "100%",
                  zIndex: floatZIndex,
                  boxShadow: floatShadow ? "0 -14px 30px rgba(0,0,0,0.45)" : undefined,
                  visibility: rect ? "visible" : "hidden",
                }}
              >
                {barContent}
              </div>,
              document.body,
            )}
        </>
      ) : (
        <div
          ref={anchorRef}
          className="cta-container flex flex-col gap-3"
          style={containerStyle}
        >
          {barContent}
        </div>
      )}

      {showFloatingButton &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="cta-floating"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: floatZIndex,
              background: containerBg,
              borderTop: containerBorder ? `1px solid ${containerBorder}` : undefined,
              boxShadow: floatShadow ? "0 -14px 30px rgba(0,0,0,0.45)" : undefined,
              ...selectorPaddingMargin("padding", paddingSelect, paddingText),
            }}
          >
            {ctaButton(true)}
          </div>,
          document.body,
        )}
    </Section>
  );
}

export const schema = createSchema({
  type: "add-to-cart-d",
  title: "Add to cart",
  limit: 1,
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Texto del botón", name: "label", defaultValue: "Añadir al setup" },
        { type: "text", label: "Texto sin stock", name: "soldOutLabel", defaultValue: "Agotado" },
        { type: "switch", label: "Mostrar total", name: "showTotal", defaultValue: true },
        {
          type: "switch",
          label: "Fijar abajo (desktop)",
          name: "pinBottom",
          defaultValue: true,
          helpText: "En desktop la barra completa queda fija al fondo del panel, siempre visible.",
        },
        {
          type: "switch",
          label: "Botón flotante (mobile)",
          name: "mobileFloat",
          defaultValue: true,
          helpText: "En mobile solo el botón queda flotante abajo hasta que se llega al componente.",
        },
        { type: "switch", label: "Sombra superior", name: "floatShadow", defaultValue: true },
        {
          type: "range",
          label: "z-index",
          name: "floatZIndex",
          defaultValue: 40,
          configs: { min: 1, max: 100, step: 1 },
        },
        { type: "color", label: "Background", name: "containerBg", defaultValue: "#050505" },
        { type: "color", label: "Borde superior", name: "containerBorder", defaultValue: "#ffffff20" },
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
        { type: "text", label: "Padding value", name: "paddingText", defaultValue: "1.5rem 0" },
      ],
    },
    {
      group: "Enlace superior",
      inputs: [
        { type: "switch", label: "Mostrar enlace", name: "showLink", defaultValue: true },
        {
          type: "text",
          label: "Texto",
          name: "linkText",
          defaultValue: "EXPLORA NUESTRAS EDICIONES ESPECIALES",
        },
        { type: "url", label: "URL", name: "linkUrl", defaultValue: "/collections/all" },
        { type: "color", label: "Color", name: "lColor", defaultValue: "#A1A1AA" },
        { type: "text", label: "Font size", name: "lSize", defaultValue: "0.68rem" },
        { type: "text", label: "Font family", name: "lFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "lWeight",
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
      group: "CTA",
      inputs: [
        { type: "color", label: "Color", name: "acColor", defaultValue: "#050505" },
        { type: "color", label: "Background", name: "acBgColor", defaultValue: "#FFFFFF" },
        { type: "color", label: "Background deshabilitado", name: "acDisabledBg", defaultValue: "#27272A" },
        { type: "color", label: "Color deshabilitado", name: "acDisabledColor", defaultValue: "#71717A" },
        { type: "text", label: "Font size", name: "acSize", defaultValue: "0.8rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "acLetter",
          defaultValue: 1,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "text", label: "Font family", name: "acFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "acWeight",
          configs: {
            options: [
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
            ],
          },
          defaultValue: "700",
        },
        { type: "text", label: "Border radius", name: "acRadius", defaultValue: "2px" },
        {
          type: "select",
          label: "Padding type",
          name: "acPaddingSelect",
          configs: {
            options: [
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        { type: "text", label: "Padding value", name: "acPaddingText", defaultValue: "1.25rem" },
      ],
    },
    {
      group: "Financiación",
      inputs: [
        { type: "switch", label: "Mostrar financiación", name: "showFinancing", defaultValue: true },
        {
          type: "range",
          label: "Nº de plazos",
          name: "financingInstallments",
          defaultValue: 3,
          configs: { min: 2, max: 12, step: 1 },
        },
        {
          type: "text",
          label: "Texto",
          name: "financingText",
          defaultValue: "{installments} plazos de {amount}€ sin intereses (0% TAE) con Klarna",
          helpText: "Usa {installments} y {amount} como marcadores.",
        },
        { type: "text", label: "Texto del enlace", name: "financingLinkText", defaultValue: "Saber más" },
        { type: "url", label: "URL del enlace", name: "financingLinkUrl", defaultValue: "/pages/klarna" },
        { type: "color", label: "Color", name: "finColor", defaultValue: "#A1A1AA" },
        { type: "text", label: "Font size", name: "finSize", defaultValue: "0.68rem" },
        { type: "text", label: "Font family", name: "finFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "finWeight",
          configs: {
            options: [
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
            ],
          },
          defaultValue: "400",
        },
        { type: "color", label: "Color del badge", name: "finBadgeColor", defaultValue: "#8FA88F" },
      ],
    },
  ],
});
