import { Image as HydrogenImage } from "@shopify/hydrogen";
import type { Image as ImageType } from "@shopify/hydrogen/storefront-api-types";
import type React from "react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "~/utils/cn";

type Crop = "center" | "top" | "bottom" | "left" | "right";

export interface ImageProps
  extends Omit<React.ComponentPropsWithRef<"img">, "ref"> {
  ref?: React.Ref<HTMLDivElement>;
  aspectRatio?: string;
  containerStyle?:CSSProperties;
  crop?: "center" | "top" | "bottom" | "left" | "right";
  data?: Partial<
    ImageType & {
      recurseIntoArrays: true;
    }
  >;
  loader?: (params: {
    src?: ImageType["url"];
    width?: number;
    height?: number;
    crop?: Crop;
  }) => string;
  srcSetOptions?: {
    intervals: number;
    startingWidth: number;
    incrementSize: number;
    placeholderWidth: number;
  };
}

export function Image({ ref, className,containerStyle, onLoad, ...rest }: ImageProps) {
  /**
   * Use useRef for HydrogenImage, so we can access the HydrogenImage's ref
   * even when using ref prop for the outer div
   */
  const hydrogenImageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (hydrogenImageRef.current?.complete) {
      setLoaded(true);
      onLoad?.({} as React.SyntheticEvent<HTMLImageElement>);
    }
  }, [onLoad]);

  return (
    <div
      ref={ref}
      className={cn(
        "h-full w-full overflow-hidden",
        !loaded && "animate-pulse [animation-duration:4s]",
        className,
      )}
      style={containerStyle}
    >
      <HydrogenImage
        ref={hydrogenImageRef}
        className={cn(
          "[transition:filter_500ms_cubic-bezier(.4,0,.2,1)] z-2",
          "h-full max-h-full w-full object-cover object-center",
          loaded ? "blur-0" : "blur-xl",
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        {...rest}
      />
    </div>
  );
}
