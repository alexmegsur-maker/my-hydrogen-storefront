import { useEffect, useState } from "react"
import { useCurrentProduct } from "~/stores/currentProduct";
import LateralPopupVariant from "./lateral-popup-variant";
import type { RequestCollection } from "~/sections/secret-main-product/variants-secret";
import CollectionVariant from "./collection-variant";
import Material from "./material";
import type { GetMaterialsQuery } from "storefront-api.generated";
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
    navBgColor:string;
    navColor:string;
    navSize:string;
    navFamily:string;
    filterFamily:string;
    filterNavColor:string;
    filterNavShowColor:string;
    tFSize:string;
    tFcolor:string;
    tFWeight:string;
    cfBgColor:string;
    collectionTColor:string;
    collecitonSize:string;
    collectionFWeight:string;
    tooltipColor:string;
    tooltipBgColor:string;
    tooltipTSize:string;
    tooltipTWeight:string;
    tooltipSubTSize:string;
    tooltipSubTWeight:string;
    sProdTColor:string;
    sProdTSize:string;
    sProdTFamily:string;
    sProdTPaddingSelect:string;
    sProdTPaddingText:string;
    sProdTMarginSelect:string;
    sProdTMarginText:string;
    sProdTWeight:string;
    sProdSubTColor:string;
    sProdSubTSize:string;
    sProdSubTFamily:string;
    sProdSubTPaddingSelect:string;
    sProdSubTPaddingText:string;
    sProdSubTMarginSelect:string;
    sProdSubTMarginText:string;
    sProdSubTWeight:string;
    sProdPriceColor:string;
    sProdPriceSize:string;
    sProdPriceFamily:string;
    sProdPricePaddingSelect:string;
    sProdPricePaddingText:string;
    sProdPriceMarginSelect:string;
    sProdPriceMarginText:string;
    sProdPriceWeight:string;
    buttonColor:string;
    buttonBgColor:string;
    buttonSize:string;
    buttonFamily:string;
    buttonPaddingSelect:string;
    buttonPaddingText:string;
    buttonMarginSelect:string;
    buttonMarginText:string;
    buttonWeight:string;
}

interface VariantCollectionsProps{
  varTitle:string;
  widthSize:number;
  collections:RequestCollection[];
  showFilter:boolean;
  overflowActive:boolean;
  isLoading:boolean;
  toogleFilter:()=>void;
  selectedCollection:string;
  setSelectedCollection:(e)=>void;
  materiales:{node:MaterialRequest}[];
  variantSecretProps:variantSecretProps;
}

function VariantCollections(props:VariantCollectionsProps){
  const {
    varTitle,
    widthSize,
    collections,
    showFilter,
    overflowActive,
    isLoading,
    toogleFilter,
    materiales,
    selectedCollection,
    setSelectedCollection,
    variantSecretProps,
  }=props;
  const properties = variantSecretProps
  const lateralProperties ={
    navBgColor:properties.navBgColor,
    navColor:properties.navColor,
    navSize:properties.navSize,
    navFamily:properties.navFamily,
    sProdTColor:properties.sProdTColor,
    sProdTSize:properties.sProdTSize,
    sProdTFamily:properties.sProdTFamily,
    sProdTPaddingSelect:properties.sProdTPaddingSelect,
    sProdTPaddingText:properties.sProdTPaddingText,
    sProdTMarginSelect:properties.sProdTMarginSelect,
    sProdTMarginText:properties.sProdTMarginText,
    sProdTWeight:properties.sProdTWeight,
    sProdSubTColor:properties.sProdSubTColor,
    sProdSubTSize:properties.sProdSubTSize,
    sProdSubTFamily:properties.sProdSubTFamily,
    sProdSubTPaddingSelect:properties.sProdSubTPaddingSelect,
    sProdSubTPaddingText:properties.sProdSubTPaddingText,
    sProdSubTMarginSelect:properties.sProdSubTMarginSelect,
    sProdSubTMarginText:properties.sProdSubTMarginText,
    sProdSubTWeight:properties.sProdSubTWeight,
    sProdPriceColor:properties.sProdPriceColor,
    sProdPriceSize:properties.sProdPriceSize,
    sProdPriceFamily:properties.sProdPriceFamily,
    sProdPricePaddingSelect:properties.sProdPricePaddingSelect,
    sProdPricePaddingText:properties.sProdPricePaddingText,
    sProdPriceMarginSelect:properties.sProdPriceMarginSelect,
    sProdPriceMarginText:properties.sProdPriceMarginText,
    sProdPriceWeight:properties.sProdPriceWeight,
    buttonColor:properties.buttonColor,
    buttonBgColor:properties.buttonBgColor,
    buttonSize:properties.buttonSize,
    buttonFamily:properties.buttonFamily,
    buttonPaddingSelect:properties.buttonPaddingSelect,
    buttonPaddingText:properties.buttonPaddingText,
    buttonMarginSelect:properties.buttonMarginSelect,
    buttonMarginText:properties.buttonMarginText,
    buttonWeight:properties.buttonWeight
  }

  const collectionListProps = {
    collectionTColor:properties.collectionTColor,
    collectionSize:properties.collecitonSize,
    collectionFWeight:properties.collectionFWeight,
    tooltipColor:properties.tooltipColor,
    tooltipBgColor:properties.tooltipBgColor,
    tooltipTSize:properties.tooltipTSize,
    tooltipTWeight:properties.tooltipTWeight,
    tooltipSubTSize:properties.tooltipSubTSize,
    tooltipSubTWeight:properties.tooltipSubTWeight,

  }

  const [showVariant,setShowVariant]=useState(false);
  const productStore = useCurrentProduct(state=>state.currentProduct);
  const [numberFilter,setNumberFilter]=useState(0)
  const [filterCollection,setFilterCollection]=useState([]);
  const [selectedFilters,setSelectedFilters]=useState([]);
  const listMaterials=['cuero','tela'];
  const items = Array.from({ length: 6 }, (_, index) => index);

  useEffect(()=>{
    let has = selectedCollection!=""? 1:0
    let calc = selectedFilters.length + has
    setNumberFilter(calc)
  },[selectedFilters,selectedCollection])

  useEffect(()=>{
    if(showVariant){
      document.body.parentElement.style.overflowY="hidden"
    }else{
      document.body.parentElement.style.overflowY="auto"
    }
  },[showVariant])

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
      <div
        data-context="pdp-chairs-variant"
        data-testid="e2e-selector-group-variant"
        onClick={()=>setShowVariant(true)}
        className="cursor-pointer border-b border-t-0 border-l-0 border-solid border-r-0 colour-surface-light-grey colour-border-medium-grey e2e-selector-group-variant variantdrawer [&amp;&amp;]:px-0 lg:[&amp;&amp;]:px-0 [&amp;&amp;]:py-0 lg:[&amp;&amp;]:py-0 border-b-0"
      >
        <div className="flex items-center">
          <div className="flex-1">
            <div className="mb-3 lg:mb-4 flex items-center justify-between">
              <div
                data-context="pdp-chairs-variant"
                className="colour-text-primary subheading-alt-normal font-bold"
                style={{
                  color:properties.varColor,
                  fontSize:properties.varSize,
                  fontFamily:properties.varFamily,
                  ...selectorPaddingMargin("padding",properties.varPaddingSelect,properties.varPaddingText),
                  ...selectorPaddingMargin("margin",properties.varMarginSelect,properties.varMarginText),
                  fontWeight:properties.varWeight,
                  

                }}
              >
                {varTitle}
              </div>
            </div>
            {productStore ? (<div
              data-context="pdp-chairs-variant"
              className="border-b-0 border-r-0 border-l-2 border-t-0 border-solid ps-3 lg:ps-4 ms-1"
              style={{
                borderColor:properties.lineColor
              }}
            >
              <div
                data-context="pdp-chairs-variant"
                className=""
                style={{
                  color:properties.svarColor,
                  fontSize:properties.svarSize,
                  fontWeight:properties.svarWeight,
                  fontFamily:properties.svarFamily
                }}
              >
                {typeof productStore.nombre == "string"   ? productStore.nombre : productStore.title}
                
              </div>
              {productStore.tooltip && (
                <div className="flex gap-1">
                    <div 
                      data-context="pdp-chairs-variant"
                      style={{
                        color:properties.svarSubColor,
                        fontSize:properties.svarSubSize,
                        fontWeight:properties.svarSubWeight,
                        fontFamily:properties.svarSubFamily
                      }}
                      >
                      {productStore.tooltip.value|| productStore.tooltip as string} 
                    </div>
                  <div
                    data-context="pdp-chairs-variant"
                    className="cusor-pointer justify-center w-[20px] h-[20px] items-center text-white leading-none text-center inline-block"
                    data-popup-modal="true"
                    data-url="https://secretlab.eu//es?view=modal-upholstery"
                    data-script="//secretlab.eu/cdn/shop/t/406/assets/modal-popup-upholstery.js?v=74204397927634523201741671723"
                    data-css="//secretlab.eu/cdn/shop/t/406/assets/modal-popup-upholstery.css?v=53312213393010288701741101400"
                  >
                    <div
                      className="colour-icons-on-light [&amp;_*]:pointer-events-none"
                      data-context="pdp-chairs-variant"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <svg
                        width="20"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M15 7.99988C15 11.8659 11.866 14.9999 8 14.9999C4.13401 14.9999 1 11.8659 1 7.99988C1 4.13388 4.13401 0.999878 8 0.999878C11.866 0.999878 15 4.13388 15 7.99988Z"
                          fill={properties.lineColor}
                        ></path>

                        <path
                          d="M8.56008 9.53359H7.28958V8.80909C7.28958 8.36809 7.36308 8.10559 7.69908 7.78009L8.17158 7.32859C8.59158 6.92959 8.84358 6.66709 8.84358 6.17359C8.84358 5.69059 8.49708 5.40709 8.03508 5.40709C7.60458 5.40709 7.22658 5.64859 7.21608 6.12109H5.83008C5.83008 4.81909 6.83808 4.17859 8.03508 4.17859C9.26358 4.17859 10.3136 4.81909 10.3136 6.18409C10.3136 7.02409 9.84108 7.61209 9.26358 8.17909L8.91708 8.51509C8.70708 8.72509 8.56008 8.86159 8.56008 9.20809V9.53359Z"
                          fill="white"
                        ></path>

                        <path
                          d="M8.64407 11.8212V10.3932H7.20557V11.8212H8.64407Z"
                          fill="white"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>):(
              <div
              data-context="pdp-chairs-variant"
              className="border-b-0 border-r-0 border-l-2 border-t-0 border-solid colour-border-medium-grey ps-3 lg:ps-4 ms-1"
            >
              <div
                data-context="pdp-chairs-variant"
                className="headline-3 font-bold colour-text-emphasis e2e-section-group-variant-selection"
              >
                <div className="h-2.5 h-2.5 bg-stone-300 rounded-full w-40 animate-pulse"></div>
              </div>

              <div className="body-normal colour-text-secondary e2e-section-group-variant-selection-description flex gap-1">
                <div data-context="pdp-chairs-variant">
                  <div className="h-2.5 h-2.5 bg-stone-300 rounded-full w-40 animate-pulse"></div>
                </div>
                <div
                  data-context="pdp-chairs-variant"
                  className="cusor-pointer justify-center w-[20px] h-[20px] items-center text-white leading-none text-center inline-block"
                  data-popup-modal="true"
                  data-url="https://secretlab.eu//es?view=modal-upholstery"
                  data-script="//secretlab.eu/cdn/shop/t/406/assets/modal-popup-upholstery.js?v=74204397927634523201741671723"
                  data-css="//secretlab.eu/cdn/shop/t/406/assets/modal-popup-upholstery.css?v=53312213393010288701741101400"
                >
                  <div
                    className="colour-icons-on-light [&amp;_*]:pointer-events-none"
                    data-context="pdp-chairs-variant"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M15 7.99988C15 11.8659 11.866 14.9999 8 14.9999C4.13401 14.9999 1 11.8659 1 7.99988C1 4.13388 4.13401 0.999878 8 0.999878C11.866 0.999878 15 4.13388 15 7.99988Z"
                        fill="currentColor"
                      ></path>

                      <path
                        d="M8.56008 9.53359H7.28958V8.80909C7.28958 8.36809 7.36308 8.10559 7.69908 7.78009L8.17158 7.32859C8.59158 6.92959 8.84358 6.66709 8.84358 6.17359C8.84358 5.69059 8.49708 5.40709 8.03508 5.40709C7.60458 5.40709 7.22658 5.64859 7.21608 6.12109H5.83008C5.83008 4.81909 6.83808 4.17859 8.03508 4.17859C9.26358 4.17859 10.3136 4.81909 10.3136 6.18409C10.3136 7.02409 9.84108 7.61209 9.26358 8.17909L8.91708 8.51509C8.70708 8.72509 8.56008 8.86159 8.56008 9.20809V9.53359Z"
                        fill="white"
                      ></path>

                      <path
                        d="M8.64407 11.8212V10.3932H7.20557V11.8212H8.64407Z"
                        fill="white"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            ) }
            
          </div>

          <div
            data-context="pdp-chairs-variant"
            className="flex-none [&amp;_*]:pointer-events-none"
          >
            <div style={{ width: "20px", height: "20px" }}>
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z"
                  fill={properties.arrowColor}
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {showVariant && 
        <LateralPopupVariant lateralProps={lateralProperties} setActive={()=>setShowVariant(false)} active={showVariant} widthSize={widthSize} title={varTitle}>
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
                                  fontFamily:properties.filterFamily,
                                  color:properties.filterNavColor
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
                      color:properties.filterNavShowColor,
                      fontFamily:properties.filterFamily
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
                          fontSize:properties.tFSize,
                          color:properties.tFcolor,
                          fontWeight:properties.tFWeight,
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
                                backgroundColor:selectedCollection ? properties.cfBgColor:"",
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
                          fontSize:properties.tFSize,
                          color:properties.tFcolor,
                          fontWeight:properties.tFWeight,
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
                    {listMaterials.map((elm,index)=>{
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
                          colorChecked = {properties.cfBgColor}
                          key={value} 
                          material={materialData} 
                          defaultTitle={elm} 
                          widthSize={widthSize}
                          value={value}
                          isChecked={isChecked}
                          handleCheckboxChange={()=>handleCheckboxChange(value)}
                          />
                      )
                    })}

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
        </LateralPopupVariant>
      }
    </div>
  ) 
}

export default VariantCollections