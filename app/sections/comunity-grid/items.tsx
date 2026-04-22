import { useGSAP } from "@gsap/react";
import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";

gsap.registerPlugin(ScrollTrigger)

interface ColumnsWithPostsItemsProps extends HydrogenComponentProps {
  gap: number;
  mbGap: number;
  maxColumns: number;
  widthContainer:number;
  fadeY: number;
  fadeDuration: number;
  staggerDelay: number;
  ref?: React.Ref<HTMLDivElement>;
}

function ColumnsWithPostsItems(props: ColumnsWithPostsItemsProps) {
  const { 
    children, 
    gap,
    mbGap, 
    maxColumns, 
    widthContainer, 
    ref,
    fadeY,
    fadeDuration,
    staggerDelay,
    ...rest } = props;
  const isMobile = useIsMobile(600);

  const container=useRef(null)

  useGSAP(
    () => {
      // Selecciona los hijos directos del contenedor
      const items = gsap.utils.toArray<HTMLElement>(
        ":scope > *",
        container.current!,
      );
 
      if (!items.length) return;
 
      // Estado inicial — invisible y desplazados hacia abajo
      gsap.set(items, {
        opacity: 0,
        y: fadeY ?? 40,
      });
 
      // Animación de entrada con stagger, disparada por ScrollTrigger
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: fadeDuration ?? 0.7,
        ease: "power2.out",
        stagger: staggerDelay ?? 0.12,
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",   // empieza cuando el top del contenedor alcanza el 85% del viewport
          toggleActions: "play none none none", // solo se reproduce una vez
        },
      });
    },
    // Re-ejecuta si cambian los valores de animación o el número de hijos
    {
      scope: container,
      dependencies: [fadeY, fadeDuration, staggerDelay],
    },
  );

  return (
    <div
      ref={container}
      {...rest}
      className="flex flex-col sm:grid sm:grid-cols-12"
      style={{ 
        width:!isMobile ? `${widthContainer}%`:"90%",
        justifySelf:"center",
        gap: !isMobile ? `${gap}px`:`${mbGap}px`,
        gridTemplateColumns:`repeat(${maxColumns}, minmax(0,1fr))`
      }}
    >
      {children}
    </div>
  );
}

export default ColumnsWithPostsItems;

export const schema = createSchema({
  type: "columns-with-posts--items",
  title: "Items",
  settings: [
    {
      group: "Items",
      inputs: [
        {
          type: "range",
          label: "Items gap",
          name: "gap",
          configs: {
            min: 16,
            max: 80,
            step: 4,
            unit: "px",
          },
          defaultValue: 40,
        },
        {
          type:'range',
          label:'maxColumn',
          name:'maxColumns',
          defaultValue:12,
          configs:{
            min:2,
            max:100,
            step:1,
            unit:'columns',
          }
        },
        {
          type:'range',
          label:'width',
          name:'widthContainer',
          defaultValue:100,
          configs:{
            min:10,
            max:100,
            step:1,
            unit:'%',
          }
        },
      ],
    },
    {
      group:"mobile",
      inputs:[
        {
          type: "range",
          label: "Items gap",
          name: "mbGap",
          configs: {
            min: 16,
            max: 80,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
        },
      ]
    },
    {
      group: "Animación",
      inputs: [
        {
          type: "range",
          label: "Desplazamiento inicial (Y)",
          name: "fadeY",
          defaultValue: 40,
          configs: { min: 0, max: 120, step: 4, unit: "px" },
        },
        {
          type: "range",
          label: "Duración fade",
          name: "fadeDuration",
          defaultValue: 0.7,
          configs: { min: 0.2, max: 2, step: 0.1, unit: "s" },
        },
        {
          type: "range",
          label: "Delay entre items (stagger)",
          name: "staggerDelay",
          defaultValue: 0.12,
          configs: { min: 0, max: 0.6, step: 0.02, unit: "s" },
        },
      ],
    },
  ],
  childTypes: ["column-with-post--item"],
  // presets: {
  //   children: [
  //     {
  //       type: "column-with-product--item",
  //     },
  //     {
  //       type: "column-with-product--item",
  //     },
  //     {
  //       type: "column-with-product--item",
  //     },
  //   ],
  // },
});
