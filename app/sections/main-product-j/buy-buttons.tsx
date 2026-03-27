import { CartForm, ShopPayButton } from "@shopify/hydrogen";
import type { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { createSchema } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, type FetcherWithComponents } from "react-router";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { Section } from "~/components/section";
import { useCrossell } from "~/stores/crosssellStore";
import { useCurrentProduct } from "~/stores/currentProduct";
import type {loader as productRouteLoader } from "~/routes/products/product"
import { checkPrice } from "~/utils/product";
import { selectorPaddingMargin } from "~/utils/general";

interface BuyButtonsProductJProps {
  showCart:boolean;
  showBuy:boolean;
  // container
  containerBg: string;
  containerBorder: string;
  containerPaddingSelect: string;
  containerPaddingText: string;
  // add to cart
  acColor: string;
  acBgColor: string;
  acBgHoverColor: string;
  acDisabledBg: string;
  acPColor:string
  acSize: string;
  acLetter: number;
  acFamily: string;
  acWeight: string;
  acPaddingSelect: string;
  acPaddingText: string;
  acMarginSelect: string;
  acMarginText: string;
  // buy now
  bnColor: string;
  bnHoverColor: string;
  bnBorderColor: string;
  bnBorderHoverColor: string;
  bnBgColor: string;
  bnBgHoverColor: string;
  bnPColor: string;
  bnSize: string;
  bnLetter: number;
  bnFamily: string;
  bnWeight: string;
  bnPaddingSelect: string;
  bnPaddingText: string;
  bnMarginSelect: string;
  bnMarginText: string;
  // reserve
  resColor: string;
  resBgColor: string;
  resHBgColor: string;
  resBorderColor: string;
  resPColor:string
  resSize: string;
  resLetter: number;
  resFamily: string;
  resWeight: string;
  resPaddingSelect: string;
  resPaddingText: string;
  resMarginSelect: string;
  resMarginText: string;
  // mini concierge
  mcColor: string;
  mcSize: string;
  mcLetter: number;
  mcUpper: boolean;
  mcFamily: string;
  mcMarginSelect: string;
  mcMarginText: string;
  mcLabel1: string;
  mcLabel2: string;
  mcLabel3: string;
}
type variantIdsAndQuantities={
  id: string;
  quantity: number;
  attributes?:Array<{key:string,value:string}>
};


export default function BuyButtonsProductJ (props:BuyButtonsProductJProps){
  const {
  showCart,
  showBuy,
  containerBg,
  containerBorder,
  containerPaddingSelect,
  containerPaddingText,
  acColor,
  acBgColor,
  acBgHoverColor,
  acDisabledBg,
  acPColor,
  acSize,
  acLetter,
  acFamily,
  acWeight,
  acPaddingSelect,
  acPaddingText,
  acMarginSelect,
  acMarginText,
  bnColor,
  bnHoverColor,
  bnBorderColor,
  bnBorderHoverColor,
  bnBgColor,
  bnBgHoverColor,
  bnPColor,
  bnSize,
  bnLetter,
  bnFamily,
  bnWeight,
  bnPaddingSelect,
  bnPaddingText,
  bnMarginSelect,
  bnMarginText,
  resColor,
  resBgColor,
  resHBgColor,
  resBorderColor,
  resPColor,
  resSize,
  resLetter,
  resFamily,
  resWeight,
  resPaddingSelect,
  resPaddingText,
  resMarginSelect,
  resMarginText,
  mcColor,
  mcSize,
  mcLetter,
  mcUpper,
  mcFamily,
  mcMarginSelect,
  mcMarginText,
  mcLabel1,
  mcLabel2,
  mcLabel3,
  ...rest}=props
  const { product ,storeDomain } = useLoaderData<typeof productRouteLoader>();

  const currentProd = useCurrentProduct((state) => state.currentProduct);
  const crossell = useCrossell((state) => state.crossellObjects);
  // const [productTitle,setProductTitle] = useState(product.title) 
  const [totalPrice,setTotalPrice] = useState(0)
  const [comparePrice,setComparePrice]=useState(0)
  const [idsVariants,setIdsVariants]=useState<variantIdsAndQuantities[]>([])
  const [cartIdsVariants,setCartIdsVariants]=useState<CartLineInput[]>([])
  const [hoverBuy,setHoverBuy]=useState(false);
  const [hoverAddCart,setHoverAddCart]=useState(false);
  const buyButton = useRef(null)
  const container = useRef(null)
  const [size,setSize]=useState(0)

  useEffect(() => {
      let newTotal=0;
      let newCompare=0
      const newIds:variantIdsAndQuantities[]=[]
      const newCartIds:CartLineInput[]=[]
  
      if(currentProd){
  
        let variant = currentProd.selectedVariant
        
        newTotal += parseFloat(currentProd.selectedVariant.price.amount)
        if(variant.availableForSale && variant.quantityAvailable<=0){
          newIds.push({
            id:currentProd.selectedVariant.id,
            quantity:1,
            attributes:[{key:"Tipo",value:"Reserva"}]
          })
          newCartIds.push({
            merchandiseId:currentProd.selectedVariant.id,
            quantity:1,
            attributes:[{key:"Tipo",value:"Reserva"}]
          })
          
        }else{
          newIds.push({
            id:currentProd.selectedVariant.id,
            quantity:1
          })
          newCartIds.push({
            merchandiseId:currentProd.selectedVariant.id,
            quantity:1
          })
        }
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
    }, [crossell,currentProd]);
  
  useEffect(()=>{
    if(container.current){
      let parent = container.current.parentElement
      if(parent){
        parent.hasAttribute("class") && parent.removeAttribute("class")

      }

      let sizeElm= container.current.getBoundingClientRect()
      setSize(sizeElm.height)

    }  
  },[container.current])

  const buyProducts=()=>{
    if(buyButton.current){
      const shopPayComponent = buyButton.current.querySelector("shop-pay-button ")
      if(shopPayComponent && shopPayComponent.shadowRoot){
        const baseButton =shopPayComponent.shadowRoot.querySelector("shop-pay-button-base")
        if(baseButton && baseButton.shadowRoot){
          const link = baseButton.shadowRoot.querySelector("#shop-pay-button-link")
          if(link){
            link.click()
          }
        }
      }
    }
  }
  
  return(
    <Section {...rest} 
      className="md:sticky bottom-0 w-full overflow-visible"
      style={{
        height:`${size}px`
      }}
      >
     
          <div 
            ref={container}
            className="container-buttons absolute bottom-0 flex flex-col gap-4"
            style={{
              width:"calc(100% + 8rem)",
              left:"-4rem",
              borderTop:"1px solid #ffffff20",
              paddingBlock:"2rem",
              background:"#050505"
            }}
            >
    
             {currentProd?.selectedVariant?.quantityAvailable <=0 && currentProd?.selectedVariant?.availableForSale ? 
                <></>
              :
              showCart ? 
                <AddToCartButton
                  disabled={!currentProd?.selectedVariant?.availableForSale}
                  onMouseLeave={()=>setHoverAddCart(false)}
                  onMouseOver={()=>setHoverAddCart((state)=>state==false && true)}
                  lines={cartIdsVariants}
                  className="flex gap-2 items-center justify-center text-center p-5 uppercase text-cta-small font-bold w-full border-none e2e-button-confirm-selection cursor-pointer"
                  style={{
                    color:acColor,
                    backgroundColor:!hoverAddCart ? acBgColor:acBgHoverColor,
                    fontSize:acSize,
                    fontFamily:acFamily,
                    fontWeight:acWeight,
                    letterSpacing: `${acLetter}px`,
                    ...selectorPaddingMargin("padding",acPaddingSelect,acPaddingText),
                    ...selectorPaddingMargin("margin",acMarginSelect,acMarginText),
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
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.75442 11.1547C4.87725 10.7363 5.03455 10.2087 5.17028 9.7797L6.12371 10.0813C5.99121 10.5002 5.83627 11.0197 5.71392 11.4364C5.70511 11.4664 5.69648 11.4959 5.68803 11.5247H13.7531C14.0292 11.5247 14.2531 11.7486 14.2531 12.0247C14.2531 12.3009 14.0292 12.5247 13.7531 12.5247H5.02252C4.86562 12.5247 4.71781 12.4511 4.62333 12.3258C4.52885 12.2006 4.49865 12.0382 4.54177 11.8873L4.55779 11.8315L4.60202 11.678C4.63977 11.5473 4.69288 11.3644 4.75442 11.1547Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M13.4411 9.93048H5.64652L4.22479 4.00662H15L13.4411 9.93048Z"
                          fill="currentColor"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.38163 2.63593H0.969788V1.63593H3.77583C4.00702 1.63593 4.20807 1.79443 4.26202 2.01924L4.61899 3.50662H15C15.155 3.50662 15.3013 3.57855 15.396 3.70135C15.4907 3.82415 15.523 3.98392 15.4835 4.13387L13.9246 10.0577C13.8668 10.2774 13.6682 10.4305 13.4411 10.4305H5.64652C5.41533 10.4305 5.21428 10.272 5.16033 10.0472L3.38163 2.63593ZM4.85899 4.50662L6.04072 9.43048H13.0556L14.3514 4.50662H4.85899Z"
                          fill="currentColor"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
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
                    {currentProd?.selectedVariant?.availableForSale ? <>Añadir al carrito <span className={`border-l border-l-[${acPColor}] pl-1 font-bold`} style={{color:acColor}}>{totalPrice} €</span> </>:"Agotado"}
                  </div>
                </AddToCartButton>:<></>
             }
    
            { showBuy && 
              idsVariants.length > 0 && 
              currentProd?.selectedVariant?.availableForSale &&          
                <>
                  {currentProd?.selectedVariant?.quantityAvailable <= 0 ? 
                    <div className="relative w-full">
                      <CartForm
                        route="/cart"
                        action={CartForm.ACTIONS.LinesAdd}
                        inputs={{
                          lines:cartIdsVariants,
                        }}
                      >
                        {(fetcher:FetcherWithComponents<any>)=>(
                          <>
                      
                            <input type="hidden" name="buyNow" value="true" />
                            <button
                              type="submit"
                              disabled={fetcher.state !== 'idle'}
                              onMouseLeave={() => setHoverBuy(false)}
                              onMouseOver={() => setHoverBuy((state) => state == false && true)}
                              className="w-full py-5 px-2 border-solid border-2 uppercase border-[#3790b0] text-[16px] text-[#3790b0] hover:border-[#000] hover:text-[#000] font-bold z-10 gap-2"
                              style={{
                                color: resColor,
                                borderColor: !hoverBuy ? resBgColor : resHBgColor,
                                background: !hoverBuy ? resBgColor : resHBgColor,
                                fontSize: resSize,
                                letterSpacing: `${resLetter}px`,
                                fontFamily: resFamily,
                                fontWeight: resWeight,
                                ...selectorPaddingMargin("padding", resPaddingSelect, resPaddingText),
                                ...selectorPaddingMargin("margin", resMarginSelect, resMarginText),
                              }}
                            >
                              {fetcher.state !== 'idle' ? 'Cargando...' : (<> Reservar <span className={`border-l border-l-[${resPColor}] pl-1 font-bold`} style={{color:resPColor}}>{totalPrice} €</span> </> )}
                            </button>
                          </>
                        )}
                      </CartForm>
                    </div>
                  :
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
                        className="w-full py-5 px-2 border-solid border-2 uppercase border-[#3790b0] text-[16px] text-[#3790b0] hover:border-[#000] hover:text-[#000] font-bold z-10 gap-2"
                        onClick={buyProducts}
                        style={{
                          color:!hoverBuy ? bnColor : bnHoverColor,
                          borderColor:!hoverBuy ? bnColor : bnHoverColor,
                          background:!hoverBuy ?   bnBgColor : bnBgHoverColor,
                          fontSize:bnSize,
                          letterSpacing: `${bnLetter}px`,
                          fontFamily:bnFamily,
                          fontWeight:bnWeight,
                          ...selectorPaddingMargin("padding",bnPaddingSelect,bnPaddingText),
                          ...selectorPaddingMargin("margin",bnMarginSelect,bnMarginText),
                        }}
                      > 
                        Añadir al setup <span  className={`border-l border-l-[${bnPColor}] pl-1 font-bold`} style={{color:bnPColor}}>{totalPrice} €</span> 
                      </button>
                    </div>
                  }
    
                </>
              
            }
            <div
              className="mini-concierge flex justify-center gap-[2rem]"
              style={{
                color: mcColor,
                fontSize: mcSize,
                textTransform: mcUpper ? "uppercase" : "unset",
                letterSpacing: `${mcLetter}px`,
                fontFamily: mcFamily,
                ...selectorPaddingMargin("margin", mcMarginSelect, mcMarginText),
              }}
              >
                <span>{mcLabel1}</span>
                <span>{mcLabel2}</span>
                <span>{mcLabel3}</span>
            </div>
          </div>
          
        </Section>
  )
}
export const schema = createSchema({
  type: "buy-buttons-productJ",
  title: "Buy buttons",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type:'switch',
          label:'show add cart',
          name:'showCart',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show buy button',
          name:'showBuy',
          defaultValue:true,
        },
        {
          type: "heading",
          label: "container",
        },
        {
          type: "color",
          label: "Background color",
          name: "containerBg",
          defaultValue: "#050505",
        },
        {
          type: "color",
          label: "Border color",
          name: "containerBorder",
          defaultValue: "#ffffff20",
        },
        {
          type: "select",
          label: "Padding type",
          name: "containerPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "y",
        },
        {
          type: "text",
          label: "Padding value",
          name: "containerPaddingText",
          defaultValue: "1.2rem",
        },
      ],
    },
    {
      group: "Add to cart button",
      inputs: [
        {
          type: "color",
          label: "Text color",
          name: "acColor",
          defaultValue: "#000",
        },
        {
          type: "color",
          label: "Background color",
          name: "acBgColor",
          defaultValue: "#FFF",
        },
        {
          type: "color",
          label: "Background hover color",
          name: "acBgHoverColor",
          defaultValue: "#E4E4E7",
        },
        {
          type: "color",
          label: "Disabled background",
          name: "acDisabledBg",
          defaultValue: "#78716c",
        },
        {
          type:'color',
          label:'price color',
          name:'acPColor',
          defaultValue:'#52525B',
        },
        {
          type: "text",
          label: "Font size",
          name: "acSize",
          defaultValue: "0.85rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "acLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "text",
          label: "Font family",
          name: "acFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "acWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "700",
        },
        {
          type: "select",
          label: "Padding type",
          name: "acPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "acPaddingText",
          defaultValue: "1.2rem 1rem",
        },
        {
          type: "select",
          label: "Margin type",
          name: "acMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin value",
          name: "acMarginText",
        },
      ],
    },
    {
      group: "Buy now button",
      inputs: [
        {
          type: "color",
          label: "Text color",
          name: "bnColor",
          defaultValue: "#000",
        },
        {
          type: "color",
          label: "Text hover color",
          name: "bnHoverColor",
          defaultValue: "#000",
        },
        {
          type: "color",
          label: "Border color",
          name: "bnBorderColor",
          defaultValue: "#FFFF",
        },
        {
          type: "color",
          label: "Border hover color",
          name: "bnBorderHoverColor",
          defaultValue: "#E4E4E7",
        },
        {
          type:'color',
          label:'price color',
          name:'bnPColor',
          defaultValue:'#52525B',
        },
        {
          type: "color",
          label: "background color",
          name: "bnBgColor",
          defaultValue: "#FFFF",
        },
        {
          type: "color",
          label: "background hover color",
          name: "bnBgHoverColor",
          defaultValue: "#E4E4E7",
        },
        {
          type:'color',
          label:'price color',
          name:'bnPColor',
          defaultValue:'#52525B',
        },
        {
          type: "text",
          label: "Font size",
          name: "bnSize",
          defaultValue: "0.85rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "bnLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "text",
          label: "Font family",
          name: "bnFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "bnWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        {
          type: "select",
          label: "Padding type",
          name: "bnPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "bnPaddingText",
          defaultValue: "1.2rem 0.5rem",
        },
        {
          type: "select",
          label: "Margin type",
          name: "bnMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin value",
          name: "bnMarginText",
        },
      ],
    },
    {
      group: "Reserve button",
      inputs: [
        {
          type: "color",
          label: "Text color",
          name: "resColor",
          defaultValue: "#fff",
        },
        {
          type: "color",
          label: "Background color",
          name: "resBgColor",
          defaultValue: "#f59e0b",
        },
        {
          type: "color",
          label: "Background hover color",
          name: "resHBgColor",
          defaultValue: "#fd7e14",
        },
        {
          type: "color",
          label: "Border color",
          name: "resBorderColor",
          defaultValue: "transparent",
        },
        {
          type:'color',
          label:'price color',
          name:'resPColor',
          defaultValue:'#FFFFFF',
        },
        {
          type: "text",
          label: "Font size",
          name: "resSize",
          defaultValue: "0.85rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "resLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "text",
          label: "Font family",
          name: "resFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "resWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        {
          type: "select",
          label: "Padding type",
          name: "resPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "resPaddingText",
          defaultValue: "1.2rem 0.5rem",
        },
        {
          type: "select",
          label: "Margin type",
          name: "resMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin value",
          name: "resMarginText",
        },
      ],
    },
    {
      group: "Mini concierge",
      inputs: [
        {
          type: "color",
          label: "Text color",
          name: "mcColor",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          label: "Font size",
          name: "mcSize",
          defaultValue: "0.65rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "mcLetter",
          defaultValue: 1,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "mcUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "mcFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Margin type",
          name: "mcMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "t",
        },
        {
          type: "text",
          label: "Margin value",
          name: "mcMarginText",
        },
        {
          type: "text",
          label: "Label 1",
          name: "mcLabel1",
          defaultValue: "Envío DDP",
        },
        {
          type: "text",
          label: "Label 2",
          name: "mcLabel2",
          defaultValue: "30 Días Prueba",
        },
        {
          type: "text",
          label: "Label 3",
          name: "mcLabel3",
          defaultValue: "Pago Seguro",
        },
      ],
    },
  ],
});