import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useState } from "react";
import { selectorPaddingMargin } from "~/utils/general";

interface HelperSelectorProps extends HydrogenComponentProps{
  bgColor:string;
  borderColor:string;
  selectedColor:string;
  helpText:string;
  color:string;
  size:string;
  tFamily:string;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  weight:string;
  bColor:string;
  bSize:string;
}

function HelperSelector(props:HelperSelectorProps) {
  const {
    bgColor,
    borderColor,
    selectedColor,
    helpText,
    color,
    size,
    tFamily,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    weight,
    bColor,
    bSize,
    children
  }=props
  const [show, setShow] = useState(false);
  return (
    <div 
    className="flex flex-col mt-3 p-2 lg:p-4 rounded-lg border-solid border-[1px]"
    style={{
      borderColor:borderColor,
      backgroundColor:bgColor
    }}
    >
      <button
        className="flex justify-between items-end gap-2.5 bg-transparent border-0 p-0 text-left"
        onClick={() => setShow((state) => !state)}
      >
        <span 
          className="text-[1.125rem] font-[400] text-[#181817]"
          style={{
            color:color,
            fontSize:size,
            fontFamily:tFamily,
            ...selectorPaddingMargin("padding",paddingSelect,paddingText),
            ...selectorPaddingMargin("margin",marginSelect,marginText),
            fontWeight:weight
          }}
        >
          {helpText}
        </span>
        <span 
          className="group border-0 bg-[transparent] p-0 hover:text-[#181817] flex gap-1 items-center justify-center w-fit cursor-pointer text-[1rem] font-[400] st-colour-text-secondary  undefined"
          style={{
            color:bColor,
            fontSize:bSize
          }}
          >
          {show ? "Ocultar" : "Mostrar"}
          <div 
            className="st-colour-icons-dark-grey group-hover:fill-[black]  text-black"
            style={{
              transform:show?"rotate(180deg)":"rotate(0deg)"
            }}
            >
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.5303 5.46967C13.8232 5.76256 13.8232 6.23744 13.5303 6.53033L8 12.0607L2.46967 6.53033C2.17678 6.23744 2.17678 5.76256 2.46967 5.46967C2.76256 5.17678 3.23744 5.17678 3.53033 5.46967L8 9.93934L12.4697 5.46967C12.7626 5.17678 13.2374 5.17678 13.5303 5.46967Z"
                fill={bColor}
                className="st-colour-icons-dark-grey group-hover:fill-[black]  text-black"
              ></path>
            </svg>
          </div>
        </span> 
      </button>
      <div
        className="mt-4 gap-2 flex-wrap"
        data-selectedColor={selectedColor}
        style={{
          display: show ? "flex" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default HelperSelector;

export const schema = createSchema({
  type: "helper-selector",
  title: "Helper Selctor",
  childTypes: ["help-option"],
  limit: 1,
  settings: [
    {
      group: "general",
      inputs: [
        {
          type:'color',
          label:'background color',
          name:'bgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'border color',
          name:'borderColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'selected color',
          name:'selectedColor',
          defaultValue:'#3790b0',
        },
        {
          type: "text",
          label: "help text",
          name: "helpText",
          defaultValue:
            "¿No sabes por dónde empezar? Aquí tienes nuestros ajustes preestablecidos recomendados.",
        },
        {
          type:'color',
          label:'color',
          name:'color',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'size',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type ',
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
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'marginText',
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
          type:'heading',
          label:'boton'
        },
        {
          type:'color',
          label:'color',
          name:'bColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'font size',
          name:'bSize',
          defaultValue:'16px',
        },
      ],
    },
  ],
});
