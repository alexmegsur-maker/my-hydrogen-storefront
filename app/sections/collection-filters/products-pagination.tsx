import { FunnelXIcon, XIcon } from "@phosphor-icons/react";
import { Pagination } from "@shopify/hydrogen";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import type {
  CollectionQuery,
  ProductCardFragment,
} from "storefront-api.generated";
import Link from "~/components/link";
import { ProductCard } from "~/components/product/product-card";
import type { AppliedFilter } from "~/types/others";
import { translations } from "~/utils/translations";
import {
  COMBINED_LISTINGS_CONFIGS,
  isCombinedListing,
} from "~/utils/combined-listings";
import { getAppliedFilterLink } from "./filter-utils";
import ProductCardSecret from "~/components/product-secret/product-card-secret";

export interface cardStylesProps {
  bgColor:string;
  rounded:number;
  uppercase:boolean;
  tColor:string;
  thColor:string;
  tSize:string;
  tFamily:string;
  tAlignment:"left"|"center"|"right";
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  vColor:string;
  vSize:number;
  vAlignment:"left"|"center"|"right";
  vPaddingSelect:string;
  vPaddingText:string;
  vMarginSelect:string;
  vMarginText:string;
  pColor:string;
  pSize:string;
  pFamily:string;
  pAlignment:"left"|"center"|"right";
  pPaddingSelect:string;
  pPaddingText:string;
  pMarginSelect:string;
  pMarginText:string;
  pWeight:string;
  showName:boolean;
  nColor:string;
  nSize:string;
  nFamily:string;
  nAlignment:"left"|"center"|"right";
  nPaddingSelect:string;
  nPaddingText:string;
  nMarginSelect:string;
  nMarginText:string;
  nWeight:string;
  showTool:boolean;
  toolColor:string;
  toolSize:string;
  toolFamily:string;
  toolAlignment:"left"|"center"|"right";
  toolPaddingSelect:string;
  toolPaddingText:string;
  toolMarginSelect:string;
  toolMarginText:string;
  toolWeight:string;
}


export function ProductsPagination({
  gridSizeDesktop: desktopCols = 3,
  gridSizeMobile: mobileCols = 1,
  loadPrevText,
  loadMoreText,
  cardStyles = null,
  gap,
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
}: {
  gridSizeDesktop: number;
  gridSizeMobile: number;
  loadPrevText: string;
  loadMoreText: string;
  cardStyles?: cardStylesProps;
  gap?: number;
  pgnBg?: string;
  pgnColor?: string;
  pgnHoverBg?: string;
  pgnHoverColor?: string;
  pgnBorderColor?: string;
  pgnHoverBorderColor?: string;
  pgnBorderWidth?: string;
  pgnRadius?: string;
  pgnFontSize?: string;
  pgnFontFamily?: string;
  pgnFontWeight?: string;
  pgnPadding?: string;
}) {
  const { collection, appliedFilters } = useLoaderData<
    CollectionQuery & {
      collections: Array<{ handle: string; title: string }>;
      appliedFilters: AppliedFilter[];
    }
  >();
  const [params] = useSearchParams();
  const location = useLocation();
  const { pathname } = location;
  const { ref, inView } = useInView();

  const langPrefix = pathname.split('/')[1]
  const langKey = ['en', 'de', 'fr', 'it'].includes(langPrefix) ? langPrefix.toUpperCase() : 'ES'
  const t = translations[langKey] ?? translations['ES']
  const prevLabel = loadPrevText || t.loadPrev
  const moreLabel = loadMoreText || t.loadMore

  const [hoverPrev, setHoverPrev] = useState(false)
  const [hoverNext, setHoverNext] = useState(false)

  const btnBase: React.CSSProperties = {
    borderWidth: pgnBorderWidth,
    borderStyle: 'solid',
    borderRadius: pgnRadius,
    padding: pgnPadding,
    fontSize: pgnFontSize,
    fontFamily: pgnFontFamily || undefined,
    fontWeight: pgnFontWeight,
    transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
  }

  return (
    <div className="grow space-y-6">
      {appliedFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            {appliedFilters.map((filter: AppliedFilter) => {
              const { label } = filter;
              return (
                <Link
                  key={label}
                  to={getAppliedFilterLink(filter, params, location)}
                  className="items-center gap-2 border border-line-subtle px-2 py-1 hover:border-line"
                  variant="custom"
                  preventScrollReset
                >
                  <span>{label}</span>
                  <XIcon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
          {appliedFilters.length > 1 ? (
            <Link
              to={pathname}
              variant="underline"
              aria-label="Clear all applied filters"
              preventScrollReset
            >
              Clear all filters
            </Link>
          ) : null}
        </div>
      ) : null}
      {collection.products.nodes.length > 0 ? (
        <Pagination connection={collection.products}>
          {({
            nodes,
            isLoading,
            nextPageUrl,
            hasNextPage,
            hasPreviousPage,
            PreviousLink,
            NextLink,
            state,
          }) => (
            <div
              className="flex w-full flex-col items-center gap-8"
              style={
                {
                  "--cols-mobile": `repeat(${mobileCols}, minmax(0, 1fr))`,
                  "--cols-desktop": `repeat(${desktopCols}, minmax(0, 1fr))`,
                } as React.CSSProperties
              }
            >
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
                  {isLoading ? t.loadingText : prevLabel}
                </PreviousLink>
              )}
              <ProductsLoadedOnScroll
                cardStyles={cardStyles}
                gap={gap}
                nodes={nodes}
                inView={inView}
                nextPageUrl={nextPageUrl}
                hasNextPage={hasNextPage}
                state={state}
              />
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
                  {isLoading ? t.loadingText : moreLabel}
                </NextLink>
              )}
            </div>
          )}
        </Pagination>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 pt-20">
          <FunnelXIcon size={50} weight="light" />
          <div className="text-lg">No products matched your filters.</div>
        </div>
      )}
    </div>
  );
}

interface ProductsLoadedOnScrollProps {
  nodes: any;
  inView: boolean;
  nextPageUrl: string;
  hasNextPage: boolean;
  state: any;
  cardStyles?:cardStylesProps;
  gap?:number;
}

function ProductsLoadedOnScroll(props: ProductsLoadedOnScrollProps) {
  const { nodes, inView, nextPageUrl, hasNextPage, state,cardStyles,gap } = props;
  const navigate = useNavigate();
  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  return (
    <div
      className={clsx([
        "w-full",
        "grid grid-cols-(--cols-mobile) lg:grid-cols-(--cols-desktop)",
      ])}
      style={{
        gap:`${gap}px`
      }}
    >
      {nodes
        .filter(
          (product: ProductCardFragment) =>
            !(
              COMBINED_LISTINGS_CONFIGS.hideCombinedListingsFromProductList &&
              isCombinedListing(product)
            ),
        )
        .map((product: ProductCardFragment) => (
          // <ProductCard key={product.id} product={product} />
          <ProductCardSecret key={product.id} product={product} cardStyles={cardStyles} />
        ))}
    </div>
  );
}