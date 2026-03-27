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
    <div ref={slide} className="flex cursor-pointer w-fit">
        <img
          loading="lazy"
          src={url}
          alt={alt}
          className={`w-[60px] h-[60px] xl:h-[80px] xl:w-[80px] rounded m-0 border-solid object-cover shadow bg-[#F2F2F2] transition duration-1000 ease-in-out  ${active?"opacity-100 border-white border-2":"opacity-80"}`}
          onClick={showSlide}
        />

    </div>
  )
}

export default MiniatureSlide