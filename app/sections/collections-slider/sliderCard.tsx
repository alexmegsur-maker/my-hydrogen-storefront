import { Link } from "react-router"
import CheckoutButton from "~/components/checkOutButton";

type SliderCardProps = {
  isMobile:boolean;
  space:number;
  tag?:string;
  tagColor:string;
  tagSize:string;
  tagBgColor:string;
  tagRadius:number;
  tagUppercase:boolean;
  tagWeight:number;
  url:string;
  imagen:string;
  title:string;
  tSize:string;
  tColor:string;
  tWeight:number;
  tFamily:string;
  description?:string;
  dSize:string;
  dColor:string;
  dWeight:number;
  dFamily:string;
  bSize:string;
  bColor:string;
  bBgColor:string;
  bRadius:number;
  bUppercase:boolean;
  bWeight:number;
  page?:string;
  pText:string;
  pColor:string;
  pSize:string;
  pFamily:string;
  variantId:string;
  cRadius:number;
  cColor:string;
}


function SliderCard(props:SliderCardProps){
  const { 
    isMobile,
    space,
    tag,
    tagSize,
    tagColor,
    tagBgColor,
    tagRadius,
    tagUppercase,
    tagWeight,
    url,
    imagen,
    title,
    tSize,
    tColor,
    tWeight,
    tFamily,
    description,
    dSize,
    dColor,
    dWeight,
    dFamily,
    bSize,
    bColor,
    bBgColor,
    bRadius,
    bUppercase,
    bWeight,
    page,
    pText,
    pColor,
    pSize,
    pFamily,
    variantId,
    cRadius,
    cColor
    }= props
return(
  <div 
    className="relative w-[300px] lg:w-[348px] hover:lg:colour-surface-lightegrey border-box h-full flex flex-col p-4 pb-6 lg:pb-8 items-center gap-4 px-4 border border-solid "
    style={{
      marginRight:isMobile ? "unset": `${space}px`,
      borderColor:cColor,
      borderRadius:`${cRadius}px`
    }}
    >

    <div className="absolute left-[16px]">
      {tag && (
        <span 
          className="flex gap-1 px-3 items-center justify-center w-fit py-[2px] lg:py-1 "
          style={{
            fontSize:isMobile ? "0.75rem":tagSize,
            color:tagColor,
            background:tagBgColor,
            borderRadius:`${tagRadius}px`,
            textTransform:tagUppercase && "uppercase",
            fontWeight:tagWeight,
          }}
          >
          {tag}
        </span>
      )}
    </div>

    <div className="relative w-full flex justify-center items-center">
      <Link
        className="hidden lg:block absolute w-full h-full z-[1]"
        to={url}
        data-context={title}
        target="_blank"
        rel="noreferrer"
        aria-label={`comprar ${title}`}
      ></Link>
      <img
        loading="lazy"
        src={imagen}
        alt={title}
        width=""
        height=""
        className="object-contain object-center w-full h-full"
      />
    </div>

    <div className="relative text-center flex-1 flex flex-col gap-3 items-center justify-around lg:justify-between">
      <Link
        className="hidden lg:block absolute w-full h-full z-[1]"
        to={url}
        data-context={title}
        target="_blank"
        rel="noreferrer"
        aria-label={title}
      ></Link>

      <div>
        <h4 
          className="mb-2"
          style={{
            fontSize:isMobile ? "1.125rem":tSize,
            color:tColor,
            fontWeight:tWeight,
            fontFamily:tFamily,
          }}
          >
          {title}
        </h4>
        {description && (
          <p style={{
              fontSize:isMobile ? "1rem":dSize,
              color:dColor,
              fontWeight:dWeight,
              fontFamily:dFamily,
            }}>
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 items-center relative z-[1]">

        <CheckoutButton
          variantId={variantId}        
          clase="group box-border flex gap-2 items-center justify-center w-fit cursor-pointer  border-transparent  py-2 px-6  border-solid border"
          text="Comprar"
          quantity={1}
          style={{
            fontSize:isMobile ? "0.875rem":bSize,
            color:bColor,
            backgroundColor:bBgColor,
            borderRadius:bRadius,
            textTransform:bUppercase && "uppercase",
            fontWeight:bWeight,
          }}
        />
        {page && (
          <Link
            to={page}
            data-context="products-cta-chairs-titanevo-learnmore"
            className="group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  border-transparent bg-transparent text-cta-normal py-3 px-6 colour-text-primary hover:colour-text-secondary active:underline disabled:colour-text-disabled  "
            style={{
              color:pColor,
              fontSize:isMobile ? "0.875rem" : pSize,
              fontFamily:pFamily
            }}
          >
            {pText}
            <div className="flex items-center justify-content colour-icons-on-light group-hover:colour-icons-dark-grey group-disabled:colour-icons-grey  w-[24px] h-[20px]">
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
        )}
      </div>
    </div>
  </div>
)
}

export default SliderCard