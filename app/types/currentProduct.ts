export interface optionValue{
  name:string
}
export interface optionCurrent{
  name:string,
  optionValues:optionValue[]

}
export interface selectedOptions{
  name:string;
  value:string;
}



export interface priceRange{
  minVariantPrice:Price;
  maxVariantPrice:Price;
}
export interface Price{
  amount:string;
  currencyCode:string;
}

export interface selectedVariant{
  id:string;
  title:string;
  availableForSale:boolean;
  price:Price;
  sku:string;
  selectedOptions:selectedOptions[];
  compareAtPrice:Price;
  quantityAvailable:number;
}

export interface Image{
  id?:string;
  url?:string;
  altText?:string;
  width?:number;
  height?:number;
}

export interface Page{
  id:string;
  body:string;
  onlineStoreUrl:string;
  title:string;
}

export interface MediaProduct{
  alt?:string;
  id?:string;
  mediaContentType?:string;
  __typename?:"MediaImage";
  previewImage?:Image;
  image?:Image;
}

export interface Imag360Metafield extends Metafield{
  references:MediaProduct
}
export interface LogoMetafield extends Metafield{
  reference:Image;
}

export interface Metafield{
  id?:string;
  type?:string;
  value?:string;
  key?:string;
}

export interface PageMetafield extends Metafield{
  reference:Page
}

export interface Variants {
  id:string;
  nombre?:Metafield;
  quantityAvailable:number;
  availableForSale:boolean;
  compareAtPrice:Price;
  sku:string;
  selectedOptions:selectedOptions[];
  price:Price
  tooltip:Metafield;
}

export interface CurrentProduct{
  id:string;
  title:string;
  vendor:string;
  handle:string;
  description:string;
  featuredImage:Image;
  media?:{nodes:MediaProduct[]}
  options:optionCurrent[];
  variants:{nodes:Variants[]}
  firstAvailableVariant:selectedVariant | null;
  selectedVariant:Variants | null;
  imagenes360:MediaProduct[];
  tags?:string[];
  logo:Image;
  page:Page;
  listVideos:string[];
  nombre:string;
  tooltip:Metafield;
}

export interface CurrentProdcutStore{
  currentProduct:CurrentProduct,
  setProduct:(newProduct:CurrentProduct)=>void
  setVariant:(newVariant:Variants)=>void
}