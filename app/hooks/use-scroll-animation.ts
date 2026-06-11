// hooks/use-scroll-animation.ts
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type RefObject } from "react";


export type AnimationType = "none" | "fade" | "typer" | "spaceNeonPulse" | "neonPulse" | "breathe" | "writeChar" | "underline";

export interface ScrollAnimationOptions {
  animation: AnimationType;
  cursorColor?: string;
  start?: string;
  duration?: number;
  markers?: boolean;
  color?: string;
}

export interface ScrollAnimationRefs<T extends HTMLElement = HTMLElement> {
  elementRef: RefObject<T>;
  textInnerRef: RefObject<HTMLSpanElement>;
  cursorRef: RefObject<HTMLSpanElement>;
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: ScrollAnimationOptions
): ScrollAnimationRefs<T> {
  const {
    animation,
    cursorColor = "currentColor",
    start = "-100% 110%",
    duration,
    markers,
    color,
  } = options;

  const elementRef = useRef<T>(null);
  const textInnerRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);


  useGSAP(
    () => {
      const el = elementRef.current;
      if (!el) return;

      gsap.registerPlugin(ScrollTrigger)

      const stConfig = () =>({
          trigger: el,
          start,
          end:"top bottom",
          // once: true kills the trigger after first fire — no more scroll listener overhead
          once: true,
          markers: markers
            ? { startColor: color, endColor: color, fontSize: "18px", fontWeight: "bold", indent: 20 }
            : false,
        });

      if (animation === "fade") {
        gsap.from(el, {
          scrollTrigger: stConfig(),
          y: "100%",
          opacity: 0,
          duration: duration ?? 1,
          ease: "power2.out",
        });
      }

      if (animation === "underline") {
        gsap.from(el, {
          scrollTrigger: stConfig(),
          y: "100%",
          opacity: 0,
          duration: duration ?? 1,
          ease: "power2.out",
        });

        gsap.from(cursorRef.current, {
          scrollTrigger: stConfig(),
          width: 0,
          duration: duration ?? 1,
          delay: 0.5,
          ease: "power2.out",
        });
      }

      if (animation === "neonPulse") {
        const tl = gsap.timeline({ scrollTrigger: stConfig() });
        tl.from(el, {
          y: "100%",
          opacity: 0,
          duration: duration ?? 1,
          ease: "power2.out",
          // On complete, add a CSS class for the repeating glow — keeps it off the JS thread
          onComplete: () => el.classList.add("animate-neon-pulse"),
        });
      }

      if (animation === "spaceNeonPulse") {
        const tl = gsap.timeline({ scrollTrigger: stConfig() });
        tl.from(el, {
          // scaleX + transformOrigin replaces width:0 + translateX(-100%) — GPU composited
          scaleX: 0,
          opacity: 0,
          duration: duration ?? 2,
          delay: 1,
          ease: "power2.out",
          transformOrigin: "left center",
          onComplete: () => el.classList.add("animate-neon-pulse"),
        });
      }

      if (animation === "typer") {
        gsap.fromTo(
          textInnerRef.current,
          { width: 0 },
          {
            width: "auto",
            duration: duration ?? 2,
            ease: "power4.inOut",
            scrollTrigger: stConfig(),
          }
        );
        gsap.to(cursorRef.current, {
          opacity: 0.3,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
          duration: 0.6,
        });
      }
    },
    { scope: elementRef, dependencies: [animation, start, duration, cursorColor] }
  );

  return { elementRef, textInnerRef, cursorRef };
}
