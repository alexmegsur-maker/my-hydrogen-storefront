import { useEffect, useRef, useState } from "react";

interface UseFreezeOnScrollOptions {
  threshold?: number;   // Cuánto del elemento debe verse (0 a 1)
  enabled?: boolean;     // Para activar/desactivar el hook desde las props
  once?: boolean;        // Si es true, una vez se activa no se vuelve a ocultar
}

export function useFreezeOnScroll<T extends HTMLElement = HTMLElement>(
  options: UseFreezeOnScrollOptions = {}
) {
  const { threshold = 0.2, enabled = true, once = true } = options;
  const ref = useRef<T>(null);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    // Si no está habilitado o no hay referencia, no hacemos nada
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFrozen(true);
          // Si solo queremos que se active una vez (tipo reveal), 
          // dejamos de observar para ahorrar recursos.
          if (once) {
            observer.unobserve(el);
          }
        } else {
          // Si quieres que el efecto se reinicie al hacer scroll hacia arriba
          if (!once) {
            setIsFrozen(false);
          }
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, enabled, once]);

  return { ref, isFrozen };
}