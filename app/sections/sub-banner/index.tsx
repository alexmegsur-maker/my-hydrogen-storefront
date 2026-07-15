import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from '@weaverse/hydrogen'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { selectorPaddingMargin } from '~/utils/general'

// ─── Types ─────────────────────────────────────────────────────────────────

interface SubBannerProps extends HydrogenComponentProps {
  separatorImage: WeaverseImage
  gradientColor1: string
  gradientColor2: string
  // Headline
  line1: string
  line2: string
  titleSize: number
  titleSizeMobile: number
  titleFamily: string
  titleWeight: string
  titleSpacing: number
  titleAlign: 'left' | 'center' | 'right'
  // Description
  description: string
  descSize: number
  descSizeMobile: number
  descFamily: string
  descWeight: string
  descSpacing: number
  descAlign: 'left' | 'center' | 'right' | 'justify'
  // Separator
  separatorWidth: number
  separatorAlign: 'left' | 'center' | 'right'
  separatorWidthMobile: number
  // Layout
  contentTop: number
  contentTopMobile: number
  // Mobile overrides
  titleAlignMobile: 'left' | 'center' | 'right'
  descAlignMobile: 'left' | 'center' | 'right' | 'justify'
  // cont-text padding/margin
  contPaddingSelect: string
  contPaddingText: string
  contPaddingSelectMobile: string
  contPaddingTextMobile: string
  contMarginSelect: string
  contMarginText: string
  contMarginSelectMobile: string
  contMarginTextMobile: string
  // h3 padding/margin
  titlePaddingSelect: string
  titlePaddingText: string
  titlePaddingSelectMobile: string
  titlePaddingTextMobile: string
  titleMarginSelect: string
  titleMarginText: string
  titleMarginSelectMobile: string
  titleMarginTextMobile: string
  // p padding/margin
  descPaddingSelect: string
  descPaddingText: string
  descPaddingSelectMobile: string
  descPaddingTextMobile: string
  descMarginSelect: string
  descMarginText: string
  descMarginSelectMobile: string
  descMarginTextMobile: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function toUrl(img: WeaverseImage | undefined): string {
  if (!img) return ''
  return typeof img === 'string' ? img : img.url
}

const FONT_OPTIONS = [
  { value: "'EB Garamond', serif", label: 'Garamond' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Arial', sans-serif", label: 'Arial' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
]

const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extrabold (800)' },
]

const SELECTOR_OPTIONS = [
  { value: 't', label: 'Top' },
  { value: 'b', label: 'Bottom' },
  { value: 'l', label: 'Left' },
  { value: 'r', label: 'Right' },
  { value: 'x', label: 'Inline' },
  { value: 'y', label: 'Block' },
  { value: 'a', label: 'Custom' },
]

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

// ─── Section ────────────────────────────────────────────────────────────────

function SubBanner(props: SubBannerProps) {
  const {
    separatorImage,
    gradientColor1,
    gradientColor2,
    // Headline
    line1,
    line2,
    titleSize = 64,
    titleSizeMobile = 30,
    titleFamily = "'EB Garamond', serif",
    titleWeight = '500',
    titleSpacing = 0,
    titleAlign = 'center',
    // Description
    description,
    descSize = 25,
    descSizeMobile = 16,
    descFamily = "'EB Garamond', serif",
    descWeight = '500',
    descSpacing = 0,
    descAlign = 'justify',
    // Separator
    separatorWidth = 65,
    separatorAlign = 'center',
    separatorWidthMobile = 90,
    // Layout
    contentTop = 55,
    contentTopMobile = 50,
    // Mobile overrides
    titleAlignMobile = 'center',
    descAlignMobile = 'center',
    // cont-text padding/margin
    contPaddingSelect = 'a', contPaddingText = '0px',
    contPaddingSelectMobile = 'a', contPaddingTextMobile = '0px',
    contMarginSelect = 'a', contMarginText = '0px',
    contMarginSelectMobile = 'a', contMarginTextMobile = '0px',
    // h3 padding/margin
    titlePaddingSelect = 'x', titlePaddingText = '5rem',
    titlePaddingSelectMobile = 'a', titlePaddingTextMobile = '0px',
    titleMarginSelect = 'a', titleMarginText = '0px',
    titleMarginSelectMobile = 'a', titleMarginTextMobile = '0px',
    // p padding/margin
    descPaddingSelect = 'a', descPaddingText = '0px',
    descPaddingSelectMobile = 'x', descPaddingTextMobile = '5vw',
    descMarginSelect = 'a', descMarginText = '0px',
    descMarginSelectMobile = 'a', descMarginTextMobile = '0px',
  } = props

  const isMobile = useIsMobile(700)

  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)
      const section = sectionRef.current!

      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `${window.innerHeight * 2}px`,
          pin: true,
          pinSpacing: false,
          scrub: 1,
          onUpdate: (self) => {
            const scrollProgress = self.progress * 2
            const gradientSpread = 100

            if (scrollProgress <= 1) {
              // Fase 1: reveal (0 → 1)
              const progress = scrollProgress
              const gradientBottom = 240 - progress * 280
              const gradientTop = gradientBottom - gradientSpread
              const gradient = `linear-gradient(151deg, transparent 0%, transparent ${gradientTop}%, ${gradientColor1} ${gradientBottom}%, ${gradientColor2} 100%)`

              if (titleRef.current) {
                titleRef.current.style.background = gradient
                titleRef.current.style.backgroundClip = 'text'
                ;(titleRef.current.style as CSSStyleDeclaration & { webkitBackgroundClip: string }).webkitBackgroundClip = 'text'
              }
              if (textRef.current) {
                textRef.current.style.background = gradient
                textRef.current.style.backgroundClip = 'text'
                ;(textRef.current.style as CSSStyleDeclaration & { webkitBackgroundClip: string }).webkitBackgroundClip = 'text'
              }
              if (imgRef.current) gsap.set(imgRef.current, { opacity: progress })
            }

            if (scrollProgress > 1) {
              // Fase 2: hide (0 → 1)
              let progress = scrollProgress - 1
              if (progress > 0.3 && window.innerWidth < 900) {
                progress = (progress - 0.3) / 0.7
              }
              const disappear = 1 - progress
              const gradientBottom = 240 - progress * 280
              const gradientTop = gradientBottom - gradientSpread

              if (titleRef.current) {
                titleRef.current.style.background = `linear-gradient(151deg, ${gradientColor1} 0%, ${gradientColor2} ${gradientTop}%, transparent ${gradientBottom}%, #050505 100%)`
                titleRef.current.style.backgroundClip = 'text'
                ;(titleRef.current.style as CSSStyleDeclaration & { webkitBackgroundClip: string }).webkitBackgroundClip = 'text'
              }
              if (textRef.current) {
                textRef.current.style.background = `linear-gradient(151deg, ${gradientColor1} 0%, ${gradientColor2} ${gradientTop}%, transparent ${gradientBottom}%, transparent 100%)`
                textRef.current.style.backgroundClip = 'text'
                ;(textRef.current.style as CSSStyleDeclaration & { webkitBackgroundClip: string }).webkitBackgroundClip = 'text'
              }

              gsap.set([titleRef.current, imgRef.current, textRef.current], { opacity: disappear })
            }
          },
        },
      })
    },
    {
      scope: sectionRef,
      dependencies: [gradientColor1, gradientColor2],
    },
  )

  // ── Derived styles ──────────────────────────────────────────────────────

  const containerStyle: React.CSSProperties = isMobile
    ? { position: 'absolute', top: `${contentTopMobile}%`, left: 0, width: '100%', transform: 'translateY(-50%)', zIndex: 2 }
    : { position: 'absolute', top: `${contentTop}%`, left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }

  const activeSeparatorWidth = isMobile ? separatorWidthMobile : separatorWidth
  const activeSeparatorAlign = isMobile ? 'center' : separatorAlign
  const separatorMargin: React.CSSProperties = {
    width: `${activeSeparatorWidth}%`,
    paddingBlock: '0.5rem',
    marginLeft: activeSeparatorAlign === 'right' ? 'auto' : activeSeparatorAlign === 'center' ? 'auto' : 0,
    marginRight: activeSeparatorAlign === 'left' ? 'auto' : activeSeparatorAlign === 'center' ? 'auto' : 0,
  }

  return (
    <section
      className="sub-banner relative z-[11] h-[300vh] overflow-visible" 
      ref={sectionRef} 
    >
      <div
        className='cont-text'
        style={{
          ...containerStyle,
          ...selectorPaddingMargin('padding', isMobile ? contPaddingSelectMobile : contPaddingSelect, isMobile ? contPaddingTextMobile : contPaddingText),
          ...selectorPaddingMargin('margin',  isMobile ? contMarginSelectMobile  : contMarginSelect,  isMobile ? contMarginTextMobile  : contMarginText),
        }}
      >

        {/* Headline */}
        <h3 
          ref={titleRef}
          style={{
            color: 'transparent',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            transformOrigin: 'center 0%', 
            lineHeight: 1.1,
            fontSize: `${isMobile ? titleSizeMobile : titleSize}px`,
            fontFamily: titleFamily,
            fontWeight: titleWeight,
            letterSpacing: `${titleSpacing}px`,
            textAlign: isMobile ? titleAlignMobile : titleAlign,
            width: isMobile ? '90vw' : 'min(max-content, 90vw)',
            ...selectorPaddingMargin('padding', isMobile ? titlePaddingSelectMobile : titlePaddingSelect, isMobile ? titlePaddingTextMobile : titlePaddingText),
            ...selectorPaddingMargin('margin',  isMobile ? titleMarginSelectMobile  : titleMarginSelect,  isMobile ? titleMarginTextMobile  : titleMarginText),
          }}
        >
          {line1}
          <br />
          {line2}
        </h3>

        {/* Separator image */}
        <img
          ref={imgRef}
          src={toUrl(separatorImage)}
          alt=""
          style={{
            ...separatorMargin,
            display: 'block',
            height: 'auto',
            opacity: 0,
          }}
        />

        {/* Description */}
        <p
          ref={textRef}
          style={{
            color: 'transparent',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            lineHeight: 1.4,
            width: '100%',
            fontSize: `${isMobile ? descSizeMobile : descSize}px`,
            ...selectorPaddingMargin('padding', isMobile ? descPaddingSelectMobile : descPaddingSelect, isMobile ? descPaddingTextMobile : descPaddingText),
            ...selectorPaddingMargin('margin',  isMobile ? descMarginSelectMobile  : descMarginSelect,  isMobile ? descMarginTextMobile  : descMarginText),
            fontFamily: descFamily,
            fontWeight: descWeight,
            letterSpacing: `${descSpacing}px`,
            textAlign: isMobile ? descAlignMobile : descAlign,
          }}
        >
          {description}
        </p>

      </div>
    </section>
  )
}

export default SubBanner

// ─── Weaverse schema ────────────────────────────────────────────────────────

export const schema = createSchema({
  type: 'sub-banner',
  title: 'Sub Banner',
  settings: [
    {
      group: 'Headline',
      inputs: [
        { type: 'text', name: 'line1', label: 'Line 1', defaultValue: 'Diseñado para' },
        { type: 'text', name: 'line2', label: 'Line 2', defaultValue: 'los que exigen más.' },
        { type: 'range', name: 'titleSize', label: 'Font size – desktop (px)', defaultValue: 64, configs: { min: 20, max: 200, step: 2, unit: 'px' } },
        { type: 'range', name: 'titleSizeMobile', label: 'Font size – mobile (px)', defaultValue: 30, configs: { min: 14, max: 80, step: 1, unit: 'px' } },
        { type: 'select', name: 'titleFamily', label: 'Font family', configs: { options: FONT_OPTIONS }, defaultValue: "'EB Garamond', serif" },
        { type: 'select', name: 'titleWeight', label: 'Font weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '500' },
        { type: 'range', name: 'titleSpacing', label: 'Letter spacing (px)', defaultValue: 0, configs: { min: -5, max: 20, step: 0.5, unit: 'px' } },
        { type: 'select', name: 'titleAlign', label: 'Alignment – desktop', configs: { options: ALIGN_OPTIONS }, defaultValue: 'center' },
        { type: 'select', name: 'titleAlignMobile', label: 'Alignment – mobile', configs: { options: ALIGN_OPTIONS }, defaultValue: 'center' },
      ],
    },
    {
      group: 'Description',
      inputs: [
        { type: 'textarea', name: 'description', label: 'Text', defaultValue: 'Descripción del producto.' },
        { type: 'range', name: 'descSize', label: 'Font size – desktop (px)', defaultValue: 25, configs: { min: 12, max: 80, step: 1, unit: 'px' } },
        { type: 'range', name: 'descSizeMobile', label: 'Font size – mobile (px)', defaultValue: 16, configs: { min: 10, max: 40, step: 1, unit: 'px' } },
        { type: 'select', name: 'descFamily', label: 'Font family', configs: { options: FONT_OPTIONS }, defaultValue: "'EB Garamond', serif" },
        { type: 'select', name: 'descWeight', label: 'Font weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '500' },
        { type: 'range', name: 'descSpacing', label: 'Letter spacing (px)', defaultValue: 0, configs: { min: -5, max: 20, step: 0.5, unit: 'px' } },
        {
          type: 'select',
          name: 'descAlign',
          label: 'Alignment – desktop',
          configs: { options: [...ALIGN_OPTIONS, { value: 'justify', label: 'Justify' }] },
          defaultValue: 'justify',
        },
        {
          type: 'select',
          name: 'descAlignMobile',
          label: 'Alignment – mobile',
          configs: { options: [...ALIGN_OPTIONS, { value: 'justify', label: 'Justify' }] },
          defaultValue: 'center',
        },
      ],
    },
    {
      group: 'Separator',
      inputs: [
        { type: 'image', name: 'separatorImage', label: 'Separator image' },
        { type: 'range', name: 'separatorWidth', label: 'Width – desktop (%)', defaultValue: 65, configs: { min: 10, max: 100, step: 5, unit: '%' } },
        { type: 'select', name: 'separatorAlign', label: 'Alignment – desktop', configs: { options: ALIGN_OPTIONS }, defaultValue: 'center' },
        { type: 'range', name: 'separatorWidthMobile', label: 'Width – mobile (%)', defaultValue: 90, configs: { min: 10, max: 100, step: 5, unit: '%' } },
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
      group: 'Contenedor (cont-text)',
      inputs: [
        { type: 'select', name: 'contPaddingSelect',       label: 'Padding tipo – desktop',  configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'contPaddingText',         label: 'Padding – desktop',        defaultValue: '0px' },
        { type: 'select', name: 'contPaddingSelectMobile', label: 'Padding tipo – mobile',   configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'contPaddingTextMobile',   label: 'Padding – mobile',         defaultValue: '0px' },
        { type: 'select', name: 'contMarginSelect',        label: 'Margin tipo – desktop',   configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'contMarginText',          label: 'Margin – desktop',         defaultValue: '0px' },
        { type: 'select', name: 'contMarginSelectMobile',  label: 'Margin tipo – mobile',    configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'contMarginTextMobile',    label: 'Margin – mobile',          defaultValue: '0px' },
      ],
    },
    {
      group: 'Título h3 – espaciado',
      inputs: [
        { type: 'select', name: 'titlePaddingSelect',       label: 'Padding tipo – desktop',  configs: { options: SELECTOR_OPTIONS }, defaultValue: 'x' },
        { type: 'text',   name: 'titlePaddingText',         label: 'Padding – desktop',        defaultValue: '5rem' },
        { type: 'select', name: 'titlePaddingSelectMobile', label: 'Padding tipo – mobile',   configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'titlePaddingTextMobile',   label: 'Padding – mobile',         defaultValue: '0px' },
        { type: 'select', name: 'titleMarginSelect',        label: 'Margin tipo – desktop',   configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'titleMarginText',          label: 'Margin – desktop',         defaultValue: '0px' },
        { type: 'select', name: 'titleMarginSelectMobile',  label: 'Margin tipo – mobile',    configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'titleMarginTextMobile',    label: 'Margin – mobile',          defaultValue: '0px' },
      ],
    },
    {
      group: 'Descripción p – espaciado',
      inputs: [
        { type: 'select', name: 'descPaddingSelect',       label: 'Padding tipo – desktop',  configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'descPaddingText',         label: 'Padding – desktop',        defaultValue: '0px' },
        { type: 'select', name: 'descPaddingSelectMobile', label: 'Padding tipo – mobile',   configs: { options: SELECTOR_OPTIONS }, defaultValue: 'x' },
        { type: 'text',   name: 'descPaddingTextMobile',   label: 'Padding – mobile',         defaultValue: '5vw' },
        { type: 'select', name: 'descMarginSelect',        label: 'Margin tipo – desktop',   configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'descMarginText',          label: 'Margin – desktop',         defaultValue: '0px' },
        { type: 'select', name: 'descMarginSelectMobile',  label: 'Margin tipo – mobile',    configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'descMarginTextMobile',    label: 'Margin – mobile',          defaultValue: '0px' },
      ],
    },
    {
      group: 'Layout',
      inputs: [
        {
          type: 'range',
          name: 'contentTop',
          label: 'Content – vertical position desktop (%)',
          defaultValue: 55,
          configs: { min: 10, max: 90, step: 1, unit: '%' },
        },
        {
          type: 'range',
          name: 'contentTopMobile',
          label: 'Content – vertical position mobile (%)',
          defaultValue: 50,
          configs: { min: 10, max: 90, step: 1, unit: '%' },
        },
      ],
    },
  ],
  presets: {
    line1: 'Diseñado para',
    line2: 'los que exigen más.',
    titleSize: 64,
    titleSizeMobile: 30,
    titleFamily: "'EB Garamond', serif",
    titleWeight: '500',
    titleSpacing: 0,
    titleAlign: 'center',
    description: 'Descripción del producto.',
    descSize: 25,
    descSizeMobile: 16,
    descFamily: "'EB Garamond', serif",
    descWeight: '500',
    descSpacing: 0,
    descAlign: 'justify',
    separatorWidth: 65,
    separatorAlign: 'center',
    separatorWidthMobile: 90,
    gradientColor1: '#997124',
    gradientColor2: '#f1e2b7',
    contentTop: 55,
    contentTopMobile: 50,
    titleAlignMobile: 'center',
    descAlignMobile: 'center',
    contPaddingSelect: 'a',  contPaddingText: '0px',
    contPaddingSelectMobile: 'a', contPaddingTextMobile: '0px',
    contMarginSelect: 'a',   contMarginText: '0px',
    contMarginSelectMobile: 'a',  contMarginTextMobile: '0px',
    titlePaddingSelect: 'x', titlePaddingText: '5rem',
    titlePaddingSelectMobile: 'a', titlePaddingTextMobile: '0px',
    titleMarginSelect: 'a',  titleMarginText: '0px',
    titleMarginSelectMobile: 'a',  titleMarginTextMobile: '0px',
    descPaddingSelect: 'a',  descPaddingText: '0px',
    descPaddingSelectMobile: 'x',  descPaddingTextMobile: '5vw',
    descMarginSelect: 'a',   descMarginText: '0px',
    descMarginSelectMobile: 'a',   descMarginTextMobile: '0px',
  },
})
