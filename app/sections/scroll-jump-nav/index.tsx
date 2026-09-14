import {
  createSchema,
  useChildInstances,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { ScrollStepButton } from "~/components/scroll-step-button";
import { useIsMobile } from "~/hooks/use-is-mobile";

interface ScrollJumpNavProps extends HydrogenComponentProps {
  enabled: boolean;
  loop: boolean;
  ticks: number;
  tickIntervalMs: number;
}

/**
 * Navegación por saltos con un único botón flotante (abajo a la derecha),
 * SIN engancharse a ninguna sección en particular: no mide contenedores, no
 * intercepta el scroll nativo, no sabe nada de `scrollChair`/`principal-banner`
 * /`sub-banner`. Se añade UNA vez en la página y funciona con cualquier
 * combinación de secciones con scroll largo que ya haya debajo.
 *
 * Cada "parada" es un subcomponente hijo (`scroll-jump-stop`) que solo
 * define una cantidad en vh. Al pulsar el botón, se dispara una ráfaga de
 * eventos `wheel` sintéticos (mismo mecanismo que un scroll de ratón real)
 * — Lenis los recoge con su propio listener de `wheel` y anima el scroll
 * exactamente como si el usuario hubiera girado la rueda, así que cualquier
 * `ScrollTrigger`/`scrub` que dependa de la posición real de scroll sigue
 * funcionando sin tocarlo. Un click = una parada; al llegar a la última,
 * vuelve a la primera (o se detiene, según `loop`).
 */
export default function ScrollJumpNav(props: ScrollJumpNavProps) {
  const { children, enabled = true, loop = true, ticks = 24, tickIntervalMs = 16 } = props;

  const isMobile = useIsMobile(700);
  const childInstances = useChildInstances();
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stops = useMemo(() => {
    return childInstances
      .filter((instance: any) => instance?.data?.type === "scroll-jump-stop")
      .map((instance: any) => Number(instance.data.amount))
      .filter((amount) => Number.isFinite(amount) && amount > 0);
  }, [childInstances]);

  function goNext() {
    if (!stops.length) return;

    const amountVh = stops[indexRef.current % stops.length];
    indexRef.current = loop
      ? (indexRef.current + 1) % stops.length
      : Math.min(indexRef.current + 1, stops.length - 1);

    const totalPx = (amountVh / 100) * window.innerHeight;
    const perTick = totalPx / ticks;

    if (timerRef.current) clearTimeout(timerRef.current);

    let fired = 0;
    function fireTick() {
      // Evento wheel sintético — el listener de Lenis (element.addEventListener
      // ("wheel", ...)) lo recoge igual que uno real y anima el scroll con su
      // propia inercia/easing, así que el salto se siente como un scroll de
      // ratón normal, no como un teletransporte.
      window.dispatchEvent(
        new WheelEvent("wheel", {
          deltaY: perTick,
          deltaMode: 0, // píxeles
          bubbles: true,
          cancelable: true,
        }),
      );
      fired += 1;
      if (fired < ticks) {
        timerRef.current = setTimeout(fireTick, tickIntervalMs);
      }
    }
    fireTick();
  }

  const showButton = enabled && isMobile && stops.length > 0;

  return (
    <>
      {children}
      {showButton && typeof document !== "undefined"
        ? createPortal(<ScrollStepButton visible onClick={goNext} />, document.body)
        : null}
    </>
  );
}

export const schema = createSchema({
  type: "scroll-jump-nav",
  title: "Botón de salto (scroll simulado)",
  limit: 1,
  childTypes: ["scroll-jump-stop"],
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "switch",
          label: "Mostrar botón",
          name: "enabled",
          defaultValue: true,
          helpText: "Solo aparece en mobile — abajo a la derecha, fijo mientras navegas la página.",
        },
        {
          type: "switch",
          label: "Volver a la primera parada al terminar",
          name: "loop",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Avanzado",
      inputs: [
        {
          type: "range",
          label: "Nº de \"ticks\" de rueda por salto",
          name: "ticks",
          defaultValue: 24,
          configs: { min: 4, max: 60, step: 1 },
          helpText: "Más ticks = salto más suave y largo en el tiempo.",
        },
        {
          type: "range",
          label: "Intervalo entre ticks (ms)",
          name: "tickIntervalMs",
          defaultValue: 16,
          configs: { min: 8, max: 60, step: 1 },
        },
      ],
    },
  ],
  presets: {
    children: [
      { type: "scroll-jump-stop" },
      { type: "scroll-jump-stop" },
      { type: "scroll-jump-stop" },
    ],
  },
});
