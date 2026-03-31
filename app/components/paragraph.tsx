import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

export interface ParagraphProps
  extends VariantProps<typeof variants>,
    Partial<HydrogenComponentProps> {
  ref?: React.Ref<HTMLParagraphElement | HTMLDivElement>;
  as?: "p" | "div";
  content: string;
  textSize:string;
  color?: string;
  contWidth:number;
}

const variants = cva("paragraph", {
  variants: {
    width: {
      full: "mx-auto w-full",
      narrow: "mx-auto w-full max-w-4xl md:w-1/2 lg:w-3/4",
    },
    alignment: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    width: "full",
  },
});

function Paragraph(props: ParagraphProps) {
  const {
    ref,
    as: Tag = "p",
    width,
    content,
    textSize,
    color,
    alignment,
    contWidth,
    className,
    ...rest
  } = props;
  return (
    <Tag
      ref={ref}
      data-motion="fade-up"
      {...rest}
      className={clsx(variants({width, alignment, className }))}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ 
        color:color,
        fontSize:textSize,
        width:window.innerWidth>600?`${contWidth}%`:"100%" 
      }}
    />
  );
}

export default Paragraph;

export const schema = createSchema({
  type: "paragraph",
  title: "Paragraph",
  settings: [
    {
      group: "Paragraph",
      inputs: [
        {
          type:'range',
          label:'container width',
          name:'contWidth',
          defaultValue:100,
          configs:{
            min:20,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type: "richtext",
          name: "content",
          label: "Content",
          defaultValue:
            "Pair large text with an image or full-width video to showcase your brand's lifestyle to describe and showcase an important detail of your products that you can tag on your image.",
          placeholder:
            "Pair large text with an image or full-width video to showcase your brand's lifestyle to describe and showcase an important detail of your products that you can tag on your image.",
        },
        {
          type: "select",
          name: "as",
          label: "HTML tag",
          configs: {
            options: [
              { value: "p", label: "<p> (Paragraph)" },
              { value: "div", label: "<div> (Div)" },
            ],
          },
          defaultValue: "p",
        },
        {
          type: "color",
          name: "color",
          label: "Text color",
        },
        {
          type: "text",
          name: "textSize",
          label: "Text size",
          defaultValue: "1rem",
        },
        {
          type: "toggle-group",
          name: "width",
          label: "Width",
          configs: {
            options: [
              { value: "full", label: "Full", icon: "move-horizontal" },
              {
                value: "narrow",
                label: "Narrow",
                icon: "fold-horizontal",
              },
            ],
          },
          defaultValue: "narrow",
        },
        {
          type: "toggle-group",
          name: "alignment",
          label: "Alignment",
          configs: {
            options: [
              { value: "left", label: "Left", icon: "align-start-vertical" },
              {
                value: "center",
                label: "Center",
                icon: "align-center-vertical",
              },
              { value: "right", label: "Right", icon: "align-end-vertical" },
            ],
          },
          defaultValue: "center",
        },
      ],
    },
  ],
});
