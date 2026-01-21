import { useState } from "react";
import { Link } from "react-router";
type LinkCollectionProps = {
  isMobile:boolean;
  url:string;
  preposition:string;
  title:string;
  active:boolean;
  color:string;
  hoverColor:string;
  fontSize:string;
  fontFamily:string
};

function LinkCollection(props:LinkCollectionProps){
  const {isMobile,url,preposition,title,active,color,hoverColor,fontSize,fontFamily}= props
  const [isHovered, setIsHovered]=useState(false)
  
  return (
    <div className={`flex absolute top-0 w-full items-center justify-center  ${ active ? "opacity-100 z-[2]":"opacity-0 z-[1]"}`}>
      <Link
        to={url}
        onMouseEnter={()=>setIsHovered(true)}
        onMouseLeave={()=>setIsHovered(false)}
        aria-label="view-all Sillas products"
        data-context="products-cta-chairs-viewall"
        className="group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  border-transparent bg-transparent py-3 px-6 "
        style={{
          fontSize:isMobile ? "16px":fontSize,
          color:isHovered ? hoverColor : color,
          fontFamily:fontFamily,
        }}
      >
        Ver todas {preposition && preposition} {title}
        <div className="flex items-center justify-content colour-icons-on-light group-hover:colour-icons-dark-grey group-disabled:colour-icons-grey pointer-events-none w-[24px] h-[20px]">
          <svg
            width="24"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.79612 4.64645C10.0091 4.45118 10.3545 4.45118 10.5675 4.64645L13.8402 7.64645C14.0533 7.84171 14.0533 8.15829 13.8402 8.35355L10.5675 11.3536C10.3545 11.5488 10.0091 11.5488 9.79612 11.3536C9.58311 11.1583 9.58311 10.8417 9.79612 10.6464L12.1377 8.5H2.54545C2.24421 8.5 2 8.27614 2 8C2 7.72386 2.24421 7.5 2.54545 7.5H12.1377L9.79612 5.35355C9.58311 5.15829 9.58311 4.84171 9.79612 4.64645Z"
              fill="currentColor"
              className="colour-icons-on-light group-hover:colour-icons-dark-grey group-disabled:colour-icons-grey "
            ></path>
          </svg>
        </div>
      </Link>
    </div>
  )
}
export default LinkCollection