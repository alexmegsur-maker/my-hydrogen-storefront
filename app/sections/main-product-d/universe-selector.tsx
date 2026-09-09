import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseCollection,
} from "@weaverse/hydrogen";
import { useCallback, useMemo, useState } from "react";
import { Section } from "~/components/section";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { createCurProVar } from "~/routes/collections/utils";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";

/**
 * Trae, por cada colección seleccionada en el Studio, su título y sus
 * productos con exactamente los mismos campos que usa `material-finish-selector.tsx`
 * para el swatch: imagen principal (custom.img_principal), familia
 * (custom.material) y nombre "de marca" (custom.name_style_secret).
 */
const UNIVERSE_COLLECTIONS_QUERY = `#graphql
  query UniverseCollections($ids: [ID!]!, $productsFirst: Int = 12) {
    nodes(ids: $ids) {
      ... on Collection {
        id
        title
        handle
        name: metafield(namespace: "custom", key: "name") {
          value
        }
        products(first: $productsFirst) {
          edges {
            node {
              id
              handle
              title
              featuredImage {
                url
                altText
              }
              principalImg: metafield(namespace: "custom", key: "img_principal") {
                reference {
                  ... on Media {
                    previewImage {
                      url
                      altText
                    }
                  }
                }
              }
              material: metafield(namespace: "custom", key: "material") {
                value
              }
              nombre: metafield(namespace: "custom", key: "name_style_secret") {
                value
              }
              variants(first: 1) {
                nodes {
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface UniverseProductNode {
  id: string;
  handle: string;
  title: string;
  featuredImage: { url: string; altText: string | null } | null;
  principalImg: { reference: { previewImage: { url: string; altText: string | null } | null } | null } | null;
  material: { value: string } | null;
  nombre: { value: string } | null;
  variants: { nodes: { availableForSale: boolean }[] };
}

interface UniverseCollectionNode {
  id: string;
  title: string;
  handle: string;
  name: { value: string } | null;
  products: { edges: { node: UniverseProductNode }[] };
}

interface UniverseCollectionsResult {
  nodes: (UniverseCollectionNode | null)[];
}

/** Colección ya resuelta contra el store, lista para pintar pill + grid. */
interface UniverseCollection {
  id: string;
  title: string;
  products: UniverseCard[];
}

/** Producto ya normalizado para pintar la tarjeta del universo. */
interface UniverseCard {
  id: string;
  handle: string;
  title: string;
  family: string;
  label: string;
  image: string | null;
  available: boolean;
}

interface UniverseSelectorProps extends HydrogenComponentProps {
  title: string;
  collections: WeaverseCollection[];
  productsPerCollection: number;
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
  // pills
  pillBgColor: string;
  pillBorderColor: string;
  pillActiveBorderColor: string;
  pillColor: string;
  pillActiveColor: string;
  pillSize: string;
  pillFamily: string;
  pillWeight: string;
  pillRadius: string;
  // tarjeta (misma lógica de imagen que material-finish-selector.tsx: prioriza
  // custom.img_principal, cae a featuredImage, aspect-ratio + object-contain)
  cBgColor: string;
  cBorderColor: string;
  cActiveBorderColor: string;
  cRadius: string;
  swatchRatio: string;
  cTextPadding: string;
  // familia (CUERO / TELA)
  fColor: string;
  fSize: string;
  fLetter: number;
  fFamily: string;
  fWeight: string;
  // nombre del acabado
  nColor: string;
  nSize: string;
  nFamily: string;
  nWeight: string;
}

interface ApiResponseProduct {
  result: any;
  ok: boolean;
  errorMessage?: string;
}

export const loader = async ({ data, weaverse }: ComponentLoaderArgs<UniverseSelectorProps>) => {
  const { collections, productsPerCollection } = data;
  if (!collections?.length) return { collections: [] };

  const ids = collections.map((elm) => `gid://shopify/Collection/${elm.id}`);

  try {
    const result = await weaverse.storefront.query<UniverseCollectionsResult>(
      UNIVERSE_COLLECTIONS_QUERY,
      {
        variables: { ids, productsFirst: productsPerCollection || 12 },
      },
    );
    return JSON.parse(JSON.stringify({ collections: result?.nodes?.filter(Boolean) ?? [] }));
  } catch (error) {
    console.error("Error cargando universos:", error);
    return { collections: [] };
  }
};

/**
 * "Elige tu universo": pestañas por colección (LOTR, Black Clover, Solo
 * Leveling…) y, debajo, el grid de acabados de la colección activa. Al pulsar
 * una tarjeta, ese producto pasa a ser el producto actual del store — mismo
 * mecanismo que `material-finish-selector.tsx` (`api/product-secret` +
 * `createCurProVar` + `setProduct`), así que talla, cabecera y CTA se
 * recalculan sobre el nuevo producto sin recargar la página.
 */
export default function UniverseSelector(props: UniverseSelectorProps) {
  const {
    title,
    collections: collectionsInput,
    productsPerCollection,
    columns,
    preserveOptionName,
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
    pillBgColor,
    pillBorderColor,
    pillActiveBorderColor,
    pillColor,
    pillActiveColor,
    pillSize,
    pillFamily,
    pillWeight,
    pillRadius,
    cBgColor,
    cBorderColor,
    cActiveBorderColor,
    cRadius,
    swatchRatio,
    cTextPadding,
    fColor,
    fSize,
    fLetter,
    fFamily,
    fWeight,
    nColor,
    nSize,
    nFamily,
    nWeight,
    ...rest
  } = props;

  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const setProduct = useCurrentProduct((state) => state.setProduct);
  const setVariant = useCurrentProduct((state) => state.setVariant);
  const getApiUrl = usePrefixPathWithLocale("api/product-secret");

  const [loadingHandle, setLoadingHandle] = useState<string | null>(null);

  const collections = useMemo<UniverseCollection[]>(() => {
    const raw = (loaderData?.collections ?? []) as UniverseCollectionNode[];
    return raw.map((collection) => ({
      id: collection.id,
      // El metafield custom.name es el nombre "de marca" del universo (ej.
      // "The lord of the Rings"); si no está informado se usa el título de
      // la colección en Shopify.
      title: collection.name?.value || collection.title,
      products: collection.products.edges.map(({ node }) => ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        family: node.material?.value ?? "",
        label: node.nombre?.value || node.title,
        image: node.principalImg?.reference?.previewImage?.url ?? node.featuredImage?.url ?? null,
        available: node.variants?.nodes?.some((variant) => variant.availableForSale) ?? false,
      })),
    }));
  }, [loaderData]);

  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const activeCollection = collections.find((elm) => elm.id === activeCollectionId) ?? collections[0] ?? null;

  /**
   * Cambia el producto actual (mismo patrón que `material-finish-selector.tsx`)
   * y, si es posible, conserva la talla elegida al saltar de universo.
   */
  const selectProduct = useCallback(
    async (handle: string) => {
      if (!handle || handle === currentProduct?.handle || loadingHandle) return;

      const optionName = preserveOptionName || "Talla";
      const previousValue = currentProduct?.selectedVariant?.selectedOptions?.find(
        (option) => option.name.trim().toLowerCase() === optionName.trim().toLowerCase(),
      )?.value;

      setLoadingHandle(handle);

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
        const responseData = (await res.json()) as ApiResponseProduct;

        if (responseData.ok && responseData.result) {
          const prod = createCurProVar(responseData.result);
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
        console.error("Error cargando el producto del universo:", error);
      } finally {
        setLoadingHandle(null);
      }
    },
    [currentProduct, loadingHandle, preserveOptionName, getApiUrl, setProduct, setVariant],
  );

  if (!collections.length) return null;

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

        <div className="universe-tabs mb-4 flex flex-wrap gap-2">
          {collections.map((collection) => {
            const active = collection.id === activeCollection?.id;
            return (
              <button
                type="button"
                key={collection.id}
                onClick={() => setActiveCollectionId(collection.id)}
                data-universo={collection.id}
                data-active={active}
                className="universe-tab cursor-pointer"
                style={{
                  background: pillBgColor,
                  border: `1px solid ${active ? pillActiveBorderColor : pillBorderColor}`,
                  borderRadius: pillRadius,
                  color: active ? pillActiveColor : pillColor,
                  fontFamily: pillFamily,
                  fontSize: pillSize,
                  fontWeight: pillWeight,
                  padding: "0.5rem 1rem",
                  transition: "all 0.3s ease",
                }}
              >
                {collection.title}
              </button>
            );
          })}
        </div>

        <div
          className="universe-grid grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns || 3}, minmax(0, 1fr))` }}
        >
          {activeCollection?.products.map((card) => {
            const active = card.handle === currentProduct?.handle;
            const isLoading = loadingHandle === card.handle;

            return (
              <button
                type="button"
                key={card.id}
                disabled={!card.available || Boolean(loadingHandle)}
                onClick={() => selectProduct(card.handle)}
                data-producto={card.handle}
                data-active={active}
                className="universe-card flex flex-col overflow-hidden text-left items-stretch "
                style={{
                  background: cBgColor,
                  border: `1px solid ${active ? cActiveBorderColor : cBorderColor}`,
                  borderRadius: cRadius,
                  cursor: card.available ? "pointer" : "not-allowed",
                  opacity: card.available ? 1 : 0.35,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="universe-card-swatch w-full relative"
                  style={{
                    aspectRatio: swatchRatio || "3/4",
                    filter: isLoading ? "brightness(0.6)" : "none",
                    transition: "filter 0.3s ease",
                  }}
                >
                  {card.image && (
                    <img src={card.image} alt={card.label} className="h-full w-full object-contain" />
                  )}
                  <div
                    className="flex flex-col gap-[2px] absolute inset-x-0 bottom-0"
                    style={{ ...selectorPaddingMargin("padding", "a", cTextPadding || "0.8rem") }}
                  >
                    {card.family && (
                      <span
                        className="universe-card-family"
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
                      className="universe-card-name"
                      style={{
                        color: nColor,
                        fontFamily: nFamily,
                        fontSize: nSize,
                        fontWeight: nWeight,
                      }}
                    >
                      {card.label}
                    </span>
                  </div>
                </div>

              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "universe-selector-d",
  title: "Universe selector",
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Título", name: "title", defaultValue: "UNIVERSO" },
        {
          type: "collection-list",
          label: "Universos (colecciones)",
          name: "collections",
          helpText: "Cada colección es un universo (LOTR, Black Clover, Solo Leveling…).",
        },
        {
          type: "range",
          label: "Productos por universo",
          name: "productsPerCollection",
          defaultValue: 12,
          configs: { min: 1, max: 50, step: 1 },
        },
        {
          type: "range",
          label: "Columnas",
          name: "columns",
          defaultValue: 3,
          configs: { min: 1, max: 5, step: 1 },
        },
        {
          type: "text",
          label: "Opción a conservar",
          name: "preserveOptionName",
          defaultValue: "Talla",
          helpText: "Al cambiar de universo se intenta mantener este valor de opción (ej. la talla).",
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
      group: "Pestañas (universos)",
      inputs: [
        { type: "color", label: "Background", name: "pillBgColor", defaultValue: "#0A0A0A" },
        { type: "color", label: "Borde", name: "pillBorderColor", defaultValue: "#ffffff1f" },
        { type: "color", label: "Borde activo", name: "pillActiveBorderColor", defaultValue: "#C9A227" },
        { type: "color", label: "Color", name: "pillColor", defaultValue: "#D4D4D8" },
        { type: "color", label: "Color activo", name: "pillActiveColor", defaultValue: "#C9A227" },
        { type: "text", label: "Font size", name: "pillSize", defaultValue: "0.8rem" },
        { type: "text", label: "Font family", name: "pillFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "pillWeight",
          configs: {
            options: [
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
            ],
          },
          defaultValue: "500",
        },
        { type: "text", label: "Border radius", name: "pillRadius", defaultValue: "999px" },
      ],
    },
    {
      group: "Tarjeta",
      inputs: [
        { type: "color", label: "Background", name: "cBgColor", defaultValue: "#0A0A0A" },
        { type: "color", label: "Borde", name: "cBorderColor", defaultValue: "#ffffff14" },
        { type: "color", label: "Borde activo", name: "cActiveBorderColor", defaultValue: "#C9A227" },
        { type: "text", label: "Border radius", name: "cRadius", defaultValue: "6px" },
        { type: "text", label: "Aspect ratio de la imagen", name: "swatchRatio", defaultValue: "4/3" },
        { type: "text", label: "Padding del texto", name: "cTextPadding", defaultValue: "0.8rem" },
      ],
    },
    {
      group: "Familia (CUERO / TELA)",
      inputs: [
        { type: "color", label: "Color", name: "fColor", defaultValue: "#71717A" },
        { type: "text", label: "Font size", name: "fSize", defaultValue: "0.62rem" },
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
      group: "Nombre del acabado",
      inputs: [
        { type: "color", label: "Color", name: "nColor", defaultValue: "#FFFFFF" },
        { type: "text", label: "Font size", name: "nSize", defaultValue: "0.85rem" },
        { type: "text", label: "Font family", name: "nFamily", defaultValue: "Montserrat" },
        {
          type: "select",
          label: "Font weight",
          name: "nWeight",
          configs: {
            options: [
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
            ],
          },
          defaultValue: "700",
        },
      ],
    },
  ],
});
