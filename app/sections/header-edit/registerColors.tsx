import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { useEffect } from "react";
import {create} from 'zustand'

interface ColorStore{
  identifier: string;
  color1:string;
  color2:string | null;
}
type Store={
  colors:ColorStore[]
  addColor:(data:ColorStore)=>void
  replace:(data:ColorStore)=>void
}

export const  useColorStore = create<Store>((set)=>({
  colors:[],
  addColor:(data)=>
    set((state)=>{
      const existe = state.colors.find(elm=>elm.identifier == data.identifier)
      if(existe){
        return state;
      }
      return{
        colors:[...state.colors,data]
      }
    }),
  replace:(data)=>
    set((state)=>({
      colors: [...state.colors.filter((elm) => elm.identifier !== data.identifier),data]
    }))
}))

function RegisterColor(props:HydrogenComponentProps){
  const {children} = props
  return(
    <>
      {children}
    </>
  )
}

export default RegisterColor

export const schema = createSchema({
  type:"register_color",
  title:"Register Color",
  limit:1,
  settings:[
    {
      group:"Color",
      inputs:[
      ]
    }
  ],childTypes:["color_elm"]
})