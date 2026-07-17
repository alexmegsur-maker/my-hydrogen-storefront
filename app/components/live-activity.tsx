import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useLanguage } from "~/hooks/useLanguage";
import { translations } from "~/utils/translations";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type LiveActivityType = "newsletter-signup" | "compra" | "reseña";

interface LiveActivityItem {
  id: string;
  type: LiveActivityType;
  name: string;
  product: string | null;
  rating: number | null;
  timestampMs: number;
  initials: string;
  avatarGradient: string;
}

interface RawItem {
  id: string;
  nombre: string;
  type: string;
  date: string;
  product: string | null;
  rating: number | null;
}

// ─── Props del componente ──────────────────────────────────────────────────────

interface LiveActivityProps extends HydrogenComponentProps {
  maxItems?: number;
  headerLabel?: string;

  // Colores
  cardBg?: string;
  cardBorder?: string;
  liveDotColor?: string;
  starColor?: string;
  nameColor?: string;
  textColor?: string;
  timeColor?: string;
  headerColor?: string;
  newsletterColor?: string;
  compraColor?: string;
  resenaColor?: string;

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

function maskName(name: string): string {
  const p = name.trim().split(/\s+/)
  if (p.length === 1) return name                                   // "Alex"
  if (p.length === 2) return `${p[0]} ${p[1][0]}.`                 // "Alex G."
  if (p.length === 3) return `${p[0]} ${p[1][0]}. ${p[2][0]}.`         // "Juan Francisco S."
  return `${p[0]} ${p[1][0]}. ${p[2][0]}.`                         // "Juan F. S."
}

function relativeTime(ms: number): string {
  const diff = (Date.now() - ms) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return `${Math.floor(diff / 86400)} d`;
}

async function fetchLiveActivity(limit: number): Promise<LiveActivityItem[]> {
  try {
    const res = await fetch(`/api/live-activity?limit=${limit}`);
    if (!res.ok) return [];
    const { items } = (await res.json()) as { items: RawItem[] };
    return items
      .filter((r) => r.nombre && r.type && r.date)
      .map((r) => ({
        id: r.id,
        type: r.type as LiveActivityType,
        name: r.nombre,
        product: r.product,
        rating: r.rating,
        timestampMs: new Date(r.date).getTime(),
        initials: getInitials(r.nombre),
        avatarGradient: getGradient(r.nombre),
      }))
      .sort((a, b) => b.timestampMs - a.timestampMs);
  } catch {
    return [];
  }
}

// ─── Componente principal ──────────────────────────────────────────────────────

const LiveActivity = forwardRef<HTMLDivElement, LiveActivityProps>(
  (
    {
      maxItems = 5,
      headerLabel = "Actividad Reciente (En Vivo)",

      cardBg = "rgba(255,255,255,0.02)",
      cardBorder = "rgba(255,255,255,0.05)",
      liveDotColor = "#22C55E",
      starColor = "#EF9F27",
      nameColor = "#FFFFFF",
      textColor = "#A1A1AA",
      timeColor = "#52525B",
      headerColor = "#A1A1AA",
      newsletterColor = "#818CF8",
      compraColor = "#34D399",
      resenaColor = "#FBBF24",

      fontFamily = "Inter, sans-serif",
      rowFontSize = "0.8rem",
      headerFontSize = "0.7rem",
      headerLetterSpacing = 2,

      cardBorderRadius = 12,
      cardMaxWidth = 600,
      cardPaddingSelect = "a",
      cardPaddingText = "1.5rem 2rem",

      avatarSize = 30,
      avatarFontSize = "11px",

      enableRevealAnimation = true,
      revealTranslateY = 45,

      ...rest
    },
    ref,
  ) => {
    const [items, setItems] = useState<LiveActivityItem[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      fetchLiveActivity(maxItems).then(setItems);
    }, [maxItems]);

    useEffect(() => {
      const t = setInterval(() => {
        fetchLiveActivity(maxItems).then(setItems);
      }, 300_000);
      return () => clearInterval(t);
    }, [maxItems]);

    useEffect(() => {
      const el = sectionRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
        { threshold: 0.15 },
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);

    const resolvedPadding =
      cardPaddingSelect === "a" ? cardPaddingText
      : cardPaddingSelect === "x" ? `0 ${cardPaddingText}`
      : cardPaddingSelect === "y" ? `${cardPaddingText} 0`
      : cardPaddingSelect === "t" ? `${cardPaddingText} 0 0 0`
      : cardPaddingSelect === "b" ? `0 0 ${cardPaddingText} 0`
      : cardPaddingSelect === "l" ? `0 0 0 ${cardPaddingText}`
      : cardPaddingSelect === "r" ? `0 ${cardPaddingText} 0 0`
      : cardPaddingText;

    const typeColors: Record<LiveActivityType, string> = {
      "newsletter-signup": newsletterColor!,
      compra: compraColor!,
      reseña: resenaColor!,
    };

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
              <LiveDot color={liveDotColor!} />
              <span>{headerLabel}</span>
            </div>

            {/* Lista */}
            {items.length === 0 ? (
              <SkeletonList count={3} />
            ) : (
              items.slice(0, maxItems).map((item, i) => (
                <ActivityRow
                  key={item.id}
                  item={item}
                  index={i}
                  total={Math.min(items.length, maxItems)}
                  fontFamily={fontFamily!}
                  rowFontSize={rowFontSize!}
                  nameColor={nameColor!}
                  textColor={textColor!}
                  timeColor={timeColor!}
                  starColor={starColor!}
                  avatarSize={avatarSize!}
                  avatarFontSize={avatarFontSize!}
                  typeColor={typeColors[item.type] ?? textColor!}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  },
);

LiveActivity.displayName = "LiveActivity";
export default LiveActivity;

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
          animation: "la-pulse 2s infinite",
        }}
      />
      <style>{`
        @keyframes la-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
      `}</style>
    </>
  );
}

function TypeIcon({ type, color }: { type: LiveActivityType; color: string }) {
  if (type === "newsletter-signup") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} style={{ width: "11px", height: "11px", flexShrink: 0 }}>
        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
      </svg>
    );
  }
  if (type === "compra") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} style={{ width: "11px", height: "11px", flexShrink: 0 }}>
        <path fillRule="evenodd" d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.14A1.75 1.75 0 0 0 3.84 18.75h12.32a1.75 1.75 0 0 0 1.742-1.992l-.826-9.14A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z" clipRule="evenodd" />
      </svg>
    );
  }
  // reseña
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} style={{ width: "11px", height: "11px", flexShrink: 0 }}>
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>
  );
}

function Stars({ rating, color }: { rating: number; color: string }) {
  const filled = Math.max(0, Math.min(Math.round(rating), 5));
  return (
    <span style={{ color, fontSize: "0.75rem", letterSpacing: "-1px", display: "inline-flex", alignItems: "center" }}>
      {Array.from({ length: filled }).map((_, i) => (
        <svg key={`f${i}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "10px", height: "10px" }}>
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
        </svg>
      ))}
      {Array.from({ length: 5 - filled }).map((_, i) => (
        <svg key={`e${i}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "10px", height: "10px" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ))}
    </span>
  );
}

function ActivityRow({
  item, index, total,
  fontFamily, rowFontSize, nameColor, textColor, timeColor, starColor,
  avatarSize, avatarFontSize, typeColor,
}: {
  item: LiveActivityItem;
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
  typeColor: string;
}) {

  const lang= useLanguage()
  const t= translations[lang] ?? translations["ES"]
  const [name,setName]=useState(item.name)

  useEffect(() => {
    if (item.name.includes("@")) {
      const [local, domain] = item.name.split("@")
      setName(local.substring(0, 4) + "***@" + domain)
    } else {
      setName(maskName(item.name))
    }
  }, [item])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.6rem 0",
        borderBottom: index < total - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
        fontFamily,
        fontSize: rowFontSize,
        color: textColor,
        transition: "background 0.3s, padding-left 0.3s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "rgba(255,255,255,0.02)";
        el.style.paddingLeft = "8px";
        el.style.borderRadius = "4px";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "transparent";
        el.style.paddingLeft = "0";
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
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
        <TypeIcon type={item.type} color={typeColor} />
        <strong style={{ color: nameColor, fontWeight: 500 }}>{name}</strong>
        {item.type === "newsletter-signup" && (
          <span>{t.suscribe_to_newsletter}</span>
        )}
        {item.type === "compra" && (
          <span>
            {t.bought}{item.product ? <> <em style={{ color: nameColor, fontStyle: "normal" }}>{item.product}</em></> : ""}
          </span>
        )}
        {item.type === "reseña" && (
          <span>
            {t.leave_a_review}{" "}
            {item.rating != null && <Stars rating={item.rating} color={starColor} />}
            {item.product && <> de <em style={{ color: nameColor, fontStyle: "normal" }}>{item.product}</em></>}
          </span>
        )}
      </div>

      {/* Tiempo */}
      <div style={{ fontSize: "0.7rem", color: timeColor, whiteSpace: "nowrap", flexShrink: 0 }}>
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
            borderBottom: i < count - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}
        >
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: "10px", width: `${55 + i * 12}%`, background: "rgba(255,255,255,0.06)", borderRadius: "4px", animation: "la-shimmer 1.5s ease-in-out infinite" }} />
          </div>
          <div style={{ width: "32px", height: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
        </div>
      ))}
      <style>{`
        @keyframes la-shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </>
  );
}

// ─── Schema Weaverse ───────────────────────────────────────────────────────────

export const schema: HydrogenComponentSchema = {
  type: "live-activity",
  title: "Live Activity – Metaobject",
  settings: [
    {
      group: "Feed",
      inputs: [
        {
          type: "range",
          name: "maxItems",
          label: "Máximo de ítems",
          defaultValue: 5,
          configs: { min: 3, max: 20, step: 1 },
        },
        {
          type: "text",
          name: "headerLabel",
          label: "Texto del encabezado",
          defaultValue: "Actividad Reciente (En Vivo)",
        },
      ],
    },
    {
      group: "Colores",
      inputs: [
        { type: "color", name: "cardBg", label: "Fondo del card", defaultValue: "rgba(255,255,255,0.02)" },
        { type: "color", name: "cardBorder", label: "Color del borde", defaultValue: "rgba(255,255,255,0.05)" },
        { type: "color", name: "liveDotColor", label: "Punto live", defaultValue: "#22C55E" },
        { type: "color", name: "nameColor", label: "Color nombre", defaultValue: "#FFFFFF" },
        { type: "color", name: "textColor", label: "Color texto", defaultValue: "#A1A1AA" },
        { type: "color", name: "timeColor", label: "Color timestamp", defaultValue: "#52525B" },
        { type: "color", name: "headerColor", label: "Color encabezado", defaultValue: "#A1A1AA" },
        { type: "color", name: "starColor", label: "Color estrellas", defaultValue: "#EF9F27" },
        { type: "color", name: "newsletterColor", label: "Icono newsletter", defaultValue: "#818CF8" },
        { type: "color", name: "compraColor", label: "Icono compra", defaultValue: "#34D399" },
        { type: "color", name: "resenaColor", label: "Icono reseña", defaultValue: "#FBBF24" },
      ],
    },
    {
      group: "Tipografía",
      inputs: [
        { type: "text", name: "fontFamily", label: "Font family", defaultValue: "Inter, sans-serif" },
        { type: "text", name: "rowFontSize", label: "Tamaño texto fila", defaultValue: "0.8rem" },
        { type: "text", name: "headerFontSize", label: "Tamaño encabezado", defaultValue: "0.7rem" },
        { type: "range", name: "headerLetterSpacing", label: "Letter spacing encabezado", defaultValue: 2, configs: { min: 0, max: 10, step: 1, unit: "px" } },
      ],
    },
    {
      group: "Card / Layout",
      inputs: [
        { type: "range", name: "cardBorderRadius", label: "Border radius", defaultValue: 12, configs: { min: 0, max: 40, step: 1, unit: "px" } },
        { type: "range", name: "cardMaxWidth", label: "Ancho máximo", defaultValue: 600, configs: { min: 300, max: 1200, step: 10, unit: "px" } },
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
        { type: "text", name: "cardPaddingText", label: "Padding value", defaultValue: "1.5rem 2rem" },
      ],
    },
    {
      group: "Avatar",
      inputs: [
        { type: "range", name: "avatarSize", label: "Tamaño del avatar", defaultValue: 30, configs: { min: 20, max: 60, step: 2, unit: "px" } },
        { type: "text", name: "avatarFontSize", label: "Tamaño font iniciales", defaultValue: "11px" },
      ],
    },
    {
      group: "Animación",
      inputs: [
        { type: "switch", name: "enableRevealAnimation", label: "Animación reveal al scroll", defaultValue: true },
        { type: "range", name: "revealTranslateY", label: "Distancia reveal (Y)", defaultValue: 45, configs: { min: 0, max: 100, step: 5, unit: "px" } },
      ],
    },
  ],
};
