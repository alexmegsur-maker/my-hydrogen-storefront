import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Section, sectionSettings, type SectionProps } from "./section";
import { useIsMobile } from "~/hooks/use-is-mobile";

interface GroupElementsProps extends SectionProps{
  direction:string;
  gapCont:number;
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
  const {direction,gapCont,mbDirection,mbGapCont,showBorder,showBorderBottom,showBorderLeft,showBorderRight,colorBorder,alignContent,mbAlignContent,children,...rest}=props
  
  const isMobile = useIsMobile(600);

  return(
    <Section  {...rest} 
      className="flex overflow-visible"
      style={{
        borderTop:showBorder?`1px solid ${colorBorder}`:"unset",
        borderBottom:showBorderBottom?`1px solid ${colorBorder}`:"unset",
        borderLeft:showBorderLeft?`1px solid ${colorBorder}`:"unset",
        borderRight:showBorderRight?`1px solid ${colorBorder}`:"unset",
      }}
      containerStyle={{
        overflow:"visible",
        display:"flex",
        flexDirection:!isMobile ? direction === "row" ? "row" : "column" : mbDirection === "row" ? "row" : "column",
        gap:!isMobile?`${gapCont}rem`:`${mbGapCont}rem`,
        justifyContent:isMobile ? "normal": direction=="row"?alignContent:"normal",
        alignContent:!isMobile ? direction=="column" ? alignContent:"normal":mbAlignContent
      }}
    >
      {children}
    </Section>
  )
}

export const schema =createSchema({
  type:"group-elements",
  title:"group elements",
  childTypes:[
    "heading",
    "subheading",
    "paragraph",
    "button",
    "image-with-text--content",
    "copybutton",
    "discountCountBar"
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
          label:'direction',
          name:'direction',
          configs:{
            options:[
              {value:'row',label:'row'},
              {value:'column',label:'column'},
            ]
          },
          defaultValue:"row",
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
          label:'direction',
          name:'mbDirection',
          configs:{
            options:[
              {value:'row',label:'row'},
              {value:'column',label:'column'},
            ]
          },
          defaultValue:"row",
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