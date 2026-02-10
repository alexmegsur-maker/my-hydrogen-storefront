import {create} from 'zustand'
import type { CurrentProdcutStore, Variants } from '~/types/currentProduct'

export const  useCurrentProduct = create<CurrentProdcutStore>((set)=>({
  currentProduct: null ,
  setProduct:(newProduct)=>{
    set(()=>({
      currentProduct:newProduct
    }))
  },
  setVariant:(newVariant:Variants)=>{
    set((state)=>({
      currentProduct:state.currentProduct?
      {...state.currentProduct,selectedVariant:newVariant}:null
    }))
  }
}))