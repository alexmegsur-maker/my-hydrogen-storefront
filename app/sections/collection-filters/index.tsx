import { createSchema, type WeaverseImage } from "@weaverse/hydrogen";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { CollectionQuery } from "storefront-api.generated";
import { BreadCrumb } from "~/components/breadcrumb";
import { Image } from "~/components/image";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { Filters } from "./filters";
import { ProductsPagination } from "./products-pagination";
import { ToolsBar } from "./tools-bar";
import { selectorPaddingMargin } from "~/utils/general";

export interface CollectionFiltersData {
  showBreadcrumb: boolean;
  showDescription: boolean;
  showBanner: boolean;
  bannerHeightDesktop: number;
  bannerHeightMobile: number;
  bannerBorderRadius: number;
  enableSort: boolean;
  showProductsCount: boolean;
  enableFilter: boolean;
  filtersPosition: "sidebar" | "drawer";
  expandFilters: boolean;
  showFiltersCount: boolean;
  enableSwatches: boolean;
  displayAsButtonFor: string;
  productsPerRowDesktop: number;
  productsPerRowMobile: number;
  loadPrevText: string;
  loadMoreText: string;
}

interface CollectionFiltersProps extends SectionProps, CollectionFiltersData {
  ref: React.Ref<HTMLElement>;
  bannerDesk: WeaverseImage;
  bannerMobile: WeaverseImage;
  breadUppercase: boolean;
  breadColor: string;
  breadSize: string;
  breadFamily: string;
  breadAlignment: "left" | "center" | "right";
  breadPaddingSelect: string;
  breadPaddingText: string;
  breadMarginSelect: string;
  breadMarginText: string;
  breadWeight: string;
  colUppercase: boolean;
  colColor: string;
  colSize: string;
  colFamily: string;
  colAlignment: "left" | "center" | "right";
  colPaddingSelect: string;
  colPaddingText: string;
  colMarginSelect: string;
  colMarginText: string;
  colWeight: string;
  descText: string;
  coldColor: string;
  coldSize: string;
  coldFamily: string;
  coldAlignment: "left" | "center" | "right";
  coldPaddingSelect: string;
  coldPaddingText: string;
  coldMarginSelect: string;
  coldMarginText: string;
  coldWeight: string;
  space: number;
  paddingSelect: string;
  paddingText: string;
  marginSelect: string;
  marginText: string;
  showColumn: boolean;
  bgColor: string;
  rounded: number;
  uppercase: boolean;
  tColor: string;
  thColor: string;
  tSize: string;
  tFamily: string;
  tAlignment: "left" | "center" | "right";
  tPaddingSelect: string;
  tPaddingText: string;
  tMarginSelect: string;
  tMarginText: string;
  tWeight: string;
  vColor: string;
  vSize: number;
  vAlignment: "left" | "center" | "right";
  vPaddingSelect: string;
  vPaddingText: string;
  vMarginSelect: string;
  vMarginText: string;
  pColor: string;
  pSize: string;
  pFamily: string;
  pAlignment: "left" | "center" | "right";
  pPaddingSelect: string;
  pPaddingText: string;
  pMarginSelect: string;
  pMarginText: string;
  pWeight: string;
  showName: boolean;
  nColor: string;
  nSize: string;
  nFamily: string;
  nAlignment: "left" | "center" | "right";
  nPaddingSelect: string;
  nPaddingText: string;
  nMarginSelect: string;
  nMarginText: string;
  nWeight: string;
  showTool: boolean;
  toolColor: string;
  toolSize: string;
  toolFamily: string;
  toolAlignment: "left" | "center" | "right";
  toolPaddingSelect: string;
  toolPaddingText: string;
  toolMarginSelect: string;
  toolMarginText: string;
  toolWeight: string;
}

export default function CollectionFilters(props: CollectionFiltersProps) {
  const {
    ref,
    showBreadcrumb,
    showDescription,
    showBanner,
    bannerHeightDesktop,
    bannerHeightMobile,
    bannerBorderRadius,
    enableSort,
    showFiltersCount,
    enableFilter,
    filtersPosition,
    expandFilters,
    showProductsCount,
    enableSwatches,
    displayAsButtonFor,
    productsPerRowDesktop,
    productsPerRowMobile,
    loadPrevText,
    loadMoreText,

    bannerDesk,
    bannerMobile,
    breadUppercase,
    breadColor,
    breadSize,
    breadFamily,
    breadAlignment,
    breadPaddingSelect,
    breadPaddingText,
    breadMarginSelect,
    breadMarginText,
    breadWeight,
    colUppercase,
    colColor,
    colSize,
    colFamily,
    colAlignment,
    colPaddingSelect,
    colPaddingText,
    colMarginSelect,
    colMarginText,
    colWeight,
    descText,
    coldColor,
    coldSize,
    coldFamily,
    coldAlignment,
    coldPaddingSelect,
    coldPaddingText,
    coldMarginSelect,
    coldMarginText,
    coldWeight,

    space,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    showColumn,
    bgColor,
    rounded,
    uppercase,
    tColor,
    thColor,
    tSize,
    tFamily,
    tAlignment,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    vColor,
    vSize,
    vAlignment,
    vPaddingSelect,
    vPaddingText,
    vMarginSelect,
    vMarginText,
    pColor,
    pSize,
    pFamily,
    pAlignment,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    pWeight,
    showName,
    nColor,
    nSize,
    nFamily,
    nAlignment,
    nPaddingSelect,
    nPaddingText,
    nMarginSelect,
    nMarginText,
    nWeight,
    showTool,
    toolColor,
    toolSize,
    toolFamily,
    toolAlignment,
    toolPaddingSelect,
    toolPaddingText,
    toolMarginSelect,
    toolMarginText,
    toolWeight,
    ...rest
  } = props;

  const cardStyles = {
    bgColor,
    rounded,
    uppercase,
    tColor,
    thColor,
    tSize,
    tFamily,
    tAlignment,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    vColor,
    vSize,
    vAlignment,
    vPaddingSelect,
    vPaddingText,
    vMarginSelect,
    vMarginText,
    pColor,
    pSize,
    pFamily,
    pAlignment,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    pWeight,
    showName,
    nColor,
    nSize,
    nFamily,
    nAlignment,
    nPaddingSelect,
    nPaddingText,
    nMarginSelect,
    nMarginText,
    nWeight,
    showTool,
    toolColor,
    toolSize,
    toolFamily,
    toolAlignment,
    toolPaddingSelect,
    toolPaddingText,
    toolMarginSelect,
    toolMarginText,
    toolWeight,
  };

  const { collection, collections } = useLoaderData<
    CollectionQuery & {
      collections: Array<{ handle: string; title: string }>;
    }
  >();
  const description =descText && descText.length> 15 ? descText:  collection.description  

  const [gridSizeDesktop, setGridSizeDesktop] = useState(
    Number(productsPerRowDesktop) || 3,
  );
  
  const [gridSizeMobile, setGridSizeMobile] = useState(
    Number(productsPerRowMobile) || 1,
  );

  const [windowSize, setWindowSize] = useState(800);
  useEffect(() => {
    setGridSizeDesktop(Number(productsPerRowDesktop) || 3);
    setGridSizeMobile(Number(productsPerRowMobile) || 1);
  }, [productsPerRowDesktop, productsPerRowMobile]);

  useEffect(() => {
    if (window.innerWidth) {
      setWindowSize(window.innerWidth);
    }
  }, []);

  if (collection?.products && collections) {
    const bannerImg = windowSize > 700 ? bannerDesk : bannerMobile;
    const banner = bannerImg ? bannerImg : collection.image;

    return (
      <Section
        ref={ref}
        {...rest}
        overflow="unset"
      >
        <div className="relative">
        {showBanner && banner && (
          <div
            className={clsx([
              "overflow-hidden bg-gray-100 w-full",
              "rounded-(--banner-border-radius)",
              "h-(--banner-height-mobile) lg:h-(--banner-height-desktop)",
            ])}
            style={
              {
                "--banner-height-desktop": `${bannerHeightDesktop}px`,
                "--banner-height-mobile": `${bannerHeightMobile}px`,
                "--banner-border-radius": `${bannerBorderRadius}px`,
              } as React.CSSProperties
            }
          >
            <Image data={banner} sizes="auto" width={2000} />
          </div>
        )}
          <div 
            className="z-1 py-10 w-full h-full flex  flex-col justify-center"
            style={{
              position:showBanner ? "absolute":"static",
              top:showBanner && 0,
            }}
            >
            {showBreadcrumb && (
              <BreadCrumb 
                page={collection.title} 
                className="mb-2.5" 
                style={{
                  textTransform:breadUppercase && "uppercase",
                  color:breadColor,
                  fontSize:breadSize,
                  justifyContent:breadAlignment,
                  fontFamily:breadFamily,
                  fontWeight:breadWeight,
                  ...selectorPaddingMargin("padding",breadPaddingSelect,breadPaddingText),
                  ...selectorPaddingMargin("margin",breadMarginSelect,breadMarginText),  
                }}
                />
            )}
            <h3
              style={{
                textTransform:colUppercase && "uppercase",
                color:colColor,
                fontSize:colSize,
                textAlign:colAlignment,
                fontFamily:colFamily,
                fontWeight:colWeight,
                ...selectorPaddingMargin("padding",colPaddingSelect,colPaddingText),
                ...selectorPaddingMargin("margin",colMarginSelect,colMarginText),
              }}
            >
                {collection.title}
            </h3>
            {showDescription && description && (
              <div
                className="mt-2.5 text-body-subtle"
                dangerouslySetInnerHTML={{__html:description}}
                style={{
                  color:coldColor,
                  fontSize:coldSize,
                  textAlign:coldAlignment,
                  fontFamily:coldFamily,
                  fontWeight:coldWeight,
                  ...selectorPaddingMargin("padding",coldPaddingSelect,coldPaddingText),
                  ...selectorPaddingMargin("margin",coldMarginSelect,coldMarginText),
                }}
              >
              </div>
            )}
          </div>
        </div>
        {showColumn && (
          <ToolsBar
            width={rest.width}
            gridSizeDesktop={gridSizeDesktop}
            gridSizeMobile={gridSizeMobile}
            onGridSizeChange={(v) => {
              if (v > 2) {
                setGridSizeDesktop(v);
              } else {
                setGridSizeMobile(v);
              }
            }}
            {...props}
          />
        )}
        <div 
          className="flex gap-5 pt-6 pb-8 lg:pt-12 lg:pb-20"
          style={{
            ...selectorPaddingMargin("padding", paddingSelect, paddingText),
            ...selectorPaddingMargin("margin", marginSelect, marginText),
          }}
        >
          {enableFilter && filtersPosition === "sidebar" && (
            <div className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-[calc(var(--height-nav)+40px)] space-y-4">
                <div className="font-bold">Filters</div>
                <Filters />
              </div>
            </div>
          )}
          <ProductsPagination
            gap={space}
            cardStyles={cardStyles}
            gridSizeDesktop={gridSizeDesktop}
            gridSizeMobile={gridSizeMobile}
            loadPrevText={loadPrevText}
            loadMoreText={loadMoreText}
          />
        </div>
      </Section>
    );
  }
  return <Section ref={ref} {...rest} />;
}

export const schema = createSchema({
  type: "collection-filters",
  title: "Collection filters",
  limit: 1,
  enabledOn: {
    pages: ["COLLECTION"],
  },
  settings: [
    {
      group: "Layout",
      inputs: [
        ...layoutInputs.filter((inp) => {
          return inp.name !== "borderRadius" && inp.name !== "gap";
        }),
        {
          type: "select",
          label: "Padding type",
          name: "paddingSelect",
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
          name: "paddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "marginSelect",
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
          name: "marginText",
        },

        {
          type: "switch",
          name: "showBreadcrumb",
          label: "Show breadcrumb",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showDescription",
          label: "Show description",
          defaultValue: false,
        },
      ],
    },
    {
      group: "Banner",
      inputs: [
        {
          type: "switch",
          name: "showBanner",
          label: "Show banner",
          defaultValue: true,
        },
        {
          type: "image",
          label: "banner Image (desktop)",
          name: "bannerDesk",
        },
        {
          type: "image",
          label: "banner Image (mobile)",
          name: "bannerMobile",
        },
        {
          type: "range",
          name: "bannerHeightDesktop",
          label: "Banner height (desktop)",
          defaultValue: 350,
          configs: {
            min: 100,
            max: 600,
            step: 1,
          },
          condition: (data: CollectionFiltersData) => data.showBanner,
        },
        {
          type: "range",
          name: "bannerHeightMobile",
          label: "Banner height (mobile)",
          defaultValue: 200,
          configs: {
            min: 50,
            max: 400,
            step: 1,
          },
          condition: (data: CollectionFiltersData) => data.showBanner,
        },
        {
          type: "range",
          name: "bannerBorderRadius",
          label: "Banner border radius",
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
          defaultValue: 0,
          condition: (data: CollectionFiltersData) => data.showBanner,
        },
      ],
    },
    {
      group: "Head section",
      inputs: [
        {
          type: "heading",
          label: "breadcrumbs",
        },
        {
          type: "switch",
          label: "uppercase",
          name: "breadUppercase",
          defaultValue: true,
        },
        {
          type: "color",
          label: "color",
          name: "breadColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "breadSize",
          defaultValue: "12px",
        },
        {
          type: "text",
          label: "font family",
          name: "breadFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Content alignment",
          name: "breadAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "select",
          label: "Padding type",
          name: "breadPaddingSelect",
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
          name: "breadPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "breadMarginSelect",
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
          name: "breadMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "breadWeight",
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
          label: "title",
        },
        {
          type: "switch",
          label: "uppercase",
          name: "colUppercase",
          defaultValue: true,
        },
        {
          type: "color",
          label: "color",
          name: "colColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "colSize",
          defaultValue: "42px",
        },
        {
          type: "text",
          label: "font family",
          name: "colFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Content alignment",
          name: "colAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "select",
          label: "Padding type",
          name: "colPaddingSelect",
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
          name: "colPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "colMarginSelect",
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
          name: "colMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "colWeight",
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
          label: "description",
        },
        {
          type: "richtext",
          label: "description alternative text",
          name: "descText",
        },
        {
          type: "color",
          label: "color",
          name: "coldColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "coldSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family",
          name: "coldFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Content alignment",
          name: "coldAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "select",
          label: "Padding type",
          name: "coldPaddingSelect",
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
          name: "coldPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "coldMarginSelect",
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
          name: "coldMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "coldWeight",
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
      ],
    },
    {
      group: "Filtering and sorting",
      inputs: [
        {
          type: "switch",
          name: "enableSort",
          label: "Enable sorting",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showProductsCount",
          label: "Show products count",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "enableFilter",
          label: "Enable filtering",
          defaultValue: true,
        },
        {
          type: "select",
          name: "filtersPosition",
          label: "Filters position",
          configs: {
            options: [
              { value: "sidebar", label: "Sidebar" },
              { value: "drawer", label: "Drawer" },
            ],
          },
          defaultValue: "sidebar",
          condition: (data: CollectionFiltersData) => data.enableFilter,
        },
        {
          type: "switch",
          name: "expandFilters",
          label: "Expand filters",
          defaultValue: true,
          condition: (data: CollectionFiltersData) => data.enableFilter,
        },
        {
          type: "switch",
          name: "showFiltersCount",
          label: "Show filters count",
          defaultValue: true,
          condition: (data: CollectionFiltersData) => data.enableFilter,
        },
        {
          type: "switch",
          name: "enableSwatches",
          label: "Enable color/image swatches",
          defaultValue: true,
          condition: (data: CollectionFiltersData) => data.enableFilter,
        },
        {
          type: "text",
          name: "displayAsButtonFor",
          label: "Display as button for:",
          defaultValue: "Size, More filters",
          condition: (data: CollectionFiltersData) => data.enableFilter,
          helpText: "Comma-separated list of filters to display as buttons",
        },
      ],
    },
    {
      group: "Products grid",
      inputs: [
        {
          type: "range",
          label: "gap",
          name: "space",
          defaultValue: 20,
          configs: {
            min: 1,
            max: 100,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "switch",
          label: "show column dispose",
          name: "showColumn",
          defaultValue: true,
        },
        {
          type: "select",
          name: "productsPerRowDesktop",
          label: "Default products per row (desktop)",
          configs: {
            options: [
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ],
          },
          defaultValue: "3",
        },
        {
          type: "select",
          name: "productsPerRowMobile",
          label: "Default products per row (mobile)",
          configs: {
            options: [
              { value: "1", label: "1" },
              { value: "2", label: "2" },
            ],
          },
          defaultValue: "1",
        },
        {
          type: "text",
          name: "loadPrevText",
          label: "Load previous text",
          defaultValue: "↑ Load previous",
          placeholder: "↑ Load previous",
        },
        {
          type: "text",
          name: "loadMoreText",
          label: "Load more text",
          defaultValue: "Load more ↓",
          placeholder: "Load more ↓",
        },
      ],
    },
    {
      group: "product Card",
      inputs: [
        {
          type: "color",
          label: "background Color",
          name: "bgColor",
          defaultValue: "#ffffff",
        },
        {
          type: "range",
          label: "border radius",
          name: "rounded",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 200,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "heading",
          label: "title",
        },
        {
          type: "switch",
          label: "uppercase",
          name: "uppercase",
          defaultValue: true,
        },
        {
          type: "color",
          label: "color",
          name: "tColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "color",
          label: "hover color",
          name: "thColor",
          defaultValue: "#3790b0",
        },
        {
          type: "text",
          label: "font size",
          name: "tSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family",
          name: "tFamily",
          defaultValue: "Montserrat",
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
            ],
          },
          defaultValue: "center",
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
        {
          type: "text",
          label: "Padding text",
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
          name: "tMarginText",
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
          type: "heading",
          label: "variants",
        },
        {
          type: "color",
          label: "border color",
          name: "vColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "range",
          label: "size",
          name: "vSize",
          defaultValue: 10,
          configs: {
            min: 5,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "select",
          label: "Content alignment",
          name: "vAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "select",
          label: "Padding type",
          name: "vPaddingSelect",
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
          name: "vPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "vMarginSelect",
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
          name: "vMarginText",
        },
        {
          type: "heading",
          label: "price",
        },
        {
          type: "color",
          label: "color",
          name: "pColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "pSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family",
          name: "pFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Content alignment",
          name: "pAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "select",
          label: "Padding type",
          name: "pPaddingSelect",
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
          name: "pMarginText",
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
          type: "heading",
          label: "name",
        },
        {
          type: "switch",
          label: "show name",
          name: "showName",
          defaultValue: true,
        },
        {
          type: "color",
          label: "color",
          name: "nColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "nSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family",
          name: "nFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Content alignment",
          name: "nAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "select",
          label: "Padding type",
          name: "nPaddingSelect",
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
          name: "nPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "nMarginSelect",
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
          name: "nMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "nWeight",
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
          label: "Tooltip",
        },
        {
          type: "switch",
          label: "show tooltip",
          name: "showTool",
          defaultValue: true,
        },
        {
          type: "color",
          label: "color",
          name: "toolColor",
          defaultValue: "#2b2b2b",
        },
        {
          type: "text",
          label: "font size",
          name: "toolSize",
          defaultValue: "20px",
        },
        {
          type: "text",
          label: "font family",
          name: "toolFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Content alignment",
          name: "toolAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "select",
          label: "Padding type",
          name: "toolPaddingSelect",
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
          name: "toolPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "toolMarginSelect",
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
          name: "toolMarginText",
        },
        {
          type: "select",
          label: "Font weight",
          name: "toolWeight",
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
      ],
    },
  ],
});
