import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseProduct,
} from '@weaverse/hydrogen'
import { cn } from '~/utils/cn'

// ─── Types ─────────────────────────────────────────────────────────────────

interface ProductDesign {
  id: string
  title: string
  handle: string
  baseColorUrl: string
  normalMapUrl: string
  aoMapUrl: string
  specularMapUrl: string
  logoUrl: string
}

interface Product3DViewerLoaderData {
  modelUrl: string | null
  products: ProductDesign[]
}

interface Product3DViewerProps extends HydrogenComponentProps {
  loaderData: Product3DViewerLoaderData | null
  clName?: string
  metaobject: string
  products?: WeaverseProduct[]
  bgColor: string
  viewerHeight: string
  modelScale: number
  modelPositionY: number
  cameraDistance: number
  autoRotate: boolean
  autoRotateSpeed: number
  enableDrag: boolean
}

// ─── GraphQL query ───────────────────────────────────────────────────────

const PRODUCT_3D_VIEWER_QUERY = `#graphql
  query Product3DViewer($country: CountryCode, $language: LanguageCode, $handle: String!, $ids: [ID!]!)
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
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        material: metafield(namespace: "custom", key: "chair_material") {
          reference {
            ... on Metaobject {
              fields {
                key
                reference {
                  ... on MediaImage {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
        logo: metafield(namespace: "custom", key: "chair_logo") {
          reference {
            ... on MediaImage {
              image {
                url
              }
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
  const { language, country } = weaverse.storefront.i18n
  const handle = data?.metaobject
  const selectedProducts = data?.products ?? []

  if (!handle || selectedProducts.length === 0) {
    return { modelUrl: null, products: [] }
  }

  try {
    const ids = selectedProducts.map((p) => `gid://shopify/Product/${p.id}`)
    const response: any = await weaverse.storefront.query(PRODUCT_3D_VIEWER_QUERY, {
      variables: { country, language, handle, ids },
    })

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

    const productNodes: any[] = (response?.nodes ?? []).filter(Boolean)
    const products: ProductDesign[] = productNodes
      .map((node) => {
        const materialFields: any[] = node.material?.reference?.fields ?? []
        const mapUrl = (key: string) =>
          materialFields.find((f) => f.key === key)?.reference?.image?.url ?? ''

        return {
          id: node.id as string,
          title: node.title as string,
          handle: node.handle as string,
          baseColorUrl: mapUrl('base_color'),
          normalMapUrl: mapUrl('normal_map'),
          aoMapUrl: mapUrl('ambient_occlusion'),
          specularMapUrl: mapUrl('specular_map'),
          logoUrl: node.logo?.reference?.image?.url ?? '',
        }
      })
      .filter((p) => p.baseColorUrl)

    return { modelUrl, products }
  } catch (e) {
    console.error('[Product3DViewer] loader error:', e)
    return { modelUrl: null, products: [] }
  }
}

// ─── Section ───────────────────────────────────────────────────────────────

function Product3DViewer(props: Product3DViewerProps) {
  const {
    clName,
    loaderData,
    bgColor = '#111111',
    viewerHeight = '80vh',
    modelScale = 1,
    modelPositionY = 0,
    cameraDistance = 4,
    autoRotate = true,
    autoRotateSpeed = 1.2,
    enableDrag = true,
  } = props

  const modelUrl = loaderData?.modelUrl ?? null
  const products = loaderData?.products ?? []

  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !modelUrl || products.length === 0) return

    let disposed = false
    let raf = 0
    const cleanupFns: Array<() => void> = []

    ;(async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
      const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')
      if (disposed) return

      const container = containerRef.current
      const canvas = canvasRef.current
      if (!container || !canvas) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
      camera.position.set(0, 0, cameraDistance)

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2))
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
      keyLight.position.set(3, 5, 4)
      scene.add(keyLight)
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
      fillLight.position.set(-4, 2, -3)
      scene.add(fillLight)

      const controls = new OrbitControls(camera, canvas)
      controls.enablePan = false
      controls.enableZoom = false
      controls.enabled = enableDrag
      controls.autoRotate = autoRotate
      controls.autoRotateSpeed = autoRotateSpeed
      controls.enableDamping = true
      controls.dampingFactor = 0.08

      function resize() {
        const w = container!.clientWidth
        const h = container!.clientHeight
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

      const loadTexture = (url: string, srgb = false) => {
        if (!url) return undefined
        const tex = textureLoader.load(url)
        tex.flipY = false
        if (srgb) tex.colorSpace = THREE.SRGBColorSpace
        return tex
      }

      gltfLoader.load(
        modelUrl,
        (gltf) => {
          if (disposed) return
          const base = gltf.scene

          products.forEach((product, i) => {
            const clone = base.clone(true)
            clone.scale.setScalar(modelScale)
            clone.position.y = modelPositionY
            clone.visible = i === activeIndexRef.current

            // Un único material por clon, aplicado a toda la malla sin
            // distinción de slots — usamos MeshPhongMaterial porque es el
            // material de three.js con specularMap nativo (MeshStandardMaterial
            // no tiene equivalente directo, usa metalness/roughness).
            const material = new THREE.MeshPhongMaterial({
              map: loadTexture(product.baseColorUrl, true),
              normalMap: loadTexture(product.normalMapUrl),
              aoMap: loadTexture(product.aoMapUrl),
              specularMap: loadTexture(product.specularMapUrl),
            })
            materials.push(material)

            clone.traverse((child) => {
              const mesh = child as any
              if (!mesh.isMesh) return
              // aoMap requiere un segundo canal UV — si el modelo no lo trae,
              // reusamos el UV principal para que al menos se aplique.
              if (material.aoMap && mesh.geometry?.attributes.uv && !mesh.geometry.attributes.uv2) {
                mesh.geometry.setAttribute('uv2', mesh.geometry.attributes.uv)
              }
              mesh.material = material
            })

            scene.add(clone)
            clones.push(clone)
          })
        },
        undefined,
        (err) => console.error('[Product3DViewer] error cargando .glb:', err),
      )

      function animate() {
        raf = requestAnimationFrame(animate)
        clones.forEach((clone, i) => {
          clone.visible = i === activeIndexRef.current
        })
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      cleanupFns.push(() => {
        cancelAnimationFrame(raf)
        controls.dispose()
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
  }, [modelUrl, products, modelScale, modelPositionY, cameraDistance, autoRotate, autoRotateSpeed, enableDrag])

  return (
    <div className={cn('relative w-full overflow-hidden', clName)} style={{ height: viewerHeight, background: bgColor }}>
      <div ref={containerRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {products.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-3">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={product.title}
              aria-pressed={i === activeIndex}
              className={cn(
                'h-12 w-12 overflow-hidden rounded-full border-2 bg-white/10 transition-colors',
                i === activeIndex ? 'border-white' : 'border-white/30',
              )}
            >
              {product.logoUrl ? (
                <img src={product.logoUrl} alt={product.title} className="h-full w-full object-contain p-1.5" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs text-white">
                  {product.title.slice(0, 2).toUpperCase()}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {(!modelUrl || products.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/60">
          Configura el handle del metaobjeto y selecciona al menos un producto con su metacampo "Material (mapas de diseño)" relleno.
        </div>
      )}
    </div>
  )
}

export default Product3DViewer

// ─── Schema ────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: 'product-3d-viewer',
  title: 'Visor 3D de producto',
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
        },
        {
          type: 'product-list',
          name: 'products',
          label: 'Productos (diseños/colores a mostrar)',
          helpText: 'Cada producto debe tener sus metacampos "Material (mapas de diseño)" y "Logo" rellenos.',
        },
      ],
    },
    {
      group: 'Visor',
      inputs: [
        { type: 'color', name: 'bgColor', label: 'Color de fondo', defaultValue: '#111111' },
        { type: 'text', name: 'viewerHeight', label: 'Altura (CSS)', defaultValue: '80vh' },
        { type: 'range', name: 'modelScale', label: 'Escala del modelo', defaultValue: 1, configs: { min: 0.1, max: 5, step: 0.05 } },
        { type: 'range', name: 'modelPositionY', label: 'Desplazamiento vertical', defaultValue: 0, configs: { min: -2, max: 2, step: 0.05 } },
        { type: 'range', name: 'cameraDistance', label: 'Distancia de cámara', defaultValue: 4, configs: { min: 1, max: 15, step: 0.5 } },
      ],
    },
    {
      group: 'Interacción',
      inputs: [
        { type: 'switch', name: 'enableDrag', label: 'Permitir rotar arrastrando', defaultValue: true },
        { type: 'switch', name: 'autoRotate', label: 'Autorotación', defaultValue: true },
        { type: 'range', name: 'autoRotateSpeed', label: 'Velocidad de autorotación', defaultValue: 1.2, configs: { min: 0, max: 10, step: 0.1 }, condition: (data: Product3DViewerProps) => data.autoRotate === true },
      ],
    },
  ],
  presets: {
    metaobject: '',
    bgColor: '#111111',
    viewerHeight: '80vh',
    modelScale: 1,
    modelPositionY: 0,
    cameraDistance: 4,
    enableDrag: true,
    autoRotate: true,
    autoRotateSpeed: 1.2,
  },
})
