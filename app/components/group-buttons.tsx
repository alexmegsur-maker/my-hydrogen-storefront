import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { Section } from "./section"
import { useEffect, useRef, type CSSProperties } from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";

interface groupButtonsProps extends HydrogenComponentProps{
  direction:string;
  gap:number;
  mbDirection:string;
  mbGap:number;
}

export default function groupButtons(props:groupButtonsProps){
  
  const {direction,gap,mbDirection,mbGap,children,...rest}=props
  
  const isMobile = useIsMobile(600);

  return(
    <Section  {...rest} className="flex overflow-visible"
      containerStyle={{
        overflow:"visible",
        display:"flex",
        flexDirection:!isMobile ? direction === "row" ? "row" : "column" : mbDirection === "row" ? "row" : "column",
        gap:!isMobile?`${gap}rem`:`${mbGap}rem`,
      }}
    >
      {children}
    </Section>
  )
}

export const schema = createSchema({
  type:"group-buttons",
  title:"group buttons",
  childTypes:["button"],
  settings:[
    {
      group:"Group buttons",
      inputs:[
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
          name:'gap',
          defaultValue:1,
          configs:{
            min:0,
            max:10,
            step:0.1,
            unit:'rem',
          }
        },
      ]
    },
    {
      group:"mobile Group buttons",
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
          name:'mbGap',
          defaultValue:1,
          configs:{
            min:0,
            max:10,
            step:0.1,
            unit:'rem',
          }
        },
      ]
    }
  ],
  presets: {
    direction:"row",
    gap:1,
    children: [
      {
        type: "button",
        content: "button 1",
        variant: "custom",
        backgroundColor: "#00000000",
        textColor: "#fff",
        borderColor: "#fff",
        backgroundColorHover: "#fff",
        textColorHover: "#000",
        borderColorHover: "#fff",
      },
      {
        type: "button",
        content: "button 2",
        variant: "custom",
        backgroundColor: "#00000000",
        textColor: "#fff",
        borderColor: "#fff",
        backgroundColorHover: "#fff",
        textColorHover: "#000",
        borderColorHover: "#fff",
      },
    ],
  },
})
