import { createSchema, useItemInstance, useParentInstance, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useIsMobile } from "~/hooks/use-is-mobile";

const variants = cva(
  "flex  flex-col justify-center ",
  {
    variants: {
      alignment: {
        left: "items-start",
        center: "items-center",
        right: "items-end",
      },
    },
    defaultVariants: {
      alignment: "center",
    },
  },
);

interface ImageWithTextContentProps
  extends VariantProps<typeof variants>,
    HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
}

function ImageWithTextContent(props: ImageWithTextContentProps) {
  const { alignment, children, ref, ...rest } = props;
  const parentInstance = useParentInstance()
  const [contentSize,setContentSize]=useState(100)
  const [distribution,setDistribution]=useState(false)

  const instance = useItemInstance()
  const isMobile = useIsMobile(600)
  useEffect(()=>{
    if(parentInstance.data.contentDist){
      let position = parentInstance.data.children.findIndex((elm)=>elm.id ==instance.data.id)
      
      if(position == 0){
        setContentSize(parentInstance.data.contentDist)
        setDistribution(true)
      }else if (position > 0){
        setContentSize(100-parentInstance.data.contentDist)
        setDistribution(true)
      }
      
    }
  },[parentInstance.data?.contentDist,instance.data?.id])
  console.count("content")

  return (
    <Section
      overflow="unset" 
      ref={ref} 
      {...rest} 
      className={clsx(variants({ alignment }))}
      style={{
        width: distribution ? isMobile?"100% ":`${contentSize}%`:"fit-content"
      }}
      containerClassName="flex flex-col"
      > 
      {children}
    </Section>
  );
}

export default ImageWithTextContent;

export const schema = createSchema({
  type: "image-with-text--content",
  title: "Content",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "select",
          name: "alignment",
          label: "Alignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          helpText:
            "This will override the default alignment setting of all children components.",
        },
      ],
    },
    ...sectionSettings
  ],
  childTypes: ["subheading", "heading", "paragraph", "button","group-elements"],
  presets: {
    alignment: "center",
    children: [
      {
        type: "subheading",
        content: "Subheading",
      },
      {
        type: "heading",
        content: "Heading for image",
      },
      {
        type: "paragraph",
        content: "Pair large text with an image to tell a story.",
      },
      {
        type: "button",
        text: "Shop now",
      },
    ],
  },
});
