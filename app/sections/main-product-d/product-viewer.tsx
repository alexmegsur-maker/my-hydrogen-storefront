import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "~/components/image";
import { Skeleton } from "~/components/skeleton";
import type { Image as ImageType, MediaProduct } from "~/types/currentProduct";
import { useProductConfiguratorD } from "./store";

export interface ProductViewerProps {
  media: MediaProduct[];
  logo?: ImageType | null;
  /** Color de fondo del lienzo. */
  background?: string;
  /** Muestra las marcas de esquina del boceto. */
  showFrame?: boolean;
  /** Muestra el slider de miniaturas inferior. */
  showThumbnails?: boolean;
  /** Miniaturas visibles a la vez en el slider. */
  thumbsPerView?: number;
  /** Flechas de navegación del slider de miniaturas. */
  showThumbsNavigation?: boolean;
  className?: string;
}

/**
 * Visor del configurador: previsualización principal + slider de miniaturas.
 *
 * No es un componente de Weaverse (igual que `~/components/product-j/product-media`
 * en main-product-j): lo renderiza la sección padre en la columna izquierda.
 * El índice activo vive en el store del configurador, así que cualquier otro
 * subcomponente puede cambiar la vista sin pasar props.
 */
export default function ProductViewer(props: ProductViewerProps) {
  const {
    media,
    logo = null,
    background = "#050505",
    showFrame = true,
    showThumbnails = true,
    thumbsPerView = 5,
    showThumbsNavigation = true,
    className = "",
  } = props;

  const activeMediaIndex = useProductConfiguratorD((state) => state.activeMediaIndex);
  const setActiveMediaIndex = useProductConfiguratorD((state) => state.setActiveMediaIndex);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const images = useMemo(
    () => (media ?? []).filter((item) => Boolean(item?.previewImage?.url || item?.image?.url)),
    [media],
  );

  // Si cambia el set de media (otro producto u otra variante), volvemos a la
  // primera imagen para no quedarnos en un índice que ya no existe.
  useEffect(() => {
    if (activeMediaIndex > images.length - 1) setActiveMediaIndex(0);
  }, [images.length, activeMediaIndex, setActiveMediaIndex]);

  // Mantiene la miniatura activa a la vista cuando el índice cambia desde fuera.
  useEffect(() => {
    if (thumbsSwiper && !thumbsSwiper.destroyed) {
      thumbsSwiper.slideTo(activeMediaIndex);
    }
  }, [activeMediaIndex, thumbsSwiper]);

  const active = images[activeMediaIndex] ?? images[0] ?? null;
  const activeImage = active?.previewImage ?? active?.image ?? null;

  return (
    <div
      className={`product-viewer relative flex-none w-full md:w-[65vw] md:h-[100vh] ${className}`}
      style={{ background }}
    >
      <div className="relative flex h-full w-full flex-col">
        {logo?.url && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-[4px] bg-black/70 px-3 py-2">
            <img
              loading="lazy"
              src={logo.url}
              alt={logo.altText || "Licencia oficial"}
              className="h-[20px] md:h-[32px]"
            />
          </div>
        )}

        {showFrame && (
          <>
            <span className="pointer-events-none absolute left-6 top-6 h-4 w-4 border-l border-t border-[#ffffff20]" />
            <span className="pointer-events-none absolute right-6 top-6 h-4 w-4 border-r border-t border-[#ffffff20]" />
            <span className="pointer-events-none absolute bottom-6 left-6 h-4 w-4 border-b border-l border-[#ffffff20]" />
            <span className="pointer-events-none absolute bottom-6 right-6 h-4 w-4 border-b border-r border-[#ffffff20]" />
          </>
        )}

        <div className="viewer-stage flex flex-1 items-center justify-center">
          {activeImage?.url ? (
            <Image
              data={activeImage}
              className="h-full w-full object-contain"
              sizes="(min-width: 1024px) 65vw, 100vw"
              width={1400}
            />
          ) : (
            <Skeleton className="h-[50vh] w-[60%] rounded-none bg-white/5" />
          )}
        </div>

        {showThumbnails && images.length > 1 && (
          <div 
            className="viewer-thumbs relative mx-auto w-full max-w-[560px] px-9"
            style={{
              position:"absolute",
              bottom:0,
              left:"50%",
              transform:"translateX(-50%)",
              marginBottom:"1rem"
            }}
            >
            <Swiper
              modules={[FreeMode, Navigation]}
              onSwiper={setThumbsSwiper}
              spaceBetween={14}
              slidesPerView={thumbsPerView}
              freeMode
              watchSlidesProgress
              navigation={
                showThumbsNavigation
                  ? {
                      prevEl: ".viewer-thumb-prev",
                      nextEl: ".viewer-thumb-next",
                    }
                  : false
              }
              className="viewer-thumbs-slider"
            >
              {images.map((item, index) => {
                const preview = item.previewImage ?? item.image;
                const isActive = index === activeMediaIndex;
                return (
                  <SwiperSlide key={item.id ?? `${preview?.url}-${index}`}>
                    <button
                      type="button"
                      onClick={() => setActiveMediaIndex(index)}
                      aria-label={preview?.altText || `Vista ${index + 1}`}
                      data-active={isActive}
                      className="viewer-thumb block overflow-hidden"
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        background: "#0a0a0a",
                        border: `1px solid ${isActive ? "#ffffff70" : "#ffffff14"}`,
                        borderRadius: "5px",
                        opacity: isActive ? 1 : 0.55,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                    >
                      {preview?.url && (
                        <Image
                          data={preview}
                          className="h-full w-full object-contain rounded-sm"
                          sizes="120px"
                          width={240}
                        />
                      )}
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {showThumbsNavigation && images.length > thumbsPerView && (
              <>
                <button
                  type="button"
                  aria-label="Anterior"
                  className="viewer-thumb-prev absolute left-0 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-[#71717A] transition-colors hover:text-white"
                >
                  <CaretLeftIcon size={20} weight="regular" />
                </button>
                <button
                  type="button"
                  aria-label="Siguiente"
                  className="viewer-thumb-next absolute right-0 top-1/2 flex -translate-y-1/2 cursor-pointer items-center text-[#71717A] transition-colors hover:text-white"
                >
                  <CaretRightIcon size={20} weight="regular" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
