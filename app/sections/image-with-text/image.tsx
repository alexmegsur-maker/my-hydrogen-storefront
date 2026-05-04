import { useGSAP } from "@gsap/react";
import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  useItemInstance,
  useParentInstance,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Image } from "~/components/image";
import { useIsMobile } from "~/hooks/use-is-mobile";
import type { ImageAspectRatio } from "~/types/others";
import { cn } from "~/utils/cn";

const variants = cva("h-auto w-full", {
  variants: {
    width: {
      custom:"md:w-[--wdist]",
      small: "md:w-[40%]",
      medium: "md:w-[50%]",
      large: "md:w-[60%]",
    },
    objectFit: {
      cover: "object-cover",
      contain: "object-contain",
    },
    borderRadius: {
      0: "",
      2: "rounded-xs",
      4: "rounded-sm",
      6: "rounded-md",
      8: "rounded-lg",
      10: "rounded-[10px]",
      12: "rounded-xl",
      14: "rounded-[14px]",
      16: "rounded-2xl",
      18: "rounded-[18px]",
      20: "rounded-[20px]",
      22: "rounded-[22px]",
      24: "rounded-3xl",
      26: "rounded-[26px]",
      28: "rounded-[28px]",
      30: "rounded-[30px]",
      32: "rounded-[32px]",
      34: "rounded-[34px]",
      36: "rounded-[36px]",
      38: "rounded-[38px]",
      40: "rounded-[40px]",
    },
  },
});

interface ImageWithTextImageProps
  extends VariantProps<typeof variants>,
    HydrogenComponentProps {
  image: WeaverseImage | string;
  imageAspectRatio: ImageAspectRatio;
  ref?: React.Ref<HTMLDivElement>;
  verticalAlign:'flex-start'|'center'|'flex-end',
  enableBar:boolean;
  barColor:string;
}

function ImageWithTextImage(props: ImageWithTextImageProps) {
  const {
    image = IMAGES_PLACEHOLDERS.image,
    width,
    imageAspectRatio,
    borderRadius,
    objectFit,
    verticalAlign,
    ref,
    enableBar,
    barColor,
    ...rest
  } = props;

  const parentInstance = useParentInstance()
  const instance = useItemInstance()
  const [contentSize,setContentSize]=useState(100)
  const isMobile  = useIsMobile(600)
  const container = useRef(null)
  const bar = useRef(null)
  const imageData: Partial<WeaverseImage> =
    typeof image === "string" ? { url: image, altText: "Placeholder" } : image;
  let aspRt: string | undefined;
  if (imageAspectRatio === "adapt") {
    if (imageData.width && imageData.height) {
      aspRt = `${imageData.width}/${imageData.height}`;
    }
  } else {
    aspRt = imageAspectRatio;
  }

  useEffect(()=>{
    if(parentInstance.data?.contentDist){
      let position = parentInstance.data.children.findIndex((elm)=>elm.id ==instance.data.id)
      if(position == 0){
        setContentSize(parentInstance.data.contentDist)
      }else{
        setContentSize(100-parentInstance.data.contentDist)
      }
      
    }
  },[parentInstance.data?.contentDist,instance.data?.id])

  useGSAP(()=>{
    gsap.registerPlugin(ScrollTrigger)
    if(bar.current){
      gsap.from(bar.current,{
        transform:"scaleX(0)",
        duration:1,
        delay:0.5,
        ease:"power1.inOut",
        scrollTrigger:{
          trigger:container.current,
          start:"top 85%",
          toggleActions:"play none none none"
        }
      })
      gsap.from(container.current,{
        filter:"blur(1rem)",
        duration:1,
        delay:0.5,
        ease:"power1.inOut",
        scrollTrigger:{
          trigger:container.current,
          start:"top 85%",
          toggleActions:"play none none none"
        }
      })
    }

  },{scope:container})


  return (
    <div 
      ref={container} {...rest} 
      className={cn(variants({ width }),"z-2")  }
      style={{
        width:isMobile?"100%":`${contentSize}%`,
        alignSelf:verticalAlign,
        position:enableBar?"relative":"unset"
      }as CSSProperties}
    >
      <Image
        data={imageData}
        data-motion="slide-in"
        sizes="auto"
        aspectRatio={aspRt}
        className={cn("h-full w-full flex", variants({ objectFit, borderRadius }))}
      
      />
      {enableBar &&
        <span
          ref={bar}
          style={{
            position:"absolute",
            bottom:0,
            left:0,
            width:"100%",
            height:"3px",
            background:barColor,
            boxShadow:`0 0 20px ${barColor}`,
            transform:"scaleX(1)",
            zIndex:999,
          }}
        />
      }
    </div>
  );
}

export default ImageWithTextImage;

export const schema = createSchema({
  type: "image-with-text--image",
  title: "Image",
  limit: 1,
  settings: [
    {
      group: "Image",
      inputs: [

        {
          type: "image",
          name: "image",
          label: "Image",
        },
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Image aspect ratio",
          configs: {
            options: [
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
              { value: "16/9", label: "Widescreen (16/9)" },
            ],
          },
          defaultValue: "1/1",
          helpText:
            'Learn more about image <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" target="_blank" rel="noopener noreferrer">aspect ratio</a> property.',
        },
        {
          type:'select',
          label:'vertical align',
          name:'verticalAlign',
          configs:{
            options:[
              {value:'flex-start',label:'start'},
              {value:'center',label:'center'},
              {value:'flex-end',label:'end'},
            ]
          },
          defaultValue:"flex-start",
        },
        {
          type: "select",
          name: "width",
          label: "Width",
          defaultValue: "medium",
          configs: {
            options: [
              { value: "custom", label: "Custom" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ],
          },
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Border radius",
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
          defaultValue: 0,
        },
        {
          type: "select",
          name: "objectFit",
          label: "Object fit",
          defaultValue: "cover",
          configs: {
            options: [
              { value: "cover", label: "Cover" },
              { value: "contain", label: "Contain" },
            ],
          },
        },
        {
          type:'switch',
          label:'enable bar',
          name:'enableBar',
          defaultValue:false,
        },
        {
          type:'color',
          label:'color bar',
          name:'barColor',
          defaultValue:'#FFFFFF',
          condition:(data:ImageWithTextImageProps)=>data.enableBar == true
        },
      ],
    },
  ],
  presets: {
    image: IMAGES_PLACEHOLDERS.image,
    width: "medium",
    aspectRatio: "1/1",
    objectFit: "cover",
    borderRadius: 0,
  },
});
 