import { Skeleton } from "~/components/skeleton";
import { useIsMobile } from "~/hooks/use-is-mobile";

/**
 * Esqueletos de precarga para las piezas de "main-product-j".
 * Cada export representa la versión "cargando" de una sección/componente
 * de la página de producto (ver index.tsx → rama de loading cuando
 * `productStore` todavía no está listo).
 *
 * Convención: los bloques usan `bg-white/10` (en vez del gris claro por
 * defecto de <Skeleton/>) porque esta plantilla es de tema oscuro.
 */

const block = "animate-pulse rounded bg-white/10";

// ─── product-media.tsx ──────────────────────────────────────────────────────
// Réplica de: imagen principal a pantalla completa (65vw en desktop) + tira
// de miniaturas pegada abajo (flechas + ~5 thumbnails cuadrados de 60px).
export function ProductMediaSkeleton() {
  return (
    <div className="flex-none w-full md:w-[65vw] md:h-[100vh] relative">
      {/* Imagen principal */}
      <Skeleton className={`${block} w-full h-[50vh] md:h-full`} />
      {/* Tira de miniaturas */}
      <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-3 min-h-[70px] xl:min-h-[110px] px-4">
        <Skeleton className={`${block} h-[15px] w-[8px] shrink-0`} />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className={`${block} h-[60px] w-[60px] shrink-0`} />
        ))}
        <Skeleton className={`${block} h-[15px] w-[8px] shrink-0`} />
      </div>
    </div>
  );
}

// ─── head.tsx ──────────────────────────────────────────────────────────────
// Réplica de: review-stars (badge de Judge.me) + <h1>título</h1> + línea de precio.
export function HeadSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Estrellas + nº de reseñas */}
      <Skeleton className={`${block} h-[18px] w-[110px]`} />
      {/* Título */}
      <Skeleton className={`${block} h-[2.2rem] w-[70%] max-w-[320px]`} />
      {/* "Desde 499 €" */}
      <Skeleton className={`${block} h-[1.1rem] w-[140px]`} />
    </div>
  );
}

// ─── filter-option-size.tsx ────────────────────────────────────────────────
// Réplica de: header ("01. TALLA" + link "Guía de tallas") + filas de opción
// (título + descripción + dot selector circular).
export function FilterOptionSizeSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-[0.5rem]">
      {/* Header: "01. TALLA" ……… "Guía de tallas" */}
      <div className="flex justify-between items-baseline mb-[1.5rem]">
        <Skeleton className={`${block} h-[0.9rem] w-[80px]`} />
        <Skeleton className={`${block} h-[0.8rem] w-[90px]`} />
      </div>
      {/* Filas de opciones (título + descripción + dot selector) */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center"
          style={{ padding: "1rem 0", borderBottom: "1px solid #ffffff08" }}
        >
          <div className="flex flex-col gap-[6px]">
            <Skeleton className={`${block} h-[1rem] w-[140px]`} />
            <Skeleton className={`${block} h-[0.75rem] w-[220px]`} />
          </div>
          <Skeleton className={`${block} h-[8px] w-[8px] rounded-full`} />
        </div>
      ))}
    </div>
  );
}

// ─── variant-selector-secret.tsx ───────────────────────────────────────────
// Réplica de: header ("02. UNIVERSO & MODELO", sin link a la derecha) + una
// única fila (título + descripción + dot selector).
export function VariantSelectorSecretSkeleton() {
  return (
    <div className="flex flex-col gap-[0.5rem]">
      {/* Header: "02. UNIVERSO & MODELO" */}
      <div className="flex justify-between items-baseline mb-[1.5rem]">
        <Skeleton className={`${block} h-[0.9rem] w-[150px]`} />
      </div>
      {/* Fila: modelo seleccionado */}
      <div
        className="flex justify-between items-center"
        style={{ padding: "1rem 0", borderBottom: "1px solid #ffffff08" }}
      >
        <div className="flex flex-col gap-[4px]">
          <Skeleton className={`${block} h-[1rem] w-[220px]`} />
          <Skeleton className={`${block} h-[0.75rem] w-[180px]`} />
        </div>
        <Skeleton className={`${block} h-[8px] w-[8px] rounded-full`} />
      </div>
    </div>
  );
}

// ─── crossell.tsx (+ su hijo CrossellProduct) ──────────────────────────────
// Réplica de: header "03. ECOSISTEMA PHOENIX" + tarjeta ("acc-container") con
// filas de producto (imagen 44x44 + título + precio/"Saber más" + botón "+").
export function CrossellSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-[0.5rem]">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-[1.5rem]">
        <Skeleton className={`${block} h-[0.9rem] w-[180px]`} />
      </div>
      {/* Tarjeta */}
      <div
        className="flex flex-col"
        style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "1.5rem",
        }}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between"
            style={{
              padding: "1rem 0",
              borderBottom:
                i !== rows - 1 ? "1px solid rgba(255,255,255,0.08)" : "unset",
            }}
          >
            <div className="flex items-center gap-[1.2rem]">
              <Skeleton className={`${block} h-[44px] w-[44px] shrink-0`} />
              <div className="flex flex-col gap-[6px]">
                <Skeleton className={`${block} h-[0.9rem] w-[180px]`} />
                <div className="flex items-center gap-[12px]">
                  <Skeleton className={`${block} h-[0.7rem] w-[50px]`} />
                  <Skeleton className={`${block} h-[0.7rem] w-[60px]`} />
                </div>
              </div>
            </div>
            <Skeleton className={`${block} h-[28px] w-[28px] rounded-full shrink-0`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── buy-buttons.tsx ────────────────────────────────────────────────────────
// Réplica de: botón "Añadir al setup" + botón "Comprar" + fila de Klarna
// (badge + texto) + fila de mini-concierge (Envío DDP · Prueba · Pago seguro).
export function BuyButtonsSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      style={{ borderTop: "1px solid #ffffff20", paddingBlock: "2rem" }}
    >
      <Skeleton className={`${block} h-[52px] w-full`} />
      <Skeleton className={`${block} h-[52px] w-full`} />
      <div className="flex gap-2 px-2 justify-center items-center w-full">
        <Skeleton className={`${block} h-[20px] w-[50px]`} />
        <Skeleton className={`${block} h-[0.85rem] w-[260px]`} />
      </div>
      <div className="flex justify-center gap-[2rem]">
        <Skeleton className={`${block} h-[0.65rem] w-[70px]`} />
        <Skeleton className={`${block} h-[0.65rem] w-[90px]`} />
        <Skeleton className={`${block} h-[0.65rem] w-[80px]`} />
      </div>
    </div>
  );
}

// ─── página completa ────────────────────────────────────────────────────────
// Junta todas las piezas de arriba en el mismo layout de dos columnas que usa
// main-product-j/index.tsx. Reutilizable tanto dentro de la sección (cuando
// el store de producto aún no está listo) como en un overlay a nivel de
// navegación (mientras el loader de la ruta de producto todavía no resuelve).
export function ProductPageSkeleton({ color = "#050505" }: { color?: string }) {
  const isMobile = useIsMobile(600);
  return (
    <div
      className="lg:flex grid grid-cols-1 md:h-[100vh] relative"
      style={{ background: color }}
    >
      <ProductMediaSkeleton />
      <div className="relative w-full overflow-y-auto" style={{ background: color }}>
        <div
          style={{
            padding: !isMobile ? "3rem 4rem 0 4rem" : "1.5rem 1.5rem 0 1.5rem",
          }}
        >
          <div className="flex flex-col gap-8">
            <HeadSkeleton />
            <FilterOptionSizeSkeleton rows={2} />
            <VariantSelectorSecretSkeleton />
            <CrossellSkeleton rows={3} />
            <BuyButtonsSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
