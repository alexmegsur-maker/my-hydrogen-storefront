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
export type MediaRequest ={
  id:string;
  image:Image;
  mediaContentType:string;
  previewImage:Image;
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
  firstAvailableVariant:selectedVariant | null;
  selectedVariant:selectedVariant | null;
  imagenes360:MediaRequest[]|[];
  logo:Image;
  page:Page;
  listVideos:string[];
}

export interface CurrentProdcutStore{
  currentProduct:CurrentProduct,
  setProduct:(newProduct:CurrentProduct)=>void
}