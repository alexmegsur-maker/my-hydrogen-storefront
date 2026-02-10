import { createSchema } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { type ProductMediaProps} from "~/components/product/product-media";
import ProductMediaSecret from "~/components/product-secret/product-media-secret";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import type { loader as productRouteLoader } from "~/routes/products/product";
import { isCombinedListing } from "~/utils/combined-listings";
import "./secret-main-product.css"
import Dialog from "~/components/dialog";
import { useInfoSecret } from "~/stores/infoSecretStore";
import { useCurrentProduct } from "~/stores/currentProduct";
import { createCurProVar } from "~/routes/collections/utils";

interface ProductInformationData
  extends Omit<ProductMediaProps, "selectedVariant" | "media"> {
  ref: React.Ref<HTMLDivElement>;
}
type Imagen={
  url:string;
  altText:string|null;
  width?:number;
  height?:number;
}

export type MediaRequest ={
  id:string;
  image:Imagen;
  mediaContentType:string;
  previewImage:Imagen;
}
export type PageRequest ={
  id:string;
  body:HTMLElement;
}
type Images360 = {
  previewImage:Imagen;
}

export default function SecretProductInformation(
  props: ProductInformationData & SectionProps,
) {
  const {
    ref,
    mediaLayout,
    gridSize,
    imageAspectRatio,
    showThumbnails,
    children,
    enableZoom,
    zoomTrigger,
    zoomButtonVisibility,
    ...rest
  } = props;
  const { product } = useLoaderData<typeof productRouteLoader>();
  const [currentProduct,setCurrentProduct] = useState(null)
  const combinedListing = isCombinedListing(currentProduct);
  const [extraMedia,setExtraMedia] = useState([])
  const [logo,setLogo]=useState(null)
  const [page,setPage]=useState(null)
  const [videos,setVideos]=useState([])
  const[sizeDialog,setSizeDialog]= useState({x:300,y:300})
  const [isDialogOpen,setIsDialogOpen]=useState(false)

  const setInfoSecret = useInfoSecret((state)=>state.setComponents)
  const infoSecret = useInfoSecret((state)=>state.infoSecret)
  const updatePage=useInfoSecret((state)=>state.setUpdatePage)
  const setProduct= useCurrentProduct((state)=>state.setProduct)
  const productStore= useCurrentProduct((state)=>state.currentProduct)

  const handleLoad=(event)=>{
    const iframe= event.target;
    const style = document.createElement('style');
    
    style.textContent=`
      header{display:none}
      #announcement-bar{display:none}
      body::-webkit-scrollbar{
        background-color:transparent;
        width:0px;
      }
      body{opacity:1}
      footer{
        display:none
      }
    `
    if(iframe.contentDocument){
      iframe.contentDocument.head.appendChild(style)
    }
  } 

  useEffect(()=>{
    if(typeof window !=='undefined'){
      
      if(window.innerWidth){
        setSizeDialog({x:window.innerWidth*0.7,y:window.innerHeight*0.9})
      }
      const auxProd= createCurProVar(product)
      if(productStore?.id !== auxProd?.id){
        setProduct(auxProd)
      }
      setCurrentProduct(product)
    }

  },[product])

  useEffect(()=>{
    if(currentProduct){
      if(currentProduct.imagenes360){
        
        let imagenes = currentProduct.imagenes360?.references?.nodes || currentProduct.imagenes360 
        
        if(imagenes){
          setExtraMedia(imagenes)
        }
      }else{
        setExtraMedia(null)
      }
        
      if(currentProduct.logoMetafield){
        setLogo(currentProduct.logoMetafield.reference)
      }else{
        setLogo(null)
      }
        
      const pagina =currentProduct.pageMetafield || currentProduct.page 
      if(pagina){
        setPage(currentProduct.pageMetafield?.reference || currentProduct.page)
      }else{
        setPage(null)
      }

      const videosMetafield = currentProduct.videosMetafield 
      const listadoVideos = currentProduct.listVideos
      if(videosMetafield || listadoVideos){
        let listVideos = videosMetafield?.references?.nodes?.map((el)=> {return el.sources[0].url} ) as string[] || listadoVideos
        if(listVideos){
          setVideos(listVideos)
        }
      }else{
        setVideos([])
      }

      const newInfo = {
        title:currentProduct.title,
        handle:currentProduct.handle,
        description:currentProduct.description,
        showPage:page != null ? true:false,
        showPageFun:()=>setIsDialogOpen(true)
      }
      if(infoSecret?.handle !== newInfo.handle ){
        setInfoSecret(newInfo)
      }
    }
  },[currentProduct,page])

  useEffect(()=>{
    if(page){
      updatePage(true)
    }else{
      updatePage(false)
    }
  },[page])

  useEffect(()=>{
    if(productStore!=null){
      setCurrentProduct(productStore)
    }
  },[productStore])

  return (
    <Section ref={ref}  {...rest} overflow="unset" >
      <div className="lg:flex grid grid-cols-1 ">
        <ProductMediaSecret
          key = { currentProduct?.handle }
          media = {
            combinedListing && currentProduct?.featuredImage? [
              {
                __typename:"MediaImage",
                id:currentProduct.featuredImage.id,
                mediaContentType:"IMAGE",
                alt:currentProduct.featuredImage.altText,
                previewImage:currentProduct.featuredImage,
                image:currentProduct.featuredImage,
              },
              ...(currentProduct?.media?.nodes || []),
            ]: currentProduct?.media?.nodes || []
          }
          view360={extraMedia}
          logo={logo}
          mediaVideos={videos}
          />
        <div className="relative">
          {children}
        </div>
      </div>
      {
        page &&
        <Dialog 
          className="dialog-iframe opacity-0"
          show={isDialogOpen}
          onClose={()=>setIsDialogOpen(false)}
          >
          <iframe 
            id={page.id}
            className="rounded"
            src={`/pages/${page.onlineStoreUrl.split("pages/")[1]}`}
            width={sizeDialog.x}
            height={sizeDialog.y}
            onLoad={handleLoad}
            >
          </iframe>
        </Dialog>
      }
    </Section>
  );
}

export const schema = createSchema({
  type: "secret-product",
  title: "Main product secret",
  childTypes: [
    "mp--breadcrumb",
    "mp--badges",
    "mp--vendor",
    "mp--title",
    "mp--prices",
    "judgeme-stars-rating",
    "mp--summary",
    "mp--bundled-variants",
    "mp--variant-selector",
    "mp--quantity-selector",
    "mp--atc-buttons",
    "mp--collapsible-details",
    "secret-info",
    "variant-secret",
    "price-section",
    "crosssell"
  ],
  limit: 1,
  enabledOn: {
    pages: ["PRODUCT"],
  },
  settings: [
    { group: "Layout", inputs: layoutInputs },
    {
      group: "Product Media",
      inputs: [
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Aspect ratio",
          defaultValue: "adapt",
          configs: {
            options: [
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
            ],
          },
        },
        {
          type: "toggle-group",
          name: "mediaLayout",
          label: "Layout",
          configs: {
            options: [
              {
                label: "Grid",
                value: "grid",
                icon: "grid-2x2",
              },
              {
                label: "Slider",
                value: "slider",
                icon: "slideshow-outline",
              },
            ],
          },
          defaultValue: "grid",
        },
        {
          type: "select",
          name: "gridSize",
          label: "Grid size",
          defaultValue: "2x2",
          configs: {
            options: [
              { label: "1x1", value: "1x1" },
              { label: "2x2", value: "2x2" },
              { label: "Mix", value: "mix" },
            ],
          },
          condition: (data: ProductInformationData) =>
            data.mediaLayout === "grid",
        },
        {
          label: "Show thumbnails",
          name: "showThumbnails",
          type: "switch",
          defaultValue: true,
          condition: (data: ProductInformationData) =>
            data.mediaLayout === "slider",
        },
        {
          label: "Enable zoom",
          name: "enableZoom",
          type: "switch",
          defaultValue: true,
        },
        {
          type: "select",
          name: "zoomTrigger",
          label: "Zoom trigger",
          defaultValue: "both",
          configs: {
            options: [
              { value: "image", label: "Click on image" },
              { value: "button", label: "Click on zoom button" },
              { value: "both", label: "Both" },
            ],
          },
          condition: (data: ProductInformationData) => data.enableZoom === true,
        },
        {
          type: "select",
          name: "zoomButtonVisibility",
          label: "When to show zoom button",
          defaultValue: "hover",
          configs: {
            options: [
              { value: "always", label: "Always" },
              { value: "hover", label: "On hover" },
            ],
          },
          condition: (data: ProductInformationData) =>
            data.enableZoom === true &&
            (data.zoomTrigger === "button" || data.zoomTrigger === "both"),
        },
      ],
    },
  ],
  presets: {
    mediaLayout: "grid",
    gridSize: "2x2",
    children: [
      {
        type: "mp--breadcrumb",
        homeText: "Home",
      },
      {
        type: "mp--badges",
      },
      {
        type: "mp--vendor",
      },
      {
        type: "mp--title",
        headingTag: "h1",
      },
      {
        type: "mp--prices",
        showCompareAtPrice: true,
      },
      {
        type: "judgeme-stars-rating",
      },
      {
        type: "mp--summary",
      },
      {
        type: "mp--bundled-variants",
        headingText: "Bundled Products",
        headingClassName: "text-2xl",
      },
      {
        type: "mp--variant-selector",
      },
      {
        type: "mp--quantity-selector",
      },
      {
        type: "mp--atc-buttons",
        addToCartText: "Add to cart",
        addBundleToCartText: "Add bundle to cart",
        soldOutText: "Sold out",
        showShopPayButton: true,
        buttonClassName: "w-full uppercase",
      },
      {
        type: "mp--collapsible-details",
        showShippingPolicy: true,
        showRefundPolicy: true,
      },
    ],
  },
});
