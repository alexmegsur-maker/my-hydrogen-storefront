import {createSchema} from "@weaverse/hydrogen"
import { useEffect } from "react";
import { useShopMenu } from "~/hooks/use-shop-menu";
import { useComponentStore } from "~/stores/headerDataStore";
import type {HeaderGeneralEditProps} from "~/types/header"
import type { SingleMenuItem } from "~/types/menu";

interface MenuItem{
  value:string;
  label:string;
}

interface GeneralProps extends HeaderGeneralEditProps{
  identificador:string;
}
const list:Array<MenuItem> = []


function GeneralHeader(props:GeneralProps){
  const {headerMenu} = useShopMenu()
  
  const{ 
    identificador,
    position,
    heading,
    bgColor,
    bgLeftColor,
    bgRightColor,
    size,
    height,
    showDivisor,
    colorDivisor,
    divisorWidth,
    divisorHeight,
    mSize,
    paddingSelect, 
    padding,
    tColor,
    tHColor,
    tSpacing,
    tPaddingSelect,
    tPadding,
    tMarginSelect,
    tMargin,
    tWeight,
    sColor,
    sHColor,
    sSpacing,
    sPaddingSelect,
    sPadding,
    sMarginSelect,
    sMargin,
    sWeight,
    mbBgColor,
    mbBgRightColor,
    mbSize,
    mbHeight,
    mbMSize,
    mbPaddingSelect,
    mbPadding,
    mbTColor,
    mbTHColor,
    mbTSpacing,
    mbTPaddingSelect,
    mbTPadding,
    mbTMarginSelect,
    mbTMargin,
    mbTWeight,
    mbSColor,
    mbSHColor,
    mbSpacing,
    mbSPaddingSelect,
    mbSPadding,
    mbSMarginSelect,
    mbSMargin,
    mbSWeight,  
  } = props;
 
  const addComponent = useComponentStore((state)=>state.addComponent);
  const components = useComponentStore((state)=>state.headerMenuItems);
  useEffect(()=>{

    if(headerMenu?.items?.length){
      const items = headerMenu.items as unknown as SingleMenuItem[];

      items.forEach((menuItem)=>{  
        let item = {value:`${menuItem.title}`,label:`${menuItem.title}`}
        let checkMenu = list.find( menu => menu.label == menuItem.title)
        if(!checkMenu){
          list.push(item)
        }
      })
    }
    
    const general:HeaderGeneralEditProps ={
      id:identificador,
      type:"general",
      position:"general",
      heading,
      bgColor,
      bgLeftColor,
      bgRightColor,
      size,
      height,
      showDivisor,
      colorDivisor,
      divisorWidth, 
      divisorHeight,
      mSize,
      paddingSelect, 
      padding,
      tColor,
      tHColor,
      tSpacing,
      tPaddingSelect,
      tPadding,
      tMarginSelect,
      tMargin,
      tWeight,
      sColor,
      sHColor,
      sSpacing,
      sPaddingSelect,
      sPadding,
      sMarginSelect,
      sMargin,
      sWeight,
      mbBgColor,
      mbBgRightColor,
      mbSize,
      mbHeight,
      mbMSize,
      mbPaddingSelect,
      mbPadding,
      mbTColor,
      mbTHColor,
      mbTSpacing,
      mbTPaddingSelect,
      mbTPadding,
      mbTMarginSelect,
      mbTMargin,
      mbTWeight,
      mbSColor,
      mbSHColor,
      mbSpacing,
      mbSPaddingSelect,
      mbSPadding,
      mbSMarginSelect,
      mbSMargin,
      mbSWeight, 
    };
    
    let checkElm = components.find(elm => elm.id === identificador)
    
    if(!checkElm && identificador){
      addComponent(general);
    }

  },[])
  return(
    <></>
  )
}
export default GeneralHeader



export const schema = createSchema({
  type:"general",
  title:"General",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'text',
          label:'identificador',
          name:'identificador',
          helpText:"Obligatorio poner un identificador diferente al resto"          
        },
        {
          type:'select',
          label:'menu',
          name:'heading',
          configs:{
            options:list
          },
        },
        {
          type:'color',
          label:'Background color',
          name:'bgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'Background left container color',
          name:'bgLeftColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'Background right container color',
          name:'bgRightColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'range',
          label:'division of container',
          name:'size',
          defaultValue:50,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type:'text',
          label:'Height container',
          name:'height',
        },
        {
          type:'switch',
          label:'show divisor',
          name:'showDivisor',
          defaultValue:false,
        },
        {
          type:'color',
          label:'Divisor color',
          name:'colorDivisor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'range',
          label:'Divisor width',
          name:'divisorWidth',
          defaultValue:1,
          configs:{
            min:1,
            max:10,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'Divisor height',
          name:'divisorHeight',
          defaultValue:'300px',
        },
        {
          type:'range',
          label:'Element menu width',
          name:'mSize',
          defaultValue:50,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'%',
          }
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
          name:'padding',
        },
        {
          type:'heading',
          label:'Submenu title'
        },
        {
          type:'color',
          label:'Color',
          name:'tColor',
          defaultValue:'#000000',
        }, 
        {
          type:'color',
          label:'Hover color',
          name:'tHColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'tSpacing',
          defaultValue:'normal',
        },
        {
          type:'select',
          label:'Padding type',
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
          name:'tPadding',
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
          name:'tMargin',
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
        {
          type:'heading',
          label:'Subtitle'
        },
        {
          type:'color',
          label:'Color',
          name:'sColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Hover color',
          name:'sHColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'sSpacing',
          defaultValue:'normal',
        },
        {
          type:'select',
          label:'Padding type',
          name:'sPaddingSelect',
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
          name:'sPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'sMarginSelect',
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
          name:'sMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'sWeight',
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
      group:"Mobile",
      inputs:[
        {
          type:'color',
          label:'Background color',
          name:'mbBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'Background right color',
          name:'mbBgRightColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'range',
          label:'division of container',
          name:'mbSize',
          defaultValue:50,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type:'text',
          label:'Height container',
          name:'mbHeight',
        },
        {
          type:'range',
          label:'Element menu width',
          name:'mbMSize',
          defaultValue:50,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type:'select',
          label:'Padding type',
          name:'mbPaddingSelect',
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
          name:'mbPadding',
        },
        {
          type:'heading',
          label:'Submenu title'
        },
        {
          type:'color',
          label:'Color',
          name:'mbTColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Hover color',
          name:'mbTHColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbTSpacing',
          defaultValue:'normal',
        },
        {
          type:'select',
          label:'Padding type',
          name:'mbTPaddingSelect',
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
          name:'mbTPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'mbTMarginSelect',
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
          name:'mbTMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'mbTWeight',
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
          label:'Subtitle'
        },
        {
          type:'color',
          label:'Color',
          name:'mbSColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Hover color',
          name:'mbSHColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbSpacing',
          defaultValue:'normal',
        },
        {
          type:'select',
          label:'Padding type',
          name:'mbSPaddingSelect',
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
          name:'mbSPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'mbSMarginSelect',
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
          name:'mbSMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'mbSWeight',
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
  ]
})