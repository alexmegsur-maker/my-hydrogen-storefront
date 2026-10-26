import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  useItemInstance,
  useParentInstance,
} from "@weaverse/hydrogen";
import { Children, useEffect, useState, type CSSProperties } from "react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ScrollReveal } from "~/components/scroll-reveal";
import { useIsMobile } from "~/hooks/use-is-mobile";
import type { ImageAspectRatio } from "~/types/others";

interface ImageWithTextSliderProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  imageAspectRatio: Exclude<ImageAspectRatio, "adapt">;
  verticalAlign: "flex-start" | "center" | "flex-end";
  borderRadius: number;
  effect: "slide" | "fade";
  autoplay: boolean;
  autoplayDelay: number;
  loop: boolean;
  showArrows: boolean;
  showDots: boolean;
  controlsColor: string;
}

function ImageWithTextSlider(props: ImageWithTextSliderProps) {
  const {
    children,
    imageAspectRatio = "1/1",
    verticalAlign,
    borderRadius,
    effect,
    autoplay,
    autoplayDelay,
    loop,
    showArrows,
    showDots,
    controlsColor,
    ref,
    ...rest
  } = props;

  const parentInstance = useParentInstance();
  const instance = useItemInstance();
  const isMobile = useIsMobile(600);
  const [contentSize, setContentSize] = useState(100);

  // Mismo reparto de ancho que image-with-text--image (según contentDist del padre)
  useEffect(() => {
    if (parentInstance.data?.contentDist) {
      const position = parentInstance.data.children.findIndex(
        (elm) => elm.id === instance.data.id,
      );
      if (position === 0) {
        setContentSize(parentInstance.data.contentDist);
      } else {
        setContentSize(100 - parentInstance.data.contentDist);
      }
    }
  }, [parentInstance.data?.contentDist, instance.data?.id]);

  const slides = Children.toArray(children);

  return (
    <div
      ref={ref}
      {...rest}
      className="z-2 h-auto min-w-0"
      style={{
        width: isMobile ? "100%" : `${contentSize}%`,
        alignSelf: verticalAlign,
      }}
    >
      <ScrollReveal animation="slide-in">
        <Swiper
          // key fuerza el reinicio al cambiar opciones en el editor
          key={`${effect}-${autoplay}-${autoplayDelay}-${loop}-${slides.length}`}
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect={effect}
          fadeEffect={{ crossFade: true }}
          loop={loop && slides.length > 1}
          autoplay={
            autoplay
              ? { delay: autoplayDelay * 1000, disableOnInteraction: false }
              : false
          }
          navigation={showArrows}
          pagination={showDots ? { clickable: true } : false}
          slidesPerView={1}
          className="w-full"
          style={
            {
              aspectRatio: imageAspectRatio,
              borderRadius: `${borderRadius}px`,
              "--swiper-theme-color": controlsColor,
              "--swiper-navigation-color": controlsColor,
              "--swiper-pagination-color": controlsColor,
              "--swiper-pagination-bullet-inactive-color": controlsColor,
            } as CSSProperties
          }
        >
          {slides.map((child, index) => (
            <SwiperSlide key={index} className="h-full!">
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </ScrollReveal>
    </div>
  );
}

export default ImageWithTextSlider;

export const schema = createSchema({
  type: "image-with-text--slider",
  title: "Image slider",
  limit: 1,
  childTypes: ["image-with-text--slide"],
  settings: [
    {
      group: "Slider",
      inputs: [
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Aspect ratio",
          configs: {
            options: [
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
              { value: "16/9", label: "Widescreen (16/9)" },
            ],
          },
          defaultValue: "1/1",
        },
        {
          type: "select",
          label: "vertical align",
          name: "verticalAlign",
          configs: {
            options: [
              { value: "flex-start", label: "start" },
              { value: "center", label: "center" },
              { value: "flex-end", label: "end" },
            ],
          },
          defaultValue: "flex-start",
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Border radius",
          configs: { min: 0, max: 40, step: 2, unit: "px" },
          defaultValue: 0,
        },
        {
          type: "select",
          name: "effect",
          label: "Transition",
          configs: {
            options: [
              { value: "slide", label: "Slide" },
              { value: "fade", label: "Fade" },
            ],
          },
          defaultValue: "slide",
        },
        {
          type: "switch",
          name: "loop",
          label: "Loop",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "autoplay",
          label: "Autoplay",
          defaultValue: true,
        },
        {
          type: "range",
          name: "autoplayDelay",
          label: "Autoplay delay",
          configs: { min: 1, max: 15, step: 0.5, unit: "s" },
          defaultValue: 4,
          condition: (data: ImageWithTextSliderProps) => data.autoplay,
        },
      ],
    },
    {
      group: "Controls",
      inputs: [
        {
          type: "switch",
          name: "showArrows",
          label: "Show arrows",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showDots",
          label: "Show dots",
          defaultValue: true,
        },
        {
          type: "color",
          name: "controlsColor",
          label: "Controls color",
          defaultValue: "#FFFFFF",
        },
      ],
    },
  ],
  presets: {
    imageAspectRatio: "1/1",
    children: [
      { type: "image-with-text--slide", image: IMAGES_PLACEHOLDERS.image },
      { type: "image-with-text--slide", image: IMAGES_PLACEHOLDERS.image },
      { type: "image-with-text--slide", image: IMAGES_PLACEHOLDERS.image },
    ],
  },
});
