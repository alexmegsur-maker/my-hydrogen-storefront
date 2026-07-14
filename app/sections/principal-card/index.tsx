import { useState } from 'react'
import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
} from '@weaverse/hydrogen'
import { useIsMobile } from '~/hooks/use-is-mobile'

// ─── Types ─────────────────────────────────────────────────────────────────

interface CardImage {
  url: string
  altText?: string | null
}

interface PrincipalCardLoaderData {
  logo?: CardImage
  fondo?: CardImage
  subLogo?: CardImage
  frase_principal?: string
  descripcion?: string
  descripcion2?: string
  boton_text?: string
  url?: string
}

interface PrincipalCardProps extends HydrogenComponentProps {
  loaderData: PrincipalCardLoaderData | null
  metaobject: string
  // Card dimensions
  cardWidth: string
  cardHeight: string
  cardWidthMobile: string
  cardHeightMobile: string
  // Front subtitle style
  subtitleColor: string
  subtitleSize: number
  subtitleSizeMobile: number
  subtitleFamily: string
  subtitleWeight: string
  // Back subtitle style
  backSubtitleColor: string
  backSubtitleSize: number
  backSubtitleSizeMobile: number
  backSubtitleFamily: string
  backSubtitleWeight: string
  // Back description style
  backTextColor: string
  backTextSize: number
  backTextSizeMobile: number
  backTextFamily: string
  backTextWeight: string
  // Button style
  buttonColor: string
  buttonBg: string
  buttonRadius: number
  buttonFontSize: number
  buttonFontSizeMobile: number
  buttonFamily: string
  buttonLetterSpacing: number
  buttonPaddingV: number
  buttonPaddingH: number
}

// ─── GraphQL query ─────────────────────────────────────────────────────────

const PRINCIPAL_CARD_QUERY = `#graphql
  query PrincipalCard($handle: String!) {
    metaobject(handle: { handle: $handle, type: "principal_card" }) {
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image { url altText }
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
}: ComponentLoaderArgs<PrincipalCardProps>): Promise<PrincipalCardLoaderData | null> => {
  const { storefront } = weaverse
  const handle = data?.metaobject
  if (!handle) return null

  try {
    const response = await storefront.query(PRINCIPAL_CARD_QUERY, {
      variables: { handle },
    })
    if (!response?.metaobject) return null

    const result: Record<string, any> = {}
    ;(response.metaobject.fields as any[]).forEach((field: any) => {
      result[field.key] = field.reference?.image ?? field.value
    })
    return result as PrincipalCardLoaderData
  } catch {
    return null
  }
}

// ─── Section ───────────────────────────────────────────────────────────────

function PrincipalCard(props: PrincipalCardProps) {
  const {
    loaderData,
    cardWidth = '26vw', cardHeight = '75vh',
    cardWidthMobile = '90vw', cardHeightMobile = '70vh',
    subtitleColor = '#E3CE79',
    subtitleSize = 14, subtitleSizeMobile = 14,
    subtitleFamily = 'Arial, sans-serif', subtitleWeight = '600',
    backSubtitleColor = '#ffffff',
    backSubtitleSize = 16, backSubtitleSizeMobile = 16,
    backSubtitleFamily = 'Arial, sans-serif', backSubtitleWeight = '700',
    backTextColor = '#ffffff',
    backTextSize = 16, backTextSizeMobile = 16,
    backTextFamily = 'Arial, sans-serif', backTextWeight = '400',
    buttonColor = '#141414', buttonBg = '#E3CE79', buttonRadius = 0,
    buttonFontSize = 16, buttonFontSizeMobile = 14,
    buttonFamily = 'Quicksand, sans-serif',
    buttonLetterSpacing = 2, buttonPaddingV = 12, buttonPaddingH = 17,
  } = props

  const isMobile = useIsMobile(700)
  const [hovered, setHovered] = useState(false)

  const bgUrl        = loaderData?.fondo?.url         ?? ''
  const logoUrl      = loaderData?.logo?.url          ?? ''
  const cpUrl        = loaderData?.subLogo?.url       ?? ''
  const sub          = loaderData?.frase_principal    ?? ''
  const sinopsisSub  = loaderData?.descripcion        ?? ''
  const sinopsisText = loaderData?.descripcion2       ?? ''
  const linkUrl      = loaderData?.url                ?? '#'
  const btnText      = loaderData?.boton_text         ?? 'Ver más'

  const w = isMobile ? cardWidthMobile : cardWidth
  const h = isMobile ? cardHeightMobile : cardHeight
  const tr = (ms: number) => `${ms}ms linear`

  return (
    <div
      style={{ width: w, height: h, position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onClick={() => isMobile && setHovered(v => !v)}
    >
      <div
        style={{
          width: '100%', height: '100%',
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          overflow: 'hidden',
          position: 'relative',
          transform: hovered ? 'translateY(-20px)' : 'translateY(0)',
          transition: tr(500),
        }}
      >
        {/* ── FRONT ─────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {bgUrl && (
            <img
              src={bgUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: hovered ? 'rgba(0,0,0,0.56)' : 'transparent',
              transition: tr(500),
            }}
          >
            {logoUrl && (
              <img
                src={logoUrl}
                alt=""
                style={{
                  width: '60%', height: 'auto', maxHeight: '10rem',
                  filter: 'drop-shadow(black 1px 0 10px)',
                  opacity: hovered ? 0 : 1,
                  transition: tr(400),
                }}
              />
            )}
            {sub && (
              <p
                style={{
                  color: subtitleColor,
                  fontSize: `${isMobile ? subtitleSizeMobile : subtitleSize}px`,
                  fontFamily: subtitleFamily,
                  fontWeight: subtitleWeight,
                  textShadow: 'black 1px 0 10px',
                  marginTop: '1.2rem',
                  lineHeight: isMobile ? 1 : undefined,
                  whiteSpace: 'pre-line',
                  opacity: hovered ? 0 : 1,
                  transition: tr(400),
                }}
              >
                {sub}
              </p>
            )}
            {cpUrl && (
              <img
                src={cpUrl}
                alt=""
                style={{
                  height: isMobile ? '2rem' : '2.5rem',
                  width: 'auto',
                  position: 'absolute',
                  bottom: '1rem',
                  left: isMobile ? '0.5rem' : '1.5rem',
                  opacity: hovered ? 0 : 1,
                  transition: tr(400),
                }}
              />
            )}
          </div>
        </div>

        {/* ── BACK ──────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(10%)',
            transition: tr(500),
            padding: '1rem',
          }}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt=""
              style={{ width: '54%', height: 'auto', marginTop: '2rem' }}
            />
          )}
          {sinopsisSub && (
            <p
              style={{
                color: backSubtitleColor,
                fontSize: `${isMobile ? backSubtitleSizeMobile : backSubtitleSize}px`,
                fontFamily: backSubtitleFamily,
                fontWeight: backSubtitleWeight,
                paddingInline: '2rem',
                lineHeight: 1.2,
                marginTop: '1.5rem',
                textTransform: 'uppercase',
              }}
            >
              {sinopsisSub}
            </p>
          )}
          {sinopsisText && (
            <p
              style={{
                color: backTextColor,
                fontSize: `${isMobile ? backTextSizeMobile : backTextSize}px`,
                fontFamily: backTextFamily,
                fontWeight: backTextWeight,
                paddingInline: isMobile ? '1rem' : '2rem',
                lineHeight: 1.2,
                marginTop: '1rem',
                wordSpacing: '0.2rem',
                whiteSpace: 'pre-line',
              }}
            >
              {sinopsisText}
            </p>
          )}
          <a href={linkUrl} style={{ textDecoration: 'none' }}>
            <button
              type="button"
              style={{
                padding: `${buttonPaddingV}px ${buttonPaddingH}px`,
                fontSize: `${isMobile ? buttonFontSizeMobile : buttonFontSize}px`,
                backgroundColor: buttonBg,
                color: buttonColor,
                borderRadius: `${buttonRadius}px`,
                border: 'none',
                cursor: 'pointer',
                marginTop: '2.2rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: `${buttonLetterSpacing}px`,
                fontFamily: buttonFamily,
              }}
            >
              {btnText}
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default PrincipalCard

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
  type: 'principal-card',
  title: 'Principal Card',
  settings: [
    {
      group: 'Datos',
      inputs: [
        {
          type: 'text',
          name: 'metaobject',
          label: 'Handle del metaobject (tipo: principal_card)',
          placeholder: 'ej: mi-coleccion',
          defaultValue: '',
        },
      ],
    },
    {
      group: 'Dimensiones',
      inputs: [
        { type: 'text', name: 'cardWidth',        label: 'Ancho – desktop',    defaultValue: '26vw' },
        { type: 'text', name: 'cardHeight',       label: 'Alto – desktop',     defaultValue: '75vh' },
        { type: 'text', name: 'cardWidthMobile',  label: 'Ancho – mobile',     defaultValue: '90vw' },
        { type: 'text', name: 'cardHeightMobile', label: 'Alto – mobile',      defaultValue: '70vh' },
      ],
    },
    {
      group: 'Subtítulo frente',
      inputs: [
        { type: 'color',  name: 'subtitleColor',       label: 'Color',            defaultValue: '#E3CE79' },
        { type: 'range',  name: 'subtitleSize',        label: 'Tamaño – desktop', defaultValue: 14, configs: { min: 10, max: 48, step: 1, unit: 'px' } },
        { type: 'range',  name: 'subtitleSizeMobile',  label: 'Tamaño – mobile',  defaultValue: 14, configs: { min: 10, max: 48, step: 1, unit: 'px' } },
        { type: 'text',   name: 'subtitleFamily',      label: 'Fuente',           defaultValue: 'Arial, sans-serif' },
        { type: 'select', name: 'subtitleWeight',      label: 'Weight',           configs: { options: WEIGHT_OPTIONS }, defaultValue: '600' },
      ],
    },
    {
      group: 'Subtítulo reverso',
      inputs: [
        { type: 'color',  name: 'backSubtitleColor',       label: 'Color',            defaultValue: '#ffffff' },
        { type: 'range',  name: 'backSubtitleSize',        label: 'Tamaño – desktop', defaultValue: 16, configs: { min: 10, max: 48, step: 1, unit: 'px' } },
        { type: 'range',  name: 'backSubtitleSizeMobile',  label: 'Tamaño – mobile',  defaultValue: 16, configs: { min: 10, max: 48, step: 1, unit: 'px' } },
        { type: 'text',   name: 'backSubtitleFamily',      label: 'Fuente',           defaultValue: 'Arial, sans-serif' },
        { type: 'select', name: 'backSubtitleWeight',      label: 'Weight',           configs: { options: WEIGHT_OPTIONS }, defaultValue: '700' },
      ],
    },
    {
      group: 'Descripción reverso',
      inputs: [
        { type: 'color',  name: 'backTextColor',       label: 'Color',            defaultValue: '#ffffff' },
        { type: 'range',  name: 'backTextSize',        label: 'Tamaño – desktop', defaultValue: 16, configs: { min: 10, max: 48, step: 1, unit: 'px' } },
        { type: 'range',  name: 'backTextSizeMobile',  label: 'Tamaño – mobile',  defaultValue: 16, configs: { min: 10, max: 48, step: 1, unit: 'px' } },
        { type: 'text',   name: 'backTextFamily',      label: 'Fuente',           defaultValue: 'Arial, sans-serif' },
        { type: 'select', name: 'backTextWeight',      label: 'Weight',           configs: { options: WEIGHT_OPTIONS }, defaultValue: '400' },
      ],
    },
    {
      group: 'Botón',
      inputs: [
        { type: 'color', name: 'buttonColor',          label: 'Color texto',        defaultValue: '#141414' },
        { type: 'color', name: 'buttonBg',             label: 'Color fondo',        defaultValue: '#E3CE79' },
        { type: 'range', name: 'buttonRadius',         label: 'Radio borde',        defaultValue: 0,  configs: { min: 0, max: 50, step: 1, unit: 'px' } },
        { type: 'range', name: 'buttonFontSize',       label: 'Tamaño – desktop',   defaultValue: 16, configs: { min: 10, max: 36, step: 1, unit: 'px' } },
        { type: 'range', name: 'buttonFontSizeMobile', label: 'Tamaño – mobile',    defaultValue: 14, configs: { min: 10, max: 36, step: 1, unit: 'px' } },
        { type: 'text',  name: 'buttonFamily',         label: 'Fuente',             defaultValue: 'Quicksand, sans-serif' },
        { type: 'range', name: 'buttonLetterSpacing',  label: 'Letter spacing',     defaultValue: 2,  configs: { min: 0, max: 20, step: 1, unit: 'px' } },
        { type: 'range', name: 'buttonPaddingV',       label: 'Padding vertical',   defaultValue: 12, configs: { min: 4, max: 40, step: 1, unit: 'px' } },
        { type: 'range', name: 'buttonPaddingH',       label: 'Padding horizontal', defaultValue: 17, configs: { min: 4, max: 80, step: 1, unit: 'px' } },
      ],
    },
  ],
  presets: {
    metaobject: '',
    cardWidth: '26vw', cardHeight: '75vh',
    cardWidthMobile: '90vw', cardHeightMobile: '70vh',
    subtitleColor: '#E3CE79',
    subtitleSize: 14, subtitleSizeMobile: 14,
    subtitleFamily: 'Arial, sans-serif', subtitleWeight: '600',
    backSubtitleColor: '#ffffff',
    backSubtitleSize: 16, backSubtitleSizeMobile: 16,
    backSubtitleFamily: 'Arial, sans-serif', backSubtitleWeight: '700',
    backTextColor: '#ffffff',
    backTextSize: 16, backTextSizeMobile: 16,
    backTextFamily: 'Arial, sans-serif', backTextWeight: '400',
    buttonColor: '#141414', buttonBg: '#E3CE79', buttonRadius: 0,
    buttonFontSize: 16, buttonFontSizeMobile: 14,
    buttonFamily: 'Quicksand, sans-serif',
    buttonLetterSpacing: 2, buttonPaddingV: 12, buttonPaddingH: 17,
  },
})
