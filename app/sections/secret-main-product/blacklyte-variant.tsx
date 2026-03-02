import { createSchema, type WeaverseCollection } from "@weaverse/hydrogen"
import { useEffect, useState } from "react";
import type { CollectionsByIdsQuery } from "storefront-api.generated";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";

interface ApiResponseCollection{
  result:CollectionsByIdsQuery;
  ok:boolean;
  errorMessage?:string;
} 

interface BlacklyteVariantsProps{
  collections:WeaverseCollection[]
}

function BlacklyteVariants(props:BlacklyteVariantsProps){
  const {collections}=props
  const [isLoading,setIsLoading]=useState(false);
  const [collectionsData,setCollectionsData]=useState(null);
  const getApiUrl=usePrefixPathWithLocale(`api/collection`);

  useEffect(()=>{
      if(collections){
        let ids= collections.map((elm)=>{return `gid://shopify/Collection/${elm.id}`})
        setIsLoading(true)
        const loadCollection = async(retryCount = 0)=>{
          try{
            const res = await fetch(getApiUrl,{
              method:"POST",
              body:JSON.stringify({ids:ids})
            })
            const data = await res.json() as ApiResponseCollection;
            if(data.ok){
              setCollectionsData(data.result.nodes)
              setIsLoading(false);
            }else{
              if(retryCount<3){
                await new Promise(resolve=>setTimeout(resolve,1500));
                return loadCollection(retryCount + 1);
              }else{
                setCollectionsData(null);
                setIsLoading(false);
              }
              
            }
  
          }catch(err){
            console.error("Error de red/servidor:",err);
            if(retryCount<3){
              await new Promise(resolve => setTimeout(resolve,1500));
              return loadCollection(retryCount + 1);
            }
            setIsLoading(false)
          }
        }
  
        loadCollection()
      }
    },[collections,getApiUrl])
  
    useEffect(()=>{
      console.log("collectionsData",collectionsData)
    },[collectionsData])

  return (
    <div>
      
      estas en las variante de blacklyte    
    </div>
  ) 
}

export default BlacklyteVariants

export const schema = createSchema({
  title:"Variants blacklyte",
  type:"variants-blacklyte",
  settings:[
    {
      group:"general",
      inputs:[
        {
          type:'collection-list',
          label:'collections',
          name:'collections',
        }
      ]
    },
  ]
  
})