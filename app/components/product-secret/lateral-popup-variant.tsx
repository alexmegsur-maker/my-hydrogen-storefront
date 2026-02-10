import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import {useGSAP}from "@gsap/react"
import type { SectionProps } from "../section";
import { useCurrentProduct } from "~/stores/currentProduct";
import { checkPrice } from "~/utils/product";
import { selectorPaddingMargin } from "~/utils/general";

interface LateralPopProp {
  navBgColor:string,
  navColor:string,
  navSize:string,
  navFamily:string,
  sProdTColor:string,
  sProdTSize:string,
  sProdTFamily:string,
  sProdTPaddingSelect:string,
  sProdTPaddingText:string,
  sProdTMarginSelect:string,
  sProdTMarginText:string,
  sProdTWeight:string,
  sProdSubTColor:string,
  sProdSubTSize:string,
  sProdSubTFamily:string,
  sProdSubTPaddingSelect:string,
  sProdSubTPaddingText:string,
  sProdSubTMarginSelect:string,
  sProdSubTMarginText:string,
  sProdSubTWeight:string,
  sProdPriceColor:string,
  sProdPriceSize:string,
  sProdPriceFamily:string,
  sProdPricePaddingSelect:string,
  sProdPricePaddingText:string,
  sProdPriceMarginSelect:string,
  sProdPriceMarginText:string,
  sProdPriceWeight:string,
  buttonColor:string,
  buttonBgColor:string,
  buttonSize:string,
  buttonFamily:string,
  buttonPaddingSelect:string,
  buttonPaddingText:string,
  buttonMarginSelect:string,
  buttonMarginText:string,
  buttonWeight:string
}

interface  lateralPopupProps extends SectionProps {
  active:boolean;
  widthSize?:number;
  setActive:()=>void;
  title:string;
  lateralProps: LateralPopProp;
}

function LateralPopupVariant(props:lateralPopupProps){

  const {active, widthSize, title, setActive, lateralProps, children}=props

  let currentProd = useCurrentProduct(state=>state.currentProduct)
  const [variant,setVariant]=useState({nombre:"",tooltip:"",price:""})  
  
  const container =useRef(null)
  const content =useRef(null)
  const show =useRef(null)

  useEffect(()=>{

    if(currentProd){
      setVariant({
        nombre:currentProd.nombre,
        tooltip:currentProd.variants.nodes[0].tooltip?.value,
        price:currentProd.selectedVariant.price.amount
      })
    }

  },[currentProd])

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
              <div 
                className="relative"
                style={{
                  backgroundColor:lateralProps.navBgColor,
                  color:lateralProps.navColor
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
                      stroke={lateralProps.navColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>

                  <div 
                    className="flex-none font-bold flex-1  me-[30px] flex items-center"
                    style={{
                      fontSize:lateralProps.navSize,
                      fontFamily:lateralProps.navFamily,
                    }}
                  >
                    {title}
                  </div>
                </div>

                <div className="flex-1"></div>

                {/* <div className="p-4">
                  <div className="layout-style flex items-center justify-center rounded-[4px] h-[36px] bg-[#fff]">
                    <span
                      data-context="pdp-grid-style"
                      className="cursor-pointer border border-solid p-[7px] rounded-tl-[4px] rounded-bl-[4px] flex justify-center items-center bg-[#fff] track-grid-style"
                    >
                      <span
                        data-context="pdp-grid-style"
                        className="[&amp;_*]:pointer-events-none"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="6"
                            height="6"
                            rx="1"
                            fill="#A72A2F"
                          ></rect>

                          <rect
                            x="11"
                            y="3"
                            width="6"
                            height="6"
                            rx="1"
                            fill="#A72A2F"
                          ></rect>

                          <rect
                            x="3"
                            y="11"
                            width="6"
                            height="6"
                            rx="1"
                            fill="#A72A2F"
                          ></rect>

                          <rect
                            x="11"
                            y="11"
                            width="6"
                            height="6"
                            rx="1"
                            fill="#A72A2F"
                          ></rect>
                        </svg>
                      </span>
                    </span>

                    <span
                      data-context="pdp-listyle"
                      className="cursor-pointer border border-solid p-[7px] rounded-tr-[4px] rounded-br-[4px] flex justify-center items-center bg-[#000] track-grid-style"
                    >
                      <span
                        data-context="pdp-listyle"
                        className="[&amp;_*]:pointer-events-none"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="2"
                            cy="6"
                            r="1"
                            fill="#fff"
                          ></circle>

                          <path
                            d="M5.33337 5.99984C5.33337 5.5396 5.70647 5.1665 6.16671 5.1665H19C19.4603 5.1665 19.8334 5.5396 19.8334 5.99984C19.8334 6.46007 19.4603 6.83317 19 6.83317H6.16671C5.70647 6.83317 5.33337 6.46007 5.33337 5.99984Z"
                            fill="#fff"
                          ></path>

                          <circle
                            cx="2"
                            cy="10.6665"
                            r="1"
                            fill="#fff"
                          ></circle>

                          <path
                            d="M5.33337 10.6663C5.33337 10.2061 5.70647 9.83301 6.16671 9.83301H19C19.4603 9.83301 19.8334 10.2061 19.8334 10.6663C19.8334 11.1266 19.4603 11.4997 19 11.4997H6.16671C5.70647 11.4997 5.33337 11.1266 5.33337 10.6663Z"
                            fill="#fff"
                          ></path>

                          <circle
                            cx="2"
                            cy="15.3335"
                            r="1"
                            fill="#fff"
                          ></circle>

                          <path
                            d="M5.33337 15.3333C5.33337 14.8731 5.70647 14.5 6.16671 14.5H19C19.4603 14.5 19.8334 14.8731 19.8334 15.3333C19.8334 15.7936 19.4603 16.1667 19 16.1667H6.16671C5.70647 16.1667 5.33337 15.7936 5.33337 15.3333Z"
                            fill="#fff"
                          ></path>
                        </svg>
                      </span>
                    </span>
                  </div>
                </div> */}
              </div>
            </div>
            {children}
          </div>
          <div className="flex-none e2e-section-variant-info">
            <div className="bg-[#F2F2F2]">
              <div className="items-end flex p-4 border-l-0 border-t border-r-0 border-b-0 border-solid bg-[#F2F2F2] border-sl-color-greyscale-500">
                <div className="flex-1">
                  <div className="flex gap-1">
                    <div className="flex gap-1 flex-wrap e2e-section-status"></div>
                  </div>
                  <div className="flex items-center">
                    <div 
                      className="subheading-1 flex-wrap"
                      style={{
                        color:lateralProps.sProdTColor,
                        fontSize:lateralProps.sProdTSize,
                        fontFamily:lateralProps.sProdTFamily,
                        ...selectorPaddingMargin("padding",lateralProps.sProdTPaddingSelect,lateralProps.sProdTPaddingText),
                        ...selectorPaddingMargin("margin",lateralProps.sProdTMarginSelect,lateralProps.sProdTMarginText),
                        fontWeight:lateralProps.sProdTWeight
                        
                      }}
                      >
                      {variant.nombre || currentProd?.title}
                    </div>
                  </div>
                  <div 
                    className="subheading-3 text-[#71717A]"
                    style={{
                        color:lateralProps.sProdSubTColor,
                        fontSize:lateralProps.sProdSubTSize,
                        fontFamily:lateralProps.sProdSubTFamily,
                        ...selectorPaddingMargin("padding",lateralProps.sProdSubTPaddingSelect,lateralProps.sProdSubTPaddingText),
                        ...selectorPaddingMargin("margin",lateralProps.sProdSubTMarginSelect,lateralProps.sProdSubTMarginText),
                        fontWeight:lateralProps.sProdSubTWeight
                    }}
                  >
                    {variant.tooltip}
                  </div>
                </div>
                <div className="flex-none items-end justify-end">
                  <div className="subheading-2 text-right flex-row flex gap-2">
                    <span 
                      style={{
                        color:lateralProps.sProdPriceColor,
                        fontSize:lateralProps.sProdPriceSize,
                        fontFamily:lateralProps.sProdPriceFamily,
                        ...selectorPaddingMargin("padding",lateralProps.sProdPricePaddingSelect,lateralProps.sProdPricePaddingText),
                        ...selectorPaddingMargin("margin",lateralProps.sProdPriceMarginSelect,lateralProps.sProdPriceMarginText),
                        fontWeight:lateralProps.sProdPriceWeight,
                      }}
                    >
                      Desde { checkPrice(variant.price) } €
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 bg-[#F2F2F2]">
              <button
                onClick={closePopup}
                className="flex gap-2 items-center justify-center text-center p-5 uppercase  font-bold w-full border-none sticky bottom-0 z-10 cursor-pointer  hover:opacity-80 rounded"
                style={{
                  backgroundColor:lateralProps.buttonBgColor,
                  color:lateralProps.buttonColor,
                  fontSize:lateralProps.buttonSize,
                  fontFamily:lateralProps.buttonFamily,
                  ...selectorPaddingMargin("padding",lateralProps.buttonPaddingSelect,lateralProps.buttonPaddingText),
                  ...selectorPaddingMargin("margin",lateralProps.buttonMarginSelect,lateralProps.buttonMarginText),
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
export default LateralPopupVariant