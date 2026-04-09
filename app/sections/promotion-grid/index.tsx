import { createSchema, IMAGES_PLACEHOLDERS, useChildInstances, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { useEffect } from "react";
import { backgroundInputs } from "~/components/background-image";
import { overlayInputs } from "~/components/overlay";
import type { SectionProps } from "~/components/section";
import { layoutInputs, Section } from "~/components/section";

interface PromotionGridProps
  extends VariantProps<typeof variants>,
    SectionProps {
  ref?: React.Ref<HTMLElement>;
}

const variants = cva("flex flex-col sm:grid", {
  variants: {
    gridSize: {
      "2x2": "sm:grid-cols-2 sm:[&_.promotion-grid-item]:p-16",
      "3x3": "sm:grid-cols-3 sm:[&_.promotion-grid-item]:p-12",
      "4x4": "sm:grid-cols-4 sm:[&_.promotion-grid-item]:p-8",
    },
    gap: {
      0: "",
      4: "gap-1",
      8: "gap-2",
      12: "gap-3",
      16: "gap-4",
      20: "gap-5",
      24: "gap-3 lg:gap-6",
      28: "gap-3.5 lg:gap-7",
      32: "gap-4 lg:gap-8",
      36: "gap-4 lg:gap-9",
      40: "gap-5 lg:gap-10",
      44: "gap-5 lg:gap-11",
      48: "gap-6 lg:gap-12",
      52: "gap-6 lg:gap-[52px]",
      56: "gap-7 lg:gap-14",
      60: "gap-7 lg:gap-[60px]",
    },
  },
  defaultVariants: {
    gridSize: "2x2",
    gap: 20,
  },
});

function PromotionGrid(props: PromotionGridProps & HydrogenComponentProps) {
  const { children = [], gridSize, gap, ref, ...rest } = props;
  const childInstances =useChildInstances()
    const headerChildsId =childInstances.map(
      (instance:any)=>{ 
        if(instance.data.type=="heading"||instance.data.type=="subheading"){
          return instance.data.id
        }
        return null
      }
    ).filter((elm)=>elm != null)

  return (
    <Section
      ref={ref}
      {...rest}
    >
      <div className="section-header-center">
        {children.map((child,idx)=>{
          if(headerChildsId.find((elm)=>elm ==child.props.id)){
            return child
          }
        })}
      </div>
      <div className={variants({gridSize,gap})}>
      {children.map((child,idx)=>{
          if(!headerChildsId.find((elm)=>elm ==child.props.id)){
            return child
          }
        })}
      </div>
    </Section>
  );
}

export default PromotionGrid;

export const schema = createSchema({
  type: "promotion-grid",
  title: "Promotion grid",
  settings: [
    {
      group: "Grid",
      inputs: [
        {
          type: "toggle-group",
          name: "gridSize",
          label: "Grid size",
          configs: {
            options: [
              { value: "2x2", label: "2x2" },
              { value: "3x3", label: "3x3" },
              { value: "4x4", label: "4x4" },
            ],
          },
          defaultValue: "2x2",
        },
        {
          type: "range",
          name: "gap",
          label: "Items gap",
          configs: {
            min: 0,
            max: 60,
            step: 1,
            unit: "px",
          },
          defaultValue: 20,
        },
      ],
    },
    { group: "Layout", inputs: layoutInputs },
    { group: "Background", inputs: backgroundInputs },
    { group: "Overlay", inputs: overlayInputs },
  ],
  childTypes: ["promotion-grid-item","subheading","heading"],
  presets: {
    gridSize: "2x2",
    gap: 20,
    children: [
      {
        type: "promotion-grid-item",
        contentPosition: "top left",
        backgroundImage: IMAGES_PLACEHOLDERS.collection_1,
        enableOverlay: true,
        overlayColor: "#0c0c0c",
        overlayOpacity: 20,
        children: [
          {
            type: "heading",
            content: "Announce your promotion",
          },
          {
            type: "paragraph",
            content:
              "Include the smaller details of your promotion in text below the title.",
          },
          {
            type: "promotion-item--buttons",
            children: [
              {
                type: "button",
                text: "Shop now",
              },
            ],
          },
        ],
      },
      {
        type: "promotion-grid-item",
        contentPosition: "bottom right",
        backgroundImage: IMAGES_PLACEHOLDERS.collection_2,
        enableOverlay: true,
        overlayColor: "#0c0c0c",
        overlayOpacity: 20,
        children: [
          {
            type: "heading",
            content: "Announce your promotion",
          },
          {
            type: "paragraph",
            content:
              "Include the smaller details of your promotion in text below the title.",
          },
          {
            type: "promotion-item--buttons",
            children: [
              {
                type: "button",
                text: "Shop promotion",
              },
            ],
          },
        ],
      },
    ],
  },
});
