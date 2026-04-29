import { createSchema, type HydrogenComponentProps, type InspectorGroup } from "@weaverse/hydrogen";
import { useEffect, useRef, forwardRef } from "react";

export interface NetworkBackgroundProps {
  activeNetwork:boolean;
  particleColor: string;
  lineColor: string;
  particleOpacity: number;
  interactiveRadius: number;
  velocity: number;
  numberParticles:number;
}

const NetworkBackground = forwardRef<HTMLDivElement, NetworkBackgroundProps>((props, ref) => {
  const { particleColor, lineColor, particleOpacity, interactiveRadius, velocity,activeNetwork,numberParticles } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;
    let mouse = { x: undefined as number | undefined, y: undefined as number | undefined, radius: interactiveRadius };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0.1 } // Se considera visible si al menos 10% está en pantalla
    );
    
    observer.observe(container);

    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      init();
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Solo actualizar si el mouse está realmente dentro del contenedor
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
      }
    };
    const handleMouseLeave = () => {
      mouse.x = undefined;
      mouse.y = undefined;
    };

    class Particle {
      x: number; y: number; directionX: number; directionY: number; size: number;
      constructor(x: number, y: number, directionX: number, directionY: number, size: number) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = particleOpacity / 100;
        ctx.fill();
      }
      update() {
        if (this.x > canvas!.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas!.height || this.y < 0) this.directionY = -this.directionY;

        if (mouse.x !== undefined && mouse.y !== undefined) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            this.x += dx * 0.01;
            this.y += dy * 0.01;
          }
        }
        this.x += this.directionX * velocity;
        this.y += this.directionY * velocity;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      let numberOfParticles = numberParticles;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 0.5;
        let x = Math.random() * canvas!.width;
        let y = Math.random() * canvas!.height;
        let directionX = Math.random() * 2 - 1;
        let directionY = Math.random() * 2 - 1;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    function connect() {
      if (!ctx) return;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
          if (distance < (canvas!.width / 7) * (canvas!.height / 7)) {
            let opacity = 1 - distance / 15000;
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = opacity * 0.2;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particlesArray.forEach(p => p.update());
      connect();
      animationFrameId = requestAnimationFrame(animate);
    }

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    handleResize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [particleColor, lineColor, particleOpacity, interactiveRadius, velocity]);

  return (
    <section 
      ref={containerRef} 
      className=" overflow-hidden  w-full h-full absolute inset-0 z-[1] flex flex-col items-center justify-center"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" 
      />
    </section>
  );
});

export default NetworkBackground;

export const networkBackgroundSettings:InspectorGroup[] = [
  {
    group: "Visuals",
    inputs: [
      {
        type: "color",
        label: "Particle Color",
        name: "particleColor",
        defaultValue: "#FFFFFF",
        condition:(data:NetworkBackgroundProps)=>data.activeNetwork ==true
      },
      {
        type: "color",
        label: "Line Color",
        name: "lineColor",
        defaultValue: "#FFFFFF",
        condition:(data:NetworkBackgroundProps)=>data.activeNetwork ==true
      },
      {
        type: "range",
        label: "Particle Opacity",
        name: "particleOpacity",
        configs: { min: 0, max: 100, step: 1, unit: "%" },
        defaultValue: 50,
        condition:(data:NetworkBackgroundProps)=>data.activeNetwork ==true
      },
      {
        type:'range',
        label:'number particles',
        name:'numberParticles',
        defaultValue:100,
        configs:{
          min:10,
          max:250,
          step:1,
          unit:'u',
        }
      },
    ],
  },
  {
    group: "Dynamics",
    inputs: [
      {
        type: "range",
        label: "Interaction Radius",
        name: "interactiveRadius",
        configs: { min: 50, max: 500, step: 10, unit: "px" },
        defaultValue: 150,
        condition:(data:NetworkBackgroundProps)=>data.activeNetwork ==true
      },
      {
        type: "range",
        label: "Velocity Multiplier",
        name: "velocity",
        configs: { min: 0.1, max: 5, step: 0.1 },
        defaultValue: 1,
        condition:(data:NetworkBackgroundProps)=>data.activeNetwork ==true
      },
    ],
  },
]
  
