import {
  createSchema,
  IMAGES_PLACEHOLDERS,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { Section } from "./section";
import { Image } from "./image";
import { Skeleton } from "./skeleton";
import { calculateAspectRatio } from "~/utils/image";
import type { ImageAspectRatio } from "~/types/others";
import { selectorPaddingMargin } from "~/utils/general";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

type UniverseTheme = "origin" | "lotr" | "clover" | "solo" | "madrid";

interface CardUniverseProps {
  image: WeaverseImage;
  imageAspectRatio: ImageAspectRatio;
  paddingSelect: string;
  paddingText: string;
  subheading: string;
  heading: string;
  paragraph: string;
  linkText: string;
  link: string;
  linkCard: boolean;
  linkDecoration: string;
  theme: UniverseTheme;
  whisperText: string;
  fxIntensity: number;
  fxSpeed: number;
  fxLift: number;
  density: number;
  auraColor: string;
  tintColor: string;
  veilColor: string;
  accentColor: string;
  auraStrength: number;
  smokeStrength: number;
  tendrilsFactor: number;
  soulsFactor: number;
  soulSizeMin: number;
  soulSizeMax: number;
  fringeCount: number;
  confettiFactor: number;
  confettiColors: string;
  stColor: string;
  stSize: string;
  stLetter: number;
  stUpper: boolean;
  stFamily: string;
  stWeight: string;
  stPaddingSelect: string;
  stPaddingText: string;
  stMarginSelect: string;
  stMarginText: string;
  tColor: string;
  tSize: string;
  tLetter: number;
  tUpper: boolean;
  tFamily: string;
  tWeight: string;
  tPaddingSelect: string;
  tPaddingText: string;
  tMarginSelect: string;
  tMarginText: string;
  pColor: string;
  pSize: string;
  pLetter: number;
  pUpper: boolean;
  pFamily: string;
  pWeight: string;
  pPaddingSelect: string;
  pPaddingText: string;
  pMarginSelect: string;
  pMarginText: string;
  lColor: string;
  lSize: string;
  lLetter: number;
  lUpper: boolean;
  lFamily: string;
  lWeight: string;
  lPaddingSelect: string;
  lPaddingText: string;
  lMarginSelect: string;
  lMarginText: string;
  imgHeight?:string;
  smallHeight:boolean;
  imgFit:"fill"|"contain"|"cover"|"none"
            
}

const DEFAULT_CONFETTI_COLORS = ["#ffffff", "#f7f7fa", "#f7d97a", "#c9a227", "#ffffff", "#e8c65a"];

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** "#fff,#000, #f7d97a" -> ["#fff","#000","#f7d97a"], con fallback si viene vacío */
function parseColorList(value: string | undefined): string[] {
  const parsed = (value ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  return parsed.length ? parsed : DEFAULT_CONFETTI_COLORS;
}

export default function CardUniverse(props: CardUniverseProps & HydrogenComponentProps) {
  const {
    image,
    imageAspectRatio,
    paddingSelect,
    paddingText,
    subheading,
    heading,
    paragraph,
    linkText,
    link,
    linkCard,
    linkDecoration,
    theme,
    whisperText,
    fxIntensity,
    fxSpeed,
    fxLift,
    density,
    auraColor,
    tintColor,
    veilColor,
    accentColor,
    auraStrength,
    smokeStrength,
    tendrilsFactor,
    soulsFactor,
    soulSizeMin,
    soulSizeMax,
    fringeCount,
    confettiFactor,
    confettiColors,
    stColor,
    stSize,
    stLetter,
    stUpper,
    stFamily,
    stWeight,
    stPaddingSelect,
    stPaddingText,
    stMarginSelect,
    stMarginText,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tWeight,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    pColor,
    pSize,
    pLetter,
    pUpper,
    pFamily,
    pWeight,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    lColor,
    lSize,
    lLetter,
    lUpper,
    lFamily,
    lWeight,
    lPaddingSelect,
    lPaddingText,
    lMarginSelect,
    lMarginText,
    imgHeight,
    smallHeight,
    imgFit,
    ...rest
  } = props;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const linkElm = useRef<HTMLAnchorElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const fringeRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const engraveRef = useRef<HTMLDivElement>(null);

  const linkAllCard = () => {
    if (linkCard) {
      linkElm.current?.click();
    }
  };

  // Construye niebla/partículas (y extras por tema) — solo en cliente, tras el montaje
  useEffect(() => {
    const dens = density ?? 10;
    const tFactor = tendrilsFactor ?? 0.45;
    const sFactor = soulsFactor ?? 0.6;
    const sizeMin = soulSizeMin ?? 1;
    const sizeMax = soulSizeMax ?? 2.4;

    const fx = fxRef.current;
    if (fx) {
      fx.innerHTML = "";
      const tendrilCount = Math.round(dens * tFactor);
      for (let i = 0; i < tendrilCount; i++) {
        const t = document.createElement("span");
        t.className = "tendril";
        const x = theme === "solo" ? rnd(18, 62) : rnd(-12, 92);
        t.style.cssText =
          `--x:${x.toFixed(1)}%;--w:${(rnd(14, 46) | 0)}%;--blur:${(rnd(12, 26) | 0)}px;` +
          `--sway:${(rnd(-26, 26) | 0)}px;--dur:${rnd(2.6, 5.2).toFixed(2)}s;--delay:${rnd(0, 3).toFixed(2)}s`;
        fx.appendChild(t);
      }
      const soulCount = Math.round(dens * 2 * sFactor);
      for (let i = 0; i < soulCount; i++) {
        const s = document.createElement("span");
        s.className = "soul";
        s.style.cssText =
          `--x:${rnd(2, 96).toFixed(1)}%;--s:${rnd(sizeMin, sizeMax).toFixed(1)}px;` +
          `--sway:${(rnd(-40, 40) | 0)}px;--dist:${(rnd(120, 340) | 0)}px;` +
          `--dur:${rnd(3, 6.5).toFixed(2)}s;--delay:${rnd(0, 4).toFixed(2)}s`;
        fx.appendChild(s);
      }
    }

    if (theme === "solo" && fringeRef.current) {
      const fringe = fringeRef.current;
      fringe.innerHTML = "";
      const n = fringeCount ?? 16;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd(-0.08, 0.08);
        const w = document.createElement("span");
        w.className = "wisp";
        w.style.cssText =
          `--x:${(50 + 50 * Math.cos(a)).toFixed(1)}%;--y:${(50 + 50 * Math.sin(a)).toFixed(1)}%;` +
          `--w:${(rnd(26, 52) | 0)}px;--h:${(rnd(34, 66) | 0)}px;` +
          `--rot:${((a * 180) / Math.PI + 90).toFixed(1)}deg;--tw:${rnd(-12, 12).toFixed(0)}deg;` +
          `--dur:${rnd(1.8, 3.6).toFixed(2)}s;--delay:${rnd(0, 1.8).toFixed(2)}s`;
        fringe.appendChild(w);
      }
    }

    if (theme === "madrid" && confettiRef.current) {
      const conf = confettiRef.current;
      conf.innerHTML = "";
      const h = imgWrapRef.current?.clientHeight || 440;
      const colors = parseColorList(confettiColors);
      for (let i = 0; i < Math.round(dens * (confettiFactor ?? 3.2)); i++) {
        const streamer = Math.random() < 0.25;
        const c = document.createElement("i");
        c.style.cssText =
          `--x:${rnd(-4, 102).toFixed(1)}%;` +
          `--w:${streamer ? 2 : rnd(3, 6).toFixed(1)}px;` +
          `--h:${streamer ? (rnd(14, 26) | 0) : rnd(5, 10).toFixed(1)}px;` +
          `--col:${colors[(Math.random() * colors.length) | 0]};` +
          `--sway:${(rnd(-34, 34) | 0)}px;--spin:${(rnd(-900, 900) | 0)}deg;` +
          `--dist:${(h + 60) | 0}px;` +
          `--dur:${rnd(2.6, 5.4).toFixed(2)}s;--delay:${rnd(0, 4).toFixed(2)}s`;
        conf.appendChild(c);
      }
    }

    if (theme === "lotr" && engraveRef.current) {
      engraveRef.current.querySelectorAll<SVGGeometryElement>(".draw").forEach((el) => {
        try {
          el.style.setProperty("--len", el.getTotalLength().toFixed(1));
        } catch {
          el.style.setProperty("--len", "600");
        }
      });
    }
  }, [theme, density, tendrilsFactor, soulsFactor, soulSizeMin, soulSizeMax, fringeCount, confettiFactor, confettiColors]);

  return (
    <Section
      {...rest}
      className="u-card relative overflow-hidden cursor-pointer"
      containerClassName="flex flex-col h-full"
      data-theme={theme || "origin"}
      onMouseEnter={()=>{setIsHover(true)}}
      onMouseLeave={()=>{setIsHover(false)}}
      style={
        {
          "--fx-intensity": fxIntensity ?? 1,
          "--fx-speed": fxSpeed ?? 1,
          "--fx-lift": `${fxLift ?? 8}px`,
          // Paleta del universo — pisa la del tema (--c1 aura, --c2 tinte, --c3 velo, --c4 acento)
          ...(auraColor ? { "--c1": auraColor } : {}),
          ...(tintColor ? { "--c2": tintColor } : {}),
          ...(veilColor ? { "--c3": veilColor } : {}),
          ...(accentColor ? { "--c4": accentColor } : {}),
          "--aura": auraStrength ?? 0.75,
          "--smoke": smokeStrength ?? 0.7,
        } as CSSProperties
      }
      onClick={linkAllCard}
    >
      <div
        className="universe-img relative"
        ref={imgWrapRef}
        style={{
          aspectRatio:
            calculateAspectRatio(image, imageAspectRatio) ??
            (imageAspectRatio && imageAspectRatio !== "adapt" ? imageAspectRatio : "3/4"),
          width:"100%",
          height:smallHeight ? imgHeight:"auto",
          overflow: "hidden",
        }}
      >
        {/* Esqueleto de precarga — visible hasta que la imagen real termine de cargar */}
        {!imageLoaded && <Skeleton className="absolute inset-0 rounded-none bg-white/10" />}
        <img
          src={image.url}
          className={cn(
            "u-img h-full rounded-(--radius) z-10",
            imgFit =="contain" && "object-contain",
            imgFit =="cover" && "object-cover",
            imgFit =="fill" && "object-fill",
            imgFit =="none" && "object-none",
            smallHeight && "absolute top-[50%]"
           )
          }
          style={
            {
              aspectRatio:calculateAspectRatio(image, imageAspectRatio),
              // El hover en card-universes.css compone su propio transform (scale) sobre
              // esta variable, en vez de pisarlo — así el centrado vertical no se pierde al hacer hover.
              "--img-translate": smallHeight ? "translateY(-50%) scale(0.8)" : "none",
            } as CSSProperties
          }
          onLoad={() => setImageLoaded(true)}
          alt={image.altText}
        />

        <div className="fx-veil" />
        <div className="fx" ref={fxRef} />

        {theme === "lotr" && (
          <div className="engrave" ref={engraveRef}>
            <svg viewBox="0 0 200 300">
              <path className="draw" d="M46 286 V142" strokeWidth="1" style={{ "--delay": ".1s", "--dur": "2.4s" } as CSSProperties} />
              <path className="draw" d="M154 286 V142" strokeWidth="1" style={{ "--delay": ".1s", "--dur": "2.4s" } as CSSProperties} />
              <path className="draw" d="M46 142 A54 54 0 0 1 154 142" strokeWidth="1" style={{ "--delay": ".5s", "--dur": "2.6s" } as CSSProperties} />
              <path className="draw" d="M52 286 H148" strokeWidth=".7" opacity=".55" style={{ "--delay": ".9s", "--dur": "2.2s" } as CSSProperties} />
              <path
                className="draw"
                d="M100 106 L104.1 119.4 L117.2 114.3 L109.3 125.9 L121.5 132.9 L107.4 133.9 L109.6 147.8 L100 137.5 L90.5 147.8 L92.6 133.9 L78.6 132.9 L90.7 125.9 L82.8 114.3 L95.9 119.4 Z"
                strokeWidth=".9"
                style={{ "--delay": "1.2s", "--dur": "2.8s" } as CSSProperties}
              />
              <circle className="draw" cx="81.1" cy="103.9" r="1.6" strokeWidth="1" opacity=".7" style={{ "--delay": "2s", "--dur": ".8s" } as CSSProperties} />
              <circle className="draw" cx="100" cy="100" r="2" strokeWidth="1" style={{ "--delay": "2.1s", "--dur": ".8s" } as CSSProperties} />
              <circle className="draw" cx="118.9" cy="103.9" r="1.6" strokeWidth="1" opacity=".7" style={{ "--delay": "2.2s", "--dur": ".8s" } as CSSProperties} />
            </svg>
          </div>
        )}

        {theme === "clover" && (
          <>
            <div className="pulse" />
            <div className="slashes">
              <span className="scar" style={{ "--t": "34%", "--rot": "-34deg", "--delay": ".00s" } as CSSProperties} />
              <span className="slash" style={{ "--t": "34%", "--h": "3px", "--rot": "-34deg", "--delay": ".00s" } as CSSProperties} />
              <span className="scar" style={{ "--t": "52%", "--rot": "-28deg", "--delay": ".14s" } as CSSProperties} />
              <span className="slash" style={{ "--t": "52%", "--h": "2px", "--rot": "-28deg", "--delay": ".14s" } as CSSProperties} />
              <span className="scar" style={{ "--t": "68%", "--rot": "-40deg", "--delay": ".26s" } as CSSProperties} />
              <span className="slash" style={{ "--t": "68%", "--h": "4px", "--rot": "-40deg", "--delay": ".26s" } as CSSProperties} />
            </div>
          </>
        )}

        {theme === "solo" && (
          <>
            <div className="gate">
              <div className="maw" />
              <div className="fringe" ref={fringeRef} />
              <div className="rim" />
              <div className="seam" />
            </div>
            <div className="brackets">
              <span style={{ "--i": 0 } as CSSProperties} />
              <span style={{ "--i": 1 } as CSSProperties} />
              <span style={{ "--i": 2 } as CSSProperties} />
              <span style={{ "--i": 3 } as CSSProperties} />
            </div>
          </>
        )}

        {theme === "madrid" && (
          <>
            <div className="floods">
              <span className="flood" style={{ "--x": "-8%", "--w": "26%", "--rot": "9deg", "--delay": "0s", "--fdur": "3.1s" } as CSSProperties} />
              <span className="flood" style={{ "--x": "24%", "--w": "22%", "--rot": "3deg", "--delay": ".12s", "--fdur": "2.4s" } as CSSProperties} />
              <span className="flood" style={{ "--x": "54%", "--w": "24%", "--rot": "-4deg", "--delay": ".24s", "--fdur": "3.6s" } as CSSProperties} />
              <span className="flood" style={{ "--x": "80%", "--w": "26%", "--rot": "-10deg", "--delay": ".34s", "--fdur": "2.8s" } as CSSProperties} />
            </div>
            <div className="turf" />
            <div className="confetti" ref={confettiRef} />
          </>
        )}

        <div className="grain" />
        {whisperText && <div className="whisper">{whisperText}</div>}
      </div>

      <div
        className="universe-content flex flex-col"
        style={{
          borderTop: "1px solid #ffffff08",
          flexGrow: 1,
          ...selectorPaddingMargin("padding", paddingSelect, paddingText),
        }}
      >
        <div
          className="u-badge"
          style={{
            color: isHover ? accentColor:stColor,
            fontFamily: stFamily,
            fontSize: stSize,
            fontWeight: stWeight,
            textTransform: stUpper ? "uppercase" : "unset",
            letterSpacing: stLetter > 0 ? `${stLetter}px` : "normal",
            ...selectorPaddingMargin("padding", stPaddingSelect, stPaddingText),
            ...selectorPaddingMargin("margin", stMarginSelect, stMarginText),
          }}
        >
          {subheading}
        </div>
        <h3
          className="u-title"
          data-text={heading}
          style={
            {
              color: tColor,
              fontFamily: tFamily,
              fontSize: tSize,
              fontWeight: tWeight,
              textTransform: tUpper ? "uppercase" : "unset",
              "--t-letter": tLetter > 0 ? `${tLetter}px` : "0px",
              ...selectorPaddingMargin("padding", tPaddingSelect, tPaddingText),
              ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
            } as CSSProperties
          }
        >
          {heading}
        </h3>
        <p
          className="u-desc"
          style={{
            color: pColor,
            fontFamily: pFamily,
            fontSize: pSize,
            fontWeight: pWeight,
            textTransform: pUpper ? "uppercase" : "unset",
            letterSpacing: pLetter > 0 ? `${pLetter}px` : "normal",
            ...selectorPaddingMargin("padding", pPaddingSelect, pPaddingText),
            ...selectorPaddingMargin("margin", pMarginSelect, pMarginText),
            lineHeight: "1.6",
            flexGrow: "1",
          }}
        >
          {paragraph}
        </p>
        <Link
          ref={linkElm}
          to={link}
          className="u-link"
          style={{
            color: lColor,
            fontFamily: lFamily,
            fontSize: lSize,
            fontWeight: lWeight,
            textTransform: lUpper ? "uppercase" : "unset",
            letterSpacing: lLetter > 0 ? `${lLetter}px` : "normal",
            ...selectorPaddingMargin("padding", lPaddingSelect, lPaddingText),
            ...selectorPaddingMargin("margin", lMarginSelect, lMarginText),
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width:"fit-content"
          }}
        >
          {linkText}
          {linkDecoration && (
            <span
              className="u-link-icon h-full w-auto"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: linkDecoration }}
            />
          )}
        </Link>
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "card-universe",
  title: "Card Universe",
  settings: [
    {
      group: "general",
      inputs: [
        {
          type: "select",
          label: "Padding type",
          name: "paddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "paddingText",
          defaultValue: "2.5rem 1.5rem",
        },
        {
          type: "image",
          label: "imagen",
          name: "image",
          defaultValue: {
            url: IMAGES_PLACEHOLDERS.product_11,
            altText: "Alt text",
            width: 900,
            height: 900,
          },
        },
        {
          type:'switch',
          label:'small height image',
          name:'smallHeight',
          defaultValue:true,
        },
        {
          type:'text',
          label:'img container height',
          name:'imgHeight',
          defaultValue:'auto',
          condition:(data:CardUniverseProps)=>data.smallHeight==true
        },
        {
          type:'select',
          label:'imagen fit',
          name:'imgFit',
          configs:{
            options:[
              {value:'fill',label:'fill'},
              {value:'contain',label:'contain'},
              {value:'cover',label:'cover'},
              {value:'none',label:'none'},
            ]
          },
          defaultValue:"contain",
        },
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Image aspect ratio",
          defaultValue: "adapt",
          configs: {
            options: [
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
              { value: "16/9", label: "Widescreen (16/9)" },
            ],
          },
          helpText:
            'Learn more about image <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" target="_blank" rel="noopener noreferrer">aspect ratio</a> property.',
        },
        {
          type: "text",
          label: "subheading",
          name: "subheading",
          defaultValue: "subheading",
        },
        {
          type: "text",
          label: "heading",
          name: "heading",
          defaultValue: "heading",
        },
        {
          type: "text",
          label: "paragraph",
          name: "paragraph",
          defaultValue:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit ante porttitor fermentum, cum porta odio in quis tincidunt laoreet mollis pretium, urna commodo aenean class nisi cursus per dignissim etiam. ",
        },
        {
          type: "text",
          label: "link text",
          name: "linkText",
          defaultValue: "linkText",
        },
        {
          type: "url",
          label: "link url",
          name: "link",
          defaultValue: "/products",
        },
        {
          type: "switch",
          label: "link card",
          name: "linkCard",
          defaultValue: false,
        },
        {
          type: "textarea",
          label: "link decoration",
          name: "linkDecoration",
          defaultValue: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>`,
        },
      ],
    },
    {
      group: "Efecto de universo",
      inputs: [
        {
          type: "select",
          label: "Tema",
          name: "theme",
          configs: {
            options: [
              { value: "origin", label: "Origin — barrido limpio" },
              { value: "lotr", label: "Lord of the Rings — grabados" },
              { value: "clover", label: "Black Clover — tajos" },
              { value: "solo", label: "Solo Leveling — portal" },
              { value: "madrid", label: "Real Madrid — focos" },
            ],
          },
          defaultValue: "origin",
        },
        {
          type: "text",
          label: "Texto susurro (whisper)",
          name: "whisperText",
          defaultValue: "",
          helpText: "Palabra que aparece centrada arriba de la imagen al hacer hover. Déjalo vacío para ocultarlo.",
        },
        {
          type: "range",
          label: "Intensidad del efecto",
          name: "fxIntensity",
          defaultValue: 1,
          configs: { min: 0, max: 1.4, step: 0.05 },
        },
        {
          type: "range",
          label: "Velocidad del efecto",
          name: "fxSpeed",
          defaultValue: 1,
          configs: { min: 0.4, max: 2, step: 0.05 },
        },
        {
          type: "range",
          label: "Elevación al hacer hover",
          name: "fxLift",
          defaultValue: 8,
          configs: { min: 0, max: 20, step: 1, unit: "px" },
        },
        {
          type: "range",
          label: "Densidad de partículas",
          name: "density",
          defaultValue: 10,
          configs: { min: 3, max: 20, step: 1 },
        },
        {
          type: "range",
          label: "Cantidad de niebla (tendrils)",
          name: "tendrilsFactor",
          defaultValue: 0.45,
          configs: { min: 0, max: 1.5, step: 0.05 },
          helpText: "Multiplica la densidad de partículas para generar más o menos niebla ascendente.",
        },
        {
          type: "range",
          label: "Cantidad de partículas (souls)",
          name: "soulsFactor",
          defaultValue: 0.6,
          configs: { min: 0, max: 2, step: 0.05 },
        },
        {
          type: "range",
          label: "Tamaño mínimo de partícula",
          name: "soulSizeMin",
          defaultValue: 1,
          configs: { min: 0.5, max: 4, step: 0.1, unit: "px" },
        },
        {
          type: "range",
          label: "Tamaño máximo de partícula",
          name: "soulSizeMax",
          defaultValue: 2.4,
          configs: { min: 0.5, max: 6, step: 0.1, unit: "px" },
        },
        {
          type: "range",
          label: "Lenguas de sombra (portal)",
          name: "fringeCount",
          defaultValue: 16,
          configs: { min: 0, max: 30, step: 1 },
          condition: (data: CardUniverseProps) => data.theme === "solo",
          helpText: "Solo aplica con el tema Solo Leveling.",
        },
        {
          type: "range",
          label: "Cantidad de confeti",
          name: "confettiFactor",
          defaultValue: 3.2,
          configs: { min: 0, max: 6, step: 0.1 },
          condition: (data: CardUniverseProps) => data.theme === "madrid",
          helpText: "Solo aplica con el tema Real Madrid.",
        },
        {
          type: "text",
          label: "Colores del confeti",
          name: "confettiColors",
          defaultValue: "#ffffff,#f7f7fa,#f7d97a,#c9a227,#ffffff,#e8c65a",
          condition: (data: CardUniverseProps) => data.theme === "madrid",
          helpText: "Lista de colores hexadecimales separados por coma. Solo aplica con el tema Real Madrid.",
        },
      ],
    },
    {
      group: "Paleta del universo",
      inputs: [
        {
          type: "color",
          label: "Color de aura (--c1)",
          name: "auraColor",
          defaultValue: "#5b6472",
          helpText: "Pisa el color de aura del tema seleccionado. Se usa en el brillo del borde y la niebla.",
        },
        {
          type: "color",
          label: "Color de tinte (--c2)",
          name: "tintColor",
          defaultValue: "#1b1f26",
        },
        {
          type: "color",
          label: "Color de velo (--c3)",
          name: "veilColor",
          defaultValue: "#0a0c10",
        },
        {
          type: "color",
          label: "Color de acento (--c4)",
          name: "accentColor",
          defaultValue: "#e6e9ef",
          helpText: "Color de las partículas, grabados, badge y subrayado del link al hacer hover.",
        },
        {
          type: "range",
          label: "Intensidad del aura",
          name: "auraStrength",
          defaultValue: 0.75,
          configs: { min: 0, max: 1, step: 0.05 },
        },
        {
          type: "range",
          label: "Intensidad de la niebla",
          name: "smokeStrength",
          defaultValue: 0.7,
          configs: { min: 0, max: 1, step: 0.05 },
        },
      ],
    },
    {
      group: "Subheading",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "stColor",
          defaultValue: "#71717A",
        },
        {
          type: "text",
          label: "Font size",
          name: "stSize",
          defaultValue: "0.65rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "stLetter",
          defaultValue: 1,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "stUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "stFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "stWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        {
          type: "select",
          label: "Padding type",
          name: "stPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "stPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "stMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin value",
          name: "stMarginText",
          defaultValue: "0.8rem",
        },
      ],
    },
    {
      group: "heading",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "tColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Font size",
          name: "tSize",
          defaultValue: "0.8rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "tLetter",
          defaultValue: 1,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "tUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "tFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "tWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "400",
        },
        {
          type: "select",
          label: "Padding type",
          name: "tPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "tPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "tMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin value",
          name: "tMarginText",
          defaultValue: "0.8rem",
        },
      ],
    },
    {
      group: "paragraph",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "pColor",
          defaultValue: "#A1A1AA",
        },
        {
          type: "text",
          label: "Font size",
          name: "pSize",
          defaultValue: "0.8rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "pLetter",
          defaultValue: 0,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "pUpper",
          defaultValue: false,
        },
        {
          type: "text",
          label: "Font family",
          name: "pFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "pWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "300",
        },
        {
          type: "select",
          label: "Padding type",
          name: "pPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "pPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "pMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "b",
        },
        {
          type: "text",
          label: "Margin value",
          name: "pMarginText",
          defaultValue: "2rem",
        },
      ],
    },
    {
      group: "Link",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "lColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Font size",
          name: "lSize",
          defaultValue: "0.75rem",
        },
        {
          type: "range",
          label: "Letter spacing",
          name: "lLetter",
          defaultValue: 2,
          configs: {
            min: 0,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "switch",
          label: "Uppercase",
          name: "lUpper",
          defaultValue: true,
        },
        {
          type: "text",
          label: "Font family",
          name: "lFamily",
          defaultValue: "Montserrat",
        },
        {
          type: "select",
          label: "Font weight",
          name: "lWeight",
          configs: {
            options: [
              { value: "100", label: "100" },
              { value: "200", label: "200" },
              { value: "300", label: "300" },
              { value: "400", label: "400" },
              { value: "500", label: "500" },
              { value: "600", label: "600" },
              { value: "700", label: "700" },
              { value: "800", label: "800" },
              { value: "900", label: "900" },
            ],
          },
          defaultValue: "600",
        },
        {
          type: "select",
          label: "Padding type",
          name: "lPaddingSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Padding value",
          name: "lPaddingText",
        },
        {
          type: "select",
          label: "Margin type",
          name: "lMarginSelect",
          configs: {
            options: [
              { value: "t", label: "Top" },
              { value: "b", label: "Bottom" },
              { value: "x", label: "Inline" },
              { value: "y", label: "Block" },
              { value: "a", label: "Custom" },
            ],
          },
          defaultValue: "a",
        },
        {
          type: "text",
          label: "Margin value",
          name: "lMarginText",
        },
      ],
    },
  ],
});
