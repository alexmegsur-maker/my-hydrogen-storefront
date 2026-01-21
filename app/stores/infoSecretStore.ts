import {create }from 'zustand'
import type { InfoSecret as InfoSecretProps,infoSecretStore} from '~/types/productSecret'

export const  useInfoSecret = create<infoSecretStore>((set)=>({
  infoSecret: null as InfoSecretProps,
  setComponents:(newComponent)=>
    set(()=>({
      infoSecret:newComponent
    })),
  setUpdatePage:(page)=>{
    set((state)=>{
      if(!state.infoSecret) return state;
      return{
        infoSecret:{
          ...state.infoSecret,
          showPage:page
        }
      }
    });
  }
}));