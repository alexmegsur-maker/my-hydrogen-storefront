import { useEffect, useState } from "react"
import type { RequestVariant, RequestCollection } from "~/sections/secret-main-product/variants-secret"
import ProductCardCollection from "./product-card-collection"

interface collectionListProps{
  collectionTColor:string;
  collectionSize:string;
  collectionFWeight:string;
  tooltipColor:string;
  tooltipBgColor:string;
  tooltipTSize:string;
  tooltipTWeight:string;
  tooltipSubTSize:string;
  tooltipSubTWeight:string;
}

interface collectionVariantProps{
  collection:RequestCollection;
  listFilter:string[];
  estilos:collectionListProps
}

function CollectionVariant(props:collectionVariantProps){
  const {collection,listFilter,estilos}= props
  
  if(!collection)return <p>Loading...</p>
  
  const products= collection.products.edges 
  
  const filteredProducts = products.filter((elm)=>{
    if(listFilter.length===0) return true;

    const material = elm.node.variants.edges[0].node.material?.value;
    if(!material)return false

    return listFilter.some((f)=>f.toLocaleLowerCase()===material.toLocaleLowerCase());
  });
  
  const isEmpty = filteredProducts.length === 0;
  
  return (
    <div className="px-4">
      {!isEmpty &&(
        <div 
          className="caption-xl py-4 font-bold"
          style={{
            color:estilos.collectionTColor,
            fontSize:estilos.collectionSize,
            fontWeight:estilos.collectionFWeight
          }}
          >
          {collection.title}
        </div>
      )}
      <div className="grid gap-2 pb-4 grid-cols-3">
        {filteredProducts.map((elm)=>{
          let variante = elm.node.variants.edges[0].node
            return(
              <ProductCardCollection 
                key={elm.node.id} 
                product={elm.node} 
                variante={variante}
                tooltipProps={{
                  tooltipColor:estilos.tooltipColor,
                  tooltipBgColor:estilos.tooltipBgColor,
                  tooltipTSize:estilos.tooltipTSize,
                  tooltipTWeight:estilos.tooltipTWeight,
                  tooltipSubTSize:estilos.tooltipSubTSize,
                  tooltipSubTWeight:estilos.tooltipSubTWeight
                }}
                />
            )
        })}
      </div>
    </div>
  )
}

export default CollectionVariant