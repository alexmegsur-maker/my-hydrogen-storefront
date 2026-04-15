import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useParentInstance } from "@weaverse/hydrogen";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { selectorPaddingMargin } from "~/utils/general";

interface HwItemProps extends HydrogenComponentProps {
  label: string;
  quantity: string;
  isFullWidth: boolean;    
  lColor:string;
  lSize:string;
  lLetter:number;
  lUpper:boolean;
  lFamily:string;
  lWeight:string;
  lPaddingSelect:string;
  lPaddingText:string;
  lMarginSelect:string;
  lMarginText:string;
  qColor:string;
  qSize:string;
  qLetter:number;
  qUpper:boolean;
  qFamily:string;
  qWeight:string;
  qPaddingSelect:string;
  qPaddingText:string;
  qMarginSelect:string;
  qMarginText:string;
  showBorderTop:boolean;
  showBorderBottom:boolean;
  borderColor:string;
  marginTop:string;
  paddingTop:string;
  paddingBottom:string;
}

function HwItem(props: HwItemProps) {
  const { label, quantity, isFullWidth,
    lColor,
    lSize,
    lLetter,
    lUpper,
    lFamily,
    lWeight,
    lPaddingSelect,
    lPaddingText,
    lMarginSelect,
    lMarginText,
    qColor,
    qSize,
    qLetter,
    qUpper,
    qFamily,
    qWeight,
    qPaddingSelect,
    qPaddingText,
    qMarginSelect,
    qMarginText,
    showBorderTop,
    showBorderBottom,
    borderColor,
    marginTop,
    paddingTop,
    paddingBottom,
    ...rest 
  } = props;
  const isMobile = useIsMobile(600)
  return (
    <div
      {...rest}
      style={{
        borderTop:  showBorderTop ?  `1px solid ${borderColor}` : undefined,
        borderBottom: showBorderBottom ?  `1px solid ${borderColor}`:undefined,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        marginTop: marginTop,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gridColumn:  isFullWidth || isMobile ? "1 / -1" : undefined,
        gap: "1rem",
      }}
    >
      <span
        style={{
          color: lColor,
          fontFamily: lFamily,
          fontSize: lSize,
          fontWeight: lWeight,
          textTransform: lUpper ? "uppercase" : "unset",
          letterSpacing: lLetter > 0 ? `${lLetter}px`:"normal",
          ...selectorPaddingMargin("padding", lPaddingSelect, lPaddingText),
          ...selectorPaddingMargin("margin", lMarginSelect, lMarginText),
          
        }}
      >{label}</span>
      <span
        style={{
          color: qColor,
          fontFamily: qFamily,
          fontSize: qSize,
          fontWeight: qWeight,
          textTransform: qUpper ? "uppercase" : "unset",
          letterSpacing: qLetter > 0 ? `${qLetter}px`:"normal",
          ...selectorPaddingMargin("padding", qPaddingSelect, qPaddingText),
          ...selectorPaddingMargin("margin", qMarginSelect, qMarginText),
          whiteSpace: "nowrap",
        }}

      >
        {quantity}
      </span>
    </div>
  );
}

export default HwItem;

export const schema = createSchema({
  type: "hw-item",
  title: "Item",
  settings: [
    {
      group: "Item",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Label",
          defaultValue: "Componente",
        },
        {
          type: "text",
          name: "quantity",
          label: "Quantity",
          defaultValue: "x1",
          helpText: 'Ej: "x1", "x5", "SET"',
        },
        {
          type: "switch",
          name: "isFullWidth",
          label: "Full width",
          defaultValue: false,
          helpText:
            "Hace que este item ocupe las dos columnas del grid (para items especiales como accesorios).",
        },
        {
          type:'switch',
          label:'show border top',
          name:'showBorderTop',
          defaultValue:false,
        },
        {
          type:'switch',
          label:'show border bottom',
          name:'showBorderBottom',
          defaultValue:true,
        },
        {
          type:'color',
          label:'colorBorder',
          name:'borderColor',
          defaultValue:'#ffffff1a',
        },
        {
          type:'text',
          label:'margin top',
          name:'marginTop',
        },
        {
          type:'text',
          label:'padding Top',
          name:'paddingTop',
        },
        {
          type:'text',
          label:'padding Bottom',
          name:'paddingBottom',
          defaultValue:"0.8rem"
        },

      ],
    },
    {
      group:"label",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "lColor",
          defaultValue: "#a1a1aa",
        },
        {
          type: "text",
          label: "Font size",
          name: "lSize",
          defaultValue: "0.85rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "lLetter",
          defaultValue: 0,
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
          name: "lUpper",
          defaultValue: false,
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
          defaultValue: "400",
        },
        {
          type: "select",
          label: "Padding type",
          name: "lPaddingSelect",
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
          name: "lPaddingText",
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
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin value",
          name: "lMarginText",
        },
      ],
    },
    {
      group:"quantity",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "qColor",
          defaultValue: "#00d2ff",
        },
        {
          type: "text",
          label: "Font size",
          name: "qSize",
          defaultValue: "0.8rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "qLetter",
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
          name: "qUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "qFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "qWeight",
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
          name: "qPaddingSelect",
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
          name: "qPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "qMarginSelect",
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
          name: "qMarginText",
        },
      ],
    }
  ],
  presets: {
    label: "Componente",
    quantity: "x1",
    isFullWidth: false,
  },
});