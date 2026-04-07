import {
  createSchema,
  type HydrogenComponentProps,
  type InspectorGroup,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { CSSProperties } from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { cn } from "~/utils/cn";
import { selectorPaddingMargin } from "~/utils/general";



const variants = cva("heading", {
  variants: {
    size: {
      default: "",
      custom: "",
      scale: "text-scale",
    },

  },
  defaultVariants: {
    size: "default",
  },
});

export interface HeadingProps
  extends VariantProps<typeof variants>{
  ref?: React.Ref<HTMLHeadingElement>;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  weight:string;
  content: string;
  color?: string;
  backgroundColor?: string;
  alignment:"left"|"center"|"right";
  minSize?: number;
  maxSize?: number;
  animate?: boolean;
  mobileSize:string;
  desktopSize:string;
  letterSpacing:number;
  paddingSelect?:string;
  paddingText?:string;
  marginSelect?:string;
  marginText?:string;
}

function Heading(props: HeadingProps & Partial<HydrogenComponentProps>) {
  const {
    ref,
    as: Tag = "h4",
    content,
    size,
    mobileSize,
    desktopSize,
    color,
    backgroundColor,
    weight,
    letterSpacing,
    alignment,
    minSize,
    maxSize,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    className,
    animate = true,
    ...rest
  } = props;
  let style: CSSProperties = { color, backgroundColor };
  if (size === "scale") {
    style = {
      ...style,
      "--min-size-px": `${minSize}px`,
      "--min-size": minSize,
      "--max-size": maxSize,
    } as CSSProperties;
  }

  if (animate) {
    rest["data-motion"] = "fade-up";
  }
  const isMobile= useIsMobile(600)

  return (
    <Tag
      ref={ref}
      {...rest}
      style={{
        ...style,
        width:"100%",
        fontSize:size=="custom" && isMobile ? mobileSize:desktopSize,
        letterSpacing:letterSpacing>0 ? `${letterSpacing}px`:"normal",
        fontWeight:weight,
        textAlign:alignment,
        ...selectorPaddingMargin("padding",paddingSelect,paddingText),
        ...selectorPaddingMargin("margin",marginSelect,marginText),
      }}
      className={cn(
        variants({ size, className }),
      )}
    >
      {content}
    </Tag>
  );
}

export default Heading;

export const headingInputs: InspectorGroup["inputs"] = [
  {
    type: "text",
    name: "content",
    label: "Content",
    defaultValue: "Section heading",
    placeholder: "Section heading",
  },
  {
    type: "select",
    name: "as",
    label: "HTML tag",
    configs: {
      options: [
        { value: "h1", label: "<h1> (Heading 1)" },
        { value: "h2", label: "<h2> (Heading 2)" },
        { value: "h3", label: "<h3> (Heading 3)" },
        { value: "h4", label: "<h4> (Heading 4)" },
        { value: "h5", label: "<h5> (Heading 5)" },
        { value: "h6", label: "<h6> (Heading 6)" },
      ],
    },
    defaultValue: "h4",
  },
  {
    type: "color",
    name: "color",
    label: "Text color",
  },
  {
    type: "select",
    name: "size",
    label: "Text size",
    configs: {
      options: [
        { value: "default", label: "Default" },
        { value: "scale", label: "Auto scale" },
        { value: "custom", label: "Custom" },
      ],
    },
    defaultValue: "default",
  },
  {
    type: "range",
    name: "minSize",
    label: "Minimum scale size",
    configs: {
      min: 12,
      max: 32,
      step: 1,
      unit: "px",
    },
    defaultValue: 16,
    condition: (data: HeadingProps) => data.size === "scale",
  },
  {
    type: "range",
    name: "maxSize",
    label: "Maximum scale size",
    configs: {
      min: 40,
      max: 96,
      step: 1,
      unit: "px",
    },
    defaultValue: 64,
    condition: (data: HeadingProps) => data.size === "scale",
    helpText:
      'See how scale text works <a href="https://css-tricks.com/snippets/css/fluid-typography/" target="_blank" rel="noreferrer">here</a>.',
  },
  {
    type: "text",
    name: "mobileSize",
    label: "Mobile text size",
    defaultValue: "5rem",
    condition: (data: HeadingProps) => data.size === "custom",
  },
  {
    type: "text",
    name: "desktopSize",
    label: "Desktop text size",
    defaultValue: "5rem",
    condition: (data: HeadingProps) => data.size === "custom",
  },
  {
    type: "select",
    name: "weight",
    label: "Weight",
    configs: {
      options: [
        { value: "100", label: "100 - Thin" },
        { value: "200", label: "200 - Extra Light" },
        { value: "300", label: "300 - Light" },
        { value: "400", label: "400 - Normal" },
        { value: "500", label: "500 - Medium" },
        { value: "600", label: "600 - Semi Bold" },
        { value: "700", label: "700 - Bold" },
        { value: "800", label: "800 - Extra Bold" },
        { value: "900", label: "900 - Black" },
      ],
    },
    defaultValue: "400",
  },
  {
    type:'range',
    label:'Letter spacing',
    name:'letterSpacing',
    defaultValue:2,
    configs:{
      min:0,
      max:50,
      step:1,
      unit:'px',
    }
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
  {
    type:'select',
    label:'Padding type',
    name:'paddingSelect',
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
    defaultValue:'a',
  },
  {
    type:'text',
    label:'Padding text',
    name:'paddingText',
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
    defaultValue:"0.8rem"
  },
];

export const schema = createSchema({
  type: "heading",
  title: "Heading",
  settings: [
    {
      group: "Heading",
      inputs: headingInputs,
    },
  ],
});
