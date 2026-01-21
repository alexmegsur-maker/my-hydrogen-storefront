import { Image } from "@shopify/hydrogen";
import { useEffect, useState } from "react";
import type { HeaderBannerProps} from "~/types/header"
import { selectorPaddingMargin } from "~/utils/general";
import { Link } from "~/components/link";

type BannerData ={
    imgColor:string;
    borderSize:number;
    paddingSelect:string;
    padding?:string; 
    headerSpacing:string;
    headerSize:string;
    headerColor:string;
    headerBgColor:string;
    headerAlignment:"left"|"center"|"right"|"justify";
    headerPaddingSelect:string;
    headerPadding?:string;
    headerMarginSelect:string;
    headerMargin:string;
    headerWeight:string;
    tSpacing:string;
    tSize:string;
    tColor:string;
    tBgColor:string;
    tAlignment:"left"|"center"|"right"|"justify";
    tPaddingSelect:string;
    tPadding?:string;
    tMarginSelect:string;
    tMargin:string;
    tWeight:string;
    dSpacing:string;
    dSize:string;
    dColor:string;
    dBgColor:string;
    dAlignment:"left"|"center"|"right"|"justify";
    dPaddingSelect:string;
    dPadding?:string;
    dMarginSelect:string;
    dMargin:string;
    dWeight:string;
    bSpacing:string;
    bSize:string;
    bColor:string;
    bBgColor:string;
    bAlignment:"left"|"center"|"right"|"justify";
    bPaddingSelect:string;
    bPadding?:string;
    bMarginSelect:string;
    bMargin:string;
    bWeight:string;
}


export function BannerHeader(props:HeaderBannerProps){
  const{ 
    type,
    position,
    heading,
    image,
    header,
    title,
    description,
    linkText,
    link,
    fontFamily,
    imageWidth,
    imgColor,
    borderSize,
    paddingSelect,
    padding, 
    customClass,
    // header
    headerSpacing,
    headerSize,
    headerColor,
    headerBgColor,
    headerAlignment,
    headerPaddingSelect,
    headerPadding,
    headerMarginSelect,
    headerMargin,
    headerWeight,
    // title
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
    // Description
    dSpacing,
    dSize,
    dColor,
    dBgColor,
    dAlignment,
    dPaddingSelect,
    dPadding,
    dMarginSelect,
    dMargin,
    dWeight,
    // button
    buttonHtml,
    bSpacing,
    bSize,
    bColor,
    bBgColor,
    bAlignment,
    bPaddingSelect,
    bPadding,
    bMarginSelect,
    bMargin,
    bWeight,
    // Mobile settings
    mbImgColor,
    mbBorderSize,
    mbPaddingSelect,
    mbPadding, 
    //  header mobile
    mbHeaderSpacing,
    mbHeaderSize,
    mbHeaderColor,
    mbHeaderBgColor,
    mbHeaderAlignment,
    mbHeaderPaddingSelect,
    mbHeaderPadding,
    mbHeaderMarginSelect,
    mbHeaderMargin,
    mbHeaderWeight,      
    // title mobile
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
    // Description mobile
    mbDSpacing,
    mbDSize,
    mbDColor,
    mbDBgColor,
    mbDAlignment,
    mbDPaddingSelect,
    mbDPadding,
    mbDMarginSelect,
    mbDMargin,
    mbDWeight, 
    // button
    mbBSpacing,
    mbBSize,
    mbBColor,
    mbBBgColor,
    mbBAlignment,
    mbBPaddingSelect,
    mbBPadding,
    mbBMarginSelect,
    mbBMargin,
    mbBWeight,
  } = props;

  const [data, setData]= useState<BannerData>(
    {
    imgColor:imgColor,
    borderSize:borderSize,
    paddingSelect:paddingSelect,
    padding:padding, 
    headerSpacing:headerSpacing,
    headerSize:headerSize,
    headerColor:headerColor,
    headerBgColor:headerBgColor,
    headerAlignment:headerAlignment,
    headerPaddingSelect:headerPaddingSelect,
    headerPadding:headerPadding,
    headerMarginSelect:headerMarginSelect,
    headerMargin:headerMargin,
    headerWeight:headerWeight,
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
    dSpacing:dSpacing,
    dSize:dSize,
    dColor:dColor,
    dBgColor:dBgColor,
    dAlignment:dAlignment,
    dPaddingSelect:dPaddingSelect,
    dPadding:dPadding,
    dMarginSelect:dMarginSelect,
    dMargin:dMargin,
    dWeight:dWeight,
    bSpacing:bSpacing,
    bSize:bSize,
    bColor:bColor,
    bBgColor:bBgColor,
    bAlignment:bAlignment,
    bPaddingSelect:bPaddingSelect,
    bPadding:bPadding,
    bMarginSelect:bMarginSelect,
    bMargin:bMargin,
    bWeight:bWeight,
    }
  )
  
  const screenWidth= window.innerWidth
  
  useEffect(()=>{
    if( screenWidth<700){
      setData({
        imgColor:mbImgColor,
        borderSize:mbBorderSize,
        paddingSelect:mbPaddingSelect,
        padding:mbPadding, 
        headerSpacing:mbHeaderSpacing,
        headerSize:mbHeaderSize,
        headerColor:mbHeaderColor,
        headerBgColor:mbHeaderBgColor,
        headerAlignment:mbHeaderAlignment,
        headerPaddingSelect:mbHeaderPaddingSelect,
        headerPadding:mbHeaderPadding,
        headerMarginSelect:mbHeaderMarginSelect,
        headerMargin:mbHeaderMargin,
        headerWeight:mbHeaderWeight,
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
        dSpacing:mbDSpacing,
        dSize:mbDSize,
        dColor:mbDColor,
        dBgColor:mbDBgColor,
        dAlignment:mbDAlignment,
        dPaddingSelect:mbDPaddingSelect,
        dPadding:mbDPadding,
        dMarginSelect:mbDMarginSelect,
        dMargin:mbDMargin,
        dWeight:mbDWeight,
        bSpacing:mbBSpacing,
        bSize:mbBSize,
        bColor:mbBColor,
        bBgColor:mbBBgColor,
        bAlignment:mbBAlignment,
        bPaddingSelect:mbBPaddingSelect,
        bPadding:mbBPadding,
        bMarginSelect:mbBMarginSelect,
        bMargin:mbBMargin,
        bWeight:mbBWeight,
      })
    }

  },[])
  
  return(
    <div 
        className={`flex flex-col mx-auto ${customClass}`}
        style={{
            ...selectorPaddingMargin("padding",data.paddingSelect,data.padding)
        }}
        >
        <Link to={link} className="flex flex-col">
            <div className="flex justify-center">
                <Image
                    data={image}
                    sizes="auto"
                    style={{
                        width:imageWidth !=100  ? `${imageWidth}%`: "100%",
                        border:`${data.borderSize}px solid ${data.imgColor}`,
                    }}
                    width={image.width}
                    height={image.height}
                />
            </div>
            <div 
                style={{
                    fontFamily:fontFamily
                }}
                >
                <h5
                    style={{
                        letterSpacing:data.headerSpacing ? data.headerSpacing:"normal",
                        fontSize:data.headerSize,
                        background:data.headerBgColor,
                        color:data.headerColor,
                        textAlign:data.headerAlignment,
                        fontWeight:data.headerWeight,
                        ...selectorPaddingMargin("padding",data.headerPaddingSelect,data.headerPadding),
                        ...selectorPaddingMargin("margin",data.headerMarginSelect,data.headerMargin),
                    }}
                >
                    {header}
                </h5>
                <h3
                    style={{
                        letterSpacing:data.tSpacing ? data.tSpacing:"normal",
                        fontSize:data.tSize,
                        background:data.tBgColor,
                        color:data.tColor,
                        textAlign:data.tAlignment,
                        fontWeight:data.tWeight,
                        ...selectorPaddingMargin("padding",data.tPaddingSelect,data.tPadding),
                        ...selectorPaddingMargin("margin",data.tMarginSelect,data.tMargin),
                    }}
                >
                    {title}
                </h3>
                <p
                    style={{
                        letterSpacing:data.dSpacing ? data.dSpacing:"normal",
                        fontSize:data.dSize,
                        background:data.dBgColor,
                        color:data.dColor,
                        textAlign:data.dAlignment,
                        fontWeight:data.dWeight,
                        ...selectorPaddingMargin("padding",data.dPaddingSelect,data.dPadding),
                        ...selectorPaddingMargin("margin",data.dMarginSelect,data.dMargin),
                    }}
                >
                    {description}
                </p>
                <div id="link-{{ block.id }}" className="flex"
                    style={{
                        justifyContent:data.bAlignment != "justify" ? data.bAlignment:"space-between"
                    }}
                >
                    <div className="w-fit">
                        <Link 
                            to={link} 
                            className="flex"
                            style={{
                                letterSpacing:data.bSpacing ? data.bSpacing:"normal",
                                fontSize:data.bSize,
                                background:data.bBgColor,
                                color:data.bColor,
                                textAlign:data.bAlignment,
                                fontWeight:data.bWeight,
                                ...selectorPaddingMargin("padding",data.bPaddingSelect,data.bPadding),
                                ...selectorPaddingMargin("margin",data.bMarginSelect,data.bMargin),
                            }}
                            >
                            {linkText}
                            <div dangerouslySetInnerHTML={{ __html:buttonHtml }}></div>
                        </Link>
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
