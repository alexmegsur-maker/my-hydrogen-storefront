import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useMemo } from "react";
import { selectorPaddingMargin } from "~/utils/general";

interface TrustSignalProps extends HydrogenComponentProps{
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  bgColor:string;
}

function TrustSignals(props:TrustSignalProps) {
  const {
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    bgColor,
    children
  }=props

  const style = useMemo(()=>({
    backgroundColor:bgColor,
    ...selectorPaddingMargin("padding",paddingSelect,paddingText),
    ...selectorPaddingMargin("margin",marginSelect,marginText),
  }),[bgColor,paddingSelect,paddingText,marginSelect,marginText])
  return (
    <div className="flex flex-col gap-4"
      style={style}
    >
      {children}
    </div>
  );
}

export default TrustSignals;

export const schema = createSchema({
  title: "Trust Signals",
  type: "trust-signal",
  childTypes: [
    "signal",
  ],
  settings: [
    {
      group: "General",
      inputs: [
        {
          type:'color',
          label:'color',
          name:'bgColor',
          defaultValue:'#FFFFFF',
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
          defaultValue:'32px'
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
      ],
    },
  ],
});
