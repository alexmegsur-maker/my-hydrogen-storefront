import { Pagination } from "@shopify/hydrogen";
import type { Collection } from "@shopify/hydrogen/storefront-api-types";
import { createSchema } from "@weaverse/hydrogen";
import { useState } from "react";
import { useLoaderData } from "react-router";
import type { CollectionsQuery } from "storefront-api.generated";
import { type OverlayProps, overlayInputs } from "~/components/overlay";
import { useLanguage } from "~/hooks/useLanguage";
import type { ImageAspectRatio } from "~/types/others";
import { getImageLoadingPriority } from "~/utils/image";
import { translations } from "~/utils/translations";
import { CollectionCard } from "./collection-card";

interface CollectionsItemsProps extends OverlayProps {
  prevButtonText: string;
  nextButtonText: string;
  imageAspectRatio: ImageAspectRatio;
  collectionNameColor: string;
  ref?: React.Ref<HTMLDivElement>;
  pgnBg: string;
  pgnColor: string;
  pgnHoverBg: string;
  pgnHoverColor: string;
  pgnBorderColor: string;
  pgnHoverBorderColor: string;
  pgnBorderWidth: string;
  pgnRadius: string;
  pgnFontSize: string;
  pgnFontFamily: string;
  pgnFontWeight: string;
  pgnPadding: string;
}

function CollectionsItems(props: CollectionsItemsProps) {
  const { collections } = useLoaderData<CollectionsQuery>();
  const {
    prevButtonText,
    nextButtonText,
    imageAspectRatio,
    collectionNameColor,
    enableOverlay,
    overlayColor,
    overlayColorHover,
    overlayOpacity,
    ref,
    pgnBg = "transparent",
    pgnColor = "#000000",
    pgnHoverBg = "#000000",
    pgnHoverColor = "#ffffff",
    pgnBorderColor = "#000000",
    pgnHoverBorderColor = "#000000",
    pgnBorderWidth = "1px",
    pgnRadius = "0px",
    pgnFontSize = "0.875rem",
    pgnFontFamily = "",
    pgnFontWeight = "400",
    pgnPadding = "0.75rem 1.5rem",
    ...rest
  } = props;

  const lang = useLanguage();
  const t = translations[lang] ?? translations["ES"];
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const btnBase: React.CSSProperties = {
    borderWidth: pgnBorderWidth,
    borderStyle: "solid",
    borderRadius: pgnRadius,
    padding: pgnPadding,
    fontSize: pgnFontSize,
    fontFamily: pgnFontFamily || undefined,
    fontWeight: pgnFontWeight,
    transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    textDecoration: "none",
  };

  return (
    <div ref={ref} {...rest}>
      <Pagination connection={collections}>
        {({
          nodes,
          isLoading,
          hasPreviousPage,
          hasNextPage,
          NextLink,
          PreviousLink,
        }) => (
          <div className="flex w-full flex-col items-center gap-8">
            {hasPreviousPage && (
              <PreviousLink
                className="mx-auto"
                style={{
                  ...btnBase,
                  backgroundColor: hoverPrev ? pgnHoverBg : pgnBg,
                  color: hoverPrev ? pgnHoverColor : pgnColor,
                  borderColor: hoverPrev ? pgnHoverBorderColor : pgnBorderColor,
                }}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
              >
                {isLoading ? t.loadingText : (prevButtonText || t.loadPrev)}
              </PreviousLink>
            )}
            <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 lg:gap-y-12 xl:grid-cols-3">
              {nodes.map((collection, i) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection as Collection}
                  imageAspectRatio={imageAspectRatio}
                  collectionNameColor={collectionNameColor}
                  loading={getImageLoadingPriority(i, 2)}
                  enableOverlay={enableOverlay}
                  overlayColor={overlayColor}
                  overlayColorHover={overlayColorHover}
                  overlayOpacity={overlayOpacity}
                />
              ))}
            </div>
            {hasNextPage && (
              <NextLink
                className="mx-auto"
                style={{
                  ...btnBase,
                  backgroundColor: hoverNext ? pgnHoverBg : pgnBg,
                  color: hoverNext ? pgnHoverColor : pgnColor,
                  borderColor: hoverNext ? pgnHoverBorderColor : pgnBorderColor,
                }}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
              >
                {isLoading ? t.loadingText : (nextButtonText || t.loadMore)}
              </NextLink>
            )}
          </div>
        )}
      </Pagination>
    </div>
  );
}

export default CollectionsItems;

export const schema = createSchema({
  type: "collections-items",
  title: "Collection items",
  settings: [
    {
      group: "Pagination",
      inputs: [
        {
          type: "text",
          name: "prevButtonText",
          label: "Previous button text",
          defaultValue: "Previous collections",
          placeholder: "Previous collections",
        },
        {
          type: "text",
          name: "nextButtonText",
          label: "Next button text",
          defaultValue: "Next collections",
          placeholder: "Next collections",
        },
        {
          type: "heading",
          label: "Estilos de botones",
        },
        {
          type: "color",
          name: "pgnBg",
          label: "Fondo",
          defaultValue: "transparent",
        },
        {
          type: "color",
          name: "pgnHoverBg",
          label: "Fondo – hover",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "pgnColor",
          label: "Color de texto",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "pgnHoverColor",
          label: "Color de texto – hover",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "pgnBorderColor",
          label: "Color de borde",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "pgnHoverBorderColor",
          label: "Color de borde – hover",
          defaultValue: "#000000",
        },
        {
          type: "text",
          name: "pgnBorderWidth",
          label: "Tamaño de borde",
          defaultValue: "1px",
          placeholder: "1px",
        },
        {
          type: "text",
          name: "pgnRadius",
          label: "Border radius",
          defaultValue: "0px",
          placeholder: "0px",
        },
        {
          type: "text",
          name: "pgnFontSize",
          label: "Tamaño de letra",
          defaultValue: "0.875rem",
          placeholder: "0.875rem",
        },
        {
          type: "text",
          name: "pgnFontFamily",
          label: "Fuente",
          defaultValue: "",
          placeholder: "inherit",
        },
        {
          type: "select",
          name: "pgnFontWeight",
          label: "Weight",
          defaultValue: "400",
          configs: {
            options: [
              { value: "300", label: "300 – Light" },
              { value: "400", label: "400 – Regular" },
              { value: "500", label: "500 – Medium" },
              { value: "600", label: "600 – SemiBold" },
              { value: "700", label: "700 – Bold" },
              { value: "800", label: "800 – ExtraBold" },
            ],
          },
        },
        {
          type: "text",
          name: "pgnPadding",
          label: "Padding",
          defaultValue: "0.75rem 1.5rem",
          placeholder: "0.75rem 1.5rem",
        },
      ],
    },
    {
      group: "Collection card",
      inputs: [
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Image aspect ratio",
          defaultValue: "1/1",
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
          name: "collectionNameColor",
          label: "Collection name color",
          defaultValue: "#fff",
          condition: (data) => data.contentPosition === "over",
        },
        {
          type: "heading",
          label: "Overlay",
        },
        ...overlayInputs,
      ],
    },
  ],
});
