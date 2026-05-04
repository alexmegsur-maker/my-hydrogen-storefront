import { createSchema } from "@weaverse/hydrogen";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"; // Importante: Registrar ScrollTrigger
import { useEffect, useRef } from "react";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

// Registrar el plugin de GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimeLinePhoenixProps extends SectionProps {
  showTborder: boolean;
  showBborder: boolean;
  colorBorder: string;
  showLine: boolean;
  colorLineBorder: string;
}

export default function TimeLinePhoenix(props: TimeLinePhoenixProps) {
  const { children, showTborder, showBborder, colorBorder, showLine, colorLineBorder, ...rest } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressLineRef.current || !containerRef.current || !showLine) return;

    // Animación vinculada al scroll
    gsap.fromTo(
      progressLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%", // Empieza cuando el top del componente está al 70% de la pantalla
          end: "bottom 80%", // Termina cuando el final del componente llega al 80%
          scrub: true, // Hace que la animación siga el movimiento del ratón/scroll
        },
      }
    );
  }, [showLine]);

  return (
    <Section
      {...rest}
      style={{
        borderTop: showTborder ? `1px solid ${colorBorder}` : "unset",
        borderBottom: showBborder ? `1px solid ${colorBorder}` : "unset",
      }}
    >
      <div ref={containerRef} className="relative w-full">
        {showLine && (
          <>
            {/* Línea de fondo (estática y tenue) */}
            <div
              className="absolute h-full"
              style={{
                left: "2.5rem", // Alineado con el centro del dot (5rem / 2)
                width: "2px",
                backgroundColor: colorLineBorder,
                zIndex: 0,
              }}
            />
            {/* Línea de progreso (animada) */}
            <div
              ref={progressLineRef}
              className="absolute h-full"
              style={{
                left: "2.5rem",
                width: "2px",
                background: "linear-gradient(to bottom, transparent, #FFFFFF, #FFFFFF)",
                boxShadow: "0 0 15px rgba(255,255,255,0.8)",
                zIndex: 1,
                transformOrigin: "top center",
              }}
            />
          </>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </Section>
  );
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