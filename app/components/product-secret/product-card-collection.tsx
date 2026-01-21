import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react"
import type { ProductNode, RequestVariant } from "~/sections/secret-main-product/variants-secret";
import { useCurrentProduct } from "~/stores/currentProduct";

interface ProductCardProps{
  producto:ProductNode;
  variante:RequestVariant;
}

function ProductCardCollection(props:ProductCardProps){
  const {producto,variante }=props
  const[showToolTip,setShowToolTip] = useState(false)
  const container=useRef(null)
  const toolTip=useRef(null)
  const show = useRef(null)
  const border = useRef(null)
  const [pos,setPos]=useState(false)
  const currentProd= useCurrentProduct(state=>state.currentProduct)

  useGSAP(()=>{
    show.current = gsap.from(toolTip.current,{opacity:0,duration:0.5,display:"none"})
    if(currentProd.id === producto.id){
      gsap.to(border.current,{
        borderColor:"#3790b0"
      })
    }
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
      console.log("heigthPage:",heigthPage,"- containePosition:",containerPosition)
      show.current.play()
    }else{
      show.current.reverse()
    }
  },[showToolTip])
  

  return (
    <div ref={container} 
      className="relative"
      onMouseEnter={()=>setShowToolTip((state)=>state == false && true)}
      onMouseLeave={()=>setShowToolTip((state)=>state == true && false)}
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
          ref={border}
          id="chair-M07-E24DI-ATLMP1R"
          data-testid="e2e-button-variant-2"
          className="flex border-solid rounded overflow-hidden aspect-3/4 relative cursor-pointer e2e-button-variant relative w-full h-full border border-[#A1A1AA] hover:border-[#A72A2F]  opacity-100"
          data-sku="M07-E24DI-ATLMP1R"
          data-state="closed"
        >
          <div className="h-full w-full">
            <img
              loading="lazy"
              alt="Thumbnail of Secretlab TITAN Evo Secretlab for Automobili Lamborghini Pinnacle Superleggera"
              className="object-cover scale-200 top-[30%] absolute"
              src={producto.featuredImage.url}
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
                borderBottom:"6px solid black",
                rotate: pos && "180deg"
                
              }}
            ></span>
            <div className="bg-black text-center  rounded-lg">
              <div className="py-[8px] px-[16px] flex flex-col text-white">
                <span className="text-[14px] font-bold">
                  {variante.nombre ? variante.nombre.value:producto.title}
                </span>
                <span className="text-[14px]">
                  {variante.tooltip && variante.tooltip.value}
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