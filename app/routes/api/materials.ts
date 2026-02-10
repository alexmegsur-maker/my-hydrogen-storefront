import { GET_MATERIALS_QUERY } from './../../graphql/metaobject';
import type { LoaderFunction, LoaderFunctionArgs } from "react-router";
import type { GetMaterialsQuery} from "storefront-api.generated";
import {data} from "react-router";


export const loader:LoaderFunction = async({context}:LoaderFunctionArgs)=>{



  const result= await context.storefront.query<GetMaterialsQuery>(GET_MATERIALS_QUERY)
  
  if (result){
    return data({result:result,ok:true},{status:201})
  }


  return data({
    errorMessage:"Algo a salido mal al hacer la peticion de materiales",
    result:null,
    ok:false,
  },{
    status:500
  })
 
}

