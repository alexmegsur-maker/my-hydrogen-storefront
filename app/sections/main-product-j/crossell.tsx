import { createSchema, type ComponentLoaderArgs, type HydrogenComponentProps, type WeaverseProduct } from "@weaverse/hydrogen";
import { useEffect } from "react";
import type { ProductQuery } from "storefront-api.generated";
import CrossellProduct from "~/components/product-j/crossell-product";
import { Section } from "~/components/section";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { useCrossell } from "~/stores/crosssellStore";
import { selectorPaddingMargin } from "~/utils/general";

interface CrossellProductJProps extends HydrogenComponentProps {
  title: string;
  productos: WeaverseProduct[];
  // section
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
  // title
  tColor: string;
  tSize: string;
  tLetter: number;
  tUpper: boolean;
  tFamily: string;
  tWeight: string;
  tPaddingSelect: string;
  tPaddingText: string;
  tMarginSelect: string;
  tMarginText: string;
  // container
  cBgColor: string;
  cBorderColor: string;
  cBorderRadius: string;
  cPaddingSelect: string;
  cPaddingText: string;
  cMarginSelect: string;
  cMarginText: string;
  // product item
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
  // lateral 
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

export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<CrossellProductJProps>) => {
  const { language, country } = weaverse.storefront.i18n;
  const { productos } = data;

  if (!productos?.length) return { products: [] };

  const results = await Promise.all(
    productos.map(async (producto) => {
      if (!producto?.handle) return null;
      try {
        const { product } = await weaverse.storefront.query<ProductQuery>(
          PRODUCT_QUERY,
          {
            variables: {
              country,
              language,
              selectedOptions: [],
              handle: producto.handle,
            },
          }
        );
        return product ?? null;
      } catch (error) {
        console.error("Error cargando producto:", error);
        return null;
      }
    })
  );

  return JSON.parse(JSON.stringify({ products: results.filter(Boolean) }));
};

export default function  CrossellProductJ (props:CrossellProductJProps){
  const {
    title, productos, loaderData,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tWeight,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    cBgColor,
    cBorderColor,
    cBorderRadius,
    cPaddingSelect,
    cPaddingText,
    cMarginSelect,
    cMarginText,
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
  
    ...rest
  } = props;

  const products = loaderData?.products ?? [];

  return(
    <Section {...rest}>
      <div 
        className="config-section"
        style={{
          ...selectorPaddingMargin("padding", paddingSelect, paddingText),
          ...selectorPaddingMargin("margin", marginSelect, marginText),
        }}
        >
            <div className="section-header flex justify-between items-baseline mb-[1.5rem]">
              <div 
                className="config-label"
                style={{
                  color: tColor,
                  fontFamily: tFamily,
                  fontSize: tSize,
                  fontWeight: tWeight,
                  textTransform: tUpper ? "uppercase" : "unset",
                  letterSpacing: `${tLetter}px`,
                  ...selectorPaddingMargin("padding", tPaddingSelect, tPaddingText),
                  ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
                }}
                >
                {title}
              </div>
            </div>
            <div 
              className="acc-container"
              style={{
                backgroundColor: cBgColor,
                border: `1px solid ${cBorderColor}`,
                borderRadius: cBorderRadius,
                ...selectorPaddingMargin("padding", cPaddingSelect, cPaddingText),
                ...selectorPaddingMargin("margin", cMarginSelect, cMarginText),
              }}
              >
              <div className="acc-list flex flex-col gap-0">
                {products.map((product,index)=>{
                  const posicion = index == 0 ? "start":index != products.length-1 ? "middle":"end"                  
                  return (
                    <CrossellProduct 
                      key={product.id} 
                      position={ posicion } 
                      producto={product}
                      ptColor={ptColor}
                      ptSize={ptSize}
                      ptFamily={ptFamily}
                      ptWeight={ptWeight}
                      ppColor={ppColor}
                      ppSize={ppSize}
                      ppFamily={ppFamily}
                      ppWeight={ppWeight}
                      plColor={plColor}
                      plSize={plSize}
                      pbColor={pbColor}
                      pbHoverColor={pbHoverColor}
                      pbCheckedColor={pbCheckedColor}
                      pbBorderColor={pbBorderColor}
                      bgColor={bgColor}
                      lcPaddingSelect={lcPaddingSelect}
                      lcPaddingText={lcPaddingText}
                      lcMarginSelect={lcMarginSelect}
                      lcMarginText={lcMarginText}
                      brColor={brColor}
                      brSize={brSize}
                      brLetter={brLetter}
                      brUpper={brUpper}
                      brFamily={brFamily}
                      brPaddingSelect={brPaddingSelect}
                      brPaddingText={brPaddingText}
                      brMarginSelect={brMarginSelect}
                      brMarginText={brMarginText}
                      brWeight={brWeight}
                      ntColor={ntColor}
                      ntSize={ntSize}
                      ntLetter={ntLetter}
                      ntUpper={ntUpper}
                      ntFamily={ntFamily}
                      ntPaddingSelect={ntPaddingSelect}
                      ntPaddingText={ntPaddingText}
                      ntMarginSelect={ntMarginSelect}
                      ntMarginText={ntMarginText}
                      ntWeight={ntWeight}
                      lcTColor={lcTColor}
                      lcTSize={lcTSize}
                      lcTLetter={lcTLetter}
                      lcTUpper={lcTUpper}
                      lcTFamily={lcTFamily}
                      lcTPaddingSelect={lcTPaddingSelect}
                      lcTPaddingText={lcTPaddingText}
                      lcTMarginSelect={lcTMarginSelect}
                      lcTMarginText={lcTMarginText}
                      lcTWeight={lcTWeight}
                      lcPColor={lcPColor}
                      lcPSize={lcPSize}
                      lcPLetter={lcPLetter}
                      lcPUpper={lcPUpper}
                      lcPFamily={lcPFamily}
                      lcPPaddingSelect={lcPPaddingSelect}
                      lcPPaddingText={lcPPaddingText}
                      lcPMarginSelect={lcPMarginSelect}
                      lcPMarginText={lcPMarginText}
                      lcPWeight={lcPWeight}
                      lcDColor={lcDColor}
                      lcDSize={lcDSize}
                      lcDFamily={lcDFamily}
                      lcDWeight={lcDWeight}
                      lcStColor={lcStColor}
                      lcStSize={lcStSize}
                      lcStLetter={lcStLetter}
                      lcStUpper={lcStUpper}
                      lcStFamily={lcStFamily}
                      lcStPaddingSelect={lcStPaddingSelect}
                      lcStPaddingText={lcStPaddingText}
                      lcStMarginSelect={lcStMarginSelect}
                      lcStMarginText={lcStMarginText}
                      lcStWeight={lcStWeight}
                      lcEtColor={lcEtColor}
                      lcEvColor={lcEvColor}
                      lcESize={lcESize}
                      lcEFamily={lcEFamily}
                      lcEWeight={lcEWeight}
                      />
                  )
                })}
              </div>
            </div>
          </div>
    </Section>
  )
}

export const schema = createSchema({
  type: "crossell-productJ",
  title: "crossell product",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "text",
          label: "title",
          name: "title",
          defaultValue: "04. Ecosistema PHOENIX",
        },
        {
          type: "product-list",
          label: "Select products",
          name: "productos",
        },
      ],
    },
    {
      group: "Section",
      inputs: [
        {
          type: "heading",
          label: "padding / margin",
        },
        {
          type: "select",
          label: "Padding type",
          name: "paddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Padding value",
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
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin value",
          name: "marginText",
          defaultValue: "3.5rem",
        },
      ],
    },
    {
      group: "Title",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "tColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Font size",
          name: "tSize",
          defaultValue: "0.9rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "tLetter",
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
          label: "Uppercase",
          name: "tUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "tFamily",
          defaultValue: "Montserrat",
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
        {
          type: "select",
          label: "Padding type",
          name: "tPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
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
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin value",
          name: "tMarginText",
        },
      ],
    },
    {
      group: "Container",
      inputs: [
        {
          type: "color",
          label: "Background color",
          name: "cBgColor",
          defaultValue: "rgba(255,255,255,0.02)",
        },
        {
          type: "color",
          label: "Border color",
          name: "cBorderColor",
          defaultValue: "rgba(255,255,255,0.08)",
        },
        {
          type: "text",
          label: "Border radius",
          name: "cBorderRadius",
          defaultValue: "12px",
        },
        {
          type: "select",
          label: "Padding type",
          name: "cPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "cPaddingText",
          defaultValue: "1.5rem",
        },
        {
          type: "select",
          label: "Margin type",
          name: "cMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin value",
          name: "cMarginText",
          defaultValue: "2rem",
        },
      ],
    },
    {
      group: "Product item",
      inputs: [
        {
          type: "heading",
          label: "title",
        },
        {
          type: "color",
          label: "Color",
          name: "ptColor",
          defaultValue: "#F4F4F5",
        },
        {
          type: "text",
          label: "Font size",
          name: "ptSize",
          defaultValue: "0.9rem",
        },
        {
          type: "text",
          label: "Font family",
          name: "ptFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "ptWeight",
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
          label: "price",
        },
        {
          type: "color",
          label: "Color",
          name: "ppColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Font size",
          name: "ppSize",
          defaultValue: "0.75rem",
        },
        {
          type: "text",
          label: "Font family",
          name: "ppFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "ppWeight",
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
          label: "saber más link",
        },
        {
          type: "color",
          label: "Color",
          name: "plColor",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          label: "Font size",
          name: "plSize",
          defaultValue: "0.7rem",
        },
        {
          type: "heading",
          label: "button",
        },
        {
          type: "color",
          label: "Color default",
          name: "pbColor",
          defaultValue: "#A1A1AA",
        },
        {
          type: "color",
          label: "Color hover",
          name: "pbHoverColor",
          defaultValue: "#fff",
        },
        {
          type: "color",
          label: "Color checked",
          name: "pbCheckedColor",
          defaultValue: "#52d34e",
        },
        {
          type: "color",
          label: "Border color",
          name: "pbBorderColor",
          defaultValue: "#52525B",
        },
      ],
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
          label:'price',
        },
        {
          type:'color',
          label:'color',
          name:'lcPColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'lcPSize',
          defaultValue:'1.2rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'lcPLetter',
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
          name:'lcPUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'lcPFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'lcPPaddingSelect',
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
          name:'lcPPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'lcPMarginSelect',
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
          name:'lcPMarginText',
          defaultValue:"0.5rem"
        },
        {
          type:'select',
          label:'Font weight',
          name:'lcPWeight',
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