import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import type { CSSProperties } from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { useScrollAnimation } from "~/hooks/use-scroll-animation";
import "~/styles/paragraph.css"
import { selectorPaddingMargin } from "~/utils/general";
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
  family:string;
  gap:number;
  marginSelect?:string;
  marginText?:string;
  lineH:number;
}

const variants = cva("paragraph", {
  variants: {
    width: {
      full: "mx-auto w-full",
      narrow: "w-full max-w-4xl md:w-1/2 lg:w-3/4",
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
    family,
    gap,
    marginSelect,
    marginText,
    lineH,
    ...rest
  } = props;

  const isMobile = useIsMobile(600);
    const {elementRef}=useScrollAnimation<HTMLHeadingElement>({
      animation:"fade",
      cursorColor:color
    }) 

  return (
    <Tag
      ref={elementRef}
      data-motion="fade-up"
      {...rest}
      className={clsx(variants({width, className }))+" paragraphComp"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ 
        display:"flex",
        flexDirection:"column",
        lineHeight:lineH>0 ? lineH:"unset",
        gap:gap>0 ?`${gap}rem`:"normal",
        color:color,
        textAlign:alignment,
        fontSize:textSize,
        fontFamily:family,
        width:!isMobile?`${contWidth}%`:"100%",
        ...selectorPaddingMargin("margin",marginSelect,marginText),
        "--paragraph-color":color 
        
      }as CSSProperties }
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
          type:'range',
          label:'gap content',
          name:'gap',
          defaultValue:0,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type:'range',
          label:'line heading',
          name:'lineH',
          defaultValue:1.1,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'u',
          }
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
        {
          type:'text',
          label:'Font family',
          name:'family',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Margin type',
          name:'marginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Margin text',
          name:'marginText',
        },
      ],
    },
  ],
});
