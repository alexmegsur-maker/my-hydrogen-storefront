import { createSchema } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import Dialog from "~/components/dialog";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import { checkPrice } from "~/utils/product";

interface PriceSectionProps {
  tColor:string;
  tSize:string;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  vColor:string;
  vSize:string;
  vFamily:string;
  vPaddingSelect:string;
  vPaddingText:string;
  vMarginSelect:string;
  vMarginText:string;
  vWeight:string;
  iColor:string;
  iSize:string;
  iFamily:string;
  iPaddingSelect:string;
  iPaddingText:string;
  iMarginSelect:string;
  iMarginText:string;
  iWeight:string;
  pTColor:string;
  pCColor:string;
  pColor:string;
  pTSize:string;
  pCSize:string;
  pSize:string;
  pFamily:string;
  pPaddingSelect:string;
  pPaddingText:string;
  pMarginSelect:string;
  pMarginText:string;
  payColor:string;
  paySize:string;
  payFamily:string;
  payPaddingSelect:string;
  payPaddingText:string;
  payMarginSelect:string;
  payMarginText:string;
  payWeight:string;
  mFamily:string;
  mPaddingSelect:string;
  mPaddingText:string;
  mMarginSelect:string;
  mMarginText:string;
  mTColor:string;
  mColor:string;
  mTSize:string;
  mSize:string;
  mTWeight:string;
  mWeight:string;
  iShow:boolean;
  toolText:string;
  toolBgColor:string;
  toolColor:string;
  toolSize:string;
  toolFamily:string;
}

function PriceSection(props:PriceSectionProps){
  
  const {
    tColor,
    tSize,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    vColor,
    vSize,
    vFamily,
    vPaddingSelect,
    vPaddingText,
    vMarginSelect,
    vMarginText,
    vWeight,
    iShow,
    iColor,
    iSize,
    iFamily,
    iPaddingSelect,
    iPaddingText,
    iMarginSelect,
    iMarginText,
    iWeight,
    pTColor,
    pCColor,
    pColor,
    pTSize,
    pCSize,
    pSize,
    pFamily,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    payColor,
    paySize,
    payFamily,
    payPaddingSelect,
    payPaddingText,
    payMarginSelect,
    payMarginText,
    payWeight,
    mFamily,
    mPaddingSelect,
    mPaddingText,
    mMarginSelect,
    mMarginText,
    mTColor,
    mColor,
    mTSize,
    mSize,
    mTWeight,
    mWeight,
    toolText,
    toolBgColor,
    toolColor,
    toolSize,
    toolFamily
  } = props;
  const [showTooltip,setShowTooltip]=useState(false)
  const [isDialogOpen,setIsDialogOpen]=useState(false)
  const dialog = useRef(null)
  const indirect = useRef(null)
  const priceSection = useRef(null)
  const product = useCurrentProduct(state=>state.currentProduct) 
  const [position,setPosition]= useState({x:0, y:0,width:0,posW:0})

  useEffect(()=>{

   if(priceSection.current && indirect.current){
     const priceCont = priceSection.current?.getBoundingClientRect()
     const pos = indirect.current?.getBoundingClientRect()
     if (pos.y != position.y) {
      setPosition({
        x: pos.x,
        y: pos.y,
        width: priceCont.width,
        posW:pos.width,
      });
    }
   } 
    
  },[showTooltip])
   
  if(product){
    return (
      <> 
        <div 
          ref={priceSection}
          className="hidden lg:block p-4 lg:p-8 border-b border-l-0 border-r-0 border-solid st-colour-border-medium-grey e2e-section-order-info"
        >
          {product.selectedVariant.availableForSale && 
            <div className="flex gap-1 flex-wrap e2e-section-status">
              {product.selectedVariant.quantityAvailable <= 0 &&
                <span className="uppercase flex gap-1 items-center justify-center w-fit text-[12px] text-white bg-[#F99704] p-[2px] lg:p-1">
                  Reservar
                </span>
              }
            </div>
          }
          <div className="flex mt-2">
            <div className="flex-none"></div>
            <div className="flex-1">
              <div 
                style={{
                  color:tColor,
                  fontSize:tSize,
                  fontFamily:tFamily,
                  fontWeight:tWeight,
                  ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
                  ...selectorPaddingMargin("margin",tMarginSelect,tMarginText),
                }}
                >
                { product.nombre? product.nombre : product.title}
              </div>
              { product.variants.nodes.length > 1 &&
                <div 
                  style={{
                    color:vColor,
                    fontSize:vSize,
                    fontFamily:vFamily,
                    fontWeight:vWeight,
                    ...selectorPaddingMargin("padding",vPaddingSelect,vPaddingText),
                    ...selectorPaddingMargin("margin",vMarginSelect,vMarginText),
                  }}
                  >
                  {product.selectedVariant.selectedOptions[0]?.value}
                </div>
              }
            </div>
          </div>
          <div className="grid-cols-8 mt-4 hidden lg:grid gap-x-8">
            {iShow &&
              (
                <>
                  <div 
                    className="col-span-3 flex"
                    style={{
                      color:iColor,
                      fontSize:iSize,
                      fontFamily:iFamily,
                      fontWeight:iWeight,
                      ...selectorPaddingMargin("padding",iPaddingSelect,iPaddingText),
                      ...selectorPaddingMargin("margin",iMarginSelect,iMarginText),
                    }}
                  >
                    Precio indirecto

                  <div 
                    className="group h-fit"
                    onMouseEnter={()=>setShowTooltip(true)}
                    onMouseLeave={()=>setShowTooltip(false)}
                  >

                    <div 
                      className="transition-discrete invisible  group-hover:visible opacity-0 group-hover:opacity-100 fixed z-10  mb-2" 
                      style={{
                        left: `${position.x}px`,
                        top: `${position.y-5}px`,
                        width:`${position.width}px`

                      }}   
                    >
                      <div className="mb-2">
                        <span className={`triangle absolute mb-2 top-0   -translate-y-[10%]`}
                          style={{
                            width:0,
                            height:0,
                            borderLeft:"5px solid transparent",
                            borderRight:"5px solid transparent",
                            borderBottom:`6px solid ${toolBgColor}`,
                            rotate:"180deg",
                            left:`${position.posW/2}px`
                          }}
                        ></span>
                        <div 
                          className=" text-center w-[60%]  rounded-lg -translate-x-[50%] -translate-y-[100%]"
                          style={{
                            backgroundColor:toolBgColor
                          }}
                          >
                          <div className="py-[8px] px-[16px] flex flex-col">
                            <span 
                              style={{
                                color:toolColor,
                                fontSize:toolSize,
                                fontFamily:toolFamily
                              }}
                            >
                              {toolText}
                            </span>    
                          </div>
                        </div>
                      </div>
                    </div>
                    <p
                      className="font-bold ps-1 capitalize cursor-help"
                      ref = {indirect}
                      
                    >
                      (¿por qué?)
                    </p>
                  </div>
                  </div>
                  <div 
                    className="col-span-5 text-[#2b2b2b] ml-2.5 lg:ml-0"
                    style={{
                      fontSize:pSize,
                      ...selectorPaddingMargin("padding",iPaddingSelect,iPaddingText),
                      ...selectorPaddingMargin("margin",iMarginSelect,iMarginText),
                    }}
                  >
                    {Math.ceil(parseFloat(product.selectedVariant.price.amount)*1.2)} €
                  </div>
                </>
              )
            }
            <div 
              className="col-span-3 text-[14px] mt-2"
              style={{
                color:pTColor,
                fontSize:pTSize,
                fontFamily:pFamily,
                ...selectorPaddingMargin("padding",pPaddingSelect,pPaddingText),
                ...selectorPaddingMargin("margin",pMarginSelect,pMarginText),
              }}
            >
              Precio de venta
            </div>
            <div 
              className="col-span-5 font-bold ml-2.5 lg:ml-0 mt-2"
              style={{
                ...selectorPaddingMargin("padding",pPaddingSelect,pPaddingText),
                ...selectorPaddingMargin("margin",pMarginSelect,pMarginText),
              }}
            >
              <div className="flex items-center gap-1 st-label-lg mb-3">
                <div 
                  className="font-bold"
                  style={{
                    color:pColor,
                    fontSize:pSize,
                    fontFamily:pFamily,
                  }}
                  >
                  { product.selectedVariant.compareAtPrice?.amount && (
                    <span 
                      className=" font-normal line-through mr-2"
                      style={{
                        color:pCColor,
                        fontSize:pCSize,
                      }}
                    > 
                      {checkPrice(product.selectedVariant.compareAtPrice.amount)} €
                    </span>
                  )
                  }
                  {checkPrice(product.selectedVariant.price.amount)} €
                </div>
              </div>
              <div 
                className="st-body-xs font-normal e2e-section-finance st-colour-text-tertiary"
                style={{
                  ...selectorPaddingMargin("padding",payPaddingSelect,payPaddingText),
                  ...selectorPaddingMargin("margin",payMarginSelect,payMarginText),
                }}
                >
                <div className="financing">
                  <p
                    className="paylater-eu flex flex-wrap mb-0 leading-6 text-[14px] text-[#71717A]"
                    data-instalment-min="3"
                    style={{
                      color:payColor,
                      fontSize:paySize,
                      fontFamily:payFamily,
                      fontWeight:payWeight,
                    }}
                  >
                    <span>
                      Paga en 3 plazos y sin intereses desde 
                      <b 
                        className="mr-1"
                        style={{
                          color:pColor
                        }}
                      >
                        <span className="instalment-amt mx-1" data-instalment-split="3">
                          {Math.ceil(parseFloat(product.selectedVariant.price.amount)/3)}
                        </span>
                        €
                      </b> 
                      con
                    </span>
                    <a
                      href="https://www.paypal.com/es/webapps/mpp/paga-en-3-plazos?locale.x=es_ES"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="https://images.secretlab.co/theme/common/logo_paypal.svg"
                        alt="Paypal Credit logo"
                        className="paypal h-[20px]" 
                      />
                    </a>
                    .
                    <button
                      onClick={()=>setIsDialogOpen(true)}
                      id="paypal-button-popup"
                      className="hover:underline focus:underline hover:st-colour-link-primary-hover focus:st-colour-link-primary-hover"
                      style={{
                        fontSize:paySize,
                        color:pColor
                      }}
                    >
                      Saber más
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          ref={dialog}
          className="top-0 left-0 bg-black/50 flex w-full items-center fixed h-[100vh] duration-300 transition-all ease-in-out"
          style={{
            display:isDialogOpen?"flex":"none",
            zIndex:50
          }}
        >
          <Dialog 
            show={isDialogOpen}
            onClose={()=>setIsDialogOpen(false)}
            className="dialog-paypal w-[40%] mx-auto rounded-md"
            >
            <div 
              className="w-full p-10 flex flex-col gap-3"
              style={{
                fontFamily:mFamily,
                fontSize:mSize,
                color:mColor,
                fontWeight:mWeight,
                ...selectorPaddingMargin("padding",mPaddingSelect,mPaddingText),
                ...selectorPaddingMargin("margin",mMarginSelect,mMarginText),
              }}
            >
          
              <img className="mb-4 h-[80px] w-fit" src="https://cdn.freebiesupply.com/logos/large/2x/paypal-logo-png-transparent.png" alt="Paypal Credit logo" height="80"/>
              <h6 
                className="fluid-h6 light"
                style={{
                  fontSize:mTSize,
                  color:mTColor,
                  fontWeight:mTWeight,
                }}
              >
                Paga en 3 plazos sin intereses
              </h6>
              <p>Disponible para compras de 30 € a 2.000 €. Sin comisiones de apertura ni por pago atrasado.</p>
              <ol className="ml-5">
                  <li>1. Selecciona PayPal en el proceso de pago para pagar más tarde Paga en 3 plazos.</li>
                  <li>2. Completa la compra y realiza hoy el primer pago.</li>
                  <li>3. Los pagos restantes se realizarán de foma automática. ¡Así de fácil!</li>
              </ol>
              <p>Disponible para compras de entre 30 € y 2.000 €. Debes residir en España y tener una cuenta de PayPal. Ejemplo representativo: TAE 0%. TIN 0%.</p>
            </div>
          </Dialog>
        </div>
      </>
    );
  }
  return(
    <div className="hidden lg:block p-4 lg:p-8 border-b border-t border-l-0 border-r-0 border-solid st-colour-border-medium-grey e2e-section-order-info">
        <div className="flex mt-2">
          <div className="flex-none"></div>
          <div className="flex-1">
            <div className="font-bold st-label-lg st-colour-text-primary">
              <div className="h-2.5 bg-stone-300 rounded-full w-40 animate-pulse"></div>
            </div>
            <div className="font-bold st-label-normal st-colour-text-tertiary">
              <div className="h-2.5 bg-stone-300 mt-5 rounded-full w-15 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="grid-cols-8 st-colour-text-tertiary mt-4 hidden lg:grid gap-x-8">
          <div className="col-span-3 flex st-label-sm">
            Precio indirecto
            <p

              className="st-colour-text-tertiary font-bold ps-1 capitalize"
              data-state="closed"
            >
              (¿por qué?)
            </p>
          </div>
          <div className="col-span-5 st-label-sm ml-2.5 lg:ml-0">
            <div className="h-2.5 bg-stone-300 rounded-full w-10 animate-pulse"></div> 
          </div>
          <div className="col-span-3 st-label-sm mt-2">Precio de venta</div>
          <div className="col-span-5 font-bold ml-2.5 lg:ml-0 mt-2">
            <div className="flex items-center gap-1 st-label-lg mb-3">
              <div className="st-colour-text-emphasis st-label-lg font-bold">
              <div className="h-2.5 bg-stone-300 rounded-full w-10 animate-pulse"></div> 
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
export default PriceSection;

export const schema = createSchema({
  type:"price-section",
  title:"Price Section",
  settings:[
    {
      group:"title",
      inputs:[
        
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'tPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'tPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'tMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'tMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'tWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'600',
        },
      ]
    },
    {
      group:"variant selected",
      inputs:[  
        {
          type:'color',
          label:'color',
          name:'vColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'vSize',
          defaultValue:'16px',
        },
        {
          type:'text',
          label:'font family',
          name:'vFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'vPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'vPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'vMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'vMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'vWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'400',
        },

      ]
    },
    {
      group:"indirect price",
      inputs:[  
        {
          type:'switch',
          label:'show indirect price',
          name:'iShow',
          defaultValue:true,
        },
        {
          type:'color',
          label:'color',
          name:'iColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'iSize',
          defaultValue:'14px',
        },
        {
          type:'text',
          label:'font family',
          name:'iFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'iPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'iPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'iMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'iMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'iWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'tooltip'
        },
        {
          type:'text',
          label:'texto de tooltip',
          name:'toolText',
          defaultValue:'Como somos una marca que vende directamente a los clientes, podrás ahorrar mucho porque estarás evitando los costos de intermediarios.',
        },
        {
          type:'color',
          label:'color',
          name:'toolBgColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'color',
          label:'color',
          name:'toolColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'font size',
          name:'toolSize',
          defaultValue:'14px',
        },
        {
          type:'text',
          label:'font family',
          name:'toolFamily',
          defaultValue:'Monserrat',
        },
      ]
    },
    {
      group:"price",
      inputs:[  
        {
          type:'color',
          label:'color text',
          name:'pTColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color compare price',
          name:'pCColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color Price',
          name:'pColor',
          defaultValue:'#A72A2F',
        },
        {
          type:'text',
          label:'font size text',
          name:'pTSize',
          defaultValue:'14px',
        },
        {
          type:'text',
          label:'font size compare price',
          name:'pCSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font size price',
          name:'pSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'pFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'pPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'pPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'pMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'pMarginText',
        },

      ]
    },
    {
      group:"paypal",
      inputs:[  
        {
          type:'color',
          label:'color',
          name:'payColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'paySize',
          defaultValue:'14px',
        },
        {
          type:'text',
          label:'font family',
          name:'payFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'payPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'payPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'payMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'payMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'payWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'400',
        },

      ]
    },
    {
      group:"paypal modal",
      inputs:[  
        {
          type:'text',
          label:'font family',
          name:'mFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'mPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'mPaddingText',
          defaultValue:"40px"
        },
        {
          type:'select',
          label:'Margin type',
          name:'mMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'mMarginText',
        },
        {
          type:'color',
          label:'color Title',
          name:'mTColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color Content',
          name:'mColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size Title',
          name:'mTSize',
          defaultValue:'24px',
        },
        {
          type:'text',
          label:'font size Content',
          name:'mSize',
          defaultValue:'14px',
        },
        {
          type:'select',
          label:'Font weight Title',
          name:'mTWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'400',
        },
        {
          type:'select',
          label:'Font weight Content',
          name:'mWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'400',
        },

      ]
    },
  ]
})
