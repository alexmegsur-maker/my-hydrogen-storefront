import { useEffect, useState} from "react";
import type {HeaderTextProps} from "~/types/header"
import { selectorPaddingMargin } from "~/utils/general";

type textData ={
  containerSize:number;
  tLetterSpacing:string;
  tSize:string;
  tColor:string;
  tBgColor:string;
  tAlignment:"left"|"center"|"right"|"justify";
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  pConSize:number;
  pLetterSpacing:string;
  pSize:string;
  pColor:string;
  pBgColor:string;
  pAlignment:"left"|"center"|"right"|"justify";
  pPaddingSelect:string;
  pPaddingText:string;
  pMarginSelect:string;
  pMarginText:string;
  pWeight:string;
}


export function TextHeader(props:HeaderTextProps){
  const{ 
  containerSize,
  title,
  paragraph,
  decoration,
  overContainer,
  customClass,
  tLetterSpacing,
  tSize,
  tColor,
  tBgColor,
  tAlignment,
  tPaddingSelect,
  tPaddingText,
  tMarginSelect,
  tMarginText,
  tWeight,
  tFontFamily,
  pConSize,
  pLetterSpacing,
  pSize,
  pColor,
  pBgColor,
  pAlignment,
  pPaddingSelect,
  pPaddingText,
  pMarginSelect,
  pMarginText,
  pWeight,
  pFontFamily,
  mbContainerSize,
  mbTLetterSpacing,
  mbTSize,
  mbTColor,
  mbTBgColor,
  mbTAlignment,
  mbTPaddingSelect,
  mbTPaddingText,
  mbTMarginSelect,
  mbTMarginText,
  mbTWeight,
  mbPConSize,
  mbPLetterSpacing,
  mbPSize,
  mbPColor,
  mbPBgColor,
  mbPAlignment,
  mbPPaddingSelect,
  mbPPaddingText,
  mbPMarginSelect,
  mbPMarginText,
  mbPWeight } = props;

  const [data, setData]= useState<textData>(
    {
      containerSize:containerSize,
      tLetterSpacing:tLetterSpacing,
      tSize:tSize,
      tColor:tColor,
      tBgColor:tBgColor,
      tAlignment:tAlignment,
      tPaddingSelect:tPaddingSelect,
      tPaddingText:tPaddingText,
      tMarginSelect:tMarginSelect,
      tMarginText:tMarginText,
      tWeight:tWeight,
      pConSize:pConSize,
      pLetterSpacing:pLetterSpacing,
      pSize:pSize,
      pColor:pColor,
      pBgColor:pBgColor,
      pAlignment:pAlignment,
      pPaddingSelect:pPaddingSelect,
      pPaddingText:pPaddingText,
      pMarginSelect:pMarginSelect,
      pMarginText:pMarginText,
      pWeight:pWeight,    
    }
  )
  
  const screenWidth= window.innerWidth
  
  useEffect(()=>{
    if( screenWidth<700){
      setData({
        containerSize:mbContainerSize,
        tLetterSpacing:mbTLetterSpacing,
        tSize:mbTSize,
        tColor:mbTColor,
        tBgColor:mbTBgColor,
        tAlignment:mbTAlignment,
        tPaddingSelect:mbTPaddingSelect,
        tPaddingText:mbTPaddingText,
        tMarginSelect:mbTMarginSelect,
        tMarginText:mbTMarginText,
        tWeight:mbTWeight,
        pConSize:mbPConSize,
        pLetterSpacing:mbPLetterSpacing,
        pSize:mbPSize,
        pColor:mbPColor,
        pBgColor:mbPBgColor,
        pAlignment:mbPAlignment,
        pPaddingSelect:mbPPaddingSelect,
        pPaddingText:mbPPaddingText,
        pMarginSelect:mbPMarginSelect,
        pMarginText:mbPMarginText,
        pWeight:mbPWeight
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
                  letterSpacing:`${data.tLetterSpacing ? data.tLetterSpacing:"normal"}`,
                  fontWeight:`${data.tWeight}`,
                  ...selectorPaddingMargin("padding",data.tPaddingSelect,data.tPaddingText),
                  ...selectorPaddingMargin("margin",data.tMarginSelect,data.tMarginText)
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
                  letterSpacing:data.pLetterSpacing?`${data.pLetterSpacing}`:"normal",
                  fontSize:`${data.pSize}`,
                  color:`${data.pColor}`,
                  fontFamily:`${pFontFamily}`,
                  fontWeight:`${data.pWeight}`,
                  ...selectorPaddingMargin("padding",data.pPaddingSelect,data.pPaddingText),
                  ...selectorPaddingMargin("margin",data.pMarginSelect,data.pMarginText)
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
