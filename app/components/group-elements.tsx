import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Section, sectionSettings, type SectionProps } from "./section";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

interface GroupElementsProps extends SectionProps{
  direction:string;
  gapCont:number;
  displayDiv:"grid"|"flex";
  columnsGrid:number;
  mbDisplayDiv:"grid"|"flex";
  mbColumnsGrid:number;
  mbDirection:string;
  mbGapCont:number;
  alignContent:"normal"|"center"|"flex-start"|"flex-end"|"space-between"|"space-around"|"space-evenly"|"baseline"|"stretch";
  mbAlignContent:"normal"|"center"|"flex-start"|"flex-end"|"space-between"|"space-around"|"space-evenly"|"baseline"|"stretch";
  showBorder:boolean;
  showBorderBottom:boolean;
  showBorderLeft:boolean;
  showBorderRight:boolean;
  colorBorder:string;
  enableMaxHeight:boolean;
  maxHeight:string;
}

export default function GroupElements (props:GroupElementsProps & HydrogenComponentProps){
  const {ref:weaverseRef,direction,gapCont,mbDirection,displayDiv,mbDisplayDiv,columnsGrid,mbColumnsGrid,mbGapCont,showBorder,showBorderBottom,showBorderLeft,showBorderRight,colorBorder,
    enableMaxHeight,maxHeight,alignContent,mbAlignContent,children,...rest}=props

  const ref= useRef<HTMLElement>(null)
  const lenis=useLenis()
  // Weaverse pasa su propio ref en props: hay que rellenar los dos
  // (el suyo lo necesita el editor para seleccionar el componente)
  const setRefs = (node: HTMLElement | null) => {
    ref.current = node;
    if (typeof weaverseRef === "function") {
      weaverseRef(node);
    } else if (weaverseRef) {
      weaverseRef.current = node;
    }
  };
  const [atTop,setAtTop]= useState(false)

  useEffect(() => {
    const section = ref.current;

    if (!enableMaxHeight || !section) {
      setAtTop(false);
      return;
    }

    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.setAttribute("style", `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 10vh;
      transform: translateY(-100%);
      pointer-events: none;
      `
    );
    section.prepend(sentinel);
    console.log("entra aqui ", sentinel)

    const observer = new IntersectionObserver(([entry]) => {
      setAtTop(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [enableMaxHeight]);

  useEffect(() => {
    const inner = ref.current?.lastElementChild as HTMLElement | null; // contenedor con overflow del Section
    if (!atTop || !lenis || !inner) return;
    // lenis.scrollTo(section, { immediate: true });
    inner.setAttribute("data-lenis-prevent", "");
    lenis.stop();
    let locked = true;

    // Escucha la rueda en toda la ventana (no solo encima del componente) y
    // la redirige al scroll interno mientras la página está bloqueada
    const onWheel = (e: WheelEvent) => {
      if (!locked) return;
      const atEnd = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;
      const atStart = inner.scrollTop <= 0;
      if ((e.deltaY > 0 && atEnd) || (e.deltaY < 0 && atStart)) {
        locked = false;
        lenis.start();
        return;
      }
      e.preventDefault();
      // deltaMode 1 = líneas (Firefox): se pasa a píxeles
      inner.scrollTop += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      lenis.start();
    };
  }, [atTop, lenis]);


  const isMobile = useIsMobile(600);
  // Los grupos creados antes de añadir "display" no tienen el valor guardado:
  // sin el fallback quedaban con display undefined (bloque) en vez de flex.
  const display = (isMobile ? mbDisplayDiv : displayDiv) ?? "flex";
  const columns = (isMobile ? mbColumnsGrid : columnsGrid) ?? 2;

  return(
    <Section {...rest} ref={setRefs}

      // La separación la gestiona gapCont (CSS gap). El "Items spacing" de Section
      // usa space-y-*, que pone margin-bottom a todos los hijos menos el último:
      // en fila, el primer elemento quedaba más bajo que el resto.
      gap={0}
      className="flex overflow-visible groupElements"
      style={{
        borderTop:showBorder?`1px solid ${colorBorder}`:"unset",
        borderBottom:showBorderBottom?`1px solid ${colorBorder}`:"unset",
        borderLeft:showBorderLeft?`1px solid ${colorBorder}`:"unset",
        borderRight:showBorderRight?`1px solid ${colorBorder}`:"unset",
      }}
      containerStyle={{
        overflow:"visible",
        display,
        gap:!isMobile?`${gapCont}rem`:`${mbGapCont}rem`,
        // Se mira el display activo (móvil o escritorio), no siempre el de escritorio
        ...(display =="flex"&& {
            flexDirection:!isMobile ? direction === "row" ? "row" : "column" : mbDirection === "row" ? "row" : "column",
            justifyContent:isMobile ? "normal": direction=="row"?alignContent:"normal",
            alignContent:!isMobile ? direction=="column" ? alignContent:"normal":mbAlignContent
          }
        ),
        ...(display =="grid" && {
            gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`
          }
        ),
        ...(enableMaxHeight && {
          maxHeight:maxHeight,
          overflowY:"scroll",
          height:"fit-content"
        })
      }}
    >
      {children}
    </Section>
  )
}

export const schema =createSchema({
  type:"group-elements",
  title:"group elements",
  enabledOn: {
    groups: ['*'],
  },
  childTypes:[
    "heading",
    "subheading",
    "paragraph",
    "button",
    "image-with-text--content",
    "copybutton",
    "discountCountBar",
    "principal-card", 
    "group-buttons",
    "card-simple",
    "size-recommender",
    "column-with-image--item",
    "simple-table"
  ],
  settings:[
    ...sectionSettings,
    {
      group:"Group elements",
      inputs:[
        {
          type:'switch',
          label:'show top border ',
          name:'showBorder',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show bottom border ',
          name:'showBorderBottom',
          defaultValue:false,
        },
        {
          type:'switch',
          label:'show left border ',
          name:'showBorderLeft',
          defaultValue:false,
        },
        {
          type:'switch',
          label:'show right border ',
          name:'showBorderRight',
          defaultValue:false,
        },
        {
          type:'color',
          label:'color Border',
          name:'colorBorder',
          defaultValue:'#ffffff0d',
          condition:(data)=>data.showBorder==true
        },
        {
          type:'switch',
          label:'enable maxHeight',
          name:'enableMaxHeight',
          defaultValue:false,
        },
        {
          type:'text',
          label:'max height',
          name:'maxHeight',
          defaultValue:'10rem',
          condition:(data)=>Boolean(data.enableMaxHeight)
        },
        {
          type:'select',
          label:'display',
          name:'displayDiv',
          configs:{
            options:[
              {value:'grid',label:'grid'},
              {value:'flex',label:'flex'},
            ]
          },
          defaultValue:'flex',
        },

        
        {
          type:'select',
          label:'direction',
          name:'direction',
          configs:{
            options:[
              {value:'row',label:'row'},
              {value:'column',label:'column'},
            ]
          },
          defaultValue:"row",
          condition:(e:GroupElementsProps)=>e.displayDiv == "flex"
        },
        {
          type:'range',
          label:'number of Column',
          name:'columnsGrid',
          defaultValue:2,
          configs:{
            min:1,
            max:5,
            step:1,
            unit:'col',
          },
          condition:(e:GroupElementsProps)=>e.displayDiv == "grid"
        },
        {
          type:'range',
          label:'gap',
          name:'gapCont',
          defaultValue:1,
          configs:{
            min:0,
            max:10,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type: "select",
          name: "alignContent",
          label: "Content alignment",
          configs: {
            options: [
              { value: "normal", label: "Normal" },
              { value: "center",label: "Center"},
              { value: "flex-start", label: "Start" },
              { value: "flex-end", label: "End" },
              { value: "space-between", label: "Space between" },
              { value: "space-around", label: "Space around" },
              { value: "space-evenly", label: "Space evenly" },
              { value: "baseline", label: "Baseline" },
              { value: "stretch", label: "Stretch" },
            ],
          },
          defaultValue: "normal",
        },
      ]
    },
    {
      group:"mobile Group elements",
      inputs:[
        {
          type:'select',
          label:'display',
          name:'mbDisplayDiv',
          configs:{
            options:[
              {value:'grid',label:'grid'},
              {value:'flex',label:'flex'},
            ]
          },
          defaultValue:'flex',
        },
        {
          type:'select',
          label:'direction',
          name:'mbDirection',
          configs:{
            options:[
              {value:'row',label:'row'},
              {value:'column',label:'column'},
            ]
          },
          defaultValue:"row",
          condition:(e:GroupElementsProps)=>e.mbDisplayDiv == "flex"
        },
        {
          type:'range',
          label:'number of Column',
          name:'mbColumnsGrid',
          defaultValue:2,
          configs:{
            min:1,
            max:5,
            step:1,
            unit:'col',
          },
          condition:(e:GroupElementsProps)=>e.mbDisplayDiv == "grid"
        },
        {
          type:'range',
          label:'gap',
          name:'mbGapCont',
          defaultValue:1,
          configs:{
            min:0,
            max:10,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type: "select",
          name: "mbAlignContent",
          label: "Content alignment",
          configs: {
            options: [
              { value: "normal", label: "Normal" },
              { value: "center",label: "Center"},
              { value: "flex-start", label: "Start" },
              { value: "flex-end", label: "End" },
              { value: "space-between", label: "Space between" },
              { value: "space-around", label: "Space around" },
              { value: "space-evenly", label: "Space evenly" },
              { value: "baseline", label: "Baseline" },
              { value: "stretch", label: "Stretch" },
            ],
          },
          defaultValue: "normal",
        },
      ]
    }
  ]
})