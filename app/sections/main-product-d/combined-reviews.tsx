import { useEffect, useState } from "react";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import type { CombinedReview, CombinedReviewsData } from "~/routes/api/reviews-combined";
import { constructURL } from "~/utils/misc";

const PER_PAGE = 10;

export interface CombinedReviewsStyle {
  starColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
}

/**
 * Reseñas de varios productos juntas (ver `useReviewHandles` en store.ts y
 * `/api/reviews-combined`). Carga la primera página al cambiar los handles
 * — la cabecera la necesita para la nota media — y las siguientes bajo demanda.
 */
export function useCombinedReviews(handles: string[] | null) {
  const api = usePrefixPathWithLocale("api/reviews-combined");
  const handlesKey = handles?.join(",") ?? "";

  const [summary, setSummary] = useState<Pick<CombinedReviewsData, "averageRating" | "totalReviews"> | null>(null);
  const [reviews, setReviews] = useState<CombinedReview[]>([]);
  // La página va ligada al set de productos: con otro set (ej. otro universo)
  // se vuelve a la página 1 en el mismo render, sin pedir antes la página
  // vieja del set nuevo.
  const [pageState, setPageState] = useState({ key: handlesKey, page: 1 });
  const page = pageState.key === handlesKey ? pageState.page : 1;
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: solo se recarga al cambiar el set de productos o la página
  useEffect(() => {
    if (!handlesKey) {
      setSummary(null);
      setReviews([]);
      setTotalPage(0);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(constructURL(api, { handles: handlesKey, page, per_page: PER_PAGE }))
      .then((res) => (res.ok ? (res.json() as Promise<CombinedReviewsData>) : null))
      .then((result) => {
        if (cancelled || !result) return;
        setSummary({ averageRating: result.averageRating, totalReviews: result.totalReviews });
        setTotalPage(result.totalPage);
        setReviews((prev) => (page === 1 ? result.reviews : [...prev, ...result.reviews]));
      })
      .catch((error) => console.error("Error cargando reseñas combinadas:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [handlesKey, page]);

  return {
    summary,
    reviews,
    loading,
    hasMore: page < totalPage,
    loadMore: () => setPageState({ key: handlesKey, page: page + 1 }),
  };
}

function Stars({ rating, color, emptyColor }: { rating: number; color: string; emptyColor: string }) {
  const filled = Math.round(rating);
  return (
    <span role="img" aria-label={`${rating.toFixed(1)} / 5`} className="tracking-[0.1em]">
      <span style={{ color }}>{"★".repeat(filled)}</span>
      <span style={{ color: emptyColor }}>{"★".repeat(5 - filled)}</span>
    </span>
  );
}

/** Sustituye a `JudgemePreviewBadge` cuando las reseñas son combinadas. */
export function CombinedRatingBadge({
  summary,
  style,
}: {
  summary: Pick<CombinedReviewsData, "averageRating" | "totalReviews"> | null;
  style: CombinedReviewsStyle;
}) {
  if (!summary?.totalReviews) return null;
  return (
    <span className="flex items-center gap-2">
      <Stars rating={summary.averageRating} color={style.starColor} emptyColor={style.borderColor} />
      <span>
        {summary.averageRating.toFixed(1)} ({summary.totalReviews})
      </span>
    </span>
  );
}

export function CombinedReviewList({
  reviews,
  loading,
  hasMore,
  loadMore,
  style,
  loadMoreText,
  emptyText,
}: ReturnType<typeof useCombinedReviews> & {
  style: CombinedReviewsStyle;
  loadMoreText: string;
  emptyText: string;
}) {
  if (!reviews.length) {
    return (
      <p className="py-8 text-sm" style={{ color: style.mutedColor }}>
        {loading ? "…" : emptyText}
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="flex flex-col gap-2 py-5"
          style={{ borderBottom: `1px solid ${style.borderColor}`, color: style.textColor }}
        >
          <div className="flex items-center justify-between gap-4 text-sm">
            <Stars rating={review.rating} color={style.starColor} emptyColor={style.borderColor} />
            <time className="text-xs" style={{ color: style.mutedColor }} dateTime={review.createdAt}>
              {new Date(review.createdAt).toLocaleDateString()}
            </time>
          </div>
          <div className="text-xs" style={{ color: style.mutedColor }}>
            {review.name}
            {review.productTitle && <> · {review.productTitle}</>}
          </div>
          {review.title && <h4 className="font-medium text-sm">{review.title}</h4>}
          {review.body && <p className="text-sm leading-relaxed">{review.body}</p>}
          {review.pictures.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.pictures.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" className="h-16 w-16 rounded-sm object-cover" />
              ))}
            </div>
          )}
        </article>
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="my-6 cursor-pointer self-center px-4 py-2 text-xs uppercase tracking-[0.15em] disabled:opacity-50"
          style={{ border: `1px solid ${style.borderColor}`, color: style.textColor }}
        >
          {loading ? "…" : loadMoreText}
        </button>
      )}
    </div>
  );
}
