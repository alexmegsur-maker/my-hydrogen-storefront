import type { ComponentLoaderArgs } from "@weaverse/hydrogen";
import { data as json, type LoaderFunction, type LoaderFunctionArgs } from "react-router";
import { CHAIR_METAOBJECT_QUERY } from "~/graphql/chair-metaobject";

interface ActionBody{
  handle:string;
}

export const loader = async ({weaverse,data}:ComponentLoaderArgs<{metaobject:string}>)=>{

  
  const {storefront}=weaverse
  const handle = data?.metaobject

  if(!handle) return null
  
  const result =  await storefront.query(CHAIR_METAOBJECT_QUERY,{
    variables:{
      handle:handle
    }
  })
  console.log("result",result)
  if(result){
    return json({result:result.product,ok:true},{status:201})
  }
  
}