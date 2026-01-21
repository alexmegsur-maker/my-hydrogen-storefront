import { useEffect, useState } from "react"
import type { RequestVariant, RequestCollection } from "~/sections/secret-main-product/variants-secret"
import ProductCardCollection from "./product-card-collection"

interface collectionVariantProps{
  collection:RequestCollection
}

function CollectionVariant(props:collectionVariantProps){
  const {collection}= props
  const products= collection.products.edges 
  if(collection !=null){
    return (
      <div className="px-4">
        <div className="caption-xl py-4 font-bold">
          {collection.title}
        </div>
        <div className="grid gap-2 pb-4 grid-cols-3">
          {products.map((elm)=>{
            let variante = elm.node.variants.edges[0].node 
            return(
              <ProductCardCollection producto={elm.node} variante={variante}/>
            ) 
          })}
         
        </div>
      </div>
    )
  }
  return (<p>Loading...</p>)
}

export default CollectionVariant