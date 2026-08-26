import { useGSAP } from "@gsap/react";
import { createSchema, IMAGES_PLACEHOLDERS, useChildInstances, type HydrogenComponentProps } from "@weaverse/hydrogen"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Image } from "~/components/image"
import { Section, sectionSettings } from "~/components/section"
import "./card-universes.css"


export interface CardUniversesProps{
  ref: React.Ref<HTMLDivElement>;
  gap:number;
  borderColor:string;
  fadeY: number;
  fadeDuration: number;
  staggerDelay: number;
  numberElm:number;
}

export default function CardUniverses( props: CardUniversesProps & HydrogenComponentProps ){
  
  const {
    ref,
    gap,
    borderColor,
    children=[],
    fadeY,
    fadeDuration,
    staggerDelay,
    numberElm,
    ...rest
  }=props

  const childInstances =useChildInstances()
  const headerChildsId =childInstances.map(
    (instance:any)=>{ 
      if(instance.data.type=="heading"||instance.data.type=="subheading"){
        return instance.data.id
      }
      return null
    }
  ).filter((elm)=>elm != null)

  const container=useRef(null)
  
    useGSAP(
      () => {
        gsap.registerPlugin(ScrollTrigger)

        // Selecciona los hijos directos del contenedor
        const items = gsap.utils.toArray<HTMLElement>(
          ":scope > *",
          container.current!,
        );
   
        if (!items.length) return;
   
        // Estado inicial — invisible y desplazados hacia abajo
        gsap.set(items, {
          opacity: 0,
          y: fadeY ?? 40,
        });
   
        // Animación de entrada con stagger, disparada por ScrollTrigger
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: fadeDuration ?? 0.7,
          ease: "power2.out",
          stagger: staggerDelay ?? 0.12,
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",   // empieza cuando el top del contenedor alcanza el 85% del viewport
            toggleActions: "play none none none", // solo se reproduce una vez
          },
        });
      },
      // Re-ejecuta si cambian los valores de animación o el número de hijos
      {
        scope: container,
        dependencies: [fadeY, fadeDuration, staggerDelay],
      },
    );


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
      className="universes-grid flex flex-col min-[600px]:grid"
      ref={container}
      style={{
        width: "100%",
        gridTemplateColumns: `repeat(${numberElm}, 1fr)`,
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
  type:"card-universes",
  title:"Cards Universe",
  childTypes:[
    "subheading",
    "heading",
    "card-universe",
  ],
  settings:[
    {
      group:"general",
      inputs:[
        {
          type:'range',
          label:'elements per row',
          name:'numberElm',
          defaultValue:4,
          configs:{
            min:2,
            max:10,
            step:1,
            unit:'elm',
          }
        },
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
    },
    {
      group: "Animación",
      inputs: [
        {
          type: "range",
          label: "Desplazamiento inicial (Y)",
          name: "fadeY",
          defaultValue: 40,
          configs: { min: 0, max: 120, step: 4, unit: "px" },
        },
        {
          type: "range",
          label: "Duración fade",
          name: "fadeDuration",
          defaultValue: 0.7,
          configs: { min: 0.2, max: 2, step: 0.1, unit: "s" },
        },
        {
          type: "range",
          label: "Delay entre items (stagger)",
          name: "staggerDelay",
          defaultValue: 0.12,
          configs: { min: 0, max: 0.6, step: 0.02, unit: "s" },
        },
      ],
    },
    ...sectionSettings,
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
        type:"card-universe",
        image:{
          url:IMAGES_PLACEHOLDERS.product_5,
          altText:"alt text"
        },
        theme:"origin",
        auraColor:"#5b6472",
        tintColor:"#1b1f26",
        veilColor:"#0a0c10",
        accentColor:"#e6e9ef",
        auraStrength:0.75,
        smokeStrength:0.7,
        tendrilsFactor:0.45,
        soulsFactor:0.6,
        soulSizeMin:1,
        soulSizeMax:2.4,
        subheading:"CORE COLLECTION",
        heading:"ORIGIN EDITION",
        paragraph:"El estándar absoluto del alto rendimiento. Negro obsidiana puro.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
      {
        type:"card-universe",
        image:{
          url:IMAGES_PLACEHOLDERS.product_2,
          altText:"alt text"
        },
        theme:"lotr",
        whisperText:"Eternity",
        auraColor:"#8a6a2f",
        tintColor:"#2a2113",
        veilColor:"#140e05",
        accentColor:"#f2d391",
        auraStrength:0.5,
        smokeStrength:0.3,
        tendrilsFactor:0.2,
        soulsFactor:1.4,
        soulSizeMin:1,
        soulSizeMax:2.8,
        subheading:"MIDDLE EARTH™",
        heading:"LORD OF THE RINGS",
        paragraph:"Forjada para la eternidad. Detalles en bronce élfico.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
      {
        type:"card-universe",
        image:{
          url:IMAGES_PLACEHOLDERS.product_3,
          altText:"alt text"
        },
        theme:"clover",
        whisperText:"Surpass",
        auraColor:"#a3101f",
        tintColor:"#2a0a0e",
        veilColor:"#180205",
        accentColor:"#ff3b3b",
        auraStrength:0.8,
        smokeStrength:0.8,
        tendrilsFactor:0.8,
        soulsFactor:1.2,
        soulSizeMin:1.4,
        soulSizeMax:3.4,
        subheading:"CRUNCHYROLL™",
        heading:"BLACK CLOVER",
        paragraph:"Supera tus límites. Diseño inspirado en los Toros Negros.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
      {
        type:"card-universe",
        image:{
          url:IMAGES_PLACEHOLDERS.product_4,
          altText:"alt text"
        },
        theme:"solo",
        whisperText:"Arise",
        auraColor:"#6d28d9",
        tintColor:"#1a1030",
        veilColor:"#0a0418",
        accentColor:"#a78bfa",
        auraStrength:0.8,
        smokeStrength:0.35,
        tendrilsFactor:0.6,
        soulsFactor:0.9,
        soulSizeMin:1.4,
        soulSizeMax:2.8,
        fringeCount:16,
        subheading:"CRUNCHYROLL™",
        heading:"SOLO LEVELING",
        paragraph:"Asciende de rango. Estética sombría y energía del Monarca.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
      {
        type:"card-universe",
        image:{
          url:IMAGES_PLACEHOLDERS.product_1,
          altText:"alt text"
        },
        theme:"madrid",
        whisperText:"Campeones",
        auraColor:"#c9a227",
        tintColor:"#11151f",
        veilColor:"#080a10",
        accentColor:"#f7d97a",
        auraStrength:0.6,
        smokeStrength:0.25,
        tendrilsFactor:0.15,
        soulsFactor:1.1,
        soulSizeMin:1,
        soulSizeMax:2.6,
        confettiFactor:3.2,
        subheading:"EDICIÓN CLUB",
        heading:"REAL MADRID",
        paragraph:"Blanco impoluto. Oro en cada costura, historia en cada detalle.",
        linkText:"Explorar",
        lPaddingSelect:"t",
        lPaddingText:"auto",
      },
    ]
  }
})