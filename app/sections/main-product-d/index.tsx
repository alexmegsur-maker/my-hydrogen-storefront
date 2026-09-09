import { createSchema, useChildInstances } from "@weaverse/hydrogen";
import { Children, useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { ProductMediaProps } from "~/components/product/product-media";
import { Section, type SectionProps } from "~/components/section";
import { Skeleton } from "~/components/skeleton";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { createCurProVar } from "~/routes/collections/utils";
import type { loader as productRouteLoader } from "~/routes/products/product";
import { useCurrentProduct } from "~/stores/currentProduct";
import type { CurrentProduct, MediaProduct } from "~/types/currentProduct";
import { translations } from "~/utils/translations";
import ProductViewer from "./product-viewer";
import { useProductConfiguratorD } from "./store";

/** Hijos que se pintan superpuestos al visor en vez de en el panel derecho. */
const VIEWER_CHILD_TYPES = ["product-name-header-d"];

interface ProductInformationData
  extends Omit<ProductMediaProps, "selectedVariant" | "media"> {
  ref: React.Ref<HTMLDivElement>;
  color: string;
  clName?: string;
  viewerBg: string;
  showFrame: boolean;
  showThumbnails: boolean;
  thumbsPerView: number;
  showThumbsNavigation: boolean;
  backLabel: string;
  /** Oculta el header/footer del tema mientras se ve esta sección. */
  hide: boolean;
}

export default function ProductInformationD(
  props: ProductInformationData & SectionProps,
) {
  const {
    ref,
    mediaLayout,
    gridSize,
    imageAspectRatio,
    showThumbnails,
    children = [],
    enableZoom,
    zoomTrigger,
    color,
    zoomButtonVisibility,
    viewerBg,
    showFrame,
    thumbsPerView,
    showThumbsNavigation,
    backLabel,
    hide,
    ...rest
  } = props;

  const { product, language } = useLoaderData<typeof productRouteLoader>();
  const t = translations[language] ?? translations["ES"];

  const [currentProduct, setCurrentProduct] = useState<CurrentProduct | null>(null);

  const setProduct = useCurrentProduct((state) => state.setProduct);
  const productStore = useCurrentProduct((state) => state.currentProduct);
  const setConfiguratorProduct = useProductConfiguratorD((state) => state.setProductId);
  const isMobile = useIsMobile(600);

  // Weaverse pinta las secciones 100% en cliente: sin este mínimo el esqueleto
  // se sustituiría en el mismo frame de montaje y nunca llegaría a verse.
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);
  useEffect(() => {
    setMinLoadingTimePassed(false);
    const id = setTimeout(() => setMinLoadingTimePassed(true), 400);
    return () => clearTimeout(id);
  }, [product?.id]);

  const restoreHeaderFooter = () => {
    const header = document.querySelector("header");
    const announcement = document.querySelector("#announcement-bar") as HTMLDivElement;
    const footer = document.querySelector("footer");
    if (header) header.style.display = "block";
    if (announcement) announcement.style.display = "flex";
    if (footer) footer.style.display = "block";
  };

  useEffect(() => {
    if (hide === false) return;
    if (document) {
      const header = document.querySelector("header");
      const announcement = document.querySelector("#announcement-bar") as HTMLDivElement;
      const footer = document.querySelector("footer");
      if (header) header.style.display = "none";
      if (announcement) announcement.style.display = "none";
      if (footer) footer.style.display = "none";
    }
    return () => {
      restoreHeaderFooter();
    };
  }, [hide]);

  // Id de producto con el que el store ya quedó sincronizado la última vez
  // que `product` (dato del loader, ligado a la URL) cambió de verdad — es
  // decir, en una navegación real. Solo se escribe dentro de este efecto, así
  // que durante el render sigue apuntando al id anterior hasta que el efecto
  // termina (correcto: un frame de esqueleto mientras carga la nueva ruta).
  // Los selectores que cambian de producto en cliente (material-finish-selector,
  // universe-selector…) tocan el store directamente sin navegar: `product` no
  // cambia, este efecto no se repite y la comparación sigue coincidiendo, así
  // que no vuelve a aparecer el esqueleto por eso.
  const syncedRouteProductId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const auxProd = createCurProVar(product);
    if (productStore?.id !== auxProd?.id) {
      setProduct(auxProd);
    }
    setCurrentProduct(auxProd);
    setConfiguratorProduct(auxProd?.id ?? null);
    syncedRouteProductId.current = product?.id;
  }, [product]);

  useEffect(() => {
    setCurrentProduct(productStore);
  }, [productStore]);

  // Reparte los hijos de Weaverse entre las dos zonas del boceto: la cabecera
  // va superpuesta al visor y el resto de selectores al panel derecho.
  const childInstances = useChildInstances();
  const viewerChildIds = childInstances
    .filter((instance: any) => VIEWER_CHILD_TYPES.includes(instance?.data?.type))
    .map((instance: any) => instance.data.id);

  const isViewerChild = (child: any) => viewerChildIds.includes(child?.props?.id);
  const childArray = Children.toArray(children);
  const viewerChildren = childArray.filter(isViewerChild);
  const panelChildren = childArray.filter((child) => !isViewerChild(child));

  // El metafield logo llega como referencia a Media (con previewImage), pero el
  // tipo compartido CurrentProduct lo declara como Image: se normaliza aqui.
  const viewerLogo = (currentProduct?.logo as MediaProduct | undefined)?.previewImage ?? null;

  // El store de zustand persiste entre navegaciones cliente-side, así que
  // comparamos contra el id de ruta ya sincronizado (no contra `productStore.id`
  // directamente) para no pintar el producto anterior tras una navegación real,
  // sin que eso dispare el esqueleto cuando un selector cambia de producto en
  // cliente (ver comentario de `syncedRouteProductId` más arriba).
  const isCurrentProductReady =
    minLoadingTimePassed && Boolean(productStore) && syncedRouteProductId.current === product?.id;

  return (
    <Section ref={ref} {...rest} className="md:h-[100dvh]" style={{ background: color }}>
      <div className="lg:flex grid grid-cols-1 md:h-[100vh] relative">
        <div className="relative flex-none w-full md:w-[65vw]">
          {isCurrentProductReady ? (
            <>
              <ProductViewer
                media={currentProduct?.media?.nodes || []}
                logo={viewerLogo}
                background={viewerBg || color}
                showFrame={showFrame}
                showThumbnails={showThumbnails}
                thumbsPerView={thumbsPerView}
                showThumbsNavigation={showThumbsNavigation}
              />
              {viewerChildren.length > 0 && (
                <div className="pointer-events-none absolute left-0 top-0  w-full [&_.drawer-panel]:pointer-events-auto [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_.review-stars]:pointer-events-auto">
                  {viewerChildren}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center px-8 py-16">
              <Skeleton className="h-[50vh] w-[60%] rounded-none bg-white/5" />
            </div>
          )}
        </div>

        <div
          data-lenis-prevent
          className="container-info relative w-full overflow-y-auto"
          style={{ background: color }}
        >
          <div
            className="fixed md:sticky top-0 left-0  w-full items-center"
            style={{
              padding: !isMobile ? ".5rem 1rem" : ".5rem .5rem",
              background: color,
              display:isMobile?"none":"flex",
              zIndex: 2,
            }}
          >
            <Link to={"/"} onClick={restoreHeaderFooter}>
              ← {backLabel || t.home} 
            </Link>
          </div>
          <div
            data-lenis-prevent
            style={{
              padding: !isMobile ? "1rem 1rem 0 1rem" : ".5rem .5rem 0 .5rem",
            }}
          >
            {isCurrentProductReady ? (
              panelChildren
            ) : (
              <div className="flex flex-col gap-6">
                <Skeleton className="h-4 w-24 rounded-none bg-white/5" />
                <Skeleton className="h-20 w-full rounded-none bg-white/5" />
                <Skeleton className="h-40 w-full rounded-none bg-white/5" />
                <Skeleton className="h-14 w-full rounded-none bg-white/5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "main-product-d",
  title: "Main product D",
  limit: 1,
  childTypes: [
    "product-name-header-d",
    "universe-selector-d",
    "size-selector-d",
    "material-finish-d",
    "accessories-selector-d",
    "add-to-cart-d",
    "heading",
    "subheading",
    "paragraph",
  ],
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "text",
          label: "className",
          name: "clName",
        },
        {
          type: "switch",
          label: "hide header",
          name: "hide",
          defaultValue: true,
        },
        {
          type: "color",
          label: "color",
          name: "color",
          defaultValue: "#050505",
        },
        {
          type: "text",
          label: "Texto de volver",
          name: "backLabel",
          helpText: "Si se deja vacío se usa la traducción por idioma.",
        },
      ],
    },
    {
      group: "Visor",
      inputs: [
        {
          type: "color",
          label: "Background del visor",
          name: "viewerBg",
          defaultValue: "#050505",
        },
        {
          type: "switch",
          label: "Marcas de esquina",
          name: "showFrame",
          defaultValue: true,
        },
        {
          type: "switch",
          label: "Mostrar miniaturas",
          name: "showThumbnails",
          defaultValue: true,
        },
        {
          type: "range",
          label: "Miniaturas visibles",
          name: "thumbsPerView",
          defaultValue: 5,
          configs: { min: 2, max: 8, step: 1 },
        },
        {
          type: "switch",
          label: "Flechas en las miniaturas",
          name: "showThumbsNavigation",
          defaultValue: true,
        },
      ],
    },
  ],
  presets: {
    children: [
      { type: "product-name-header-d" },
      { type: "size-selector-d" },
      { type: "material-finish-d" },
      { type: "accessories-selector-d" },
      { type: "add-to-cart-d" },
    ],
  },
});
