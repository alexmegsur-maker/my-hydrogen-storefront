import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { selectorPaddingMargin } from "~/utils/general";
import ModalCrossellProduct from "./crosssell/modal";

interface CrosssellProps extends HydrogenComponentProps {
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  title:string;
  tColor:string;
  tSize:string;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  mtColor:string;
  mtSize:string;
  mtFamily:string;
  mtPaddingSelect:string;
  mtPaddingText:string;
  mtMarginSelect:string;
  mtMarginText:string;
  mtWeight:string;
  dColor:string;
  dSize:string;
  dFamily:string;
  dPaddingSelect:string;
  dPaddingText:string;
  dMarginSelect:string;
  dMarginText:string;
  dWeight:string;
  pColor:string;
  pSize:string;
  pFamily:string;
  pPaddingSelect:string;
  pPaddingText:string;
  pMarginSelect:string;
  pMarginText:string;
  pWeight:string;
  bColor:string;
  bSize:string;
  bFamily:string;
  bPaddingSelect:string;
  bPaddingText:string;
  bMarginSelect:string;
  bMarginText:string;
  bWeight:string;
  eTColor:string;
  eTSize:string;
  eTFamily:string;
  eTPaddingSelect:string;
  eTPaddingText:string;
  eTMarginSelect:string;
  eTMarginText:string;
  eTWeight:string;
  eCColor:string;
  eCSize:string;
  eCFamily:string;
  eCPaddingSelect:string;
  eCPaddingText:string;
  eCMarginSelect:string;
  eCMarginText:string;
  eCWeight:string;
          
    
}

function Crosssell(props: CrosssellProps) {
  const {  
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    title,
    tColor,
    tSize,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    mtColor,
    mtSize,
    mtFamily,
    mtPaddingSelect,
    mtPaddingText,
    mtMarginSelect,
    mtMarginText,
    mtWeight,
    dColor,
    dSize,
    dFamily,
    dPaddingSelect,
    dPaddingText,
    dMarginSelect,
    dMarginText,
    dWeight,
    pColor,
    pSize,
    pFamily,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    pWeight,
    bColor,
    bSize,
    bFamily,
    bPaddingSelect,
    bPaddingText,
    bMarginSelect,
    bMarginText,
    bWeight,
    eTColor,
    eTSize,
    eTFamily,
    eTPaddingSelect,
    eTPaddingText,
    eTMarginSelect,
    eTMarginText,
    eTWeight,
    eCColor,
    eCSize,
    eCFamily,
    eCPaddingSelect,
    eCPaddingText,
    eCMarginSelect,
    eCMarginText,
    eCWeight,
    children
  } = props;

  return (
    <>
      <div 
        className="flex flex-col bg-[#f3f4f6] text-[#181817] border-0 border-b-[1px] border-solid border-r-0 border-[#181817]"
        style={{
          ...selectorPaddingMargin("padding",paddingSelect,paddingText),
          ...selectorPaddingMargin("margin",marginSelect,marginText),

        }}
      >
        <h3 
          className="text-[1.25rem] font-[700]"
          style={{
            color:tColor,
            fontSize:tSize,
            fontFamily:tFamily,
            ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
            ...selectorPaddingMargin("margin",tMarginSelect,tMarginText),
            fontWeight:tWeight
          }}
        >
          {title}
        </h3>
        <div className="flex flex-col gap-6 lg:gap-12 ">
          {children}
        </div>
      </div>

      <ModalCrossellProduct 
        tColor={mtColor}
        tSize={mtSize}
        tFamily={mtFamily}
        tpaddingSelect={mtPaddingSelect}
        tpaddingText={mtPaddingText}
        tmarginSelect={mtMarginSelect}
        tmarginText={mtMarginText}
        tWeight={mtWeight}
        dColor={dColor}
        dSize={dSize}
        dFamily={dFamily}
        dpaddingSelect={dPaddingSelect}
        dpaddingText={dPaddingText}
        dmarginSelect={dMarginSelect}
        dmarginText={dMarginText}
        dWeight={dWeight}
        pColor={pColor}
        pSize={pSize}
        pFamily={pFamily}
        ppaddingSelect={pPaddingSelect}
        ppaddingText={pPaddingText}
        pmarginSelect={pMarginSelect}
        pmarginText={pMarginText}
        pWeight={pWeight}
        bColor={bColor}
        bSize={bSize}
        bFamily={bFamily}
        bpaddingSelect={bPaddingSelect}
        bpaddingText={bPaddingText}
        bmarginSelect={bMarginSelect}
        bmarginText={bMarginText}
        bWeight={bWeight}
        eTColor={eTColor}
        eTSize={eTSize}
        eTFamily={eTFamily}
        eTPaddingSelect={eTPaddingSelect}
        eTPaddingText={eTPaddingText}
        eTMarginSelect={eTMarginSelect}
        eTMarginText={eTMarginText}
        eTWeight={eTWeight}
        eCColor={eCColor}
        eCSize={eCSize}
        eCFamily={eCFamily}
        eCPaddingSelect={eCPaddingSelect}
        eCPaddingText={eCPaddingText}
        eCMarginSelect={eCMarginSelect}
        eCMarginText={eCMarginText}
        eCWeight={eCWeight}
      />
    </>
  );
}

export default Crosssell;

export const schema = createSchema({
  type: "crosssell",
  title: "crosssell",
  childTypes: ["crossell-container","helper-selector"],
  presets:{
    children:[
      {type:"helper-selector"},
      {type:"crossell-container"}
    ]
  },
  settings: [
    {
      group: "general",
      inputs: [
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
          defaultValue:'48px 32px'
        },
        {
          type:'select',
          label:'Margin type ',
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
          type:'heading',
          label:'Title'
        },
        {
          type:'text',
          label:'title',
          name:'title',
        },
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
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
          name:'tPaddingSelect',
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
          name:'tPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'tMarginSelect',
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
          name:'tMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'tWeight',
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
      
      ],
    },
    {
      group:"modal info producto",
      inputs:[
        {
          type:'heading',
          label:'Title'
        },
        {
          type:'color',
          label:'color ',
          name:'mtColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size ',
          name:'mtSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family ',
          name:'mtFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type ',
          name:'mtPaddingSelect',
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
          label:'Padding text ',
          name:'mtPaddingText',
        },
        {
          type:'select',
          label:'Margin type ',
          name:'mtMarginSelect',
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
          label:'Margin text ',
          name:'mtMarginText',
        },
        {
          type:'select',
          label:'Font weight ',
          name:'mtWeight',
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
          label:'description'
        },
        {
          type:'color',
          label:'color',
          name:'dColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'dSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family',
          name:'dFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'dPaddingSelect',
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
          name:'dPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'dMarginSelect',
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
          name:'dMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'dWeight',
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
          label:'price'
        },
        {
          type:'color',
          label:'color ',
          name:'pColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size ',
          name:'pSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family ',
          name:'pFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type ',
          name:'pPaddingSelect',
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
          label:'Padding text ',
          name:'pPaddingText',
        },
        {
          type:'select',
          label:'Margin type ',
          name:'pMarginSelect',
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
          label:'Margin text ',
          name:'pMarginText',
        },
        {
          type:'select',
          label:'Font weight ',
          name:'pWeight',
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
          label:'especification title'
        },
        {
          type:'color',
          label:'color',
          name:'eTColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'eTSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family',
          name:'eTFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'eTPaddingSelect',
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
          name:'eTPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'eTMarginSelect',
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
          name:'eTMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'eTWeight',
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
          label:'especification Content'
        },
        {
          type:'color',
          label:'color',
          name:'eCColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'eCSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family',
          name:'eCFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'eCPaddingSelect',
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
          name:'eCPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'eCMarginSelect',
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
          name:'eCMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'eCWeight',
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
          label:'button'
        },
        {
          type:'color',
          label:'color',
          name:'bColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'bSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family',
          name:'bFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'bPaddingSelect',
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
          name:'bPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'bMarginSelect',
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
          name:'bMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'bWeight',
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

      ]
    }
  ],
});
