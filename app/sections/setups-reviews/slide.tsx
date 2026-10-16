import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  TEXT_SIZE_CLASS,
  textStyleInputs,
} from "~/utils/text-style";

interface SetupsReviewsSlideProps extends HydrogenComponentProps {
  image: WeaverseImage | string;
  title: string;
  caption: string;
  link: string;
  aspectRatio: string;
  customAspectRatio: string;
  objectFit: "cover" | "contain";
  mobileWidth: number;
  desktopWidth: number;
  ref?: React.Ref<HTMLDivElement>;
}

/** Valor CSS de aspect-ratio: "4/5" → "4 / 5"; "original" usa las medidas de la imagen. */
function resolveAspectRatio(
  aspectRatio: string,
  customAspectRatio: string,
  image: { width?: number | null; height?: number | null },
): string | undefined {
  const value = aspectRatio === "custom" ? customAspectRatio : aspectRatio;
  if (value === "original") {
    return image.width && image.height
      ? `${image.width} / ${image.height}`
      : undefined;
  }
  const match = value?.match(/^\s*(\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)\s*$/);
  return match ? `${match[1]} / ${match[2]}` : "1 / 1";
}

function SetupsReviewsSlide(props: SetupsReviewsSlideProps) {
  const {
    image,
    title,
    caption,
    link,
    aspectRatio = "1/1",
    customAspectRatio,
    objectFit = "cover",
    mobileWidth,
    desktopWidth,
    ref,
    ...rest
  } = props;
  const textStyle = (prefix: string) =>
    getTextStyle(props as unknown as Record<string, unknown>, prefix);
  const data =
    typeof image === "object" ? image : { url: image, altText: title };
  const ratio = resolveAspectRatio(
    aspectRatio,
    customAspectRatio,
    data as { width?: number; height?: number },
  );

  const content = (
    <>
      <Image
        data={data}
        loading="lazy"
        // Con "contain" no se recorta en el CDN: se ve la imagen entera.
        aspectRatio={
          objectFit === "cover" ? ratio?.replaceAll(" ", "") : undefined
        }
        width={1000}
        sizes="(min-width: 64em) 33vw, (min-width: 40em) 50vw, 85vw"
        className={cn(
          "[&_img]:h-full [&_img]:w-full",
          objectFit === "contain"
            ? "[&_img]:object-contain"
            : "[&_img]:object-cover",
        )}
      />
      {(title || caption) && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-linear-to-t from-black/80 to-transparent p-3 pt-10">
          {title && (
            <span className={TEXT_SIZE_CLASS} style={textStyle("title")}>
              {title}
            </span>
          )}
          {caption && (
            <span className={TEXT_SIZE_CLASS} style={textStyle("caption")}>
              {caption}
            </span>
          )}
        </div>
      )}
    </>
  );

  return (
    <div
      ref={ref}
      {...omitTextStyleProps(rest, ["title", "caption"])}
      // sr-slide: la sección le aplica --sw-m / --sw-d en modo libre.
      className="sr-slide relative w-full overflow-hidden border border-(--sr-border)"
      style={
        {
          aspectRatio: ratio,
          "--sw-m": `${mobileWidth || 260}px`,
          "--sw-d": `${desktopWidth || 360}px`,
        } as CSSProperties
      }
    >
      {link ? (
        <a href={link} className="block h-full w-full">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export default SetupsReviewsSlide;

export const schema = createSchema({
  type: "setups-reviews--slide",
  title: "Imagen",
  settings: [
    {
      group: "Imagen",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Imagen",
          defaultValue: IMAGES_PLACEHOLDERS.image,
        },
        {
          type: "text",
          name: "title",
          label: "Título",
          defaultValue: "Monarch LOTR Rivendell Edition",
        },
        {
          type: "text",
          name: "caption",
          label: "Autor / usuario",
          defaultValue: "@usuario",
        },
        {
          type: "url",
          name: "link",
          label: "Enlace (opcional)",
        },
      ],
    },
    {
      group: "Tamaño y proporción",
      inputs: [
        {
          type: "select",
          name: "aspectRatio",
          label: "Proporción",
          defaultValue: "1/1",
          configs: {
            options: [
              { value: "1/1", label: "Cuadrada 1:1" },
              { value: "4/5", label: "Vertical 4:5" },
              { value: "3/4", label: "Vertical 3:4" },
              { value: "2/3", label: "Vertical 2:3" },
              { value: "9/16", label: "Vertical 9:16 (story)" },
              { value: "4/3", label: "Horizontal 4:3" },
              { value: "3/2", label: "Horizontal 3:2" },
              { value: "16/9", label: "Horizontal 16:9" },
              { value: "21/9", label: "Panorámica 21:9" },
              { value: "original", label: "Original de la imagen" },
              { value: "custom", label: "Personalizada" },
            ],
          },
        },
        {
          type: "text",
          name: "customAspectRatio",
          label: "Proporción personalizada",
          defaultValue: "5/7",
          placeholder: "5/7",
          helpText: "Ancho/alto, por ejemplo 5/7 o 1.91/1.",
          condition: (data: SetupsReviewsSlideProps) =>
            data.aspectRatio === "custom",
        },
        {
          type: "select",
          name: "objectFit",
          label: "Ajuste de la imagen",
          defaultValue: "cover",
          configs: {
            options: [
              { value: "cover", label: "Rellenar (recorta)" },
              { value: "contain", label: "Completa (sin recortar)" },
            ],
          },
        },
        {
          type: "range",
          name: "desktopWidth",
          label: "Ancho en escritorio",
          defaultValue: 360,
          configs: { min: 120, max: 1200, step: 10, unit: "px" },
          helpText:
            "Solo con \"Tamaño de las imágenes: Libre\" en la sección.",
        },
        {
          type: "range",
          name: "mobileWidth",
          label: "Ancho en móvil",
          defaultValue: 260,
          configs: { min: 100, max: 600, step: 10, unit: "px" },
          helpText:
            "Solo con \"Tamaño de las imágenes: Libre\" en la sección.",
        },
      ],
    },
    {
      group: "Texto: título",
      inputs: textStyleInputs("title", { Color: "#ffffff", MobileSize: "10px", DesktopSize: "10px", Weight: "700", Transform: "uppercase", LetterSpacing: 1.5 }),
    },
    {
      group: "Texto: autor / usuario",
      inputs: textStyleInputs("caption", { Color: "#8a8f98", MobileSize: "10px", DesktopSize: "10px", Weight: "400", LetterSpacing: 1.5, Family: MONO_FONT }),
    },
  ],
});
