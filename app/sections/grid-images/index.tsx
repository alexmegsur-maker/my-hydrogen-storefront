import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { useEffect, useState } from "react";
import { selectorPaddingMargin } from "~/utils/general";

interface GridImagesProps extends HydrogenComponentProps{
  title:string;
  description:string;
  bgColor:string;
  container:number;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  tColor:string;
  tSize:string;
  tLetterSpacing:string;
  tWeight:number;
  tAlignment:"left"|"center"|"right"|"justify";
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  dColor:string;
  dSize:string;
  dLetterSpacing:string;
  dWeight:number;
  dAlignment:"left"|"center"|"right"|"justify";
  dFamily:string;
  dPaddingSelect:string;
  dPaddingText?:string;
  dMarginSelect:string;
  dMarginText?:string;
}

function GridImages(props:GridImagesProps){
  const{
    title,
    description,  
    bgColor,
    container,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    tColor,
    tSize,
    tLetterSpacing,
    tWeight,
    tAlignment,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    dColor,
    dSize,
    dLetterSpacing,
    dWeight,
    dAlignment,
    dFamily,
    dPaddingSelect,
    dPaddingText,
    dMarginSelect,
    dMarginText,
    children
    }=props

    const [isMobile,setIsMobile]= useState(false)
  
    useEffect(()=>{
      if(window.innerWidth < 700){
        setIsMobile(true)
      }
    },[])
  return (  
    <div 
      className="py-16 lg:py-32"
      style={{
        background:bgColor,
      }}
      >
      <div 
        className="mx-auto text-center px-4 mb-8 lg:mb-10"
        style={{
          width:!isMobile &&`${container}%`,         
          ...selectorPaddingMargin("padding",paddingSelect,paddingText),
          ...selectorPaddingMargin("margin",marginSelect,marginText),
        }}
        >
        <h3 
          className="mb-3"
          style={{
            fontSize:isMobile ? "36px":tSize,
            color:tColor,
            textAlign:tAlignment,
            letterSpacing:tLetterSpacing,
            fontWeight:tWeight,
            fontFamily:tFamily,
            ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
            ...selectorPaddingMargin("margin",tMarginSelect,tMarginText),
          }}
          >
          {title}
        </h3>
        <p 
          className="mb-6 lg:mb-8" 
          dangerouslySetInnerHTML={{__html:description}}
          style={{
            fontSize:isMobile ? "18px" : dSize,
            color:dColor,
            textAlign:dAlignment,
            letterSpacing:dLetterSpacing,
            fontWeight:dWeight,
            fontFamily:dFamily,
            ...selectorPaddingMargin("padding",dPaddingSelect,!isMobile && dPaddingText),
            ...selectorPaddingMargin("margin",dMarginSelect,!isMobile && dMarginText),
          }}          
          >
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:px-16">
        {children}
      </div>
    </div>
  )
}
export default GridImages

export const schema =createSchema({
  type:"gridImages",
  title:"Grid Images",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'text',
          label:'title',
          name:'title',
          defaultValue:'Grid Images title',
        },
        {
          type:'textarea',
          label:'description',
          name:'description',
          defaultValue:'<b>Lorem ipsum dolor</b> sit amet consectetur adipiscing elit ante porttitor fermentum, cum porta odio in quis tincidunt laoreet mollis pretium, urna commodo aenean class nisi cursus per dignissim etiam.',
        },
        {
          type:'color',
          label:'background color',
          name:'bgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'range',
          label:'width container',
          name:'container',
          defaultValue:80,
          configs:{
            min:5,
            max:100,
            step:1,
            unit:'%',
          },
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
        },
        {
          type:'select',
          label:'Margin type',
          name:'marginSelect',
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
          name:'marginText',
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
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'60px',
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'tLetterSpacing',
          defaultValue:'normal',       
        },
        {
          type:'range',
          label:'font Weight',
          name:'tWeight',
          defaultValue:700,
          configs:{
            min:100,
            max:900,
            step:100,
            unit:'%',
          }
        },
        {
          type:'select',
          label:'Content alignment',
          name:'tAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
              {value:'justify',label:'Justify'},
            ]
          },
          defaultValue:"center",
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Monserrat',
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
      ]
    },
    {
      group:"description",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'dColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'font size',
          name:'dSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'dLetterSpacing',
          defaultValue:'normal',       
        },
        {
          type:'range',
          label:'font Weight',
          name:'dWeight',
          defaultValue:700,
          configs:{
            min:100,
            max:900,
            step:100,
            unit:'%',
          }
        },
        {
          type:'select',
          label:'Content alignment',
          name:'dAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
              {value:'justify',label:'Justify'},
            ]
          },
          defaultValue:"center",
        },
        {
          type:'text',
          label:'font family',
          name:'dFamily',
          defaultValue:'Monserrat',
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
      ]
    }
  ],childTypes:['slideImages','central']
  
})