import React, { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from '@weaverse/hydrogen'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { selectorPaddingMargin } from '~/utils/general'

// ─── Types ─────────────────────────────────────────────────────────────────

interface SliderPlacasProps extends HydrogenComponentProps {
  bannerImage: WeaverseImage
  bannerTitle: string
  titleSize: number
  titleSizeMobile: number
  titleFamily: string
  titleWeight: string
  titleSpacing: number
  titleColor: string
  titleTop: number
  titleTopMobile: number
  overlayTitleTop: number
  overlayTitleTopMobile: number
  // Open button
  openButtonLabel: string
  openBtnColor: string
  openBtnBg: string
  openBtnRadius: number
  openBtnFontSize: number
  openBtnFontSizeMobile: number
  openBtnFontFamily: string
  openBtnLetterSpacing: number
  openBtnPaddingV: number
  openBtnPaddingH: number
  // Back button
  backButtonLabel: string
  backBtnColor: string
  backBtnBg: string
  backBtnRadius: number
  backBtnFontSize: number
  backBtnFontSizeMobile: number
  backBtnFontFamily: string
  backBtnLetterSpacing: number
  backBtnPaddingV: number
  backBtnPaddingH: number
  // Intro panel
  introTitle: string
  introTitleSize: number
  introTitleSizeMobile: number
  introTitleFamily: string
  introTitleColor: string
  introLine1: string
  introLine2: string
  introTextSize: number
  introTextSizeMobile: number
  introTextFamily: string
  introLine1Color: string
  introLine2Color: string
  // Banner spacing – desktop
  bannerPaddingSelect: string
  bannerPaddingText: string
  bannerMarginSelect: string
  bannerMarginText: string
  // Banner spacing – mobile
  bannerPaddingSelectMobile: string
  bannerPaddingTextMobile: string
  bannerMarginSelectMobile: string
  bannerMarginTextMobile: string
  // Colors
  gradientColorStart: string
  gradientColorEnd: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function toUrl(img: WeaverseImage | undefined): string {
  if (!img) return ''
  return typeof img === 'string' ? img : img.url
}

const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extrabold (800)' },
]

// ─── Section ────────────────────────────────────────────────────────────────

function SliderPlacas(props: SliderPlacasProps) {
  const {
    bannerImage,
    bannerTitle = 'Colección de Placas',
    titleSize = 40,
    titleSizeMobile = 25,
    titleFamily = "'EB Garamond', serif",
    titleWeight = '500',
    titleSpacing = 0,
    titleColor = '#ffffff',
    titleTop = 5,
    titleTopMobile = 5,
    overlayTitleTop = 5,
    overlayTitleTopMobile = 25,
    openButtonLabel = 'Ver colección',
    openBtnColor = '#000000',
    openBtnBg = '#EAE089',
    openBtnRadius = 30,
    openBtnFontSize = 18,
    openBtnFontSizeMobile = 14,
    openBtnFontFamily = "'EB Garamond', serif",
    openBtnLetterSpacing = 0,
    openBtnPaddingV = 12,
    openBtnPaddingH = 32,
    backButtonLabel = 'Volver',
    backBtnColor = '#000000',
    backBtnBg = '#EAE089',
    backBtnRadius = 30,
    backBtnFontSize = 20,
    backBtnFontSizeMobile = 16,
    backBtnFontFamily = "'EB Garamond', serif",
    backBtnLetterSpacing = 0,
    backBtnPaddingV = 16,
    backBtnPaddingH = 32,
    introTitle = 'Subtítulo de colección',
    introTitleSize = 40,
    introTitleSizeMobile = 28,
    introTitleFamily = "'EB Garamond', serif",
    introTitleColor = '#ffffff',
    introLine1 = 'Línea descriptiva 1.',
    introLine2 = 'Línea descriptiva 2.',
    introTextSize = 22,
    introTextSizeMobile = 16,
    introTextFamily = 'sans-serif',
    introLine1Color = '#000000',
    introLine2Color = '#ffffff',
    bannerPaddingSelect = 'a',
    bannerPaddingText = '0px',
    bannerMarginSelect = 'a',
    bannerMarginText = '0px',
    bannerPaddingSelectMobile = 'a',
    bannerPaddingTextMobile = '0px',
    bannerMarginSelectMobile = 'a',
    bannerMarginTextMobile = '0px',
    gradientColorStart = '#CABCB4',
    gradientColorEnd = '#2A1C14',
    children,
  } = props

  const isMobile = useIsMobile(800)
  const savedScrollY = useRef(0)

  const overlayRef  = useRef<HTMLDivElement>(null)
  const inicioRef   = useRef<HTMLDivElement>(null)
  const textOverRef = useRef<HTMLDivElement>(null)
  const expandRef   = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP({ scope: overlayRef })

  // Redirect wheel (deltaY + deltaX) to horizontal scroll only
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (overlayRef.current) {
      overlayRef.current.scrollLeft += (e.deltaY + e.deltaX) * 3
    }
  }, [])

  const lockScroll = () => {
    savedScrollY.current = window.scrollY
    document.documentElement.style.overflow = 'hidden'
  }

  const unlockScroll = () => {
    document.documentElement.style.overflow = ''
    window.scrollTo(0, savedScrollY.current)
  }

  const showSlider = contextSafe(() => {
    const mobile = window.innerWidth <= 800
    lockScroll()

    gsap.set(overlayRef.current, { display: 'flex', opacity: 0 })
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, delay: 0.1 })

    gsap.to(inicioRef.current, {
      delay: 0.3,
      padding: mobile ? 0 : '5vh',
      width: mobile ? '85vw' : '77vw',
    })

    if (!mobile) {
      gsap.to(textOverRef.current, { delay: 0.3, scale: 0.8 })
    }

    gsap.to(expandRef.current, {
      delay: 0.3,
      display: mobile ? 'flex' : 'grid',
    })

    overlayRef.current?.addEventListener('wheel', handleWheel, { passive: false })
  })

  const hideSlider = contextSafe(() => {
    if (!overlayRef.current) return
    const mobile = window.innerWidth <= 800

    overlayRef.current.scrollLeft = 0
    gsap.to(expandRef.current, { display: 'none' })
    gsap.to(textOverRef.current, { delay: 0.3, scale: 1 })
    gsap.to(inicioRef.current, { delay: 0.3, padding: 0, width: mobile ? '100%' : 'auto' })
    gsap.to(overlayRef.current, {
      delay: 0.7,
      opacity: 0,
      onComplete: () => {
        gsap.set(overlayRef.current, { display: 'none' })
        unlockScroll()
        overlayRef.current?.removeEventListener('wheel', handleWheel)
      },
    })
  })

  // ── Derived styles ──────────────────────────────────────────────────────

  const gradient = `linear-gradient(90deg, ${gradientColorStart} 0%, ${gradientColorEnd} 100%)`

  const titleStyle: React.CSSProperties = {
    color: titleColor,
    fontSize: `${isMobile ? titleSizeMobile : titleSize}px`,
    fontFamily: titleFamily,
    fontWeight: titleWeight,
    letterSpacing: `${titleSpacing}px`,
    textAlign: 'center',
    width: '80%',
  }

  return (
    <section className="relative w-full">

      {/* ── Trigger (visible on page) ─────────────────────────── */}
      <div
        className="relative w-full"
        style={{
          ...selectorPaddingMargin('padding', isMobile ? bannerPaddingSelectMobile : bannerPaddingSelect, isMobile ? bannerPaddingTextMobile : bannerPaddingText),
          ...selectorPaddingMargin('margin',  isMobile ? bannerMarginSelectMobile  : bannerMarginSelect,  isMobile ? bannerMarginTextMobile  : bannerMarginText),
        }}
      >
        {toUrl(bannerImage) && (
          <img src={toUrl(bannerImage)} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
        )}
        {/* Title — absolute, centered, position controlled by titleTop */}
        <h3
          style={{
            ...titleStyle,
            position: 'absolute',
            top: `${isMobile ? titleTopMobile : titleTop}%`,
            left: '50%',
            transform: 'translateX(-50%)',
            margin: 0,
          }}
        >
          {bannerTitle}
        </h3>

        {/* Button — absolute, bottom */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end"
          style={{ paddingBottom: '2rem' }}
        >
          <button
            type="button"
            onClick={showSlider}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: openBtnBg,
              color: openBtnColor,
              border: 'none',
              cursor: 'pointer',
              borderRadius: `${openBtnRadius}px`,
              fontSize: `${isMobile ? openBtnFontSizeMobile : openBtnFontSize}px`,
              fontFamily: openBtnFontFamily,
              letterSpacing: `${openBtnLetterSpacing}px`,
              padding: `${openBtnPaddingV}px ${openBtnPaddingH}px`,
            }}
          >
            {openButtonLabel}
          </button>
        </div>
      </div>

      {/* ── Full-screen overlay ───────────────────────────────── */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          display: 'none',
          zIndex: 9999,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          background: gradient,

        }}
      >
        {/* Back button (fixed inside overlay) */}
        <div style={{ position: 'fixed', top: isMobile ? '3.5rem' : '4rem', left: isMobile ? '1rem' : '2rem', zIndex: 10000 }}>
          <button
            type="button"
            onClick={hideSlider}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: backBtnBg,
              color: backBtnColor,
              border: 'none',
              cursor: 'pointer',
              borderRadius: `${backBtnRadius}px`,
              fontSize: `${isMobile ? backBtnFontSizeMobile : backBtnFontSize}px`,
              fontFamily: backBtnFontFamily,
              letterSpacing: `${backBtnLetterSpacing}px`,
              padding: `${backBtnPaddingV}px ${backBtnPaddingH}px`,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
              style={{ height: '1em', marginRight: '12px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            {backButtonLabel}
          </button>
        </div>

        {/* Content — min 100vw so gradient always fills the viewport */}
        <div
          style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'column' : undefined,
            gridTemplateColumns: isMobile ? undefined : 'repeat(2, 1fr)',
            gap: '2rem',
            // background: gradient,
            alignItems: 'center',
            alignContent: 'center',
            minWidth: '100vw',
            minHeight: '100vh',
          }}
        >
          {/* Left panel: banner image + title */}
          <div
            ref={inicioRef}
            style={{
              width: 'auto',
              height: '100vh',
              transition: 'all 500ms ease',
              marginTop: isMobile ? '4.5rem' : undefined,
              flexShrink: 0,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {toUrl(bannerImage) && (
              <img src={toUrl(bannerImage)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <div
              ref={textOverRef}
              style={{ display: 'flex', justifyContent: 'center', position: 'absolute', top: `${isMobile ? overlayTitleTopMobile : overlayTitleTop}%`, left: 0, right: 0 }}
            >
              <h3 style={titleStyle}>
                {bannerTitle}
              </h3>
            </div>
          </div>

          {/* Right panel: intro + cards */}
          <div
            ref={expandRef}
            style={{
              display: 'none',
              gridAutoFlow: 'column',
              gridAutoColumns: '1fr',
              gap: isMobile ? '2rem' : '7rem',
              paddingRight: isMobile ? undefined : '100px',
              paddingInline: isMobile ? '2rem' : undefined,
              flexDirection: isMobile ? 'column' : undefined,
              width: isMobile ? '100vw' : undefined,
              overflowY: isMobile ? 'auto' : undefined,
              alignItems: 'center',
            }}
          >
            {/* Intro card */}
            <div
              style={{
                width: isMobile ? '100%' : '22vw',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'left',
                flexShrink: 0,
              }}
            >
              <h4 style={{
                fontFamily: introTitleFamily,
                fontSize: `${isMobile ? introTitleSizeMobile : introTitleSize}px`,
                color: introTitleColor,
              }}>
                {introTitle}
              </h4>
              <p style={{
                marginTop: isMobile ? '1rem' : '5rem',
                fontSize: `${isMobile ? introTextSizeMobile : introTextSize}px`,
                lineHeight: 1.4,
                fontFamily: introTextFamily,
                color: introLine1Color,
              }}>
                {introLine1}
              </p>
              <p style={{
                fontSize: `${isMobile ? introTextSizeMobile : introTextSize}px`,
                lineHeight: 1.4,
                fontFamily: introTextFamily,
                color: introLine2Color,
              }}>
                {introLine2}
              </p>
            </div>

            {/* Plate cards (children) */}
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SliderPlacas

// ─── Weaverse schema ────────────────────────────────────────────────────────

export const schema = createSchema({
  type: 'slider-placas',
  title: 'Slider Placas',
  childTypes: ['placa-card'],
  settings: [
    {
      group: 'Banner',
      inputs: [
        { type: 'image', name: 'bannerImage', label: 'Banner image' },
        { type: 'text', name: 'bannerTitle', label: 'Title', defaultValue: 'Colección de Placas' },
        { type: 'range', name: 'titleSize', label: 'Size – desktop (px)', defaultValue: 40, configs: { min: 16, max: 100, step: 2, unit: 'px' } },
        { type: 'range', name: 'titleSizeMobile', label: 'Size – mobile (px)', defaultValue: 25, configs: { min: 14, max: 60, step: 1, unit: 'px' } },
        { type: 'text', name: 'titleFamily', label: 'Font family (CSS string)', defaultValue: "'EB Garamond', serif" },
        { type: 'select', name: 'titleWeight', label: 'Font weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '500' },
        { type: 'range', name: 'titleSpacing', label: 'Letter spacing (px)', defaultValue: 0, configs: { min: -5, max: 30, step: 0.5, unit: 'px' } },
        { type: 'color', name: 'titleColor', label: 'Color', defaultValue: '#ffffff' },
        { type: 'range', name: 'titleTop', label: 'Position from top – desktop (%)', defaultValue: 5, configs: { min: 0, max: 90, step: 1, unit: '%' } },
        { type: 'range', name: 'titleTopMobile', label: 'Position from top – mobile (%)', defaultValue: 5, configs: { min: 0, max: 90, step: 1, unit: '%' } },
        { type: 'range', name: 'overlayTitleTop', label: 'Overlay panel: position from top – desktop (%)', defaultValue: 5, configs: { min: 0, max: 90, step: 1, unit: '%' } },
        { type: 'range', name: 'overlayTitleTopMobile', label: 'Overlay panel: position from top – mobile (%)', defaultValue: 25, configs: { min: 0, max: 90, step: 1, unit: '%' } },
      ],
    },
    {
      group: 'Open button',
      inputs: [
        { type: 'text', name: 'openButtonLabel', label: 'Label', defaultValue: 'Ver colección' },
        { type: 'color', name: 'openBtnColor', label: 'Text color', defaultValue: '#000000' },
        { type: 'color', name: 'openBtnBg', label: 'Background', defaultValue: '#EAE089' },
        { type: 'range', name: 'openBtnRadius', label: 'Border radius (px)', defaultValue: 30, configs: { min: 0, max: 60, step: 1, unit: 'px' } },
        { type: 'range', name: 'openBtnFontSize', label: 'Font size – desktop (px)', defaultValue: 18, configs: { min: 10, max: 40, step: 1, unit: 'px' } },
        { type: 'range', name: 'openBtnFontSizeMobile', label: 'Font size – mobile (px)', defaultValue: 14, configs: { min: 10, max: 30, step: 1, unit: 'px' } },
        { type: 'text', name: 'openBtnFontFamily', label: 'Font family (CSS string)', defaultValue: "'EB Garamond', serif" },
        { type: 'range', name: 'openBtnLetterSpacing', label: 'Letter spacing (px)', defaultValue: 0, configs: { min: -5, max: 20, step: 0.5, unit: 'px' } },
        { type: 'range', name: 'openBtnPaddingV', label: 'Padding vertical (px)', defaultValue: 12, configs: { min: 4, max: 40, step: 1, unit: 'px' } },
        { type: 'range', name: 'openBtnPaddingH', label: 'Padding horizontal (px)', defaultValue: 32, configs: { min: 8, max: 80, step: 1, unit: 'px' } },
      ],
    },
    {
      group: 'Back button',
      inputs: [
        { type: 'text', name: 'backButtonLabel', label: 'Label', defaultValue: 'Volver' },
        { type: 'color', name: 'backBtnColor', label: 'Text color', defaultValue: '#000000' },
        { type: 'color', name: 'backBtnBg', label: 'Background', defaultValue: '#EAE089' },
        { type: 'range', name: 'backBtnRadius', label: 'Border radius (px)', defaultValue: 30, configs: { min: 0, max: 60, step: 1, unit: 'px' } },
        { type: 'range', name: 'backBtnFontSize', label: 'Font size – desktop (px)', defaultValue: 20, configs: { min: 10, max: 40, step: 1, unit: 'px' } },
        { type: 'range', name: 'backBtnFontSizeMobile', label: 'Font size – mobile (px)', defaultValue: 16, configs: { min: 10, max: 30, step: 1, unit: 'px' } },
        { type: 'text', name: 'backBtnFontFamily', label: 'Font family (CSS string)', defaultValue: "'EB Garamond', serif" },
        { type: 'range', name: 'backBtnLetterSpacing', label: 'Letter spacing (px)', defaultValue: 0, configs: { min: -5, max: 20, step: 0.5, unit: 'px' } },
        { type: 'range', name: 'backBtnPaddingV', label: 'Padding vertical (px)', defaultValue: 16, configs: { min: 4, max: 40, step: 1, unit: 'px' } },
        { type: 'range', name: 'backBtnPaddingH', label: 'Padding horizontal (px)', defaultValue: 32, configs: { min: 8, max: 80, step: 1, unit: 'px' } },
      ],
    },
    {
      group: 'Intro panel',
      inputs: [
        { type: 'text', name: 'introTitle', label: 'Subtitle', defaultValue: 'Subtítulo de colección' },
        { type: 'range', name: 'introTitleSize', label: 'Subtitle size – desktop (px)', defaultValue: 40, configs: { min: 16, max: 80, step: 2, unit: 'px' } },
        { type: 'range', name: 'introTitleSizeMobile', label: 'Subtitle size – mobile (px)', defaultValue: 28, configs: { min: 14, max: 50, step: 1, unit: 'px' } },
        { type: 'text', name: 'introTitleFamily', label: 'Subtitle font (CSS string)', defaultValue: "'EB Garamond', serif" },
        { type: 'color', name: 'introTitleColor', label: 'Subtitle color', defaultValue: '#ffffff' },
        { type: 'textarea', name: 'introLine1', label: 'Paragraph 1', defaultValue: 'Línea descriptiva 1.' },
        { type: 'textarea', name: 'introLine2', label: 'Paragraph 2', defaultValue: 'Línea descriptiva 2.' },
        { type: 'range', name: 'introTextSize', label: 'Paragraph size – desktop (px)', defaultValue: 22, configs: { min: 12, max: 50, step: 1, unit: 'px' } },
        { type: 'range', name: 'introTextSizeMobile', label: 'Paragraph size – mobile (px)', defaultValue: 16, configs: { min: 10, max: 30, step: 1, unit: 'px' } },
        { type: 'text', name: 'introTextFamily', label: 'Paragraph font (CSS string)', defaultValue: 'sans-serif' },
        { type: 'color', name: 'introLine1Color', label: 'Paragraph 1 color', defaultValue: '#000000' },
        { type: 'color', name: 'introLine2Color', label: 'Paragraph 2 color', defaultValue: '#ffffff' },
      ],
    },
    {
      group: 'Banner spacing – desktop',
      inputs: [
        { type: 'select', name: 'bannerPaddingSelect', label: 'Padding type', defaultValue: 'a', configs: { options: [{ value:'t',label:'Top' },{ value:'b',label:'Bottom' },{ value:'l',label:'Left' },{ value:'r',label:'Right' },{ value:'x',label:'Inline' },{ value:'y',label:'Block' },{ value:'a',label:'Custom' }] } },
        { type: 'text',   name: 'bannerPaddingText',   label: 'Padding value (CSS)', defaultValue: '0px' },
        { type: 'select', name: 'bannerMarginSelect',  label: 'Margin type',  defaultValue: 'a', configs: { options: [{ value:'t',label:'Top' },{ value:'b',label:'Bottom' },{ value:'l',label:'Left' },{ value:'r',label:'Right' },{ value:'x',label:'Inline' },{ value:'y',label:'Block' },{ value:'a',label:'Custom' }] } },
        { type: 'text',   name: 'bannerMarginText',    label: 'Margin value (CSS)',  defaultValue: '0px' },
      ],
    },
    {
      group: 'Banner spacing – mobile',
      inputs: [
        { type: 'select', name: 'bannerPaddingSelectMobile', label: 'Padding type', defaultValue: 'a', configs: { options: [{ value:'t',label:'Top' },{ value:'b',label:'Bottom' },{ value:'l',label:'Left' },{ value:'r',label:'Right' },{ value:'x',label:'Inline' },{ value:'y',label:'Block' },{ value:'a',label:'Custom' }] } },
        { type: 'text',   name: 'bannerPaddingTextMobile',   label: 'Padding value (CSS)', defaultValue: '0px' },
        { type: 'select', name: 'bannerMarginSelectMobile',  label: 'Margin type',  defaultValue: 'a', configs: { options: [{ value:'t',label:'Top' },{ value:'b',label:'Bottom' },{ value:'l',label:'Left' },{ value:'r',label:'Right' },{ value:'x',label:'Inline' },{ value:'y',label:'Block' },{ value:'a',label:'Custom' }] } },
        { type: 'text',   name: 'bannerMarginTextMobile',    label: 'Margin value (CSS)',  defaultValue: '0px' },
      ],
    },
    {
      group: 'Colors',
      inputs: [
        { type: 'color', name: 'gradientColorStart', label: 'Gradient – start', defaultValue: '#CABCB4' },
        { type: 'color', name: 'gradientColorEnd', label: 'Gradient – end', defaultValue: '#2A1C14' },
      ],
    },
  ],
  presets: {
    children: [{ type: 'placa-card' }],
  },
})
