import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { type CSSProperties, useId, useState } from "react";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  TEXT_SIZE_CLASS,
  textStyleInputs,
} from "~/utils/text-style";

const TEXT_PREFIXES = ["inputLabel", "sizeName", "sizeDescription"];

type Size = "default" | "r" | "xl";

interface SizeRecommenderProps extends HydrogenComponentProps {
  defaultImage: WeaverseImage | string;
  rImage: WeaverseImage | string;
  xlImage: WeaverseImage | string;
  aspectRatio: string;
  fadeDuration: number;
  heightLabel: string;
  heightPlaceholder: string;
  weightLabel: string;
  weightPlaceholder: string;
  rName: string;
  rDescription: string;
  rMaxHeight: number;
  rMaxWeight: number;
  xlName: string;
  xlDescription: string;
  rFillHeight: number;
  rFillWeight: number;
  xlFillHeight: number;
  xlFillWeight: number;
  backgroundColor: string;
  borderColor: string;
  inputBackground: string;
  inputTextColor: string;
  accentColor: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Sin ningún dato → imagen inicial. Con altura o peso → R si ambos (los que
 * haya) caben en sus máximos; si alguno los supera → XL.
 */
function getSize(
  height: number | null,
  weight: number | null,
  rMaxHeight: number,
  rMaxWeight: number,
): Size {
  if (height === null && weight === null) {
    return "default";
  }
  const exceedsHeight = height !== null && height > rMaxHeight;
  const exceedsWeight = weight !== null && weight > rMaxWeight;
  return exceedsHeight || exceedsWeight ? "xl" : "r";
}

function toNumber(value: string): number | null {
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function toImageData(image: WeaverseImage | string, alt: string) {
  return typeof image === "object" ? image : { url: image, altText: alt };
}

function SizeRecommender(props: SizeRecommenderProps) {
  const {
    defaultImage,
    rImage,
    xlImage,
    aspectRatio,
    fadeDuration,
    heightLabel,
    heightPlaceholder,
    weightLabel,
    weightPlaceholder,
    rName,
    rDescription,
    rMaxHeight,
    rMaxWeight,
    xlName,
    xlDescription,
    rFillHeight,
    rFillWeight,
    xlFillHeight,
    xlFillWeight,
    backgroundColor,
    borderColor,
    inputBackground,
    inputTextColor,
    accentColor,
    ref,
    ...rest
  } = props;

  const id = useId();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const size = getSize(
    toNumber(height),
    toNumber(weight),
    rMaxHeight ?? 180,
    rMaxWeight ?? 120,
  );

  const textStyle = (prefix: string) =>
    getTextStyle(props as unknown as Record<string, unknown>, prefix);

  const images: { key: Size; image: WeaverseImage | string; alt: string }[] = [
    { key: "default", image: defaultImage, alt: "Guía de tallas" },
    { key: "r", image: rImage, alt: rName },
    { key: "xl", image: xlImage, alt: xlName },
  ];

  const inputClass =
    "w-full border border-(--sz-border) bg-(--sz-input-bg) px-4 py-3 font-mono text-(--sz-input-text) text-sm outline-none transition-colors focus:border-(--sz-accent) [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  // Pulsar una talla rellena los campos con sus valores de ejemplo, lo que
  // a su vez cambia la imagen y marca la talla.
  const fillValues = {
    r: { height: rFillHeight ?? 175, weight: rFillWeight ?? 80 },
    xl: { height: xlFillHeight ?? 195, weight: xlFillWeight ?? 110 },
  };

  const sizeCard = (key: Exclude<Size, "default">, name: string, text: string) => (
    <button
      type="button"
      onClick={() => {
        setHeight(String(fillValues[key].height));
        setWeight(String(fillValues[key].weight));
      }}
      className={cn(
        "flex cursor-pointer flex-col gap-1 border p-3 text-left transition-colors duration-300 hover:border-(--sz-accent)",
        size === key ? "border-(--sz-accent)" : "border-(--sz-border)",
      )}
      aria-pressed={size === key}
    >
      <span className={TEXT_SIZE_CLASS} style={textStyle("sizeName")}>
        {name}
      </span>
      {text && (
        <span className={TEXT_SIZE_CLASS} style={textStyle("sizeDescription")}>
          {text}
        </span>
      )}
    </button>
  );

  return (
    <div
      ref={ref}
      {...omitTextStyleProps(rest, TEXT_PREFIXES)}
      className="flex w-full flex-col gap-4"
      style={
        {
          "--sz-border": borderColor,
          "--sz-input-bg": inputBackground,
          "--sz-input-text": inputTextColor,
          "--sz-accent": accentColor,
        } as CSSProperties
      }
    >
      {/* Las tres imágenes apiladas; solo la de la talla actual es visible (fundido). */}
      <div
        className="relative w-full overflow-hidden border border-(--sz-border)"
        style={{ aspectRatio: aspectRatio || "16/9", backgroundColor }}
      >
        {images.map(({ key, image, alt }) =>
          image ? (
            <Image
              key={key}
              data={toImageData(image, alt)}
              sizes="(min-width: 64em) 50vw, 100vw"
              width={1200}
              className="absolute inset-0 [&_img]:h-full [&_img]:w-full [&_img]:object-contain"
              containerStyle={{
                opacity: size === key ? 1 : 0,
                transition: `opacity ${fadeDuration ?? 500}ms ease`,
              }}
              aria-hidden={size !== key}
            />
          ) : null,
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label htmlFor={`${id}-height`} className="flex flex-col gap-2">
          <span className={TEXT_SIZE_CLASS} style={textStyle("inputLabel")}>
            {heightLabel}
          </span>
          <input
            id={`${id}-height`}
            type="number"
            inputMode="decimal"
            min={0}
            placeholder={heightPlaceholder}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={inputClass}
          />
        </label>
        <label htmlFor={`${id}-weight`} className="flex flex-col gap-2">
          <span className={TEXT_SIZE_CLASS} style={textStyle("inputLabel")}>
            {weightLabel}
          </span>
          <input
            id={`${id}-weight`}
            type="number"
            inputMode="decimal"
            min={0}
            placeholder={weightPlaceholder}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3" aria-live="polite">
        {sizeCard("r", rName, rDescription)}
        {sizeCard("xl", xlName, xlDescription)}
      </div>
    </div>
  );
}

export default SizeRecommender;

export const schema = createSchema({
  type: "size-recommender",
  title: "Recomendador de talla",
  enabledOn: {
    groups: ["*"],
  },
  settings: [
    {
      group: "Imágenes",
      inputs: [
        {
          type: "image",
          name: "defaultImage",
          label: "Imagen inicial (sin datos)",
          defaultValue: IMAGES_PLACEHOLDERS.image,
        },
        {
          type: "image",
          name: "rImage",
          label: "Imagen talla R",
          defaultValue: IMAGES_PLACEHOLDERS.product_1,
        },
        {
          type: "image",
          name: "xlImage",
          label: "Imagen talla XL",
          defaultValue: IMAGES_PLACEHOLDERS.product_2,
        },
        {
          type: "text",
          name: "aspectRatio",
          label: "Proporción de la imagen",
          defaultValue: "2/1",
          placeholder: "2/1",
          helpText: "Ancho/alto, por ejemplo 16/9 o 2/1.",
        },
        {
          type: "range",
          name: "fadeDuration",
          label: "Duración del fundido",
          defaultValue: 500,
          configs: { min: 0, max: 2000, step: 50, unit: "ms" },
        },
      ],
    },
    {
      group: "Campos",
      inputs: [
        {
          type: "text",
          name: "heightLabel",
          label: "Etiqueta de altura",
          defaultValue: "Altura (cm)",
        },
        {
          type: "text",
          name: "heightPlaceholder",
          label: "Ejemplo de altura",
          defaultValue: "178",
        },
        {
          type: "text",
          name: "weightLabel",
          label: "Etiqueta de peso",
          defaultValue: "Peso (kg)",
        },
        {
          type: "text",
          name: "weightPlaceholder",
          label: "Ejemplo de peso",
          defaultValue: "82",
        },
      ],
    },
    {
      group: "Tallas",
      inputs: [
        {
          type: "text",
          name: "rName",
          label: "Nombre talla R",
          defaultValue: "R",
        },
        {
          type: "text",
          name: "rDescription",
          label: "Descripción talla R",
          defaultValue: "Hasta 180 cm · hasta 120 kg",
        },
        {
          type: "range",
          name: "rMaxHeight",
          label: "Altura máxima para R",
          defaultValue: 180,
          configs: { min: 140, max: 220, step: 1, unit: "cm" },
          helpText: "Por encima de esta altura se recomienda XL.",
        },
        {
          type: "range",
          name: "rMaxWeight",
          label: "Peso máximo para R",
          defaultValue: 120,
          configs: { min: 40, max: 200, step: 1, unit: "kg" },
          helpText: "Por encima de este peso se recomienda XL.",
        },
        {
          type: "text",
          name: "xlName",
          label: "Nombre talla XL",
          defaultValue: "XL",
        },
        {
          type: "text",
          name: "xlDescription",
          label: "Descripción talla XL",
          defaultValue: "Hasta 205 cm · hasta 150 kg",
        },
        {
          type: "heading",
          label: "Valores al pulsar cada talla",
        },
        {
          type: "range",
          name: "rFillHeight",
          label: "Altura al pulsar R",
          defaultValue: 175,
          configs: { min: 140, max: 220, step: 1, unit: "cm" },
          helpText: "Debe quedar dentro de los máximos de R para que se marque R.",
        },
        {
          type: "range",
          name: "rFillWeight",
          label: "Peso al pulsar R",
          defaultValue: 80,
          configs: { min: 40, max: 200, step: 1, unit: "kg" },
        },
        {
          type: "range",
          name: "xlFillHeight",
          label: "Altura al pulsar XL",
          defaultValue: 195,
          configs: { min: 140, max: 220, step: 1, unit: "cm" },
          helpText: "Debe superar algún máximo de R para que se marque XL.",
        },
        {
          type: "range",
          name: "xlFillWeight",
          label: "Peso al pulsar XL",
          defaultValue: 110,
          configs: { min: 40, max: 200, step: 1, unit: "kg" },
        },
      ],
    },
    {
      group: "Colores",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Fondo de la imagen",
          defaultValue: "#0b0c0f",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Bordes",
          defaultValue: "#24262b",
        },
        {
          type: "color",
          name: "inputBackground",
          label: "Fondo de los campos",
          defaultValue: "#0b0c0f",
        },
        {
          type: "color",
          name: "inputTextColor",
          label: "Texto de los campos",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "accentColor",
          label: "Talla recomendada / foco",
          defaultValue: "#c9a24b",
        },
      ],
    },
    {
      group: "Texto: etiquetas de los campos",
      inputs: textStyleInputs("inputLabel", {
        Color: "#8a8f98",
        MobileSize: "10px",
        DesktopSize: "10px",
        Weight: "400",
        Transform: "uppercase",
        LetterSpacing: 2,
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto: nombre de la talla",
      inputs: textStyleInputs("sizeName", {
        Color: "#ffffff",
        MobileSize: "13px",
        DesktopSize: "13px",
        Weight: "700",
        Transform: "uppercase",
      }),
    },
    {
      group: "Texto: descripción de la talla",
      inputs: textStyleInputs("sizeDescription", {
        Color: "#8a8f98",
        MobileSize: "11px",
        DesktopSize: "11px",
        Weight: "400",
        Family: MONO_FONT,
      }),
    },
  ],
});
