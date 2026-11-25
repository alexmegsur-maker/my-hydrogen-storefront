import { createSchema, useChildInstances } from "@weaverse/hydrogen";
import { Children, type CSSProperties, useMemo, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Section, type SectionProps, sectionSettings } from "~/components/section";
import { MONO_FONT } from "~/utils/text-style";
import { type SlideInfo, SliderV3Context } from "./context";

interface SliderMonarchV3Props extends SectionProps {
  widthCont: number;
  mediaWidth: number;
  minHeight: number;
  mobileMediaHeight: number;
}

const MEDIA_TYPE = "slides-m-v3";
const FOOTER_TYPE = "footer-m-v3";

export default function SliderMonarchV3(props: SliderMonarchV3Props) {
  const {
    widthCont = 45,
    mediaWidth = 60,
    minHeight = 100,
    mobileMediaHeight = 55,
    ref,
    children,
    ...rest
  } = props;

  const childInstances = useChildInstances();
  const [slides, setSlides] = useState<SlideInfo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const ctx = useMemo(
    () => ({ slides, setSlides, activeIndex, setActiveIndex, swiper, setSwiper }),
    [slides, activeIndex, swiper],
  );

  // Reparte los hijos: textos/botones a la izquierda, slides a la derecha, footer abajo
  const content: React.ReactNode[] = [];
  const media: React.ReactNode[] = [];
  const footer: React.ReactNode[] = [];
  Children.toArray(children).forEach((child, index) => {
    const type = childInstances[index]?.data?.type;
    if (type === MEDIA_TYPE) media.push(child);
    else if (type === FOOTER_TYPE) footer.push(child);
    else content.push(child);
  });

  const vars = {
    "--sv3-content": `${widthCont}%`,
    "--sv3-media": `${mediaWidth}%`,
    "--sv3-min-h": `${minHeight}svh`,
    "--sv3-mb-media-h": `${mobileMediaHeight}svh`,
  } as CSSProperties;

  return (
    <SliderV3Context.Provider value={ctx}>
      <Section ref={ref} {...rest}>
        <div className="relative flex flex-col lg:min-h-(--sv3-min-h)" style={vars}>
         
          <div className="relative flex flex-1 flex-col lg:flex-row lg:items-center">
            <div className="relative z-10 flex w-full flex-col items-start lg:w-(--sv3-content)">
              {content}
            </div>
            {media.length > 0 && (
              <div className="relative mt-8 h-(--sv3-mb-media-h) w-full lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-(--sv3-media)">
                {media}
              </div>
            )}
          </div>

          {footer.length > 0 && (
            // Escritorio: el footer flota encima del contenido, pegado abajo de la sección
            <div className="relative z-20 mt-10 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0">
              {footer}
            </div>
          )}
        </div>
      </Section>
    </SliderV3Context.Provider>
  );
}

export const schema = createSchema({
  title: "Slider monarch v3",
  type: "slider-v3",
  childTypes: [
    "subheading",
    "heading",
    "paragraph",
    "group-buttons",
    "group-elements",
    "slides-m-v3",
    "footer-m-v3",
  ],
  settings: [
    {
      group: "general",
      inputs: [
        {
          type: "range",
          label: "Ancho del contenido (escritorio)",
          name: "widthCont",
          defaultValue: 45,
          configs: { min: 10, max: 100, step: 1, unit: "%" },
        },
        {
          type: "range",
          label: "Ancho de la imagen (escritorio)",
          name: "mediaWidth",
          defaultValue: 60,
          configs: { min: 20, max: 100, step: 1, unit: "%" },
        },
        {
          type: "range",
          label: "Altura mínima (escritorio)",
          name: "minHeight",
          defaultValue: 100,
          configs: { min: 0, max: 100, step: 1, unit: "vh" },
        },
        {
          type: "range",
          label: "Altura de la imagen (móvil)",
          name: "mobileMediaHeight",
          defaultValue: 55,
          configs: { min: 20, max: 100, step: 1, unit: "vh" },
        },
       
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    width: "fixed",
    backgroundColor: "#0a0a0a",
    children: [
      {
        type: "subheading",
        content: "Monarch Remaster V3 · Phoenix Chairs",
        color: "#c4a27f",
        size: "0.7rem",
        letter: 3,
        fontFamily: "Courier New, monospace",
        alignment: "left",
        marginSelect: "b",
        marginText: "2rem",
      },
      {
        type: "heading",
        content: "El confort. A tu",
        as: "h1",
        color: "#f3f1ec",
        size: "custom",
        desktopSize: "clamp(3rem, 6vw, 6.2rem)",
        mobileSize: "3rem",
        weight: "800",
        letterSpacing: 0,
        lineH: 0.95,
        alignment: "left",
        family: "Montserrat",
        marginSelect: "b",
        marginText: "0",
      },
      {
        type: "heading",
        content: "Manera.",
        as: "div",
        color: "#c4a27f",
        size: "custom",
        desktopSize: "clamp(3rem, 6vw, 6.2rem)",
        mobileSize: "3rem",
        weight: "800",
        letterSpacing: 0,
        lineH: 0.95,
        alignment: "left",
        family: "Montserrat",
        marginSelect: "b",
        marginText: "2.5rem",
      },
      {
        type: "paragraph",
        content:
          "<p>Una acogida más suave. Un respaldo que invita a quedarse. Y cada apoyo, justo donde tú lo necesitas.</p>",
        color: "#c9c6bf",
        textSize: "1.05rem",
        lineH: 1.6,
        alignment: "left",
      },
      {
        type: "group-buttons",
        direction: "row",
        gap: 1.5,
        marginSelect: "y",
        marginText: "2.5rem",
        children: [
          {
            type: "button",
            content: "Descubre la V3",
            variant: "custom",
            backgroundColor: "#f3f1ec",
            textColor: "#0a0a0a",
            borderColor: "#f3f1ec",
            backgroundColorHover: "#00000000",
            textColorHover: "#f3f1ec",
            borderColorHover: "#f3f1ec",
            letter: 2,
            size: "0.72rem",
            paddingSelect: "a",
            paddingText: "20px 28px",
          },
          {
            type: "button",
            content: "Elige la tuya",
            variant: "custom",
            backgroundColor: "#00000000",
            textColor: "#f3f1ec",
            borderColor: "#00000000",
            backgroundColorHover: "#00000000",
            textColorHover: "#c4a27f",
            borderColorHover: "#00000000",
            letter: 2,
            size: "0.72rem",
            paddingSelect: "a",
            paddingText: "20px 0",
          },
        ],
      },
      {
        type: "subheading",
        content: "Monarch Remaster V3 · Desde 449 € · Impuestos y aduanas incluidos",
        color: "#c9c6bf",
        size: "0.62rem",
        letter: 2,
        fontFamily: "Courier New, monospace",
        alignment: "left",
      },
      {
        type: "slides-m-v3",
        children: [
          { type: "slide-image", label: "Prime Hybrid™ · Negro", swatchColor: "#2a2a2a" },
          { type: "slide-image", label: "Prime Hybrid™ · Gris", swatchColor: "#9a9a96" },
          { type: "slide-image", label: "Prime Hybrid™ · Blanco", swatchColor: "#f3f1ec" },
        ],
      },
      {
        type: "footer-m-v3",
        buttonSlides: true,
        children: [
          {
            type: "group-elements",
            children: [
              {
                type: "subheading",
                content: "Diseñada para tu espacio. Ajustada a tu forma de sentarte.",
                color: "#c9c6bf",
                size: "0.62rem",
                letter: 2,
                lineH: 1.7,
                fontFamily: "Courier New, monospace",
                alignment: "left",
                typeDecoration: "start",
                decoration:
                  '<span style="display:block;width:48px;height:1px;margin:0.55rem 16px 0 0;background:#c4a27f"></span>',
              },
            ],
          },
        ],
      },
    ],
  },
});
