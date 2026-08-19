import { createSchema, type HydrogenComponentProps, type WeaverseImage, type WeaverseVideo } from '@weaverse/hydrogen'

// ─── Qué es este archivo ─────────────────────────────────────────────────
// Un tercer tipo de hijo de product3d.tsx, hermano de product3d-section.tsx
// (mismo nivel — se agrega con "Add child element" adentro de un "Producto
// 3D"). En vez del bloque de texto normal (badge/título/descripción), esta
// toma muestra:
//   • un VIDEO en loop de fondo, difuminado con blur (igual mecanismo que
//     ciaoenergy.com/energy-drink: cada "toma" tiene su propio clip de
//     fondo, con transición suave entre una y otra — ver
//     `argument_video-stack` en el HTML de referencia que pasaste),
//   • una FRASE gigante encima del video (con un duplicado desenfocado
//     atrás, tipo "glow" — la misma idea que el `argument_svg-blur` de esa
//     misma referencia),
// y el objeto 3D se mueve/rota/escala con las MISMAS perillas que
// product3d-section.tsx (Posición/Rotación/Escala, incluida la variante
// mobile) — a propósito, para que se sientan iguales si ya conocés esas.
//
// No dibuja nada por sí mismo — es un contenedor de datos, igual que
// product3d.tsx y product3d-section.tsx. El padre (product-3d-viewer/
// index.tsx) es quien recorre estos hijos, detecta el tipo ('producto-3d-
// seccion' vs 'producto-3d-video') y dibuja lo que corresponde.

export interface Product3DVideoProps extends HydrogenComponentProps {
  // Solo para identificarlo en la lista de hijos del editor — no se dibuja
  // en la página.
  title: string

  // ── Posición del objeto 3D — mismos nombres/defaults que
  // product3d-section.tsx a propósito.
  posX: number
  posY: number
  posZ: number
  mobilePositionEnabled: boolean
  posXMobile: number
  posYMobile: number
  posZMobile: number
  rotationXMobile: number
  rotationYMobile: number
  rotationZMobile: number
  scaleMultiplierMobile: number
  rotationX: number
  rotationY: number
  rotationZ: number
  scaleMultiplier: number

  // ── Video de fondo
  bgVideo?: WeaverseVideo
  bgVideoPoster?: WeaverseImage
  // Difuminado (CSS blur) aplicado al video — 0 = nítido, más alto = nube
  // de color difusa (igual idea que "Difuminado del fondo" del visor).
  bgVideoBlur: number
  // Fondo de respaldo (CSS) — se ve detrás/mientras carga el video, y si no
  // se cargó ningún video. Mismo mecanismo que "Fondo del visor" en
  // product3d-section.tsx.
  background?: string

  // ── Frase de fondo
  phraseText: string
  phraseTextAlign: 'left' | 'center' | 'right'
  phraseColor: string
  phraseWeight: string
  phraseFontSizeDesktop: string
  phraseFontSizeMobile: string
  phraseLetterSpacing: number
  phraseLineHeight: number
  phraseFontFamily: string
  // Duplicado desenfocado detrás de la frase — mismo truco que el
  // `argument_svg-blur` de la referencia (un segundo texto idéntico, con
  // blur y su propia opacidad, para un efecto de resplandor/glow).
  phraseGlowBlur: number
  phraseGlowOpacity: number
}

export default function Product3DVideo(_props: Product3DVideoProps) {
  // Sin salida visual — ver comentario de arriba. Todo el trabajo de
  // "pintar" esta toma lo hace product-3d-viewer/index.tsx.
  return null
}

export const schema = createSchema({
  type: 'producto-3d-video',
  title: 'Toma con video de fondo',
  settings: [
    {
      group: 'Toma',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Nombre interno',
          helpText: 'Solo para identificar esta toma en la lista de hijos del editor — no se muestra en la página.',
          defaultValue: 'Toma con video de fondo',
        },
      ],
    },
    {
      group: 'Posición del objeto 3D',
      inputs: [
        {
          type: 'range',
          name: 'posX',
          label: 'Posición X',
          helpText: 'Negativo = izquierda, positivo = derecha.',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
        },
        {
          type: 'range',
          name: 'posY',
          label: 'Posición Y',
          helpText: 'Negativo = abajo, positivo = arriba.',
          defaultValue: 0,
          configs: { min: -3, max: 3, step: 0.1 },
        },
        {
          type: 'range',
          name: 'posZ',
          label: 'Posición Z',
          helpText: 'Negativo = más lejos de cámara, positivo = más cerca.',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
        },
        {
          type: 'switch',
          name: 'mobilePositionEnabled',
          label: 'Posición, rotación y escala distinta en mobile',
          defaultValue: false,
        },
        {
          type: 'range',
          name: 'posXMobile',
          label: 'Posición X (mobile)',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
          condition: (data: Product3DVideoProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'posYMobile',
          label: 'Posición Y (mobile)',
          defaultValue: 0,
          configs: { min: -3, max: 3, step: 0.1 },
          condition: (data: Product3DVideoProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'posZMobile',
          label: 'Posición Z (mobile)',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
          condition: (data: Product3DVideoProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationX',
          label: 'Rotación X',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
        },
        {
          type: 'range',
          name: 'rotationY',
          label: 'Rotación Y',
          defaultValue: 15,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
        },
        {
          type: 'range',
          name: 'rotationZ',
          label: 'Rotación Z',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
        },
        {
          type: 'range',
          name: 'rotationXMobile',
          label: 'Rotación X (mobile)',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DVideoProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationYMobile',
          label: 'Rotación Y (mobile)',
          defaultValue: 15,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DVideoProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationZMobile',
          label: 'Rotación Z (mobile)',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DVideoProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'scaleMultiplier',
          label: 'Escala (relativa a la del visor)',
          defaultValue: 1.4,
          configs: { min: 0.2, max: 4, step: 0.05 },
        },
        {
          type: 'range',
          name: 'scaleMultiplierMobile',
          label: 'Escala (mobile)',
          defaultValue: 1.4,
          configs: { min: 0.2, max: 4, step: 0.05 },
          condition: (data: Product3DVideoProps) => data.mobilePositionEnabled === true,
        },
      ],
    },
    {
      group: 'Video de fondo',
      inputs: [
        { type: 'video', name: 'bgVideo', label: 'Video (loop, mudo)' },
        { type: 'image', name: 'bgVideoPoster', label: 'Imagen mientras carga (poster)' },
        {
          type: 'range',
          name: 'bgVideoBlur',
          label: 'Difuminado (blur)',
          helpText: '0 = nítido. Más alto = el video se ve como una nube de color difusa, igual que la referencia.',
          defaultValue: 30,
          configs: { min: 0, max: 80, step: 1, unit: 'px' },
        },
        {
          type: 'text',
          name: 'background',
          label: 'Fondo de respaldo (CSS)',
          placeholder: 'ej: #111111  ó  radial-gradient(...)',
          helpText: 'Se ve detrás del video (mientras carga, o si no se cargó ninguno). Acepta cualquier valor CSS válido para "background".',
          defaultValue: 'radial-gradient(ellipse 60% 55% at 50% 45%, #4b2a8f 0%, #1a0f2e 55%, #07040d 100%)',
        },
      ],
    },
    {
      group: 'Frase de fondo',
      inputs: [
        {
          type: 'textarea',
          name: 'phraseText',
          label: 'Texto',
          placeholder: 'ej: ZERO\nBULLSHIT — un salto de línea parte el texto en 2 líneas. Vacío = no se muestra.',
          defaultValue: 'ZERO\nBULLSHIT',
        },
        {
          type: 'select',
          name: 'phraseTextAlign',
          label: 'Alineación',
          configs: {
            options: [
              { value: 'left', label: 'Izquierda' },
              { value: 'center', label: 'Centro' },
              { value: 'right', label: 'Derecha' },
            ],
          },
          defaultValue: 'center',
        },
        { type: 'color', name: 'phraseColor', label: 'Color', defaultValue: '#ffffff26' },
        {
          type: 'select',
          name: 'phraseWeight',
          label: 'Peso',
          configs: {
            options: [
              { value: '400', label: '400 - Normal' },
              { value: '500', label: '500 - Medium' },
              { value: '600', label: '600 - Semi Bold' },
              { value: '700', label: '700 - Bold' },
              { value: '800', label: '800 - Extra Bold' },
              { value: '900', label: '900 - Black' },
            ],
          },
          defaultValue: '900',
        },
        {
          type: 'text',
          name: 'phraseFontSizeDesktop',
          label: 'Tamaño en escritorio (CSS)',
          defaultValue: 'clamp(3rem, 12vw, 11rem)',
        },
        {
          type: 'text',
          name: 'phraseFontSizeMobile',
          label: 'Tamaño en celular (CSS)',
          defaultValue: 'clamp(2.5rem, 18vw, 5rem)',
        },
        {
          type: 'range',
          name: 'phraseLetterSpacing',
          label: 'Espaciado entre letras',
          defaultValue: 0,
          configs: { min: -4, max: 20, step: 0.5, unit: 'px' },
        },
        {
          type: 'range',
          name: 'phraseLineHeight',
          label: 'Interlineado',
          defaultValue: 0.85,
          configs: { min: 0.5, max: 2, step: 0.05 },
        },
        {
          type: 'text',
          name: 'phraseFontFamily',
          label: 'Familia tipográfica',
          placeholder: 'Vacío = la del tema',
          defaultValue: '',
        },
        {
          type: 'range',
          name: 'phraseGlowBlur',
          label: 'Desenfoque del resplandor',
          helpText: 'Un duplicado de la frase, desenfocado detrás — le da un efecto de brillo/glow. 0 = sin duplicado.',
          defaultValue: 40,
          configs: { min: 0, max: 120, step: 2, unit: 'px' },
        },
        {
          type: 'range',
          name: 'phraseGlowOpacity',
          label: 'Opacidad del resplandor',
          defaultValue: 0.5,
          configs: { min: 0, max: 1, step: 0.05 },
          condition: (data: Product3DVideoProps) => data.phraseGlowBlur > 0,
        },
      ],
    },
  ],
  presets: {
    title: 'Toma con video de fondo',
    posX: 0,
    posY: 0,
    posZ: 0,
    mobilePositionEnabled: false,
    posXMobile: 0,
    posYMobile: 0,
    posZMobile: 0,
    rotationXMobile: 0,
    rotationYMobile: 15,
    rotationZMobile: 0,
    rotationX: 0,
    rotationY: 15,
    rotationZ: 0,
    scaleMultiplier: 1.4,
    scaleMultiplierMobile: 1.4,
    bgVideoBlur: 30,
    background: 'radial-gradient(ellipse 60% 55% at 50% 45%, #4b2a8f 0%, #1a0f2e 55%, #07040d 100%)',
    phraseText: 'ZERO\nBULLSHIT',
    phraseTextAlign: 'center',
    phraseColor: '#ffffff26',
    phraseWeight: '900',
    phraseFontSizeDesktop: 'clamp(3rem, 12vw, 11rem)',
    phraseFontSizeMobile: 'clamp(2.5rem, 18vw, 5rem)',
    phraseLetterSpacing: 0,
    phraseLineHeight: 0.85,
    phraseFontFamily: '',
    phraseGlowBlur: 40,
    phraseGlowOpacity: 0.5,
  },
})
