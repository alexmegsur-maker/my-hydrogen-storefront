import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '~/hooks/use-is-mobile'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from '@weaverse/hydrogen'

// ─── Types ─────────────────────────────────────────────────────────────────

interface PrincipalBannerProps extends HydrogenComponentProps {
  // Content
  backgroundImage: WeaverseImage
  chairImage: WeaverseImage
  separatorImage: WeaverseImage
  gradientColor1: string
  gradientColor2: string
  logoData: string
  // Hero phrase
  phrase: string
  phraseSize: number
  phraseSizeMobile: number
  phraseFamily: string
  phraseWeight: string
  phraseSpacing: number
  phraseAlign: 'left' | 'center' | 'right'
  // Headline
  preorderLine1: string
  preorderLine2: string
  titleSize: number
  titleSizeMobile: number
  titleFamily: string
  titleWeight: string
  titleSpacing: number
  titleAlign: 'left' | 'center' | 'right'
  // Edition label
  limitedEditionLabel: string
  labelSize: number
  labelSizeMobile: number
  labelFamily: string
  labelWeight: string
  labelSpacing: number
  labelAlign: 'left' | 'center' | 'right'
  // Scroll hint
  scrollLabel: string
  scrollSize: number
  scrollSizeMobile: number
  scrollWeight: string
  scrollSpacing: number
  // Container layout
  copyBottom: number
  // Product image
  chairWidth: number
  chairPositionX: 'left' | 'center' | 'right'
  chairObjectFit: 'cover' | 'contain' | 'fill'
  separatorWidth: number
  separatorAlign: 'left' | 'center' | 'right'
  // Animation
  logoScaleStart: number
  logoScaleEnd: number
  logoYEnd: number
  // Video
  showPlayButton: boolean
  videoUrl: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function toUrl(img: WeaverseImage | undefined): string {
  if (!img) return ''
  return typeof img === 'string' ? img : img.url
}

function parseSvg(input: string): { viewBox: string; content: string } {
  if (!input) return { viewBox: '0 0 100 100', content: '' }
  if (input.trim().startsWith('<')) {
    const viewBox = (input.match(/viewBox=["']([^"']+)["']/i) ?? [])[1] ?? '0 0 100 100'
    const content = (input.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i) ?? [])[1]?.trim() ?? ''
    return { viewBox, content }
  }
  return { viewBox: '0 0 342.7 163.4', content: `<path d="${input}" />` }
}

function getVideoEmbed(url: string): { iframe: boolean; src: string } {
  if (!url) return { iframe: false, src: '' }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let id = ''
    if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1]?.split('?')[0] ?? ''
    } else {
      try { id = new URL(url).searchParams.get('v') ?? '' } catch (_e) {}
    }
    return { iframe: true, src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` }
  }
  if (url.includes('vimeo.com')) {
    const id = url.split('vimeo.com/').pop()?.split('?')[0] ?? ''
    return { iframe: true, src: `https://player.vimeo.com/video/${id}?autoplay=1` }
  }
  return { iframe: false, src: url }
}

// ─── Section ────────────────────────────────────────────────────────────────

function PrincipalBanner(props: PrincipalBannerProps) {
  const {
    backgroundImage,
    chairImage,
    separatorImage,
    gradientColor1,
    gradientColor2,
    logoData,
    // Phrase
    phrase,
    phraseSize = 40,
    phraseSizeMobile = 32,
    phraseFamily = "'EB Garamond', serif",
    phraseWeight = '500',
    phraseSpacing = 0,
    phraseAlign = 'left',
    // Headline
    preorderLine1,
    preorderLine2,
    titleSize = 112,
    titleSizeMobile = 45,
    titleFamily = "'EB Garamond', serif",
    titleWeight = '500',
    titleSpacing = 1,
    titleAlign = 'left',
    // Label
    limitedEditionLabel,
    labelSize = 54,
    labelSizeMobile = 16,
    labelFamily = "'EB Garamond', serif",
    labelWeight = '500',
    labelSpacing = 2,
    labelAlign = 'left',
    // Scroll
    scrollLabel,
    scrollSize = 10,
    scrollSizeMobile = 10,
    scrollWeight = '400',
    scrollSpacing = 0,
    // Layout
    copyBottom = 18,
    // Product image
    chairWidth = 100,
    chairPositionX = 'center',
    chairObjectFit = 'cover',
    separatorWidth = 65,
    separatorAlign = 'left',
    // Animation
    logoScaleStart = 270,
    logoScaleEnd = 0.3,
    logoYEnd = -70,
    // Video
    showPlayButton = true,
    videoUrl = '',
  } = props

  const parsedLogo = parseSvg(logoData)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const embed = getVideoEmbed(videoUrl)
  const isMobile = useIsMobile(700)

  const heroRef = useRef<HTMLElement>(null)
  const logoMaskRef = useRef<SVGSVGElement>(null)
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const referenciaRef = useRef<HTMLDivElement>(null)
  const fadeOverlayRef = useRef<HTMLDivElement>(null)
  const overlayTitleRef = useRef<HTMLHeadingElement>(null)
  const overlayImgRef = useRef<HTMLDivElement>(null)
  const overlayImgBgRef = useRef<HTMLDivElement>(null)
  const overlayTextRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)
      const container = heroRef.current!

      const tlIntro = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'top+=20% top',
          scrub: true,
        },
      })
      tlIntro.fromTo(
        '.video-icon-container',
        { display: 'block', opacity: 1 },
        { display: 'none', opacity: 0 },
      )
      tlIntro.fromTo(
        ['.hero-img-logo', '.hero-img-copy'],
        { opacity: 1 },
        { opacity: 0 },
        '<',
      )

      const tlSecond = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top+=40% top',
          end: 'top+=50% top',
          scrub: true,
        },
      })

      tlSecond.fromTo('.hero-principal-img', { scale: '1' }, { scale: '0.7' })

      tlSecond.fromTo(
        overlayTitleRef.current,
        {
          backgroundImage: `linear-gradient(151deg,transparent 0%, ${gradientColor1} 99%, ${gradientColor2} 100%)`,
          backgroundClip: 'text',
        },
        {
          backgroundImage: `linear-gradient(151deg,transparent 0%, ${gradientColor1} 2%, ${gradientColor2} 100%)`,
        },
        '<',
      )

      tlSecond.fromTo(
        overlayTextRef.current,
        { backgroundImage: `linear-gradient(151deg,transparent 0%, #fff 99%, #fff 100%)` },
        { backgroundImage: `linear-gradient(151deg,transparent 0%, #fff 2%, #fff 100%)` },
        '<',
      )

      tlSecond.fromTo(
        overlayImgBgRef.current,
        { backgroundImage: `linear-gradient(151deg,#050505 0%, transparent 99%, transparent 100%)` },
        { backgroundImage: `linear-gradient(151deg,#050505 0%, transparent 2%, transparent 100%)` },
        '<',
      )

      tlSecond.fromTo(
        [overlayTitleRef.current, overlayTextRef.current, overlayImgRef.current],
        { scale: 1.25, opacity: 0 },
        { scale: 1, opacity: 1 },
        '<',
      )

      const tlSvg = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top+=10% top',
          end: 'top+=50% top',
          scrub: true,
        },
      })

      tlSvg.fromTo(
        logoMaskRef.current,
        { scale: logoScaleStart },
        { scale: logoScaleEnd, y: `${logoYEnd}%` },
      )
      tlSvg.fromTo(
        fadeOverlayRef.current,
        { opacity: 0, background: 'transparent' },
        {
          opacity: 1,
          background: `linear-gradient(151deg,${gradientColor1} 0%, ${gradientColor2} 100%)`,
          ease: 'none',
        },
        '<',
      )

      const tlRevert = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top+=70% top',
          end: 'top+=80% top',
          scrub: true,
        },
      })

      tlRevert.fromTo(
        fadeOverlayRef.current,
        { background: `linear-gradient(151deg,${gradientColor1} 0%, ${gradientColor1} 99%, ${gradientColor1} 100%)` },
        { background: `linear-gradient(151deg,${gradientColor1} 0%, #050505 2%, #050505 100%)` },
        '<',
      )
      tlRevert.fromTo(
        overlayTitleRef.current,
        { backgroundImage: `linear-gradient(151deg,${gradientColor1} 0%, ${gradientColor1} 99%, ${gradientColor1} 100%)` },
        { backgroundImage: `linear-gradient(151deg,${gradientColor1} 0%, #05050500 2%, #05050500 100%)` },
        '<',
      )
      tlRevert.fromTo(
        overlayTextRef.current,
        { backgroundImage: `linear-gradient(151deg,#fff 0%, #fff 99%, #fff 100%)` },
        { backgroundImage: `linear-gradient(151deg,#fff 0%, transparent 2%, transparent 100%)` },
        '<',
      )
      tlRevert.fromTo(
        overlayImgBgRef.current,
        { background: `linear-gradient(151deg,transparent 0%, transparent 75%, #050505 99%, #050505 100%)` },
        {
          background: `linear-gradient(151deg,transparent 0%,transparent 1%, #050505 35%, #050505 100%)`,
          onComplete: () => {
            gsap.fromTo(
              overlayImgBgRef.current,
              { background: `linear-gradient(151deg,transparent 0%,transparent 1%, #050505 35%, #050505 100%)` },
              { background: `linear-gradient(151deg,transparent 0%,transparent 1%, #050505 2%, #050505 100%)` },
            )
          },
        },
        '<',
      )
      const tlEnd = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top+=80% top',
          end: 'top+=100% top',
          scrub: true,
        },
      })

      tlEnd.to( container,
        {opacity:0,zIndex:-1}
      )
    },
    {
      scope: heroRef,
      dependencies: [gradientColor1, gradientColor2, logoScaleStart, logoScaleEnd, logoYEnd],
    },
  )

  useEffect(() => {
    console.log('parsedLogo', parsedLogo.viewBox)
  }, [parsedLogo])

  // ── Derived styles ──────────────────────────────────────────────────────

  const chairStyle: React.CSSProperties = {
    width: `${chairWidth}vw`,
    height: '100vh',
    objectFit: chairObjectFit,
    ...(chairPositionX === 'right'
      ? { left: 'auto', right: 0 }
      : chairPositionX === 'center'
      ? { left: '50%', transform: 'translateX(-50%)' }
      : { left: 0 }),
  }

  return (
    <section className="hero relative z-[2] h-[600vh] overflow-hidden" ref={heroRef}>

      {/* Background + product image */}
      <div className="hero-img-container fixed top-0 left-0 w-[100vw] h-auto z-[2]">
        <img
          className="hero-fondo fixed top-0 left-0 w-full h-full"
          src={toUrl(backgroundImage)}
          alt=""
          fetchPriority="high"
        />
        <div className="hero-img-logo z-[5] flex items-center w-screen h-screen justify-center absolute">
          <h3
            className="frase-principal fixed top-[15vh] w-[27rem] leading-[0.9] [word-spacing:4px] max-[700px]:w-[85vw]"
            style={{
              fontSize: `${isMobile ? phraseSizeMobile : phraseSize}px`,
              fontFamily: phraseFamily,
              fontWeight: phraseWeight,
              letterSpacing: `${phraseSpacing}px`,
              textAlign: phraseAlign,
            }}
          >
            {phrase}
          </h3>
        </div>
        <img
          className="hero-principal-img fixed top-0 max-[700px]:z-[3]"
          src={toUrl(chairImage)}
          alt=""
          style={chairStyle}
        />
        <div className="hero-img-copy fixed bottom-[5%] left-1/2 -translate-x-1/2 [will-change:opacity] z-[5]">
          <p
            style={{
              fontSize: `${isMobile ? scrollSizeMobile : scrollSize}px`,
              fontWeight: scrollWeight,
              letterSpacing: `${scrollSpacing}px`,
            }}
          >
            {scrollLabel}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 25 25"
            strokeWidth={1}
            stroke="currentColor"
            className="arrow-down animate-arrow-pulse"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Play button */}
      {showPlayButton && videoUrl && (
        <div
          className="video-icon-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] z-[3] opacity-0 cursor-pointer max-[700px]:opacity-100"
          onClick={() => setIsVideoOpen(true)}
        >
          <div className="video-play transition-transform duration-500 hover:scale-110">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2
                  17.5228 6.47715 22 12 22ZM10.6935 15.8458L15.4137 13.059C16.1954 12.5974 16.1954 11.4026
                  15.4137 10.941L10.6935 8.15419C9.93371 7.70561 9 8.28947 9 9.21316V14.7868C9 15.7105
                  9.93371 16.2944 10.6935 15.8458Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Colour wash overlay */}
      <div
        className="fade-overlay fixed top-0 left-0 w-full h-full [will-change:opacity] z-[2] max-[700px]:opacity-0"
        ref={fadeOverlayRef}
      />

      {/* SVG logo reveal mask */}
      <div className="overlay fixed top-0 left-0 w-full h-full z-[2] max-[700px]:opacity-0">
        <svg width="100%" height="100%">
          <defs>
            <mask id="logoRevealMask">
              <rect width="100%" height="100%" fill="white" id="rectInicio" />
              <svg
                id="logoMask"
                ref={logoMaskRef}
                viewBox={parsedLogo.viewBox}
                fill="black"
                dangerouslySetInnerHTML={{ __html: parsedLogo.content }}
                style={{ transformOrigin: 'center 70%' }}
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#050505" mask="url(#logoRevealMask)" />
        </svg>
      </div>

      {/* Reference box for logo position */}
      <div
        className="logo-container flex fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] z-[2] justify-center items-center min-[2400px]:top-[18%] min-[2400px]:w-[350px] min-[2400px]:h-[350px] min-[3000px]:w-[600px] min-[3000px]:h-[600px]"
        ref={logoContainerRef}
      >
        <div className="referencia opacity-0 w-[342.7px] h-[163.4px]" ref={referenciaRef} />
      </div>

      {/* Reveal headline */}
      <div
        className="overlay-copy fixed left-1/2 -translate-x-1/2 z-[2] max-[700px]:w-full max-[700px]:top-[5%] max-[700px]:flex max-[700px]:flex-col max-[700px]:h-full max-[700px]:justify-center max-[700px]:items-center min-[2400px]:bottom-[20%] min-[3000px]:bottom-[25%]"
        style={{ bottom: `${copyBottom}%` }}
      > 
        <h1
          className="leading-[0.9] text-transparent origin-[center_0%] max-[700px]:mt-[20vh]"
          ref={overlayTitleRef}
          style={{
            backgroundClip: 'text',
            fontSize: `${isMobile ? titleSizeMobile : titleSize}px`,
            fontFamily: titleFamily,
            fontWeight: titleWeight,
            letterSpacing: `${titleSpacing}px`,
            textAlign: titleAlign,
          }}
        >
          {preorderLine1}
          <br />
          {preorderLine2}
        </h1>
        <div
          className="relative py-4 opacity-0 max-[700px]:h-auto"
          ref={overlayImgRef}
          style={{
            width: `${separatorWidth}%`,
            marginLeft: separatorAlign === 'right' ? 'auto' : separatorAlign === 'center' ? 'auto' : 0,
            marginRight: separatorAlign === 'left' ? 'auto' : separatorAlign === 'center' ? 'auto' : 0,
          }}
        >
          <img
            className="w-full h-auto"
            src={toUrl(separatorImage)}
            alt=""
          />
          <div ref={overlayImgBgRef} className="absolute w-full h-full top-0 left-0" />
        </div>
        <p
          className="bg-clip-text text-transparent origin-[center_0%]"
          ref={overlayTextRef}
          style={{
            backgroundClip: 'text',
            fontSize: `${isMobile ? labelSizeMobile : labelSize}px`,
            fontFamily: labelFamily,
            fontWeight: labelWeight,
            letterSpacing: `${labelSpacing}px`,
            textAlign: labelAlign,
          }}
        >
          {limitedEditionLabel}
        </p>
      </div>

      {/* Video modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-[90vw] max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -top-10 right-0 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              onClick={() => setIsVideoOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cerrar
            </button>
            {embed.iframe ? (
              <iframe
                src={embed.src}
                className="w-full h-full rounded-lg"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={embed.src}
                className="w-full h-full rounded-lg"
                controls
                autoPlay
                muted
                playsInline
              />
            )}
          </div>
        </div>
      )}

    </section>
  )
}

export default PrincipalBanner

// ─── Weaverse schema ────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  { value: "'EB Garamond', serif", label: 'Garamond' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat' },
  { value: "Georgia, serif", label: 'Georgia' },
  { value: "'Arial', sans-serif", label: 'Arial' },
  { value: "system-ui, sans-serif", label: 'System UI' },
]

const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extrabold (800)' },
]

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

export const schema = createSchema({
  type: 'principal-banner',
  title: 'Principal Banner',
  settings: [
    {
      group: 'Hero Phrase',
      inputs: [
        { type: 'text', name: 'phrase', label: 'Text', defaultValue: 'Diseñado para los que exigen más.' },
        { type: 'range', name: 'phraseSize', label: 'Font size – desktop (px)', defaultValue: 40, configs: { min: 12, max: 120, step: 1, unit: 'px' } },
        { type: 'range', name: 'phraseSizeMobile', label: 'Font size – mobile (px)', defaultValue: 32, configs: { min: 10, max: 80, step: 1, unit: 'px' } },
        { type: 'select', name: 'phraseFamily', label: 'Font family', configs: { options: FONT_OPTIONS }, defaultValue: "'EB Garamond', serif" },
        { type: 'select', name: 'phraseWeight', label: 'Font weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '500' },
        { type: 'range', name: 'phraseSpacing', label: 'Letter spacing (px)', defaultValue: 0, configs: { min: -5, max: 20, step: 0.5, unit: 'px' } },
        { type: 'select', name: 'phraseAlign', label: 'Alignment', configs: { options: ALIGN_OPTIONS }, defaultValue: 'left' },
      ],
    },
    {
      group: 'Headline',
      inputs: [
        { type: 'text', name: 'preorderLine1', label: 'Line 1', defaultValue: 'Pre-order' },
        { type: 'text', name: 'preorderLine2', label: 'Line 2', defaultValue: 'now' },
        { type: 'range', name: 'titleSize', label: 'Font size – desktop (px)', defaultValue: 112, configs: { min: 24, max: 300, step: 2, unit: 'px' } },
        { type: 'range', name: 'titleSizeMobile', label: 'Font size – mobile (px)', defaultValue: 45, configs: { min: 18, max: 120, step: 1, unit: 'px' } },
        { type: 'select', name: 'titleFamily', label: 'Font family', configs: { options: FONT_OPTIONS }, defaultValue: "'EB Garamond', serif" },
        { type: 'select', name: 'titleWeight', label: 'Font weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '500' },
        { type: 'range', name: 'titleSpacing', label: 'Letter spacing (px)', defaultValue: 1, configs: { min: -5, max: 20, step: 0.5, unit: 'px' } },
        { type: 'select', name: 'titleAlign', label: 'Alignment', configs: { options: ALIGN_OPTIONS }, defaultValue: 'left' },
      ],
    },
    {
      group: 'Edition Label',
      inputs: [
        { type: 'text', name: 'limitedEditionLabel', label: 'Text', defaultValue: 'Limited edition' },
        { type: 'range', name: 'labelSize', label: 'Font size – desktop (px)', defaultValue: 54, configs: { min: 12, max: 200, step: 2, unit: 'px' } },
        { type: 'range', name: 'labelSizeMobile', label: 'Font size – mobile (px)', defaultValue: 16, configs: { min: 10, max: 80, step: 1, unit: 'px' } },
        { type: 'select', name: 'labelFamily', label: 'Font family', configs: { options: FONT_OPTIONS }, defaultValue: "'EB Garamond', serif" },
        { type: 'select', name: 'labelWeight', label: 'Font weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '500' },
        { type: 'range', name: 'labelSpacing', label: 'Letter spacing (px)', defaultValue: 2, configs: { min: -5, max: 20, step: 0.5, unit: 'px' } },
        { type: 'select', name: 'labelAlign', label: 'Alignment', configs: { options: ALIGN_OPTIONS }, defaultValue: 'left' },
      ],
    },
    {
      group: 'Scroll Hint',
      inputs: [
        { type: 'text', name: 'scrollLabel', label: 'Text', defaultValue: 'Scroll to reveal' },
        { type: 'range', name: 'scrollSize', label: 'Font size – desktop (px)', defaultValue: 10, configs: { min: 8, max: 24, step: 1, unit: 'px' } },
        { type: 'range', name: 'scrollSizeMobile', label: 'Font size – mobile (px)', defaultValue: 10, configs: { min: 8, max: 24, step: 1, unit: 'px' } },
        { type: 'select', name: 'scrollWeight', label: 'Font weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '400' },
        { type: 'range', name: 'scrollSpacing', label: 'Letter spacing (px)', defaultValue: 0, configs: { min: -5, max: 20, step: 0.5, unit: 'px' } },
      ],
    },
    {
      group: 'Layout',
      inputs: [
        {
          type: 'range',
          name: 'copyBottom',
          label: 'Headline – bottom position (%)',
          defaultValue: 18,
          configs: { min: 0, max: 80, step: 1, unit: '%' },
        },
      ],
    },
    {
      group: 'Images',
      inputs: [
        { type: 'image', name: 'backgroundImage', label: 'Background image' },
        { type: 'image', name: 'chairImage', label: 'Product image' },
        { type: 'image', name: 'separatorImage', label: 'Separator image' },
      ],
    },
    {
      group: 'Product Image',
      inputs: [
        { type: 'range', name: 'chairWidth', label: 'Width (vw)', defaultValue: 100, configs: { min: 20, max: 200, step: 5, unit: 'vw' } },
        { type: 'select', name: 'chairPositionX', label: 'Horizontal position', configs: { options: ALIGN_OPTIONS }, defaultValue: 'center' },
        {
          type: 'select',
          name: 'chairObjectFit',
          label: 'Object fit',
          configs: { options: [{ value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' }, { value: 'fill', label: 'Fill' }] },
          defaultValue: 'cover',
        },
        { type: 'range', name: 'separatorWidth', label: 'Separator width (%)', defaultValue: 65, configs: { min: 10, max: 100, step: 5, unit: '%' } },
        { type: 'select', name: 'separatorAlign', label: 'Separator alignment', configs: { options: ALIGN_OPTIONS }, defaultValue: 'left' },
      ],
    },
    {
      group: 'Colors',
      inputs: [
        { type: 'color', name: 'gradientColor1', label: 'Gradient – start', defaultValue: '#997124' },
        { type: 'color', name: 'gradientColor2', label: 'Gradient – end', defaultValue: '#f1e2b7' },
      ],
    },
    {
      group: 'Logo Mask',
      inputs: [
        { type: 'textarea', name: 'logoData', label: 'SVG completo o atributo d del path', defaultValue: '' },
      ],
    },
    {
      group: 'Animation',
      inputs: [
        { type: 'range', name: 'logoScaleStart', label: 'Logo scale – initial', defaultValue: 270, configs: { min: 50, max: 600, step: 10 } },
        { type: 'range', name: 'logoScaleEnd', label: 'Logo scale – final', defaultValue: 0.3, configs: { min: 0.1, max: 5, step: 0.1 } },
        { type: 'range', name: 'logoYEnd', label: 'Logo Y offset – final (%)', defaultValue: -70, configs: { min: -200, max: 0, step: 5, unit: '%' } },
      ],
    },
    {
      group: 'Video',
      inputs: [
        { type: 'switch', name: 'showPlayButton', label: 'Show play button', defaultValue: true },
        { type: 'text', name: 'videoUrl', label: 'Video URL (YouTube, Vimeo o .mp4)', defaultValue: '' },
      ],
    },
  ],
  presets: {
    // Phrase
    phrase: 'Diseñado para los que exigen más.',
    phraseSize: 40,
    phraseSizeMobile: 32,
    phraseFamily: "'EB Garamond', serif",
    phraseWeight: '500',
    phraseSpacing: 0,
    phraseAlign: 'left',
    // Headline
    preorderLine1: 'Pre-order',
    preorderLine2: 'now',
    titleSize: 112,
    titleSizeMobile: 45,
    titleFamily: "'EB Garamond', serif",
    titleWeight: '500',
    titleSpacing: 1,
    titleAlign: 'left',
    // Label
    limitedEditionLabel: 'Limited edition',
    labelSize: 54,
    labelSizeMobile: 16,
    labelFamily: "'EB Garamond', serif",
    labelWeight: '500',
    labelSpacing: 2,
    labelAlign: 'left',
    // Scroll
    scrollLabel: 'Scroll to reveal',
    scrollSize: 10,
    scrollSizeMobile: 10,
    scrollWeight: '400',
    scrollSpacing: 0,
    // Layout
    copyBottom: 18,
    // Product image
    chairWidth: 100,
    chairPositionX: 'center',
    chairObjectFit: 'cover',
    separatorWidth: 65,
    separatorAlign: 'left',
    // Colors
    gradientColor1: '#997124',
    gradientColor2: '#f1e2b7',
    // Logo
    logoData: '',
    // Animation
    logoScaleStart: 270,
    logoScaleEnd: 0.3,
    logoYEnd: -70,
    // Video
    showPlayButton: true,
    videoUrl: '',
  },
})
