import { createSchema, type WeaverseCollection } from "@weaverse/hydrogen";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { CollectionsByIdsQuery } from "storefront-api.generated";
import ProductCardCollection from "~/components/product-secret/product-card-collection";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { useColorStore } from "~/sections/header-edit/registerColors";
import { selectorPaddingMargin } from "~/utils/general";

interface ApiResponseCollection {
  result: CollectionsByIdsQuery;
  ok: boolean;
  errorMessage?: string;
}

interface BlacklyteVariantsProps {
  estilos: "style1" | "style2";
  collections: WeaverseCollection[];
  selectedColor: string;
  cardRadius: number;
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
  bsColor: string;
  bsBgColor: string;
  bRadius: number;
  bColor: string;
  bBgColor: string;
  bSize: string;
  bFamily: string;
  bPaddingSelect: string;
  bPaddingText: string;
  bMarginSelect: string;
  bMarginText: string;
  bWeight: string;
}

function BlacklyteVariants(props: BlacklyteVariantsProps) {
  const {
    estilos,
    collections,
    selectedColor,
    cardRadius,
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
    bsColor,
    bsBgColor,
    bRadius,
    bColor,
    bBgColor,
    bSize,
    bFamily,
    bPaddingSelect,
    bPaddingText,
    bMarginSelect,
    bMarginText,
    bWeight,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [collectionsData, setCollectionsData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [options, setOptions] = useState([]);
  const [filters, setFilters] = useState([]);
  const colores = useColorStore((state)=>state.colors)
  const getApiUrl = usePrefixPathWithLocale(`api/collection`);
  const products = collectionsData
  ?.filter((col) => col.products?.edges?.length > 0)
  .flatMap((col) => col.products.edges);
  const optionsList = products?.flatMap((prod) => prod.node.options);
  const [productFiltered, setProductFiltered] = useState(products);
  
  useEffect(() => {
    if (collections && collections.length > 0) {
      let ids = collections.map((elm) => {
        return `gid://shopify/Collection/${elm.id}`;
      });
      setIsLoading(true);
      const loadCollection = async (retryCount = 0) => {
        try {
          const res = await fetch(getApiUrl, {
            method: "POST",
            body: JSON.stringify({ ids: ids }),
          });
          const data = (await res.json()) as ApiResponseCollection;
          if (data.ok) {
            setCollectionsData(data.result.nodes);
            setIsLoading(false);
          } else {
            if (retryCount < 3) {
              await new Promise((resolve) => setTimeout(resolve, 1500));
              return loadCollection(retryCount + 1);
            } else {
              setCollectionsData([]);
              setIsLoading(false);
            }
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
    }
  }, [collections, getApiUrl]);

  useEffect(() => {
    if (collectionsData && products?.length > 0) {
      // 1. Usamos un objeto para agrupar valores por nombre de opción
      const optionsMap = {};

      products.forEach((prod) => {
        prod.node.options.forEach((opt) => {
          const name = opt.name;
          // Ignoramos "Title" de una vez aquí si lo deseas
          if (name === "Title") return;

          if (!optionsMap[name]) {
            optionsMap[name] = new Set(); // Set garantiza valores únicos automáticamente
          }

          opt.optionValues.forEach((val) => {
            optionsMap[name].add(val.name);
          });
        });
      });

      // 2. Convertimos el Map a la estructura de array que necesitas
      const formattedOptions = Object.keys(optionsMap).map((name) => ({
        name: name,
        values: Array.from(optionsMap[name]),
      }));

      setOptions(formattedOptions);
    }
  }, [collectionsData]);


  useEffect(()=>{
    let productsSelected = products.map((elm)=>{
      let opciones= elm.node.options.flatMap(e=>e.optionValues)
      let encontrado = false
      opciones.forEach((f)=>{
        if(filters.includes(f.name)){
          encontrado=true          
        }
      })
      if(encontrado){
        return elm
      }
      return 
    })
    if(filters.length>0){
      setProductFiltered(productsSelected.filter((e)=>e!=undefined))
    }else{
      setProductFiltered(products)
    }
  },[filters])
  
  const handleOnChange = (title:string)=>{
    if(filters.includes(title)){
      let newFilters = filters.filter((e)=>e != title)
      setFilters(newFilters)
    }else{
      setFilters(state=>[...state,title])
    }
  }

  const handleSelect = (index: number) => {
    setActiveTab(index);
  };

  const titleStyle =useMemo(()=>{return {
    color: tColor,
    fontSize: tSize,
    fontFamily: tFamily,
    fontWeight: tWeight,
    ...selectorPaddingMargin("padding", tPaddingSelect, tPaddingText),
    ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
  } as CSSProperties;},[tColor,tSize,tFamily,tWeight,tPaddingSelect,tPaddingText,tMarginSelect,tMarginText]) 


  if (isLoading && (!collectionsData || collectionsData.length === 0)) {
    return <div className="p-10 text-center">Cargando colecciones...</div>;
  }

  if (!collectionsData || collectionsData.length === 0) {
    return (
      <div className="p-10 text-center">
        No se encontraron productos en las colecciones seleccionadas.
      </div>
    );
  }
  return (
    <div
      style={{
        ...selectorPaddingMargin("padding", paddingSelect, paddingText),
        ...selectorPaddingMargin("margin", marginSelect, marginText),
      }}
    >
      {estilos == "style1" && (
        <>
          <div>
            <div style={titleStyle}>
              <span>Configuracíon</span>
            </div>
            <div className=" flex gap-2">
              {collectionsData?.map((col, index) => {
                const isSelected = activeTab === index;
                return (
                  <div
                    className="w-fit py-1 px-2 transition-all duration-500 ease-in-out cursor-pointer"
                    key={index}
                    onClick={() => handleSelect(index)}
                    style={{
                      background: isSelected ? bsBgColor : bBgColor,
                      color: isSelected ? bsColor : bColor,
                      border: `1px solid ${isSelected ? bsBgColor : bColor}`,
                      borderRadius: `${bRadius}px`,
                      textAlign: "center",
                      fontSize: bSize,
                      fontFamily: bFamily,
                      fontWeight: bWeight,
                      ...selectorPaddingMargin(
                        "padding",
                        bPaddingSelect,
                        bPaddingText,
                      ),
                      ...selectorPaddingMargin(
                        "margin",
                        bMarginSelect,
                        bMarginText,
                      ),
                    }}
                  >
                    <span className="pointer-events-none">
                      {col.title.split(" ")[0] + " " + col.title.split(" ")[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div style={titleStyle}>
              <span>Variantes</span>
            </div>
            {collectionsData?.map((col, index) => {
              const isSelected = activeTab === index;
              const productos = col?.products?.edges || [];
              return (
                <div
                  key={index}
                  className="grid gap-2 pb-4 grid-cols-4 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: isSelected ? 1 : 0,
                    display: isSelected ? "grid" : "none",
                  }}
                >
                  {productos?.map((prod) => {
                    const variante = prod.node?.variants?.edges[0]?.node;
                    if (!variante) return null;
                    return (
                      <ProductCardCollection
                        key={prod.node.id}
                        product={prod.node}
                        variante={variante}
                        selectColor={selectedColor}
                        rounded={cardRadius}
                        tooltipProps={{
                          tooltipColor: "#fff",
                          tooltipBgColor: "#000",
                          tooltipTSize: "14px",
                          tooltipTWeight: "600",
                          tooltipSubTSize: "12px",
                          tooltipSubTWeight: "400",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}
      {estilos == "style2" && (
        <>
          {options.map((option) => {
            if (option.name != "Title") {
              return (
                <div key={option}>
                  <div style={titleStyle}>
                    <span>{option.name}</span>
                  </div>
                  <div className=" flex gap-2">
                    
                    {option.values?.map((opt, index) => {
                      const isSelected = filters.includes(opt);
                      if(option.name.toLowerCase() ==="color"){
                        let color = colores.find((e)=>e.identifier.toLowerCase()=== opt.toLowerCase() )
                        return (
                          <label 
                            className="relative group cursor-pointer rounded-full flex content-center justify-center" 
                            htmlFor={`title-checkbox-${opt.split(" ").join("")}`}
                            style={{
                               border:isSelected && `1px solid black`,
                               padding: isSelected && "2px"
                            }}
                            >
                            <div
                              className="rounded-full"
                              style={{
                               
                                width:isSelected ?"14px":"20px",
                                height:isSelected ?"14px":"20px",
                                background:color?.color2 != undefined ?`linear-gradient(126deg,${color.color1} 50%, ${color.color2} 50%)`:color.color1,
                              }}
                            >
                              <span 
                                className="absolute flex px-2 py-1 top-0 rounded-lg text-white bg-black opacity-0 group-has-hover:opacity-100 w-fit text-[14px] -translate-y-[120%]"
                              >
                                {opt}
                                <span
                                  className="mt-[6px] translate-y-[6px] absolute bottom-0"
                                  style={{
                                    width:"0px",   
                                    height:"0px",
                                    borderLeft:"5px solid transparent",   
                                    borderRight:"5px solid transparent",   
                                    borderBottom:"6px solid black",
                                    rotate:"180deg"   
                                  }} 
                                ></span>
                              </span>
                              <input type="checkbox" id={`title-checkbox-${opt.split(" ").join("")}`} name={opt} value={opt} checked={filters.includes(opt)} onChange={()=>handleOnChange(opt)} className="hidden"/>
                            </div>
                          </label>
                        )
                      }
                      return (
                        <label
                          htmlFor={`title-checkbox-${opt.split(" ").join("")}`}
                          className="w-fit py-1 px-2 transition-all duration-500 ease-in-out cursor-pointer"
                          key={index}
                          style={{
                            background: isSelected ? bsBgColor : bBgColor,
                            color: isSelected ? bsColor : bColor,
                            border: `1px solid ${isSelected ? bsBgColor : bColor}`,
                            borderRadius: `${bRadius}px`,
                            textAlign: "center",
                            fontSize: bSize,
                            fontFamily: bFamily,
                            fontWeight: bWeight,
                            ...selectorPaddingMargin(
                              "padding",
                              bPaddingSelect,
                              bPaddingText,
                            ),
                            ...selectorPaddingMargin(
                              "margin",
                              bMarginSelect,
                              bMarginText,
                            ),
                          }}
                        >
                          <span className="pointer-events-none">
                            {opt}
                          </span>
                          <input type="checkbox" id={`title-checkbox-${opt.split(" ").join("")}`} name={opt} value={opt} checked={filters.includes(opt)} onChange={()=>handleOnChange(opt)} className="hidden"/>

                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            }
          })}
          <div>
            <div style={titleStyle}>
              <span>Variantes</span>
            </div>
           
                <div
                  className="grid gap-2 pb-4 grid-cols-4 transition-all duration-700 ease-in-out"
                >
                  {productFiltered.length>0 ? productFiltered.map((prod) => {
                    const variante = prod.node?.variants?.edges[0]?.node;
                    if (!variante) return null;
                    return (
                      <ProductCardCollection
                        key={prod.node.id}
                        product={prod.node}
                        variante={variante}
                        selectColor={selectedColor}
                        rounded={cardRadius}
                        tooltipProps={{
                          tooltipColor: "#fff",
                          tooltipBgColor: "#000",
                          tooltipTSize: "14px",
                          tooltipTWeight: "600",
                          tooltipSubTSize: "12px",
                          tooltipSubTWeight: "400",
                        }}
                      />
                    );
                  }): products.map((prod) => {
                    const variante = prod.node?.variants?.edges[0]?.node;
                    if (!variante) return null;
                    return (
                      <ProductCardCollection
                        key={prod.node.id}
                        product={prod.node}
                        variante={variante}
                        selectColor={selectedColor}
                        rounded={cardRadius}
                        tooltipProps={{
                          tooltipColor: "#fff",
                          tooltipBgColor: "#000",
                          tooltipTSize: "14px",
                          tooltipTWeight: "600",
                          tooltipSubTSize: "12px",
                          tooltipSubTWeight: "400",
                        }}
                      />
                    );
                  })}
                </div>
            
          </div>
        </>
      )}
    </div>
  );
}

export default BlacklyteVariants;

export const schema = createSchema({
  title: "Variants blacklyte",
  type: "variants-blacklyte",
  settings: [
    {
      group: "general",
      inputs: [
        {
          type: "select",
          label: "Styles",
          name: "estilos",
          configs: {
            options: [
              { value: "style1", label: "Style 1" },
              { value: "style2", label: "Style 2" },
            ],
          },
          defaultValue: "style1",
        },
        {
          type: "collection-list",
          label: "collections",
          name: "collections",
        },
        {
          type: "color",
          label: "card select color",
          name: "selectedColor",
          defaultValue: "#000",
        },
        {
          type: "range",
          label: "card radius",
          name: "cardRadius",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
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
          defaultValue: "24px 32px",
        },
        {
          type: "select",
          label: "Margin type ",
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
      group: "titles",
      inputs: [
        {
          type: "color",
          label: "color",
          name: "tColor",
          defaultValue: "#000",
        },
        {
          type: "text",
          label: "font size",
          name: "tSize",
          defaultValue: "20px",
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
          defaultValue: "400",
        },
      ],
    },
    {
      group: "buttons",
      inputs: [
        {
          type: "heading",
          label: "selected",
        },
        {
          type: "color",
          label: "color",
          name: "bsColor",
          defaultValue: "#fff",
        },
        {
          type: "color",
          label: "background color",
          name: "bsBgColor",
          defaultValue: "#000",
        },
        {
          type: "heading",
          label: "default",
        },
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
          label: "color",
          name: "bColor",
          defaultValue: "#000",
        },
        {
          type: "color",
          label: "background color",
          name: "bBgColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "font size",
          name: "bSize",
          defaultValue: "16px",
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
          defaultValue: "400",
        },
      ],
    },
  ],
});
