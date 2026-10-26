import { createSchema,useItemInstance, useWeaverse, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";

interface GtaSectionProps extends HydrogenComponentProps {}

// interface ProductDesign {
//   id: string
//   title: string
//   description: string
//   baseColorUrl: string
//   normalMapUrl: string
//   aoMapUrl: string
//   specularMapUrl: string
//   logoUrl: string
//   sections: any[]
// }
export default function GtaSection(props: GtaSectionProps) {
  const { children } = props;
  const [childs,setChilds]= useState(null)
  const childInstances= useItemInstance()
  const weaverse = useWeaverse()


  useEffect(()=>{
  console.log("childInstances",childInstances)
  console.log("childInstances.weaverse",childInstances.weaverse)
  console.log("childInstances.weaverse",childInstances.weaverse.itemInstances)
  // console.log("children",childInstances.data?.children)
  // console.log("weaverse",weaverse)
  // console.log("weaverse.itemInstances",weaverse.itemInstances)
  
  if(childInstances){
    let hijos= childInstances.data.children
    let instanceItems = childInstances.weaverse.data.items
    let listaFinal= hijos.map((hijo)=>instanceItems.filter(elm=>elm.id ==hijo.id))
    console.log("listaFinal",listaFinal)
  }
 },[childInstances])
  
 return (
    <>
      {children}
       {/* <div className="fixed top-0 left-0 bg-red-300">
        <div></div>
        <div>
          {childs && 

          childs.map((elm,index)=>{
            return(
            <div>
              {index}
              <img src="" alt="" />
              
              <img src="" alt="" />
            </div>
            )
          })
          }
        </div>
       </div> */}
    </>
  )
}

export const schema = createSchema({
  title: "Gta section",
  type: "gta-section",
  enabledOn: {
    groups: ['*'],
  },
  childTypes: ["scroll-chair"],

});