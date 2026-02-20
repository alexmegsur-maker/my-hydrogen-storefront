import type { ProductCollectionSortKeys } from "@shopify/hydrogen/storefront-api-types";
import type { I18nLocale, SortParam } from "~/types/others";

export function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case "price-high-low":
      return {
        sortKey: "PRICE",
        reverse: true,
      };
    case "price-low-high":
      return {
        sortKey: "PRICE",
        reverse: false,
      };
    case "best-selling":
      return {
        sortKey: "BEST_SELLING",
        reverse: false,
      };
    case "newest":
      return {
        sortKey: "CREATED",
        reverse: true,
      };
    case "featured":
      return {
        sortKey: "MANUAL",
        reverse: false,
      };
    default:
      return {
        sortKey: "RELEVANCE",
        reverse: false,
      };
  }
}

export function parseAsCurrency(value: number, locale: I18nLocale) {
  return new Intl.NumberFormat(`${locale.language}-${locale.country}`, {
    style: "currency",
    currency: locale.currency,
  }).format(value);
}

export function createCurProVar(prod){
  let options = prod.options?.map((elm: any) => ({
    name: elm.name,
    optionValues: elm.optionValues?.map((elm2: any) => ({ name: elm2.name })) || []
  })) || [];

  let firstVar = prod.selectedOrFirstAvailableVariant;
  let firstSelect = prod.variants.nodes[0]
  // 2. Extracción segura de Metafields
  let img360 = prod.imagenes360;
  let logo = prod.logoMetafield;
  let page = prod.pageMetafield;
  let list = prod.videosMetafield;

  return{ 
    id:prod.id,
    title:prod.title,
    vendor:prod.vendor,
    handle:prod.handle,
    description:prod.description,
    featuredImage:{
      url:prod.featuredImage.url || '',
      altText:prod.featuredImage.altText || '',
    },
    options:options,
    media:prod.media,
    variants:prod.variants,
    firstAvailableVariant:firstVar ? {
      id:firstVar.id,
      title:firstVar.title,
      availableForSale:firstVar.availableForSale,
      price:firstVar.price,
      compareAtPrice:firstVar.compareAtPrice,
      sku:firstVar.sku,
      selectedOptions:firstVar.selectedOptions,
      quantityAvailable:firstVar.quantityAvailable
    }:null,
    selectedVariant: {
      id:firstSelect .id,
      availableForSale:firstSelect .availableForSale,
      quantityAvailable:firstSelect .quantityAvailable,
      sku:firstSelect .sku,
      price:firstSelect .price,
      compareAtPrice:firstVar.compareAtPrice,
      selectedOptions:firstSelect .selectedOptions,
      tooltip:firstSelect .tooltip,
    },
    tags:prod.tags,
    nombre:prod.nombre?.value||null,
    tooltip:prod.tooltip?.value||null,
    imagenes360:img360?.references?.nodes || [],
    logo:logo?.reference || null,
    page:page?.reference || null,
    listVideos:list?.references?.nodes?.map((el)=>{return el.sources?.[0]?.url||''}).filter(Boolean)||[]
  }
}