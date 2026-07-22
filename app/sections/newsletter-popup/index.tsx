import { createSchema } from "@weaverse/hydrogen";
import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";
import { selectorPaddingMargin } from "~/utils/general";

const STORAGE_SHOWN = "newsletter_popup_shown";
const STORAGE_SUBSCRIBED = "newsletter_popup_subscribed";

interface NewsletterPopupProps extends Partial<HydrogenComponentProps> {
  clName?:string;
  // Banner
  bannerImage: WeaverseImage | string;
  bannerHeight: string;
  // Form
  inputPlaceholder: string;
  buttonText: string;
  successMessage: string;
  // Button styles
  btnColor: string;
  btnBgColor: string;
  btnBgHoverColor: string;
  btnSize: string;
  btnFamily: string;
  btnWeight: string;
  btnLetter: number;
  btnPaddingSelect: string;
  btnPaddingText: string;
  // Input styles
  inputColor: string;
  inputBg: string;
  inputBorder: string;
  inputSize: string;
  inputFamily: string;
  // Popup styles
  popupBg: string;
  popupMaxWidth: string;
  popupBorderRadius: string;
  overlayColor: string;
  // Icon
  iconBg: string;
  iconColor: string;
  iconSize: string;
  // Delay
  delaySeconds: number;
}

export default function NewsletterPopup(
  props: NewsletterPopupProps & { children?: React.ReactNode },
) {
  const {
    children,
    bannerImage,
    bannerHeight,
    inputPlaceholder,
    buttonText,
    successMessage,
    btnColor,
    btnBgColor,
    btnBgHoverColor,
    btnSize,
    btnFamily,
    btnWeight,
    btnLetter,
    btnPaddingSelect,
    btnPaddingText,
    inputColor,
    inputBg,
    inputBorder,
    inputSize,
    inputFamily,
    popupBg,
    popupMaxWidth,
    popupBorderRadius,
    overlayColor,
    iconBg,
    iconColor,
    iconSize,
    delaySeconds,
    clName,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const emailRef = useRef<HTMLInputElement>(null);

  const isSuccess = fetcher.data?.ok === true;
  const isError = fetcher.data?.ok === false;

  useEffect(() => {
    setMounted(true);
    const subscribed = localStorage.getItem(STORAGE_SUBSCRIBED) === "true";
    const shown = localStorage.getItem(STORAGE_SHOWN) === "true";

    if (subscribed) return;

    if (!shown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, (delaySeconds ?? 3) * 1000);
      return () => clearTimeout(timer);
    } else {
      setShowIcon(true);
    }
  }, [delaySeconds]);

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem(STORAGE_SUBSCRIBED, "true");
      localStorage.setItem(STORAGE_SHOWN, "true");
      setShowIcon(false);
      setTimeout(() => setIsOpen(false), 1500);
    }
  }, [isSuccess]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_SHOWN, "true");
    const subscribed = localStorage.getItem(STORAGE_SUBSCRIBED) === "true";
    if (!subscribed) setShowIcon(true);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay + popup — always in DOM, visibility via opacity to avoid CLS */}
      <div
        className={cn(
          "fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300",
          clName && clName

        )}
        style={{
          background: overlayColor ?? "rgba(0,0,0,0.6)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
        aria-hidden={!isOpen}
      >
        <div
          className="relative w-full overflow-hidden flex flex-col transition-transform duration-300"
          style={{
            maxWidth: popupMaxWidth ?? "520px",
            background: popupBg ?? "#111111",
            borderRadius: popupBorderRadius ?? "8px",
            transform: isOpen ? "translateY(0)" : "translateY(16px)",
          }}
        >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-opacity hover:opacity-70"
              style={{ background: "rgba(0,0,0,0.4)", color: "#fff" }}
              aria-label="Cerrar"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Banner image */}
            {bannerImage && ( 
              <div
                className="w-full overflow-hidden flex-shrink-0"
                style={{ height: bannerHeight ?? "200px" }}
              >
                <Image
                  data={
                    typeof bannerImage === "string"
                      ? { url: bannerImage, altText: "" }
                      : bannerImage
                  }
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col p-6 gap-3">
              {children}

              {/* Form */}
              {isSuccess ? (
                <p
                  className="text-center py-3"
                  style={{ color: btnBgColor ?? "#22c55e", fontSize: btnSize }}
                >
                  {successMessage ?? "¡Gracias por suscribirte!"}
                </p>
              ) : (
                <fetcher.Form
                  method="post"
                  action="/api/newsletter-popup"
                  className="flex flex-col gap-3 mt-2"
                >
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    required
                    placeholder={inputPlaceholder ?? "Tu email"}
                    className="w-full outline-none"
                    style={{
                      background: inputBg ?? "#1a1a1a",
                      color: inputColor ?? "#ffffff",
                      border: `1px solid ${inputBorder ?? "#333333"}`,
                      borderRadius: "4px",
                      padding: "0.75rem 1rem",
                      fontSize: inputSize ?? "0.9rem",
                      fontFamily: inputFamily ?? "Montserrat",
                    }}
                  />
                  {isError && (
                    <p className="text-red-400 text-sm">
                      {fetcher.data?.error ?? "Error al suscribirse. Inténtalo de nuevo."}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={fetcher.state !== "idle"}
                    onMouseEnter={() => setHoverBtn(true)}
                    onMouseLeave={() => setHoverBtn(false)}
                    className="w-full uppercase font-bold transition-colors"
                    style={{
                      color: btnColor ?? "#000000",
                      background: hoverBtn
                        ? (btnBgHoverColor ?? "#e4e4e7")
                        : (btnBgColor ?? "#ffffff"),
                      fontSize: btnSize ?? "0.85rem",
                      fontFamily: btnFamily ?? "Montserrat",
                      fontWeight: btnWeight ?? "700",
                      letterSpacing: `${btnLetter ?? 2}px`,
                      borderRadius: "4px",
                      ...selectorPaddingMargin(
                        "padding",
                        btnPaddingSelect ?? "a",
                        btnPaddingText ?? "0.85rem 1rem",
                      ),
                    }}
                  >
                    {fetcher.state !== "idle" ? "..." : buttonText ?? "Suscribirme"}
                  </button>
                </fetcher.Form>
              )}
            </div>
          </div>
        </div>

      {/* Floating icon — always in DOM, visibility via opacity to avoid CLS */}
      <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9998] flex items-center justify-center rounded-full shadow-lg transition-all duration-300"
          style={{
            pointerEvents: showIcon && !isOpen ? "auto" : "none",
            opacity: showIcon && !isOpen ? 1 : 0,
            transform: showIcon && !isOpen ? "scale(1)" : "scale(0.8)",
            width: iconSize ?? "52px",
            height: iconSize ?? "52px",
            background: iconBg ?? "#ffffff",
            color: iconColor ?? "#000000",
          }}
          aria-label="Suscríbete a nuestra newsletter"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 6L12 13L2 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
    </>
  );
}

export const schema = createSchema({
  type: "newsletter-popup",
  title: "Newsletter Popup",
  settings: [
    {
      group:"General",
      inputs:[
        {
          type:"text",
          name:"clName",
          label:"className",
        },
      ]
    },
    {
      group: "Banner",
      inputs: [
        {
          type: "image",
          name: "bannerImage",
          label: "Banner image",
        },
        {
          type: "text",
          name: "bannerHeight",
          label: "Banner height",
          defaultValue: "200px",
        },
      ],
    },
    {
      group: "Form",
      inputs: [
        {
          type: "text",
          name: "inputPlaceholder",
          label: "Input placeholder",
          defaultValue: "Tu email",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Suscribirme",
        },
        {
          type: "text",
          name: "successMessage",
          label: "Success message",
          defaultValue: "¡Gracias por suscribirte!",
        },
      ],
    },
    {
      group: "Button style",
      inputs: [
        { type: "color", name: "btnColor", label: "Text color", defaultValue: "#000000" },
        { type: "color", name: "btnBgColor", label: "Background color", defaultValue: "#ffffff" },
        { type: "color", name: "btnBgHoverColor", label: "Hover background", defaultValue: "#e4e4e7" },
        { type: "text", name: "btnSize", label: "Font size", defaultValue: "0.85rem" },
        { type: "text", name: "btnFamily", label: "Font family", defaultValue: "Montserrat" },
        {
          type: "select",
          name: "btnWeight",
          label: "Font weight",
          configs: {
            options: [
              { value: "400", label: "400 - Normal" },
              { value: "500", label: "500 - Medium" },
              { value: "600", label: "600 - Semi Bold" },
              { value: "700", label: "700 - Bold" },
              { value: "800", label: "800 - Extra Bold" },
            ],
          },
          defaultValue: "700",
        },
        {
          type: "range",
          name: "btnLetter",
          label: "Letter spacing",
          configs: { min: 0, max: 20, step: 1, unit: "px" },
          defaultValue: 2,
        },
        {
          type: "select",
          name: "btnPaddingSelect",
          label: "Padding type",
          configs: {
            options: [
              { value: "y", label: "Block" },
              { value: "x", label: "Inline" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        { type: "text", name: "btnPaddingText", label: "Padding value", defaultValue: "0.85rem 1rem" },
      ],
    },
    {
      group: "Input style",
      inputs: [
        { type: "color", name: "inputColor", label: "Text color", defaultValue: "#ffffff" },
        { type: "color", name: "inputBg", label: "Background color", defaultValue: "#1a1a1a" },
        { type: "color", name: "inputBorder", label: "Border color", defaultValue: "#333333" },
        { type: "text", name: "inputSize", label: "Font size", defaultValue: "0.9rem" },
        { type: "text", name: "inputFamily", label: "Font family", defaultValue: "Montserrat" },
      ],
    },
    {
      group: "Popup style",
      inputs: [
        { type: "color", name: "popupBg", label: "Background color", defaultValue: "#111111" },
        { type: "text", name: "popupMaxWidth", label: "Max width", defaultValue: "520px" },
        { type: "text", name: "popupBorderRadius", label: "Border radius", defaultValue: "8px" },
        { type: "color", name: "overlayColor", label: "Overlay color", defaultValue: "rgba(0,0,0,0.6)" },
        {
          type: "range",
          name: "delaySeconds",
          label: "Delay before showing (seconds)",
          configs: { min: 0, max: 30, step: 1, unit: "s" },
          defaultValue: 3,
        },
      ],
    },
    {
      group: "Floating icon",
      inputs: [
        { type: "color", name: "iconBg", label: "Icon background", defaultValue: "#ffffff" },
        { type: "color", name: "iconColor", label: "Icon color", defaultValue: "#000000" },
        { type: "text", name: "iconSize", label: "Icon size", defaultValue: "52px" },
      ],
    },
  ],
  childTypes: ["subheading", "heading", "paragraph"],
  presets: {
    children: [
      {
        type: "heading",
        content: "¡Únete a nuestra newsletter!",
        as: "h3",
        alignment: "center",
      },
      {
        type: "subheading",
        content: "Ofertas exclusivas y novedades",
        alignment: "center",
      },
      {
        type: "paragraph",
        content: "Suscríbete y sé el primero en conocer nuestras promociones especiales.",
        alignment: "center",
      },
    ],
  },
});
