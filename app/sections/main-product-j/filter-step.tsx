import { createSchema, type HydrogenComponentProps, type WeaverseMetaObject } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { Section } from "~/components/section";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
interface FilterStepProps extends HydrogenComponentProps {
  title: string;
  metaobj:WeaverseMetaObject;
}

interface ApiResponseCollection{
  result:any;
  ok:boolean;
  errorMessage?:string;
}
type Store={
  varOptions:string;
  addVarOptions:(elm:string)=>void
}
export const useVariantOptions = create<Store>()((set)=>({
  varOptions:"",
  addVarOptions:(elm)=>set((state)=>({varOptions:elm}))
}))

export default function FilterStep(props: FilterStepProps) {
  const { title,metaobj, children ,...rest } = props;
  const [isLoading,setIsLoading]= useState(false)
  const [metaObject,setMetaObject]= useState(null)
  const getApiUrl = usePrefixPathWithLocale(`api/metaobject`) 
  const {varOptions,addVarOptions} = useVariantOptions()

  useEffect(()=>{
    if(metaobj){
      setIsLoading(true)

      const loadMetaObject = async(retryCount=0)=>{
        try{
          const params = new URLSearchParams({
            handle:metaobj.handle
          })
          const finalUrl = `${getApiUrl}?${params.toString()}`

          const res = await fetch(finalUrl)
          const data = await res.json() as ApiResponseCollection

          if(data.ok){
            setMetaObject(data.result.metaobjects)
            setIsLoading(false)
          }else{
            if(retryCount<3){
              await new Promise(resolve=>setTimeout(resolve,1500));
              return loadMetaObject(retryCount + 1)
            }else{
              setMetaObject(null);
              setIsLoading(false);
            }
          }
        }catch(err){
          console.error("Error de red/servidor:",err)
          if(retryCount<3){
            await new Promise(resolve=>setTimeout(resolve,1500));
            return loadMetaObject(retryCount+1)
          }
          setIsLoading(false)
        }
      }
      loadMetaObject()
    }
  },[metaobj])

  useEffect(()=>{
    if(metaObject){
      let objectString= JSON.stringify(metaObject)
      addVarOptions(objectString)
    }
  },[metaObject])

  return (
    <Section {...rest}>
      {children}
    </Section>
  );
}

export const schema = createSchema({
  title: "Filter step",
  type: "filter-step",
  childTypes:[
    "filter-option",
    "filter-option-size",
    "filter-option-material"
  ],
  settings: [
    {
      group: "general",
      inputs: [
        {
          type:"metaobject",
          label:"metaobject",
          name:"metaobj",
          
        }
        
      ],
    },
  ],
  presets:{
    children:[
      {
        type:"filter-option",
      }
    ]
  }
});
