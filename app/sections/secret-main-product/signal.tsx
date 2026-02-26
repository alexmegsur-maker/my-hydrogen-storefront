import { createSchema, type WeaverseImage } from "@weaverse/hydrogen"
import { useMemo } from "react";
import { selectorPaddingMargin } from "~/utils/general";

interface SignalProps{
  svg:WeaverseImage;
  title:string;
  size:number;
  space:string;
  color:string;
  tSize:string;
  family:string;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  weight:string;
          
}

function Signal(props:SignalProps){
  const{
    svg,
    title,
    size,
    space,
    color,
    tSize,
    family,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    weight,
  }=props

  const textStyle = useMemo(() => ({
    color: color,
    fontSize: tSize,
    fontFamily: family,
    fontWeight: weight,
    ...selectorPaddingMargin("padding", paddingSelect, paddingText),
    ...selectorPaddingMargin("margin", marginSelect, marginText),
  }), [color, tSize, family, weight, paddingSelect, paddingText, marginSelect, marginText]);
  return(
    <div className="flex items-center"
      style={{ 
        gap:`${space}px`
      }}
    > 
        <div>
          {svg?.url && 
            <img src={svg.url} alt={svg.altText} width={size} height={size}/>
          }
        </div>

        <div 
         dangerouslySetInnerHTML={{__html:title}}
         style={textStyle}
         >
        </div>
      </div>
  )
}

export default Signal

export const schema = createSchema({
  title:'Item',
  type:'signal',
  settings:[
    {
      group:'General',
      inputs:[
        {
          type:'image',
          label:'svg',
          name:'svg',
        },
        {
          type:'range',
          label:'img size',
          name:'size',
          defaultValue:50,
          configs:{
            min:5,
            max:200,
            step:1,
            unit:'px',
          }
        },
        {
          type:'richtext',
          label:'title',
          name:'title',
        },
        {
          type:'range',
          label:'space between',
          name:'space',
          defaultValue:10,
          configs:{
            min:0,
            max:200,
            step:1,
            unit:'px',
          }
        },

        {
          type:'heading',
          label:'title'
        },
        {
          type:'color',
          label:'color',
          name:'color',
          defaultValue:'#18181B',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'14px',
        },
        {
          type:'text',
          label:'font family',
          name:'family',
          defaultValue:'Montserrat',
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
          defaultValue:'600',
        },
      ]
    }
  ]
})