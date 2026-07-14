import {
  createSchema,
  type HydrogenComponentProps,
} from '@weaverse/hydrogen'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { selectorPaddingMargin } from '~/utils/general'

const SELECTOR_OPTIONS = [
  { value: 't', label: 'Top' },
  { value: 'b', label: 'Bottom' },
  { value: 'l', label: 'Left' },
  { value: 'r', label: 'Right' },
  { value: 'x', label: 'Inline' },
  { value: 'y', label: 'Block' },
  { value: 'a', label: 'Custom' },
]

interface PrincipalCardGridProps extends HydrogenComponentProps {
  columns: number
  columnsMobile: number
  gap: number
  gapMobile: number
  paddingSelect: string
  paddingText: string
  paddingSelectMobile: string
  paddingTextMobile: string
  marginSelect: string
  marginText: string
  marginSelectMobile: string
  marginTextMobile: string
}

function PrincipalCardGrid(props: PrincipalCardGridProps) {
  const {
    columns = 3,
    columnsMobile = 1,
    gap = 24,
    gapMobile = 16,
    paddingSelect = 'a',
    paddingText = '0px',
    paddingSelectMobile = 'a',
    paddingTextMobile = '0px',
    marginSelect = 'a',
    marginText = '0px',
    marginSelectMobile = 'a',
    marginTextMobile = '0px',
    children,
  } = props

  const isMobile = useIsMobile(700)

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${isMobile ? columnsMobile : columns}, 1fr)`,
        gap: `${isMobile ? gapMobile : gap}px`,
        justifyItems: 'center',
        ...selectorPaddingMargin(
          'padding',
          isMobile ? paddingSelectMobile : paddingSelect,
          isMobile ? paddingTextMobile   : paddingText,
        ),
        ...selectorPaddingMargin(
          'margin',
          isMobile ? marginSelectMobile : marginSelect,
          isMobile ? marginTextMobile   : marginText,
        ),
      }}
    >
      {children}
    </section>
  )
}

export default PrincipalCardGrid

export const schema = createSchema({
  type: 'principal-card-grid',
  title: 'Cards Grid',
  childTypes: ['principal-card'],
  settings: [
    {
      group: 'Grid',
      inputs: [
        {
          type: 'range',
          name: 'columns',
          label: 'Columnas – desktop',
          defaultValue: 3,
          configs: { min: 1, max: 6, step: 1 },
        },
        {
          type: 'range',
          name: 'columnsMobile',
          label: 'Columnas – mobile',
          defaultValue: 1,
          configs: { min: 1, max: 4, step: 1 },
        },
        {
          type: 'range',
          name: 'gap',
          label: 'Espacio entre tarjetas – desktop',
          defaultValue: 24,
          configs: { min: 0, max: 120, step: 4, unit: 'px' },
        },
        {
          type: 'range',
          name: 'gapMobile',
          label: 'Espacio entre tarjetas – mobile',
          defaultValue: 16,
          configs: { min: 0, max: 80, step: 4, unit: 'px' },
        },
      ],
    },
    {
      group: 'Padding – desktop',
      inputs: [
        { type: 'select', name: 'paddingSelect', label: 'Tipo', configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'paddingText',   label: 'Valor', defaultValue: '0px' },
      ],
    },
    {
      group: 'Padding – mobile',
      inputs: [
        { type: 'select', name: 'paddingSelectMobile', label: 'Tipo', configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'paddingTextMobile',   label: 'Valor', defaultValue: '0px' },
      ],
    },
    {
      group: 'Margin – desktop',
      inputs: [
        { type: 'select', name: 'marginSelect', label: 'Tipo', configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'marginText',   label: 'Valor', defaultValue: '0px' },
      ],
    },
    {
      group: 'Margin – mobile',
      inputs: [
        { type: 'select', name: 'marginSelectMobile', label: 'Tipo', configs: { options: SELECTOR_OPTIONS }, defaultValue: 'a' },
        { type: 'text',   name: 'marginTextMobile',   label: 'Valor', defaultValue: '0px' },
      ],
    },
  ],
  presets: {
    columns: 3,
    columnsMobile: 1,
    gap: 24,
    gapMobile: 16,
    paddingSelect: 'a', paddingText: '0px',
    paddingSelectMobile: 'a', paddingTextMobile: '0px',
    marginSelect: 'a', marginText: '0px',
    marginSelectMobile: 'a', marginTextMobile: '0px',
    children: [
      { type: 'principal-card' },
      { type: 'principal-card' },
      { type: 'principal-card' },
    ],
  },
})
