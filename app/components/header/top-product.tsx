import { useEffect, useState, type CSSProperties} from "react";
import type {HeaderTopProductProps} from "~/types/header"
import { selectorPaddingMargin } from "~/utils/general";
import Link from "~/components/link";
import { Image } from "@shopify/hydrogen";

type ProductTop ={
  logoSize:number;
  imgListSize:number
    // "container"
  gPaddingSelect:string;
  gPadding?:string;
  gMarginSelect:string;
  gMargin?:string;
  // "general"
  bSize:number;
  bColor:string;
  paddingSelect:string;
  padding?:string;
  marginSelect:string;
  margin?:string;
  //  "title/logo"
  tSpacing:string;
  tAlignment:"left"|"center"|"right"|"justify";
  tColor:string;
  tSize:string;
  tPaddingSelect:string;
  tPadding?:string;
  tMarginSelect:string;
  tMargin?:string;
  tWeight:string;
  //  "heading"
  hSpacing:string;
  hAlignment:"left"|"center"|"right"|"justify";
  hColor:string;
  hSize:string;
  hPaddingSelect:string;
  hPadding?:string;
  hMarginSelect:string;
  hMargin?:string;
  hWeight:string;
  //  "description"
  dSpacing:string;
  dAlignment:"left"|"center"|"right"|"justify";
  dColor:string;
  dSize:string;
  dPaddingSelect:string;
  dPadding?:string;
  dMarginSelect:string;
  dMargin?:string;
  dWeight:string;
}


export function ProductTopHeader(props:HeaderTopProductProps){
  const{ 
    type,
    position,
    heading,
    img1,
    img1Link,
    img2,
    img2Link,
    img3,
    img3Link,
    imgListSize,
    selectMobile,
    mbImgListSize,
    logo,
    generalLink,
    title,
    header,
    description,
    logoSize,
    // "container"
    gPaddingSelect,
    gPadding,
    gMarginSelect,
    gMargin,
    // "general"
    bSize,
    bColor,
    paddingSelect,
    padding,
    marginSelect,
    margin,
    //  "title/logo"
    tSpacing,
    tAlignment,
    tColor,
    tSize,
    tPaddingSelect,
    tPadding,
    tMarginSelect,
    tMargin,
    tWeight,
    //  "heading"
    hSpacing,
    hAlignment,
    hColor,
    hSize,
    hPaddingSelect,
    hPadding,
    hMarginSelect,
    hMargin,
    hWeight,
    //  "description"
    dSpacing,
    dAlignment,
    dColor,
    dSize,
    dPaddingSelect,
    dPadding,
    dMarginSelect,
    dMargin,
    dWeight,
    //  "Mobile settings"
    mbLogoSize,
    // "container"
    mbGPaddingSelect,
    mbGPadding,
    mbGMarginSelect,
    mbGMargin,
    // "general"
    mbBSize,
    mbBColor,
    mbPaddingSelect,
    mbPadding,
    mbMarginSelect,
    mbMargin,
    //  "title/logo"
    mbTSpacing,
    mbTAlignment,
    mbTColor,
    mbTSize,
    mbTPaddingSelect,
    mbTPadding,
    mbTMarginSelect,
    mbTMargin,
    mbTWeight,
    //  "heading"
    mbHSpacing,
    mbHAlignment,
    mbHColor,
    mbHSize,
    mbHPaddingSelect,
    mbHPadding,
    mbHMarginSelect,
    mbHMargin,
    mbHWeight,
    //  "description"
    mbDSpacing,
    mbDAlignment,
    mbDColor,
    mbDSize,
    mbDPaddingSelect,
    mbDPadding,
    mbDMarginSelect,
    mbDMargin,
    mbDWeight,
  } = props;
  const [screenWidth,setScreenWidth]=useState<number>(window.innerWidth)
  const [data, setData]= useState<ProductTop>(
    {
    logoSize:logoSize,
    imgListSize:imgListSize,
    gPaddingSelect:gPaddingSelect,
    gPadding:gPadding,
    gMarginSelect:gMarginSelect,
    gMargin:gMargin,
    bSize:bSize,
    bColor:bColor,
    paddingSelect:paddingSelect,
    padding:padding,
    marginSelect:marginSelect,
    margin:margin,
    tSpacing:tSpacing,
    tAlignment:tAlignment,
    tColor:tColor,
    tSize:tSize,
    tPaddingSelect:tPaddingSelect,
    tPadding:tPadding,
    tMarginSelect:tMarginSelect,
    tMargin:tMargin,
    tWeight:tWeight,
    hSpacing:hSpacing,
    hAlignment:hAlignment,
    hColor:hColor,
    hSize:hSize,
    hPaddingSelect:hPaddingSelect,
    hPadding:hPadding,
    hMarginSelect:hMarginSelect,
    hMargin:hMargin,
    hWeight:hWeight,
    dSpacing:dSpacing,
    dAlignment:dAlignment,
    dColor:dColor,
    dSize:dSize,
    dPaddingSelect:dPaddingSelect,
    dPadding:dPadding,
    dMarginSelect:dMarginSelect,
    dMargin:dMargin,
    dWeight:dWeight,
    }
  )
  
  // const screenWidth= window.innerWidth
  
  const styleImgs = {
    width:"auto",
    height:`${data.imgListSize}px`
  } as CSSProperties

  useEffect(()=>{
    if( screenWidth<700){
      setData({
        logoSize:mbLogoSize,
        imgListSize:mbImgListSize,
        gPaddingSelect:mbGPaddingSelect,
        gPadding:mbGPadding,
        gMarginSelect:mbGMarginSelect,
        gMargin:mbGMargin,
        bSize:mbBSize,
        bColor:mbBColor,
        paddingSelect:mbPaddingSelect,
        padding:mbPadding,
        marginSelect:mbMarginSelect,
        margin:mbMargin,
        tSpacing:mbTSpacing,
        tAlignment:mbTAlignment,
        tColor:mbTColor,
        tSize:mbTSize,
        tPaddingSelect:mbTPaddingSelect,
        tPadding:mbTPadding,
        tMarginSelect:mbTMarginSelect,
        tMargin:mbTMargin,
        tWeight:mbTWeight,
        hSpacing:mbHSpacing,
        hAlignment:mbHAlignment,
        hColor:mbHColor,
        hSize:mbHSize,
        hPaddingSelect:mbHPaddingSelect,
        hPadding:mbHPadding,
        hMarginSelect:mbHMarginSelect,
        hMargin:mbHMargin,
        hWeight:mbHWeight,
        dSpacing:mbDSpacing,
        dAlignment:mbDAlignment,
        dColor:mbDColor,
        dSize:mbDSize,
        dPaddingSelect:mbDPaddingSelect,
        dPadding:mbDPadding,
        dMarginSelect:mbDMarginSelect,
        dMargin:mbDMargin,
        dWeight:mbDWeight,
      })
    }
    setScreenWidth(window.innerWidth)

  },[screenWidth])
  
  return(
    <div 
      style={{
        ...selectorPaddingMargin("padding",data.gPaddingSelect,data.gPadding),
        ...selectorPaddingMargin("margin",data.gMarginSelect,data.gMargin)
      }}
      >
      <div 
        className="flex w-full place-content-between"
        style={{
          borderBottom:`${data.bSize}px solid ${data.bColor}`,
          ...selectorPaddingMargin("padding",data.paddingSelect,data.padding),
          ...selectorPaddingMargin("margin",data.marginSelect,data.margin),
        }}
        >
        <div className="flex ">
            {img1 != undefined  && (screenWidth > 700 ||  selectMobile  === "img1" ) &&
              <Link to={img1Link}>
                  <Image
                    sizes="auto"
                    data={img1}
                    width={img1.width}
                    height={img1.height}
                    style={styleImgs}
                  />
              </Link>
            }
            {img2 != undefined  && (screenWidth > 700 || selectMobile  === "img2" ) &&
              <Link to={img2Link}>
                  <Image
                    sizes="auto"
                    data={img2}
                    width={img2.width}
                    height={img2.height}
                    style={styleImgs}
                  />
              </Link> 
            }
            {img3 != undefined  && (screenWidth > 700 || selectMobile  === "img3" ) && 
              <Link to={img3Link}>
                  <Image
                    data={img3}
                    sizes="auto"
                    width={img3.width}
                    height={img3.height}
                    style={styleImgs}
                  />
              </Link> 
            }
        </div>
        <div className="flex flex-col">
            <div 
              className="flex"
              style={{
                letterSpacing:data.hSpacing ? data.hSpacing :"normal",
                color:data.hColor,
                fontSize:data.hSize,
                textAlign:data.hAlignment,
                fontWeight:data.hWeight,
                ...selectorPaddingMargin("padding",data.hPaddingSelect,data.hPadding),
                ...selectorPaddingMargin("margin",data.hMarginSelect,data.hMargin)
              }}
              >
                { header }
            </div>
            <div 
              className="flex"
              style={{
                placeContent:logo && (data.tAlignment == "left" && "start" || data.tAlignment == "center" && "center" ||data.tAlignment == "right" && "end" || data.tAlignment == "justify" && "stretch")  
              }}
              >
              <Link to={ generalLink }>
                {logo != undefined ? (
                  <Image
                    data={logo}
                    sizes="auto"
                    width={logo.width *2}
                    height={logo.height*2}
                    alt="Logo image"
                    style={{
                      height:`${data.logoSize}px`,
                      width:"auto",
                      ...selectorPaddingMargin("padding",data.tPaddingSelect,data.tPadding),
                      ...selectorPaddingMargin( "margin",data.tMarginSelect,data.tMargin)
                    }}
                  />
                )
                :
                (
                  <div 
                    className="flex"
                    style={{
                      letterSpacing:data.tSpacing ? data.tSpacing :"normal",
                      color:data.tColor,
                      fontSize:data.tSize,
                      textAlign:data.tAlignment,
                      fontWeight:data.tWeight,
                      ...selectorPaddingMargin("padding",data.tPaddingSelect,data.tPadding),
                      ...selectorPaddingMargin("margin",data.tMarginSelect,data.tMargin)
                    }}
                    >
                    { title }
                  </div>
                )
                }
              </Link>
            </div>
            <div 
              className="flex"
              style={{
                letterSpacing:data.dSpacing ? data.dSpacing :"normal",
                color:data.dColor,
                fontSize:data.dSize,
                textAlign:data.dAlignment,
                fontWeight:data.dWeight,
                ...selectorPaddingMargin("padding",data.dPaddingSelect,data.dPadding),
                ...selectorPaddingMargin("margin",data.dMarginSelect,data.dMargin)
              }}
              >
                { description }
            </div>
        </div>
      </div>
    </div>
  )
}
