import { useGSAP } from "@gsap/react";
import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, type CSSProperties } from "react";
import { Image } from "~/components/image";
import Link, { type LinkProps, linkContentInputs } from "~/components/link";
import type { ImageAspectRatio } from "~/types/others";
import { selectorPaddingMargin } from "~/utils/general";
import { calculateAspectRatio } from "~/utils/image";

const variants = cva("", {
  variants: {
    size: {
      col1: "col-span-1",
      col2: "col-span-2",
      col3: "col-span-3",
      col4: "col-span-4",
      col5: "col-span-5",
      col6: "col-span-6",
      col7: "col-span-7",
    },
    hideOnMobile: {
      true: "hidden sm:block",
      false: "",
    },
  },
});

interface ColumnWithImageItemProps
  extends VariantProps<typeof variants>,
    Pick<LinkProps, "variant" | "text" | "to">,
    HydrogenComponentProps {
  imageSrc: WeaverseImage;
  imageAspectRatio: ImageAspectRatio;
  imageBorderRadius: number;
  iconSize: number;
  heading: string;
  content: string;
  ref?: React.Ref<HTMLDivElement>;
  estilo:"classic"|"leftBar";
  bgColor:string;
  bgHColor:string;
  borderColor:string;
  borderHColor:string;
  rounded:number;
  paddingSelect:string;
  paddingText:string;
  hImgCont:number;
  contentPosition:string;
  typeIcon:string;
  textSvg:string;
  tColor:string;
  tSize:string;
  tLetter:number;
  tAlignment:"left"|"center"|"right"|"justify";
  tUpper:boolean;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  dColor:string;
  dSize:string;
  dLetter:number;
  dAlignment:"left"|"center"|"right"|"justify";
  dUpper:boolean;
  dFamily:string;
  dPaddingSelect:string;
  dPaddingText:string;
  dMarginSelect:string;
  dMarginText:string;
  dWeight:string;
}

function ColumnWithImageItem(props: ColumnWithImageItemProps) {
  const {
    imageSrc,
    imageAspectRatio,
    imageBorderRadius,
    iconSize,
    heading,
    content,
    text,
    to,
    variant,
    hideOnMobile,
    size,
    ref,
    
    estilo,
    bgColor,
    bgHColor,
    borderColor,
    borderHColor,
    rounded,
    paddingSelect,
    paddingText,
    hImgCont,
    contentPosition,
    typeIcon,
    textSvg,
    tColor,
    tSize,
    tLetter,
    tAlignment,
    tUpper,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    dColor,
    dSize,
    dLetter,
    dAlignment,
    dUpper,
    dFamily,
    dPaddingSelect,
    dPaddingText,
    dMarginSelect,
    dMarginText,
    dWeight,
    ...rest
  } = props;
  
  const [isHover,setIsHover]=useState(false)
  const position = contentPosition?.split(" ")
  const container = useRef(null)
  const bar = useRef(null)

  const cardEstilo=estilo =="classic"?{
    background:isHover ? bgHColor : bgColor,
    transform:isHover?"translateY(-5%)":"unset",
    border:`1px solid ${isHover?borderHColor:borderColor}`,
    borderRadius:`${rounded}px`,
    ...selectorPaddingMargin("padding",paddingSelect,paddingText),
    transition:"all 0.4s ease",
  }as CSSProperties :{
    position:"relative",
    background:isHover ? bgHColor : bgColor,
    borderLeft:`1px solid ${borderColor}`,
    ...selectorPaddingMargin("padding",paddingSelect,paddingText),
    transition:"all 0.4s ease",
  } as CSSProperties


  useGSAP(()=>{
    gsap.registerPlugin(ScrollTrigger);
    if(bar.current){
      gsap.from(bar.current,{
        height:0,
        duration:1,
        delay:0.5,
        ease:"power1.inOut",
        scrollTrigger: {
        trigger: container.current, 
        start: "top 85%",           
        toggleActions: "play none none none",
      }
      })

    }
  },{scope:container})


  return (
    <div
      ref={container}
      {...rest}
      data-motion="slide-in"
      onMouseEnter={()=>setIsHover(true)}
      onMouseLeave={()=>setIsHover(false)}
      className={variants({ size, hideOnMobile })}
      style = {cardEstilo}
    >
      {estilo =="leftBar" &&
      <span
        ref={bar}
        style={{
          position:"absolute",
          top:0,
          left:"-1px",
          width:"2px",
          height:"100px",
          backgroundColor:borderHColor,
          boxShadow:`0 0 14px ${borderHColor}`
        }}
      />
      } 
      <div className="w-full relative"
        style={{
          height:hImgCont >0 ? `${hImgCont}rem`:"auto",
          justifyContent:position[1],
          alignContent:position[0]!= "center" ? position[0]=="top" ? "start":"end":"center"
        }}
      >
        {typeIcon =="image" ? 
          <Image
            data={typeof imageSrc === "object" ? imageSrc : { url: imageSrc }}
            sizes="auto"
            className="h-auto rounded-(--radius)"
            style={{
              width:`${iconSize}%`,
              alignSelf:"center",
              justifySelf:"center",
              "--radius": `${imageBorderRadius}px`,
            } as CSSProperties}
            aspectRatio={calculateAspectRatio(imageSrc, imageAspectRatio)}
          />
          :
            <div
              dangerouslySetInnerHTML={{__html:textSvg}}
              style={{
                height:`${iconSize}%`,
                width:`${iconSize}%`
              }}
            >
              
            </div>
        }
      </div>
      <div className="mt-2 w-full space-y-3.5 text-center">
        {heading && 
          <h6 
            style={{
              color: tColor,
              fontFamily: tFamily,
              fontSize: tSize,
              fontWeight: tWeight,
              textTransform: tUpper ? "uppercase" : "unset",
              letterSpacing: tLetter > 0?`${tLetter}px`:"normal",
              textAlign:tAlignment,
              ...selectorPaddingMargin("padding", tPaddingSelect, tPaddingText),
              ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
            }}
          >
            {heading}
          </h6>
        }
        {content && 
          <p 
            dangerouslySetInnerHTML={{ __html: content }} 
            style={{
              color: dColor,
              fontFamily: dFamily,
              fontSize: dSize,
              fontWeight: dWeight,
              lineHeight:1.6,
              textTransform: dUpper ? "uppercase" : "unset",
              letterSpacing: dLetter > 0?`${dLetter}px`:"normal",
              textAlign:dAlignment,
              ...selectorPaddingMargin("padding", dPaddingSelect, dPaddingText),
              ...selectorPaddingMargin("margin", dMarginSelect, dMarginText),
            }}    
            />
        }
        {text && (
          <Link variant={variant} to={to}>
            {text}
          </Link>
        )}
      </div>
    </div>
  );
}

export default ColumnWithImageItem;

export const schema = createSchema({
  type: "column-with-image--item",
  title: "Column",
  settings: [
    {
      group: "Column",
      inputs: [
        {
          type:'select',
          label:'column style',
          name:'estilo',
          configs:{
            options:[
              {value:'classic',label:'classic'},
              {value:'leftBar',label:'left bar'},
            ]
          },
          defaultValue:"classic",
        },
        {
          type:'color',
          label:'background color',
          name:'bgColor',
          defaultValue:'#ffffff05',
        },
        {
          type:'color',
          label:'background color hover',
          name:'bgHColor',
          defaultValue:'#ffffff0a',
        },
        {
          type:'color',
          label:'border color',
          name:'borderColor',
          defaultValue:'#ffffff0d',
        },
        {
          type:'color',
          label:'border color hover',
          name:'borderHColor',
          defaultValue:'#ffffff26',
        },

        {
          type:'range',
          label:'border radius',
          name:'rounded',
          defaultValue:10,
          configs:{
            min:0,
            max:200,
            step:1,
            unit:'px',
          }
        },
        {
          type: "select",
          name: "size",
          label: "Column size",
          configs: {
            options: [
              {
                label: "Column 1",
                value: "col1",
              },
              {
                label: "Column 2",
                value: "col2",
              },
              {
                label: "Column 3",
                value: "col3",
              },
              {
                label: "Column 4",
                value: "col4",
              },
              {
                label: "Column 5",
                value: "col5",
              },
              {
                label: "Column 6",
                value: "col6",
              },
              {
                label: "Column 7",
                value: "col7",
              },
              
            ],
          },
          defaultValue: "col4",
        },
        {
          type: "switch",
          label: "Hide on Mobile",
          name: "hideOnMobile",
          defaultValue: false,
        },
        {
          type:'select',
          label:'Padding type',
          name:'paddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'paddingText',
          defaultValue:"2.5rem 2rem"
        },
        {
          type: "heading",
          label: "Image icon",
        },
        {
          type:'range',
          label:'height img/svg container',
          name:'hImgCont',
          defaultValue:2.5,
          configs:{
            min:0,
            max:20,
            step:0.1,
            unit:'rem',
          },
          helpText:"0 igual 'auto'"
        },
        {
          type:"position",
          label:"content position",
          name:"contentPosition",
          defaultValue:"center center"
        },
        {
          type:'select',
          label:'select type of icon',
          name:'typeIcon',
          configs:{
            options:[
              {value:'image',label:'image'},
              {value:'svg',label:'svg text'},
            ]
          },
          defaultValue:'svg',
        },
        {
          type:'textarea',
          label:'svg text',
          name:'textSvg',
          condition:(data:ColumnWithImageItemProps)=>data.typeIcon ==="svg"
        
        },
        {
          type: "image",
          name: "imageSrc",
          label: "Image",
          condition:(data:ColumnWithImageItemProps)=>data.typeIcon ==="image"
        },
        {
          type:'range',
          label:'icon Size',
          name:'iconSize',
          defaultValue:12,
          configs:{
            min:10,
            max:100,
            step:1,
            unit:'%',
          },
        },
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Image aspect ratio",
          defaultValue: "adapt",
          configs: {
            options: [
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
              { value: "16/9", label: "Widescreen (16/9)" },
            ],
          },
          helpText:
            'Learn more about image <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" target="_blank" rel="noopener noreferrer">aspect ratio</a> property.',
          condition:(data:ColumnWithImageItemProps)=>data.typeIcon ==="image"
        },
        {
          type: "range",
          name: "imageBorderRadius",
          label: "Image border radius",
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
          defaultValue: 0,
          condition:(data:ColumnWithImageItemProps)=>data.typeIcon ==="image"
        },
        {
          type: "heading",
          label: "Content",
        },
        {
          type: "text",
          name: "heading",
          label: "Heading",
          placeholder: "Example heading",
          defaultValue: "Example heading",
        },
        {
          type: "richtext",
          label: "Description",
          name: "content",
          placeholder:
            "Use this section to promote content throughout every page of your site. Add images for further impact.",
          defaultValue:
            "Use this section to promote content throughout every page of your site. Add images for further impact.",
        },

        {
          type: "heading",
          label: "Button (optional)",
        },
        ...linkContentInputs,
      ],
    },
    {
      group:"heading",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'0.9rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type: "select",
          label: "Content alignment",
          name: "tAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
              { value: "justify", label: "Justify" },
            ],
          },
          defaultValue: "left",
        },
        {
          type:'switch',
          label:'uppercase',
          name:'tUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'tPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'tPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'tMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Margin text',
          name:'tMarginText',
          defaultValue:"0.8rem"
        },
        {
          type:'select',
          label:'Font weight',
          name:'tWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'400',
        },   
      ]
    },
    {
      group:"description",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'dColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'dSize',
          defaultValue:'0.8rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'dLetter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type: "select",
          label: "text alignment",
          name: "dAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
              { value: "justify", label: "Justify" },
            ],
          },
          defaultValue: "left",
        },
        {
          type:'switch',
          label:'uppercase',
          name:'dUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'dFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'dPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'dPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'dMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'dMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'dWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'300',
        },   
      ]
    }
  ],
  presets: {
    imageSrc: IMAGES_PLACEHOLDERS.product_4,
  },
});
