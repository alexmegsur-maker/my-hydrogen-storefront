import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen'

// ─── Qué es este archivo ─────────────────────────────────────────────────
// Un cuarto tipo de hijo de product3d.tsx, hermano de product3d-section.tsx
// y product3d-video.tsx (mismo nivel — se agrega con "Add child element"
// adentro de un "Producto 3D"). En vez del bloque de texto normal o el
// video de fondo, esta toma muestra un encabezado + una lista de preguntas
// tipo acordeón (como la referencia "FOIRE AUX QUESTIONS" que pasaste) — el
// contenido de cada pregunta se agrega como su propio hijo "Pregunta" (ver
// product3d-faq-item.tsx); el estilo de toda la lista se configura acá,
// una sola vez.
//
// El objeto 3D se mueve/rota/escala con las MISMAS perillas que
// product3d-section.tsx y product3d-video.tsx (Posición/Rotación/Escala,
// incluida la variante mobile) — a propósito, para que se sientan iguales
// si ya conocés esas.
//
// No dibuja nada por sí mismo — es un contenedor de datos. El padre
// (product-3d-viewer/index.tsx) es quien recorre estos hijos, detecta el
// tipo ('producto-3d-seccion' / 'producto-3d-video' / 'producto-3d-faq') y
// dibuja lo que corresponde — incluyendo el acordeón, leyendo a su vez los
// hijos "Pregunta" de esta toma.

export interface Product3DFaqProps extends HydrogenComponentProps {
  // Solo para identificarlo en la lista de hijos del editor — no se dibuja
  // en la página.
  title: string

  // ── Posición del objeto 3D — mismos nombres/defaults que
  // product3d-section.tsx y product3d-video.tsx a propósito.
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

  // ── Fondo del visor mientras esta toma está activa — igual mecanismo
  // que "Fondo del visor" en product3d-section.tsx.
  background?: string

  // ── Contenedor — alineación y espaciado de TODO el bloque (encabezado +
  // lista), no de cada elemento por separado. Padding/margin con el mismo
  // mecanismo que el resto del visor (selectorPaddingMargin): elegís UN
  // lado (o "Todos") y le ponés un valor CSS libre.
  contentAlign: 'left' | 'center' | 'right'
  containerPaddingSelect: string
  containerPaddingText: string
  containerMarginSelect: string
  containerMarginText: string

  // ── Encabezado
  headingText: string
  headingColor: string
  headingWeight: string
  headingFontSizeDesktop: string
  headingFontSizeMobile: string
  headingLetterSpacing: number
  headingLineHeight: number
  headingFontFamily: string

  // ── Lista de preguntas (estilo — el contenido vive en los hijos
  // "Pregunta", ver product3d-faq-item.tsx)
  faqMaxWidth: number
  // Verdadero = solo una pregunta abierta a la vez (al abrir una se cierran
  // las demás). Falso = cada pregunta se abre/cierra independiente.
  faqAccordionMode: boolean
  faqItemBorderColor: string
  faqItemBorderColorHover: string
  faqQuestionColor: string
  faqQuestionFontSize: string
  faqQuestionFontWeight: string
  faqIconColor: string
  faqIconColorActive: string
  faqAnswerColor: string
  faqAnswerFontSize: string
  faqAnswerLineHeight: number
}

export default function Product3DFaq(_props: Product3DFaqProps) {
  // Sin salida visual — ver comentario de arriba. Todo el trabajo de
  // "pintar" esta toma (encabezado + acordeón) lo hace
  // product-3d-viewer/index.tsx.
  return null
}

export const schema = createSchema({
  type: 'producto-3d-faq',
  title: 'Toma con FAQ',
  childTypes: ['producto-3d-faq-item'],
  settings: [
    {
      group: 'Toma',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Nombre interno',
          helpText: 'Solo para identificar esta toma en la lista de hijos del editor — no se muestra en la página.',
          defaultValue: 'Toma con FAQ',
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
          defaultValue: -1.5,
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
          condition: (data: Product3DFaqProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'posYMobile',
          label: 'Posición Y (mobile)',
          defaultValue: 0,
          configs: { min: -3, max: 3, step: 0.1 },
          condition: (data: Product3DFaqProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'posZMobile',
          label: 'Posición Z (mobile)',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
          condition: (data: Product3DFaqProps) => data.mobilePositionEnabled === true,
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
          condition: (data: Product3DFaqProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationYMobile',
          label: 'Rotación Y (mobile)',
          defaultValue: 15,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DFaqProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationZMobile',
          label: 'Rotación Z (mobile)',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DFaqProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'scaleMultiplier',
          label: 'Escala (relativa a la del visor)',
          defaultValue: 1,
          configs: { min: 0.2, max: 4, step: 0.05 },
        },
        {
          type: 'range',
          name: 'scaleMultiplierMobile',
          label: 'Escala (mobile)',
          defaultValue: 0.8,
          configs: { min: 0.2, max: 4, step: 0.05 },
          condition: (data: Product3DFaqProps) => data.mobilePositionEnabled === true,
        },
      ],
    },
    {
      group: 'Fondo del visor',
      inputs: [
        {
          type: 'text',
          name: 'background',
          label: 'Fondo (CSS)',
          placeholder: 'ej: #0a0a0a  ó  linear-gradient(...)',
          helpText: 'Vacío = usa el color de fondo general del visor. Acepta cualquier valor CSS válido para "background".',
          defaultValue: 'radial-gradient(ellipse 70% 60% at 15% 20%, #262626 0%, #0a0a0a 60%, #000000 100%)',
        },
      ],
    },
    {
      group: 'Contenedor',
      inputs: [
        {
          type: 'select',
          name: 'contentAlign',
          label: 'Alineación',
          helpText: 'Centra (u orienta a un costado) el encabezado y la lista de preguntas como bloque.',
          configs: {
            options: [
              { value: 'left', label: 'Izquierda' },
              { value: 'center', label: 'Centro' },
              { value: 'right', label: 'Derecha' },
            ],
          },
          defaultValue: 'center',
        },
        {
          type: 'select',
          name: 'containerPaddingSelect',
          label: 'Lado del padding',
          configs: {
            options: [
              { value: 't', label: 'Arriba' },
              { value: 'b', label: 'Abajo' },
              { value: 'l', label: 'Izquierda' },
              { value: 'r', label: 'Derecha' },
              { value: 'x', label: 'Horizontal' },
              { value: 'y', label: 'Vertical' },
              { value: 'a', label: 'Todos los lados' },
            ],
          },
          defaultValue: 'a',
        },
        {
          type: 'text',
          name: 'containerPaddingText',
          label: 'Padding',
          placeholder: 'ej: 4rem — vacío = el padding por defecto',
        },
        {
          type: 'select',
          name: 'containerMarginSelect',
          label: 'Lado del margen',
          configs: {
            options: [
              { value: 't', label: 'Arriba' },
              { value: 'b', label: 'Abajo' },
              { value: 'l', label: 'Izquierda' },
              { value: 'r', label: 'Derecha' },
              { value: 'x', label: 'Horizontal' },
              { value: 'y', label: 'Vertical' },
              { value: 'a', label: 'Todos los lados' },
            ],
          },
          defaultValue: 'a',
        },
        {
          type: 'text',
          name: 'containerMarginText',
          label: 'Margen',
          placeholder: 'ej: 0 — vacío = sin margen extra',
        },
      ],
    },
    {
      group: 'Encabezado',
      inputs: [
        {
          type: 'textarea',
          name: 'headingText',
          label: 'Texto',
          placeholder: 'ej: PREGUNTAS\nFRECUENTES — un salto de línea parte el texto en 2 líneas.',
          defaultValue: 'PREGUNTAS\nFRECUENTES',
        },
        { type: 'color', name: 'headingColor', label: 'Color', defaultValue: '#ffffff' },
        {
          type: 'select',
          name: 'headingWeight',
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
          name: 'headingFontSizeDesktop',
          label: 'Tamaño en escritorio (CSS)',
          defaultValue: 'clamp(2.5rem, 6vw, 5rem)',
        },
        {
          type: 'text',
          name: 'headingFontSizeMobile',
          label: 'Tamaño en celular (CSS)',
          defaultValue: 'clamp(2rem, 10vw, 3rem)',
        },
        {
          type: 'range',
          name: 'headingLetterSpacing',
          label: 'Espaciado entre letras',
          defaultValue: 0,
          configs: { min: -4, max: 20, step: 0.5, unit: 'px' },
        },
        {
          type: 'range',
          name: 'headingLineHeight',
          label: 'Interlineado',
          defaultValue: 0.95,
          configs: { min: 0.5, max: 2, step: 0.05 },
        },
        {
          type: 'text',
          name: 'headingFontFamily',
          label: 'Familia tipográfica',
          placeholder: 'Vacío = la del tema',
          defaultValue: '',
        },
      ],
    },
    {
      group: 'Lista de preguntas',
      inputs: [
        {
          type: 'range',
          name: 'faqMaxWidth',
          label: 'Ancho máximo',
          defaultValue: 700,
          configs: { min: 320, max: 1200, step: 20, unit: 'px' },
        },
        {
          type: 'switch',
          name: 'faqAccordionMode',
          label: 'Solo una pregunta abierta a la vez',
          defaultValue: true,
        },
        { type: 'color', name: 'faqItemBorderColor', label: 'Línea separadora', defaultValue: 'rgba(255,255,255,0.15)' },
        { type: 'color', name: 'faqItemBorderColorHover', label: 'Línea separadora (hover)', defaultValue: 'rgba(255,255,255,0.35)' },
        { type: 'color', name: 'faqQuestionColor', label: 'Color de la pregunta', defaultValue: '#ffffff' },
        { type: 'text', name: 'faqQuestionFontSize', label: 'Tamaño de la pregunta (CSS)', defaultValue: '1.15rem' },
        {
          type: 'select',
          name: 'faqQuestionFontWeight',
          label: 'Peso de la pregunta',
          configs: {
            options: [
              { value: '400', label: '400' },
              { value: '500', label: '500' },
              { value: '600', label: '600' },
              { value: '700', label: '700' },
            ],
          },
          defaultValue: '500',
        },
        { type: 'color', name: 'faqIconColor', label: 'Ícono (cerrado)', defaultValue: '#a1a1aa' },
        { type: 'color', name: 'faqIconColorActive', label: 'Ícono (abierto)', defaultValue: '#ffffff' },
        { type: 'color', name: 'faqAnswerColor', label: 'Color de la respuesta', defaultValue: '#a1a1aa' },
        { type: 'text', name: 'faqAnswerFontSize', label: 'Tamaño de la respuesta (CSS)', defaultValue: '0.95rem' },
        {
          type: 'range',
          name: 'faqAnswerLineHeight',
          label: 'Interlineado de la respuesta',
          defaultValue: 1.6,
          configs: { min: 1, max: 3, step: 0.1 },
        },
      ],
    },
  ],
  presets: {
    title: 'Toma con FAQ',
    posX: -1.5,
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
    scaleMultiplier: 1,
    scaleMultiplierMobile: 0.8,
    background: 'radial-gradient(ellipse 70% 60% at 15% 20%, #262626 0%, #0a0a0a 60%, #000000 100%)',
    contentAlign: 'center',
    containerPaddingSelect: 'a',
    containerPaddingText: '',
    containerMarginSelect: 'a',
    containerMarginText: '',
    headingText: 'PREGUNTAS\nFRECUENTES',
    headingColor: '#ffffff',
    headingWeight: '900',
    headingFontSizeDesktop: 'clamp(2.5rem, 6vw, 5rem)',
    headingFontSizeMobile: 'clamp(2rem, 10vw, 3rem)',
    headingLetterSpacing: 0,
    headingLineHeight: 0.95,
    headingFontFamily: '',
    faqMaxWidth: 700,
    faqAccordionMode: true,
    faqItemBorderColor: 'rgba(255,255,255,0.15)',
    faqItemBorderColorHover: 'rgba(255,255,255,0.35)',
    faqQuestionColor: '#ffffff',
    faqQuestionFontSize: '1.15rem',
    faqQuestionFontWeight: '500',
    faqIconColor: '#a1a1aa',
    faqIconColorActive: '#ffffff',
    faqAnswerColor: '#a1a1aa',
    faqAnswerFontSize: '0.95rem',
    faqAnswerLineHeight: 1.6,
    children: [
      { type: 'producto-3d-faq-item' },
      { type: 'producto-3d-faq-item' },
      { type: 'producto-3d-faq-item' },
    ],
  },
})
