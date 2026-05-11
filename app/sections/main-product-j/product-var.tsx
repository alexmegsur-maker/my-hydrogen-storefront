import {
  createSchema,
  useParentInstance,
  type WeaverseProduct,
} from "@weaverse/hydrogen";
import { useCallback, useEffect, useState } from "react";
import type { ProductQuery } from "storefront-api.generated";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { createCurProVar } from "~/routes/collections/utils";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";

interface ProductVarProps {
  producto: WeaverseProduct;
  title: string;
  tooltip: string;
}

interface ApiResponseProduct{
  result:ProductQuery
  ok:boolean;
  errorMessage?:string;
}

function ProductVar(props: ProductVarProps) {
  const { producto, title, tooltip } = props;
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const currentProduct = useCurrentProduct((state) => state.currentProduct);
  const parentInst = useParentInstance();
  const [active, setActive] = useState(false);
  const getApiUrl = usePrefixPathWithLocale(`api/product-secret`);
  const setCurrent = useCurrentProduct(state=>state.setProduct);
  

  useEffect(() => {
    console.log("producto", producto);
    console.log("currentProduct", currentProduct);
    if (producto?.handle == currentProduct?.handle) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [currentProduct]);

const setProduct = useCallback(async()=>{
    if (active) return
    const startsUrl = window.location.href.split("products")[0] + "products/"
    const newUrl = startsUrl+producto.handle
    const nextState = {additionalInformation:'Updated the URL with JS'}
    window.history.pushState(nextState,'',newUrl)
    window.history.replaceState(nextState,'',newUrl)

    try{
      const res = await fetch(getApiUrl,{
        method:"POST",
        body:JSON.stringify({handle:producto.handle})
      })
      const data = await res.json() as ApiResponseProduct
      if(data.ok){
        const prod = createCurProVar(data.result)
        setCurrent(prod)
      }
    }catch(err){
      console.log("Error loading product:",err)
    }
    
  },[producto.handle,active,setCurrent,getApiUrl])



  return (
    <div className="options-list flex flex-col gap-[0.5rem]" id="universo-list">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={setProduct}
        className="option-item active hover:pl-[10px] flex justify-between items-center cursor-pointer"
        style={{
          padding: isHovered ? "1rem 0 1rem 10px" : "1rem 0",
          borderBottom: `1px solid ${active || isHovered ? "#fff3" : "#ffffff08"}`,
          transition: "all 0.4s ease",
          opacity: active || isHovered ? "1" : "0.6",
        }}
      >
        <div className="option-left flex flex-col gap-[4px]">
          <span
            className="option-title"
            style={{
              fontFamily: parentInst?.data?.family,
              fontSize: parentInst?.data?.size,
              fontWeight: active ? parentInst?.data?.weight : "400",
              textTransform: parentInst?.data?.upper ? "uppercase" : "unset",
              letterSpacing: active
                ? `${parentInst?.data?.letter}px`
                : "normal",
              color: parentInst?.data?.color,
              transition: "all 0.3s",
            }}
          >
            {title}
          </span>
          <span
            className="option-desc"
            style={{
              fontFamily: parentInst?.data?.sFamily,
              fontSize: parentInst?.data?.sSize,
              fontWeight: parentInst?.data?.sWeight,
              textTransform: parentInst?.data?.Upper ? "uppercase" : "unset",
              letterSpacing:
                parentInst?.data?.pLetter > 0
                  ? `${parentInst?.data?.sLetter}px`
                  : "normal",
              color: parentInst?.data?.sColor,
              ...selectorPaddingMargin(
                "padding",
                parentInst?.data?.sPaddingSelect,
                parentInst?.data?.sPaddingText,
              ),
              ...selectorPaddingMargin(
                "margin",
                parentInst?.data?.sMarginSelect,
                parentInst?.data?.sMarginText,
              ),
            }}
          >
            {tooltip}
          </span>
        </div>
        <div
          className="selector-dot flex items-center justify-center"
          style={{
            backgroundColor: active ? parentInst?.data?.color : "transparent",
            boxShadow: active ? "0 0 10px #fff6" : "none",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            border: `1px solid ${active ? parentInst?.data?.color : "#52525B"}`,
            transition: "all 0.3s",
          }}
        />
      </div>
    </div>
  );
}

export default ProductVar;

export const schema = createSchema({
  type: "product-var",
  title: "Product",
  settings: [
    {
      group: "general",
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
          defaultValue: "title",
        },
        {
          type: "text",
          label: "tooltip",
          name: "tooltip",
          defaultValue: "",
        },
      ],
    },
  ],
});
