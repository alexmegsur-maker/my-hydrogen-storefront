import { useState } from "react"
import { useOrder } from "./DesistimientoForm"



export function StepLogin({ onSearch }: { onSearch: () => void }) {
  const [orderNumber, setOrderNumber] = useState("")
  const [correo, setCorreo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setOrder= useOrder(state=>state.setOrder)
   const getOrder = async () => {
    if (!orderNumber || !correo) {
      setError("Completa ambos campos")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ order: orderNumber, email: correo })
      const res = await fetch(`/api/order-lookup?${params}`)
      const data = await res.json() as any

      if (!res.ok) {
        setError(data.error ?? "No se encontró el pedido")
        return
      }
      console.log(data.order,data.existingRequest)
      setOrder(data.order, data.existingRequest ?? null)
      onSearch()

    } catch (e) {
      setError("Error de red, intenta de nuevo")
    } finally {
      setLoading(false)

    }
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <span className="inline-flex items-center gap-2 text-[11px] tracking-[4px] uppercase text-zinc-400 mb-4">
        <span className="w-[7px] h-[7px] bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
        Derecho de desistimiento · 14 días
      </span>

      <h1 className="font-[Outfit] font-extrabold text-3xl md:text-[2.8rem] uppercase tracking-wider mb-3">
        Devoluciones
      </h1>
      <p className="text-zinc-400 font-light max-w-[460px] text-[0.95rem] leading-relaxed mb-10">
        Localiza tu pedido para iniciar el desistimiento de tu compra. Conserva tu derecho durante 14 días naturales desde la recepción.
      </p>

      <div className="w-full max-w-[440px] bg-[#0A0A0A]/85 border border-white/15 rounded-md backdrop-blur-[15px] p-[2.2rem] text-left shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
        <h2 className="font-[Outfit] font-semibold text-center text-[1.15rem] uppercase tracking-wide mb-6">
          Localiza tu pedido
        </h2>

        <div className="mb-[1.1rem]">
          <label htmlFor="rma-order" className="block font-[Outfit] text-[10px] tracking-[2px] uppercase text-zinc-600 mb-2">
            Número de pedido
          </label>
          <input
            id="rma-order"
            type="number"
            placeholder="1048"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value);
            }}
            autoComplete="off"
            className="w-full bg-white/[0.03] border border-white/15 text-white text-[0.95rem] px-4 py-[0.85rem] rounded focus:outline-none focus:border-white focus:shadow-[0_0_0_1px_white,0_0_18px_rgba(255,255,255,0.18)] focus:bg-white/[0.05] transition-all duration-300 placeholder:text-zinc-600"
          />
          <span></span>
        </div>

        <div className="mb-[1.1rem]">
          <label htmlFor="rma-email" className="block font-[Outfit] text-[10px] tracking-[2px] uppercase text-zinc-600 mb-2">
            Email
          </label>
          <input
            id="rma-email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="off"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
            }}
            className="w-full bg-white/[0.03] border border-white/15 text-white text-[0.95rem] px-4 py-[0.85rem] rounded focus:outline-none focus:border-white focus:shadow-[0_0_0_1px_white,0_0_18px_rgba(255,255,255,0.18)] focus:bg-white/[0.05] transition-all duration-300 placeholder:text-zinc-600"
          />
        </div>

        <p className="text-center text-[0.8rem] text-zinc-400 my-5">
          Verificación mediante <strong className="text-white font-semibold">código postal</strong>
        </p>

        {error && (
          <p className="text-[0.8rem] text-red-400 text-center mb-4">{error}</p>
        )}

        <button
          type="button"
          onClick={getOrder}
          disabled={loading}
          className="w-full bg-white text-[#050505] border-none rounded-full font-[Outfit] font-semibold text-[0.85rem] tracking-[2px] uppercase py-4 cursor-pointer hover:shadow-[0_0_25px_rgba(255,255,255,0.55)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          {loading ? "Buscando..." : "Buscar mi pedido"}
        </button>

        <div className="mt-[1.8rem] text-center">
          <p className="text-[0.78rem] text-zinc-600 leading-relaxed mb-3">
            Introduce el número de pedido y el correo electrónico con el que realizaste la compra.
          </p>
          <a
            href="#"
            className="font-[Outfit] text-[11px] tracking-[2px] uppercase text-zinc-400 border-b border-white/15 pb-0.5 hover:text-white hover:border-white transition-all duration-300"
          >
            Ver política de desistimiento
          </a>
        </div>
      </div>
    </div>
  )
}
