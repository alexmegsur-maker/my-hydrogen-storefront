import type { ProductQuery } from "storefront-api.generated";
import { useEffect, useState, type CSSProperties } from "react";
import { useCrossell } from "~/stores/crosssellStore";
import { selectorPaddingMargin, setFecha, truncate } from "~/utils/general";
import type { CrossellProduct } from "~/types/crosssell";
import { checkPrice } from "~/utils/product";
import LateralCollection from "./lateral-collection";
import { useIsMobile } from "~/hooks/use-is-mobile";

interface CrossellProductProps {
  producto: ProductQuery["product"];
  position: "start" | "middle" | "end";
  ptColor: string;
  ptSize: string;
  ptFamily: string;
  ptWeight: string;
  ppColor: string;
  ppSize: string;
  ppFamily: string;
  ppWeight: string;
  plColor: string;
  plSize: string;
  pbColor: string;
  pbHoverColor: string;
  pbCheckedColor: string;
  pbBorderColor: string;
    bgColor:string;
  lcPaddingSelect:string;
  lcPaddingText:string;
  lcMarginSelect:string;
  lcMarginText:string;
  brColor:string;
  brSize:string;
  brLetter:number;
  brUpper:boolean;
  brFamily:string;
  brPaddingSelect:string;
  brPaddingText:string;
  brMarginSelect:string;
  brMarginText:string;
  brWeight:string;
  ntColor:string;
  ntSize:string;
  ntLetter:number;
  ntUpper:boolean;
  ntFamily:string;
  ntPaddingSelect:string;
  ntPaddingText:string;
  ntMarginSelect:string;
  ntMarginText:string;
  ntWeight:string;
  lcTColor:string;
  lcTSize:string;
  lcTLetter:number;
  lcTUpper:boolean;
  lcTFamily:string;
  lcTPaddingSelect:string;
  lcTPaddingText:string;
  lcTMarginSelect:string;
  lcTMarginText:string;
  lcTWeight:string;
  lcPColor:string;
  lcPSize:string;
  lcPLetter:number;
  lcPUpper:boolean;
  lcPFamily:string;
  lcPPaddingSelect:string;
  lcPPaddingText:string;
  lcPMarginSelect:string;
  lcPMarginText:string;
  lcPWeight:string;
  lcDColor:string;
  lcDSize:string;
  lcDFamily:string;
  lcDWeight:string;
  lcStColor:string;
  lcStSize:string;
  lcStLetter:number;
  lcStUpper:boolean;
  lcStFamily:string;
  lcStPaddingSelect:string;
  lcStPaddingText:string;
  lcStMarginSelect:string;
  lcStMarginText:string;
  lcStWeight:string;
  lcEtColor:string;
  lcEvColor:string;
  lcESize:string;
  lcEFamily:string;
  lcEWeight:string;
}

export default function CrossellProduct(props: CrossellProductProps) {
  const {
    producto,
    position,
    ptColor,
    ptSize,
    ptFamily,
    ptWeight,
    ppColor,
    ppSize,
    ppFamily,
    ppWeight,
    plColor,
    plSize,
    pbColor,
    pbHoverColor,
    pbCheckedColor,
    pbBorderColor,
    bgColor,
    lcPaddingSelect,
    lcPaddingText,
    lcMarginSelect,
    lcMarginText,
    brColor,
    brSize,
    brLetter,
    brUpper,
    brFamily,
    brPaddingSelect,
    brPaddingText,
    brMarginSelect,
    brMarginText,
    brWeight,
    ntColor,
    ntSize,
    ntLetter,
    ntUpper,
    ntFamily,
    ntPaddingSelect,
    ntPaddingText,
    ntMarginSelect,
    ntMarginText,
    ntWeight,
    lcTColor,
    lcTSize,
    lcTLetter,
    lcTUpper,
    lcTFamily,
    lcTPaddingSelect,
    lcTPaddingText,
    lcTMarginSelect,
    lcTMarginText,
    lcTWeight,
    lcPColor,
    lcPSize,
    lcPLetter,
    lcPUpper,
    lcPFamily,
    lcPPaddingSelect,
    lcPPaddingText,
    lcPMarginSelect,
    lcPMarginText,
    lcPWeight,
    lcDColor,
    lcDSize,
    lcDFamily,
    lcDWeight,
    lcStColor,
    lcStSize,
    lcStLetter,
    lcStUpper,
    lcStFamily,
    lcStPaddingSelect,
    lcStPaddingText,
    lcStMarginSelect,
    lcStMarginText,
    lcStWeight,
    lcEtColor,
    lcEvColor,
    lcESize,
    lcEFamily,
    lcEWeight,
  } = props;
  const [hover, setHover] = useState(false);
  const [check, setCheck] = useState(false);
  const [show, setShow] = useState(false);
  const [space, setSpace] = useState("");
  const image = producto.featuredImage;
  const price = producto.selectedOrFirstAvailableVariant.price;
  const addCrossell = useCrossell((state) => state.addCrossell);
  const addSelectedProduct = useCrossell((state) => state.addSelected);
  const resetSelecteds = useCrossell((state) => state.resetSelecteds);
  const isMobile = useIsMobile(600);
  
  useEffect(() => {
    const media = producto.media.nodes.map((elm) => {
      return { url: elm.previewImage.url, alt: elm.previewImage.altText };
    });

    const productoCross = {
      id: producto.id,
      title: producto.title,
      handle: producto.handle,
      description: producto.description,
      media: media,
      especificaciones: producto.especificaciones?.value,
      variantId: producto.variants.nodes[0].id,
      price: producto.variants.nodes[0].price.amount,
      comparePrice: producto.variants.nodes[0].compareAtPrice?.amount,
      available: producto.variants.nodes[0].availableForSale,
      tooltip: producto.tooltip?.value,
      inventory: producto.variants.nodes[0].quantityAvailable,
      fecha: producto.publishedAt.split("T")[0],
      fechaReserva:
        producto.fechaReserva?.value && setFecha(producto.fechaReserva.value),
      selector: null,
    } as CrossellProduct;
    const cross = {
      id: `crossell-${producto.handle}`,
      title: "",
      products: [productoCross],
      selecteds: [],
    };
    addCrossell(cross);
  }, []);

  useEffect(() => {
    switch (position) {
      case "start":
        setSpace("0 0 1.2rem 0");
        break;
      case "middle":
        setSpace("1.2rem 0");
        break;
      case "end":
        setSpace("1.2rem 0 0 0");
        break;
      default:
        setSpace("1.2rem 0");
        break;
    }
  }, [position]);

  useEffect(() => {
    if (check) {
      addSelectedProduct(`crossell-${producto.handle}`, producto?.id, 1);
    } else {
      resetSelecteds(`crossell-${producto.handle}`);
    }
  }, [check]);

  return (
    <>
      <label
        htmlFor={`checkbox-${producto?.handle}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="acc-item flex items-center justify-between"
        style={{
          padding: space,
          borderBottom:
            position != "end" ? "1px solid rgba(255,255,255,0.4)" : "unset",
        }}
      >
        <div className="acc-left flex items-center gap-[1.2rem]">
          <div
            className="acc-img w-[44px] h-[44px] rounded-md"
            style={{
              filter: hover ? "grayscale(0)" : "grayscale(1)",
              transition: "filter 0.4s",
              border: "1px solid  rgba(255,255,255,0.05)",
            }}
          >
            {image && (
              <img src={image.url} alt={image.altText ?? producto.title} />
            )}
          </div>
          <div className="acc-info flex flex-col gap-[5px]">
            <span
              className="acc-title"
              style={{
                fontFamily: ptFamily,
                fontSize: ptSize,
                fontWeight: ptWeight,
                color: ptColor,
                transition: "color 0.3s",
              }}
            >
              {producto.title}
            </span>
            <div className="acc-meta flex items-center gap-[12px]">
              <span
                className="acc-price"
                style={{
                  fontSize: ppSize,
                  fontFamily: ppFamily,
                  color: ppColor,
                  fontWeight: ppWeight,
                }}
              >
                + {checkPrice(price.amount)} €
              </span>
              <span
                className="acc-link"
                onClick={(e) => {
                  e.stopPropagation(); 
                  e.preventDefault();
                  setShow(true);
                }}
                style={{
                  fontSize: plSize,
                  color: plColor,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  cursor: "pointer",
                  transition: "color 0.3s",
                }}
              >
                Saber más
              </span>
            </div>
          </div>
        </div>
        <button
          className="acc-add w-[28px] h-[28px] rounded-full flex justify-center items-center cursor-pointer font-light "
          style={{
            transition: "all 0.3s ease",
            color: check || hover ? "#000" : pbColor,
            background: check
              ? pbCheckedColor
              : hover
                ? pbHoverColor
                : "transparent",
            border: `1px solid ${pbBorderColor}`,
          }}
        >
          <input
            className="absolute opacity-0 cursor-pointer"
            type="checkbox"
            id={`checkbox-${producto?.handle}`}
            onChange={() => setCheck((state) => !state)}
            data-productId={producto?.id}
            value={producto?.id}
            name={producto?.id}
            checked={check}
          />
          {check ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-3 w-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          ) : (
            "+"
          )}
        </button>
      </label>

      <LateralCollection
        title="Accesorios"
        confirmBtn={false}
        show={show}
        close={() => setShow(false)}
        style={
          {
            background: bgColor,
          }
        }
        estilos={{
          "--brColor":brColor,
          "--brSize":brSize,
          "--brLetter":brLetter,
          "--brUpper":brUpper,
          "--brFamily":brFamily,
          "--brPaddingSelect":brPaddingSelect,
          "--brPaddingText":brPaddingText,
          "--brMarginSelect":brMarginSelect,
          "--brMarginText":brMarginText,
          "--brWeight":brWeight,
          "--ntColor":ntColor,
          "--ntSize":ntSize,
          "--ntLetter":ntLetter,
          "--ntUpper":ntUpper,
          "--ntFamily":ntFamily,
          "--ntPaddingSelect":ntPaddingSelect,
          "--ntPaddingText":ntPaddingText,
          "--ntMarginSelect":ntMarginSelect,
          "--ntMarginText":ntMarginText,
          "--ntWeight":ntWeight,
        }as CSSProperties}
      >
        <div
          className="drawer-scroll-area overflow-y-auto"
          style={
            {
              ...selectorPaddingMargin("padding",lcPaddingSelect,!isMobile?lcPaddingText:"1.5rem"),
              ...selectorPaddingMargin("padding",lcMarginSelect,lcMarginText)
            }
          }
        >
          <h2
            className="drawer-header-title"
            style={
              {
                color: lcTColor,
                fontFamily: lcTFamily,
                fontSize: lcTSize,
                textTransform:lcTUpper?"uppercase":"unset",
                letterSpacing:lcTLetter>0 ?`${lcTLetter}px`:"normal",
                fontWeight: lcTWeight,
                ...selectorPaddingMargin("padding",lcTPaddingSelect,lcTPaddingText),
                ...selectorPaddingMargin("margin",lcTMarginSelect,lcTMarginText),
              }
            }
          >
            {producto.title}
          </h2>
          <div
            className="pdp-price"
            style={{
              color: lcPColor,
              fontFamily: lcPFamily,
              fontSize: lcPSize,
              textTransform:lcPUpper?"uppercase":"unset",
              letterSpacing:lcPLetter>0 ?`${lcPLetter}px`:"normal",
              fontWeight: lcPWeight,
              ...selectorPaddingMargin("padding",lcPPaddingSelect,lcPPaddingText),
              ...selectorPaddingMargin("margin",lcPMarginSelect,lcPMarginText),
            }}
          >
            {checkPrice(producto.selectedOrFirstAvailableVariant?.price?.amount)}€
          </div>
          <div className="acc-ficha-gallery grid gap-[10px] grid-cols-2 mb-[2.5rem]">
            {producto.media.nodes?.map((i,index) => {
              if(index<4){
                const imageUrl = i.previewImage.url;
                return (
                  <div
                    className="acc-ficha-img w-full h-[140px] bg-cover bg-center md:grayscale hover:grayscale-0 rounded-md overflow-hidden"
                    style={{
                      transition: "all 0.4s ease",
                    }}
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              }
              return null
            })}
          </div>
          <p
            className="acc-ficha-desc"
            style={
              {
                fontSize:lcDSize,
                color: lcDColor,
                lineHeight: "1.7",
                fontWeight: lcDWeight,
                fontFamily:lcDFamily
              }
            }
          >
            {truncate(producto.description,50) }
          </p>
          <h3
            className="acc-section-title"
            style={
              {
                color: lcStColor,
                fontFamily: lcStFamily,
                fontSize: lcStSize,
                textTransform:lcStUpper?"uppercase":"unset",
                letterSpacing:lcStLetter>0 ?`${lcStLetter}px`:"normal",
                fontWeight: lcStWeight,
                ...selectorPaddingMargin("padding",lcStPaddingSelect,lcStPaddingText),
                ...selectorPaddingMargin("margin",lcStMarginSelect,lcStMarginText),
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }
            }
          >
            Especificaciones
          </h3>
          <ul className="acc-specs-list flex flex-col gap-[0.5rem] list-none">
            {producto.especificaciones?.value.split("-").map((i, index) => {
              let splitValue = i.split(":");
              
              if(splitValue[0]!=""){
                return (
                  <li
                    key={index}
                    className="flex justify-between items-baseline"
                    style={
                      {
                        borderBottom:"1px dashed rgba(255,255,255,0.03)",
                        fontSize:lcESize,
                        fontFamily:lcEFamily,
                        fontWeight:lcEWeight
                      }
                    }
                  >
                    <span
                      className="spec-lbl"
                      style={
                        {
                          color:lcEtColor
                        }
                      }
                    >
                      {splitValue[0].replace("\\n","")}
                    </span>
                    {
                      splitValue[1] &&
                      <span
                        className="spec-val"
                        style={
                          {
                            color:lcEvColor,
                            fontWeight:"500",
                            textAlign:"right"
                          }
                        }
                      >
                        {splitValue[1].replace("\\n","")}
                      </span>
                    }
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </LateralCollection>
    </>
  );
}
