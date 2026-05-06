import { createSchema, useChildInstances } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

interface InstrucctionProps extends SectionProps{
  color:string;
  colord:string;
  spaceDot:number;
  space:number;
  size:string;
  letter:number;
  weight:string;
}


export default function Instrucction(props:InstrucctionProps){
  const {color,colord,spaceDot,space,size,letter,weight,children,...rest}=props
  const childInstances= useChildInstances()
  const [active,setActive] = useState("")
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    if (!childInstances.length) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Filtramos solo los que están intersectando y cogemos el más cercano al top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      {
        threshold: 0,
        // El elemento se activa cuando su borde superior cruza el 20% superior de la pantalla
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    childInstances.forEach((instance) => {
      const id = instance.data.title.replaceAll(" ", "").toLowerCase();
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [childInstances]);

  const scrollToStep = (stepId: string) => {
    const el = document.getElementById(stepId);
    if (!el) return;

    // Posición exacta del elemento relativa al scroll actual
    const top = el.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return(
    <Section {...rest}>
      <nav 
        className=" fixed hidden md:flex top-[50%] md:right-[1rem] lg:right-[2rem] flex-col items-end z-100"
        style={{
          gap:`${space}rem`,
          transform:"translateY(-50%)"
        }}
      >
        {childInstances.map((instance,idx)=>{
          const identificacion= instance.data.title.replaceAll(" ","").toLowerCase()
          const selected = active == identificacion
          return(
            <div 
              key={idx}
              onClick={()=>scrollToStep(identificacion)}
              className="flex items-center cursor-pointer"
              style={{
                gap:`${spaceDot}rem`,
                opacity:selected ?1:0.4,
                transition:"all 0.4s ease"
              }}
            >
              <span
                style={{
                  color:selected ?color:colord,
                  fontWeight:weight,
                  fontSize:size,
                  letterSpacing:letter>0 ? `${letter}px`:"normal"
                }}
                >
                {instance.data.title}
              </span>
              <span
                style={{
                  width:"6px",
                  height:"6px",
                  border:`1px solid ${colord}`,
                  borderRadius:"50%",
                  transition:"all 0.4s ease",
                  background:selected ? color:undefined,
                  boxShadow:selected ?`0 0 10px ${color}`:undefined, 
                  transform:selected ?`scale(1.5)`:undefined 
                }}
              ></span>
            </div>
          )
        })}

      </nav>
      {children}
    </Section>
  )
}

export const  schema = createSchema({
  type:"instruction",
  title:"Instrucctions",
  childTypes:["instruction-step"],
  settings:[
    {
      group:"step",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'color',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'color disabled',
          name:'colord',
          defaultValue:'#ffffff4d',
        },
        {
          type:'range',
          label:'space dot',
          name:'spaceDot',
          defaultValue:1.2,
          configs:{
            min:0.1,
            max:3,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type:'range',
          label:'space',
          name:'space',
          defaultValue:0.8,
          configs:{
            min:0.1,
            max:3,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type:'text',
          label:'font size',
          name:'size',
          defaultValue:'16px',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'letter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type: "select",
          name: "weight",
          label: "Font weight",
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
            ],
          },
          defaultValue: "300",
        },
        
      ]
    },
    ...sectionSettings
  ]
})