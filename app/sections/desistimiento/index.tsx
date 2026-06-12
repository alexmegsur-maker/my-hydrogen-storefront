import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import { backgroundInputs } from "~/components/background-image";
import { layoutInputs, Section } from "~/components/section";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { selectorPaddingMargin } from "~/utils/general";

// ── Shared constants for schema option lists ──────────────────────────────────
type Align = "left" | "center" | "right";

const ALIGNS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

const WEIGHTS = [
  { value: "100", label: "100" }, { value: "200", label: "200" },
  { value: "300", label: "300" }, { value: "400", label: "400" },
  { value: "500", label: "500" }, { value: "600", label: "600" },
  { value: "700", label: "700" }, { value: "800", label: "800" },
  { value: "900", label: "900" },
];

const PAD_SEL = [
  { value: "t", label: "Top" }, { value: "b", label: "Bottom" },
  { value: "x", label: "Inline" }, { value: "y", label: "Block" },
  { value: "a", label: "Custom" },
];

type TypoDef = {
  color?: string; size?: string; family?: string; weight?: string;
  letter?: number; align?: Align;
  paddingSelect?: string; paddingText?: string;
  marginSelect?: string; marginText?: string;
};

// Generates 10 standard typography inputs for a Weaverse schema group
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function typoInputs(prefix: string, d: TypoDef = {}): any[] {
  return [
    { type: "color",  name: `${prefix}Color`,         label: "Color",          defaultValue: d.color         ?? "#FFFFFF" },
    { type: "text",   name: `${prefix}Size`,           label: "Font size",      defaultValue: d.size          ?? "1rem" },
    { type: "text",   name: `${prefix}Family`,         label: "Font family",    defaultValue: d.family        ?? "Inter, sans-serif" },
    { type: "select", name: `${prefix}Weight`,         label: "Font weight",    configs: { options: WEIGHTS }, defaultValue: d.weight  ?? "400" },
    { type: "range",  name: `${prefix}Letter`,         label: "Letter spacing", defaultValue: d.letter  ?? 0, configs: { min: 0, max: 20, step: 1, unit: "px" } },
    { type: "select", name: `${prefix}Align`,          label: "Alignment",      configs: { options: ALIGNS  }, defaultValue: d.align   ?? "left" },
    { type: "select", name: `${prefix}PaddingSelect`,  label: "Padding type",   configs: { options: PAD_SEL }, defaultValue: d.paddingSelect ?? "a" },
    { type: "text",   name: `${prefix}PaddingText`,    label: "Padding value",  defaultValue: d.paddingText  ?? "" },
    { type: "select", name: `${prefix}MarginSelect`,   label: "Margin type",    configs: { options: PAD_SEL }, defaultValue: d.marginSelect  ?? "b" },
    { type: "text",   name: `${prefix}MarginText`,     label: "Margin value",   defaultValue: d.marginText   ?? "" },
  ];
}

// Converts 10 typography props into a React.CSSProperties object
function ts(
  color: string, size: string, family: string, weight: string,
  letter: number, align: Align,
  paddingSelect: string, paddingText: string,
  marginSelect: string, marginText: string,
): React.CSSProperties {
  return {
    color,
    fontSize: size,
    fontFamily: family,
    fontWeight: weight,
    letterSpacing: letter > 0 ? `${letter}px` : "normal",
    textAlign: align,
    ...selectorPaddingMargin("padding", paddingSelect, paddingText),
    ...selectorPaddingMargin("margin", marginSelect, marginText),
  };
}

// ── TypeScript interface ──────────────────────────────────────────────────────
interface DesistimientoFormProps extends HydrogenComponentProps {
  // ── Header content
  eyebrow: string;
  title: string;
  titleUpper: boolean;
  subtitle: string;
  subtitleMaxWidth: string;

  // ── Eyebrow typography (10)
  eyebrowColor: string; eyebrowSize: string; eyebrowFamily: string;
  eyebrowWeight: string; eyebrowLetter: number; eyebrowAlign: Align;
  eyebrowPaddingSelect: string; eyebrowPaddingText: string;
  eyebrowMarginSelect: string; eyebrowMarginText: string;

  // ── Title typography (10)
  titleColor: string; titleSize: string; titleFamily: string;
  titleWeight: string; titleLetter: number; titleAlign: Align;
  titlePaddingSelect: string; titlePaddingText: string;
  titleMarginSelect: string; titleMarginText: string;

  // ── Subtitle typography (10)
  subtitleColor: string; subtitleSize: string; subtitleFamily: string;
  subtitleWeight: string; subtitleLetter: number; subtitleAlign: Align;
  subtitlePaddingSelect: string; subtitlePaddingText: string;
  subtitleMarginSelect: string; subtitleMarginText: string;

  // ── Labels content + shared typography (12)
  labelNombreText: string; labelPedidoText: string;
  labelColor: string; labelSize: string; labelFamily: string;
  labelWeight: string; labelLetter: number; labelAlign: Align;
  labelPaddingSelect: string; labelPaddingText: string;
  labelMarginSelect: string; labelMarginText: string;

  // ── Placeholders + hint (11)
  placeholderNombre: string; placeholderPedido: string;
  hintText: string;
  hintColor: string; hintSize: string; hintFamily: string;
  hintWeight: string; hintLetter: number; hintAlign: Align;
  hintPaddingSelect: string; hintPaddingText: string;
  hintMarginSelect: string; hintMarginText: string;

  // ── Expired error — title (11)
  expiredTitleText: string;
  expiredTitleColor: string; expiredTitleSize: string; expiredTitleFamily: string;
  expiredTitleWeight: string; expiredTitleLetter: number; expiredTitleAlign: Align;
  expiredTitlePaddingSelect: string; expiredTitlePaddingText: string;
  expiredTitleMarginSelect: string; expiredTitleMarginText: string;

  // ── Expired error — message (11)
  expiredMsgText: string;
  expiredMsgColor: string; expiredMsgSize: string; expiredMsgFamily: string;
  expiredMsgWeight: string; expiredMsgLetter: number; expiredMsgAlign: Align;
  expiredMsgPaddingSelect: string; expiredMsgPaddingText: string;
  expiredMsgMarginSelect: string; expiredMsgMarginText: string;

  // ── Verified badge — label (11)
  verifiedLabelText: string;
  verifiedLabelColor: string; verifiedLabelSize: string; verifiedLabelFamily: string;
  verifiedLabelWeight: string; verifiedLabelLetter: number; verifiedLabelAlign: Align;
  verifiedLabelPaddingSelect: string; verifiedLabelPaddingText: string;
  verifiedLabelMarginSelect: string; verifiedLabelMarginText: string;

  // ── Verified badge — description (11)
  verifiedDescText: string;
  verifiedDescColor: string; verifiedDescSize: string; verifiedDescFamily: string;
  verifiedDescWeight: string; verifiedDescLetter: number; verifiedDescAlign: Align;
  verifiedDescPaddingSelect: string; verifiedDescPaddingText: string;
  verifiedDescMarginSelect: string; verifiedDescMarginText: string;

  // ── Button labels + shared label typography
  btnVerifyLabel: string; btnVerifyingLabel: string;
  btnConfirmLabel: string; btnProcessingLabel: string;
  btnResetLabel: string;
  btnLabelSize: string; btnLabelFamily: string; btnLabelWeight: string;
  btnLabelLetter: number; btnLabelAlign: Align;
  btnPaddingSelect: string; btnPaddingText: string;

  // ── Verify button appearance
  btnBg: string; btnColor: string; btnBorderColor: string;
  btnHoverBg: string; btnHoverColor: string;

  // ── Confirm button appearance
  confirmBtnBg: string; confirmBtnColor: string; confirmBtnHoverBg: string;

  // ── Reset button appearance
  btnResetColor: string; btnResetBg: string; btnResetBorderColor: string;

  // ── Popup title (11)
  popupTitle: string;
  popupTitleColor: string; popupTitleSize: string; popupTitleFamily: string;
  popupTitleWeight: string; popupTitleLetter: number; popupTitleAlign: Align;
  popupTitlePaddingSelect: string; popupTitlePaddingText: string;
  popupTitleMarginSelect: string; popupTitleMarginText: string;

  // ── Popup description (11)
  popupDesc: string;
  popupDescColor: string; popupDescSize: string; popupDescFamily: string;
  popupDescWeight: string; popupDescLetter: number; popupDescAlign: Align;
  popupDescPaddingSelect: string; popupDescPaddingText: string;
  popupDescMarginSelect: string; popupDescMarginText: string;

  // ── Popup button (11 + 3 appearance)
  popupBtnLabel: string;
  popupBtnColor: string; popupBtnSize: string; popupBtnFamily: string;
  popupBtnWeight: string; popupBtnLetter: number; popupBtnAlign: Align;
  popupBtnPaddingSelect: string; popupBtnPaddingText: string;
  popupBtnMarginSelect: string; popupBtnMarginText: string;
  popupBtnBg: string; popupBtnBorderColor: string;

  // ── Box & section
  boxBg: string; boxBorderColor: string; boxBorderRadius: number;
  boxPaddingSelect: string; boxPaddingText: string; boxMaxWidth: string;
  paddingSelect: string; paddingText: string; sectionBg: string;
}

type VerifyData = { success: boolean; email?: string; orderName?: string; expired?: boolean; error?: string };
type SubmitData = { success: boolean; error?: string };

// ── Component ─────────────────────────────────────────────────────────────────
function DesistimientoForm(props: DesistimientoFormProps & HydrogenComponentProps) {
  const {
    eyebrow, title, titleUpper, subtitle, subtitleMaxWidth,
    eyebrowColor, eyebrowSize, eyebrowFamily, eyebrowWeight, eyebrowLetter, eyebrowAlign,
    eyebrowPaddingSelect, eyebrowPaddingText, eyebrowMarginSelect, eyebrowMarginText,
    titleColor, titleSize, titleFamily, titleWeight, titleLetter, titleAlign,
    titlePaddingSelect, titlePaddingText, titleMarginSelect, titleMarginText,
    subtitleColor, subtitleSize, subtitleFamily, subtitleWeight, subtitleLetter, subtitleAlign,
    subtitlePaddingSelect, subtitlePaddingText, subtitleMarginSelect, subtitleMarginText,
    labelNombreText, labelPedidoText,
    labelColor, labelSize, labelFamily, labelWeight, labelLetter, labelAlign,
    labelPaddingSelect, labelPaddingText, labelMarginSelect, labelMarginText,
    placeholderNombre, placeholderPedido,
    hintText, hintColor, hintSize, hintFamily, hintWeight, hintLetter, hintAlign,
    hintPaddingSelect, hintPaddingText, hintMarginSelect, hintMarginText,
    expiredTitleText,
    expiredTitleColor, expiredTitleSize, expiredTitleFamily, expiredTitleWeight, expiredTitleLetter, expiredTitleAlign,
    expiredTitlePaddingSelect, expiredTitlePaddingText, expiredTitleMarginSelect, expiredTitleMarginText,
    expiredMsgText,
    expiredMsgColor, expiredMsgSize, expiredMsgFamily, expiredMsgWeight, expiredMsgLetter, expiredMsgAlign,
    expiredMsgPaddingSelect, expiredMsgPaddingText, expiredMsgMarginSelect, expiredMsgMarginText,
    verifiedLabelText,
    verifiedLabelColor, verifiedLabelSize, verifiedLabelFamily, verifiedLabelWeight, verifiedLabelLetter, verifiedLabelAlign,
    verifiedLabelPaddingSelect, verifiedLabelPaddingText, verifiedLabelMarginSelect, verifiedLabelMarginText,
    verifiedDescText,
    verifiedDescColor, verifiedDescSize, verifiedDescFamily, verifiedDescWeight, verifiedDescLetter, verifiedDescAlign,
    verifiedDescPaddingSelect, verifiedDescPaddingText, verifiedDescMarginSelect, verifiedDescMarginText,
    btnVerifyLabel, btnVerifyingLabel, btnConfirmLabel, btnProcessingLabel, btnResetLabel,
    btnLabelSize, btnLabelFamily, btnLabelWeight, btnLabelLetter, btnLabelAlign,
    btnPaddingSelect, btnPaddingText,
    btnBg, btnColor, btnBorderColor, btnHoverBg, btnHoverColor,
    confirmBtnBg, confirmBtnColor, confirmBtnHoverBg,
    btnResetColor, btnResetBg, btnResetBorderColor,
    popupTitle,
    popupTitleColor, popupTitleSize, popupTitleFamily, popupTitleWeight, popupTitleLetter, popupTitleAlign,
    popupTitlePaddingSelect, popupTitlePaddingText, popupTitleMarginSelect, popupTitleMarginText,
    popupDesc,
    popupDescColor, popupDescSize, popupDescFamily, popupDescWeight, popupDescLetter, popupDescAlign,
    popupDescPaddingSelect, popupDescPaddingText, popupDescMarginSelect, popupDescMarginText,
    popupBtnLabel,
    popupBtnColor, popupBtnSize, popupBtnFamily, popupBtnWeight, popupBtnLetter, popupBtnAlign,
    popupBtnPaddingSelect, popupBtnPaddingText, popupBtnMarginSelect, popupBtnMarginText,
    popupBtnBg, popupBtnBorderColor,
    boxBg, boxBorderColor, boxBorderRadius, boxPaddingSelect, boxPaddingText, boxMaxWidth,
    paddingSelect, paddingText, sectionBg,
    ...rest
  } = props;

  const [nombre, setNombre] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [btnVerifyHover, setBtnVerifyHover] = useState(false);
  const [btnConfirmHover, setBtnConfirmHover] = useState(false);

  const verifyFetcher = useFetcher<VerifyData>({ key: "desistimiento-verify" });
  const submitFetcher = useFetcher<SubmitData>({ key: "desistimiento-submit" });
  const navigate = useNavigate();
  const isMobile = useIsMobile(600);

  useEffect(() => {
    if (verifyFetcher.state === "idle" && verifyFetcher.data) {
      setVerifyResult(verifyFetcher.data);
    }
  }, [verifyFetcher.state, verifyFetcher.data]);

  useEffect(() => {
    if (submitFetcher.state === "idle" && submitFetcher.data?.success) {
      setShowPopup(true);
    }
  }, [submitFetcher.state, submitFetcher.data]);

  const handleVerify = () => {
    if (!nombre.trim() || !orderNumber.trim()) return;
    const fd = new FormData();
    fd.set("_action", "verify");
    fd.set("orderNumber", orderNumber.trim());
    fd.set("nombre", nombre.trim());
    verifyFetcher.submit(fd, { method: "POST", action: "/api/desistimiento" });
  };

  const handleConfirm = () => {
    if (!verifyResult?.email) return;
    const fd = new FormData();
    fd.set("_action", "submit");
    fd.set("orderNumber", orderNumber.trim());
    fd.set("nombre", nombre.trim());
    fd.set("correo", verifyResult.email);
    submitFetcher.submit(fd, { method: "POST", action: "/api/desistimiento" });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  const handleReset = () => {
    setVerifyResult(null);
    setNombre("");
    setOrderNumber("");
  };

  const isVerifying = verifyFetcher.state !== "idle";
  const isSubmitting = submitFetcher.state !== "idle";
  const isValid = verifyResult?.success === true;
  const isExpired = verifyResult?.expired === true;
  const hasVerifyError = verifyResult?.success === false && !verifyResult?.expired;
  const canVerify = nombre.trim().length > 0 && orderNumber.trim().length > 0 && !isVerifying;

  const radius = `${boxBorderRadius}px`;
  const inputDisabled = isValid || isVerifying;

  // Shared input field style (appearance only, not editable by user by design)
  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: radius,
    padding: "12px 16px",
    color: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.9rem",
    fontWeight: "300",
    outline: "none",
    MozAppearance: "textfield",
    WebkitAppearance: "none",
    appearance: "none",
    opacity: inputDisabled ? 0.5 : 1,
    transition: "border-color 0.3s ease",
  };

  // Shared button label typography (all form buttons share font/size/weight)
  const btnLabelTypo: React.CSSProperties = {
    fontFamily: btnLabelFamily,
    fontSize: btnLabelSize,
    fontWeight: btnLabelWeight,
    letterSpacing: btnLabelLetter > 0 ? `${btnLabelLetter}px` : "normal",
    textAlign: btnLabelAlign,
    textTransform: "uppercase",
    ...selectorPaddingMargin("padding", btnPaddingSelect, btnPaddingText),
  };

  return (
    <Section
      {...rest}
      containerClassName="w-full"
      style={{
        backgroundColor: sectionBg,
        borderTop: "1px solid rgba(255,255,255,0.03)",
        ...selectorPaddingMargin("padding", paddingSelect, isMobile ? "1rem" : paddingText),
      }}
    >
      <div
        style={{
          maxWidth: boxMaxWidth,
          margin: "0 auto",
          backgroundColor: boxBg,
          border: `1px solid ${boxBorderColor}`,
          borderRadius: radius,
          ...selectorPaddingMargin("padding", boxPaddingSelect, isMobile ? "1.5rem" : boxPaddingText),
        }}
      >
        {/* ── Header ── */}
        <div style={{ marginBottom: "3rem" }}>
          {eyebrow && (
            <span
              style={{
                display: "block",
                textTransform: "uppercase",
                ...ts(
                  eyebrowColor, eyebrowSize, eyebrowFamily, eyebrowWeight,
                  eyebrowLetter, eyebrowAlign,
                  eyebrowPaddingSelect, eyebrowPaddingText,
                  eyebrowMarginSelect, eyebrowMarginText,
                ),
              }}
            >
              {eyebrow}
            </span>
          )}
          {title && (
            <h2
              style={{
                textTransform: titleUpper ? "uppercase" : "none",
                fontSize: isMobile ? "1.6rem" : titleSize,
                ...ts(
                  titleColor, titleSize, titleFamily, titleWeight,
                  titleLetter, titleAlign,
                  titlePaddingSelect, titlePaddingText,
                  titleMarginSelect, titleMarginText,
                ),
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              style={{
                lineHeight: 1.6,
                maxWidth: subtitleMaxWidth,
                ...ts(
                  subtitleColor, subtitleSize, subtitleFamily, subtitleWeight,
                  subtitleLetter, subtitleAlign,
                  subtitlePaddingSelect, subtitlePaddingText,
                  subtitleMarginSelect, subtitleMarginText,
                ),
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* ── Form fields ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Nombre */}
          <div>
            <label
              style={{
                display: "block",
                ...ts(
                  labelColor, labelSize, labelFamily, labelWeight,
                  labelLetter, labelAlign,
                  labelPaddingSelect, labelPaddingText,
                  labelMarginSelect, labelMarginText,
                ),
              }}
            >
              {labelNombreText}
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={placeholderNombre}
              disabled={inputDisabled}
              style={inputStyle}
            />
          </div>

          {/* Número de pedido */}
          <div>
            <label
              style={{
                display: "block",
                ...ts(
                  labelColor, labelSize, labelFamily, labelWeight,
                  labelLetter, labelAlign,
                  labelPaddingSelect, labelPaddingText,
                  labelMarginSelect, labelMarginText,
                ),
              }}
            >
              {labelPedidoText}
            </label>
            <input
              type="number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => {
                const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
                if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder={placeholderPedido}
              disabled={inputDisabled}
              min="1"
              step="1"
              style={inputStyle}
            />
            <p
              style={{
                ...ts(
                  hintColor, hintSize, hintFamily, hintWeight,
                  hintLetter, hintAlign,
                  hintPaddingSelect, hintPaddingText,
                  hintMarginSelect, hintMarginText,
                ),
              }}
            >
              {hintText}
            </p>
          </div>

          {/* ── Expired error ── */}
          {isExpired && (
            <div
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: radius,
                lineHeight: 1.5,
                padding: "1rem 1.25rem",
              }}
            >
              <strong
                style={{
                  display: "block",
                  ...ts(
                    expiredTitleColor, expiredTitleSize, expiredTitleFamily, expiredTitleWeight,
                    expiredTitleLetter, expiredTitleAlign,
                    expiredTitlePaddingSelect, expiredTitlePaddingText,
                    expiredTitleMarginSelect, expiredTitleMarginText,
                  ),
                }}
              >
                {expiredTitleText}
              </strong>
              <span
                style={{
                  ...ts(
                    expiredMsgColor, expiredMsgSize, expiredMsgFamily, expiredMsgWeight,
                    expiredMsgLetter, expiredMsgAlign,
                    expiredMsgPaddingSelect, expiredMsgPaddingText,
                    expiredMsgMarginSelect, expiredMsgMarginText,
                  ),
                }}
              >
                {expiredMsgText}
              </span>
            </div>
          )}

          {/* ── Generic verify error (from server) ── */}
          {hasVerifyError && verifyResult?.error && (
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: radius,
                color: expiredMsgColor,
                fontFamily: expiredMsgFamily,
                fontSize: expiredMsgSize,
              }}
            >
              {verifyResult.error}
            </div>
          )}

          {/* ── Submit error ── */}
          {submitFetcher.data && !submitFetcher.data.success && submitFetcher.data.error && (
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: radius,
                color: expiredMsgColor,
                fontFamily: expiredMsgFamily,
                fontSize: expiredMsgSize,
              }}
            >
              {submitFetcher.data.error}
            </div>
          )}

          {/* ── Verified badge ── */}
          {isValid && verifyResult?.orderName && (
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "rgba(74,222,128,0.04)",
                border: "1px solid rgba(74,222,128,0.15)",
                borderRadius: radius,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke={verifiedLabelColor} strokeWidth="2"
                style={{ flexShrink: 0 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <div
                  style={{
                    textTransform: "uppercase",
                    ...ts(
                      verifiedLabelColor, verifiedLabelSize, verifiedLabelFamily, verifiedLabelWeight,
                      verifiedLabelLetter, verifiedLabelAlign,
                      verifiedLabelPaddingSelect, verifiedLabelPaddingText,
                      verifiedLabelMarginSelect, verifiedLabelMarginText,
                    ),
                  }}
                >
                  {verifiedLabelText}
                </div>
                <div
                  style={{
                    ...ts(
                      verifiedDescColor, verifiedDescSize, verifiedDescFamily, verifiedDescWeight,
                      verifiedDescLetter, verifiedDescAlign,
                      verifiedDescPaddingSelect, verifiedDescPaddingText,
                      verifiedDescMarginSelect, verifiedDescMarginText,
                    ),
                  }}
                >
                  {verifyResult.orderName} {verifiedDescText}
                </div>
              </div>
            </div>
          )}

          {/* ── Buttons ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>

            {/* Verify */}
            {!isValid && !isExpired && (
              <button
                onClick={handleVerify}
                disabled={!canVerify}
                onMouseEnter={() => setBtnVerifyHover(true)}
                onMouseLeave={() => setBtnVerifyHover(false)}
                style={{
                  width: "100%",
                  background: btnVerifyHover && canVerify ? btnHoverBg : btnBg,
                  color: btnVerifyHover && canVerify ? btnHoverColor : btnColor,
                  border: `1px solid ${btnBorderColor}`,
                  borderRadius: radius,
                  cursor: canVerify ? "pointer" : "not-allowed",
                  opacity: !canVerify ? 0.4 : 1,
                  transition: "background 0.3s ease, color 0.3s ease",
                  ...btnLabelTypo,
                }}
              >
                {isVerifying ? btnVerifyingLabel : btnVerifyLabel}
              </button>
            )}

            {/* Confirm */}
            {isValid && (
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                onMouseEnter={() => setBtnConfirmHover(true)}
                onMouseLeave={() => setBtnConfirmHover(false)}
                style={{
                  width: "100%",
                  background: btnConfirmHover && !isSubmitting ? confirmBtnHoverBg : confirmBtnBg,
                  color: confirmBtnColor,
                  border: "none",
                  borderRadius: radius,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: "background 0.3s ease",
                  ...btnLabelTypo,
                }}
              >
                {isSubmitting ? btnProcessingLabel : btnConfirmLabel}
              </button>
            )}

            {/* Reset after expiry */}
            {isExpired && (
              <button
                onClick={handleReset}
                style={{
                  background: btnResetBg,
                  border: `1px solid ${btnResetBorderColor}`,
                  color: btnResetColor,
                  borderRadius: radius,
                  cursor: "pointer",
                  transition: "border-color 0.3s ease",
                  ...btnLabelTypo,
                }}
              >
                {btnResetLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Success popup ── */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: radius,
              padding: isMobile ? "2rem 1.5rem" : "3rem 2.5rem",
              maxWidth: "440px",
              width: "100%",
              position: "relative",
              display:"flex",
              flexDirection:"column"
            }}
          >
            {/* X */}
            <button
              onClick={handleClosePopup}
              aria-label="Cerrar"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
                fontSize: "1.1rem",
                lineHeight: 1,
                padding: "4px 8px",
              }}
            >
              ✕
            </button>

            {/* Check icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.75rem",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3
              style={{
                textTransform: "uppercase",
                ...ts(
                  popupTitleColor, popupTitleSize, popupTitleFamily, popupTitleWeight,
                  popupTitleLetter, popupTitleAlign,
                  popupTitlePaddingSelect, popupTitlePaddingText,
                  popupTitleMarginSelect, popupTitleMarginText,
                ),
              }}
            >
              {popupTitle}
            </h3>

            <p
              style={{
                lineHeight: 1.6,
                ...ts(
                  popupDescColor, popupDescSize, popupDescFamily, popupDescWeight,
                  popupDescLetter, popupDescAlign,
                  popupDescPaddingSelect, popupDescPaddingText,
                  popupDescMarginSelect, popupDescMarginText,
                ),
              }}
            >
              {popupDesc}
            </p>

            <button
              onClick={handleClosePopup}
              style={{
                background: popupBtnBg,
                border: `1px solid ${popupBtnBorderColor}`,
                borderRadius: radius,
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "background 0.3s ease",
                placeSelf:popupBtnAlign == "center" ? "center" : popupBtnAlign == "left" ? "start":"end", 
                ...ts(
                  popupBtnColor, popupBtnSize, popupBtnFamily, popupBtnWeight,
                  popupBtnLetter, popupBtnAlign,
                  popupBtnPaddingSelect, popupBtnPaddingText,
                  popupBtnMarginSelect, popupBtnMarginText,
                ),
              }}
            >
              {popupBtnLabel}
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}

export default DesistimientoForm;

// ── Schema ────────────────────────────────────────────────────────────────────
export const schema = createSchema({
  type: "desistimiento-form",
  title: "Formulario de Desistimiento",
  settings: [
    // ── All text content in one place ────────────────────────────────────────
    {
      group: "Textos",
      inputs: [
        { type: "heading", label: "Encabezado" },
        { type: "text",   name: "eyebrow",          label: "Eyebrow",          defaultValue: "Derecho de desistimiento" },
        { type: "text",   name: "title",             label: "Título",            defaultValue: "Solicitar devolución" },
        { type: "textarea", name: "subtitle",        label: "Subtítulo",         defaultValue: "Tienes derecho a desistir de tu compra dentro de los 14 días naturales desde la recepción del pedido." },
        { type: "text",   name: "subtitleMaxWidth",  label: "Subtitle max-width", defaultValue: "480px" },
        { type: "heading", label: "Labels de campos" },
        { type: "text",   name: "labelNombreText",   label: "Label nombre",      defaultValue: "Nombre completo" },
        { type: "text",   name: "labelPedidoText",   label: "Label pedido",      defaultValue: "Número de pedido" },
        { type: "text",   name: "placeholderNombre", label: "Placeholder nombre", defaultValue: "Tu nombre completo" },
        { type: "text",   name: "placeholderPedido", label: "Placeholder pedido", defaultValue: "Ej: 12345" },
        { type: "text",   name: "hintText",          label: "Texto de ayuda",    defaultValue: "Solo el número, sin el símbolo #" },
        { type: "heading", label: "Mensajes de estado" },
        { type: "text",   name: "expiredTitleText",  label: "Error: título",     defaultValue: "Plazo expirado" },
        { type: "text",   name: "expiredMsgText",    label: "Error: mensaje",    defaultValue: "No es aplicable por sobrepasar los 14 días de desistimiento." },
        { type: "text",   name: "verifiedLabelText", label: "Verificado: etiqueta", defaultValue: "Pedido verificado" },
        { type: "text",   name: "verifiedDescText",  label: "Verificado: complemento", defaultValue: "— Dentro del plazo de 14 días" },
        { type: "heading", label: "Botones" },
        { type: "text",   name: "btnVerifyLabel",    label: "Botón verificar",   defaultValue: "Verificar pedido" },
        { type: "text",   name: "btnVerifyingLabel", label: "Botón verificando", defaultValue: "Verificando..." },
        { type: "text",   name: "btnConfirmLabel",   label: "Botón confirmar",   defaultValue: "Confirmar desistimiento" },
        { type: "text",   name: "btnProcessingLabel",label: "Botón procesando",  defaultValue: "Procesando..." },
        { type: "text",   name: "btnResetLabel",     label: "Botón reintentar",  defaultValue: "Intentar con otro número" },
        { type: "heading", label: "Popup" },
        { type: "text",   name: "popupTitle",        label: "Popup: título",     defaultValue: "Petición de desistimiento enviada" },
        { type: "textarea", name: "popupDesc",       label: "Popup: descripción",defaultValue: "Hemos recibido tu solicitud. Nos pondremos en contacto contigo para gestionar el proceso de devolución." },
        { type: "text",   name: "popupBtnLabel",     label: "Popup: botón",      defaultValue: "Aceptar" },
      ],
    },

    // ── Eyebrow typography ────────────────────────────────────────────────────
    {
      group: "Eyebrow",
      inputs: typoInputs("eyebrow", {
        color: "#71717A", size: "0.75rem", family: "Inter, sans-serif",
        weight: "600", letter: 4, align: "center",
        marginSelect: "b", marginText: "0.75rem",
      }),
    },

    // ── Title typography ──────────────────────────────────────────────────────
    {
      group: "Título",
      inputs: [
        { type: "switch", name: "titleUpper", label: "Uppercase", defaultValue: true },
        ...typoInputs("title", {
          color: "#FFFFFF", size: "2.5rem", family: "Outfit, sans-serif",
          weight: "300", letter: 2, align: "center",
          marginSelect: "b", marginText: "1rem",
        }),
      ],
    },

    // ── Subtitle typography ───────────────────────────────────────────────────
    {
      group: "Subtítulo",
      inputs: typoInputs("subtitle", {
        color: "#71717A", size: "0.9rem", family: "Inter, sans-serif",
        weight: "300", letter: 0, align: "center",
        marginSelect: "a", marginText: "0 auto",
      }),
    },

    // ── Labels typography (shared by both form labels) ────────────────────────
    {
      group: "Labels",
      inputs: typoInputs("label", {
        color: "rgba(255,255,255,0.45)", size: "0.7rem", family: "Inter, sans-serif",
        weight: "600", letter: 2, align: "left",
        marginSelect: "b", marginText: "0.5rem",
      }),
    },

    // ── Hint text ─────────────────────────────────────────────────────────────
    {
      group: "Ayuda",
      inputs: typoInputs("hint", {
        color: "rgba(255,255,255,0.25)", size: "0.7rem", family: "Inter, sans-serif",
        weight: "300", letter: 0, align: "left",
        marginSelect: "t", marginText: "0.4rem",
      }),
    },

    // ── Error messages ────────────────────────────────────────────────────────
    {
      group: "Mensajes de error",
      inputs: [
        { type: "heading", label: "Título del error" },
        ...typoInputs("expiredTitle", {
          color: "#F87171", size: "0.85rem", family: "Inter, sans-serif",
          weight: "600", letter: 0, align: "left",
          marginSelect: "b", marginText: "0.25rem",
        }),
        { type: "heading", label: "Texto del error" },
        ...typoInputs("expiredMsg", {
          color: "#FCA5A5", size: "0.85rem", family: "Inter, sans-serif",
          weight: "300", letter: 0, align: "left",
        }),
      ],
    },

    // ── Verified badge ────────────────────────────────────────────────────────
    {
      group: "Insignia verificado",
      inputs: [
        { type: "heading", label: "Etiqueta" },
        ...typoInputs("verifiedLabel", {
          color: "#4ade80", size: "0.7rem", family: "Inter, sans-serif",
          weight: "600", letter: 1, align: "left",
          marginSelect: "b", marginText: "0.15rem",
        }),
        { type: "heading", label: "Descripción" },
        ...typoInputs("verifiedDesc", {
          color: "rgba(255,255,255,0.45)", size: "0.8rem", family: "Inter, sans-serif",
          weight: "300", letter: 0, align: "left",
        }),
      ],
    },

    // ── Button label shared typography ────────────────────────────────────────
    {
      group: "Botones — Tipografía",
      inputs: [
        { type: "text",   name: "btnLabelFamily", label: "Font family",    defaultValue: "Inter, sans-serif" },
        { type: "text",   name: "btnLabelSize",   label: "Font size",      defaultValue: "0.75rem" },
        {
          type: "select", name: "btnLabelWeight", label: "Font weight",
          configs: { options: WEIGHTS }, defaultValue: "600",
        },
        { type: "range",  name: "btnLabelLetter", label: "Letter spacing", defaultValue: 2, configs: { min: 0, max: 20, step: 1, unit: "px" } },
        { type: "select", name: "btnLabelAlign",  label: "Alignment",      configs: { options: ALIGNS }, defaultValue: "center" },
        { type: "select", name: "btnPaddingSelect", label: "Padding type", configs: { options: PAD_SEL }, defaultValue: "a" },
        { type: "text",   name: "btnPaddingText", label: "Padding value",  defaultValue: "14px 24px" },
      ],
    },

    // ── Verify button appearance ──────────────────────────────────────────────
    {
      group: "Botón — Verificar",
      inputs: [
        { type: "color", name: "btnBg",        label: "Fondo",             defaultValue: "transparent" },
        { type: "color", name: "btnColor",     label: "Color texto",       defaultValue: "#FFFFFF" },
        { type: "color", name: "btnBorderColor",label: "Borde",            defaultValue: "rgba(255,255,255,0.2)" },
        { type: "color", name: "btnHoverBg",   label: "Fondo hover",       defaultValue: "rgba(255,255,255,0.05)" },
        { type: "color", name: "btnHoverColor",label: "Color texto hover", defaultValue: "#FFFFFF" },
      ],
    },

    // ── Confirm button appearance ─────────────────────────────────────────────
    {
      group: "Botón — Confirmar",
      inputs: [
        { type: "color", name: "confirmBtnBg",      label: "Fondo",       defaultValue: "#FFFFFF" },
        { type: "color", name: "confirmBtnColor",   label: "Color texto", defaultValue: "#000000" },
        { type: "color", name: "confirmBtnHoverBg", label: "Fondo hover", defaultValue: "rgba(255,255,255,0.92)" },
      ],
    },

    // ── Reset button appearance ───────────────────────────────────────────────
    {
      group: "Botón — Reintentar",
      inputs: [
        { type: "color", name: "btnResetBg",          label: "Fondo",       defaultValue: "transparent" },
        { type: "color", name: "btnResetColor",       label: "Color texto", defaultValue: "rgba(255,255,255,0.4)" },
        { type: "color", name: "btnResetBorderColor", label: "Borde",       defaultValue: "rgba(255,255,255,0.1)" },
      ],
    },

    // ── Popup title ───────────────────────────────────────────────────────────
    {
      group: "Popup — Título",
      inputs: typoInputs("popupTitle", {
        color: "#FFFFFF", size: "1rem", family: "Outfit, sans-serif",
        weight: "300", letter: 2, align: "center",
        marginSelect: "b", marginText: "1rem",
      }),
    },

    // ── Popup description ─────────────────────────────────────────────────────
    {
      group: "Popup — Descripción",
      inputs: typoInputs("popupDesc", {
        color: "rgba(255,255,255,0.4)", size: "0.85rem", family: "Inter, sans-serif",
        weight: "300", letter: 0, align: "center",
        marginSelect: "b", marginText: "2rem",
      }),
    },

    // ── Popup button ──────────────────────────────────────────────────────────
    {
      group: "Popup — Botón",
      inputs: [
        { type: "color", name: "popupBtnBg",          label: "Fondo",   defaultValue: "rgba(255,255,255,0.05)" },
        { type: "color", name: "popupBtnBorderColor", label: "Borde",   defaultValue: "rgba(255,255,255,0.1)" },
        ...typoInputs("popupBtn", {
          color: "#FFFFFF", size: "0.7rem", family: "Inter, sans-serif",
          weight: "600", letter: 2, align: "center",
          paddingSelect: "a", paddingText: "12px 32px",
        }),
      ],
    },

    // ── Box container ─────────────────────────────────────────────────────────
    {
      group: "Caja",
      inputs: [
        { type: "color",  name: "boxBg",           label: "Fondo",        defaultValue: "#050505" },
        { type: "color",  name: "boxBorderColor",  label: "Borde",        defaultValue: "rgba(255,255,255,0.05)" },
        { type: "range",  name: "boxBorderRadius", label: "Radio borde",  defaultValue: 4, configs: { min: 0, max: 32, step: 2, unit: "px" } },
        { type: "text",   name: "boxMaxWidth",     label: "Ancho máximo", defaultValue: "640px" },
        { type: "select", name: "boxPaddingSelect",label: "Padding type",
          configs: { options: PAD_SEL }, defaultValue: "a" },
        { type: "text",   name: "boxPaddingText",  label: "Padding value", defaultValue: "4rem 3rem" },
      ],
    },

    // ── Section ───────────────────────────────────────────────────────────────
    {
      group: "Sección",
      inputs: [
        { type: "color",  name: "sectionBg",    label: "Fondo",             defaultValue: "#020202" },
        { type: "select", name: "paddingSelect", label: "Padding type",
          configs: { options: PAD_SEL }, defaultValue: "a" },
        { type: "text",   name: "paddingText",  label: "Padding value",     defaultValue: "4rem 2rem 8rem 2rem" },
      ],
    },

    { group: "Layout",  inputs: layoutInputs },
    { group: "Fondo",   inputs: backgroundInputs },
  ],

  presets: {
    eyebrow: "Derecho de desistimiento",
    title: "Solicitar devolución",
    titleUpper: true,
    subtitle: "Tienes derecho a desistir de tu compra dentro de los 14 días naturales desde la recepción del pedido.",
    subtitleMaxWidth: "480px",
    // Eyebrow
    eyebrowColor: "#71717A", eyebrowSize: "0.75rem", eyebrowFamily: "Inter, sans-serif",
    eyebrowWeight: "600", eyebrowLetter: 4, eyebrowAlign: "center",
    eyebrowPaddingSelect: "a", eyebrowPaddingText: "",
    eyebrowMarginSelect: "b", eyebrowMarginText: "0.75rem",
    // Title
    titleColor: "#FFFFFF", titleSize: "2.5rem", titleFamily: "Outfit, sans-serif",
    titleWeight: "300", titleLetter: 2, titleAlign: "center",
    titlePaddingSelect: "a", titlePaddingText: "",
    titleMarginSelect: "b", titleMarginText: "1rem",
    // Subtitle
    subtitleColor: "#71717A", subtitleSize: "0.9rem", subtitleFamily: "Inter, sans-serif",
    subtitleWeight: "300", subtitleLetter: 0, subtitleAlign: "center",
    subtitlePaddingSelect: "a", subtitlePaddingText: "",
    subtitleMarginSelect: "a", subtitleMarginText: "0 auto",
    // Labels
    labelNombreText: "Nombre completo", labelPedidoText: "Número de pedido",
    labelColor: "rgba(255,255,255,0.45)", labelSize: "0.7rem", labelFamily: "Inter, sans-serif",
    labelWeight: "600", labelLetter: 2, labelAlign: "left",
    labelPaddingSelect: "a", labelPaddingText: "",
    labelMarginSelect: "b", labelMarginText: "0.5rem",
    // Placeholders + hint
    placeholderNombre: "Tu nombre completo", placeholderPedido: "Ej: 12345",
    hintText: "Solo el número, sin el símbolo #",
    hintColor: "rgba(255,255,255,0.25)", hintSize: "0.7rem", hintFamily: "Inter, sans-serif",
    hintWeight: "300", hintLetter: 0, hintAlign: "left",
    hintPaddingSelect: "a", hintPaddingText: "",
    hintMarginSelect: "t", hintMarginText: "0.4rem",
    // Expired title
    expiredTitleText: "Plazo expirado",
    expiredTitleColor: "#F87171", expiredTitleSize: "0.85rem", expiredTitleFamily: "Inter, sans-serif",
    expiredTitleWeight: "600", expiredTitleLetter: 0, expiredTitleAlign: "left",
    expiredTitlePaddingSelect: "a", expiredTitlePaddingText: "",
    expiredTitleMarginSelect: "b", expiredTitleMarginText: "0.25rem",
    // Expired message
    expiredMsgText: "No es aplicable por sobrepasar los 14 días de desistimiento.",
    expiredMsgColor: "#FCA5A5", expiredMsgSize: "0.85rem", expiredMsgFamily: "Inter, sans-serif",
    expiredMsgWeight: "300", expiredMsgLetter: 0, expiredMsgAlign: "left",
    expiredMsgPaddingSelect: "a", expiredMsgPaddingText: "",
    expiredMsgMarginSelect: "b", expiredMsgMarginText: "",
    // Verified label
    verifiedLabelText: "Pedido verificado",
    verifiedLabelColor: "#4ade80", verifiedLabelSize: "0.7rem", verifiedLabelFamily: "Inter, sans-serif",
    verifiedLabelWeight: "600", verifiedLabelLetter: 1, verifiedLabelAlign: "left",
    verifiedLabelPaddingSelect: "a", verifiedLabelPaddingText: "",
    verifiedLabelMarginSelect: "b", verifiedLabelMarginText: "0.15rem",
    // Verified desc
    verifiedDescText: "— Dentro del plazo de 14 días",
    verifiedDescColor: "rgba(255,255,255,0.45)", verifiedDescSize: "0.8rem", verifiedDescFamily: "Inter, sans-serif",
    verifiedDescWeight: "300", verifiedDescLetter: 0, verifiedDescAlign: "left",
    verifiedDescPaddingSelect: "a", verifiedDescPaddingText: "",
    verifiedDescMarginSelect: "b", verifiedDescMarginText: "",
    // Button labels + shared typo
    btnVerifyLabel: "Verificar pedido", btnVerifyingLabel: "Verificando...",
    btnConfirmLabel: "Confirmar desistimiento", btnProcessingLabel: "Procesando...",
    btnResetLabel: "Intentar con otro número",
    btnLabelFamily: "Inter, sans-serif", btnLabelSize: "0.75rem",
    btnLabelWeight: "600", btnLabelLetter: 2, btnLabelAlign: "center",
    btnPaddingSelect: "a", btnPaddingText: "14px 24px",
    // Verify btn
    btnBg: "transparent", btnColor: "#FFFFFF", btnBorderColor: "rgba(255,255,255,0.2)",
    btnHoverBg: "rgba(255,255,255,0.05)", btnHoverColor: "#FFFFFF",
    // Confirm btn
    confirmBtnBg: "#FFFFFF", confirmBtnColor: "#000000",
    confirmBtnHoverBg: "rgba(255,255,255,0.92)",
    // Reset btn
    btnResetBg: "transparent", btnResetColor: "rgba(255,255,255,0.4)",
    btnResetBorderColor: "rgba(255,255,255,0.1)",
    // Popup title
    popupTitle: "Petición de desistimiento enviada",
    popupTitleColor: "#FFFFFF", popupTitleSize: "1rem", popupTitleFamily: "Outfit, sans-serif",
    popupTitleWeight: "300", popupTitleLetter: 2, popupTitleAlign: "center",
    popupTitlePaddingSelect: "a", popupTitlePaddingText: "",
    popupTitleMarginSelect: "b", popupTitleMarginText: "1rem",
    // Popup desc
    popupDesc: "Hemos recibido tu solicitud. Nos pondremos en contacto contigo para gestionar el proceso de devolución.",
    popupDescColor: "rgba(255,255,255,0.4)", popupDescSize: "0.85rem", popupDescFamily: "Inter, sans-serif",
    popupDescWeight: "300", popupDescLetter: 0, popupDescAlign: "center",
    popupDescPaddingSelect: "a", popupDescPaddingText: "",
    popupDescMarginSelect: "b", popupDescMarginText: "2rem",
    // Popup button
    popupBtnLabel: "Aceptar",
    popupBtnColor: "#FFFFFF", popupBtnSize: "0.7rem", popupBtnFamily: "Inter, sans-serif",
    popupBtnWeight: "600", popupBtnLetter: 2, popupBtnAlign: "center",
    popupBtnPaddingSelect: "a", popupBtnPaddingText: "12px 32px",
    popupBtnMarginSelect: "b", popupBtnMarginText: "",
    popupBtnBg: "rgba(255,255,255,0.05)", popupBtnBorderColor: "rgba(255,255,255,0.1)",
    // Box & section
    boxBg: "#050505", boxBorderColor: "rgba(255,255,255,0.05)",
    boxBorderRadius: 4, boxMaxWidth: "640px",
    boxPaddingSelect: "a", boxPaddingText: "4rem 3rem",
    sectionBg: "#020202", paddingSelect: "a",
    paddingText: "4rem 2rem 8rem 2rem",
  },
});
