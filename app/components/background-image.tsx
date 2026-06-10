import { Image } from "@shopify/hydrogen";
import type { InspectorGroup, WeaverseImage } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { CSSProperties } from "react";

const variants = cva("absolute inset-0 z-[-1] h-full w-full", {
  variants: {
    backgroundFit: {
      fill: "object-fill",
      cover: "object-cover",
      contain: "object-contain",
    },
    backgroundPosition: {
      "top left": "object-[top_left]",
      "top center": "object-[top_center]",
      "top right": "object-[top_right]",
      "center left": "object-[center_left]",
      "center center": "object-[center_center]",
      "center right": "object-[center_right]",
      "bottom left": "object-[bottom_left]",
      "bottom center": "object-[bottom_center]",
      "bottom right": "object-[bottom_right]",
    },
  },
  defaultVariants: {
    backgroundFit: "cover",
    backgroundPosition: "center center",
  },
});

export type BackgroundImageProps = VariantProps<typeof variants> & {
  backgroundImage?: WeaverseImage | string;
  style?:CSSProperties;
  backgroundGrayscale?:number;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  width?: number;
};

function addWidth(url: string, w: number) {
  return `${url}${url.includes('?') ? '&' : '?'}width=${w}`;
}

export function BackgroundImage(props: BackgroundImageProps) {
  const { backgroundImage, style, backgroundGrayscale, backgroundFit, backgroundPosition, loading, fetchPriority, sizes = "100vw", width = 1920 } = props;
  if (backgroundImage) {
    const {filter:externalFilter,...restStyle}=style || {};

    const data =
      typeof backgroundImage === "string"
        ? { url: backgroundImage, altText: "Section background" }
        : backgroundImage;

    const preloadSrcSet = fetchPriority === "high" && data?.url
      ? [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 1920]
          .map(w => `${addWidth(data.url, w)} ${w}w`)
          .join(', ')
      : null;

    return (
      <>
        {preloadSrcSet && (
          <link
            rel="preload"
            as="image"
            // @ts-ignore — React 19 hoists this to <head>
            imageSrcSet={preloadSrcSet}
            imageSizes="100vw"
            href={addWidth(data.url, 800)}
          />
        )}
        <Image
          className={variants({ backgroundFit, backgroundPosition })}
          data={data}
          sizes={sizes}
          width={width}
          loading={loading}
          fetchPriority={fetchPriority}
          style={{
            ...restStyle,
            filter: [
              externalFilter,
              backgroundGrayscale ? `grayscale(${backgroundGrayscale}%)` : undefined
            ]
              .filter(Boolean)
              .join(" ") || undefined,
          }}
        />
      </>
    );
  }
  return null;
}

export const backgroundInputs: InspectorGroup["inputs"] = [
  {
    type: "select",
    name: "backgroundFor",
    label: "Background for",
    configs: {
      options: [
        { value: "section", label: "Section" },
        { value: "content", label: "Content" },
      ],
    },
    defaultValue: "section",
  },
  {
    type: "color",
    name: "backgroundColor",
    label: "Background color",
    defaultValue: "",
  },
  {
    type: "image",
    name: "backgroundImage",
    label: "Background image",
  },
  {
    type: "select",
    name: "backgroundFit",
    label: "Background fit",
    configs: {
      options: [
        { value: "fill", label: "Fill" },
        { value: "cover", label: "Cover" },
        { value: "contain", label: "Contain" },
      ],
    },
    defaultValue: "cover",
    condition: (data: BackgroundImageProps) => Boolean(data.backgroundImage),
  },
  {
    type: "position",
    name: "backgroundPosition",
    label: "Background position",
    defaultValue: "center center",
    condition: (data: BackgroundImageProps) => Boolean(data.backgroundImage),
  },
  {
    type:'range',
    label:'grayscale',
    name:'backgroundGrayscale',
    defaultValue:0,
    configs:{
      min:0,
      max:100,
      step:1,
      unit:'%',
    }
  },
];
