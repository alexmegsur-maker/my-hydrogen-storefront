import { createSchema } from "@weaverse/hydrogen";
import AuroraBackground, {
  auroraSettings,
  type AuroraProps,
} from "~/components/auroraBackground";
import { backgroundInputs } from "~/components/background-image";
import type { SectionProps } from "~/components/section";
import { layoutInputs, Section } from "~/components/section";
import { useFreezeOnScroll } from "~/hooks/use-freeze-on-scroll";
import "~/styles/FabricBg.css";
import { cn } from "~/utils/cn";
import { selectorPaddingMargin } from "~/utils/general";

interface ImageWithTextProps extends SectionProps, AuroraProps {
  activeDots: boolean;
  enableFreeze: boolean;
  colorBgActiveDots: string;
  paddingContSelect: string;
  paddingContText: string;
  marginContSelect: string;
  marginContText: string;
  contentDist: number;
  gapCont:number;
}

function ImageWithText(props: ImageWithTextProps) {
  const {
    children,
    activeDots,
    colorBgActiveDots,
    enableFreeze,
    paddingContSelect,
    paddingContText,
    marginContSelect,
    marginContText,
    auroraColor1,
    auroraColor2,
    auroraColor3,
    auroraDuration,
    auroraBlur,
    auroraOpacity,
    gapCont,
    ...rest
  } = props;
  // const { ref, isFrozen } = useFreezeOnScroll<HTMLDivElement>({
  //   enabled: enableFreeze, // Viene de tu schema de Weaverse
  //   once: true // Para que una vez aparezca la aurora, no se apague al subir
  // });

  return (
    <Section
      // ref={ref}
      {...rest}
      containerClassName={cn(
        activeDots ? "fabric-wrapper relative flex" : "z-1",
        enableFreeze && "static "
      )}
      containerStyle={{
        ...selectorPaddingMargin("padding", paddingContSelect, paddingContText),
        ...selectorPaddingMargin("margin", marginContSelect, marginContText),
        ["--dots-color" as any]: colorBgActiveDots,
      }}
    >
      <AuroraBackground
        enableAurora={enableFreeze} 
        auroraColor1={auroraColor1}
        auroraColor2={auroraColor2}
        auroraColor3={auroraColor3}
        auroraDuration={auroraDuration}
        auroraBlur={auroraBlur}
        auroraOpacity={auroraOpacity}
      />
      <div 
        className="flex flex-col md:flex-row px-0 sm:px-0 z-3 relative"
        style={{
          gap:`${gapCont}rem`,
        }}
      >
        {children}
      </div>
    </Section>
  );
}

export default ImageWithText;

export const schema = createSchema({
  type: "image-with-textv2",
  title: "Image with text",
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter(({ name }) => name !== "gap"),
    },
    {
      group: "Background",
      inputs: [
        ...backgroundInputs,
        {
          type: "switch",
          label: "active effect docts",
          name: "activeDots",
          defaultValue: false,
        },
        {
          type: "color",
          label: "backgorund dots color",
          name: "colorBgActiveDots",
          defaultValue: "#0000000d",
        },
        {
          type: "switch",
          label: "Enable Freeze on Scroll",
          name: "enableFreeze",
          defaultValue: false, // Por defecto desactivado
          helpText: "The section will fade in when visible.",
        },
      ],
    },
    {
      group: "content",
      inputs: [
        {
          type: "range",
          label: "content distribution",
          name: "contentDist",
          defaultValue: 50,
          configs: {
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
          },
        },
        {
          type:'range',
          label:'gap content',
          name:'gapCont',
          defaultValue:1,
          configs:{
            min:0,
            max:7,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type: "select",
          label: "Padding type",
          name: "paddingContSelect",
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
          name: "paddingContText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "marginContSelect",
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
          name: "marginContText",
        },
      ],
    },
    
    ...auroraSettings,
  ],
  childTypes: ["image-with-text--content", "image-with-text--image"],
  presets: {
    verticalPadding: "none",
    backgroundColor: "#00000000",
    backgroundFor: "content",
    children: [
      { type: "image-with-text--image", aspectRatio: "1/1" },
      { type: "image-with-text--content" },
    ],
  },
});
