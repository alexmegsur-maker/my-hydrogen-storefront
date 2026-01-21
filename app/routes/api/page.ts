
import {data} from "react-router";
import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { PAGE_QUERY_BY_ID } from "~/graphql/queries";
import type { PageByIdQuery } from "storefront-api.generated";

interface ActionBody{
  id:string;
}

export const action:ActionFunction = async({request,context}:LoaderFunctionArgs)=>{
  if(request.method != "POST"){
    throw new Error("Invalid request method")
  }

  const body =(await request.json()) as ActionBody
  let id = body.id;
  
  if(!id){
    return data({result:null,errorMessage:"No se proporciono un ID valido",ok:false})
  }
  
  if(id && id.includes('OnlineStorePage')){
    id=id.replace('OnlineStorePage','Page')
  }

  const result=
    await context.storefront.query<PageByIdQuery>(PAGE_QUERY_BY_ID,{
      variables:{
          id:id
      }
    })
    if (result){
      return data({result:result,ok:true},{status:201})
    }
  
  return data({
    errorMessage:"Algo a salido mal al hacer la peticion de media",
    result:null,
    ok:false,
  },{
    status:500
  })
 
}

