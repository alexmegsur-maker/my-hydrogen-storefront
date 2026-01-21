import {create} from 'zustand'
import type { CurrentProdcutStore } from '~/types/currentProduct'

export const  useCurrentProduct = create<CurrentProdcutStore>((set)=>({
  currentProduct: null ,
  setProduct:(newProduct)=>{
    set(()=>({
      currentProduct:newProduct
    }))
  }
}))