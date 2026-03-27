import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Section } from "~/components/section";
import { useVariantOptions } from "./filter-step";
import { useEffect, useState, type CSSProperties } from "react";
import { useCurrentProduct } from "~/stores/currentProduct";
import LateralCollection from "~/components/product-j/lateral-collection";
import "~/styles/filter-option.css";
import { renderRichText, selectorPaddingMargin } from "~/utils/general";

interface FilterOptionProps extends HydrogenComponentProps {
  title: string;
  handle: string;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  tColor:string;
  tSize:string;
  tLetter:number;
  tUpper:boolean;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  bColor:string;
  bSize:string;
  bFamily:string;
  vtColor:string;
  vtSize:string;
  vtLetter:number;
  vtUpper:boolean;
  vtFamily:string;
  vtPaddingSelect:string;
  vtPaddingText:string;
  vtMarginSelect:string;
  vtMarginText:string;
  vtWeight:string;
  vdColor:string;
  vdSize:string;
  vdLetter:number;
  vdUpper:boolean;
  vdFamily:string;
  vdPaddingSelect:string;
  vdPaddingText:string;
  vdMarginSelect:string;
  vdMarginText:string;
  vdWeight:string;
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
  tllTColor:string;
  tllTSize:string;
  tllTLetter:number;
  tllTUpper:boolean;
  tllTFamily:string;
  tllTPaddingSelect:string;
  tllTPaddingText:string;
  tllTMarginSelect:string;
  tllTMarginText:string;
  tllTWeight:string;
  tllDColor:string;
  tllDSize:string;
  tllDLetter:number;
  tllDUpper:boolean;
  tllDFamily:string;
  tllDPaddingSelect:string;
  tllDPaddingText:string;
  tllDMarginSelect:string;
  tllDMarginText:string;
  tllDWeight:string;
  tllStColor:string;
  tllStSize:string;
  tllStLetter:number;
  tllStUpper:boolean;
  tllStFamily:string;
  tllStPaddingSelect:string;
  tllStPaddingText:string;
  tllStMarginSelect:string;
  tllStMarginText:string;
  tllStWeight:string;
  tllNColor:string;
  tllNSize:string;
  tllNFamily:string;
  tllNWeight:string;
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
  lcFtColor:string;
  lcFvColor:string;
  lcFSize:string;
  lcFFamily:string;
  lcFWeight:string;
}

export default function FilterOption(props: FilterOptionProps) {
  const { 
    title, 
    handle,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    bColor,
    bSize,
    bFamily,
    vtColor,
    vtSize,
    vtLetter,
    vtUpper,
    vtFamily,
    vtPaddingSelect,
    vtPaddingText,
    vtMarginSelect,
    vtMarginText,
    vtWeight,
    vdColor,
    vdSize,
    vdLetter,
    vdUpper,
    vdFamily,
    vdPaddingSelect,
    vdPaddingText,
    vdMarginSelect,
    vdMarginText,
    vdWeight,
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
    tllTColor,
    tllTSize,
    tllTLetter,
    tllTUpper,
    tllTFamily,
    tllTPaddingSelect,
    tllTPaddingText,
    tllTMarginSelect,
    tllTMarginText,
    tllTWeight,
    tllDColor,
    tllDSize,
    tllDLetter,
    tllDUpper,
    tllDFamily,
    tllDPaddingSelect,
    tllDPaddingText,
    tllDMarginSelect,
    tllDMarginText,
    tllDWeight,
    tllStColor,
    tllStSize,
    tllStLetter,
    tllStUpper,
    tllStFamily,
    tllStPaddingSelect,
    tllStPaddingText,
    tllStMarginSelect,
    tllStMarginText,
    tllStWeight,
    tllNColor,
    tllNSize,
    tllNFamily,
    tllNWeight,
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
    lcFtColor,
    lcFvColor,
    lcFSize,
    lcFFamily,
    lcFWeight, 
    ...rest } = props;
  const [variantSelected, setVariantSelected] = useState({
    button: "",
    guia: [],
    options: [],
  });
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [recommendation, setRecommendation] = useState("REGULAR");
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [show, setShow] = useState(false);

  const variantOptions = useVariantOptions((state) => state.varOptions);
  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const setVariant = useCurrentProduct((state) => state.setVariant);
  const currentVariant = currentProduct?.selectedVariant;
  const optionsCurrent = currentProduct?.options.find(
    (e) => e.name.toLowerCase() === handle.toLowerCase(),
  );

  useEffect(() => {
    if (variantOptions) {
      try {
        const data = JSON.parse(variantOptions) as any;
        const match = data.edges?.find(
          (elm) => elm.node.handle.toLowerCase() === handle.toLowerCase(),
        );
        if (match) {
          const node = match.node;

          const button = node.fields.find((e) => e.key == "button");
          let guia = node.fields.find((e) => e.key == "guia");
          let options = node.fields.find((e) => e.key == "material");

          setVariantSelected({
            button: button?.value || "",
            guia: guia?.reference?.fields || [],
            options: options?.references?.edges || [],
          });
        }
      } catch (error) {
        console.error("Error parseando variantOptions:", error);
      }
    }
  }, [variantOptions, handle]);

  useEffect(() => {
    if (height > 187 || weight > 104) {
      setRecommendation("MONARCH XL");
    } else {
      setRecommendation("REGULAR");
    }
  }, [height, weight]);

  useEffect(() => {
    if (currentVariant?.selectedOptions?.length > 1) {
      const option = currentVariant.selectedOptions?.find(
        (i) => i.name.toLowerCase() === handle.toLowerCase(),
      );
      setSelected(option.value.toLowerCase());
    } else {
      setSelected(null);
    }
  }, [currentVariant]);

  const changeVariant = (elm: string, handElm: string) => {
    const currProdVar = currentProduct.variants.nodes;
    const variantesElm = [...document.querySelectorAll(".option-item-variant")];
    let getActive = null;

    variantesElm.map((e) => {
      const element = e as HTMLElement;
      if (
        element.dataset.variante != handElm &&
        element.dataset.active == "true"
      ) {
        getActive = element.dataset;
      }
    });

    if (currProdVar.length > 1) {
      let getSelectedsOption = null;
      currProdVar.map((i) => {
        let aux = i.selectedOptions.find((e) => e.value.toLowerCase() == elm);
        let aux2 = i.selectedOptions.find(
          (e) => e.value.toLowerCase() == getActive.varianteOption,
        );
        if (aux && aux2) {
          getSelectedsOption = i;
        }
      });
      if (getSelectedsOption) {
        setVariant(getSelectedsOption);
      }
    }
  };

  return (
    <Section {...rest}>
      <div 
        className="config-section"
        style={{
          ...selectorPaddingMargin("padding",paddingSelect,paddingText),
          ...selectorPaddingMargin("margin",marginSelect,marginText),
        }}
      >
        <div className="section-header flex justify-between items-baseline mb-[1.5rem]">
          <div
            className="config-label"
            style={{
              color:tColor,
              fontFamily:tFamily,
              fontSize:tSize,
              fontWeight:tWeight,
              textTransform:tUpper ?"uppercase":"unset",
              letterSpacing:`${tLetter}px`,
              ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
              ...selectorPaddingMargin("margin",tMarginSelect,tMarginText),
            }}
          >
            {title ? title : "Variant option"}
          </div>
          <span
            className="config-link cursor-pointer"
            onClick={() => setShow(true)}
            style={{
              color:bColor,
              fontFamily:bFamily,
              fontSize:bSize,
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              transition: "color 0.3s",
            }}
          >
            {variantSelected?.button}
          </span>
        </div>
        <div className="options-list flex flex-col gap-[0.5rem]">
          {variantSelected.options?.map((opt,index) => {
            const fields = opt.node.fields;
            const optTitle = fields?.find((e) => e.key == "title");
            const optDesc = fields?.find((e) => e.key == "description");
            const product = fields?.find((e) => e.key == "product");
            const active = product.value.toLowerCase() === selected;
            const isHovered = product.value.toLowerCase() === hoveredId;
            const notVariant = optionsCurrent?.optionValues.find(
              (e) => e.name.toLowerCase() == product.value.toLowerCase(),
            );
            return (
              <div
                key={index}
                className="option-item-variant active flex justify-between items-center cursor-pointer"
                onClick={() =>
                  changeVariant(
                    product.value.toLowerCase(),
                    handle.toLowerCase(),
                  )
                }
                onMouseEnter={() => setHoveredId(product.value.toLowerCase())}
                onMouseLeave={() => setHoveredId(null)}
                data-variante={handle.toLowerCase()}
                data-variante-option={product.value.toLowerCase()}
                data-active={active}
                style={{
                  padding:
                  isHovered && notVariant ? "1rem 0 1rem 10px" : "1rem 0",
                  borderBottom: "1px solid #ffffff08",
                  transition: "all 0.4s ease",
                  opacity: active || (isHovered && notVariant) ? "1" : "0.6",
                  cursor: !notVariant ? "not-allowed" : "pointer",
                }}
              >
                <div className="option-left flex flex-col gap-[4px]">
                  <span
                    className="option-title"
                    style={{
                      fontFamily: vtFamily,
                      fontSize: vtSize,
                      color: vtColor,
                      textTransform:vtUpper?"uppercase":"unset",
                      letterSpacing:vtLetter>0 ?`${vtLetter}px`:"normal",
                      fontWeight:
                        active || (isHovered && notVariant) ? vtWeight : "400",
                      ...selectorPaddingMargin("padding",vtPaddingSelect,vtPaddingText),
                      ...selectorPaddingMargin("margin",vtMarginSelect,vtMarginText),
                      transition: "all 0.3s",
                    }}
                  >
                    {optTitle?.value}
                  </span>
                  <span
                    className="option-desc"
                    style={{
                      fontFamily: vdFamily,
                      fontSize: vdSize,
                      color: vdColor,
                      textTransform:vdUpper?"uppercase":"unset",
                      letterSpacing:vdLetter>0 ?`${vdLetter}px`:"normal",
                      fontWeight: vdWeight,
                      ...selectorPaddingMargin("padding",vdPaddingSelect,vdPaddingText),
                      ...selectorPaddingMargin("margin",vdMarginSelect,vdMarginText),
                    }}
                  >
                    {optDesc?.value}
                  </span>
                </div>
                <div
                  className="selector-dot flex justify-center items-center"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: active ? vtColor : "transparent",
                    border: `1px solid ${active ? vtColor : "#52525B"} `,
                    boxShadow: active ? "0 0 10px #fff6" : "unset",
                    transition: "all 0.3s",
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      {handle.toLowerCase() == "talla" ? (
        <LateralCollection
          title={"SISTEMA DE AJUSTE"}
          confirmBtn={false}
          show={show}
          close={() => setShow(false)}
          style={{
            background: bgColor,
          }}
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
            className="flex flex-col gap-[3rem] h-[100%]"
            style={{
              flexGrow: 1,
              ...selectorPaddingMargin("padding",lcPaddingSelect,window.innerWidth>600?lcPaddingText:"1.5rem"),
              ...selectorPaddingMargin("margin",lcMarginSelect,lcMarginText),
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              <div
                id="cBox"
                style={{
                  width: "100px",
                  height: "140px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(255, 255, 255, 0.02)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.4s",
                  boxShadow: "none",
                  transform: "scale(1)",
                }}
              >
                <img
                  className="absolute"
                  src={currentProduct?.media?.nodes[0].previewImage?.url}
                  alt={currentProduct?.media?.nodes[0].previewImage?.altText}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "2px",
                    background: "#FFF",
                    boxShadow: "0 0 15px #FFF",
                    top: 0,
                    zIndex: 10,
                    animation: "scanLineAnim 3s infinite linear",
                  }}
                ></div>
                <span
                  style={{
                    zIndex: 10,
                    fontSize: "0.5rem",
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "2px",
                    fontFamily: "Montserrat",
                  }}
                >
                  ANALYZING...
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  id="sLbl"
                  style={{
                    color: tllTColor,
                    fontFamily: tllTFamily,
                    fontSize: tllTSize,
                    textTransform:tllTUpper?"uppercase":"unset",
                    letterSpacing:tllTLetter>0 ?`${tllTLetter}px`:"normal",
                    fontWeight: tllTWeight,
                    ...selectorPaddingMargin("padding",tllTPaddingSelect,tllTPaddingText),
                    ...selectorPaddingMargin("margin",tllTMarginSelect,tllTMarginText),
                    lineHeight: 1,
                  }}
                >
                  {recommendation}
                </span>
                <span
                  style={{
                    color: tllDColor,
                    fontFamily: tllDFamily,
                    fontSize: tllDSize,
                    textTransform:tllDUpper?"uppercase":"unset",
                    letterSpacing:tllDLetter>0 ?`${tllDLetter}px`:"normal",
                    fontWeight: tllDWeight,
                    ...selectorPaddingMargin("padding",tllDPaddingSelect,tllDPaddingText),
                    ...selectorPaddingMargin("margin",tllDMarginSelect,tllDMarginText),
                  }}
                >
                  CHASIS RECOMENDADO
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    paddingBottom: "5px",
                  }}
                >
                  <label
                    style={{
                    
                      color: tllStColor,
                      fontFamily: tllStFamily,
                      fontSize: tllStSize,
                      textTransform:tllStUpper?"uppercase":"unset",
                      letterSpacing:tllStLetter>0 ?`${tllStLetter}px`:"normal",
                      fontWeight: tllStWeight,
                      ...selectorPaddingMargin("padding",tllStPaddingSelect,tllStPaddingText),
                      ...selectorPaddingMargin("margin",tllStMarginSelect,tllStMarginText),
                    
                    }}
                  >
                    Estatura
                  </label>
                  <span
                    id="hTxt"
                    style={{
                      fontFamily: tllNFamily,
                      fontSize: tllNSize,
                      fontWeight: tllNWeight,
                      color: tllNColor,
                    }}
                  >
                    {height} CM
                  </span>
                </div>
                <input
                  type="range"
                  id="hIn"
                  min="150"
                  max="210"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  style={{
                    WebkitAppearance: "none",
                    outline: "none",
                    border: "none",
                    width: "100%",
                    cursor: "pointer",
                    accentColor: "#FFF",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    paddingBottom: "5px",
                  }}
                >
                  <label
                    style={{
                      color: tllStColor,
                      fontFamily: tllStFamily,
                      fontSize: tllStSize,
                      textTransform:tllStUpper?"uppercase":"unset",
                      letterSpacing:tllStLetter>0 ?`${tllStLetter}px`:"normal",
                      fontWeight: tllStWeight,
                      ...selectorPaddingMargin("padding",tllStPaddingSelect,tllStPaddingText),
                      ...selectorPaddingMargin("margin",tllStMarginSelect,tllStMarginText),
                    }}
                  >
                    Masa Corporal
                  </label>
                  <span
                    id="wTxt"
                    style={{
                      fontFamily: tllNFamily,
                      fontSize: tllNSize,
                      fontWeight: tllNWeight,
                      color: tllNColor,
                    }}
                  >
                    {weight} KG
                  </span>
                </div>
                <input
                  className="cursor-pointer"
                  type="range"
                  id="wIn"
                  min="50"
                  max="150"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  style={{
                    WebkitAppearance: "none",
                    outline: "none",
                    border: "none",
                    width: "100%",
                    cursor: "pointer",
                    accentColor: "#FFF",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                fontFamily: "Montserrat",
              }}
            >
              <div>
                <small
                  style={{
                    display: "block",
                    fontSize: "0.6rem",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: tllStColor,
                    fontFamily: tllStFamily,
                  }}
                >
                  Pistón Hidráulico
                </small>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    marginTop: "4px",
                    color:tllNColor,
                  }}
                >
                  Clase 4 (150kg)
                </p>
              </div>
              <div>
                <small
                  style={{
                    display: "block",
                    fontSize: "0.6rem",
                    color: tllStColor,
                    fontFamily: tllStFamily,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Estructura
                </small>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    marginTop: "4px",
                    color:tllNColor,
                  }}
                >
                  Acero Forjado
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.7rem",
                color: tllStColor,
                lineHeight: "1.6",
                marginTop: "auto",
                fontFamily: "Montserrat",
                fontStyle: "italic",
              }}
            >
              *Ambos modelos garantizan la misma certificación de carga (150kg).
              El chasis XL optimiza la ergonomía para envergaduras superiores.
            </p>
          </div>
        </LateralCollection>
      ):
      <LateralCollection
          title={variantSelected?.guia.find((e)=>e.key=="title")?.value}
          confirmBtn={false}
          show={show}
          close={() => setShow(false)}
          style={{
            background: bgColor,
          }}
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
         <div className="drawer-scroll-area overflow-y-auto" 
          style={{
            ...selectorPaddingMargin("padding",lcPaddingSelect,window.innerWidth>600?lcPaddingText:"1.5rem"),
            ...selectorPaddingMargin("padding",lcMarginSelect,lcMarginText)
          }}
          >
            <h2 
              className="drawer-header-title" 
              style={{
                color: lcTColor,
                fontFamily: lcTFamily,
                fontSize: lcTSize,
                textTransform:lcTUpper?"uppercase":"unset",
                letterSpacing:lcTLetter>0 ?`${lcTLetter}px`:"normal",
                fontWeight: lcTWeight,
                ...selectorPaddingMargin("padding",lcTPaddingSelect,lcTPaddingText),
                ...selectorPaddingMargin("margin",lcTMarginSelect,lcTMarginText),
              
              }}
              >
                {variantSelected.guia?.find((e)=>e.key ==="nav_title")?.value}
            </h2>
            
            <div className="acc-ficha-gallery grid gap-[10px] grid-cols-2 mb-[2.5rem]">
              {variantSelected.guia?.find((e)=>e.key=="imagenes")?.imagenes?.edges.map((i)=>{
                const imageUrl=i.node.image.url;
                return(  
                  <div 
                    className="acc-ficha-img w-full h-[140px] bg-cover bg-center md:grayscale hover:grayscale-0 rounded-md overflow-hidden"
                    style={{
                      transition:"all 0.4s ease"
                    }}
                  >
                    {imageUrl && 
                      <img src={imageUrl} alt="Gallery" className="w-full h-full object-cover" />
                    }
                  </div>
                )
              })}
            </div>
            
            <div
              className="acc-ficha-desc"
              style={{
                fontSize:lcDSize,
                color: lcDColor,
                lineHeight: "1.7",
                fontWeight: lcDWeight,
                fontFamily:lcDFamily
              }}
              dangerouslySetInnerHTML={{__html:renderRichText(variantSelected.guia?.find((e)=>e.key==="description")?.value)}}
              >
            </div>

            <h3 className="acc-section-title"
              style={{
                color: lcStColor,
                fontFamily: lcStFamily,
                fontSize: lcStSize,
                textTransform:lcStUpper?"uppercase":"unset",
                letterSpacing:lcStLetter>0 ?`${lcStLetter}px`:"normal",
                fontWeight: lcStWeight,
                ...selectorPaddingMargin("padding",lcStPaddingSelect,lcStPaddingText),
                ...selectorPaddingMargin("margin",lcStMarginSelect,lcStMarginText),
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}  
              >
              {variantSelected.guia?.find((e)=>e.key==="especificacion_title")?.value}
            </h3>
            <ul className="acc-specs-list flex flex-col gap-[1rem] list-none">

              {variantSelected.guia?.find((e)=>e.key==="especificacion")?.metaobjetos?.edges.map((i,index)=>{
                  let titleEsp = i.node.fields.find((j)=>j.key=== "title")?.value
                  let especification = i.node.fields.find((j)=>j.key=== "especificacion")?.value
                return(
                  <li key={index} className="flex justify-between items-baseline"
                    style={{
                      borderBottom:"1px dashed rgba(255,255,255,0.03)",
                      fontSize:lcESize,
                      fontFamily:lcEFamily,
                      paddingBottom:"0.5rem",
                      fontWeight:lcEWeight
                    }}
                  >
                    <span 
                      className="spec-lbl"
                      style={{
                        color:lcEtColor
                      }}
                      >
                      {titleEsp}
                    </span>
                    <span 
                      className="spec-val"
                      style={{
                        color:lcEvColor,
                        fontWeight:"500",
                        textAlign:"right"
                      }}
                      >
                      {especification}
                    </span>
                  </li>
                )
              })}
            </ul>

            <h3 
              className="acc-section-title"
              style={{
                color: lcStColor,
                fontFamily: lcStFamily,
                fontSize: lcStSize,
                textTransform:lcStUpper?"uppercase":"unset",
                letterSpacing:lcStLetter>0 ?`${lcStLetter}px`:"normal",
                fontWeight: lcStWeight,
                ...selectorPaddingMargin("padding",lcStPaddingSelect,lcStPaddingText),
                ...selectorPaddingMargin("margin",lcStMarginSelect,lcStMarginText),
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
              >
                {variantSelected.guia?.find((e)=>e.key==="frecuency_title")?.value}
            </h3>
            <div 
              className="acc-faq-box flex flex-col fap-[1.2rem]"
              dangerouslySetInnerHTML={{__html:renderRichText(variantSelected.guia?.find((e)=>e.key==="frecuency_content")?.value)}}
              style={{
                fontSize: lcFSize,
                color: lcFtColor,
                lineHeight: "1.5",
                fontWeight: lcFWeight,
                "--contentFColor":lcFvColor,
              } as CSSProperties}
            >
              
              {/* {renderRichText(variantSelected.guia?.find((e)=>e.key==="frecuency_content")?.value)} */}
            </div>
          </div>
        </LateralCollection>
      }
    </Section>
  );
}
export const schema = createSchema({
  title: "Filter Option",
  type: "filter-option",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "text",
          label: "handle",
          name: "handle",
          helpText: "add handle of metaobject to use",
        },
        {
          type: "text",
          label: "title",
          name: "title",
        },
        {
          type:'select',
          label:'Padding type',
          name:'paddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Padding text',
          name:'paddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'marginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Margin text',
          name:'marginText',
          defaultValue:"3.5rem"
        },
        {
          type:'heading',
          label:'title'
        },
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'0.9rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'tUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'tPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'tPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'tMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'tMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'tWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'600',
        },    
        {
          type:'heading',
          label:'button'
        },
        {
          type:'color',
          label:'color',
          name:'bColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'bSize',
          defaultValue:'0.75rem',
        },
        {
          type:'text',
          label:'fontFamily',
          name:'bFamily',
          defaultValue:'Montserrat',
        },
      ],
    },
    {
      group:"Variant",
      inputs:[
        {
          type:'heading',
          label:'title'
        },
        {
          type:'color',
          label:'color',
          name:'vtColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'vtSize',
          defaultValue:'1rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'vtLetter',
          defaultValue:0.5,
          configs:{
            min:0,
            max:50,
            step:0.5,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'vtUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'vtFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'vtPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'vtPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'vtMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'vtMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'vtWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'600',
        },    
        {
          type:'heading',
          label:'description'
        },
        {
          type:'color',
          label:'color',
          name:'vdColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'vdSize',
          defaultValue:'0.75rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'vdLetter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'vdUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'vdFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'vdPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'vdPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'vdMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'vdMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'vdWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'300',
        },   
      ]
    },
    {
      group:"lateral selector",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'bgColor',
          defaultValue:'#050505',
        },
        {
          type:'select',
          label:'Padding type content',
          name:'lcPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text content',
          name:'lcPaddingText',
          defaultValue:"3rem 4rem 0 4rem"
        },
        {
          type:'select',
          label:'Margin type content',
          name:'lcMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text content',
          name:'lcMarginText',
        },
        {
          type:'heading',
          label:'button return'
        },
        {
          type:'color',
          label:'color',
          name:'brColor',
          defaultValue:'#A1A1AA',
        },
        {
          type:'text',
          label:'font size',
          name:'brSize',
          defaultValue:'0.75rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'brLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'brUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'brFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'brPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'brPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'brMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'brMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'brWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'600',
        },    
        {
          type:'heading',
          label:'nav title'
        },
        {
          type:'color',
          label:'color',
          name:'ntColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'ntSize',
          defaultValue:'0.75rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'ntLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'ntUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'ntFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'ntPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'ntPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'ntMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'ntMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'ntWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'600',
        },      
      ]
    },
    {
      group:"lateral content (talla)",
      inputs:[
        {
          type:'heading',
          label:'title',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
         {
          type:'color',
          label:'color',
          name:'tllTColor',
          defaultValue:'#fff',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'font size',
          name:'tllTSize',
          defaultValue:'1.8rem',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tllTLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          },
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'switch',
          label:'uppercase',
          name:'tllTUpper',
          defaultValue:true,
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'font family',
          name:'tllTFamily',
          defaultValue:'Montserrat',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Padding type',
          name:'tllTPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'Padding text',
          name:'tllTPaddingText',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Margin type',
          name:'tllTMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'Margin text',
          name:'tllTMarginText',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Font weight',
          name:'tllTWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'800',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'heading',
          label:'description',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
         {
          type:'color',
          label:'color',
          name:'tllDColor',
          defaultValue:'#71717A',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'font size',
          name:'tllDSize',
          defaultValue:'0.65rem',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tllDLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          },
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'switch',
          label:'uppercase',
          name:'tllDUpper',
          defaultValue:true,
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'font family',
          name:'tllDFamily',
          defaultValue:'Montserrat',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Padding type',
          name:'tllDPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'Padding text',
          name:'tllDPaddingText',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Margin type',
          name:'tllDMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'t',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'Margin text',
          name:'tllDMarginText',
          defaultValue:"5px",
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Font weight',
          name:'tllDWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'600',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'heading',
          label:'subtitle',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'color',
          label:'color',
          name:'tllStColor',
          defaultValue:'#71717A',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'font size',
          name:'tllStSize',
          defaultValue:'0.65rem',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tllStLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          },
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'switch',
          label:'uppercase',
          name:'tllStUpper',
          defaultValue:true,
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'font family',
          name:'tllStFamily',
          defaultValue:'Montserrat',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Padding type',
          name:'tllStPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'Padding text',
          name:'tllStPaddingText',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Margin type',
          name:'tllStMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'Margin text',
          name:'tllStMarginText',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Font weight',
          name:'tllStWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'500',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'heading',
          label:'medidas',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
         {
          type:'color',
          label:'color',
          name:'tllNColor',
          defaultValue:'#fff',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'font size',
          name:'tllNSize',
          defaultValue:'1.8rem',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'text',
          label:'font family',
          name:'tllNFamily',
          defaultValue:'Montserrat',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
        {
          type:'select',
          label:'Font weight',
          name:'tllNWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'600',
          condition:(data:FilterOptionProps)=>data.handle.toLowerCase()==="talla"
        },
      ]
    },
    {
      group:"lateral content",
      inputs:[
        {
          type:'heading',
          label:'title',
        },
        {
          type:'color',
          label:'color',
          name:'lcTColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'lcTSize',
          defaultValue:'2rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'lcTLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          },
        },
        {
          type:'switch',
          label:'uppercase',
          name:'lcTUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'lcTFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'lcTPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Padding text',
          name:'lcTPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'lcTMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Margin text',
          name:'lcTMarginText',
          defaultValue:"2rem"
        },
        {
          type:'select',
          label:'Font weight',
          name:'lcTWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'300',
        },
        {
          type:'heading',
          label:'description',
        },
         {
          type:'color',
          label:'color',
          name:'lcDColor',
          defaultValue:'#A1A1AA',
        },
        {
          type:'text',
          label:'font size',
          name:'lcDSize',
          defaultValue:'0.9rem',
        },
        {
          type:'text',
          label:'font family',
          name:'lcDFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Font weight',
          name:'lcDWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'300',
        },
        {
          type:'heading',
          label:'subtitle',
        },
        {
          type:'color',
          label:'color',
          name:'lcStColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'lcStSize',
          defaultValue:'1.1rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'lcStLetter',
          defaultValue:1,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          },
        },
        {
          type:'switch',
          label:'uppercase',
          name:'lcStUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'lcStFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'lcStPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Padding text',
          name:'lcStPaddingText',
          defaultValue:"0.5rem"
        },
        {
          type:'select',
          label:'Margin type',
          name:'lcStMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'y',
        },
        {
          type:'text',
          label:'Margin text',
          name:'lcStMarginText',
          defaultValue:"2.5rem 1rem"
        },
        {
          type:'select',
          label:'Font weight',
          name:'lcStWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'especificaciones',
        },
        {
          type:'color',
          label:'color title',
          name:'lcEtColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color value',
          name:'lcEvColor',
          defaultValue:'#E4E4E7',
         },
        {
          type:'text',
          label:'font size',
          name:'lcESize',
          defaultValue:'0.85rem',
        },
        {
          type:'text',
          label:'font family',
          name:'lcEFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Font weight',
          name:'lcEWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'500',
        },
        {
          type:'heading',
          label:'Frequency questions',
        },
        {
          type:'color',
          label:'color title',
          name:'lcFtColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color desc',
          name:'lcFvColor',
          defaultValue:'#E4E4E7',
         },
        {
          type:'text',
          label:'font size',
          name:'lcFSize',
          defaultValue:'0.85rem',
        },
        {
          type:'text',
          label:'font family',
          name:'lcFFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Font weight',
          name:'lcFWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'300',
        },
      ]
    }
  ],
});
