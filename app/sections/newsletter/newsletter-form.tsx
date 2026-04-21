import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useFetcher } from "react-router";
import { Banner } from "~/components/banner";
import type { CustomerApiPlayLoad } from "~/routes/api/customer";
import { selectorPaddingMargin } from "~/utils/general";
import { useState } from "react";

interface NewsLetterInputProps extends HydrogenComponentProps {
width:string;
successText:string;
lColor:string;
lSize:string;
lLetter:number;
lineH:number;
lUpper:boolean;
lFamily:string;
lWeight:string;
lMarginSelect:string;
lMarginText:string;
statusLabel:string;
stColor:string;
stSize:string;
stLetter:number;
stlineH:number;
stUpper:boolean;
stFamily:string;
stWeight:string;
stMarginSelect:string;
stMarginText:string;
title:string;
tColor:string;
tSize:string;
tLetter:number;
tlineH:number;
tUpper:boolean;
tFamily:string;
tWeight:string;
tMarginSelect:string;
tMarginText:string;
paragraph:string;
pColor:string;
pSize:string;
pLetter:number;
plineH:number;
pUpper:boolean;
pFamily:string;
pWeight:string;
pMarginSelect:string;
pMarginText:string;
buttonText:string;
bSize:string;
backgroundColor:string;
textColor:string;
borderColor:string;
backgroundColorHover:string;
textColorHover:string;
borderColorHover:string;
bLetter:number;
blineH:number;
bUpper:boolean;
bFamily:string;
bWeight:string;
bMarginSelect:string;
bMarginText:string;
footerText:string;
fColor:string;
fSize:string;
fLetter:number;
flineH:number;
fUpper:boolean;
fFamily:string;
fWeight:string;
fMarginSelect:string;
fMarginText:string;
}

export default function NewsLetterForm(props: NewsLetterInputProps) {
  const {
    width,
    successText,
    lColor,
    lSize,
    lLetter,
    lUpper,
    lFamily,
    lWeight,
    lMarginSelect,
    lMarginText,
    statusLabel,
    stColor,
    stSize,
    stLetter,
    stUpper,
    stFamily,
    stWeight,
    stMarginSelect,
    stMarginText,
    title,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tWeight,
    tMarginSelect,
    tMarginText,
    paragraph,
    pColor,
    pSize,
    pLetter,
    pUpper,
    pFamily,
    pWeight,
    pMarginSelect,
    pMarginText,
    buttonText,
    bSize,
    backgroundColor,
    textColor,
    borderColor,
    backgroundColorHover,
    textColorHover,
    borderColorHover,
    bLetter,
    bUpper,
    bFamily,
    bWeight,
    bMarginSelect,
    bMarginText,
    footerText,
    fColor,
    fSize,
    fLetter,
    fUpper,
    fFamily,
    fWeight,
    fMarginSelect,
    fMarginText,
    lineH,
    stlineH,
    tlineH,
    plineH,
    blineH,
    flineH,
    ...rest
  } = props;

  const fetcher = useFetcher();
  const { state, Form } = fetcher;
  const data = fetcher.data as CustomerApiPlayLoad;
  const submitted = state === "idle" && data;
  const { ok, errorMessage } = data || {};
  const [isHover,setIsHover]=useState(false)

  return (
    <div
      {...rest}
      className="mx-auto flex flex-col items-center justify-center  text-center animate-in fade-in slide-in-from-bottom-8 duration-1000"
      style={{
        padding:"3rem",
        maxWidth: `${width}px`,
        backgroundColor: "rgba(5, 5, 5, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
      }}
    >
      {/* Status Label */}
      <div 
        className=" flex items-center justify-center gap-2.5 font-light tracking-[4px]"
        style={{
          color: stColor,
          fontFamily: stFamily,
          fontSize: stSize,
          fontWeight: stWeight,
          lineHeight:stlineH>0 ? stlineH:"unset",
          textTransform: stUpper ? "uppercase" : "unset",
          letterSpacing: stLetter > 0 ? `${stLetter}px`:"normal",
          ...selectorPaddingMargin("margin", stMarginSelect, stMarginText),
        }}
        >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
        </span>
        {statusLabel}
      </div>

      <h2
        style={{
          color: tColor,
          lineHeight:tlineH>0 ? tlineH:"unset",
          fontSize: tSize,
          letterSpacing: tLetter > 0 ? `${tLetter}px` : "normal",
          textTransform: tUpper ? "uppercase" : "none",
          fontFamily: tFamily,
          fontWeight: tWeight,
          ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: pColor,
          fontSize: pSize,
          lineHeight:plineH>0 ? plineH:"unset",
          letterSpacing: pLetter > 0 ? `${pLetter}px` : "normal",
          textTransform: pUpper ? "uppercase" : "none",
          fontFamily: pFamily,
          fontWeight: pWeight,
          ...selectorPaddingMargin("margin", pMarginSelect, pMarginText),
        }}
      >
        {paragraph}
      </p>

      <Form
        method="POST"
        action="/api/customer"
        className="flex w-full flex-col gap-6"
      >
        <div className="flex flex-col text-left">
          <label
            style={{
              color: lColor,
              fontSize: lSize,
              lineHeight:lineH>0 ? lineH:"unset",
              letterSpacing: lLetter > 0 ? `${lLetter}px` : "normal",
              textTransform: lUpper ? "uppercase" : "none",
              fontFamily: lFamily,
              fontWeight: lWeight,
              ...selectorPaddingMargin("margin", lMarginSelect, lMarginText),
            }}
          >
            Identificador (Email)
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="nombre@correo.com"
            className="w-full border-x-0 border-t-0 border-b border-white/10 bg-transparent py-3 text-base text-white transition-colors duration-300 focus:border-white outline-none focus:outline-none focus:ring-0 font-['Montserrat']"
          />
        </div>

        <button
          type="submit"
          disabled={state === "submitting"}
          onMouseEnter={()=>setIsHover(true)}
          onMouseLeave={()=>setIsHover(false)}
          style={{
            border:`1px solid ${!isHover ? borderColor:borderColorHover}`,
            background:!isHover?backgroundColor:backgroundColorHover,
            color:!isHover ? textColor:textColorHover,
            fontFamily: bFamily,
            fontSize: bSize,
            lineHeight:blineH>0 ? blineH:"unset",
            fontWeight: bWeight,
            textTransform: bUpper ? "uppercase" : "unset",
            letterSpacing: bLetter > 0 ? `${bLetter}px`:"normal",
            ...selectorPaddingMargin("margin", bMarginSelect, bMarginText),
          }}
          className="w-full py-4  tracking-[3px] transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {state === "submitting" ? "Procesando..." : buttonText}
        </button>
      </Form>
      {submitted && (
        <Banner variant={ok ? "success" : "error"} className="mt-4">
          {ok ? successText : errorMessage || "Something went wrong"}
        </Banner>
      )}

      <div
        style={{
          color: fColor,
          fontFamily: fFamily,
          fontSize: fSize,
          fontWeight: fWeight,
          lineHeight:flineH>0 ? flineH:"unset",
          textTransform: fUpper ? "uppercase" : "unset",
          letterSpacing: fLetter > 0 ? `${fLetter}px`:"normal",
          ...selectorPaddingMargin("margin", fMarginSelect, fMarginText),
        }}
      >
        {footerText}
      </div>
    </div>
  );
}

export const schema = createSchema({
  type: "newsletter-form",
  title: "Phoenix Terminal Form",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "range",
          name: "width",
          label: "Terminal Width",
          configs: { min: 350, max: 600, step: 10, unit: "px" },
          defaultValue: 450,
        },
        {
          type: "text",
          name: "successText",
          label: "Success message",
          placeholder: "🎉 Thank you for subscribing!",
          defaultValue: "🎉 Thank you for subscribing!",
        },
      ],
    },
    {
      group:"statusLabel",
      inputs:[
        
        {
          type: "color",
          label: "Color",
          name: "lColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Font size",
          name: "lSize",
          defaultValue: "0.75rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "lLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type:'range',
          label:'line heading',
          name:'lineH',
          defaultValue:1.1,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'u',
          }
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "lUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "lFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "lWeight",
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
          label: "Margin type",
          name: "lMarginSelect",
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
          name: "lMarginText",
        },
      
      ]
    },
    {
      group:"subTitle",
      inputs:[
        {
          type: "text",
          name: "statusLabel",
          label: "Status Label",
          defaultValue: "Invitación VIP Detectada",
        },
        
        {
          type: "color",
          label: "Color",
          name: "stColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Font size",
          name: "stSize",
          defaultValue: "0.75rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "stLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type:'range',
          label:'line heading',
          name:'stlineH',
          defaultValue:1.1,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'u',
          }
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "stUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "stFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "stWeight",
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
          label: "Margin type",
          name: "stMarginSelect",
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
          name: "stMarginText",
        },
      
      ]
    },
    {
      group: "Title",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Has sido invitado a la red phoenix",
        },
        {
          type: "color",
          name: "tColor",
          label: "Color",
          defaultValue: "#ffffff",
        },
        { type: "text", name: "tSize", label: "Size", defaultValue: "1.5rem" },
 
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
          type:'range',
          label:'line heading',
          name:'tlineH',
          defaultValue:1.1,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'u',
          }
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
          name: "tMarginSelect",
          label: "Margin Type",
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
          name: "tMarginText",
          label: "Margin Value",
          defaultValue: "1rem",
        },
      ],
    },
    {
      group: "Paragraph",
      inputs: [
        {
          type: "textarea",
          name: "paragraph",
          label: "Content",
          defaultValue:
            "Un operador de nuestra base fundacional te ha otorgado acceso prioritario.",
        },
        {
          type: "color",
          name: "pColor",
          label: "Color",
          defaultValue: "#A1A1AA",
        },
        { type: "text", name: "pSize", label: "Size", defaultValue: "0.9rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "pLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type:'range',
          label:'line heading',
          name:'plineH',
          defaultValue:1.1,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'u',
          }
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "pUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "pFamily",
          defaultValue: "Montserrat",
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
          defaultValue: "600",
        },
        {
          type: "select",
          name: "pMarginSelect",
          label: "Margin Type",
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
          name: "pMarginText",
          label: "Margin Value",
          defaultValue: "2rem",
        },
      ],
    },
    {
      group: "Button",
      inputs: [
        {
          type: "text",
          name: "buttonText",
          label: "Button Text",
          defaultValue: "Solicitar Acceso",
        },
        { type: "text", name: "bSize", label: "Size", defaultValue: "0.9rem" },



{
    type: "color",
    label: "Background color",
    name: "backgroundColor",
    defaultValue: "#000",
  },
  {
    type: "color",
    label: "Text color",
    name: "textColor",
    defaultValue: "#fff",
  },
  {
    type: "color",
    label: "Border color",
    name: "borderColor",
    defaultValue: "#00000000",
  },
  {
    type: "color",
    label: "Background color (hover)",
    name: "backgroundColorHover",
    defaultValue: "#00000000",
  },
  {
    type: "color",
    label: "Text color (hover)",
    name: "textColorHover",
    defaultValue: "#000",
  },
  {
    type: "color",
    label: "Border color (hover)",
    name: "borderColorHover",
    defaultValue: "#000",
  },





        {
          type: "range",
          label: "Letter spacing",
          name: "bLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type:'range',
          label:'line heading',
          name:'blineH',
          defaultValue:1.1,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'u',
          }
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "bUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "bFamily",
          defaultValue: "Montserrat",
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
        {
          type: "select",
          label: "Margin type",
          name: "bMarginSelect",
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
          name: "bMarginText",
        },
      ],
    },
    {
      group: "Footer",
      inputs: [
        {
          type: "text",
          name: "footerText",
          label: "Footer Text",
          defaultValue: "PROTOCOLO DE SEGURIDAD ACTIVADO",
        },
        {
          type: "color",
          name: "fColor",
          label: "Color",
          defaultValue: "#3f3f46",
        },
        { type: "text", name: "fSize", label: "Size", defaultValue: "0.65rem" },
        {
          type: "range",
          label: "Letter spacing",
          name: "fLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type:'range',
          label:'line heading',
          name:'flineH',
          defaultValue:1.1,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'u',
          }
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "fUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "fFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "fWeight",
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
          label: "Margin type",
          name: "fMarginSelect",
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
          name: "fMarginText",
        },
      ],
    },
  ],
});
