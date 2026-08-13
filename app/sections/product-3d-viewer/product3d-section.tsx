import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen'

// ─── Qué es este archivo ─────────────────────────────────────────────────
// Es un "hijo dentro del hijo": una sección/toma específica de UN producto
// (ver product3d.tsx). Desde el editor, adentro de cada "Producto 3D"
// agregás una o más de estas con "Add child element" → "Sección de
// producto 3D". Cada una define:
//   • un texto (título + descripción) para esa toma en particular, con
//     estilo propio editable directo acá mismo (color, tamaño, peso,
//     tracking, interlineado, familia tipográfica y sombra de texto para
//     el título) — no hace falta agregar ningún hijo aparte.
//   • a dónde tiene que moverse el objeto 3D (posición X/Y/Z, rotación en
//     los 3 ejes y una escala relativa) para "encuadrar" esa sección,
//   • opcionalmente, un fondo propio para el visor mientras esa sección
//     está activa (un color sólido o un linear-gradient de CSS),
//   • opcionalmente, cuánto "en sombra" se ve el objeto en esta toma (0% =
//     brillo normal, 100% = casi negro/silueta) — no es una sombra
//     proyectada, es oscurecer el color del propio objeto.
//   • opcionalmente, una "sombra parcial": en vez de agregar una luz,
//     recorta/aparta la sombra de arriba en una zona puntual del objeto
//     (vos elegís dónde con X/Y/Z y qué tan grande con "Alcance"), dejando
//     ver ahí el color/brillo original del material mientras el resto
//     sigue oscurecido — para esas tomas dramáticas donde solo un
//     borde/parte del objeto "se escapa" de la sombra.
// El padre (product-3d-viewer/index.tsx) recorre estas secciones frame a
// frame: al entrar a una, el resto de los productos desaparece de
// pantalla y el objeto activo se anima hasta la posición/rotación/escala
// que definiste acá, mostrando el texto de esta sección con el estilo que
// configuraste.
//
// No dibuja nada por sí mismo — es un contenedor de datos, igual que
// product3d.tsx.

export interface Product3DSectionProps extends HydrogenComponentProps {
  title?: string
  description?: string
  textAlign: 'left' | 'center' | 'right'
  // Etiqueta/badge chica arriba del título (ej. "11G DE SUCRES", con un
  // ícono "×" y tachado opcional) — vacía = no se muestra nada.
  badgeText: string
  badgeColor: string
  badgeBackground: string
  badgeStrikethrough: boolean
  badgeShowIcon: boolean
  // Padding/margin del badge — mismo mecanismo que heading.tsx/paragraph.tsx
  // (selectorPaddingMargin): elegís UN lado (o "Todos") y le ponés un valor
  // CSS libre. Vacío = sin espaciado extra.
  badgePaddingSelect: string
  badgePaddingText: string
  badgeMarginSelect: string
  badgeMarginText: string
  // Efecto de entrada "caída": desenfocado/transparente/corrido hacia abajo
  // → nítido/opaco en su lugar, escalonado (badge, después título, después
  // descripción). Ver `animate-drop-in` en app.css.
  dropEffectEnabled: boolean
  // Estilo del título — se aplica directo al <h3> que dibuja el padre.
  // Vacío/0 en cualquiera de estos = usa el estilo por defecto (blanco,
  // negrita, mayúscula) que ya tenía el visor.
  titleColor: string
  titleWeight: string
  titleFontSizeDesktop: string
  titleFontSizeMobile: string
  titleLetterSpacing: number
  titleLineHeight: number
  titleFontFamily: string
  titleTextShadowEnabled: boolean
  titleTextShadow: string
  titlePaddingSelect: string
  titlePaddingText: string
  titleMarginSelect: string
  titleMarginText: string
  // Estilo de la descripción — se aplica directo al <p>.
  descColor: string
  descFontSize: string
  descLineHeight: number
  descFontFamily: string
  descPaddingSelect: string
  descPaddingText: string
  descMarginSelect: string
  descMarginText: string
  posX: number
  posY: number
  posZ: number
  // Posición, rotación y escala propias para mobile — apagado por defecto
  // (usa las mismas de arriba en todas las pantallas). Útil porque en
  // mobile el texto ahora se ancla abajo de la pantalla (ver
  // product-3d-viewer/index.tsx) y el objeto suele necesitar otro encuadre.
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
  background?: string
  shadowIntensity: number
  // Sombra parcial: NO agrega luz — recorta la sombra de arriba dentro de
  // una zona esférica (centro X/Y/Z, tamaño = "Alcance"), revelando el
  // color/brillo original del material ahí. "Fuerza" controla cuánta
  // sombra se le saca en el centro de esa zona (100% = vuelve del todo a
  // su brillo normal ahí adentro). Ver comentario del grupo "Iluminación"
  // más arriba y `animate()`/shader en product-3d-viewer/index.tsx.
  shadowClearEnabled: boolean
  shadowClearStrength: number
  // Forma de la zona: 'sphere' = esfera (pareja en todas direcciones),
  // 'box' = cubo (caras planas, mismo tamaño en los 3 ejes), 'rect' =
  // rectángulo/prisma (ancho, alto y profundidad independientes — con
  // esto se logra una zona vertical u horizontal, según qué eje sea más
  // grande).
  shadowClearShape: 'sphere' | 'box' | 'rect'
  shadowClearRadius: number
  // Solo se usan cuando shadowClearShape === 'rect'.
  shadowClearSizeX: number
  shadowClearSizeY: number
  shadowClearSizeZ: number
  shadowClearX: number
  shadowClearY: number
  shadowClearZ: number
  // Rotación de la zona (no del objeto) — vale para las 3 formas, aunque
  // en la esfera no se note (es simétrica en todas direcciones).
  shadowClearRotationX: number
  shadowClearRotationY: number
  shadowClearRotationZ: number
}

export default function Product3DSection(_props: Product3DSectionProps) {
  return null
}

// Padding/margin de un bloque de texto (badge, título o descripción): un
// selector de "a qué lado" + un campo de texto con el valor CSS — el mismo
// mecanismo que ya usan heading.tsx/paragraph.tsx (`selectorPaddingMargin`).
// `prefix` arma los nombres de campo (ej. "title" → titlePaddingSelect,
// titlePaddingText, ...) y `label` es el nombre legible que aparece en el
// editor (ej. "título").
function spacingInputs(prefix: string, label: string) {
  const sideOptions = {
    options: [
      { value: 't', label: 'Arriba' },
      { value: 'b', label: 'Abajo' },
      { value: 'l', label: 'Izquierda' },
      { value: 'r', label: 'Derecha' },
      { value: 'x', label: 'Horizontal' },
      { value: 'y', label: 'Vertical' },
      { value: 'a', label: 'Todos los lados' },
    ],
  }
  return [
    {
      type: 'select' as const,
      name: `${prefix}PaddingSelect`,
      label: `Lado del padding (${label})`,
      configs: sideOptions,
      defaultValue: 'a',
    },
    {
      type: 'text' as const,
      name: `${prefix}PaddingText`,
      label: `Padding (${label})`,
      placeholder: 'ej: 1rem — vacío = sin padding extra',
    },
    {
      type: 'select' as const,
      name: `${prefix}MarginSelect`,
      label: `Lado del margen (${label})`,
      configs: sideOptions,
      defaultValue: 'a',
    },
    {
      type: 'text' as const,
      name: `${prefix}MarginText`,
      label: `Margen (${label})`,
      placeholder: 'ej: 1rem — vacío = sin margen extra',
    },
  ]
}

export const schema = createSchema({
  type: 'producto-3d-seccion',
  title: 'Sección de producto 3D',
  settings: [
    {
      group: 'Texto',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Título',
          placeholder: 'Vacío = usa el nombre del producto',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Descripción',
          placeholder: 'Texto extendido para esta toma...',
        },
        {
          type: 'select',
          name: 'textAlign',
          label: 'Alineación del texto',
          configs: {
            options: [
              { value: 'left', label: 'Izquierda' },
              { value: 'center', label: 'Centro' },
              { value: 'right', label: 'Derecha' },
            ],
          },
          defaultValue: 'left',
        },
        {
          type: 'switch',
          name: 'dropEffectEnabled',
          label: 'Efecto de entrada "caída"',
          helpText: 'Al entrar a esta sección, el texto aparece desenfocado/transparente/corrido hacia abajo y se asienta nítido en su lugar — la etiqueta, el título y la descripción entran escalonados, uno después del otro.',
          defaultValue: true,
        },
      ],
    },
    {
      group: 'Etiqueta (badge)',
      inputs: [
        {
          type: 'text',
          name: 'badgeText',
          label: 'Texto de la etiqueta',
          placeholder: 'ej: 11G DE SUCRES — vacío = no se muestra',
          defaultValue: '',
        },
        {
          type: 'color',
          name: 'badgeColor',
          label: 'Color del texto',
          defaultValue: '#ffffff',
          condition: (data: Product3DSectionProps) => !!data.badgeText,
        },
        {
          type: 'color',
          name: 'badgeBackground',
          label: 'Fondo de la etiqueta',
          defaultValue: '#ffffff1a',
          condition: (data: Product3DSectionProps) => !!data.badgeText,
        },
        {
          type: 'switch',
          name: 'badgeShowIcon',
          label: 'Mostrar ícono "×"',
          defaultValue: true,
          condition: (data: Product3DSectionProps) => !!data.badgeText,
        },
        {
          type: 'switch',
          name: 'badgeStrikethrough',
          label: 'Tachar el texto',
          helpText: 'Útil para mostrar algo "superado" — ej. "11G DE SUCRES" tachado, dando a entender que ahora tiene menos.',
          defaultValue: false,
          condition: (data: Product3DSectionProps) => !!data.badgeText,
        },
        ...spacingInputs('badge', 'etiqueta').map((input) => ({
          ...input,
          condition: (data: Product3DSectionProps) => !!data.badgeText,
        })),
      ],
    },
    {
      group: 'Estilo del título',
      inputs: [
        {
          type: 'color',
          name: 'titleColor',
          label: 'Color',
          defaultValue: '#ffffff',
        },
        {
          type: 'select',
          name: 'titleWeight',
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
          name: 'titleFontSizeDesktop',
          label: 'Tamaño en escritorio (CSS)',
          placeholder: 'ej: 3rem, 48px — vacío = tamaño por defecto',
          defaultValue: '',
        },
        {
          type: 'text',
          name: 'titleFontSizeMobile',
          label: 'Tamaño en celular (CSS)',
          placeholder: 'ej: 2rem, 32px — vacío = tamaño por defecto',
          defaultValue: '',
        },
        {
          type: 'range',
          name: 'titleLetterSpacing',
          label: 'Espaciado entre letras',
          defaultValue: 0,
          configs: { min: -2, max: 20, step: 0.5, unit: 'px' },
        },
        {
          type: 'range',
          name: 'titleLineHeight',
          label: 'Interlineado',
          helpText: '0 = automático.',
          defaultValue: 0,
          configs: { min: 0, max: 2, step: 0.05 },
        },
        {
          type: 'text',
          name: 'titleFontFamily',
          label: 'Familia tipográfica',
          placeholder: 'ej: Montserrat — vacío = la del tema',
          defaultValue: '',
        },
        {
          type: 'switch',
          name: 'titleTextShadowEnabled',
          label: 'Sombra de texto',
          defaultValue: false,
        },
        {
          type: 'text',
          name: 'titleTextShadow',
          label: 'Sombra de texto (CSS text-shadow)',
          defaultValue: '0 0 20px #00d2ffcc',
          condition: (data: Product3DSectionProps) => data.titleTextShadowEnabled === true,
        },
        ...spacingInputs('title', 'título'),
      ],
    },
    {
      group: 'Estilo de la descripción',
      inputs: [
        {
          type: 'color',
          name: 'descColor',
          label: 'Color',
          defaultValue: '#ffffffb3',
        },
        {
          type: 'text',
          name: 'descFontSize',
          label: 'Tamaño (CSS)',
          placeholder: 'ej: 1rem, 16px — vacío = tamaño por defecto',
          defaultValue: '',
        },
        {
          type: 'range',
          name: 'descLineHeight',
          label: 'Interlineado',
          helpText: '0 = automático.',
          defaultValue: 0,
          configs: { min: 0, max: 2, step: 0.05 },
        },
        {
          type: 'text',
          name: 'descFontFamily',
          label: 'Familia tipográfica',
          placeholder: 'ej: Montserrat — vacío = la del tema',
          defaultValue: '',
        },
        ...spacingInputs('desc', 'descripción'),
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
          defaultValue: 1.2,
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
          helpText: 'En mobile el texto se muestra abajo de la pantalla (no al costado como en escritorio), así que el objeto suele necesitar otro encuadre. Activá esto para definir su propia Posición, Rotación X/Y/Z y Escala solo para mobile.',
          defaultValue: false,
        },
        {
          type: 'range',
          name: 'posXMobile',
          label: 'Posición X (mobile)',
          helpText: 'Negativo = izquierda, positivo = derecha.',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
          condition: (data: Product3DSectionProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'posYMobile',
          label: 'Posición Y (mobile)',
          helpText: 'Negativo = abajo, positivo = arriba.',
          defaultValue: 0.6,
          configs: { min: -3, max: 3, step: 0.1 },
          condition: (data: Product3DSectionProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'posZMobile',
          label: 'Posición Z (mobile)',
          helpText: 'Negativo = más lejos de cámara, positivo = más cerca.',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
          condition: (data: Product3DSectionProps) => data.mobilePositionEnabled === true,
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
          condition: (data: Product3DSectionProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationYMobile',
          label: 'Rotación Y (mobile)',
          defaultValue: 15,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DSectionProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationZMobile',
          label: 'Rotación Z (mobile)',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DSectionProps) => data.mobilePositionEnabled === true,
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
          condition: (data: Product3DSectionProps) => data.mobilePositionEnabled === true,
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
          placeholder: 'ej: #3a2a1a  ó  linear-gradient(135deg, #3a2a1a, #000)',
          helpText: 'Vacío = usa el color de fondo general del visor. Acepta cualquier valor CSS válido para "background": un color sólido o un linear-gradient().',
        },
      ],
    },
    {
      group: 'Iluminación',
      inputs: [
        {
          type: 'range',
          name: 'shadowIntensity',
          label: 'Sombra sobre el objeto',
          helpText: '0% = brillo normal. 100% = el objeto queda casi negro/en silueta, como una toma "dramática".',
          defaultValue: 0,
          configs: { min: 0, max: 100, step: 1, unit: '%' },
        },
        {
          type: 'switch',
          name: 'shadowClearEnabled',
          label: 'Sombra parcial (aclarar una zona)',
          helpText: 'No agrega ninguna luz — recorta la "Sombra" de arriba dentro de una zona puntual, revelando ahí el color original del objeto. Pensado para usar junto con una sombra alta, así solo se "escapa" un borde/parte concreta.',
          defaultValue: false,
        },
        {
          type: 'range',
          name: 'shadowClearStrength',
          label: 'Fuerza',
          helpText: '100% = en el centro de la zona vuelve del todo al brillo normal. Menos = solo se le saca una parte de la sombra.',
          defaultValue: 100,
          configs: { min: 0, max: 100, step: 1, unit: '%' },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true,
        },
        {
          type: 'select',
          name: 'shadowClearShape',
          label: 'Forma de la zona',
          helpText: 'Esfera = borde redondeado parejo. Cubo = caras planas, mismo tamaño en los 3 ejes. Rectángulo = ancho/alto/profundidad independientes — subí "Alto" para una franja vertical, o "Ancho" para una horizontal.',
          configs: {
            options: [
              { value: 'sphere', label: 'Esfera' },
              { value: 'box', label: 'Cubo' },
              { value: 'rect', label: 'Rectángulo' },
            ],
          },
          defaultValue: 'sphere',
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true,
        },
        {
          type: 'range',
          name: 'shadowClearRadius',
          label: 'Alcance (tamaño de la zona)',
          helpText: 'Chico = una zona muy puntual. Grande = se nota en más superficie del objeto.',
          defaultValue: 1,
          configs: { min: 0.1, max: 4, step: 0.05 },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true && data.shadowClearShape !== 'rect',
        },
        {
          type: 'range',
          name: 'shadowClearSizeX',
          label: 'Ancho (X) del rectángulo',
          helpText: 'Subilo para una franja HORIZONTAL.',
          defaultValue: 1,
          configs: { min: 0.1, max: 4, step: 0.05 },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true && data.shadowClearShape === 'rect',
        },
        {
          type: 'range',
          name: 'shadowClearSizeY',
          label: 'Alto (Y) del rectángulo',
          helpText: 'Subilo para una franja VERTICAL.',
          defaultValue: 2,
          configs: { min: 0.1, max: 4, step: 0.05 },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true && data.shadowClearShape === 'rect',
        },
        {
          type: 'range',
          name: 'shadowClearSizeZ',
          label: 'Profundidad (Z) del rectángulo',
          defaultValue: 1,
          configs: { min: 0.1, max: 4, step: 0.05 },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true && data.shadowClearShape === 'rect',
        },
        {
          type: 'range',
          name: 'shadowClearX',
          label: 'Posición X de la zona',
          helpText: 'Relativa al objeto — 0 es su centro.',
          defaultValue: 0.6,
          configs: { min: -3, max: 3, step: 0.05 },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true,
        },
        {
          type: 'range',
          name: 'shadowClearY',
          label: 'Posición Y de la zona',
          defaultValue: 0.6,
          configs: { min: -3, max: 3, step: 0.05 },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true,
        },
        {
          type: 'range',
          name: 'shadowClearZ',
          label: 'Posición Z de la zona',
          defaultValue: 0.6,
          configs: { min: -3, max: 3, step: 0.05 },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true,
        },
        {
          type: 'range',
          name: 'shadowClearRotationX',
          label: 'Rotación X de la zona',
          helpText: 'Rota la zona (no el objeto) — se nota en el Cubo y el Rectángulo, no en la Esfera (es simétrica).',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true,
        },
        {
          type: 'range',
          name: 'shadowClearRotationY',
          label: 'Rotación Y de la zona',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true,
        },
        {
          type: 'range',
          name: 'shadowClearRotationZ',
          label: 'Rotación Z de la zona',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DSectionProps) => data.shadowClearEnabled === true,
        },
      ],
    },
  ],
  presets: {
    title: '',
    description: '',
    textAlign: 'left',
    dropEffectEnabled: true,
    badgeText: '',
    badgeColor: '#ffffff',
    badgeBackground: '#ffffff1a',
    badgeShowIcon: true,
    badgeStrikethrough: false,
    badgePaddingSelect: 'a',
    badgePaddingText: '',
    badgeMarginSelect: 'a',
    badgeMarginText: '',
    titleColor: '#ffffff',
    titleWeight: '900',
    titleFontSizeDesktop: '',
    titleFontSizeMobile: '',
    titleLetterSpacing: 0,
    titleLineHeight: 0,
    titleFontFamily: '',
    titleTextShadowEnabled: false,
    titleTextShadow: '0 0 20px #00d2ffcc',
    titlePaddingSelect: 'a',
    titlePaddingText: '',
    titleMarginSelect: 'a',
    titleMarginText: '',
    descColor: '#ffffffb3',
    descFontSize: '',
    descLineHeight: 0,
    descFontFamily: '',
    descPaddingSelect: 'a',
    descPaddingText: '',
    descMarginSelect: 'a',
    descMarginText: '',
    posX: 1.2,
    posY: 0,
    posZ: 0,
    mobilePositionEnabled: false,
    posXMobile: 0,
    posYMobile: 0.6,
    posZMobile: 0,
    rotationXMobile: 0,
    rotationYMobile: 15,
    rotationZMobile: 0,
    rotationX: 0,
    rotationY: 15,
    rotationZ: 0,
    scaleMultiplier: 1.4,
    scaleMultiplierMobile: 1.4,
    background: '',
    shadowIntensity: 0,
    shadowClearEnabled: false,
    shadowClearStrength: 100,
    shadowClearShape: 'sphere',
    shadowClearRadius: 1,
    shadowClearSizeX: 1,
    shadowClearSizeY: 2,
    shadowClearSizeZ: 1,
    shadowClearX: 0.6,
    shadowClearY: 0.6,
    shadowClearZ: 0.6,
    shadowClearRotationX: 0,
    shadowClearRotationY: 0,
    shadowClearRotationZ: 0,
  },
})
