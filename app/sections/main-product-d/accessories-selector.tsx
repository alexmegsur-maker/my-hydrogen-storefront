import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseProduct,
} from "@weaverse/hydrogen";
import { useEffect, useMemo } from "react";
import type { ProductQuery } from "storefront-api.generated";
import { Section } from "~/components/section";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import { useProductConfiguratorD } from "./store";
import type { AccessoryLine } from "./types";
import { formatAmount } from "./utils";

interface AccessoriesSelectorProps extends HydrogenComponentProps {
  title: string;
  productos: WeaverseProduct[];
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
  // chip
  cBgColor: string;
  cBorderColor: string;
  cActiveBorderColor: string;
  cActiveBgColor: string;
  cRadius: string;
  cPaddingSelect: string;
  cPaddingText: string;
  swatchSize: string;
  swatchRadius: string;
  // textos del chip
  nColor: string;
  nActiveColor: string;
  nSize: string;
  nFamily: string;
  nWeight: string;
  pColor: string;
  pSize: string;
  pFamily: string;
  pWeight: string;
}

/**
 * Carga los productos de accesorio en el servidor, igual que hace
 * `crossell.tsx` en main-product-j.
 */
export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<AccessoriesSelectorProps>) => {
  const { language, country } = weaverse.storefront.i18n;
  const { productos } = data;

  if (!productos?.length) return { products: [] };

  const results = await Promise.all(
    productos.map(async (producto) => {
      if (!producto?.handle) return null;
      try {
        const { product } = await weaverse.storefront.query<ProductQuery>(PRODUCT_QUERY, {
          variables: {
            country,
            language,
            selectedOptions: [],
            handle: producto.handle,
          },
        });
        return product ?? null;
      } catch (error) {
        console.error("Error cargando accesorio:", error);
        return null;
      }
    }),
  );

  return JSON.parse(JSON.stringify({ products: results.filter(Boolean) }));
};

/**
 * Accesorios del setup. La selección se guarda en el store del configurador
 * (`useProductConfiguratorD`) y es de ahí de donde el CTA saca las líneas de
 * carrito y el total, sin acoplar ambos componentes.
 */
export default function AccessoriesSelector(props: AccessoriesSelectorProps) {
  const {
    title,
    productos,
    loaderData,
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
    cBgColor,
    cBorderColor,
    cActiveBorderColor,
    cActiveBgColor,
    cRadius,
    cPaddingSelect,
    cPaddingText,
    swatchSize,
    swatchRadius,
    nColor,
    nActiveColor,
    nSize,
    nFamily,
    nWeight,
    pColor,
    pSize,
    pFamily,
    pWeight,
    ...rest
  } = props;

  const products = (loaderData?.products ?? []) as ProductQuery["product"][];

  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const accessories = useProductConfiguratorD((state) => state.accessories);
  const toggleAccessory = useProductConfiguratorD((state) => state.toggleAccessory);
  const setProductId = useProductConfiguratorD((state) => state.setProductId);

  // Al cambiar de producto se descartan los accesorios elegidos para el anterior.
  useEffect(() => {
    if (currentProduct?.id) setProductId(currentProduct.id);
  }, [currentProduct?.id, setProductId]);

  const lines = useMemo<AccessoryLine[]>(() => {
    return products
      .filter(Boolean)
      .map((product) => {
        const variant = product.variants?.nodes?.[0];
        if (!variant) return null;
        return {
          id: product.id,
          variantId: variant.id,
          // Si el producto tiene el metafield custom.name_style_secret (alias
          // `nombre` en PRODUCT_QUERY), se usa ese nombre "de marca" en vez
          // del título de Shopify — igual que hace createCurProVar().
          title: product.nombre?.value || product.title,
          price: Number.parseFloat(variant.price?.amount ?? "0"),
          compareAtPrice: variant.compareAtPrice?.amount
            ? Number.parseFloat(variant.compareAtPrice.amount)
            : null,
          image: product.featuredImage?.url ?? null,
          available: Boolean(variant.availableForSale),
          quantity: 1,
        } satisfies AccessoryLine;
      })
      .filter((line): line is AccessoryLine => line !== null);
  }, [products]);

  if (!lines.length) return null;

  return (
    <Section {...rest}>
      <div
        className="config-section"
        style={{
          ...selectorPaddingMargin("padding", paddingSelect, paddingText),
          ...selectorPaddingMargin("margin", marginSelect, marginText),
        }}
      >
        <div
          className="config-label mb-[1rem]"
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

        <div className="acc-list flex flex-wrap gap-3">
          {lines.map((line) => {
            const active = accessories.some((elm) => elm.id === line.id);

            return (
              <button
                type="button"
                key={line.id}
                disabled={!line.available}
                onClick={() => toggleAccessory(line)}
                data-accesorio={line.id}
                data-active={active}
                className="acc-item flex items-center gap-3"
                style={{
                  background: active ? cActiveBgColor : cBgColor,
                  border: `1px solid ${active ? cActiveBorderColor : cBorderColor}`,
                  borderRadius: cRadius,
                  cursor: line.available ? "pointer" : "not-allowed",
                  opacity: line.available ? 1 : 0.4,
                  transition: "all 0.3s ease",
                  ...selectorPaddingMargin("padding", cPaddingSelect, cPaddingText),
                }}
              >
                <span
                  className="acc-swatch shrink-0"
                  style={{
                    width: swatchSize,
                    height: swatchSize,
                    borderRadius: swatchRadius,
                    background: line.image
                      ? `url(${line.image}) center/cover no-repeat`
                      : "#3F3F46",
                    display: "block",
                  }}
                />
                <span className="flex flex-col items-start">
                  <span
                    className="acc-title"
                    style={{
                      color: active ? nActiveColor : nColor,
                      fontFamily: nFamily,
                      fontSize: nSize,
                      fontWeight: nWeight,
                    }}
                  >
                    
                    {line.title}
                  </span>
                  <span
                    className="acc-price"
                    style={{
                      color: pColor,
                      fontFamily: pFamily,
                      fontSize: pSize,
                      fontWeight: pWeight,
                    }}
                  >
                    +{formatAmount(line.price)}€
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "accessories-selector-d",
  title: "Accessories selector",
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Título", name: "title", defaultValue: "SETUP — ACCESORIOS" },
        { type: "product-list", label: "Accesorios", name: "productos" },
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
    {
      group: "Chip",
      inputs: [
        { type: "color", label: "Background", name: "cBgColor", defaultValue: "#0A0A0A" },
        { type: "color", label: "Borde", name: "cBorderColor", defaultValue: "#ffffff14" },
        { type: "color", label: "Borde activo", name: "cActiveBorderColor", defaultValue: "#C9A227" },
        { type: "color", label: "Background activo", name: "cActiveBgColor", defaultValue: "#12100A" },
        { type: "text", label: "Border radius", name: "cRadius", defaultValue: "4px" },
        {
          type: "select",
          label: "Padding type",
          name: "cPaddingSelect",
          configs: {
            options: [
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        { type: "text", label: "Padding value", name: "cPaddingText", defaultValue: "0.75rem 1rem" },
        { type: "text", label: "Tamaño del swatch", name: "swatchSize", defaultValue: "28px" },
        { type: "text", label: "Radio del swatch", name: "swatchRadius", defaultValue: "3px" },
      ],
    },
    {
      group: "Textos del chip",
      inputs: [
        { type: "color", label: "Color título", name: "nColor", defaultValue: "#D4D4D8" },
        { type: "color", label: "Color título activo", name: "nActiveColor", defaultValue: "#F7D97A" },
        { type: "text", label: "Font size título", name: "nSize", defaultValue: "0.78rem" },
        { type: "text", label: "Font family título", name: "nFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight título",
          name: "nWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "500",
        },
        { type: "color", label: "Color precio", name: "pColor", defaultValue: "#71717A" },
        { type: "text", label: "Font size precio", name: "pSize", defaultValue: "0.7rem" },
        { type: "text", label: "Font family precio", name: "pFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight precio",
          name: "pWeight",
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
