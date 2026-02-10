import { useRef} from "react"
import gsap from "gsap"
import {useGSAP}from "@gsap/react"
import type { SectionProps } from "../section";
import { selectorPaddingMargin } from "~/utils/general";

interface estiloProps{
  defNavBgColor:string,
  defNavColor:string,
  defNavSize:string,
  defNavFamily:string,
  defButtonColor:string,
  defButtonBgColor:string,
  defButtonSize:string,
  defButtonFamily:string,
  defButtonPaddingSelect:string,
  defButtonPaddingText:string,
  defButtonMarginSelect:string,
  defButtonMarginText:string,
  defButtonWeight:string,
}

interface  lateralPopupProps extends SectionProps {
  active:boolean;
  widthSize?:number;
  setActive:()=>void;
  title:string;
  estilo:estiloProps;
}

function LateralPopup(props:lateralPopupProps){

  const {widthSize, setActive, title, estilo,children}=props
  
  const container =useRef(null)
  const content =useRef(null)
  const show =useRef(null)

  gsap.registerPlugin(useGSAP)
  useGSAP(()=>{
    show.current = gsap.from(content.current,{
      opacity:0,
      x:"100%",
      duration:1,
      onReverseComplete:()=>{
        setActive()
      }
    })
    show.current.play()
    
  },{scope:container})

  const closePopup=()=>{
    if(show.current){
      show.current.reverse()
    }
  }

  return(
    <div  
      ref={container} 
      className="LateralPopup fixed h-full top-0 right-0 z-10"
      style={{width:`${widthSize}px`}}
    >
      <nav ref={content} className="bg-white h-full">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="sticky top-0 z-10">
              <div className="bg-black  flex text-white relative"
                style={{
                  backgroundColor:estilo.defNavBgColor
                }}
              >
                <div
                  onClick={closePopup}
                  className="flex-none cursor-pointer flex flex-row flex-nowrap py-4 pe-4 items-center"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24.4355 9.6001L14.0008 20.0349L24.4355 30.4697"
                      stroke={estilo.defNavColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>

                  <div 
                    className="flex-none font-bold flex-1  me-[30px] flex items-center"
                    style={{
                      color:estilo.defNavColor,
                      fontSize:estilo.defNavSize,
                      fontFamily:estilo.defNavFamily,
                    }}
                    >
                    {title}
                  </div>
                </div>
              </div>
            </div>
            {children}
          </div>
          <div className="flex-none e2e-section-variant-info">
            
            <div className="px-4 pb-4 bg-[#F2F2F2]">
              <button
                onClick={closePopup}
                className="flex gap-2 items-center justify-center text-center p-5 uppercase text-white text-cta-small font-bold w-full border-none e2e-button-confirm-selection sticky bottom-0 z-10 cursor-pointer bg-[#710c10] hover:colour-buttons-primary-hover rounded e2e-button-confirm-selection"
                style={{
                  color:estilo.defButtonColor,
                  backgroundColor:estilo.defButtonBgColor,
                  fontSize:estilo.defButtonSize,
                  fontFamily:estilo.defButtonFamily,
                  fontWeight:estilo.defButtonWeight,
                  ...selectorPaddingMargin("padding",estilo.defButtonPaddingSelect,estilo.defButtonPaddingText),
                  ...selectorPaddingMargin("margin",estilo.defButtonMarginSelect,estilo.defButtonMarginText),
                }}
              >
                Confirmar selección
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
export default LateralPopup