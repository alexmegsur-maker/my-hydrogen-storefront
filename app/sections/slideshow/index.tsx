import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  useThemeSettings,
  useChildInstances
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SlideshowArrowsProps } from "./arrows";
import { Arrows } from "./arrows";
import type { SlideshowDotsProps } from "./dots";
import { Dots } from "./dots";
import { Bar } from "./bar";
import type { Swiper as SwiperType } from "swiper";
import { useRef, useState } from "react";

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

export interface SlideshowData
  extends VariantProps<typeof variants>,
    SlideshowArrowsProps,
    SlideshowDotsProps {
  ref: React.Ref<HTMLDivElement>;
  effect?: "fade" | "slide";
  showArrows: boolean;
  showDots: boolean;
  dotsPosition: "top" | "bottom" | "left" | "right";
  dotsColor: "light" | "dark";
  loop: boolean;
  autoRotate: boolean;
  changeSlidesEvery: number;
  showBar:boolean;
  barBgColor:string;
  barColor:string;
  barBgColorA:string;
  barColorA:string;
  borderColor:string;
  borderColorA:string;
  barSize:string;
  barFamily:string;
  barWeight:string;
  barLetterSpacing:number;
  barRounded:number;

}

export default function Slideshow(
  props: SlideshowData & HydrogenComponentProps,
) {
  const {
    ref,
    height,
    effect,
    showArrows,
    arrowsIcon,
    iconSize,
    showArrowsOnHover,
    arrowsColor,
    arrowsShape,
    showDots = true,
    dotsPosition,
    dotsColor,
    loop,
    autoRotate,
    changeSlidesEvery,
    showBar,
    barBgColor,
    barColor,
    barBgColorA,
    barColorA,
    borderColor,
    borderColorA,
    barSize,
    barFamily,
    barWeight,
    barLetterSpacing,
    barRounded,
    children = [],
    ...rest
  } = props;

  const swiperRef=useRef<SwiperType|null>(null)
  const [activeIndex,setActiveIndex]=useState(0)

  const childInstances =useChildInstances()
  const slideNames =childInstances.map(
    (instance:any)=>instance.data?.namebar ??"Slide"
  )

  const { enableTransparentHeader } = useThemeSettings();

  return (
    <section
      key={Object.values(rest)
        .filter((v) => typeof v !== "object")
        .join("-")}
      ref={ref}
      {...rest}
      className={variants({ height, enableTransparentHeader })}
    >
      <Swiper
        onSwiper={(swiper)=>{swiperRef.current=swiper}}
        onSlideChange={(swiper)=>setActiveIndex(swiper.realIndex)}
        effect={effect}
        loop={loop}
        autoplay={autoRotate ? { delay: changeSlidesEvery * 1000 } : false}
        navigation={
          showArrows && {
            nextEl: ".slideshow-arrow-next",
            prevEl: ".slideshow-arrow-prev",
          }
        }
        pagination={
          showDots && {
            el: ".slideshow-dots",
            clickable: true,
            bulletClass: clsx(
              "dot cursor-pointer rounded-full",
              "h-2.5 w-2.5 p-0",
              "outline-2 outline-solid outline-transparent outline-offset-3",
              "transition-all duration-200",
            ),
            bulletActiveClass: "active",
          }
        }
        modules={[
          EffectFade,
          autoRotate ? Autoplay : null,
          showArrows ? Navigation : null,
          showDots ? Pagination : null,
        ].filter(Boolean)}
      >
        {children.map((child, idx) =>{
          return (
            <SwiperSlide key={idx} className="bg-white">
              {child}
            </SwiperSlide>
          )
        })}
        
        {showArrows && (
          <Arrows
            arrowsIcon={arrowsIcon}
            iconSize={iconSize}
            arrowsColor={arrowsColor}
            showArrowsOnHover={showArrowsOnHover}
            arrowsShape={arrowsShape}
          />
        )}
        {showDots && <Dots dotsPosition={dotsPosition} dotsColor={dotsColor} />}
        {showBar && 
          <Bar 
            names={slideNames}
            activeIndex={activeIndex}
            onSelect={(idx)=>swiperRef.current?.slideToLoop(idx)}
            barBgColor={barBgColor}
            barColor={barColor}
            barBgColorA={barBgColorA}
            barColorA={barColorA}
            borderColor={borderColor}
            borderColorA={borderColorA}
            barSize={barSize}
            barFamily={barFamily}
            barWeight={barWeight}
            barLetterSpacing={barLetterSpacing}
            barRounded={barRounded}
            />
        }
      </Swiper>
    </section>
  );
}

export const schema = createSchema({
  title: "Slideshow",
  type: "slideshow",
  childTypes: ["slideshow-slide"],
  settings: [
    {
      group: "Slideshow",
      inputs: [
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
          type: "toggle-group",
          label: "Slide effect",
          name: "effect",
          configs: {
            options: [
              { value: "fade", label: "Fade" },
              { value: "slide", label: "Slide" },
            ],
          },
          defaultValue: "fade",
        },
        {
          type: "switch",
          label: "Auto-rotate slides",
          name: "autoRotate",
          defaultValue: true,
        },
        {
          type: "range",
          label: "Change slides every",
          name: "changeSlidesEvery",
          configs: {
            min: 3,
            max: 9,
            step: 1,
            unit: "s",
          },
          defaultValue: 5,
          condition: (data: SlideshowData) => data.autoRotate,
          helpText: "Auto-rotate is disabled inside Weaverse Studio.",
        },
        {
          type: "switch",
          label: "Loop",
          name: "loop",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Navigation & Controls",
      inputs: [
        {
          type: "heading",
          label: "Arrows",
        },
        {
          type: "switch",
          label: "Show arrows",
          name: "showArrows",
          defaultValue: false,
        },
        {
          type: "select",
          label: "Arrow icon",
          name: "arrowsIcon",
          configs: {
            options: [
              { value: "caret", label: "Caret" },
              { value: "arrow", label: "Arrow" },
            ],
          },
          defaultValue: "arrow",
          condition: (data: SlideshowData) => data.showArrows,
        },
        {
          type: "range",
          label: "Icon size",
          name: "iconSize",
          configs: {
            min: 16,
            max: 40,
            step: 2,
          },
          defaultValue: 20,
          condition: (data: SlideshowData) => data.showArrows,
        },
        {
          type: "switch",
          label: "Show arrows on hover",
          name: "showArrowsOnHover",
          defaultValue: true,
          condition: (data: SlideshowData) => data.showArrows,
        },
        {
          type: "select",
          label: "Arrows color",
          name: "arrowsColor",
          configs: {
            options: [
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ],
          },
          defaultValue: "light",
          condition: (data: SlideshowData) => data.showArrows,
        },
        {
          type: "toggle-group",
          label: "Arrows shape",
          name: "arrowsShape",
          configs: {
            options: [
              { value: "rounded-sm", label: "Rounded", icon: "squircle" },
              { value: "circle", label: "Circle", icon: "circle" },
              { value: "square", label: "Square", icon: "square" },
            ],
          },
          defaultValue: "rounded-sm",
          condition: (data: SlideshowData) => data.showArrows,
        },

        {
          type: "heading",
          label: "Dots",
        },
        {
          type: "switch",
          label: "Show dots",
          name: "showDots",
          defaultValue: true,
        },
        {
          type: "select",
          label: "Dots position",
          name: "dotsPosition",
          configs: {
            options: [
              { value: "top", label: "Top" },
              { value: "bottom", label: "Bottom" },
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "bottom",
          condition: (data: SlideshowData) => data.showDots,
        },
        {
          type: "select",
          label: "Dots color",
          name: "dotsColor",
          configs: {
            options: [
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ],
          },
          defaultValue: "light",
          condition: (data: SlideshowData) => data.showDots,
        },
        {
          type:'heading',
          label:'Selector bar'
        },
        {
          type:'switch',
          label:'show selector bar',
          name:'showBar',
          defaultValue:true,
          
        },
        {
          type:'color',
          label:'background color',
          name:'barBgColor',
          defaultValue:'#05050580',
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'color',
          label:'color',
          name:'barColor',
          defaultValue:'#71717A',
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'color',
          label:'background color selected',
          name:'barBgColorA',
          defaultValue:'#ffffff0d',
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'color',
          label:'color selected',
          name:'barColorA',
          defaultValue:'#FFFFFF',
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'color',
          label:'border color',
          name:'borderColor',
          defaultValue:'#ffffff14',
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'color',
          label:'border color selected',
          name:'borderColorA',
          defaultValue:'#ffffff26',
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'text',
          label:'font size',
          name:'barSize',
          defaultValue:'0.7rem',
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'text',
          label:'font family',
          name:'barFamily',
          defaultValue:'Montserrat',
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type: "select",
          name: "barWeight",
          label: "Weight",
          configs: {
            options: [
              { value: "100", label: "100 - Thin" },
              { value: "200", label: "200 - Extra Light" },
              { value: "300", label: "300 - Light" },
              { value: "400", label: "400 - Normal" },
              { value: "500", label: "500 - Medium" },
              { value: "600", label: "600 - Semi Bold" },
              { value: "700", label: "700 - Bold" },
              { value: "800", label: "800 - Extra Bold" },
              { value: "900", label: "900 - Black" },
            ],
          },
          defaultValue: "500",
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'range',
          label:'Letter spacing',
          name:'barLetterSpacing',
          defaultValue:1,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          },
          condition: (data: SlideshowData) => data.showBar,
        },
        {
          type:'range',
          label:'border radius',
          name:'barRounded',
          defaultValue:100,
          configs:{
            min:0,
            max:200,
            step:1,
            unit:'px',
          },
          condition: (data: SlideshowData) => data.showBar,
        },
        
      ],
    },
  ],
  presets: {
    children: [
      {
        type: "slideshow-slide",
        verticalPadding: "large",
        contentPosition: "center center",
        backgroundImage: IMAGES_PLACEHOLDERS.banner_1,
        backgroundFit: "cover",
        enableOverlay: true,
        overlayOpacity: 50,
        children: [
          {
            type: "subheading",
            content: "Limited time offer",
            color: "#fff",
          },
          {
            type: "heading",
            content: "Spring / Summer 2024 Sale",
            color: "#fff",
            size: "scale",
            minSize: 16,
            maxSize: 56,
          },
          {
            type: "paragraph",
            content:
              "It's hard to be nice if you don't feel comfortable. All the ready-to-wear and accessories you need for your next summer vacation is now up to 50% off.",
            color: "#fff",
          },
          {
            type: "button",
            text: "Shop collection",
            variant: "custom",
            backgroundColor: "#00000000",
            textColor: "#fff",
            borderColor: "#fff",
            backgroundColorHover: "#fff",
            textColorHover: "#000",
            borderColorHover: "#fff",
          },
        ],
      },
      {
        type: "slideshow-slide",
        verticalPadding: "large",
        contentPosition: "center center",
        backgroundImage: IMAGES_PLACEHOLDERS.banner_2,
        backgroundFit: "cover",
        enableOverlay: true,
        overlayOpacity: 50,
        children: [
          {
            type: "subheading",
            content: "Exclusive offer",
            color: "#fff",
          },
          {
            type: "heading",
            content: "Autumn / Winter 2024 Sale",
            color: "#fff",
            size: "scale",
            minSize: 16,
            maxSize: 56,
          },
          {
            type: "paragraph",
            content:
              "Stay warm and stylish with our winter collection. All the ready-to-wear and accessories you need for your next winter vacation is now up to 60% off.",
            color: "#fff",
          },
          {
            type: "button",
            text: "Shop collection",
            variant: "custom",
            backgroundColor: "#00000000",
            textColor: "#fff",
            borderColor: "#fff",
            backgroundColorHover: "#fff",
            textColorHover: "#000",
            borderColorHover: "#fff",
          },
        ],
      },
    ],
  },
});
