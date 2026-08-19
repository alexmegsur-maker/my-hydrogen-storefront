import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen'

// ─── Qué es este archivo ─────────────────────────────────────────────────
// Una pregunta suelta dentro de una "Toma con FAQ" (ver product3d-faq.tsx —
// se agrega con "Add child element" adentro de esa toma).
//
// El estilo GENERAL de la lista (línea separadora, color del ícono +/×)
// se sigue configurando UNA vez en product3d-faq.tsx. Pero el texto de LA
// PREGUNTA y de LA RESPUESTA de cada ítem se puede personalizar acá,
// individualmente — color, tamaño, familia tipográfica, alineación, peso y
// espaciado entre letras. Cualquier campo que quede vacío/en 0 usa el
// estilo general de product3d-faq.tsx (así, si no tocás nada acá, se ve
// exactamente igual que antes).
//
// No dibuja nada por sí mismo — es un contenedor de datos, igual que el
// resto de los hijos de este visor. El padre (product-3d-viewer/index.tsx)
// lee estos datos y dibuja el acordeón completo.

export interface Product3DFaqItemProps extends HydrogenComponentProps {
  question: string
  answer: string

  // ── Estilo de esta pregunta — vacío/0 = usa el estilo general de la
  // toma (ver "Lista de preguntas" en product3d-faq.tsx).
  questionColor: string
  questionFontSize: string
  questionFontFamily: string
  questionTextAlign: '' | 'left' | 'center' | 'right'
  questionFontWeight: string
  questionLetterSpacing: number

  // ── Estilo de esta respuesta — mismo mecanismo que la pregunta.
  answerColor: string
  answerFontSize: string
  answerFontFamily: string
  answerTextAlign: '' | 'left' | 'center' | 'right'
  answerFontWeight: string
  answerLetterSpacing: number
}

export default function Product3DFaqItem(_props: Product3DFaqItemProps) {
  return null
}

export const schema = createSchema({
  type: 'producto-3d-faq-item',
  title: 'Pregunta',
  settings: [
    {
      group: 'Pregunta',
      inputs: [
        {
          type: 'text',
          name: 'question',
          label: 'Pregunta',
          defaultValue: '¿Cuál es tu pregunta?',
        },
        {
          type: 'richtext',
          name: 'answer',
          label: 'Respuesta',
          defaultValue: 'Escribí acá la respuesta a la pregunta.',
        },
      ],
    },
    {
      group: 'Estilo de esta pregunta',
      inputs: [
        {
          type: 'color',
          name: 'questionColor',
          label: 'Color',
          helpText: 'Vacío = usa el color general de la lista.',
        },
        {
          type: 'text',
          name: 'questionFontSize',
          label: 'Tamaño (CSS)',
          placeholder: 'ej: 1.15rem, 20px — vacío = tamaño general',
        },
        {
          type: 'text',
          name: 'questionFontFamily',
          label: 'Familia tipográfica',
          placeholder: 'Vacío = la familia general',
        },
        {
          type: 'select',
          name: 'questionTextAlign',
          label: 'Alineación',
          configs: {
            options: [
              { value: '', label: 'Igual que el bloque' },
              { value: 'left', label: 'Izquierda' },
              { value: 'center', label: 'Centro' },
              { value: 'right', label: 'Derecha' },
            ],
          },
          defaultValue: '',
        },
        {
          type: 'select',
          name: 'questionFontWeight',
          label: 'Peso',
          configs: {
            options: [
              { value: '', label: 'Igual que el general' },
              { value: '400', label: '400 - Normal' },
              { value: '500', label: '500 - Medium' },
              { value: '600', label: '600 - Semi Bold' },
              { value: '700', label: '700 - Bold' },
              { value: '800', label: '800 - Extra Bold' },
              { value: '900', label: '900 - Black' },
            ],
          },
          defaultValue: '',
        },
        {
          type: 'range',
          name: 'questionLetterSpacing',
          label: 'Espaciado entre letras',
          helpText: '0 = usa el espaciado general.',
          defaultValue: 0,
          configs: { min: -2, max: 20, step: 0.5, unit: 'px' },
        },
      ],
    },
    {
      group: 'Estilo de esta respuesta',
      inputs: [
        {
          type: 'color',
          name: 'answerColor',
          label: 'Color',
          helpText: 'Vacío = usa el color general de la lista.',
        },
        {
          type: 'text',
          name: 'answerFontSize',
          label: 'Tamaño (CSS)',
          placeholder: 'ej: 0.95rem, 16px — vacío = tamaño general',
        },
        {
          type: 'text',
          name: 'answerFontFamily',
          label: 'Familia tipográfica',
          placeholder: 'Vacío = la familia general',
        },
        {
          type: 'select',
          name: 'answerTextAlign',
          label: 'Alineación',
          configs: {
            options: [
              { value: '', label: 'Igual que el bloque' },
              { value: 'left', label: 'Izquierda' },
              { value: 'center', label: 'Centro' },
              { value: 'right', label: 'Derecha' },
            ],
          },
          defaultValue: '',
        },
        {
          type: 'select',
          name: 'answerFontWeight',
          label: 'Peso',
          configs: {
            options: [
              { value: '', label: 'Igual que el general' },
              { value: '400', label: '400 - Normal' },
              { value: '500', label: '500 - Medium' },
              { value: '600', label: '600 - Semi Bold' },
              { value: '700', label: '700 - Bold' },
              { value: '800', label: '800 - Extra Bold' },
              { value: '900', label: '900 - Black' },
            ],
          },
          defaultValue: '',
        },
        {
          type: 'range',
          name: 'answerLetterSpacing',
          label: 'Espaciado entre letras',
          helpText: '0 = usa el espaciado general.',
          defaultValue: 0,
          configs: { min: -2, max: 20, step: 0.5, unit: 'px' },
        },
      ],
    },
  ],
  presets: {
    question: '¿Cuál es tu pregunta?',
    answer: 'Escribí acá la respuesta a la pregunta.',
    questionColor: '',
    questionFontSize: '',
    questionFontFamily: '',
    questionTextAlign: '',
    questionFontWeight: '',
    questionLetterSpacing: 0,
    answerColor: '',
    answerFontSize: '',
    answerFontFamily: '',
    answerTextAlign: '',
    answerFontWeight: '',
    answerLetterSpacing: 0,
  },
})
