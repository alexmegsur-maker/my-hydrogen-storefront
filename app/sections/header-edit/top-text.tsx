import {createSchema} from "@weaverse/hydrogen"
import { useEffect } from "react";
import { useShopMenu } from "~/hooks/use-shop-menu";
import { useComponentStore } from "~/stores/headerDataStore";
import type {HeaderTopTextProps} from "~/types/header"
import type { SingleMenuItem } from "~/types/menu";

interface MenuItem{
  value:string;
  label:string;
}

interface TextTopHeaderProps extends HeaderTopTextProps{
  identificador:string;
}
const list:Array<MenuItem> = []


function TextTopHeader(props:TextTopHeaderProps){
  const {headerMenu} = useShopMenu()
  
  const{ 
    identificador,
    type,
    position,
    heading,
    containerSize,
    title,
    paragraph,
    decoration,
    overContainer,
    tSpacing,
    tSize,
    tColor,
    tBgColor,
    tAlignment,
    tPaddingSelect,
    tPadding,
    tMarginSelect,
    tMargin,
    tWeight,
    tFontFamily,
    containerPSize,
    pSpacing,
    pSize,
    pColor,
    pBgColor,
    pAlignment,
    pPaddingSelect,
    pPadding,
    pMarginSelect,
    pMargin,
    pWeight,
    pFontFamily,
    mbContainerSize, 
    mbTSpacing,
    mbTSize,
    mbTColor,
    mbTBgColor,
    mbTAlignment,
    mbTPaddingSelect,
    mbTPadding,
    mbTMarginSelect,
    mbTMargin,
    mbTWeight,
    mbContainerPSize,
    mbPSpacing,
    mbPSize,
    mbPColor,
    mbPBgColor,
    mbPAlignment,
    mbPPaddingSelect,
    mbPPadding,
    mbPMarginSelect,
    mbPMargin,
    mbPWeight,
    customClass,
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
    
    const textTop:HeaderTopTextProps ={
      id:identificador,
      type:"textTop",
      position:"top",
      heading,
      containerSize,
      title,
      paragraph,
      decoration,
      overContainer,
      tSpacing,
      tSize,
      tColor,
      tBgColor,
      tAlignment,
      tPaddingSelect,
      tPadding,
      tMarginSelect,
      tMargin,
      tWeight,
      tFontFamily,
      containerPSize,
      pSpacing,
      pSize,
      pColor,
      pBgColor,
      pAlignment,
      pPaddingSelect,
      pPadding,
      pMarginSelect,
      pMargin,
      pWeight,
      pFontFamily,
      mbContainerSize, 
      mbTSpacing,
      mbTSize,
      mbTColor,
      mbTBgColor,
      mbTAlignment,
      mbTPaddingSelect,
      mbTPadding,
      mbTMarginSelect,
      mbTMargin,
      mbTWeight,
      mbContainerPSize,
      mbPSpacing,
      mbPSize,
      mbPColor,
      mbPBgColor,
      mbPAlignment,
      mbPPaddingSelect,
      mbPPadding,
      mbPMarginSelect,
      mbPMargin,
      mbPWeight,
      customClass,
    };
    
    let checkElm = components.find(elm => elm.id === identificador)
    
    if(!checkElm && identificador){
      addComponent(textTop);
    }
  },[])
  return(
    <></>
  )
}
export default TextTopHeader



export const schema = createSchema({
  type:"text-top",
  title:"Text top",
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
          type:'range',
          label:'container size',
          name:'containerSize',
          defaultValue:50,
          configs:{
            min:20,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type:'text',
          label:'Title',
          name:'title',
          defaultValue:'Escrib un titulo',
        },
        {
          type:'text',
          label:'descripcion',
          name:'paragraph',
          defaultValue:'Aqui es donde se mostrara la descripcion que se escriba',
        },
        {
          type:'textarea',
          label:'html decoration',
          name:'decoration',
        },
        {
          type:'switch',
          label:'Over container',
          name:'overContainer',
          defaultValue:false,
        },
        {
          type:'text',
          label:'custom class',
          name:'customClass',
        },
      ]
    },
    {
      group:"Desktop",
      inputs:[
        {
          type:'heading',
          label:'title'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'tSpacing',
          defaultValue:'normal',       
        },
        {
          type:'text',
          label:'Font size',
          name:'tSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'tColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'tBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'tAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
              {value:'justify',label:'Justify'},
            ]
          },
          defaultValue:"center",
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
          type:'text',
          label:'Font family',
          name:'tFontFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'Paragraph'
        },
        {
          type:'range',
          label:'Container size',
          name:'containerPSize',
          defaultValue:100,
          configs:{
            min:20,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'pSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'pSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'pColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'pBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'pAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
              {value:'justify',label:'Justify'},
            ]
          },
          defaultValue:"center",
        },
        {
          type:'select',
          label:'Padding type',
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
          label:'Padding text',
          name:'pPadding',
        },
        {
          type:'select',
          label:'Margin type',
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
          label:'Margin text',
          name:'pMargin',
        },
        {
          type:'select',
          label:'Font weight',
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
          type:'text',
          label:'Font family',
          name:'pFontFamily',
          defaultValue:'Monserrat',
        },
      ]
    },
    {
      group:"Mobile",
      inputs:[
        {
          type:'range',
          label:'Container size',
          name:'mbContainerSize',
          defaultValue:50,
          configs:{
            min:20,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type:'heading',
          label:'title'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbTSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'mbTSize',
          defaultValue:'14px',
        },
        {
          type:'color',
          label:'Text color',
          name:'mbTColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'mbTBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'mbTAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
              {value:'justify',label:'Justify'},
            ]
          },
          defaultValue:"center",
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
          label:'Paragraph'
        },
        {
          type:'range',
          label:'Container size',
          name:'mbPConSize',
          defaultValue:100,
          configs:{
            min:20,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbPSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'mbPSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'mbPColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'mbPBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'mbPAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
              {value:'justify',label:'Justify'},
            ]
          },
          defaultValue:"center",
        },
        {
          type:'select',
          label:'Padding type',
          name:'mbPPaddingSelect',
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
          name:'mbPPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'mbPMarginSelect',
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
          name:'mbPMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'mbPWeight',
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