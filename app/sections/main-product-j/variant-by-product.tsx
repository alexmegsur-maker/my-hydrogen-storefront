import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen"

interface  VariantByProductProps extends HydrogenComponentProps{
color:string;
size:string;
letter:number;
upper:boolean;
family:string;
weight:string;
sColor:string;
sSize:string;
sLetter:number;
sUpper:boolean;
sFamily:string;
sPaddingSelect:string;
sPaddingText:string;
sMarginSelect:string;
sMarginText:string;
sWeight:string;
}

function VariantByProduct(props:VariantByProductProps){
const {
  color,
  size,
  letter,
  upper,
  family,
  weight,
  sColor,
  sSize,
  sLetter,
  sUpper,
  sFamily,
  sPaddingSelect,
  sPaddingText,
  sMarginSelect,
  sMarginText,
  sWeight,children,...rest
  }= props
  return (
    <div className="EZDrawer">
      <div className="h-full flex relative flex-col">
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default VariantByProduct

export const schema = createSchema({
  type:"variant-by-product",
  title:"Variant by product",
  childTypes:["product-var"],
  settings:[
    {
      group: "collection selector",
      inputs: [
        {
          type: "color",
          label: "color",
          name: "color",
          defaultValue: "#8d8d8d",
        },
        {
          type: "text",
          label: "font size",
          name: "size",
          defaultValue: "1rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "letter",
          defaultValue: 0.5,
          configs: { min: 0, max: 50, step: 0.5, unit: "px" },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "upper",
          defaultValue: false,
        },
        {
          type: "text",
          label: "font family",
          name: "family",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "weight",
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
          label: "subtitle",
        },
        {
          type: "color",
          label: "color",
          name: "sColor",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          label: "font size",
          name: "sSize",
          defaultValue: "0.75rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "sLetter",
          defaultValue: 0,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "switch",
          label: "uppercase",
          name: "sUpper",
          defaultValue: false,
        },
        {
          type: "text",
          label: "font family",
          name: "sFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Padding type",
          name: "sPaddingSelect",
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
          name: "sPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "sMarginSelect",
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
          name: "sMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "sWeight",
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
  ]
})