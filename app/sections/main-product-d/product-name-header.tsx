import { JudgemePreviewBadge, JudgemeReviewWidget } from "@judgeme/shopify-hydrogen";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useState, type CSSProperties } from "react";
import LateralCollection from "~/components/product-j/lateral-collection";
import { Section } from "~/components/section";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";

interface ProductNameHeaderProps extends HydrogenComponentProps {
  prefix: string;
  separator: string;
  showRating: boolean;
  // spec
  sColor: string;
  sSize: string;
  sLetter: number;
  sUpper: boolean;
  sFamily: string;
  sWeight: string;
  sMaxWidth: string;
  sPaddingSelect: string;
  sPaddingText: string;
  sMarginSelect: string;
  sMarginText: string;
  // rating
  rColor: string;
  rSize: string;
  rFamily: string;
  rWeight: string;
  rPaddingSelect: string;
  rPaddingText: string;
  rMarginSelect: string;
  rMarginText: string;
  // lateral de reseñas
  paddingHeader:string;
  mbPaddingHeader:string;
  lcTitle: string;
  lcBgColor: string;
  lcBrColor: string;
  lcBrSize: string;
  lcBrFamily: string;
  lcBrWeight: string;
  brLetter: number;
  brUpper: boolean;
  brFamily: string;
  brPaddingSelect: string;
  brPaddingText: string;
  brMarginSelect: string;
  brMarginText: string;
  lcNtColor: string;
  lcNtSize: string;
  lcNtFamily: string;
  lcNtWeight: string;
}

/**
 * Cabecera del configurador: línea de especificación (nombre + opciones de la
 * variante activa) y valoración. Solo LEE la variante seleccionada del store
 * global, así que se repinta sola cuando cualquier selector la cambia.
 */
export default function ProductNameHeader(props: ProductNameHeaderProps) {
  const {
    prefix,
    separator,
    showRating,
    sColor,
    sSize,
    sLetter,
    sUpper,
    sFamily,
    sWeight,
    sMaxWidth,
    sPaddingSelect,
    sPaddingText,
    sMarginSelect,
    sMarginText,
    rColor,
    rSize,
    rFamily,
    rWeight,
    rPaddingSelect,
    rPaddingText,
    rMarginSelect,
    rMarginText,
    paddingHeader,
    mbPaddingHeader,
    lcTitle,
    lcBgColor,
    lcBrColor,
    lcBrSize,
    lcBrFamily,
    lcBrWeight,
    brLetter,
    brUpper,
    brPaddingSelect,
    brPaddingText,
    brMarginSelect,
    brMarginText,
    lcNtColor,
    lcNtSize,
    lcNtFamily,
    lcNtWeight,
    ...rest
  } = props;

  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const [showReviews, setShowReviews] = useState(false);

  /**
   * `JudgemePreviewBadge` solo renderiza un `<div data-auto-install="false">`
   * vacío — el script de Judge.me es quien lo rellena al escanear el DOM. Ese
   * escaneo lo dispara `useJudgeme()` en root.tsx, pero solo cuando ROOT
   * vuelve a renderizar. Como esta sección de Weaverse se monta 100% en
   * cliente (después del render inicial de root) y el producto puede cambiar
   * sin recargar (universo/material), el badge se queda vacío o desactualizado
   * si nadie vuelve a pedirle a Judge.me que reinstale sus widgets. Repetimos
   * aquí el mismo mecanismo que usa la librería (con el mismo pequeño delay).
   */
  useEffect(() => {
    if (!currentProduct?.id) return;
    const timeoutId = window.setTimeout(() => {
      const jdgmPreloader = (window as any).jdgm_preloader;
      const jdgmCacheServer = (window as any).jdgmCacheServer;
      if (typeof jdgmPreloader === "function") {
        jdgmPreloader();
      } else if (jdgmCacheServer?.reloadAll) {
        jdgmCacheServer.reloadAll();
      }
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [currentProduct?.id]);

  const options = (currentProduct?.selectedVariant?.selectedOptions ?? [])
    .map((option) => option.value)
    .filter((value) => value && value.toLowerCase() !== "default title");

  const spec = [currentProduct?.nombre || currentProduct?.title, ...options]
    .filter(Boolean)
    .join(" " + (separator || "·") + " ");

  return (
    <Section {...rest}>
      <div
        className="spec-header flex w-full items-start justify-between gap-4"
        style={{
          ...selectorPaddingMargin("padding", sPaddingSelect, sPaddingText),
          ...selectorPaddingMargin("margin", sMarginSelect, sMarginText),
        }}
      >
        <div
          className="spec-line"
          style={{
            color: sColor,
            fontFamily: sFamily,
            fontSize: sSize,
            fontWeight: sWeight,
            letterSpacing: sLetter > 0 ? `${sLetter}px` : "normal",
            textTransform: sUpper ? "uppercase" : "unset",
            maxWidth: sMaxWidth,
            lineHeight: 1.6,
          }}
        >
          {prefix && <span className="mr-1">{prefix}</span>}
          {spec}
        </div>

        {showRating && currentProduct?.id && (
          <div
            className="review-stars shrink-0 cursor-pointer"
            onClickCapture={() => setShowReviews(true)}
            style={{
              color: rColor,
              fontFamily: rFamily,
              fontSize: rSize,
              fontWeight: rWeight,
              ...selectorPaddingMargin("padding", rPaddingSelect, rPaddingText),
              ...selectorPaddingMargin("margin", rMarginSelect, rMarginText),
            }}
          >
            <JudgemePreviewBadge key={currentProduct.id} id={currentProduct.id} template="" />
          </div>
        )}
      </div>

      {showRating && currentProduct?.id && (
        <LateralCollection
          title={lcTitle}
          show={showReviews}
          close={() => setShowReviews(false)}
          style={{ background: lcBgColor }}
          estilos={
            {
              "--brColor": lcBrColor,
              "--brSize": lcBrSize,
              "--brFamily": lcBrFamily,
              "--brWeight": lcBrWeight,
              "--brUpper":brUpper,
              "--brLetter":brLetter,
              "--brPaddingSelect":brPaddingSelect,
              "--brPaddingText":brPaddingText,
              "--brMarginSelect":brMarginSelect,
              "--brMarginText":brMarginText,
              "--ntColor": lcNtColor,
              "--ntSize": lcNtSize,
              "--ntFamily": lcNtFamily,
              "--ntWeight": lcNtWeight,
              "--paddingsH":paddingHeader,
              "--mbPaddingsH":mbPaddingHeader
            } as CSSProperties
          }
        >
          <div className="mx-4 md:mx-6">
            <JudgemeReviewWidget key={currentProduct.id} id={currentProduct.id} />
          </div>
        </LateralCollection>
      )}
    </Section>
  );
}

export const schema = createSchema({
  type: "product-name-header-d",
  title: "Product name header",
  limit: 1,
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Prefijo", name: "prefix", defaultValue: "SPEC//" },
        { type: "text", label: "Separador", name: "separator", defaultValue: "·" },
        { type: "switch", label: "Mostrar valoración", name: "showRating", defaultValue: true },
      ],
    },
    {
      group: "Especificación",
      inputs: [
        { type: "color", label: "Color", name: "sColor", defaultValue: "#A1A1AA" },
        { type: "text", label: "Font size", name: "sSize", defaultValue: "0.75rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "sLetter",
          defaultValue: 1,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "switch", label: "Uppercase", name: "sUpper", defaultValue: true },
        { type: "text", label: "Font family", name: "sFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "sWeight",
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
        { type: "text", label: "Max width", name: "sMaxWidth", defaultValue: "22ch" },
        {
          type: "select",
          label: "Padding type",
          name: "sPaddingSelect",
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
        { type: "text", label: "Padding value", name: "sPaddingText", defaultValue: "1.5rem 2rem" },
        {
          type: "select",
          label: "Margin type",
          name: "sMarginSelect",
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
        { type: "text", label: "Margin value", name: "sMarginText" },
      ],
    },
    {
      group: "Valoración",
      inputs: [
        { type: "color", label: "Color", name: "rColor", defaultValue: "#D4D4D8" },
        { type: "text", label: "Font size", name: "rSize", defaultValue: "0.75rem" },
        { type: "text", label: "Font family", name: "rFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "rWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "500",
        },
        {
          type: "select",
          label: "Padding type",
          name: "rPaddingSelect",
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
        { type: "text", label: "Padding value", name: "rPaddingText", defaultValue: "1.5rem 2rem" },
        {
          type: "select",
          label: "Margin type",
          name: "rMarginSelect",
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
        { type: "text", label: "Margin value", name: "rMarginText" },
      ],
    },
    {
      group: "Panel de reseñas",
      inputs: [
        {
          type: "text",
          label: " Padding Header",
          name: "paddingHeader",
        },
        {
          type: "text",
          label: " Padding Header mobile",
          name: "mbPaddingHeader",
        },
        { type: "text", label: "Título", name: "lcTitle", defaultValue: "Reseñas" },
        { type: "color", label: "Background", name: "lcBgColor", defaultValue: "#050505" },
        { type: "color", label: "Breadcrumb color", name: "lcBrColor", defaultValue: "#71717A" },
        { type: "text", label: "Breadcrumb size", name: "lcBrSize", defaultValue: "0.7rem" },
        { type: "text", label: "Breadcrumb family", name: "lcBrFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Breadcrumb weight",
          name: "lcBrWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "500",
        },
        {
          type: "range",
          label: "Breadcrumb letter spacing",
          name: "brLetter",
          defaultValue: 2,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "switch",
          label: "Breadcrumb uppercase",
          name: "brUpper",
          defaultValue: true,
        },
        {
          type: "select",
          label: "Breadcrumb Padding type",
          name: "brPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Breadcrumb Padding text",
          name: "brPaddingText",
        },
        {
          type: "select",
          label: "Breadcrumb Margin type",
          name: "brMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Breadcrumb Margin text",
          name: "brMarginText",
        },
        { type: "color", label: "Title color", name: "lcNtColor", defaultValue: "#FFFFFF" },
        { type: "text", label: "Title size", name: "lcNtSize", defaultValue: "1.1rem" },
        { type: "text", label: "Title family", name: "lcNtFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Title weight",
          name: "lcNtWeight",
          configs: {
            options: [
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
            ],
          },
          defaultValue: "400",
        },
      ],
    },
  ],
});
