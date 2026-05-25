import { createSchema, useChildInstances, useThemeSettings, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { useRef, useState } from "react";
import type{ Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import{Pagination,Navigation,Autoplay} from "swiper/modules"
import { cva, type VariantProps } from "class-variance-authority";
import VideoSliderBar from "~/components/video-slider-bar";

const variants = cva("group [&_.swiper]:h-full", {
  variants: {
    height: {
      small: "h-[40vh] lg:h-[50vh]",
      medium: "h-[50vh] lg:h-[60vh]",
      large: "h-[70vh] lg:h-[80vh]",
      full: "",
    },
    enableTransparentHeader: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      height: "full",
      enableTransparentHeader: true,
      className: "h-screen-no-topbar",
    },
    {
      height: "full",
      enableTransparentHeader: false,
      className: "h-screen-dynamic",
    },
  ],
  defaultVariants: {
    height: "large",
  },
});

interface VideoSliderV2Props extends VariantProps<typeof variants>,HydrogenComponentProps{
  showBar:boolean;
  showLateral:boolean;
  showArrows:boolean;
  showBorder:boolean;
  showTimer:boolean;
  loop:boolean;
  time:number;
  color:string;
  bgColor:string;
  progressColor:string;
  bgProgressColor:string;
  bColor:string;
  borderColor:string;

  fullWidth:boolean;
  showDot:boolean;
  colorSelected:string;
  bgColorSelected:string;    
  fontSize:string;

}

function VideoSliderV2( props:VideoSliderV2Props){
  const{showBar,showLateral,showArrows,showBorder,showTimer,loop,time,height,children=[],
    color,bgColor,progressColor,bgProgressColor,bColor,borderColor,fullWidth,showDot,
    colorSelected,bgColorSelected,fontSize }=props
  
  const [swiperRef,setSwiperRef] = useState<SwiperType>(null);
  const [activeIndex,setActiveIndex] = useState(0)
  const [currentElm,setCurrentElm] = useState(0)
  const timeSwiper = time *1000
  const { enableTransparentHeader } = useThemeSettings();
  const childInstances = useChildInstances()
  const childrenInfo=childInstances.map((el)=>{return el.data})

  return(
    <section className={variants({height,enableTransparentHeader})}>
      <Swiper
        loop = {loop}
        effect = "slide"
        onSwiper = {setSwiperRef}
        className = "mySwiper w-full"
        navigation = {
          {
            nextEl:".slideshow-arrow-next",
            prevEl:".slideshow-arrow-prev"
          }
        }
        slidesPerView={1}
        pagination={{
          el:".slidesShow-dots",
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
          disableOnInteraction:false
        }}
        modules={[Pagination,Navigation,Autoplay]}
        >
          {children.map((child,idx)=>{
            return(
              <SwiperSlide key={idx}> 
                {child}
              </SwiperSlide>
            )
          })}
          <VideoSliderBar
            activeIndex={activeIndex}
            sliderElements={childrenInfo}
            swiperRef={swiperRef}
            color={color}
            bgColor={bgColor}
            progressColor={progressColor}
            bgProgressColor={bgProgressColor}
            bColor={bColor}
            borderColor={borderColor}
            showDot={showDot}
            colorSelected={colorSelected}
            bgColorSelected={bgColorSelected}
            showTimer={showTimer}
            showArrows={showArrows}
            fullWidth={fullWidth}
            showBorder={showBorder}
            fontSize={fontSize}
            />

      </Swiper>
    </section>
  )
}

export default VideoSliderV2

export const schema= createSchema({
  type:"videoSliderV2",
  title:"Slider video/imagen",
  childTypes: ["slideVideoV2"],
  settings:[ 
    {
      group:"General",
      inputs:[
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
            ],
          },
          defaultValue: "large",
        },
        {
          type:'switch',
          label:'show bar',
          name:'showBar',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show lateral slide',
          name:'showLateral',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'loop',
          name:'loop',
          defaultValue:true,
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
    },
    {
      group:"bar",
      inputs:[
        {
          type:'switch',
          label:'full page bar',
          name:'fullWidth',
          defaultValue:false,
        },
        {
          type:'switch',
          label:'show Arrows',
          name:'showArrows',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show border',
          name:'showBorder',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show timer',
          name:'showTimer',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show dot',
          name:'showDot',
          defaultValue:true,
        },
        
        {
          type: "color",
          label: "color text",
          name: "color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          label: "background color",
          name: "bgColor",
          defaultValue: "#000000",
        },
        {
          type: "color",
          label: "color text selected",
          name: "colorSelected",
          defaultValue: "#FFFFFF50",
        },
        {
          type: "color",
          label: "background color selected",
          name: "bgColorSelected",
          defaultValue: "#00000050",
        },
        {
          type: "color",
          label: "progress color",
          name: "progressColor",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          label: "background progress color",
          name: "bgProgressColor",
          defaultValue: "#00000060",
        },
        {
          type: "color",
          label: "arrow background color",
          name: "bColor",
          defaultValue: "#00000050",
        },
        {
          type: "color",
          label: "border color",
          name: "borderColor",
          defaultValue: "#FFFFFF",
        },
        {
          type:'text',
          label:'font size',
          name:'fontSize',
          defaultValue:'12px',
        },

        
      ]
    }
  ]
})