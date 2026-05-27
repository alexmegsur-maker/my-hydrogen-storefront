import { useIsMobile } from "~/hooks/use-is-mobile";
import type{ Swiper as SwiperType } from "swiper";
import { useEffect } from "react";

interface VideoSliderBarProps {
  swiperRef: SwiperType;
  sliderElements: any;
  activeIndex: number;
  bgColor: string;
  borderColor: string;
  color: string;
  bColor: string;
  bgProgressColor: string;
  progressColor: string;
  showDot:boolean;
  colorSelected:string;
  bgColorSelected:string;
  showTimer:boolean;
  showArrows:boolean;
  fullWidth:boolean;
  showBorder:boolean;
  fontSize:string;
}

function VideoSliderBar(props: VideoSliderBarProps) {
  const {
    bgColor,
    borderColor,
    color,
    bColor,
    bgProgressColor,
    progressColor,
    sliderElements,
    swiperRef,
    activeIndex,
    showDot,
    colorSelected,
    bgColorSelected,
    showTimer,
    showArrows,
    fullWidth,
    showBorder,
    fontSize,
  } = props;
  const isMobile = useIsMobile(600);

 
  return (
    <div className="absolute  bottom-0 lg:bottom-8 left-0 z-30"
      style={{
        width:fullWidth ?"100%":"auto",
        left:"50%",
        transform:"translate(-50%)"

      }}
    >
      <div className="st-container" data-context="splash-paginationbar">
        <div
          data-context="splash-paginationbar"
          className="w-full max-h-[56px] rounded-full lg:py-3  border-0 lg:border-[1px] border-solid  flex items-center"
          style={{
            background: !isMobile ? bgColor : "transparent",
            borderColor:showBorder? borderColor:"transparent",
            color: color,
            padding:fullWidth ?"unset":"6px"
          }}
          > 
          {showArrows &&
            <div
              data-context="splash-paginationbar"
              className="h-5 w-5 hidden lg:flex justify-center items-center p-0 bg-transparent border-0 transition-[stroke] group mr-8"
            >
              <button
                className="slideshow-arrow-prev group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  p-2 border-transparent"
                style={{
                  background: bColor,
                  strokeColor: color,
                  fill: color,
                }}
              >
                <div className="border-rounded-full flex items-center justify-content  w-[20px] h-[20px]">
                  <svg
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.5303 2.46967C10.2374 2.17678 9.76256 2.17678 9.46967 2.46967L3.93934 8L9.46967 13.5303C9.76256 13.8232 10.2374 13.8232 10.5303 13.5303C10.8232 13.2374 10.8232 12.7626 10.5303 12.4697L6.06066 8L10.5303 3.53033C10.8232 3.23744 10.8232 2.76256 10.5303 2.46967Z"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          }
          <div
            className=" slideshow-dots text-white basis-full flex gap-2"
            data-context="splash-paginationbar"
            style={{
            }}
          >
            {sliderElements.length != 0 &&
              sliderElements.map((element, index) => {
                const active =activeIndex === index
                return (
                  <button
                    onClick={() => swiperRef?.slideToLoop(index)}
                    key={element.id}
                    className="dot bg-transparent border-0 basis-full rounded-full flex flex-col justify-center gap-2 py-6 lg:py-0 px-0"
                    data-context="splash-paginationbar"
                    style={{
                      padding: fullWidth?"unset":"10px 24px",
                      background: active ? bgColorSelected:"transparent",
                      border:showBorder?`1px solid ${borderColor}`:"transparent"


                    }}
                  >
                    <span
                      data-context="splash-paginationbar"
                      className="st-caption-normal  text-center hidden lg:flex items-center justify-center gap-1"
                      style={{
                        color: color,
                        fontSize:fontSize
                      }}
                    >
                      {active && showDot &&
                        <span 
                          className="inline-block w-[6px] h-[6px] " 
                          style={{
                            background: colorSelected, 
                            borderRadius: "50%", 
                            marginRight: "8px", 
                            verticalAlign: "middle", 
                            marginTop: "-2px", 
                            boxShadow: "rgba(255, 255, 255, 0.5) 0px 0px 8px"
                          }}/>
                       }
                      
                      {element.titleBar}
                      {element.tag && (
                        <span
                          className="inline-block py-0.5 px-1 text-[12px] text-black uppercase font-bold"
                          style={{
                            background: color,
                          }}
                        >
                          {element.tag}
                        </span>
                      )}
                    </span>
                    {active && showTimer ? (
                      <>
                        <span
                          className="hidden lg:block w-full h-0.5 bg-[#4F4F54] "
                          data-context="splash-paginationbar"
                          style={{
                            background: bgProgressColor,
                          }}
                        >
                          <span
                            className={`block w-full h-0.5  origin-left progressAnimation  `}
                            style={{
                              background: progressColor,
                            }}
                          ></span>
                        </span>
                        <span className="block lg:hidden w-full h-1 bg-[#4F4F54] ">
                          <span className="block h-1 bg-[#D4D4D8] progressAnimation origin-left w-full "></span>
                        </span>
                      </>
                    ) : (
                      <span
                        className="block lg:hidden w-full h-0.5 "
                        style={{
                          background: bgProgressColor,
                        }}
                      ></span>
                    )}
                  </button>
                );
              })}
          </div>
          {showArrows && 
            <div
              data-context="splash-paginationbar"
              className="h-5 w-5 hidden lg:flex justify-center items-center p-0 bg-transparent border-0 transition-[stroke] ml-8 group"
            >
              <button
                className="slideshow-arrow-next group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  p-2 border-transparent"
                style={{
                  background: bColor,
                  strokeColor: color,
                  fill: color,
                }}
              >
                <div className="border-rounded-full flex items-center justify-content w-[20px] h-[20px]">
                  <svg
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default VideoSliderBar;
