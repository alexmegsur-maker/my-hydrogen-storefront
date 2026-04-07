import { createSchema, IMAGES_PLACEHOLDERS, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { cva, type VariantProps } from "class-variance-authority";
import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router";
import { Image } from "~/components/image";
import { useIsMobile } from "~/hooks/use-is-mobile";
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
    },
    rowSize: {
      row1: "row-span-1",
      row2: "row-span-2",
      row3: "row-span-3",
      row4: "row-span-4",
      
    },
  },
});

interface CommunityPostProps 
extends VariantProps<typeof variants>,
HydrogenComponentProps{
  ref?:React.Ref<HTMLDivElement>;
  image:WeaverseImage;
  link:string;
  bgColor:string;
  bgHColor:string;
  borderColor:string;
  borderHColor:string;
  rounded:number;
  imageAspectRatio:ImageAspectRatio;
  user:string;
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
  model:string;
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


export default function CommunityPost(props:CommunityPostProps){
  const {
    ref,
    image,
    size,
    rowSize,
    link,
    bgColor,
    bgHColor,
    borderColor,
    borderHColor,
    rounded,
    imageAspectRatio,
    user,
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
    model,
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
  }=props
  const navigate= useNavigate()
  const [isHover,setIsHover]=useState(false)
  const isMobile=useIsMobile(600)

  const linkfeed = ()=>{
    if(link){
      navigate(link)
    }
  }  
  
  return (
    <div 
      ref={ref}
      {...rest}
      onClick={linkfeed}
      onMouseEnter={()=>setIsHover(true)}
      onMouseLeave={()=>setIsHover(false)}
      className={variants({ size, rowSize })+ " overflow-hidden relative"}
      style = {{ 
        background:isHover ? bgHColor : bgColor,
        transform:isHover?"scale(1.02)":"unset",
        boxShadow:isHover || isMobile?"0 10px 30px #000000cc":"unset",
        border:`1px solid ${isHover || isMobile ?borderHColor:borderColor}`,
        borderRadius:`${rounded}px`,
        transition:"all 0.4s ease",
      }}
    

      >
      <div className="social-img w-ful h-full object-cover">
        <Image 
          data={typeof image === "object" ? image : { url: image }}
          sizes="auto"
          className="h-full w-full object-cover"
          style={{
            alignSelf:"center",
            justifySelf:"center",
            filter:isHover || isMobile?"grayscale(0%)":"grayscale(100%)",
            transition:"all 0.3s ease"

          } as CSSProperties}
          aspectRatio={calculateAspectRatio(image, imageAspectRatio)}
        />
      </div>
      <div 
        className="absolute w-full left-0 bottom-0"
        style={{
          background:"linear-gradient(to top, #050505e6,transparent)",
          padding:"1.5rem",
          textAlign:"left",
          transform:isHover || isMobile ?"translateY(0)":"translateY(20px)",
          opacity:isHover || isMobile ?"1":"0",
          transition:"all 0.3s ease"
        }}
        >
        <div 
          className="social-user"
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
          {user}
        </div>
        <div 
          className="social-model"
          style={{
            color: dColor,
            fontFamily: dFamily,
            fontSize: dSize,
            fontWeight: dWeight,
            textTransform: dUpper ? "uppercase" : "unset",
            letterSpacing: dLetter > 0?`${dLetter}px`:"normal",
            textAlign:dAlignment,
            ...selectorPaddingMargin("padding", dPaddingSelect, dPaddingText),
            ...selectorPaddingMargin("margin", dMarginSelect, dMarginText),
          }}    
          >
          {model}
        </div>
      </div>
    </div>
  )
}

export const schema = createSchema({
  type:"column-with-post--item",
  title:"Post",
  settings:[
    {
      group:"post",
      inputs:[
        {
          type:'image',
          label:'image',
          name:'image',
          defaultValue:{
            url:IMAGES_PLACEHOLDERS.image,
            altText:'Alt text',
           
          }
        },
        {
          type:'url',
          label:'url',
          name:'link',
          defaultValue:'/products',
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
          defaultValue:4,
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
              
            ],
          },
          defaultValue: "col2",
        },
        {
          type: "select",
          name: "rowSize",
          label: "Row size",
          configs: {
            options: [
              {
                label: "Row 1",
                value: "row1",
              },
              {
                label: "Row 2",
                value: "row2",
              },
              {
                label: "Row 3",
                value: "row3",
              },
              {
                label: "Row 4",
                value: "row4",
              },
              
            ],
          },
          defaultValue: "row2",
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
        },
      ]
    },
    {
      group:"overlay",
      inputs:[  
        {
          type:'heading',
          label:'user'
        },
        {
          type:'text',
          label:'user',
          name:'user',
          defaultValue:'@Alexander',
        },
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
          defaultValue:1,
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
          defaultValue:false,
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
          defaultValue:"0.2rem"
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
        {
          type:'heading',
          label:'model'
        },
        {
          type:'text',
          label:'model',
          name:'model',
          defaultValue:'ORIGIN EDITION',
        },
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
          defaultValue:'0.75rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'dLetter',
          defaultValue:1,
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
  ]
})