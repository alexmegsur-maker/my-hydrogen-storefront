import { mapSelectedProductOptionToObject } from "@shopify/hydrogen";
import { useEffect, useState } from "react";
import { useViewTransitionState } from "react-router";
import type { ProductCardFragment, ProductVariantFragment } from "storefront-api.generated"
import {Link} from "~/components/link"
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { Spinner } from "../spinner";
import { useThemeSettings, useWeaverse } from "@weaverse/hydrogen";
import { Image } from "~/components/image"
import { ProductCardOptions } from "../product/product-card-options";
import clsx from "clsx";
import { ProductCardOptionsSecret } from "./product-card-options-secret";
import type { cardStylesProps } from "~/sections/collection-filters/products-pagination";
import { selectorPaddingMargin } from "~/utils/general";
import { checkPrice } from "~/utils/product";


function ProductCardSecret({product,className,cardStyles}:{product:ProductCardFragment; className?:string;cardStyles:cardStylesProps}){
  
  const {
    pcardShowImageOnHover,
  } = useThemeSettings();

  const [selectedVariant, setSelectedVariant] =
      useState<ProductVariantFragment | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [hoverTitle,setHoverTitle]=useState(false)
    const [hoverImage,setHoverImage]=useState(false)
    const productPageHref = usePrefixPathWithLocale(
      `/products/${product.handle}`,
    );
  const isTransitioning = useViewTransitionState(productPageHref);
  
  const variantStyles = {
    vColor:cardStyles.vColor,
    vSize:cardStyles.vSize,
    vAlignment:cardStyles.vAlignment,
    vPaddingSelect:cardStyles.vPaddingSelect,
    vPaddingText:cardStyles.vPaddingText,
    vMarginSelect:cardStyles.vMarginSelect,
    vMarginText:cardStyles.vMarginText
  }

    const { images, badges, priceRange } = product;
    const { minVariantPrice, maxVariantPrice } = priceRange;
  
    const firstVariant = product.selectedOrFirstAvailableVariant;
    const params = new URLSearchParams(
      mapSelectedProductOptionToObject(
        (selectedVariant || firstVariant)?.selectedOptions || [],
      ),
    );

    let [image, secondImage] = images.nodes;

    if (selectedVariant?.image) {
      image = selectedVariant.image;
      const imageUrl = image.url;
      const imageIndex = images.nodes.findIndex(({ url }) => url === imageUrl);
      if (imageIndex > 0 && imageIndex < images.nodes.length - 1) {
        secondImage = images.nodes[imageIndex + 1];
      }
    }

 
  return (
    <div
      style={{
        background:cardStyles.bgColor,
        borderRadius:cardStyles.rounded
      }}
    >
      <div 
        className="relative flex flex-col h-full place-content-between " 
      >
        {image &&(
          <Link
            to={`/products/${product.handle}?${params.toString()}`}
            prefetch="intent"
            className="group relative block overflow-hidden "
            onMouseEnter={()=>setHoverImage((state)=>state==false && true)}
            onMouseLeave={()=>setHoverImage((state)=>state==true && false)}
            
          >
            {isImageLoading &&  <Spinner className="bg-gray-100"/>}
            <Image
              sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
              data={image}
              width={700}
              alt={image.altText || `Picture of ${product.title}`}
              loading="lazy"
              onLoad={() => setIsImageLoading(false)}
              style={{
                opacity:hoverImage ? 0:1,
                transition:"all 1s",

              }}
            />
            {pcardShowImageOnHover && secondImage && (
              <Image
                className={clsx([
                  "absolute inset-0",
                  "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                ])}
                sizes="auto"
                width={700}
                data={secondImage}
                alt={
                  secondImage.altText || `Second picture of ${product.title}`
                }
                loading="lazy"
              />
            )}
          </Link>
        )}
        <div>

          <ProductCardOptionsSecret
            variantStyles={variantStyles}
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={(variant:ProductVariantFragment)=>{
              if(variant.image?.url !== selectedVariant?.image?.url){
                setIsImageLoading(true)
              }
              setSelectedVariant(variant)
            }}
          />

          <Link 
            to={`/products/${product.handle}?${params.toString()}`}
            prefetch="intent"
            className="w-full"
          >
            <p
              onMouseEnter={()=>setHoverTitle((state)=> state == false && true)}
              onMouseLeave={()=>setHoverTitle((state)=> state == true && false)}
              className="flex w-full"
              style={{
                textTransform: cardStyles.uppercase && "uppercase",
                color:hoverTitle ? cardStyles.thColor:cardStyles.tColor,
                fontSize:cardStyles.tSize,
                justifyContent:cardStyles.tAlignment,  
                textAlign:cardStyles.tAlignment,
                fontFamily:cardStyles.tFamily,
                fontWeight:cardStyles.tWeight,
                ...selectorPaddingMargin("padding",cardStyles.tPaddingSelect,cardStyles.tPaddingText),
                ...selectorPaddingMargin("margin",cardStyles.tMarginSelect,cardStyles.tMarginText),
              }}
            >
              {product.title}
            </p>
          </Link>
          <div>
            
            {product.nombre?.value && cardStyles?.showName &&
              <div
                className="flex "
                style={{
                  color:cardStyles.nColor,
                  fontSize:cardStyles.nSize,
                  justifyContent:cardStyles.nAlignment,  
                  fontFamily:cardStyles.nFamily,
                  fontWeight:cardStyles.nWeight,
                  ...selectorPaddingMargin("padding",cardStyles.nPaddingSelect,cardStyles.nPaddingText),
                  ...selectorPaddingMargin("margin",cardStyles.nMarginSelect,cardStyles.nMarginText),
                }}
              >
                {product.nombre?.value}
              </div>
            }
            {product.tooltip?.value && cardStyles?.showTool &&
              <div
                className="flex"
                style={{
                  color:cardStyles.toolColor,
                  fontSize:cardStyles.toolSize,
                  justifyContent:cardStyles.toolAlignment,  
                  fontFamily:cardStyles.toolFamily,
                  fontWeight:cardStyles.toolWeight,
                  ...selectorPaddingMargin("padding",cardStyles.toolPaddingSelect,cardStyles.toolPaddingText),
                  ...selectorPaddingMargin("margin",cardStyles.toolMarginSelect,cardStyles.toolMarginText),
                }}
              >
                {product.tooltip?.value}
              </div>
            }
          </div>
          <div
            className="flex"
            style={{
              color:cardStyles.pColor,
              fontSize:cardStyles.pSize,
              justifyContent:cardStyles.pAlignment,  
              fontFamily:cardStyles.pFamily,
              fontWeight:cardStyles.pWeight,
              ...selectorPaddingMargin("padding",cardStyles.pPaddingSelect,cardStyles.pPaddingText),
              ...selectorPaddingMargin("margin",cardStyles.pMarginSelect,cardStyles.pMarginText),
            }}
          >
            {firstVariant.compareAtPrice?.amount &&
              <span className="me-2 font-thin text-stone-600 line-through">
                {checkPrice(firstVariant.compareAtPrice.amount)}€ 
              </span>
            }
            {checkPrice(firstVariant.price.amount)}€
          </div>
        </div>
      </div>  
    </div> 
  )
}

export default ProductCardSecret