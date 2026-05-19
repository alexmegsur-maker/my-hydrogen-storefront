import { useRef, useLayoutEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  preloadImgs,
  updateImageCanva,
  calcularAnchoEscalado,
} from "~/utils/general";
import { createSchema, type WeaverseImage } from "@weaverse/hydrogen";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Campos que expone el metaobjeto "chair_section" de Shopify.
 * Los nombres coinciden exactamente con las keys del metaobjeto
 * visibles en la imagen del inspector de Weaverse.
 */
interface ChairSectionData {
  /** Nombre / título de texto (ej: "rivendell™") */
  titulo?: string;
  /** Imagen usada como título (opcional, sustituye a `titulo`) */
  imgTitulo?: WeaverseImage;
  /** Subtítulo de la sección */
  subtitle: string;
  /** Párrafo descriptivo */
  description: string;
  /** Texto del botón CTA */
  button_text: string;
  /** URL de destino del botón */
  link: string;
  /** Las 3 imágenes estáticas (img1, img2, img3) */
  imagenes: WeaverseImage[];
  /** Frames para la animación 360 en canvas */
  imagenes_360: WeaverseImage[];
}

interface ChairSectionProps extends ChairSectionData {
  /** Posición en la lista apilada → controla z-index */
  index?: number;
  /** Si es la última sección del stack (afecta pinSpacing en móvil) */
  isLast?: boolean;
}

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

function Imagen({ clase, img }: { clase: string; img: string }) {
  return (
    <div className={clase}>
      <img src={img} alt="" loading="lazy" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChairSection
// ---------------------------------------------------------------------------

export default function ChairSection({
  titulo,
  imgTitulo,
  subtitle,
  description,
  button_text,
  link,
  imagenes = [],
  imagenes_360 = [],
  index = 0,
  isLast = false,
}: ChairSectionProps) {
  const [actualFrame, setActualFrame] = useState(0);
  const [zIndex, setZIndex] = useState(10);

  // Número de frames 360 disponibles
  const numImg = imagenes_360.length;

  const imgsPreloadRef = useRef<HTMLImageElement[]>([]);
  // ctxCanvas se mantiene como ref para no recrearlo en cada render
  const ctxCanvasRef = useRef<CanvasRenderingContext2D | null>(null);

  const chairContainer = useRef<HTMLElement>(null);
  const canvasContainer = useRef<HTMLDivElement>(null);
  const infoContent = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlayCanvas = useRef<HTMLDivElement>(null);

  // ── Pre-cargar frames 360 e inicializar canvas ───────────────────────────

  useLayoutEffect(() => {
    setZIndex(10 - index);

    if (!canvas.current || imagenes_360.length === 0) return;

    // Convertir WeaverseImage[] → HTMLImageElement[]
    const imgs: HTMLImageElement[] = imagenes_360.map((wi) => {
      const el = new Image();
      el.src = toUrl(wi);
      return el;
    });
    imgsPreloadRef.current = imgs;

    ctxCanvasRef.current = canvas.current.getContext("2d");
    const ctx = ctxCanvasRef.current;

    let width = window.innerWidth;
    let height = window.innerHeight;

    if (height > 910 && height < 2000) {
      height = height + height / 9;
    }

    if (width < 700) {
      const heroImg = document.querySelector<HTMLImageElement>(".hero-fondo");
      if (heroImg) {
        calcularAnchoEscalado(heroImg).then((scaleWidth: number) => {
          width = scaleWidth;
          if (!canvas.current) return;
          canvas.current.width = width;
          canvas.current.height = height + height * 0.1;
          imgs[0].onload = () =>
            updateImageCanva(ctx, width, height, imgsPreloadRef.current);
        });
        return;
      }
    }

    canvas.current.width = width;
    canvas.current.height = height;
    imgs[0].onload = () =>
      updateImageCanva(ctx, width, height, imgsPreloadRef.current);
  }, [imagenes_360, index]);

  // ── GSAP scroll animation ─────────────────────────────────────────────────

  useGSAP(
    () => {
      if (!chairContainer.current) return;

      const lastpost = isLast && window.innerWidth < 700 ? isLast : false;

      gsap.set(chairContainer.current, {
        scrollTrigger: {
          trigger: chairContainer.current,
          start: `top ${window.innerHeight * 0.3}px`,
          end: `${window.innerHeight * 2}px end`,
          pin: true,
          pinSpacing: lastpost,
          scrub: 1,
          onUpdate: (self) => {
            const scrollProgress = self.progress;
            const ctx = ctxCanvasRef.current;

            // Phase 1 – visibilidad completa
            if (scrollProgress < 0.2) {
              gsap.set([canvas.current, overlayCanvas.current], { opacity: 1 });
            }

            // Phase 2 – desenfoque + fade overlay
            if (scrollProgress < 0.3) {
              const progress = scrollProgress / 0.3;
              const invert = 1 - progress;
              gsap.set(canvas.current, { filter: `blur(${invert}rem)` });
              gsap.set(overlayCanvas.current, { opacity: invert });
              gsap.set(infoContent.current, {
                transform: "translate(0,100vh)",
              });
            }

            // Phase 3 – animación de frames 360
            if (scrollProgress > 0.3 && scrollProgress < 0.6) {
              const progress = (scrollProgress - 0.3) * (1 / 0.3);
              const spread = Math.round(progress * 100);
              const actualfotograma = Math.round((numImg * spread) / 100);

              if (actualfotograma !== actualFrame) {
                if (imgsPreloadRef.current[actualfotograma]?.complete) {
                  if (window.innerWidth < 700) {
                    const heroImg =
                      document.querySelector<HTMLImageElement>(".hero-fondo");
                    if (heroImg && canvas.current) {
                      const porcentaje =
                        (100 * window.innerHeight) / heroImg.naturalHeight;
                      const newWidth =
                        (heroImg.naturalWidth * porcentaje) / 100;
                      canvas.current.width = Math.round(newWidth);
                      canvas.current.height = window.innerHeight;
                    }
                  }

                  updateImageCanva(
                    ctx,
                    canvas.current?.width ?? 0,
                    canvas.current?.height ?? 0,
                    imgsPreloadRef.current,
                    actualfotograma
                  );
                  setActualFrame(actualfotograma);
                }
              }
            }

            // Phase 4 – panel de info sube
            if (scrollProgress > 0.6 && infoContent.current) {
              const progress = (scrollProgress - 0.6) * (1 / 0.4);
              const invertProgress = 1 - progress * 2.2;
              const top = 100 * invertProgress;

              infoContent.current.style.background = `linear-gradient(180deg,
                rgba(0,0,0,0) 0%,
                rgba(17,17,23,${progress}) 30%,
                var(--bg-primary) 70%,
                transparent 100%)`;

              gsap.set(infoContent.current, {
                transform: `translate(0,${top}vh)`,
              });
              gsap.set(canvas.current, { opacity: invertProgress });
            }
          },
        },
      });
    },
    { scope: chairContainer, dependencies: [numImg, isLast] }
  );

  // ── Resolver URLs de imágenes estáticas ──────────────────────────────────

  // El metaobjeto manda `imagenes` con 3 elementos (imgsriven, imgsriven3, rivendell)
  const img1 = toUrl(imagenes[0]);
  const img2 = toUrl(imagenes[1]);
  const img3 = toUrl(imagenes[2]);
  const titleImgUrl = toUrl(imgTitulo);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section
      className="chair-container"
      style={{ "--indexChair": zIndex } as React.CSSProperties}
      ref={chairContainer}
    >
      {/* Canvas layer */}
      <div className="canvasContainer" ref={canvasContainer}>
        <canvas ref={canvas} />
        <div className="overlay-canvas" ref={overlayCanvas} />
      </div>

      {/* Info layer */}
      <div className="infoContent" ref={infoContent}>

        {/* Section 1 – título + subtítulo + img2 */}
        <div className="section-1 wrapContent-6fr">
          <div className="title">
            {titleImgUrl ? (
              <img src={titleImgUrl} alt={titulo ?? "titulo"} />
            ) : (
              <h2>
                {titulo}
                <span className="tm-span">™</span>
              </h2>
            )}
          </div>
          <div className="sub-container" style={{ gridColumn: "2 / span 4" }}>
            <h3 className="subtitle">{subtitle}</h3>
            <p className="description">{description}</p>
          </div>
          {img2 && <Imagen clase="maskImg-1" img={img2} />}
        </div>

        {/* Section 2 – img1 + img3 + botón desktop */}
        <div className="section-2">
          <div className="wrapContent-6fr two-img-content">
            {img1 && <Imagen clase="maskImg-2" img={img1} />}
            {img3 && <Imagen clase="maskImg-3" img={img3} />}
            <div className="boton-compra botton-desktop">
              <a href={link}>{button_text}</a>
            </div>
          </div>
        </div>

        {/* CTA móvil */}
        <div className="container-bottom bottom-mobile">
          <div className="boton-compra">
            <a href={link}>{button_text}</a>
          </div>
        </div>
      </div>
    </section>
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
          /**
           * El tipo "metaobject" de Weaverse hace que el Studio muestre
           * el selector de metaobjeto. Los campos del metaobjeto elegido
           * se inyectan automáticamente como props del componente con los
           * mismos nombres que tienen las keys en Shopify:
           *
           *   titulo, subtitle, description, button_text, link,
           *   imagenes, imagenes_360, imgTitulo
           */
          type: "text",
          label: "handle metaobject silla",
          name: "metaobject",
        },
      ],
    },
  ],
});