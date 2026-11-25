import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";
import { getTextStyle, omitTextStyleProps, TEXT_SIZE_CLASS, textStyleInputs } from "~/utils/text-style";
import { useSliderV3 } from "./context";

const TEXT_PREFIXES = ["swatchLabel"];

interface FooterMonarchV3Props extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  buttonSlides: boolean;
  activeColor: string;
  /** Ajuste antiguo: se usa como color si aún no hay "swatchLabelColor" */
  labelColor?: string;
}

/** Barra inferior: muestras de color del carrusel a la izquierda y contenido libre a la derecha. */
export default function FooterMonarchV3(props: FooterMonarchV3Props) {
  const {
    buttonSlides = true,
    activeColor = "#c4a27f",
    labelColor = "#c9c6bf",
    children,
    ref,
    ...restProps
  } = props;
  const rest = omitTextStyleProps(restProps as Record<string, unknown>, TEXT_PREFIXES);
  const labelStyle = getTextStyle(props as unknown as Record<string, unknown>, "swatchLabel", {
    color: labelColor,
    "--ts-m": "0.78rem",
    "--ts-d": "0.78rem",
  } as React.CSSProperties);
  const ctx = useSliderV3();
  const slides = ctx?.slides ?? [];
  const active = slides[ctx?.activeIndex ?? 0];

  const goTo = (index: number) => {
    const swiper = ctx?.swiper;
    if (!swiper || swiper.destroyed) return;
    if (swiper.params.loop) swiper.slideToLoop(index);
    else swiper.slideTo(index);
    // slideTo() no cuenta como interacción para Swiper: se para el autoplay a mano
    const autoplay = swiper.params.autoplay;
    if (typeof autoplay === "object" && autoplay.disableOnInteraction) swiper.autoplay?.stop();
  };

  return (
    <div
      ref={ref}
      {...rest}
      className="relative z-10 flex flex-col gap-6 md:flex-row  md:justify-between [&>*]:pointer-events-auto"
    >
      {buttonSlides && slides.length > 1 ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" role="tablist">
            {slides.map((slide, index) => {
              const isActive = index === (ctx?.activeIndex ?? 0);
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={slide.label || `Slide ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    "flex size-8 cursor-pointer items-center justify-center rounded-full border bg-transparent p-0 transition-colors",
                    !isActive && "border-transparent hover:border-white/30",
                  )}
                  style={isActive ? { borderColor: activeColor } : undefined}
                >
                  <span
                    className="block size-5 rounded-full border border-white/15 bg-center bg-cover"
                    style={{
                      backgroundColor: slide.swatchColor,
                      backgroundImage: slide.swatchImage ? `url(${slide.swatchImage})` : undefined,
                    }}
                  />
                </button>
              );
            })}
          </div>
          {active?.label && (
            <span className={TEXT_SIZE_CLASS} style={labelStyle}>
              {active.label}
            </span>
          )}
        </div>
      ) : (
        <span />
      )}

      <div>{children}</div>
    </div>
  );
}

export const schema = createSchema({
  title: "Footer",
  type: "footer-m-v3",
  childTypes: ["group-elements"],
  settings: [
    {
      group: "general",
      inputs: [
        {
          type: "switch",
          label: "Mostrar muestras de color (slides)",
          name: "buttonSlides",
          defaultValue: true,
        },
        { type: "color", label: "Color de la muestra activa", name: "activeColor", defaultValue: "#c4a27f" },
      ],
    },
    {
      group: "Texto · Nombre de la muestra",
      inputs: textStyleInputs("swatchLabel", {
        Color: "#c9c6bf",
        MobileSize: "0.78rem",
        DesktopSize: "0.78rem",
        Weight: "400",
      }),
    },
  ],
});
