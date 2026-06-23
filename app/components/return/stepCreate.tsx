import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { cn } from "~/utils/cn";
import { Image } from "../image";
import { BackButton, CheckIcon, InfoIcon, useOrder } from "./DesistimientoForm";

export function StepCreate({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const order = useOrder(state => state.order)
  const setOrder = useOrder(state => state.setOrder)
  const setProductDetail = useOrder(state => state.setProductDetail)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [motivo, setMotivo] = useState("")
  const fetcher = useFetcher()

  const isSubmitting = fetcher.state !== "idle"
  const hasSelection = selectedId !== null
  const submitData = fetcher.data as { success?: boolean; error?: string } | undefined

  useEffect(() => {
    if (submitData?.success) {
      setProductDetail(selectedId!)
      setOrder(order, {
        state: "Solicitada",
        producto_return: selectedId!,
        motivo,
        pedido: order.name.replace("#", ""),
        correo: order.email,
      })
      onNext()
    }
  }, [submitData])

  function handleSubmit() {
    if (!hasSelection || isSubmitting) return
    const nombre = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim()
    const orderNumber = order.name.replace("#", "")
    const formData = new FormData()
    formData.append("_action", "submit")
    formData.append("orderNumber", orderNumber)
    formData.append("nombre", nombre)
    formData.append("correo", order.email)
    formData.append("producto_return", selectedId!)
    formData.append("motivo", motivo)
    fetcher.submit(formData, { method: "POST", action: "/api/desistimiento" })
  }

  return (
    <div className="max-w-[620px] mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <BackButton onClick={onBack} />
        <div className="text-center flex-1">
          <h1 className="font-[Outfit] font-extrabold text-[1.6rem] uppercase tracking-[1.5px]">
            ¿Qué quieres devolver?
          </h1>
          <p className="text-[0.78rem] text-zinc-600 mt-1">{order.name}</p>
        </div>
        <div className="w-[42px] flex-shrink-0" />
      </div>

      {/* Product list */}
      <p className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-3">
        Artículos del pedido
      </p>

      {order.lineItems.edges.map(({ node }, index) => {
        const isSelected = selectedId === node.product.id
        return (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedId(node.product.id)}
            className={cn(
              'w-full text-left flex items-center gap-4 px-5 py-4 bg-white/[0.02] border rounded-lg mb-3 cursor-pointer transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]',
              isSelected
                ? 'border-white shadow-[0_0_18px_rgba(255,255,255,0.12)] bg-white/[0.05]'
                : 'border-white/[0.07]',
            )}
          >
            {/* Checkbox */}
            <span
              className={cn(
                'w-[22px] h-[22px] border rounded flex-shrink-0 flex items-center justify-center transition-all duration-200',
                isSelected ? 'bg-white border-white' : 'border-white/15',
              )}
            >
              {isSelected && <CheckIcon className="w-3 h-3 text-[#050505]" />}
            </span>

            {/* Image */}
            <div className="w-[52px] h-[52px] rounded-md bg-[#0A0A0A] border border-white/[0.07] overflow-hidden flex-shrink-0">
              {node.image && (
                <Image data={node.image} sizes="52px" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-[Outfit] font-semibold text-[0.92rem]">{node.title}</p>
              <p className="font-[Outfit] text-[0.8rem] text-zinc-400 mt-0.5">
                {node.originalUnitPriceSet.shopMoney.amount} {node.originalUnitPriceSet.shopMoney.currencyCode} × {node.quantity}
              </p>
            </div>
          </button>
        )
      })}

      {/* Reason */}
      {hasSelection && (
        <div className="mt-6 mb-2">
          <label className="block font-[Outfit] text-[10px] tracking-[2px] uppercase text-zinc-600 mb-2">
            Motivo de la devolución
          </label>
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Describe brevemente el motivo..."
            rows={3}
            className="w-full bg-white/[0.03] border border-white/15 text-white text-[0.9rem] px-4 py-3 rounded resize-none focus:outline-none focus:border-white focus:shadow-[0_0_0_1px_white,0_0_18px_rgba(255,255,255,0.12)] focus:bg-white/[0.05] transition-all duration-300 placeholder:text-zinc-600"
          />
        </div>
      )}

      {/* API error */}
      {submitData?.error && (
        <div className="flex items-center gap-2 text-[0.82rem] text-red-400 mt-3">
          <InfoIcon className="w-4 h-4 flex-shrink-0" />
          {submitData.error}
        </div>
      )}

      {/* Submit */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasSelection || isSubmitting}
          className={cn(
            'w-full rounded-full font-[Outfit] font-semibold text-[0.85rem] tracking-[2px] uppercase py-4 transition-all duration-300',
            hasSelection && !isSubmitting
              ? 'bg-white text-[#050505] cursor-pointer hover:shadow-[0_0_25px_rgba(255,255,255,0.55)] hover:-translate-y-0.5'
              : 'bg-white/[0.12] text-zinc-600 cursor-not-allowed pointer-events-none',
          )}
        >
          {isSubmitting ? "Enviando..." : "Enviar solicitud"}
        </button>
      </div>

      <div className="mt-5 text-center">
        <a
          href="#"
          className="font-[Outfit] text-[11px] tracking-[2px] uppercase text-zinc-400 border-b border-white/15 pb-0.5 hover:text-white hover:border-white transition-all duration-300"
        >
          Ver política de desistimiento
        </a>
      </div>
    </div>
  )
}
