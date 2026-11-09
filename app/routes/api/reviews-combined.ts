import { data, type LoaderFunctionArgs } from "react-router";
import type { JudgeMeReviewType, JudgemeProduct } from "~/types/judgeme";
import { constructURL } from "~/utils/misc";

const JUDGEME_API = "https://judge.me/api/v1";
/** Tope de productos por petición: cada uno cuesta 2 subpeticiones a Judge.me. */
const MAX_HANDLES = 20;
/** Reseñas que se piden por producto (máximo de la API de Judge.me). */
const REVIEWS_PER_PRODUCT = 100;

type JudgemeReview = Omit<JudgeMeReviewType, "curated"> & {
  // La API devuelve "ok" | "spam", no un booleano.
  curated?: string;
  product_title?: string;
  product_handle?: string;
};

/** Reseña ya limpia para el navegador (sin email/IP del autor). */
export interface CombinedReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  name: string;
  verified: boolean;
  createdAt: string;
  productTitle: string | null;
  pictures: string[];
}

export interface CombinedReviewsData {
  averageRating: number;
  totalReviews: number;
  currentPage: number;
  totalPage: number;
  reviews: CombinedReview[];
}

const EMPTY: CombinedReviewsData = {
  averageRating: 0,
  totalReviews: 0,
  currentPage: 1,
  totalPage: 0,
  reviews: [],
};

/**
 * Reseñas de Judge.me de varios productos juntas (main-product-d: todos los
 * acabados de "Material & finish" o todos los productos de un universo).
 * `GET /api/reviews-combined?handles=a,b,c&page=1&per_page=10`
 *
 * La nota media y el total se calculan sobre las reseñas descargadas (hasta
 * 100 por producto), así que en productos con más de 100 reseñas son una
 * aproximación sobre las más recientes.
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
  const { weaverse, env } = context;
  const { searchParams } = new URL(request.url);

  const handles = [
    ...new Set(
      (searchParams.get("handles") ?? "")
        .split(",")
        .map((handle) => handle.trim())
        .filter(Boolean),
    ),
  ].slice(0, MAX_HANDLES);
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const perPage = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("per_page") || "10", 10) || 10));

  // En el .env el token se llama JUDGEME_PRIVATE_TOKEN (el nombre del tema,
  // JUDGEME_PRIVATE_API_TOKEN, está comentado): se aceptan los dos, igual que
  // en setups-reviews.
  const apiToken =
    env.JUDGEME_PRIVATE_API_TOKEN || (env as unknown as Record<string, string | undefined>).JUDGEME_PRIVATE_TOKEN;
  const shopDomain = env.JUDGEME_SHOP_DOMAIN || env.PUBLIC_STORE_DOMAIN;
  if (!(handles.length && apiToken && shopDomain)) {
    return data(EMPTY);
  }
  const auth = { api_token: apiToken, shop_domain: shopDomain };

  const perProduct = await Promise.all(
    handles.map(async (handle) => {
      try {
        const productRes = await weaverse.fetchWithCache<{ product?: JudgemeProduct }>(
          constructURL(`${JUDGEME_API}/products/-1`, { ...auth, handle }),
        );
        const productId = productRes?.product?.id;
        if (!productId) return [];
        const reviewsRes = await weaverse.fetchWithCache<{ reviews?: JudgemeReview[] }>(
          constructURL(`${JUDGEME_API}/reviews`, {
            ...auth,
            product_id: productId,
            per_page: REVIEWS_PER_PRODUCT,
            page: 1,
          }),
        );
        return reviewsRes?.reviews ?? [];
      } catch (error) {
        console.error(`[reviews-combined] Error cargando reseñas de ${handle}:`, error);
        return [];
      }
    }),
  );

  const seen = new Set<string>();
  const reviews = perProduct
    .flat()
    .filter((review) => {
      if (!review.published || review.hidden || review.curated === "spam") return false;
      const key = String(review.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  return data(
    {
      averageRating,
      totalReviews,
      currentPage: page,
      totalPage: Math.ceil(totalReviews / perPage),
      reviews: reviews.slice((page - 1) * perPage, page * perPage).map((review) => ({
        id: String(review.id),
        rating: review.rating,
        title: review.title ?? "",
        body: review.body ?? "",
        name: review.reviewer?.name ?? "",
        verified: Boolean(review.verified),
        createdAt: review.created_at,
        productTitle: review.product_title ?? null,
        pictures: (review.pictures ?? [])
          .filter((picture) => !picture.hidden && picture.urls?.compact)
          .map((picture) => picture.urls.compact),
      })),
    } satisfies CombinedReviewsData,
  );
}
