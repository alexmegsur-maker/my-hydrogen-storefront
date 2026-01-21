import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { CSSProperties } from "react";
import { Image } from "~/components/image";
import Link, { type LinkProps, linkContentInputs } from "~/components/link";
import type { ImageAspectRatio } from "~/types/others";
import { calculateAspectRatio } from "~/utils/image";

const variants = cva("", {
  variants: {
    size: {
      col1: "col-span-1",
      col2: "col-span-2",
      col3: "col-span-3",
      col4: "col-span-4",
      col5: "col-span-5",
      col6: "col-span-6",
      col7: "col-span-7",
    },
    hideOnMobile: {
      true: "hidden sm:block",
      false: "",
    },
  },
});

interface ColumnWithImageItemProps
  extends VariantProps<typeof variants>,
    Pick<LinkProps, "variant" | "text" | "to">,
    HydrogenComponentProps {
  imageSrc: WeaverseImage;
  imageAspectRatio: ImageAspectRatio;
  imageBorderRadius: number;
  imageSize: number;
  heading: string;
  content: string;
  ref?: React.Ref<HTMLDivElement>;
}

function ColumnWithImageItem(props: ColumnWithImageItemProps) {
  const {
    imageSrc,
    imageAspectRatio,
    imageBorderRadius,
    imageSize,
    heading,
    content,
    text,
    to,
    variant,
    hideOnMobile,
    size,
    ref,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      {...rest}
      data-motion="slide-in"
      className={variants({ size, hideOnMobile })}
      style={{ "--radius": `${imageBorderRadius}px` } as CSSProperties}
    >
      <Image
        data={typeof imageSrc === "object" ? imageSrc : { url: imageSrc }}
        sizes="auto"
        className="h-auto rounded-(--radius)"
        style={{
          width:`${imageSize}%`,
          alignSelf:"center",
          justifySelf:"center",
          
        }}
        aspectRatio={calculateAspectRatio(imageSrc, imageAspectRatio)}
      />
      <div className="mt-6 w-full space-y-3.5 text-center">
        {heading && <h6>{heading}</h6>}
        {content && <p dangerouslySetInnerHTML={{ __html: content }} />}
        {text && (
          <Link variant={variant} to={to}>
            {text}
          </Link>
        )}
      </div>
    </div>
  );
}

export default ColumnWithImageItem;

export const schema = createSchema({
  type: "column-with-image--item",
  title: "Column",
  settings: [
    {
      group: "Column",
      inputs: [
        {
          type: "select",
          name: "size",
          label: "Column size",
          configs: {
            options: [
              {
                label: "Column 1",
                value: "col1",
              },
              {
                label: "Column 2",
                value: "col2",
              },
              {
                label: "Column 3",
                value: "col3",
              },
              {
                label: "Column 4",
                value: "col4",
              },
              {
                label: "Column 5",
                value: "col5",
              },
              {
                label: "Column 6",
                value: "col6",
              },
              {
                label: "Column 7",
                value: "col7",
              },
              
            ],
          },
          defaultValue: "col4",
        },
        {
          type: "switch",
          label: "Hide on Mobile",
          name: "hideOnMobile",
          defaultValue: false,
        },
        {
          type: "heading",
          label: "Image",
        },
        {
          type: "image",
          name: "imageSrc",
          label: "Image",
        },
        {
          type:'range',
          label:'imageSize',
          name:'imageSize',
          defaultValue:100,
          configs:{
            min:10,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Image aspect ratio",
          defaultValue: "adapt",
          configs: {
            options: [
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
              { value: "16/9", label: "Widescreen (16/9)" },
            ],
          },
          helpText:
            'Learn more about image <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" target="_blank" rel="noopener noreferrer">aspect ratio</a> property.',
        },
        {
          type: "range",
          name: "imageBorderRadius",
          label: "Image border radius",
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
          defaultValue: 0,
        },
        {
          type: "heading",
          label: "Content",
        },
        {
          type: "text",
          name: "heading",
          label: "Heading",
          placeholder: "Example heading",
          defaultValue: "Example heading",
        },
        {
          type: "richtext",
          label: "Description",
          name: "content",
          placeholder:
            "Use this section to promote content throughout every page of your site. Add images for further impact.",
          defaultValue:
            "Use this section to promote content throughout every page of your site. Add images for further impact.",
        },

        {
          type: "heading",
          label: "Button (optional)",
        },
        ...linkContentInputs,
      ],
    },
  ],
  presets: {
    imageSrc: IMAGES_PLACEHOLDERS.product_4,
  },
});
