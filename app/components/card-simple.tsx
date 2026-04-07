import {
  createSchema,
  IMAGES_PLACEHOLDERS,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { Section } from "./section";
import { Image } from "./image";
import { calculateAspectRatio } from "~/utils/image";
import type { ImageAspectRatio } from "~/types/others";
import { selectorPaddingMargin } from "~/utils/general";
import { useState } from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { Link } from "react-router";

interface CardSimpleProps {
  image: WeaverseImage;
  imageAspectRatio: ImageAspectRatio;
  paddingSelect:string;
  paddingText:string;
  subheading: string;
  heading: string;
  paragraph: string;
  linkText: string;
  link: string;
  linkDecoration: string;
  stColor: string;
  stSize: string;
  stLetter: number;
  stUpper: boolean;
  stFamily: string;
  stWeight: string;
  stPaddingSelect: string;
  stPaddingText: string;
  stMarginSelect: string;
  stMarginText: string;
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
  pColor: string;
  pSize: string;
  pLetter: number;
  pUpper: boolean;
  pFamily: string;
  pWeight: string;
  pPaddingSelect: string;
  pPaddingText: string;
  pMarginSelect: string;
  pMarginText: string;
  lColor: string;
  lSize: string;
  lLetter: number;
  lUpper: boolean;
  lFamily: string;
  lWeight: string;
  lPaddingSelect: string;
  lPaddingText: string;
  lMarginSelect: string;
  lMarginText: string;
}

export default function CardSimple(
  props: CardSimpleProps & HydrogenComponentProps,
) {
  const {
    image,
    imageAspectRatio,
    paddingSelect,
    paddingText,
    subheading,
    heading,
    paragraph,
    linkText,
    link,
    linkDecoration,
    stColor,
    stSize,
    stLetter,
    stUpper,
    stFamily,
    stWeight,
    stPaddingSelect,
    stPaddingText,
    stMarginSelect,
    stMarginText,
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
    pColor,
    pSize,
    pLetter,
    pUpper,
    pFamily,
    pWeight,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
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
    ...rest
  } = props;

  const [isHover,setIsHover] = useState(false)
  const isMobile =useIsMobile(600)
  return (
    <Section
      {...rest}
      onMouseEnter={()=>setIsHover(true)}
      onMouseLeave={()=>setIsHover(false)}
      containerClassName="flex flex-col h-full"
      className="relative overflow-hidden cursor-pointer "
      style={{
        background: "#ffffff03",
        borderRight: "1px solid #ffffff0d",
        transition: "filter 0.5s ease",
      }}
    >
      <div
        className="universe-img"
        style={{
          height: "400px",
          width: "100%",
          filter:isMobile || isHover ? "grayscale(0%) brightness(1)":"grayscale(100%) brightness(0.6)",
          transform:isHover?"scale(1.08)":"unset",
          transition: "all 0.8s ease",
        }}
      >
        <Image
          data={image}
          className="h-full object-cover rounded-(--radius)"
          aspectRatio={calculateAspectRatio(image, imageAspectRatio)}
        />
      </div>
      <div
        className="universe-content flex flex-col"
        style={{
          borderTop: "1px solid #ffffff08",
          flexGrow: 1,
          ...selectorPaddingMargin("padding",paddingSelect,paddingText),
        }}
      >
        <div
          className="u-badge"
          style={{
            color: stColor,
            fontFamily: stFamily,
            fontSize: stSize,
            fontWeight: stWeight,
            textTransform: stUpper ? "uppercase" : "unset",
            letterSpacing: stLetter > 0 ? `${stLetter}px`:"normal",
            ...selectorPaddingMargin("padding", stPaddingSelect, stPaddingText),
            ...selectorPaddingMargin("margin", stMarginSelect, stMarginText),

          }}
        >
          {subheading}
        </div>
        <h3
          className="u-title"
          style={{
            color: tColor,
            fontFamily: tFamily,
            fontSize: tSize,
            fontWeight: tWeight,
            textTransform: tUpper ? "uppercase" : "unset",
            letterSpacing: tLetter > 0 ? `${tLetter}px`:"normal",
            ...selectorPaddingMargin("padding", tPaddingSelect, tPaddingText),
            ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
          }}
        >
          {heading}
        </h3>
        <p
          className="u-desc"
          style={{
            color: pColor,
            fontFamily: pFamily,
            fontSize: pSize,
            fontWeight: pWeight,
            textTransform: pUpper ? "uppercase" : "unset",
            letterSpacing: pLetter > 0 ? `${pLetter}px`:"normal",
            ...selectorPaddingMargin("padding", pPaddingSelect, pPaddingText),
            ...selectorPaddingMargin("margin", pMarginSelect, pMarginText),
            lineHeight: "1.6",
            flexGrow: "1",
          }}
        >
          {paragraph}
        </p>
        <Link
          to={link}
          className="u-link"
          style={{
            color: lColor,
            fontFamily: lFamily,
            fontSize: lSize,
            fontWeight: lWeight,
            textTransform: lUpper ? "uppercase" : "unset",
            letterSpacing: lLetter > 0 ? `${lLetter}px`:"normal",
            ...selectorPaddingMargin("padding", lPaddingSelect, lPaddingText),
            ...selectorPaddingMargin("margin", lMarginSelect, lMarginText),
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {linkText}
          {linkDecoration &&
            <span 
             className="h-full w-auto"
             dangerouslySetInnerHTML={{__html:linkDecoration}}
             style={{
              transform:isHover?"translateX(5px)":"unset",
              transition:"transform 0.3s"
             }}
             ></span>
          }
        </Link>
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "card-simple",
  title: "Card Simple",
  settings: [
    {
      group: "general",
      inputs: [
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
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "paddingText",
          defaultValue:"2.5rem 1.5rem"
        },
        {
          type: "image",
          label: "imagen",
          name: "image",
          defaultValue: {
            url: IMAGES_PLACEHOLDERS.product_11,
            altText: "Alt text",
            width:900,
            height:900,
          },
        },
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Image aspect ratio",
          defaultValue: "adapt",
          configs: {
            options: [
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
              { value: "16/9", label: "Widescreen (16/9)" },
            ],
          },
          helpText:
            'Learn more about image <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" target="_blank" rel="noopener noreferrer">aspect ratio</a> property.',
        },
        {
          type: "text",
          label: "subheading",
          name: "subheading",
          defaultValue: "subheading",
        },
        {
          type: "text",
          label: "heading",
          name: "heading",
          defaultValue: "heading",
        },
        {
          type: "text",
          label: "paragraph",
          name: "paragraph",
          defaultValue: "Lorem ipsum dolor sit amet consectetur adipiscing elit ante porttitor fermentum, cum porta odio in quis tincidunt laoreet mollis pretium, urna commodo aenean class nisi cursus per dignissim etiam. ",
        },
        {
          type: "text",
          label: "link text",
          name: "linkText",
          defaultValue: "linkText",
        },
        {
          type: "url",
          label: "link url",
          name: "link",
          defaultValue: "/products",
        },
        {
          type: "textarea",
          label: "link decoration",
          name: "linkDecoration",
          defaultValue:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>`
        },
      ],
    },
    {
      group: "Subheading",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "stColor",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          label: "Font size",
          name: "stSize",
          defaultValue: "0.65rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "stLetter",
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
          label: "Padding type",
          name: "stPaddingSelect",
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
          name: "stPaddingText",
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
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin value",
          name: "stMarginText",
          defaultValue: "0.8rem",
        },
      ],
    },
    {
      group: "heading",
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
          defaultValue: "0.8rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "tLetter",
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
          defaultValue: "400",
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
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin value",
          name: "tMarginText",
          defaultValue: "0.8rem",
        },
      ],
    },
    {
      group: "paragraph",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "pColor",
          defaultValue: "#A1A1AA",
        },
        {
          type: "text",
          label: "Font size",
          name: "pSize",
          defaultValue: "0.8rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "pLetter",
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
          name: "pUpper",
          defaultValue: false,
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
          defaultValue: "300",
        },
        {
          type: "select",
          label: "Padding type",
          name: "pPaddingSelect",
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
          name: "pMarginText",
          defaultValue: "2rem",
        },
      ],
    },
    {
      group: "Link",
      inputs: [
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
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin value",
          name: "lMarginText",
        },
      ],
    },
  ],
});
