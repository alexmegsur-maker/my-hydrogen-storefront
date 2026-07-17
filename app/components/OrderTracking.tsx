import { useLanguage } from '~/hooks/useLanguage';
import { translations, interpolate } from '~/utils/translations';
import type { NormalizedTracking, TrackingStatus } from '~/lib/tracking/types';

// ─── Estilos inyectables desde la sección Weaverse ───────────────────────────

export interface TrackingStyles {
  // Tarjeta contenedora
  cardBg: string;
  cardBorderColor: string;
  // Label de cabecera ("SEGUIMIENTO")
  headerLabelColor: string;
  headerLabelSize: number;         // rem
  headerLabelLetterSpacing: string;
  // Link al carrier ("Ver en DHL →")
  linkColor: string;
  // Barra de progreso
  progressActiveColor: string;
  progressFailedColor: string;
  progressInactiveColor: string;
  stepLabelSize: number;           // rem
  stepLabelActiveColor: string;
  stepLabelInactiveColor: string;
  // Estado principal
  statusColor: string;
  statusFailedColor: string;
  statusSize: number;              // rem
  statusWeight: string;
  statusFamily: string;
  // ETA
  etaColor: string;
  etaSize: number;                 // rem
  // Label historial ("HISTORIAL")
  historyLabelColor: string;
  historyLabelLetterSpacing: string;
  // Eventos
  eventLatestColor: string;
  eventOldColor: string;
  eventFontSize: number;           // rem
  eventLocationColor: string;
  eventTimestampColor: string;
}

const DEFAULTS: TrackingStyles = {
  cardBg: '#0a0a0a',
  cardBorderColor: '#1f1f1f',
  headerLabelColor: '#52525B',
  headerLabelSize: 0.75,
  headerLabelLetterSpacing: '3px',
  linkColor: '#FF6A3D',
  progressActiveColor: '#FF6A3D',
  progressFailedColor: '#ef4444',
  progressInactiveColor: '#1f1f1f',
  stepLabelSize: 0.68,
  stepLabelActiveColor: '#FFFFFF',
  stepLabelInactiveColor: '#A1A1AA',
  statusColor: '#FFFFFF',
  statusFailedColor: '#ef4444',
  statusSize: 1.05,
  statusWeight: '600',
  statusFamily: "'Outfit', sans-serif",
  etaColor: '#A1A1AA',
  etaSize: 0.8,
  historyLabelColor: '#52525B',
  historyLabelLetterSpacing: '3px',
  eventLatestColor: '#FFFFFF',
  eventOldColor: '#A1A1AA',
  eventFontSize: 0.85,
  eventLocationColor: '#52525B',
  eventTimestampColor: '#52525B',
};

// ─── Constantes internas (no ajustables) ─────────────────────────────────────

const STEP_KEYS: TrackingStatus[] = ['pre_transit', 'in_transit', 'out_for_delivery', 'delivered'];

const STEP_INDEX: Record<TrackingStatus, number> = {
  pre_transit: 0, in_transit: 1, out_for_delivery: 2, delivered: 3,
  failed: 2, exception: 2, unknown: -1,
};

const LOCALE_MAP: Record<string, string> = {
  ES: 'es-ES', EN: 'en-GB', DE: 'de-DE', FR: 'fr-FR', IT: 'it-IT',
};

function fmtTs(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleString(locale, {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function OrderTracking({
  tracking,
  styles: stylesProp,
}: {
  tracking: NormalizedTracking | null;
  styles?: Partial<TrackingStyles>;
}) {
  const lang   = useLanguage();
  const t      = translations[lang] ?? translations.ES;
  const locale = LOCALE_MAP[lang] ?? 'es-ES';
  const s      = { ...DEFAULTS, ...stylesProp };

  const steps = STEP_KEYS.map((key) => ({
    key,
    label: t[`tracking_step_${key}` as keyof typeof t] as string,
  }));

  if (!tracking) return null;

  const activeStep = STEP_INDEX[tracking.currentStatus] ?? -1;
  const isFailed   = tracking.currentStatus === 'failed' || tracking.currentStatus === 'exception';
  const showSteps  = activeStep >= 0;

  const statusLabel =
    (t[`tracking_status_${tracking.currentStatus}` as keyof typeof t] as string) ??
    tracking.statusLabel;

  const BORDER_LINE = s.progressInactiveColor;

  return (
    <div
      className="fade-up-trigger"
      style={{
        background: s.cardBg,
        border: `1px solid ${s.cardBorderColor}`,
        borderRadius: '4px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
      }}
    >
      {/* ── Cabecera ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{
            fontSize: `${s.headerLabelSize}rem`,
            color: s.headerLabelColor,
            textTransform: 'uppercase',
            letterSpacing: s.headerLabelLetterSpacing,
            fontFamily: "'Outfit', sans-serif",
            marginBottom: '0.4rem',
          }}>
            {t.tracking_header}
          </div>
          <div style={{ fontSize: '0.85rem', color: s.etaColor }}>
            {tracking.carrier}&nbsp;
            <span style={{ color: s.statusColor, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' }}>
              {tracking.trackingNumber}
            </span>
          </div>
        </div>
        {tracking.rawCarrierUrl && !tracking.error && (
          <a
            href={tracking.rawCarrierUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.75rem',
              color: s.linkColor,
              textDecoration: 'none',
              border: `1px solid ${s.linkColor}`,
              padding: '4px 14px',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {interpolate(t.tracking_viewOn, { carrier: tracking.carrier })}
          </a>
        )}
      </div>

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {tracking.error ? (
        <p style={{ color: s.etaColor, fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
          {tracking.error}
        </p>
      ) : (
        <>
          {/* ── Barra de progreso ──────────────────────────────────────────── */}
          {showSteps && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {steps.map((step, i) => {
                const done     = activeStep >= i;
                const isActive = activeStep === i;
                const isBad    = isFailed && isActive;
                const dotColor = isBad ? s.progressFailedColor : done ? s.progressActiveColor : 'transparent';
                const lineL    = i > 0 ? (activeStep >= i ? s.progressActiveColor : BORDER_LINE) : undefined;
                const lineR    = i < steps.length - 1 ? (activeStep > i ? s.progressActiveColor : BORDER_LINE) : undefined;

                return (
                  <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                    {lineL && <div style={{ position: 'absolute', top: '7px', left: 0, right: '50%', height: '2px', background: lineL }} />}
                    {lineR && <div style={{ position: 'absolute', top: '7px', left: '50%', right: 0, height: '2px', background: lineR }} />}
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: dotColor,
                      border: done ? 'none' : `2px solid ${BORDER_LINE}`,
                      zIndex: 1, flexShrink: 0,
                      boxShadow: isActive && !isBad ? `0 0 0 4px ${s.progressActiveColor}33` : undefined,
                    }} />
                    <div style={{
                      fontSize: `${s.stepLabelSize}rem`,
                      textAlign: 'center',
                      color: done ? s.stepLabelActiveColor : s.stepLabelInactiveColor,
                      fontFamily: "'Outfit', sans-serif",
                      lineHeight: 1.3,
                      paddingInline: '4px',
                    }}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Estado principal + ETA ─────────────────────────────────────── */}
          <div>
            <div style={{
              fontSize: `${s.statusSize}rem`,
              fontWeight: s.statusWeight,
              fontFamily: s.statusFamily,
              color: isFailed ? s.statusFailedColor : s.statusColor,
            }}>
              {statusLabel}
            </div>
            {tracking.estimatedDelivery && tracking.currentStatus !== 'delivered' && (
              <div style={{ fontSize: `${s.etaSize}rem`, color: s.etaColor, marginTop: '0.3rem' }}>
                {t.tracking_eta} {fmtTs(tracking.estimatedDelivery, locale)}
              </div>
            )}
          </div>

          {/* ── Timeline de eventos ────────────────────────────────────────── */}
          {tracking.events.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                fontSize: `${s.headerLabelSize}rem`,
                color: s.historyLabelColor,
                textTransform: 'uppercase',
                letterSpacing: s.historyLabelLetterSpacing,
                fontFamily: "'Outfit', sans-serif",
              }}>
                {t.tracking_history}
              </div>
              {tracking.events.map((ev, i) => (
                <div
                  key={`${ev.timestamp}-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: i < tracking.events.length - 1 ? `1px solid ${s.cardBorderColor}` : 'none',
                    alignItems: 'start',
                  }}
                >
                  <div>
                    <div style={{ fontSize: `${s.eventFontSize}rem`, color: i === 0 ? s.eventLatestColor : s.eventOldColor, lineHeight: 1.4 }}>
                      {ev.description}
                    </div>
                    {ev.location && (
                      <div style={{ fontSize: '0.75rem', color: s.eventLocationColor, marginTop: '0.2rem' }}>
                        {ev.location}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: s.eventTimestampColor, whiteSpace: 'nowrap', textAlign: 'right', paddingTop: '2px' }}>
                    {fmtTs(ev.timestamp, locale)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function OrderTrackingLoading({ styles: stylesProp }: { styles?: Partial<TrackingStyles> }) {
  const lang = useLanguage();
  const t    = translations[lang] ?? translations.ES;
  const s    = { ...DEFAULTS, ...stylesProp };

  return (
    <div style={{ background: s.cardBg, border: `1px solid ${s.cardBorderColor}`, borderRadius: '4px', padding: '2rem', backdropFilter: 'blur(10px)' }}>
      <div style={{ fontSize: `${s.headerLabelSize}rem`, color: s.headerLabelColor, textTransform: 'uppercase', letterSpacing: s.headerLabelLetterSpacing, fontFamily: "'Outfit', sans-serif", marginBottom: '0.75rem' }}>
        {t.tracking_loading_label}
      </div>
      <div style={{ color: s.etaColor, fontSize: `${s.eventFontSize}rem` }}>
        {t.tracking_loading_text}
      </div>
    </div>
  );
}
