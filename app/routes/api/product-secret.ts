
import {data} from "react-router";
import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { PRODUCT_QUERY } from "~/graphql/queries";
import type { ProductQuery } from "storefront-api.generated";

interface ActionBody{
  handle:string;
}

export const action:ActionFunction = async({request,context}:LoaderFunctionArgs)=>{
  if(request.method != "POST"){
    throw new Error("Invalid request method")
  }
const {storefront} = context
  const body =(await request.json()) as ActionBody
  const handle = body.handle;
  
  if(!handle){
    return data({result:null,errorMessage:`No se proporciono un handle valido ${JSON.stringify(body)}`,ok:false})
  }
  
  if(handle){
    const result=
      await context.storefront.query<ProductQuery>(PRODUCT_QUERY,{
        variables:{
          handle:handle,
          selectedOptions:[],
          language:storefront.i18n.language,
          country:storefront.i18n.country
        }
      })
      if (result){
        return data({result:result.product,ok:true},{status:201})
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