// hooks/use-scroll-animation.ts
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type RefObject } from "react";
import { useIsMobile } from "./use-is-mobile";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AnimationType = "none" | "fade" | "typer" |"spaceNeonPulse"|"neonPulse" | "breathe"|"writeChar"|"underline";

export interface ScrollAnimationOptions {
  /** Tipo de animación a ejecutar */
  animation: AnimationType;
  /** Color del cursor para la animación typer (hereda currentColor si no se indica) */
  cursorColor?: string;
  /** Punto de inicio del ScrollTrigger. Por defecto: "top 90%" */
  start?: string;
  /** Duración de la animación principal en segundos. Por defecto: fade=1, typer=2 */
  duration?: number;
}

export interface ScrollAnimationRefs<T extends HTMLElement = HTMLElement> {
  /** Ref para el elemento raíz (trigger + target de la animación fade) */
  elementRef: RefObject<T>;
  /** Ref para el span de texto interior (animación typer) */
  textInnerRef: RefObject<HTMLSpanElement>;
  /** Ref para el cursor parpadeante (animación typer) */
  cursorRef: RefObject<HTMLSpanElement>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Abstrae las animaciones de scroll con GSAP.
 *
 * @example — fade
 * const { elementRef } = useScrollAnimation({ animation: "fade" });
 * <h2 ref={elementRef}>Título</h2>
 *
 * @example — typer
 * const { elementRef, textInnerRef, cursorRef } = useScrollAnimation({
 *   animation: "typer",
 *   cursorColor: "#fff",
 * });
 * <h2 ref={elementRef}>
 *   <span>
 *     <span ref={textInnerRef} style={{ display:"inline-block", overflow:"hidden", whiteSpace:"nowrap" }}>
 *       {content}
 *     </span>
 *     <span ref={cursorRef} style={{ display:"inline-block", width:"3px", height:"0.8em", backgroundColor: cursorColor }} />
 *   </span>
 * </h2>
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: ScrollAnimationOptions
): ScrollAnimationRefs<T> {
  const isMobile = useIsMobile(600)
  const {
    animation,
    cursorColor = "currentColor",
    start = "top 110%",
    duration,
  } = options;
 
  const elementRef = useRef<T>(null);
  const textInnerRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const stConfig = isMobile? undefined :{
            trigger: elementRef.current,
            start,
            once:true,
            // markers:true,
            toggleActions: "play none none none",
          }
      if(!isMobile){
        if (animation === "fade") {
          gsap.from(elementRef.current, {
            y: "100%",
            filter: "blur(1.5rem)",
            opacity: 0,
            duration: duration ?? 1,
            ease: "power2.out",
            scrollTrigger: stConfig,
          });
        }
        if(animation == "underline"){
           gsap.from(elementRef.current, {
            y: "100%",
            filter: "blur(1.5rem)",
            opacity: 0,
            duration: duration ?? 1,
            ease: "power2.out",
            scrollTrigger: stConfig,
          });
          gsap.from(cursorRef.current,{
            width:0,
            duration: duration ?? 1,
            delay:0.5,
            ease: "power2.out",
            scrollTrigger: stConfig,
          
          }) 
        }
      }
      if(animation ==="writeChar"){
        gsap.from(".char", {
          opacity: 0,
          y: 20,
          rotateX: -90,
          stagger: 0.08,
          duration: 1,
          ease: "power3.out",
        })
      }
      if(animation === "neonPulse"){
        const tl = gsap.timeline({
          scrollTrigger: stConfig,
        });
        tl.from(elementRef.current, {
          y: "100%",
          filter: "blur(1.5rem)",
          opacity: 0,
          duration: duration ?? 1,
          ease: "power2.out",
          scrollTrigger: stConfig,
        });

        tl.to(elementRef.current, {
          textShadow: "0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.6)",
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: "sine.inOut",
        });
      }
      if(animation === "spaceNeonPulse"){
        const tl = gsap.timeline({
          scrollTrigger: stConfig,
        });

        tl.from(elementRef.current, {
          scaleX: 0,
          opacity: 0,
          width:0,
          duration: duration ?? 2,
          transform:"translateX(-100%)",
          delay:1,
          ease: "power2.out",
        })
        .to(elementRef.current, {
          textShadow: "0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.6)",
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: "sine.inOut",
        });
      }

      if (animation === "typer") {
        gsap.fromTo(
          textInnerRef.current,
          { width: 0 },
          {
            width: "100%",
            duration: duration ?? 2,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: elementRef.current,
              start,
              toggleActions: "play none none none",
            },
          }
        );
       

        // Cursor: parpadeo constante, no depende del scroll
        gsap.to(cursorRef.current, {
          opacity: 0.3,
          ease: "steps(1)",
        });
      }
      if(animation == "breathe"){
        gsap.fromTo(cursorRef.current, {
          opacity: 1,
          repeat: -1,
          duration: 2,
          ease: "steps(1)",
          yoyo:true,
        },{

        });
      }
    
    },
    { scope: elementRef, dependencies: [animation, start, duration, cursorColor] }
  );

  return { elementRef, textInnerRef, cursorRef };
}