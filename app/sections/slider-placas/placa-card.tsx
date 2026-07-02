import React from 'react'
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from '@weaverse/hydrogen'
import { useIsMobile } from '~/hooks/use-is-mobile'

// ─── Types ─────────────────────────────────────────────────────────────────

interface PlacaCardProps extends HydrogenComponentProps {
  plateImage: WeaverseImage
  plateName: string
  plateSubtitle: string
  nameSize: number
  nameSizeMobile: number
  nameFamily: string
  nameColor: string
  plateDescription: string
  descSize: number
  descSizeMobile: number
  descFamily: string
  descColor: string
  subtitleColor: string
  // Special card (One Ring) — shows elfic text image instead of description
  isSpecial: boolean
  elficTextImage: WeaverseImage
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

// ─── Component ─────────────────────────────────────────────────────────────

function PlacaCard(props: PlacaCardProps) {
  const {
    plateImage,
    plateName = 'Nombre de la placa',
    plateSubtitle = 'TM',
    nameSize = 40,
    nameSizeMobile = 28,
    nameFamily = "'EB Garamond', serif",
    nameColor = '#ffffff',
    plateDescription = 'Descripción de la placa.',
    descSize = 30,
    descSizeMobile = 20,
    descFamily = "'EB Garamond', serif",
    descColor = '#EAE089',
    subtitleColor = '#ffffff',
    isSpecial = false,
    elficTextImage,
  } = props

  const isMobile = useIsMobile(800)

  return (
    <div
      style={{
        width: isMobile ? '100%' : '30vw',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {toUrl(plateImage) && (
        <img
          src={toUrl(plateImage)}
          alt={plateName}
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
        />
      )}

      <h4
        style={{
          fontFamily: nameFamily,
          fontSize: `${isMobile ? nameSizeMobile : nameSize}px`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.25rem',
          marginTop: '1rem',
          textTransform: 'uppercase',
          color: nameColor,
        }}
      >
        {plateName}
        <span
          style={{
            fontSize: '10px',
            display: 'block',
            marginTop: '0.5rem',
            color: subtitleColor,
            textTransform: 'none',
          }}
        >
          {plateSubtitle}
        </span>
      </h4>

      {isSpecial && toUrl(elficTextImage) ? (
        <div style={{ height: '2rem', position: 'relative' }}>
          <img
            src={toUrl(elficTextImage)}
            alt="elfic text"
            style={{
              height: '3rem',
              width: 'auto',
              position: isMobile ? 'relative' : 'absolute',
              transform: 'translate(0, -0.5rem)',
            }}
          />
        </div>
      ) : (
        <p
          style={{
            fontFamily: descFamily,
            fontSize: `${isMobile ? descSizeMobile : descSize}px`,
            color: descColor,
          }}
        >
          {plateDescription}
        </p>
      )}
    </div>
  )
}

export default PlacaCard

// ─── Weaverse schema ────────────────────────────────────────────────────────

export const schema = createSchema({
  type: 'placa-card',
  title: 'Placa Card',
  settings: [
    {
      group: 'Plate',
      inputs: [
        { type: 'image', name: 'plateImage', label: 'Plate image' },
        { type: 'text', name: 'plateName', label: 'Name', defaultValue: 'Nombre de la placa' },
        { type: 'text', name: 'plateSubtitle', label: 'Subtitle (e.g. TM)', defaultValue: 'TM' },
      ],
    },
    {
      group: 'Name typography',
      inputs: [
        { type: 'range', name: 'nameSize', label: 'Size – desktop (px)', defaultValue: 40, configs: { min: 16, max: 80, step: 2, unit: 'px' } },
        { type: 'range', name: 'nameSizeMobile', label: 'Size – mobile (px)', defaultValue: 28, configs: { min: 14, max: 50, step: 1, unit: 'px' } },
        { type: 'select', name: 'nameFamily', label: 'Font family', configs: { options: FONT_OPTIONS }, defaultValue: "'EB Garamond', serif" },
        { type: 'color', name: 'nameColor', label: 'Name color', defaultValue: '#ffffff' },
        { type: 'color', name: 'subtitleColor', label: 'Subtitle color', defaultValue: '#ffffff' },
      ],
    },
    {
      group: 'Description',
      inputs: [
        { type: 'textarea', name: 'plateDescription', label: 'Description', defaultValue: 'Descripción de la placa.' },
        { type: 'range', name: 'descSize', label: 'Size – desktop (px)', defaultValue: 30, configs: { min: 12, max: 60, step: 1, unit: 'px' } },
        { type: 'range', name: 'descSizeMobile', label: 'Size – mobile (px)', defaultValue: 20, configs: { min: 10, max: 40, step: 1, unit: 'px' } },
        { type: 'select', name: 'descFamily', label: 'Font family', configs: { options: FONT_OPTIONS }, defaultValue: "'EB Garamond', serif" },
        { type: 'color', name: 'descColor', label: 'Description color', defaultValue: '#EAE089' },
      ],
    },
    {
      group: 'Special card (One Ring)',
      inputs: [
        { type: 'switch', name: 'isSpecial', label: 'Use elfic text instead of description', defaultValue: false },
        { type: 'image', name: 'elficTextImage', label: 'Elfic text image' },
      ],
    },
  ],
  presets: {
    plateName: 'Nombre de la placa',
    plateSubtitle: 'TM',
    plateDescription: 'Descripción de la placa.',
    nameSize: 40,
    nameSizeMobile: 28,
    nameFamily: "'EB Garamond', serif",
    nameColor: '#ffffff',
    descSize: 30,
    descSizeMobile: 20,
    descFamily: "'EB Garamond', serif",
    descColor: '#EAE089',
    subtitleColor: '#ffffff',
    isSpecial: false,
  },
})
