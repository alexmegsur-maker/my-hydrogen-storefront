import { createSchema, IMAGES_PLACEHOLDERS, useChildInstances, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { useEffect } from "react";
import { Image } from "~/components/image"
import { Section, sectionSettings } from "~/components/section"
import { useIsMobile } from "~/hooks/use-is-mobile";

export interface CardSelectorProps{
  ref: React.Ref<HTMLDivElement>;
  gap:number;
  borderColor:string;
}

export default function CardSelector( props: CardSelectorProps & HydrogenComponentProps ){
  
  const {
    ref,
    gap,
    borderColor,
    children=[],
    ...rest
  }=props

  const isMobile = useIsMobile(600)
  const childInstances =useChildInstances()
  const headerChildsId =childInstances.map(
    (instance:any)=>{ 
      if(instance.data.type=="heading"||instance.data.type=="subheading"){
        return instance.data.id
      }
      return null
    }
  ).filter((elm)=>elm != null)


  return(
  <Section ref={ref} {...rest} className="universes-wrapper">
    <div className="section-header-center">
      {children.map((child,idx)=>{
        if(headerChildsId.find((elm)=>elm ==child.props.id)){
          return child
        }
      })}
    </div>

    <div 
      className="universes-grid"
      style={{
        width: "100%",
        display: isMobile ?"flex":"grid",
        gridTemplateColumns: !isMobile ?"repeat(5, 1fr)":"unset",
        flexDirection:isMobile ? "column":"unset",
        gap: `${gap}rem`,
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`
      }}
      >
      {children.map((child,idx)=>{
        if(!headerChildsId.find((elm)=>elm ==child.props.id)){
          return child
        }
      })}
    </div>
  </Section>
  )
}

export const schema = createSchema({
  type:"card-selector",
  title:"Card selector",
  childTypes:[
    "subheading",
    "heading",
    "card-simple"
  ],
  settings:[
    ...sectionSettings,
    {
      group:"general",
      inputs:[
        {
          type:'range',
          label:'gap',
          name:'gap',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type:'color',
          label:'border color',
          name:'borderColor',
          defaultValue:'#ffffff0d',
        },
      ]
    }
  ],
  presets:{
    width:"full",
    children:[
      {
        type:"subheading",
        content:"COLECCIONES PRIVADAS",
        color:"#A1A1AA",
        size:"0.7rem",
        letter:3,
        marginSelect:"b",
        marginText:"1rem"
      },
      {
        type:"heading",
        content:"ELIGE TU UNIVERSO",
        color:"#fff",
        mobileSize:"3rem",
        desktopSize:"4rem",
        size:"custom",
        weight:"300",
        letterSpacing:2,
        marginSelect:"b",
        marginText:"2rem"
      },
      {
        type:"card-simple",
        image:{
          url:IMAGES_PLACEHOLDERS.product_5,
          altText:"alt text"
        },
        subheading:"CORE COLLECTION",
        heading:"ORIGIN EDITION",
        paragraph:"El estándar absoluto del alto rendimiento. Negro obsidiana puro.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
      {
        type:"card-simple",
        image:{
          url:IMAGES_PLACEHOLDERS.product_1,
          altText:"alt text"
        },
        subheading:"LICENCIA OFICIAL",
        heading:"REAL MADRID",
        paragraph:"El trono del Bernabéu. Escudo de alta fidelidad.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
      {
        type:"card-simple",
        image:{
          url:IMAGES_PLACEHOLDERS.product_2,
          altText:"alt text"
        },
        subheading:"EDICIÓN FANTASÍA",
        heading:"LORD OF THE RINGS",
        paragraph:"Forjada para la eternidad. Detalles en bronce élfico.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
      {
        type:"card-simple",
        image:{
          url:IMAGES_PLACEHOLDERS.product_3,
          altText:"alt text"
        },
        subheading:"CRUNCHYROLL™",
        heading:"BLACK CLOVER",
        paragraph:"Supera tus límites. Diseño inspirado en los Toros Negros.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
      {
        type:"card-simple",
        image:{
          url:IMAGES_PLACEHOLDERS.product_4,
          altText:"alt text"
        },
        subheading:"CRUNCHYROLL™",
        heading:"SOLO LEVELING",
        paragraph:"Asciende de rango. Estética sombría y energía del Monarca.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
    ]
  }
})