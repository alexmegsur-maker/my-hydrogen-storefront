import type { selectedOptions, Variants } from "~/types/currentProduct"
import { checkPrice } from "~/utils/product";

interface VariantGeneralOptionProps{
  variante:Variants;
  currentOption:selectedOptions;

}

function VariantGeneralOption(props:VariantGeneralOptionProps){
  const {variante,currentOption}=props
  const correctOption = variante.selectedOptions.find((e:selectedOptions)=>e.name==currentOption.name) 
  const isChecked= currentOption.value === correctOption.value
  const nombre = variante.selectedOptions.find((e)=>e.name ==correctOption.name).value as string
          
  return(
    <div 
      key={variante.id} 
      className="p-5 border-l-0 border-t-0 border-r-0 border-solid e2e-button-size "
      style={{
        backgroundColor: variante.availableForSale ? "":"#F4F4F5",
        borderColor:"#D4D4D8"
      }}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <div className="flex gap-1 ">
            {variante.availableForSale ? 
              variante.quantityAvailable<=0 &&                      
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
              color:variante.availableForSale ? isChecked ?"#3790b0":"#18181B" :"#71717A"
            }}
            >
            {nombre}
          </div>
          <div 
            className="subheading-3 text-[#71717A]"
            style={{
              color: variante.availableForSale ? "#18181B":"#71717A"
            }}
          >
            {variante.tooltip?.value}
          </div>
          <div className="subheading-3 font-bold uppercase text-[#18181B]">
            {checkPrice(variante.price.amount)}€
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
              style={{ width: "25px", color: "#3790b0" }}
            >
              <path
                d="M11.25 2.625L4.5 9.375L0.75 5.72679"
                stroke="#3790b0"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
        }
      </div>
    </div>
  )
}

export default VariantGeneralOption