import { useState } from "react";
import { useFetcher } from "react-router";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useLanguage } from "~/hooks/useLanguage";
import { translations } from "~/utils/translations";
import { OrderTracking, type TrackingStyles } from "~/components/OrderTracking";
import type { NormalizedTracking } from "~/lib/tracking/types";

// ─── Opciones reutilizables ───────────────────────────────────────────────────

const WEIGHT_OPTIONS = [
  { label: "300 – Light",     value: "300" },
  { label: "400 – Regular",   value: "400" },
  { label: "500 – Medium",    value: "500" },
  { label: "600 – SemiBold",  value: "600" },
  { label: "700 – Bold",      value: "700" },
  { label: "800 – ExtraBold", value: "800" },
];

const FAMILY_OPTIONS = [
  { label: "Outfit",     value: "'Outfit', sans-serif" },
  { label: "Sans-serif", value: "sans-serif" },
  { label: "Serif",      value: "serif" },
  { label: "Monospace",  value: "monospace" },
  { label: "Georgia",    value: "'Georgia', serif" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface OrderTrackingSectionProps extends HydrogenComponentProps {
  // Sección
  bgColor: string;
  // Título
  titleColor: string;
  titleSize: number;
  titleWeight: string;
  titleFamily: string;
  titleLetterSpacing: string;
  // Tabs
  tabActiveColor: string;
  tabInactiveColor: string;
  tabFontSize: number;
  // Inputs
  inputBorderColor: string;
  inputTextColor: string;
  // Botón de búsqueda
  btnBg: string;
  btnColor: string;
  btnFontSize: number;
  btnWeight: string;
  btnRadius: number;
  // ── Tarjeta de seguimiento (→ TrackingStyles) ──────────────────────────────
  cardBg: string;
  cardBorderColor: string;
  headerLabelColor: string;
  headerLabelSize: number;
  headerLabelLetterSpacing: string;
  linkColor: string;
  progressActiveColor: string;
  progressFailedColor: string;
  progressInactiveColor: string;
  stepLabelSize: number;
  stepLabelActiveColor: string;
  stepLabelInactiveColor: string;
  statusColor: string;
  statusFailedColor: string;
  statusSize: number;
  statusWeight: string;
  statusFamily: string;
  etaColor: string;
  etaSize: number;
  historyLabelColor: string;
  historyLabelLetterSpacing: string;
  eventLatestColor: string;
  eventOldColor: string;
  eventFontSize: number;
  eventLocationColor: string;
  eventTimestampColor: string;
  clName?:string;
}

type FetcherData = NormalizedTracking | { error: string } | null;
type Tab = "order" | "tracking";

// ─── Componente ───────────────────────────────────────────────────────────────

function OrderTrackingSection(props: OrderTrackingSectionProps) {
  const {
    clName,
    bgColor            = "#0a0a0a",
    titleColor         = "#FFFFFF",
    titleSize          = 2,
    titleWeight        = "700",
    titleFamily        = "'Outfit', sans-serif",
    titleLetterSpacing = "0px",
    tabActiveColor     = "#FF6A3D",
    tabInactiveColor   = "#A1A1AA",
    tabFontSize        = 0.9,
    inputBorderColor   = "#2a2a2a",
    inputTextColor     = "#FFFFFF",
    btnBg              = "#FF6A3D",
    btnColor           = "#FFFFFF",
    btnFontSize        = 0.9,
    btnWeight          = "700",
    btnRadius          = 6,
    cardBg                  = "#0a0a0a",
    cardBorderColor         = "#1f1f1f",
    headerLabelColor        = "#52525B",
    headerLabelSize         = 0.75,
    headerLabelLetterSpacing = "3px",
    linkColor               = "#FF6A3D",
    progressActiveColor     = "#FF6A3D",
    progressFailedColor     = "#ef4444",
    progressInactiveColor   = "#1f1f1f",
    stepLabelSize           = 0.68,
    stepLabelActiveColor    = "#FFFFFF",
    stepLabelInactiveColor  = "#A1A1AA",
    statusColor             = "#FFFFFF",
    statusFailedColor       = "#ef4444",
    statusSize              = 1.05,
    statusWeight            = "600",
    statusFamily            = "'Outfit', sans-serif",
    etaColor                = "#A1A1AA",
    etaSize                 = 0.8,
    historyLabelColor       = "#52525B",
    historyLabelLetterSpacing = "3px",
    eventLatestColor        = "#FFFFFF",
    eventOldColor           = "#A1A1AA",
    eventFontSize           = 0.85,
    eventLocationColor      = "#52525B",
    eventTimestampColor     = "#52525B",
  } = props;

  const lang = useLanguage();
  const t    = translations[lang] ?? translations.ES;

  const [activeTab, setActiveTab]     = useState<Tab>("order");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail]             = useState("");
  const [trackingNum, setTrackingNum] = useState("");

  const fetcher   = useFetcher<FetcherData>();
  const isLoading = fetcher.state !== "idle";
  const data      = fetcher.data as FetcherData;
  const apiError  = data && "error" in data ? (data as { error: string }).error : null;
  const tracking  = data && !("error" in data) ? (data as NormalizedTracking) : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeTab === "order") {
      if (!orderNumber.trim() || !email.trim()) return;
      fetcher.load(`/api/tracking?order=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`);
    } else {
      if (!trackingNum.trim()) return;
      fetcher.load(`/api/tracking?trackingNumber=${encodeURIComponent(trackingNum.trim())}`);
    }
  }

  const trackingStyles: Partial<TrackingStyles> = {
    cardBg, cardBorderColor,
    headerLabelColor, headerLabelSize, headerLabelLetterSpacing,
    linkColor,
    progressActiveColor, progressFailedColor, progressInactiveColor,
    stepLabelSize, stepLabelActiveColor, stepLabelInactiveColor,
    statusColor, statusFailedColor, statusSize, statusWeight, statusFamily,
    etaColor, etaSize,
    historyLabelColor, historyLabelLetterSpacing,
    eventLatestColor, eventOldColor, eventFontSize, eventLocationColor, eventTimestampColor,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${inputBorderColor}`,
    borderRadius: "6px",
    padding: "0.8rem 1rem",
    color: inputTextColor,
    fontSize: "0.9rem",
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "order",    label: t.tracking_tab_order },
    { key: "tracking", label: t.tracking_tab_tracking },
  ];

  return (
    <section
      style={{
        background: bgColor,
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem",
      }}
      className={clName}
    >
      <div style={{ width: "100%", maxWidth: "580px", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Título */}
        <h2 style={{
          textAlign: "center",
          fontFamily: titleFamily,
          fontSize: `${titleSize}rem`,
          fontWeight: titleWeight,
          color: titleColor,
          letterSpacing: titleLetterSpacing,
          margin: 0,
        }}>
          {t.tracking_section_title}
        </h2>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${inputBorderColor}` }}>
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  borderBottom: active ? `2px solid ${tabActiveColor}` : "2px solid transparent",
                  marginBottom: "-1px",
                  padding: "0.75rem 1rem",
                  color: active ? tabActiveColor : tabInactiveColor,
                  fontFamily: titleFamily,
                  fontSize: `${tabFontSize}rem`,
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {activeTab === "order" ? (
            <>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder={t.tracking_order_placeholder}
                required
                style={inputStyle}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.tracking_email_placeholder}
                required
                style={inputStyle}
              />
            </>
          ) : (
            <input
              type="text"
              value={trackingNum}
              onChange={(e) => setTrackingNum(e.target.value)}
              placeholder={t.tracking_number_placeholder}
              required
              style={inputStyle}
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? "rgba(255,255,255,0.1)" : btnBg,
              border: "none",
              borderRadius: `${btnRadius}px`,
              padding: "0.85rem 2rem",
              color: isLoading ? tabInactiveColor : btnColor,
              fontSize: `${btnFontSize}rem`,
              fontFamily: titleFamily,
              fontWeight: btnWeight,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginTop: "0.25rem",
            }}
          >
            {isLoading ? t.tracking_searching : t.tracking_btn}
          </button>
        </form>

        {/* Error */}
        {apiError && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "6px",
            padding: "1rem 1.25rem",
            color: "#fca5a5",
            fontSize: "0.85rem",
            fontFamily: titleFamily,
          }}>
            {apiError}
          </div>
        )}

        {/* Resultado */}
        {tracking && <OrderTracking tracking={tracking} styles={trackingStyles} />}
      </div>
    </section>
  );
}

export default OrderTrackingSection;

// ─── Schema ───────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "order-tracking",
  title: "Order Tracking",
  settings: [
    {
      group: "class",
      inputs: [
        { type: "text", name: "clName", label: "ClassName" },
      ],
    },
    {
      group: "Fondo",
      inputs: [
        { type: "color", name: "bgColor", label: "Color de fondo", defaultValue: "#0a0a0a" },
      ],
    },
    {
      group: "Título",
      inputs: [
        { type: "color",  name: "titleColor",         label: "Color",             defaultValue: "#FFFFFF" },
        { type: "range",  name: "titleSize",           label: "Tamaño (rem)",      defaultValue: 2,    configs: { min: 0.8, max: 4,   step: 0.1, unit: "rem" } },
        { type: "select", name: "titleWeight",         label: "Peso",              defaultValue: "700", configs: { options: WEIGHT_OPTIONS } },
        { type: "select", name: "titleFamily",         label: "Fuente",            defaultValue: "'Outfit', sans-serif", configs: { options: FAMILY_OPTIONS } },
        { type: "text",   name: "titleLetterSpacing",  label: "Letter-spacing",    defaultValue: "0px" },
      ],
    },
    {
      group: "Tabs y formulario",
      inputs: [
        { type: "color", name: "tabActiveColor",   label: "Tab activo – color",   defaultValue: "#FF6A3D" },
        { type: "color", name: "tabInactiveColor", label: "Tab inactivo – color", defaultValue: "#A1A1AA" },
        { type: "range", name: "tabFontSize",      label: "Tab – tamaño (rem)",   defaultValue: 0.9, configs: { min: 0.7, max: 1.3, step: 0.05, unit: "rem" } },
        { type: "color", name: "inputBorderColor", label: "Input – borde",        defaultValue: "#2a2a2a" },
        { type: "color", name: "inputTextColor",   label: "Input – texto",        defaultValue: "#FFFFFF" },
      ],
    },
    {
      group: "Botón de búsqueda",
      inputs: [
        { type: "color",  name: "btnBg",       label: "Fondo",          defaultValue: "#FF6A3D" },
        { type: "color",  name: "btnColor",    label: "Texto",          defaultValue: "#FFFFFF" },
        { type: "range",  name: "btnFontSize", label: "Tamaño (rem)",   defaultValue: 0.9, configs: { min: 0.7, max: 1.3, step: 0.05, unit: "rem" } },
        { type: "select", name: "btnWeight",   label: "Peso",           defaultValue: "700", configs: { options: WEIGHT_OPTIONS } },
        { type: "range",  name: "btnRadius",   label: "Border-radius",  defaultValue: 6,   configs: { min: 0, max: 24, step: 1, unit: "px" } },
      ],
    },
    {
      group: "Tarjeta de seguimiento",
      inputs: [
        { type: "color", name: "cardBg",              label: "Fondo de la tarjeta",  defaultValue: "#0a0a0a" },
        { type: "color", name: "cardBorderColor",     label: "Borde de la tarjeta",  defaultValue: "#1f1f1f" },
        { type: "color", name: "headerLabelColor",    label: "Label cabecera",        defaultValue: "#52525B" },
        { type: "range", name: "headerLabelSize",     label: "Label cabecera – tamaño (rem)", defaultValue: 0.75, configs: { min: 0.55, max: 1.1, step: 0.05, unit: "rem" } },
        { type: "text",  name: "headerLabelLetterSpacing", label: "Label cabecera – letter-spacing", defaultValue: "3px" },
        { type: "color", name: "linkColor",           label: "Enlace al carrier",     defaultValue: "#FF6A3D" },
      ],
    },
    {
      group: "Barra de progreso",
      inputs: [
        { type: "color", name: "progressActiveColor",   label: "Color completado",  defaultValue: "#FF6A3D" },
        { type: "color", name: "progressFailedColor",   label: "Color fallido",     defaultValue: "#ef4444" },
        { type: "color", name: "progressInactiveColor", label: "Color inactivo",    defaultValue: "#1f1f1f" },
        { type: "range", name: "stepLabelSize",         label: "Etiquetas – tamaño (rem)", defaultValue: 0.68, configs: { min: 0.55, max: 0.9, step: 0.01, unit: "rem" } },
        { type: "color", name: "stepLabelActiveColor",  label: "Etiquetas – completado", defaultValue: "#FFFFFF" },
        { type: "color", name: "stepLabelInactiveColor",label: "Etiquetas – pendiente",  defaultValue: "#A1A1AA" },
      ],
    },
    {
      group: "Estado y ETA",
      inputs: [
        { type: "color",  name: "statusColor",       label: "Estado – color",        defaultValue: "#FFFFFF" },
        { type: "color",  name: "statusFailedColor", label: "Estado fallido – color",defaultValue: "#ef4444" },
        { type: "range",  name: "statusSize",        label: "Estado – tamaño (rem)", defaultValue: 1.05, configs: { min: 0.8, max: 2, step: 0.05, unit: "rem" } },
        { type: "select", name: "statusWeight",      label: "Estado – peso",         defaultValue: "600", configs: { options: WEIGHT_OPTIONS } },
        { type: "select", name: "statusFamily",      label: "Estado – fuente",       defaultValue: "'Outfit', sans-serif", configs: { options: FAMILY_OPTIONS } },
        { type: "color",  name: "etaColor",          label: "ETA – color",           defaultValue: "#A1A1AA" },
        { type: "range",  name: "etaSize",           label: "ETA – tamaño (rem)",    defaultValue: 0.8,  configs: { min: 0.65, max: 1.1, step: 0.05, unit: "rem" } },
      ],
    },
    {
      group: "Historial de eventos",
      inputs: [
        { type: "color", name: "historyLabelColor",        label: "Label historial – color",          defaultValue: "#52525B" },
        { type: "text",  name: "historyLabelLetterSpacing",label: "Label historial – letter-spacing", defaultValue: "3px" },
        { type: "color", name: "eventLatestColor",         label: "Evento reciente – color",          defaultValue: "#FFFFFF" },
        { type: "color", name: "eventOldColor",            label: "Eventos anteriores – color",       defaultValue: "#A1A1AA" },
        { type: "range", name: "eventFontSize",            label: "Eventos – tamaño (rem)",           defaultValue: 0.85, configs: { min: 0.7, max: 1.1, step: 0.05, unit: "rem" } },
        { type: "color", name: "eventLocationColor",       label: "Localización – color",             defaultValue: "#52525B" },
        { type: "color", name: "eventTimestampColor",      label: "Timestamp – color",                defaultValue: "#52525B" },
      ],
    },
  ],
  presets: {
    bgColor: "#0a0a0a",
    titleColor: "#FFFFFF", titleSize: 2, titleWeight: "700",
    titleFamily: "'Outfit', sans-serif", titleLetterSpacing: "0px",
    tabActiveColor: "#FF6A3D", tabInactiveColor: "#A1A1AA", tabFontSize: 0.9,
    inputBorderColor: "#2a2a2a", inputTextColor: "#FFFFFF",
    btnBg: "#FF6A3D", btnColor: "#FFFFFF", btnFontSize: 0.9, btnWeight: "700", btnRadius: 6,
    cardBg: "#0a0a0a", cardBorderColor: "#1f1f1f",
    headerLabelColor: "#52525B", headerLabelSize: 0.75, headerLabelLetterSpacing: "3px",
    linkColor: "#FF6A3D",
    progressActiveColor: "#FF6A3D", progressFailedColor: "#ef4444", progressInactiveColor: "#1f1f1f",
    stepLabelSize: 0.68, stepLabelActiveColor: "#FFFFFF", stepLabelInactiveColor: "#A1A1AA",
    statusColor: "#FFFFFF", statusFailedColor: "#ef4444", statusSize: 1.05,
    statusWeight: "600", statusFamily: "'Outfit', sans-serif",
    etaColor: "#A1A1AA", etaSize: 0.8,
    historyLabelColor: "#52525B", historyLabelLetterSpacing: "3px",
    eventLatestColor: "#FFFFFF", eventOldColor: "#A1A1AA", eventFontSize: 0.85,
    eventLocationColor: "#52525B", eventTimestampColor: "#52525B",
  },
});
