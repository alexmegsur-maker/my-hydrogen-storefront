import {createSchema} from "@weaverse/hydrogen"
import { useEffect } from "react";
import { useShopMenu } from "~/hooks/use-shop-menu";
import { useComponentStore } from "~/stores/headerDataStore";
import type {HeaderTopProductProps} from "~/types/header"
import type { SingleMenuItem } from "~/types/menu";

interface MenuItem{
  value:string;
  label:string;
}

interface TopProductHeaderProps extends HeaderTopProductProps{
  identificador:string;
}
const list:Array<MenuItem> = []


function ProductTopHeader(props:TopProductHeaderProps){
  const {headerMenu} = useShopMenu()
  
  const{ 
    identificador,
    type,
    position,
    heading,
    img1,
    img1Link,
    img2,
    img2Link,
    img3,
    img3Link,
    imgListSize,
    mbImgListSize,
    selectMobile,
    logo,
    generalLink,
    logoSize,
    title,
    header,
    description,
    // "container"
    gPaddingSelect,
    gPadding,
    gMarginSelect,
    gMargin,
    // "general"
    bSize,
    bColor,
    paddingSelect,
    padding,
    marginSelect,
    margin,
    //  "title/logo"
    tSpacing,
    tAlignment,
    tColor,
    tSize,
    tPaddingSelect,
    tPadding,
    tMarginSelect,
    tMargin,
    tWeight,
    //  "heading"
    hSpacing,
    hAlignment,
    hColor,
    hSize,
    hPaddingSelect,
    hPadding,
    hMarginSelect,
    hMargin,
    hWeight,
    //  "description"
    dSpacing,
    dAlignment,
    dColor,
    dSize,
    dPaddingSelect,
    dPadding,
    dMarginSelect,
    dMargin,
    dWeight,
    //  "Mobile settings"
    mbLogoSize,
    // "container"
    mbGPaddingSelect,
    mbGPadding,
    mbGMarginSelect,
    mbGMargin,
    // "general"
    mbBSize,
    mbBColor,
    mbPaddingSelect,
    mbPadding,
    mbMarginSelect,
    mbMargin,
    //  "title/logo"
    mbTSpacing,
    mbTAlignment,
    mbTColor,
    mbTSize,
    mbTPaddingSelect,
    mbTPadding,
    mbTMarginSelect,
    mbTMargin,
    mbTWeight,
    //  "heading"
    mbHSpacing,
    mbHAlignment,
    mbHColor,
    mbHSize,
    mbHPaddingSelect,
    mbHPadding,
    mbHMarginSelect,
    mbHMargin,
    mbHWeight,
    //  "description"
    mbDSpacing,
    mbDAlignment,
    mbDColor,
    mbDSize,
    mbDPaddingSelect,
    mbDPadding,
    mbDMarginSelect,
    mbDMargin,
    mbDWeight,
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
    
    const productTop:HeaderTopProductProps ={
      id:identificador,
      type:"productTop",
      position:"top",
      heading,
      img1,
      img1Link,
      img2,
      img2Link,
      img3,
      img3Link,
      imgListSize,
      mbImgListSize,
      selectMobile,
      logo,
      generalLink,
      logoSize,
      title,
      header,
      description,
      // "container"
      gPaddingSelect,
      gPadding,
      gMarginSelect,
      gMargin,
      // "general"
      bSize,
      bColor,
      paddingSelect,
      padding,
      marginSelect,
      margin,
      //  "title/logo"
      tSpacing,
      tAlignment,
      tColor,
      tSize,
      tPaddingSelect,
      tPadding,
      tMarginSelect,
      tMargin,
      tWeight,
      //  "heading"
      hSpacing,
      hAlignment,
      hColor,
      hSize,
      hPaddingSelect,
      hPadding,
      hMarginSelect,
      hMargin,
      hWeight,
      //  "description"
      dSpacing,
      dAlignment,
      dColor,
      dSize,
      dPaddingSelect,
      dPadding,
      dMarginSelect,
      dMargin,
      dWeight,
      //  "Mobile settings"
      mbLogoSize,
      // "container"
      mbGPaddingSelect,
      mbGPadding,
      mbGMarginSelect,
      mbGMargin,
      // "general"
      mbBSize,
      mbBColor,
      mbPaddingSelect,
      mbPadding,
      mbMarginSelect,
      mbMargin,
      //  "title/logo"
      mbTSpacing,
      mbTAlignment,
      mbTColor,
      mbTSize,
      mbTPaddingSelect,
      mbTPadding,
      mbTMarginSelect,
      mbTMargin,
      mbTWeight,
      //  "heading"
      mbHSpacing,
      mbHAlignment,
      mbHColor,
      mbHSize,
      mbHPaddingSelect,
      mbHPadding,
      mbHMarginSelect,
      mbHMargin,
      mbHWeight,
      //  "description"
      mbDSpacing,
      mbDAlignment,
      mbDColor,
      mbDSize,
      mbDPaddingSelect,
      mbDPadding,
      mbDMarginSelect,
      mbDMargin,
      mbDWeight,
    };
    
    let checkElm = components.find(elm => elm.id === identificador)
    
    if(!checkElm && identificador){
      addComponent(productTop);
    }
  },[])
  return(
    <></>
  )
}
export default ProductTopHeader



export const schema = createSchema({
  type:"product-top",
  title:"Product top",
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
          type:'image',
          label:'image 1',
          name:'img1',
        },
        {
          type:'url',
          label:'Image 1 link',
          name:'img1link',
          defaultValue:'/products',
        },
        {
          type:'image',
          label:'image 2',
          name:'img2',
        },
        {
          type:'url',
          label:'Image 2 link',
          name:'img2link',
          defaultValue:'/products',
        },
        {
          type:'image',
          label:'image 3',
          name:'img3',
        },
        {
          type:'url',
          label:'Image 3 link',
          name:'img3link',
          defaultValue:'/products',
        },
        {
          type:'range',
          label:'Images list height',
          name:'imgListSize',
          defaultValue:100,
          configs:{
            min:50,
            max:500,  
            step:1,
            unit:'px',
          }
        },
        {
          type:'select',
          label:'Select to show in mobile version',
          name:'selectMobile',
          configs:{
            options:[
              {value:'img1',label:'Image 1'},
              {value:'img2',label:'Image 2'},
              {value:'img3',label:'Image 3'},
            ]
          },
          defaultValue:"img1",
        },
         {
          type:'range',
          label:'Images list height mobile',
          name:'mbImgListSize',
          defaultValue:100,
          configs:{
            min:50,
            max:500,  
            step:1,
            unit:'px',
          }
        },
        {
          type:'image',
          label:'Title logo',
          name:'logo',
        },
        {
          type:'url',
          label:'Link general',
          name:'generalLink',
          defaultValue:'/products',
        },
        {
          type:'text',
          label:'Titulo',
          name:'title',
        },
        {
          type:'text',
          label:'header',
          name:'header',
        },
        {
          type:'text',
          label:'description',
          name:'description',
        },

      ]
    },
    {
      group:"Desktop",
      inputs:[
        {
          type:'range',
          label:'logo height',
          name:'logoSize',
          defaultValue:50,
          configs:{
            min:1,
            max:500,
            step:1,
            unit:'px',
          }
        },
        {
          type:'heading',
          label:'container'
        },
        {
          type:'select',
          label:'Padding type',
          name:'gPaddingSelect',
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
          name:'gPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'gMarginSelect',
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
          name:'gMargin',
        },
        {
          type:'heading',
          label:'general'
        },
        {
          type:'range',
          label:'border size',
          name:'bSize',
          defaultValue:2,
          configs:{
            min:0,
            max:10,
            step:1,
            unit:'px',
          }
        },
        {
          type:'color',
          label:'Border color',
          name:'bColor',
          defaultValue:'#000000',
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
          name:'margin',
        },
        {
          type:'heading',
          label:'title/logo'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'tSpacing',
          defaultValue:'normal',
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
          type:'color',
          label:'Text color',
          name:'tColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Font size',
          name:'tSize',
          defaultValue:"16px"
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
          label:'header'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'hSpacing',
          defaultValue:'normal',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'hAlignment',
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
          type:'color',
          label:'Text color',
          name:'hColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Font size',
          name:'hSize',
          defaultValue:"16px"
        },
        {
          type:'select',
          label:'Padding type',
          name:'hPaddingSelect',
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
          name:'hPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'hMarginSelect',
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
          name:'hMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'hWeight',
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
          type:'text',
          label:'Letter spacing',
          name:'dSpacing',
          defaultValue:'normal',
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
          type:'color',
          label:'Text color',
          name:'dColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Font size',
          name:'dSize',
          defaultValue:"16px"
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
      ]
    },
    {
      group:"Mobile",
      inputs:[
        {
          type:'range',
          label:'logo height',
          name:'mbLogoSize',
          defaultValue:50,
          configs:{
            min:1,
            max:500,
            step:1,
            unit:'px',
          }
        },
        {
          type:'heading',
          label:'container'
        },
        {
          type:'select',
          label:'Padding type',
          name:'mbGPaddingSelect',
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
          name:'mbGPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'mbGMarginSelect',
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
          name:'mbGMargin',
        },
        {
          type:'heading',
          label:'general'
        },
        {
          type:'range',
          label:'border size',
          name:'mbBSize',
          defaultValue:2,
          configs:{
            min:0,
            max:10,
            step:1,
            unit:'px',
          }
        },
        {
          type:'color',
          label:'Border color',
          name:'mbBColor',
          defaultValue:'#000000',
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
          type:'select',
          label:'Margin type',
          name:'mbMarginSelect',
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
          name:'mbMargin',
        },
        {
          type:'heading',
          label:'title/logo'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbTSpacing',
          defaultValue:'normal',
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
          type:'color',
          label:'Text color',
          name:'mbTColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Font size',
          name:'mbTSize',
          defaultValue:"16px"
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
          label:'header'
        },
        {
          type:'text',
          label:'Letter spacing',
          name:'mbHSpacing',
          defaultValue:'normal',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'mbHAlignment',
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
          type:'color',
          label:'Text color',
          name:'mbHColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Font size',
          name:'mbHSize',
          defaultValue:"16px"

        },
        {
          type:'select',
          label:'Padding type',
          name:'mbHPaddingSelect',
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
          name:'mbHPadding',
        },
        {
          type:'select',
          label:'Margin type',
          name:'mbHMarginSelect',
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
          name:'mbHMargin',
        },
        {
          type:'select',
          label:'Font weight',
          name:'mbHWeight',
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
          type:'text',
          label:'Letter spacing',
          name:'mbDSpacing',
          defaultValue:'normal',
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
          type:'color',
          label:'Text color',
          name:'mbDColor',
          defaultValue:'#000000',
        },
        {
          type:'text',
          label:'Font size',
          name:'mbDSize',
          defaultValue:"16px"
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
      ]
    }
  ]
})