import { Pagination } from "@shopify/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import { useState } from "react";
import { useLoaderData } from "react-router";
import type { AllProductsQuery } from "storefront-api.generated";
import { BreadCrumb } from "~/components/breadcrumb";
import { ProductCard } from "~/components/product/product-card";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { useLanguage } from "~/hooks/useLanguage";
import { translations } from "~/utils/translations";


interface AllProductsProps extends SectionProps {
  ref: React.Ref<HTMLElement>;
  heading: string;
  prevPageText: string;
  nextPageText: string;
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

export default function AllProducts(props: AllProductsProps) {
  const {
    ref, heading, prevPageText, nextPageText,
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
  const { products } = useLoaderData<AllProductsQuery>();
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
    <Section ref={ref} {...rest} overflow="unset">
      <BreadCrumb page={heading} className="mb-4 justify-center" />
      <h1 className="mb-8 text-center font-medium lg:mb-20">{heading}</h1>
      <Pagination connection={products}>
        {({
          nodes,
          isLoading,
          NextLink,
          PreviousLink,
          hasNextPage,
          hasPreviousPage,
        }) => {
          return (
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
                  {isLoading ? t.loadingText : (prevPageText || t.loadPrev)}
                </PreviousLink>
              )}
              <div
                className={clsx([
                  "w-full gap-x-4 gap-y-6 lg:gap-y-10",
                  "grid grid-cols-1 lg:grid-cols-4",
                ])}
              >
                {nodes.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
                  {isLoading ? t.loadingText : (nextPageText || t.loadMore)}
                </NextLink>
              )}
            </div>
          );
        }}
      </Pagination>
    </Section>
  );
}

export const schema = createSchema({
  type: "all-products",
  title: "All products",
  limit: 1,
  enabledOn: {
    pages: ["ALL_PRODUCTS"],
  },
  settings: [
    {
      group: "Layout",
      inputs: [
        ...layoutInputs.filter(
          (inp) =>
            inp.name !== "divider" &&
            inp.name !== "borderRadius" &&
            inp.name !== "gap",
        ),
      ],
    },
    {
      group: "All products",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "All Products",
          placeholder: "All Products",
        },
        {
          type: "text",
          name: "prevPageText",
          label: "Previous page text",
          defaultValue: "↑ Load previous",
          placeholder: "↑ Load previous",
        },
        {
          type: "text",
          name: "nextPageText",
          label: "Next page text",
          defaultValue: "Load more ↓",
          placeholder: "Load more ↓",
        },
      ],
    },
    {
      group: "Estilos de botones",
      inputs: [
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
  ],
});
