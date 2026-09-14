import { cn } from "~/utils/cn";

/**
 * Botón flotante "siguiente parada" — abajo a la derecha. A diferencia del
 * hint de scroll clásico (flecha + texto centrados, ligada al primer
 * viewport), este es un FAB circular que persiste fijo mientras dura el
 * recorrido de la sección, con un anillo pulsante invitando a pulsarlo.
 * Pensado para mobile: el scroll nativo queda libre, este botón es solo un
 * atajo directo a la siguiente parada.
 */
export function ScrollStepButton({
  visible,
  onClick,
  label = "Siguiente",
}: {
  visible: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed right-5 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full",
        "transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      {/* Anillo pulsante — invita a pulsar sin depender de texto */}
      <span className="absolute inset-0 rounded-full bg-white/25 animate-ping [animation-duration:2.2s]" />
      {/* Cuerpo del botón */}
      <span className="relative flex h-full w-full items-center justify-center rounded-full border border-white/30 bg-black/60 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-white"
        >
          <path d="M12 5v14" />
          <path d="m6 13 6 6 6-6" />
        </svg>
      </span>
    </button>
  );
}
