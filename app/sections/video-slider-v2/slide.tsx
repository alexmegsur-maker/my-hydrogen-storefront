import { createSchema, type HydrogenComponentProps, type WeaverseImage, type WeaverseVideo } from "@weaverse/hydrogen"
import { cva, type VariantProps } from "class-variance-authority"
import type { CSSProperties } from "react"
import { SwiperSlide } from "swiper/react"
import { backgroundInputs } from "~/components/background-image"
import { OverlayAndBackground, type OverlayAndBackgroundProps } from "~/components/overlay-and-background"
import { layoutInputs } from "~/components/section"

const variants = cva("flex h-full w-full flex-col [&_.paragraph]:mx-[unset]",{
variants: {
    width: {
      full: "",
      stretch: "px-3 md:px-10 lg:px-16",
      fixed: "mx-auto max-w-(--page-width) px-3 md:px-10 lg:px-16",
    },
    verticalPadding: {
      none: "",
      small: "py-4 md:py-6 lg:py-8",
      medium: "py-8 md:py-12 lg:py-16",
      large: "py-12 md:py-24 lg:py-32",
    },
    gap: {
      0: "",
      4: "space-y-1",
      8: "space-y-2",
      12: "space-y-3",
      16: "space-y-4",
      20: "space-y-5",
      24: "space-y-3 lg:space-y-6",
      28: "space-y-3.5 lg:space-y-7",
      32: "space-y-4 lg:space-y-8",
      36: "space-y-4 lg:space-y-9",
      40: "space-y-5 lg:space-y-10",
      44: "space-y-5 lg:space-y-11",
      48: "space-y-6 lg:space-y-12",
      52: "space-y-6 lg:space-y-[52px]",
      56: "space-y-7 lg:space-y-14",
      60: "space-y-7 lg:space-y-[60px]",
    },
    contentPosition: {
      "top left": "items-start justify-start [&_.paragraph]:text-left",
      "top center": "items-center justify-start [&_.paragraph]:text-center",
      "top right": "items-end justify-start [&_.paragraph]:text-right",
      "center left": "items-start justify-center [&_.paragraph]:text-left",
      "center center": "items-center justify-center [&_.paragraph]:text-center",
      "center right": "items-end justify-center [&_.paragraph]:text-right",
      "bottom left": "items-start justify-end [&_.paragraph]:text-left",
      "bottom center": "items-center justify-end [&_.paragraph]:text-center",
      "bottom right": "items-end justify-end [&_.paragraph]:text-right",
    },
  },
  defaultVariants: {
    contentPosition: "bottom left",
  },
})

interface SlideProps extends VariantProps<typeof variants>,
  HydrogenComponentProps,OverlayAndBackgroundProps{
    titleBar:string;
    tag:string;
    contWidth:number;
    showMedia:"image"|"video"
    backgroundImage?: WeaverseImage | string;
    video:WeaverseVideo;
    poster:WeaverseImage;
    loop:boolean;
    isHero?:boolean;
  }


function SlideVideoV2(props:SlideProps){
  const {contWidth,contentPosition,width,gap,verticalPadding,backgroundImage,
    backgroundFit,backgroundPosition,enableOverlay,overlayOpacity,overlayColor,
    overlayColorHover,showMedia,video, poster ,children ,loop, isHero}=props

  return (
    <div className="h-full w-full relative">
      {showMedia=="image"?
      <OverlayAndBackground
        backgroundImage={backgroundImage}
        backgroundFit={backgroundFit}
        backgroundPosition={backgroundPosition}
        enableOverlay={enableOverlay}
        overlayOpacity={overlayOpacity}
        overlayColor={overlayColor}
        overlayColorHover={overlayColorHover}
        fetchPriority="high"
        loading="eager"
        />:
        <div className="h-[75dvh] min-h-[700px] lg:h-[80dvh] absolute top-0 left-0 lg:min-h-auto w-full transition-[transform] duration-500 ease-in-out ">
          <div className="h-full w-full relative">
            {poster?.url && isHero && (
              <link
                rel="preload"
                as="image"
                // @ts-ignore
                imageSrcSet={[750,1080,1440,1920].map(w=>`${poster.url}${poster.url.includes('?')? '&':'?'}width=${w} ${w}w`).join(', ')}
                imageSizes="100vw"
                href={`${poster.url}${poster.url.includes('?')? '&':'?'}width=1080`}
              />
            )}
            {/* Mobile fallback: poster shown as background on mobile */}
            {poster?.url && (
              <img
                src={`${poster.url}${poster.url.includes('?')? '&':'?'}width=750`}
                alt=""
                className="object-cover w-full h-full block lg:hidden absolute inset-0"
                fetchPriority={isHero ? "high" : undefined}
                loading={isHero ? "eager" : "lazy"}
              />
            )}
            <video
              className="object-cover w-full h-full hidden lg:block"
              autoPlay
              muted
              loop={loop}
              poster={poster?.url ? `${poster.url}${poster.url.includes('?')? '&':'?'}width=1920` : undefined}
            >
              <source src={video?.url} type="video/mp4" />
            </video>
          </div>
        </div>
      }
      <div
        className={`${variants({contentPosition,width,gap,verticalPadding})} slide-cont-width`}
        style={{ "--slide-cont-width": `${contWidth}%` } as CSSProperties}
        >
        {children}
      </div>
    </div>
  )
}

export default SlideVideoV2

export const schema = createSchema({
  type:"slideVideoV2",
  title:"Slide",
  childTypes: ["subheading", "heading", "paragraph", "button","group-buttons","recent-activity"],
  settings:[
    {
      group:"Slide",
      inputs:[
        {
          type: "switch",
          label: "Hero slide (mejora PageSpeed LCP)",
          name: "isHero",
          defaultValue: true,
        },
        {
          type:'text',
          label:'title Bar',
          name:'titleBar',
          defaultValue:'Video',
        },
        {
          type:'text',
          label:'tag',
          name:'tag',
        },
        {
          type:'range',
          label:'content width size',
          name:'contWidth',
          defaultValue:100,
          configs:{
            min:20,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type: "position",
          label: "Content position",
          name: "contentPosition",
          defaultValue: "center center",
        },
        ...layoutInputs.filter(
          (inp) => inp.name !== "divider" && inp.name !== "borderRadius",
        ),
      ]
    },
    {
      group:"Background",
      inputs:[
        {
          type:'toggle-group',
          label:'show media',
          name:'showMedia',
          configs:{
            options:[
              {value:'video',label:'video'},
              {value:'image',label:'image'},
            ]
          },
          defaultValue:"image",
        },
        {
          type:'video',
          label:'video',
          name:'video',
          condition:(data:SlideProps )=> data.showMedia =="video"
        },
        {
          type:'image',
          label:'video poster',
          name:'poster',
          condition:(data:SlideProps )=> data.showMedia =="video"
        },
        {
          type:'switch',
          label:'loop',
          name:'loop',
          defaultValue:true,
        },
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
          condition:(data:SlideProps )=> data.showMedia =="image"
        },
        {
          type: "select",
          name: "backgroundFit",
          label: "Background fit",
          configs: {
            options: [
              { value: "fill", label: "Fill" },
              { value: "cover", label: "Cover" },
              { value: "contain", label: "Contain" },
            ],
          },
          defaultValue: "cover",
          condition:(data:SlideProps )=> data.showMedia =="image"
        },
        {
          type: "position",
          name: "backgroundPosition",
          label: "Background position",
          defaultValue: "center center",
          condition:(data:SlideProps )=> data.showMedia =="image" 
        },
        {
          type: "switch",
          name: "enableOverlay",
          label: "Enable overlay",
          defaultValue: false,
        },
        {
          type: "color",
          name: "overlayColor",
          label: "Overlay color",
          defaultValue: "#000000",
          condition: (data: SlideProps) => data.enableOverlay,
        },
        {
          type: "color",
          name: "overlayColorHover",
          label: "Overlay color (hover)",
          condition: (data: SlideProps) => data.enableOverlay,
        },
        {
          type: "range",
          name: "overlayOpacity",
          label: "Overlay opacity",
          defaultValue: 50,
          configs: {
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
          },
          condition: (data: SlideProps) => data.enableOverlay,
        },

      ]
    }
  ]
})