import { useLoaderData } from "react-router";

interface ValidationData {
  status: "SUCCESS" | "TAMPERED" | "FAKE" | "INVALID_REQUEST" | "SERVER_ERROR";
  uid?: string;
}

export default function PhoenixValidationSection() {
  const data = useLoaderData<ValidationData>();
  
  // Estilos base para los contenedores de mensaje
  const containerStyle = "p-10 rounded-3xl border text-center shadow-2xl max-w-lg mx-auto";
  
  return (
    <div className="bg-zinc-950 py-20 px-4 min-h-screen flex items-center justify-center">
      
      {/* CASO 1: ÉXITO TOTAL (Original y No Manipulado) */}
      {data.status === "SUCCESS" && (
        <div className={`${containerStyle} border-blue-500/30 bg-blue-500/5`}>
          <div className="text-blue-500 text-6xl mb-6">✓</div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter italic">
            Phoenix Chairs Authentic
          </h2>
          <p className="text-zinc-400 mt-4">
            Este producto ha sido verificado como una unidad original y segura.
          </p>
          <div className="mt-8 text-[10px] text-zinc-600 font-mono">
            S/N: {data.uid}
          </div>
        </div>
      )}
      
      {/* CASO 2: ORIGINAL PERO MANIPULADO */}
      {data.status === "TAMPERED" && (
        <div className={`${containerStyle} border-yellow-600/40 bg-yellow-600/10`}>
          <div className="text-yellow-500 text-6xl mb-6">⚠</div>
          <h2 className="text-2xl font-bold text-yellow-500 uppercase tracking-tighter italic">
            Alerta de Seguridad
          </h2>
          <p className="text-zinc-300 mt-4">
            Producto genuino, pero el sello digital de seguridad ha sido manipulado.
          </p>
          <p className="text-zinc-500 text-sm mt-2 font-light italic">
            Se ha enviado un reporte automático al equipo técnico.
          </p>
        </div>
      )}
      
      {/* CASO 3: FALSIFICACIÓN / ERROR */}
      {(data.status === "FAKE" || data.status === "INVALID_REQUEST" || data.status === "SERVER_ERROR") && (
        <div className={`${containerStyle} border-red-600/40 bg-red-600/10`}>
          <div className="text-red-500 text-6xl mb-6">✕</div>
          <h2 className="text-2xl font-bold text-red-500 uppercase tracking-tighter italic">
            Error de Validación
          </h2>
          <p className="text-zinc-300 mt-4">
            No se ha podido verificar la autenticidad de esta silla.
          </p>
          <button className="mt-8 px-6 py-3 bg-white text-black font-bold text-xs rounded-full uppercase">
            Contactar Soporte
          </button>
        </div>
      )}
      
    </div>
  );
}