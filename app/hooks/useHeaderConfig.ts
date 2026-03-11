import {useWeaverse} from '@weaverse/hydrogen'

export function useColorTheme(){
  const { data } = useWeaverse();
  const colors = data?.items.filter((elm)=>elm.type ==="color_elm")
  const colores = colors?.map((elm)=>{
    const color1 = elm.data?.color1 ? elm.data.color1 : "#ffffff"
    return{identifier:elm.data?.identifier,colors:elm.data?.color2 ? [color1,elm.data?.color2]:[color1]}
  })
  return colores
}