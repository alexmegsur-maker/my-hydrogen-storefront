import { createSchema, type WeaverseCollection } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import CollectionVariant from "~/components/product-secret/collection-variant";
import LateralPopup from "~/components/product-secret/lateral-popup";
import Variant from "~/components/product-secret/variant";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";

interface RequestImage{
  altText:string;
  url:string;
}
interface RequestMetafield{
  id:string;
  value:string;
}
export interface RequestVariant{
  id:string;
  title:string;
  availableForSale:boolean;
  sku:string;
  quantityAvailable:number;
  selectedOptions:RequestOption[];
  price:RequestPrice;
  nombre?:RequestMetafield;
  tooltip?:RequestMetafield;
}
interface RequestOption{
  name:string;
  value:string;
}
interface RequestPrice{
  amount:string;
  currencyCode:string;
}

export interface ProductNode{
  id:string;
  title:string;
  availableForSale:boolean;
  featuredImage:RequestImage;
  variants:{
    edges:{
      node:RequestVariant[]
    }
  }
}
interface RequestProduct{
  node:ProductNode
}

export interface RequestCollection{
  id:string;
  handle:string;
  title:string;
  description:string;
  image:RequestImage;
  products:{edges:RequestProduct[]}
}

interface ApiResponseCollection{
  result:{nodes:RequestCollection[]};
  ok:boolean;
  errorMessage?:string;
}

interface VariantSecretProps{
  variants:boolean,
  list:WeaverseCollection[],
}

function VariantSecret( props:VariantSecretProps){
  const { variants,list } = props;
  const [showVariant,setShowVariant]=useState(false);
  const container =  useRef(null);
  const [widthSize,setWidthSize] =useState(0);
  const [collections,setCollections]=useState(null);
  const [isLoading,setIsLoading]=useState(false);
  const getApiUrl=usePrefixPathWithLocale(`api/collection`);
  const items = Array.from({ length: 6 }, (_, index) => index);
  
  useEffect(()=>{
    if(container.current){
      setWidthSize(container.current.getBoundingClientRect().width)
    }
  },[container.current])
  
  useEffect(()=>{
    if(list){
      let ids= list.map((elm)=>{return `gid://shopify/Collection/${elm.id}`})
      setIsLoading(true)
      const loadCollection = async()=>{
        try{
          const res = await fetch(getApiUrl,{
            method:"POST",
            body:JSON.stringify({ids:ids})
          })
          const data = await res.json() as ApiResponseCollection;
          if(data.ok){
            setCollections(data.result.nodes)
          }else{
            setCollections(null)
          }
          

        }catch(err){
          console.error("Error al cargar colleciones",err)
          setCollections(null)
        }finally{
          setIsLoading(false)
        }
      }

      loadCollection()
    }
  },[list])

  return (
    <div ref={container} className="w-full h-auto">
      <div className="flex flex-col px-4 lg:px-8 py-6 lg:py-12 colour-surface-light-grey colour-text-primary border-0 border-b-[1px] border-solid border-r-0 colour-border-medium-grey">
        <h3 className="subheading-alt-lg">1. Elige tu silla</h3>

        <div className="flex flex-col gap-6 lg:gap-12 mt-6 lg:mt-8">
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
                    >
                      Variante
                    </div>
                  </div>

                  <div
                    data-context="pdp-chairs-variant"
                    className="border-b-0 border-r-0 border-l-2 border-t-0 border-solid colour-border-medium-grey ps-3 lg:ps-4 ms-1"
                  >
                    <div
                      data-context="pdp-chairs-variant"
                      className="headline-3 font-bold colour-text-emphasis e2e-section-group-variant-selection"
                    >
                      Rathalos
                    </div>

                    <div className="body-normal colour-text-secondary e2e-section-group-variant-selection-description flex gap-1">
                      <div data-context="pdp-chairs-variant">
                        Cuero Sintético Híbrido NEO™
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
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {showVariant && 
              <LateralPopup setActive={()=>setShowVariant(false)} active={showVariant} widthSize={widthSize}>
                <div className="px-4 border-l-0 border-t-0 border-r-0 border-b border-solid bg-[#F2F2F2] border-sl-color-greyscale-500">
                  <div className="relative">
                    <div
                      data-context="pdp-chairs-filter-accordion"
                      data-testid="e2e-upholstery-filter"
                      className="flex cursor-pointer min-h-[60px] items-center"
                    >
                      <div
                        className="flex-1"
                        data-context="pdp-chairs-filter-accordion"
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
                                    <span className="pt-[1px] lg:pt-0.5">
                                      Filtros
                                    </span>

                                    <span className="w-4 h-4 lg:w-[18px] lg:h-[18px] rounded-full bg-black flex items-center justify-center text-tag-sm colour-text-on-colour-primary">
                                      3
                                    </span>
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
                      >
                        <div
                          className="me-1"
                          data-context="pdp-chairs-filter-accordion"
                        >
                          Mostrar
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

                    <div
                      data-context="pdp-chairs-filter-accordion"
                      className="overflow-hidden ease-in-out duration-300 max-h-0"
                    >
                      <div className="mb-3 lg:mb-4">
                        <div className="flex flex-row items-center mb-1 gap-1">
                          <span className="pt-[1px] lg:pt-0.5 link-xs">
                            Edición
                          </span>
                        </div>

                        <div className="p-1 flex flex-row justify-between flex-wrap gap-1 border border-solid rounded-full colour-background-white">
                          <div
                            data-context="pdp-chairs-filter-all"
                            className="flex-none px-6 lg:flex-1 py-3 text-center rounded-full label-sm capitalize cursor-pointer flex items-center justify-center transition duration-300 bg-black text-white pdp-chairs-filter-all"
                          >
                            Todas
                          </div>

                          <div
                            data-context="pdp-chairs-filter-signature"
                            className="flex-none px-6 lg:flex-1 py-3 text-center rounded-full label-sm capitalize cursor-pointer flex items-center justify-center transition duration-300 colour-text-tertiary hover:colour-background-medium-grey pdp-chairs-filter-signature"
                          >
                            Ediciones exclusivas
                          </div>

                          <div
                            data-context="pdp-chairs-filter-special"
                            className="flex-none px-6 lg:flex-1 py-3 text-center rounded-full label-sm capitalize cursor-pointer flex items-center justify-center transition duration-300 colour-text-tertiary hover:colour-background-medium-grey pdp-chairs-filter-special"
                          >
                            Ediciones especiales
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row items-center mb-1">
                        <span className="pt-[1px] lg:pt-0.5 flex-1 flex flex-row gap-1 items-center">
                          <span className="link-xs">Tapizados</span>

                          <span className="flex-none w-4 h-4 lg:w-[18px] lg:h-[18px] rounded-full bg-black flex items-center justify-center text-tag-sm colour-text-on-colour-primary">
                            3
                          </span>
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
                        <div
                          data-context="pdp-chairs-filter-neo"
                          className="transition duration-300 block rounded-full border border-solid overflow-hidden relative cursor-pointer mb-[5px] e2e-button-upholstery-filter bg-[#27272A] border-[#27272A] text-white hover:colour-buttons-secondary-hover"
                        >
                          <div className="flex items-stretch e2e-upholstery-filter-content w-full e2e-upholstery-filter-neo-leatherette">
                            <div
                              className="flex-none w-[60px] overflow-hidden me-3"
                              data-context="pdp-chairs-filter-neo"
                            >
                              <img
                                loading="lazy"
                                src="https://images.secretlab.co/theme/common/swatch-leatherette-v2.jpg"
                                alt="Close-up of a textured black surface with a metallic sheen. The surface appears rough, creating an uneven pattern of light and shadow across the image."
                                className="object-cover w-full h-full"
                                data-context="pdp-chairs-filter-neo"
                              />
                            </div>

                            <div
                              className="flex flex-1 py-[12px]"
                              data-context="pdp-chairs-filter-neo"
                            >
                              <div className="body-sm w-full">
                                <div
                                  className="flex items-center"
                                  data-context="pdp-chairs-filter-neo"
                                >
                                  <div className="flex-1 pe-[5px]">
                                    <span
                                      className="label-sm"
                                      data-context="pdp-chairs-filter-neo"
                                    >
                                      Cuero Sintético Híbrido NEO™
                                    </span>
                                  </div>

                                  <div className="flex-none me-4 hidden lg:flex">
                                    <span
                                      className="relative justify-center cursor-pointer rounded-full items-center ms-1 bg-white text-black  flex w-[18px] h-[18px]"
                                      data-state="closed"
                                    >
                                      ?
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          data-context="pdp-chairs-filter-sw"
                          className="transition duration-300 block rounded-full border border-solid overflow-hidden relative cursor-pointer mb-[5px] e2e-button-upholstery-filter bg-[#27272A] border-[#27272A] text-white hover:colour-buttons-secondary-hover"
                        >
                          <div className="flex items-stretch e2e-upholstery-filter-content w-full e2e-upholstery-filter-softweave-plus">
                            <div
                              className="flex-none w-[60px] overflow-hidden me-3"
                              data-context="pdp-chairs-filter-sw"
                            >
                              <img
                                loading="lazy"
                                src="https://images.secretlab.co/theme/common/swatch-softweave-v2.jpg"
                                alt="A close-up view of a textured fabric, displaying a diagonal pattern with alternating dark and light gray woven threads, creating a subtle, repetitive design."
                                className="object-cover w-full h-full"
                                data-context="pdp-chairs-filter-sw"
                              />
                            </div>

                            <div
                              className="flex flex-1 py-[12px]"
                              data-context="pdp-chairs-filter-sw"
                            >
                              <div className="body-sm w-full">
                                <div
                                  className="flex items-center"
                                  data-context="pdp-chairs-filter-sw"
                                >
                                  <div className="flex-1 pe-[5px]">
                                    <span
                                      className="label-sm"
                                      data-context="pdp-chairs-filter-sw"
                                    >
                                      Tejido SoftWeave® Plus
                                    </span>
                                  </div>
                                  <div className="flex-none me-4 hidden lg:flex">
                                    <span
                                      className="relative justify-center cursor-pointer rounded-full items-center ms-1 bg-white text-black  flex w-[18px] h-[18px]"
                                      data-state="closed"
                                    >
                                      ?
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          data-context="pdp-chairs-filter-exotic"
                          className="transition duration-300 block rounded-full border border-solid overflow-hidden relative cursor-pointer mb-[5px] e2e-button-upholstery-filter bg-[#27272A] border-[#27272A] text-white hover:colour-buttons-secondary-hover"
                        >
                          <div className="flex items-stretch e2e-upholstery-filter-content w-full e2e-upholstery-filter-exotic">
                            <div
                              className="flex-none w-[60px] overflow-hidden me-3"
                              data-context="pdp-chairs-filter-exotic"
                            >
                              <img
                                loading="lazy"
                                src="https://images.secretlab.co/theme/common/swatch-exotic-v2.jpg"
                                alt="Close-up of a textured, light gray surface with subtle shadows and a slightly wavy pattern."
                                className="object-cover w-full h-full"
                                data-context="pdp-chairs-filter-exotic"
                              />
                            </div>
                            <div
                              className="flex flex-1 py-[12px]"
                              data-context="pdp-chairs-filter-exotic"
                            >
                              <div className="body-sm w-full">
                                <div
                                  className="flex items-center"
                                  data-context="pdp-chairs-filter-exotic"
                                >
                                  <div className="flex-1 pe-[5px]">
                                    <span
                                      className="label-sm"
                                      data-context="pdp-chairs-filter-exotic"
                                    >
                                      Lo exótico y NanoGen™
                                    </span>
                                  </div>
                                  <div className="flex-none me-4 hidden lg:flex">
                                    <span
                                      className="relative justify-center cursor-pointer rounded-full items-center ms-1 bg-white text-black  flex w-[18px] h-[18px]"
                                      data-state="closed"
                                    >
                                      ?
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {isLoading  ? (
                  <div className="px-4 transition-discrete" >
                    <div className="caption-xl py-4 font-bold">
                      prueba
                    </div>
                    <div className="grid gap-2 pb-4 grid-cols-3">
                      {items.map((index)=>(
                        <div className="relative">
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
                  collections.map((elm)=>{
                    return<CollectionVariant collection = {elm} />
                  })
                  
                )}
              </LateralPopup>
            }
          </div>
          <Variant/>
        </div>
      </div>
    </div>
  );
}

export default VariantSecret;

export const schema = createSchema({
  type:"variant-secret",
  title:"Variant Secret",
  settings:[
    {
      group:"",
      inputs:[
        {
          type:'switch',
          label:'available colections Variants',
          name:'variants',
          defaultValue:true,
        },
        {
          type:'collection-list',
          label:'collections',
          name:'list',
        },
      ]
    }
  ]
}) 