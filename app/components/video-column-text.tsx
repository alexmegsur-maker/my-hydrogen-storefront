import {createSchema, type HydrogenComponentProps} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useHoverStore } from "~/sections/video-banner/useHoverStore";
import "~/styles/video-banner.css"

export interface VideoColumnProps extends  HydrogenComponentProps{
  title:string;
  description:string;
  heading:string;
  showSep:boolean;
}

export function VideoColumnText(props:VideoColumnProps){
  const [hover,setHover]= useState(false)
  const [def,setDef]=useState(false)
  
  const iHover = useHoverStore((state)=>state.active)

  const {
    title,
    description,
    heading,
    showSep,
  } = props;
  
  useEffect(()=>{
    if(iHover===false){
      setHover(false);
      setDef(true)
    }
    if(iHover){
      setDef(false)
    }
  },[iHover])

  const hoverContainerEnter=()=>{
    setHover(true) 
    setTimeout(()=>{
      setDef(true)
    },100)
  }
  const hoverContainerLeave=()=>{
    setHover(false)
    setDef(false)
  }
  
  return (
    <>
    <div  
      onMouseEnter={hoverContainerEnter} 
      onMouseLeave={hoverContainerLeave} 
      className={ ` h-full relative hidden lg:flex overflow-hidden p-8 border-0 border-solid border-r colour-border-medium-grey lg:pb-10 2xl:pb-20 justify-end flex-col transition-all duration-500 cursor-default ${hover ? "bg-black/40 backdrop-blur-[4px] h-full w-full":""}`  }  >
      { heading != "" && (
        <h2 
          className="display-2 font-normal absolute top-0 lg:top-8 2xl:top-1/2 2xl:pb-16 3xl:pb-0 left-8 2xl:-translate-y-1/2 colour-text-on-colour-primary"
          dangerouslySetInnerHTML={{ __html:heading }}
        />
          
        
      )}
      <div className="">
        <div style={{ opacity: 1, transform: "none", transformOrigin: "50% 50% 0px" }}>
          <div className={`fade-text colour-text-on-colour-primary ${def ? "visible":""}`}>
            <h3 
              className="headline-2" 
              style={{ transform: "none", transformOrigin: "50% 50% 0px" }}
              dangerouslySetInnerHTML={{__html:title}}
              />
            <div className={hover?"":"hidden"} style={{ transformOrigin:"50% 50% 0px" }}>
              <p 
                className="mt-4 body-lg"
                dangerouslySetInnerHTML={{ __html:description }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={`lg:hidden ${heading !="" ? 'pb-10':'py-10'} ${showSep && ' border-t border-solid border-0 colour-border-medium-grey'}`}>
      {heading !="" &&(
        <h2 
          className="pb-10 display-2 font-normal text-[2.5rem]"
          dangerouslySetInnerHTML={{ __html:heading }}
          />
      )}
      <h3 
        className="headline-2 text-[1.5rem]"
        dangerouslySetInnerHTML={{ __html:title }}
        />
    </div>
    </>
  )
}

export default VideoColumnText;

export const schema = createSchema({
  type:"video-column-text",
  title:"Video Column Text",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:"text",
          name:"heading",
          label:"Heading",
        },
        {
          type:"text",
          name:"title",
          label:"Title",
        },
        {
          type:"text",
          name:"description",
          label:"Description",
        },
      ],
    },
    {
      group:"desktop",
      inputs:[
        {
          type:"text",
          name:"hsize",
          label:"heading fontsize"
        }
      ]
    },
    {
      group:"mobile",
      inputs:[
        {
          type:"switch",
          label:"mostrar separador",
          name:"showSep",
          defaultValue:true
        }
      ]
    },
  ],
});
