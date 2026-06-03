import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";

interface ImageZoom extends HydrogenComponentProps{
  clase?:string;
  img:WeaverseImage;
  estilo?:CSSProperties;
  estiloImg?:CSSProperties;
}

function ImageZoom (props:ImageZoom){
  const {clase,img,estilo,estiloImg,children}=props
  return (
    <div className={clase} style={estilo}>
      <img 
        src={img.url}
        alt={img.altText}
        loading="lazy"
        style={{
          width:"100%",
          height:"100%",
          objectFit:"cover",
          ...estiloImg
        }}
      />
      {children}
    </div>
  )

}

export default ImageZoom