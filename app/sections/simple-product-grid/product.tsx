import {
  type ComponentLoaderArgs,
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
  type WeaverseProduct,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router";
import type { ProductQuery } from "storefront-api.generated";
import { Image } from "~/components/image";
import Link, { type LinkProps, linkContentInputs } from "~/components/link";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { useIsMobile } from "~/hooks/use-is-mobile";
import type { ImageAspectRatio } from "~/types/others";
import { selectorPaddingMargin, truncate } from "~/utils/general";
import { calculateAspectRatio } from "~/utils/image";
import { checkPrice } from "~/utils/product";

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

interface ColumnWithProductItemProps
  extends VariantProps<typeof variants>,
    Pick<LinkProps, "variant" | "text" | "to">,
    HydrogenComponentProps {
  producto:WeaverseProduct,
  imageAspectRatio: ImageAspectRatio;
  imageBorderRadius: number;
  iconSize: number;
  ref?: React.Ref<HTMLDivElement>;
  
  bgColor:string;
  bgHColor:string;
  borderColor:string;
  borderHColor:string;
  rounded:number;
  paddingSelect:string;
  paddingText:string;
  hImgCont:number;
  contentPosition:string;
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
  pColor:string;
  pSize:string;
  pLetter:number;
  pAlignment:"left"|"center"|"right"|"justify";
  pUpper:boolean;
  pFamily:string;
  pPaddingSelect:string;
  pPaddingText:string;
  pMarginSelect:string;
  pMarginText:string;
  pWeight:string;
}

function ColumnWithProductItem(props: ColumnWithProductItemProps) {
  const {
    producto,
    loaderData,
    imageAspectRatio,
    imageBorderRadius,
    iconSize,
    text,
    to,
    variant,
    hideOnMobile,
    size,
    ref,
    
    bgColor,
    bgHColor,
    borderColor,
    borderHColor,
    rounded,
    paddingSelect,
    paddingText,
    hImgCont,
    contentPosition,
   
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
    pColor,
    pSize,
    pLetter,
    pAlignment,
    pUpper,
    pFamily,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    pWeight,
    ...rest
  } = props;
  
  const product = loaderData?.product ?? null
  const imageSrc= product?.featuredImage
  const navigate = useNavigate()

  const [isHover,setIsHover]=useState(false)
  const position = contentPosition?.split(" ")
  const isMobile= useIsMobile(600)

  const linkProduct =()=>{
    if(product){
      navigate(`/products/${product.handle}`)
    }
  }

  useEffect(()=>{
    console.log("producto loaderdata",loaderData)
  },[loaderData])
  return (
    <div
      ref={ref}
      {...rest}
      data-motion="slide-in"
      onClick={linkProduct}
      onMouseEnter={()=>setIsHover(true)}
      onMouseLeave={()=>setIsHover(false)}
      className={variants({ size, hideOnMobile })}
      style = {{ 
        background:isHover ? bgHColor : bgColor,
        transform:isHover?"translateY(-2%)":"unset",
        border:`1px solid ${isHover?borderHColor:borderColor}`,
        borderRadius:`${rounded}px`,
        ...selectorPaddingMargin("padding",paddingSelect,paddingText),
        transition:"all 0.4s ease",
        cursor:"pointer"
      }}
    >
      <div className="w-full relative"
        style={{
          height:hImgCont >0 ? `${hImgCont}rem`:"auto",
          justifyContent:position[1],
          alignContent:position[0]!= "center" ? position[0]=="top" ? "start":"end":"center",
          transform:isHover?"scale(1.05)":"unset",
          transition:"all 0.4s ease "
        
        }}
      >
        <Image
          data={typeof imageSrc === "object" ? imageSrc : { url: imageSrc }}
          sizes="auto"
          className="h-auto rounded-(--radius)"
          style={{
            width:`${iconSize}%`,
            alignSelf:"center",
            justifySelf:"center",
            borderRadius: `${imageBorderRadius}px`,
            filter:isHover && !isMobile?"grayscale(0%)":"grayScale(100%)",
            transition:"all 0.4s ease",
          } as CSSProperties}
          aspectRatio={calculateAspectRatio(imageSrc, imageAspectRatio)}
        />
      </div>
      <div className="mt-2 w-full space-y-3.5 text-center">
        {product?.title && 
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
            {product?.title}
          </h6>
        }
        {product?.description && 
          <p 
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
              {truncate(product?.description,20) }
            </p>
        }
        <p
          style={{
              color: pColor,
              fontFamily: pFamily,
              fontSize: pSize,
              fontWeight: pWeight,
              textTransform: pUpper ? "uppercase" : "unset",
              letterSpacing: pLetter > 0?`${pLetter}px`:"normal",
              textAlign:dAlignment,
              ...selectorPaddingMargin("padding", pPaddingSelect, pPaddingText),
              ...selectorPaddingMargin("margin", pMarginSelect, pMarginText),
            }} 
        >
          {checkPrice(product?.selectedOrFirstAvailableVariant.price.amount)} €
        </p>
      </div>
    </div>
  );
}

export default ColumnWithProductItem;
export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<ColumnWithProductItemProps>) => {
  const { language, country } = weaverse.storefront.i18n;
  const { producto } = data;

  if(!producto?.handle) {return null}
  
  try {
        const {product} = await weaverse.storefront.query<ProductQuery>(
          PRODUCT_QUERY,
          {
            variables: {
              country,
              language,
              selectedOptions: [],
              handle: producto.handle,
            },
          }
        );
        if (product){
          return JSON.parse(JSON.stringify({ product: product })) 
        }
      } catch (error) {
        console.error("Error cargando producto:", error);
        return JSON.parse(JSON.stringify({ product: null }));
        
      }
   
 

};

export const schema = createSchema({ 
  type: "column-with-product--item",
  title: "Product",
  settings: [
    {
      group: "Column product",
      inputs: [
        {
          type:'product',
          label:'Featured product',
          name:'producto',
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
        },

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
    },
    {
      group:"Price",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'pColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'pSize',
          defaultValue:'0.8rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'pLetter',
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
          name: "pAlignment",
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
          name:'pUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'pFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'pPaddingSelect',
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
          name:'pPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'pMarginSelect',
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
          name:'pMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'pWeight',
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

});
