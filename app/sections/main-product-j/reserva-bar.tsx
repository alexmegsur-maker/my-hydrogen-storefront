import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { Section } from "~/components/section";
import { useCurrentProduct } from "~/stores/currentProduct";
import "~/styles/reserva-bar.css"
import { selectorPaddingMargin } from "~/utils/general";

interface ReservaBarProps extends HydrogenComponentProps{
  color:string;
  border:number;
  borderColor:string;
  borderRadius:number;
  colorBar:string;
  colorpgsbar:string;
  colorpgs:string;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  title:string;
  tColor:string;
  tSize:string;
  tLetter:number;
  tUpper:string;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  qColor:string;
  qSize:string;
  qLetter:number;
  qUpper:string;
  qFamily:string;
  qPaddingSelect:string;
  qPaddingText:string;
  qMarginSelect:string;
  qMarginText:string;
  qWeight:string;
   
}

export default function ReservaBar(props:ReservaBarProps){

  const {
    color,
    border,
    borderColor,
    borderRadius,
    colorBar,
    colorpgsbar,
    colorpgs,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    title,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    qColor,
    qSize,
    qLetter,
    qUpper,
    qFamily,
    qPaddingSelect,
    qPaddingText,
    qMarginSelect,
    qMarginText,
    qWeight,
    ...rest
  } = props

  const currentProduct = useCurrentProduct((state)=>state.currentProduct)
  const selectedVar = currentProduct?.selectedVariant
  
  const styleTitle= {
    fontSize:tSize,
    letterSpacing:`${tLetter}px`,
    textTransform:tUpper && "uppercase",
    fontFamily:tFamily,
    fontWeight:tWeight,
    ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
    ...selectorPaddingMargin("margin",tMarginSelect,tMarginText)
  } as CSSProperties 
  
  const styleQty= {
    fontSize:qSize,
    letterSpacing:`${qLetter}px`,
    textTransform:qUpper && "uppercase",
    fontFamily:qFamily,
    fontWeight:qWeight,
    ...selectorPaddingMargin("padding",qPaddingSelect,qPaddingText),
    ...selectorPaddingMargin("margin",qMarginSelect,qMarginText)
  } as CSSProperties 


  if(currentProduct?.selectedVariant.fechaReserva?.value && currentProduct?.selectedVariant.totalReserva?.value && currentProduct?.selectedVariant.pedidosReserva?.value ){
    const calcularPorcentaje = (parseInt(selectedVar.pedidosReserva.value)/parseInt(selectedVar.totalReserva.value))*100
    
    return(
      <Section 
        {...rest}
        style={{
          backgroundColor: color,
          border: `${border}px solid ${borderColor}`, 
          borderRadius: `${borderRadius}px`,
          ...selectorPaddingMargin("padding",paddingSelect,paddingText),
          ...selectorPaddingMargin("margin",marginSelect,marginText)
        }}
      >
        {selectedVar.totalReserva.value == selectedVar.pedidosReserva.value ?
          <div 
            className=" sold-out"
            style={{
              marginBottom:"1.2rem"
            }}
          >
            <div className="flex justify-between items-end mb-[8px]">
              <span 
                className="phase-title"
                style={{
                  color:"#52525B",
                  ...styleTitle
                }}
              >
                {title}
              </span>
              <span 
                className="phase-status"
                style={{
                  color:"#71717A",
                  ...styleQty
                }}
                >
                Agotado
              </span>
            </div>
            <div 
              className="w-full h-[4px] rounded-[4px] overflow-hidden"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              <div className="progress-fill bg-[#27272A] w-full h-full relative overflow-hidden rounded-[4px]"
                style={{
                  transition: "width 1s ease",                   
                }}
              ></div>
            </div>
          </div>
          :
          <div className=" active">
            <div className=" flex justify-between items-end mb-[8px]">
              <span 
                className="phase-title"
                style={{
                  color:tColor,
                  ...styleTitle
                }}
                >
                {title}
              </span>
              <span 
                className="phase-status highlight"
                style={{
                  color:qColor,
                  ...styleQty
                }}
                >
                {calcularPorcentaje}% Reservado
              </span>
            </div>
            <div 
              className="w-full h-[4px] rounded-[4px] overflow-hidden"
              style={{
                backgroundColor:colorBar,
              }}
              >
              <div 
                className="progress-fill h-full relative overflow-hidden rounded-[4px]" 
                style={{
                  width:`${calcularPorcentaje}%`,
                  backgroundColor:colorpgsbar,
                  transition: "width 1s ease", 
                }}
                >
                <div className="absolute top-0 left-0 bottom-0 w-[40%]"
                  style={{
                    background:`linear-gradient(90deg, transparent, ${colorpgs},transparent)`,
                    boxShadow:`0 0 10px ${colorpgs}80`,
                    animation:"scanner-light 2s infinite cubic-bezier(0.4,0,0.2,1)"
                  }}
                ></div>
              </div>
            </div>
          </div>

        }
      </Section>
    )
  }
}


export const schema = createSchema({
  title:"reserva bar",
  type:"reserva-bar",
  settings:[
    {
      group:"General",
      inputs:[
         {
           type:'color',
           label:'background',
           name:'color',
           defaultValue:'#ffffff05',
         },
         {
           type:'range',
           label:'border',
           name:'border',
           defaultValue:1,
           configs:{
             min:0,
             max:50,
             step:1,
             unit:'px',
           }
         },
         {
           type:'color',
           label:'border color',
           name:'borderColor',
           defaultValue:'#ffffff0d',
         },
         {
           type:'range',
           label:'border radius',
           name:'borderRadius',
           defaultValue:8,
           configs:{
             min:0,
             max:50,
             step:1,
             unit:'px',
           }
         },
         {
           type:'color',
           label:'color bar',
           name:'colorBar',
           defaultValue:'#ffffff0d',
         },
         {
           type:'color',
           label:'color progress bar',
           name:'colorpgsbar',
           defaultValue:'#3F3F46',
         },
         {
           type:'color',
           label:'color progression',
           name:'colorpgs',
           defaultValue:'#FFFFFF',
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
          defaultValue:"1.5rem"
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
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Margin text',
          name:'marginText',
          defaultValue:"3rem"
        },

      ]
    },
    {
      group:"title",
      inputs:[
        {
          type:'text',
          label:'title',
          name:'title',
          defaultValue:'Fase 1: Asignación Actual',
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
          defaultValue:'0.8rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tLetter',
          defaultValue:1,
          configs:{
            min:1,
            max:50,
            step:1,
            unit:'px',
          }
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
      group:"quantity",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'qColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'qSize',
          defaultValue:'0.7rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'qLetter',
          defaultValue:1,
          configs:{
            min:1,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'qUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'qFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'qPaddingSelect',
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
          name:'qPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'qMarginSelect',
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
          name:'qMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'qWeight',
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
          defaultValue:'500',
        },
      ]
    },
  ]
})