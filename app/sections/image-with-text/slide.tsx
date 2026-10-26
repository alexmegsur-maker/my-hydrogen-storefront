import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";

interface ImageWithTextSlideProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  image: WeaverseImage | string;
  objectFit: "cover" | "contain";
}

function ImageWithTextSlide(props: ImageWithTextSlideProps) {
  const {
    image = IMAGES_PLACEHOLDERS.image,
    objectFit = "cover",
    ref,
    ...rest
  } = props;

  const imageData: Partial<WeaverseImage> =
    typeof image === "string" ? { url: image, altText: "Placeholder" } : image;

  return (
    <div ref={ref} {...rest} className="h-full w-full">
      <Image
        data={imageData}
        sizes="auto"
        className={cn(
          "h-full w-full",
          objectFit === "contain" ? "object-contain" : "object-cover",
        )}
      />
    </div>
  );
}

export default ImageWithTextSlide;

export const schema = createSchema({
  type: "image-with-text--slide",
  title: "Slide",
  settings: [
    {
      group: "Slide",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Image",
        },
        {
          type: "select",
          name: "objectFit",
          label: "Object fit",
          defaultValue: "cover",
          configs: {
            options: [
              { value: "cover", label: "Cover" },
              { value: "contain", label: "Contain" },
            ],
          },
        },
      ],
    },
  ],
  presets: {
    image: IMAGES_PLACEHOLDERS.image,
    objectFit: "cover",
  },
});
