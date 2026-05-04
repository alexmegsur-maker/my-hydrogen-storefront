import { createSchema, type ComponentLoaderArgs } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

const  GET_LOTES_DISCOUNT_METAOBJECT = `
  query GetLotesDiscountByHandle($handle:MetaobjectHandleInput!){
    metaobject(handle:$handle){
      id
      fields{
        key
        value
      }
    }
  }
`


interface DiscountCountBarProps{
  code:string;
  availableText:string;
  usedText:string;
  text:string;
  loaderData:{
    result:any|null
  };
  
  vGap:number;
  hGap:number;
  qColor:string;
  qSize:string;
  qWeight:string;
  qShadow:string;
  qletter:number;
  qFamily:string;
  tqColor:string;
  tqSize:string;
  tqWeight:string;
  tqShadow:string;
  tqletter:number;
  tqFamily:string;
  bgBar:string;
  bar:string;
  tColor:string;
  tSize:string;
  tWeight:string;
  tletter:number;
  tFamily:string;
}

export async function loader({weaverse,data}:ComponentLoaderArgs<DiscountCountBarProps>){
  const {storefront}=weaverse
  const {code}=data
  const datos = await storefront.query(GET_LOTES_DISCOUNT_METAOBJECT,{
    variables:{
      handle:{
        handle:code,
        type:"descuento_por_lotes"
      }
    }
  })

  return {result:datos ?? null}
}


function DiscountCountBar(props:DiscountCountBarProps){
  const{
    loaderData,
    availableText,
    usedText,
    text,
    vGap,
    hGap,
    qColor,
    qSize,
    qWeight,
    qShadow,
    qletter,
    qFamily,
    tqColor,
    tqSize,
    tqWeight,
    tqShadow,
    tqletter,
    tqFamily,
    bgBar,
    bar,
    tColor,
    tSize,
    tWeight,
    tletter,
    tFamily
  }=props 
  const result = loaderData?.result
  const [discountInfo,setDiscountInfo] = useState({
    total:0,
    utilizado:0,
    porcentaje:100
  })
  useEffect(()=>{
    const info = result?.metaobject.fields
    let total = parseInt(info.find((e)=>e.key=="total").value) 
    let utilizado = parseInt(info.find((e)=>e.key=="utilizado").value) 
    console.log("info",info)
    setDiscountInfo({
      total:total,
      utilizado:utilizado,
      porcentaje:(utilizado/total)*100
    })
  },[result])
 return (
  <div 
    className="flex flex-col items-center"
    style={{
      gap:`${vGap}rem`
    }}
    >    
    <div className="flex gap-[2rem]"
      style={{
        gap:`${hGap}rem`
      }}
    >
      <div className="text-center">
        <div 
          style={{
            fontFamily: qFamily,
            fontSize:qSize,
            fontWeight:qWeight,
            color: qColor,
            textShadow:qShadow,
            letterSpacing:qletter,

          }}
          >
          {discountInfo.utilizado}
        </div>
        <div 
          style={{
            fontFamily:tqFamily,
            fontSize:tqSize,
            fontWeight:tqWeight,
            color:tqColor,
            letterSpacing:tqletter,
            textShadow:tqShadow,
            textTransform:"uppercase"
          }}
          >
          {usedText}
        </div>
      </div>
      <div className="text-center">
        <div 
          style={{
            fontFamily: qFamily,
            fontSize:qSize,
            fontWeight:qWeight,
            color: qColor,
            textShadow:qShadow,
            letterSpacing:qletter,
          }}
          >
          {discountInfo.total-discountInfo.utilizado}
        </div>
        <div 
          style={{
            fontFamily:tqFamily,
            fontSize:tqSize,
            fontWeight:tqWeight,
            color:tqColor,
            letterSpacing:tqletter,
            textShadow:tqShadow,
            textTransform:"uppercase"
          }}
          >
          {availableText}
        </div>
      </div>
    </div>
    <div 
      style={{
        width:"100%",
        height:"6px",
        background:bgBar,
        borderRadius:"3px",
        overflow:"hidden",
        position:"relative"
      }}
      >
      <div 
        style={{
          width:`${discountInfo.porcentaje}%`,
          position:"absolute",
          top:0,
          left:0,
          height:"100%",
          background:bar,
          transition:"width 2s ease",
          boxShadow:`0 0 15px ${bar}`,
          overflow:"hidden"
        }}
        />
    </div>
    <span 
      style={{
          fontFamily:tFamily,
          fontSize:tSize,
          fontWeight:tWeight,
          color:tColor,
          letterSpacing:tletter,
      }}
      >
      {discountInfo.porcentaje}% {text}
    </span>
  </div>
 )
}

export default DiscountCountBar;

export const schema = createSchema({
  type:"discountCountBar",
  title:"DiscountCountBar",
  settings:[
    {
      group:"info",
      inputs:[
        {
          type:'text',
          label:'discount code',
          name:'code',
          defaultValue:'founder',
        },
        {
          type:'text',
          label:'available text',
          name:'availableText',
          defaultValue:'Disponible',
        },
        {
          type:'text',
          label:'used text',
          name:'usedText',
          defaultValue:'Reservadas',
        },
        {
          type:'text',
          label:'porcentaje text',
          name:'text',
          defaultValue:'de unidades reservadas · Disponibilidad inmediata',
        },
        {
          type:'range',
          label:'vertical gap',
          name:'vGap',
          defaultValue:1.5,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type:'range',
          label:'horizontal gap',
          name:'hGap',
          defaultValue:2,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'rem',
          }
        },
      ]
    },
    {
      group:"quantity",
      inputs:[
        
        {
          type:'color',
          label:'color',
          name:'qColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'font size',
          name:'qSize',
          defaultValue:'2rem',
        },
        {
          type: "select",
          name: "qWeight",
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
          defaultValue: "600",
        },
        {
          type:'text',
          label:'text shadow',
          name:'qShadow',
          defaultValue:'0 0 15px #ffffff4d',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'qletter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'font family',
          name:'qFamily',
          defaultValue:'Montserrat',
        },
      ]
    },
    {
      group:"text quantities",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'tqColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'font size',
          name:'tqSize',
          defaultValue:'2rem',
        },
        {
          type: "select",
          name: "tqWeight",
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
          defaultValue: "400",
        },
        {
          type:'text',
          label:'text shadow',
          name:'tqShadow'
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tqletter',
          defaultValue:1,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'font family',
          name:'tqFamily',
          defaultValue:'Montserrat',
        },
      ]
    },
    {
      group:"progressbar",
      inputs:[
        {
          type:'color',
          label:'background color',
          name:'bgBar',
          defaultValue:'#a1a1aa',
        },
        {
          type:'color',
          label:'progress color',
          name:'bar',
          defaultValue:'#FFFFFF',
        },
      ]
    },
    {
      group:"helpText",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'0.9rem',
        },
        {
          type: "select",
          name: "tWeight",
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
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tletter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Montserrat',
        },
      ]
    }
  ]
})