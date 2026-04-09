import { createSchema } from "@weaverse/hydrogen";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

interface TimeLinePhoenixProps extends SectionProps{
  showTborder:boolean;
  showBborder:boolean;
  colorBorder:string;
  showLine:boolean;
  colorLineBorder:string;

}

export default function TimeLinePhoenix(props:TimeLinePhoenixProps){
  const {
    children,
    showTborder,
    showBborder,
    colorBorder,
    showLine,
    colorLineBorder,
    ...rest
  }=props

  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current || !showLine) return;

    // La línea crece desde 0% hasta 100% de altura al cargar
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 1.8, ease: "power4.out", delay: 0.5 }
    );
  }, [showLine]);
  return (
  <Section {...rest}
    style={{
      borderTop:showTborder?`1px solid ${colorBorder}`:"unset",
      borderBottom:showBborder?`1px solid ${colorBorder}`:"unset",
    }}
  >
    <div 
      ref={lineRef}
      style={{
      borderLeft: showLine ?`1px solid ${colorLineBorder}`:"unset"
      }}>
      {children}

    </div>
  </Section>
)
}

export const schema= createSchema({
  type:"legacy",
  title:"TimeLapse",
  childTypes:["timeLine-item"],
  settings:[
    {
      group:"general",
      inputs:[
        {
          type:'switch',
          label:'show top border',
          name:'showTborder',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show bottom border',
          name:'showBborder',
          defaultValue:true,
        },
        {
          type:'color',
          label:'color Border',
          name:'colorBorder',
          defaultValue:'#ffffff0d',
        },
        {
          type:'switch',
          label:'show line of time',
          name:'showLine',
          defaultValue:true,
        },
        {
          type:'color',
          label:'color Border',
          name:'colorLineBorder',
          defaultValue:'#ffffff0d',
        },
      ]
    },
    ...sectionSettings
  ]
})