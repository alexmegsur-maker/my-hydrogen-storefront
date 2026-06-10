import { useState, useEffect } from "react";
import type { CSSProperties } from "react";

/**
 * CookieConsent — Popup de cookies para Hydrogen
 *
 * Uso en root.tsx o layout:
 *   import CookieConsent from "~/components/CookieConsent";
 *   <CookieConsent />
 *
 * Las preferencias se guardan en localStorage bajo la clave "cookie_consent".
 */

const STORAGE_KEY = "cookie_consent" as const;

/* ─── Tipos ──────────────────────────────────────────────────────────── */

interface CookiePrefs {
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

interface CategoryRowProps {
  label: string;
  desc: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (value: boolean) => void;
}

/* ─── Utilidad ───────────────────────────────────────────────────────── */

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}

/* ─── Componente principal ───────────────────────────────────────────── */

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState<boolean>(false);
  const [customizeOpen, setCustomizeOpen] = useState<boolean>(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function save(analytics: boolean, marketing: boolean): void {
    const consent: CookieConsent = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      window.dispatchEvent(new Event('cookie_consent_updated'));
    } catch {
      // localStorage no disponible (p. ej. SSR o modo privado bloqueado)
    }
    setVisible(false);
  }

  return (
    <div style={overlay}>
      <div
        style={banner}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-title"
      >
        {/* Header */}
        <div style={header}>
          <span style={iconBox} aria-hidden="true">
            🍪
          </span>
          <div>
            <p id="cookie-title" style={titleStyle}>
              Utilizamos cookies
            </p>
            <p style={subtitleStyle}>POLÍTICA DE PRIVACIDAD</p>
          </div>
        </div>

        {/* Body */}
        <p style={bodyStyle}>
          Usamos cookies propias y de terceros para mejorar tu experiencia,
          personalizar anuncios y analizar el tráfico. Puedes aceptar todas o
          configurar tus preferencias.{" "}
          <button
            style={linkBtn}
            onClick={() => setCustomizeOpen((v) => !v)}
            aria-expanded={customizeOpen}
          >
            Más información
          </button>
        </p>

        {/* Categorías */}
        {customizeOpen && (
          <div style={categoriesStyle}>
            <CategoryRow
              label="Necesarias"
              desc="Esenciales para el funcionamiento de la tienda: carrito, sesión y seguridad."
              checked={true}
              locked={true}
            />
            <CategoryRow
              label="Analíticas"
              desc="Nos ayudan a entender cómo navegas la tienda para mejorar la experiencia."
              checked={prefs.analytics}
              onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
            />
            <CategoryRow
              label="Marketing"
              desc="Permiten mostrarte anuncios relevantes según tus intereses."
              checked={prefs.marketing}
              onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
            />
          </div>
        )}

        {/* Acciones */}
        <div style={actionsStyle}>
          <button style={btnPrimary} onClick={() => save(true, true)}>
            Aceptar todas
          </button>

          {customizeOpen ? (
            <button
              style={btnPrimary}
              onClick={() => save(prefs.analytics, prefs.marketing)}
            >
              Guardar preferencias
            </button>
          ) : (
            <button
              style={btnSecondary}
              onClick={() => setCustomizeOpen(true)}
            >
              Personalizar
            </button>
          )}

          <button style={btnGhost} onClick={() => save(false, false)}>
            Solo necesarias
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-componente ─────────────────────────────────────────────────── */

function CategoryRow({
  label,
  desc,
  checked,
  locked = false,
  onChange,
}: CategoryRowProps) {
  return (
    <div style={categoryRow}>
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <button
          style={{
            ...toggle,
            background: checked ? "#1a1a1a" : "#ccc",
            cursor: locked ? "not-allowed" : "pointer",
            opacity: locked ? 0.5 : 1,
          }}
          onClick={() => !locked && onChange?.(! checked)}
          aria-checked={checked}
          aria-disabled={locked}
          role="switch"
          aria-label={label}
        >
          <span
            style={{
              ...toggleThumb,
              transform: checked ? "translateX(14px)" : "none",
            }}
          />
        </button>
      </div>
      <div>
        <p style={catName}>
          {label}
          {locked && <span style={badge}>Siempre activas</span>}
        </p>
        <p style={catDesc}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Estilos ────────────────────────────────────────────────────────── */

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: "24px",
  pointerEvents: "none",
};

const banner: CSSProperties = {
  width: "100%",
  maxWidth: 560,
  background: "#fff",
  border: "0.5px solid rgba(0,0,0,0.12)",
  borderRadius: 16,
  padding: "24px",
  fontFamily: "'DM Sans', system-ui, sans-serif",
  boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
  pointerEvents: "all",
};

const header: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 14,
};

const iconBox: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  background: "#1a1a1a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: 20,
  color: "#111",
  margin: 0,
  lineHeight: 1.2,
};

const subtitleStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "#999",
  margin: 0,
  marginTop: 2,
};

const bodyStyle: CSSProperties = {
  fontSize: 13,
  color: "#555",
  lineHeight: 1.6,
  marginBottom: 18,
};

const linkBtn: CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: "#111",
  fontSize: 13,
  textDecoration: "underline",
  textUnderlineOffset: 2,
  cursor: "pointer",
  font: "inherit",
};

const categoriesStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 18,
  borderTop: "0.5px solid rgba(0,0,0,0.08)",
  paddingTop: 16,
};

const categoryRow: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: 12,
  borderRadius: 8,
  border: "0.5px solid rgba(0,0,0,0.08)",
};

const toggle: CSSProperties = {
  width: 34,
  height: 20,
  borderRadius: 10,
  position: "relative",
  border: "none",
  padding: 0,
  display: "block",
  transition: "background 0.2s",
};

const toggleThumb: CSSProperties = {
  position: "absolute",
  width: 14,
  height: 14,
  borderRadius: "50%",
  background: "#fff",
  top: 3,
  left: 3,
  display: "block",
  transition: "transform 0.2s",
};

const catName: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#111",
  margin: 0,
  marginBottom: 2,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const catDesc: CSSProperties = {
  fontSize: 12,
  color: "#888",
  lineHeight: 1.5,
  margin: 0,
};

const badge: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  background: "#f3f3f3",
  color: "#888",
  padding: "1px 6px",
  borderRadius: 4,
  border: "0.5px solid rgba(0,0,0,0.08)",
};

const actionsStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

const btnPrimary: CSSProperties = {
  flex: 1,
  background: "#1a1a1a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "10px 16px",
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  minWidth: 120,
};

const btnSecondary: CSSProperties = {
  padding: "10px 16px",
  background: "transparent",
  color: "#555",
  border: "0.5px solid rgba(0,0,0,0.15)",
  borderRadius: 8,
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 400,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const btnGhost: CSSProperties = {
  padding: "10px 16px",
  background: "transparent",
  color: "#888",
  border: "0.5px solid rgba(0,0,0,0.08)",
  borderRadius: 8,
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 400,
  cursor: "pointer",
  whiteSpace: "nowrap",
};