import { useEffect, useState } from "react"
import { useCurrentProduct } from "~/stores/currentProduct";
import LateralPopupVariant from "../product-secret/lateral-popup-variant";
import type { RequestCollection } from "~/sections/secret-main-product/variants-secret";
import CollectionVariant from "../product-secret/collection-variant";
import Material from "../product-secret/material";
import type { Image } from "~/types/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
interface FieldsRequest {
  key:string;
  value:string;
  reference?:ReferenceImage;
}
interface ReferenceImage{
  id:string;
  image?:Image
}

interface MaterialRequest{
  id:string;
  handle:string;
  fields:FieldsRequest[];
}

interface variantSecretProps{
    varColor:string;
    varSize:string;
    varFamily:string;
    varPaddingSelect:string;
    varPaddingText:string;
    varMarginSelect:string;
    varMarginText:string;
    varWeight:string;
    svarColor:string;
    svarSize:string;
    svarWeight:string;
    svarFamily:string;
    svarSubColor:string;
    svarSubSize:string;
    svarSubWeight:string;
    svarSubFamily:string;
    lineColor:string;
    arrowColor:string;
    collectionTColor:string;
    collecitonSize:string;
    collectionFWeight:string;
    tooltipColor:string;
    tooltipBgColor:string;
    tooltipTSize:string;
    tooltipTWeight:string;
    tooltipSubTSize:string;
    tooltipSubTWeight:string;
    
}

interface VariantCollectionsSecretProps{
  widthSize:number;
  collections:RequestCollection[];
  showFilter:boolean;
  overflowActive:boolean;
  isLoading:boolean;
  toogleFilter:()=>void;
  selectedCollection:string;
  setSelectedCollection:(e)=>void;
  // materiales:{node:MaterialRequest}[];
  variantSecretProps:variantSecretProps;
}

function VariantCollectionsSecret(props:VariantCollectionsSecretProps){
  const {
    collections,
    showFilter,
    overflowActive,
    isLoading,
    toogleFilter,
    // materiales,
    selectedCollection,
    setSelectedCollection,
    variantSecretProps,
  }=props;
  const properties = variantSecretProps


  const collectionListProps = {
    collectionTColor:properties?.collectionTColor,
    collectionSize:properties?.collecitonSize,
    collectionFWeight:properties?.collectionFWeight,
    tooltipColor:properties?.tooltipColor,
    tooltipBgColor:properties?.tooltipBgColor,
    tooltipTSize:properties?.tooltipTSize,
    tooltipTWeight:properties?.tooltipTWeight,
    tooltipSubTSize:properties?.tooltipSubTSize,
    tooltipSubTWeight:properties?.tooltipSubTWeight,

  }

  const [numberFilter,setNumberFilter]=useState(0)
  const [filterCollection,setFilterCollection]=useState([]);
  const [selectedFilters,setSelectedFilters]=useState([]);

  const items = Array.from({ length: 6 }, (_, index) => index);

  useEffect(()=>{
    let has = selectedCollection!=""? 1:0
    let calc = selectedFilters.length + has
    setNumberFilter(calc)
  },[selectedFilters,selectedCollection])

 

  useEffect(()=>{
    if(collections){
      let list =[]
      let listProdFilter = []
      collections.forEach((elm)=>{
        let product = elm.products.edges
        if(elm.filtro){
          if(list.includes(elm.filtro.value)==false){
            list.push(elm.filtro.value)
          }
        }
        product.forEach((elm)=>{
          let material= elm.node.variants.edges[0].node.material
          if(material){
            if(listProdFilter.includes(material.value) == false){
              listProdFilter.push(material.value)
            }
          }
        })
      })
      setFilterCollection(list)
    }
  },[collections])

  const handleCheckboxChange=(value)=>{

    setSelectedFilters((prev)=>
    prev.includes(value)
      ? prev.filter((item)=>item !==value)
      :[...prev,value]
    )
  }

  return(
    <div>
      <div className="px-4 border-l-0 border-t-0 border-r-0 border-b border-solid bg-[#F2F2F2] border-sl-color-greyscale-500">
        <div className="relative">
          <div
            data-context="pdp-chairs-filter-accordion"
            data-testid="e2e-upholstery-filter"
            className="flex cursor-pointer min-h-[60px] items-center"
          >
            <div
              className="flex-1 transition-all duration-300"
              data-context="pdp-chairs-filter-accordion"
              onClick={toogleFilter}
            >
              <div>
                <div className="py-4  flex items-center items-center flex-row py-4">
                  <div className="flex-col">
                    <div className="flex flex-1 flex-col md:flex-row">
                      <div className="flex-none flex items-center content-center">
                        <div className="flex items-center me-3">
                          <img src="https://images.secretlab.co/theme/common/pdp-icon-filter.svg" />
                        </div>

                        <div className="flex uppercase font-bold me-3 gap-1 flex-row items-center">
                          <span 
                            className="pt-[1px] lg:pt-0.5"
                            style={{
                              // fontFamily:properties?.filterFamily,
                              // color:properties?.filterNavColor
                            }}
                            >
                            Filtros
                          </span>
                          {numberFilter > 0 && (
                            <span className="w-4 h-4 lg:w-[18px] lg:h-[18px] rounded-full bg-black flex items-center justify-center text-tag-sm colour-text-on-colour-primary">
                              {numberFilter}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              data-context="pdp-chairs-filter-accordion"
              className="flex items-center ms-4"
              onClick={toogleFilter}
            >
              <div
                className="me-1"
                data-context="pdp-chairs-filter-accordion"
                style={{
                  // color:properties?.filterNavShowColor,
                  // fontFamily:properties?.filterFamily
                }}
              >
                {showFilter ?"Ocultar":"Mostrar"}
              </div>

              <div
                data-context="pdp-chairs-filter-accordion"
                className="transition-all duration-300 rotate-90"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className=""
                  style={{
                    rotate:showFilter &&"180deg"
                  }}
                >
                  <path
                    d="M5.33398 1.57056L12.0007 8.23722L5.33398 14.9039"
                    stroke="#212529"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className=""
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          {showFilter && (
            <div
              className="filtro-view"
              style={{
                overflow:overflowActive ? "hidden":"visible"
              }}
            >
              <div className="mb-3 lg:mb-4">
                <div className="flex flex-row items-center mb-1 gap-1">
                  <span 
                    className="pt-[1px] lg:pt-0.5 link-xs"
                    style={{
                      // fontSize:properties?.tFSize,
                      // color:properties?.tFcolor,
                      // fontWeight:properties?.tFWeight,
                    }}
                  >
                    Edición
                  </span>
                </div>

                <div className="p-1 flex flex-row justify-between flex-wrap gap-1 border border-solid rounded-full colour-background-white">
                  <label
                    htmlFor="all"
                    className={`flex-none px-6 lg:flex-1 text-[14px] py-3 text-center rounded-full label-sm capitalize cursor-pointer flex items-center justify-center transition duration-300 hover:bg-stone-200 ${selectedCollection === "" ? "bg-black text-white":""} `} 
                  >
                    <input 
                      className="colfilt hidden" 
                      type="radio" 
                      id="all" 
                      name="colleciones" 
                      value="" 
                      checked={selectedCollection ===""}
                      onChange={(e)=>setSelectedCollection(e.target.value)}
                      />
                    Todas
                  </label>
              

                  {filterCollection.length>0 && filterCollection?.map((elm)=>{
                    const value= elm.trim()
                    return (
                      <label
                        htmlFor={value}
                        className={`flex-none px-6 lg:flex-1 text-[14px] py-3 text-center rounded-full label-sm capitalize cursor-pointer flex items-center justify-center transition duration-300 hover:bg-stone-200
                          ${selectedCollection === value ? "text-white":""}  `}
                          style={{
                            // backgroundColor:selectedCollection ? properties?.cfBgColor:"",
                          }}
                      >
                        <input 
                          className="colfilt hidden" 
                          type="radio" 
                          name="colleciones" 
                          id={value} 
                          value={value}
                          checked={selectedCollection ===value}
                          onChange={(e)=>setSelectedCollection(e.target.value)}
                          />
                        {value}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-row items-center mb-1">
                <span className="pt-[1px] lg:pt-0.5 flex-1 flex flex-row gap-1 items-center">
                  <span 
                    className="link-xs"
                    style={{
                      // fontSize:properties?.tFSize,
                      // color:properties?.tFcolor,
                      // fontWeight:properties?.tFWeight,
                    }}
                  >
                    Tapizados
                  </span>
                  {selectedFilters.length > 0 && (
                    <span className="flex-none w-4 h-4 lg:w-[18px] lg:h-[18px] rounded-full bg-black flex items-center justify-center text-tag-sm colour-text-on-colour-primary">
                      {selectedFilters.length}
                    </span>
                  )}
                </span>

                <div
                  className="body-sm cursor-pointer underline text-[#6C757D] flex-none"
                  data-popup-modal="true"
                  data-url="https://secretlab.eu//es?view=modal-upholstery"
                  data-script="//secretlab.eu/cdn/shop/t/406/assets/modal-popup-upholstery.js?v=74204397927634523201741671723"
                  data-css="//secretlab.eu/cdn/shop/t/406/assets/modal-popup-upholstery.css?v=53312213393010288701741101400"
                >
                  ¿Necesitas ayuda para elegir la tapicería?
                </div>
              </div>

              <div className="pb-4 flex flex-col lg:flex-row flex-wrap gap-1">
                {/* {listMaterials.map((elm,index)=>{
                  const materialFilter = materiales?.filter((m)=>m.node.handle == elm)
                  if (!materialFilter.length) return null;

                  const materialNode = materialFilter[0].node;
                  const materialList = materialNode.fields
                  const materialData= {
                    title:materialList.find((e)=>e.key==="title")?.value || elm,
                    handle:materialList.find((e)=>e.key==="handle_product")?.value ||"",
                    description:materialList.find((e)=>e.key ==="description")?.value||"",
                    img:materialList.find((e)=>e.key==="img")?.reference?.image?.url||"",
                  }
                  let value = materialData.handle
                  const isChecked = selectedFilters.find((elm)=>elm === value)
                  
                  return (
                    <Material 
                      colorChecked = {properties?.cfBgColor}
                      key={value} 
                      material={materialData} 
                      defaultTitle={elm} 
                      value={value}
                      isChecked={isChecked}
                      handleCheckboxChange={()=>handleCheckboxChange(value)}
                      />
                  )
                })} */}

              </div>
            </div>
          )}
        </div>
      </div>
      {isLoading  ? (
        <div className="px-4 transition-discrete" >
          <div className="caption-xl py-4 font-bold">
            prueba
          </div>
          <div className="grid gap-2 pb-4 grid-cols-3">
            {items.map((index)=>(
              <div key={index} className="relative">
                <div className="relative track-variant-grid e2e-card-variant order-[9999] transition-discrete">
                  <div className="lg:hidden">
                    <div className="w-full h-full">
                      <div className="track-magnifier-icon"></div>
                    </div>
                  </div>
                  <div className="flex border-solid rounded overflow-hidden aspect-3/4 relative cursor-pointer e2e-button-variant relative w-full h-full border border-[#A1A1AA] hover:border-[#A72A2F]  opacity-100">
                    <div className="h-full w-full flex">
                      <div className="w-[100%] h-[100%]  bg-stone-300 blur-sm">
                      </div>
                    </div> 
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : collections && collections.length > 0 && (
        collections.map((elm,index)=>{
          let filtro = elm.filtro
          if(filtro){
            if(selectedCollection!=""){
              if(selectedCollection == filtro.value ){
                return<CollectionVariant key={index} collection = {elm} listFilter={selectedFilters} estilos={collectionListProps} />
              }
            }else{
              return<CollectionVariant key={index} collection = {elm} listFilter={selectedFilters} estilos={collectionListProps}/>
            }
          } else{
            return<CollectionVariant key={index} collection = {elm} listFilter={selectedFilters} estilos={collectionListProps}/>
          }
        })
        
      )}
    </div>
  ) 
}

export default VariantCollectionsSecret