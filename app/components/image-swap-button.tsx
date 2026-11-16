import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { useState, type CSSProperties } from "react";
import { type LinkStyles, linkStylesInputs, variants } from "~/components/link";
import { useImageSwap } from "~/stores/imageSwapStore";
import { cn } from "~/utils/cn";
import { selectorPaddingMargin } from "~/utils/general";

/**
 * Botón que sustituye la imagen mostrada por un componente "Image" de
 * image-with-text. Se enlaza por el campo "id" de esa imagen (targetId).
 */
interface ImageSwapButtonProps
  extends Partial<LinkStyles>,
    VariantProps<typeof variants>,
    HydrogenComponentProps {
  ref?: React.Ref<HTMLButtonElement>;
  text: string;
  targetId: string;
  image: WeaverseImage | string;
  activeOpacity: number;
  typeDecoration?: "none" | "start" | "end";
  decoration?: string;
  decorationGap?: string;
  // linkStylesInputs guarda la alineación con este nombre (errata heredada)
  aligment?: LinkStyles["alignment"];
}

function ImageSwapButton(props: ImageSwapButtonProps) {
  const {
    ref,
    text,
    targetId,
    image,
    activeOpacity,
    typeDecoration = "none",
    decoration,
    decorationGap,
    variant,
    textColor,
    underlineCustom,
    backgroundColor,
    borderColor,
    textColorHover,
    backgroundColorHover,
    borderColorHover,
    rounded,
    size,
    fontFamily,
    weight,
    letter,
    paddingSelect,
    paddingText,
    alignment,
    aligment,
    className,
    children,
    ...rest
  } = props;

  const [isHover, setIsHover] = useState(false);
  const target = targetId?.trim();
  const imageData: Partial<WeaverseImage> =
    typeof image === "string" ? { url: image, altText: text } : image;

  const setSwap = useImageSwap((state) => state.setSwap);
  const isActive = useImageSwap(
    (state) => Boolean(target) && state.swaps[target]?.url === imageData?.url,
  );

  let style: CSSProperties = {};
  if (variant === "custom") {
    style = {
      borderRadius: `${rounded}px`,
      letterSpacing: letter === 0 ? "normal" : `${letter}px`,
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      placeSelf: alignment ?? aligment,
      "--btn-text": textColor,
      "--btn-bg": backgroundColor,
      "--btn-border": borderColor,
      "--btn-bg-hover": backgroundColorHover,
      "--btn-text-hover": textColorHover,
      "--btn-border-hover": borderColorHover,
      textAlign: "center",
      ...(underlineCustom && {
        height: "fit-content",
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
      }),
    } as CSSProperties;
  }

  const decorationNode =
    typeDecoration !== "none" && decoration ? (
      <span
        aria-hidden="true"
        suppressHydrationWarning
        className="flex h-auto w-fit"
        dangerouslySetInnerHTML={{ __html: decoration }}
      />
    ) : null;

  return (
    <button
      ref={ref}
      {...rest}
      type="button"
      aria-pressed={isActive}
      aria-controls={target || undefined}
      onClick={() => {
        if (target && imageData?.url) {
          setSwap(target, imageData);
        }
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={cn(
        variants({ variant }),
        "z-3 cursor-pointer items-center justify-center",
        className,
      )}
      style={{
        ...style,
        gap: decorationNode ? decorationGap || "8px" : undefined,
        ...selectorPaddingMargin("padding", paddingSelect, paddingText),
        transform: isHover ? "translateY(-10%)" : "unset",
        opacity: isActive || isHover ? 1 : activeOpacity / 100,
        transition: "all 0.4s ease",
      }}
    >
      {typeDecoration === "start" && decorationNode}
      {text}
      {typeDecoration === "end" && decorationNode}
    </button>
  );
}

export default ImageSwapButton;

export const schema = createSchema({
  type: "image-swap-button",
  title: "Image swap button",
  settings: [
    {
      group: "Image swap",
      inputs: [
        {
          type: "text",
          name: "text",
          label: "Text content",
          defaultValue: "Ver imagen",
        },
        {
          type: "text",
          name: "targetId",
          label: "Image id",
          helpText:
            'El mismo valor que el campo "id" del componente Image de image-with-text.',
        },
        {
          type: "image",
          name: "image",
          label: "Image to show",
        },
        {
          type: "range",
          name: "activeOpacity",
          label: "Opacity when not selected",
          defaultValue: 100,
          configs: { min: 0, max: 100, step: 5, unit: "%" },
        },
        {
          type: "select",
          name: "typeDecoration",
          label: "Show decoration",
          configs: {
            options: [
              { value: "none", label: "None" },
              { value: "start", label: "Start" },
              { value: "end", label: "End" },
            ],
          },
          defaultValue: "none",
        },
        {
          type: "textarea",
          name: "decoration",
          label: "Decoration",
          helpText: "HTML o SVG (igual que en Subheading).",
          condition: (data: ImageSwapButtonProps) =>
            data.typeDecoration !== "none",
        },
        {
          type: "text",
          name: "decorationGap",
          label: "Decoration gap",
          defaultValue: "8px",
          condition: (data: ImageSwapButtonProps) =>
            data.typeDecoration !== "none",
        },
        {
          type: "select",
          name: "variant",
          label: "Variant",
          configs: {
            options: [
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Outline", value: "outline-solid" },
              { label: "Underline", value: "underline" },
              { label: "Custom styles", value: "custom" },
            ],
          },
          defaultValue: "custom",
        },
        {
          type: "heading",
          label: "Button custom styles",
        },
        ...linkStylesInputs,
      ],
    },
  ],
  presets: {
    text: "Ver imagen",
    image: IMAGES_PLACEHOLDERS.image,
    variant: "custom",
    backgroundColor: "#00000000",
    textColor: "#fff",
    borderColor: "#fff",
    backgroundColorHover: "#fff",
    textColorHover: "#000",
    borderColorHover: "#fff",
  },
});
