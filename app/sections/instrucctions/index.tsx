import { createSchema, useChildInstances } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

export default function Instrucction(props:SectionProps){
  const {children,...rest}=props
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
          gap:"1.2rem",
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
                gap:"0.8rem",
                opacity:selected ?1:0.4,
                transition:"all 0.4s ease"
              }}
            >
              <span>{instance.data.title}</span>
              <span
                style={{
                  width:"6px",
                  height:"6px",
                  border:`1px solid #ffffff4d`,
                  borderRadius:"50%",
                  transition:"all 0.4s ease",
                  background:selected ? "#FFF":undefined,
                  boxShadow:selected ?`0 0 10px #fff`:undefined, 
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
    ...sectionSettings
  ]
})