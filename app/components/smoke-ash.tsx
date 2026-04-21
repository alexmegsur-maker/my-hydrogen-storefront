import React, { useEffect, useRef } from "react";
import { type InspectorGroup } from "@weaverse/hydrogen";

export interface ForgeCanvasProps {
  // Smoke particles
  showSmoke:boolean;
  smokeCount: number;
  smokeOpacityMin: number;
  smokeOpacityMax: number;
  smokeSizeMin: number;
  smokeSizeMax: number;
  smokeSpeedMin: number;
  smokeSpeedMax: number;
  smokeColor: string;

  // Ember particles
  emberCount: number;
  emberOpacityMin: number;
  emberOpacityMax: number;
  emberSizeMin: number;
  emberSizeMax: number;
  emberSpeedMin: number;
  emberSpeedMax: number;
  emberColor: string;

  // Silhouette
  showSilhouette: boolean;
  silhouetteUrl: string;
  silhouetteOpacity: number;

  // Canvas positioning
  zIndex: number;
  canvasOpacity: number;
}

type ParticleConfig = Omit<ForgeCanvasProps, 'showSilhouette' | 'silhouetteUrl' | 'silhouetteOpacity' | 'zIndex' | 'canvasOpacity'>;

function hexToRgb(hex: string): string {
  if (!hex || typeof hex !== 'string') return "255,255,255";
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `${r},${g},${b}`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `${r},${g},${b}`;
  }
  return "255,255,255";
}

function runCanvas(canvas: HTMLCanvasElement, config: ParticleConfig, signal: AbortSignal) {
  const ctx = canvas.getContext("2d")!;
  let width = 0;
  let height = 0;
  let rafId = 0;

  const smokeRgb = hexToRgb(config.smokeColor);
  const emberRgb = hexToRgb(config.emberColor);

  function resize() {
    const parent = canvas.parentElement;
    width = parent ? parent.offsetWidth : window.innerWidth;
    height = parent ? parent.offsetHeight : window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  const resizeHandler = () => resize();
  window.addEventListener("resize", resizeHandler);
  resize();
  const sSizeMin = Number(config.smokeSizeMin) || 150;
  const sSizeMax = Number(config.smokeSizeMax) || 450;
  const sSpeedMin = Number(config.smokeSpeedMin) || 0.2;
  const sSpeedMax = Number(config.smokeSpeedMax) || 0.7;
  const sOpacityMin = Number(config.smokeOpacityMin) || 0.01;
  const sOpacityMax = Number(config.smokeOpacityMax) || 0.05;

  class Smoke {
    x = 0; y = 0; size = 0; speedY = 0; opacity = 0;
    constructor() { this.reset(true); }
    reset(randomY = false) {
      this.x = Math.random() * width;
      this.y = randomY ? Math.random() * height : height + 100;
      
      // Usamos las variables locales blindadas
      this.size = Math.random() * (sSizeMax - sSizeMin) + sSizeMin;
      this.speedY = -(Math.random() * (sSpeedMax - sSpeedMin) + sSpeedMin);
      this.opacity = Math.random() * (sOpacityMax - sOpacityMin) + sOpacityMin;

      // Validación final: si algo falló, forzamos números finitos
      if (!isFinite(this.size)) this.size = 100;
      if (!isFinite(this.x)) this.x = 0;
      if (!isFinite(this.y)) this.y = 0;
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.5;
      if (this.y < -this.size) this.reset();
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      g.addColorStop(0, `rgba(${smokeRgb},${this.opacity})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Ember {
    x = 0; y = 0; size = 0; speedY = 0; opacity = 0;
    constructor() { this.reset(true); }
    reset(randomY = false) {
      this.x = Math.random() * width;
      this.y = randomY ? Math.random() * height : height + 10;
      this.size = Math.random() * 2  ;
      this.speedY = -(Math.random() * 2 + 1);
      this.opacity = Math.random() * 0.5 + 0.5;
    }
    update() { 
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.05) * 1;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.fillStyle = `rgba(${emberRgb},${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const smokes: Smoke[] = Array.from({ length: config.smokeCount }, () => new Smoke());
  const embers: Ember[] = Array.from({ length: config.emberCount }, () => new Ember());

  function animate() {
    if (signal.aborted) return;
    ctx.clearRect(0, 0, width, height);
    smokes.forEach((s) => { s.update(); s.draw(); });
    embers.forEach((e) => { e.update(); e.draw(); });
    rafId = requestAnimationFrame(animate);
  }
  animate();

  signal.addEventListener("abort", () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resizeHandler);
  });
}

export default function ForgeCanvas(props: ForgeCanvasProps) {
  const {
    smokeCount, smokeOpacityMin, smokeOpacityMax, smokeSizeMin, smokeSizeMax, smokeSpeedMin, smokeSpeedMax, smokeColor,
    emberCount, emberOpacityMin, emberOpacityMax, emberSizeMin, emberSizeMax, emberSpeedMin, emberSpeedMax, emberColor,
    showSilhouette, silhouetteUrl, silhouetteOpacity, zIndex, canvasOpacity
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const controller = new AbortController();
    runCanvas(
  canvasRef.current,
  {
    ...props,
    smokeColor: smokeColor || "#ffffff",
    emberColor: emberColor || "#ffffff",
  },
  controller.signal
);
    return () => controller.abort();
  }, [
    smokeCount, smokeOpacityMin, smokeOpacityMax, smokeSizeMin, smokeSizeMax, smokeSpeedMin, smokeSpeedMax, smokeColor,
    emberCount, emberOpacityMin, emberOpacityMax, emberSizeMin, emberSizeMax, emberSpeedMin, emberSpeedMax, emberColor,
  ]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: canvasOpacity }}
      />

      {showSilhouette && silhouetteUrl && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "700px",
            height: "80%",
            backgroundImage: `url('${silhouetteUrl}')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: silhouetteOpacity,
            filter: "grayscale(100%) contrast(1.2)",
          }}
        />
      )}
    </div>
  );
}

// --- Inputs para Weaverse Inspector ---

export const smokeInputs: InspectorGroup["inputs"] = [
  {
    type: "range",
    name: "smokeCount",
    label: "Particle Count",
    defaultValue: 30,
    configs: { min: 0, max: 80, step: 1 },
    condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),
    
  },
  {
    type: "color",
    name: "smokeColor",
    label: "Color",
    defaultValue: "#ffffff",
    condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),

  },
  {
    type: "range",
    name: "smokeSizeMax",
    label: "Max Size (px)",
    defaultValue: 450,
    configs: { min: 20, max: 800, step: 10 },
    condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),
  },
  {
    type: "range",
    name: "smokeOpacityMax",
    label: "Max Opacity",
    defaultValue: 0.05,
    configs: { min: 0, max: 1, step: 0.01 },
    condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),
  }
];

export const emberInputs: InspectorGroup["inputs"] = [
  {
    type: "range",
    name: "emberCount",
    label: "Particle Count",
    defaultValue: 50,
    configs: { min: 0, max: 200, step: 5 },
    condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),
  },
  {
    type: "color",
    name: "emberColor",
    label: "Color",
    defaultValue: "#ffffff",
    condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),
  },
  {
    type: "range",
    name: "emberSpeedMax",
    label: "Max Speed",
    defaultValue: 3,
    configs: { min: 0.1, max: 10, step: 0.1 },
    condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),
  }
];

export const forgeSettings: InspectorGroup[] = [
  {
    group: "Smoke Particles",
    inputs: smokeInputs,
  },
  {
    group: "Ember Particles",
    inputs: emberInputs,
  },
  {
    group: "Canvas Settings",
    inputs: [
      {
        type: "range",
        name: "canvasOpacity",
        label: "Overall Opacity",
        defaultValue: 1,
        configs: { min: 0, max: 1, step: 0.05 },
        condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),
      },
      {
        type: "range",
        name: "zIndex",
        label: "Z-index",
        defaultValue: 1,
        configs: { min: 0, max: 20, step: 1 },
        condition: (data: ForgeCanvasProps) => Boolean(data.showSmoke),
      }
    ]
  }
];