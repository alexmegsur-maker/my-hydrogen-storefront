import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { Image } from "~/components/image";

interface SlideMonarchV3Props extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  image?: WeaverseImage;
  /** Nombre antiguo del ajuste (con mayúscula): se mantiene para no perder las imágenes ya guardadas */
  Imagen?: WeaverseImage;
  label: string;
  swatchColor: string;
  swatchImage?: WeaverseImage;
  objectPosition: "center" | "right" | "left";
}

/** Imagen de una variante. El nombre y la muestra de color se usan en el footer. */
export default function SlideMonarchV3(props: SlideMonarchV3Props) {
  const {
    image: newImage,
    Imagen,
    label,
    swatchColor,
    swatchImage,
    objectPosition = "center",
    ref,
    children,
    ...rest
  } = props;
  const image = newImage ?? Imagen;

  return (
    <div ref={ref} {...rest} className="h-full w-full">
      {image && (
        <Image
          data={{ ...image, altText: image.altText || label || "Producto" }}
          loading="eager"
          className="h-full w-full object-contain"
          style={{ objectPosition }}
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      )}
    </div>
  );
}

export const schema = createSchema({
  title: "slide image",
  type: "slide-image",
  settings: [
    {
      group: "general",
      inputs: [
        { type: "image", label: "Imagen", name: "image" },
        {
          type: "toggle-group",
          label: "Posición de la imagen",
          name: "objectPosition",
          configs: {
            options: [
              { value: "left", label: "Izquierda" },
              { value: "center", label: "Centro" },
              { value: "right", label: "Derecha" },
            ],
          },
          defaultValue: "center",
        },
      ],
    },
    {
      group: "Muestra (footer)",
      inputs: [
        { type: "text", label: "Nombre", name: "label", defaultValue: "Prime Hybrid™ · Gris" },
        { type: "color", label: "Color de la muestra", name: "swatchColor", defaultValue: "#9a9a96" },
        {
          type: "image",
          label: "Imagen de la muestra (opcional, p. ej. textura)",
          name: "swatchImage",
        },
      ],
    },
  ],
});
