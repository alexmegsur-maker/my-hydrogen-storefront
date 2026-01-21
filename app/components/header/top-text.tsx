import { useEffect, useState} from "react";
import type {HeaderTopTextProps} from "~/types/header"
import { selectorPaddingMargin } from "~/utils/general";

type textData ={
  containerSize:number;
  tSpacing:string;
  tSize:string;
  tColor:string;
  tBgColor:string;
  tAlignment:"left"|"center"|"right"|"justify";
  tPaddingSelect:string;
  tPadding:string;
  tMarginSelect:string;
  tMargin:string;
  tWeight:string;
  pConSize:number;
  pSpacing:string;
  pSize:string;
  pColor:string;
  pBgColor:string;
  pAlignment:"left"|"center"|"right"|"justify";
  pPaddingSelect:string;
  pPadding:string;
  pMarginSelect:string;
  pMargin:string;
  pWeight:string;
}


export function TopTextHeader(props:HeaderTopTextProps){
  const{ 
    containerSize,
    title,
    paragraph,
    decoration,
    overContainer,
    tSpacing,
    tSize,
    tColor,
    tBgColor,
    tAlignment,
    tPaddingSelect,
    tPadding,
    tMarginSelect,
    tMargin,
    tWeight,
    tFontFamily,
    containerPSize,
    pSpacing,
    pSize,
    pColor,
    pBgColor,
    pAlignment,
    pPaddingSelect,
    pPadding,
    pMarginSelect,
    pMargin,
    pWeight,
    pFontFamily,
    mbContainerSize, 
    mbTSpacing,
    mbTSize,
    mbTColor,
    mbTBgColor,
    mbTAlignment,
    mbTPaddingSelect,
    mbTPadding,
    mbTMarginSelect,
    mbTMargin,
    mbTWeight,
    mbContainerPSize,
    mbPSpacing,        
    mbPSize,
    mbPColor,
    mbPBgColor,
    mbPAlignment,
    mbPPaddingSelect,
    mbPPadding,
    mbPMarginSelect,
    mbPMargin,
    mbPWeight,
    customClass,
  } = props;

  const [data, setData]= useState<textData>(
    {
      containerSize:containerSize,
      tSpacing:tSpacing,
      tSize:tSize,
      tColor:tColor,
      tBgColor:tBgColor,
      tAlignment:tAlignment,
      tPaddingSelect:tPaddingSelect,
      tPadding:tPadding,
      tMarginSelect:tMarginSelect,
      tMargin:tMargin,
      tWeight:tWeight,
      pConSize:containerPSize,
      pSpacing:pSpacing,
      pSize:pSize,
      pColor:pColor,
      pBgColor:pBgColor,
      pAlignment:pAlignment,
      pPaddingSelect:pPaddingSelect,
      pPadding:pPadding,
      pMarginSelect:pMarginSelect,
      pMargin:pMargin,
      pWeight:pWeight,    
    }
  )
  
  const screenWidth= window.innerWidth
  
  useEffect(()=>{
    if( screenWidth<700){
      setData({
        containerSize:mbContainerSize,
        tSpacing:mbTSpacing,
        tSize:mbTSize,
        tColor:mbTColor,
        tBgColor:mbTBgColor,
        tAlignment:mbTAlignment,
        tPaddingSelect:mbTPaddingSelect,
        tPadding:mbTPadding,
        tMarginSelect:mbTMarginSelect,
        tMargin:mbTMargin,
        tWeight:mbTWeight,
        pConSize:mbContainerPSize,
        pSpacing:mbPSpacing,
        pSize:mbPSize,
        pColor:mbPColor,
        pBgColor:mbPBgColor,
        pAlignment:mbPAlignment,
        pPaddingSelect:mbPPaddingSelect,
        pPadding:mbPPadding,
        pMarginSelect:mbPMarginSelect,
        pMargin:mbPMargin,
        pWeight:mbPWeight,    
      })
    }

  },[])
  
  return(
    <div 
      className={`relative mx-auto ${customClass && customClass}` }
      style={{
        width:`${data.containerSize}%`,
        position: overContainer ? "absolute":"relative",
        top:overContainer ?'0':'auto',

      }}
      >
      <div className="custom-text-container w-full h-full ">
        <div className="w-full">
          <div 
            className="title-text w-full"
            style={{
              textAlign:data.tAlignment,
              backgroundColor:`${data.tBgColor}`
            }}
            >
            {title && (
              <h3
                style={{
                  fontFamily:`${tFontFamily}`,
                  color:`${data.tColor}`,
                  fontSize:`${data.tSize}`,
                  letterSpacing:`${data.tSpacing ? data.tSpacing:"normal"}`,
                  fontWeight:`${data.tWeight}`,
                  ...selectorPaddingMargin("padding",data.tPaddingSelect,data.tPadding),
                  ...selectorPaddingMargin("margin",data.tMarginSelect,data.tMargin)
                }}
                >
                {title}
                <span dangerouslySetInnerHTML={{ __html:decoration }}></span>  
              </h3>
            )}
          </div>
          {paragraph && (
            <div 
              className="paragraph-text mx-auto"
              style={{ 
                width:`${data.pConSize}%`,
                background:`${data.pBgColor}`,
              }}
              >
                <p style={{ 
                  letterSpacing:data.pSpacing?`${data.pSpacing}`:"normal",
                  fontSize:`${data.pSize}`,
                  color:`${data.pColor}`,
                  fontFamily:`${pFontFamily}`,
                  fontWeight:`${data.pWeight}`,
                  ...selectorPaddingMargin("padding",data.pPaddingSelect,data.pPadding),
                  ...selectorPaddingMargin("margin",data.pMarginSelect,data.pMargin)
                 }}> 
                  {paragraph}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
