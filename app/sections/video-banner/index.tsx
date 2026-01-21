import {createSchema} from "@weaverse/hydrogen"
import { useHoverStore } from "./useHoverStore";
import type { HydrogenComponentProps, WeaverseImage, WeaverseVideo } from "@weaverse/hydrogen"
import React, { useState } from "react";
import "~/styles/video-banner.css"

interface VideoBanner extends HydrogenComponentProps{
  heading:string;
  mediaVideo:WeaverseVideo;
  prevImage:WeaverseImage;
  prevImagemb:WeaverseImage;
}

function  VideoBanner(props:VideoBanner){
  
  const setInitialHover = useHoverStore((state)=>state.changeActive)
  const {
    mediaVideo,
    prevImage,
    prevImagemb,
    children,
    ...rest
  }=props;
  const mouseEnter=()=>{
    setInitialHover(true)
  }
  const mouseLeave=()=>{
    setInitialHover(false)
  }

  return (
    <>
      <div className="hidden lg:block relative">
        <video className="w-full h-full lg:h-[650px] 2xl:h-[960px] object-cover hidden lg:block" 
          loop 
          autoPlay
          playsInline 
          muted
          preload="none" 
          poster={`${prevImage && prevImage.url}`} 
          >
            <source src={mediaVideo.url} type="video/webm"/>
            <source src={mediaVideo.url} type="video/mp4"/>
        </video>
        <div className="absolute z-[1] bottom-0 w-[100%] h-[100%] banner-gradient bg-[linear-gradient(180deg,rgba(0,0,0,0)_45.71%,#000000_84.72%)]"></div>
        <div className="absolute top-0 w-full h-full z-5">
          <div className="st-container h-full">
            <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} className="h-full grid grid-cols-3 border-0 border-solid border-l colour-border-medium-grey">
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden bg-black">
        <div className="sticky top-0 start-0">
          <video className="w-full h-full object-cover block lg:hidden" 
            autoPlay 
            loop 
            playsInline 
            muted
            preload="none" 
            poster={`${prevImagemb && prevImagemb.url}`} 
            style={{ width: "100%", opacity: 0.617778, transition: "opacity 0.2s ease-out" }}>
              <source src={mediaVideo.url} type="video/webm"/>
              <source src={mediaVideo.url} type="video/mp4"/>
          </video>
          <div className="shade"></div>
        </div>
        <div className="relative z-[1] colour-text-on-colour-primary -mt-8 px-4">
          {children}
        </div>
      </div>
    </>
    
  )
}
export default VideoBanner

export const schema = createSchema({
  type:"video-banner",
  title:"Video Banner",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:"video",
          name:"mediaVideo",
          label:"Video"
        },
      ],
    },
    {
      group:"Desktop",
      inputs:[
        {
          type:"image",
          name:"prevImage",
          label:"poster"
        },
      ],
    },
    {
      group:"Mobile",
      inputs:[
        {
          type:"image",
          name:"prevImagemb",
          label:"Poster"
        },
      ],
    },
  ],
  childTypes:["video-column-text"],
})