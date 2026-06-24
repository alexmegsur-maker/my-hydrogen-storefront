import { useState } from "react"
import { useLanguage } from "~/hooks/useLanguage"
import { translations } from "~/utils/translations"
import { useOrder } from "./DesistimientoForm"

export function StepLogin({ onSearch }: { onSearch: () => void }) {
  const lang = useLanguage()
  const t = translations[lang] ?? translations["ES"]

  const [orderNumber, setOrderNumber] = useState("")
  const [correo, setCorreo] = useState("")
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [touched, setTouched] = useState({ order: false, email: false })

  const setOrder = useOrder(state => state.setOrder)

  function validateOrderNumber(value: string) {
    if (!value.trim()) return t.rma_valOrderRequired
    if (!/^\d+$/.test(value.trim())) return t.rma_valOrderOnlyNumbers
    if (parseInt(value, 10) <= 0) return t.rma_valOrderInvalid
    return null
  }

  function validateEmail(value: string) {
    if (!value.trim()) return t.rma_valEmailRequired
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return t.rma_valEmailInvalid
    return null
  }

  const getOrder = async () => {
    const oErr = validateOrderNumber(orderNumber)
    const eErr = validateEmail(correo)
    setOrderError(oErr)
    setEmailError(eErr)
    setTouched({ order: true, email: true })
    if (oErr || eErr) return

    setLoading(true)
    setApiError(null)

    try {
      const params = new URLSearchParams({ order: orderNumber.trim(), email: correo.trim() })
      const res = await fetch(`/api/order-lookup?${params}`)
      const data = await res.json() as any

      if (!res.ok) {
        setApiError(data.error ?? t.rma_networkError)
        return
      }
      setOrder(data.order, data.existingRequest ?? null, data.existingRequests ?? [])
      onSearch()
    } catch {
      setApiError(t.rma_networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <span className="inline-flex items-center gap-2 text-[11px] tracking-[4px] uppercase text-zinc-400 mb-4">
        <span className="w-[7px] h-[7px] bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
        {t.rma_tagline}
      </span>

      <h1 className="font-[Outfit] font-extrabold text-3xl md:text-[2.8rem] uppercase tracking-wider mb-3">
        {t.rma_title}
      </h1>
      <p className="text-zinc-400 font-light max-w-[460px] text-[0.95rem] leading-relaxed mb-10">
        {t.rma_description}
      </p>

      <div className="w-full max-w-[440px] bg-[#0A0A0A]/85 border border-white/15 rounded-md backdrop-blur-[15px] p-[2.2rem] text-left shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
        <h2 className="font-[Outfit] font-semibold text-center text-[1.15rem] uppercase tracking-wide mb-6">
          {t.rma_cardTitle}
        </h2>

        {/* Order number */}
        <div className="mb-[1.1rem]">
          <label htmlFor="rma-order" className="block font-[Outfit] text-[10px] tracking-[2px] uppercase text-zinc-600 mb-2">
            {t.rma_orderLabel}
          </label>
          <input
            id="rma-order"
            type="text"
            inputMode="numeric"
            placeholder="1048"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value)
              if (touched.order) setOrderError(validateOrderNumber(e.target.value))
            }}
            onBlur={() => {
              setTouched(t => ({ ...t, order: true }))
              setOrderError(validateOrderNumber(orderNumber))
            }}
            autoComplete="off"
            className={`w-full bg-white/[0.03] border text-white text-[0.95rem] px-4 py-[0.85rem] rounded focus:outline-none focus:shadow-[0_0_0_1px_white,0_0_18px_rgba(255,255,255,0.18)] focus:bg-white/[0.05] transition-all duration-300 placeholder:text-zinc-600 ${
              orderError
                ? "border-red-500/60 focus:border-red-400"
                : "border-white/15 focus:border-white"
            }`}
          />
          {orderError && (
            <p className="mt-1.5 text-[0.78rem] text-red-400">{orderError}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-[1.1rem]">
          <label htmlFor="rma-email" className="block font-[Outfit] text-[10px] tracking-[2px] uppercase text-zinc-600 mb-2">
            {t.rma_emailLabel}
          </label>
          <input
            id="rma-email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="off"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value)
              if (touched.email) setEmailError(validateEmail(e.target.value))
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, email: true }))
              setEmailError(validateEmail(correo))
            }}
            className={`w-full bg-white/[0.03] border text-white text-[0.95rem] px-4 py-[0.85rem] rounded focus:outline-none focus:shadow-[0_0_0_1px_white,0_0_18px_rgba(255,255,255,0.18)] focus:bg-white/[0.05] transition-all duration-300 placeholder:text-zinc-600 ${
              emailError
                ? "border-red-500/60 focus:border-red-400"
                : "border-white/15 focus:border-white"
            }`}
          />
          {emailError && (
            <p className="mt-1.5 text-[0.78rem] text-red-400">{emailError}</p>
          )}
        </div>

        {/* API error */}
        {apiError && (
          <p className="text-[0.82rem] text-red-400 text-center mb-4 leading-relaxed">{apiError}</p>
        )}

        <button
          type="button"
          onClick={getOrder}
          disabled={loading}
          className="w-full bg-white text-[#050505] border-none rounded-full font-[Outfit] font-semibold text-[0.85rem] tracking-[2px] uppercase py-4 cursor-pointer hover:shadow-[0_0_25px_rgba(255,255,255,0.55)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          {loading ? t.rma_searching : t.rma_searchBtn}
        </button>

        <div className="mt-[1.8rem] text-center">
          <p className="text-[0.78rem] text-zinc-600 leading-relaxed mb-3">
            {t.rma_footerHint}
          </p>
          <a
            href="https://phoenixchairs.eu/devolucion"
            className="font-[Outfit] text-[11px] tracking-[2px] uppercase text-zinc-400 border-b border-white/15 pb-0.5 hover:text-white hover:border-white transition-all duration-300"
          >
            {t.rma_policyLink}
          </a>
        </div>
      </div>
    </div>
  )
}
