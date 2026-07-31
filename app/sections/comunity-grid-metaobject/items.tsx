import { useGSAP } from "@gsap/react";
import {
  createSchema,
  IMAGES_PLACEHOLDERS,
  type HydrogenComponentProps,
  useParentInstance,
} from "@weaverse/hydrogen";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Children, createContext, useRef } from "react";
import { Skeleton } from "~/components/skeleton";
import { useIsMobile } from "~/hooks/use-is-mobile";
import type { ImageAspectRatio } from "~/types/others";
import CommunityPost from "../comunity-grid/post";
import type { CommunityGridPostNode } from "./index";

// Los posts se pasan a los hijos "Post" vía Context (no vía un store global
// a nivel de módulo) porque en el runtime de Workers/Oxygen un mismo
// worker puede atender varias requests concurrentes: un store global
// compartiría/mezclaría datos entre requests de distintos productos y
// puede producir errores del tipo "promise resolved from a different
// request context".
export const CommunityPostsContext = createContext<CommunityGridPostNode[]>([]);

interface CommunityGridMetaobjectItemsProps extends HydrogenComponentProps {
  gap: number;
  mbGap: number;
  maxColumns: number;
  widthContainer: number;
  fadeY: number;
  fadeDuration: number;
  staggerDelay: number;
  ref?: React.Ref<HTMLDivElement>;
}

function CommunityGridMetaobjectItems(
  props: CommunityGridMetaobjectItemsProps,
) {
  const {
    gap,
    mbGap,
    maxColumns,
    widthContainer,
    fadeY,
    fadeDuration,
    staggerDelay,
    ref,
    children,
    ...rest
  } = props;
  const isMobile = useIsMobile(600);
  const container = useRef(null);
  const parent = useParentInstance();
  const loaderData = parent?.data?.loaderData;
  // Mientras el loader del metaobjeto "comunidad_post" todavía no resuelve
  // (p. ej. en el preview del editor de Weaverse) loaderData es undefined;
  // una vez resuelve, siempre es un objeto (aunque posts venga vacío).
  const isLoading = !loaderData;
  const posts: CommunityGridPostNode[] = loaderData?.posts ?? [];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

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
          once: true,
        },
      });
    },
    // Re-ejecuta si cambian los valores de animación o el número de hijos
    {
      scope: container,
      dependencies: [fadeY, fadeDuration, staggerDelay, posts.length],
    },
  );

  if (isLoading) {
    const skeletonSpan = Math.max(1, Math.floor(maxColumns / 4));
    return (
      <div
        ref={ref}
        {...rest}
        className="flex flex-col sm:grid sm:grid-cols-12"
        style={{
          width: !isMobile ? `${widthContainer}%` : "90%",
          justifySelf: "center",
          gap: !isMobile ? `${gap}px` : `${mbGap}px`,
          gridTemplateColumns: `repeat(${maxColumns}, minmax(0,1fr))`,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="rounded"
            style={{ gridColumn: `span ${skeletonSpan}`, aspectRatio: "3/4" }}
          />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div ref={ref} {...rest} className="p-8 text-center opacity-60">
        No hay posts disponibles en el metaobjeto "comunidad_post"
      </div>
    );
  }

  return (
    <CommunityPostsContext.Provider value={posts}>
      <div
        ref={container}
        {...rest}
        className="flex flex-col sm:grid sm:grid-cols-12"
        style={{
          width: !isMobile ? `${widthContainer}%` : "90%",
          justifySelf: "center",
          gap: !isMobile ? `${gap}px` : `${mbGap}px`,
          gridTemplateColumns: `repeat(${maxColumns}, minmax(0,1fr))`,
        }}
      >
        {children}
      </div>
    </CommunityPostsContext.Provider>
  );
}

export default CommunityGridMetaobjectItems;

export const schema = createSchema({
  type: "community-grid-metaobject--items",
  title: "Items",
  childTypes:["community-grid-metaobject--post"] ,
  settings: [
    {
      group: "Items",
      inputs: [
        {
          type: "range",
          label: "Items gap",
          name: "gap",
          configs: { min: 16, max: 80, step: 4, unit: "px" },
          defaultValue: 40,
        },
        {
          type: "range",
          label: "maxColumn",
          name: "maxColumns",
          defaultValue: 12,
          configs: { min: 2, max: 100, step: 1, unit: "columns" },
        },
        {
          type: "range",
          label: "width",
          name: "widthContainer",
          defaultValue: 100,
          configs: { min: 10, max: 100, step: 1, unit: "%" },
        },
      ],
    },
    {
      group: "mobile",
      inputs: [
        {
          type: "range",
          label: "Items gap",
          name: "mbGap",
          configs: { min: 16, max: 80, step: 4, unit: "px" },
          defaultValue: 20,
        },
      ],
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
   presets: {
    children: [
      {
        type: "community-grid-metaobject--post",
        imageAspectRatio:"3/4",
        size:"col4",
        rowSize:"row6"
      },
      {
        type: "community-grid-metaobject--post",
        imageAspectRatio:"3/4",
        size:"col2",
        rowSize:"row2"
      },
      {
        type: "community-grid-metaobject--post",
        imageAspectRatio:"1/1",
        size:"col4",
        rowSize:"row2"
      },
    ],
  },
});
