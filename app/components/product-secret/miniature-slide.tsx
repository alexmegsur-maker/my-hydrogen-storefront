import { useEffect, useRef, useState } from "react";
import type { AnymatchPattern } from "vite";

type MiniatureSlideProps={
  index:number;
  active:boolean;
  url:string;
  alt:string;
  show:boolean;
  changeShow:(el:boolean)=>void;
  swiper:any;
}

function MiniatureSlide (props:MiniatureSlideProps){
  const {swiper,index,active,url,alt,show,changeShow} = props
  const slide = useRef(null)
  const showSlide=()=>{
    if(show){
      changeShow(false)
      setTimeout(()=>{
        swiper.slideTo(index)
      },250)
    }
  }

  return(
    <div ref={slide} className="flex cursor-pointer  max-w-[102px] e2e-button-gallery-thumbnail-0">
      <div className="m-1 w-full">
        <img
          loading="lazy"
          src={url}
          alt={alt}
          width="240"
          height="160"
          className={`w-full h-[48px] max-w-[102px] xl:h-[85px] m-0 border-solid object-cover shadow bg-[#F2F2F2] transition duration-1000 ease-in-out  ${active?"opacity-100 border-white border-2":"opacity-50"}`}
          onClick={showSlide}
        />

      </div>
    </div>
  )
}

export default MiniatureSlide