import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination,Navigation,Autoplay } from "swiper/modules";
import "./video-slider.css"
import { useSliderStore } from "./videoSliderStore";
import Link from "~/components/link";
import { Image } from "~/components/image";

interface VideoSliderProps extends HydrogenComponentProps{
  color:string;
  bgColor:string;
  progressColor:string;
  bgProgressColor:string;
  bColor:string;
  borderColor:string;
  time:number
}

function VideoSlider(props:VideoSliderProps) {

  const [swiperRef, setSwiperRef]=useState(null)
  const [activeIndex,setActiveIndex]=useState(0)
  const prevVideo = useRef(null)
  const nextVideo = useRef(null)
  const prevMedia = useRef(null)
  const nextMedia = useRef(null)
  
  const {children,color,bgColor,progressColor,bgProgressColor,bColor,borderColor,time}=props
  
  const sliderElements = useSliderStore((state)=>state.sliderElement)
  const [currentElm,setCurrentElm]=useState(0)
  const [prevElm,setPrevElm]=useState(sliderElements[sliderElements.length-1])
  const [nextElm,setNextElm]=useState(sliderElements[1])
  const [active,setActive]=useState(false)
  const timeSwiper = time * 1000
  const [windowWidth,setWindowWidth] = useState(0) 
  
  useEffect(()=>{
    setWindowWidth(window.innerWidth)
  },[])
  
  useEffect(()=>{
    let next = sliderElements[currentElm+1]
    let prev = sliderElements[currentElm-1]
    if(currentElm == 0){
      prev = sliderElements[sliderElements.length-1]
    }
    if(currentElm == sliderElements.length-1){
      next = sliderElements[0]
    }
    setPrevElm(prev)
    setNextElm(next)
    
  },[currentElm])

  useEffect(()=>{
    prevMedia.current.load();
    nextMedia.current.load();
  },[prevElm,nextElm])

  return (
  <>
    <div className="hidden">
    {children}

    </div>

    <div className="relative w-full bg-slate-300">
      <Swiper 
        loop={true}
        effect="slide"
        onSwiper={setSwiperRef}
        className="mySwiper w-full"
        navigation={
          {
            nextEl:".slideshow-arrow-next",
            prevEl:".slideshow-arrow-prev"
          }
        }
        slidesPerView={1}
        pagination={{
          el:".slideshow-dots",
          clickable:true,
          bulletClass:"dot",
          bulletActiveClass:"active",
          type:"custom",
        }}
        onSlideChange={(s)=>{
          setActiveIndex(s.realIndex)
          setCurrentElm(s.realIndex)

          
        }}
        autoplay={{
          delay:timeSwiper,
          disableOnInteraction:false,
        }}
        modules={[Pagination,Navigation,Autoplay]}
        style={{"--animationTime":`${time}s`}as CSSProperties}  
        >

          {sliderElements.length != 0  && sliderElements.map((element,index)=>{
            return(
              <SwiperSlide className="swiper-slide" key={element.id} data-index-store={element.id} data-swiper-slide-index={`${index}`} style={{width: "1905px"}}>
                <div className="h-[75dvh] min-h-[700px] lg:h-[80dvh] lg:min-h-auto w-full transition-[transform] duration-500 ease-in-out ">
                  <div className="h-full w-full">
                    <video className="object-cover w-full h-full hidden lg:block" preload="none" autoPlay muted loop poster={element.poster?.url}>
                      <source src={element.video.url} type="video/mp4"/>
                    </video>
                    <Image src={element.imagen.url} width="" height="" className="object-cover w-full h-full block lg:hidden" />
                  </div>
                </div>
              </SwiperSlide>    
            )
          })}
          {/* lateral slides */}
        <div ref={prevVideo} className="hidden lg:block absolute origin-right left-0 top-0 h-full w-full z-[5]  transition-discrete duration-500 ease-in-out -translate-x-full">
          <div className="h-full w-full">
            <video  ref={prevMedia} className="object-cover w-full h-full hidden lg:block" preload="none" muted poster={prevElm?.poster.url}>
              <source src={prevElm?.video.url}  type="video/mp4"/>
            </video>
            <Image src={prevElm?.imagen.url} width="" height="" sizes="auto" className="object-cover w-full h-full lg:hidden"/>
          </div>
        </div>
        <div 
          id="arrow" 
          onMouseEnter={()=>{
            if(active == false){
              prevMedia.current.play().catch(()=>{});
              prevVideo.current.style.animation="none"
              void prevVideo.current.offsetWidth;
              prevVideo.current.style.animation="showPartialVideoLeft 500ms ease forwards"
              setActive(true)
            }
          }} 
          onClick={()=>{
            prevVideo.current.style.animation="none"
            void prevVideo.current.offsetWidth;
            prevVideo.current.style.animation="showPartialVideoLeft 100ms ease reverse forwards"
            setActive(false)
          }}
          onMouseLeave={()=>{
            if(active){
              prevVideo.current.style.animation="none"
              void prevVideo.current.offsetWidth;
              prevVideo.current.style.animation="showPartialVideoLeft 500ms ease reverse forwards"
              setActive(false)
            }
            }} 
          className="group slideshow-arrow-prev border-0 bg-transparent absolute top-0 left-0 h-full pl-4 lg:pl-16 z-10 flex items-center  lg:w-[200px] cursor-pointer" data-context="splash-arrow">
          <button className="box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  p-1 border-solid border-[1px] border-transparent st-colour-buttons-inverse-default hover:st-colour-buttons-inverse-hover hover:fill-white fill-none">
            <div className="border-rounded-full flex items-center justify-content w-[16px] h-[16px] group-hover:fill-white duration-500">
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" >
                <path fillRule="evenodd" clipRule="evenodd" d="M10.5303 2.46967C10.2374 2.17678 9.76256 2.17678 9.46967 2.46967L3.93934 8L9.46967 13.5303C9.76256 13.8232 10.2374 13.8232 10.5303 13.5303C10.8232 13.2374 10.8232 12.7626 10.5303 12.4697L6.06066 8L10.5303 3.53033C10.8232 3.23744 10.8232 2.76256 10.5303 2.46967Z" >
                </path>
              </svg>
            </div>
          </button>
        </div>
        <div 
          ref={nextVideo} 
          className="hidden showPrevSlide lg:block absolute origin-right right-0 top-0 h-full w-full z-[5] transition-[transform] duration-500 ease-in-out translate-x-full">
          <div className="h-full w-full">
            <video ref={nextMedia} className="object-cover w-full h-full hidden lg:block" preload="none" muted poster={nextElm?.poster.url}>
              <source src={nextElm?.video.url} type="video/mp4"/>
            </video>
            <Image sizes="auto" src={nextElm?.imagen.url} width="" height="" className="object-cover w-full h-full lg:hidden"/>
          </div>
        </div>
        <div 
          id="arrow" 
          onMouseEnter={()=>{
            if(active==false){
              nextMedia.current.play().catch(()=>{});
              nextVideo.current.style.animation="none"
              void nextVideo.current.offsetWidth;
              nextVideo.current.style.animation="showPartialVideoRight 500ms ease forwards"
              setActive(true)
            }
          }} 
          onClick={()=>{
            nextVideo.current.style.animation="none"
            void nextVideo.current.offsetWidth;
            nextVideo.current.style.animation="showPartialVideoRight 100ms ease reverse forwards"
            setActive(false)
          }}
          onMouseLeave={()=>{
            if(active){
              nextVideo.current.style.animation="none"
              void nextVideo.current.offsetWidth;
              nextVideo.current.style.animation="showPartialVideoRight 500ms ease reverse forwards"
              setActive(false)
            }
            }} 
          className="group slideshow-arrow-next border-0 bg-transparent absolute top-0 right-0 h-full pr-4 lg:pr-16 z-10 flex items-center justify-end lg:w-[200px] cursor-pointer" data-context="splash-arrow">
          <button className=" box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  p-1 border-solid border-[1px] border-transparent st-colour-buttons-inverse-default hover:st-colour-buttons-inverse-hover hover:fill-white fill-none ">
            <div className="border-rounded-full flex items-center justify-content w-[16px] h-[16px] group-hover:fill-white duration-500">
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" >
                <path fillRule="evenodd"  clipRule="evenodd" d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z" >
                </path>
              </svg>
            </div>
          </button>
        </div>
        {/* end lateral slides */}
        {/* banner text */}
        <div className="absolute bottom-0 left-0 w-full pt-4 pb-[70px] lg:pb-[116px] z-20 flex">
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black to-transparent transition-opacity opacity-[0.8] z-0">
          </div>
          <div className="st-container flex flex-col items-center lg:items-start z-[3]">
            {sliderElements[currentElm]?.tag && (
              <span 
                className="inline-block py-0.5 px-2 uppercase font-bold mb-1"
                style={{
                  background:sliderElements[currentElm].tgBgColor,
                  color:sliderElements[currentElm].tgColor,
                  borderRadius:sliderElements[currentElm].tgRadius,
                  fontSize: windowWidth > 700 ? sliderElements[currentElm].tgSize:"18px",
                  fontFamily:sliderElements[currentElm].tgFamily
                }}
                >
                {sliderElements[currentElm].tag} 
              </span>
            )}
            {
              sliderElements[currentElm]?.title && (
                <h2 
                  className="st-headline-1 st-colour-text-on-colour-primary text-center lg:text-left slider-content-shadow"
                  style={{
                    color:sliderElements[currentElm].tColor,
                    fontSize:windowWidth > 700 ? sliderElements[currentElm].tSize:"30px",
                    fontFamily:sliderElements[currentElm].tFamily,
                  }}
                  >
                  {sliderElements[currentElm].title}
                </h2>
              ) 
            }
            {
              sliderElements[currentElm]?.description && (
                <p 
                  className="mb-0 mt-1 lg:mt-2 st-body-lg st-colour-text-on-colour-primary text-center lg:text-left"
                  style={{
                    color:sliderElements[currentElm].dColor,
                    fontSize:windowWidth > 700 ? sliderElements[currentElm].dSize : "18px",
                    fontFamily:sliderElements[currentElm].dFamily
                  }}
                  >                  
                {sliderElements[currentElm].description}
                </p>
              ) 
            }
            <div className="flex flex-col lg:flex-row items-center">
              {
                sliderElements[currentElm]?.button && (
                  <Link 
                    to={sliderElements[currentElm].url} 
                    className="group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  py-3 px-6 border-solid border-[1px] border-transparent  mt-4 lg:mt-6 "
                    style={{
                      color:sliderElements[currentElm].bColor,
                      background:sliderElements[currentElm].bBgColor,
                      fontSize:windowWidth > 700 ? sliderElements[currentElm].bSize : "14px",
                      fontFamily:sliderElements[currentElm].bFamily,
                      borderRadius:sliderElements[currentElm].bRadius
                    }}
                    >
                    {sliderElements[currentElm].button}
                  </Link>
                ) 
              }
            </div>
          </div>
        </div>
        {/* end banner text */}

        <div className="absolute w-full bottom-0 lg:bottom-8 left-0 z-30">
          <div className="st-container" data-context="splash-paginationbar">
            <div 
              data-context="splash-paginationbar" 
              className="w-full max-h-[56px] rounded-full lg:py-3 lg:px-5 border-0 lg:border-[1px] border-solid  flex items-center"
              style={{
                background:windowWidth > 700 ? bgColor : "transparent",
                borderColor:borderColor,
                color:color
              }}
              >
              <div data-context="splash-paginationbar" className="h-5 w-5 hidden lg:flex justify-center items-center p-0 bg-transparent border-0 transition-[stroke] group mr-8">
                <button 
                  className="slideshow-arrow-prev group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  p-2 border-transparent"
                  style={{
                    background:bColor,
                    strokeColor:color,
                    fill:color,
                  }}
                  >
                  <div className="border-rounded-full flex items-center justify-content  w-[20px] h-[20px]">
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" >
                      <path fillRule="evenodd" clipRule="evenodd" d="M10.5303 2.46967C10.2374 2.17678 9.76256 2.17678 9.46967 2.46967L3.93934 8L9.46967 13.5303C9.76256 13.8232 10.2374 13.8232 10.5303 13.5303C10.8232 13.2374 10.8232 12.7626 10.5303 12.4697L6.06066 8L10.5303 3.53033C10.8232 3.23744 10.8232 2.76256 10.5303 2.46967Z" >
                      </path>
                    </svg>
                  </div>
                </button>
              </div> 
              <div className=" slideshow-dots text-white basis-full flex gap-2" data-context="splash-paginationbar">
                {
                  sliderElements.length != 0 && sliderElements.map((element,index)=>{
                    return(
                      <button
                        onClick={()=>swiperRef?.slideToLoop(index)} 
                        key={element.id}
                        className="dot bg-transparent border-0 basis-full flex flex-col justify-center gap-2 py-6 lg:py-0 px-0" data-context="splash-paginationbar">
                        <span 
                          data-context="splash-paginationbar" 
                          className="st-caption-normal  text-center hidden lg:flex items-center justify-center gap-1"
                          style={{
                            color:color,
                          }}
                          >
                          {element.titleSelect}
                          {element.tag && (
                            <span 
                              className="inline-block py-0.5 px-1 text-[12px] text-black uppercase font-bold"
                              style={{
                                background:color,
                              }}
                              >
                              {element.tag}
                            </span>
                          )}
                        </span>
                        {activeIndex === index ?
                          (
                            <>
                              <span 
                                className="hidden lg:block w-full h-0.5 bg-[#4F4F54] " 
                                data-context="splash-paginationbar"
                                style={{
                                  background:bgProgressColor,
                                }}
                                >
                                <span 
                                  className={`block w-full h-0.5  origin-left progressAnimation  `}
                                  style={{
                                    background:progressColor,
                                  }}
                                  >
                                </span>
                              </span>
                              <span className="block lg:hidden w-full h-1 bg-[#4F4F54] " >
                                <span className="block h-1 bg-[#D4D4D8] progressAnimation origin-left w-full "></span>
                              </span>
                            </>
                          ):(
                              <span 
                                className="block lg:hidden w-full h-0.5 "
                                 style={{
                                  background:bgProgressColor,
                                }}
                                >
                                
                              </span>
                          )
                        }
                      </button>      
                    )
                  })
                }
              </div>
              <div data-context="splash-paginationbar" className="h-5 w-5 hidden lg:flex justify-center items-center p-0 bg-transparent border-0 transition-[stroke] ml-8 group">
                <button 
                  className="slideshow-arrow-next group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  p-2 border-transparent"
                  style={{
                    background:bColor,
                    strokeColor:color,
                    fill:color,
                  }}
                  >
                  <div className="border-rounded-full flex items-center justify-content w-[20px] h-[20px]">
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z">
                      </path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Swiper>
    </div>
  </>
  )
}
export default VideoSlider;

export const schema = createSchema({
  type:"video-slider",
  title:"Video Slider",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'color',
          label:'color text selector',
          name:'color',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'background color selector',
          name:'bgColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'progress color',
          name:'progressColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'background progress color',
          name:'bgProgressColor',
          defaultValue:'#00000060',
        },
        {
          type:'color',
          label:'arrow background color',
          name:'bColor',
          defaultValue:'#00000050',
        },
        {
          type:'color',
          label:'border color',
          name:'borderColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'range',
          label:'time slide',
          name:'time',
          defaultValue:10,
          configs:{
            min:1,
            max:50,
            step:1,
            unit:'Sec',
          }
        },
      ]
    }
  ],childTypes:['slider-content']
})
