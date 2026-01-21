import {createSchema} from "@weaverse/hydrogen"
import { useEffect } from "react";
import { useShopMenu } from "~/hooks/use-shop-menu";
import { useComponentStore } from "~/stores/headerDataStore";
import type {HeaderBannerProps} from "~/types/header"
import type { SingleMenuItem } from "~/types/menu";

interface MenuItem{
  value:string,
  label:string,
}

interface BannerHeaderProps extends HeaderBannerProps{
  identificador:string;
}
const list:Array<MenuItem> = []


function BannerHeader(props:BannerHeaderProps){
  const {headerMenu} = useShopMenu()
  
  const{ 
    identificador,
    position,
    heading,
    image,
    imageWidth,
    imgColor,
    borderSize,
    header,
    title,
    description,
    linkText,
    link,
    fontFamily,
    paddingSelect,
    padding, 
    customClass,
    // header
    headerSpacing,
    headerSize,
    headerColor,
    headerBgColor,
    headerAlignment,
    headerPaddingSelect,
    headerPadding,
    headerMarginSelect,
    headerMargin,
    headerWeight,
    // title
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
    // Description
    dSpacing,
    dSize,
    dColor,
    dBgColor,
    dAlignment,
    dPaddingSelect,
    dPadding,
    dMarginSelect,
    dMargin,
    dWeight,
    // button
    buttonHtml,
    bSpacing,
    bSize,
    bColor,
    bBgColor,
    bAlignment,
    bPaddingSelect,
    bPadding,
    bMarginSelect,
    bMargin,
    bWeight,
    // Mobile settings
    mbImgColor,
    mbBorderSize,
    mbPaddingSelect,
    mbPadding, 
    //  header mobile
    mbHeaderSpacing,
    mbHeaderSize,
    mbHeaderColor,
    mbHeaderBgColor,
    mbHeaderAlignment,
    mbHeaderPaddingSelect,
    mbHeaderPadding,
    mbHeaderMarginSelect,
    mbHeaderMargin,
    mbHeaderWeight,      
    // title mobile
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
    // Description mobile
    mbDSpacing,
    mbDSize,
    mbDColor,
    mbDBgColor,
    mbDAlignment,
    mbDPaddingSelect,
    mbDPadding,
    mbDMarginSelect,
    mbDMargin,
    mbDWeight, 
    // button
    mbBSpacing,
    mbBSize,
    mbBColor,
    mbBBgColor,
    mbBAlignment,
    mbBPaddingSelect,
    mbBPadding,
    mbBMarginSelect,
    mbBMargin,
    mbBWeight
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
    
    const banner:HeaderBannerProps ={
      id:identificador,
      type:"banner",
      position:"right",
      heading,
      image,
      imageWidth,
      imgColor,
      borderSize,
      header,
      title,
      description,
      linkText,
      link,
      fontFamily,
      paddingSelect,
      padding, 
      customClass,
      // header
      headerSpacing,
      headerSize,
      headerColor,
      headerBgColor,
      headerAlignment,
      headerPaddingSelect,
      headerPadding,
      headerMarginSelect,
      headerMargin,
      headerWeight,
      // title
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
      // Description
      dSpacing,
      dSize,
      dColor,
      dBgColor,
      dAlignment,
      dPaddingSelect,
      dPadding,
      dMarginSelect,
      dMargin,
      dWeight,
      // button
      buttonHtml,
      bSpacing,
      bSize,
      bColor,
      bBgColor,
      bAlignment,
      bPaddingSelect,
      bPadding,
      bMarginSelect,
      bMargin,
      bWeight,
      // Mobile settings
      mbImgColor,
      mbBorderSize,
      mbPaddingSelect,
      mbPadding, 
      //  header mobile
      mbHeaderSpacing,
      mbHeaderSize,
      mbHeaderColor,
      mbHeaderBgColor,
      mbHeaderAlignment,
      mbHeaderPaddingSelect,
      mbHeaderPadding,
      mbHeaderMarginSelect,
      mbHeaderMargin,
      mbHeaderWeight,      
      // title mobile
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
      // Description mobile
      mbDSpacing,
      mbDSize,
      mbDColor,
      mbDBgColor,
      mbDAlignment,
      mbDPaddingSelect,
      mbDPadding,
      mbDMarginSelect,
      mbDMargin,
      mbDWeight, 
      // button
      mbBSpacing,
      mbBSize,
      mbBColor,
      mbBBgColor,
      mbBAlignment,
      mbBPaddingSelect,
      mbBPadding,
      mbBMarginSelect,
      mbBMargin,
      mbBWeight,
    };
    
    let checkElm = components.find(elm => elm.id === identificador)
    
    if(!checkElm && identificador){
      addComponent(banner);
    }

  },[])
  return(
    <></>
  )
}
export default BannerHeader


export const schema = createSchema({
  type:"banner",
  title:"Banner",
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
      ]
    },
    {
      group:"Desktop",
      inputs:[
        {
          type:'image',
          label:'Imae',
          name:'image',
        },
        {
          type:'range',
          label:'Image width',
          name:'imageWidth',
          defaultValue:100,
          configs:{
            min:1,
            max:100,
            step:1,
            unit:'%',
          }
        },
        {
          type:'color',
          label:'Border image color',
          name:'imgColor',
          defaultValue:'#000000',
        },
        {
          type:'range',
          label:'Border size',
          name:'borderSize',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'header',
          name:'header',
          defaultValue:'Cabecera',
        },
        {
          type:'text',
          label:'Title',
          name:'title',
          defaultValue:'Titulo'
        },
        {
          type:'text',
          label:'Description',
          name:'description',
          defaultValue:"Lorem ipsum dolor sit amet consectetur adipiscing elit ante porttitor fermentum, cum porta odio in quis tincidunt laoreet mollis pretium, urna commodo aenean class nisi cursus per dignissim etiam. ",
        },
        {
          type:'text',
          label:'Button',
          name:'linkText',
          defaultValue:'See more',
        },
        {
          type:'url',
          label:'url',
          name:'link',
          defaultValue:'/products',
        },
        {
          type:'text',
          label:'Font Family',
          name:'fontFamily',
          defaultValue:'Monserrat',
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
          type:'text',
          label:'Custom class',
          name:'customClass',
        },
        {
          type:'heading',
          label:'header'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'headerSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'headerSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'headerColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'headerBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'headerAlignment',
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
          name:'headerPaddingSelect',
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
          name:'headerPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'headerMarginSelect',
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
          name:'headerMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'headerWeight',
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
          label:'Title'
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
          type:'heading',
          label:'Description'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'dSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'dSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'dColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'dBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'dAlignment',
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
          name:'dPadding',
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
          name:'dMargin',
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
          label:'Button'
        },
        {
          type:'textarea',
          label:'buttonHtml',
          name:'html to add button',
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'bSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'bSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'bColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'bBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'bAlignment',
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
          name:'bPadding',
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
          name:'bMargin',
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
    },
    {
      group:"Mobile",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'mbImgColor',
          defaultValue:'#000000',
        },
        {
          type:'range',
          label:'Border image color',
          name:'mbBorderSize',
          defaultValue:1,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
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
          label:'header'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbHeaderSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'mbHeaderSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'mbHeaderColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'mbHeaderBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'mbHeaderAlignment',
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
          name:'mbHeaderPaddingSelect',
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
          name:'mbHeaderPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'mbHeaderMarginSelect',
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
          name:'mbHeaderMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'mbHeaderWeight',
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
          label:'Title'
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
          defaultValue:'16px',
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
          label:'Description'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbDSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'mbDSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'mbDColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'mbDBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'mbDAlignment',
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
          name:'mbDPaddingSelect',
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
          name:'mbDPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'mbDMarginSelect',
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
          name:'mbDMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'mbDWeight',
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
          label:'Button'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbBSpacing',
          defaultValue:'normal',
        },
        {
          type:'text',
          label:'Font size',
          name:'mbBSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'Text color',
          name:'mbBColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'Background color',
          name:'mbBBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'mbBAlignment',
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
          name:'mbBPaddingSelect',
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
          name:'mbBPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'mbBMarginSelect',
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
          name:'mbBMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'mbBWeight',
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