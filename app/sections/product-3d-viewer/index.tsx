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
  modelGap: number
  cameraDistance: number
  autoRotate: boolean
  autoRotateSpeed: number
  enableDrag: boolean
  showDebugPanel: boolean
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
    modelScale = 0.1,
    modelPositionY = 0,
    modelGap = 0.4,
    cameraDistance = 5,
    autoRotate = true,
    autoRotateSpeed = 1.2,
    enableDrag = true,
    showDebugPanel = true,
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
      const { GUI } = showDebugPanel
        ? await import('three/addons/libs/lil-gui.module.min.js')
        : { GUI: null }
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
      // Tamaño "nativo" del modelo (sin escalar) — se rellena al cargar el
      // .glb y sirve para recalcular fila/cámara cada vez que cambia un
      // parámetro (desde props o desde el panel de debug).
      let templateSize = new THREE.Vector3(1, 1, 1)
      // Escala "base" viva (prop o slider de debug) — animate() la lee cada
      // frame para el highlight, así el slider no pelea contra el loop.
      let baseScale = modelScale

      // ─── Cámara libre (WASD) — solo se activa desde el panel de debug ────
      // THREE.Clock está deprecado en esta versión; medimos delta a mano.
      let lastFrameTime = performance.now()
      const freeCam = { enabled: false, speed: 3 }
      const moveState = { forward: false, backward: false, left: false, right: false, up: false, down: false }
      const moveForward = new THREE.Vector3()
      const moveRight = new THREE.Vector3()
      const moveDelta = new THREE.Vector3()

      const loadTexture = (url: string, srgb = false) => {
        if (!url) return undefined
        const tex = textureLoader.load(url)
        tex.flipY = false
        if (srgb) tex.colorSpace = THREE.SRGBColorSpace
        return tex
      }

      function computeLayout(scaleVal: number, gapVal: number) {
        const itemWidth = templateSize.x * scaleVal || 1
        const itemHeight = templateSize.y * scaleVal || 1
        const spacing = itemWidth * (1 + Math.max(gapVal, 0))
        const count = clones.length
        const totalWidth = itemWidth + (count - 1) * spacing
        return { itemWidth, itemHeight, spacing, totalWidth }
      }

      // Reubica las copias en fila (usado al cargar y desde el panel de debug).
      function applyLayout(scaleVal: number, gapVal: number, posY: number) {
        baseScale = scaleVal
        const { spacing } = computeLayout(scaleVal, gapVal)
        const count = clones.length
        clones.forEach((clone, i) => {
          clone.scale.setScalar(scaleVal)
          clone.position.x = (i - (count - 1) / 2) * spacing
          clone.position.y = posY
        })
      }

      // Distancia mínima de cámara para que toda la fila entre en pantalla
      // (mayor de los distance-to-fit por alto y por ancho).
      function fitCameraDistance(scaleVal: number, gapVal: number, minDistance: number) {
        const { itemHeight, totalWidth } = computeLayout(scaleVal, gapVal)
        const vFov = THREE.MathUtils.degToRad(camera.fov)
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(camera.aspect, 0.01))
        const fitForHeight = itemHeight / 2 / Math.tan(vFov / 2)
        const fitForWidth = totalWidth / 2 / Math.tan(hFov / 2)
        return Math.max(fitForHeight, fitForWidth, minDistance, 0.01) * 1.15
      }

      // Aleja/acerca la cámara manteniendo el ángulo de órbita actual, medido
      // desde controls.target (no desde el origen — si el target está
      // desplazado en Y, medir desde (0,0,0) da una distancia incorrecta).
      function setCameraDistance(distance: number) {
        const offset = camera.position.clone().sub(controls.target)
        if (offset.lengthSq() < 1e-6) offset.set(0, 0, 1)
        offset.normalize().multiplyScalar(Math.max(distance, 0.01))
        camera.position.copy(controls.target).add(offset)
        controls.update()
      }

      // Reposiciona las copias y vuelve a apuntar/alejar la cámara para que
      // la fila completa quede encuadrada — se llama en cada cambio del
      // panel de debug así el modelo nunca "desaparece" de pantalla.
      function reframe(scaleVal: number, gapVal: number, posY: number, minDistance: number) {
        applyLayout(scaleVal, gapVal, posY)
        const distance = fitCameraDistance(scaleVal, gapVal, minDistance)
        controls.target.set(0, posY, 0)
        setCameraDistance(distance)
      }

      gltfLoader.load(
        modelUrl,
        (gltf) => {
          if (disposed) return
          const base = gltf.scene
          templateSize = new THREE.Box3().setFromObject(base).getSize(new THREE.Vector3())

          products.forEach((product) => {
            const clone = base.clone(true)
            clone.visible = true

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

          applyLayout(modelScale, modelGap, modelPositionY)
          controls.target.set(0, modelPositionY, 0)
          setCameraDistance(fitCameraDistance(modelScale, modelGap, cameraDistance))

          if (GUI) {
            setupDebugPanel()
          }
        },
        undefined,
        (err) => console.error('[Product3DViewer] error cargando .glb:', err),
      )

      // ─── Panel de debug (lil-gui) ──────────────────────────────────────
      // Controles en pantalla para tunear el visor en vivo sin recargar el
      // modelo — útiles para calibrar escala/espaciado/cámara y luego
      // trasladar los valores finales a los settings del editor.
      function setupDebugPanel() {
        // Velocidad de vuelo por defecto, proporcional al tamaño real de la
        // fila en escena — así "se siente" igual de rápida sea el modelo
        // diminuto o gigante según la escala configurada.
        const defaultFlySpeed = Math.max(computeLayout(modelScale, modelGap).totalWidth, 0.1) * 0.8
        freeCam.speed = defaultFlySpeed

        const debugParams = {
          cameraDistance,
          modelScale,
          modelPositionY,
          modelGap,
          autoRotate,
          autoRotateSpeed,
          enableDrag,
          freeCamEnabled: false,
          freeCamSpeed: defaultFlySpeed,
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

        const camFolder = gui.addFolder('Cámara')
        const distanceCtrl = camFolder
          .add(debugParams, 'cameraDistance', 1, 30, 0.1)
          .name('Distancia')
          .onChange((v: number) => setCameraDistance(v))

        const modelFolder = gui.addFolder('Modelo')
        modelFolder
          .add(debugParams, 'modelScale', 0.01, 5, 0.01)
          .name('Escala')
          .onChange((v: number) => reframe(v, debugParams.modelGap, debugParams.modelPositionY, debugParams.cameraDistance))
        modelFolder
          .add(debugParams, 'modelPositionY', -2, 2, 0.01)
          .name('Pos. Y')
          .onChange((v: number) => reframe(debugParams.modelScale, debugParams.modelGap, v, debugParams.cameraDistance))
        modelFolder
          .add(debugParams, 'modelGap', 0, 3, 0.01)
          .name('Espacio entre copias')
          .onChange((v: number) => reframe(debugParams.modelScale, v, debugParams.modelPositionY, debugParams.cameraDistance))
        modelFolder
          .add(
            {
              fit: () => {
                // Encuadre ajustado (ignora el piso de "Distancia" y refleja
                // el valor real resultante en el slider).
                const distance = fitCameraDistance(debugParams.modelScale, debugParams.modelGap, 0.01)
                controls.target.set(0, debugParams.modelPositionY, 0)
                setCameraDistance(distance)
                debugParams.cameraDistance = distance
                distanceCtrl.updateDisplay()
              },
            },
            'fit',
          )
          .name('Encuadrar cámara')

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

        // ─── Cámara libre (WASD) ──────────────────────────────────────────
        const resetMoveState = () => {
          moveState.forward = false
          moveState.backward = false
          moveState.left = false
          moveState.right = false
          moveState.up = false
          moveState.down = false
        }

        const freeCamFolder = gui.addFolder('Cámara libre (WASD)')
        freeCamFolder
          .add(debugParams, 'freeCamEnabled')
          .name('Activar')
          .onChange((v: boolean) => {
            freeCam.enabled = v
            resetMoveState()
          })
        freeCamFolder
          .add(debugParams, 'freeCamSpeed', defaultFlySpeed / 20, defaultFlySpeed * 20, defaultFlySpeed / 20)
          .name('Velocidad')
          .onChange((v: number) => {
            freeCam.speed = v
          })

        const KEY_TO_MOVE: Record<string, keyof typeof moveState> = {
          KeyW: 'forward',
          ArrowUp: 'forward',
          KeyS: 'backward',
          ArrowDown: 'backward',
          KeyA: 'left',
          ArrowLeft: 'left',
          KeyD: 'right',
          ArrowRight: 'right',
          KeyE: 'up',
          Space: 'up',
          KeyQ: 'down',
          ShiftLeft: 'down',
          ShiftRight: 'down',
        }
        const isEditingField = (target: EventTarget | null) => {
          const el = target as HTMLElement | null
          return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
        }
        const onKeyDown = (e: KeyboardEvent) => {
          if (!freeCam.enabled || isEditingField(e.target)) return
          const move = KEY_TO_MOVE[e.code]
          if (!move) return
          moveState[move] = true
          e.preventDefault()
        }
        const onKeyUp = (e: KeyboardEvent) => {
          const move = KEY_TO_MOVE[e.code]
          if (move) moveState[move] = false
        }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
        window.addEventListener('blur', resetMoveState)
        cleanupFns.push(() => {
          window.removeEventListener('keydown', onKeyDown)
          window.removeEventListener('keyup', onKeyUp)
          window.removeEventListener('blur', resetMoveState)
        })

        if (products.length > 1) {
          const productNames = products.map((p) => p.title)
          const selector = { producto: products[activeIndexRef.current]?.title ?? productNames[0] }
          gui
            .add(selector, 'producto', productNames)
            .name('Resaltar')
            .onChange((title: string) => {
              const idx = products.findIndex((p) => p.title === title)
              if (idx >= 0) setActiveIndex(idx)
            })
        }

        const infoFolder = gui.addFolder('Info')
        const infoParams = {
          productos: products.length,
          modelUrl: modelUrl ?? '—',
        }
        infoFolder.add(infoParams, 'productos').disable()
        infoFolder.add(infoParams, 'modelUrl').disable()
        infoFolder.close()

        camFolder.open()
        modelFolder.open()
        interFolder.open()
        freeCamFolder.open()

        cleanupFns.push(() => gui.destroy())
      }

      function animate() {
        raf = requestAnimationFrame(animate)

        const now = performance.now()
        const delta = Math.min((now - lastFrameTime) / 1000, 0.1)
        lastFrameTime = now

        // Cámara libre: se traslada camera + controls.target juntos según
        // las teclas activas, así OrbitControls no "pelea" el movimiento en
        // su próximo update() (la órbita relativa al target no cambia).
        if (freeCam.enabled) {
          camera.getWorldDirection(moveForward)
          moveRight.crossVectors(moveForward, camera.up).normalize()
          moveDelta.set(0, 0, 0)
          if (moveState.forward) moveDelta.add(moveForward)
          if (moveState.backward) moveDelta.addScaledVector(moveForward, -1)
          if (moveState.right) moveDelta.add(moveRight)
          if (moveState.left) moveDelta.addScaledVector(moveRight, -1)
          if (moveState.up) moveDelta.y += 1
          if (moveState.down) moveDelta.y -= 1
          if (moveDelta.lengthSq() > 0) {
            moveDelta.normalize().multiplyScalar(freeCam.speed * delta)
            camera.position.add(moveDelta)
            controls.target.add(moveDelta)
          }
        }

        // Las copias no activas quedan resaltadas/atenuadas mediante una
        // interpolación suave de escala en vez de ocultarse.
        clones.forEach((clone, i) => {
          const highlight = i === activeIndexRef.current
          const targetScale = baseScale * (highlight ? 1.08 : 1)
          clone.scale.setScalar(THREE.MathUtils.lerp(clone.scale.x, targetScale, 0.15))
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
  }, [modelUrl, products, modelScale, modelPositionY, modelGap, cameraDistance, autoRotate, autoRotateSpeed, enableDrag, showDebugPanel])

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
        { type: 'range', name: 'modelScale', label: 'Escala del modelo', defaultValue: 1, configs: { min: 0.01, max: 5, step: 0.05 } },
        { type: 'range', name: 'modelPositionY', label: 'Desplazamiento vertical', defaultValue: 0, configs: { min: -2, max: 2, step: 0.05 } },
        { type: 'range', name: 'modelGap', label: 'Espacio entre copias', defaultValue: 0.4, configs: { min: 0, max: 3, step: 0.05 } },
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
    {
      group: 'Debug',
      inputs: [
        {
          type: 'switch',
          name: 'showDebugPanel',
          label: 'Mostrar panel de debug',
          helpText: 'Panel en pantalla para ajustar escala/espacio/cámara en vivo, con cámara libre WASD. Desactivalo antes de publicar.',
          defaultValue: true,
        },
      ],
    },
  ],
  presets: {
    metaobject: '',
    bgColor: '#111111',
    viewerHeight: '80vh',
    modelScale: 1,
    modelPositionY: 0,
    modelGap: 0.4,
    cameraDistance: 4,
    enableDrag: true,
    autoRotate: true,
    autoRotateSpeed: 1.2,
    showDebugPanel: true,
  },
})
