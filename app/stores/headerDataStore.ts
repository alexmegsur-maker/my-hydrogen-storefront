import {create} from 'zustand'
import type{ ComponentStore,DynamicContentConfig } from '~/types/header'

export const useComponentStore = create<ComponentStore>((set)=>({
  headerMenuItems:[] as DynamicContentConfig[],
  addComponent:(item)=>
    set((state)=>{
      const existe = state.headerMenuItems.find(elm=> elm.id == item.id)
      if(existe){
        console.warn(`Componente con ID ${item.id} ya existe y no será añadido.`)
        return state;
      }
      return {
        headerMenuItems:[...state.headerMenuItems,item],
      }
    }),
  removeComponent:(id)=>
    set((state)=>({
      headerMenuItems:state.headerMenuItems.filter((item)=>item.id !== id),
    })),
  setComponents:(newComponent)=>
    set(()=>({
      headerMenuItems:newComponent
    })),
}));