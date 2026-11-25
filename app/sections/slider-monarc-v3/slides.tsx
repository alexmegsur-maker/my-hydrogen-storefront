import { createSchema, type HydrogenComponentProps, useChildInstances } from "@weaverse/hydrogen";
import { Children, useEffect, useMemo } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { type SlideInfo, useSliderV3 } from "./context";

interface SlidesMonarchV3Props extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  effect: "fade" | "slide";
  /** Ajuste antiguo (switch): se usa si aún no hay "loopMode" */
  loop?: boolean;
  loopMode: "none" | "loop" | "rewind";
  autoplay: boolean;
  delay: number;
  pauseOnHover: boolean;
  stopOnInteraction: boolean;
  reverse: boolean;
  speed: number;
  offsetX: number;
  mobileOffsetX: number;
}

export default function SlidesMonarchV3(props: SlidesMonarchV3Props) {
  const {
    children,
    effect = "fade",
    loop = false,
    loopMode = loop ? "loop" : "none",
    autoplay = false,
    delay = 5,
    pauseOnHover = true,
    stopOnInteraction = false,
    reverse = false,
    speed = 600,
    offsetX = 0,
    mobileOffsetX = 0,
    ref,
    ...rest
  } = props;
  const ctx = useSliderV3();
  const childInstances = useChildInstances();

  // Publica los datos de cada slide (color + nombre) para las muestras del footer
  const slides = useMemo<SlideInfo[]>(
    () =>
      childInstances.map((instance) => ({
        id: instance._id,
        label: (instance.data?.label as string) || "",
        swatchColor: (instance.data?.swatchColor as string) || "#888",
        swatchImage: (instance.data?.swatchImage as { url?: string } | undefined)?.url,
      })),
    [childInstances],
  );
  const slidesKey = JSON.stringify(slides);
  // biome-ignore lint/correctness/useExhaustiveDependencies: solo cuando cambian los datos
  useEffect(() => {
    ctx?.setSlides(slides);
  }, [slidesKey]);

  const items = Children.toArray(children);
  // El bucle infinito de Swiper necesita al menos 3 slides; con menos se usa "volver al inicio"
  const mode = loopMode === "loop" && items.length < 3 ? "rewind" : loopMode;
  const canLoop = items.length > 1;

  // Recalcula el carrusel cuando Weaverse termina de cargar/añadir slides
  useEffect(() => {
    if (!ctx?.swiper || ctx.swiper.destroyed) return;
    const raf = requestAnimationFrame(() => ctx.swiper?.update());
    return () => cancelAnimationFrame(raf);
  }, [ctx?.swiper, items.length]);

  return (
    <div
      ref={ref}
      {...rest}
      // Desplazamiento horizontal de las imágenes (móvil / escritorio)
      className="h-full w-full translate-x-(--sv3-x-m) lg:translate-x-(--sv3-x)"
      style={{ "--sv3-x": `${offsetX}%`, "--sv3-x-m": `${mobileOffsetX}%` } as React.CSSProperties}
    >
      <Swiper
        // Swiper no permite cambiar loop/rewind en caliente: se recrea al cambiarlos
        key={`${effect}-${mode}-${autoplay}-${reverse}`}
        className="h-full w-full"
        effect={effect}
        fadeEffect={{ crossFade: true }}
        speed={speed}
        loop={canLoop && mode === "loop"}
        rewind={canLoop && mode === "rewind"}
        autoplay={
          autoplay && canLoop
            ? {
                delay: delay * 1000,
                pauseOnMouseEnter: pauseOnHover,
                disableOnInteraction: stopOnInteraction,
                reverseDirection: reverse,
                // Sin bucle ni rewind, el autoplay se detiene en la última slide
                stopOnLastSlide: mode === "none",
              }
            : false
        }
        modules={[EffectFade, Autoplay]}
        observer
        observeParents
        onSwiper={(swiper) => ctx?.setSwiper(swiper)}
        onSlideChange={(swiper) => ctx?.setActiveIndex(swiper.realIndex)}
      >
        {items.map((child, index) => (
          <SwiperSlide key={childInstances[index]?._id ?? index} className="h-full!">
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export const schema = createSchema({
  title: "slides",
  type: "slides-m-v3",
  childTypes: ["slide-image"],
  settings: [
    {
      group: "Posición",
      inputs: [
        {
          type: "range",
          label: "Mover horizontal (escritorio)",
          name: "offsetX",
          defaultValue: 0,
          configs: { min: -100, max: 100, step: 1, unit: "%" },
          helpText: "Negativo = izquierda, positivo = derecha.",
        },
        {
          type: "range",
          label: "Mover horizontal (móvil)",
          name: "mobileOffsetX",
          defaultValue: 0,
          configs: { min: -100, max: 100, step: 1, unit: "%" },
        },
      ],
    },
    {
      group: "Carrusel",
      inputs: [
        {
          type: "toggle-group",
          label: "Transición",
          name: "effect",
          configs: {
            options: [
              { value: "fade", label: "Fundido" },
              { value: "slide", label: "Deslizar" },
            ],
          },
          defaultValue: "fade",
        },
        { type: "range", label: "Velocidad", name: "speed", defaultValue: 600, configs: { min: 100, max: 2000, step: 50, unit: "ms" } },
      ],
    },
    {
      group: "Bucle y autoplay",
      inputs: [
        {
          type: "select",
          label: "Al llegar a la última slide",
          name: "loopMode",
          configs: {
            options: [
              { value: "none", label: "Parar (sin bucle)" },
              { value: "loop", label: "Bucle infinito" },
              { value: "rewind", label: "Volver a la primera" },
            ],
          },
          defaultValue: "none",
          helpText: "Bucle infinito necesita 3 slides o más; con menos se usa «Volver a la primera».",
        },
        { type: "switch", label: "Autoplay", name: "autoplay", defaultValue: false },
        {
          type: "range",
          label: "Segundos por slide",
          name: "delay",
          defaultValue: 5,
          configs: { min: 2, max: 15, step: 1, unit: "s" },
          condition: (data: { autoplay?: boolean }) => Boolean(data.autoplay),
        },
        {
          type: "switch",
          label: "Pausar al pasar el ratón",
          name: "pauseOnHover",
          defaultValue: true,
          condition: (data: { autoplay?: boolean }) => Boolean(data.autoplay),
        },
        {
          type: "switch",
          label: "Detener autoplay al hacer clic en una muestra",
          name: "stopOnInteraction",
          defaultValue: false,
          condition: (data: { autoplay?: boolean }) => Boolean(data.autoplay),
        },
        {
          type: "switch",
          label: "Sentido inverso",
          name: "reverse",
          defaultValue: false,
          condition: (data: { autoplay?: boolean }) => Boolean(data.autoplay),
        },
      ],
    },
  ],
});
