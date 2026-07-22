import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseImage,
} from '@weaverse/hydrogen'
import { updateImageCanva } from '~/utils/general'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { cn } from '~/utils/cn'

// ─── Types ─────────────────────────────────────────────────────────────────

interface Anillo360LoaderData {
  imagenes_360?: WeaverseImage[],
  subtitle?:string,
  titulo?:string,
  description?:string,
}

interface Anillo360Props extends HydrogenComponentProps {
  loaderData: Anillo360LoaderData | null
  metaobject: string
  // Overlay text
  subtitle: string
  title: string
  line1: string
  line2: string
  line3: string
  line4: string
  // Subtitle (h4)
  subtitleSize: number
  subtitleSizeMobile: number
  subtitleFamily: string
  subtitleWeight: string
  subtitleColor: string
  subtitleLineHeight: number
  // Title (h3)
  titleSize: number
  titleSizeMobile: number
  titleFamily: string
  titleWeight: string
  titleColor: string
  // Paragraphs
  paraSize: number
  paraSizeMobile: number
  paraFamily: string
  paraWeight: string
  paraColor: string
  paraWidth: number
  paraWidthMobile: number
  // Animation
  scrollPhase1End: number
  scrollPhase2End: number
  // Mobile
  mobileStaticBg?: WeaverseImage
  mobileCanvasPositionX: number
  clName?:string;
}

// ─── GraphQL query (same as scrollChair) ──────────────────────────────────

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
` as const

// ─── Loader ────────────────────────────────────────────────────────────────

export const loader = async ({
  weaverse,
  data,
}: ComponentLoaderArgs<Anillo360Props>): Promise<Anillo360LoaderData | null> => {
  const { storefront } = weaverse
  const handle = data?.metaobject
  if (!handle) return null

  try {
    const response = await storefront.query(CHAIR_METAOBJECT_QUERY, {
      variables: { handle },
    })

    if (!response?.metaobject) return null

    const fieldsRaw: any[] = response.metaobject.fields
    const formattedData: Record<string, any> = {}

    fieldsRaw.forEach((field: any) => {
      const key = field.key
      if (field.references?.nodes?.length > 0) {
        formattedData[key] = field.references.nodes
          .map((node: any) => node.image)
          .filter(Boolean)
      } else if (field.reference?.image) {
        formattedData[key] = field.reference.image
      } else {
        formattedData[key] = field.value
      }
    })

    return formattedData as Anillo360LoaderData
  } catch {
    return null
  }
}

// ─── Helper ────────────────────────────────────────────────────────────────

function toUrl(img: WeaverseImage | undefined): string {
  if (!img) return ''
  return typeof img === 'string' ? img : img.url
}

// ─── Section ───────────────────────────────────────────────────────────────

function Anillo360(props: Anillo360Props) {
  const {
    loaderData,
    clName,
    subtitle = '',
    title = '',
    line1 = '', line2 = '', line3 = '', line4 = '',
    subtitleSize = 72,     subtitleSizeMobile = 51,
    subtitleFamily = "'EB Garamond', serif",
    subtitleWeight = '400', subtitleColor = '#ffffff',
    subtitleLineHeight = 3,
    titleSize = 104,       titleSizeMobile = 30,
    titleFamily = "'EB Garamond', serif",
    titleWeight = '400',   titleColor = '#ffffff',
    paraSize = 32,         paraSizeMobile = 19,
    paraFamily = 'Helvetica, sans-serif',
    paraWeight = '400',    paraColor = '#ffffff',
    paraWidth = 70,        paraWidthMobile = 95,
    scrollPhase1End = 0.3,
    scrollPhase2End = 0.6,
    mobileStaticBg,
    mobileCanvasPositionX = 50,
  } = props

  const imagenes_360 = loaderData?.imagenes_360 ?? []
  const numFrames = imagenes_360.length

  const isMobile = useIsMobile(800)
  const [actualFrame, setActualFrame] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isMobile) requestAnimationFrame(() => setVisible(true))
  }, [isMobile])

  const imgsRef    = useRef<HTMLImageElement[]>([])
  const ctxRef     = useRef<CanvasRenderingContext2D | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // ── Canvas initialisation ───────────────────────────────────────────────
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || imagenes_360.length === 0) return

    const imgs: HTMLImageElement[] = imagenes_360.map((wi) => {
      const el = new Image()
      el.src = toUrl(wi)
      return el
    })
    imgsRef.current = imgs

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    if (window.innerWidth < 800) return

    // ── DESKTOP ──────────────────────────────────────────────────────────────
    let width  = window.innerWidth
    let height = window.innerHeight
    if (height > 910 && height < 2000) height += height / 9

    canvas.width  = width
    canvas.height = height
    imgs[0].onload = () =>
      updateImageCanva(ctx, width, height, imgsRef.current)
  }, [imagenes_360, isMobile])

  // ── GSAP scroll animation ───────────────────────────────────────────────
  useGSAP(
    () => {
      if (isMobile) return
      gsap.registerPlugin(ScrollTrigger)
      const section = sectionRef.current
      if (!section) return

      gsap.set(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `${window.innerHeight * 2}px end`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const canvas   = canvasRef.current
            const overlay  = overlayRef.current
            const content  = contentRef.current
            const ctx      = ctxRef.current
            if (!canvas || !ctx) return

            gsap.set(canvas, { opacity: 1 })

            // Phase 1: blur + fade initial overlay
            if (progress < scrollPhase1End) {
              const p   = progress / scrollPhase1End
              const inv = 1 - p
              gsap.set(canvas, { filter: `blur(${inv}rem)` })
              if (overlay) gsap.set(overlay, { opacity: inv })
            }

            // Phase 2: advance frames + fade in text
            if (progress > scrollPhase1End && progress < scrollPhase2End) {
              const span  = scrollPhase2End - scrollPhase1End
              const p     = (progress - scrollPhase1End) * (1 / span)
              const spread = Math.round(p * 100)
              const frame  = Math.round(numFrames * spread / 100)

              if (frame !== actualFrame) {
                const imgs = imgsRef.current
                if (imgs[frame]?.complete) {
                  updateImageCanva(ctx, canvas.width, canvas.height, imgs, frame, isMobile ? 'height' : 'cover')
                  setActualFrame(frame)
                }
              }

              const opacity = Math.round(p * 100) / 100
              if (content) gsap.set(content, { opacity: opacity < 0.25 ? 0 : opacity })
            }
          },
        },
      })
    },
    { scope: sectionRef, dependencies: [numFrames, scrollPhase1End, scrollPhase2End, isMobile] },
  )

  useEffect(()=>{
    console.log("loaderData",loaderData)
  },[loaderData])

  const lines = [line1, line2, line3, line4].filter(Boolean)

  if (isMobile) {
    const bgUrl = toUrl(mobileStaticBg) || toUrl(imagenes_360[0] as WeaverseImage)
    return (
      <section className={cn(
        "relative w-full overflow-hidden",
        clName && clName
      )}>
        <div
          className="relative w-full h-screen overflow-hidden"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <img
            src={bgUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: `${mobileCanvasPositionX}% center`,
            }}
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none"
            style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.7)', paddingInline: '1rem' }}
          >
            {(subtitle || loaderData?.subtitle) && (
              <h4
                style={{
                  fontFamily: subtitleFamily,
                  fontWeight: subtitleWeight,
                  color: subtitleColor,
                  fontSize: `${subtitleSizeMobile}px`,
                  lineHeight: 1,
                }}
              >
                {subtitle || loaderData?.subtitle}
              </h4>
            )}
            {(title || loaderData?.titulo) && (
              <h3
                style={{
                  fontFamily: titleFamily,
                  fontWeight: titleWeight,
                  color: titleColor,
                  fontSize: `${titleSizeMobile}`,
                  margin: 0,
                }}
              >
                {title || loaderData?.titulo}
              </h3>
            )}
            {loaderData?.description
              ? loaderData.description.split('\n').map((line, i) =>
                  line ? (
                    <p
                      key={i}
                      style={{
                        fontFamily: paraFamily,
                        fontWeight: paraWeight,
                        color: paraColor,
                        fontSize: `${paraSizeMobile}`,
                        paddingTop: '2.5rem',
                        lineHeight: 1.1,
                        width: `${paraWidthMobile}%`,
                        margin: 0,
                      }}
                    >
                      {line}
                    </p>
                  ) : null,
                )
              : lines.map((line, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: paraFamily,
                      fontWeight: paraWeight,
                      color: paraColor,
                      fontSize: `${paraSizeMobile}`,
                      paddingTop: '2.5rem',
                      lineHeight: 1.1,
                      width: `${paraWidthMobile}%`,
                      margin: 0,
                    }}
                  >
                    {line}
                  </p>
                ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
    >
      {/* Canvas container */}
      <div className="relative w-full h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 opacity-0"
          style={isMobile ? {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${mobileCanvasPositionX}% center`,
          } : undefined}
        />
        {/* Dark fade overlay (starts visible, disappears in phase 1) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
        />

        {/* Text overlay (starts invisible, appears in phase 2) */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none"
          style={{
            opacity: 0,
            textShadow: '1px 1px 6px rgba(0,0,0,0.7)',
            paddingInline: isMobile ? '1rem' : undefined,
          }}
        >
          {subtitle || loaderData?.subtitle && (
            <h4
              style={{
                fontFamily: subtitleFamily,
                fontWeight: subtitleWeight,
                color: subtitleColor,
                fontSize: `${isMobile ? subtitleSizeMobile : subtitleSize}px`,
                lineHeight: isMobile ? 1 : subtitleLineHeight,
              }}
            >
              {subtitle || loaderData?.subtitle}
            </h4>
          )}
          {title || loaderData?.titulo && (
            <h3
              style={{
                fontFamily: titleFamily,
                fontWeight: titleWeight,
                color: titleColor,
                fontSize: `${isMobile ? titleSizeMobile : titleSize}`,
                transform: isMobile ? '' : 'translate(0, -20px)',
                margin: 0,
              }}
            >
              {title || loaderData?.titulo}
            </h3>
          )}

          
          {loaderData?.description ? loaderData?.description.split("\n").map((line, i) => {
    
            if(line != ""){
              return(
                <p
                  key={i}
                  style={{
                    fontFamily: paraFamily,
                    fontWeight: paraWeight,
                    color: paraColor,
                    fontSize: `${isMobile ? paraSizeMobile : paraSize}`,
                    paddingTop: '2.5rem',
                    lineHeight: 1.1,
                    width: `${isMobile ? paraWidthMobile : paraWidth}%`,
                    margin: 0,
                  }}
                >
                  {line}
                </p>
              )
            }
          }
          ): lines.map((line,i)=> {return(<p
                  key={i}
                  style={{
                    fontFamily: paraFamily,
                    fontWeight: paraWeight,
                    color: paraColor,
                    fontSize: `${isMobile ? paraSizeMobile : paraSize}`,
                    paddingTop: '2.5rem',
                    lineHeight: 1.1,
                    width: `${isMobile ? paraWidthMobile : paraWidth}%`,
                    margin: 0,
                  }}
                >
                  {line}
                </p>)})}
        </div>
      </div>
    </section>
  )
}

export default Anillo360

// ─── Schema ────────────────────────────────────────────────────────────────



const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extrabold (800)' },
]

export const schema = createSchema({
  type: 'anillo-360',
  title: 'Anillo 360°',
  settings: [
    {
      group:"class",
      inputs:[
        {
          type:'text',
          label:'className',
          name:'clName',
        },
      ]
    },
    {
      group: 'Imágenes (metaobject)',
      inputs: [
        {
          type: 'text',
          name: 'metaobject',
          label: 'Handle del metaobject (scroll_chair)',
          placeholder: 'ej: anillo-phoenix',
          defaultValue: '',
        },
      ],
    },
    {
      group: 'Subtítulo (h4)',
      inputs: [
        { type: 'text',   name: 'subtitle',           label: 'Texto', defaultValue: '' },
        { type: 'text',  name: 'subtitleSize',        label: 'Tamaño – desktop', defaultValue: "4.5rem" },
        { type: 'text',  name: 'subtitleSizeMobile',  label: 'Tamaño – mobile',  defaultValue: "2.5rem" },
        { type: 'text', name: 'subtitleFamily',      label: 'Fuente', defaultValue: "Outfit, serif" },
        { type: 'select', name: 'subtitleWeight',      label: 'Weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '400' },
        { type: 'color',  name: 'subtitleColor',       label: 'Color', defaultValue: '#ffffff' },
        { type: 'range',  name: 'subtitleLineHeight',  label: 'Line-height (desktop)', defaultValue: 3, configs: { min: 0.8, max: 5, step: 0.1 } },
      ],
    },
    {
      group: 'Título (h3)',
      inputs: [
        { type: 'text',   name: 'title',           label: 'Texto', defaultValue: '' },
        { type: 'text',  name: 'titleSize',        label: 'Tamaño – desktop', defaultValue: "6.5rem" },
        { type: 'text',  name: 'titleSizeMobile',  label: 'Tamaño – mobile',  defaultValue: "3.5rem" },
        { type: 'text', name: 'titleFamily',      label: 'Fuente',  defaultValue: "Outfit, serif" },
        { type: 'select', name: 'titleWeight',      label: 'Weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '400' },
        { type: 'color',  name: 'titleColor',       label: 'Color', defaultValue: '#ffffff' },
      ],
    },
    {
      group: 'Párrafos',
      inputs: [
        { type: 'textarea', name: 'line1', label: 'Párrafo 1', defaultValue: '' },
        { type: 'textarea', name: 'line2', label: 'Párrafo 2', defaultValue: '' },
        { type: 'textarea', name: 'line3', label: 'Párrafo 3', defaultValue: '' },
        { type: 'textarea', name: 'line4', label: 'Párrafo 4', defaultValue: '' },
        { type: 'heading', label: 'Estilo' },
        { type: 'text',  name: 'paraSize',         label: 'Tamaño – desktop', defaultValue: "2rem" },
        { type: 'text',  name: 'paraSizeMobile',   label: 'Tamaño – mobile',  defaultValue: "1.5rem" },
        { type: 'text', name: 'paraFamily',       label: 'Fuente', defaultValue: 'Helvetica, sans-serif' },
        { type: 'select', name: 'paraWeight',       label: 'Weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '400' },
        { type: 'color',  name: 'paraColor',        label: 'Color', defaultValue: '#ffffff' },
        { type: 'range',  name: 'paraWidth',        label: 'Ancho – desktop (%)', defaultValue: 70, configs: { min: 20, max: 100, step: 5, unit: '%' } },
        { type: 'range',  name: 'paraWidthMobile',  label: 'Ancho – mobile (%)',  defaultValue: 95, configs: { min: 20, max: 100, step: 5, unit: '%' } },
      ],
    },
    {
      group: 'Animación',
      inputs: [
        {
          type: 'range',
          name: 'scrollPhase1End',
          label: 'Fin fase 1 – desenfoque (0–1)',
          defaultValue: 0.3,
          configs: { min: 0.05, max: 0.5, step: 0.05 },
        },
        {
          type: 'range',
          name: 'scrollPhase2End',
          label: 'Fin fase 2 – fotogramas (0–1)',
          defaultValue: 0.6,
          configs: { min: 0.2, max: 0.9, step: 0.05 },
        },
        {
          type: 'image',
          name: 'mobileStaticBg',
          label: 'Imagen de fondo mobile (opcional)',
        },
        {
          type: 'range',
          name: 'mobileCanvasPositionX',
          label: 'Posición horizontal imagen mobile (%)',
          defaultValue: 50,
          configs: { min: 0, max: 100, step: 5, unit: '%' },
        },
      ],
    },
  ],
  presets: {
    metaobject:          '',
    subtitle:            '',
    title:               '',
    line1: '', line2: '', line3: '', line4: '',
    subtitleFamily:      "'EB Garamond', serif",
    subtitleWeight:      '400',
    subtitleColor:       '#ffffff',
    subtitleLineHeight:  3,
    titleFamily:         "'EB Garamond', serif",
    titleWeight:         '400',
    titleColor:          '#ffffff',
    paraFamily:          'Helvetica, sans-serif',
    paraWeight:          '400',
    paraColor:           '#ffffff',
    paraWidth:           70,  paraWidthMobile:     95,
    scrollPhase1End:     0.3,
    scrollPhase2End:     0.6,
    mobileCanvasPositionX: 50,
    mobileStaticBg: undefined,
  },
})
