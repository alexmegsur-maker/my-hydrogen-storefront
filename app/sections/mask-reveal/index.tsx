import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
  type WeaverseVideo,
} from '@weaverse/hydrogen'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { cn } from '~/utils/cn'

// ─── Types ─────────────────────────────────────────────────────────────────

interface MaskRevealProps extends HydrogenComponentProps {
  clName?: string
  backgroundImage?: WeaverseImage
  backgroundImageMobile?: WeaverseImage
  useVideoBackground: boolean
  backgroundVideo?: WeaverseVideo
  revealImage?: WeaverseImage
  revealImageMobile?: WeaverseImage
  bgColor: string
  textColor: string
  maxPoints: number
  lifespan: number
  baseRadius: number
  // Posición del bloque de texto (titular + subtítulo)
  contentPosition: string
  // Titular (line1 / line2)
  line1: string
  line2: string
  headingColor: string
  headingSize: string
  headingWeight: string
  headingFamily: string
  headingLetterSpacing: number
  headingLineHeight: number
  // Subtítulo
  subtitleText: string
  subtitleColor: string
  subtitleSize: string
  subtitleWeight: string
  subtitleFamily: string
  subtitleLetterSpacing: string
  subtitleOpacity: number
  // Texto de ayuda (esquina)
  hintText: string
  hintColor: string
  hintSize: string
  hintWeight: string
  hintFamily: string
  hintLetterSpacing: string
  hintOpacity: number
}

const CONTENT_POSITION_CLASSES: Record<string, string> = {
  "top left": "items-start justify-start text-left",
  "top center": "items-center justify-start text-center",
  "top right": "items-end justify-start text-right",
  "center left": "items-start justify-center text-left",
  "center center": "items-center justify-center text-center",
  "center right": "items-end justify-center text-right",
  "bottom left": "items-start justify-end text-left",
  "bottom center": "items-center justify-end text-center",
  "bottom right": "items-end justify-end text-right",
}

// ─── Helper ────────────────────────────────────────────────────────────────

function toUrl(img: WeaverseImage | undefined): string {
  if (!img) return ''
  return typeof img === 'string' ? img : img.url
}

// El fondo puede ser <img> o <video> — estas dos funciones abstraen
// "¿ya tiene un frame pintado?" y "¿qué tamaño natural tiene?" para
// que el resto del efecto no necesite saber cuál de los dos es.
function isMediaReady(el: HTMLImageElement | HTMLVideoElement): boolean {
  if (el instanceof HTMLVideoElement) return el.readyState >= 2 && el.videoWidth > 0
  return el.complete && el.naturalWidth > 0
}

function getMediaSize(el: HTMLImageElement | HTMLVideoElement): { width: number; height: number } {
  if (el instanceof HTMLVideoElement) return { width: el.videoWidth, height: el.videoHeight }
  return { width: el.naturalWidth, height: el.naturalHeight }
}

// ─── Section ───────────────────────────────────────────────────────────────

function MaskReveal(props: MaskRevealProps) {
  const {
    clName,
    backgroundImage,
    backgroundImageMobile,
    useVideoBackground = false,
    backgroundVideo,
    revealImage,
    revealImageMobile,
    bgColor = '#0a0a0a',
    textColor = '#f4f2ee',
    maxPoints = 30,
    lifespan = 900,
    baseRadius = 0.045,
    contentPosition = 'bottom left',
    line1 = '',
    line2 = '',
    headingColor = '#f4f2ee',
    headingSize = 'clamp(28px, 5vw, 64px)',
    headingWeight = '600',
    headingFamily = '',
    headingLetterSpacing = -1,
    headingLineHeight = 1.05,
    subtitleText = '',
    subtitleColor = '#f4f2ee',
    subtitleSize = '14px',
    subtitleWeight = '400',
    subtitleFamily = '',
    subtitleLetterSpacing = '0.12em',
    subtitleOpacity = 70,
    hintText = '',
    hintColor = '#f4f2ee',
    hintSize = '12px',
    hintWeight = '400',
    hintFamily = '',
    hintLetterSpacing = '0.04em',
    hintOpacity = 50,
  } = props

  const isMobile = useIsMobile(800)
  const bgImageUrl = toUrl(isMobile && backgroundImageMobile ? backgroundImageMobile : backgroundImage)
  const sketchUrl = toUrl(isMobile && revealImageMobile ? revealImageMobile : revealImage)
  const bgVideoUrl = backgroundVideo?.url ?? ''
  const bgUrl = useVideoBackground ? bgVideoUrl : bgImageUrl
  const contentPositionClasses = CONTENT_POSITION_CLASSES[contentPosition] ?? CONTENT_POSITION_CLASSES['bottom left']

  const stageRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgImageRef = useRef<HTMLImageElement>(null)
  const bgVideoRef = useRef<HTMLVideoElement>(null)
  const sketchImgRef = useRef<HTMLImageElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  // ── WebGL mask + 2D reveal loop (client-only, dynamic three import) ─────
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !bgUrl || !sketchUrl) return

    let disposed = false
    let raf = 0
    let renderer: import('three').WebGLRenderer | undefined
    const cleanupFns: Array<() => void> = []

    ;(async () => {
      const THREE = await import('three')
      if (disposed) return

      const stage = stageRef.current
      const displayCanvas = canvasRef.current
      const baseMediaEl: HTMLImageElement | HTMLVideoElement | null = useVideoBackground
        ? bgVideoRef.current
        : bgImageRef.current
      const imageEl = sketchImgRef.current
      if (!stage || !displayCanvas || !baseMediaEl || !imageEl) return

      const ctx = displayCanvas.getContext('2d')
      if (!ctx) return

      const MAX_POINTS = maxPoints
      const LIFESPAN = lifespan
      const MIN_DIST = 0.008
      const BASE_RADIUS = baseRadius

      const LIFESPAN_MIN_SCALE = 0.65
      const LIFESPAN_MAX_SCALE = 1.55

      const LOOKAHEAD = 0.16
      const SPRING_STIFFNESS = 160
      const SPRING_DAMPING = 12
      const VELOCITY_SMOOTHING = 0.35
      const VELOCITY_DECAY = 0.9
      const MAX_SPEED = 3.5

      let trail: { x: number; y: number; birth: number; lifeScale: number }[] = []
      const lastPushedReal = { x: -1, y: -1 }
      const lastPushedLead = { x: -1, y: -1 }

      const cursorUV = { x: 0.5, y: 0.5, initialized: false }
      const velocity = { x: 0, y: 0 }
      const lastSample = { x: 0.5, y: 0.5, t: performance.now() }
      const lead = { x: 0.5, y: 0.5, vx: 0, vy: 0, initialized: false }

      const maskCanvas = document.createElement('canvas')
      renderer = new THREE.WebGLRenderer({ canvas: maskCanvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const pointsData = new Float32Array(MAX_POINTS * 4)

      const uniforms = {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uPoints: { value: pointsData },
        uPointCount: { value: 0 },
        uNow: { value: 0 },
        uLifespan: { value: LIFESPAN },
        uBaseRadius: { value: BASE_RADIUS },
      }

      const vertexShader = `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `

      const fragmentShader = `
        precision highp float;
        varying vec2 vUv;

        uniform vec2 uResolution;
        uniform float uTime;
        uniform float uPoints[${MAX_POINTS * 4}];
        uniform int uPointCount;
        uniform float uNow;
        uniform float uLifespan;
        uniform float uBaseRadius;

        float hash(vec2 p){
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        float fbm(vec2 p){
          float value = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 3; i++){
            value += amp * noise(p);
            p *= 2.1;
            amp *= 0.5;
          }
          return value;
        }

        float smin(float a, float b, float k){
          float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
          return mix(b, a, h) - k * h * (1.0 - h);
        }

        float sdTaperedCapsule(vec2 p, vec2 a, vec2 b, float ra, float rb){
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          float r = mix(ra, rb, h);
          return length(pa - ba * h) - r;
        }

        float radiusForAge(float age){
          float growth = smoothstep(0.0, 0.32, age);
          float taper = 1.0 - smoothstep(0.5, 1.0, age);
          return uBaseRadius * growth * taper;
        }

        void main(){
          vec2 uv = vUv;
          float aspect = uResolution.x / uResolution.y;

          vec2 warpOffset = vec2(
            fbm(uv * 4.0 + vec2(0.0, uTime * 0.08)),
            fbm(uv * 4.0 + vec2(3.7, uTime * 0.08))
          );
          vec2 warpedUv = uv + (warpOffset - 0.5) * 0.012;

          vec2 p = warpedUv;
          p.x *= aspect;

          float sdf = 1000.0;

          for (int i = 0; i < ${MAX_POINTS - 1}; i++){
            if (i >= uPointCount - 1) break;

            float ax = uPoints[i * 4 + 0];
            float ay = uPoints[i * 4 + 1];
            float aBirth = uPoints[i * 4 + 2];
            float aLife = uPoints[i * 4 + 3];

            float bx = uPoints[(i + 1) * 4 + 0];
            float by = uPoints[(i + 1) * 4 + 1];
            float bBirth = uPoints[(i + 1) * 4 + 2];
            float bLife = uPoints[(i + 1) * 4 + 3];

            float ageA = clamp((uNow - aBirth) / (uLifespan * aLife), 0.0, 1.0);
            float ageB = clamp((uNow - bBirth) / (uLifespan * bLife), 0.0, 1.0);

            float ra = radiusForAge(ageA);
            float rb = radiusForAge(ageB);

            float bulge = 0.85 + 0.35 * hash(vec2(bBirth * 0.017, 4.2));
            rb *= bulge;

            vec2 pa = vec2(ax, ay); pa.x *= aspect;
            vec2 pb = vec2(bx, by); pb.x *= aspect;

            float dist = sdTaperedCapsule(p, pa, pb, ra, rb);
            sdf = smin(sdf, dist, 0.02);
          }

          float edgeProximity = 1.0 - smoothstep(0.0, 0.05, abs(sdf));

          float fringeCoarse = fbm(uv * 18.0 + uTime * 0.05) - 0.5;
          float fringeFine   = fbm(uv * 55.0 + uTime * 0.12 + 3.1) - 0.5;
          float fringeNoise = fringeCoarse * 0.028 + fringeFine * 0.016;

          sdf += fringeNoise * edgeProximity;

          float surfaceNoise = (fbm(uv * 30.0 + uTime * 0.15) - 0.5) * 0.006;
          sdf += surfaceNoise;

          float edgeSoftness = 0.006;
          float reveal = 1.0 - smoothstep(0.0, edgeSoftness, sdf);

          float alpha = 1.0 - reveal;

          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `

      const geometry = new THREE.PlaneGeometry(2, 2)
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      function resize() {
        const rect = stage!.getBoundingClientRect()
        const w = Math.max(1, Math.round(rect.width))
        const h = Math.max(1, Math.round(rect.height))
        const dpr = Math.min(window.devicePixelRatio, 2)

        renderer!.setSize(w, h)
        uniforms.uResolution.value.set(w, h)

        displayCanvas!.width = w * dpr
        displayCanvas!.height = h * dpr
        displayCanvas!.style.width = `${w}px`
        displayCanvas!.style.height = `${h}px`
      }
      window.addEventListener('resize', resize)
      cleanupFns.push(() => window.removeEventListener('resize', resize))
      resize()

      function pushPoint(u: number, v: number, tracker: { x: number; y: number }) {
        const dx = u - tracker.x
        const dy = v - tracker.y
        if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) return

        tracker.x = u
        tracker.y = v

        const lifeScale = LIFESPAN_MIN_SCALE + Math.random() * (LIFESPAN_MAX_SCALE - LIFESPAN_MIN_SCALE)

        trail.push({ x: u, y: v, birth: performance.now(), lifeScale })
        if (trail.length > MAX_POINTS) {
          trail.shift()
        }
      }

      function handlePointer(clientX: number, clientY: number) {
        const rect = stage!.getBoundingClientRect()
        const u = (clientX - rect.left) / rect.width
        const v = 1.0 - (clientY - rect.top) / rect.height

        const now = performance.now()
        const dt = (now - lastSample.t) / 1000

        if (dt > 0.001) {
          const rawVx = (u - lastSample.x) / dt
          const rawVy = (v - lastSample.y) / dt

          velocity.x = velocity.x * VELOCITY_SMOOTHING + rawVx * (1 - VELOCITY_SMOOTHING)
          velocity.y = velocity.y * VELOCITY_SMOOTHING + rawVy * (1 - VELOCITY_SMOOTHING)

          const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
          if (speed > MAX_SPEED) {
            const scale = MAX_SPEED / speed
            velocity.x *= scale
            velocity.y *= scale
          }
        }

        lastSample.x = u
        lastSample.y = v
        lastSample.t = now

        cursorUV.x = u
        cursorUV.y = v
        cursorUV.initialized = true

        if (!lead.initialized) {
          lead.x = u
          lead.y = v
          lead.initialized = true
        }
      }

      const onMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY)
      const onTouchMove = (e: TouchEvent) => {
        const t = e.touches[0]
        if (t) handlePointer(t.clientX, t.clientY)
      }
      displayCanvas.addEventListener('mousemove', onMouseMove)
      displayCanvas.addEventListener('touchmove', onTouchMove, { passive: true })
      cleanupFns.push(() => {
        displayCanvas.removeEventListener('mousemove', onMouseMove)
        displayCanvas.removeEventListener('touchmove', onTouchMove)
      })

      // getContainRect replica object-fit:CONTAIN — el boceto se ancla al
      // mismo rectángulo que la imagen de fondo, aunque tengan tamaños
      // de archivo distintos.
      function getContainRect(imgW: number, imgH: number, canvasW: number, canvasH: number) {
        const imgRatio = imgW / imgH
        const canvasRatio = canvasW / canvasH

        let renderW: number
        let renderH: number
        if (canvasRatio > imgRatio) {
          renderH = canvasH
          renderW = canvasH * imgRatio
        } else {
          renderW = canvasW
          renderH = canvasW / imgRatio
        }

        return {
          dx: (canvasW - renderW) / 2,
          dy: (canvasH - renderH) / 2,
          dw: renderW,
          dh: renderH,
        }
      }

      const clock = new THREE.Clock()
      let lastFrameTime = performance.now()

      function animate() {
        raf = requestAnimationFrame(animate)

        const now = performance.now()
        const dt = Math.min((now - lastFrameTime) / 1000, 0.05)
        lastFrameTime = now

        if (cursorUV.initialized) {
          pushPoint(cursorUV.x, cursorUV.y, lastPushedReal)

          const targetX = cursorUV.x + velocity.x * LOOKAHEAD
          const targetY = cursorUV.y + velocity.y * LOOKAHEAD

          const ax = (targetX - lead.x) * SPRING_STIFFNESS - lead.vx * SPRING_DAMPING
          const ay = (targetY - lead.y) * SPRING_STIFFNESS - lead.vy * SPRING_DAMPING

          lead.vx += ax * dt
          lead.vy += ay * dt
          lead.x += lead.vx * dt
          lead.y += lead.vy * dt

          pushPoint(lead.x, lead.y, lastPushedLead)

          velocity.x *= VELOCITY_DECAY
          velocity.y *= VELOCITY_DECAY
        }

        trail = trail.filter((pt) => now - pt.birth < LIFESPAN * pt.lifeScale)

        for (let i = 0; i < trail.length; i++) {
          pointsData[i * 4 + 0] = trail[i].x
          pointsData[i * 4 + 1] = trail[i].y
          pointsData[i * 4 + 2] = trail[i].birth
          pointsData[i * 4 + 3] = trail[i].lifeScale
        }
        uniforms.uPointCount.value = trail.length

        uniforms.uTime.value = clock.getElapsedTime()
        uniforms.uNow.value = now

        renderer!.render(scene, camera)

        const cw = displayCanvas.width
        const ch = displayCanvas.height

        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, cw, ch)

        if (isMediaReady(baseMediaEl) && imageEl.complete && imageEl.naturalWidth) {
          const { width, height } = getMediaSize(baseMediaEl)
          const rect = getContainRect(width, height, cw, ch)
          ctx.drawImage(imageEl, rect.dx, rect.dy, rect.dw, rect.dh)
        }

        ctx.globalCompositeOperation = 'destination-in'
        ctx.drawImage(maskCanvas, 0, 0, cw, ch)
      }
      animate()

      cleanupFns.push(() => cancelAnimationFrame(raf))
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      cleanupFns.forEach((fn) => fn())
      renderer?.dispose()
    }
  }, [bgUrl, sketchUrl, maxPoints, lifespan, baseRadius, useVideoBackground])

  // ── Intro: líneas del titular suben desde abajo ─────────────────────────
  useGSAP(
    () => {
      const lines = headlineRef.current?.querySelectorAll('.line-inner')
      if (!lines || lines.length === 0) return
      gsap.set(lines, { y: '110%' })
      const tween = gsap.to(lines, {
        y: '0%',
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      })
      return () => {
        tween.kill()
      }
    },
    { scope: headlineRef, dependencies: [line1, line2] },
  )

  return (
    <section
      ref={stageRef}
      className={cn('relative w-full h-screen overflow-hidden', clName)}
      style={{ background: bgColor, color: textColor, cursor: 'crosshair' }}
    >
      {useVideoBackground
        ? bgVideoUrl && (
            <video
              ref={bgVideoRef}
              src={bgVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: 0,
              }}
            />
          )
        : bgImageUrl && (
            <img
              ref={bgImageRef}
              src={bgImageUrl}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: 0,
              }}
            />
          )}

      {/* Fuente para drawImage() — no se muestra directamente en el DOM */}
      {sketchUrl && <img ref={sketchImgRef} src={sketchUrl} alt="" style={{ display: 'none' }} />}

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, pointerEvents: 'all' }}
      />

      <div className={cn('absolute inset-0 z-20 flex flex-col p-[6vw] pointer-events-none', contentPositionClasses)}>
        {(line1 || line2) && (
          <h1
            ref={headlineRef}
            style={{
              fontSize: headingSize,
              fontWeight: headingWeight,
              fontFamily: headingFamily || undefined,
              lineHeight: headingLineHeight,
              letterSpacing: `${headingLetterSpacing}px`,
              color: headingColor,
              margin: '0 0 12px 0',
            }}
          >
            {line1 && (
              <span style={{ overflow: 'clip', display: 'block' }}>
                <span className="line-inner" style={{ display: 'block', transform: 'translateY(110%)', willChange: 'transform' }}>
                  {line1}
                </span>
              </span>
            )}
            {line2 && (
              <span style={{ overflow: 'clip', display: 'block' }}>
                <span className="line-inner" style={{ display: 'block', transform: 'translateY(110%)', willChange: 'transform' }}>
                  {line2}
                </span>
              </span>
            )}
          </h1>
        )}
        {subtitleText && (
          <div
            style={{
              fontSize: subtitleSize,
              fontWeight: subtitleWeight,
              fontFamily: subtitleFamily || undefined,
              textTransform: 'uppercase',
              letterSpacing: subtitleLetterSpacing,
              color: subtitleColor,
              opacity: subtitleOpacity / 100,
              marginTop: 8,
            }}
          >
            {subtitleText}
          </div>
        )}
      </div>

      {hintText && (
        <div
          className="absolute top-6 right-6 z-30 pointer-events-none"
          style={{
            fontSize: hintSize,
            fontWeight: hintWeight,
            fontFamily: hintFamily || undefined,
            letterSpacing: hintLetterSpacing,
            color: hintColor,
            opacity: hintOpacity / 100,
          }}
        >
          {hintText}
        </div>
      )}
    </section>
  )
}

export default MaskReveal

// ─── Schema ────────────────────────────────────────────────────────────────

const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extrabold (800)' },
]

export const schema = createSchema({
  type: 'mask-reveal',
  title: 'Mask Reveal (trazo hover)',
  settings: [
    {
      group: 'Imágenes',
      inputs: [
        { type: 'switch', name: 'useVideoBackground', label: 'Usar vídeo en vez de imagen de fondo', defaultValue: false },
        {
          type: 'video',
          name: 'backgroundVideo',
          label: 'Vídeo de fondo',
          condition: (data: MaskRevealProps) => data.useVideoBackground === true,
        },
        {
          type: 'image',
          name: 'backgroundImage',
          label: 'Imagen de fondo (visible) — desktop',
          condition: (data: MaskRevealProps) => !data.useVideoBackground,
        },
        {
          type: 'image',
          name: 'backgroundImageMobile',
          label: 'Imagen de fondo (visible) — mobile (opcional)',
          helpText: 'Si no se define, se usa la imagen de escritorio también en mobile.',
          condition: (data: MaskRevealProps) => !data.useVideoBackground,
        },
        { type: 'image', name: 'revealImage', label: 'Imagen revelada al pasar el ratón — desktop' },
        {
          type: 'image',
          name: 'revealImageMobile',
          label: 'Imagen revelada al pasar el ratón — mobile (opcional)',
          helpText: 'Si no se define, se usa la imagen de escritorio también en mobile.',
        },
      ],
    },
    {
      group: 'Titular',
      inputs: [
        { type: 'position', name: 'contentPosition', label: 'Posición del texto', defaultValue: 'bottom left' },
        { type: 'text', name: 'line1', label: 'Línea 1', defaultValue: 'No es un estilo, es una perspectiva.' },
        { type: 'text', name: 'line2', label: 'Línea 2', defaultValue: 'Porque Nada es Todo.' },
        { type: 'color', name: 'headingColor', label: 'Color', defaultValue: '#f4f2ee' },
        { type: 'text', name: 'headingSize', label: 'Tamaño (CSS)', defaultValue: 'clamp(28px, 5vw, 64px)' },
        { type: 'select', name: 'headingWeight', label: 'Weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '600' },
        { type: 'text', name: 'headingFamily', label: 'Fuente', placeholder: 'Hereda la fuente del tema' },
        { type: 'range', name: 'headingLetterSpacing', label: 'Espaciado de letras', defaultValue: -1, configs: { min: -5, max: 10, step: 0.5, unit: 'px' } },
        { type: 'range', name: 'headingLineHeight', label: 'Interlineado', defaultValue: 1.05, configs: { min: 0.8, max: 2, step: 0.05 } },
      ],
    },
    {
      group: 'Subtítulo',
      inputs: [
        { type: 'text', name: 'subtitleText', label: 'Texto', defaultValue: 'mueve el ratón sobre la imagen' },
        { type: 'color', name: 'subtitleColor', label: 'Color', defaultValue: '#f4f2ee' },
        { type: 'text', name: 'subtitleSize', label: 'Tamaño (CSS)', defaultValue: '14px' },
        { type: 'select', name: 'subtitleWeight', label: 'Weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '400' },
        { type: 'text', name: 'subtitleFamily', label: 'Fuente', placeholder: 'Hereda la fuente del tema' },
        { type: 'text', name: 'subtitleLetterSpacing', label: 'Espaciado de letras (CSS)', defaultValue: '0.12em' },
        { type: 'range', name: 'subtitleOpacity', label: 'Opacidad', defaultValue: 70, configs: { min: 0, max: 100, step: 5, unit: '%' } },
      ],
    },
    {
      group: 'Texto de ayuda (esquina superior derecha)',
      inputs: [
        { type: 'text', name: 'hintText', label: 'Texto', defaultValue: 'hover para trazar' },
        { type: 'color', name: 'hintColor', label: 'Color', defaultValue: '#f4f2ee' },
        { type: 'text', name: 'hintSize', label: 'Tamaño (CSS)', defaultValue: '12px' },
        { type: 'select', name: 'hintWeight', label: 'Weight', configs: { options: WEIGHT_OPTIONS }, defaultValue: '400' },
        { type: 'text', name: 'hintFamily', label: 'Fuente', placeholder: 'Hereda la fuente del tema' },
        { type: 'text', name: 'hintLetterSpacing', label: 'Espaciado de letras (CSS)', defaultValue: '0.04em' },
        { type: 'range', name: 'hintOpacity', label: 'Opacidad', defaultValue: 50, configs: { min: 0, max: 100, step: 5, unit: '%' } },
      ],
    },
    {
      group: 'Estilo general',
      inputs: [
        { type: 'color', name: 'bgColor', label: 'Color de fondo', defaultValue: '#0a0a0a' },
        { type: 'color', name: 'textColor', label: 'Color de texto (fallback)', defaultValue: '#f4f2ee' },
        { type: 'text', name: 'clName', label: 'className' },
      ],
    },
    {
      group: 'Efecto (avanzado)',
      inputs: [
        { type: 'range', name: 'maxPoints', label: 'Puntos del trazo', defaultValue: 30, configs: { min: 10, max: 60, step: 2 } },
        { type: 'range', name: 'lifespan', label: 'Duración del trazo (ms)', defaultValue: 900, configs: { min: 300, max: 2000, step: 50 } },
        { type: 'range', name: 'baseRadius', label: 'Grosor del trazo', defaultValue: 0.045, configs: { min: 0.01, max: 0.12, step: 0.005 } },
      ],
    },
  ],
  presets: {
    useVideoBackground: false,
    contentPosition: 'bottom left',
    line1: 'No es un estilo, es una perspectiva.',
    line2: 'Porque Nada es Todo.',
    headingColor: '#f4f2ee',
    headingSize: 'clamp(28px, 5vw, 64px)',
    headingWeight: '600',
    headingLetterSpacing: -1,
    headingLineHeight: 1.05,
    subtitleText: 'mueve el ratón sobre la imagen',
    subtitleColor: '#f4f2ee',
    subtitleSize: '14px',
    subtitleWeight: '400',
    subtitleLetterSpacing: '0.12em',
    subtitleOpacity: 70,
    hintText: 'hover para trazar',
    hintColor: '#f4f2ee',
    hintSize: '12px',
    hintWeight: '400',
    hintLetterSpacing: '0.04em',
    hintOpacity: 50,
    bgColor: '#0a0a0a',
    textColor: '#f4f2ee',
    maxPoints: 30,
    lifespan: 900,
    baseRadius: 0.045,
  },
})
