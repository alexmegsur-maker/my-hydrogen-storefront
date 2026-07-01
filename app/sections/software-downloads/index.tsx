import { useEffect, useMemo, useState } from 'react'
import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseCollection,
} from '@weaverse/hydrogen'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SoftwareFile {
  id: string
  url: string
  name: string
  mimeType?: string | null
}

export interface SoftwareProduct {
  id: string
  title: string
  handle: string
  featuredImage?: { url: string; altText?: string | null } | null
  files: SoftwareFile[]
}

type SoftwareDownloadsLoaderData = { products: SoftwareProduct[] }

interface SoftwareDownloadsSectionData {
  collection?: WeaverseCollection
  title?: string
  subtitle?: string
}

interface SoftwareDownloadsProps
  extends HydrogenComponentProps,
    SoftwareDownloadsSectionData {}

// ─── Raw API shapes ────────────────────────────────────────────────────────

interface RawFileNode {
  id: string
  url?: string
  alt?: string | null
  mimeType?: string | null
  image?: { url: string; altText?: string | null }
}

interface RawProduct {
  id: string
  title: string
  handle: string
  featuredImage?: { url: string; altText?: string | null } | null
  software?: { references?: { nodes: RawFileNode[] } } | null
}

// ─── GraphQL ───────────────────────────────────────────────────────────────

const SOFTWARE_PRODUCTS_QUERY = `#graphql
  query softwareProducts(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          software: metafield(namespace: "custom", key: "software") {
            references(first: 10) {
              nodes {
                ... on GenericFile {
                  id
                  url
                  alt
                  mimeType
                }
                ... on MediaImage {
                  id
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

// ─── Helpers ──────────────────────────────────────────────────────────────

function getFileName(url: string): string {
  try {
    const segments = new URL(url).pathname.split('/')
    return decodeURIComponent(segments[segments.length - 1] ?? 'archivo')
  } catch (_e) {
    return url.split('/').pop() ?? 'archivo'
  }
}

function getMimeIcon(mimeType?: string | null): string {
  if (!mimeType) return '[file]'
  if (mimeType.includes('pdf')) return '[pdf]'
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '[zip]'
  if (mimeType.includes('image')) return '[img]'
  if (mimeType.includes('video')) return '[vid]'
  if (mimeType.includes('exe') || mimeType.includes('octet-stream')) return '[exe]'
  return '[file]'
}

function transformProducts(nodes: RawProduct[]): SoftwareProduct[] {
  return nodes
    .map((product) => {
      const refs: RawFileNode[] = product.software?.references?.nodes ?? []
      const files: SoftwareFile[] = refs
        .map((node): SoftwareFile | null => {
          if (node.url) {
            return {
              id: node.id,
              url: node.url,
              name: node.alt || getFileName(node.url),
              mimeType: node.mimeType,
            }
          }
          if (node.image?.url) {
            return {
              id: node.id,
              url: node.image.url,
              name: node.image.altText || getFileName(node.image.url),
              mimeType: 'image/*',
            }
          }
          return null
        })
        .filter((f): f is SoftwareFile => f !== null)

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        featuredImage: product.featuredImage ?? null,
        files,
      }
    })
    .filter((p) => p.files.length > 0)
}

// ─── Download Panel ────────────────────────────────────────────────────────

function DownloadPanel(props: { product: SoftwareProduct; onClose: () => void }) {
  const { product, onClose } = props

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed z-50 bottom-6 right-6 w-full max-w-sm bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]"
        style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.7)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-[#997124] font-semibold mb-0.5">
              Descargas disponibles
            </p>
            <h3 className="text-white font-medium text-sm leading-snug truncate">
              {product.title}
            </h3>
            <p className="text-white/30 text-xs mt-0.5">
              {product.files.length} {product.files.length === 1 ? 'archivo' : 'archivos'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* File list */}
        <div className="overflow-y-auto flex-1" data-lenis-prevent>
          <ul className="divide-y divide-white/10 px-5">
            {product.files.map((file) => {
              return (
                <li key={file.id} className="flex items-center gap-3 py-3">
                  <span className="text-xs text-white/30 flex-shrink-0 font-mono w-10 text-center">
                    {getMimeIcon(file.mimeType)}
                  </span>
                  <span className="text-sm text-white/70 truncate flex-1 min-w-0">
                    {file.name}
                  </span>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-widest bg-[#997124]/20 hover:bg-[#997124]/40 text-[#f1e2b7] border border-[#997124]/30 hover:border-[#997124]/60 transition-all duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3.5-3.5M12 16l3.5-3.5M4 20h16" />
                    </svg>
                    Descargar
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─── Product Card ──────────────────────────────────────────────────────────

function ProductCard(props: { product: SoftwareProduct; isActive: boolean; onClick: () => void }) {
  const { product, isActive, onClick } = props
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'group relative flex flex-col items-center gap-3 p-4 rounded-xl border w-full transition-all duration-300 cursor-pointer ' +
        (isActive
          ? 'border-[#f1e2b7] bg-white/5'
          : 'border-white/10 hover:border-white/25 bg-white/[0.02]')
      }
    >
      <div className="w-full aspect-square overflow-hidden rounded-lg bg-white/5">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">
            ?
          </div>
        )}
      </div>
      <p className={'text-sm font-medium text-center leading-snug ' + (isActive ? 'text-[#f1e2b7]' : 'text-white/80')}>
        {product.title}
      </p>
      <span className={'px-2 py-0.5 rounded-full text-[11px] font-semibold ' + (isActive ? 'bg-[#997124] text-white' : 'bg-white/10 text-white/50')}>
        {product.files.length} {product.files.length === 1 ? 'archivo' : 'archivos'}
      </span>
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

function SoftwareDownloads(props: SoftwareDownloadsProps) {
  const loaderData = (props.loaderData ?? { products: [] }) as SoftwareDownloadsLoaderData
  const { title, subtitle } = props

  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const products = useMemo(() => loaderData.products ?? [], [loaderData])

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.title.toLowerCase().includes(q))
  }, [products, search])

  const activeProduct = useMemo(
    () => products.find((p) => p.id === activeId) ?? null,
    [products, activeId],
  )

  if (!products.length) {
    return (
      <section className="bg-[#050505] py-20 text-center text-white/30 text-sm">
        No hay software disponible en este momento.
      </section>
    )
  }

  return (
    <section className="bg-[#050505] py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-medium text-white mb-3 font-garamond">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-white/40 text-base max-w-xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        {/* Buscador de productos */}
        <div className="relative max-w-sm mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-9 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#997124]/60 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              aria-label="Limpiar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isActive={product.id === activeId}
                  onClick={() => setActiveId((prev) => (prev === product.id ? null : product.id))}
                />
              )
            })}
          </div>
        ) : (
          <p className="text-white/25 text-sm py-12 text-center">
            No se encontro ningun producto con ese nombre.
          </p>
        )}

      </div>

      {activeProduct && (
        <DownloadPanel
          product={activeProduct}
          onClose={() => setActiveId(null)}
        />
      )}
    </section>
  )
}

export default SoftwareDownloads

// ─── Loader ────────────────────────────────────────────────────────────────

export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<SoftwareDownloadsSectionData>): Promise<SoftwareDownloadsLoaderData> => {
  const { language, country } = weaverse.storefront.i18n
  const handle = data.collection?.handle

  if (!handle) return { products: [] }

  const result = await weaverse.storefront.query(SOFTWARE_PRODUCTS_QUERY, {
    variables: { country, language, handle, first: 20 },
  })

  const rawNodes: RawProduct[] = result?.collection?.products?.nodes ?? []
  return { products: transformProducts(rawNodes) }
}

// ─── Weaverse schema ────────────────────────────────────────────────────────

export const schema = createSchema({
  type: 'software-downloads',
  title: 'Software Downloads',
  settings: [
    {
      group: 'Contenido',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Titulo',
          defaultValue: 'Centro de Descargas',
        },
        {
          type: 'text',
          name: 'subtitle',
          label: 'Subtitulo',
          defaultValue: 'Descarga el software disponible para tu producto.',
        },
      ],
    },
    {
      group: 'Productos',
      inputs: [
        {
          type: 'collection',
          name: 'collection',
          label: 'Coleccion con software',
        },
      ],
    },
  ],
  presets: {
    title: 'Centro de Descargas',
    subtitle: 'Descarga el software disponible para tu producto.',
  },
})
