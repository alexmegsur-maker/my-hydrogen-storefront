import Dialog  from "~/components/dialog";
import React, { useEffect, useState } from "react";
import Link from "~/components/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { checkPrice } from "~/utils/product";
import { useCrossell } from "~/stores/crosssellStore";
import "~/styles/modal-crossell.css"
import { selectorPaddingMargin, truncate } from "~/utils/general";

interface modalProps{
  tColor:string;
  tSize:string;
  tFamily:string;
  tpaddingSelect:string;
  tpaddingText:string;
  tmarginSelect:string;
  tmarginText:string;
  tWeight:string;
  dColor:string;
  dSize:string;
  dFamily:string;
  dpaddingSelect:string;
  dpaddingText:string;
  dmarginSelect:string;
  dmarginText:string;
  dWeight:string;
  pColor:string;
  pSize:string;
  pFamily:string;
  ppaddingSelect:string;
  ppaddingText:string;
  pmarginSelect:string;
  pmarginText:string;
  pWeight:string;
  bColor:string;
  bSize:string;
  bFamily:string;
  bpaddingSelect:string;
  bpaddingText:string;
  bmarginSelect:string;
  bmarginText:string;
  bWeight:string;
  eTColor:string;
  eTSize:string;
  eTFamily:string;
  eTPaddingSelect:string;
  eTPaddingText:string;
  eTMarginSelect:string;
  eTMarginText:string;
  eTWeight:string;
  eCColor:string;
  eCSize:string;
  eCFamily:string;
  eCPaddingSelect:string;
  eCPaddingText:string;
  eCMarginSelect:string;
  eCMarginText:string;
  eCWeight:string;
}

function ModalCrossellProduct(props:modalProps) {
  const {
    tColor,
    tSize,
    tFamily,
    tpaddingSelect,
    tpaddingText,
    tmarginSelect,
    tmarginText,
    tWeight,
    dColor,
    dSize,
    dFamily,
    dpaddingSelect,
    dpaddingText,
    dmarginSelect,
    dmarginText,
    dWeight,
    pColor,
    pSize,
    pFamily,
    ppaddingSelect,
    ppaddingText,
    pmarginSelect,
    pmarginText,
    pWeight,
    eTColor,
    eTSize,
    eTFamily,
    eTPaddingSelect,
    eTPaddingText,
    eTMarginSelect,
    eTMarginText,
    eTWeight,
    eCColor,
    eCSize,
    eCFamily,
    eCPaddingSelect,
    eCPaddingText,
    eCMarginSelect,
    eCMarginText,
    eCWeight,
    bColor,
    bSize,
    bFamily,
    bpaddingSelect,
    bpaddingText,
    bmarginSelect,
    bmarginText,
    bWeight,
  }=props

  const [thumbsSwiper,setThumbsSwiper]=useState(null)
  const crossell = useCrossell(state=>state.crossellObjects)
  const visibilityDialog= useCrossell(state=>state.changeVisibility)
  const [producto,setProducto]=useState(null)

  useEffect(()=>{
    if(crossell && crossell.dialog!= null){
      let dialog = crossell.dialog
      let cross = crossell.crossell.find((elm)=>elm.id == dialog.crossId) 
      let product = cross.products.find((elm)=>elm.id == dialog.productId)
      setProducto(product) 
    }
  },[crossell])

  const setClose = ()=>{
    visibilityDialog(false)
  }

  const style={"--activeColor":"#3790b0"} as React.CSSProperties

  return (
    <div
      className="fixed w-full h-full top-0 left-0 bg-black/50  flex  items-center justify-center"
      style={{
        zIndex:20,
        display: crossell?.open? "flex":"none", 
      }}
      > 
      <Dialog 
        show={crossell? crossell.open:false}
        onClose={setClose}
        className="w-[60%] h-[90%] relative rounded-xl"
      >
        {producto ? 
          <div 
            style={style}
          
          >
            <h2 id="radix-:rb4:" className="hidden">
              ---
            </h2>
            <div className="px-8 pb-8 w-full flex lg:flex-row flex-col mt-14 lg:mt-[72px] gap-8 min-h-[500px]">
              <div className="w-full lg:w-6/12">
                <div className="w-full relative">
                  <Swiper 
                    className=" h-[50vh] flex items-center relative rounded-[4px] border border-solid border-[#DEE2E6] "
                    navigation={true}
                    thumbs={{swiper:thumbsSwiper}}
                    modules={[FreeMode,Navigation,Thumbs]}
                    >
                    {producto.media.map((elm,index)=>{
                      return (
                        <SwiperSlide key={index} style={{ width: "50%", marginRight: "10px",display:"flex", alignItems:"center"}}>
                        
                          <img
                            loading="lazy"
                            className="w-full object-cover"
                            src={elm.url}
                            alt={elm.alt}
                          />

                        </SwiperSlide>
                      )
                    })
                    }
                    <button className="outline-none bg-transparent px-0 absolute top-0 h-full border-none z-10 md:flex items-center transition-all left-0 ps-4 opacity-[0.15] md:pointer-events-none">
                      <svg
                        className="stroke-[#000000] hover:stroke-[#a72a2f] "
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M13.3337 18.3333L5.00041 9.99998L13.3337 1.66665"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                      </svg>
                    </button>
                    <button className="outline-none bg-transparent px-0 absolute top-0 h-full border-none z-10 md:flex items-center transition-all right-0 pe-4 opacity-1">
                      <svg
                        className="stroke-[#000000] hover:stroke-[#a72a2f] rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M13.3337 18.3333L5.00041 9.99998L13.3337 1.66665"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                      </svg>
                    </button>
                  </Swiper>

                  <Swiper 
                    className="thumbs-swiper h-[20%] mt-4 flex "
                    spaceBetween={8}
                    onSwiper={setThumbsSwiper}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode,Navigation,Thumbs]}
                    >
                    {producto.media.map((elm,index)=>{
                      return(
                        <SwiperSlide 
                          key={index}
                          style={{ width: "124px" ,height:"124px"}}
                          >
                          <img
                            loading="lazy"
                            className="w-full h-full object-cover  border border-solid border-[#DEE2E6]"
                            src={elm.url}
                            alt={elm.alt}
                          />    
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>
              </div>
              <div className="w-full lg:w-6/12">
                <div 
                  className="text-[24px] lg:text-[34px] font-bold leading-[125%]"
                  style={{
                    color:tColor,
                    fontSize:tSize,
                    fontFamily:tFamily,
                    ...selectorPaddingMargin("padding",tpaddingSelect,tpaddingText),
                    ...selectorPaddingMargin("margin",tmarginSelect,tmarginText),
                    fontWeight:tWeight,
                  }}
                  >
                  {producto.title}
                </div>
                <div 
                  className="text-[16px] font-bold text-[#212529] mb-4"
                  style={{
                    color:pColor,
                    fontSize:pSize,
                    fontFamily:pFamily,
                    ...selectorPaddingMargin("padding",ppaddingSelect,ppaddingText),
                    ...selectorPaddingMargin("margin",pmarginSelect,pmarginText),
                    fontWeight:pWeight,
                  }}
                >
                  {checkPrice(producto.price)}€
                </div>
                <div className="mb-4">
                  <div 
                    className="mb-4"
                    style={{
                      color:dColor,
                      fontSize:dSize,
                      fontFamily:dFamily,
                      ...selectorPaddingMargin("padding",dpaddingSelect,dpaddingText),
                      ...selectorPaddingMargin("margin",dmarginSelect,dmarginText),
                      fontWeight:dWeight,
                    }}
                  >
                    {truncate(producto.description,60) }
                  </div> 
                  {producto.especificaciones && (
                    <>
                      <hr className="my-4" />
                      <h4
                        style={{
                          color:eTColor,
                          fontSize:eTSize,
                          fontFamily:eTFamily,
                          ...selectorPaddingMargin("padding",eTPaddingSelect,eTPaddingText),
                          ...selectorPaddingMargin("margin",eTMarginSelect,eTMarginText),
                          fontWeight:eTWeight,
                        }}
                      >
                        Especificaciones
                      </h4>  
                      <div>
                        <ul
                         style={{
                            color:eCColor,
                            fontSize:eCSize,
                            fontFamily:eCFamily,
                            ...selectorPaddingMargin("padding",eCPaddingSelect,eCPaddingText),
                            ...selectorPaddingMargin("margin",eCMarginSelect,eCMarginText),
                            fontWeight:eCWeight,
                          }}
                        > 
                          {
                            producto.especificaciones.split(`\n`).map((elm,index)=>{
                              return <li key={index} >{elm}</li>
                            })
                          }
                        </ul>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-8 uppercase tracking-wider font-bold">
                  <Link 
                    to={`/products/${producto.handle}`} 
                    className="mt-2 flex h-[20px] gap-2"
                    style={{
                      color:bColor,
                      fontSize:bSize,
                      fontFamily:bFamily,
                      ...selectorPaddingMargin("padding",bpaddingSelect,bpaddingText),
                      ...selectorPaddingMargin("margin",bmarginSelect,bmarginText),
                      fontWeight:bWeight,
                    }}
                    >
                    <p>
                      Saber más
                    </p>
                    <svg
                      className="arrow"
                      viewBox="0 0 31 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.447266 8.9198H28.7781"
                        stroke="currentColor"
                        stroke-width="2"
                      ></path>
                      <path
                        d="M21.3413 1.48322L28.7779 8.9198L21.3413 16.3564"
                        stroke="currentColor"
                        stroke-width="2"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>:
          <div>
            loading
          </div>
        }
      </Dialog>
    </div>
  );
}
export default ModalCrossellProduct;
