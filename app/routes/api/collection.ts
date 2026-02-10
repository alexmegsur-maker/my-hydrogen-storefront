
import {data} from "react-router";
import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { COLLECTION_BY_IDS_SECRET_QUERY } from "~/graphql/collection";
import type { CollectionsByIdsQuery} from "storefront-api.generated";

interface ActionBody{
  ids:string[];
}

export const action:ActionFunction = async({request,context}:LoaderFunctionArgs)=>{
  if(request.method != "POST"){
    throw new Error("Invalid request method")
  }

  const body =(await request.json()) as ActionBody
  const ids = body.ids;
  
  if(!ids){
    return data({result:null,errorMessage:"No se proporciono un ID valido",ok:false})
  }
  
  if(ids){
    const result=
      await context.storefront.query<CollectionsByIdsQuery>(COLLECTION_BY_IDS_SECRET_QUERY,{
        variables:{
          ids:ids
        }
      })
      if (result){
        return data({result:result,ok:true},{status:201})
      }
  }
  
  return data({
    errorMessage:"Algo a salido mal al hacer la peticion de media",
    result:null,
    ok:false,
  },{
    status:500
  })
 
}

