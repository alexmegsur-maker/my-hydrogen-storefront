import {create} from 'zustand'
import type { FilterProductStore } from '~/types/filterProductStore'

export const useFilterProduct = create<FilterProductStore>((set)=>({
  filters:[],
  addFilter:(filter)=>{
    set((state)=>{
      return {filters:[...state.filters,filter]}
    })
  },
  removeFilter:(filter)=>{
    set((state)=>{
      const filtrado=state.filters.filter((elm)=>elm!=filter)
      return {
        filters:filtrado
      }
    })
  }
}))