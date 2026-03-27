import { Image } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import type {
  ProductCardFragment,
  ProductVariantFragment,
} from "storefront-api.generated";
import { Button } from "~/components/button";
import { Link } from "~/components/link";
import { RevealUnderline } from "~/components/reveal-underline";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/tooltip";
import { cn } from "~/utils/cn";
import { isLightColor, isValidColor } from "~/utils/misc";
import { OPTIONS_AS_SWATCH } from "./product-option-values";
import { useColorTheme } from "~/hooks/useHeaderConfig";
import { useEffect } from "react";

export function ProductCardOptions({
  product,
  selectedVariant,
  setSelectedVariant,
  className,
}: {
  product: ProductCardFragment;
  selectedVariant: ProductVariantFragment;
  setSelectedVariant: (variant: ProductVariantFragment) => void;
  className?: string;
}) {
  const { pcardShowOptionValues, pcardOptionToShow, pcardMaxOptionValues } =
    useThemeSettings();
  const colorsTheme = useColorTheme() 
  const { handle, options } = product;
  const { optionValues } =
    options.find(({ name }) => name === pcardOptionToShow) || {};
  const restCount = optionValues?.length - pcardMaxOptionValues;

  if (!(pcardShowOptionValues && optionValues?.length)) {
    return null;
  }

  let selectedValue = "";
  if (selectedVariant) {
    selectedValue = selectedVariant.selectedOptions?.find(
      ({ name }) => name === pcardOptionToShow,
    )?.value;
  }
  const asSwatch = OPTIONS_AS_SWATCH.includes(pcardOptionToShow);

  return (
    <div className={cn("flex flex-wrap items-center gap-1 pt-1", className)}>
      {optionValues
        ?.slice(0, pcardMaxOptionValues)
        .map(({ name, swatch, firstSelectableVariant }) => {
          if (asSwatch) {
            if(colorsTheme){
            const colorCheck = colorsTheme.find((e)=>e.identifier === name.toLowerCase())

              const color = colorCheck.colors.length>1 ? `linear-gradient(125deg, ${colorCheck.colors[0]} 50%, ${colorCheck.colors[1]} 50%)`:colorCheck.colors[0]
              const swatchColor = color ? color : "#fff";
              return (
                <Tooltip key={name}>
                  <TooltipTrigger>
                    <button
                      type="button"
                      className={cn(
                        "flex aspect-square size-4.5 rounded-full",
                        "border border-transparent transition-all",
                        selectedValue === name ? "border-gray-800 p-0.5" : "p-0",
                      )}
                      onClick={() => {
                        setSelectedVariant(firstSelectableVariant);
                      }}
                    >
                      {swatch?.image?.previewImage ? (
                        <Image
                          data={swatch.image.previewImage}
                          className="h-full w-full rounded-full object-cover object-center"
                          width={200}
                          sizes="auto"
                        />
                      ) : (
                        <span
                          className= "entra aqui inline-block h-full w-full rounded-full text-[0px] border border-line-subtle"
                          style={{ background: swatchColor }}
                        >
                          {name}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>{name}</TooltipContent>
                </Tooltip>
              );
            }
            
          }
          return (
            <Button
              key={name}
              variant="outline"
              animate={false}
              className={clsx(
                "border border-line-subtle px-2 py-1 text-center text-sm transition-colors",
                selectedValue === name &&
                  "border-body bg-body text-body-inverse",
              )}
              onClick={() => {
                setSelectedVariant(firstSelectableVariant);
              }}
            >
              {name}
            </Button>
          );
        })}
      {restCount > 0 && (
        <Link to={`/products/${handle}`} className="mt-1 pl-0.5">
          <RevealUnderline>+{restCount}</RevealUnderline>
        </Link>
      )}
    </div>
  );
}
