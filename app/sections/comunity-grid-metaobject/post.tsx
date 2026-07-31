import {
  createSchema,
  IMAGES_PLACEHOLDERS,
  type HydrogenComponentProps,
  useParentInstance,
  useItemInstance,
} from "@weaverse/hydrogen";
import { useContext, useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router";
import { Image } from "~/components/image";
import { useIsMobile } from "~/hooks/use-is-mobile";
import type { ImageAspectRatio } from "~/types/others";
import CommunityPost from "../comunity-grid/post";
import { CommunityPostsContext } from "./items";



type ColumnSize =
  | "col1"
  | "col2"
  | "col3"
  | "col4"
  | "col5"
  | "col6"
  | "col7"
  | "col8";
type RowSize =
  | "row1"
  | "row2"
  | "row3"
  | "row4"
  | "row5"
  | "row6"
  | "row7"
  | "row8";

interface CommunityGridMetaobjectPostProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  postIndex?: number;
  size?: ColumnSize;
  rowSize?: RowSize;
  bgColor: string;
  bgHColor: string;
  borderColor: string;
  borderHColor: string;
  rounded: number;
  imageAspectRatio: ImageAspectRatio;
  tColor: string;
  tSize: string;
  tLetter: number;
  tAlignment: "left" | "center" | "right" | "justify";
  tUpper: boolean;
  tFamily: string;
  tPaddingSelect: string;
  tPaddingText: string;
  tMarginSelect: string;
  tMarginText: string;
  tWeight: string;
  dColor: string;
  dSize: string;
  dLetter: number;
  dAlignment: "left" | "center" | "right" | "justify";
  dUpper: boolean;
  dFamily: string;
  dPaddingSelect: string;
  dPaddingText: string;
  dMarginSelect: string;
  dMarginText: string;
  dWeight: string;
  activeGrayscale: boolean;
  grayscale: number;
}

export default function CommunityGridMetaobjectPost(
  props: CommunityGridMetaobjectPostProps,
) {
  const {
    ref,
    postIndex,
    size,
    rowSize,
    bgColor,
    bgHColor,
    borderColor,
    borderHColor,
    rounded,
    imageAspectRatio,
    tColor,
    tSize,
    tLetter,
    tAlignment,
    tUpper,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    dColor,
    dSize,
    dLetter,
    dAlignment,
    dUpper,
    dFamily,
    dPaddingSelect,
    dPaddingText,
    dMarginSelect,
    dMarginText,
    dWeight,
    activeGrayscale,
    grayscale,
    ...rest
  } = props;

  const posts = useContext(CommunityPostsContext)
  const parentInstance=useParentInstance()._store.children.map(state=>state.id)
  const selfInstance=useItemInstance()._id
  const selfIndex = parentInstance.indexOf(selfInstance)
  const selfPost=posts?.[selfIndex]

  useEffect(()=>{
    console.log("posts",posts)
    console.log("parentInstance",parentInstance)
    console.log("selfInstance",selfInstance)
    console.log("selfIndex",selfIndex)
  },[posts,parentInstance])

  if (!selfPost) {
    return null;
  }

  return (
    <CommunityPost
      {...rest}
      ref={ref}
      selfPost={selfPost}
      size={size}
      rowSize={rowSize}
      bgColor={bgColor}
      bgHColor={bgHColor}
      borderColor={borderColor}
      borderHColor={borderHColor}
      rounded={rounded}
      imageAspectRatio={imageAspectRatio}
      tColor={tColor}
      tSize={tSize}
      tLetter={tLetter}
      tAlignment={tAlignment}
      tUpper={tUpper}
      tFamily={tFamily}
      tPaddingSelect={tPaddingSelect}
      tPaddingText={tPaddingText}
      tMarginSelect={tMarginSelect}
      tMarginText={tMarginText}
      tWeight={tWeight}
      dColor={dColor}
      dSize={dSize}
      dLetter={dLetter}
      dAlignment={dAlignment}
      dUpper={dUpper}
      dFamily={dFamily}
      dPaddingSelect={dPaddingSelect}
      dPaddingText={dPaddingText}
      dMarginSelect={dMarginSelect}
      dMarginText={dMarginText}
      dWeight={dWeight}
      activeGrayscale={activeGrayscale}
      grayscale={grayscale}
    />
  );
}

export const schema = createSchema({
  type: "community-grid-metaobject--post",
  title: "Post",
  settings: [
    {
      group: "post",
      inputs: [
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Image aspect ratio",
          defaultValue: "3/4",
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
          type: "color",
          label: "background color",
          name: "bgColor",
          defaultValue: "#ffffff05",
        },
        {
          type: "color",
          label: "background color hover",
          name: "bgHColor",
          defaultValue: "#ffffff0a",
        },
        {
          type: "color",
          label: "border color",
          name: "borderColor",
          defaultValue: "#ffffff0d",
        },
        {
          type: "color",
          label: "border color hover",
          name: "borderHColor",
          defaultValue: "#ffffff26",
        },
        {
          type: "switch",
          label: "active grayscale",
          name: "activeGrayscale",
          defaultValue: false,
        },
        {
          type: "range",
          label: "grayscale",
          name: "grayscale",
          defaultValue: 60,
          configs: { min: 0, max: 100, step: 1, unit: "%" },
          condition: (data: CommunityGridMetaobjectPostProps) =>
            data.activeGrayscale == true,
        },
        {
          type: "range",
          label: "border radius",
          name: "rounded",
          defaultValue: 4,
          configs: { min: 0, max: 200, step: 1, unit: "px" },
        },
        {
          type: "select",
          name: "size",
          label: "Column size",
          configs: {
            options: [
              { label: "Column 1", value: "col1" },
              { label: "Column 2", value: "col2" },
              { label: "Column 3", value: "col3" },
              { label: "Column 4", value: "col4" },
              { label: "Column 5", value: "col5" },
              { label: "Column 6", value: "col6" },
              { label: "Column 7", value: "col7" },
              { label: "Column 8", value: "col8" },
            ],
          },
          defaultValue: "col2",
        },
        {
          type: "select",
          name: "rowSize",
          label: "Row size",
          configs: {
            options: [
              { label: "Row 1", value: "row1" },
              { label: "Row 2", value: "row2" },
              { label: "Row 3", value: "row3" },
              { label: "Row 4", value: "row4" },
              { label: "Row 5", value: "row5" },
              { label: "Row 6", value: "row6" },
              { label: "Row 7", value: "row7" },
              { label: "Row 8", value: "row8" },
            ],
          },
          defaultValue: "row2",
        },
      ],
    },
    {
      group: "overlay",
      inputs: [
        { type: "heading", label: "user" },
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
          defaultValue: 1,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "select",
          label: "Content alignment",
          name: "tAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
              { value: "justify", label: "Justify" },
            ],
          },
          defaultValue: "left",
        },
        {
          type: "switch",
          label: "uppercase",
          name: "tUpper",
          defaultValue: false,
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
        { type: "text", label: "Padding text", name: "tPaddingText" },
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
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin text",
          name: "tMarginText",
          defaultValue: "0.2rem",
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
        { type: "heading", label: "model" },
        {
          type: "color",
          label: "color",
          name: "dColor",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          label: "font size",
          name: "dSize",
          defaultValue: "0.75rem",
        },
        {
          type: "range",
          label: "letter spacing",
          name: "dLetter",
          defaultValue: 1,
          configs: { min: 0, max: 50, step: 1, unit: "px" },
        },
        {
          type: "select",
          label: "text alignment",
          name: "dAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
              { value: "justify", label: "Justify" },
            ],
          },
          defaultValue: "left",
        },
        {
          type: "switch",
          label: "uppercase",
          name: "dUpper",
          defaultValue: false,
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
        { type: "text", label: "Padding text", name: "dPaddingText" },
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
        { type: "text", label: "Margin text", name: "dMarginText" },
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
          defaultValue: "300",
        },
      ],
    },
  ],
});
