import { useRef, useLayoutEffect, useState, useEffect, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { updateImageCanva } from "~/utils/general";
import {
  createSchema,
  type WeaverseImage,
  type ComponentLoaderArgs,
  useParentInstance,
  useItemInstance,
} from "@weaverse/hydrogen";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { useLenis } from "lenis/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChairSectionLoaderData {
  titulo?: string;
  imgTitulo?: WeaverseImage;
  subtitle?: string;
  description?: string;
  button_text?: string;
  link?: string;
  imagenes?: WeaverseImage[];
  imagenes_360?: WeaverseImage[];
}

interface ChairSectionProps extends ChairSectionLoaderData {
  loaderData: ChairSectionLoaderData | null;
  metaobject: string;

  index?: number;
  isLast?: boolean;
  changePosition:boolean;
  // Estilos — Título
  decoration?:string;
  tituloFamily?: string;
  tituloSize?: string;
  tituloColor?: string;
  tituloWeight?: string;
  // Estilos — Subtítulo
  subtitleColor?: string;
  subtitleSize?: string;
  subtitleFamily?: string;
  subtitleWeight?: string;
  // Estilos — Descripción
  descColor?: string;
  descSize?: string;
  descFamily?: string;
  // Estilos — Botón
  btnTextColor?: string;
  btnBgColor?: string;
  btnBorderColor?: string;
  btnFontSize?: string;
  btnFontFamily?: string;
  // Imagen mobile
  mobileImagePosition?: number;
}

// ---------------------------------------------------------------------------
// GraphQL query
// ---------------------------------------------------------------------------

const CHAIR_METAOBJECT_QUERY = `#graphql
  query ChairMetaobject($handle: String!) {
    metaobject(handle: { handle: $handle, type: "scroll_chair" }) {
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image { url width height altText }
          }
        }
        references(first: 50) {
          nodes {
            ... on MediaImage {
              image { url width height altText }
            }
          }
        }
      }
    }
  }
` as const;

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

export const loader = async ({
  weaverse,
  data,
}: ComponentLoaderArgs<ChairSectionProps>) => {
  const { storefront } = weaverse;
  const handle = data?.metaobject;

  if (!handle) return null;

  try {
    const response = await storefront.query(CHAIR_METAOBJECT_QUERY, {
      variables: { handle },
    });

    if (!response?.metaobject) {
      console.warn(`[ChairSection] Metaobjeto no encontrado: "${handle}"`);
      return null;
    }

    const fieldsRaw: any[] = response.metaobject.fields;
    const formattedData: Record<string, any> = {};

    fieldsRaw.forEach((field: any) => {
      const key = field.key;
      if (field.references?.nodes?.length > 0) {
        formattedData[key] = field.references.nodes
          .map((node: any) => node.image)
          .filter(Boolean);
      } else if (field.reference?.image) {
        formattedData[key] = field.reference.image;
      } else {
        formattedData[key] = field.value;
      }
    });

    return formattedData as ChairSectionLoaderData;
  } catch (error) {
    console.error("[ChairSection] Error en loader:", error);
    return null;
  }
};

// ---------------------------------------------------------------------------
// Helper – normalizar WeaverseImage → string URL
// ---------------------------------------------------------------------------

function toUrl(img: WeaverseImage | undefined): string {
  if (!img) return "";
  return typeof img === "string" ? img : img.url;
}

// ---------------------------------------------------------------------------
// Imagen sub-componente
// ---------------------------------------------------------------------------

function Imagen({
  clase,
  img,
  estilo = null,
  estiloImg = null,
  onZoom,
}: {
  clase: string;
  img: string;
  estilo: CSSProperties;
  estiloImg: CSSProperties;
  onZoom?: (rect: DOMRect, objectPosition: string, naturalRatio: number) => void;
}) {
  return (
    <div
      className={clase}
      style={{ ...estilo, cursor: onZoom ? "zoom-in" : undefined }}
      onClick={(e) => {
        const div    = e.currentTarget as HTMLDivElement;
        const rect   = div.getBoundingClientRect();
        const imgEl  = div.querySelector("img") as HTMLImageElement | null;
        const objPos = imgEl ? window.getComputedStyle(imgEl).objectPosition : "center center";
        const naturalRatio =
          imgEl && imgEl.naturalWidth && imgEl.naturalHeight
            ? imgEl.naturalWidth / imgEl.naturalHeight
            : rect.width / rect.height;
        onZoom?.(rect, objPos, naturalRatio);
      }}
    >
      <img
        src={img}
        alt=""
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...estiloImg,
        }}
      />
      <Expandicon clase="expand-icon" />
    </div>
  );
}

function Expandicon({ clase }: { clase: string }) {
  return (
    <span
      className={clase}
      style={{
        width: "4em",
        height: "4em",
        position: "absolute",
        bottom: "1.5rem",
        right: "1.5rem",
        backgroundColor: "#050505",
        padding: "1em",
        borderRadius: "50%",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#ffffff"
          strokeWidth="0.048"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M14 10L21 3M21 3H16.5M21 3V7.5M10 14L3 21M3 21H7.5M3 21L3 16.5"
            stroke="#fff9cb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
    </span>
  );
}

function ZoomModal({
  src,
  rect,
  objectPosition,
  naturalRatio,
  onClose,
}: {
  src: string;
  rect: DOMRect;
  objectPosition: string;
  naturalRatio: number;
  onClose: () => void;
}) {
  const lenis       = useLenis();
  const overlayRef  = useRef<HTMLDivElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const tlRef       = useRef<gsap.core.Timeline | null>(null);

  const vw = typeof window !== "undefined" ? window.innerWidth : 800;
  const vh = typeof window !== "undefined" ? window.innerHeight : 600;
  const isMobileView = vw < 700;

  // Desktop: 90vw wide, height follows the NATURAL image ratio (not the source container)
  // so the animation morphs shape — not just a simple zoom
  // Mobile: full viewport width
  const finalW = isMobileView ? vw : Math.round(vw * 0.9);
  const finalH = Math.round(finalW / naturalRatio);
  const finalLeft = Math.round((vw - finalW) / 2);
  const finalTop  = Math.round((vh - finalH) / 2);

  function handleClose() {
    const tl  = tlRef.current;
    const img = imgRef.current;
    if (!tl) { onClose(); return; }
    // Revert to cover + original position before reversing so it matches the source
    if (img) {
      img.style.objectFit      = "cover";
      img.style.objectPosition = objectPosition;
    }
    tl.eventCallback("onReverseComplete", onClose);
    tl.reverse();
  }

  useEffect(() => {
    const overlay  = overlayRef.current;
    const wrapper  = wrapperRef.current;
    const img      = imgRef.current;
    const closeBtn = closeBtnRef.current;
    if (!overlay || !wrapper) return;

    lenis?.stop();

    const tl = gsap.timeline({
      onComplete: () => {
        // Once fully expanded, show the complete image
        if (img) {
          img.style.objectFit      = "contain";
          img.style.objectPosition = "center center";
        }
      },
    });
    tlRef.current = tl;

    tl.to(overlay,  { opacity: 1,                                                                   duration: 0.3,  ease: "power2.out"    }, 0)
      .to(wrapper,  { top: finalTop, left: finalLeft, width: finalW, height: finalH, duration: 0.45, ease: "power3.inOut" }, 0)
      .to(closeBtn, { opacity: 1,                                                                   duration: 0.2,  ease: "power1.out"    }, 0.3);

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      tl.kill();
    };
  }, []);

  return (
    <>
      {/* Dark backdrop */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          backgroundColor: "rgba(0,0,0,0.88)",
          opacity: 0,
          cursor: "zoom-out",
        }}
      />

      {/* Image wrapper — GSAP animates top/left/width/height from rect to final */}
      <div
        ref={wrapperRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          zIndex: 100000,
          overflow: "hidden",
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            display: "block",
          }}
        />
      </div>

      {/* Close button */}
      <button
        ref={closeBtnRef}
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        aria-label="Cerrar"
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          background: "rgba(0,0,0,0.55)",
          border: "none",
          color: "#fff",
          fontSize: "1.25rem",
          lineHeight: 1,
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          cursor: "pointer",
          opacity: 0,
          zIndex: 100001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// ChairSection
// ---------------------------------------------------------------------------

export default function ChairSection(props: ChairSectionProps) {
  const actualFrameRef = useRef(0);

  const {
    loaderData,
    index = 0,
    isLast = false,
    changePosition,
    tituloFamily = "'EB Garamond', serif",
    tituloSize = "4rem",
    tituloColor = "#fff",
    tituloWeight = "400",
    subtitleColor = "#fff",
    subtitleSize = "45px",
    subtitleFamily = "'EB Garamond', serif",
    subtitleWeight = "600",
    descColor = "#fff",
    descSize = "25px",
    descFamily = "Helvetica, sans-serif",
    btnTextColor = "#fef289",
    btnBgColor = "#2e2e2e",
    btnBorderColor = "#fef289",
    btnFontSize = "18px",
    btnFontFamily = "'EB Garamond', serif",
    mobileImagePosition = 50,
    decoration
  } = props;

  const titulo       = loaderData?.titulo       ?? "";
  const imgTitulo    = loaderData?.imgTitulo;
  const subtitle     = loaderData?.subtitle     ?? "";
  const description  = loaderData?.description  ?? "";
  const button_text  = loaderData?.button_text  ?? "Comprar ahora";
  const link         = loaderData?.link         ?? "#";
  const imagenes     = loaderData?.imagenes     ?? [];
  const imagenes_360 = loaderData?.imagenes_360 ?? [];

  const isMobile=useIsMobile(700)

  const numImg = imagenes_360.length;

  const imgsPreloadRef = useRef<HTMLImageElement[]>([]);
  const ctxCanvasRef   = useRef<CanvasRenderingContext2D | null>(null);

  const chairContainer  = useRef<HTMLDivElement>(null);
  const canvasContainer = useRef<HTMLDivElement>(null);
  const infoContent     = useRef<HTMLDivElement>(null);
  const canvas          = useRef<HTMLCanvasElement>(null);
  const overlayCanvas   = useRef<HTMLDivElement>(null);
  const [zIndex,setZindex]=useState(10)
  const [last,setLast]=useState(false)
  const [zoomTarget, setZoomTarget] = useState<{ src: string; rect: DOMRect; objectPosition: string; naturalRatio: number } | null>(null)

  const parentInstance  = useParentInstance()
  const selfInstance = useItemInstance()
  useEffect(()=>{
    console.log("parentInstance",parentInstance)
    console.log("parentInstance.data",parentInstance.data)
    console.log("selfInstance",selfInstance)
    console.log("selfInstance.data",selfInstance.data)
    parentInstance.data.children.map((child,index)=>{
      if(child.id ==selfInstance.data.id){
        let totalChildren =parentInstance.data.children.length - 1
        setZindex(state=>state +(totalChildren - index))
        console.log("index",index)    
        if(index == parentInstance.data.children.length-1){
          setLast(true)
        }
      }
    })

    
  },[parentInstance])

  // ── Pre-cargar frames 360 e inicializar canvas ───────────────────────────

  useLayoutEffect(() => {
    if (!canvas.current || imagenes_360.length === 0) return;
    console.log("imagenes_360",imagenes_360)
    const imgs: HTMLImageElement[] = imagenes_360.map((wi) => {
      const el = new Image();
      el.src = toUrl(wi);
      return el;
    });
    imgsPreloadRef.current = imgs;
    ctxCanvasRef.current = canvas.current.getContext("2d");
    const ctx = ctxCanvasRef.current;
    const firstImg = imgs[0];

    // ── MOBILE ────────────────────────────────────────────────────────────
    // El canvas se dimensiona con la RESOLUCIÓN REAL de la imagen ya
    // escalada para llenar el alto del teléfono (no el tamaño del viewport).
    // El ancho resultante suele ser mayor al ancho de pantalla — eso es
    // intencional, no se recorta en JS. El recorte/posición final lo
    // resuelve el CSS del <canvas> con object-fit:cover + object-position,
    // igual que haría un <img>.
    if (window.innerWidth < 700) {
      const setupMobileCanvas = () => {
        if (!canvas.current || !firstImg.naturalWidth || !firstImg.naturalHeight) return;

        const targetHeight = window.innerHeight;
        const scale         = targetHeight / firstImg.naturalHeight;
        const scaledWidth   = Math.round(firstImg.naturalWidth * scale);

        canvas.current.width  = scaledWidth;
        canvas.current.height = Math.round(targetHeight);

        updateImageCanva(
          ctx,
          canvas.current.width,
          canvas.current.height,
          imgsPreloadRef.current,
          0,
          "height"
        );
      };

      if (firstImg.complete && firstImg.naturalWidth) {
        setupMobileCanvas();
      } else {
        firstImg.onload = setupMobileCanvas;
      }
      return;
    }

    // ── DESKTOP ───────────────────────────────────────────────────────────
    // El canvas mide exactamente el viewport; cover centra sin deformar.
    let width  = window.innerWidth;
    let height = window.innerHeight;
    if (height > 910 && height < 2000) height = height + height / 9;

    canvas.current.width  = width;
    canvas.current.height = height;
    firstImg.onload = () =>
      updateImageCanva(ctx, width, height, imgsPreloadRef.current, 0, "cover");
  }, [imagenes_360, index]);

  // ── GSAP scroll animation ─────────────────────────────────────────────────

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)
      if (!chairContainer.current) return;

      // SUPERPOSICIÓN — el "start" se adelanta según el índice de la sección.
      //
      // La primera sección (index=0) empieza cuando su top toca el top del
      // viewport ("top top").
      //
      // Cada sección siguiente empieza ANTES de llegar al viewport:
      //   index=1 → "top 120%"  (entra cuando aún está 120vh por debajo)
      //   index=2 → "top 140%"
      //   …
      //
      // Esto hace que el canvas de la sección B ya esté animándose mientras
      // el infoContent de la sección A todavía está subiendo (Fase 3 de A).
      //
      // El offset es 100% + index * 20% para que el solapamiento sea
      // proporcional al índice, pero nunca menor que "top top" en el primer
      // elemento.
      const startOffset = index === 0 ? "top top" : `top ${100 + index * 20}%`;

      ScrollTrigger.create({
        trigger: chairContainer.current,
        start: startOffset,
        // FIX: end definido para que self.progress avance de 0 a 1
        end: "bottom bottom",
        // Pineamos solo el canvasContainer (el bloque sticky) no todo el section
        pin: canvasContainer.current,
        pinSpacing: false,
        scrub: 1,

        onUpdate: (self) => {
          const p   = self.progress;
          const ctx = ctxCanvasRef.current;
          const cvs = canvas.current;
          const ovl = overlayCanvas.current;
          const inf = infoContent.current;

          // ── FASE 1 (0 → 0.3): canvas aparece quitando blur, overlay desaparece ──
          if (p <= 0.3) {
            const t = p / 0.3; // 0 → 1
            if (cvs) {
              cvs.style.filter  = `blur(${(1 - t)}rem)`;
              // En secciones con index > 0 el canvas empieza invisible y
              // aparece gradualmente para crear la transición de superposición
              cvs.style.opacity = index > 0 ? String(t) : "1";
            }
            if (ovl) ovl.style.opacity = String(1 - t);
            // if (inf) inf.style.transform = "translate(0, 100vh)";
          }

          // ── FASE 2 (0.3 → 0.6): rotación 360 en canvas ──────────────────
          // El canvas ya quedó dimensionado correctamente (mobile o desktop)
          // en el useLayoutEffect inicial, así que acá solo dibujamos el
          // frame correspondiente — no se recalcula tamaño en cada frame.
          if (p > 0.3 && p <= 0.6) {
            const t          = (p - 0.3) / 0.3; // 0 → 1
            const frameIndex = Math.min(
              Math.round(t * (numImg - 1)),
              numImg - 1
            );

            if (frameIndex !== actualFrameRef.current) {
              actualFrameRef.current = frameIndex;

              if (imgsPreloadRef.current[frameIndex]?.complete && cvs && ctx) {
                updateImageCanva(
                  ctx,
                  cvs.width,
                  cvs.height,
                  imgsPreloadRef.current,
                  frameIndex,
                  isMobile ? "height" : "cover"
                );
              }
            }
          }

          // ── FASE 3 (0.6 → 1.0): infoContent sube, canvas se desvanece ───
          //
          // SUPERPOSICIÓN: cuando el infoContent de esta sección llega al 50%
          // de su recorrido ascendente (t ≈ 0.5), la sección siguiente ya
          // debería estar empezando gracias al startOffset adelantado.
          // El canvas de esta sección se desvanece a medida que el de la
          // siguiente se superpone encima (z-index mayor en la siguiente).
          if (p > 0.6 && inf && cvs) {
            const t          = (p - 0.6) / 0.4; // 0 → 1
            const invertProg = Math.max(0, 1 - t * 2.2); // 1 → 0 rápido
            const topVh      = 100 * invertProg;

            inf.style.background = `linear-gradient(180deg,
              rgba(0,0,0,0) 0%,
              rgba(17,17,23,${t}) 30%,
              var(--bg-primary) 70%,
              transparent 100%)`;
            // inf.style.transform = `translate(0, ${topVh}vh)`;
            cvs.style.opacity   = String(invertProg);
          }
        },
      });
    },
    { scope: chairContainer, dependencies: [numImg, isLast, index] }
  );

  // ── Resolver URLs de imágenes estáticas ──────────────────────────────────

  const img1        = toUrl(imagenes[0]);
  const img2        = toUrl(imagenes[1]);
  const img3        = toUrl(imagenes[2]);
  const titleImgUrl = toUrl(imgTitulo);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        // SUPERPOSICIÓN: z-index inverso al índice.
        // La primera sección (index=0) tiene z-index:10 y queda ENCIMA.
        // Las siguientes van por debajo hasta que su scroll las eleva.
        zIndex:zIndex,
        position: "relative",
        // FIX: altura fija para que ScrollTrigger pueda medir el recorrido
        height: last?"auto":"400vh",
      } as React.CSSProperties}
      ref={chairContainer}
    >
      {/* Canvas layer — sticky, permanece fijo durante los 400vh del scroll */}
      <div
        className="canvasContainer"
        ref={canvasContainer}
        style={{
          position: "sticky",
          top: 0,
          inset: 0,
          width: "100%",
          height: "100vh",
        }}
      >
        <canvas
          ref={canvas}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            // FIX: la entrada se maneja con blur (y opacity en index > 0)
            filter: "blur(1rem)",
            // index=0: empieza visible pero desenfocado
            // index>0: empieza invisible para el fundido de superposición
            opacity: index === 0 ? 1 : 0,
            // En mobile el bitmap del canvas es más ancho que la pantalla
            // (ver useLayoutEffect); object-fit + object-position deciden
            // qué sección horizontal se muestra, igual que en un <img>.
            objectFit: isMobile ? "cover" : undefined,
            objectPosition: isMobile ? `${mobileImagePosition}% center` : undefined,
          }}
        />
        <div
          className="overlay-canvas"
          ref={overlayCanvas}
          style={{
            position: "absolute",
            width: "100%",
            height: "100vh",
            top: 0,
            left: 0,
            backgroundColor: "#050505",
            transform: "scaleY(1.1)",
            opacity: 1,
          }}
        />
      </div>

      {/* Info layer */}
      <div
        className="infoContent"
        ref={infoContent}
        style={{
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          transform: last ? "unset":`translate(0, 120vh)`, 
          display: isMobile?"flex":"grid",
          flexDirection:isMobile?"column":"unset",
          gridTemplateColumns: "repeat(12,1fr)",
          gap: isMobile?"0px":"25px",
          paddingInline: isMobile ? "5%":"13vw",
          paddingTop:last ? "100vh":"unset",
          direction:changePosition?"rtl":"ltr"
        }}
      >
        {/* Section 1 */}
        <div
          className="section-1 wrapContent-6fr"
          style={{
            gridColumn: "span 6",
            gap: "25px",
            display: isMobile?"flex":"grid",
            flexDirection:isMobile?"column":"unset",
            gridTemplateColumns: "repeat(6,1fr)",
          }}
        >
          <div
            className="title"
            style={{
              gridColumn: "2/span 5",
              textAlign: "left",
              direction: "ltr",
              width: "100%",
              display: "flex",
              height: "auto",
              alignItems: "center",
              
              textTransform: "uppercase",
            }}
          >
            {titleImgUrl ? (
              <img src={titleImgUrl} alt={titulo || "titulo"} style={{ maxWidth: '100%', height: 'auto' }} />
            ) : (
              <h2 
                style={{
                  fontSize: tituloSize,
                  color: tituloColor,
                  fontWeight: tituloWeight,
                  fontFamily: tituloFamily,
                  display:"flex"
                }}
              >
                {titulo}
                {decoration &&
                  <span className="text-sm" style={{transform:"translateY(50%)"}}>
                    {decoration}
                  </span>
                }
              </h2>
            )}
          </div>
          <div
            className="sub-container"
            style={{
              gridColumn: changePosition ? "3 / span 4":"2 / span 4",
              marginBottom: "6vh",
              display: "flex",
              flexDirection: "column",
              gap: "3vh",
              direction: "ltr",
            }}
          >
            <h3
              className="subtitle"
              style={{
                textAlign: "left",
                fontFamily: subtitleFamily,
                direction: "ltr",
                fontSize: subtitleSize,
                lineHeight: "1.1",
                color: subtitleColor,
                fontWeight: subtitleWeight,
              }}
            >
              {subtitle}
            </h3>
            <p
              className="description"
              style={{
                textAlign: "left",
                fontSize: descSize,
                lineHeight: "1.3",
                fontFamily: descFamily,
                color: descColor,
              }}
            >
              {description}
            </p>
          </div>
          {img1 && (
            <Imagen
              clase="maskImg-1"
              img={img1}
              estilo={{
                aspectRatio: "9/16",
                gridColumn: "2 / span 5",
                position: "relative",
                border: "0 solid transparent",
                transition: "border-width .6s ease, border-color .3s ease .3s",
              }}
              estiloImg={{
                objectPosition: "center",
              }}
              onZoom={(rect, objectPosition, naturalRatio) => setZoomTarget({ src: img1, rect, objectPosition, naturalRatio })}
            />
          )}
        </div>

        {/* Section 2 */}
        <div
          className="section-2"
          style={{
            gridColumn: "span 6",
            paddingTop: "calc(100vh/6)",
          }}
        >
          <div
            className="wrapContent-6fr two-img-content"
            style={{
              display: "flex",
              gap: "25px",
              flexDirection: "column",
            }}
          >
            {img2 && (
              <Imagen
                clase="maskImg-2"
                img={img2}
                estilo={{
                  aspectRatio: "1/1",
                  width: isMobile ? "100%" : "calc(100% + 13vw)",
                  position: "relative",
                  border: "0 solid transparent",
                  transition:
                    "border-width .6s ease, border-color .3s ease .3s",
                }}
                estiloImg={{
                  objectPosition: "50% center",
                }}
                onZoom={(rect, objectPosition, naturalRatio) => setZoomTarget({ src: img2, rect, objectPosition, naturalRatio })}
              />
            )}
            {img3 && (
              <Imagen
                clase="maskImg-3"
                img={img3}
                estilo={{
                  aspectRatio: "1/1",
                  gridColumn: "span 5",
                  position: "relative",
                  border: "0 solid transparent",
                  transition:
                    "border-width .6s ease, border-color .3s ease .3s",
                }}
                estiloImg={{
                  objectPosition: "53% center",
                }}
                onZoom={(rect, objectPosition, naturalRatio) => setZoomTarget({ src: img3, rect, objectPosition, naturalRatio })}
              />
            )}
            <div
              className="boton-compra botton-desktop"
              style={{
                backgroundColor: btnBgColor,
                border: `1px solid ${btnBorderColor}`,
                gridColumn: "span 5",
                height: "4rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <a
                href={link}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "none",
                  fontSize: btnFontSize,
                  color: btnTextColor,
                  fontWeight: "900",
                  fontFamily: btnFontFamily,
                }}
              >
                {button_text}
              </a>
            </div>
          </div>
        </div>
      </div>
      {zoomTarget && (
        <ZoomModal
          src={zoomTarget.src}
          rect={zoomTarget.rect}
          objectPosition={zoomTarget.objectPosition}
          naturalRatio={zoomTarget.naturalRatio}
          onClose={() => setZoomTarget(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weaverse schema
// ---------------------------------------------------------------------------

export const schema = createSchema({
  title: "Scroll Chair",
  type: "scroll-chair",
  settings: [
    {
      group: "360 / Metaobject",
      inputs: [
        {
          type: "text",
          label: "Handle del metaobjeto",
          name: "metaobject",
          defaultValue: "",
          placeholder: "ej: rivendell",
        },
        {
          type:'switch',
          label:'change Position',
          name:'changePosition',
          defaultValue:false,
        },
      ],
    },
    {
  group: "Imagen — Mobile",
  inputs: [
    {
      type: "range",
      label: "Posición horizontal",
      name: "mobileImagePosition",
      defaultValue: 50,
      configs: { min: 0, max: 100, step: 1, unit: "%" },
    },
  ],
},
    {
      group: "Estilos — Título",
      inputs: [
        {
          type: "text",
          label: "decoration title",
          name: "decoration",
          defaultValue: "TM",
        },
        {
          type: "color",
          label: "Color",
          name: "tituloColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Tamaño de fuente",
          name: "tituloSize",
          defaultValue: "4rem",
        },
        {
          type: "text",
          label: "Familia de fuente",
          name: "tituloFamily",
          defaultValue: "'EB Garamond', serif",
        },
        {
          type: "select",
          label: "Peso de fuente",
          name: "tituloWeight",
          configs: {
            options: [
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
      ],
    },
    {
      group: "Estilos — Subtítulo",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "subtitleColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Tamaño de fuente",
          name: "subtitleSize",
          defaultValue: "45px",
        },
        {
          type: "text",
          label: "Familia de fuente",
          name: "subtitleFamily",
          defaultValue: "'EB Garamond', serif",
        },
        {
          type: "select",
          label: "Peso de fuente",
          name: "subtitleWeight",
          configs: {
            options: [
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
      ],
    },
    {
      group: "Estilos — Descripción",
      inputs: [
        {
          type: "color",
          label: "Color",
          name: "descColor",
          defaultValue: "#fff",
        },
        {
          type: "text",
          label: "Tamaño de fuente",
          name: "descSize",
          defaultValue: "25px",
        },
        {
          type: "text",
          label: "Familia de fuente",
          name: "descFamily",
          defaultValue: "Helvetica, sans-serif",
        },
      ],
    },
    {
      group: "Estilos — Botón",
      inputs: [
        {
          type: "color",
          label: "Color del texto",
          name: "btnTextColor",
          defaultValue: "#fef289",
        },
        {
          type: "color",
          label: "Color de fondo",
          name: "btnBgColor",
          defaultValue: "#2e2e2e",
        },
        {
          type: "color",
          label: "Color del borde",
          name: "btnBorderColor",
          defaultValue: "#fef289",
        },
        {
          type: "text",
          label: "Tamaño de fuente",
          name: "btnFontSize",
          defaultValue: "18px",
        },
        {
          type: "text",
          label: "Familia de fuente",
          name: "btnFontFamily",
          defaultValue: "'EB Garamond', serif",
        },
      ],
    },
    
  ],
});