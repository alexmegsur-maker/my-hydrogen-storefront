import { GET_VARIANT_OPTIONS } from './../../graphql/metaobject-variant-option';
import type { LoaderFunction, LoaderFunctionArgs } from "react-router";
import type { GetMaterialsQuery, GetVariantsOptionsQuery} from "storefront-api.generated";
import {data} from "react-router";


export const loader:LoaderFunction = async({request,context}:LoaderFunctionArgs)=>{

  const url = new URL(request.url)
  const handle= url.searchParams.get("handle");
  
  if(!handle){
    return data({
      errorMessage:"No se proporcionó un handle de metaobjeto",
      return:null,
      ok:false,      
    },{status:400})
  }
  try{
    const result= await context.storefront.query<GetVariantsOptionsQuery>(
      GET_VARIANT_OPTIONS,
      {
        variables:{
          handle:handle
        }
      }
    )

    if (result){
      return data({result:result,ok:true},{status:201})
    }
  }catch(error){
    console.log("Error en la petición a Storefront:", error)
  }



  return data({
    errorMessage:"Error al obtener los datos del metaobjeto",
    result:null,
    ok:false,
  },{
    status:500
  })
 
}

