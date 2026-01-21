import {createSchema} from "@weaverse/hydrogen"
import { useEffect } from "react";
import { useShopMenu } from "~/hooks/use-shop-menu";
import { useComponentStore } from "~/stores/headerDataStore";
import type {HeaderImageLinkProps} from "~/types/header"
import type { SingleMenuItem } from "~/types/menu";

interface MenuItem{
  value:string,
  label:string,
}

interface ImageHeaderProps extends HeaderImageLinkProps{
  identificador:string;
}
const list:Array<MenuItem> = []


function ImageHeader(props:ImageHeaderProps){
  const {headerMenu} = useShopMenu()
  
  const{ 
    identificador,
    type,
    position,
    heading,
    changeDirection,
    // first Image
    img,
    mbImg,
    link,
    html1,
    // second Image
    img2,
    mbImg2,
    link2,
    html2,
    // third Image
    img3,
    mbImg3,
    link3,
    html3,
    space,
    color,
    anchor,
    size,
    paddingSelect,
    padding,
    marginSelect,
    margin,
    customClass
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
    
    const imageLink:HeaderImageLinkProps ={
        id:identificador,
        type:"imageLink",
        position:"right",
        heading,
        changeDirection,
        img,
        mbImg,
        link,
        html1,
        img2,
        mbImg2,
        link2,
        html2,
        img3,
        mbImg3,
        link3,
        html3,
        space,
        color,
        anchor,
        size,
        paddingSelect,
        padding,
        marginSelect,
        margin,
        customClass
    };
    
    let checkElm = components.find(elm => elm.id === identificador)
    
    if(!checkElm && identificador){
      addComponent(imageLink);
    }

  },[])
  return(
    <></>
  )
}
export default ImageHeader


export const schema = createSchema({
  type:"image-link",
  title:"Images link",
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
          type:'switch',
          label:'flex row',
          name:'changeDirection',
          defaultValue:true,
        },
        {
          type:'text',
          label:'space between images',
          name:'space',
          defaultValue:"1em",
        },
        {
          type:'color',
          label:'background color',
          name:'color',
          defaultValue:'#FFFFFF',
        },
        {
          type:'select',
          label:'Select type size',
          name:'anchor',
          configs:{
            options:[
              {value:'width',label:'Width'},
              {value:'height',label:'Height'},
            ]
          },
          defaultValue:"width",
        },
        {
          type:'range',
          label:'Image size',
          name:'size',
          defaultValue:100,
          configs:{
            min:0,
            max:1000,
            step:1,
            unit:'px',
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
          type:'text',
          label:'custom class',
          name:'customClass',
        },
        
      ]
    },
    {
      group:"First image",
      inputs:[
        {
          type:'image',
          label:'image desktop',
          name:'img',
        },
        {
          type:'image',
          label:'image mobile',
          name:'mbImg',
        },
        {
          type:'url',
          label:'link',
          name:'link',
          defaultValue:'/products',
        },
        {
          type:'textarea',
          label:'html 1 img code',
          name:'html1',
        },
      ]
    },
    {
      group:"Second image",
      inputs:[
        {
          type:'image',
          label:'image desktop',
          name:'img2',
        },
        {
          type:'image',
          label:'image mobile',
          name:'mbImg2',
        },
        {
          type:'url',
          label:'link',
          name:'link2',
          defaultValue:'/products',
        },
        {
          type:'textarea',
          label:'html 2 img code',
          name:'html2',
        },
      ]
    },
    {
      group:"Third image",
      inputs:[
        {
          type:'image',
          label:'image desktop',
          name:'img3',
        },
        {
          type:'image',
          label:'image mobile',
          name:'mbImg3',
        },
        {
          type:'url',
          label:'link',
          name:'link3',
          defaultValue:'/products',
        },
        {
          type:'textarea',
          label:'html 3 img code',
          name:'html3',
        },
      ]
    }
  ]
})