import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react"
import type { ProductQuery } from "storefront-api.generated";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { createCurProVar } from "~/routes/collections/utils";
import type { ProductNode, RequestVariant } from "~/sections/secret-main-product/variants-secret";
import { useCurrentProduct } from "~/stores/currentProduct";

interface tooltipProps{
  tooltipColor:string,
  tooltipBgColor:string,
  tooltipTSize:string,
  tooltipTWeight:string,
  tooltipSubTSize:string,
  tooltipSubTWeight:string
}

interface ProductCardProps{
  product:ProductNode;
  variante:RequestVariant;
  tooltipProps:tooltipProps;
}

interface ApiResponseProduct{
  result:ProductQuery
  ok:boolean;
  errorMessage?:string;
}

function ProductCardCollection(props:ProductCardProps){
  const { product,variante ,tooltipProps} = props;
  const[showToolTip,setShowToolTip] = useState(false);
  const container = useRef(null);
  const toolTip = useRef(null);
  const show = useRef(null);
  const [pos,setPos] = useState(false);
  const isSelected = useCurrentProduct(state=>state.currentProduct?.id===product.id);
  const setCurrent = useCurrentProduct(state=>state.setProduct);
  const getApiUrl = usePrefixPathWithLocale(`api/product-secret`);

  useGSAP(()=>{
    show.current = gsap.from(toolTip.current,{opacity:0,duration:0.5,display:"none",paused:true})
  },{scope:container.current})

  useEffect(()=>{
    if(showToolTip){
      let heigthPage = window.innerHeight * 0.6
      let containerPosition= container.current.getBoundingClientRect().y
      if(containerPosition > heigthPage){
        setPos(true)
      }else{
        setPos(false)
      }
      show.current.play()
    }else{
      show.current.reverse()
    }
  },[showToolTip])
  
  const setProduct = useCallback(async()=>{
    if (isSelected) return
    const startsUrl = window.location.href.split("products")[0] + "products/"
    const newUrl = startsUrl+product.handle
    const nextState = {additionalInformation:'Updated the URL with JS'}
    window.history.pushState(nextState,'',newUrl)
    window.history.replaceState(nextState,'',newUrl)

    try{
      const res = await fetch(getApiUrl,{
        method:"POST",
        body:JSON.stringify({handle:product.handle})
      })
      const data = await res.json() as ApiResponseProduct
      if(data.ok){
        const prod = createCurProVar(data.result)
        setCurrent(prod)
      }
    }catch(err){
      console.log("Error loading product:",err)
    }
    
  },[product.handle,isSelected,setCurrent,getApiUrl])

  return (
    <div ref={container} 
      className="relative cursor-pointer"
      onMouseEnter={()=>setShowToolTip((state)=>state == false && true)}
      onMouseLeave={()=>setShowToolTip((state)=>state == true && false)}
      onClick={setProduct}
      >
      <div
        data-testid="e2e-card-variant"
        className="relative track-variant-grid e2e-card-variant order-[9999] transition-discrete"
      >
        <div className="lg:hidden">
          <div className="w-full h-full">
            <div className="track-magnifier-icon"></div>
          </div>
        </div>
        <div className="absolute top-[-5px] left-[0] z-[2] w-full">
          <div className="flex">
            <div className="flex-1">
              <div className="flex flex-wrap e2e-section-status">
                <span className="uppercase flex gap-1 items-center justify-center w-fit   colour-text-on-colour-primary text-tag-sm p-[2px] lg:p-1 colour-tag-black  rounded-tl-[4px]  rounded-tr-[4px] rounded-br-[4px] ">
                  Nuevo
                </span>
              </div>
            </div>
          </div>
        </div>
        <div 
          className="flex border-solid rounded overflow-hidden aspect-3/4 relative cursor-pointer e2e-button-variant relative w-full h-full border  hover:border-[#A72A2F]  opacity-100"
          style={{
            borderColor:isSelected || showToolTip  ? "#3790b0": "#A1A1AA"
          }}
        >
          <div className="h-full w-full">
            <img
              loading="lazy"
              alt="Thumbnail of Secretlab TITAN Evo Secretlab for Automobili Lamborghini Pinnacle Superleggera"
              className="object-cover scale-200 top-[30%] absolute"
              src={product?.featuredImage?.url}
            />
          </div> 
        </div>
        <div 
          ref={toolTip} 
          className={`transition-discrete absolute w-full z-10 ${pos?"top-0 -translate-y-[110%]":"bottom-0 translate-y-[100%]"} `} >
          <div className="mt-2">
            <span className={`triangle absolute left-[50%] -translate-x-[50%] ${pos ? "bottom-0 translate-y-[90%]":"-translate-y-[90%]"} `}
              style={{
                width:0,
                height:0,
                borderLeft:"5px solid transparent",
                borderRight:"5px solid transparent",
                borderBottom:`6px solid ${tooltipProps.tooltipBgColor}`  ,
                rotate: pos && "180deg"
                
              }}
            ></span>
            <div 
              className=" text-center  rounded-lg"
              style={{
                backgroundColor:tooltipProps.tooltipBgColor
              }}
              >
              <div className="py-[8px] px-[16px] flex flex-col">
                <span 
                  style={{
                    color:tooltipProps.tooltipColor,
                    fontSize:tooltipProps.tooltipTSize,
                    fontWeight:tooltipProps.tooltipTWeight,
                  }}
                >
                  {product.nombre ? product.nombre.value : product.title}
                </span>
                <span 
                  style={{
                    color:tooltipProps.tooltipColor,
                    fontSize:tooltipProps.tooltipSubTSize,
                    fontWeight:tooltipProps.tooltipSubTWeight,
                  }}
                >
                  {product.tooltip && product.tooltip?.value}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCardCollection