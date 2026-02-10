import { useCurrentProduct } from "~/stores/currentProduct";
import type { selectedOptions, Variants } from "~/types/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";
import { checkPrice } from "~/utils/product";

interface estiloProps{
    defSelectColor:string,
    defTColor:string,
    defTSize:string,
    defTFamily:string,
    defTPaddingSelect:string,
    defTPaddingText:string,
    defTMarginSelect:string,
    defTMarginText:string,
    defTWeight:string,
    defsTColor:string,
    desfTSize:string,
    defsTFamily:string,
    defsTPaddingSelect:string,
    defsTPaddingText:string,
    defsTMarginSelect:string,
    defsTMarginText:string,
    defsTWeight:string,
}

interface VariantSelectorProps {
  variantes:Variants[];
  currentOption:selectedOptions;
  estilo:estiloProps;
}

function VariantSelectorSecret(props:VariantSelectorProps) {
  const {variantes, currentOption, estilo}=props;
  const setVariant=useCurrentProduct(state=>state.setVariant)
  const changeVariant=(variant:Variants)=>{
    setVariant(variant)
  }
  
  return (
    <div className="EZDrawer">
      <div className="h-full flex relative flex-col">
        <div className="flex-1">
          {variantes.map((elm:Variants)=>{
            const correctOption = elm.selectedOptions.find((e:selectedOptions)=>e.name==currentOption.name) 
            const isChecked= currentOption.value === correctOption.value
            const nombre = elm.selectedOptions.find((e)=>e.name ==correctOption.name).value as string
          
            return(
              <div 
                key={elm.id} 
                className="cursor-pointer p-5 border-l-0 border-t-0 border-r-0 border-solid e2e-button-size "
                style={{
                  backgroundColor: elm.availableForSale ? "":"#F4F4F5",
                  borderColor:"#D4D4D8"
                }}
                onClick={()=>changeVariant(elm)}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex gap-1 ">
                      {elm.availableForSale ? 
                        elm.quantityAvailable<=0 &&                      
                        <span className="uppercase flex gap-1 items-center font-bold justify-center w-fit  text-[12px] text-white bg-[#E3741E]  p-[2px] lg:p-1 flex flex-wrap ">
                          Reservar
                        </span>
                        :
                        <span className="uppercase flex gap-1 items-center font-bold justify-center w-fit  text-[12px] text-white bg-stone-400  p-[2px] lg:p-1 flex flex-wrap ">
                          No disponible
                        </span>
                      }
                    </div>
                    <div 
                      className="headline-3 font-bold"
                      style={{
                        color:elm.availableForSale ? isChecked ?estilo.defSelectColor:estilo.defTColor :"#71717A",
                        fontSize:estilo.defTSize,
                        fontFamily:estilo.defTFamily,
                        fontWeight:estilo.defTWeight,
                        ...selectorPaddingMargin("padding",estilo.defTPaddingSelect,estilo.defTPaddingText),
                        ...selectorPaddingMargin("margin",estilo.defTMarginSelect,estilo.defTMarginText),
                      }}
                      >
                      {nombre}
                    </div>
                    <div 
                      className="subheading-3"
                      style={{
                        color: elm.availableForSale ? estilo.defsTColor:"#71717A",
                        fontSize:estilo.desfTSize,
                        fontFamily:estilo.defsTFamily,
                        fontWeight:estilo.defsTWeight,
                        ...selectorPaddingMargin("padding",estilo.defsTPaddingSelect,estilo.defsTPaddingText),
                        ...selectorPaddingMargin("margin",estilo.defsTMarginSelect,estilo.defsTMarginText), 
                      }}
                    >
                      {elm.tooltip?.value}
                    </div>
                    <div className="subheading-3 font-bold uppercase text-[#18181B]">
                      {checkPrice(elm.price.amount)}€
                    </div>
                  </div>
                  {isChecked &&
                    <div className="flex items-center ">
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "25px", color: estilo.defSelectColor }}
                      >
                        <path
                          d="M11.25 2.625L4.5 9.375L0.75 5.72679"
                          stroke={estilo.defSelectColor}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                    </div>
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
export default VariantSelectorSecret;
