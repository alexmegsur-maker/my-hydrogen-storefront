import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { Section, sectionSettings, type SectionProps } from "~/components/section";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { cn } from "~/utils/cn";

interface InstrucctionStepProps extends SectionProps{
  title:string;
  heightSize:"auto"|"100vh";
  activeDots:boolean;

}

export default function InstrucctionStep(props:InstrucctionStepProps){
  const {title ,heightSize, activeDots,children,...rest}=props
  const isMobile =useIsMobile(600)
  return(
    <Section {...rest} 
    id={title.replaceAll(" ","").toLowerCase()}
    containerStyle={{
      height:!isMobile? heightSize :"auto"
    }as CSSProperties} 
    containerClassName={cn(activeDots ? "fabric-wrapper relative flex flex-col justify-center" : "z-1",)}
    >
      {children}
    </Section>
  )
}

export const  schema = createSchema({
  type:"instruction-step",
  title:"step",
  childTypes:["table","subheading","heading","paragraph","image-with-text","hero-image"],
  settings:[
    {
      group:"content",
      inputs:[
        {
          type:'text',
          label:'step Title',
          name:'title',
          defaultValue:'texto',
          helpText:"obligatorio rellenar este apartado ya que es lo que nos permitira hace la navegación"
        },
        {
          type:'select',
          label:'height size',
          name:'heightSize',
          configs:{
            options:[
              {value:'auto',label:'auto'},
              {value:'100dvh',label:'100dvh'},
            ]
          },
          defaultValue:"auto",
        },
        {
          type: "switch",
          label: "active effect docts",
          name: "activeDots",
          defaultValue: false,
        },
      ]
    },
    ...sectionSettings
  ]
})