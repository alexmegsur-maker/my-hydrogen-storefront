import { useState } from "react";
import { selectorPaddingMargin } from "~/utils/general"

interface LegalWrapperNavItemProps{
  data:any;
  active?:boolean;
}

export default function LegalWrapperNavItem(props:LegalWrapperNavItemProps){

  const {data,active}=props
  const [isHover,setIsHover]=useState(false)
  const isHighlighted = active || isHover
  const handleClick = () => {
    const targetId = data.navText.trim().split(" ").join("-").toLowerCase()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
  return (
    <span
      onMouseEnter={()=>{setIsHover(true)}}
      onMouseLeave={()=>{setIsHover(false)}}
      onClick={handleClick}
      className="cursor-pointer"
      style={{
        borderLeft:`1px solid ${isHighlighted? data.nhColor: data.nBorderColor}`,
        color: isHighlighted?data.nhColor:data.nColor,
        fontFamily: data.nFamily,
        fontSize: data.nSize,
        fontWeight: data.nWeight,
        textTransform: data.nUpper ? "uppercase" : "unset",
        letterSpacing: data.nLetter > 0 ? `${data.nLetter}px`:"normal",
        ...selectorPaddingMargin("padding", data.nPaddingSelect, isHighlighted?"1.5rem": data.nPaddingText),
        ...selectorPaddingMargin("margin", data.nMarginSelect, data.nMarginText),
        transition:"all 0.4s ease"
      }}>
      {data.navText}
    </span>
  )
}