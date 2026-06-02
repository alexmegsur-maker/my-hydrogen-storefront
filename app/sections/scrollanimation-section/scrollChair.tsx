import { useRef, useLayoutEffect, useState, type CSSProperties, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  updateImageCanva,
  calcularAnchoEscalado,
} from "~/utils/general";
import {
  createSchema,
  type WeaverseImage,
  type ComponentLoaderArgs,
  useParentInstance,
  useItemInstance,
} from "@weaverse/hydrogen";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
}: {
  clase: string;
  img: string;
  estilo: CSSProperties;
  estiloImg: CSSProperties;
}) {
  return (
    <div className={clase} style={estilo}>
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
          stroke="#CCCCCC"
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

// ---------------------------------------------------------------------------
// ChairSection
// ---------------------------------------------------------------------------

export default function ChairSection(props: ChairSectionProps) {
  const actualFrameRef = useRef(0);

  const {
    loaderData,
    index = 0,
    isLast = false,
  } = props;

  // SUPERPOSICIÓN: el primer elemento tiene z-index más alto.
  // index=0 → z-index:10, index=1 → z-index:9, etc.
  const zIndex = 30 - index;

  const titulo       = loaderData?.titulo       ?? "";
  const imgTitulo    = loaderData?.imgTitulo;
  const subtitle     = loaderData?.subtitle     ?? "";
  const description  = loaderData?.description  ?? "";
  const button_text  = loaderData?.button_text  ?? "Comprar ahora";
  const link         = loaderData?.link         ?? "#";
  const imagenes     = loaderData?.imagenes     ?? [];
  const imagenes_360 = loaderData?.imagenes_360 ?? [];

  const numImg = imagenes_360.length;

  const imgsPreloadRef = useRef<HTMLImageElement[]>([]);
  const ctxCanvasRef   = useRef<CanvasRenderingContext2D | null>(null);

  const chairContainer  = useRef<HTMLDivElement>(null);
  const canvasContainer = useRef<HTMLDivElement>(null);
  const infoContent     = useRef<HTMLDivElement>(null);
  const canvas          = useRef<HTMLCanvasElement>(null);
  const overlayCanvas   = useRef<HTMLDivElement>(null);
  const [position,setPosition]=useState(0)
  const [last,setLast]=useState(false)

  const parentInstance  = useParentInstance()
  const selfInstance = useItemInstance()
  useEffect(()=>{
    console.log("parentInstance",parentInstance)
    console.log("parentInstance.data",parentInstance.data)
    console.log("selfInstance",selfInstance)
    console.log("selfInstance.data",selfInstance.data)
    parentInstance.data.children.map((child,index)=>{
      if(child.id ==selfInstance.data.id){
        setPosition(index)
        console.log("index",index)
      }
    })
    
  },[parentInstance])

  // ── Pre-cargar frames 360 e inicializar canvas ───────────────────────────

  useLayoutEffect(() => {
    if (!canvas.current || imagenes_360.length === 0) return;

    const imgs: HTMLImageElement[] = imagenes_360.map((wi) => {
      const el = new Image();
      el.src = toUrl(wi);
      return el;
    });
    imgsPreloadRef.current = imgs;
    ctxCanvasRef.current = canvas.current.getContext("2d");
    const ctx = ctxCanvasRef.current;

    let width  = window.innerWidth;
    let height = window.innerHeight;

    if (height > 910 && height < 2000) height = height + height / 9;

    if (width < 700) {
      const heroImg = document.querySelector<HTMLImageElement>(".hero-fondo");
      if (heroImg) {
        calcularAnchoEscalado(heroImg).then((scaleWidth: number) => {
          width = scaleWidth;
          if (!canvas.current) return;
          canvas.current.width  = width;
          canvas.current.height = height + height * 0.1;
          imgs[0].onload = () =>
            updateImageCanva(ctx, width, height, imgsPreloadRef.current);
        });
        return;
      }
    }

    canvas.current.width  = width;
    canvas.current.height = height;
    imgs[0].onload = () =>
      updateImageCanva(ctx, width, height, imgsPreloadRef.current);
  }, [imagenes_360, index]);

  // ── GSAP scroll animation ─────────────────────────────────────────────────

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)
      if (!chairContainer.current) return;

      const isMobile = window.innerWidth < 700;

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
            if (inf) inf.style.transform = "translate(0, 100vh)";
          }

          // ── FASE 2 (0.3 → 0.6): rotación 360 en canvas ──────────────────
          if (p > 0.3 && p <= 0.6) {
            const t          = (p - 0.3) / 0.3; // 0 → 1
            const frameIndex = Math.min(
              Math.round(t * (numImg - 1)),
              numImg - 1
            );

            if (frameIndex !== actualFrameRef.current) {
              actualFrameRef.current = frameIndex;

              if (imgsPreloadRef.current[frameIndex]?.complete && cvs && ctx) {
                if (isMobile) {
                  const heroImg =
                    document.querySelector<HTMLImageElement>(".hero-fondo");
                  if (heroImg) {
                    const pct      = (100 * window.innerHeight) / heroImg.naturalHeight;
                    const newWidth = (heroImg.naturalWidth * pct) / 100;
                    cvs.width  = Math.round(newWidth);
                    cvs.height = window.innerHeight;
                  }
                }
                updateImageCanva(
                  ctx,
                  cvs.width,
                  cvs.height,
                  imgsPreloadRef.current,
                  frameIndex
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
            inf.style.transform = `translate(0, ${topVh}vh)`;
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
        zIndex,
        position: "relative",
        // FIX: altura fija para que ScrollTrigger pueda medir el recorrido
        height: "400vh",
        // overflow: "hidden",
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
          width: "100vw",
          // FIX: 100vh (no 200vh)
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
          }}
        />
        <div
          className="overlay-canvas"
          ref={overlayCanvas}
          style={{
            position: "absolute",
            width: "100vw",
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
          transform: "translate(0, 100vh)",
          display: "grid",
          gridTemplateColumns: "repeat(12,1fr)",
          gap: "25px",
          paddingInline: "13vw",
        }}
      >
        {/* Section 1 */}
        <div
          className="section-1 wrapContent-6fr"
          style={{
            gridColumn: "span 6",
            gap: "25px",
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
          }}
        >
          <div
            className="title"
            style={{
              gridColumn: "2/span 5",
              textAlign: "left",
              fontFamily: "'EB Garamond',serif",
              direction: "ltr",
              width: "100%",
              display: "flex",
              height: "auto",
              alignItems: "center",
              fontSize: "4rem",
              textTransform: "uppercase",
            }}
          >
            {titleImgUrl ? (
              <img src={titleImgUrl} alt={titulo || "titulo"} />
            ) : (
              <h2>{titulo}</h2>
            )}
          </div>
          <div
            className="sub-container"
            style={{
              gridColumn: "2 / span 4",
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
                fontFamily: "'EB Garamond',serif",
                direction: "ltr",
                fontSize: "45px",
                lineHeight: "1.1",
                color: "red",
                fontWeight: "600",
              }}
            >
              {subtitle}
            </h3>
            <p
              className="description"
              style={{
                textAlign: "left",
                fontSize: "25px",
                lineHeight: "1.3",
                fontFamily: "Helvetica,sans-serif",
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
                  width: "calc(100% + 13vw)",
                  position: "relative",
                  border: "0 solid transparent",
                  transition:
                    "border-width .6s ease, border-color .3s ease .3s",
                }}
                estiloImg={{
                  objectPosition: "50% center",
                }}
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
              />
            )}
            <div
              className="boton-compra botton-desktop"
              style={{
                backgroundColor: "#2e2e2e",
                border: "1px solid #fef289",
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
                  fontSize: "18px",
                  color: "#fef289",
                  fontWeight: "900",
                  fontFamily: "'EB Garamond', serif",
                }}
              >
                {button_text}
              </a>
            </div>
          </div>
        </div>
      </div>
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
      group: "General",
      inputs: [
        {
          type: "text",
          label: "Handle del metaobjeto",
          name: "metaobject",
          defaultValue: "",
          placeholder: "ej: rivendell",
        },
      ],
    },
  ],
});