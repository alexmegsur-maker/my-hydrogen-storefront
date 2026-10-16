import {
  type ComponentLoaderArgs,
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
} from "@weaverse/hydrogen";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { JudgeMeReviewType } from "~/types/judgeme";
import { cn } from "~/utils/cn";
import { constructURL } from "~/utils/misc";
import {
  getTextStyle,
  MONO_FONT,
  omitTextStyleProps,
  TEXT_SIZE_CLASS,
  textStyleInputs,
} from "~/utils/text-style";
import {
  omitSectionSpacing,
  type SectionSpacingData,
  SectionSpacingStyle,
  sectionSpacingInputs,
} from "~/utils/section-spacing";

const JUDGEME_API = "https://judge.me/api/v1";
// Las reseñas "de tienda" de Judge.me cuelgan de este producto ficticio.
const SHOP_REVIEWS_HANDLE = "judgeme-shop-reviews";
// Se piden más de las necesarias porque después se filtran por nota y estado.
const REVIEWS_FETCH_SIZE = 100;

interface SetupsReviewsData {
  tag: string;
  heading: string;
  includeShopReviews: boolean;
  reviewsCount: number;
  minRating: string;
  countLabel: string;
  linkText: string;
  linkUrl: string;
  showLoadMore:boolean;
  readMoreText: string;
  readLessText: string;
  slidesPerView: number;
  imagesLayout: "equal" | "free";
  imagesAlign: "start" | "center" | "end";
  imagesGap: number;
  loop: boolean;
  autoplay: boolean;
  autoplayDelay: number;
  reviewsPerView: number;
  reviewsLoop: boolean;
  reviewsAutoplay: boolean;
  reviewsAutoplayDelay: number;
  backgroundColor: string;
  accentColor: string;
  cardColor: string;
  borderColor: string;
}

interface SetupsReview {
  id: string;
  rating: number;
  body: string;
  name: string;
  productTitle: string | null;
}

interface SetupsReviewsLoaderData {
  /** Nota media ya formateada en el idioma de la página, p. ej. "4,8" */
  rating: string | null;
  ratingValue: number;
  /** Número de opiniones ya formateado, p. ej. "1.696" */
  count: string | null;
  reviews: SetupsReview[];
}

interface SetupsReviewsProps
  extends HydrogenComponentProps<SetupsReviewsLoaderData | null>,
    SetupsReviewsData {
  ref?: React.Ref<HTMLElement>;
}

type JudgemeReview = Omit<JudgeMeReviewType, "curated"> & {
  // La API devuelve "ok" | "spam", no un booleano.
  curated?: string;
  product_title?: string;
  product_handle?: string;
};

/**
 * "Jessica navarro diana" → "Jessica N.". Se hace en el servidor para que el
 * nombre completo no llegue al navegador.
 */
function formatReviewerName(fullName?: string): string {
  const [first = "", second = ""] = (fullName ?? "").trim().split(/\s+/);
  if (!first) {
    return "";
  }
  const firstName =
    first.charAt(0).toLocaleUpperCase() + first.slice(1).toLocaleLowerCase();
  return second
    ? `${firstName} ${second.charAt(0).toLocaleUpperCase()}.`
    : firstName;
}

export const loader = async ({
  weaverse,
  data,
}: ComponentLoaderArgs<SetupsReviewsData>): Promise<SetupsReviewsLoaderData | null> => {
  const env = weaverse.env as unknown as Record<string, string | undefined>;
  const apiToken = env.JUDGEME_PRIVATE_API_TOKEN || env.JUDGEME_PRIVATE_TOKEN;
  const shopDomain = env.JUDGEME_SHOP_DOMAIN || env.PUBLIC_STORE_DOMAIN;
  if (!(apiToken && shopDomain)) {
    console.warn(
      "[setups-reviews] Falta JUDGEME_PRIVATE_API_TOKEN: no se cargan reseñas.",
    );
    return null;
  }

  const auth = { api_token: apiToken, shop_domain: shopDomain };
  const includeShopReviews = data?.includeShopReviews ?? false;
  const minRating = Number(data?.minRating) || 1;
  const reviewsCount = Math.max(1, Math.min(data?.reviewsCount ?? 9, 20));

  try {
    // Nota y contador: siempre los generales de la tienda (todas las reseñas).
    const [ratingRes, countRes, reviewsRes] = await Promise.all([
      weaverse.fetchWithCache<{ all_reviews_rating?: string }>(
        constructURL(`${JUDGEME_API}/widgets/all_reviews_rating`, auth),
      ),
      weaverse.fetchWithCache<{ all_reviews_count?: string }>(
        constructURL(`${JUDGEME_API}/widgets/all_reviews_count`, auth),
      ),
      // Reseñas más recientes de todos los productos.
      weaverse.fetchWithCache<{ reviews?: JudgemeReview[] }>(
        constructURL(`${JUDGEME_API}/reviews`, {
          ...auth,
          per_page: REVIEWS_FETCH_SIZE,
          page: 1,
          ...(minRating === 5 ? { rating: 5 } : {}),
        }),
      ),
    ]);
    const ratingValue = Number(ratingRes?.all_reviews_rating);
    const total = Number(countRes?.all_reviews_count);

    // Solo se envían al navegador los campos que se pintan: la respuesta de
    // Judge.me incluye email e IP del autor, y las fotos no se usan aquí.
    const seen = new Set<string>();
    const reviews: SetupsReview[] = (reviewsRes?.reviews ?? [])
      .filter((review) => {
        if (
          !review.published ||
          review.hidden ||
          review.curated === "spam" ||
          (!includeShopReviews &&
            review.product_handle === SHOP_REVIEWS_HANDLE) ||
          review.rating < minRating ||
          !review.body?.trim()
        ) {
          return false;
        }
        // Judge.me a veces devuelve la misma reseña enviada dos veces.
        const key = `${review.reviewer?.name}|${review.body.trim()}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .slice(0, reviewsCount)
      .map((review) => ({
        id: String(review.id),
        rating: review.rating,
        body: review.body.trim(),
        name: formatReviewerName(review.reviewer?.name),
        productTitle:
          review.product_handle === SHOP_REVIEWS_HANDLE
            ? null
            : (review.product_title ?? null),
      }));

    const language = weaverse.storefront.i18n.language.toLowerCase();
    return {
      rating: ratingValue
        ? new Intl.NumberFormat(language, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(ratingValue)
        : null,
      ratingValue: ratingValue || 0,
      count: total ? new Intl.NumberFormat(language).format(total) : null,
      reviews,
    };
  } catch (error) {
    console.error("[setups-reviews] Error cargando reseñas de Judge.me:", error);
    return null;
  }
};

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span
      className="text-[11px] tracking-[0.2em]"
      role="img"
      aria-label={`${rating} / 5`}
    >
      <span className="text-(--sr-accent)">{"★".repeat(filled)}</span>
      <span className="text-(--sr-border)">{"★".repeat(5 - filled)}</span>
    </span>
  );
}

interface ReviewCardProps {
  review: SetupsReview;
  bodyStyle: CSSProperties;
  authorStyle: CSSProperties;
  readMoreStyle: CSSProperties;
  showLoadMore:boolean;
  readMoreText: string;
  readLessText: string;
}

function ReviewCard({
  review,
  bodyStyle,
  authorStyle,
  readMoreStyle,
  showLoadMore,
  readMoreText,
  readLessText,
}: ReviewCardProps) {
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  // "Ver más" solo aparece si el texto no cabe en las líneas recortadas.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el || expanded) {
      return;
    }
    const check = () => setIsClamped(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded]);

  return (
    <article className="flex h-full flex-col gap-3 border border-(--sr-border) bg-(--sr-card) p-5">
      <Stars rating={review.rating} />
      <p
        ref={bodyRef}
        // Desplegado: altura máxima con scroll propio para seguir leyendo sin
        // estirar el carrusel. data-lenis-prevent deja que la rueda del ratón
        // haga scroll dentro del texto (la página usa Lenis).
        data-lenis-prevent={expanded ? "" : undefined}
        className={cn(
          TEXT_SIZE_CLASS,
          expanded ? "max-h-64 overflow-y-auto pr-2" : "line-clamp-5",
        )}
        style={bodyStyle}
      >
        {review.body}
      </p>
      {showLoadMore && (isClamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={cn(TEXT_SIZE_CLASS, "self-start underline")}
          style={readMoreStyle}
          aria-expanded={expanded}
        >
          {expanded ? readLessText : readMoreText}
        </button>
      )}
      <span className={cn(TEXT_SIZE_CLASS, "mt-auto")} style={authorStyle}>
        {[review.name, review.productTitle].filter(Boolean).join(" · ")}
      </span>
    </article>
  );
}

function SetupsReviews(props: SetupsReviewsProps) {
  const {
    tag,
    heading,
    includeShopReviews,
    reviewsCount,
    minRating,
    countLabel,
    linkText,
    linkUrl,
    showLoadMore,
    readMoreText,
    readLessText,
    slidesPerView,
    imagesLayout,
    imagesAlign,
    imagesGap,
    loop,
    autoplay,
    autoplayDelay,
    reviewsPerView,
    reviewsLoop,
    reviewsAutoplay,
    reviewsAutoplayDelay,
    backgroundColor,
    accentColor,
    cardColor,
    borderColor,
    loaderData,
    children = [],
    ref,
    ...rest
  } = props;

  const textStyle = (prefix: string) =>
    getTextStyle(props as unknown as Record<string, unknown>, prefix);
  const slides = Array.isArray(children) ? children : [children];
  const reviews = loaderData?.reviews ?? [];
  // Sin datos de Judge.me, {count} desaparece sin dejar un doble espacio.
  const withCount = (text: string) =>
    text
      .replaceAll("{count}", loaderData?.count ?? "")
      .replace(/\s{2,}/g, " ")
      .trim();

  const style = {
    "--sr-bg": backgroundColor,
    "--sr-accent": accentColor,
    "--sr-card": cardColor,
    "--sr-border": borderColor,
  } as CSSProperties;

  return (
    <section
      ref={ref}
      {...omitSectionSpacing(omitTextStyleProps(rest, [
        "tag",
        "heading",
        "rating",
        "countLabel",
        "reviewBody",
        "reviewAuthor",
        "readMore",
        "link",
      ]))}
      style={style}
      className="bg-(--sr-bg) px-4 py-12 md:px-10 md:py-16 lg:px-12"
    >
      <SectionSpacingStyle
        selector={`[data-wv-id="${(rest as Record<string, unknown>)["data-wv-id"]}"]`}
        data={props as SectionSpacingData}
      />
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4">
          {tag && (
            <span className={TEXT_SIZE_CLASS} style={textStyle("tag")}>
              {tag}
            </span>
          )}
          {heading && (
            <h2
              className={cn(TEXT_SIZE_CLASS, "leading-none")}
              style={textStyle("heading")}
            >
              {heading}
            </h2>
          )}
        </div>
        {loaderData?.rating && (
          <div className="flex items-end gap-3">
            <span
              className={cn(TEXT_SIZE_CLASS, "leading-none")}
              style={textStyle("rating")}
            >
              {loaderData.rating}
            </span>
            <span
              className={cn(TEXT_SIZE_CLASS, "flex items-center gap-2 pb-1")}
              style={textStyle("countLabel")}
            >
              <Stars rating={loaderData.ratingValue} />
              {loaderData.count && countLabel && (
                <span>· {withCount(countLabel)}</span>
              )}
            </span>
          </div>
        )}
      </div>

      {slides.length > 0 && (
        <Swiper
          // Cambiar de modo exige reconstruir Swiper, no solo actualizarlo.
          key={imagesLayout}
          loop={loop}
          observer
          observeParents
          spaceBetween={imagesGap ?? 14}
          {...(imagesLayout === "free"
            ? { slidesPerView: "auto" as const }
            : {
                slidesPerView: 1.2,
                breakpoints: {
                  640: { slidesPerView: 2.2 },
                  1024: { slidesPerView },
                },
              })}
          autoplay={
            autoplay
              ? { delay: autoplayDelay * 1000, disableOnInteraction: false }
              : false
          }
          modules={[Autoplay]}
          className={cn(
            "w-full",
            // Modo libre: cada imagen fija su ancho con --sw-m / --sw-d.
            imagesLayout === "free" &&
              "[&_.sr-slide]:w-(--sw-m) md:[&_.sr-slide]:w-(--sw-d)",
            imagesAlign === "center" && "[&_.swiper-wrapper]:items-center",
            imagesAlign === "end" && "[&_.swiper-wrapper]:items-end",
          )}
        >
          {slides.map((child, idx) => (
            <SwiperSlide
              // biome-ignore lint/suspicious/noArrayIndexKey: los hijos de Weaverse no exponen un id aquí
              key={idx}
              // h-auto: cada imagen conserva su altura (proporciones distintas).
              // w-auto en modo libre: el ancho lo decide cada imagen.
              className={cn("h-auto!", imagesLayout === "free" && "w-auto!")}
            >
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {reviews.length > 0 && (
        <Swiper
          loop={reviewsLoop && reviews.length > reviewsPerView}
          observer
          observeParents
          spaceBetween={16}
          slidesPerView={1.1}
          breakpoints={{
            768: { slidesPerView: Math.min(2, reviewsPerView) },
            1024: { slidesPerView: reviewsPerView },
          }}
          autoplay={
            reviewsAutoplay
              ? {
                  delay: reviewsAutoplayDelay * 1000,
                  disableOnInteraction: false,
                }
              : false
          }
          modules={[Autoplay]}
          className="mt-10 w-full"
        >
          {reviews.map((review) => (
            // h-auto: todas las tarjetas igualan la altura de la más alta
            <SwiperSlide key={review.id} className="h-auto!">
              <ReviewCard
                review={review}
                bodyStyle={textStyle("reviewBody")}
                authorStyle={textStyle("reviewAuthor")}
                readMoreStyle={textStyle("readMore")}
                showLoadMore={showLoadMore ?? true}
                readMoreText={readMoreText || "Ver más"}
                readLessText={readLessText || "Ver menos"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {linkText && linkUrl && (
        <a
          href={linkUrl}
          className={cn(
            TEXT_SIZE_CLASS,
            "mt-8 inline-block border-current border-b pb-1",
          )}
          style={textStyle("link")}
        >
          {withCount(linkText)}
        </a>
      )}
    </section>
  );
}

export default SetupsReviews;

export const schema = createSchema({
  type: "setups-reviews",
  title: "Setups reales + reseñas",
  childTypes: ["setups-reviews--slide"],
  settings: [
    {
      group: "Cabecera",
      inputs: [
        {
          type: "text",
          name: "tag",
          label: "Etiqueta",
          defaultValue: "#MIMONARCH",
        },
        {
          type: "text",
          name: "heading",
          label: "Título",
          defaultValue: "Monarch en setups reales.",
        },
        {
          type: "text",
          name: "countLabel",
          label: "Texto del contador",
          defaultValue: "{count} opiniones verificadas",
          helpText: "{count} se sustituye por el número de opiniones.",
        },
      ],
    },
    {
      group: "Slider de imágenes",
      inputs: [
        {
          type: "select",
          name: "imagesLayout",
          label: "Tamaño de las imágenes",
          defaultValue: "equal",
          configs: {
            options: [
              { value: "equal", label: "Mismo ancho (N visibles)" },
              { value: "free", label: "Libre (cada imagen su ancho)" },
            ],
          },
          helpText:
            "En modo libre, el ancho de cada imagen se ajusta en la propia imagen.",
        },
        {
          type: "range",
          name: "slidesPerView",
          label: "Imágenes visibles (escritorio)",
          defaultValue: 4,
          configs: { min: 2, max: 6, step: 1 },
          condition: (data: SetupsReviewsData) => data.imagesLayout !== "free",
        },
        {
          type: "toggle-group",
          name: "imagesAlign",
          label: "Alineación vertical",
          defaultValue: "start",
          configs: {
            options: [
              { value: "start", label: "Arriba", icon: "align-start-horizontal" },
              { value: "center", label: "Centro", icon: "align-center-horizontal" },
              { value: "end", label: "Abajo", icon: "align-end-horizontal" },
            ],
          },
        },
        {
          type: "range",
          name: "imagesGap",
          label: "Separación entre imágenes",
          defaultValue: 14,
          configs: { min: 0, max: 60, step: 1, unit: "px" },
        },
        {
          type: "switch",
          name: "loop",
          label: "Bucle",
          defaultValue: false,
        },
        {
          type: "switch",
          name: "autoplay",
          label: "Avance automático",
          defaultValue: false,
        },
        {
          type: "range",
          name: "autoplayDelay",
          label: "Tiempo entre imágenes",
          defaultValue: 4,
          configs: { min: 1, max: 20, step: 1, unit: "s" },
          condition: (data: SetupsReviewsData) => data.autoplay,
        },
      ],
    },
    {
      group: "Reseñas (Judge.me)",
      inputs: [
        {
          type: "switch",
          name: "includeShopReviews",
          label: "Incluir reseñas de la tienda",
          defaultValue: false,
          helpText:
            "Desactivado: solo reseñas de productos, con el nombre del producto. La nota es siempre la general de la tienda.",
        },
        {
          type: "range",
          name: "reviewsCount",
          label: "Número de reseñas",
          defaultValue: 9,
          configs: { min: 1, max: 20, step: 1 },
        },
        {
          type: "range",
          name: "reviewsPerView",
          label: "Reseñas visibles (escritorio)",
          defaultValue: 3,
          configs: { min: 1, max: 5, step: 1 },
        },
        {
          type: "switch",
          name: "reviewsLoop",
          label: "Bucle",
          defaultValue: false,
        },
        {
          type: "switch",
          name: "reviewsAutoplay",
          label: "Avance automático",
          defaultValue: false,
        },
        {
          type: "range",
          name: "reviewsAutoplayDelay",
          label: "Tiempo entre reseñas",
          defaultValue: 5,
          configs: { min: 1, max: 20, step: 1, unit: "s" },
          condition: (data: SetupsReviewsData) => data.reviewsAutoplay,
        },
        {
          type: "select",
          name: "minRating",
          label: "Nota mínima",
          defaultValue: "5",
          configs: {
            options: [
              { value: "5", label: "Solo 5 estrellas" },
              { value: "4", label: "4 estrellas o más" },
              { value: "3", label: "3 estrellas o más" },
              { value: "1", label: "Todas" },
            ],
          },
        },
        {
          type: "text",
          name: "linkText",
          label: "Texto del enlace",
          defaultValue: "Ver las {count} opiniones →",
          helpText: "{count} se sustituye por el número de opiniones.",
        },
        {
          type: "url",
          name: "linkUrl",
          label: "Enlace",
          defaultValue: "/",
        },
        {
          type:'switch',
          label:'habilitar ver mas ',
          name:'showLoadMore',
          defaultValue:true,
        },
        {
          type: "text",
          name: "readMoreText",
          label: "Texto de \"ver más\"",
          defaultValue: "Ver más",
        },
        {
          type: "text",
          name: "readLessText",
          label: "Texto de \"ver menos\"",
          defaultValue: "Ver menos",
        },
      ],
    },
    {
      group: "Espaciado de la sección",
      inputs: sectionSpacingInputs,
    },
    {
      group: "Colores",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Fondo",
          defaultValue: "#050505",
        },
        {
          type: "color",
          name: "accentColor",
          label: "Estrellas",
          defaultValue: "#c9a24b",
        },
        {
          type: "color",
          name: "cardColor",
          label: "Fondo de reseña",
          defaultValue: "#0e0f12",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Bordes",
          defaultValue: "#24262b",
        },
      ],
    },
    {
      group: "Texto: etiqueta",
      inputs: textStyleInputs("tag", { Color: "#8a8f98", MobileSize: "10px", DesktopSize: "10px", Weight: "400", Transform: "uppercase", LetterSpacing: 2, Family: MONO_FONT }),
    },
    {
      group: "Texto: título",
      inputs: textStyleInputs("heading", { Color: "#ffffff", MobileSize: "30px", DesktopSize: "36px", Weight: "700", Transform: "uppercase", LineHeight: 1 }),
    },
    {
      group: "Texto: nota",
      inputs: textStyleInputs("rating", { Color: "#ffffff", MobileSize: "30px", DesktopSize: "36px", Weight: "700", LineHeight: 1 }),
    },
    {
      group: "Texto: contador de opiniones",
      inputs: textStyleInputs("countLabel", { Color: "#8a8f98", MobileSize: "10px", DesktopSize: "10px", Weight: "400", Transform: "uppercase", LetterSpacing: 2, Family: MONO_FONT }),
    },
    {
      group: "Texto: reseña",
      inputs: textStyleInputs("reviewBody", { Color: "#ffffff", MobileSize: "14px", DesktopSize: "14px", Weight: "400", LineHeight: 1.4 }),
    },
    {
      group: "Texto: autor de la reseña",
      inputs: textStyleInputs("reviewAuthor", { Color: "#8a8f98", MobileSize: "10px", DesktopSize: "10px", Weight: "400", Transform: "uppercase", LetterSpacing: 2, Family: MONO_FONT }),
    },
    {
      group: "Texto: ver más",
      inputs: textStyleInputs("readMore", { Color: "#c9a24b", MobileSize: "11px", DesktopSize: "11px", Weight: "700", Transform: "uppercase", LetterSpacing: 1.5 }),
    },
    {
      group: "Texto: enlace",
      inputs: textStyleInputs("link", { Color: "#ffffff", MobileSize: "11px", DesktopSize: "11px", Weight: "700", Transform: "uppercase", LetterSpacing: 1.5 }),
    },
  ],
  presets: {
    children: [
      { type: "setups-reviews--slide", image: IMAGES_PLACEHOLDERS.product_1 },
      { type: "setups-reviews--slide", image: IMAGES_PLACEHOLDERS.product_2 },
      { type: "setups-reviews--slide", image: IMAGES_PLACEHOLDERS.product_3 },
      { type: "setups-reviews--slide", image: IMAGES_PLACEHOLDERS.product_4 },
    ],
  },
});
