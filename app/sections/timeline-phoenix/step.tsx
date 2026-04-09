import { createSchema } from "@weaverse/hydrogen";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

interface TimeLineItemProps extends SectionProps{

}

export default function TimeLineItem(props:TimeLineItemProps){
const {children,...rest}=props


  const itemRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    const dot  = dotRef.current;
    if (!item || !dot) return;

    // Estado inicial — invisible y desplazado
    gsap.set(item, { opacity: 0, y: 40 });
    gsap.set(dot,  { scale: 0, borderColor: "#52525B" });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // Timeline secuencial: item entra → dot aparece con rebote
        gsap
          .timeline()
          .to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
          })
          .to(
            dot,
            {
              scale: 1,
              borderColor: "#ffffff",
              boxShadow: "0 0 15px rgba(255,255,255,0.4)",
              duration: 0.8,
              ease: "back.out(1.7)",
            },
            "-=0.6" // empieza 0.6s antes de que termine la anterior
          );

        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -15% 0px",
        threshold: 0.1,
      }
    );

    observer.observe(item);
    return () => observer.disconnect();
  }, []);
  return (
  <Section {...rest}
    containerClassName="flex"
  >
    <div className="h-full relative"
      style={{
        width:"5rem"
      }}
      >
      <div 
        ref={dotRef}
        className="absolute left-[20px] top-[25px] w-[12px] h-[12px]"
        style={{
          transform:"translate(-50%,-50%) scale(1)",
          border:`2px solid #fff`,
          borderRadius:"50%",
          transition:"all 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.3s"
        }}
      />

    </div>
    <div ref={itemRef} className="flex flex-col">
      {children}

    </div>
  </Section>
)
}

export const schema= createSchema({
  type:"timeLine-item",
  title:"Timeline item",
  childTypes:["heading","subheading","paragraph"],
  settings:[
    ...sectionSettings
  ]
})