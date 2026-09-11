import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseProduct,
} from "@weaverse/hydrogen";
import { useCallback, useMemo, useState } from "react";
import type { ProductQuery } from "storefront-api.generated";
import { Section } from "~/components/section";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { createCurProVar } from "~/routes/collections/utils";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import { ModelTag } from "./model-tag";
import {
  buildOptionTitleMap,
  getSelectedOptionValue,
  lookupLine,
  OPTION_METAOBJECTS_QUERY,
  parseKeyValueLines,
  type OptionMetaobjectsResult,
} from "./utils";

interface MaterialFinishSelectorProps extends HydrogenComponentProps {
  title: string;
  productos: WeaverseProduct[];
  families: string;
  labels: string;
  swatchColors: string;
  columns: number;
  preserveOptionName: string;
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
  // tarjeta (imagen a sangre, sin fondo ni padding propios — igual que
  // product-card-collection.tsx en variant-selector-secret)
  cBgColor: string;
  cBorderColor: string;
  cActiveBorderColor: string;
  cRadius: string;
  cTextGap: string;
  overlayColor: string;
  swatchRatio: string;
  // familia (PRIME HYBRID™)
  fColor: string;
  fSize: string;
  fLetter: number;
  fFamily: string;
  fWeight: string;
  // nombre del acabado
  nColor: string;
  nActiveColor: string;
  nSize: string;
  nFamily: string;
  nWeight: string;
  // check
  checkBgColor: string;
  checkColor: string;
  // etiqueta de modelo (custom.model_tag), superpuesta en la esquina de la imagen
  mdlColor: string;
  mdlSize: string;
  mdlLetter: number;
  mdlFamily: string;
  mdlWeight: string;
  mdlBgColor: string;
  mdlRadius: string;
  mdlPaddingSelect: string;
  mdlPaddingText: string;
  mdlMarginSelect: string;
  mdlMarginText: string;
  // tooltip de la etiqueta de modelo (custom.model_description), al hacer clic sobre ella
  mdlTipColor: string;
  mdlTipSize: string;
  mdlTipLetter: number;
  mdlTipFamily: string;
  mdlTipWeight: string;
  mdlTipBgColor: string;
  mdlTipRadius: string;
  mdlTipPaddingSelect: string;
  mdlTipPaddingText: string;
  // descripción (custom.tooltip) del producto seleccionado, debajo del listado
  descColor: string;
  descSize: string;
  descLetter: number;
  descFamily: string;
  descWeight: string;
  descBgColor: string;
  descRadius: string;
  descPaddingSelect: string;
  descPaddingText: string;
  descMarginSelect: string;
  descMarginText: string;
}

interface ApiResponseProduct {
  result: ProductQuery["product"];
  ok: boolean;
  errorMessage?: string;
}

/** Producto de material ya normalizado para pintar la tarjeta. */
interface MaterialCard {
  id: string;
  handle: string;
  title: string;
  family: string;
  label: string;
  modelo: string;
  modelDescription: string;
  image: string | null;
  available: boolean;
}

/**
 * Carga los productos de material/acabado en el servidor, igual que hace
 * `crossell.tsx` en main-product-j.
 */
export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<MaterialFinishSelectorProps>) => {
  const { language, country } = weaverse.storefront.i18n;
  const { productos } = data;

  if (!productos?.length) return { products: [], options: null };

  const [results, options] = await Promise.all([
    Promise.all(
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
          console.error("Error cargando material:", error);
          return null;
        }
      }),
    ),
    weaverse.storefront
      .query<OptionMetaobjectsResult>(OPTION_METAOBJECTS_QUERY, { variables: { first: 50 } })
      .catch((error) => {
        console.error("Error cargando metaobjetos option:", error);
        return null;
      }),
  ]);

  return JSON.parse(JSON.stringify({ products: results.filter(Boolean), options }));
};

/**
 * Selector de material y acabado. Cada acabado es un PRODUCTO distinto: al
 * pulsar se carga ese producto y pasa a ser el producto actual del store
 * (mismo patrón que `product-var.tsx` en main-product-j), así que el selector
 * de talla, la cabecera y el CTA se recalculan sobre el nuevo producto.
 */
export default function MaterialFinishSelector(props: MaterialFinishSelectorProps) {
  const {
    title,
    productos,
    loaderData,
    families,
    labels,
    swatchColors,
    columns,
    preserveOptionName,
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
    cRadius,
    cTextGap,
    overlayColor,
    swatchRatio,
    fColor,
    fSize,
    fLetter,
    fFamily,
    fWeight,
    nColor,
    nActiveColor,
    nSize,
    nFamily,
    nWeight,
    checkBgColor,
    checkColor,
    mdlColor,
    mdlSize,
    mdlLetter,
    mdlFamily,
    mdlWeight,
    mdlBgColor,
    mdlRadius,
    mdlPaddingSelect,
    mdlPaddingText,
    mdlMarginSelect,
    mdlMarginText,
    mdlTipColor,
    mdlTipSize,
    mdlTipLetter,
    mdlTipFamily,
    mdlTipWeight,
    mdlTipBgColor,
    mdlTipRadius,
    mdlTipPaddingSelect,
    mdlTipPaddingText,
    descColor,
    descSize,
    descLetter,
    descFamily,
    descWeight,
    descBgColor,
    descRadius,
    descPaddingSelect,
    descPaddingText,
    descMarginSelect,
    descMarginText,
    ...rest
  } = props;

  const products = (loaderData?.products ?? []) as ProductQuery["product"][];

  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const setProduct = useCurrentProduct((state) => state.setProduct);
  const setVariant = useCurrentProduct((state) => state.setVariant);
  const getApiUrl = usePrefixPathWithLocale("api/product-secret");

  const [loadingHandle, setLoadingHandle] = useState<string | null>(null);

  const familyMap = useMemo(() => parseKeyValueLines(families), [families]);
  const labelMap = useMemo(() => parseKeyValueLines(labels), [labels]);
  const colorMap = useMemo(() => parseKeyValueLines(swatchColors), [swatchColors]);
  // valor de custom.material (ej. "cuero") -> title del metaobjeto option (ej. "Prime Hybrid™")
  const optionTitleMap = useMemo(() => buildOptionTitleMap(loaderData?.options), [loaderData]);

  const cards = useMemo<MaterialCard[]>(() => {
    return products.filter(Boolean).map((product) => {
      const anyProduct = product as any;
      const materialValue = anyProduct.material?.value as string | undefined;
      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        // El producto conecta con el metaobjeto option a través de
        // custom.material: se busca la entrada option cuyo campo `product`
        // coincide con ese valor y se usa su `title` como familia. Si no hay
        // coincidencia, cae al mapeo manual del Studio y, por último, al
        // valor crudo del metafield.
        family:
          optionTitleMap[(materialValue ?? "").trim().toLowerCase()] ||
          lookupLine(familyMap, product.handle) ||
          materialValue ||
          "",
        label:
          lookupLine(labelMap, product.handle) || anyProduct.nombre?.value || product.title,
        modelo: anyProduct.modelTag?.value || "",
        modelDescription: anyProduct.modelDescription?.value || "",
        // Prioriza el metafield custom.img_principal (pensado para el swatch)
        // y cae a la imagen destacada del producto si no está informado.
        image: product.principalImg?.reference?.previewImage?.url ?? product.featuredImage?.url ?? null,
        available: product.variants?.nodes?.some((variant) => variant.availableForSale) ?? false,
      } satisfies MaterialCard;
    });
  }, [products, familyMap, labelMap, optionTitleMap]);

  /**
   * Cambia el producto actual y, si es posible, conserva la talla elegida
   * (el usuario espera seguir en XL al cambiar de acabado).
   */
  const selectProduct = useCallback(
    async (handle: string) => {
      if (!handle || handle === currentProduct?.handle || loadingHandle) return;

      const optionName = preserveOptionName || "Talla";
      const previousValue = getSelectedOptionValue(currentProduct?.selectedVariant, optionName);

      setLoadingHandle(handle);

      // Se refleja el producto en la URL sin recargar, igual que product-var.tsx
      if (typeof window !== "undefined" && window.location.href.includes("products")) {
        const startsUrl = window.location.href.split("products")[0] + "products/";
        const newUrl = startsUrl + handle;
        const nextState = { additionalInformation: "Updated the URL with JS" };
        window.history.pushState(nextState, "", newUrl);
        window.history.replaceState(nextState, "", newUrl);
      }

      try {
        const res = await fetch(getApiUrl, {
          method: "POST",
          body: JSON.stringify({ handle }),
        });
        const data = (await res.json()) as ApiResponseProduct;

        if (data.ok && data.result) {
          const prod = createCurProVar(data.result);
          setProduct(prod);

          if (previousValue) {
            const match = prod.variants?.nodes?.find((variant: any) =>
              variant.selectedOptions?.some(
                (option: any) =>
                  option.name?.trim().toLowerCase() === optionName.trim().toLowerCase() &&
                  option.value?.trim().toLowerCase() === previousValue.trim().toLowerCase(),
              ),
            );
            if (match) setVariant(match);
          }
        }
      } catch (error) {
        console.error("Error cargando el material:", error);
      } finally {
        setLoadingHandle(null);
      }
    },
    [currentProduct, loadingHandle, preserveOptionName, getApiUrl, setProduct, setVariant],
  );

  if (!cards.length) return null;

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

        <div
          className="material-grid flex flex-wrap gap-2"
          // style={{ gridTemplateColumns: `repeat(${columns || 3}, minmax(0, 1fr))` }}
        >
          {cards.map((card) => {
            const active = card.handle === currentProduct?.handle;
            const isLoading = loadingHandle === card.handle;
            const color = lookupLine(colorMap, card.handle) || "#3F3F46";

            return (
              <button
                type="button"
                key={card.id}
                disabled={!card.available || Boolean(loadingHandle)}
                onClick={() => selectProduct(card.handle)}
                data-material={card.handle}
                data-active={active}
                className="material-card flex flex-col items-stretch text-left"
                style={{
                  minWidth:"110px",
                  width:"110px",
                  background:cBgColor,
                  cursor: card.available ? "pointer" : "not-allowed",
                  opacity: card.available ? 1 : 0.35,
                  transition: "all 0.3s ease",
                  position:"relative",
                  alignItems:"center"
                }}
              >
                <div
                  className="material-swatch relative w-full overflow-hidden"
                  style={{
                    aspectRatio: swatchRatio || "3/4",
                    background: cBgColor,
                    border: `1px solid ${active ? cActiveBorderColor : cBorderColor}`,
                    borderRadius: cRadius,
                    filter: isLoading ? "brightness(0.6)" : "none",
                    transition: "border-color 0.3s ease, filter 0.3s ease",
                    width:"90%",
                    height:"70%",
                    marginTop:"5%",
                  }}
                >
                  {card.image ? (
                    <img src={card.image} alt={card.label} className="h-full w-full object-contain" style={{ background: overlayColor,transform:"scale(1.4)",marginTop:"calc(5% * 2)" }} />
                  ) : (
                    <div className="h-full w-full" style={{ background: overlayColor }} />
                  )}

                  {card.modelo && (
                    <ModelTag
                      label={card.modelo}
                      description={card.modelDescription}
                      tagStyle={{
                        color: mdlColor,
                        size: mdlSize,
                        letter: mdlLetter,
                        family: mdlFamily,
                        weight: mdlWeight,
                        bgColor: mdlBgColor,
                        radius: mdlRadius,
                        paddingSelect: mdlPaddingSelect,
                        paddingText: mdlPaddingText || "0.2rem 0.45rem",
                        marginSelect: mdlMarginSelect,
                        marginText: mdlMarginText,
                      }}
                      tooltipStyle={{
                        color: mdlTipColor,
                        size: mdlTipSize,
                        letter: mdlTipLetter,
                        family: mdlTipFamily,
                        weight: mdlTipWeight,
                        bgColor: mdlTipBgColor,
                        radius: mdlTipRadius,
                        paddingSelect: mdlTipPaddingSelect,
                        paddingText: mdlTipPaddingText,
                      }}
                    />
                  )}

                  {active && (
                    <span
                      className="material-check absolute z-10 flex items-center justify-center"
                      style={{
                        top: "0.5rem",
                        right: "0.5rem",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: checkBgColor,
                        color: checkColor,
                        fontSize: "10px",
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </span>
                  )}

                  {/* Texto superpuesto sobre la imagen, con degradado para que se lea */}
                </div>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-[2px]"
                  style={{
                    background: cBgColor,
                    ...selectorPaddingMargin("padding", "a", cTextGap ?? "1.5rem 0.7rem 0.7rem"),
                  }}
                >
                  {card.family && (
                    <span
                      className="material-family"
                      style={{
                        color: fColor,
                        fontFamily: fFamily,
                        fontSize: fSize,
                        fontWeight: fWeight,
                        letterSpacing: fLetter > 0 ? `${fLetter}px` : "normal",
                        textTransform: "uppercase",
                      }}
                    >
                      {card.family}
                    </span>
                  )}
                  <span
                    className="material-name"
                    style={{
                      color: active ? nActiveColor || nColor : nColor,
                      fontFamily: nFamily,
                      fontSize: nSize,
                      fontWeight: nWeight,
                    }}
                  >
                    {card.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Descripción (custom.tooltip) del producto seleccionado */}
        {currentProduct?.tooltip && (
          <div
            className="material-description"
            style={{
              color: descColor,
              fontFamily: descFamily,
              fontSize: descSize,
              fontWeight: descWeight,
              letterSpacing: descLetter > 0 ? `${descLetter}px` : "normal",
              background: descBgColor,
              borderRadius: descRadius,
              ...selectorPaddingMargin("padding", descPaddingSelect, descPaddingText),
              ...selectorPaddingMargin("margin", descMarginSelect, descMarginText || "0.8rem"),
            }}
          >
            {currentProduct.tooltip as unknown as string}
          </div>
        )}
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "material-finish-d",
  title: "Material & finish",
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Título", name: "title", defaultValue: "MATERIAL & ACABADO" },
        {
          type: "product-list",
          label: "Productos (acabados)",
          name: "productos",
          helpText: "Cada acabado es un producto. Al elegirlo pasa a ser el producto actual.",
        },
        {
          type: "text",
          label: "Opción a conservar",
          name: "preserveOptionName",
          defaultValue: "Talla",
          helpText: "Al cambiar de acabado se intenta mantener este valor de opción.",
        },
        {
          type: "textarea",
          label: "Familias por handle",
          name: "families",
          helpText:
            "Respaldo si el producto no tiene el metafield custom.material. Formato handle|familia.",
        },
        {
          type: "textarea",
          label: "Etiquetas por handle",
          name: "labels",
          helpText: "Opcional. handle|etiqueta. Si se omite se usa el nombre del producto.",
        },
        {
          type: "textarea",
          label: "Colores del swatch",
          name: "swatchColors",
          helpText: "Respaldo cuando el producto no tiene imagen. Formato handle|color.",
        },
        {
          type: "range",
          label: "Columnas",
          name: "columns",
          defaultValue: 3,
          configs: { min: 1, max: 5, step: 1 },
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
    {
      group: "Tarjeta",
      inputs: [
        { type: "color", label: "Background (sin imagen)", name: "cBgColor", defaultValue: "#0A0A0A" },
        { type: "color", label: "Borde", name: "cBorderColor", defaultValue: "#ffffff2a" },
        { type: "color", label: "Borde activo", name: "cActiveBorderColor", defaultValue: "#C9A227" },
        { type: "text", label: "Border radius", name: "cRadius", defaultValue: "10px" },
        { type: "text", label: "Aspect ratio del swatch", name: "swatchRatio", defaultValue: "3/4" },
        {
          type: "color",
          label: "fondo imagen",
          name: "overlayColor",
          defaultValue: "#000000",
          helpText: "Color base del degradado que da legibilidad al texto superpuesto en la imagen.",
        },
        {
          type: "text",
          label: "Padding del texto superpuesto",
          name: "cTextGap",
          defaultValue: "1.5rem 0.7rem 0.7rem",
        },
        { type: "color", label: "Fondo del check", name: "checkBgColor", defaultValue: "#0A0A0A" },
        { type: "color", label: "Color del check", name: "checkColor", defaultValue: "#FFFFFF" },
      ],
    },
    {
      group: "Familia",
      inputs: [
        { type: "color", label: "Color", name: "fColor", defaultValue: "#52525B" },
        { type: "text", label: "Font size", name: "fSize", defaultValue: "0.6rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "fLetter",
          defaultValue: 1,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "text", label: "Font family", name: "fFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "fWeight",
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
      group: "Acabado",
      inputs: [
        { type: "color", label: "Color", name: "nColor", defaultValue: "#FFFFFF" },
        { type: "color", label: "Color activo", name: "nActiveColor", defaultValue: "#C9A227" },
        { type: "text", label: "Font size", name: "nSize", defaultValue: "0.78rem" },
        { type: "text", label: "Font family", name: "nFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
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
      ],
    },
    {
      group: "Etiqueta de modelo (custom.model_tag)",
      inputs: [
        { type: "color", label: "Color", name: "mdlColor", defaultValue: "#FFFFFF" },
        { type: "text", label: "Font size", name: "mdlSize", defaultValue: "0.6rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "mdlLetter",
          defaultValue: 0,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "text", label: "Font family", name: "mdlFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "mdlWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "600",
        },
        { type: "color", label: "Background", name: "mdlBgColor", defaultValue: "#050505cc" },
        { type: "text", label: "Border radius", name: "mdlRadius", defaultValue: "4px" },
        {
          type: "select",
          label: "Padding type",
          name: "mdlPaddingSelect",
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
        { type: "text", label: "Padding value", name: "mdlPaddingText", defaultValue: "0.2rem 0.45rem" },
        {
          type: "select",
          label: "Margin type",
          name: "mdlMarginSelect",
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
        { type: "text", label: "Margin value", name: "mdlMarginText" },
      ],
    },
    {
      group: "Tooltip de la etiqueta (custom.model_description)",
      inputs: [
        { type: "color", label: "Color", name: "mdlTipColor", defaultValue: "#FFFFFF" },
        { type: "text", label: "Font size", name: "mdlTipSize", defaultValue: "0.8rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "mdlTipLetter",
          defaultValue: 0,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "text", label: "Font family", name: "mdlTipFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "mdlTipWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
            ],
          },
          defaultValue: "400",
        },
        { type: "color", label: "Background", name: "mdlTipBgColor", defaultValue: "#3f3f46e6" },
        { type: "text", label: "Border radius", name: "mdlTipRadius", defaultValue: "10px" },
        {
          type: "select",
          label: "Padding type",
          name: "mdlTipPaddingSelect",
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
        { type: "text", label: "Padding value", name: "mdlTipPaddingText", defaultValue: "0.7rem 0.9rem" },
      ],
    },
    {
      group: "Descripción (custom.tooltip)",
      inputs: [
        { type: "color", label: "Color", name: "descColor", defaultValue: "#A1A1AA" },
        { type: "text", label: "Font size", name: "descSize", defaultValue: "0.8rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "descLetter",
          defaultValue: 0,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        { type: "text", label: "Font family", name: "descFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "descWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
            ],
          },
          defaultValue: "400",
        },
        { type: "color", label: "Background", name: "descBgColor" },
        { type: "text", label: "Border radius", name: "descRadius" },
        {
          type: "select",
          label: "Padding type",
          name: "descPaddingSelect",
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
        { type: "text", label: "Padding value", name: "descPaddingText" },
        {
          type: "select",
          label: "Margin type",
          name: "descMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "t",
        },
        { type: "text", label: "Margin value", name: "descMarginText", defaultValue: "0.8rem" },
      ],
    },
  ],
});
