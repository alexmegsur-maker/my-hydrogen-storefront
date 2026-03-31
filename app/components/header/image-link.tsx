import { useEffect, useState, type CSSProperties} from "react";
import type {HeaderImageLinkProps} from "~/types/header"
import { selectorPaddingMargin } from "~/utils/general";
import { Link } from "~/components/link";
import type { WeaverseImage } from "@weaverse/hydrogen";
import { Image } from "@shopify/hydrogen";
import { useIsMobile } from "~/hooks/use-is-mobile";

type ImageLinkData ={
  img:WeaverseImage;
  img2:WeaverseImage;
  img3:WeaverseImage;
}

export function ImageLinkHeader(props:HeaderImageLinkProps){
  const{ 
    type,
    position,
    heading,
    changeDirection,
    img,
    mbImg,
    link,
    html1,
    img2,
    mbImg2,
    link2,
    html2,
    img3,
    mbImg3,
    link3,
    html3,
    space,
    color,
    anchor,
    size,
    paddingSelect,
    padding,
    marginSelect,
    margin,
    customClass,
    
  } = props;
  const isMobile = useIsMobile(600);

 
  const [data, setData]= useState<ImageLinkData>(
    {
      img:img,
      img2:img2,
      img3:img3,
    }
  )

  const linkStyle = {
    ...selectorPaddingMargin("padding",paddingSelect,padding),
    ...selectorPaddingMargin("margin",marginSelect,margin),
  } as CSSProperties

  const imgStyle={
    height : !isMobile ? anchor == "height" ? `${size}px`:"auto": "auto",
    width : !isMobile? anchor == "width" ? `${size}px`:"auto":"auto",
    
  } as CSSProperties

  useEffect(()=>{
    if( isMobile){
      setData({
        img:mbImg,
        img2:mbImg2,
        img3:mbImg3,
      })
    }

  },[])
  
  return(
    <div 
      className={`relative ${customClass ? customClass:""}`}
      style={{
        background:color,
        display:"flex",
        flexDirection:!isMobile ? changeDirection ? "row":"column":"column",
        gap:space
      }}
      >
      {data.img && (
        <Link to={link} style={linkStyle}>
          <Image
            data={data.img}
            sizes="auto"
            className="mx-auto"
            style={imgStyle}
            width={data.img.width}
            height={data.img.height}
          />
          <span dangerouslySetInnerHTML={{__html:html1}}></span>
        </Link>
      )}
      {data.img2 && (
        <Link to={link2} style={linkStyle}>
          <Image
            data={data.img2}
            sizes="auto"
            className="mx-auto"
            style={imgStyle}
            width={data.img2.width}
            height={data.img2.height}
          />

          <span dangerouslySetInnerHTML={{__html:html2}}></span>
        </Link>
      )}
      {data.img3  && (
        <Link to={link3} style={linkStyle}>
          <Image
            data={data.img3}
            sizes="auto"
            className="mx-auto"
            style={imgStyle}
            width={data.img3.width}
            height={data.img3.height}
          />
          
          <span dangerouslySetInnerHTML={{__html:html3}}></span>
        </Link>
      )}
    </div>
  )
}
