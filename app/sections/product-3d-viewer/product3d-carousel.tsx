import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen'

// ─── Qué es este archivo ─────────────────────────────────────────────────
// Es una "toma" más de un "Producto 3D" (product3d.tsx) — hermano de
// "Sección de producto 3D" (product3d-section.tsx), "Toma con video de
// fondo" (product3d-video.tsx) y "Toma con FAQ" (product3d-faq.tsx). Se
// agrega con "Add child element" ADENTRO de un "Producto 3D" puntual, igual
// que cualquier otra toma. Mismo patrón que las demás: un componente que no
// dibuja nada por sí mismo, solo guarda datos que el padre (el visor 3D)
// lee y usa.
//
// Igual que "Sección de producto 3D", acá elegís a dónde tiene que moverse
// el objeto 3D (posición X/Y/Z, rotación en los 3 ejes y una escala
// relativa) para encuadrar esta toma — al llegar acá el objeto se anima
// suavemente hasta esa posición y el resto de los productos queda a los
// costados, en fila, como en cualquier otra toma.
//
// La diferencia con las demás tomas: además de encuadrar el objeto activo,
// esta habilita el "Modo carrusel" — mientras es la toma activa, se puede
// ARRASTRAR la fila entera de productos (TODOS los "Producto 3D" del
// visor, no solo este) para recorrerlos libremente, en bucle infinito y
// con inercia al soltar. No tiene texto propio (sin título/descripción).
// Al navegar (scroll/flechas/barra/clic) a la toma siguiente o anterior,
// se sale del modo carrusel y todo vuelve a funcionar como siempre.

export interface Product3DCarouselProps extends HydrogenComponentProps {
  // Solo para identificarlo en la lista de hijos del editor.
  title: string
  posX: number
  posY: number
  posZ: number
  // Posición, rotación y escala propias para mobile — apagado por defecto
  // (usa las mismas de arriba en todas las pantallas). Mismo mecanismo que
  // product3d-section.tsx.
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
  dragSensitivity: number
  dragInertiaEnabled: boolean
  dragFriction: number
  sideShadowIntensity: number
}

export default function Product3DCarousel(_props: Product3DCarouselProps) {
  // Sin salida visual — ver comentario de arriba. Todo el trabajo de
  // activar el modo y dibujarlo lo hace product-3d-viewer/index.tsx.
  return null
}

export const schema = createSchema({
  type: 'producto-3d-carrusel',
  title: 'Modo carrusel (arrastrar)',
  settings: [
    {
      group: 'Modo carrusel',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Nombre interno',
          helpText: 'Solo para identificar este hijo en la lista del editor — no se muestra en la página.',
          defaultValue: 'Modo carrusel (arrastrar)',
        },
        {
          type: 'range',
          name: 'dragSensitivity',
          label: 'Sensibilidad del arrastre',
          helpText: '1 = el objeto sigue al dedo/mouse 1 a 1. Menos = arrastre más "pesado". Más = más rápido.',
          defaultValue: 1,
          configs: { min: 0.2, max: 3, step: 0.1 },
        },
        {
          type: 'switch',
          name: 'dragInertiaEnabled',
          label: 'Inercia al soltar',
          helpText: 'Al soltar, la fila sigue deslizándose un poco y frena de a poco — como cualquier carrusel arrastrable.',
          defaultValue: true,
        },
        {
          type: 'range',
          name: 'dragFriction',
          label: 'Freno (fricción)',
          helpText: 'Más cerca de 1 = frena más despacio (desliza más lejos). Más bajo = frena casi al toque.',
          defaultValue: 0.94,
          configs: { min: 0.8, max: 0.99, step: 0.01 },
          condition: (data: Product3DCarouselProps) => data.dragInertiaEnabled === true,
        },
        {
          type: 'range',
          name: 'sideShadowIntensity',
          label: 'Apagado de las copias no seleccionadas',
          helpText: 'Qué tan oscura se ve, EN ESTA TOMA, la copia que no está centrada — 0% = tan iluminada como la activa, 100% = casi negra. Reemplaza (solo mientras este carrusel está activo) al "Apagado de las copias no seleccionadas" general de "Interacción".',
          defaultValue: 55,
          configs: { min: 0, max: 100, step: 1, unit: '%' },
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
          helpText: 'Activá esto para definir su propia Posición, Rotación X/Y/Z y Escala solo para mobile.',
          defaultValue: false,
        },
        {
          type: 'range',
          name: 'posXMobile',
          label: 'Posición X (mobile)',
          helpText: 'Negativo = izquierda, positivo = derecha.',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
          condition: (data: Product3DCarouselProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'posYMobile',
          label: 'Posición Y (mobile)',
          helpText: 'Negativo = abajo, positivo = arriba.',
          defaultValue: 0,
          configs: { min: -3, max: 3, step: 0.1 },
          condition: (data: Product3DCarouselProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'posZMobile',
          label: 'Posición Z (mobile)',
          helpText: 'Negativo = más lejos de cámara, positivo = más cerca.',
          defaultValue: 0,
          configs: { min: -5, max: 5, step: 0.1 },
          condition: (data: Product3DCarouselProps) => data.mobilePositionEnabled === true,
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
          condition: (data: Product3DCarouselProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationYMobile',
          label: 'Rotación Y (mobile)',
          defaultValue: 15,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DCarouselProps) => data.mobilePositionEnabled === true,
        },
        {
          type: 'range',
          name: 'rotationZMobile',
          label: 'Rotación Z (mobile)',
          defaultValue: 0,
          configs: { min: -180, max: 180, step: 1, unit: '°' },
          condition: (data: Product3DCarouselProps) => data.mobilePositionEnabled === true,
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
          condition: (data: Product3DCarouselProps) => data.mobilePositionEnabled === true,
        },
      ],
    },
  ],
  presets: {
    title: 'Modo carrusel (arrastrar)',
    dragSensitivity: 1,
    dragInertiaEnabled: true,
    dragFriction: 0.94,
    sideShadowIntensity: 55,
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
  },
})
