import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { useEffect } from "react"
import { useColorStore } from "./registerColors";
import { components } from "~/weaverse/components";

interface ColorProps extends HydrogenComponentProps{
  identifier:string;
  has:boolean;
  color1:string;
  color2?:string;
}

function ColorElm(props:ColorProps){
   const colorAdd = useColorStore((state)=>state.addColor);
   const colors = useColorStore((state)=>state.colors);
   const replace = useColorStore((state)=>state.replace)
  
  const {identifier, has, color1,color2,children} = props
  useEffect(()=>{
    const colorElm={
      identifier:identifier.toLowerCase(),
      color1,
      color2:has? color2:null
    }
    let checkElm = colors.find(elm=>elm.identifier === identifier)

    if(!checkElm && identifier){
      colorAdd(colorElm)
    }
    if(checkElm?.identifier == identifier){
      replace(colorElm)
    }

  },[])
  return(<></>)
}
export default ColorElm

export const schema = createSchema({
  type:"color_elm",
  title:"color",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'text',
          label:'identifier',
          name:'identifier',
          defaultValue:'color',
        },
        {
          type:'switch',
          label:'has 2 colors',
          name:'has',
          defaultValue:false,
        },
        {
          type:'color',
          label:'first color',
          name:'color1',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'second color',
          name:'color2',
          defaultValue:'#000000',
          condition:(data) => data.has === true
        },

      ]
    }
  ]
})