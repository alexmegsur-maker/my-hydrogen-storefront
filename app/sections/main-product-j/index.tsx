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

interface ProductInformationData
  extends Omit<ProductMediaProps, "selectedVariant" | "media"> {
  ref: React.Ref<HTMLDivElement>;
  color:string;
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

  const {product} = useLoaderData<typeof productRouteLoader>()
  const [currentProduct,setCurrentProduct] = useState(null)

  const setProduct= useCurrentProduct((state)=>state.setProduct)
  const productStore = useCurrentProduct((state)=>state.currentProduct)
  const isMobile = useIsMobile(600);
  const restoreHeaderFooter=()=>{
      const header = document.querySelector("header")
      const anuncement = document.querySelector("#announcement-bar") as HTMLDivElement
      const footer = document.querySelector("footer")
      header.style.display="block"
      anuncement.style.display="block"
      footer.style.display="block"
  }
  
  useEffect(()=>{
    if(document){
      const header = document.querySelector("header")
      const anuncement = document.querySelector("#announcement-bar") as HTMLDivElement
      const footer = document.querySelector("footer")
      header.style.display="none"
      anuncement.style.display="none"
      footer.style.display="none"
    }

  },[])
 
  useEffect(()=>{
    const auxProd = createCurProVar(product)
    if(productStore?.id !== auxProd?.id){
      setProduct(auxProd)
    }
    setCurrentProduct(auxProd)
    console.log(product)
  },[product])

  
  useEffect(()=>{
    setCurrentProduct(productStore)
  },[productStore])

if(productStore){
  return(
    <Section  ref={ref} {...rest}  className="md:h-[100dvh] "
    style={{background:color}}>
      <div className="lg:flex grid grid-cols-1 md:h-[100vh] relative " >
        <ProductMedia 
          media={currentProduct?.media?.nodes || []}
          view360={currentProduct?.imagenes360 || []}
          logo={currentProduct?.logo?.previewImage || null}
          mediaVideos={currentProduct?.listVideos || []}
          principalImg= {currentProduct?.principalImg?.previewImage || null}
        />
        <div 
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
            <Link to={"/"} onClick={ restoreHeaderFooter}>← Inicio</Link>
          </div>
          <div
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
return <Section {...rest}></Section>
}

export const schema = createSchema({
  type:"j-product",
  title:"Main product J",
  childTypes:[
    "head-info",
    "reserva-bar",
    "selector-variant",
    "filter-step",
    "crossell-productJ",
    "buy-buttons-productJ",
    "variant-secret",
    "selector-variant-secret",
    
  ],
  limit:1,
  settings:[
    {
      group:"General",
      inputs:[
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