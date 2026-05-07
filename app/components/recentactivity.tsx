import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { forwardRef, useEffect, useRef, useState } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface JudgeMeReview {
  id: number;
  reviewer: { name: string; email?: string };
  rating: number;
  body: string;
  created_at: string;
  product_handle?: string;
  product_title?: string;
  verified: ActivityType;
}

type ActivityType = "verified-purchase" | "buyer";

interface ActivityItem {
  id: string;
  type: ActivityType;
  name: string;
  product: string;
  rating?: number;
  timeLabel: string;
  timestampMs: number;
  initials: string;
  avatarGradient: string;
}

// ─── Props del componente ──────────────────────────────────────────────────────

interface RecentActivityProps extends HydrogenComponentProps {
  // Judge.me
  judgeMeShopDomain?: string;
  judgeMeProductHandle?: string;
  maxItems?: number;
  showReviews?: boolean;
  headerLabel?: string;
  staticPurchasesJson?: string;

  // Colores
  cardBg?: string;
  cardBorder?: string;
  liveDotColor?: string;
  starColor?: string;
  nameColor?: string;
  textColor?: string;
  timeColor?: string;
  headerColor?: string;

  // Tipografía
  fontFamily?: string;
  rowFontSize?: string;
  headerFontSize?: string;
  headerLetterSpacing?: number;

  // Card / Layout
  cardBorderRadius?: number;
  cardMaxWidth?: number;
  cardPaddingSelect?: string;
  cardPaddingText?: string;

  // Avatar
  avatarSize?: number;
  avatarFontSize?: string;

  // Animación
  enableRevealAnimation?: boolean;
  revealTranslateY?: number;
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

const GRADIENTS = [
  "linear-gradient(135deg, #3C3489, #0C447C)",
  "linear-gradient(135deg, #533548, #4B1528)",
  "linear-gradient(135deg, #3B6D11, #173404)",
  "linear-gradient(135deg, #854F0B, #412402)",
  "linear-gradient(135deg, #185FA5, #042C53)",
  "linear-gradient(135deg, #993C1D, #4A1B0C)",
  "linear-gradient(135deg, #0F6E56, #04342C)",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function getGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function relativeTime(ms: number): string {
  const diff = (Date.now() - ms) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return `${Math.floor(diff / 86400)} d`;
}

function Stars({ rating, color }: { rating: number; color: string }) {
  const totalStars = 5;
  const filledStars = Math.max(0, Math.min(rating, totalStars));
  const emptyStars = totalStars - filledStars;
  return (
    <span
      style={{
        color,
        fontSize: "0.75rem",
        letterSpacing: "-1px",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {[...Array(filledStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: "10px", height: "10px" }}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          style={{ width: "10px", height: "10px" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      ))}
    </span>
  );
}

// ─── Fetch de Judge.me ─────────────────────────────────────────────────────────

async function fetchJudgeMeReviews(
  shopDomain: string,
  apiToken: string,
  productHandle?: string,
  limit = 8,
): Promise<JudgeMeReview[]> {
  try {
    const cleanDomain = shopDomain.replace(/^https?:\/\//, "");
    const base = "/api/reviews";
    const params = new URLSearchParams({
      shop_domain: cleanDomain,
      api_token: apiToken,
      per_page: String(limit),
    });
    if (productHandle) params.set("product_handle", productHandle);
    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) return [];
    const data = (await res.json()) as any;
    return (data.reviews ?? []) as JudgeMeReview[];
  } catch {
    return [];
  }
}

// ─── Componente principal ──────────────────────────────────────────────────────

const RecentActivity = forwardRef<HTMLDivElement, RecentActivityProps>(
  (
    {
      // Judge.me
      judgeMeShopDomain = "",
      judgeMeProductHandle = "",
      maxItems = 5,
      showReviews = true,
      headerLabel = "Actividad del Sistema (En Vivo)",
      staticPurchasesJson = "",

      // Colores
      cardBg = "rgba(255,255,255,0.02)",
      cardBorder = "rgba(255,255,255,0.05)",
      liveDotColor = "#22C55E",
      starColor = "#EF9F27",
      nameColor = "#FFFFFF",
      textColor = "#A1A1AA",
      timeColor = "#52525B",
      headerColor = "#A1A1AA",

      // Tipografía
      fontFamily = "Inter, sans-serif",
      rowFontSize = "0.8rem",
      headerFontSize = "0.7rem",
      headerLetterSpacing = 2,

      // Card / Layout
      cardBorderRadius = 12,
      cardMaxWidth = 600,
      cardPaddingSelect = "a",
      cardPaddingText = "1.5rem 2rem",

      // Avatar
      avatarSize = 30,
      avatarFontSize = "11px",

      // Animación
      enableRevealAnimation = true,
      revealTranslateY = 45,

      ...rest
    },
    ref,
  ) => {
    const [items, setItems] = useState<ActivityItem[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const staticPurchases: ActivityItem[] = (() => {
      try {
        const parsed: Array<{
          name: string;
          product: string;
          minutesAgo?: number;
        }> = JSON.parse(staticPurchasesJson || "[]") as any;
        return parsed.map((p, i) => ({
          id: `static-${i}`,
          type: "verified-purchase" as const,
          name: p.name,
          product: p.product,
          timeLabel: "",
          timestampMs: Date.now() - (p.minutesAgo ?? i * 3) * 60 * 1000,
          initials: getInitials(p.name),
          avatarGradient: getGradient(p.name),
        }));
      } catch {
        return [];
      }
    })();

    useEffect(() => {
      async function load() {
        let reviewItems: ActivityItem[] = [];
        if (showReviews && judgeMeShopDomain) {
          const reviews = await fetchJudgeMeReviews(
            judgeMeShopDomain,
            "rz_b952lpwYTResnfWw8fDQSYBk",
            judgeMeProductHandle || undefined,
            maxItems,
          );
          reviewItems = reviews.map((r) => ({
            id: `jm-${r.id}`,
            type: r.verified,
            name: r.reviewer.name,
            product: r.product_title ?? "PHOENIX Chair",
            rating: r.rating,
            timeLabel: "",
            timestampMs: new Date(r.created_at).getTime(),
            initials: getInitials(r.reviewer.name),
            avatarGradient: getGradient(r.reviewer.name),
          }));
        }
        const merged = [...staticPurchases, ...reviewItems]
          .sort((a, b) => b.timestampMs - a.timestampMs)
          .slice(0, maxItems);
        setItems(merged);
      }
      load();
    }, [judgeMeShopDomain, judgeMeProductHandle, showReviews, maxItems]);

    useEffect(() => {
      const t = setInterval(() => setItems((prev) => [...prev]), 30_000);
      return () => clearInterval(t);
    }, []);

    useEffect(() => {
      const el = sectionRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setIsVisible(true);
        },
        { threshold: 0.15 },
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);

    const resolvedPadding =
      cardPaddingSelect === "a"
        ? cardPaddingText
        : cardPaddingSelect === "x"
          ? `0 ${cardPaddingText}`
          : cardPaddingSelect === "y"
            ? `${cardPaddingText} 0`
            : cardPaddingSelect === "t"
              ? `${cardPaddingText} 0 0 0`
              : cardPaddingSelect === "b"
                ? `0 0 ${cardPaddingText} 0`
                : cardPaddingSelect === "l"
                  ? `0 0 0 ${cardPaddingText}`
                  : cardPaddingSelect === "r"
                    ? `0 ${cardPaddingText} 0 0`
                    : cardPaddingText;

    return (
      <div ref={ref} {...rest}>
        <div
          ref={sectionRef}
          style={{
            maxWidth: `${cardMaxWidth}px`,
            margin: "0 auto",
            opacity: !enableRevealAnimation || isVisible ? 1 : 0,
            transform:
              !enableRevealAnimation || isVisible
                ? "translateY(0)"
                : `translateY(${revealTranslateY}px)`,
            transition:
              "opacity 1.2s cubic-bezier(0.22,1,0.36,1), transform 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: `${cardBorderRadius}px`,
              padding: resolvedPadding,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1.5rem",
                fontFamily,
                fontSize: headerFontSize,
                color: headerColor,
                letterSpacing: `${headerLetterSpacing}px`,
                textTransform: "uppercase",
              }}
            >
              <LiveDot color={liveDotColor} />
              <span>{headerLabel}</span>
            </div>

            {/* Lista */}
            {items.length === 0 ? (
              <SkeletonList count={3} />
            ) : (
              items.map((item, i) => (
                <ActivityRow
                  key={item.id}
                  item={item}
                  index={i}
                  total={items.length}
                  fontFamily={fontFamily}
                  rowFontSize={rowFontSize}
                  nameColor={nameColor}
                  textColor={textColor}
                  timeColor={timeColor}
                  starColor={starColor}
                  avatarSize={avatarSize}
                  avatarFontSize={avatarFontSize}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  },
);

RecentActivity.displayName = "RecentActivity";
export default RecentActivity;

// ─── Sub-componentes ───────────────────────────────────────────────────────────

function LiveDot({ color }: { color: string }) {
  return (
    <>
      <span
        style={{
          display: "inline-block",
          width: "6px",
          height: "6px",
          background: color,
          borderRadius: "50%",
          boxShadow: `0 0 8px ${color}`,
          flexShrink: 0,
          animation: "ra-pulse 2s infinite",
        }}
      />
      <style>{`
        @keyframes ra-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
      `}</style>
    </>
  );
}

function ActivityRow({
  item,
  index,
  total,
  fontFamily,
  rowFontSize,
  nameColor,
  textColor,
  timeColor,
  starColor,
  avatarSize,
  avatarFontSize,
}: {
  item: ActivityItem;
  index: number;
  total: number;
  fontFamily: string;
  rowFontSize: string;
  nameColor: string;
  textColor: string;
  timeColor: string;
  starColor: string;
  avatarSize: number;
  avatarFontSize: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.6rem 0",
        borderBottom:
          index < total - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
        fontFamily,
        fontSize: rowFontSize,
        color: textColor,
        transition: "background 0.3s, padding-left 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(255,255,255,0.02)";
        (e.currentTarget as HTMLDivElement).style.paddingLeft = "8px";
        (e.currentTarget as HTMLDivElement).style.borderRadius = "4px";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "transparent";
        (e.currentTarget as HTMLDivElement).style.paddingLeft = "0";
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          borderRadius: "50%",
          background: item.avatarGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: avatarFontSize,
          fontWeight: 600,
          color: "#FFFFFF",
          flexShrink: 0,
          letterSpacing: "0.5px",
        }}
        aria-hidden="true"
      >
        {item.initials}
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ color: nameColor, fontWeight: 500 }}>
          {item.name}
        </strong>{" "}
        {item.type === "verified-purchase" ? (
          <>aseguró una {item.product}</>
        ) : (
          <>
            dejó una review{" "}
            {item.rating !== undefined && (
              <Stars rating={item.rating} color={starColor} />
            )}
          </>
        )}
      </div>

      {/* Tiempo */}
      <div
        style={{
          fontSize: "0.7rem",
          color: timeColor,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {relativeTime(item.timestampMs)}
      </div>
    </div>
  );
}

function SkeletonList({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.6rem 0",
            borderBottom:
              i < count - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: "10px",
                width: `${55 + i * 12}%`,
                background: "rgba(255,255,255,0.06)",
                borderRadius: "4px",
                animation: "ra-shimmer 1.5s ease-in-out infinite",
              }}
            />
          </div>
          <div
            style={{
              width: "32px",
              height: "10px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "4px",
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes ra-shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </>
  );
}

// ─── Schema Weaverse ───────────────────────────────────────────────────────────

export const schema: HydrogenComponentSchema = {
  type: "recent-activity",
  title: "Recent Activity – Live Feed",
  inspector: [
    {
      group: "Judge.me",
      inputs: [
        {
          type: "text",
          name: "judgeMeShopDomain",
          label: "Shop Domain",
          placeholder: "tu-tienda.myshopify.com",
          helpText: "Dominio de tu tienda para la API pública de Judge.me",
        },
        {
          type: "text",
          name: "judgeMeProductHandle",
          label: "Handle del Producto",
          placeholder: "monarch-remaster (vacío = todos)",
          helpText:
            "Filtra reseñas por producto. Déjalo vacío para mostrar todas.",
        },
        {
          type: "switch",
          name: "showReviews",
          label: "Mostrar reseñas de Judge.me",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Feed",
      inputs: [
        {
          type: "range",
          name: "maxItems",
          label: "Máximo de ítems",
          defaultValue: 5,
          configs: { min: 3, max: 10, step: 1 },
        },
        {
          type: "text",
          name: "headerLabel",
          label: "Texto del encabezado",
          defaultValue: "Actividad del Sistema (En Vivo)",
        },
        {
          type: "textarea",
          name: "staticPurchasesJson",
          label: "Compras estáticas (JSON)",
          helpText: `Array: [{"name":"Carlos M.","product":"Origin Edition","minutesAgo":2}]`,
          defaultValue: JSON.stringify(
            [
              { name: "Carlos M.", product: "Origin Edition", minutesAgo: 2 },
              { name: "Ana K.", product: "The Throne of Moria", minutesAgo: 5 },
              { name: "Javier L.", product: "Real Madrid Edition", minutesAgo: 12 },
            ],
            null,
            2,
          ),
        },
      ],
    },
    {
      group: "Colores",
      inputs: [
        {
          type: "color",
          name: "cardBg",
          label: "Fondo del card",
          defaultValue: "rgba(255,255,255,0.02)",
        },
        {
          type: "color",
          name: "cardBorder",
          label: "Color del borde",
          defaultValue: "rgba(255,255,255,0.05)",
        },
        {
          type: "color",
          name: "liveDotColor",
          label: "Color del punto live",
          defaultValue: "#22C55E",
        },
        {
          type: "color",
          name: "starColor",
          label: "Color de estrellas",
          defaultValue: "#EF9F27",
        },
        {
          type: "color",
          name: "nameColor",
          label: "Color nombre",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          name: "textColor",
          label: "Color texto secundario",
          defaultValue: "#A1A1AA",
        },
        {
          type: "color",
          name: "timeColor",
          label: "Color timestamp",
          defaultValue: "#52525B",
        },
        {
          type: "color",
          name: "headerColor",
          label: "Color encabezado",
          defaultValue: "#A1A1AA",
        },
      ],
    },
    {
      group: "Tipografía",
      inputs: [
        {
          type: "text",
          name: "fontFamily",
          label: "Font family",
          defaultValue: "Inter, sans-serif",
        },
        {
          type: "text",
          name: "rowFontSize",
          label: "Tamaño texto fila",
          defaultValue: "0.8rem",
        },
        {
          type: "text",
          name: "headerFontSize",
          label: "Tamaño texto encabezado",
          defaultValue: "0.7rem",
        },
        {
          type: "range",
          name: "headerLetterSpacing",
          label: "Letter spacing encabezado",
          defaultValue: 2,
          configs: { min: 0, max: 10, step: 1, unit: "px" },
        },
      ],
    },
    {
      group: "Card / Layout",
      inputs: [
        {
          type: "range",
          name: "cardBorderRadius",
          label: "Border radius",
          defaultValue: 12,
          configs: { min: 0, max: 40, step: 1, unit: "px" },
        },
        {
          type: "range",
          name: "cardMaxWidth",
          label: "Ancho máximo",
          defaultValue: 600,
          configs: { min: 300, max: 1200, step: 10, unit: "px" },
        },
        {
          type: "select",
          name: "cardPaddingSelect",
          label: "Tipo de padding",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "l", label: "Left" },
              { value: "r", label: "Right" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          name: "cardPaddingText",
          label: "Padding value",
          defaultValue: "1.5rem 2rem",
        },
      ],
    },
    {
      group: "Avatar",
      inputs: [
        {
          type: "range",
          name: "avatarSize",
          label: "Tamaño del avatar",
          defaultValue: 30,
          configs: { min: 20, max: 60, step: 2, unit: "px" },
        },
        {
          type: "text",
          name: "avatarFontSize",
          label: "Tamaño font iniciales",
          defaultValue: "11px",
        },
      ],
    },
    {
      group: "Animación",
      inputs: [
        {
          type: "switch",
          name: "enableRevealAnimation",
          label: "Animación reveal al scroll",
          defaultValue: true,
        },
        {
          type: "range",
          name: "revealTranslateY",
          label: "Distancia reveal (Y)",
          defaultValue: 45,
          configs: { min: 0, max: 100, step: 5, unit: "px" },
        },
      ],
    },
  ],
};