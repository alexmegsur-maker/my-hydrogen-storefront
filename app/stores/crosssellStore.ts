import {create} from 'zustand'
import type { CrosssellStore ,CrossellObject, CrossellProduct } from '~/types/crosssell'

export const useCrossell = create<CrosssellStore>((set)=>({
  crossellObjects:null,
  addCrossell:(newCrossell:CrossellObject)=>{
    set((state)=>{
      if(state.crossellObjects){
        if(state.crossellObjects.crossell.length>0 ){
          let parentCross= state.crossellObjects.crossell.find((elm)=>elm.id === newCrossell.id)
          if(!parentCross){
            return{
              crossellObjects:{
                ...state.crossellObjects,
                crossell:[...state.crossellObjects.crossell,newCrossell]
              }
            }
          }
        }
      }
      return {
        crossellObjects:{
          crossell:[newCrossell],
          dialog:null,
          open:false,
          selector:null,
          selectorIds:[]
        }
      }
    })
  },
  addSelected:(idCross:string,idProduct:string,quantity:number)=>{
    set((state)=>{
      if(!state.crossellObjects)return state
      
      let getCrossell = state.crossellObjects.crossell.find((elm)=>elm.id == idCross)
      let filterCrossell = state.crossellObjects.crossell.filter((elm)=>elm.id != idCross)
      
      
      if(getCrossell.selecteds.length !=0 ){
        let checkExist = getCrossell.selecteds.find((e)=>e.id==idProduct)
        let filterselected = getCrossell.selecteds.filter((e)=>e.id!=idProduct)
        if(!checkExist){
          let cross ={
            ...getCrossell,
            selecteds:[...filterselected,{id:idProduct,quantity:quantity}]
          }
          return{
            crossellObjects:{
              ...state.crossellObjects,              
              crossell:[...filterCrossell,cross]
            }
          }
        }
      }else{

          let cross ={
            ...getCrossell,
            selecteds:[{id:idProduct,quantity:quantity}]
          }
          return{
            crossellObjects:{
              ...state.crossellObjects,              
              crossell:[...filterCrossell,cross]
            }
          }
      }
      
      return state
    })

  },

  removeSelected:(idCross:string,idProduct:string)=>{
    
    set((state)=>{
      if(!state.crossellObjects)return state

      let getCrossell = state.crossellObjects.crossell.find((elm)=>elm.id == idCross)
      let selecteds = getCrossell.selecteds.filter((elm)=>elm.id!=idProduct)
      
      let cross ={
        ...getCrossell,
        selecteds:selecteds
      }

      return{
        crossellObjects:{
          ...state.crossellObjects,              
          crossell:[...state.crossellObjects.crossell,cross]
        }
      }
    }) 
  },

  resetSelecteds:(idCross:string)=>{
    set((state)=>{
      if(!state.crossellObjects)return state
    
      let getCrossell = state.crossellObjects.crossell.find((elm)=>elm.id == idCross)

      let cross ={
        ...getCrossell,
        selecteds:[]
      }
      let filterCrossell = state.crossellObjects.crossell.filter(elm=>elm.id != idCross)
      return{
        crossellObjects:{
          ...state.crossellObjects,              
          crossell:[...filterCrossell,cross]
        }
      }
    })
  },
  changeVisibility:(check:boolean)=>{
    set((state)=>{
      if(!state.crossellObjects)return state
      
      return{
        crossellObjects:{
          ...state.crossellObjects,
          open:check
        }
      }
      
    })
  },
  setDialog:(idProduct:string)=>{
    set((state)=>{

      if(!state.crossellObjects) return state;
      const parentCrossell = state.crossellObjects.crossell.find((elm)=>
        elm.products.some((e)=>e.id ===idProduct)
      );
      if(parentCrossell){
        return{
          crossellObjects:{
            ...state.crossellObjects,              
            dialog:{
              crossId:parentCrossell.id,
              productId:idProduct
            }   
          }
        }

      }
      return state  
      
    })
  }, 
  addProduct:(idCross:string,product:CrossellProduct)=>{
    set((state)=>{
      if(!state.crossellObjects) return state;
      const parentCrossell = state.crossellObjects?.crossell.find((elm)=>elm.id === idCross)
      const restCrossell = state.crossellObjects?.crossell.filter((elm)=>elm.id!=idCross)
      if( parentCrossell){
        if(parentCrossell.products.length > 0){
          let producto = parentCrossell.products.find((elm)=>elm.id==product.id)
          let restProductos =parentCrossell.products.filter((elm)=>elm.id!=product.id)
          
          if(!producto){
            const cross ={
              ...parentCrossell,
              products:[...restProductos,product]
            }
            return {
              crossellObjects:{
                ...state.crossellObjects,
                crossell:[...restCrossell,cross]
              }
            }
          }
        }else{
          const cross = {
            ...parentCrossell,
            products:[product]
          }
          return {
            crossellObjects:{
              ...state.crossellObjects,
              crossell:[...restCrossell,cross]
            }
          }
        }
      }
      
      return state

    })
  },
  setSelector:(selector:string | null)=>{
    set((state)=>{
      console.log("entra aqui",selector)
      if(!state.crossellObjects) return state
      return {
        crossellObjects:{
          ...state.crossellObjects,
          selector:selector
        }
      }

    })
  },
  setSelectorIds:(id:string,selector:string[] )=>{
    set((state)=>{
      console.log("entra aqui",selector)
      if(!state.crossellObjects) return state
      if(state.crossellObjects.selectorIds.length>0){
        let selectors = state.crossellObjects.selectorIds.find((elm)=>elm.crossId==id)
        let filterSelectors=state.crossellObjects.selectorIds.filter((elm)=>elm.crossId==id)
        if(!selectors){
          let select = {
            crossId:id,
            productsId:selector
          }
          return{
            crossellObjects:{
              ...state.crossellObjects,
              selectorIds:[...filterSelectors,select]
            }
          }
        }
      }


      return {
        crossellObjects:{
          ...state.crossellObjects,
          selectorIds:[{crossId:id,productsId:selector}]
        }
      }

    })
  },
  resetSelectorIds:( )=>{
    set((state)=>{

      if(!state.crossellObjects) return state
      return {
        crossellObjects:{
          ...state.crossellObjects,
          selectorIds:[]
        }
      }

    })
  }
}))