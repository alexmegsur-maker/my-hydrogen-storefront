import { createSchema } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useCrossell } from "~/stores/crosssellStore";
import { selectorPaddingMargin } from "~/utils/general";

interface HelpOptionProps {
  identification: string;
  title: string;
  description: string;
  borderColor:string;
  tColor:string;
  tSize:string;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  dColor:string;
  dSize:string;
  dFamily:string;
  dPaddingSelect:string;
  dPaddingText:string;
  dMarginSelect:string;
  dMarginText:string;
  dWeight:string;
}

function HelpOption(props: HelpOptionProps) {
  const { 
    identification, 
    title, 
    description,
    borderColor,
    tColor,
    tSize,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    dColor,
    dSize,
    dFamily,
    dPaddingSelect,
    dPaddingText,
    dMarginSelect,
    dMarginText,
    dWeight,
  } = props;
  const [check,setCheck]= useState(false)
  const [selectColor,setSelectColor]= useState('#000')
  const crossellList= useCrossell(state=>state.crossellObjects)
  const setSelector=useCrossell(state=>state.setSelector)
  const addSelect = useCrossell(state=>state.addSelected)
  const resetSelecteds = useCrossell(state=>state.resetSelecteds)
  const option = useRef(null)

  const addIdProducts =  () =>{
    if(!crossellList?.crossell)return;

    crossellList.crossell.forEach(element => {
      element.products.forEach(e=>{
        if(e.selector?.toLowerCase()===identification.toLowerCase()){
          addSelect(element.id,e.id,1)
        }
      })
    });
    
  }

  const selectSelector=()=>{
    if(!crossellList || !identification)return;

    const isRemoving = crossellList.selector?.toLowerCase() === identification.toLowerCase();

    crossellList.crossell.forEach(element=>resetSelecteds(element.id))

    if(isRemoving){
      setSelector(null)
    } else{
      setSelector(identification.toLowerCase())
      addIdProducts();
    }
   
  }

  useEffect(()=>{
    if(option.current){
      let parent =option.current.parentElement.dataset.selectedcolor
      setSelectColor(parent)
      console.log("parent",parent)
    }
  },[option.current])

  useEffect(()=>{
    if(crossellList?.selector && identification){
      const isSelected = crossellList.selector.toLowerCase()=== identification.toLowerCase();
      setCheck(isSelected)
      
    }else{
      setCheck(false)
    }  },[crossellList?.selector,identification])

  return (
    <div className=" text-left w-[calc(50%-5px)]" ref={option} >
      <div
        className="absolute top-[-5px] left-[0] z-[2] w-full z-10"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="radix-:r9e:"
        data-state="closed"
      >
        <div className="flex">
          <div className="flex-1">
            <span className="uppercase flex gap-1 items-center justify-center w-fit  text-white st-colour-tag-red st-text-tag-sm p-[2px] lg:p-1 rounded-tl-[4px] rounded-tr-[4px] rounded-br-[4px] ">
              Consigue 50 € de descuento
              <div className="flex items-center justify-content st-colour-icons-on-colour">
                <svg
                  width="14"
                  height="12"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M15 7.99988C15 11.8659 11.866 14.9999 8 14.9999C4.13401 14.9999 1 11.8659 1 7.99988C1 4.13388 4.13401 0.999878 8 0.999878C11.866 0.999878 15 4.13388 15 7.99988Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M8.56008 9.53359H7.28958V8.80909C7.28958 8.36809 7.36308 8.10559 7.69908 7.78009L8.17158 7.32859C8.59158 6.92959 8.84358 6.66709 8.84358 6.17359C8.84358 5.69059 8.49708 5.40709 8.03508 5.40709C7.60458 5.40709 7.22658 5.64859 7.21608 6.12109H5.83008C5.83008 4.81909 6.83808 4.17859 8.03508 4.17859C9.26358 4.17859 10.3136 4.81909 10.3136 6.18409C10.3136 7.02409 9.84108 7.61209 9.26358 8.17909L8.91708 8.51509C8.70708 8.72509 8.56008 8.86159 8.56008 9.20809V9.53359Z"
                    fill="black"
                  ></path>
                  <path
                    d="M8.64407 11.8212V10.3932H7.20557V11.8212H8.64407Z"
                    fill="black"
                  ></path>
                </svg>
              </div>
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={selectSelector}
        className="h-full text-left flex flex-col items-start gap-1 p-3 lg:p-4 bg-white rounded border-solid text-[#181817]"
        data-context="pdp-addon-preset-popular-titan-evo"
        style={{
          borderColor:check ? selectColor:borderColor,
          borderWidth:check ? "2px":"1px"
        }}
      >
        <span
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
        </span>
        <span
          style={{
            color:dColor,
            fontSize:dSize,
            fontFamily:dFamily,
            ...selectorPaddingMargin("padding",dPaddingSelect,dPaddingText),
            ...selectorPaddingMargin("margin",dMarginSelect,dMarginText),
            fontWeight:dWeight
          }}
        >
          {description}
        </span>
      </button>
    </div>
  );
}

export default HelpOption;

export const schema = createSchema({
  type: "help-option",
  title: "Help option",
  settings: [
    {
      group: "general",
      inputs: [
        {
          type: "text",
          label: "Id of help option",
          name: "identification",
          helpText:
            'required to function  "you should put the same id in each product in <b>default Option</b>"',
        },
        {
          type: "text",
          label: "title",
          name: "title",
          defaultValue: "Para principiantes",
        },
        {
          type: "text",
          label: "description",
          name: "description",
          defaultValue:
            "Disfruta de un mayor soporte con una selección  de accesorios para principiantes.",
        },
        {
          type:'color',
          label:'border color',
          name:'borderColor',
          defaultValue:'#181817',
        },
      ],
    },
    {
      group:"title",
      inputs:[
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
      
      ]
    },
    {
      group:"description",
      inputs:[
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
          label:'Padding type ',
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
      
      ]
    }
  ],
});
