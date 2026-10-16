import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { cn } from "~/utils/cn";
import {
  omitSectionSpacing,
  type SectionSpacingData,
  SectionSpacingStyle,
  sectionSpacingInputs,
} from "~/utils/section-spacing";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  TEXT_SIZE_CLASS,
  textStyleInputs,
} from "~/utils/text-style";

const TEXT_PREFIXES = ["tag", "heading", "description", "link"];

interface CollectorEditionsProps extends HydrogenComponentProps {
  tag: string;
  heading: string;
  description: string;
  linkText: string;
  linkUrl: string;
  backgroundColor: string;
  backgroundImage?: WeaverseImage | string;
  backgroundOpacity: number;
  blocksGap: number;
  ref?: React.Ref<HTMLElement>;
}

function CollectorEditions(props: CollectorEditionsProps) {
  const {
    tag,
    heading,
    description,
    linkText,
    linkUrl,
    backgroundColor,
    backgroundImage,
    backgroundOpacity,
    blocksGap,
    children,
    ref,
    ...rest
  } = props;

  const textStyle = (prefix: string) =>
    getTextStyle(props as unknown as Record<string, unknown>, prefix);
  const bgUrl =
    typeof backgroundImage === "object" ? backgroundImage?.url : backgroundImage;

  return (
    <section
      ref={ref}
      {...omitSectionSpacing(omitTextStyleProps(rest, TEXT_PREFIXES))}
      style={{ backgroundColor } as CSSProperties}
      className="relative overflow-hidden px-4 py-12 md:px-10 md:py-16 lg:px-12"
    >
      <SectionSpacingStyle
        selector={`[data-wv-id="${(rest as Record<string, unknown>)["data-wv-id"]}"]`}
        data={props as SectionSpacingData}
      />
      {bgUrl && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url("${bgUrl}")`,
            opacity: (backgroundOpacity ?? 100) / 100,
          }}
        />
      )}

      <div className="relative">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            {tag && (
              <span className={TEXT_SIZE_CLASS} style={textStyle("tag")}>
                {tag}
              </span>
            )}
            {heading && (
              <h2
                className={cn(TEXT_SIZE_CLASS, "whitespace-pre-line")}
                style={textStyle("heading")}
              >
                {heading}
              </h2>
            )}
            {description && (
              <p
                className={cn(TEXT_SIZE_CLASS, "whitespace-pre-line")}
                style={textStyle("description")}
              >
                {description}
              </p>
            )}
          </div>
          {linkText && linkUrl && (
            <a
              href={linkUrl}
              className={cn(
                TEXT_SIZE_CLASS,
                "self-start border-current border-b pb-1 md:self-auto",
              )}
              style={textStyle("link")}
            >
              {linkText}
            </a>
          )}
        </div>

        {/* Bloques: licencias y tarjetas de ediciones (subcomponentes). */}
        <div className="flex flex-col" style={{ gap: `${blocksGap ?? 32}px` }}>
          {children}
        </div>
      </div>
    </section>
  );
}

export default CollectorEditions;

export const schema = createSchema({
  type: "collector-editions",
  title: "Collector editions",
  childTypes: ["collector-editions--licenses", "collector-editions--editions"],
  settings: [
    {
      group: "Contenido",
      inputs: [
        {
          type: "text",
          name: "tag",
          label: "Etiqueta",
          defaultValue: "Monarch Collector Editions",
        },
        {
          type: "textarea",
          name: "heading",
          label: "Título",
          defaultValue: "Piezas oficiales.\nTirada cerrada.",
          helpText: "Usa saltos de línea para partir el título.",
        },
        {
          type: "textarea",
          name: "description",
          label: "Descripción",
          defaultValue:
            "La misma Monarch por dentro. Por fuera, bordados propios, acabados exclusivos y certificado.\nCuando se agota, no se reedita.",
        },
        {
          type: "text",
          name: "linkText",
          label: "Texto del enlace",
          defaultValue: "Ver todas las ediciones →",
        },
        {
          type: "url",
          name: "linkUrl",
          label: "Enlace",
          defaultValue: "/collections/all",
        },
        {
          type: "range",
          name: "blocksGap",
          label: "Separación entre bloques",
          defaultValue: 32,
          configs: { min: 0, max: 120, step: 4, unit: "px" },
        },
      ],
    },
    {
      group: "Fondo",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Color de fondo",
          defaultValue: "#0b0b0d",
        },
        {
          type: "image",
          name: "backgroundImage",
          label: "Imagen de fondo (opcional)",
        },
        {
          type: "range",
          name: "backgroundOpacity",
          label: "Opacidad de la imagen de fondo",
          defaultValue: 100,
          configs: { min: 0, max: 100, step: 5, unit: "%" },
        },
      ],
    },
    {
      group: "Espaciado de la sección",
      inputs: sectionSpacingInputs,
    },
    {
      group: "Texto: etiqueta",
      inputs: textStyleInputs("tag", {
        Color: "#c9a24b",
        MobileSize: "10px",
        DesktopSize: "10px",
        Transform: "uppercase",
        LetterSpacing: 2,
        Family: MONO_FONT,
      }),
    },
    {
      group: "Texto: título",
      inputs: textStyleInputs("heading", {
        Color: "#ffffff",
        MobileSize: "30px",
        DesktopSize: "44px",
        Weight: "700",
        Transform: "uppercase",
        LineHeight: 1.05,
      }),
    },
    {
      group: "Texto: descripción",
      inputs: textStyleInputs("description", {
        Color: "#b4b8c0",
        MobileSize: "13px",
        DesktopSize: "14px",
        LineHeight: 1.6,
      }),
    },
    {
      group: "Texto: enlace",
      inputs: textStyleInputs("link", {
        Color: "#ffffff",
        MobileSize: "11px",
        DesktopSize: "11px",
        Weight: "700",
        Transform: "uppercase",
        LetterSpacing: 1,
      }),
    },
  ],
  presets: {
    children: [
      {
        type: "collector-editions--licenses",
        children: [
          { type: "collector-editions--license", backgroundImage: IMAGES_PLACEHOLDERS.banner_1 },
          { type: "collector-editions--license", backgroundImage: IMAGES_PLACEHOLDERS.banner_2 },
          { type: "collector-editions--license", backgroundImage: IMAGES_PLACEHOLDERS.banner_1 },
          { type: "collector-editions--license", backgroundImage: IMAGES_PLACEHOLDERS.banner_2 },
        ],
      },
      {
        type: "collector-editions--editions",
        children: [
          { type: "collector-editions--edition", image: IMAGES_PLACEHOLDERS.product_1, eyebrow: "Middle-earth™ · Licencia oficial", title: "Monarch · Mordor" },
          { type: "collector-editions--edition", image: IMAGES_PLACEHOLDERS.product_2, eyebrow: "Solo Leveling · Licencia oficial", title: "Monarch · Solo Leveling" },
          { type: "collector-editions--edition", image: IMAGES_PLACEHOLDERS.product_3, eyebrow: "Black Clover · Licencia oficial", title: "Monarch · Black Clover" },
          { type: "collector-editions--edition", image: IMAGES_PLACEHOLDERS.product_4, eyebrow: "Real Madrid · Licencia oficial", title: "Monarch · Real Madrid" },
        ],
      },
    ],
  },
});
