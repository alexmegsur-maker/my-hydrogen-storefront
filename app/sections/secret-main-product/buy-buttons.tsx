import { ShopPayButton } from "@shopify/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import type { loader as productRouteLoader } from "~/routes/products/product";
import { useCrossell } from "~/stores/crosssellStore";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";

interface BuyButtonsProps{
showResume:string;
showBuyNow:string;
showPayOptions:string;
tColor:string;
tSize:string;
tFamily:string;
tPaddingSelect:string;
tPaddingText:string;
tMarginSelect:string;
tMarginText:string;
tWeight:string;
cColor:string;
cSize:string;
cFamily:string;
cPaddingSelect:string;
cPaddingText:string;
cMarginSelect:string;
cMarginText:string;
cWeight:string;
vColor:string;
vSize:string;
vFamily:string;
vPaddingSelect:string;
vPaddingText:string;
vMarginSelect:string;
vMarginText:string;
vWeight:string;
qColor:string;
qSize:string;
qFamily:string;
qPaddingSelect:string;
qPaddingText:string;
qMarginSelect:string;
qMarginText:string;
qWeight:string;
pColor:string;
pSize:string;
pFamily:string;
pPaddingSelect:string;
pPaddingText:string;
pMarginSelect:string;
pMarginText:string;
pWeight:string;
dColor:string;
dSize:string;
dFamily:string;
dWeight:string;
totalTColor:string;
totalTSize:string;
totalTFamily:string;
totalTPaddingSelect:string;
totalTPaddingText:string;
totalTMarginSelect:string;
totalTMarginText:string;
totalTWeight:string;
totalColor:string;
totalSize:string;
totalFamily:string;
totalPaddingSelect:string;
totalPaddingText:string;
totalMarginSelect:string;
totalMarginText:string;
totalWeight:string;
fColor:string;
fLinkColor:string;
fSize:string;
fFamily:string;
fPaddingSelect:string;
fPaddingText:string;
fMarginSelect:string;
fMarginText:string;
fWeight:string;
acColor:string;
acBgColor:string;
acBghoverColor:string;
acSize:string;
acFamily:string;
acPaddingSelect:string;
acPaddingText:string;
acMarginSelect:string;
acMarginText:string;
acWeight:string;
bnColor:string;
bnhoverColor:string;
bnSize:string;
bnFamily:string;
bnPaddingSelect:string;
bnPaddingText:string;
bnMarginSelect:string;
bnMarginText:string;
bnWeight:string; 

}


function BuyButtons(props:BuyButtonsProps) {

  const { product ,storeDomain } = useLoaderData<typeof productRouteLoader>();
  const currentProd = useCurrentProduct((state) => state.currentProduct);
  const crossell = useCrossell((state) => state.crossellObjects);
  const [productTitle,setProductTitle] = useState(product.title) 
  const [totalPrice,setTotalPrice] = useState(0)
  const [comparePrice,setComparePrice]=useState(0)
  const [idsVariants,setIdsVariants]=useState<{id:string,quantity:number}[]>([])
  const [cartIdsVariants,setCartIdsVariants]=useState<{merchandiseId:string,quantity:number}[]>([])
  const [hoverBuy,setHoverBuy]=useState(false);
  const [hoverAddCart,setHoverAddCart]=useState(false);
  const buyButton = useRef(null)
  
  const showDialog=()=>{
    if(typeof document !== "undefined"){
      const dialog= document.querySelector("#paypal-button-popup")as HTMLElement | null
      dialog?.click()
    }
  }

  const buyProducts=()=>{
    if(buyButton.current){
      const shopPayComponent = buyButton.current.querySelector("shop-pay-button ")
      if(shopPayComponent && shopPayComponent.shadowRoot){
        const baseButton =shopPayComponent.shadowRoot.querySelector("shop-pay-button-base")
        if(baseButton && baseButton.shadowRoot){
          const link = baseButton.shadowRoot.querySelector("#shop-pay-button-link")
          if(link){
            console.log("Botón encontrado, haciendo clic...")
            link.click()
          }else{
            console.log("No se encontró el link dentro del segundo shadowRoot")
          }
        }
      }
    }
  }

  useEffect(()=>{
    if(typeof document !== "undefined"){
      const titleElement = document.getElementById("product-title")
      
      if(titleElement?.dataset.title){
        setProductTitle(titleElement.dataset.title)
      }
    }
  
  },[])

  useEffect(() => {
    let newTotal=0;
    let newCompare=0
    const newIds:{id:string,quantity:number}[]=[]
    const newCartIds:{merchandiseId:string,quantity:number}[]=[]

    if(currentProd){
      newTotal += parseFloat(currentProd.selectedVariant.price.amount)
      newIds.push({
        id:currentProd.selectedVariant.id,
        quantity:1
      })
      newCartIds.push({
        merchandiseId:currentProd.selectedVariant.id,
        quantity:1
      })
    }

    if(crossell?.crossell){
      let filter = crossell.crossell.filter((elm)=>elm.selecteds.length != 0)
      filter.forEach((elm)=>{
        elm.selecteds.forEach((e)=>{
          let findProd =elm.products.find((prod)=>prod.id == e.id)
          if(findProd){
            newTotal += parseFloat(findProd.price)*e.quantity
            if(findProd.comparePrice){
              newCompare += parseFloat(findProd.comparePrice)*e.quantity
            }
        
            newIds.push({
              id:findProd.variantId,
              quantity:e.quantity
            })
        
            newCartIds.push({
              merchandiseId:findProd.variantId,
              quantity:1
            })
          }
        })
      })
    }
    setTotalPrice( newTotal)
    setComparePrice(newCompare)
    setIdsVariants(newIds)
    setCartIdsVariants(newCartIds)
      console.log("currentprod",currentProd)
  }, [crossell,currentProd]);

  return (
    <>
      {props.showResume &&
        <div className="st-colour-surface-lightest-grey e2e-section-order-summary  border-solid border-0 border-b st-colour-border-medium-grey">
          <div>
            <div className="px-4 lg:px-8 pt-4 lg:pt-8">
              <div className="grid grid-cols-9 st-label-normal st-colour-text-primary mb-4">
                <div className="col-span-9 mb-3">
                  <div 
                    style={{
                      color:props.tColor,
                      fontSize:props.tSize,
                      fontFamily:props.tFamily,
                      fontWeight:props.tWeight,
                      ...selectorPaddingMargin("padding",props.tPaddingSelect,props.tPaddingText),
                      ...selectorPaddingMargin("margin",props.tMarginSelect,props.tMarginText),
                    }}
                    >
                  {productTitle}
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="font-bold st-label-normal">
                    <div
                      style={{
                        color:props.vColor,
                        fontSize:props.vSize,
                        fontFamily:props.vFamily,
                        fontWeight:props.vWeight,
                        ...selectorPaddingMargin("padding",props.vPaddingSelect,props.vPaddingText),
                        ...selectorPaddingMargin("margin",props.vMarginSelect,props.vMarginText),
                      }}
                    >
                      <span>{currentProd?.nombre}</span> {currentProd?.variants.nodes.length > 1 && currentProd.selectedVariant.selectedOptions.map((element)=>{
                        if(currentProd.nombre){
                          return ` - ${element.value}`
                        }
                        return `${element.value}`
                      })}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="flex gap-1 flex-wrap e2e-section-status">
                        {currentProd?.selectedVariant.compareAtPrice?.amount &&(
                          <span className="uppercase flex gap-1 items-center justify-center w-fit   text-white bg-red-400 text-[12px] p-[2px] px-1  ">
                            Oferta
                          </span>
                        )}

                        {currentProd?.tags && currentProd.tags.map((el,index)=>{
                          return(
                            <span key={index} className="uppercase flex gap-1 items-center justify-center w-fit   text-white bg-black text-[12px] p-[2px] px-1  ">
                              {el}
                            </span>

                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="font-normal body-sm"></div>
                </div>
                <div 
                  style={{
                    color:props.qColor,
                    fontSize:props.qSize,
                    fontFamily:props.qFamily,
                    fontWeight:props.qWeight,
                    ...selectorPaddingMargin("padding",props.qPaddingSelect,props.qPaddingText),
                    ...selectorPaddingMargin("margin",props.qMarginSelect,props.qMarginText),
                  }}
                >
                  x1
                </div>
                <div 
                  className="col-span-2 text-right flex justify-end gap-1 flex-wrap"
                  style={{
                    color:props.pColor,
                    fontSize:props.pSize,
                    fontFamily:props.pFamily,
                    fontWeight:props.pWeight,
                    ...selectorPaddingMargin("padding",props.pPaddingSelect,props.pPaddingText),
                    ...selectorPaddingMargin("margin",props.pMarginSelect,props.pMarginText),
                  }}
                  >
                  <div>{currentProd?.selectedVariant.compareAtPrice?.amount ? currentProd?.selectedVariant.compareAtPrice?.amount  : currentProd?.selectedVariant.price.amount} €</div>
                </div>
              </div>
              {currentProd?.selectedVariant.compareAtPrice?.amount && (
                <div 
                  className="grid grid-cols-9 body-normal st-colour-text-emphasis font-bold -mt-4"
                  style={{
                    color:props.dColor,
                    fontSize:props.dSize,
                    fontFamily:props.dFamily,
                    fontWeight:props.dWeight,
                  }}
                >
                  <div className="col-span-6">Descuento</div>
                  <div className="text-right"></div>
                  <div className="col-span-2 text-right flex justify-end gap-1">
                    <div>-{parseFloat(currentProd.selectedVariant.compareAtPrice.amount) - parseFloat(currentProd.selectedVariant.price.amount)} €</div>
                  </div>
                </div>
              )}
              <hr className="my-4" />
            </div>
          </div>
          { crossell?.crossell.map((elm)=>{
            if(elm.selecteds.length>0){
              return(
                <div>
                  <div className="px-4 lg:px-8">
                    <div 
                      className="uppercase"
                      style={{
                        color:props.cColor,
                        fontSize:props.cSize,
                        fontFamily:props.cFamily,
                        fontWeight:props.cWeight,
                        ...selectorPaddingMargin("padding",props.cPaddingSelect,props.cPaddingText),
                        ...selectorPaddingMargin("margin",props.cMarginSelect,props.cMarginText),
                      }}
                      >
                      {elm.title}
                    </div>
                    {elm.selecteds.map((select)=>{
                      const producto = elm.products.find(e=>e.id == select.id)
                      return (
                        <div className="grid grid-cols-9 st-label-normal st-colour-text-primary mb-4">
                          <div className="col-span-6">
                            <div 
                              style={{
                                color:props.vColor,
                                fontSize:props.vSize,
                                fontFamily:props.vFamily,
                                fontWeight:props.vWeight,
                              }}
                            >
                              <div>{producto.title}</div>
                            </div>
                          </div>
                          <div 
                            className="text-right"
                              style={{
                                color:props.qColor,
                                fontSize:props.qSize,
                                fontFamily:props.qFamily,
                                fontWeight:props.qWeight,
                                ...selectorPaddingMargin("padding",props.qPaddingSelect,props.qPaddingText),
                                ...selectorPaddingMargin("margin",props.qMarginSelect,props.qMarginText),
                              }}
                              
                            >
                            x{select.quantity}
                          </div>
                          <div 
                            className="col-span-2 text-right flex justify-end gap-1 flex-wrap"
                            style={{
                              color:props.pColor,
                              fontSize:props.pSize,
                              fontFamily:props.pFamily,
                              fontWeight:props.pWeight,
                              ...selectorPaddingMargin("padding",props.pPaddingSelect,props.pPaddingText),
                              ...selectorPaddingMargin("margin",props.pMarginSelect,props.pMarginText),
                            }}
                      
                          >
                            {producto.comparePrice && 
                              <div className="line-through text-gray-400">{producto.comparePrice} €</div>
                            }
                            <div>{producto.price} €</div>
                          </div>
                        </div>
                      )
                    })}
                    <hr className="my-4" />
                  </div>
                </div>
              )
            }
          })}

          <div className="px-4 lg:px-8 pb-4 lg:pb-8">
            <div className="grid grid-cols-9 body-normal items-center">
              <div className="col-span-7 text-right"></div>
              {comparePrice != 0 && 
                <div className="col-span-2 text-right st-colour-text-tertiary st-label-lg">
                  <div className="line-through">{totalPrice - comparePrice} €</div>
                </div>
              }
              <div 
                className="col-span-7 text-right"
                style={{
                  color:props.totalTColor,
                  fontSize:props.totalTSize,
                  fontFamily:props.totalTFamily,
                  fontWeight:props.totalTWeight,
                  ...selectorPaddingMargin("padding",props.totalTPaddingSelect,props.totalTPaddingText),
                  ...selectorPaddingMargin("margin",props.totalTMarginSelect,props.totalTMarginText),
                }}
              >
                Precio de venta
              </div>
              <div className="col-span-2 text-right flex justify-end gap-1">
                <div className="st-label-lg font-bold"
                  style={{
                    color:props.totalColor,
                    fontSize:props.totalSize,
                    fontFamily:props.totalFamily,
                    fontWeight:props.totalWeight,
                    ...selectorPaddingMargin("padding",props.totalPaddingSelect,props.totalPaddingText),
                    ...selectorPaddingMargin("margin",props.totalMarginSelect,props.totalMarginText),
                  }}
                >
                  {totalPrice} €
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {props.showPayOptions && 
        <div className="st-body-xs font-normal e2e-section-finance st-colour-text-primary px-4 lg:px-8 py-3 lg:py-4">
          <div
            className="financing"
            style={{
              color:props.fColor,
              fontSize:props.fSize,
              fontFamily:props.fFamily,
              fontWeight:props.fWeight,
              ...selectorPaddingMargin("padding",props.fPaddingSelect,props.fPaddingText),
              ...selectorPaddingMargin("margin",props.fMarginSelect,props.fMarginText),
            }}
          >
            Opciones de financiación disponibles.
            <button
              onClick={showDialog}
              className="hover:underline focus:underline"
              style={{
                color:props.fLinkColor,
              }}
            >
              Saber más
            </button>
          </div>
        </div>
       }
      <AddToCartButton
        disabled={!currentProd?.selectedVariant?.availableForSale}
        onMouseLeave={()=>setHoverAddCart(false)}
        onMouseOver={()=>setHoverAddCart((state)=>state==false && true)}
        lines={cartIdsVariants}
        className="flex gap-2 items-center justify-center text-center p-5 uppercase text-white text-cta-small font-bold w-full border-none e2e-button-confirm-selection cursor-pointer bg-[#3790b0]  text-[white] disabled:bg-stone-500 "
        style={{
          color:props.acColor,
          backgroundColor:!hoverAddCart ? props.acBgColor:props.acBghoverColor,
          fontSize:props.acSize,
          fontFamily:props.acFamily,
          fontWeight:props.acWeight,
          ...selectorPaddingMargin("padding",props.acPaddingSelect,props.acPaddingText),
          ...selectorPaddingMargin("margin",props.acMarginSelect,props.acMarginText),
        }}
      >
        <div
          data-context="pdp-addtocart"
          className="w-full flex gap-2 items-center justify-center text-center [&amp;_*]:pointer-events-none"
        >
          <div className="colour-icons-on-colour">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.75442 11.1547C4.87725 10.7363 5.03455 10.2087 5.17028 9.7797L6.12371 10.0813C5.99121 10.5002 5.83627 11.0197 5.71392 11.4364C5.70511 11.4664 5.69648 11.4959 5.68803 11.5247H13.7531C14.0292 11.5247 14.2531 11.7486 14.2531 12.0247C14.2531 12.3009 14.0292 12.5247 13.7531 12.5247H5.02252C4.86562 12.5247 4.71781 12.4511 4.62333 12.3258C4.52885 12.2006 4.49865 12.0382 4.54177 11.8873L4.55779 11.8315L4.60202 11.678C4.63977 11.5473 4.69288 11.3644 4.75442 11.1547Z"
                fill="currentColor"
              ></path>

              <path
                d="M13.4411 9.93048H5.64652L4.22479 4.00662H15L13.4411 9.93048Z"
                fill="currentColor"
              ></path>

              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.38163 2.63593H0.969788V1.63593H3.77583C4.00702 1.63593 4.20807 1.79443 4.26202 2.01924L4.61899 3.50662H15C15.155 3.50662 15.3013 3.57855 15.396 3.70135C15.4907 3.82415 15.523 3.98392 15.4835 4.13387L13.9246 10.0577C13.8668 10.2774 13.6682 10.4305 13.4411 10.4305H5.64652C5.41533 10.4305 5.21428 10.272 5.16033 10.0472L3.38163 2.63593ZM4.85899 4.50662L6.04072 9.43048H13.0556L14.3514 4.50662H4.85899Z"
                fill="currentColor"
              ></path>

              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.469788 2.13593C0.469788 1.85978 0.693645 1.63593 0.969788 1.63593H3.67853V2.63593H0.969788C0.693645 2.63593 0.469788 2.41207 0.469788 2.13593Z"
                fill="currentColor"
              ></path>

              <path
                d="M11.2589 13.5805C11.2589 14.2682 11.8183 14.8277 12.506 14.8277C13.1936 14.8277 13.7531 14.2682 13.7531 13.5805C13.7531 12.8929 13.1936 12.3334 12.506 12.3334C11.8183 12.3334 11.2589 12.8929 11.2589 13.5805ZM12.506 13.1648C12.7352 13.1648 12.9217 13.3514 12.9217 13.5805C12.9217 13.8097 12.7352 13.9962 12.506 13.9962C12.2768 13.9962 12.0903 13.8097 12.0903 13.5805C12.0903 13.3514 12.2768 13.1648 12.506 13.1648Z"
                fill="currentColor"
              ></path>

              <path
                d="M5.02252 13.5805C5.02252 14.2682 5.582 14.8277 6.26965 14.8277C6.9573 14.8277 7.51678 14.2682 7.51678 13.5805C7.51678 12.8929 6.9573 12.3334 6.26965 12.3334C5.582 12.3334 5.02252 12.8929 5.02252 13.5805ZM6.26965 13.1648C6.49883 13.1648 6.68536 13.3514 6.68536 13.5805C6.68536 13.8097 6.49883 13.9962 6.26965 13.9962C6.04047 13.9962 5.85394 13.8097 5.85394 13.5805C5.85394 13.3514 6.04047 13.1648 6.26965 13.1648Z"
                fill="currentColor"
              ></path>

              <path
                d="M7.03577 13.5903C7.03577 13.9207 6.76794 14.1885 6.43756 14.1885C6.10718 14.1885 5.83936 13.9207 5.83936 13.5903C5.83936 13.2599 6.10718 12.9921 6.43756 12.9921C6.76794 12.9921 7.03577 13.2599 7.03577 13.5903Z"
                fill="currentColor"
              ></path>

              <path
                d="M13.1042 13.5903C13.1042 13.9207 12.8364 14.1885 12.506 14.1885C12.1756 14.1885 11.9078 13.9207 11.9078 13.5903C11.9078 13.2599 12.1756 12.9921 12.506 12.9921C12.8364 12.9921 13.1042 13.2599 13.1042 13.5903Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          {currentProd?.selectedVariant?.availableForSale ? "Añadir al carrito":"Agotado"}
          
        </div>
      </AddToCartButton>
       
      { props.showBuyNow &&
        idsVariants.length > 0 &&
         currentProd?.selectedVariant?.availableForSale &&
          <div ref={buyButton} className="relative">
            <ShopPayButton 
              width="1px"  
              variantIdsAndQuantities={idsVariants} 
              storeDomain={storeDomain}
              className="shopPayButton opacity-0 absolute top-0 z-0 "
            />
            
            <button 
              onMouseLeave={()=>setHoverBuy(false)}
              onMouseOver={()=>setHoverBuy((state)=>state==false && true)}
              className="w-full py-5 px-2 border-solid border-2 uppercase border-[#3790b0] text-[16px] text-[#3790b0] hover:border-[#000] hover:text-[#000] font-bold z-10"
              onClick={buyProducts}
              style={{
                color:!hoverBuy ? props.bnColor : props.bnhoverColor,
                borderColor:!hoverBuy ? props.bnColor : props.bnhoverColor,
                fontSize:props.bnSize,
                fontFamily:props.bnFamily,
                fontWeight:props.bnWeight,
                ...selectorPaddingMargin("padding",props.bnPaddingSelect,props.bnPaddingText),
                ...selectorPaddingMargin("margin",props.bnMarginSelect,props.bnMarginText),
              }}
            > 
              Compra ahora
            </button>
          </div>
      }
          
      
    </>
  );
}
export default BuyButtons;

export const schema = createSchema({
  type: "buy-buttons",
  title: "Buy buttons",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type:'switch',
          label:'show resume product',
          name:'showResume',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show button buy now',
          name:'showBuyNow',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show pay options',
          name:'showPayOptions',
          defaultValue:true,
        },
      ],
    },
    {
      group:"Principal Title",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#2b2b2b',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'20px',
          condition:(data)=>data.showResume ==true

        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showResume ==true
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'tPaddingText',
          condition:(data)=>data.showResume ==true
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'tMarginText',
          condition:(data)=>data.showResume ==true
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
          condition:(data)=>data.showResume ==true
        },

      ]
    },
    {
      group:"Crossell Title",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'cColor',
          defaultValue:'#71717A',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font size',
          name:'cSize',
          defaultValue:'16px',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font family',
          name:'cFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Padding type',
          name:'cPaddingSelect',
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'cPaddingText',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Margin type',
          name:'cMarginSelect',
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
          defaultValue:'b',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'cMarginText',
          defaultValue:'8px',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Font weight',
          name:'cWeight',
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
          condition:(data)=>data.showResume ==true
        },

      ]
    },
    {
      group:"title",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'vColor',
          defaultValue:'#2b2b2b',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font size',
          name:'vSize',
          defaultValue:'16px',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font family',
          name:'vFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showResume ==true
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'vPaddingText',
          condition:(data)=>data.showResume ==true
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'vMarginText',
          condition:(data)=>data.showResume ==true
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
          defaultValue:'600',
          condition:(data)=>data.showResume ==true
        },
      ]
    },
    {
      group:"quantity",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'qColor',
          defaultValue:'#71717A',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font size',
          name:'qSize',
          defaultValue:'18px',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font family',
          name:'qFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Padding type',
          name:'qPaddingSelect',
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'qPaddingText',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Margin type',
          name:'qMarginSelect',
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'qMarginText',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Font weight',
          name:'qWeight',
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
          defaultValue:'500',
          condition:(data)=>data.showResume ==true
        },
      ]
    },
    {
      group:"price",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'pColor',
          defaultValue:'#2b2b2b',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font size',
          name:'pSize',
          defaultValue:'18px',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font family',
          name:'pFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showResume ==true
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'pPaddingText',
          condition:(data)=>data.showResume ==true
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'pMarginText',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Font weight',
          name:'pWeight',
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
          condition:(data)=>data.showResume ==true
        },
      ]
    },
    {
      group:"discount",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'dColor',
          defaultValue:'#A72A2F',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font size',
          name:'dSize',
          defaultValue:'16px',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font family',
          name:'dFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Font weight',
          name:'dWeight',
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
          condition:(data)=>data.showResume ==true
        },
      ]
    },
    {
      group:"totalText",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'totalTColor',
          defaultValue:'#52525B',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font size',
          name:'totalTSize',
          defaultValue:'18px',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font family',
          name:'totalTFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Padding type',
          name:'totalTPaddingSelect',
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'totalTPaddingText',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Margin type',
          name:'totalTMarginSelect',
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'totalTMarginText',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Font weight',
          name:'totalTWeight',
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
          condition:(data)=>data.showResume ==true
        },
      ]
    },
    {
      group:"totalPrice",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'totalColor',
          defaultValue:'#2b2b2b',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font size',
          name:'totalSize',
          defaultValue:'18px',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'font family',
          name:'totalFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Padding type',
          name:'totalPaddingSelect',
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'totalPaddingText',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Margin type',
          name:'totalMarginSelect',
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
          condition:(data)=>data.showResume ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'totalMarginText',
          condition:(data)=>data.showResume ==true
        },
        {
          type:'select',
          label:'Font weight',
          name:'totalWeight',
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
          condition:(data)=>data.showResume ==true
        },
      ]
    },
    {
      group:"financiacion",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'fColor',
          defaultValue:'#18181B',
          condition:(data)=>data.showPayOptions ==true
        },
         {
          type:'color',
          label:'link color',
          name:'fLinkColor',
          defaultValue:'#3790b0',
          condition:(data)=>data.showPayOptions ==true
        },
        {
          type:'text',
          label:'font size',
          name:'fSize',
          defaultValue:'14px',
          condition:(data)=>data.showPayOptions ==true
        },
        {
          type:'text',
          label:'font family',
          name:'fFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showPayOptions ==true
        },
        {
          type:'select',
          label:'Padding type',
          name:'fPaddingSelect',
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
          condition:(data)=>data.showPayOptions ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'fPaddingText',
          condition:(data)=>data.showPayOptions ==true
        },
        {
          type:'select',
          label:'Margin type',
          name:'fMarginSelect',
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
          condition:(data)=>data.showPayOptions ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'fMarginText',
          condition:(data)=>data.showPayOptions ==true
        },
        {
          type:'select',
          label:'Font weight',
          name:'fWeight',
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
          condition:(data)=>data.showPayOptions ==true
        },
      ]
    },
    {
      group:"Add to cart",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'acColor',
          defaultValue:'#fff',
        },
         {
          type:'color',
          label:'background color',
          name:'acBgColor',
          defaultValue:'#3790b0',
        },
         {
          type:'color',
          label:' hover background color',
          name:'acBghoverColor',
          defaultValue:'#276f8a',
        },
        {
          type:'text',
          label:'font size',
          name:'acSize',
          defaultValue:'16px',
        },
        {
          type:'text',
          label:'font family',
          name:'acFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'acPaddingSelect',
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
          name:'acPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'acMarginSelect',
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
          name:'acMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'acWeight',
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
      group:"Buy Now",
      inputs:[
         {
          type:'color',
          label:'color',
          name:'bnColor',
          defaultValue:'#3790b0',
          condition:(data)=>data.showBuyNow ==true
        },
         {
          type:'color',
          label:'hover color',
          name:'bnhoverColor',
          defaultValue:'#2b2b2b',
          condition:(data)=>data.showBuyNow ==true
        },
        {
          type:'text',
          label:'font size',
          name:'bnSize',
          defaultValue:'16px',
          condition:(data)=>data.showBuyNow ==true
        },
        {
          type:'text',
          label:'font family',
          name:'bnFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.showBuyNow ==true
        },
        {
          type:'select',
          label:'Padding type',
          name:'bnPaddingSelect',
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
          defaultValue:'y',
          condition:(data)=>data.showBuyNow ==true
        },
        {
          type:'text',
          label:'Padding text',
          name:'bnPaddingText',
          defaultValue:"20px",
          condition:(data)=>data.showBuyNow ==true
        },
        {
          type:'select',
          label:'Margin type',
          name:'bnMarginSelect',
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
          defaultValue:'t',
          condition:(data)=>data.showBuyNow ==true
        },
        {
          type:'text',
          label:'Margin text',
          name:'bnMarginText',
          defaultValue:'10px',
          condition:(data)=>data.showBuyNow ==true
        },
        {
          type:'select',
          label:'Font weight',
          name:'bnWeight',
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
          condition:(data)=>data.showBuyNow ==true
        },
      ]
    },
  ],
});
