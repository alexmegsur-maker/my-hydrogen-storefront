import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from '@weaverse/hydrogen'

// ─── Animation constants ───────────────────────────────────────────────────
const ANIM = {
  desktop: {
    fadeEnd: 0.15,
    revealStart: 0.25,
    mid: 0.5,
    heroFadeOut: 0.9,
    initOverlayScale: 1050,
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
    spread: 100,
    base: 240,
    range: 280,
  },
} as const

// ─── Types ─────────────────────────────────────────────────────────────────

interface PrincipalBannerProps extends HydrogenComponentProps {
  backgroundImage: WeaverseImage
  chairImage: WeaverseImage
  separatorImage: WeaverseImage
  phrase: string
  preorderLine1: string
  preorderLine2: string
  limitedEditionLabel: string
  scrollLabel: string
  gradientColor1: string
  gradientColor2: string
  logoData: string
  lh: number
  lv: number
  lv23: number
  lh23: number
  lhs23: number
  lv30: number
  lv40: number
  extraH: number
  pinMultiplier: number
}

function toUrl(img: WeaverseImage | undefined): string {
  if (!img) return ''
  return typeof img === 'string' ? img : img.url
}

// Parsea un SVG completo extrayendo viewBox e inner content.
// También soporta el formato legado (solo el atributo d del path).
function parseSvg(input: string): { viewBox: string; content: string } {
  if (!input) return { viewBox: '0 0 100 100', content: '' }
  if (input.trim().startsWith('<')) {
    const viewBox = (input.match(/viewBox=["']([^"']+)["']/i) ?? [])[1] ?? '0 0 100 100'
    const content = (input.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i) ?? [])[1]?.trim() ?? ''
    return { viewBox, content }
  }
  // Legado: solo el valor del atributo d
  return { viewBox: '0 0 342.7 163.4', content: `<path d="${input}" />` }
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

  const parsedLogo = parseSvg(logoData)

  const heroRef = useRef<HTMLElement>(null)
  const logoMaskRef = useRef<SVGSVGElement>(null)
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const referenciaRef = useRef<HTMLDivElement>(null)
  const fadeOverlayRef = useRef<HTMLDivElement>(null)
  const overlayTitleRef = useRef<HTMLHeadingElement>(null)
  const overlayImgRef = useRef<HTMLImageElement>(null)
  const overlayTextRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    ()=>{
      gsap.registerPlugin(ScrollTrigger)
      const container = heroRef.current!;

      const tlIntro = gsap.timeline({
        scrollTrigger:{
          trigger:container,
          start:"top top",
          end:"top+=20% top",
          scrub:true,
        },
      })
      tlIntro.fromTo(".video-icon-container",
        {
          display:"block",
          opacity:1
        },
        {
          display:"none",
          opacity:0
        },
        
      )
      tlIntro.fromTo([".hero-img-logo",".hero-img-copy"] ,
        {opacity:1},
        {opacity:0},
        "<"
      )

      const tlSecond = gsap.timeline({
        scrollTrigger:{ 
          trigger:container,
          start:"top+=40% top",
          end:"top+=50% top",
          scrub:true   
        }
      })
      
      tlSecond.fromTo(".hero-principal-img",
        {scale:'1'},{scale:'0.7'}
      )
      
      
      
      tlSecond.fromTo(overlayTitleRef.current,
        {backgroundImage:`linear-gradient(151deg,transparent 0%, ${gradientColor1} 99%, ${gradientColor2} 100%)`},
        {backgroundImage:`linear-gradient(151deg,transparent 0%, ${gradientColor1} 2%, ${gradientColor2} 100%)`},"<"
      )

      tlSecond.fromTo(overlayTextRef.current,
        {backgroundImage:`linear-gradient(151deg,transparent 0%, #fff 99%, #fff 100%)`},
        {backgroundImage:`linear-gradient(151deg,transparent 0%,  #fff 2%, #fff 100%)`},"<"
      )
      
      
      tlSecond.fromTo([overlayTitleRef.current,overlayTextRef.current,overlayImgRef.current],
        {
          scale:1.25,
          opacity:0
        },
        {
          scale:1,
          opacity:1
        },"<"
      )
      
      const tlSvg = gsap.timeline({
        scrollTrigger:{
          trigger:container,
          start:"top+=10% top",
          end:"top+=50% top",
          scrub:true   
        }
      })
      
      tlSvg.fromTo(logoMaskRef.current,{scale:"270"},{scale:"0.3",y:"-70%" })
      tlSvg.fromTo(fadeOverlayRef.current,
        {opacity:0 ,background:"transparent"},
        {opacity:1,background:`linear-gradient(151deg,${gradientColor1} 0%, ${gradientColor2} 100%)`,ease:"none"}
        ,'<'
      )

      const tlRevert= gsap.timeline({
        scrollTrigger:{
          trigger:container,
          start:"top+=50% top",
          end:"top+=70% top",
          scrub:true   
        }

      })

      tlRevert.to(fadeOverlayRef.current,
        {background:`linear-gradient(151deg,${gradientColor2} 0%,#050505 4%, #050505 100%)`}

      )
      tlRevert.to(overlayTitleRef.current,
        {backgroundImage:`linear-gradient(151deg,${gradientColor2} 0%, #050505 98%, #050505 100%)`},"<"
      )

      tlRevert.to(overlayTextRef.current,
        {backgroundImage:`linear-gradient(151deg, #fff 0%, #050505 98%, #050505 100%)`},"<"

      )
      

    },{scope:heroRef}
  )

    useEffect(()=>{
      console.log("parsedLogo",parsedLogo.viewBox)
    },[parsedLogo])

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
          <h3 className="frase-principal fixed top-[15vh] text-[2.5rem] w-[27rem] font-medium leading-[0.9] [word-spacing:4px] font-garamond max-[700px]:text-[2rem] max-[700px]:w-[85vw]">
            {phrase}
          </h3>
        </div>
        <img
          className="hero-principal-img fixed top-0 left-0 w-full h-full max-[700px]:z-[3] min-[4000px]:self-center min-[4000px]:!w-[60%] min-[4000px]:![left:50%] min-[4000px]:![transform:translate(-50%,0)]"
          src={toUrl(chairImage)}
          alt=""
        />
        <div className="hero-img-copy fixed bottom-[5%] left-1/2 -translate-x-1/2 [will-change:opacity] z-[5]">
          <p className="text-[0.65rem]">{scrollLabel}</p>
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
      <div className="video-icon-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] z-[3] opacity-0 cursor-pointer max-[700px]:opacity-100">
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

      {/* Invisible reference box used to compute logo position */}
      <div
        className="logo-container flex fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] z-[2] justify-center items-center min-[2400px]:top-[18%] min-[2400px]:w-[350px] min-[2400px]:h-[350px] min-[3000px]:w-[600px] min-[3000px]:h-[600px]"
        ref={logoContainerRef}
      >
        <div className="referencia opacity-0 w-[342.7px] h-[163.4px]" ref={referenciaRef} />
      </div>

      {/* Reveal headline */}
      <div className="overlay-copy fixed bottom-[18%] left-1/2 -translate-x-1/2 font-garamond font-medium z-[2] max-[700px]:w-full max-[700px]:top-[5%] max-[700px]:flex max-[700px]:flex-col max-[700px]:h-full max-[700px]:justify-center max-[700px]:items-center min-[2400px]:bottom-[20%] min-[3000px]:bottom-[25%] min-[4000px]:bottom-[15%]">
        <h1
          className="text-[7rem] leading-[0.9] font-medium tracking-[1px] text-transparent origin-[center_0%] max-[700px]:mt-[20vh] max-[700px]:text-[45px] min-[3000px]:text-[13rem] min-[4000px]:text-[9rem]"
          ref={overlayTitleRef}
          style={{backgroundClip:"text !important"}}
        >
          {preorderLine1}
          <br />
          {preorderLine2}
        </h1>
        <img
          className="w-[65%] py-4 opacity-0 max-[700px]:w-[80vw] max-[700px]:h-auto"
          ref={overlayImgRef}
          src={toUrl(separatorImage)}
          alt=""
        />
        <p
          className="text-[54px] tracking-[2px] bg-clip-text text-transparent origin-[center_0%] max-[700px]:text-base min-[3000px]:text-[5rem] min-[4000px]:text-[4rem]"
          ref={overlayTextRef} 
          style={{backgroundClip:"text !important"}}

        >
          {limitedEditionLabel}
        </p>
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
          label: 'SVG completo o atributo d del path',
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
