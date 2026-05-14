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
    start = "top 110%",
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

      // 🔑 Cada animación crea su propio ST independiente
      const createST = () =>
        ScrollTrigger.create({
          trigger: el,
          start,
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
          markers: markers
            ? { startColor: color, endColor: "purple", fontSize: "18px", fontWeight: "bold", indent: 20 }
            : false,
        });

      if (animation === "fade") {
        const st = createST();
        gsap.from(el, {
          scrollTrigger: st,
          y: "100%",
          filter: "blur(1.5rem)",
          opacity: 0,
          duration: duration ?? 1,
          ease: "power2.out",
        });
      }

      if (animation === "underline") {
        const st1 = createST();
        const st2 = createST();

        gsap.from(el, {
          scrollTrigger: st1,
          y: "100%",
          filter: "blur(1.5rem)",
          opacity: 0,
          duration: duration ?? 1,
          ease: "power2.out",
        });

        gsap.from(cursorRef.current, {
          scrollTrigger: st2,
          width: 0,
          duration: duration ?? 1,
          delay: 0.5,
          ease: "power2.out",
        });
      }

      if (animation === "neonPulse") {
        const st = createST();
        const tl = gsap.timeline({
          scrollTrigger: st,
          onComplete: () => {
            gsap.to(el, {
              textShadow: "0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.6)",
              repeat: -1,
              yoyo: true,
              duration: 1.5,
              ease: "sine.inOut",
            });
          },
        });
        tl.from(el, {
          y: "100%",
          filter: "blur(1.5rem)",
          opacity: 0,
          duration: duration ?? 1,
          ease: "power2.out",
        });
      }

      if (animation === "spaceNeonPulse") {
        const st = createST();
        const tl = gsap.timeline({
          scrollTrigger: st,
          onComplete: () => {
            gsap.to(el, {
              textShadow: "0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.6)",
              repeat: -1,
              yoyo: true,
              duration: 1.5,
              ease: "sine.inOut",
            });
          },
        });
        tl.from(el, {
          scaleX: 0,
          opacity: 0,
          width: 0,
          duration: duration ?? 2,
          transform: "translateX(-100%)",
          delay: 1,
          ease: "power2.out",
        });
      }

      if (animation === "typer") {
        const st = createST(); // ST propio para typer
        gsap.fromTo(
          textInnerRef.current,
          { width: 0 },
          {
            width: "auto",
            duration: duration ?? 2,
            ease: "power4.inOut",
            scrollTrigger: st,
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