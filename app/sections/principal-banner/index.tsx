import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from '@weaverse/hydrogen'
import '~/styles/principal-banner.css'

// ─── Animation constants ───────────────────────────────────────────────────
// Modify these values to tune the scroll animation timing and scale behaviour.
const ANIM = {
  desktop: {
    fadeEnd: 0.15,          // hero copy/image is fully gone by this progress
    revealStart: 0.25,      // overlay copy starts appearing
    mid: 0.5,               // reveal → disappear phase boundary
    heroFadeOut: 0.9,       // entire section fades at this progress
    initOverlayScale: 1050, // SVG mask starting scale
    chairStartScale: 1.1,
    chairScaleRate: 0.5,
    copyStartScale: 1.25,
    copyScaleRate: 0.25,
  },
  mobile: {
    iconFadeEnd: 0.3,
    halfPoint: 0.5,
    revealStart: 0.3,
    revealEnd: 0.7,
  },
  gradient: {
    spread: 100,  // wipe-band height (%)
    base: 240,    // starting bottom position (%)
    range: 280,   // total travel distance (%)
  },
} as const

// ─── Types ─────────────────────────────────────────────────────────────────

interface PrincipalBannerProps extends HydrogenComponentProps {
  // Images
  backgroundImage: WeaverseImage
  chairImage: WeaverseImage
  separatorImage: WeaverseImage
  // Content
  phrase: string
  preorderLine1: string
  preorderLine2: string
  limitedEditionLabel: string
  scrollLabel: string
  // Gradient colours
  gradientColor1: string
  gradientColor2: string
  // Logo SVG mask
  logoData: string
  // Logo position (per breakpoint)
  lh: number
  lv: number
  lv23: number
  lh23: number
  lhs23: number
  lv30: number
  lv40: number
  extraH: number
  // Animation
  pinMultiplier: number
}

function toUrl(img: WeaverseImage | undefined): string {
  if (!img) return ''
  return typeof img === 'string' ? img : img.url
}

// ─── Section ────────────────────────────────────────────────────────────────

function PrincipalBanner(props: PrincipalBannerProps) {
  const {
    backgroundImage,
    chairImage,
    separatorImage,
    phrase,
    preorderLine1,
    preorderLine2,
    limitedEditionLabel,
    scrollLabel,
    gradientColor1,
    gradientColor2,
    logoData,
    lh,
    lv,
    lv23,
    lh23,
    lhs23,
    lv30,
    lv40,
    extraH,
    pinMultiplier,
  } = props

  const heroRef = useRef<HTMLElement>(null)
  const logoMaskRef = useRef<SVGPathElement>(null)
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const referenciaRef = useRef<HTMLDivElement>(null)
  const fadeOverlayRef = useRef<HTMLDivElement>(null)
  const overlayTitleRef = useRef<HTMLHeadingElement>(null)
  const overlayImgRef = useRef<HTMLImageElement>(null)
  const overlayTextRef = useRef<HTMLParagraphElement>(null)

  // Computes gradient top/bottom positions for the wipe animation
  const gradPos = (progress: number) => {
    const { spread, base, range } = ANIM.gradient
    const bottom = base - progress * range
    return { bottom, top: bottom - spread }
  }

  // Updates background-gradient on a text-clip element (reveal or hide direction)
  const setGradient = (
    el: HTMLElement | null,
    direction: 'reveal' | 'hide',
    progress: number,
    isTitle: boolean,
  ) => {
    if (!el) return
    const { bottom: gb, top: gt } = gradPos(progress)
    el.style.background =
      direction === 'reveal'
        ? isTitle
          ? `linear-gradient(151deg, var(--bg-primary) 0%, var(--bg-primary) ${gt}%, ${gradientColor1} ${gb}%, ${gradientColor2} 100%)`
          : `linear-gradient(to bottom, var(--bg-primary) 0%, var(--bg-primary) ${gt}%, #fff ${gb}%, #fff 100%)`
        : isTitle
          ? `linear-gradient(151deg, ${gradientColor1} 0%, ${gradientColor2} ${gt}%, var(--bg-primary) ${gb}%, var(--bg-primary) 100%)`
          : `linear-gradient(151deg, #fff 0%, #fff ${gt}%, var(--bg-primary) ${gb}%, var(--bg-primary) 100%)`
    el.style.backgroundClip = 'text'
  }

  // ── Logo mask sizing & position ──────────────────────────────────────────
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    const mask = logoMaskRef.current as SVGGraphicsElement | null
    const container = logoContainerRef.current
    const refBox = referenciaRef.current
    if (!mask || !container || !refBox) return

    const bbox = mask.getBBox()
    const dims = container.getBoundingClientRect()
    const refY = refBox.getBoundingClientRect().y
    const scale = Math.min(dims.width / bbox.width, dims.height / bbox.height)

    let vertY = refY - lv
    const mobileH = dims.left + (dims.width - bbox.width * scale) / lh - bbox.x * scale + extraH

    if (window.innerWidth >= 2300) {
      vertY = refY - (window.innerHeight > 1280 ? lv23 - lhs23 : lv23 - lh23)
    }
    if (window.innerWidth >= 3000) vertY = refY - lv30
    if (window.innerWidth >= 4000) vertY = refY - lv40

    if (window.innerWidth > 800) {
      const horiPct = ((bbox.width / window.innerWidth) * 100) / 2
      gsap.to('#logoMask', {
        transform: `translate(${(100 - horiPct) / 2}%, ${vertY}px) scale(${scale})`,
      })
    } else {
      gsap.to('#logoRevealMask', { display: 'flex' })
      gsap.to('#logoMask', { transform: `translate(${mobileH}px, 20vh) scale(1)`, width: '100vw' })
    }
  }, [])

  // ── Scroll-driven animations ─────────────────────────────────────────────
  useGSAP(
    () => {
      if (!heroRef.current) return

      const mm = gsap.matchMedia()
      const D = ANIM.desktop
      const M = ANIM.mobile
      const pinEnd = `${window.innerHeight * pinMultiplier}px`

      // Desktop (≥ 800px) ──────────────────────────────────────────────────
      mm.add('(min-width: 800px)', () => {
        gsap.set('.hero', {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: pinEnd,
            pin: true,
            pinSpacing: false,
            scrub: 1,
            onUpdate: ({ progress: raw }) => {
              const p = raw * 2 // remap [0,1] → [0,2] for two-phase animation

              // Phase 1 – fade out hero image & copy
              if (p <= 0.2) {
                const opacity = p < D.fadeEnd ? Math.max(0, 1 - p * (1 / D.fadeEnd)) : 0
                gsap.set('.video-icon-container', { display: p < D.fadeEnd ? 'block' : 'none' })
                gsap.set(['.hero-img-logo', '.hero-img-copy', '.video-icon-container'], { opacity })
              }

              // Phase 2 – overlay reveal
              if (p <= D.mid) {
                const norm = Math.max(0, p * 2 - 0.02)
                gsap.set('.hero-principal-img', { scale: (D.chairStartScale - D.chairScaleRate * norm) / 1.2 })
                gsap.set('.overlay', {
                  scale: D.initOverlayScale * Math.pow(1 / D.initOverlayScale, norm) * 2,
                })

                const revealP =
                  p >= D.revealStart ? Math.min(1, (p - D.revealStart) / (D.mid - D.revealStart)) : 0
                const copyScale = D.copyStartScale - D.copyScaleRate * revealP

                if (fadeOverlayRef.current) {
                  fadeOverlayRef.current.style.background = `linear-gradient(151deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`
                }
                setGradient(overlayTitleRef.current, 'reveal', revealP, true)
                setGradient(overlayTextRef.current, 'reveal', revealP, false)
                gsap.set(fadeOverlayRef.current, { opacity: revealP })
                gsap.set([overlayImgRef.current, overlayTitleRef.current, overlayTextRef.current], {
                  scale: copyScale,
                  opacity: revealP,
                })
              }

              // Phase 3 – overlay disappear
              if (p > D.mid) {
                const prog = (p - D.mid) * 2
                const { bottom: gb, top: gt } = gradPos(prog)
                setGradient(overlayTitleRef.current, 'hide', prog, true)
                setGradient(overlayTextRef.current, 'hide', prog, false)

                if (fadeOverlayRef.current) {
                  fadeOverlayRef.current.style.background =
                    prog > 0.8
                      ? 'var(--bg-primary)'
                      : `linear-gradient(151deg, ${gradientColor2} 0%, ${gradientColor1} ${gt}%, var(--bg-primary) ${gb}%, var(--bg-primary) 100%)`
                }
                gsap.set([overlayTitleRef.current, overlayTextRef.current, overlayImgRef.current], {
                  opacity: 1 - prog,
                })
                gsap.set('.overlay', { display: prog > 0.8 ? 'none' : 'block', transform: 'scale(1)' })
                gsap.set(fadeOverlayRef.current, { opacity: 1 })
              }

              gsap.set(heroRef.current, { opacity: p > D.heroFadeOut ? 0 : 1 })
            },
          },
        })
      })

      // Mobile (< 800px) ───────────────────────────────────────────────────
      mm.add('(max-width: 799px)', () => {
        gsap.set(heroRef.current, {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: pinEnd,
            pin: true,
            pinSpacing: false,
            scrub: 1,
            onUpdate: ({ progress: p }) => {
              if (p < M.iconFadeEnd) {
                const prog = p / M.iconFadeEnd
                gsap.to('.video-icon-container', { opacity: 1 - prog })
                gsap.to(overlayTitleRef.current, { opacity: prog })
              }

              if (p < M.halfPoint) {
                gsap.to('.overlay', { opacity: p * 2 })
              }

              if (p > M.revealStart && p < M.revealEnd) {
                const prog = (p - M.revealStart) / (M.revealEnd - M.revealStart)
                setGradient(overlayTitleRef.current, 'reveal', prog, true)
                setGradient(overlayTextRef.current, 'reveal', prog, false)
                gsap.to([fadeOverlayRef.current, overlayImgRef.current, overlayTextRef.current], {
                  opacity: prog,
                })
              }

              if (p >= M.revealEnd) {
                const prog = (p - M.revealEnd) / (1 - M.revealEnd)
                const { bottom: gb, top: gt } = gradPos(prog)
                setGradient(overlayTitleRef.current, 'hide', prog, true)
                setGradient(overlayTextRef.current, 'hide', prog, false)
                if (fadeOverlayRef.current) {
                  fadeOverlayRef.current.style.background = `linear-gradient(151deg, ${gradientColor2} 0%, ${gradientColor1} ${gt}%, var(--bg-primary) ${gb}%, var(--bg-primary) 100%)`
                }
                gsap.to([overlayImgRef.current, overlayTextRef.current], { opacity: 1 - prog })
              }
            },
          },
        })
      })
    },
    { scope: heroRef },
  )

  return (
    <section className="hero" ref={heroRef}>
      {/* Background + product image */}
      <div className="hero-img-container">
        <img className="hero-fondo" src={toUrl(backgroundImage)} alt="" fetchPriority="high" />
        <div className="hero-img-logo">
          <h3 className="frase-principal">{phrase}</h3>
        </div>
        <img className="hero-principal-img" src={toUrl(chairImage)} alt="" />
        <div className="hero-img-copy">
          <p>{scrollLabel}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 25 25"
            strokeWidth={1}
            stroke="currentColor"
            className="arrow-down"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Play button */}
      <div className="video-icon-container">
        <div className="video-play">
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

      {/* Colour wash overlay */}
      <div className="fade-overlay" ref={fadeOverlayRef} />

      {/* SVG logo reveal mask */}
      <div className="overlay">
        <svg width="100%" height="100%">
          <defs>
            <mask id="logoRevealMask">
              <rect width="100%" height="100%" fill="white" id="rectInicio" />
              <path id="logoMask" d={logoData} ref={logoMaskRef} width="400px" height="400px" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#111117" mask="url(#logoRevealMask)" />
        </svg>
      </div>

      {/* Invisible reference box used to compute logo position */}
      <div className="logo-container" ref={logoContainerRef}>
        <div className="referencia" ref={referenciaRef} />
      </div>

      {/* Reveal headline */}
      <div className="overlay-copy">
        <h1 ref={overlayTitleRef}>
          {preorderLine1}
          <br />
          {preorderLine2}
        </h1>
        <img ref={overlayImgRef} src={toUrl(separatorImage)} alt="" />
        <p ref={overlayTextRef}>{limitedEditionLabel}</p>
      </div>
    </section>
  )
}

export default PrincipalBanner

// ─── Weaverse schema ────────────────────────────────────────────────────────

export const schema = createSchema({
  type: 'principal-banner',
  title: 'Principal Banner',
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'phrase',
          label: 'Hero phrase',
          defaultValue: 'Diseñado para los que exigen más.',
        },
        {
          type: 'text',
          name: 'preorderLine1',
          label: 'Headline – line 1',
          defaultValue: 'Pre-order',
        },
        {
          type: 'text',
          name: 'preorderLine2',
          label: 'Headline – line 2',
          defaultValue: 'now',
        },
        {
          type: 'text',
          name: 'limitedEditionLabel',
          label: 'Limited edition label',
          defaultValue: 'Limited edition',
        },
        {
          type: 'text',
          name: 'scrollLabel',
          label: 'Scroll hint',
          defaultValue: 'Scroll to reveal',
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
      group: 'Colors',
      inputs: [
        {
          type: 'color',
          name: 'gradientColor1',
          label: 'Gradient – start',
          defaultValue: '#997124',
        },
        {
          type: 'color',
          name: 'gradientColor2',
          label: 'Gradient – end',
          defaultValue: '#f1e2b7',
        },
      ],
    },
    {
      group: 'Logo Mask',
      inputs: [
        {
          type: 'textarea',
          name: 'logoData',
          label: 'SVG path data (d attribute)',
          defaultValue: '',
        },
      ],
    },
    {
      group: 'Logo Position',
      inputs: [
        {
          type: 'range',
          name: 'lh',
          label: 'Horizontal divisor (mobile)',
          defaultValue: 2,
          configs: { min: 0.5, max: 10, step: 0.1 },
        },
        {
          type: 'range',
          name: 'lv',
          label: 'Vertical offset',
          defaultValue: 0,
          configs: { min: -500, max: 500, step: 1, unit: 'px' },
        },
        {
          type: 'range',
          name: 'lv23',
          label: 'Vertical offset ≥ 2300 px',
          defaultValue: 0,
          configs: { min: -500, max: 500, step: 1, unit: 'px' },
        },
        {
          type: 'range',
          name: 'lh23',
          label: 'Horizontal offset ≥ 2300 px (landscape)',
          defaultValue: 0,
          configs: { min: -500, max: 500, step: 1, unit: 'px' },
        },
        {
          type: 'range',
          name: 'lhs23',
          label: 'Horizontal offset ≥ 2300 px (tall)',
          defaultValue: 0,
          configs: { min: -500, max: 500, step: 1, unit: 'px' },
        },
        {
          type: 'range',
          name: 'lv30',
          label: 'Vertical offset ≥ 3000 px',
          defaultValue: 0,
          configs: { min: -500, max: 500, step: 1, unit: 'px' },
        },
        {
          type: 'range',
          name: 'lv40',
          label: 'Vertical offset ≥ 4000 px',
          defaultValue: 0,
          configs: { min: -500, max: 500, step: 1, unit: 'px' },
        },
        {
          type: 'range',
          name: 'extraH',
          label: 'Extra horizontal nudge',
          defaultValue: 0,
          configs: { min: -200, max: 200, step: 1, unit: 'px' },
        },
      ],
    },
    {
      group: 'Animation',
      inputs: [
        {
          type: 'range',
          name: 'pinMultiplier',
          label: 'Scroll pin height (× viewport)',
          defaultValue: 2,
          configs: { min: 1, max: 5, step: 0.5 },
        },
      ],
    },
  ],
  presets: {
    phrase: 'Diseñado para los que exigen más.',
    preorderLine1: 'Pre-order',
    preorderLine2: 'now',
    limitedEditionLabel: 'Limited edition',
    scrollLabel: 'Scroll to reveal',
    gradientColor1: '#997124',
    gradientColor2: '#f1e2b7',
    logoData: '',
    lh: 2,
    lv: 0,
    lv23: 0,
    lh23: 0,
    lhs23: 0,
    lv30: 0,
    lv40: 0,
    extraH: 0,
    pinMultiplier: 2,
  },
})
