import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from '@weaverse/hydrogen'

// ─── Qué es este archivo ─────────────────────────────────────────────────
// Es el elemento "hijo" que representa UN producto/diseño dentro del visor
// 3D (product-3d-viewer/index.tsx). En el editor de Weaverse, agregás uno
// de estos por cada variante que quieras mostrar usando el botón
// "Add child element" → "Producto 3D" — ya no hace falta tener esos
// productos dados de alta en Shopify ni completar metacampos: cargás acá
// mismo el nombre, la descripción y las imágenes de textura.
//
// No dibuja nada por sí mismo (por eso el componente devuelve `null`). El
// padre lee los datos de todos sus hijos con `useChildInstances()` y es
// quien realmente dibuja el modelo 3D texturizado en su <canvas>.
//
// A su vez, cada "Producto 3D" puede tener sus propios hijos-toma: "Sección
// de producto 3D" (product3d-section.tsx, texto normal), "Toma con video de
// fondo" (product3d-video.tsx), "Toma con FAQ" (product3d-faq.tsx), o "Modo
// carrusel" (product3d-carousel.tsx) — esta última no es un bloque de
// texto: mientras esa toma está activa, se puede arrastrar la fila entera
// para recorrer TODOS los productos en bucle infinito, en vez de ver la
// pose normal de esta toma.

export interface Product3DItemProps extends HydrogenComponentProps {
  title: string
  description?: string
  // Sin esta imagen el diseño no tiene nada que texturizar y el padre lo
  // descarta (avisando en el panel de debug / mensaje en pantalla).
  baseColorImage?: WeaverseImage
  normalMapImage?: WeaverseImage
  aoMapImage?: WeaverseImage
  specularMapImage?: WeaverseImage
  // Opcional — si se completa, se usa como ícono en el indicador de
  // progreso en vez del número de orden.
  logoImage?: WeaverseImage
}

export default function Product3DItem(_props: Product3DItemProps) {
  // Sin salida visual — ver comentario de arriba. Todo el trabajo de
  // "pintar" este producto lo hace product-3d-viewer/index.tsx.
  return null
}

export const schema = createSchema({
  type: 'producto-3d',
  title: 'Producto 3D',
  childTypes: ['producto-3d-seccion', 'producto-3d-video', 'producto-3d-faq', 'producto-3d-carrusel'],
  settings: [
    {
      group: 'Producto',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Nombre',
          defaultValue: 'Nuevo diseño',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Descripción',
          placeholder: 'Un par de líneas sobre este diseño/color...',
        },
      ],
    },
    {
      group: 'Texturas',
      inputs: [
        {
          type: 'image',
          name: 'baseColorImage',
          label: 'Color base',
          helpText: 'Obligatoria — sin esta imagen el producto no se muestra en el visor.',
        },
        {
          type: 'image',
          name: 'normalMapImage',
          label: 'Mapa de normales (opcional)',
        },
        {
          type: 'image',
          name: 'aoMapImage',
          label: 'Oclusión ambiental (opcional)',
        },
        {
          type: 'image',
          name: 'specularMapImage',
          label: 'Mapa especular (opcional)',
        },
        {
          type: 'image',
          name: 'logoImage',
          label: 'Logo / ícono (opcional)',
          helpText: 'Se muestra en el indicador de progreso si lo activás en "Interacción".',
        },
      ],
    },
  ],
  presets: {
    title: 'Nuevo diseño',
  },
})
