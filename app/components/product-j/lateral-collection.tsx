import { useGSAP } from "@gsap/react";
import type { HydrogenComponentProps } from "@weaverse/hydrogen"
import gsap from "gsap";
import type React from "react";
import { useEffect, useRef, type CSSProperties } from "react";
import { selectorPaddingMargin } from "~/utils/general";

interface LateralCollectionProps extends Partial<Omit<HydrogenComponentProps, "children">> {
  title:string,
  confirmBtn?:boolean;
  show:boolean;
  close:()=>void;
  sendProduct?:()=>void;
  children?:React.ReactNode;
  style?:CSSProperties;
  estilos?:CSSProperties;
  buttonText?:string;
}

export default function  LateralCollection (props:LateralCollectionProps){
  const {title,children,style,confirmBtn,show,close,sendProduct,estilos,buttonText} = props
  const container =useRef(null)
  const open =useRef(null)
  useGSAP(()=>{
    open.current= gsap.from(container.current,{
      transform:"translateX(150%)",
      duration:0.6,
      transition:"ease",
      paused:true,
    })
  },{scope:container})
  
  useEffect(()=>{
    if(show){
      open.current?.play()
      document.querySelector(".container-info").classList.add("hide-all-bar")
    }else{
      open.current?.reverse()
      document.querySelector(".container-info").classList.remove("hide-all-bar")
    }
  },[show])
  
  const closeDrawer=()=>{
    close()
  }

  const confirmSelection=()=>{
    sendProduct()
    close()
  }

  return(
    <div 
      ref={container}
      className="drawer-panel fixed  top-0 right-0 w-[100%] md:w-[35%] h-full z-[20]" 
      id="universe-drawer"
      style={{
        ...style,
        transition:"transform 0.6s cubic-bezier (0.19,1,0.22,1) "
      }}
    >
      <div id="view-origin" className="drawer-view relative flex flex-col h-full w-full">
        <div 
          className="top-nav-sticky sticky flex items-center justify-between top-0 left-0 w-full backdrop-blur-md z-[15]"
          style={{
            backgroundColor:"#050505f2",
            padding: window.innerWidth>600?"1.5rem 4rem":"1.5rem",
            borderBottom:"1px solid #ffffff08"
          }}
          >
          <button
            className="back-btn-right flex items-center gap-[8px]" 
            onClick={closeDrawer}
            style={{
              
              fontFamily:estilos ? estilos["--brFamily"]:"Montserrat",
              fontSize:estilos ? estilos["--brSize"]:"12px",
              fontWeight:estilos ? estilos["--brWeight"]:"600",
              textTransform:estilos && estilos["--brUpper"] ?"uppercase":"unset",
              letterSpacing:estilos && estilos["--brLetter"]>0 ?`${estilos["--brLetter"]}px`:"normal",
              color:estilos?estilos["--brColor"]:"#52525A",
              ...selectorPaddingMargin("padding",estilos &&estilos["--brPaddingSelect"],estilos &&estilos["--brPaddingText"]),
              ...selectorPaddingMargin("margin",estilos &&estilos["--brMarginSelect"],estilos &&estilos["--brMarginText"]),
              transition:"color 0.3s ease"
            }}
            >
            ← Atrás
          </button>
            <span 
              className="drawer-nav-title"
              style={{
                fontFamily:estilos ? estilos["--ntFamily"]:"Montserrat",
                fontSize:estilos?estilos["--ntSize"]:"0.75rem",
                fontWeight:estilos?estilos["--ntWeight"]:"600",
                textTransform:estilos && estilos["--ntUpper"] ?"uppercase":"unset",
                letterSpacing:estilos && estilos["--ntLetter"]>0 ?`${estilos["--ntLetter"]}px`:"normal",
                color:estilos ?estilos["--ntColor"]:"#fff",
                ...selectorPaddingMargin("padding",estilos && estilos["--ntPaddingSelect"],estilos && estilos["--ntPaddingText"]),
                ...selectorPaddingMargin("margin",estilos && estilos["--ntMarginSelect"],estilos && estilos["--ntMarginText"]),
              
              }}
              >
              {title}
            </span>
          <div style={{width: "60px"}}></div>
        </div>
        <div className=" content-drawer-panel flex-grow  overflow-y-auto relative"> 
          {children}
        </div>
        {confirmBtn && 
          <div 
            className="drawer-cta-wrapper sticky bottom-0 left-0 w-full z-[15] "
            style={{
              background:"#050505",
              borderTop:"1px solid #ffffff05",
              padding:"2rem 4rem", 
            }}
            >
            <button 
              className="cta-button cursor-pointer flex justify-center items-center gap-[15px]" 
              onClick={confirmSelection}
              style={{
                width:"100%",
                border:"none",
                transition:"all 0.4s ease",
                backgroundColor:estilos['--lbBgColor'],
                color:estilos['--lbColor'],
                borderRadius:estilos['--lbRadius'],
                ...selectorPaddingMargin("padding",estilos['--lbPaddingSelect'],estilos['--lbPaddingText']),
                fontFamily:estilos['--lbFamily'],
                fontSize:estilos['--lbSize'],
                fontWeight:estilos['--lbWeight'],
                 textTransform:estilos["--lbUpper"] ?"uppercase":"unset",
                letterSpacing:estilos["--lbLetter"]>0 ?`${estilos["--lbLetter"]}px`:"normal",
              }}
              >
              <span>{buttonText? buttonText:"Confirmar Selección"}</span>
            </button>
          </div>
        }
      </div>

    </div>
  )
}