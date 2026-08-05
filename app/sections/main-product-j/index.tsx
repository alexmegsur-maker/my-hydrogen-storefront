import { createSchema } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import ProductMedia from "~/components/product-j/product-media";
import ProductMediaSecret from "~/components/product-secret/product-media-secret";
import type { ProductMediaProps } from "~/components/product/product-media";
import { GlobalLoading } from "~/components/root/global-loading";
import { Section, type SectionProps } from "~/components/section";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { createCurProVar } from "~/routes/collections/utils";
import  type {loader as productRouteLoader} from "~/routes/products/product";
import { useCurrentProduct } from "~/stores/currentProduct";
import "~/styles/product-j.css"
import { translations } from "~/utils/translations";
import { BuyButtonsSkeleton, CrossellSkeleton, FilterOptionSizeSkeleton, HeadSkeleton, ProductMediaSkeleton, VariantSelectorSecretSkeleton } from "./skeletons";

interface ProductInformationData
  extends Omit<ProductMediaProps, "selectedVariant" | "media"> {
  ref: React.Ref<HTMLDivElement>;
  color:string;
  clName?:string;
}

export default function ProductInformationJ(props:ProductInformationData &SectionProps){
  const {
    ref,
    mediaLayout,
    gridSize,
    imageAspectRatio,
    showThumbnails,
    children,
    enableZoom,
    zoomTrigger,
    color,
    zoomButtonVisibility,
    ...rest
  }=props;

  const {product,language} = useLoaderData<typeof productRouteLoader>()
  const t = translations[language]??translations["ES"]
  
  const [currentProduct,setCurrentProduct] = useState(null)

  const setProduct= useCurrentProduct((state)=>state.setProduct)
  const productStore = useCurrentProduct((state)=>state.currentProduct)
  const isMobile = useIsMobile(600);

  // Todas las secciones de Weaverse se pintan 100% en cliente (no hay SSR de
  // contenido) — sin este mínimo, el esqueleto se sustituye por el contenido
  // real en el mismo frame de montaje y nunca llega a verse.
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);
  useEffect(() => {
    // Se reinicia por cada producto (misma instancia de componente al
    // navegar entre productos, React no la desmonta) para que el esqueleto
    // vuelva a mostrarse en cada navegación, no solo en el montaje inicial.
    setMinLoadingTimePassed(false);
    const id = setTimeout(() => setMinLoadingTimePassed(true), 400);
    return () => clearTimeout(id);
  }, [product?.id]);
  const restoreHeaderFooter=()=>{
      const header = document.querySelector("header")
      const announcement = document.querySelector("#announcement-bar") as HTMLDivElement
      const footer = document.querySelector("footer")
      if (header) header.style.display="block"
      if (announcement) announcement.style.display="flex"
      if (footer) footer.style.display="block"
  }
  
  useEffect(()=>{
    if(document){
      const header = document.querySelector("header")
      const announcement = document.querySelector("#announcement-bar") as HTMLDivElement
      const footer = document.querySelector("footer")
      if (header) header.style.display="none"
      if (announcement) announcement.style.display="none"
      if (footer) footer.style.display="none"
    }
    return ()=>{
      restoreHeaderFooter();
    }

  },[])
 
  useEffect(()=>{
    const auxProd = createCurProVar(product)
    if(productStore?.id !== auxProd?.id){
      setProduct(auxProd)
    }
    setCurrentProduct(auxProd)
  },[product])

  
  useEffect(()=>{
    setCurrentProduct(productStore)
  },[productStore])

// El store de zustand persiste entre navegaciones cliente-side (no se
// resetea al cambiar de producto). Si solo comprobáramos `productStore`
// (truthy), al navegar a otro producto se vería un flash con los datos del
// producto ANTERIOR hasta que el efecto de arriba lo actualice. Comparando
// el id contra el `product` del loader (ya resuelto para la ruta actual)
// nos aseguramos de mostrar el esqueleto mientras llega el producto correcto.
const isCurrentProductReady = minLoadingTimePassed && productStore && productStore.id === product?.id;

if(isCurrentProductReady){
  return(
    <Section  ref={ref} {...rest}  className="md:h-[100dvh] "
    style={{background:color}}>
      <div className="lg:flex grid grid-cols-1 md:h-[100vh] relative " >
        <ProductMedia 
          media={currentProduct?.media?.nodes || []}
          view360={currentProduct?.imagenes360 || []}
          logo={currentProduct?.logo?.previewImage || null}
          mediaVideos={currentProduct?.listVideos || []}
        />
        <div 
          data-lenis-prevent
          className="container-info relative w-full overflow-y-auto"
          style={{
            background:color
          }}
        >
          <div 
            className=" fixed md:sticky top-0 left-0 flex w-full items-center"
            style={{
              padding: !isMobile ?"1.5rem 4rem":"1.5rem 2rem",
              borderBottom:"1px solid #ffffff08",
              background:color,
              zIndex:10
            }}
          >
            <Link to={"/"} onClick={ restoreHeaderFooter}>← {t.home}</Link>
          </div>
          <div data-lenis-prevent
            style={{ 
              padding:!isMobile ? "3rem 4rem 0 4rem":"1.5rem 1.5rem 0 1.5rem"
            }}>
            {children}
          </div>
        </div>
      </div>
    </Section>
  )
}
  // ── Loading skeleton ──────────────────────────────────────────────────────
  // Se muestra mientras `productStore` (zustand) todavía no está listo.
  // Las piezas (HeadSkeleton, …) se van añadiendo a medida que se define cada
  // sección — ver app/sections/main-product-j/skeletons.tsx.
  return (
    <Section ref={ref} {...rest} className="md:h-[100dvh]" style={{ background: color }}>
      <div className="lg:flex grid grid-cols-1 md:h-[100vh] relative">
        <ProductMediaSkeleton />
        <div
          className="container-info relative w-full overflow-y-auto"
          style={{ background: color }}
        >
          <div
            className="fixed md:sticky top-0 left-0 flex w-full items-center"
            style={{
              padding: !isMobile ? "1.5rem 4rem" : "1.5rem 2rem",
              borderBottom: "1px solid #ffffff08",
              background: color,
              zIndex: 10,
            }}
          >
            <Link to={"/"} onClick={restoreHeaderFooter}>← {t.home}</Link>
          </div>
          <div
            style={{
              padding: !isMobile ? "3rem 4rem 0 4rem" : "1.5rem 1.5rem 0 1.5rem",
            }}
          >
            <div className="flex flex-col gap-8">
              <HeadSkeleton />
              <FilterOptionSizeSkeleton rows={2} />
              <VariantSelectorSecretSkeleton />
              <CrossellSkeleton rows={3} />
              <BuyButtonsSkeleton />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export const schema = createSchema({
  type:"j-product",
  title:"Main product J",
  childTypes:[
    "heading",
    "subheading",
    "paragraph",
    "faq-item",
    "head-info",
    "reserva-bar",
    "selector-variant",
    "filter-step",
    "crossell-productJ",
    "buy-buttons-productJ",
    "variant-secret",
    "selector-variant-secret",
    "variant-by-product",
    "product-software-download"
  ],
  limit:1,
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'text',
          label:'className',
          name:'clName',
        },
        {
          type:'switch',
          label:'hide header',
          name:'hide',
          defaultValue:true,
        },
        {
          type:'color',
          label:'color',
          name:'color',
          defaultValue:'#050505',
        },
      ]
    }
  ]
})