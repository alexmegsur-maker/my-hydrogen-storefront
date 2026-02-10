import { useEffect, useState } from "react"
import VariantSelectorSecret from "./variant-selector"
import LateralPopup from "./lateral-popup" 
import { useCurrentProduct } from "~/stores/currentProduct";
import type { Variants } from "~/types/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";

interface Option{
  name:string;
  value?:string;
}

interface VarianteOption{
  name:string;
  optionValues:Option[]
}

interface defVariant{
  dVariants:string,
  defVarColor:string,
  defVarSize:string,
  defVarFamily:string,
  defVarPaddingSelect:string,
  defVarPaddingText:string,
  defVarMarginSelect:string,
  defVarMarginText:string,
  defVarWeight:string,
  defsVarColor:string,
  defsVarSize:string,
  defsVarWeight:string,
  defsVarFamily:string,
  defsVarSubColor:string,
  defsVarSubSize:string,
  defsVarSubWeight:string,
  defsVarSubFamily:string,
  defLineColor:string,
  defArrowColor:string,
  defNavBgColor:string,
  defNavColor:string,
  defNavSize:string,
  defNavFamily:string,
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
  defButtonColor:string,
  defButtonBgColor:string,
  defButtonSize:string,
  defButtonFamily:string,
  defButtonPaddingSelect:string,
  defButtonPaddingText:string,
  defButtonMarginSelect:string,
  defButtonMarginText:string,
  defButtonWeight:string,
}

interface VariantProps{
  widthSize:number;
  variante:VarianteOption;
  defVariant:defVariant;
}

function Variant(props:VariantProps){

  const {widthSize,variante,defVariant} = props;

  const lateralPopupProps={
    defNavBgColor:defVariant.defNavBgColor,
    defNavColor:defVariant.defNavColor,
    defNavSize:defVariant.defNavSize,
    defNavFamily:defVariant.defNavFamily,
    defButtonColor:defVariant.defButtonColor,
    defButtonBgColor:defVariant.defButtonBgColor,
    defButtonSize:defVariant.defButtonSize,
    defButtonFamily:defVariant.defButtonFamily,
    defButtonPaddingSelect:defVariant.defButtonPaddingSelect,
    defButtonPaddingText:defVariant.defButtonPaddingText,
    defButtonMarginSelect:defVariant.defButtonMarginSelect,
    defButtonMarginText:defVariant.defButtonMarginText,
    defButtonWeight:defVariant.defButtonWeight,
  }

  const variantProperties= {
    defSelectColor:defVariant.defSelectColor,
    defTColor:defVariant.defTColor,
    defTSize:defVariant.defTSize,
    defTFamily:defVariant.defTFamily,
    defTPaddingSelect:defVariant.defTPaddingSelect,
    defTPaddingText:defVariant.defTPaddingText,
    defTMarginSelect:defVariant.defTMarginSelect,
    defTMarginText:defVariant.defTMarginText,
    defTWeight:defVariant.defTWeight,
    defsTColor:defVariant.defsTColor,
    desfTSize:defVariant.desfTSize,
    defsTFamily:defVariant.defsTFamily,
    defsTPaddingSelect:defVariant.defsTPaddingSelect,
    defsTPaddingText:defVariant.defsTPaddingText,
    defsTMarginSelect:defVariant.defsTMarginSelect,
    defsTMarginText:defVariant.defsTMarginText,
    defsTWeight:defVariant.defsTWeight,
  }
  const [show,setShow] = useState(false);
  const currentProd = useCurrentProduct(state=>state.currentProduct) 
  const variant= currentProd?.variants?.nodes.find((elm :Variants)=>elm.id  == currentProd?.selectedVariant?.id )as Variants
  const currentVariant=variant?.selectedOptions.find((elm)=>elm.name == variante.name)

  return(
    <div>
      <div
        onClick={()=>setShow(true)}
        className="cursor-pointer border-b border-t-0  border-l-0 border-solid border-r-0 colour-surface-light-grey colour-border-medium-grey e2e-selector-size sizedrawer border-b-0"
      >
        <div className="flex items-center">
          <div className="flex-1">
            <div className="mb-3 lg:mb-4 flex items-center justify-between">
              <div
                data-context="pdp-chairs-size"
                className="colour-text-primary subheading-alt-normal font-bold"
                style={{
                  color:defVariant.defVarColor,
                  fontSize:defVariant.defVarSize,
                  fontFamily:defVariant.defVarFamily,
                  fontWeight:defVariant.defVarWeight,
                  ...selectorPaddingMargin("padding",defVariant.defVarPaddingSelect,defVariant.defVarPaddingText),
                  ...selectorPaddingMargin("margin",defVariant.defVarMarginSelect,defVariant.defVarMarginText)
                }}
              >
                {variante?.name}
              </div>
            </div>
            <div
              data-context="pdp-chairs-size"
              className="border-b-0 border-r-0 border-l-2 border-t-0 border-solid ps-3 lg:ps-4 ms-1"
              style={{
                borderColor:defVariant.defLineColor
              }}
            >
              <div
                data-context="pdp-chairs-size"
                className="[&amp;_*]:pointer-events-none"
              >
                <div className="flex gap-1 flex-wrap e2e-section-status">
                  {currentProd?.selectedVariant.quantityAvailable?
                    currentProd.selectedVariant.quantityAvailable <= 0 &&
                    <span className="uppercase flex gap-1 items-center justify-center w-fit text-white text-[12px] p-[2px] bg-stone-300">Reservar</span>
                  :
                    <span className="uppercase flex gap-1 items-center justify-center w-fit text-white text-[12px] p-[2px] bg-stone-300">Agotado</span>
                  }
                </div>
                <div 
                  className="headline-3 "
                  style={{
                    color:defVariant.defsVarColor,
                    fontSize:defVariant.defsVarSize,
                    fontFamily:defVariant.defsVarFamily,
                    fontWeight:defVariant.defsVarWeight,
                  }}
                >
                  {currentVariant?.value}

                </div>
                <div 
                  className="body-normal "
                  style={{
                    color:defVariant.defsVarSubColor,
                    fontSize:defVariant.defsVarSubSize,
                    fontFamily:defVariant.defsVarSubFamily,
                    fontWeight:defVariant.defsVarSubWeight,
                  }}
                  >
                  {variant?.tooltip?.value}
                </div>
              </div>
            </div>
          </div>
          <div
            data-context="pdp-chairs-size"
            className="flex-none [&amp;_*]:pointer-events-none"
          >
            <div className="w-[20px]">
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
                  fill={defVariant.defArrowColor}
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      { show && 
        <LateralPopup estilo={lateralPopupProps} setActive={()=>setShow(false)} active={show} widthSize={widthSize} title={variante?.name} >
          <VariantSelectorSecret estilo={variantProperties} variantes={currentProd?.variants.nodes} currentOption={currentVariant}/> 
        </LateralPopup>
      }
    </div>
  )
}

export default Variant