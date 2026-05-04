import {
  createSchema,
  IMAGES_PLACEHOLDERS,
  useThemeSettings,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { backgroundInputs } from "~/components/background-image";
import NetworkBackground, { networkBackgroundSettings, type NetworkBackgroundProps } from "~/components/networkBackground";
import { Overlay, overlayInputs } from "~/components/overlay";
// import type { SectionProps } from "~/components/section";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { forgeSettings } from "~/components/smoke-ash";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { cn } from "~/utils/cn";

export interface HeroImageProps extends VariantProps<typeof variants>,HydrogenComponentProps,NetworkBackgroundProps {
  ref: React.Ref<HTMLElement>;
  widthCont:number;
  showBorder:boolean;
  colorBorder:string;
  activeDots:boolean;
  activeNetwork:boolean;
}

const variants = cva("flex flex-col [&_.paragraph]:mx-[unset]", {
  variants: {
    height: {
      small: "min-h-[40vh] lg:min-h-[50vh]",
      medium: "min-h-[50vh] lg:min-h-[60vh]",
      large: "min-h-[70vh] lg:min-h-[80vh]",
      full: "",
    },
    enableTransparentHeader: {
      true: "",
      false: "",
    },
    contentPosition: {
      "top left": "items-start justify-start [&_.paragraph]:text-left",
      "top center": "items-center justify-start [&_.paragraph]:text-center",
      "top right": "items-end justify-start [&_.paragraph]:text-right",
      "center left": "items-start justify-center [&_.paragraph]:text-left",
      "center center": "items-center justify-center [&_.paragraph]:text-center",
      "center right": "items-end justify-center [&_.paragraph]:text-right",
      "bottom left": "items-start justify-end [&_.paragraph]:text-left",
      "bottom center": "items-center justify-end [&_.paragraph]:text-center",
      "bottom right": "items-end justify-end [&_.paragraph]:text-right",
    },
  },
  compoundVariants: [
    {
      height: "full",
      enableTransparentHeader: true,
      className: "h-screen-no-topbar",
    },
    {
      height: "full",
      enableTransparentHeader: false,
    },
  ],
  defaultVariants: {
    height: "large",
    contentPosition: "center center",
  },
});

export default function HeroImage(props: HeroImageProps & SectionProps) {
  const { 
    ref, 
    children, 
    height, 
    activeDots, 
    widthCont, 
    contentPosition,
    colorBorder,
    showBorder,
    enableOverlay, 
    overlayColor,
    overlayColorHover,
    overlayOpacity,
    activeNetwork,
    particleColor, 
    lineColor, 
    particleOpacity, 
    interactiveRadius, 
    velocity, 
    numberParticles,
    ...rest 
  } = props;

  const network= {
    activeNetwork,
    particleColor, 
    lineColor, 
    particleOpacity, 
    interactiveRadius, 
    velocity,
    numberParticles,
  }
  const { enableTransparentHeader } = useThemeSettings();
  const isMobile = useIsMobile(600)
  return (
    <Section
      ref={ref}
      {...rest}
      containerClassName={cn(
        variants({
          contentPosition,
          height,
          enableTransparentHeader,
          
        }),
        activeDots ? "fabric-wrapper relative flex flex-col" : "z-1",

      )}
      containerStyle={{
        width:`${widthCont}%`,
        position:enableOverlay || activeNetwork ?  "static":"relative",
        
      }}
      style={{
        borderBottom:showBorder ? `1px solid ${colorBorder}`:"unset"
      }}
    >
      {activeNetwork &&
        <NetworkBackground {...network}/>

      }
      <Overlay
        enableOverlay={enableOverlay}
        overlayColor={overlayColor}
        overlayColorHover={overlayColorHover} 
        overlayOpacity={overlayOpacity}
        />
      {children}
    </Section>
  );
}

export const schema = createSchema({
  type: "hero-imagev2",
  title: "Hero image",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type:'switch',
          label:'show border bottom',
          name:'showBorder',
          defaultValue:false,
        },
        {
          type:'color',
          label:'color Border',
          name:'colorBorder',
          defaultValue:'#ffffff0d',
          condition:(data)=>data.showBorder==true
        },
        {
          type:'range',
          label:'width content',
          name:'widthCont',
          defaultValue:100,
          configs:{
            min:5,
            max:100,
            step:1,
            unit:'%', 
          } 
        },
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
            ],
          },
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
        {
          type: "switch",
          label: "active effect docts",
          name: "activeDots",
          defaultValue: false,
        },
        ...layoutInputs.filter(
          (inp) => inp.name !== "divider" && inp.name !== "borderRadius",
        ),
      ],
    },
    {
      group: "Background",
      inputs: [
        ...backgroundInputs.filter(
          (inp) =>
            inp.name !== "backgroundFor" && inp.name !== "backgroundColor",
        ),
        {
          type:'switch',
          label:'active network background',
          name:'activeNetwork',
          defaultValue:false,
        },
      ],
    },
    { group: "Overlay", inputs: overlayInputs },
    ...networkBackgroundSettings,
    ...forgeSettings,
  ],
  childTypes: ["subheading", "heading", "paragraph", "button","group-elements"],
  presets: {
    height: "large",
    contentPosition: "center center",
    backgroundImage: IMAGES_PLACEHOLDERS.banner_1,
    backgroundFit: "cover",
    enableOverlay: true,
    overlayOpacity: 40,
    children: [
      {
        type: "subheading",
        content: "Subheading",
        color: "#ffffff",
      },
      {
        type: "heading",
        content: "Hero image with text overlay",
        as: "h2",
        color: "#ffffff",
        size: "default",
      },
      {
        type: "paragraph",
        content:
          "Use this text to share information about your brand with your customers. Describe a product, share announcements, or welcome customers to your store.",
        color: "#ffffff",
      },
    ],
  },
});
