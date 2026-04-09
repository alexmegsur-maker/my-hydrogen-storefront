import { useGSAP } from "@gsap/react";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import gsap from "gsap";
import { useRef } from "react";
import { cn } from "~/utils/cn";
import { selectorPaddingMargin } from "~/utils/general";

const variants = cva("subheading", {
  variants: {
    alignment: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    alignment: "center",
  },
});

interface SubHeadingProps
  extends VariantProps<typeof variants>,
    HydrogenComponentProps {
  ref?: React.Ref<HTMLHeadingElement | HTMLParagraphElement | HTMLDivElement>;
  as?: "h4" | "h5" | "h6" | "div" | "p";
  color?: string;
  content: string;
  size:string;
  weight:string;
  letter:number;
  fontFamily:string;
  paddingSelect?:string;
  paddingText?:string;
  marginSelect?:string;
  marginText?:string;
  family?:string;
  lineH:number;

}

function SubHeading(props: SubHeadingProps) {
  const {
    ref,
    as: Tag = "p",
    content,
    color,
    size,
    weight,
    alignment,
    letter,
    fontFamily,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    className,
    lineH,
    ...rest
  } = props;
  const element =useRef(null)
  useGSAP(()=>{
    gsap.from(element.current,{
      transform:"translateY(100%)",
      filter:"blur(1.5rem)",
      transition:"ease",
      duration:1
    })
  },{scope:element})


  return (
    <Tag
      ref={element}
      {...rest}
      data-motion="fade-up"
      style={{ 
        color:color,
        fontSize:size,
        fontWeight:weight,
        lineHeight:lineH>0 ? lineH:"unset",
        letterSpacing:letter > 0 ? `${letter}px`:"normal",
        fontFamily:fontFamily,
        ...selectorPaddingMargin("padding",paddingSelect,paddingText),
        ...selectorPaddingMargin("margin",marginSelect,marginText),
       }}
      className={cn(variants({  alignment, className }))}
    >
      {content}
    </Tag>
  );
}

export default SubHeading;

export const schema = createSchema({
  type: "subheading",
  title: "Subheading",
  settings: [
    {
      group: "Subheading",
      inputs: [
        {
          type: "select",
          name: "as",
          label: "Tag name",
          configs: {
            options: [
              { value: "h4", label: "Heading 4" },
              { value: "h5", label: "Heading 5" },
              { value: "h6", label: "Heading 6" },
              { value: "p", label: "Paragraph" },
              { value: "div", label: "Div" },
            ],
          },
          defaultValue: "p",
        },
        {
          type: "text",
          name: "content",
          label: "Content",
          defaultValue: "Section subheading",
          placeholder: "Section subheading",
        },
        {
          type: "color",
          name: "color",
          label: "Text color",
        },
        {
          type:'text',
          label:'Text size',
          name:'size',
          defaultValue:'0.7rem',
        },
        {
          type:'range',
          label:'Letter spacing',
          name:'letter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
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
          type:'select',
          label:'Font weight',
          name:'weight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'400',
        },   
        {
          type:'text',
          label:'font family',
          name:'fontFamily',
          defaultValue:'Montserrat',
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
      ],
    },
  ],
});
