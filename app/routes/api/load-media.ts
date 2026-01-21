
import {data} from "react-router";
import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { MEDIA_QUERY } from "~/graphql/queries";
import type { MediaImagesByIdsQuery } from "storefront-api.generated";

interface ActionBody{
  ids:string[];
}

export const action:ActionFunction = async({request,context}:LoaderFunctionArgs)=>{
  if(request.method != "POST"){
    throw new Error("Invalid request method")
  }

  const body =(await request.json()) as ActionBody
  const ids = body.ids;
  
  if(!ids|| !Array.isArray(ids)){
    return data({result:[],errorMessage:"No se proporcionaron IDs válidos",ok:false})
  }
  
  if(ids){
    const result=
      await context.storefront.query<MediaImagesByIdsQuery>(MEDIA_QUERY,{
        variables:{
          ids:ids
        }
      })
      if (result){
        return data({result:result.nodes,ok:true},{status:201})
      }
  }
  
  return data({
    errorMessage:"Algo a salido mal al hacer la peticion de media",
    result:[],
    ok:false,
  },{
    status:500
  })
 
}

