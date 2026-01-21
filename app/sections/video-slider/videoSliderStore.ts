import type { WeaverseImage, WeaverseVideo } from '@weaverse/hydrogen';
import {create} from 'zustand'

export interface SliderElm{
  id:string;
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

export interface SliderStore{
  sliderElement:SliderElm[];
  addSlider:(item:SliderElm)=>void;
  removeSlider:(id:string)=>void;
  setSlider:(newSlider:SliderElm[])=>void;
}

export const useSliderStore = create<SliderStore>((set)=>({
  sliderElement:[] as SliderElm[],
  addSlider:(item)=>
    set((state)=>{
      const existe = state.sliderElement.findIndex((elm)=> elm.id == item.id)
      if(existe !== -1){
        const newSliderElement = [...state.sliderElement];
        newSliderElement[existe]=item;
        return {sliderElement:newSliderElement};
      }
      return {
        sliderElement:[...state.sliderElement,item],
      }
    }),
  removeSlider:(id)=>
    set((state)=>({
      sliderElement:state.sliderElement.filter((item)=>item.id !== id),
    })),
  setSlider:(newComponent)=>
    set(()=>({
      sliderElement:newComponent
    })),
}))