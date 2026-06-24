import { cn } from "~/utils/cn";
import { useLanguage } from "~/hooks/useLanguage";
import { interpolate, translations } from "~/utils/translations";
import { BackButton, BARPROGRESS, MailIcon, PinIcon, ProgressBar, useOrder, UserIcon } from "./DesistimientoForm";
import { Image } from "../image";

export function StepDetail({ onBack }: { onBack: () => void }) {
  const lang = useLanguage();
  const t = translations[lang] ?? translations["ES"];

  const order = useOrder(state => state.order)
  const productDetail = useOrder(state => state.productDetail)
  const existingRequest = useOrder(state => state.existingRequest)

  const selectedLine = order?.lineItems.edges.find(
    e => e.node.product.id === productDetail
  )?.node

  const barEntry = existingRequest?.state
    ? BARPROGRESS.find(b => b.id === existingRequest.state)
    : null
  const progressState = barEntry?.id === "Completada" ? "complete"
    : barEntry?.id === "Rechazada" ? "fail"
    : barEntry ? "progress" : ""
  const progressValue = barEntry?.progress ?? 0

  const date = new Date(order.createdAt)
  const unitPrice = selectedLine
    ? parseFloat(selectedLine.discountedUnitPriceAfterAllDiscountsSet.shopMoney.amount)
    : 0
  const grossRefund = unitPrice * (selectedLine?.quantity ?? 0)
  const managementFee = existingRequest?.motivo === "Producto defectuoso" ? 0 : 45
  const finalRefund = Math.max(0, grossRefund - managementFee).toFixed(2)
  const currencyCode = selectedLine?.discountedUnitPriceAfterAllDiscountsSet.shopMoney.currencyCode ?? "EUR"
  const currencySymbol = currencyCode === "EUR" ? "€" : currencyCode

  return (
    <div className="max-w-[960px] mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <BackButton onClick={onBack} />
        <div className="text-center flex-1">
          <h1 className="font-[Outfit] font-extrabold text-[1.7rem] uppercase tracking-[3px]">
            {order.name}
          </h1>
          <p className="text-[0.78rem] text-zinc-600 mt-1">{date.toLocaleDateString()}</p>
        </div>
        <div className="w-[42px] flex-shrink-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-5">
        {/* Left */}
        <div>
          {/* Status card */}
          <section className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-[1.6rem] mb-5">
            <h2 className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-4">
              {t.rma_detailStatusTitle}
            </h2>
            <p
              className={cn(
                'font-[Outfit] font-semibold text-[1.05rem] mb-3 tracking-[0.5px]',
                progressState === "complete" && 'text-[#4aaf41]',
                progressState === "fail" && 'text-[#c11313]',
              )}
            >
              {existingRequest?.state ?? "Solicitada"}
            </p>
            <div className="mb-3">
              <ProgressBar progress={progressValue} approved={progressState} />
            </div>
            <p className="text-[0.85rem] text-zinc-400 font-light leading-relaxed">
              {t.rma_detailStatusHint}
            </p>
          </section>

          {/* Items card */}
          <section className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-[1.6rem] mb-5">
            <h2 className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-5">
              {t.rma_detailItemsTitle}
            </h2>
            {selectedLine ? (
              <div className="flex items-start gap-4 pb-5 border-b border-white/[0.07] mb-5">
                <div className="w-[60px] h-[60px] rounded-md bg-[#0A0A0A] border border-white/[0.07] overflow-hidden flex items-center justify-center flex-shrink-0">
                  {selectedLine.image && (
                    <Image data={selectedLine.image} sizes="60px" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-[Outfit] font-semibold text-[0.95rem]">{selectedLine.title}</p>
                  {existingRequest?.motivo && (
                    <p className="text-[0.82rem] text-zinc-600 mt-1 italic">{t.rma_detailMotivo} {existingRequest.motivo}</p>
                  )}
                </div>
                <span className="font-[Outfit] font-semibold text-[0.9rem] text-zinc-400 whitespace-nowrap">
                  {selectedLine.discountedUnitPriceAfterAllDiscountsSet.shopMoney.amount} {currencySymbol}
                </span>
              </div>
            ) : (
              <p className="text-[0.85rem] text-zinc-600 pb-5 mb-5 border-b border-white/[0.07]">
                {t.rma_detailNoProduct}
              </p>
            )}
            <div>
              <h3 className="font-[Outfit] font-semibold text-[11px] tracking-[2px] uppercase text-zinc-600 mb-2">
                {t.rma_detailReturnMethodTitle}
              </h3>
              <p className="text-[0.85rem] text-zinc-400 leading-relaxed">
                <strong className="text-white font-medium">{t.rma_detailReturnMethodText}</strong>{' '}
                {t.rma_detailReturnMethodSubtext}
              </p>
            </div>
          </section>

          {/* Contact card */}
          <section className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-[1.6rem]">
            <h2 className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-4">
              {t.rma_detailContactTitle}
            </h2>
            <div className="flex items-center gap-3 text-[0.86rem] text-zinc-400 mb-3">
              <UserIcon className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </div>
            <div className="flex items-center gap-3 text-[0.86rem] text-zinc-400 mb-3">
              <MailIcon className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              {order.email}
            </div>
            <div className="flex items-center gap-3 text-[0.86rem] text-zinc-400">
              <PinIcon className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              {order.shippingAddress.address1}, {order.shippingAddress.city}, {order.shippingAddress.country}
            </div>
          </section>
        </div>

        {/* Right */}
        <div>
          <section className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-[1.6rem]">
            <h2 className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-4">
              {t.rma_detailSummaryTitle}
            </h2>
            {selectedLine && (
              <div className="flex justify-between items-center text-[0.88rem] text-zinc-400 py-2">
                <span>{interpolate(t.rma_detailItemsToReturn, { quantity: selectedLine.quantity })}</span>
                <span>{grossRefund.toFixed(2)} {currencySymbol}</span>
              </div>
            )}
            {managementFee > 0 && (
              <div className="flex justify-between items-center text-[0.88rem] text-amber-400/80 py-2">
                <span>{t.rma_detailManagementFee}</span>
                <span>- {managementFee.toFixed(2)} {currencySymbol}</span>
              </div>
            )}
            <div className="border-t border-white/[0.07] my-1" />
            <div className="flex justify-between items-baseline pt-3">
              <span className="font-[Outfit] font-semibold text-[0.85rem] tracking-wide uppercase">
                {t.rma_detailTotalRefund}
              </span>
              <span className="font-[Outfit] font-extrabold text-[1.3rem] [text-shadow:0_0_18px_rgba(255,255,255,0.2)]">
                {finalRefund} {currencySymbol}
              </span>
            </div>
            <p className="text-[0.78rem] text-zinc-600 text-right mt-1">
              {t.rma_detailRefundMethod}
            </p>
            <p className="text-[0.72rem] text-zinc-600 leading-relaxed mt-4">
              {t.rma_detailDisclaimer}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
