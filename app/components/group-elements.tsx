import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Section, sectionSettings, type SectionProps } from "./section";
import { useIsMobile } from "~/hooks/use-is-mobile";

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
}

export default function GroupElements (props:GroupElementsProps & HydrogenComponentProps){
  const {direction,gapCont,mbDirection,displayDiv,mbDisplayDiv,columnsGrid,mbColumnsGrid,mbGapCont,showBorder,showBorderBottom,showBorderLeft,showBorderRight,colorBorder,alignContent,mbAlignContent,children,...rest}=props
  
  const isMobile = useIsMobile(600);
  // Los grupos creados antes de añadir "display" no tienen el valor guardado:
  // sin el fallback quedaban con display undefined (bloque) en vez de flex.
  const display = (isMobile ? mbDisplayDiv : displayDiv) ?? "flex";
  const columns = (isMobile ? mbColumnsGrid : columnsGrid) ?? 2;

  return(
    <Section  {...rest}
      // La separación la gestiona gapCont (CSS gap). El "Items spacing" de Section
      // usa space-y-*, que pone margin-bottom a todos los hijos menos el último:
      // en fila, el primer elemento quedaba más bajo que el resto.
      gap={0}
      className="flex overflow-visible"
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
        )

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