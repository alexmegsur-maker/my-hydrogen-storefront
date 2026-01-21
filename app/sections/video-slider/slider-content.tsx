import { createSchema, type WeaverseImage, type WeaverseVideo } from "@weaverse/hydrogen";
import { useEffect } from "react";
import { useSliderStore, type SliderElm } from "./videoSliderStore";


type SliderProps={
  video:WeaverseVideo;
  poster:WeaverseImage;
  imagen:WeaverseImage;
  titleSelect:string;
  tag?:string;
  title?:string;
  description?:string;
  button?:string;
  url:string;
  tgSize:string;
  tgColor:string;
  tgBgColor:string;
  tgRadius:number;
  tgFamily:string;
  tColor:string;
  tSize:string;
  tFamily:string;
  dColor:string;
  dSize:string;
  dFamily:string;
  bColor:string;
  bBgColor:string;
  bSize:string;
  bRadius:number;
  bFamily:string;
}

function SliderContent(props:SliderProps & {loaderData: any, id:string} ){
  
  const {
    video,
    poster,
    imagen,
    titleSelect,
    tag,
    title,
    description,
    button,
    url,
    tgSize,
    tgColor,
    tgBgColor,
    tgRadius,
    tgFamily,
    tColor,
    tSize,
    tFamily,
    dColor,
    dSize,
    dFamily,
    bColor,
    bBgColor,
    bSize,
    bRadius,
    bFamily,
  }=props
  const addSlider = useSliderStore((state)=>state.addSlider)
  const removeSlider = useSliderStore((state)=>state.removeSlider)
  const sliderElm = useSliderStore((state)=>state.sliderElement)
  
  
  useEffect(()=>{
    if(video && imagen  && poster){
      let identificador = `slider${Math.ceil(Math.random()*10000)}` 
      const sliderElement : SliderElm={
        id:identificador,
        video,
        poster,
        imagen,
        titleSelect,
        tag,
        title,
        description,
        button,
        url,
        tgSize,
        tgColor,
        tgBgColor,
        tgRadius,
        tgFamily,
        tColor,
        tSize,
        tFamily, 
        dColor,
        dSize,
        dFamily,
        bColor,
        bBgColor,
        bSize,
        bRadius,
        bFamily,
      }
      addSlider(sliderElement)
      return ()=>removeSlider(identificador)
    }
  },[props])

return null
}
export default SliderContent;

export const schema = createSchema({
  type:"slider-content",
  title:"Slider content",
  settings:[
    {
      group:"slider",
      inputs:[
        {
          type:'video',
          label:'video',
          name:'video',
        },
        {
          type:'image',
          label:'poster video',
          name:'poster',
        },
        {
          type:'image',
          label:'imagen',
          name:'imagen'
        },
        {
          type:'text',
          label:'Title selector',
          name:'titleSelect',
          defaultValue:"video 1"
        },
        {
          type:'text',
          label:'tag',
          name:'tag',
        },
        {
          type:'text',
          label:'title',
          name:'title',
          defaultValue:'Titulo video',
        },
        {
          type:'text',
          label:'description',
          name:'description',
        },
        {
          type:'text',
          label:'button text',
          name:'button',
          defaultValue:'mas informacion',
        },
        {
          type:'url',
          label:'url',
          name:'url',
          defaultValue:'/products',
        },
        {
          type:'heading',
          label:'tag'
        },
        {
          type:'text',
          label:'font size',
          name:'tgSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'color',
          name:'tgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'color',
          name:'tgBgColor',
          defaultValue:'#A9871D',
        },
        {
          type:'range',
          label:'border radius',
          name:'tgRadius',
          defaultValue:5,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'font family',
          name:'tgFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'title'
        },
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'24px',
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'description'
        },
        {
          type:'color',
          label:'color',
          name:'dColor',
          defaultValue:'#FFFFFF',
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
          type:'heading',
          label:'button'
        },
        {
          type:'color',
          label:'color',
          name:'bColor',
          defaultValue:'#000000',
        },
        {
          type:'color',
          label:'background color',
          name:'bBgColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'font size',
          name:'bSize',
          defaultValue:'20px',
        },
        {
          type:'range',
          label:'border radius',
          name:'bRadius',
          defaultValue:10,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'font family',
          name:'bFamily',
          defaultValue:'Monserrat',
        },
      ]
    }
  ]

})