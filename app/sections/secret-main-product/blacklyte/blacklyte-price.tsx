import { createSchema } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import Dialog from "~/components/dialog";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import { checkPrice } from "~/utils/product";

interface PriceBlacklyte{
  showPaypal:boolean;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  pColor:string;
  pCColor:string;
  pSize:string;
  pCSize:string;
  pFamily:string;
  pPaddingSelect:string;
  pPaddingText:string;
  pMarginSelect:string;
  pMarginText:string;
  pWeight:string;
  payColor:string;
  paySize:string;
  payFamily:string;
  payPaddingSelect:string;
  payPaddingText:string;
  payMarginSelect:string;
  payMarginText:string;
  payWeight:string;
}

function BlacklytePrice(props:PriceBlacklyte) {

  const {
    showPaypal,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    pColor,
    pCColor,
    pSize,
    pCSize,
    pFamily,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    pWeight,
    payColor,
    paySize,
    payFamily,
    payPaddingSelect,
    payPaddingText,
    payMarginSelect,
    payMarginText,
    payWeight,
  }=props
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialog = useRef(null);
  const producto = useCurrentProduct((state) => state.currentProduct);

  if (producto) {
    return (
      <>
        <div
          className="block"
          style={{
            ...selectorPaddingMargin("padding",paddingSelect,paddingText),
            ...selectorPaddingMargin("margin",marginSelect,marginText),
          }}
        >
          <div className="grid-cols-8 ">
            <div className="font-bold ">
              <div className="flex items-center gap-1 ">
                <div 
                  className="font-bold flex gap-1"
                  style={{
                    color:pColor,
                    fontSize:pSize,
                    fontFamily:pFamily,
                    fontWeight:pWeight,
                    ...selectorPaddingMargin("padding",pPaddingSelect,pPaddingText),
                    ...selectorPaddingMargin("margin",pMarginSelect,pMarginText),
                  }}
                >
                  {checkPrice(producto.selectedVariant.price.amount)} €
                  
                  {producto.selectedVariant.compareAtPrice?.amount && (
                    <span 
                      className=" font-normal line-through place-content-center"
                      style={{
                        color:pCColor,
                        fontSize:pCSize
                      }}
                    >
                      {checkPrice(
                        producto.selectedVariant.compareAtPrice.amount,
                      )}{" "}
                      €
                    </span>
                  )}
                </div> 
                {producto.selectedVariant.compareAtPrice?.amount &&(
                  <div className="text-[12px] bg-red-700 text-white rounded-sm px-1 ">
                    Ahorra  {parseInt(producto.selectedVariant.compareAtPrice.amount)-parseInt(producto.selectedVariant.price.amount)} €
                  </div>
                )}
              </div>
            </div> 
          </div>
          <div className="font-normal">
            {showPaypal && 
              <div className="financing"> 
                <p
                  className="flex flex-wrap mb-0 leading-6 text-[14px] text-[#71717A]"
                  style={{
                    color:payColor,
                    fontSize:paySize,
                    fontFamily:payFamily,
                    fontWeight:payWeight,
                    ...selectorPaddingMargin("padding",payPaddingSelect,payPaddingText),
                    ...selectorPaddingMargin("margin",payMarginSelect,payMarginText),
                  }}
                >
                  <span>
                    Paga en 3 plazos y sin intereses desde
                    <b className="mr-1">
                      <span
                        className="instalment-amt mx-1"
                        data-instalment-split="3"
                      >
                        {Math.ceil(
                          parseFloat(producto.selectedVariant.price.amount) / 3,
                        )}
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
                    onClick={() => setIsDialogOpen(true)}
                    id="paypal-button-popup"
                    className="hover:underline focus:underline hover:st-colour-link-primary-hover focus:st-colour-link-primary-hover"
                  >
                    Saber más
                  </button>
                </p>
              </div>
            }
          </div>
        </div>
        {showPaypal &&
          <div
            ref={dialog}
            className="top-0 left-0 bg-black/50 flex w-full items-center fixed h-[100vh] duration-300 transition-all ease-in-out"
            style={{
              display: isDialogOpen ? "flex" : "none",
              zIndex: 50,
            }}
          >
            <Dialog
              show={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              className="dialog-paypal w-[40%] mx-auto rounded-md"
            >
              <div className="w-full p-10 flex flex-col gap-3">
                <img
                  className="mb-4 h-[80px] w-fit"
                  src="https://cdn.freebiesupply.com/logos/large/2x/paypal-logo-png-transparent.png"
                  alt="Paypal Credit logo"
                  height="80"
                />
                <h6 className="fluid-h6 light">Paga en 3 plazos sin intereses</h6>
                <p>
                  Disponible para compras de 30 € a 2.000 €. Sin comisiones de
                  apertura ni por pago atrasado.
                </p>
                <ol className="ml-5">
                  <li>
                    1. Selecciona PayPal en el proceso de pago para pagar más
                    tarde Paga en 3 plazos.
                  </li>
                  <li>2. Completa la compra y realiza hoy el primer pago.</li>
                  <li>
                    3. Los pagos restantes se realizarán de foma automática. ¡Así
                    de fácil!
                  </li>
                </ol>
                <p>
                  Disponible para compras de entre 30 € y 2.000 €. Debes residir
                  en España y tener una cuenta de PayPal. Ejemplo representativo:
                  TAE 0%. TIN 0%.
                </p>
              </div>
            </Dialog>
          </div>
        }
      </>
    );
  }
}

export default BlacklytePrice;

export const schema = createSchema({
  title: "Price (BlackLyte)",
  type: "price-blacklyte",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type:'switch',
          label:'show paypal',
          name:'showPaypal',
          defaultValue:true,
        },
        {
          type: "select",
          label: "Padding type",
          name: "paddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "paddingText",
          defaultValue:" 24px 32px"
        },
        {
          type: "select",
          label: "Margin type",
          name: "marginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "marginText",
        },

      ],
    },
    {
      group:"price",
      inputs:[
        {
          type: "color",
          label: "color ",
          name: "pColor",
          defaultValue: "#71717A",
        },
        {
          type: "color",
          label: "color compare price",
          name: "pCColor",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          label: "font size compare price",
          name: "pCSize",
          defaultValue: "18px",
        },
        {
          type: "text",
          label: "font size price",
          name: "pSize",
          defaultValue: "18px",
        },
        {
          type: "text",
          label: "font family",
          name: "pFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "pPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "pPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "pMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "pMarginText",
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
          defaultValue:'400',
        },
      ]
    },
    {
      group:"text paypal",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'payColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'paySize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family',
          name:'payFamily',
          defaultValue:'Montserrat',
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
    }
  ],
});
