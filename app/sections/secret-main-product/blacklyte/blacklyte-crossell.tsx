import {
  createSchema,
  type ComponentLoaderArgs,
  type WeaverseImage,
  type WeaverseProduct,
} from "@weaverse/hydrogen";
import type { ProductQuery } from "storefront-api.generated";
import type { SectionProps } from "~/components/section";
import { PRODUCT_QUERY } from "~/graphql/queries";
import type { ProductCrossellLoaderData } from "../crosssell/product";
import { useEffect, useRef, useState } from "react";
import { checkPrice } from "~/utils/product";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCrossell } from "~/stores/crosssellStore";
import type { CrossellProduct } from "~/types/crosssell";
import { selectorPaddingMargin, setFecha } from "~/utils/general";

interface BlackLyteCrossellProps {
  producto: WeaverseProduct;
  title: string;
  description: string;
  imagen: WeaverseImage;
  showDetails:boolean;
  bgColor:string;
  cardSize: number;
  gap: number;
  radius: number;
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
  tColor: string;
  tSize: string;
  tFamily: string;
  tPaddingSelect: string;
  tPaddingText: string;
  tMarginSelect: string;
  tMarginText: string;
  tWeight: string;
  dColor: string;
  dSize: string;
  dFamily: string;
  dPaddingSelect: string;
  dPaddingText: string;
  dMarginSelect: string;
  dMarginText: string;
  dWeight: string;
  pCColor: string;
  pColor: string;
  pCSize: string;
  pSize: string;
  pCWeight:string;
  pWeight:string;
  pFamily: string;
  pPaddingSelect: string;
  pPaddingText: string;
  pMarginSelect: string;
  pMarginText: string;
  bRadius: number;
  bBgColor: string;
  bColor: string;
  bSize: string;
  bFamily: string;
  bPaddingSelect: string;
  bPaddingText: string;
  bMarginSelect: string;
  bMarginText: string;
  bWeight: string;
  infoColor: string;
  infoSize: string;
  infoFamily: string;
  infoPaddingSelect: string;
  infoPaddingText: string;
  infoMarginSelect: string;
  infoMarginText: string;
  infoWeight: string;
  iPaddingSelect: string;
  iPaddingText: string;
  iMarginSelect: string;
  iMarginText: string;
}

type BlacklyteCrossProps = SectionProps<ProductCrossellLoaderData> &
  BlackLyteCrossellProps;

if(typeof window !=="undefined"){
  gsap.registerPlugin(useGSAP)
}

function BlacklyteCrossell(props: BlacklyteCrossProps) {
  const {
    loaderData,
    title,
    description,
    imagen,
    showDetails,
    bgColor,
    cardSize,
    gap,
    radius,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    tColor,
    tSize,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    dColor,
    dSize,
    dFamily,
    dPaddingSelect,
    dPaddingText,
    dMarginSelect,
    dMarginText,
    dWeight,
    pCColor,
    pColor,
    pCSize,
    pSize,
    pCWeight,
    pWeight,
    pFamily,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    bRadius,
    bBgColor,
    bColor,
    bSize,
    bFamily,
    bPaddingSelect,
    bPaddingText,
    bMarginSelect,
    bMarginText,
    bWeight,
    infoColor,
    infoSize,
    infoFamily,
    infoPaddingSelect,
    infoPaddingText,
    infoMarginSelect,
    infoMarginText,
    infoWeight,
    iPaddingSelect,
    iPaddingText,
    iMarginSelect,
    iMarginText,
  } = props;
  const product = loaderData?.product;
  const [check, setCheck] = useState(false);
  const crossell = useRef(null);
  const boton = useRef(null);
  const active = useRef(null);
  const crossellObject = useCrossell((state) => state.crossellObjects);
  const setDialog = useCrossell((state) => state.setDialog);
  const changeVisibility = useCrossell((state) => state.changeVisibility);
  const addCrossell = useCrossell((state) => state.addCrossell);
  const addSelectedProduct = useCrossell((state) => state.addSelected);
  const resetSelecteds = useCrossell((state) => state.resetSelecteds);

  if(!product || !product.media){
    return <div className="p-4 border border-dashed">Cargando Producto</div>
  }

  useEffect(() => {
    const media = product.media.nodes.map((elm) => {
      return { url: elm.previewImage.url, alt: elm.previewImage.altText };
    });

    const producto = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      media: media,
      especificaciones: product.especificaciones?.value,
      variantId: product.variants.nodes[0].id,
      price: product.variants.nodes[0].price.amount,
      comparePrice: product.variants.nodes[0].compareAtPrice?.amount,
      available: product.variants.nodes[0].availableForSale,
      tooltip: product.tooltip?.value,
      inventory: product.variants.nodes[0].quantityAvailable,
      fecha: product.publishedAt.split("T")[0],
      fechaReserva:
        product.fechaReserva?.value && setFecha(product.fechaReserva.value),
      selector: null,
    } as CrossellProduct;
    const cross = {
      id: `crossell-${product.handle}`,
      title: "",
      products: [producto],
      selecteds: [],
    };
    addCrossell(cross);
  }, []);

  useGSAP(
    () => {
      active.current = gsap.to(boton.current, {
        background: `linear-gradient(120deg,${bBgColor} 100%, transparent 0%)`,
        color: "white",
        duration: 0.25,
        paused: true,
      });
    },
    { scope: crossell },
  );

  const changeBg = (act: boolean) => {
    if (active.current) {
      if (act) {
        active.current.play();
      } else {
        active.current.reverse();
      }
    }
  };

  const openDialog = () => {
    setDialog(product.id);
    changeVisibility(true);
  };

  useEffect(() => {
    if (check) {
      addSelectedProduct(`crossell-${product.handle}`, product?.id, 1);
    } else {
      resetSelecteds(`crossell-${product.handle}`);
    }
  }, [check]);

  if (product) {
    return (
      <div
        ref={crossell}
        className="flex w-full bg-stone-300 rounded-xl overflow-hidden relative p-3"
        style={{
          height:`${cardSize}rem`,
          background:bgColor,
          borderRadius:radius,
          ...selectorPaddingMargin("padding",paddingSelect,paddingText),
          ...selectorPaddingMargin("margin",marginSelect,marginText),
        }}
      > 
        <div className="w-[70%] h-full flex flex-col content-center"
          style={{
            gap:`${gap}px`
          }}
        >
          <p
            style={{
              color:tColor,
              fontSize:tSize,
              fontFamily:tFamily,
              ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
              ...selectorPaddingMargin("margin",tMarginSelect,tMarginText),
              fontWeight:tWeight
            }}
            >
            { title ? title: product?.nombre?.value ? product.nombre.value : product.title}
          </p>
          
          {description &&
            <p
              style={{
                color:dColor,
                fontSize:dSize,
                fontFamily:dFamily,
                ...selectorPaddingMargin("padding",dPaddingSelect,dPaddingText),
                ...selectorPaddingMargin("margin",dMarginSelect,dMarginText),
                fontWeight:dWeight
              }}
            > 
              {description} 
            </p>
          }

          <div
            style={{
              ...selectorPaddingMargin("margin",pMarginSelect,pMarginText),
              fontFamily:pFamily,
            }}
          >
            <span
            style={{
              color:pColor,
              fontSize:pSize,
              fontWeight:pWeight,
              ...selectorPaddingMargin("padding",pPaddingSelect,pPaddingText),
            }}
            >{checkPrice(product.variants.nodes[0].price?.amount)} €</span>
            {product.variants.nodes[0].compareAtPrice?.amount && (
              <span 
                className="line-through"
                style={{
                  color:pCColor,
                  fontSize:pCSize,
                  fontWeight:pCWeight,
                }}
                >
                {checkPrice(product.variants.nodes[0].compareAtPrice?.amount)} €
              </span>
            )}
          </div>
          <label
            ref={boton}
            htmlFor={`checkbox-${product?.handle}`}
            onMouseEnter={() => changeBg(true)}
            onMouseLeave={() => changeBg(false)}
            className="flex align-center justify-center w-fit cursor-pointer"
            style={{
              background:`linear-gradient(120deg,${bBgColor} 0%, transparent 1%) no-repeat 100% 100%`,
              backgroundSize: "101% 101%",
              borderRadius: `${bRadius}px`,
              border: `1px solid ${bColor}`,
              fontSize: `${bSize}px`,
              fontFamily:bFamily,
              fontWeight:bWeight,
              ...selectorPaddingMargin("padding",bPaddingSelect,bPaddingText),
              ...selectorPaddingMargin("margin",bMarginSelect,bMarginText),
            }}
          >
            <span >{!check ? "Añadir" : "Quitar"}</span>
            <input
              className="absolute opacity-0 cursor-pointer"
              type="checkbox"
              id={`checkbox-${product?.handle}`}
              onChange={() => setCheck((state) => !state)}
              data-productId={product?.id}
              value={product?.id}
              name={product?.id}
              checked={check}
            />
          </label>
          {showDetails && 
            <button
              className=" flex items-center"
              onClick={() => openDialog()}
              style={{
                color:infoColor,
                fontSize:infoSize,
                fontFamily:infoFamily,
                ...selectorPaddingMargin("padding",infoPaddingSelect,infoPaddingText),
                ...selectorPaddingMargin("margin",infoMarginSelect,infoMarginText),
                fontWeight:infoWeight
              }}
            >
              <span className="me-1">Detalles</span>
              <svg
                className="plus"
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: "15px",
                  height: "15px",
                  color: infoColor,
                }}
              >
                <path
                  d="M13.25 7.5C13.25 10.6756 10.6756 13.25 7.5 13.25C4.32436 13.25 1.75 10.6756 1.75 7.5C1.75 4.32436 4.32436 1.75 7.5 1.75C10.6756 1.75 13.25 4.32436 13.25 7.5Z"
                  stroke={infoColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M5 7.5H10"
                  stroke={infoColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M7.5 5L7.5 10"
                  stroke={infoColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>
          }
        </div>
        <div className="w-[70%] h-full flex absolute right-0 top-0 justify-end">
          <img
            className="h-full object-contain"
            style={{
              ...selectorPaddingMargin("padding",iPaddingSelect,iPaddingText),
              ...selectorPaddingMargin("margin",iMarginSelect,iMarginText),
            }}
            src={imagen ? imagen.url : product.featuredImage.url}
            alt={imagen ? imagen.altText : product.featuredImage.altText}
          />
        </div>
      </div>
    );
  }
  return null;
}

export default BlacklyteCrossell;

export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<BlackLyteCrossellProps>) => {
  const { language, country } = weaverse.storefront.i18n;
  const { producto } = data;
  if(!producto?.handle) return {product:null}
  try{

    const { product } = await weaverse.storefront.query<ProductQuery>(PRODUCT_QUERY,{
        variables: {
          country,
          language,
          selectedOptions: [],
          handle: producto.handle,
        },
      });
      if (!product) return { product: null };
      // return {product: product || null};
      return JSON.parse(JSON.stringify({ product }));
  }catch(error){
    console.error("Error cargando producto en crossell:",error)
    return { product: null,};
  }
};

export const schema = createSchema({
  title: "crossell (Blacklyte)",
  type: "crossell-blacktyle",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "product",
          label: "Featured product",
          name: "producto",
        },
        {
          type: "text",
          label: "title",
          name: "title",
        },
        {
          type: "text",
          label: "description",
          name: "description",
        },
        {
          type: "image",
          label: "imagen",
          name: "imagen",
        },
        {
          type:'switch',
          label:'show details',
          name:'showDetails',
          defaultValue:true,
        },
        {
          type:'color',
          label:'background color',
          name:'bgColor',
          defaultValue:'#8f8f8f',
        },
        {
          type: "range",
          label: "container height",
          name: "cardSize",
          defaultValue: 15,
          configs: {
            min: 3,
            max: 50,
            step: 1,
            unit: "rem",
          },
        },
        {
          type: "range",
          label: "gap",
          name: "gap",
          defaultValue: 5,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          label: "border radius",
          name: "radius",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "%",
          },
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
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding text",
          name: "paddingText",
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
      ],
    },
    {
      group: "title",
      inputs: [
        {
          type: "color",
          label: "color",
          name: "tColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "tSize",
          defaultValue: "18px",
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
      group: "description",
      inputs: [
        {
          type: "color",
          label: "color",
          name: "dColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "dSize",
          defaultValue: "18px",
        },
        {
          type: "text",
          label: "font family",
          name: "dFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "dPaddingSelect",
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
          name: "dPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "dMarginSelect",
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
          name: "dMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "dWeight",
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
      group: "price",
      inputs: [
        {
          type: "color",
          label: "color compare price",
          name: "pCColor",
          defaultValue: "#71717A",
        },
        {
          type: "color",
          label: "color Price",
          name: "pColor",
          defaultValue: "#A72A2F",
        },
        {
          type: "text",
          label: "font size compare price",
          name: "pCSize",
          defaultValue: "18px",
        },
        {
          type: "text",
          label: "font size price",
          name: "pSize",
          defaultValue: "18px",
        },
           {
          type: "select",
          label: "Font weight compare price",
          name: "pCWeight",
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
          type: "select",
          label: "Font weight price",
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
          defaultValue: "600",
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
      ],
    },
    {
      group: "button",
      inputs: [
        {
          type: "range",
          label: "border radius",
          name: "bRadius",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "color",
          label: "background color",
          name: "bBgColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "color",
          label: "color",
          name: "bColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "bSize",
          defaultValue: "18px",
        },
        {
          type: "text",
          label: "font family",
          name: "bFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "bPaddingSelect",
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
          name: "bPaddingText",
          defaultValue:"2px 15px"
        },
        {
          type: "select",
          label: "Margin type",
          name: "bMarginSelect",
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
          name: "bMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "bWeight",
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
      group: "details button",
      inputs: [
        {
          type: "color",
          label: "color",
          name: "infoColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "infoSize",
          defaultValue: "18px",
        },
        {
          type: "text",
          label: "font family",
          name: "infoFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "infoPaddingSelect",
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
          name: "infoPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "infoMarginSelect",
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
          name: "infoMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "infoWeight",
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
      group: "imagen",
      inputs: [
        {
          type: "select",
          label: "Padding type",
          name: "iPaddingSelect",
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
          name: "iPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "iMarginSelect",
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
          name: "iMarginText",
        },
      ],
    },
  ],
});
