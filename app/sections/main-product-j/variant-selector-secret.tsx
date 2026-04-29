import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseCollection,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type {
  CollectionsByIdsQuery,
  GetMaterialsQuery,
} from "storefront-api.generated";
import LateralCollection from "~/components/product-j/lateral-collection";
import CollectionVariant from "~/components/product-secret/collection-variant";
import Material from "~/components/product-secret/material";
import { Section } from "~/components/section";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { useCurrentProduct } from "~/stores/currentProduct";
import { renderRichText, selectorPaddingMargin } from "~/utils/general";
import { useVariantOptions } from "./filter-step";
import { checkPrice } from "~/utils/product";

// ❌ ELIMINADOS (no se usan):
// import { useIsMobile } from "~/hooks/use-is-mobile";
// import { createCurProVar } from "~/routes/collections/utils";

interface ApiResponseCollection {
  result: any;
  ok: boolean;
  errorMessage?: string;
}

// ❌ ELIMINADO (no se usa en ningún cast ni tipo):
// interface ApiResponseMateriales { ... }

interface SelectorVariantSecretProps extends HydrogenComponentProps {
  title: string;
  list: WeaverseCollection[];
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
  tColor: string;
  tSize: string;
  tLetter: number;
  tUpper: boolean;
  tFamily: string;
  tPaddingSelect: string;
  tPaddingText: string;
  tMarginSelect: string;
  tMarginText: string;
  tWeight: string;
  cColor: string;
  cSize: string;
  cLetter: number;
  cUpper: boolean;
  cFamily: string;
  cPaddingSelect: string;
  cPaddingText: string;
  cMarginSelect: string;
  cMarginText: string;
  cWeight: string;
  pColor: string;
  pSize: string;
  pLetter: number;
  pUpper: boolean;
  pFamily: string;
  pPaddingSelect: string;
  pPaddingText: string;
  pMarginSelect: string;
  pMarginText: string;
  pWeight: string;
  bgColor: string;
  borderColor: string;
  lcPaddingSelect: string;
  lcPaddingText: string;
  lcMarginSelect: string;
  lcMarginText: string;
  brColor: string;
  brSize: string;
  brLetter: number;
  brUpper: boolean;
  brFamily: string;
  brPaddingSelect: string;
  brPaddingText: string;
  brMarginSelect: string;
  brMarginText: string;
  brWeight: string;
  ntColor: string;
  ntSize: string;
  ntLetter: number;
  ntUpper: boolean;
  ntFamily: string;
  ntPaddingSelect: string;
  ntPaddingText: string;
  ntMarginSelect: string;
  ntMarginText: string;
  ntWeight: string;
  ltTitle: string;
  ltColor: string;
  ltSize: string;
  ltLetter: number;
  ltUpper: boolean;
  ltFamily: string;
  ltPaddingSelect: string;
  ltPaddingText: string;
  ltMarginSelect: string;
  ltMarginText: string;
  ltWeight: string;
  lbText: string;
  lbColor: string;
  lbBgColor: string;
  lbRadius: number;
  lbSize: string;
  lbLetter: number;
  lbUpper: boolean;
  lbFamily: string;
  lbPaddingSelect: string;
  lbPaddingText: string;
  lbMarginSelect: string;
  lbMarginText: string;
  lbWeight: string;
  cpBgColor: string;
  cpBgAColor: string;
  cpBgHColor: string;
  cpBColor: string;
  cpBAColor: string;
  cpBHColor: string;
  cpRadius: number;
  cpPaddingSelect: string;
  cpPaddingText: string;
  cpMarginSelect: string;
  cpMarginText: string;
  cpiWidth: number;
  cpiHeight: number;
  cpiRadius: number;
  cptColor: string;
  cptSize: string;
  cptLetter: number;
  cptUpper: boolean;
  cptFamily: string;
  cptPaddingSelect: string;
  cptPaddingText: string;
  cptMarginSelect: string;
  cptMarginText: string;
  cptWeight: string;
  cptlColor: string;
  cptlSize: string;
  cptlLetter: number;
  cptlUpper: boolean;
  cptlFamily: string;
  cptlPaddingSelect: string;
  cptlPaddingText: string;
  cptlMarginSelect: string;
  cptlMarginText: string;
  cptlWeight: string;
  collectionTColor: string;
  collecitonSize: string;
  collectionFWeight: string;
  tooltipColor: string;
  tooltipBgColor: string;
  tooltipTSize: string;
  tooltipTWeight: string;
  tooltipSubTSize: string;
  tooltipSubTWeight: string;

  // section filter
  fColor: string;
  fSize: string;
  fFamily: string;
  fbColor: string;
  fbSize: string;
  fbFamily: string;
  ftColor: string;
  ftSize: string;
  ftfamily: string;
  ftuppercase: boolean;
  ftLetter: number;
  ftPaddingSelect: string;
  ftPaddingText: string;
  ftMarginSelect: string;
  ftMarginText: string;
  ftWeight: string;
  fcolBorderColor: string;
  fcolBgColor: string;
  fcolBgSelColor: string;
  fcolColor: string;
  fcolSelColor: string;
  fcolSize: string;
  fcolfamily: string;
  fcoluppercase: boolean;
  fcolLetter: number;
  fcolPaddingSelect: string;
  fcolPaddingText: string;
  fcolMarginSelect: string;
  fcolMarginText: string;
  fcolWeight: string;
  fproBorderColor: string;
  fproBgColor: string;
  fproBgSelColor: string;
  fproColor: string;
  fproSelColor: string;
  fproSize: string;
  fprofamily: string;
  fprouppercase: boolean;
  fproLetter: number;
  fproMarginSelect: string;
  fproMarginText: string;
  fproWeight: string;

  lcTColor: string;
  lcTSize: string;
  lcTLetter: number;
  lcTUpper: boolean;
  lcTFamily: string;
  lcTPaddingSelect: string;
  lcTPaddingText: string;
  lcTMarginSelect: string;
  lcTMarginText: string;
  lcTWeight: string;
  lcDColor: string;
  lcDSize: string;
  lcDFamily: string;
  lcDWeight: string;
  lcStColor: string;
  lcStSize: string;
  lcStLetter: number;
  lcStUpper: boolean;
  lcStFamily: string;
  lcStPaddingSelect: string;
  lcStPaddingText: string;
  lcStMarginSelect: string;
  lcStMarginText: string;
  lcStWeight: string;
  lcEtColor: string;
  lcEvColor: string;
  lcESize: string;
  lcEFamily: string;
  lcEWeight: string;
  lcFtColor: string;
  lcFvColor: string;
  lcFSize: string;
  lcFFamily: string;
  lcFWeight: string;

  // button section
  
  bgBSectionColor: string;
  sProdTColor: string;
  sProdTSize: string;
  sProdTFamily: string;
  sProdTPaddingSelect: string;
  sProdTPaddingText: string;
  sProdTMarginSelect: string;
  sProdTMarginText: string;
  sProdTWeight: string;
  sProdSubTColor: string;
  sProdSubTSize: string;
  sProdSubTFamily: string;
  sProdSubTPaddingSelect: string;
  sProdSubTPaddingText: string;
  sProdSubTMarginSelect: string;
  sProdSubTMarginText: string;
  sProdSubTWeight: string;
  sProdPriceColor: string;
  sProdPriceSize: string;
  sProdPriceFamily: string;
  sProdPricePaddingSelect: string;
  sProdPricePaddingText: string;
  sProdPriceMarginSelect: string;
  sProdPriceMarginText: string;
  sProdPriceWeight: string;
  buttonColor: string;
  buttonBgColor: string;
  buttonSize: string;
  buttonFamily: string;
  buttonPaddingSelect: string;
  buttonPaddingText: string;
  buttonMarginSelect: string;
  buttonMarginText: string;
  buttonWeight: string;
}

export default function SelectorVariantSecret(
  props: SelectorVariantSecretProps,
) {
  const {
    title,
    list,
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
    cColor,
    cSize,
    cLetter,
    cUpper,
    cFamily,
    cWeight,
    pColor,
    pSize,
    pLetter,
    pUpper,
    pFamily,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    pWeight,
    bgColor,
    // ❌ borderColor — se desestructura pero nunca se usa en el JSX
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
    ltTitle,
    lbText,
    lbColor,
    lbBgColor,
    lbRadius,
    lbSize,
    lbLetter,
    lbUpper,
    lbFamily,
    lbPaddingSelect,
    lbPaddingText,
    lbMarginSelect,
    lbMarginText,
    lbWeight,
    collectionTColor,
    collecitonSize,
    collectionFWeight,
    tooltipColor,
    tooltipBgColor,
    tooltipTSize,
    tooltipTWeight,
    tooltipSubTSize,
    tooltipSubTWeight,
    fColor,
    fSize,
    fFamily,
    fbColor,
    fbSize,
    fbFamily,
    ftColor,
    ftSize,
    ftfamily,
    ftuppercase,
    ftLetter,
    ftPaddingSelect,
    ftPaddingText,
    ftMarginSelect,
    ftMarginText,
    ftWeight,
    fcolBorderColor,
    fcolBgColor,
    fcolBgSelColor,
    fcolColor,
    fcolSelColor,
    fcolSize,
    fcolfamily,
    fcoluppercase,
    fcolLetter,
    fcolPaddingSelect,
    fcolPaddingText,
    fcolMarginSelect,
    fcolMarginText,
    fcolWeight,
    fproBorderColor,
    fproBgColor,
    fproBgSelColor,
    fproColor,
    fproSelColor,
    fproSize,
    fprofamily,
    fprouppercase,
    fproLetter,
    fproMarginSelect,
    fproMarginText,
    fproWeight,

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

    bgBSectionColor,
    sProdTColor,
    sProdTSize,
    sProdTFamily,
    sProdTPaddingSelect,
    sProdTPaddingText,
    sProdTMarginSelect,
    sProdTMarginText,
    sProdTWeight,
    sProdSubTColor,
    sProdSubTSize,
    sProdSubTFamily,
    sProdSubTPaddingSelect,
    sProdSubTPaddingText,
    sProdSubTMarginSelect,
    sProdSubTMarginText,
    sProdSubTWeight,
    sProdPriceColor,
    sProdPriceSize,
    sProdPriceFamily,
    sProdPricePaddingSelect,
    sProdPricePaddingText,
    sProdPriceMarginSelect,
    sProdPriceMarginText,
    sProdPriceWeight,
    buttonColor,
    buttonBgColor,
    buttonSize,
    buttonFamily,
    buttonPaddingSelect,
    buttonPaddingText,
    buttonMarginSelect,
    buttonMarginText,
    buttonWeight,
    ...rest
  } = props;

  // ❌ ELIMINADAS del destructuring (se desestructuran pero no aparecen en el JSX):
  // cPaddingSelect, cPaddingText, cMarginSelect, cMarginText
  // ltColor, ltSize, ltLetter, ltUpper, ltFamily, ltPaddingSelect, ltPaddingText, ltMarginSelect, ltMarginText, ltWeight
  // cpBgColor, cpBgAColor, cpBgHColor, cpBColor, cpBAColor, cpBHColor, cpRadius
  // cpPaddingSelect, cpPaddingText, cpMarginSelect, cpMarginText
  // cpiWidth, cpiHeight, cpiRadius
  // cptColor, cptSize, cptLetter, cptUpper, cptFamily, cptPaddingSelect, cptPaddingText, cptMarginSelect, cptMarginText, cptWeight
  // cptlColor, cptlSize, cptlLetter, cptlUpper, cptlFamily, cptlPaddingSelect, cptlPaddingText, cptlMarginSelect, cptlMarginText, cptlWeight
  // borderColor

  const collectionListProps = {
    collectionTColor,
    collectionSize: collecitonSize,
    collectionFWeight,
    tooltipColor,
    tooltipBgColor,
    tooltipTSize,
    tooltipTWeight,
    tooltipSubTSize,
    tooltipSubTWeight,
  };

  const getApiUrl = usePrefixPathWithLocale(`api/collection`);
  const getMaterialsUrl = usePrefixPathWithLocale(`api/metaobject`);

  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [collections, setCollections] = useState(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const contenedor = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [numberFilter, setNumberFilter] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const listMaterials = ["cuero", "tela"];
  const [selectedCollection, setSelectedCollection] = useState("");
  const [filterCollection, setFilterCollection] = useState<string[]>([]);
  const [materiales, setMateriales] = useState(null);
  const [showGuiaMaterials, setShowGuiaMaterials] = useState(false);
  const [guia, setGuia] = useState(null);
  const variantOptions = useVariantOptions((state) => state.varOptions);

  const isMobile = useIsMobile(600);
  const openDrawer = () => setShow(true);

  const toogleFilter = () => {
    setShowFilter((state) => !state);
  };

  useEffect(() => {
    if (contenedor.current) {
      if (contenedor.current.parentNode.hasAttribute("class"))
        contenedor.current.parentNode.removeAttribute("class");
    }
  }, [contenedor.current]);


  useEffect(() => {
    if (!list) return;
    const ids = list.map((elm) => `gid://shopify/Collection/${elm.id}`);
    setIsLoading(true);

    const loadCollection = async (retryCount = 0) => {
      try {
        const res = await fetch(getApiUrl, {
          method: "POST",
          body: JSON.stringify({ ids }),
        });
        const data = (await res.json()) as ApiResponseCollection;
        if (data.ok) {
          setCollections(data.result.nodes);
          setIsLoading(false);
        } else {
          if (retryCount < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return loadCollection(retryCount);
          }
          setCollections(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error de red/servidor:", err);
        if (retryCount < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return loadCollection(retryCount + 1);
        }
        setIsLoading(false);
      }
    };
    loadCollection();
  }, [list, getApiUrl]);

  // ❌ ELIMINADO — currentProduct.id se guardaba en idSelect que nunca se leía
  // useEffect(() => { if (currentProduct) setIdSelect(currentProduct.id); }, [currentProduct]);

  useEffect(() => {
    const has = selectedCollection !== "" ? 1 : 0;
    setNumberFilter(selectedFilters.length + has);
  }, [selectedFilters, selectedCollection]); // ✅ dependencia corregida: selectedCollection en lugar de collection

  useEffect(() => {
    if (!collections) return;
    const list: string[] = [];
    collections.forEach((elm) => {
      if (elm.filtro && !list.includes(elm.filtro.value)) {
        list.push(elm.filtro.value);
      }
    });
    setFilterCollection(list);
    // ❌ ELIMINADO — listProdFilter se construía pero nunca se usaba
  }, [collections]);

  useEffect(() => {
    setIsLoading(true);
    const loadMetaObject = async (retryCount = 0) => {
      try {
        const params = new URLSearchParams({ handle: "material" });
        const res = await fetch(`${getMaterialsUrl}?${params.toString()}`);
        const data = (await res.json()) as ApiResponseCollection;
        if (data.ok) {
          setMateriales(data.result.metaobjects.edges[0].node.fields as any);
          setIsLoading(false);
        } else {
          if (retryCount < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return loadMetaObject(retryCount + 1);
          }
          setMateriales(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error de red/servidor:", err);
        if (retryCount < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return loadMetaObject(retryCount + 1);
        }
        setIsLoading(false);
      }
    };
    loadMetaObject();
  }, []);

  useEffect(() => {
    if (variantOptions) {
      try {
        const data = JSON.parse(variantOptions) as any;
        const match = data.edges?.find(
          (elm) => elm.node.handle.toLowerCase() === "tapiceria",
        );
        if (match) {
          const node = match.node;
          let fieldsGuia = node.fields.find((e) => e.key == "guia").reference
            .fields;
          setGuia(fieldsGuia);
        }
      } catch (e) {
        console.error("Error parseando variantOptions:", e);
      }
    }
  }, [variantOptions]);
  

  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  if (collections == null) return <Section {...rest} />;

  return (
    <Section {...rest} className="static">
      <div
        ref={contenedor}
        style={{
          ...selectorPaddingMargin("padding", paddingSelect, paddingText),
          ...selectorPaddingMargin("margin", marginSelect, marginText),
        }}
      >
        <div className="flex justify-between mb-[1.5rem] items-baseline">
          <div
            style={{
              fontFamily: tFamily,
              fontSize: tSize,
              fontWeight: tWeight,
              textTransform: tUpper ? "uppercase" : "unset",
              letterSpacing: `${tLetter}px`,
              color: tColor,
              ...selectorPaddingMargin("padding", tPaddingSelect, tPaddingText),
              ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
            }}
          >
            {title}
          </div>
        </div>

        <div
          className="options-list flex flex-col gap-[0.5rem]"
          id="universo-list"
        >
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="option-item active hover:pl-[10px] flex justify-between items-center cursor-pointer"
            onClick={() => openDrawer()}
            style={{
              padding: isHovered ? "1rem 0 1rem 10px" : "1rem 0",
              borderBottom: `1px solid ${currentProduct || isHovered ? "#fff3" : "#ffffff08"}`,
              transition: "all 0.4s ease",
              opacity: currentProduct || isHovered ? "1" : "0.6",
            }}
          >
            <div className="option-left flex flex-col gap-[4px]">
              <span
                className="option-title"
                style={{
                  fontFamily: cFamily,
                  fontSize: cSize,
                  fontWeight: currentProduct ? cWeight : "400",
                  textTransform: cUpper ? "uppercase" : "unset",
                  letterSpacing: currentProduct ? `${cLetter}px` : "normal",
                  color: cColor,
                  transition: "all 0.3s",
                }}
              >
                {currentProduct.title}
              </span>
              <span
                className="option-desc"
                style={{
                  fontFamily: pFamily,
                  fontSize: pSize,
                  fontWeight: pWeight,
                  textTransform: pUpper ? "uppercase" : "unset",
                  letterSpacing: pLetter > 0 ? `${pLetter}px` : "normal",
                  color: pColor,
                  ...selectorPaddingMargin(
                    "padding",
                    pPaddingSelect,
                    pPaddingText,
                  ),
                  ...selectorPaddingMargin(
                    "margin",
                    pMarginSelect,
                    pMarginText,
                  ),
                }}
              >
                {currentProduct
                  ? `${currentProduct.nombre ?? currentProduct.title}${currentProduct.tooltip ? ` -${currentProduct.tooltip}` : ""}`
                  : "Seleccionar modelo..."}
              </span>
            </div>
            <div
              className="selector-dot flex items-center justify-center"
              style={{
                backgroundColor: currentProduct ? cColor : "transparent",
                boxShadow: currentProduct ? "0 0 10px #fff6" : "none",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: `1px solid ${currentProduct ? cColor : "#52525B"}`,
                transition: "all 0.3s",
              }}
            />
          </div>
        </div>
      </div>

      <LateralCollection
        title={undefined} // ❌ antes era collection?.title pero collection siempre era null
        confirmBtn={false}
        show={show}
        close={() => setShow(false)}
        style={{ background: bgColor }}
        buttonText={lbText}
        estilos={
          {
            "--brColor": brColor,
            "--brSize": brSize,
            "--brLetter": brLetter,
            "--brUpper": brUpper,
            "--brFamily": brFamily,
            "--brPaddingSelect": brPaddingSelect,
            "--brPaddingText": brPaddingText,
            "--brMarginSelect": brMarginSelect,
            "--brMarginText": brMarginText,
            "--brWeight": brWeight,
            "--ntColor": ntColor,
            "--ntSize": ntSize,
            "--ntLetter": ntLetter,
            "--ntUpper": ntUpper,
            "--ntFamily": ntFamily,
            "--ntPaddingSelect": ntPaddingSelect,
            "--ntPaddingText": ntPaddingText,
            "--ntMarginSelect": ntMarginSelect,
            "--ntMarginText": ntMarginText,
            "--ntWeight": ntWeight,
          } as CSSProperties
        }
      >
        {/* FILTROS HEADER */}
        <div
          className="flex cursor-pointer min-h-[60px] items-center px-4"
          data-testid="e2e-upholstery-filter"
        >
          <div
            className="flex-1 transition-all duration-300"
            onClick={toogleFilter}
          >
            <div className="py-4 flex items-center flex-row">
              <div className="flex items-center me-3">
                <img
                  src="https://images.secretlab.co/theme/common/pdp-icon-filter.svg"
                  alt="filter"
                />
              </div>
              <div className="flex uppercase font-bold me-3 gap-1 flex-row items-center">
                <span
                  style={{
                    fontFamily: fFamily,
                    color: fColor,
                    fontSize: fSize,
                  }}
                >
                  Filtros
                </span>
                {numberFilter > 0 && (
                  <span className="w-4 h-4 lg:w-[18px] lg:h-[18px] rounded-full bg-black flex items-center justify-center text-tag-sm colour-text-on-colour-primary">
                    {numberFilter}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center ms-4" onClick={toogleFilter}>
            <div
              className="me-1"
              style={{
                color: fbColor,
                fontFamily: fbFamily,
                fontSize: fbSize,
              }}
            >
              {showFilter ? "Ocultar" : "Mostrar"}
            </div>
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ rotate: showFilter ? "270deg" : "90deg" }}
            >
              <path
                d="M5.33398 1.57056L12.0007 8.23722L5.33398 14.9039"
                stroke="#212529"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* FILTROS PANEL */}

        <div
          className="filtro-view px-4"
          style={{
            height: showFilter ? "auto" : "0",
            overflow: showFilter ? "visible" : "hidden",
            opacity: showFilter ? 1 : 0,
            transition: "height 1s ease , opacity 1s ease",
          }}
        >
          {/* Filtro Edición */}
          <div className="mb-3 lg:mb-4">
            <span
              style={{
                fontSize: ftSize,
                color: ftColor,
                fontFamily: ftfamily,
                fontWeight: ftWeight,
                textTransform: ftuppercase ? "uppercase" : "none",
                letterSpacing: ftLetter > 0 ? `${ftLetter}px` : "normal",
                ...selectorPaddingMargin(
                  "padding",
                  ftPaddingSelect,
                  ftPaddingText,
                ),
                ...selectorPaddingMargin(
                  "margin",
                  ftMarginSelect,
                  ftMarginText,
                ),
              }}
            >
              Edición
            </span>
            <div
              className="p-1 flex flex-row justify-between flex-wrap gap-1 border border-solid rounded-full colour-background-white"
              style={{
                borderColor: fcolBorderColor,
              }}
            >
              <label
                htmlFor="all"
                className={`flex-none px-6 lg:flex-1 text-[14px] py-3 text-center rounded-full cursor-pointer flex items-center justify-center transition duration-300 hover:bg-stone-200 ${selectedCollection === "" ? "bg-black text-white" : ""}`}
                style={{
                  backgroundColor:
                    selectedCollection === "" ? fcolBgSelColor : fcolBgColor,
                  fontSize: fcolSize,
                  color: selectedCollection === "" ? fcolSelColor : fcolColor,
                  fontFamily: fcolfamily,
                  fontWeight: fcolWeight,
                  textTransform: fcoluppercase ? "uppercase" : "none",
                  letterSpacing: fcolLetter > 0 ? `${fcolLetter}px` : "normal",
                }}
              >
                <input
                  className="hidden"
                  type="radio"
                  id="all"
                  name="colleciones"
                  value=""
                  checked={selectedCollection === ""}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                />
                Todas
              </label>
              {filterCollection.map((elm) => {
                const value = elm.trim();
                return (
                  <label
                    key={value}
                    htmlFor={value}
                    className={`flex-none px-6 lg:flex-1 text-[14px] py-3 text-center rounded-full cursor-pointer flex items-center justify-center transition duration-300 hover:bg-stone-200 `}
                    style={{
                      backgroundColor:
                        selectedCollection === value
                          ? fcolBgSelColor
                          : fcolBgColor,
                      fontSize: fcolSize,
                      color:
                        selectedCollection === value ? fcolSelColor : fcolColor,
                      fontFamily: fcolfamily,
                      fontWeight: fcolWeight,
                      textTransform: fcoluppercase ? "uppercase" : "none",
                      letterSpacing:
                        fcolLetter > 0 ? `${fcolLetter}px` : "normal",
                    }}
                  >
                    <input
                      className="hidden"
                      type="radio"
                      name="colleciones"
                      id={value}
                      value={value}
                      checked={selectedCollection === value}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                    />
                    {value}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Filtro Tapizados */}
          <div className="flex flex-row items-center mb-1">
            <span className="flex-1 flex flex-row gap-1 items-center">
              <span
                style={{
                  fontSize: ftSize,
                  color: ftColor,
                  fontFamily: ftfamily,
                  fontWeight: ftWeight,
                  textTransform: ftuppercase ? "uppercase" : "none",
                  letterSpacing: ftLetter > 0 ? `${ftLetter}px` : "normal",
                  ...selectorPaddingMargin(
                    "padding",
                    ftPaddingSelect,
                    ftPaddingText,
                  ),
                  ...selectorPaddingMargin(
                    "margin",
                    ftMarginSelect,
                    ftMarginText,
                  ),
                }}
              >
                Tapizados
              </span>
              {selectedFilters.length > 0 && (
                <span className="flex-none w-4 h-4 lg:w-[18px] lg:h-[18px] rounded-full bg-black flex items-center justify-center text-tag-sm colour-text-on-colour-primary">
                  {selectedFilters.length}
                </span>
              )}
            </span>
            <div
              className="body-sm cursor-pointer underline text-[#6C757D] flex-none"
              onClick={() => setShowGuiaMaterials((state) => !state)}
            >
              ¿Necesitas ayuda para elegir la tapicería?
            </div>
          </div>

          <div className="pb-4 flex flex-col lg:flex-row flex-wrap gap-1">
            {listMaterials.map((elm) => {
              const guiaField = materiales?.find((i: any) => i.key === "guia");
              const materialFields = materiales?.find(
                (i: any) => i.key === "material",
              )?.references?.edges;
              if (!guiaField?.reference?.fields || !materialFields) return null;

              const productFields = materialFields.find(
                (m: any) =>
                  m.node.fields
                    .find((j: any) => j.key === "product")
                    ?.value?.toLowerCase() === elm.toLowerCase(),
              );
              const productField = productFields?.node.fields.find(
                (v: any) => v.key === "product",
              );

              const especificacionField = guiaField.reference.fields.find(
                (f: any) => f.key === "especificacion",
              );
              const materialEdges =
                especificacionField?.metaobjetos?.edges || [];
              const materialMatch = materialEdges.find((m: any) =>
                m.node.handle.toLowerCase().includes(elm.toLowerCase()),
              );
              if (!materialMatch || !productField) return null;

              const fields = materialMatch.node.fields;
              const materialData = {
                title:
                  fields.find((e: any) => e.key === "title")?.value ||
                  materialMatch.node.handle,
                handle: materialMatch.node.handle,
                description:
                  fields.find((e: any) => e.key === "especificacion")?.value ||
                  "",
                img:
                  fields.find((e: any) => e.key === "img")?.reference?.image
                    ?.url || "",
              };

              const isChecked = selectedFilters.includes(materialData.handle);

              return (
                <Material
                  key={materialData.handle}
                  color={fproColor}
                  colorChecked={fproSelColor}
                  bg={fproBgColor}
                  borderColor={fproBorderColor}
                  bgChecked={fproBgSelColor}
                  material={materialData}
                  defaultTitle={elm}
                  widthSize={100}
                  value={productField.value}
                  isChecked={isChecked}
                  handleCheckboxChange={handleCheckboxChange}
                  style={{
                    fontSize: fproSize,
                    fontFamily: fprofamily,
                    fontWeight: fproWeight,
                    textTransform: fprouppercase ? "uppercase" : "none",
                    letterSpacing:
                      fproLetter > 0 ? `${fproLetter}px` : "normal",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* LISTA DE COLECCIONES */}
        {collections.map((elm, index) => {
          if (selectedCollection && elm.filtro?.value !== selectedCollection)
            return null;
          return (
            <CollectionVariant
              key={index}
              collection={elm}
              listFilter={selectedFilters}
              estilos={collectionListProps}
            />
          );
        })}

        {/* CONFIRM SECTION  */}
        <div className="flex-none sticky bottom-0">
          <div style={{background:bgBSectionColor}}>
            <div 
              className="items-end flex p-4 border-l-0 border-t border-r-0 border-b-0 border-solid  border-stone-500"
              style={{background:bgBSectionColor}}
              >
              <div className="flex-1">
                <div className="flex gap-1">
                  <div className="flex gap-1 flex-wrap e2e-section-status"></div>
                </div>
                <div className="flex items-center">
                  <div
                    className="subheading-1 flex-wrap"
                    style={{
                      color: sProdTColor,
                      fontSize: sProdTSize,
                      fontFamily: sProdTFamily,
                      ...selectorPaddingMargin(
                        "padding",
                        sProdTPaddingSelect,
                        sProdTPaddingText,
                      ),
                      ...selectorPaddingMargin(
                        "margin",
                        sProdTMarginSelect,
                        sProdTMarginText,
                      ),
                      fontWeight: sProdTWeight,
                    }}
                  >
                    {currentProduct?.nombre || currentProduct?.title}
                  </div>
                </div>
                <div
                  className="subheading-3 text-[#71717A]"
                  style={{
                    color: sProdSubTColor,
                    fontSize: sProdSubTSize,
                    fontFamily: sProdSubTFamily,
                    ...selectorPaddingMargin(
                      "padding",
                      sProdSubTPaddingSelect,
                      sProdSubTPaddingText,
                    ),
                    ...selectorPaddingMargin(
                      "margin",
                      sProdSubTMarginSelect,
                      sProdSubTMarginText,
                    ),
                    fontWeight: sProdSubTWeight,
                  }}
                >
                  {currentProduct?.tooltip as string}
                </div>
              </div>
              <div className="flex-none items-end justify-end">
                <div className="subheading-2 text-right flex-row flex gap-2">
                  <span
                    style={{
                      color: sProdPriceColor,
                      fontSize: sProdPriceSize,
                      fontFamily: sProdPriceFamily,
                      ...selectorPaddingMargin(
                        "padding",
                        sProdPricePaddingSelect,
                        sProdPricePaddingText,
                      ),
                      ...selectorPaddingMargin(
                        "margin",
                        sProdPriceMarginSelect,
                        sProdPriceMarginText,
                      ),
                      fontWeight: sProdPriceWeight,
                    }}
                  >
                    Desde{" "}
                    {checkPrice(currentProduct.selectedVariant.price.amount)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="px-4 pb-4"
            style={{background:bgBSectionColor}}
            >
            <button
              onClick={() => setShow(false)}
              className="flex gap-2 items-center justify-center text-center p-5 uppercase  font-bold w-full border-none sticky bottom-0 z-10 cursor-pointer  hover:opacity-80 rounded"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonColor,
                fontSize: buttonSize,
                fontFamily: buttonFamily,
                ...selectorPaddingMargin(
                  "padding",
                  buttonPaddingSelect,
                  buttonPaddingText,
                ),
                ...selectorPaddingMargin(
                  "margin",
                  buttonMarginSelect,
                  buttonMarginText,
                ),
              }}
            >
              Confirmar selección
            </button>
          </div>
        </div>
      </LateralCollection>
      {showGuiaMaterials && (
        <LateralCollection
          title={guia.find((e) => e.key == "title").value}
          confirmBtn={false}
          show={show}
          close={() => setShow(false)}
          style={{
            background: bgColor,
            padding: "2rem",
          }}
          estilos={
            {
              "--brColor": brColor,
              "--brSize": brSize,
              "--brLetter": brLetter,
              "--brUpper": brUpper,
              "--brFamily": brFamily,
              "--brPaddingSelect": brPaddingSelect,
              "--brPaddingText": brPaddingText,
              "--brMarginSelect": brMarginSelect,
              "--brMarginText": brMarginText,
              "--brWeight": brWeight,
              "--ntColor": ntColor,
              "--ntSize": ntSize,
              "--ntLetter": ntLetter,
              "--ntUpper": ntUpper,
              "--ntFamily": ntFamily,
              "--ntPaddingSelect": ntPaddingSelect,
              "--ntPaddingText": ntPaddingText,
              "--ntMarginSelect": ntMarginSelect,
              "--ntMarginText": ntMarginText,
              "--ntWeight": ntWeight,
            } as CSSProperties
          }
        >
          <div
            className="drawer-scroll-area overflow-y-auto"
            style={{
              ...selectorPaddingMargin(
                "padding",
                lcPaddingSelect,
                !isMobile ? lcPaddingText : "1.5rem",
              ),
              ...selectorPaddingMargin("padding", lcMarginSelect, lcMarginText),
            }}
          >
            <h2
              className="drawer-header-title"
              style={{
                color: lcTColor,
                fontFamily: lcTFamily,
                fontSize: lcTSize,
                textTransform: lcTUpper ? "uppercase" : "unset",
                letterSpacing: lcTLetter > 0 ? `${lcTLetter}px` : "normal",
                fontWeight: lcTWeight,
                ...selectorPaddingMargin(
                  "padding",
                  lcTPaddingSelect,
                  lcTPaddingText,
                ),
                ...selectorPaddingMargin(
                  "margin",
                  lcTMarginSelect,
                  lcTMarginText,
                ),
              }}
            >
              {guia.nav_title}
            </h2>

            <div className="acc-ficha-gallery grid gap-[10px] grid-cols-2 mb-[2.5rem]">
              {guia
                .find((e) => e.key == "imagenes")
                .imagenes?.edges.map((i) => {
                  const imageUrl = i.node.image.url;
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
                })}
            </div>

            <div
              className="acc-ficha-desc"
              style={{
                fontSize: lcDSize,
                color: lcDColor,
                lineHeight: "1.7",
                fontWeight: lcDWeight,
                fontFamily: lcDFamily,
              }}
              dangerouslySetInnerHTML={{
                __html: renderRichText(
                  guia.find((e) => e.key == "description").value,
                ),
              }}
            ></div>

            <h3
              className="acc-section-title"
              style={{
                color: lcStColor,
                fontFamily: lcStFamily,
                fontSize: lcStSize,
                textTransform: lcStUpper ? "uppercase" : "unset",
                letterSpacing: lcStLetter > 0 ? `${lcStLetter}px` : "normal",
                fontWeight: lcStWeight,
                ...selectorPaddingMargin(
                  "padding",
                  lcStPaddingSelect,
                  lcStPaddingText,
                ),
                ...selectorPaddingMargin(
                  "margin",
                  lcStMarginSelect,
                  lcStMarginText,
                ),
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {guia.find((e) => e.key == "especificacion_title").value}
            </h3>
            <ul className="acc-specs-list flex flex-col gap-[1rem] list-none">
              {guia
                .find((e) => e.key == "especificacion")
                ?.metaobjetos?.edges.map((i, index) => {
                  let titleEsp = i.node.fields.find(
                    (j) => j.key === "title",
                  )?.value;
                  let especification = i.node.fields.find(
                    (j) => j.key === "especificacion",
                  )?.value;
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-baseline"
                      style={{
                        borderBottom: "1px dashed rgba(255,255,255,0.03)",
                        fontSize: lcESize,
                        fontFamily: lcEFamily,
                        paddingBottom: "0.5rem",
                        fontWeight: lcEWeight,
                      }}
                    >
                      <span
                        className="spec-lbl"
                        style={{
                          color: lcEtColor,
                        }}
                      >
                        {titleEsp}
                      </span>
                      <span
                        className="spec-val"
                        style={{
                          color: lcEvColor,
                          fontWeight: "500",
                          textAlign: "right",
                        }}
                      >
                        {especification}
                      </span>
                    </li>
                  );
                })}
            </ul>

            <h3
              className="acc-section-title"
              style={{
                color: lcStColor,
                fontFamily: lcStFamily,
                fontSize: lcStSize,
                textTransform: lcStUpper ? "uppercase" : "unset",
                letterSpacing: lcStLetter > 0 ? `${lcStLetter}px` : "normal",
                fontWeight: lcStWeight,
                ...selectorPaddingMargin(
                  "padding",
                  lcStPaddingSelect,
                  lcStPaddingText,
                ),
                ...selectorPaddingMargin(
                  "margin",
                  lcStMarginSelect,
                  lcStMarginText,
                ),
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {guia.find((e) => e.key == "frecuency_title").value}
            </h3>
            <div
              className="acc-faq-box flex flex-col fap-[1.2rem]"
              dangerouslySetInnerHTML={{
                __html: renderRichText(
                  guia.find((e) => e.key == "frecuency_content").value,
                ),
              }}
              style={
                {
                  fontSize: lcFSize,
                  color: lcFtColor,
                  lineHeight: "1.5",
                  fontWeight: lcFWeight,
                  "--contentFColor": lcFvColor,
                } as CSSProperties
              }
            ></div>
          </div>
        </LateralCollection>
      )}
    </Section>
  );
}

export const schema = createSchema({
  title: "selector variant secret",
  type: "selector-variant-secret",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "text",
          label: "title",
          name: "title",
          defaultValue: "0.1 UNIVERSO & MODELO",
        },
        {
          type: "collection-list",
          label: "collections",
          name: "list",
        },
        {
          type: "select",
          label: "Padding type",
          name: "paddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Padding text",
          name: "paddingText",
          defaultValue: "3.5rem",
        },
        {
          type: "select",
          label: "Margin type",
          name: "marginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "marginText",
        },
        // Title styles
        {
          type: "heading",
          label: "title",
        },
        {
          type: "color",
          label: "color",
          name: "tColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "font size",
          name: "tSize",
          defaultValue: "0.9rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "tLetter",
          defaultValue: 2,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "tUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "font family",
          name: "tFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "tPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "tPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "tMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "tMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "tWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
      ],
    },
    {
      group: "collection selector",
      inputs: [
        {
          type: "heading",
          label: "title collection",
        },
        {
          type: "color",
          label: "color",
          name: "cColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "font size",
          name: "cSize",
          defaultValue: "1rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "cLetter",
          defaultValue: 0.5,
          configs: { min: 0, max: 50, step: 0.5, unit: "px" },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "cUpper",
          defaultValue: false,
        },
        {
          type: "text",
          label: "font family",
          name: "cFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "cWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        // ❌ ELIMINADOS: cPaddingSelect, cPaddingText, cMarginSelect, cMarginText
        {
          type: "heading",
          label: "selected product",
        },
        {
          type: "color",
          label: "color",
          name: "pColor",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          label: "font size",
          name: "pSize",
          defaultValue: "0.75rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "pLetter",
          defaultValue: 0,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "pUpper",
          defaultValue: false,
        },
        {
          type: "text",
          label: "font family",
          name: "pFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "pPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "pPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "pMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "pMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "pWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "300",
        },
      ],
    },
    {
      group: "lateral selector",
      inputs: [
        {
          type: "color",
          label: "background color",
          name: "bgColor",
          defaultValue: "#050505",
        },
        // ❌ ELIMINADOS: borderColor, lcPaddingSelect, lcPaddingText, lcMarginSelect, lcMarginText
        {
          type: "heading",
          label: "button return",
        },
        {
          type: "color",
          label: "color",
          name: "brColor",
          defaultValue: "#A1A1AA",
        },
        {
          type: "text",
          label: "font size",
          name: "brSize",
          defaultValue: "0.75rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "brLetter",
          defaultValue: 2,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "brUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "font family",
          name: "brFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "brPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "brPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "brMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "brMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "brWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        {
          type: "heading",
          label: "nav title",
        },
        {
          type: "color",
          label: "color",
          name: "ntColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "font size",
          name: "ntSize",
          defaultValue: "0.75rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "ntLetter",
          defaultValue: 2,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "ntUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "font family",
          name: "ntFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "ntPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "ntPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "ntMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "ntMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "ntWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        // ❌ ELIMINADO grupo "title" entero: ltTitle, ltColor, ltSize, ltLetter,
        //    ltUpper, ltFamily, ltPaddingSelect, ltPaddingText, ltMarginSelect,
        //    ltMarginText, ltWeight — ninguno se usa en el JSX
      ],
    },
    {
      group: "button Section",
      inputs: [

        {
          type:'color',
          label:'color',
          name:'bgBSectionColor',
          defaultValue:'#050505',
        },
        {
          type: "heading",
          label: "title selected product",
        },
        {
          type: "color",
          label: "color",
          name: "sProdTColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "font size",
          name: "sProdTSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family",
          name: "sProdTFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "sProdTPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text ",
          name: "sProdTPaddingText",
        },
        {
          type: "select",
          label: "Margin type ",
          name: "sProdTMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text ",
          name: "sProdTMarginText",
        },
        {
          type: "select",
          label: "Font weight ",
          name: "sProdTWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "heading",
          label: "subtitle selected product",
        },
        {
          type: "color",
          label: "color ",
          name: "sProdSubTColor",
          defaultValue: "#fff5",
        },
        {
          type: "text",
          label: "font size ",
          name: "sProdSubTSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family ",
          name: "sProdSubTFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "sProdSubTPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text ",
          name: "sProdSubTPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "sProdSubTMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "sProdSubTMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "sProdSubTWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "heading",
          label: "price selected product",
        },
        {
          type: "color",
          label: "color (price)",
          name: "sProdPriceColor",
          defaultValue: "#d39b34",
        },
        {
          type: "text",
          label: "font size (price)",
          name: "sProdPriceSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family (price)",
          name: "sProdPriceFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type (price)",
          name: "sProdPricePaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text (price)",
          name: "sProdPricePaddingText",
        },
        {
          type: "select",
          label: "Margin type (price)",
          name: "sProdPriceMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text (price)",
          name: "sProdPriceMarginText",
        },
        {
          type: "select",
          label: "Font weight (price)",
          name: "sProdPriceWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "heading",
          label: "button selected product",
        },
        {
          type: "color",
          label: "color ",
          name: "buttonColor",
          defaultValue: "#000",
        },
        {
          type: "color",
          label: "background color",
          name: "buttonBgColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "font size ",
          name: "buttonSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family",
          name: "buttonFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type ",
          name: "buttonPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text ",
          name: "buttonPaddingText",
        },
        {
          type: "select",
          label: "Margin type ",
          name: "buttonMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text ",
          name: "buttonMarginText",
        },
        {
          type: "select",
          label: "Font weight ",
          name: "buttonWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
      ],
    },
    {
      group: "filterSection",
      inputs: [
        {
          type: "heading",
          label: "filter Name",
        },
        {
          type: "color",
          label: "color",
          name: "fColor",
          defaultValue: "#FFFFFF",
        },
        {
          type: "text",
          label: "font size",
          name: "fSize",
          defaultValue: "16px",
        },
        {
          type: "text",
          label: "Font family",
          name: "fFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "heading",
          label: "filter button",
        },
        {
          type: "color",
          label: "color",
          name: "fbColor",
          defaultValue: "#FFFFFF",
        },
        {
          type: "text",
          label: "font size",
          name: "fbSize",
          defaultValue: "16px",
        },
        {
          type: "text",
          label: "Font family",
          name: "fbFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "heading",
          label: "filter titles ",
        },
        {
          type: "color",
          label: "color",
          name: "ftColor",
          defaultValue: "#FFFFFF",
        },
        {
          type: "text",
          label: "font size",
          name: "ftSize",
          defaultValue: "16px",
        },
        {
          type: "text",
          label: "Font family",
          name: "ftfamily",
          defaultValue: "Montserrat",
        },
        {
          type: "switch",
          label: "uppercase",
          name: "ftuppercase",
          defaultValue: true,
        },
        {
          type: "range",
          label: "letter spacing",
          name: "ftLetter",
          defaultValue: 2,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "select",
          label: "Padding type",
          name: "ftPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "ftPaddingText",
          defaultValue: "1.2rem",
        },
        {
          type: "select",
          label: "Margin type",
          name: "ftMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "ftMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "ftWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        {
          type: "heading",
          label: "collection filter",
        },

        {
          type: "color",
          label: "border color general",
          name: "fcolBorderColor",
          defaultValue: "#fff",
        },
        {
          type: "color",
          label: "background color",
          name: "fcolBgColor",
          defaultValue: "#000555",
        },
        {
          type: "color",
          label: "background color selected",
          name: "fcolBgSelColor",
          defaultValue: "#686868",
        },
        {
          type: "color",
          label: "color",
          name: "fcolColor",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          label: "color",
          name: "fcolSelColor",
          defaultValue: "#37b390",
        },
        {
          type: "text",
          label: "font size",
          name: "fcolSize",
          defaultValue: "16px",
        },
        {
          type: "text",
          label: "Font family",
          name: "fcolfamily",
          defaultValue: "Montserrat",
        },
        {
          type: "switch",
          label: "uppercase",
          name: "fcoluppercase",
          defaultValue: false,
        },
        {
          type: "range",
          label: "letter spacing",
          name: "fcolLetter",
          defaultValue: 2,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "select",
          label: "Padding type",
          name: "fcolPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "fcolPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "fcolMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "fcolMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "fcolWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        {
          type: "heading",
          label: "product filter",
        },

        {
          type: "color",
          label: "border color",
          name: "fproBorderColor",
          defaultValue: "#fff",
        },
        {
          type: "color",
          label: "background color",
          name: "fproBgColor",
          defaultValue: "#000555",
        },
        {
          type: "color",
          label: "background color selected",
          name: "fproBgSelColor",
          defaultValue: "#686868",
        },
        {
          type: "color",
          label: "color",
          name: "fproColor",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          label: "color",
          name: "fproSelColor",
          defaultValue: "#37b390",
        },
        {
          type: "text",
          label: "font size",
          name: "fproSize",
          defaultValue: "16px",
        },
        {
          type: "text",
          label: "Font family",
          name: "fprofamily",
          defaultValue: "Montserrat",
        },
        {
          type: "switch",
          label: "uppercase",
          name: "fprouppercase",
          defaultValue: false,
        },
        {
          type: "range",
          label: "letter spacing",
          name: "fproLetter",
          defaultValue: 2,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "select",
          label: "Margin type",
          name: "fproMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin text",
          name: "fproMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "fproWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
      ],
    },
    {
      group: "collection products",
      inputs: [
        {
          type: "color",
          label: "color collection title",
          name: "collectionTColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "size collection title",
          name: "collecitonSize",
          defaultValue: "20px",
        },
        {
          type: "select",
          label: "Font weight collection title",
          name: "collectionFWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "heading",
          label: "tooltip",
        },
        {
          type: "color",
          label: "color tooltip",
          name: "tooltipColor",
          defaultValue: "#fff",
        },
        {
          type: "color",
          label: "background color tooltip",
          name: "tooltipBgColor",
          defaultValue: "#000",
        },
        {
          type: "text",
          label: "size title tooltip",
          name: "tooltipTSize",
          defaultValue: "20px",
        },
        {
          type: "select",
          label: "Font weight title tooltip",
          name: "tooltipTWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "text",
          label: "size subtitle tooltip",
          name: "tooltipSubTSize",
          defaultValue: "20px",
        },
        {
          type: "select",
          label: "Font weight subtitle tooltip",
          name: "tooltipSubTWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
      ],
    },
    {
      group: "guia content",
      inputs: [
        {
          type: "heading",
          label: "title",
        },
        {
          type: "color",
          label: "color",
          name: "lcTColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "font size",
          name: "lcTSize",
          defaultValue: "2rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "lcTLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "lcTUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "font family",
          name: "lcTFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "lcTPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "lcTPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "lcTMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin text",
          name: "lcTMarginText",
          defaultValue: "2rem",
        },
        {
          type: "select",
          label: "Font weight",
          name: "lcTWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "300",
        },
        {
          type: "heading",
          label: "description",
        },
        {
          type: "color",
          label: "color",
          name: "lcDColor",
          defaultValue: "#A1A1AA",
        },
        {
          type: "text",
          label: "font size",
          name: "lcDSize",
          defaultValue: "0.9rem",
        },
        {
          type: "text",
          label: "font family",
          name: "lcDFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "lcDWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "300",
        },
        {
          type: "heading",
          label: "subtitle",
        },
        {
          type: "color",
          label: "color",
          name: "lcStColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "font size",
          name: "lcStSize",
          defaultValue: "1.1rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "lcStLetter",
          defaultValue: 1,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "lcStUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "font family",
          name: "lcStFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "lcStPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Padding text",
          name: "lcStPaddingText",
          defaultValue: "0.5rem",
        },
        {
          type: "select",
          label: "Margin type",
          name: "lcStMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "y",
        },
        {
          type: "text",
          label: "Margin text",
          name: "lcStMarginText",
          defaultValue: "2.5rem 1rem",
        },
        {
          type: "select",
          label: "Font weight",
          name: "lcStWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "heading",
          label: "especificaciones",
        },
        {
          type: "color",
          label: "color title",
          name: "lcEtColor",
          defaultValue: "#71717A",
        },
        {
          type: "color",
          label: "color value",
          name: "lcEvColor",
          defaultValue: "#E4E4E7",
        },
        {
          type: "text",
          label: "font size",
          name: "lcESize",
          defaultValue: "0.85rem",
        },
        {
          type: "text",
          label: "font family",
          name: "lcEFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "lcEWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "500",
        },
        {
          type: "heading",
          label: "Frequency questions",
        },
        {
          type: "color",
          label: "color title",
          name: "lcFtColor",
          defaultValue: "#71717A",
        },
        {
          type: "color",
          label: "color desc",
          name: "lcFvColor",
          defaultValue: "#E4E4E7",
        },
        {
          type: "text",
          label: "font size",
          name: "lcFSize",
          defaultValue: "0.85rem",
        },
        {
          type: "text",
          label: "font family",
          name: "lcFFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "lcFWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "300",
        },
      ],
    },
  ],
});
