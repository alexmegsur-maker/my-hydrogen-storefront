
import {data} from "react-router";
import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { MEDIA_QUERY_BY_ID } from "~/graphql/queries";
import type { MediaImagesByIdQuery } from "storefront-api.generated";

interface ActionBody{
  id:string;
}

export const action:ActionFunction = async({request,context}:LoaderFunctionArgs)=>{
  if(request.method != "POST"){
    throw new Error("Invalid request method")
  }

  const body =(await request.json()) as ActionBody
  const id = body.id;
  
  if(!id){
    return data({result:null,errorMessage:"No se proporciono un ID valido",ok:false})
  }
  
  if(id){
    const result=
      await context.storefront.query<MediaImagesByIdQuery>(MEDIA_QUERY_BY_ID,{
        variables:{
            id:id
        }
      })
      if (result){
        return data({result:result.node,ok:true},{status:201})
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

