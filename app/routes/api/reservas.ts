
import {data} from "react-router";
import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import type { ReservaQuery } from "storefront-api.generated";
import { RESERVA_QUERY } from "~/graphql/reserva";

interface ActionBody{
  handle:string;
}

export const action:ActionFunction = async({request,context}:LoaderFunctionArgs)=>{
  if(request.method != "POST"){
    throw new Error("Invalid request method")
  }

  const body =(await request.json()) as ActionBody
  let handle = body.handle;
  
  if(!handle){
    return data({result:null,errorMessage:"No se proporciono un handle valido",ok:false})
  }
  if(handle){
    const result=
      await context.storefront.query<ReservaQuery>(RESERVA_QUERY,{
        variables:{
            handle:handle
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

