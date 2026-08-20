import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  createSchema,
  useChildInstances,
  useWeaverse,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseImage,
  type WeaverseVideo,
} from '@weaverse/hydrogen'
import { cn } from '~/utils/cn'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { selectorPaddingMargin } from '~/utils/general'

// ─── Cómo funciona este archivo, de punta a punta ───────────────────────────
// 1. El editor de Weaverse configura el campo "metaobject" (el handle de un
//    metaobjeto que guarda un único modelo .glb compartido por todos los
//    productos) y agrega uno o más hijos de tipo "Producto 3D" — con el
//    botón "Add child element" en Weaverse Studio — ver product3d.tsx.
//    Cada hijo trae su propio nombre, descripción y set de texturas.
// 2. A su vez, cada "Producto 3D" puede tener sus propios hijos "Sección de
//    producto 3D" (ver product3d-section.tsx) — cada una define un texto y
//    la posición/rotación/escala a la que se debe mover el objeto 3D para
//    esa toma en particular.
// 3. El `loader` (servidor) solo resuelve la URL del .glb a partir del
//    handle del metaobjeto — no consulta productos ni secciones.
// 4. El componente arma una lista plana de "frames" (cuadros), en orden:
//    para cada producto, primero su toma general (fila con todos, igual
//    que antes) y después, uno por uno, cada una de sus secciones. Se
//    navega frame a frame con el SCROLL del mouse (principal, como en la
//    referencia), y también con flechas/swipe/teclado/barra — al entrar a
//    una sección, el resto de los productos desaparece de pantalla y el
//    objeto activo se anima hasta la posición/rotación/escala que definió
//    esa sección, mostrando su propio texto.
// ──────────────────────────────────────────────────────────────────────────

// ─── Types ─────────────────────────────────────────────────────────────────

interface ProductSection {
  id: string
  // 'section' (product3d-section.tsx, el bloque de texto normal), 'video'
  // (product3d-video.tsx: video de fondo + frase gigante), 'faq'
  // (product3d-faq.tsx: encabezado + acordeón de preguntas) o 'carousel'
  // (product3d-carousel.tsx: NO es un bloque de texto — mientras esta toma
  // está activa, la fila entera se puede recorrer ARRASTRANDO libremente,
  // en bucle infinito, en vez de mostrar el objeto en su pose de sección;
  // al navegar a la toma siguiente/anterior se vuelve al comportamiento
  // normal). Determina qué bloque de texto/fondo se dibuja para esta toma
  // — la posición/rotación/escala del objeto 3D funciona igual para
  // section/video/faq (mismos nombres de campo), 'carousel' no la usa.
  kind: 'section' | 'video' | 'faq' | 'carousel'
  // Solo para kind === 'carousel' — ver product3d-carousel.tsx.
  dragSensitivity: number
  dragInertiaEnabled: boolean
  dragFriction: number
  // Reemplaza a `inactiveDimIntensityRef` (el "Apagado de las copias no
  // seleccionadas" general de "Interacción") mientras esta toma carrusel
  // está activa — así cada carrusel puede tener su propio apagado.
  carouselSideShadowIntensity: number
  title: string
  description: string
  // Etiqueta/badge chica arriba del título — vacía = no se muestra.
  badgeText: string
  badgeColor: string
  badgeBackground: string
  badgeStrikethrough: boolean
  badgeShowIcon: boolean
  // Padding/margin de cada bloque de texto — mismo mecanismo que
  // heading.tsx/paragraph.tsx (ver `selectorPaddingMargin` en
  // ~/utils/general): un lado + un valor CSS libre. Vacío = sin espaciado
  // extra (no cambia el look actual).
  badgePaddingSelect: string
  badgePaddingText: string
  badgeMarginSelect: string
  badgeMarginText: string
  // Efecto de entrada "caída" (desenfocado/transparente/abajo → nítido/
  // opaco en su lugar), escalonado entre badge/título/descripción.
  dropEffectEnabled: boolean
  // Estilo del texto — editable directo en product3d-section.tsx (grupos
  // "Estilo del título"/"Estilo de la descripción"), sin necesidad de
  // agregar ningún hijo aparte. Vacío/0 = usa el estilo por defecto que ya
  // tenía el visor (ver el JSX de más abajo, donde se arma el `style={}`).
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
  descColor: string
  descFontSize: string
  descLineHeight: number
  descFontFamily: string
  descPaddingSelect: string
  descPaddingText: string
  descMarginSelect: string
  descMarginText: string
  textAlign: 'left' | 'center' | 'right'
  posX: number
  posY: number
  posZ: number
  // Posición, rotación y escala propias para mobile (ver animate() en el
  // efecto de three.js) — solo se usan si mobilePositionEnabled y estamos
  // en mobile; si no, se usan las de escritorio de siempre.
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
  // Fondo propio del visor mientras esta sección está activa — string CSS
  // libre (color sólido o linear-gradient). Vacío = usa el "Color de
  // fondo" general del visor.
  background: string
  // 0 = brillo normal, 1 = objeto casi negro/en silueta. No es una sombra
  // proyectada — oscurece el color del propio material (ver animate()).
  shadowIntensity: number
  // Sombra parcial: NO es una luz — recorta shadowIntensity dentro de una
  // zona esférica (centro X/Y/Z relativo al objeto, tamaño = "Alcance"),
  // revelando ahí el color original del material. `shadowClearStrength`
  // (0–1) es cuánta sombra se le saca en el centro de esa zona. Se aplica
  // por-píxel con un shader propio (ver `onBeforeCompile` en el efecto de
  // three.js) — no es un simple tinte de material.color como shadowIntensity
  // solo, porque tiene que variar según el punto de la superficie.
  shadowClearEnabled: boolean
  shadowClearStrength: number
  // 'sphere' = distancia euclídea normal (borde redondeado). 'box'/'rect' =
  // distancia "Chebyshev" (max por eje, ver shader) → borde recto. La
  // diferencia entre box y rect es solo el tamaño: box usa shadowClearRadius
  // (mismo en los 3 ejes), rect usa shadowClearSizeX/Y/Z (independientes).
  shadowClearShape: 'sphere' | 'box' | 'rect'
  shadowClearRadius: number
  shadowClearSizeX: number
  shadowClearSizeY: number
  shadowClearSizeZ: number
  shadowClearX: number
  shadowClearY: number
  shadowClearZ: number
  // Rotación de la zona (radianes) — independiente de la rotación del
  // objeto. No afecta a 'sphere' (simétrica), sí a 'box'/'rect'.
  shadowClearRotationX: number
  shadowClearRotationY: number
  shadowClearRotationZ: number
  // ── Solo para kind === 'video' (ver product3d-video.tsx) ────────────
  bgVideoUrl: string
  bgVideoPosterUrl: string
  bgVideoBlur: number
  phraseText: string
  phraseTextAlign: 'left' | 'center' | 'right'
  phraseColor: string
  phraseWeight: string
  phraseFontSizeDesktop: string
  phraseFontSizeMobile: string
  phraseLetterSpacing: number
  phraseLineHeight: number
  phraseFontFamily: string
  phraseGlowBlur: number
  phraseGlowOpacity: number
  // ── Solo para kind === 'faq' (ver product3d-faq.tsx/product3d-faq-item.tsx) ──
  faqContentAlign: 'left' | 'center' | 'right'
  faqContainerPaddingSelect: string
  faqContainerPaddingText: string
  faqContainerMarginSelect: string
  faqContainerMarginText: string
  headingText: string
  headingColor: string
  headingWeight: string
  headingFontSizeDesktop: string
  headingFontSizeMobile: string
  headingLetterSpacing: number
  headingLineHeight: number
  headingFontFamily: string
  faqMaxWidth: number
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
  faqItems: Array<{
    id: string
    question: string
    answer: string
    // Vacío/0 = usa el estilo general de la lista (los faq* de arriba).
    questionColor: string
    questionFontSize: string
    questionFontFamily: string
    questionTextAlign: '' | 'left' | 'center' | 'right'
    questionFontWeight: string
    questionLetterSpacing: number
    answerColor: string
    answerFontSize: string
    answerFontFamily: string
    answerTextAlign: '' | 'left' | 'center' | 'right'
    answerFontWeight: string
    answerLetterSpacing: number
  }>
}

interface ProductDesign {
  id: string
  title: string
  description: string
  baseColorUrl: string
  normalMapUrl: string
  aoMapUrl: string
  specularMapUrl: string
  logoUrl: string
  sections: ProductSection[]
}

// Un "frame" es un cuadro navegable: la toma general de un producto
// (sectionIndex null) o una de sus secciones (sectionIndex = su índice).
interface Frame {
  productIndex: number
  sectionIndex: number | null
}

interface Product3DViewerLoaderData {
  modelUrl: string | null
}

interface Product3DViewerProps extends HydrogenComponentProps {
  clName?: string
  metaobject: string
  bgColor: string
  // Difuminado (blur) del fondo, en px — 0 = sin blur. Se aplica con CSS
  // `filter: blur()` a las capas de fondo (ver `bgLayers` más abajo), no
  // al canvas/objeto 3D ni al texto.
  bgBlur: number
  viewerHeight: string
  modelScale: number
  modelPositionY: number
  modelGap: number
  cameraDistance: number
  // Qué tan gradual es el movimiento del objeto al cambiar de frame (fila
  // ↔ sección, o de una sección a otra) — más bajo = más lento/suave, más
  // alto = más rápido/directo. Se usa como factor de lerp cuadro a cuadro
  // para posición/rotación/escala (ver animate(), Paso 7.10).
  transitionSmoothness: number
  autoRotate: boolean
  autoRotateSpeed: number
  enableDrag: boolean
  showProgress: boolean
  rangeWidth: string
  rangeHeight: number
  rangeRadius: number
  rangeTrackColor: string
  rangeAccentColor: string
  // Viñeta: dos degradés fijos (no se mueven con el scroll ni cambian por
  // sección) pegados arriba y abajo de toda la pantalla, para oscurecer
  // los bordes y que el texto/menú se lean mejor sobre el fondo — igual
  // que la franja negra de arriba y abajo en la referencia de ciaoenergy.
  topShadowEnabled: boolean
  topShadowHeight: number
  topShadowColor: string
  bottomShadowEnabled: boolean
  bottomShadowHeight: number
  bottomShadowColor: string
  // Qué tan "apagadas" se ven las copias NO seleccionadas en la fila (toma
  // general) — 0% = tan iluminadas como la activa, 100% = casi negras. Ya
  // no es transparencia (opacity), es la misma sombra que ya usan las
  // secciones (ver `uShadowAmount` en el shader, dentro de animate()).
  inactiveDimIntensity: number
  showDebugPanel: boolean
}

// Detecta si el usuario está escribiendo en un campo (input/textarea/etc.)
// — se usa para que las flechas de teclado no interfieran mientras se
// edita un input (por ejemplo, del panel de debug).
const isEditingField = (target: EventTarget | null) => {
  const el = target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

// ─── GraphQL query ───────────────────────────────────────────────────────
// Solo pide el modelo 3D compartido — las texturas/textos de cada producto
// y sus secciones vienen de sus hijos/nietos Weaverse (product3d.tsx y
// product3d-section.tsx), no de Shopify.

const PRODUCT_3D_VIEWER_QUERY = `#graphql
  query Product3DViewer($country: CountryCode, $language: LanguageCode, $handle: String!)
  @inContext(country: $country, language: $language) {
    metaobject(handle: { handle: $handle, type: "product_3d_viewer" }) {
      fields {
        key
        reference {
          ... on GenericFile {
            url
          }
          ... on Model3d {
            sources {
              url
              format
              mimeType
            }
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
}: ComponentLoaderArgs<Product3DViewerProps>): Promise<Product3DViewerLoaderData> => {
  // Paso 1: leer el handle del metaobjeto configurado en el editor.
  const { language, country } = weaverse.storefront.i18n
  const handle = data?.metaobject

  if (!handle) {
    return { modelUrl: null }
  }

  try {
    // Paso 2: consultar Shopify para obtener la referencia al modelo 3D.
    const response: any = await weaverse.storefront.query(PRODUCT_3D_VIEWER_QUERY, {
      variables: { country, language, handle },
    })

    // Paso 3: sacar la URL del .glb de la respuesta.
    const fields: any[] = response?.metaobject?.fields ?? []
    const modelField = fields.find((f) => f.key === 'model_glb')
    // Shopify's "Model3d" reference genera varias variantes (ej. .glb +
    // .usdz para AR Quick Look en iOS) — nos quedamos solo con la que
    // GLTFLoader puede leer, nunca con la primera del array a ciegas.
    const sources: any[] = modelField?.reference?.sources ?? []
    const glbSource = sources.find(
      (s) => s.format === 'glb' || s.mimeType === 'model/gltf-binary',
    )
    const modelUrl: string | null = modelField?.reference?.url ?? glbSource?.url ?? null

    return { modelUrl }
  } catch (e) {
    console.error('[Product3DViewer] loader error:', e)
    return { modelUrl: null }
  }
}

// Convierte una instancia hija (item de Weaverse) en un `ProductSection` —
// soporta los tres tipos de hijo de product3d.tsx: 'producto-3d-seccion'
// (product3d-section.tsx, bloque de texto normal), 'producto-3d-video'
// (product3d-video.tsx, video de fondo + frase) y 'producto-3d-faq'
// (product3d-faq.tsx, encabezado + acordeón de preguntas — cuyo contenido a
// su vez vive en hijos "Pregunta", ver product3d-faq-item.tsx, por eso
// necesita `weaverse` para poder resolverlos igual que el padre resuelve
// estas mismas secciones). La posición/rotación/escala del objeto 3D usan
// los MISMOS nombres de campo en los tres tipos a propósito — así
// animate() no necesita distinguirlos (ver Paso 7.10).
function readProductSection(sec: any, weaverse: any): ProductSection {
  const isVideo = sec?.data?.type === 'producto-3d-video'
  const isFaq = sec?.data?.type === 'producto-3d-faq'
  const isCarousel = sec?.data?.type === 'producto-3d-carrusel'
  const faqItems: ProductSection['faqItems'] = isFaq
    ? ((sec.data?.children ?? []) as Array<{ id: string }>)
        .map((ref) => weaverse?.itemInstances?.get(ref.id))
        .filter(Boolean)
        .map((item: any) => ({
          id: item._id,
          question: (item.data?.question as string) || '',
          answer: (item.data?.answer as string) || '',
          questionColor: (item.data?.questionColor as string) || '',
          questionFontSize: (item.data?.questionFontSize as string) || '',
          questionFontFamily: (item.data?.questionFontFamily as string) || '',
          questionTextAlign: (item.data?.questionTextAlign || '') as ProductSection['faqItems'][number]['questionTextAlign'],
          questionFontWeight: (item.data?.questionFontWeight as string) || '',
          questionLetterSpacing: Number(item.data?.questionLetterSpacing ?? 0),
          answerColor: (item.data?.answerColor as string) || '',
          answerFontSize: (item.data?.answerFontSize as string) || '',
          answerFontFamily: (item.data?.answerFontFamily as string) || '',
          answerTextAlign: (item.data?.answerTextAlign || '') as ProductSection['faqItems'][number]['answerTextAlign'],
          answerFontWeight: (item.data?.answerFontWeight as string) || '',
          answerLetterSpacing: Number(item.data?.answerLetterSpacing ?? 0),
        }))
    : []
  return {
    id: sec._id,
    kind: isCarousel ? 'carousel' : isVideo ? 'video' : isFaq ? 'faq' : 'section',
    // Solo se usan con kind === 'carousel' — en el resto quedan en sus
    // valores por defecto, sin efecto.
    dragSensitivity: Number(sec.data?.dragSensitivity ?? 1),
    dragInertiaEnabled: sec.data?.dragInertiaEnabled !== false,
    dragFriction: Number(sec.data?.dragFriction ?? 0.94),
    carouselSideShadowIntensity: Number(sec.data?.sideShadowIntensity ?? 55),
    title: (sec.data?.title as string) || '',
    description: (sec.data?.description as string) || '',
    badgeText: (sec.data?.badgeText as string) || '',
    badgeColor: (sec.data?.badgeColor as string) || '',
    badgeBackground: (sec.data?.badgeBackground as string) || '',
    badgeStrikethrough: Boolean(sec.data?.badgeStrikethrough),
    badgeShowIcon: sec.data?.badgeShowIcon !== false,
    badgePaddingSelect: (sec.data?.badgePaddingSelect as string) || 'a',
    badgePaddingText: (sec.data?.badgePaddingText as string) || '',
    badgeMarginSelect: (sec.data?.badgeMarginSelect as string) || 'a',
    badgeMarginText: (sec.data?.badgeMarginText as string) || '',
    dropEffectEnabled: sec.data?.dropEffectEnabled !== false,
    // Estilo del texto — texto vacío = usa el look por defecto (ver el JSX
    // donde se arma el `style={}` del título/desc.). No aplica a kind
    // 'video' (usa sus propios campos "phrase*", más abajo).
    titleColor: (sec.data?.titleColor as string) || '',
    titleWeight: (sec.data?.titleWeight as string) || '',
    titleFontSizeDesktop: (sec.data?.titleFontSizeDesktop as string) || '',
    titleFontSizeMobile: (sec.data?.titleFontSizeMobile as string) || '',
    titleLetterSpacing: Number(sec.data?.titleLetterSpacing ?? 0),
    titleLineHeight: Number(sec.data?.titleLineHeight ?? 0),
    titleFontFamily: (sec.data?.titleFontFamily as string) || '',
    titleTextShadowEnabled: Boolean(sec.data?.titleTextShadowEnabled),
    titleTextShadow: (sec.data?.titleTextShadow as string) || '',
    titlePaddingSelect: (sec.data?.titlePaddingSelect as string) || 'a',
    titlePaddingText: (sec.data?.titlePaddingText as string) || '',
    titleMarginSelect: (sec.data?.titleMarginSelect as string) || 'a',
    titleMarginText: (sec.data?.titleMarginText as string) || '',
    descColor: (sec.data?.descColor as string) || '',
    descFontSize: (sec.data?.descFontSize as string) || '',
    descLineHeight: Number(sec.data?.descLineHeight ?? 0),
    descFontFamily: (sec.data?.descFontFamily as string) || '',
    descPaddingSelect: (sec.data?.descPaddingSelect as string) || 'a',
    descPaddingText: (sec.data?.descPaddingText as string) || '',
    descMarginSelect: (sec.data?.descMarginSelect as string) || 'a',
    descMarginText: (sec.data?.descMarginText as string) || '',
    textAlign: (sec.data?.textAlign as ProductSection['textAlign']) || 'left',
    posX: Number(sec.data?.posX ?? 0),
    posY: Number(sec.data?.posY ?? 0),
    posZ: Number(sec.data?.posZ ?? 0),
    mobilePositionEnabled: Boolean(sec.data?.mobilePositionEnabled),
    posXMobile: Number(sec.data?.posXMobile ?? 0),
    posYMobile: Number(sec.data?.posYMobile ?? (isVideo ? 0 : 0.6)),
    posZMobile: Number(sec.data?.posZMobile ?? 0),
    rotationXMobile: Number(sec.data?.rotationXMobile ?? 0),
    rotationYMobile: Number(sec.data?.rotationYMobile ?? 15),
    rotationZMobile: Number(sec.data?.rotationZMobile ?? 0),
    rotationX: Number(sec.data?.rotationX ?? 0),
    rotationY: Number(sec.data?.rotationY ?? 0),
    rotationZ: Number(sec.data?.rotationZ ?? 0),
    scaleMultiplier: Number(sec.data?.scaleMultiplier ?? 1),
    scaleMultiplierMobile: Number(sec.data?.scaleMultiplierMobile ?? 1.4),
    background: (sec.data?.background as string) || '',
    // El campo del editor guarda 0–100 (%) — acá lo pasamos a 0–1 para
    // usarlo directo como factor de mezcla de color. (THREE no está
    // importado acá arriba — se carga dinámico solo dentro del efecto
    // pesado de three.js, más abajo.) kind 'video' no tiene estos campos
    // en su editor, así que siempre quedan en 0/false (objeto normalmente
    // iluminado, sin sombra parcial).
    shadowIntensity: Math.min(Math.max(Number(sec.data?.shadowIntensity ?? 0) / 100, 0), 1),
    shadowClearEnabled: Boolean(sec.data?.shadowClearEnabled),
    shadowClearStrength: Math.min(Math.max(Number(sec.data?.shadowClearStrength ?? 100) / 100, 0), 1),
    shadowClearShape: (sec.data?.shadowClearShape as ProductSection['shadowClearShape']) || 'sphere',
    shadowClearRadius: Number(sec.data?.shadowClearRadius ?? 1),
    shadowClearSizeX: Number(sec.data?.shadowClearSizeX ?? 1),
    shadowClearSizeY: Number(sec.data?.shadowClearSizeY ?? 2),
    shadowClearSizeZ: Number(sec.data?.shadowClearSizeZ ?? 1),
    shadowClearX: Number(sec.data?.shadowClearX ?? 0.6),
    shadowClearY: Number(sec.data?.shadowClearY ?? 0.6),
    shadowClearZ: Number(sec.data?.shadowClearZ ?? 0.6),
    shadowClearRotationX: (Number(sec.data?.shadowClearRotationX ?? 0) * Math.PI) / 180,
    shadowClearRotationY: (Number(sec.data?.shadowClearRotationY ?? 0) * Math.PI) / 180,
    shadowClearRotationZ: (Number(sec.data?.shadowClearRotationZ ?? 0) * Math.PI) / 180,
    // ── Solo para kind === 'video' ──────────────────────────────────
    bgVideoUrl: (sec.data?.bgVideo as WeaverseVideo)?.url || '',
    bgVideoPosterUrl: (sec.data?.bgVideoPoster as WeaverseImage)?.url || '',
    bgVideoBlur: Number(sec.data?.bgVideoBlur ?? 30),
    phraseText: (sec.data?.phraseText as string) ?? '',
    phraseTextAlign: (sec.data?.phraseTextAlign as ProductSection['phraseTextAlign']) || 'center',
    phraseColor: (sec.data?.phraseColor as string) || '#ffffff26',
    phraseWeight: (sec.data?.phraseWeight as string) || '900',
    phraseFontSizeDesktop: (sec.data?.phraseFontSizeDesktop as string) || '',
    phraseFontSizeMobile: (sec.data?.phraseFontSizeMobile as string) || '',
    phraseLetterSpacing: Number(sec.data?.phraseLetterSpacing ?? 0),
    phraseLineHeight: Number(sec.data?.phraseLineHeight ?? 0.85),
    phraseFontFamily: (sec.data?.phraseFontFamily as string) || '',
    phraseGlowBlur: Number(sec.data?.phraseGlowBlur ?? 40),
    phraseGlowOpacity: Number(sec.data?.phraseGlowOpacity ?? 0.5),
    // ── Solo para kind === 'faq' ────────────────────────────────────
    faqContentAlign: (sec.data?.contentAlign as ProductSection['faqContentAlign']) || 'center',
    faqContainerPaddingSelect: (sec.data?.containerPaddingSelect as string) || 'a',
    faqContainerPaddingText: (sec.data?.containerPaddingText as string) || '',
    faqContainerMarginSelect: (sec.data?.containerMarginSelect as string) || 'a',
    faqContainerMarginText: (sec.data?.containerMarginText as string) || '',
    headingText: (sec.data?.headingText as string) || '',
    headingColor: (sec.data?.headingColor as string) || '#ffffff',
    headingWeight: (sec.data?.headingWeight as string) || '900',
    headingFontSizeDesktop: (sec.data?.headingFontSizeDesktop as string) || '',
    headingFontSizeMobile: (sec.data?.headingFontSizeMobile as string) || '',
    headingLetterSpacing: Number(sec.data?.headingLetterSpacing ?? 0),
    headingLineHeight: Number(sec.data?.headingLineHeight ?? 0.95),
    headingFontFamily: (sec.data?.headingFontFamily as string) || '',
    faqMaxWidth: Number(sec.data?.faqMaxWidth ?? 700),
    faqAccordionMode: sec.data?.faqAccordionMode !== false,
    faqItemBorderColor: (sec.data?.faqItemBorderColor as string) || 'rgba(255,255,255,0.15)',
    faqItemBorderColorHover: (sec.data?.faqItemBorderColorHover as string) || 'rgba(255,255,255,0.35)',
    faqQuestionColor: (sec.data?.faqQuestionColor as string) || '#ffffff',
    faqQuestionFontSize: (sec.data?.faqQuestionFontSize as string) || '1.15rem',
    faqQuestionFontWeight: (sec.data?.faqQuestionFontWeight as string) || '500',
    faqIconColor: (sec.data?.faqIconColor as string) || '#a1a1aa',
    faqIconColorActive: (sec.data?.faqIconColorActive as string) || '#ffffff',
    faqAnswerColor: (sec.data?.faqAnswerColor as string) || '#a1a1aa',
    faqAnswerFontSize: (sec.data?.faqAnswerFontSize as string) || '0.95rem',
    faqAnswerLineHeight: Number(sec.data?.faqAnswerLineHeight ?? 1.6),
    faqItems,
  }
}

// El editor "richtext" de Weaverse a veces guarda el HTML doble-escapado —
// mismo problema/arreglo que ya usa faq-item.tsx.
function decodeFaqAnswer(html: string): string {
  if (typeof document === 'undefined') return html
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

// Encabezado + acordeón de preguntas para una toma kind === 'faq' (ver
// product3d-faq.tsx/product3d-faq-item.tsx). Tiene su propio estado de
// "qué pregunta está abierta" — el padre lo remonta con `key={section.id}`
// cada vez que cambia la toma FAQ activa, así el estado no se arrastra de
// una toma a otra. Va DESPUÉS del <canvas> en el DOM (con z-10, igual que
// el bloque de texto de una sección normal) para poder recibir clics — a
// diferencia del video/frase de product3d-video.tsx, que es solo
// decorativo y va antes (detrás) del canvas.
function FaqOverlay({ section, isMobile }: { section: ProductSection; isMobile: boolean }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (section.faqAccordionMode) return prev.has(id) ? new Set() : new Set([id])
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col gap-10 overflow-y-auto px-6 py-20 md:px-16 md:py-24',
        section.faqContentAlign === 'left' && 'items-start text-left',
        section.faqContentAlign === 'center' && 'items-center text-center',
        section.faqContentAlign === 'right' && 'items-end text-right',
      )}
      style={{
        ...selectorPaddingMargin('padding', section.faqContainerPaddingSelect, section.faqContainerPaddingText),
        ...selectorPaddingMargin('margin', section.faqContainerMarginSelect, section.faqContainerMarginText),
      }}
    >
      {section.headingText && (
        <h2
          className="w-full font-black uppercase"
          style={{
            color: section.headingColor,
            fontWeight: section.headingWeight,
            fontSize: isMobile
              ? section.headingFontSizeMobile || section.headingFontSizeDesktop || undefined
              : section.headingFontSizeDesktop || section.headingFontSizeMobile || undefined,
            letterSpacing: section.headingLetterSpacing ? `${section.headingLetterSpacing}px` : undefined,
            lineHeight: section.headingLineHeight > 0 ? section.headingLineHeight : undefined,
            fontFamily: section.headingFontFamily || undefined,
            whiteSpace: 'pre-line',
          }}
        >
          {section.headingText}
        </h2>
      )}
      {section.faqItems.length > 0 && (
        <div
          className={cn(
            'w-full',
            section.faqContentAlign === 'center' && 'mx-auto',
            section.faqContentAlign === 'right' && 'ml-auto',
          )}
          style={{ maxWidth: section.faqMaxWidth }}
        >
          <div style={{ borderTop: `1px solid ${section.faqItemBorderColor}` }}>
            {section.faqItems.map((item) => {
              const open = openIds.has(item.id)
              const hovered = hoveredId === item.id
              return (
                <div
                  key={item.id}
                  style={{
                    borderBottom: `1px solid ${hovered || open ? section.faqItemBorderColorHover : section.faqItemBorderColor}`,
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId((current) => (current === item.id ? null : current))}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={open}
                  >
                    <span
                      style={{
                        color: item.questionColor || section.faqQuestionColor,
                        fontSize: item.questionFontSize || section.faqQuestionFontSize,
                        fontFamily: item.questionFontFamily || undefined,
                        fontWeight: item.questionFontWeight || section.faqQuestionFontWeight,
                        letterSpacing: item.questionLetterSpacing ? `${item.questionLetterSpacing}px` : undefined,
                        textAlign: item.questionTextAlign || undefined,
                        flex: item.questionTextAlign ? '1 1 auto' : undefined,
                      }}
                    >
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl leading-none transition-transform duration-300"
                      style={{
                        color: open ? section.faqIconColorActive : section.faqIconColor,
                        transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div style={{ maxHeight: open ? '600px' : '0px', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                    <div
                      className="pb-5"
                      style={{
                        color: item.answerColor || section.faqAnswerColor,
                        fontSize: item.answerFontSize || section.faqAnswerFontSize,
                        fontFamily: item.answerFontFamily || undefined,
                        fontWeight: item.answerFontWeight || undefined,
                        letterSpacing: item.answerLetterSpacing ? `${item.answerLetterSpacing}px` : undefined,
                        textAlign: item.answerTextAlign || undefined,
                        lineHeight: section.faqAnswerLineHeight,
                      }}
                      dangerouslySetInnerHTML={{ __html: decodeFaqAnswer(item.answer) }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────

function Product3DViewer(props: Product3DViewerProps) {
  // Paso 1: leer las props, con su valor por defecto si el editor no las
  // configuró.
  const {
    clName,
    loaderData,
    bgColor = '#111111',
    bgBlur = 0,
    viewerHeight = '90vh',
    modelScale = 1,
    modelPositionY = 0,
    modelGap = 0.4,
    cameraDistance = 5,
    transitionSmoothness = 0.06,
    autoRotate = false,
    autoRotateSpeed = 1.2,
    // Apagado por defecto: el arrastre para orbitar (OrbitControls) usa el
    // mismo gesto táctil que el swipe para cambiar de frame — si los dos
    // están activos a la vez en un celular pueden pelearse entre sí. Se
    // puede prender desde el editor si se prefiere poder orbitar y se
    // asume ese trade-off.
    enableDrag = false,
    showProgress = true,
    rangeWidth = '10rem',
    rangeHeight = 4,
    rangeRadius = 20,
    rangeTrackColor = '#ffffff33',
    rangeAccentColor = '#ffffff',
    topShadowEnabled = true,
    topShadowHeight = 200,
    topShadowColor = '#000000cc',
    bottomShadowEnabled = true,
    bottomShadowHeight = 260,
    bottomShadowColor = '#000000cc',
    inactiveDimIntensity = 55,
    showDebugPanel = true,
  } = props

  const modelUrl = loaderData?.modelUrl ?? null
  // Para elegir "Tamaño en celular" vs "Tamaño en escritorio" del título de
  // cada sección (ver el JSX del texto de la sección, más abajo).
  const isMobile = useIsMobile(600)
  // Espejo en ref: el loop de animación de three.js vive en un efecto
  // aparte (no se re-ejecuta solo porque cambie `isMobile`), así que lee
  // el valor "en vivo" desde acá para elegir posición mobile/desktop del
  // objeto (ver animate() y `mobilePositionEnabled`).
  const isMobileRef = useRef(isMobile)
  useEffect(() => {
    isMobileRef.current = isMobile
  }, [isMobile])
  // Mismo motivo: el valor de "qué tan apagadas se ven las copias no
  // seleccionadas" se lee en vivo dentro de animate(), sin forzar que se
  // reconstruya toda la escena 3D cada vez que se toca el slider.
  const inactiveDimIntensityRef = useRef(inactiveDimIntensity)
  useEffect(() => {
    inactiveDimIntensityRef.current = inactiveDimIntensity
  }, [inactiveDimIntensity])
  // Mismo motivo: "Suavidad al mover el objeto" se lee en vivo dentro de
  // animate() (ver Paso 7.10), sin reconstruir la escena al tocar el slider.
  const transitionSmoothnessRef = useRef(transitionSmoothness)
  useEffect(() => {
    transitionSmoothnessRef.current = transitionSmoothness
  }, [transitionSmoothness])

  // Paso 2: leer los productos desde los hijos "Producto 3D" agregados en
  // el editor, y — para cada uno — sus propios hijos "Sección de producto
  // 3D". `useChildInstances()` solo da los hijos DIRECTOS del componente
  // que la llama (acá, el visor), así que para las secciones (nietos) no
  // podemos volver a llamar el hook por cada producto dentro de un .map()
  // — eso violaría las reglas de hooks de React al ser una cantidad
  // dinámica. En cambio, leemos directo del registro de instancias del
  // cliente de Weaverse (`weaverse.itemInstances`, el mismo Map que usa el
  // hook por dentro) usando las referencias `{ id }` que ya trae
  // `instance.data.children`.
  const weaverse = useWeaverse()
  const childInstances = useChildInstances()
  const designs = useMemo<ProductDesign[]>(
    () =>
      childInstances
        .map((instance): ProductDesign => {
          const childRefs: Array<{ id: string }> = instance.data?.children ?? []
          const sections: ProductSection[] = childRefs
            .map((ref) => weaverse?.itemInstances?.get(ref.id))
            .filter(Boolean)
            .map((sec: any) => readProductSection(sec, weaverse))

          return {
            id: instance._id,
            title: (instance.data?.title as string) || 'Producto',
            description: (instance.data?.description as string) || '',
            baseColorUrl: (instance.data?.baseColorImage as any)?.url || '',
            normalMapUrl: (instance.data?.normalMapImage as any)?.url || '',
            aoMapUrl: (instance.data?.aoMapImage as any)?.url || '',
            specularMapUrl: (instance.data?.specularMapImage as any)?.url || '',
            logoUrl: (instance.data?.logoImage as any)?.url || '',
            sections,
          }
        })
        // Sin base_color no hay nada que texturizar — se descarta.
        .filter((d) => d.baseColorUrl),
    [childInstances, weaverse],
  )
  const missingTitles = useMemo(
    () =>
      childInstances
        // El hijo "Modo carrusel" no es un producto — no tiene por qué
        // tener textura, así que no cuenta como "falta imagen".
        .filter((instance: any) => instance?.data?.type !== 'producto-3d-carrusel')
        .filter((instance) => !(instance.data?.baseColorImage as any)?.url)
        .map((instance) => (instance.data?.title as string) || 'Sin nombre'),
    [childInstances],
  )
  // Clave estable (solo las URLs de textura, no texto/posiciones) para el
  // array de dependencias del efecto pesado de más abajo — así editar un
  // texto o mover una sección no dispara una recarga completa de la
  // escena 3D (esos valores se leen en vivo vía `designsRef`, ver Paso 6).
  const designsKey = useMemo(
    () => designs.map((d) => `${d.id}:${d.baseColorUrl}:${d.normalMapUrl}:${d.aoMapUrl}:${d.specularMapUrl}`).join('|'),
    [designs],
  )
  const designsRef = useRef(designs)
  useEffect(() => {
    designsRef.current = designs
  }, [designs])

  // Paso 3: la lista plana de frames a recorrer — la toma general de cada
  // producto, seguida de cada una de sus secciones, en orden.
  const frames = useMemo<Frame[]>(() => {
    const list: Frame[] = []
    designs.forEach((design, productIndex) => {
      list.push({ productIndex, sectionIndex: null })
      design.sections.forEach((_section, sectionIndex) => {
        list.push({ productIndex, sectionIndex })
      })
    })
    return list
  }, [designs])
  const framesRef = useRef(frames)
  useEffect(() => {
    framesRef.current = frames
  }, [frames])

  // Encuentra el frame de la toma GENERAL (no una sección) del producto
  // que queda justo en el MEDIO de la fila — así arranca centrado en vez
  // de en el primero. Con cantidad par de productos, redondea hacia abajo
  // (ej. 4 productos → el índice 1, el segundo de los del medio).
  const middleProductFrameIndex = (list: Frame[], productCount: number) => {
    if (productCount === 0) return 0
    const middleProductIndex = Math.floor((productCount - 1) / 2)
    const idx = list.findIndex((f) => f.productIndex === middleProductIndex && f.sectionIndex === null)
    return idx >= 0 ? idx : 0
  }

  // Paso 4: qué frame está activo. Un solo número (`activeFrame`) alcanza
  // para saber tanto el producto como la sección — se derivan de `frames`.
  // Igual que antes, se guarda también en refs para que el loop de
  // animación de three.js lea el valor más reciente sin depender de un
  // re-render de React. Arranca en el producto del MEDIO (no el primero) —
  // `frames`/`designs` ya están calculados en este mismo render (son
  // useMemo de más arriba), así que si los datos ya están disponibles
  // arranca bien de entrada; si llegan después, el efecto de más abajo lo
  // corrige.
  const [activeFrame, setActiveFrame] = useState(() => middleProductFrameIndex(frames, designs.length))
  const currentFrame = frames[Math.min(activeFrame, Math.max(frames.length - 1, 0))] ?? {
    productIndex: 0,
    sectionIndex: null,
  }
  const activeProductIndex = currentFrame.productIndex
  const activeSectionIndex = currentFrame.sectionIndex
  const active = designs[Math.min(activeProductIndex, Math.max(designs.length - 1, 0))]
  const activeSection = activeSectionIndex != null ? active?.sections[activeSectionIndex] : undefined
  // "Modo carrusel": no es un switch — es la TOMA que está activa ahora
  // mismo. Si es un hijo "Modo carrusel" (product3d-carousel.tsx, dentro
  // de un "Producto 3D"), en vez de mover el objeto a una pose normal, la
  // fila entera se puede recorrer arrastrando en bucle infinito — al
  // navegar a la toma siguiente/anterior se vuelve al comportamiento
  // normal solo.
  const dragCarouselMode = activeSection?.kind === 'carousel'
  const dragSensitivity = activeSection?.dragSensitivity ?? 1
  const dragInertiaEnabled = activeSection?.dragInertiaEnabled ?? true
  const dragFriction = activeSection?.dragFriction ?? 0.94
  // Se leen dentro de efectos con deps vacías (scroll/teclado/swipe, y el
  // loop de three.js — a propósito NO están en las deps del efecto pesado
  // de three.js: entrar/salir de la toma "carrusel" no tiene que
  // reconstruir toda la escena 3D, solo cambiar cómo se interpreta el
  // arrastre cuadro a cuadro).
  const dragCarouselModeRef = useRef(dragCarouselMode)
  const dragSensitivityRef = useRef(dragSensitivity)
  const dragInertiaEnabledRef = useRef(dragInertiaEnabled)
  const dragFrictionRef = useRef(dragFriction)
  useEffect(() => {
    dragCarouselModeRef.current = dragCarouselMode
    dragSensitivityRef.current = dragSensitivity
    dragInertiaEnabledRef.current = dragInertiaEnabled
    dragFrictionRef.current = dragFriction
  }, [dragCarouselMode, dragSensitivity, dragInertiaEnabled, dragFriction])

  // Transición de fondo (crossfade): un simple `transition: background` de
  // CSS no anima bien de un linear-gradient a otro (ni de color a
  // gradient) en la mayoría de navegadores — solo interpola colores sólidos
  // simples. En cambio, vamos apilando una capa nueva (full-bleed, detrás
  // del canvas) por cada fondo distinto que toca mostrar, y esa capa nueva
  // hace fade-in por arriba de la anterior — así el cambio SIEMPRE se ve
  // como una transición suave, sea cual sea el tipo de fondo. Solo hace
  // falta guardar las últimas 2 capas: la de abajo (ya tapada del todo una
  // vez terminada la transición) y la de arriba (la que se está viendo).
  const targetBackground = activeSection?.background || bgColor
  const [bgLayers, setBgLayers] = useState(() => [{ key: 0, value: targetBackground }])
  const bgLayerKeyRef = useRef(1)
  useEffect(() => {
    setBgLayers((layers) => {
      if (layers[layers.length - 1]?.value === targetBackground) return layers
      return [...layers, { key: bgLayerKeyRef.current++, value: targetBackground }].slice(-2)
    })
  }, [targetBackground])

  const activeIndexRef = useRef(0) // índice de PRODUCTO activo, CON wrap (0..N-1) — para saber qué producto es y qué copia de la fila es "la activa".
  // Posición CONTINUA (SIN wrap) de la fila — la usa animate()/applyLayout
  // para ubicar las copias en vez de `activeIndexRef`. Al llegar al final y
  // "dar la vuelta" (ej. del último producto al primero), en vez de saltar
  // el índice hacia atrás (lo que hacía que toda la fila recorriera el
  // camino de vuelta en sentido contrario), esto sigue sumando en la misma
  // dirección — como hay copias repetidas de sobra (SIDE_REPEATS), la que
  // "sigue" ya está ahí, lista, sin tener que recorrer nada.
  const visualIndexRef = useRef(0)
  // Posición CONTINUA de la fila del "Modo carrusel" — SU PROPIO carrusel,
  // totalmente aparte de `visualIndexRef`. Arrastrar en la toma "carrusel"
  // solo mueve esto; `visualIndexRef`/`activeIndexRef` (título, barra de
  // progreso, click-to-select, qué producto es "el activo") quedan intactos
  // durante todo el arrastre — por eso al salir de la toma "carrusel" la
  // navegación normal sigue exactamente donde estaba, sin que el arrastre la
  // haya movido un solo pixel.
  const carouselIndexRef = useRef(0)
  const activeSectionIndexRef = useRef<number | null>(null)
  const activeFrameRef = useRef(0) // índice de FRAME activo (para saber si es el primero/último al scrollear)
  useEffect(() => {
    const total = designsRef.current.length
    if (total > 0 && activeProductIndex !== activeIndexRef.current) {
      // Camino más corto en el círculo de productos (0..N-1): si el nuevo
      // índice queda "cruzando" el final/principio, el delta calculado acá
      // da +1/-1 (seguir en la misma dirección) en vez de -(N-1)/+(N-1)
      // (retroceder por todo el resto de la fila) — es la clave de que no
      // se vea el "recorrido de vuelta".
      let delta = (((activeProductIndex - activeIndexRef.current) % total) + total) % total
      if (delta > total / 2) delta -= total
      visualIndexRef.current += delta
    }
    activeIndexRef.current = activeProductIndex
    activeSectionIndexRef.current = activeSectionIndex
    activeFrameRef.current = activeFrame
  }, [activeProductIndex, activeSectionIndex, activeFrame])

  // Si la cantidad de frames cambia (se agrega/borra un producto o una
  // sección en el editor) y el frame activo quedó fuera de rango, lo
  // recorta.
  useEffect(() => {
    if (activeFrame > frames.length - 1) {
      setActiveFrame(Math.max(frames.length - 1, 0))
    }
  }, [frames.length, activeFrame])

  const [hasInteracted, setHasInteracted] = useState(false)
  // Si `designs`/`frames` todavía no estaban listos en el primer render
  // (por eso el cálculo de arriba dio 0 como respaldo) y los datos llegan
  // en un render posterior, esto corrige al producto del medio — UNA sola
  // vez (guardado en `initialFrameSetRef`, no en estado, para no volver a
  // dispararse) y solo si el usuario todavía no interactuó. Importante:
  // NO depende de `frames`/`designs` directo (son un array/objeto nuevo
  // en cada render aunque el contenido no cambie) — eso era lo que hacía
  // que este efecto se re-disparara sin parar (loop infinito). Se lee
  // `framesRef.current` adentro, ya sincronizado por el efecto de arriba.
  const initialFrameSetRef = useRef(false)
  useEffect(() => {
    if (hasInteracted || initialFrameSetRef.current || designs.length === 0) return
    initialFrameSetRef.current = true
    setActiveFrame(middleProductFrameIndex(framesRef.current, designs.length))
  }, [designs.length, hasInteracted])

  // Avanza/retrocede por TODOS los frames (tomas generales + secciones),
  // con wraparound — se usan desde los botones, el teclado, el swipe y la
  // barra. Leen todo desde `framesRef` (nunca quedan "viejas").
  const goNextFrame = () => {
    setHasInteracted(true)
    setActiveFrame((f) => (framesRef.current.length > 0 ? (f + 1) % framesRef.current.length : 0))
  }
  const goPrevFrame = () => {
    setHasInteracted(true)
    setActiveFrame((f) =>
      framesRef.current.length > 0 ? (f - 1 + framesRef.current.length) % framesRef.current.length : 0,
    )
  }
  // Salta directo a la toma general (no una sección) de un producto — lo
  // usan el clic sobre una copia de los costados, la barra del panel de
  // debug y (si se agrega) cualquier selector por nombre.
  const selectProduct = (productIndex: number) => {
    setHasInteracted(true)
    const idx = framesRef.current.findIndex((fr) => fr.productIndex === productIndex && fr.sectionIndex === null)
    setActiveFrame(idx >= 0 ? idx : 0)
  }
  // Avanza/retrocede de OBJETO 3D (producto), saltándose sus secciones —
  // a diferencia de goNextFrame/goPrevFrame (que recorren frame a frame,
  // incluidas las secciones). Los botones y la barra usan estas — el
  // scroll/swipe/teclado sigue siendo frame a frame, sin cambios.
  const goNextProduct = () => {
    const total = designsRef.current.length
    if (total === 0) return
    selectProduct((activeIndexRef.current + 1) % total)
  }
  const goPrevProduct = () => {
    const total = designsRef.current.length
    if (total === 0) return
    selectProduct((activeIndexRef.current - 1 + total) % total)
  }

  // Paso 5: referencias al DOM.
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rangeInputRef = useRef<HTMLInputElement>(null)

  // En Firefox (y algunos navegadores), scrollear con el mouse mientras
  // está sobre un <input type="range"> le cambia el valor — justo lo que
  // no queremos, porque esa misma rueda ya está manejada por el visor
  // (paso 6) para avanzar frames. React marca los onWheel inline como
  // "passive" (no se puede frenar con preventDefault ahí), así que hace
  // falta un listener nativo con { passive: false }. Se re-conecta cada
  // vez que la barra aparece/desaparece (condicionada a showProgress, a
  // que haya más de un frame, y a que NO haya una sección activa — ver el
  // JSX más abajo).
  useEffect(() => {
    const el = rangeInputRef.current
    if (!el) return
    const blockWheel = (e: WheelEvent) => e.preventDefault()
    el.addEventListener('wheel', blockWheel, { passive: false })
    return () => el.removeEventListener('wheel', blockWheel)
  }, [showProgress, frames.length, activeSection])

  // Paso 6: navegación por scroll del mouse (rueda), teclado (flechas) y
  // swipe táctil horizontal sobre el visor. El scroll SOLO se "atrapa"
  // (preventDefault) mientras hay más frames para mostrar en esa
  // dirección — apenas llegás al primer o último frame, se deja de
  // interceptar y el scroll de la página sigue funcionando normal (así el
  // usuario no queda trabado sin poder bajar/subir la página). Este efecto
  // es liviano y no depende de que three.js ya haya cargado, por eso va
  // separado del efecto pesado de más abajo.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onKeyDown = (e: KeyboardEvent) => {
      // Las flechas siguen cambiando de toma igual que en cualquier otra
      // (incluso estando en "Modo carrusel") — solo el ARRASTRE horizontal
      // con el mouse/dedo es exclusivo de esa toma (ver el efecto de
      // three.js, más abajo). Así nunca queda "trabado" ahí.
      if (isEditingField(e.target)) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNextFrame()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrevFrame()
      }
    }

    // Un "tick" de rueda dispara MUCHOS eventos "wheel" seguidos (sobre
    // todo con trackpad) — el cooldown hace que cada gesto de scroll avance
    // un solo frame por vez, en vez de pasar varios de un tirón.
    let lastWheelAt = 0
    const WHEEL_COOLDOWN_MS = 650
    const onWheel = (e: WheelEvent) => {
      // La rueda sigue avanzando de toma en toma igual que siempre, incluso
      // estando en "Modo carrusel" — no se queda "atrapado" ahí (ver
      // comentario de onKeyDown).
      if (Math.abs(e.deltaY) < 4) return
      const total = framesRef.current.length
      if (total <= 1) return
      const scrollingDown = e.deltaY > 0
      const atFirst = activeFrameRef.current <= 0
      // Al llegar al ÚLTIMO frame, seguir bajando da la vuelta al primero
      // en vez de dejar pasar el scroll — goNextFrame() ya hace wraparound
      // con "% total", así que alcanza con no cortar acá. Solo en el
      // PRIMER frame, scrollear hacia arriba deja pasar el scroll tal cual
      // (no hay nada "antes" a donde volver en loop).
      if (!scrollingDown && atFirst) return
      e.preventDefault()
      const now = performance.now()
      if (now - lastWheelAt < WHEEL_COOLDOWN_MS) return
      lastWheelAt = now
      if (scrollingDown) goNextFrame()
      else goPrevFrame()
    }

    let touchStartX = 0
    let touchStartY = 0
    let touchActive = false
    const onTouchStart = (e: TouchEvent) => {
      // El swipe de navegación es VERTICAL y el arrastre del "Modo
      // carrusel" es HORIZONTAL (pointerdown/pointermove, ver el efecto de
      // three.js) — son ejes distintos, así que no hace falta desactivar
      // esto en esa toma (antes sí, cuando este swipe todavía era
      // horizontal y chocaba con el arrastre).
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      touchActive = true
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchActive) return
      touchActive = false
      const deltaX = touchStartX - e.changedTouches[0].clientX
      const deltaY = touchStartY - e.changedTouches[0].clientY
      // Cambia de toma con un swipe VERTICAL — el mismo gesto de "scrollear
      // hacia abajo/arriba" que ya usan la rueda del mouse y las flechas,
      // en vez de uno horizontal (que quedaba raro/inesperado en mobile).
      // Umbral + que sea más vertical que horizontal, así un swipe para
      // arrastrar de costado (ej. "Modo carrusel") no dispara un cambio de
      // toma por error.
      if (Math.abs(deltaY) < 40 || Math.abs(deltaY) < Math.abs(deltaX)) return
      if (deltaY > 0) goNextFrame()
      else goPrevFrame()
    }

    window.addEventListener('keydown', onKeyDown)
    // { passive: false } es necesario para poder llamar preventDefault().
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchend', onTouchEnd)
    }
    // Sin dependencias de estado: goNextFrame/goPrevFrame/las refs leen
    // todo lo que necesitan desde refs y el setState funcional, así que
    // son seguras de capturar una sola vez sin quedar "viejas".
  }, [])

  // Paso 7: el efecto principal — arma la escena three.js con un clon por
  // producto, en fila, y la mantiene sincronizada con el frame activo
  // (toma general de un producto, o una de sus secciones).
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !modelUrl || designs.length === 0) return

    let disposed = false
    let raf = 0
    const cleanupFns: Array<() => void> = []

    ;(async () => {
      // Paso 7.1: cargar three.js y sus addons de forma dinámica — así no
      // engordan el bundle inicial de la página.
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
      const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')
      const { GUI } = showDebugPanel
        ? await import('three/addons/libs/lil-gui.module.min.js')
        : { GUI: null }
      if (disposed) return

      const container = containerRef.current
      const canvas = canvasRef.current
      if (!container || !canvas) return

      // Paso 7.2: lo básico de toda escena three.js.
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
      camera.position.set(0, 0, cameraDistance)

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Paso 7.3: iluminación fija — ambiental suave + dos direccionales
      // para dar volumen a todas las copias por igual.
      scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2))
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.6)
      keyLight.position.set(3, 5, 4)
      scene.add(keyLight)
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.6)
      fillLight.position.set(-4, 2, -3)
      scene.add(fillLight)

      // Luz extra que sigue a la copia activa cuando estamos en la fila
      // (varios productos en pantalla) — es lo que la hace lucir "más
      // iluminada" frente al resto. En modo sección no hace falta (el
      // resto ya está invisible), así que se apaga sola — ver animate().
      const highlightLight = new THREE.PointLight(0xffffff, 0, 20)
      scene.add(highlightLight)

      // Marcador (alambre) que muestra dónde está, qué tan grande y de qué
      // FORMA es la "zona sin sombra" — se activa desde el panel de debug
      // ("Mostrar zona sin sombra") para poder ubicarla a ojo. NO es una
      // luz — no ilumina nada, es puramente visual/de debug. El efecto
      // real (aclarar shadowIntensity ahí adentro) se hace en el shader de
      // cada material, no acá. Dos geometrías listas (esfera/cubo) que se
      // intercambian según la forma configurada — ver animate().
      const clearZoneSphereGeo: import('three').BufferGeometry = new THREE.SphereGeometry(1, 16, 12)
      const clearZoneBoxGeo: import('three').BufferGeometry = new THREE.BoxGeometry(2, 2, 2)
      const clearZoneHelper: import('three').Mesh = new THREE.Mesh(
        clearZoneSphereGeo,
        new THREE.MeshBasicMaterial({ color: 0x22ffaa, wireframe: true, transparent: true, opacity: 0.6 }),
      )
      clearZoneHelper.visible = false
      scene.add(clearZoneHelper)
      // Toggle del checkbox "Mostrar zona sin sombra" del panel de debug.
      let showClearZoneGizmo = false

      // Vista previa de iluminación desde el panel de debug: permite
      // tocar sombra/sombra-parcial y ver el resultado en la copia activa
      // sin depender de tener una sección real activa en ese momento —
      // así se puede ir ajustando X/Y/Z hasta encontrar el punto justo
      // antes de cargarlo en la sección desde Weaverse Studio. Cuando
      // está apagada (`enabled: false`, por defecto), todo sigue
      // funcionando exactamente igual que antes: los datos reales de la
      // sección activa (ver `designsRef`).
      const lightPreview = {
        enabled: false,
        shadowIntensity: 0, // 0–100, como en el editor
        shadowClearEnabled: false,
        shadowClearStrength: 100, // 0–100, como en el editor
        shadowClearShape: 'sphere' as 'sphere' | 'box' | 'rect',
        shadowClearRadius: 1,
        shadowClearSizeX: 1,
        shadowClearSizeY: 2,
        shadowClearSizeZ: 1,
        shadowClearX: 0.6,
        shadowClearY: 0.6,
        shadowClearZ: 0.6,
        shadowClearRotationX: 0, // grados, como en el editor
        shadowClearRotationY: 0,
        shadowClearRotationZ: 0,
      }

      // Paso 7.4: OrbitControls — arrastrar para rotar la cámara alrededor
      // del producto. Desactivado por defecto (ver comentario en las
      // props de más arriba).
      const controls = new OrbitControls(camera, canvas)
      controls.enablePan = false
      controls.enableZoom = false
      // En la toma "carrusel" el arrastre lo usa la fila (ver más abajo) —
      // se fuerza apagado para que no compita por el mismo gesto (valor
      // inicial acá; se actualiza en vivo cuadro a cuadro en animate(),
      // porque puede cambiar de toma en toma sin reconstruir la escena).
      controls.enabled = dragCarouselModeRef.current ? false : enableDrag
      controls.autoRotate = autoRotate
      controls.autoRotateSpeed = autoRotateSpeed
      controls.enableDamping = true
      controls.dampingFactor = 0.08

      // Paso 7.5: mantener el tamaño del render sincronizado con el
      // contenedor.
      let lastResizeW = -1
      let lastResizeH = -1
      function resize() {
        const w = container!.clientWidth
        const h = container!.clientHeight
        // Corta si el tamaño no cambió de verdad — `renderer.setSize` toca
        // el <canvas> (ancho/alto reales, no solo CSS), y en algunos
        // navegadores mobile eso puede disparar OTRO evento "resize" (ej.
        // por la barra de direcciones mostrándose/ocultándose sola al
        // togglear `touch-action`) — sin este corte, ese vaivén se
        // retroalimenta solo y termina siendo el "loop infinito" que
        // satura el render.
        if (w === lastResizeW && h === lastResizeH) return
        lastResizeW = w
        lastResizeH = h
        camera.aspect = w / Math.max(h, 1)
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', resize)
      cleanupFns.push(() => window.removeEventListener('resize', resize))
      resize()

      const gltfLoader = new GLTFLoader()
      const textureLoader = new THREE.TextureLoader()
      const clones: import('three').Object3D[] = []
      const materials: import('three').MeshPhongMaterial[] = []
      // Para el "loop infinito" de la fila: en vez de UN clon por producto,
      // se crean varias copias repetidas de cada uno (ver `SIDE_REPEATS`
      // más abajo), así siempre hay copias de sobra a los costados y nunca
      // se ve un hueco vacío al llegar cerca del primer/último producto —
      // igual que en la referencia (son 4 productos "de verdad", pero se
      // repiten en la fila). `clones[i]` ya NO corresponde 1 a 1 con
      // `designs[i]` como antes — para saber qué representa cada copia:
      //   • cloneLogicalIndex[i]: su posición FIJA en la fila (puede ser
      //     negativa o mayor a designs.length-1 — las copias repetidas se
      //     ubican antes/después del set "primario", que va de 0 a
      //     designs.length-1, igual que el índice de producto activo).
      //   • cloneDesignIndex[i]: a qué producto (índice en `designs`)
      //     representa — se usa para saber a qué producto saltar si se
      //     hace clic en cualquier copia repetida.
      const cloneLogicalIndex: number[] = []
      const cloneDesignIndex: number[] = []
      // Tamaño "nativo" del modelo (sin escalar) — se rellena al cargar el
      // .glb y sirve para recalcular fila/cámara cada vez que cambia un
      // parámetro (desde props o desde el panel de debug).
      let templateSize = new THREE.Vector3(1, 1, 1)
      // Escala/espacio "base" vivos (prop o slider de debug) — animate()
      // los lee cada frame para el highlight y para deslizar la fila.
      let baseScale = modelScale
      let baseGap = modelGap

      const loadTexture = (url: string, srgb = false) => {
        if (!url) return undefined
        const tex = textureLoader.load(url)
        tex.flipY = false
        if (srgb) tex.colorSpace = THREE.SRGBColorSpace
        return tex
      }

      // Paso 7.6: funciones de layout y cámara para la toma GENERAL (fila)
      // — la copia activa siempre queda en x=0 (centrada), el resto se
      // ordena a los lados según su distancia al índice activo. La cámara
      // NO se mueve sola cuando cambian escala/espacio/posición (ver
      // applyLayout) — así se nota de verdad el efecto de agrandar el
      // modelo; para reencuadrar hay que pedirlo a propósito (el botón
      // "Encuadrar cámara" del panel de debug, o al cargar por primera
      // vez). Las SECCIONES tampoco usan esto — mueven el objeto activo
      // directamente (ver animate()), la cámara se queda quieta donde esté.
      function computeLayout(scaleVal: number, gapVal: number) {
        const itemWidth = templateSize.x * scaleVal || 1
        const itemHeight = templateSize.y * scaleVal || 1
        const spacing = itemWidth * (1 + Math.max(gapVal, 0))
        // OJO: acá se usa la cantidad de PRODUCTOS (no `clones.length`,
        // que ahora incluye las copias repetidas del loop infinito) — el
        // encuadre de cámara solo le tiene que "importar" el peor caso
        // real (el producto activo en una punta), no todo el ancho de la
        // fila infinita.
        const count = designs.length
        const active = count > 0 ? THREE.MathUtils.clamp(activeIndexRef.current, 0, count - 1) : 0
        const maxSteps = count > 0 ? Math.max(active, count - 1 - active) : 0
        const totalWidth = itemWidth + 2 * maxSteps * spacing
        return { itemWidth, itemHeight, spacing, totalWidth }
      }

      // Asegura que el "far" de la cámara (hasta dónde ve) cubra la fila
      // actual — independiente de si la cámara se movió o no. Si solo
      // cambiás la escala (applyLayout) sin re-encuadrar la cámara, la fila
      // igual puede crecer más allá de lo que el far plane cubría antes;
      // esto evita que vuelva a pasar lo mismo que con la distancia.
      function ensureFarPlane(scaleVal: number, gapVal: number) {
        const { totalWidth, itemHeight } = computeLayout(scaleVal, gapVal)
        const camDist = camera.position.distanceTo(controls.target)
        const required = camDist + Math.max(totalWidth, itemHeight) * 2 + 50
        if (required > camera.far) {
          camera.far = required
          camera.updateProjectionMatrix()
        }
      }

      // Reubica y reescala las copias en fila centrada en la activa —
      // NO toca la cámara (a propósito: así subir "Escala" se nota de
      // verdad en pantalla, en vez de que la cámara se aleje sola y
      // "cancele" el cambio). Se usa al cargar y desde el panel de debug;
      // el reacomodo en vivo al cambiar de frame (clic/flechas/swipe/
      // barra) lo hace animate().
      function applyLayout(scaleVal: number, gapVal: number, posY: number) {
        baseScale = scaleVal
        baseGap = gapVal
        const { spacing } = computeLayout(scaleVal, gapVal)
        clones.forEach((clone, i) => {
          clone.scale.setScalar(scaleVal)
          clone.position.x = (cloneLogicalIndex[i] - visualIndexRef.current) * spacing
          clone.position.y = posY
        })
        ensureFarPlane(scaleVal, gapVal)
      }

      function fitCameraDistance(scaleVal: number, gapVal: number, minDistance: number) {
        const { itemHeight, totalWidth } = computeLayout(scaleVal, gapVal)
        const vFov = THREE.MathUtils.degToRad(camera.fov)
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(camera.aspect, 0.01))
        const fitForHeight = itemHeight / 2 / Math.tan(vFov / 2)
        const fitForWidth = totalWidth / 2 / Math.tan(hFov / 2)
        return Math.max(fitForHeight, fitForWidth, minDistance, 0.01) * 1.15
      }
      // Aleja/acerca la cámara manteniendo el ángulo de órbita actual,
      // medido desde controls.target (no desde el origen).
      function setCameraDistance(distance: number) {
        const offset = camera.position.clone().sub(controls.target)
        if (offset.lengthSq() < 1e-6) offset.set(0, 0, 1)
        offset.normalize().multiplyScalar(Math.max(distance, 0.01))
        camera.position.copy(controls.target).add(offset)
        // El "far" de la cámara (hasta dónde ve) arrancó fijo en 100 — con
        // varios productos, espacio grande entre copias y/o una escala
        // alta, la distancia necesaria para encuadrar todo puede superar
        // esos 100 fácilmente, y todo lo que queda más allá del far plane
        // no se dibuja (los objetos "desaparecen" aunque estén ahí). Lo
        // recalculamos cada vez que movemos la cámara, con margen de sobra.
        const requiredFar = distance * 3 + 50
        if (requiredFar > camera.far) {
          camera.far = requiredFar
          camera.updateProjectionMatrix()
        }
        controls.update()
      }

      // Paso 7.7: clic sobre una copia de los costados → la selecciona
      // (salta a su toma general), igual que las flechas/swipe/teclado/
      // barra. Avanzar a una SECCIÓN es exclusivo del scroll (paso 6) — un
      // clic sobre la copia ya activa no hace nada. "Raycasting" traza un
      // rayo imaginario desde la cámara hacia el punto tocado y pregunta
      // qué objeto de la escena cruza. Usamos "click" (no pointerdown/up)
      // porque el navegador ya distingue un tap de un arrastre para
      // orbitar la cámara.
      const raycaster = new THREE.Raycaster()
      const pointerNdc = new THREE.Vector2()
      function onCanvasClick(e: MouseEvent) {
        // En "Modo carrusel" un clic no selecciona nada — es puro
        // escaparate, se recorre arrastrando (ver el bloque de arrastre).
        if (dragCarouselModeRef.current) return
        if (clones.length === 0) return
        const rect = canvas.getBoundingClientRect()
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointerNdc, camera)
        const hit = raycaster.intersectObjects(clones, true)[0]
        if (!hit) return
        let obj: import('three').Object3D | null = hit.object
        while (obj && !clones.includes(obj)) obj = obj.parent
        const cloneIdx = obj ? clones.indexOf(obj) : -1
        if (cloneIdx < 0) return
        // Cualquier copia repetida de un producto selecciona ESE producto
        // (no importa cuál de sus copias tocaste en la fila infinita).
        const productIdx = cloneDesignIndex[cloneIdx]
        if (productIdx === activeIndexRef.current) return
        selectProduct(productIdx)
      }
      canvas.addEventListener('click', onCanvasClick)
      cleanupFns.push(() => canvas.removeEventListener('click', onCanvasClick))

      // Paso 7.7b: "Modo carrusel" — arrastre libre con inercia, para
      // recorrer la fila SIN cambiar de sección ni entrar a detalle (ver
      // dragCarouselMode). Reusa el MISMO mecanismo de loop infinito de la
      // fila (cloneLogicalIndex) que ya usa la navegación normal, pero con
      // su PROPIA posición continua (`carouselIndexRef`) — el arrastre
      // nunca toca `visualIndexRef` (esa es la de la navegación normal).
      let dragVelocity = 0
      let isRowDragging = false
      let lastDragPointerX = 0
      // A qué eje quedó "comprometido" el gesto actual: null = todavía no
      // se movió lo suficiente para saberlo. 'x' = arrastre del carrusel.
      // 'y' = es un swipe vertical (cambiar de toma, ver onTouchStart/
      // onTouchEnd más arriba) — el carrusel lo ignora del todo, así un
      // swipe para bajar/subir de sección nunca mueve la fila ni un poco.
      let dragAxisLocked: 'x' | 'y' | null = null
      let dragDownX = 0
      let dragDownY = 0
      // Para detectar el momento exacto en que se ENTRA a la toma
      // "carrusel" (ver animate()) y arrancar `carouselIndexRef` desde
      // donde esté el producto activo en ese momento.
      let wasCarouselActive = false
      // Para no escribir `canvas.style.cursor` en cada cuadro — solo
      // cuando de verdad cambia si estamos en la toma "carrusel" o no.
      let cursorModeSynced = false
      // Estado de la fila (todas las copias visibles) del cuadro ANTERIOR —
      // para detectar el instante exacto en que pasa de oculta a visible
      // (ver `revealFromSides` en animate()) y disparar la entrada "desde
      // los laterales" una sola vez, no en cada cuadro.
      let prevShowRow = false

      // Cuántos píxeles de pantalla equivalen a una unidad del mundo 3D a
      // la distancia de cámara actual — para que arrastrar se sienta 1 a 1
      // (el objeto "sigue" al dedo/mouse).
      function pixelsPerWorldUnit() {
        const vFov = THREE.MathUtils.degToRad(camera.fov)
        const camDist = camera.position.distanceTo(controls.target)
        const visibleHeight = 2 * Math.tan(vFov / 2) * camDist
        const canvasHeightPx = canvas.clientHeight || 1
        return canvasHeightPx / Math.max(visibleHeight, 0.0001)
      }

      function onRowPointerDown(e: PointerEvent) {
        if (!dragCarouselModeRef.current) return
        isRowDragging = true
        dragAxisLocked = null
        dragVelocity = 0
        lastDragPointerX = e.clientX
        dragDownX = e.clientX
        dragDownY = e.clientY
        canvas.setPointerCapture(e.pointerId)
        // El cursor recién pasa a "grabbing" si el gesto termina siendo
        // horizontal (ver más abajo) — así un swipe vertical no se ve
        // "agarrado" por error.
      }
      function onRowPointerMove(e: PointerEvent) {
        if (!isRowDragging) return
        if (dragAxisLocked === null) {
          const totalX = e.clientX - dragDownX
          const totalY = e.clientY - dragDownY
          // Espera a que se mueva lo suficiente antes de decidir el eje —
          // el temblor normal de la mano justo al tocar no cuenta.
          if (Math.abs(totalX) < 8 && Math.abs(totalY) < 8) {
            lastDragPointerX = e.clientX
            return
          }
          dragAxisLocked = Math.abs(totalX) >= Math.abs(totalY) ? 'x' : 'y'
          lastDragPointerX = e.clientX
          if (dragAxisLocked === 'y') {
            // Gesto vertical — no es un arrastre de carrusel, es un swipe
            // de navegación (lo maneja onTouchEnd). Suelta el puntero para
            // no seguir "reservándolo": de acá en más este gesto no toca
            // la fila para nada.
            try {
              canvas.releasePointerCapture(e.pointerId)
            } catch {
              // ya se pudo haber liberado solo
            }
            return
          }
          canvas.style.cursor = 'grabbing'
          return
        }
        if (dragAxisLocked === 'y') return
        const deltaXpx = e.clientX - lastDragPointerX
        lastDragPointerX = e.clientX
        const { spacing } = computeLayout(baseScale, baseGap)
        const deltaLogical = (deltaXpx / pixelsPerWorldUnit() / spacing) * dragSensitivityRef.current
        // Arrastrar hacia la derecha tiene que mover la fila hacia la
        // derecha (el objeto "sigue" al dedo) — por eso se resta acá (ver
        // el signo de `rowX` en animate(), más abajo).
        carouselIndexRef.current -= deltaLogical
        dragVelocity = -deltaLogical
      }
      function onRowPointerUp(e: PointerEvent) {
        if (!isRowDragging) return
        isRowDragging = false
        dragAxisLocked = null
        canvas.style.cursor = 'grab'
        try {
          canvas.releasePointerCapture(e.pointerId)
        } catch {
          // el pointer ya pudo haberse liberado solo (ej. pointercancel)
        }
      }
      canvas.addEventListener('pointerdown', onRowPointerDown)
      canvas.addEventListener('pointermove', onRowPointerMove)
      window.addEventListener('pointerup', onRowPointerUp)
      window.addEventListener('pointercancel', onRowPointerUp)
      cleanupFns.push(() => {
        canvas.removeEventListener('pointerdown', onRowPointerDown)
        canvas.removeEventListener('pointermove', onRowPointerMove)
        window.removeEventListener('pointerup', onRowPointerUp)
        window.removeEventListener('pointercancel', onRowPointerUp)
      })
      // 'none': acá NO hay scroll real de página que dejarle al navegador
      // (el cambio de toma es 100% virtual, vía `goNextFrame`/`goPrevFrame`
      // — ver `onTouchStart`/`onTouchEnd` más arriba) — con "pan-y" puesto,
      // el navegador intentaba hacer SU PROPIO paneo vertical nativo al
      // mismo tiempo que este JS cambiaba de toma con el swipe vertical, y
      // esa pelea (encima dentro de un contenedor `fixed`, que no tiene a
      // dónde "paneear" de verdad) se sentía como que la página se quedaba
      // trabada. Con "none" el navegador no toca nada — todo el gesto
      // táctil (para cambiar de toma o para arrastrar el carrusel) queda
      // 100% en manos de este JS.
      canvas.style.touchAction = 'none'

      // Cuántas veces se repite cada producto a los costados para el
      // "loop infinito" de la fila (ver comentario de `cloneLogicalIndex`
      // más arriba) — con esto, 2*SIDE_REPEATS+1 "sets" completos de todos
      // los productos, así siempre hay de sobra para llenar la pantalla
      // sin huecos, sea cual sea la cantidad real de productos.
      const SIDE_REPEATS = 3

      // Paso 7.8: cargar el .glb y crear VARIAS COPIAS por producto (una
      // por "set" repetido), cada una con su propio material — pero
      // reusando las mismas texturas cargadas (una vez por producto, no
      // una vez por copia). Todas visibles a la vez en fila (la toma
      // general). No se crean copias extra por sección: cada sección solo
      // mueve/rota/escala la copia ACTIVA de su producto.
      gltfLoader.load(
        modelUrl,
        (gltf) => {
          if (disposed) return
          const base = gltf.scene
          templateSize = new THREE.Box3().setFromObject(base).getSize(new THREE.Vector3())

          designs.forEach((design, designIndex) => {
            // Texturas cacheadas UNA vez por producto — se comparten entre
            // todas sus copias repetidas (no tiene sentido recargar la
            // misma imagen 2*SIDE_REPEATS+1 veces).
            const mapTex = loadTexture(design.baseColorUrl, true)
            const normalTex = loadTexture(design.normalMapUrl)
            const aoTex = loadTexture(design.aoMapUrl)
            const specularTex = loadTexture(design.specularMapUrl)

            for (let setIndex = 0; setIndex < SIDE_REPEATS * 2 + 1; setIndex++) {
            const clone = base.clone(true)
            clone.visible = true

            // Un único material por COPIA (no por producto) — cada copia
            // repetida necesita poder oscurecerse de forma independiente
            // (ver `isActive` en animate()), aunque comparta textura con
            // sus hermanas. MeshPhongMaterial porque es el material de
            // three.js con specularMap nativo.
            const material = new THREE.MeshPhongMaterial({
              map: mapTex,
              normalMap: normalTex,
              aoMap: aoTex,
              specularMap: specularTex,
              // transparent+opacity animados en animate(): la copia no
              // activa se ve atenuada (o invisible, en modo sección).
              transparent: true,
              opacity: 1,
            })

            // Sombra + sombra parcial se aplican por-píxel con un parche
            // de shader (no alcanza con tintar `material.color`, porque
            // acá el efecto tiene que variar según el punto de la
            // superficie). `uShadowAmount` oscurece TODO el objeto — y
            // `uClearCenter/uClearHalfSize/uClearStrength/uClearRotInv`
            // definen una zona (en espacio MUNDO, para que coincida con
            // cómo se ubica con X/Y/Z relativo a la posición animada del
            // objeto — ver animate()) donde esa sombra se recorta/revierte.
            // `uClearHalfSize` sirve para las 3 formas: esfera/cubo usan el
            // mismo valor en los 3 ejes (el "Alcance"), rectángulo usa
            // ancho/alto/profundidad independientes. Todo se actualiza
            // cuadro a cuadro leyendo `material.userData.shader` (three.js
            // solo entrega esta referencia una vez, al compilar).
            material.onBeforeCompile = (shader) => {
              shader.uniforms.uShadowAmount = { value: 0 }
              shader.uniforms.uClearCenter = { value: new THREE.Vector3() }
              shader.uniforms.uClearHalfSize = { value: new THREE.Vector3(1, 1, 1) }
              shader.uniforms.uClearStrength = { value: 0 }
              // 0 = esfera, 1 = cubo/rectángulo — interpolado con `mix()`
              // así que también acepta valores intermedios (morph suave
              // entre formas al cambiar de sección, ver animate()).
              shader.uniforms.uClearShape = { value: 0 }
              // Rotación de la zona (mundo → local de la zona). Se pasa ya
              // INVERTIDA desde JS (ver animate()) — así el shader solo
              // tiene que multiplicar, sin invertir matrices acá.
              shader.uniforms.uClearRotInv = { value: new THREE.Matrix3() }
              shader.vertexShader = shader.vertexShader
                .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPos;')
                .replace(
                  '#include <begin_vertex>',
                  '#include <begin_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;',
                )
              shader.fragmentShader = shader.fragmentShader
                .replace(
                  '#include <common>',
                  '#include <common>\nvarying vec3 vWorldPos;\nuniform float uShadowAmount;\nuniform vec3 uClearCenter;\nuniform vec3 uClearHalfSize;\nuniform float uClearStrength;\nuniform float uClearShape;\nuniform mat3 uClearRotInv;',
                )
                .replace(
                  '#include <map_fragment>',
                  `#include <map_fragment>
          vec3 worldDelta = vWorldPos - uClearCenter;
          vec3 hs = max(uClearHalfSize, vec3(0.0001));
          // Esfera: no importa la rotación (es simétrica), así que usa la
          // distancia mundo directo, normalizada por hs.x (uniforme acá).
          float distSphere = length(worldDelta) / hs.x;
          // Cubo/rectángulo: rota el punto al espacio LOCAL de la zona
          // antes de medir por eje — así la caja puede quedar inclinada.
          vec3 localDelta = uClearRotInv * worldDelta;
          vec3 boxDist = abs(localDelta) / hs;
          float distBox = max(boxDist.x, max(boxDist.y, boxDist.z));
          float distToClear = mix(distSphere, distBox, uClearShape);
          float clearFactor = 1.0 - smoothstep(0.0, 1.0, distToClear);
          float localShadow = uShadowAmount * (1.0 - clearFactor * uClearStrength);
          diffuseColor.rgb *= (1.0 - localShadow);`,
                )
              material.userData.shader = shader
            }
            // Estado propio que se interpola cuadro a cuadro (ver
            // animate()) antes de subirlo a los uniforms de arriba.
            material.userData.shadowState = {
              amount: 0,
              clearHalfX: 0,
              clearHalfY: 0,
              clearHalfZ: 0,
              clearStrength: 0,
              clearShape: 0,
              clearX: 0,
              clearY: 0,
              clearZ: 0,
              clearRotX: 0,
              clearRotY: 0,
              clearRotZ: 0,
            }

            materials.push(material)

            clone.traverse((child) => {
              const mesh = child as any
              if (!mesh.isMesh) return
              // Si el .glb no trae normales calculadas (pasa con algunos
              // modelos exportados sin ese dato — ej. el clásico
              // Flamingo.glb de los ejemplos de three.js), la luz no tiene
              // cómo saber hacia dónde "mira" cada cara y el modelo entero
              // se ve negro sin importar cuánta luz le pongas. Si faltan,
              // se calculan acá mismo a partir de la geometría.
              if (mesh.geometry && !mesh.geometry.attributes.normal) {
                mesh.geometry.computeVertexNormals()
              }
              // aoMap requiere un segundo canal UV — si el modelo no lo
              // trae, reusamos el UV principal para que se aplique igual.
              if (material.aoMap && mesh.geometry?.attributes.uv && !mesh.geometry.attributes.uv2) {
                mesh.geometry.setAttribute('uv2', mesh.geometry.attributes.uv)
              }
              mesh.material = material
            })

            scene.add(clone)
            clones.push(clone)
            cloneLogicalIndex.push((setIndex - SIDE_REPEATS) * designs.length + designIndex)
            cloneDesignIndex.push(designIndex)
            }
          })

          // Al cargar, la cámara se pone directo a la distancia configurada
          // (`cameraDistance`, la prop) — a propósito NO se calcula un
          // encuadre automático en base a la escala/cantidad de productos,
          // para que "Escala del modelo" tenga un efecto visible real. Si
          // hace falta un punto de partida razonable, está el botón
          // "Encuadrar cámara" del panel de debug (ajuste manual, on-demand).
          applyLayout(modelScale, modelGap, modelPositionY)
          controls.target.set(0, modelPositionY, 0)
          setCameraDistance(cameraDistance)

          if (GUI) {
            setupDebugPanel()
          }
        },
        undefined,
        (err) => console.error('[Product3DViewer] error cargando .glb:', err),
      )

      // Paso 7.9: panel de debug (lil-gui) — controles en pantalla para
      // tunear el visor en vivo sin recargar el modelo.
      function setupDebugPanel() {
        const debugParams = {
          cameraDistance,
          modelScale,
          modelPositionY,
          modelGap,
          autoRotate,
          autoRotateSpeed,
          enableDrag,
        }

        const gui = new GUI({ container, title: 'Debug · Visor 3D', width: 260 })
        Object.assign(gui.domElement.style, {
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: '30',
          maxHeight: 'calc(100% - 16px)',
          overflowY: 'auto',
        })

        // Carpeta "Cámara": mover la cámara manualmente.
        const camFolder = gui.addFolder('Cámara')
        camFolder
          .add(debugParams, 'cameraDistance', 1, 30, 0.1)
          .name('Distancia')
          .onChange((v: number) => setCameraDistance(v))

        // Carpeta "Modelo": escala, altura y espacio entre copias (toma
        // general). A propósito NO mueven la cámara — solo reposicionan/
        // reescalan las copias (applyLayout), así "Escala" se nota de
        // verdad en pantalla en vez de que la cámara se aleje sola y
        // cancele el cambio. Si el encuadre queda mal, está el botón
        // "Encuadrar cámara" para ajustarlo a mano cuando se necesite.
        const modelFolder = gui.addFolder('Modelo')
        modelFolder
          .add(debugParams, 'modelScale', 0.01, 5, 0.01)
          .name('Escala')
          .onChange((v: number) => applyLayout(v, debugParams.modelGap, debugParams.modelPositionY))
        modelFolder
          .add(debugParams, 'modelPositionY', -2, 2, 0.01)
          .name('Pos. Y')
          .onChange((v: number) => {
            applyLayout(debugParams.modelScale, debugParams.modelGap, v)
            // Esta sí re-apunta la cámara (no la aleja/acerca) para que el
            // objeto no se te vaya de cuadro al subir/bajarlo.
            controls.target.set(0, v, 0)
            controls.update()
          })
        modelFolder
          .add(debugParams, 'modelGap', 0, 3, 0.01)
          .name('Espacio entre copias')
          .onChange((v: number) => applyLayout(debugParams.modelScale, v, debugParams.modelPositionY))
        modelFolder
          .add(
            {
              fit: () => {
                controls.target.set(0, debugParams.modelPositionY, 0)
                setCameraDistance(fitCameraDistance(debugParams.modelScale, debugParams.modelGap, 0.01))
              },
            },
            'fit',
          )
          .name('Encuadrar cámara')

        // Carpeta "Interacción".
        const interFolder = gui.addFolder('Interacción')
        interFolder
          .add(debugParams, 'autoRotate')
          .name('Autorotar')
          .onChange((v: boolean) => {
            controls.autoRotate = v
          })
        interFolder
          .add(debugParams, 'autoRotateSpeed', 0, 10, 0.1)
          .name('Vel. rotación')
          .onChange((v: number) => {
            controls.autoRotateSpeed = v
          })
        interFolder
          .add(debugParams, 'enableDrag')
          .name('Permitir arrastrar')
          .onChange((v: boolean) => {
            controls.enabled = v
          })

        // Carpeta "Iluminación": permite tocar la sombra y la sombra
        // parcial (ver product3d-section.tsx) directo desde acá, sin
        // depender de tener una sección real activa — pensada para poder
        // ubicar la zona a ojo antes de cargar los valores en Weaverse
        // Studio. "Vista previa" pisa (solo en pantalla) los datos reales
        // de la sección mientras esté prendida; "Mostrar zona sin sombra"
        // dibuja una esfera de alambre justo donde y de qué tamaño es esa
        // zona (NO es una luz — no ilumina, solo aparta la sombra).
        const lightFolder = gui.addFolder('Iluminación')
        lightFolder.add(lightPreview, 'enabled').name('Vista previa (forzar)')
        lightFolder.add(lightPreview, 'shadowIntensity', 0, 100, 1).name('Sombra (%)')
        lightFolder.add(lightPreview, 'shadowClearEnabled').name('Sombra parcial activa')
        lightFolder.add(lightPreview, 'shadowClearStrength', 0, 100, 1).name('Fuerza (%)')
        const clearRadiusCtrl = lightFolder.add(lightPreview, 'shadowClearRadius', -100, 100, 0.01).name('Alcance')
        const clearSizeXCtrl = lightFolder.add(lightPreview, 'shadowClearSizeX', 0.1, 4, 0.05).name('Ancho (X)')
        const clearSizeYCtrl = lightFolder.add(lightPreview, 'shadowClearSizeY', 0.1, 4, 0.05).name('Alto (Y)')
        const clearSizeZCtrl = lightFolder.add(lightPreview, 'shadowClearSizeZ', 0.1, 4, 0.05).name('Profundidad (Z)')
        const syncClearShapeCtrls = () => {
          const isRect = lightPreview.shadowClearShape === 'rect'
          isRect ? clearRadiusCtrl.hide() : clearRadiusCtrl.show()
          isRect ? clearSizeXCtrl.show() : clearSizeXCtrl.hide()
          isRect ? clearSizeYCtrl.show() : clearSizeYCtrl.hide()
          isRect ? clearSizeZCtrl.show() : clearSizeZCtrl.hide()
        }
        lightFolder
          .add(lightPreview, 'shadowClearShape', ['sphere', 'box', 'rect'])
          .name('Forma')
          .onChange(syncClearShapeCtrls)
        syncClearShapeCtrls()
        lightFolder.add(lightPreview, 'shadowClearX', -100, 100, 0.01).name('Pos. X')
        lightFolder.add(lightPreview, 'shadowClearY', -100, 100, 0.01).name('Pos. Y')
        lightFolder.add(lightPreview, 'shadowClearZ', -100, 100, 0.01).name('Pos. Z')
        lightFolder.add(lightPreview, 'shadowClearRotationX', -180, 180, 1).name('Rotación X (°)')
        lightFolder.add(lightPreview, 'shadowClearRotationY', -180, 180, 1).name('Rotación Y (°)')
        lightFolder.add(lightPreview, 'shadowClearRotationZ', -180, 180, 1).name('Rotación Z (°)')
        lightFolder
          .add({ gizmo: showClearZoneGizmo }, 'gizmo')
          .name('Mostrar zona sin sombra')
          .onChange((v: boolean) => {
            showClearZoneGizmo = v
          })
        lightFolder.open()

        // Navegación — frame a frame (anterior/siguiente) o directo a la
        // toma general de un producto por nombre.
        const navFolder = gui.addFolder('Navegación')
        navFolder.add({ anterior: () => goPrevFrame() }, 'anterior').name('◀ Frame anterior')
        navFolder.add({ siguiente: () => goNextFrame() }, 'siguiente').name('Frame siguiente ▶')
        if (designs.length > 1) {
          const names = designs.map((d) => d.title)
          const selector = { producto: designs[activeIndexRef.current]?.title ?? names[0] }
          navFolder
            .add(selector, 'producto', names)
            .name('Ir a producto')
            .onChange((title: string) => {
              const idx = designs.findIndex((d) => d.title === title)
              if (idx >= 0) selectProduct(idx)
            })
        }
        navFolder.open()

        // Carpeta "Info": diagnóstico — cuántos hijos "Producto 3D" hay en
        // total, cuántas secciones suman entre todos, y cuáles no tienen
        // su imagen de color base cargada.
        const totalSections = designs.reduce((sum, d) => sum + d.sections.length, 0)
        const infoFolder = gui.addFolder('Info')
        const infoParams = {
          productos: designs.length,
          secciones: totalSections,
          totalFrames: designs.length + totalSections,
          sinMaterial: missingTitles.length ? missingTitles.join(', ') : '—',
          modelUrl: modelUrl ?? '—',
        }
        infoFolder.add(infoParams, 'productos').disable()
        infoFolder.add(infoParams, 'secciones').disable()
        infoFolder.add(infoParams, 'totalFrames').name('Total frames').disable()
        infoFolder.add(infoParams, 'sinMaterial').name('Sin color base').disable()
        infoFolder.add(infoParams, 'modelUrl').disable()
        if (missingTitles.length > 0) infoFolder.open()
        else infoFolder.close()

        camFolder.open()
        modelFolder.open()
        interFolder.open()

        cleanupFns.push(() => gui.destroy())
      }

      // Paso 7.10: el loop de animación. Se ejecuta ~60 veces por segundo:
      //   1. si estamos en la toma general (sin sección activa): la copia
      //      activa se agranda, se ilumina más y se desliza al centro; el
      //      resto se atenúa y se reordena a los lados — igual que antes.
      //   2. si hay una SECCIÓN activa: la copia activa se anima hasta la
      //      posición/rotación/escala que definió esa sección, y el resto
      //      de las copias se desvanece del todo (opacidad a 0) — "el
      //      resto desaparece de pantalla".
      //   3. actualiza OrbitControls y dibuja el frame.
      // Todo interpolado suavemente (THREE.MathUtils.lerp) para que cada
      // cambio se vea como una transición, no como un salto.
      // Objetos reutilizables para no crear basura nueva cada frame — solo
      // se usan para convertir la rotación (Euler) de la "zona sin sombra"
      // en la matriz INVERSA que necesita el shader (ver más abajo).
      const clearRotEuler = new THREE.Euler()
      const clearRotMatrix4 = new THREE.Matrix4()
      const clearRotMatrix3 = new THREE.Matrix3()
      function animate() {
        raf = requestAnimationFrame(animate)

        // La toma "carrusel" puede prenderse/apagarse sin reconstruir la
        // escena (navegando de toma en toma) — por eso se revisa en vivo,
        // cuadro a cuadro, en vez de una sola vez al armar la escena.
        controls.enabled = dragCarouselModeRef.current ? false : enableDrag
        if (dragCarouselModeRef.current && !wasCarouselActive) {
          // Se ACABA de entrar a la toma "carrusel" — el carrusel propio
          // arranca desde donde esté el producto activo en este momento,
          // para que la transición se sienta continua. A partir de acá el
          // arrastre solo mueve `carouselIndexRef`; la fila/navegación
          // normal (`visualIndexRef`) queda completamente intacta, así que
          // al volver a la toma anterior/siguiente todo sigue exactamente
          // donde estaba, sin importar cuánto se haya arrastrado acá.
          carouselIndexRef.current = visualIndexRef.current
          dragVelocity = 0
        }
        if (dragCarouselModeRef.current && !isRowDragging) {
          // Inercia: al soltar, la fila sigue deslizándose y frena de a
          // poco — se desactiva mientras se está arrastrando (el
          // dedo/mouse manda).
          if (dragInertiaEnabledRef.current) {
            carouselIndexRef.current += dragVelocity
            dragVelocity *= dragFrictionRef.current
            if (Math.abs(dragVelocity) < 0.0001) dragVelocity = 0
          } else {
            dragVelocity = 0
          }
        }
        if (wasCarouselActive && !dragCarouselModeRef.current && isRowDragging) {
          // Se navegó a otra toma (rueda/flechas) con el mouse/dedo
          // todavía apretado arrastrando — corta el arrastre acá en vez de
          // dejarlo "colgado" (cursor en grabbing, capture del puntero sin
          // soltar).
          isRowDragging = false
          dragVelocity = 0
        }
        wasCarouselActive = dragCarouselModeRef.current
        if (cursorModeSynced !== dragCarouselModeRef.current) {
          cursorModeSynced = dragCarouselModeRef.current
          if (!isRowDragging) canvas.style.cursor = cursorModeSynced ? 'grab' : ''
        }

        const sectionMode = activeSectionIndexRef.current !== null
        // "Modo carrusel" es técnicamente una toma más (sectionMode true —
        // tiene su propio activeSectionIndex), pero visualmente tiene que
        // comportarse como la toma general/overview: TODOS los clones
        // visibles en fila (no solo el activo), atenuados con luz los que
        // no son el centrado — es lo que arrastrás para recorrerlos.
        const showRow = !sectionMode || dragCarouselModeRef.current
        // Disparador de la entrada "desde los laterales" (solo para "Modo
        // carrusel", no para la fila general): se activa en el ÚNICO cuadro
        // en el que la fila pasa de oculta (veníamos de una toma con texto/
        // video/FAQ) a visible. Empuja las copias no activas bien afuera
        // de encuadre ESE cuadro nomás — de ahí en más el lerp normal de
        // posición (más abajo) las trae de vuelta a su lugar en la fila,
        // dando el efecto de "entran acercándose al objeto seleccionado".
        const revealFromSides = showRow && !prevShowRow && dragCarouselModeRef.current
        prevShowRow = showRow
        const activeSection = sectionMode
          ? designsRef.current[activeIndexRef.current]?.sections[activeSectionIndexRef.current as number]
          : undefined

        // El panel de debug puede forzar los valores de sombra/sombra
        // parcial (ver `lightPreview` y la carpeta "Iluminación" en
        // setupDebugPanel) — cuando está prendida la "Vista previa", se
        // usa esto en vez de los datos reales de la sección, incluso si
        // no hay ninguna sección activa. Solo afecta luz/sombra, nunca
        // posición/rotación/escala del objeto.
        const effectiveLight = lightPreview.enabled
          ? {
              shadowIntensity: lightPreview.shadowIntensity / 100,
              shadowClearEnabled: lightPreview.shadowClearEnabled,
              shadowClearStrength: lightPreview.shadowClearStrength / 100,
              shadowClearShape: lightPreview.shadowClearShape,
              shadowClearRadius: lightPreview.shadowClearRadius,
              shadowClearSizeX: lightPreview.shadowClearSizeX,
              shadowClearSizeY: lightPreview.shadowClearSizeY,
              shadowClearSizeZ: lightPreview.shadowClearSizeZ,
              shadowClearX: lightPreview.shadowClearX,
              shadowClearY: lightPreview.shadowClearY,
              shadowClearZ: lightPreview.shadowClearZ,
              shadowClearRotationX: (lightPreview.shadowClearRotationX * Math.PI) / 180,
              shadowClearRotationY: (lightPreview.shadowClearRotationY * Math.PI) / 180,
              shadowClearRotationZ: (lightPreview.shadowClearRotationZ * Math.PI) / 180,
            }
          : activeSection

        // Posición de fila "efectiva" para este cuadro: la del carrusel
        // propio mientras esa toma está activa, si no la de la navegación
        // normal — son dos posiciones independientes (ver comentario de
        // `carouselIndexRef` más arriba), esto solo elige cuál dibujar.
        const rowPos = dragCarouselModeRef.current ? carouselIndexRef.current : visualIndexRef.current
        const { spacing: activeSpacing, totalWidth: activeTotalWidth } = computeLayout(baseScale, baseGap)
        clones.forEach((clone, i) => {
          // `cloneLogicalIndex[i]` es la posición "de fila" fija de esta
          // copia (puede ser negativa o mayor a designs.length-1 — son las
          // copias repetidas para el loop infinito, ver más abajo). Activa
          // = la ÚNICA copia cuya posición lógica coincide con `rowPos` —
          // NO con `activeIndexRef` (que sí tiene wrap): tras dar la vuelta,
          // la copia que queda centrada es la del set repetido siguiente,
          // no la del set original en esa misma posición 0..N-1.
          // En "Modo carrusel" `rowPos` es un flotante continuo (arrastre
          // libre) — casi nunca va a coincidir EXACTO con un índice entero,
          // así que ahí se usa "la más cercana al centro" en vez de una
          // igualdad exacta.
          const isActive = dragCarouselModeRef.current
            ? Math.abs(cloneLogicalIndex[i] - rowPos) < 0.5
            : cloneLogicalIndex[i] === rowPos
          // En mobile, si la sección definió su propia posición/rotación/
          // escala, se usa esa en vez de la de escritorio (ver "Posición,
          // rotación y escala distinta en mobile" en product3d-section.tsx)
          // — pensado para el nuevo layout donde el texto queda anclado
          // abajo de la pantalla (ver el JSX).
          const useMobilePos = isMobileRef.current && activeSection?.mobilePositionEnabled

          const targetScale = isActive
            ? activeSection
              ? baseScale * (useMobilePos ? activeSection.scaleMultiplierMobile : activeSection.scaleMultiplier)
              : baseScale * 1.18
            : baseScale
          // Factor de lerp cuadro a cuadro para TODO el movimiento del
          // objeto (posición/rotación/escala) — configurable desde
          // "Interacción" → "Suavidad al mover el objeto". Más bajo = tarda
          // más en llegar al destino (más suave/lento), más alto = más
          // directo/rápido.
          const moveFactor = transitionSmoothnessRef.current
          clone.scale.setScalar(THREE.MathUtils.lerp(clone.scale.x, targetScale, moveFactor))

          const rowX = (cloneLogicalIndex[i] - rowPos) * activeSpacing
          const targetX = isActive && activeSection ? (useMobilePos ? activeSection.posXMobile : activeSection.posX) : rowX
          const targetY = isActive && activeSection ? (useMobilePos ? activeSection.posYMobile : activeSection.posY) : modelPositionY
          const targetZ = isActive && activeSection ? (useMobilePos ? activeSection.posZMobile : activeSection.posZ) : 0
          if (revealFromSides && !isActive) {
            // La manda bien afuera del encuadre, del mismo lado en el que
            // ya está (izquierda sigue de largo a la izquierda, derecha a
            // la derecha) — ESTE cuadro nomás, sin lerp — así el próximo
            // cuadro el lerp de acá abajo arranca desde "afuera de
            // pantalla" acercándose al objeto seleccionado, en vez de
            // aparecer ya en su lugar.
            const dir = cloneLogicalIndex[i] - rowPos >= 0 ? 1 : -1
            clone.position.x = rowX + dir * activeTotalWidth
          }
          clone.position.x = THREE.MathUtils.lerp(clone.position.x, targetX, moveFactor)
          clone.position.y = THREE.MathUtils.lerp(clone.position.y, targetY, moveFactor)
          clone.position.z = THREE.MathUtils.lerp(clone.position.z, targetZ, moveFactor)

          const targetRotationX = isActive && activeSection ? THREE.MathUtils.degToRad(useMobilePos ? activeSection.rotationXMobile : activeSection.rotationX) : 0
          const targetRotationY = isActive && activeSection ? THREE.MathUtils.degToRad(useMobilePos ? activeSection.rotationYMobile : activeSection.rotationY) : 0
          const targetRotationZ = isActive && activeSection ? THREE.MathUtils.degToRad(useMobilePos ? activeSection.rotationZMobile : activeSection.rotationZ) : 0
          clone.rotation.x = THREE.MathUtils.lerp(clone.rotation.x, targetRotationX, moveFactor)
          clone.rotation.y = THREE.MathUtils.lerp(clone.rotation.y, targetRotationY, moveFactor)
          clone.rotation.z = THREE.MathUtils.lerp(clone.rotation.z, targetRotationZ, moveFactor)

          const material = materials[i]
          if (material) {
            // En la fila (toma general o "Modo carrusel" — ver `showRow`),
            // todas las copias quedan opacas — la que NO está activa ya no
            // se atenúa con transparencia, se "apaga" con luz (ver `rowDim`
            // más abajo), igual que la sombra que ya usan las secciones. En
            // el resto de las tomas (con texto/video/FAQ) sí sigue
            // desapareciendo del todo (opacity 0) — ahí no tiene sentido
            // dejarla ver oscurecida, tiene que sacarse de encima.
            const targetOpacity = showRow ? 1 : isActive ? 1 : 0
            // En la entrada "desde los laterales" del carrusel no hay
            // desvanecido — la copia ya arranca 100% opaca (lo que se ve
            // "aparecer" es el desplazamiento de `revealFromSides`, más
            // arriba, no un fade de transparencia).
            material.opacity = revealFromSides ? 1 : THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.15)

            // "Sombra sobre el objeto" + "sombra parcial" + "apagado de
            // fila": se aplican por-píxel en el shader propio de este
            // material (ver `onBeforeCompile` más arriba) — acá solo
            // interpolamos los valores objetivo y se los subimos a sus
            // uniforms cuadro a cuadro.
            const shader = material.userData.shader
            if (shader) {
              const wantsShadow = isActive && effectiveLight
              // En la fila (`showRow`), las copias no activas se oscurecen
              // con el mismo mecanismo — regulable con "inactiveDimIntensity"
              // (ver el input en la sección "Interacción" del visor), salvo
              // en "Modo carrusel": ahí cada carrusel tiene su propio
              // "Apagado de las copias no seleccionadas" (ver
              // product3d-carousel.tsx), que pisa al general mientras esa
              // toma está activa.
              const rowDimPct =
                dragCarouselModeRef.current && activeSection
                  ? activeSection.carouselSideShadowIntensity
                  : inactiveDimIntensityRef.current
              const rowDim = showRow && !isActive ? rowDimPct / 100 : 0
              const wantsClear = isActive && effectiveLight?.shadowClearEnabled
              const isRect = wantsClear && effectiveLight.shadowClearShape === 'rect'
              const targetAmount = wantsShadow ? effectiveLight.shadowIntensity : rowDim
              const targetClearStrength = wantsClear ? effectiveLight.shadowClearStrength : 0
              const targetClearShape = wantsClear && effectiveLight.shadowClearShape !== 'sphere' ? 1 : 0
              // Esfera/cubo usan "Alcance" (mismo valor en los 3 ejes);
              // rectángulo usa ancho/alto/profundidad independientes.
              const targetHalfX = wantsClear ? (isRect ? effectiveLight.shadowClearSizeX : effectiveLight.shadowClearRadius) : 0
              const targetHalfY = wantsClear ? (isRect ? effectiveLight.shadowClearSizeY : effectiveLight.shadowClearRadius) : 0
              const targetHalfZ = wantsClear ? (isRect ? effectiveLight.shadowClearSizeZ : effectiveLight.shadowClearRadius) : 0
              const targetClearX = clone.position.x + (wantsShadow ? effectiveLight.shadowClearX : 0)
              const targetClearY = clone.position.y + (wantsShadow ? effectiveLight.shadowClearY : 0)
              const targetClearZ = clone.position.z + (wantsShadow ? effectiveLight.shadowClearZ : 0)
              const targetRotX = wantsClear ? effectiveLight.shadowClearRotationX : 0
              const targetRotY = wantsClear ? effectiveLight.shadowClearRotationY : 0
              const targetRotZ = wantsClear ? effectiveLight.shadowClearRotationZ : 0

              const state = material.userData.shadowState
              state.amount = THREE.MathUtils.lerp(state.amount, targetAmount, 0.12)
              state.clearHalfX = THREE.MathUtils.lerp(state.clearHalfX, targetHalfX, 0.12)
              state.clearHalfY = THREE.MathUtils.lerp(state.clearHalfY, targetHalfY, 0.12)
              state.clearHalfZ = THREE.MathUtils.lerp(state.clearHalfZ, targetHalfZ, 0.12)
              state.clearStrength = THREE.MathUtils.lerp(state.clearStrength, targetClearStrength, 0.12)
              state.clearShape = THREE.MathUtils.lerp(state.clearShape, targetClearShape, 0.12)
              state.clearX = THREE.MathUtils.lerp(state.clearX, targetClearX, 0.12)
              state.clearY = THREE.MathUtils.lerp(state.clearY, targetClearY, 0.12)
              state.clearZ = THREE.MathUtils.lerp(state.clearZ, targetClearZ, 0.12)
              state.clearRotX = THREE.MathUtils.lerp(state.clearRotX, targetRotX, 0.12)
              state.clearRotY = THREE.MathUtils.lerp(state.clearRotY, targetRotY, 0.12)
              state.clearRotZ = THREE.MathUtils.lerp(state.clearRotZ, targetRotZ, 0.12)

              shader.uniforms.uShadowAmount.value = state.amount
              shader.uniforms.uClearHalfSize.value.set(state.clearHalfX, state.clearHalfY, state.clearHalfZ)
              shader.uniforms.uClearStrength.value = state.clearStrength
              shader.uniforms.uClearShape.value = state.clearShape
              shader.uniforms.uClearCenter.value.set(state.clearX, state.clearY, state.clearZ)
              // La zona gira igual que un objeto normal (mismo orden de
              // ejes 'XYZ') — el shader necesita la INVERSA (mundo→local
              // de la zona), que para una rotación pura es su transpuesta.
              clearRotEuler.set(state.clearRotX, state.clearRotY, state.clearRotZ, 'XYZ')
              clearRotMatrix4.makeRotationFromEuler(clearRotEuler)
              clearRotMatrix3.setFromMatrix4(clearRotMatrix4).transpose()
              shader.uniforms.uClearRotInv.value.copy(clearRotMatrix3)
            }
          }
        })

        // La luz extra solo tiene sentido en la fila (`showRow` — resaltar
        // la activa entre varias visibles) — en el resto de las tomas el
        // resto ya desapareció, así que se apaga sola. Con el loop
        // infinito, `clones` ya no está indexado por producto — hay que
        // buscar la copia cuya posición lógica coincide con `rowPos` (ver
        // comentario de `isActive`, más arriba).
        // En "Modo carrusel" `rowPos` es un flotante que cambia todo el
        // tiempo arrastrando — casi nunca coincide EXACTO con un índice
        // entero, así que acá también se busca "la más cercana" (mismo
        // umbral que `isActive`) en vez de una igualdad exacta.
        const activeCloneIdx = dragCarouselModeRef.current
          ? cloneLogicalIndex.findIndex((v) => Math.abs(v - rowPos) < 0.5)
          : cloneLogicalIndex.indexOf(rowPos)
        const activeClone = activeCloneIdx >= 0 ? clones[activeCloneIdx] : undefined
        if (activeClone && showRow) {
          const camDist = camera.position.distanceTo(controls.target)
          highlightLight.position.set(
            activeClone.position.x,
            activeClone.position.y + camDist * 0.25,
            activeClone.position.z + camDist * 0.35,
          )
          highlightLight.distance = Math.max(camDist * 1.5, 5)
          highlightLight.intensity = THREE.MathUtils.lerp(highlightLight.intensity, 2.2, 0.15)
        } else {
          highlightLight.intensity = THREE.MathUtils.lerp(highlightLight.intensity, 0, 0.15)
        }

        // Marcador de debug: muestra dónde y qué tan grande es la zona
        // sin sombra de la copia activa (si "Mostrar zona sin sombra"
        // está prendido en el panel). No afecta el render real — ese
        // efecto ya se aplicó arriba, por shader.
        const clearTarget = effectiveLight?.shadowClearEnabled ? effectiveLight : null
        clearZoneHelper.visible = showClearZoneGizmo && !!activeClone && !!clearTarget
        if (activeClone && clearTarget) {
          clearZoneHelper.position.set(
            activeClone.position.x + clearTarget.shadowClearX,
            activeClone.position.y + clearTarget.shadowClearY,
            activeClone.position.z + clearTarget.shadowClearZ,
          )
          clearZoneHelper.rotation.set(clearTarget.shadowClearRotationX, clearTarget.shadowClearRotationY, clearTarget.shadowClearRotationZ)
          const isRect = clearTarget.shadowClearShape === 'rect'
          const isBoxLike = isRect || clearTarget.shadowClearShape === 'box'
          if (isRect) {
            clearZoneHelper.scale.set(clearTarget.shadowClearSizeX, clearTarget.shadowClearSizeY, clearTarget.shadowClearSizeZ)
          } else {
            clearZoneHelper.scale.setScalar(Math.max(clearTarget.shadowClearRadius, 0.01))
          }
          const targetGeo = isBoxLike ? clearZoneBoxGeo : clearZoneSphereGeo
          if (clearZoneHelper.geometry !== targetGeo) clearZoneHelper.geometry = targetGeo
        }

        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      // Paso 7.11: limpieza — three.js no libera memoria de GPU solo.
      cleanupFns.push(() => {
        cancelAnimationFrame(raf)
        controls.dispose()
        clearZoneSphereGeo.dispose()
        clearZoneBoxGeo.dispose()
        ;(clearZoneHelper.material as import('three').Material).dispose()
        clones.forEach((clone) => {
          clone.traverse((child) => {
            const mesh = child as any
            if (mesh.isMesh) mesh.geometry?.dispose()
          })
        })
        materials.forEach((material) => {
          material.map?.dispose()
          material.normalMap?.dispose()
          material.aoMap?.dispose()
          material.specularMap?.dispose()
          material.dispose()
        })
        renderer.dispose()
      })
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      cleanupFns.forEach((fn) => fn())
    }
    // designsKey (no `designs`) es intencional — ver el comentario donde se
    // define más arriba: solo las URLs de textura ameritan reconstruir la
    // escena; el texto y las posiciones de sección se leen en vivo desde
    // `designsRef` dentro de animate(), sin necesidad de recargar el .glb.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // dragCarouselMode/dragSensitivity/dragInertiaEnabled/dragFriction NO
    // están acá a propósito — cambian de valor cada vez que la toma activa
    // entra/sale de kind 'carousel', y eso no tiene que reconstruir la
    // escena 3D entera (se leen en vivo vía ref, ver más arriba).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl, designsKey, modelScale, modelPositionY, modelGap, cameraDistance, autoRotate, autoRotateSpeed, enableDrag, showDebugPanel])

  // Paso 8: el JSX — el <canvas> centrado, el título (de la toma general o
  // de la sección activa), la barra + flechas de navegación, y los
  // mensajes de estado.
  return (
    <div
      ref={containerRef}
      // fixed + inset-0: el visor ocupa toda la pantalla y queda "clavado"
      // ahí (no se mueve con el scroll de la página) — el scroll, en vez
      // de desplazar la página, avanza frames (ver paso 6). Al llegar al
      // último frame, seguir bajando da la vuelta al primero (loop); en el
      // primer frame, subir sí deja pasar el scroll normal de la página.
      // z-10 (no z-40): tiene que quedar POR DEBAJO del header (z-15,
      // ver header.tsx) para que el menú/logo se sigan viendo arriba del
      // visor — sigue tapando el contenido normal de la página igual que
      // antes, porque cualquier elemento `fixed` ya pinta por encima del
      // flujo normal sin necesidad de un z-index alto.
      className={cn('fixed inset-0 z-10 flex flex-col items-center justify-center overflow-hidden', clName)}
    >
      {/* Capas de fondo apiladas (crossfade) — van DETRÁS del <canvas> por
          orden en el DOM, no por z-index. La primera capa se ve de
          entrada sin animar; cada capa nueva que se agrega (al cambiar de
          sección) hace fade-in por encima de la anterior. Si hay blur
          (bgBlur > 0), se escala un poco de más — sin eso, el blur puede
          asomar un borde raro en los bordes de la pantalla; el contenedor
          raíz ya tiene overflow-hidden así que ese excedente no se ve. */}
      {bgLayers.map((layer, i) => (
        <div
          key={layer.key}
          className={cn('absolute inset-0', i > 0 && 'animate-fade-in')}
          style={{
            background: layer.value,
            filter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
            transform: bgBlur > 0 ? 'scale(1.15)' : undefined,
            animationDuration: i > 0 ? '700ms' : undefined,
          }}
        />
      ))}

      {/* Video de fondo + frase gigante — solo mientras la toma activa es
          de tipo 'video' (product3d-video.tsx). Va ANTES del <canvas> en
          el DOM (como bgLayers) y sin z-index propio, así queda DETRÁS del
          objeto 3D — el canvas es transparente, así que se ve alrededor
          del objeto, igual que la referencia de ciaoenergy. */}
      {activeSection?.kind === 'video' && (
        <div key={activeSection.id} className="animate-fade-in absolute inset-0" style={{ animationDuration: '500ms' }}>
          {activeSection.bgVideoUrl && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: activeSection.bgVideoBlur > 0 ? `blur(${activeSection.bgVideoBlur}px)` : undefined,
                transform: activeSection.bgVideoBlur > 0 ? 'scale(1.15)' : undefined,
              }}
              muted
              loop
              autoPlay
              playsInline
              preload="auto"
              poster={activeSection.bgVideoPosterUrl || undefined}
            >
              <source src={activeSection.bgVideoUrl} type="video/webm" />
              <source src={activeSection.bgVideoUrl} type="video/mp4" />
            </video>
          )}
          {activeSection.phraseText && (
            <div
              className={cn(
                'pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center uppercase',
                activeSection.phraseTextAlign === 'left' && 'justify-start text-left',
                activeSection.phraseTextAlign === 'right' && 'justify-end text-right',
              )}
            >
              {/* Duplicado desenfocado detrás — efecto de resplandor/glow,
                  igual idea que `argument_svg-blur` en la referencia. */}
              {activeSection.phraseGlowBlur > 0 && (
                <h2
                  aria-hidden="true"
                  className="absolute font-black"
                  style={{
                    color: activeSection.phraseColor,
                    fontWeight: activeSection.phraseWeight,
                    fontSize: isMobile
                      ? activeSection.phraseFontSizeMobile || activeSection.phraseFontSizeDesktop || undefined
                      : activeSection.phraseFontSizeDesktop || activeSection.phraseFontSizeMobile || undefined,
                    letterSpacing: activeSection.phraseLetterSpacing ? `${activeSection.phraseLetterSpacing}px` : undefined,
                    lineHeight: activeSection.phraseLineHeight > 0 ? activeSection.phraseLineHeight : undefined,
                    fontFamily: activeSection.phraseFontFamily || undefined,
                    whiteSpace: 'pre-line',
                    filter: `blur(${activeSection.phraseGlowBlur}px)`,
                    opacity: activeSection.phraseGlowOpacity,
                  }}
                >
                  {activeSection.phraseText}
                </h2>
              )}
              <h2
                className="relative font-black"
                style={{
                  color: activeSection.phraseColor,
                  fontWeight: activeSection.phraseWeight,
                  fontSize: isMobile
                    ? activeSection.phraseFontSizeMobile || activeSection.phraseFontSizeDesktop || undefined
                    : activeSection.phraseFontSizeDesktop || activeSection.phraseFontSizeMobile || undefined,
                  letterSpacing: activeSection.phraseLetterSpacing ? `${activeSection.phraseLetterSpacing}px` : undefined,
                  lineHeight: activeSection.phraseLineHeight > 0 ? activeSection.phraseLineHeight : undefined,
                  fontFamily: activeSection.phraseFontFamily || undefined,
                  whiteSpace: 'pre-line',
                }}
              >
                {activeSection.phraseText}
              </h2>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* Viñeta: dos degradés fijos pegados arriba y abajo de toda la
          pantalla (no se mueven con el scroll ni cambian por sección, a
          diferencia del fondo) — oscurecen el borde para que el texto/menú
          se lean mejor encima, igual que en la referencia de ciaoenergy.
          Van arriba del canvas pero debajo del texto (z-10), y
          pointer-events-none para no bloquear clics/scroll. */}
      {topShadowEnabled && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[5]"
          style={{ height: `${topShadowHeight}px`, background: `linear-gradient(to bottom, ${topShadowColor}, transparent)` }}
        />
      )}
      {bottomShadowEnabled && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5]"
          style={{ height: `${bottomShadowHeight}px`, background: `linear-gradient(to top, ${bottomShadowColor}, transparent)` }}
        />
      )}

      {/* Título de la toma GENERAL — grande, en mayúsculas y bien bold,
          abajo del objeto. Se oculta apenas hay una sección activa (esa
          tiene su propio bloque de texto, más abajo) y también en "Modo
          carrusel" (ahí es puro escaparate, sin texto). */}
      {active && !activeSection && !dragCarouselMode && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 flex flex-col items-center px-6 text-center md:bottom-36">
          <h3
            key={`title-${active.id}`}
            className="animate-drop-in text-4xl leading-[0.9] font-black tracking-tight text-white uppercase md:text-6xl"
          >
            {active.title}
          </h3>
          {active.description && (
            <p
              key={`desc-${active.id}`}
              className="animate-drop-in mt-3 max-w-md text-sm text-white/70 md:text-base"
              style={{ animationDelay: '120ms' }}
            >
              {active.description}
            </p>
          )}
        </div>
      )}

      {/* Texto de la SECCIÓN activa — reemplaza al de arriba mientras el
          objeto está en la posición que definió esa sección. En ESCRITORIO
          va centrado verticalmente y pegado al costado (izquierda/centro/
          derecha, según lo que se eligió en su editor) — igual que
          siempre. En MOBILE, en cambio, va SIEMPRE anclado abajo de la
          pantalla y a todo el ancho (el "textAlign" ahí solo alinea el
          texto, no lo pega a un costado) — la referencia de ciaoenergy en
          mobile lo muestra así. Solo para kind 'section' — 'video' ya tiene
          su propia frase (bloque de más arriba) y 'faq' su propio
          encabezado + acordeón (bloque de más abajo). */}
      {activeSection && activeSection.kind === 'section' && (
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-24 z-10 flex max-w-none flex-col px-6',
            'md:inset-x-auto md:top-1/2 md:bottom-auto md:max-w-sm md:-translate-y-1/2',
            activeSection.textAlign === 'left' && 'items-start text-left md:left-16',
            activeSection.textAlign === 'right' && 'items-end text-right md:right-16',
            activeSection.textAlign === 'center' && 'items-center text-center md:inset-x-0',
          )}
        >
          {/* Etiqueta/badge chica arriba del título — solo si se completó
              "Texto de la etiqueta". Entra primero (delay 0) en el efecto
              escalonado. */}
          {activeSection.badgeText && (
            <span
              key={`section-badge-${activeSection.id}`}
              className={cn(
                'mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase',
                activeSection.dropEffectEnabled && 'animate-drop-in',
              )}
              style={{
                color: activeSection.badgeColor || '#ffffff',
                background: activeSection.badgeBackground || 'rgba(255,255,255,0.1)',
                ...selectorPaddingMargin('padding', activeSection.badgePaddingSelect, activeSection.badgePaddingText),
                ...selectorPaddingMargin('margin', activeSection.badgeMarginSelect, activeSection.badgeMarginText),
              }}
            >
              {activeSection.badgeShowIcon && <span aria-hidden="true">×</span>}
              <span style={{ textDecoration: activeSection.badgeStrikethrough ? 'line-through' : undefined }}>
                {activeSection.badgeText}
              </span>
            </span>
          )}
          {/* Título de la sección — el estilo por defecto (blanco, negro,
              mayúscula) viene de las clases de Tailwind; cualquier campo
              de "Estilo del título" que se haya completado lo pisa vía
              `style` inline (los que quedaron vacíos/en 0 no tocan nada,
              así que sin configurar nada se ve exactamente igual que
              antes). El tamaño elige mobile/desktop a mano porque acá no
              hay forma de meter un media query en un `style` inline.
              "Efecto de entrada" escalona badge → título → descripción con
              `animationDelay` (ver `animate-drop-in` en app.css). */}
          <h3
            key={`section-title-${activeSection.id}`}
            className={cn(
              'text-3xl leading-[0.95] font-black tracking-tight text-white uppercase md:text-5xl',
              activeSection.dropEffectEnabled && 'animate-drop-in',
            )}
            style={{
              color: activeSection.titleColor || undefined,
              fontWeight: activeSection.titleWeight || undefined,
              fontSize: isMobile
                ? activeSection.titleFontSizeMobile || activeSection.titleFontSizeDesktop || undefined
                : activeSection.titleFontSizeDesktop || activeSection.titleFontSizeMobile || undefined,
              letterSpacing: activeSection.titleLetterSpacing ? `${activeSection.titleLetterSpacing}px` : undefined,
              lineHeight: activeSection.titleLineHeight > 0 ? activeSection.titleLineHeight : undefined,
              fontFamily: activeSection.titleFontFamily || undefined,
              textShadow: activeSection.titleTextShadowEnabled ? activeSection.titleTextShadow : undefined,
              animationDelay: activeSection.badgeText ? '140ms' : undefined,
              ...selectorPaddingMargin('padding', activeSection.titlePaddingSelect, activeSection.titlePaddingText),
              ...selectorPaddingMargin('margin', activeSection.titleMarginSelect, activeSection.titleMarginText),
            }}
          >
            {activeSection.title || active?.title}
          </h3>
          {activeSection.description && (
            <p
              key={`section-desc-${activeSection.id}`}
              className={cn(
                'mt-3 text-sm text-white/70 md:text-base',
                activeSection.dropEffectEnabled && 'animate-drop-in',
              )}
              style={{
                color: activeSection.descColor || undefined,
                fontSize: activeSection.descFontSize || undefined,
                lineHeight: activeSection.descLineHeight > 0 ? activeSection.descLineHeight : undefined,
                fontFamily: activeSection.descFontFamily || undefined,
                animationDelay: activeSection.badgeText ? '260ms' : '140ms',
                ...selectorPaddingMargin('padding', activeSection.descPaddingSelect, activeSection.descPaddingText),
                ...selectorPaddingMargin('margin', activeSection.descMarginSelect, activeSection.descMarginText),
              }}
            >
              {activeSection.description}
            </p>
          )}
        </div>
      )}

      {/* Encabezado + acordeón de preguntas — solo para kind 'faq' (ver
          product3d-faq.tsx). Se remonta (key={activeSection.id}) cada vez
          que cambia la toma FAQ activa, así el estado de "qué pregunta está
          abierta" no se arrastra de una a otra. */}
      {activeSection && activeSection.kind === 'faq' && (
        <FaqOverlay key={activeSection.id} section={activeSection} isMobile={isMobile} />
      )}

      {/* Barra + flechas: navegan de OBJETO 3D en objeto (saltándose sus
          secciones), a diferencia del scroll/swipe/teclado que sí recorren
          frame a frame (sección por sección) — paso 6. Se oculta apenas
          hay una SECCIÓN activa — en ese modo el objeto ya está mostrando
          el contenido de detalle y esta barra estorba en pantalla. También
          se oculta en "Modo carrusel" — ahí se recorre arrastrando, no con
          barra/flechas. */}
      {showProgress && designs.length > 1 && !activeSection && !dragCarouselMode && (
        <div className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-4 md:bottom-14">
          <input
            ref={rangeInputRef}
            type="range"
            min={0}
            max={designs.length - 1}
            step={1}
            value={activeProductIndex}
            onChange={(e) => selectProduct(Number(e.target.value))}
            // Un <input type="range"> nativo no puede "dar la vuelta"
            // arrastrando el thumb (no hay forma física de arrastrar más
            // allá de sus extremos) — pero SÍ podemos hacer que se sienta
            // infinito con el teclado: en vez de dejar que el navegador
            // clave el valor en 0/máximo, interceptamos las flechas acá y
            // usamos goPrevProduct/goNextProduct (los mismos que ya dan la
            // vuelta en los botones), para que en el extremo siga girando
            // hacia el primer/último producto en vez de trabarse.
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault()
                goNextProduct()
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault()
                goPrevProduct()
              }
            }}
            aria-label="Elegir producto"
            className="cursor-pointer appearance-none"
            style={{
              width: rangeWidth,
              height: `${rangeHeight}px`,
              borderRadius: `${rangeRadius}px`,
              background: rangeTrackColor,
              accentColor: rangeAccentColor,
            }}
          />
          <div 
            className="flex items-center justify-center fixed"
            style={{
              top:"50vh",
              gap:"18rem"
            }}
            >
            <button
              type="button"
              onClick={goPrevProduct}
              aria-label="Producto anterior"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:border-white hover:bg-white/10"
              >
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 17 32" fill="none">
              <path d="M2.11495 13.4458C3.28298 13.4458 4.22986 14.3927 4.22986 15.5607C4.22986 16.7287 3.28298 17.6756 2.11495 17.6756C0.946913 17.6756 3.33786e-05 16.7287 3.33786e-05 15.5607C3.33786e-05 14.3927 0.946913 13.4458 2.11495 13.4458Z" fill="currentColor" data-svg-origin="2.1149466037750244 15.560699939727783" transform="matrix(1,0,0,1,0,0)" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></path>
              <path d="M8.04854 6.77686C9.21657 6.77686 10.1635 7.72373 10.1635 8.89177C10.1635 10.0598 9.21657 11.0067 8.04854 11.0067C6.88051 11.0067 5.93363 10.0598 5.93363 8.89177C5.93363 7.72373 6.88051 6.77686 8.04854 6.77686Z" fill="currentColor" fill-opacity="0.6" data-svg-origin="8.048564910888672 8.891779899597168" transform="matrix(1,0,0,1,0,0)" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></path>
              <path d="M8.04854 20.1143C9.21657 20.1143 10.1635 21.0611 10.1635 22.2292C10.1635 23.3972 9.21657 24.3441 8.04854 24.3441C6.88051 24.3441 5.93363 23.3972 5.93363 22.2292C5.93363 21.0611 6.88051 20.1143 8.04854 20.1143Z" fill="currentColor" fill-opacity="0.6" data-svg-origin="8.048564910888672 22.22920036315918" transform="matrix(1,0,0,1,0,0)" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></path>
              <path d="M13.9823 26.8911C15.1503 26.8911 16.0972 27.838 16.0972 29.006C16.0972 30.1741 15.1503 31.1209 13.9823 31.1209C12.8142 31.1209 11.8673 30.1741 11.8673 29.006C11.8673 27.838 12.8142 26.8911 13.9823 26.8911Z" fill="currentColor" fill-opacity="0.3" data-svg-origin="13.982250213623047 29.00599956512451" transform="matrix(1,0,0,1,0,0)" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></path>
              <rect x="16.0972" y="7.03622e-07" width="4.22982" height="4.22983" rx="2.11491" transform="matrix(0,1,-1,0,16.0972,-16.0972)" fill="currentColor" fill-opacity="0.3" data-svg-origin="18.2121102809906 2.1149155977259966" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></rect>
            </svg>
            </button>
            
            <button
              type="button"
              onClick={goNextProduct}
              aria-label="Producto siguiente"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 17 32" fill="none">
                <path d="M13.9822 13.4458C12.8142 13.4458 11.8673 14.3927 11.8673 15.5607C11.8673 16.7287 12.8142 17.6756 13.9822 17.6756C15.1503 17.6756 16.0971 16.7287 16.0971 15.5607C16.0971 14.3927 15.1503 13.4458 13.9822 13.4458Z" fill="currentColor" data-svg-origin="13.982199668884277 15.560699939727783" transform="matrix(1,0,0,1,0,0)" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></path>
                <path d="M8.04863 6.77686C6.8806 6.77686 5.93372 7.72373 5.93372 8.89177C5.93372 10.0598 6.8806 11.0067 8.04863 11.0067C9.21666 11.0067 10.1635 10.0598 10.1635 8.89177C10.1635 7.72373 9.21666 6.77686 8.04863 6.77686Z" fill="currentColor" fill-opacity="0.6" data-svg-origin="8.048609972000122 8.891779899597168" transform="matrix(1,0,0,1,0,0)" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></path>
                <path d="M8.04863 20.1143C6.8806 20.1143 5.93372 21.0611 5.93372 22.2292C5.93372 23.3972 6.8806 24.3441 8.04863 24.3441C9.21666 24.3441 10.1635 23.3972 10.1635 22.2292C10.1635 21.0611 9.21666 20.1143 8.04863 20.1143Z" fill="currentColor" fill-opacity="0.6" data-svg-origin="8.048609972000122 22.22920036315918" transform="matrix(1,0,0,1,0,0)" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></path>
                <path d="M2.11491 26.8911C0.946879 26.8911 0 27.838 0 29.006C0 30.1741 0.946879 31.1209 2.11491 31.1209C3.28295 31.1209 4.22983 30.1741 4.22983 29.006C4.22983 27.838 3.28295 26.8911 2.11491 26.8911Z" fill="currentColor" fill-opacity="0.3" data-svg-origin="2.114914894104004 29.00599956512451" transform="matrix(1,0,0,1,0,0)" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></path>
                <rect width="4.22982" height="4.22983" rx="2.11491" transform="matrix(0,1,-1,0,4.22983,0)" fill="currentColor" fill-opacity="0.3" data-svg-origin="2.1149098873138428 2.114914894104004" style={{translate: "none",rotate: "none", scale: "none",transformOrigin: "0px 0px"}}></rect>
              </svg>
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg> */}
            </button>
          </div>
        </div>
      )}

      {/* Pista de "deslizá para descubrir" — solo antes de la primera
          interacción, se va sola apenas el usuario cambia de frame. No
          aplica en "Modo carrusel" (ahí no hay "frames" que descubrir). */}
      {!hasInteracted && frames.length > 1 && !dragCarouselMode && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 animate-pulse text-center text-[11px] tracking-[0.3em] text-white/40 uppercase">
          Deslizá para descubrir
        </div>
      )}

      {/* Mensajes de estado: sin modelo configurado, sin productos, o
          productos sin su imagen de color base cargada. */}
      {(!modelUrl || designs.length === 0) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 text-center text-sm text-white/60">
          {!modelUrl
            ? 'Configura el handle del metaobjeto (product_3d_viewer) con el modelo .glb.'
            : missingTitles.length > 0
              ? `Agregaste ${missingTitles.length} producto(s) pero falta cargarles la imagen "Color base": ${missingTitles.join(', ')}.`
              : 'Agregá al menos un elemento "Producto 3D" (Add child element) con su imagen de color base.'}
        </div>
      )}
    </div>
  )
}

export default Product3DViewer

// ─── Schema ────────────────────────────────────────────────────────────────
// Define los campos que ve el editor en el panel de Weaverse Studio y sus
// valores por defecto. `childTypes` habilita el botón "Add child element"
// → "Producto 3D" para agregar los productos (ver product3d.tsx); cada
// "Producto 3D" a su vez admite hijos "Sección de producto 3D" (ver
// product3d-section.tsx).

export const schema = createSchema({
  type: 'product-3d-viewer',
  title: 'Visor 3D de producto',
  childTypes: ['producto-3d'],
  settings: [
    {
      group: 'Datos',
      inputs: [
        {
          type: 'text',
          name: 'metaobject',
          label: 'Handle del metaobjeto (product_3d_viewer)',
          placeholder: 'ej: silla-gaming-base',
          defaultValue: '',
          helpText: 'Los productos ya no se eligen acá — agregalos como hijos "Producto 3D" desde "Add child element".',
        },
      ],
    },
    {
      group: 'Visor',
      inputs: [
        {
          type: 'text',
          name: 'bgColor',
          label: 'Fondo (CSS)',
          placeholder: 'ej: #111111  ó  linear-gradient(135deg, #3a2a1a, #000)',
          helpText: 'Acepta cualquier valor CSS válido para "background": un color sólido o un linear-gradient(). Es el fondo por defecto — cada sección puede pisarlo con el suyo propio en "Fondo del visor".',
          defaultValue: '#111111',
        },
        {
          type: 'range',
          name: 'bgBlur',
          label: 'Difuminado del fondo (blur)',
          helpText: '0 = sin blur. Se aplica solo al fondo — no afecta al objeto 3D ni al texto.',
          defaultValue: 0,
          configs: { min: 0, max: 60, step: 1, unit: 'px' },
        },
        { type: 'text', name: 'viewerHeight', label: 'Altura (CSS)', defaultValue: '90vh' },
        { type: 'range', name: 'modelScale', label: 'Escala del modelo', defaultValue: 1, configs: { min: -5, max: 5, step: 0.01 } },
        { type: 'range', name: 'modelPositionY', label: 'Desplazamiento vertical', defaultValue: 0, configs: { min: -2, max: 2, step: 0.05 } },
        { type: 'range', name: 'modelGap', label: 'Espacio entre copias', defaultValue: 0.4, configs: { min: 0, max: 3, step: 0.05 } },
        { type: 'range', name: 'cameraDistance', label: 'Distancia de cámara', defaultValue: 4, configs: { min: 1, max: 15, step: 0.5 } },
        {
          type: 'range',
          name: 'inactiveDimIntensity',
          label: 'Apagado de las copias no seleccionadas',
          helpText: 'En la fila de productos, qué tan oscura se ve la copia que NO está activa — 0% = tan iluminada como la activa, 100% = casi negra. Ya no es transparencia, es la misma sombra que usan las secciones.',
          defaultValue: 55,
          configs: { min: 0, max: 100, step: 1, unit: '%' },
        },
        { type: 'switch', name: 'showProgress', label: 'Mostrar barra + flechas', defaultValue: true },
      ],
    },
    {
      group: 'Barra',
      inputs: [
        { type: 'text', name: 'rangeWidth', label: 'Ancho (CSS)', defaultValue: '10rem', helpText: 'Cualquier valor CSS válido, ej: 10rem, 200px, 60%.' },
        { type: 'range', name: 'rangeHeight', label: 'Grosor', defaultValue: 4, configs: { min: 2, max: 16, step: 1, unit: 'px' } },
        { type: 'range', name: 'rangeRadius', label: 'Bordes redondeados', defaultValue: 20, configs: { min: 0, max: 20, step: 1, unit: 'px' } },
        { type: 'color', name: 'rangeTrackColor', label: 'Color de fondo (riel)', defaultValue: '#ffffff33' },
        { type: 'color', name: 'rangeAccentColor', label: 'Color activo (thumb/relleno)', defaultValue: '#ffffff' },
      ],
    },
    {
      group: 'Viñeta',
      inputs: [
        {
          type: 'switch',
          name: 'topShadowEnabled',
          label: 'Sombra superior',
          helpText: 'Degradé fijo pegado arriba de toda la pantalla (no se mueve con el scroll ni cambia por sección) — oscurece el borde para que el menú/logo se lean mejor encima.',
          defaultValue: true,
        },
        {
          type: 'range',
          name: 'topShadowHeight',
          label: 'Altura de la sombra superior',
          defaultValue: 200,
          configs: { min: 40, max: 500, step: 10, unit: 'px' },
          condition: (data: Product3DViewerProps) => data.topShadowEnabled === true,
        },
        {
          type: 'color',
          name: 'topShadowColor',
          label: 'Color de la sombra superior',
          helpText: 'Usá el selector de opacidad del color para lo intensa que se ve — se desvanece a transparente hacia abajo.',
          defaultValue: '#000000cc',
          condition: (data: Product3DViewerProps) => data.topShadowEnabled === true,
        },
        {
          type: 'switch',
          name: 'bottomShadowEnabled',
          label: 'Sombra inferior',
          helpText: 'Igual que la superior, pero pegada abajo de toda la pantalla.',
          defaultValue: true,
        },
        {
          type: 'range',
          name: 'bottomShadowHeight',
          label: 'Altura de la sombra inferior',
          defaultValue: 260,
          configs: { min: 40, max: 500, step: 10, unit: 'px' },
          condition: (data: Product3DViewerProps) => data.bottomShadowEnabled === true,
        },
        {
          type: 'color',
          name: 'bottomShadowColor',
          label: 'Color de la sombra inferior',
          defaultValue: '#000000cc',
          condition: (data: Product3DViewerProps) => data.bottomShadowEnabled === true,
        },
      ],
    },
    {
      group: 'Interacción',
      inputs: [
        {
          type: 'switch',
          name: 'enableDrag',
          label: 'Permitir rotar arrastrando',
          defaultValue: false,
          helpText: 'En celulares comparte el gesto táctil con el swipe para cambiar de frame — pueden interferir entre sí si activás los dos.',
        },
        { type: 'switch', name: 'autoRotate', label: 'Autorotación', defaultValue: false },
        { type: 'range', name: 'autoRotateSpeed', label: 'Velocidad de autorotación', defaultValue: 1.2, configs: { min: 0, max: 10, step: 0.1 }, condition: (data: Product3DViewerProps) => data.autoRotate === true },
        {
          type: 'range',
          name: 'transitionSmoothness',
          label: 'Suavidad al mover el objeto',
          helpText: 'Qué tan gradual es el movimiento del objeto al cambiar de frame (fila ↔ sección, o de una sección a otra). Más bajo = más lento/suave. Más alto = más directo/rápido.',
          defaultValue: 0.06,
          configs: { min: 0.02, max: 0.3, step: 0.01 },
        },
      ],
    },
    {
      group: 'Debug',
      inputs: [
        {
          type: 'switch',
          name: 'showDebugPanel',
          label: 'Mostrar panel de debug',
          helpText: 'Panel en pantalla para ajustar escala/cámara en vivo y navegar entre frames. Desactivalo antes de publicar.',
          defaultValue: true,
        },
      ],
    },
  ],
  presets: {
    metaobject: '',
    bgColor: '#111111',
    bgBlur: 0,
    viewerHeight: '90vh',
    modelScale: 1,
    modelPositionY: 0,
    modelGap: 0.4,
    cameraDistance: 4,
    transitionSmoothness: 0.06,
    enableDrag: false,
    autoRotate: false,
    autoRotateSpeed: 1.2,
    showProgress: true,
    rangeWidth: '10rem',
    rangeHeight: 4,
    rangeRadius: 20,
    rangeTrackColor: '#ffffff33',
    rangeAccentColor: '#ffffff',
    topShadowEnabled: true,
    topShadowHeight: 200,
    topShadowColor: '#000000cc',
    bottomShadowEnabled: true,
    bottomShadowHeight: 260,
    bottomShadowColor: '#000000cc',
    inactiveDimIntensity: 55,
    showDebugPanel: true,
    children: [
      { type: 'producto-3d', title: 'Diseño 1' },
      { type: 'producto-3d', title: 'Diseño 2' },
    ],
  },
})
