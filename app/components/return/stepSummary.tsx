import { useFetcher } from "react-router"
import { cn } from "~/utils/cn"
import { useLanguage } from "~/hooks/useLanguage"
import { translations } from "~/utils/translations"
import { BackButton, BARPROGRESS, ProgressBar, useOrder } from "./DesistimientoForm"
import { Image } from "../image"
import { useEffect, useState } from "react"

export function StepSummary({
  onBack,
  onCreateNew,
  onViewRma
}: {
  onBack: () => void
  onCreateNew: () => void
  onViewRma: () => void
}) {
  const lang = useLanguage()
  const t = translations[lang] ?? translations["ES"]

  const [progressData, setProgressData] = useState({ progress: null, state: "", tag: "" })
  const [confirmCancel, setConfirmCancel] = useState(false)

  const order = useOrder(state => state.order)
  const checkExist = useOrder(state => state.existingRequest)
const setProductDetail = useOrder(state => state.setProductDetail)

  const cancelFetcher = useFetcher()
  const cancelData = cancelFetcher.data as { success?: boolean; error?: string } | undefined
  const isCanceling = cancelFetcher.state !== "idle"
  const cancelDone = cancelData?.success === true

  const date = new Date(order.createdAt)
  const isCancelled = Boolean(order.cancelledAt)
  const isUnfulfilled = order.displayFulfillmentStatus === "UNFULFILLED"
  const canCancel = isUnfulfilled

  useEffect(() => {
    if (checkExist) {
      const barProgress = BARPROGRESS.find(elm => elm.id === checkExist.state)
      if (!barProgress) return
      const progreso = barProgress.id === "Completada" ? "complete" : barProgress.id === "Rechazada" ? "fail" : "progress"
      setProgressData({ progress: barProgress.progress, state: progreso, tag: barProgress.id })
    }
  }, [checkExist])

  function handleCancel() {
    const formData = new FormData()
    formData.append("_action", "cancel")
    formData.append("orderId", order.id)
    cancelFetcher.submit(formData, { method: "POST", action: "/api/desistimiento" })
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <BackButton onClick={onBack} />
        <div className="text-center flex-1">
          <h1 className="font-[Outfit] font-extrabold text-2xl md:text-[2rem] uppercase tracking-wider">
            {t.rma_title} {order.name}
          </h1>
          <p className="text-[0.78rem] text-zinc-600 mt-1">{date.toDateString()}</p>
        </div>
        {!isCancelled && (
          <button
            type="button"
            onClick={onCreateNew}
            className="font-[Outfit] font-semibold text-[11px] tracking-[2px] uppercase text-white bg-transparent border border-white/15 rounded-full px-4 py-[0.7rem] cursor-pointer whitespace-nowrap hover:bg-white hover:text-[#050505] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 flex-shrink-0"
          >
            {t.rma_createBtn}
          </button>
        )}
        {isCancelled && <div className="flex-shrink-0 w-[130px]" />}
      </div>

      {/* Cancelled order notice */}
      {isCancelled && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-zinc-400">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <p className="font-[Outfit] font-semibold text-[0.82rem] tracking-[2px] uppercase text-zinc-500 mb-2">
            {t.rma_orderCancelledTitle}
          </p>
          <p className="font-[Outfit] text-[0.92rem] text-zinc-300 max-w-[340px] leading-relaxed">
            {t.rma_orderCancelledText}
          </p>
          {order.cancelledAt && (
            <p className="mt-3 font-[Outfit] text-[0.78rem] text-zinc-600">
              {t.rma_cancelledOn} {new Date(order.cancelledAt).toLocaleDateString(t.rma_cancelledOnLocale, { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      )}

      {/* Cancel banner — only when unfulfilled AND all items have return requests */}
      {!isCancelled && canCancel && !cancelDone && (
        <div className="mb-6 bg-red-500/[0.08] border border-red-500/30 rounded-lg p-5">
          <p className="font-[Outfit] font-semibold text-[0.82rem] tracking-[1px] uppercase text-red-400 mb-1">
            {t.rma_cancelledBannerTitle}
          </p>
          <p className="font-[Outfit] text-[0.88rem] text-zinc-300 leading-relaxed mb-4">
            {t.rma_cancelledBannerText}
          </p>
          {!confirmCancel ? (
            <button
              type="button"
              onClick={() => setConfirmCancel(true)}
              className="font-[Outfit] font-semibold text-[0.82rem] tracking-[2px] uppercase px-5 py-2.5 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all duration-300 cursor-pointer"
            >
              {t.rma_cancelOrderBtn}
            </button>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <p className="font-[Outfit] text-[0.82rem] text-zinc-400 w-full mb-1">
                {t.rma_cancelConfirmText}
              </p>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCanceling}
                className="font-[Outfit] font-semibold text-[0.82rem] tracking-[2px] uppercase px-5 py-2.5 rounded-full bg-red-500/20 border border-red-500/60 text-red-300 hover:bg-red-500/35 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCanceling ? t.rma_cancellingBtn : t.rma_cancelYesBtn}
              </button>
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="font-[Outfit] text-[0.82rem] tracking-[1px] uppercase px-5 py-2.5 rounded-full border border-white/15 text-zinc-400 hover:border-white/30 hover:text-white transition-all duration-300 cursor-pointer"
              >
                {t.rma_backBtn}
              </button>
            </div>
          )}
          {cancelData?.error && (
            <p className="mt-3 text-[0.82rem] text-red-400">{cancelData.error}</p>
          )}
        </div>
      )}

      {!isCancelled && cancelDone && (
        <div className="mb-6 bg-green-500/[0.08] border border-green-500/30 rounded-lg p-5">
          <p className="font-[Outfit] font-semibold text-[0.82rem] tracking-[1px] uppercase text-green-400 mb-1">
            {t.rma_cancelSuccessTitle}
          </p>
          <p className="font-[Outfit] text-[0.88rem] text-zinc-300 leading-relaxed">
            {t.rma_cancelSuccessText}
          </p>
        </div>
      )}

      {!isCancelled && order.lineItems.edges.map((rma, index) => {
        const exist = checkExist ? rma.node.product.id === checkExist.producto_return : false

        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (exist) {
                setProductDetail(rma.node.product.id)
                onViewRma()
              } else {
                onCreateNew()
              }
            }}
            className="w-full relative flex flex-col text-left bg-white/[0.02] border border-white/[0.07] rounded-lg p-5 mb-3 transition-all duration-[350ms] hover:border-white/15 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] group"
          >
            <div className="flex items-center gap-4 justify-between w-full">
              <div className="w-14 h-14 rounded-md bg-[#0A0A0A] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                <Image data={rma.node.image} sizes="auto" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[Outfit] font-semibold text-[0.95rem] mt-1 tracking-[0.5px]">
                  {rma.node.title}
                </p>
                <span className="block font-[Outfit] text-[10px] tracking-[2px] uppercase text-zinc-600">
                  {rma.node.discountedUnitPriceAfterAllDiscountsSet.shopMoney.amount} {rma.node.discountedUnitPriceAfterAllDiscountsSet.shopMoney.currencyCode}
                </span>
                {exist && (
                  <span
                    className="py-1 px-2 text-sm rounded-full bg-white text-black absolute right-6 top-3"
                    style={{
                      background: progressData.state === "complete" ? "#4aaf41" : progressData.state === "fail" ? "#c11313" : "white",
                      color: progressData.state === "progress" ? "#050505" : "white",
                    }}
                  >
                    {progressData.tag}
                  </span>
                )}
              </div>
              <span className="text-zinc-600 text-xl group-hover:translate-x-1 group-hover:text-white transition-all duration-300">
                ›
              </span>
            </div>
            <div className="mt-4">
              {exist && <ProgressBar progress={progressData.progress} approved={progressData.state} />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
