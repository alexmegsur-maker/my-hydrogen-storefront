import { JudgemePreviewBadge,  JudgemeReviewWidget, JudgemeVerifiedBadge } from "@judgeme/shopify-hydrogen";
import { createSchema } from "@weaverse/hydrogen"
import { Section } from "~/components/section";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import { checkPrice } from "~/utils/product";

interface HeadProps{
  title:string;
  rColor:string;
  rSize:string;
  rFamily:string;
  rPaddingSelect:string;
  rPaddingText:string;
  rMarginSelect:string;
  rMarginText:string;
  rWeight:string;
  tColor:string;
  tSize:string;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  pTColor:string;
  pCColor:string;
  pColor:string;
  pTSize:string;
  pCSize:string;
  pSize:string;
  pFamily:string;
  pPaddingSelect:string;
  pPaddingText:string;
  pMarginSelect:string;
  pMarginText:string;
  pTWeight:string;
  pWeight:string;
  pCWeight:string;

}

export default function Head(props:HeadProps){
  const {
    title,
    rColor,
    rSize,
    rFamily,
    rPaddingSelect,
    rPaddingText,
    rMarginSelect,
    rMarginText,
    rWeight,
    tColor,
    tSize,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    pTColor,
    pCColor,
    pColor,
    pTSize,
    pCSize,
    pSize,
    pFamily,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    pTWeight,
    pWeight,
    pCWeight,
    ...rest
  } = props
  const currentProduct= useCurrentProduct(state=>state.currentProduct)

  return(
    <Section {...rest}>
      <div style={{
          color:rColor,
          fontSize:rSize,
          fontFamily:rFamily,
          fontWeight:rWeight,
          ...selectorPaddingMargin("padding",rPaddingSelect,rPaddingText),
          ...selectorPaddingMargin("margin",rMarginSelect,rMarginText)

        }}>
        <JudgemePreviewBadge id={currentProduct.id} template="" />
      </div>
      <h1
        style={{
          color:tColor,
          fontSize:tSize,
          fontFamily:tFamily,
          fontWeight:tWeight,
          ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
          ...selectorPaddingMargin("margin",tMarginSelect,tMarginText)

        }}
      >
        {title}
      </h1>
      <p 
        style={{
          color:pTColor,
          fontSize:pTSize,
          fontFamily:pFamily,
            fontWeight:pTWeight,
          ...selectorPaddingMargin("padding",pPaddingSelect,pPaddingText),
          ...selectorPaddingMargin("margin",pMarginSelect,pMarginText)
        }}
        >
        Desde 
        <span
          className="mx-1"
          style={{
            color:pColor,
            fontSize:pSize,
            fontWeight:pWeight
          }}
        >
          {checkPrice(currentProduct.selectedVariant.price.amount)} €
        </span>  
        {currentProduct.selectedVariant.compareAtPrice?.amount && 
          <span
            style={{
              color:pCColor,
              fontSize:pCSize,
              fontWeight:pCWeight
            }}
          >
            {checkPrice(currentProduct.selectedVariant.compareAtPrice.amount)} €
          </span>}
      </p>
    </Section>
  )
}

export const schema= createSchema({
  type:"head-info",
  title:"Principal Info",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'text',
          label:'Title',
          name:'title',
          defaultValue:'MONARCH REMASTER',
        },
      ]
    },
    {
      group:"review",
      inputs:[
        
        {
          type:'color',
          label:'color',
          name:'rColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'rSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'rFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'rPaddingSelect',
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
          name:'rPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'rMarginSelect',
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
          name:'rMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'rWeight',
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
          defaultValue:'600',
        },
      ]
    },
    {
      group:"title",
      inputs:[
        
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'18px',
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
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'tMarginText',
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
          defaultValue:'600',
        },
      ]
    },
    {
      group:"price",
      inputs:[  
        {
          type:'color',
          label:'color text',
          name:'pTColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color compare price',
          name:'pCColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color Price',
          name:'pColor',
          defaultValue:'#A72A2F',
        },
        {
          type:'text',
          label:'font size text',
          name:'pTSize',
          defaultValue:'14px',
        },
        {
          type:'text',
          label:'font size compare price',
          name:'pCSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font size price',
          name:'pSize',
          defaultValue:'18px',
        },
        {
          type:'select',
          label:'Font weight text',
          name:'pTWeight',
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
          type:'select',
          label:'Font weight price',
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
          defaultValue:'400',
        },
        {
          type:'select',
          label:'Font weight compare price',
          name:'pCWeight',
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

      ]
    },
  ]
})
