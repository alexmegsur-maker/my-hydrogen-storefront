import { cn } from "~/utils/cn";
import { BackButton, InfoIcon, ItemThumb } from "./DesistimientoForm";

export function StepCreate({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const returnableItems = MOCK_ITEMS.filter((i) => i.canReturn)
  const lockedItems = MOCK_ITEMS.filter((i) => !i.canReturn)
  const hasSelection = selected.size > 0

  return (
    <div className="max-w-[620px] mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <BackButton onClick={onBack} />
        <div className="text-center flex-1">
          <h1 className="font-[Outfit] font-extrabold text-[1.6rem] uppercase tracking-[1.5px]">
            ¿Qué quieres devolver?
          </h1>
        </div>
        <div className="w-[42px] flex-shrink-0" />
      </div>

      {/* Available items */}
      <p className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-3 mt-6">
        Artículos disponibles
      </p>
      {/* {returnableItems.map((item) => { */}
        const isSelected = selected.has(item.id)
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className={cn(
              'w-full text-left flex items-center gap-4 px-5 py-4 bg-white/[0.02] border rounded-lg mb-3 cursor-pointer transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]',
              isSelected
                ? 'border-white shadow-[0_0_18px_rgba(255,255,255,0.15)] bg-white/[0.05]'
                : 'border-white/[0.07]',
            )}
          >
            <span
              className={cn(
                'w-[22px] h-[22px] border rounded flex-shrink-0 flex items-center justify-center transition-all duration-200',
                isSelected ? 'bg-white border-white' : 'border-white/15',
              )}
            >
              {isSelected && (
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#050505" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <ItemThumb />
            <div className="flex-1 min-w-0">
              <p className="font-[Outfit] font-semibold text-[0.92rem]">{item.name}</p>
              <p className="text-[0.8rem] text-zinc-400 mt-0.5">{item.variant}</p>
              <p className="font-[Outfit] font-semibold text-[0.85rem] text-zinc-400 mt-1">
                {item.price} · x{item.qty}
              </p>
            </div>
          </button>
        )
      })}

      {/* Locked items */}
      {lockedItems.length > 0 && (
        <>
          <p className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-3 mt-6">
            Artículos no retornables
          </p>
          <a
            href="#"
            className="font-[Outfit] text-[11px] tracking-[2px] uppercase text-zinc-600 flex items-center gap-1 mb-3 hover:text-white transition-colors duration-300"
          >
            Ver política de desistimiento ›
          </a>
          {lockedItems.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-4 px-5 py-4 bg-white/[0.02] border border-white/[0.07] rounded-lg mb-2 opacity-50 cursor-not-allowed">
                <ItemThumb />
                <div className="flex-1">
                  <p className="font-[Outfit] font-semibold text-[0.92rem] text-zinc-600">{item.name}</p>
                  <p className="text-[0.8rem] text-zinc-600 mt-0.5">{item.variant}</p>
                  <p className="font-[Outfit] font-semibold text-[0.85rem] text-zinc-600 mt-1">
                    {item.price} · x{item.qty}
                  </p>
                </div>
              </div>
              {item.returnReason && (
                <div className="flex items-center gap-1.5 text-[0.78rem] text-zinc-600 mb-4 ml-1">
                  <InfoIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.returnReason}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      <div className="mt-8">
        <button
          type="button"
          onClick={hasSelection ? onNext : undefined}
          className={cn(
            'w-full rounded-full font-[Outfit] font-semibold text-[0.85rem] tracking-[2px] uppercase py-4 transition-all duration-300',
            hasSelection
              ? 'bg-white text-[#050505] cursor-pointer hover:shadow-[0_0_25px_rgba(255,255,255,0.55)] hover:-translate-y-0.5'
              : 'bg-white/[0.12] text-zinc-600 cursor-not-allowed pointer-events-none',
          )}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}