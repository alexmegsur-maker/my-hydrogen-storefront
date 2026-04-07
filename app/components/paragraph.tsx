import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { useIsMobile } from "~/hooks/use-is-mobile";

export interface ParagraphProps
  extends VariantProps<typeof variants>,
    Partial<HydrogenComponentProps> {
  ref?: React.Ref<HTMLParagraphElement | HTMLDivElement>;
  as?: "p" | "div";
  content: string;
  alignment:"left"|"center"|"right";
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
  const isMobile = useIsMobile(600);

  return (
    <Tag
      ref={ref}
      data-motion="fade-up"
      {...rest}
      className={clsx(variants({width, className }))}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ 
        color:color,
        textAlign:alignment,
        fontSize:textSize,
        width:!isMobile?`${contWidth}%`:"100%" 
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
              { value: "left", label: "Left" },
              {
                value: "center",
                label: "Center",
              },
              { value: "right", label: "Right"},
              { value: "justify", label: "Justify"},
            ],
          },
          defaultValue: "center",
        },
      ],
    },
  ],
});
