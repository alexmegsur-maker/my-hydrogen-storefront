import {
  createSchema,
  type HydrogenComponentProps,
  type InspectorGroup,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { type CSSProperties } from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { useScrollAnimation } from "~/hooks/use-scroll-animation";
import { splitText } from "~/routes/account/dashboard";
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
  family?:string;
  lineH:number;
  activeShadow:boolean;
  textShadow:string;
  animacion:"none"|"typer"|"fade"|"spaceNeonPulse"|"neonPulse"|"breathe"|"writeChar"|"underline";
  spaceUnderline:number;
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
    family,
    lineH,
    activeShadow,
    textShadow,
    animacion,
    spaceUnderline,
    ...rest
  } = props;
  

  const isMobile= useIsMobile(600)
  
  const {elementRef,textInnerRef,cursorRef}= useScrollAnimation<HTMLHeadingElement>({
    animation:animacion,
    cursorColor:color
  })

  

  
  let style: CSSProperties = { color, backgroundColor };
  if (size === "scale") {
    style = {
      ...style,
      "--min-size-px": `${minSize}px`,
      "--min-size": minSize,
      "--max-size": maxSize,
    } as CSSProperties;
  }

  return (
    <Tag
      ref={elementRef}
      {...rest}
      style={{
        ...style,
        width:"100%",
        fontSize:size=="custom" && isMobile ? mobileSize:desktopSize,
        letterSpacing:letterSpacing>0 ? `${letterSpacing}px`:"normal",
        lineHeight:lineH>0 ? lineH:"unset",
        fontWeight:weight,
        textAlign:alignment,
        flexWrap:animacion ==="writeChar"?"wrap":"unset",
        fontFamily:family,
        textShadow:activeShadow ? textShadow:"unset",
        display:"flex",
        justifyContent: alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
        ...selectorPaddingMargin("padding",paddingSelect,paddingText),
        ...selectorPaddingMargin("margin",marginSelect,marginText),
      }}
      className={cn(
        variants({ size, className }), 
      )}
    >
      {(()=>{
        switch(animacion){
          case 'typer':
            return (<span style={{ display: "inline-flex", alignItems: "baseline" }}>
              <span
                ref={textInnerRef}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {content}
              </span>
              <span
                ref={cursorRef}
                style={{
                  display: "inline-block",
                  width: "3px",
                  height: "0.8em",
                  backgroundColor: color || "currentColor",
                  marginLeft: "4px",
                }}
              />
            </span>
            )
          case'writeChar':
            return splitText(content)
          case'underline':
            return (
              <span className="relative">

                {content}
                <span
                  ref={cursorRef}
                  style={{
                    width:"140px",
                    position:"absolute",
                    bottom:`-${spaceUnderline}px`,
                    left:"50%",
                    height:"1px",
                    background:`linear-gradient(90deg,transparent,${color},transparent)`,
                    transform:"translateX(-50%)",
                    boxShadow:`0 0 14px ${color}50`
                  }}
                />
              </span>
            )
          default :
            return content
        }
      })()}
      {/* {animacion === "typer" ? (
        <span style={{ display: "inline-flex", alignItems: "baseline" }}>
          <span
            ref={textInnerRef}
            style={{
              display: "inline-block",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {content}
          </span>
          <span
            ref={cursorRef}
            style={{
              display: "inline-block",
              width: "3px",
              height: "0.8em",
              backgroundColor: color || "currentColor",
              marginLeft: "4px",
            }}
          />
        </span>
      ) : (
        content
      )} */}
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
    type:'switch',
    label:'active text shadow',
    name:'activeShadow',
    defaultValue:false,
  },
  {
    type:'text',
    label:'text shadow',
    name:'textShadow',
    defaultValue:'0 0 20px #00d2ffcc',
    condition:(data:HeadingProps)=>data.activeShadow ===true
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
  {
    type:'text',
    label:'Font family',
    name:'family',
    defaultValue:'Montserrat',
  },
  {
    type:'select',
    label:'animation',
    name:'animacion',
    configs:{
      options:[
        {value:'none',label:'None'},
        {value:'typer',label:'typer'},
        {value:'fade',label:'fade'},
        {value:'neonPulse',label:'neon pulse'},
        {value:'spaceNeonPulse',label:'space neon pulse'},
        {value:"breathe",label:"breathe"},
        {value:"writeChar",label:"write character"},
        {value:"underline",label:"underline"},
      ]
    },
    defaultValue:"fade",
  },
  {
    type:'range',
    label:'space underline',
    name:'spaceUnderline',
    defaultValue:20,
    configs:{
      min:5,
      max:100,
      step:1,
      unit:'px',
    },
    condition:(data:HeadingProps)=>data.animacion==="underline"
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