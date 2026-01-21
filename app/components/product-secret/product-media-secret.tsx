import { useEffect, useRef, useState } from "react";
import type { MediaFragment } from "storefront-api.generated";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMousePosition } from "~/utils/mouse-position";
import MiniatureSlide from "./miniature-slide";
import type { MediaProduct, MediaRequest } from "~/types/currentProduct";

export interface ProductMediaSecretProps{
  media:MediaProduct[],
  view360:[]|MediaRequest[],
  logo:MediaRequest,
  mediaVideos:string[],
}

function ProductMediaSecret(props:ProductMediaSecretProps) {
  const {media,view360,logo,mediaVideos}=props
  const [thumbsSwiper,setThumbsSwiper]=useState(null)
  const [principalSwiper,setPrincipalSwiper]=useState(null)
  const [show,setShow]=useState(false)
  const canvasRef = useRef(null)
  const img360Ref = useRef(null)
  const mousecord = useMousePosition()
  const [image360,setImage360]=useState(null)
  const [zoom,setZoom]=useState(false)
  const [position,setPosition]=useState({x:0,y:0})
  const [activeIndex,setActiveIndex]=useState(0)

  const show360=()=>{
    setShow(state=>!state)
  }
  
  const changeImage360=()=>{
    let canvasPos = canvasRef.current.getBoundingClientRect()
    let mouseInsideX = mousecord.x - canvasPos.left
    let mouseInsideY = mousecord.y - canvasPos.top
    let fragment = canvasPos.width/view360.length 
    
    let actual = Math.ceil(mouseInsideX/fragment)
    
    if(!zoom){
      setImage360(view360[actual-1])
    }else{
      setPosition( {x:(canvasPos.width/2)-mouseInsideX,y:(canvasPos.height/2)-mouseInsideY})
    }
  }

  const nextSlide=()=>{
    principalSwiper.slideNext()
  }
  
  const prevSlide=()=>{
    principalSwiper.slidePrev()
  }

  const zoomImage360=()=>{
    setZoom(state => !state)
  }

  useEffect(()=>{
    setImage360(view360[0])
  },[view360])

  return (
    <div className="transition-all flex-none w-[70vw]"> 
      <div className="bottom-0 h-full w-[70vw]">
        <div className="w-[100%] relative h-full bg-white left-0 transition-all duration-100 border-r border-t-0 border-l-0 border-b-0 border-solid border-[#A1A1AA] e2e-section-product-slider">
          <div
            className="sticky flex flex-col duration-100 transition-all"
            style={{ top: "0px", height: "calc(0px + 100vh)" }}
          >
            {logo && (
              <div className="absolute rounded-br-[13px] bg-black/70 st-colour-border-dark-grey border-solid border-b-[1px] border-r-[1px] border border-l-0 border-t-0 text-white z-10 flex items-center gap-3 px-3 py-2">
                <img
                  loading="lazy"
                  src={logo?.previewImage?.url}
                  alt="Official License Logo"
                  className="h-[40px]"
                />
                <div className="h-[40px] w-[1.27px] bg-[#71717A]"></div>
                <div className="text-sm text-[#D4D4D8] text-center uppercase w-[114px]">
                  Producto con licencia oficial
                </div>
              </div>
            )}
            <div className="align-middle flex-1 e2e-section-slider">
              <div className="relative overflow-hidden">
                {show ? 
                  (
                    <div className="e2e-product-turntable relative">
                      <Swiper className="ms-0 absolute top-0">
                        <SwiperSlide style={{width: "1343px"}}>
                          <div className="bg-[#fff] tw-text-center swiper-zoom-container">
                            <img 
                              ref={img360Ref} 
                              loading="lazy" 
                              src={image360?.previewImage?.url} 
                              alt={image360?.previewImage?.altText} 
                              style={{
                                height: "calc(0px + 90vh)", 
                                maxHeight: "calc(-130px + 100vh)",
                                scale:zoom? "2" : "1",
                                transform:zoom ?`translate3d(${position.x}px,${position.y}px,0)`:"translate3d(0,0,0)"
                              }}
                              />
                          </div>
                        </SwiperSlide>
                      </Swiper>
                      <div className="absolute w-full bg-white relative items-center flex flex-col" style={{height: "calc(0px + 90vh)", maxHeight: "calc(-130px + 100vh)"}}>
                        <canvas ref={canvasRef} onClick={zoomImage360} onMouseMoveCapture={()=>{changeImage360()}} className={`m-auto z-5 ${zoom ?"cursor-zoom-out":"cursor-zoom-in"}`} width="940.1" height="815"></canvas>
                      </div>
                    </div>
                  )
                  :
                  (
                    <div className="h-full">
                      <Swiper 
                        onSwiper={setPrincipalSwiper}
                        thumbs={{swiper:thumbsSwiper}}
                        modules={[FreeMode,Thumbs,Navigation]}
                        className="mySwiper2 ms-0 w-full relative"
                        onSlideChange={(s)=>{
                          setActiveIndex(s.realIndex)
                        }}
                        >
                        {media.map((elm)=>{
                          return(
                            <SwiperSlide
                              className="w-full h-full relative"
                              style={{ width: "1343px" }}
                            >
                              <img
                                loading="lazy"
                                src={elm.previewImage.url}
                                alt={elm.previewImage.altText}
                                className="w-[100%] object-cover m-0 aspect-[1.5] transition duration-1000 ease-in-out"
                                style={{ height: "calc(-110px + 100vh)" }}
                              />
                            </SwiperSlide>
                          )
                        })}
                        <div className="transition-all absolute right-[30px] top-[calc(50%-24px)] transform translate-x-1/2 translate-y-1/2 z-10">
                          <button 
                            className="group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer bg-black text-white hover:bg-stone-500 p-2.5 border-transparent border-0 mr-10"
                            onClick={nextSlide}
                            >
                            <div
                              className="border-rounded-full flex items-center justify-content st-colour-icons-on-colour "
                              style={{ width: "24px", height: "24px" }}
                            >
                              <svg
                                style={{ width: "24px", height: "24px" }}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </div>
                          </button>
                        </div>
                        <div className="transition-all absolute top-[calc(50%-24px)] transform translate-x-1/2 translate-y-1/2 z-10 prevarrow">
                          <button 
                            className="group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer bg-black text-white hover:bg-stone-500 p-2.5 border-transparent border-0 ml-8"
                            onClick={prevSlide}
                            >
                            <div
                              className="border-rounded-full flex items-center justify-content st-colour-icons-on-colour "
                              style={{ width: "24px", height: "24px" }}
                            >
                              <svg
                                style={{ width: "24px", height: "24px" }}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M10.5303 2.46967C10.2374 2.17678 9.76256 2.17678 9.46967 2.46967L3.93934 8L9.46967 13.5303C9.76256 13.8232 10.2374 13.8232 10.5303 13.5303C10.8232 13.2374 10.8232 12.7626 10.5303 12.4697L6.06066 8L10.5303 3.53033C10.8232 3.23744 10.8232 2.76256 10.5303 2.46967Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </div>
                          </button>
                        </div>
                      </Swiper>
                    </div>
                  )
                }
              </div>
            </div>
            <div className="flex items-center justify-center z-10 flex-none flex min-h-[70px] xl:min-h-[110px] sticky bottom-0 bg-black e2e-section-slider-thumbnail">
              {view360.length > 0 && (
                <div
                  data-context="pdp-360switch"
                  className="absolute right-[32px] bottom-[140px] z-[100] outline-none"
                  onClick={show360}
                >
                  <button
                    data-context="pdp-360switch"
                    className="relative cursor-pointer p-0 e2e-button-turntable !bg-transparent border-none !shadow-none switch-gallery-view-btn"
                  >
                    <img
                      loading="lazy"
                      src="https://images.secretlab.co/theme/common/gallery-360-btn.svg"
                      alt="turntables-icon"
                      height="72"
                      className="w-full transition duration-1000 ease-in-out"
                      data-context="pdp-360switch"
                    />
                  </button>
                </div>
              )}
              <div className="mx-5 max-w-[550px] w-[50%] xl:max-w-[600px] xxl:max-w-[700px] xl:w-[70%] e2e-section-image-gallery-thumbnail">
                <Swiper
                 onSwiper={setThumbsSwiper}
                 slidesPerView={5}
                 freeMode={true}
                 watchSlidesProgress={true}
                 modules={[FreeMode,Navigation,Thumbs]}
                 navigation={{
                  nextEl:".swiper-button-next",
                  prevEl:".swiper-button-prev"
                 }}
                 className="mySwiper ms-0"
                 >
                  {media.map((elm,index)=>{
                    let active = activeIndex == index
                    return(
                      <SwiperSlide className="max-w-[102px] h-full relative">
                        <MiniatureSlide 
                          swiper={principalSwiper}
                          index={index}
                          active={active} 
                          url={elm.previewImage.url} 
                          alt={elm.previewImage.altText}
                          show={show}
                          changeShow={setShow}
                          />
                      </SwiperSlide>
                    )
                  })}
                  <div className="absolute left-0 top-0 flex items-center bottom-0 z-10 bg-gradient-to-r from-black h-full00 cursor-pointer">
                    <div
                      className="swiper-button-prev text-white hover:text-[#3790b0]"
                      data-context="pdp-gallery-slider-arrow"
                    >
                      <svg
                        style={{ width: "24px", height: "24px" }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10.5303 2.46967C10.2374 2.17678 9.76256 2.17678 9.46967 2.46967L3.93934 8L9.46967 13.5303C9.76256 13.8232 10.2374 13.8232 10.5303 13.5303C10.8232 13.2374 10.8232 12.7626 10.5303 12.4697L6.06066 8L10.5303 3.53033C10.8232 3.23744 10.8232 2.76256 10.5303 2.46967Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 flex items-center bottom-0 z-10 bg-gradient-to-l from-black h-full00 cursor-pointer">
                    <div
                      className="swiper-button-next text-white hover:text-[#3790b0]"
                      data-context="pdp-gallery-slider-arrow"
                    >
                      <svg
                        style={{ width: "24px", height: "24px" }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </Swiper>
              </div>
              {mediaVideos.length > 0 && <div className="mx-5 h-[2px] w-[30px] bg-gray-500"></div>}
              {mediaVideos.length > 0 && (
                <div className="w-[15%] max-w-[240px] mx-5 e2e-section-video-gallery-thumbnail">
                  <div className="slick-slider slick-initialized" dir="ltr">
                    <div className="slick-list">
                      <div
                        className="slick-track"
                        style={{
                          width: "202px",
                          opacity: 1,
                          transform: "translate3d(0px, 0px, 0px)",
                          display:"flex"
                        }}
                      >
                        {mediaVideos.map((elm,index)=>{
                          return (
                            <div
                              data-index={index}
                              className="slick-slide slick-active"
                              aria-hidden="false"
                              style={{ outline: "none", width: "101px" }}
                            >
                              <div> 
                                <a
                                  href={elm}
                                  className="video-button-content max-w-[101px] relative cursor-pointer focus-visible:outline-none pr-[3px]"
                                  aria-hidden="false"
                                  style={{ width: "100%", display: "inline-block" }}
                                >
                                  <div className="w-full h-[48px] xl:h-[85px] mt-1 border border-[#ADB5BD] border-solid object-contain shadow overflow-hidden bg-white opacity-50 ">
                                    <video
                                      loop
                                      autoPlay
                                      muted
                                      className="w-full max-w-[101px] h-[48px] xl:h-[85px] object-cover"
                                    >
                                      <source
                                        src={elm}
                                        type="video/mp4"
                                      />
                                    </video>
                                  </div>
                                  <div className="absolute flex items-center justify-center left-0 top-0 h-full w-full">
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      stroke-width="0"
                                      viewBox="0 0 448 512"
                                      className="text-white"
                                      height="1em"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
                                    </svg>
                                  </div>
                                </a>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductMediaSecret;
