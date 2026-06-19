// import { cn } from "~/utils/cn";
// import { BackButton, MailIcon, PinIcon, ProgressBar, ShirtIcon, UserIcon } from "./DesistimientoForm";

// export function StepDetail({ onBack }: {  onBack: () => void }) {

  
//   return (
//     <div className="max-w-[960px] mx-auto px-4 py-8">
//       <div className="flex items-center gap-4 mb-8">
//         <BackButton onClick={onBack} />
//         <div className="text-center flex-1">
//           <h1 className="font-[Outfit] font-extrabold text-[1.7rem] uppercase tracking-[3px]">
//             {rma.code}
//           </h1>
//           <p className="text-[0.78rem] text-zinc-600 mt-1">10 ene 2026 · 16:25</p>
//         </div>
//         <div className="w-[42px] flex-shrink-0" />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-5">
//         {/* Left */}
//         <div>
//           {/* Status card */}
//           <section className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-[1.6rem] mb-5">
//             <h2 className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-4">
//               Estado del desistimiento
//             </h2>
//             <p
//               className={cn(
//                 'font-[Outfit] font-semibold text-[1.05rem] mb-3 tracking-[0.5px]',
//                 rma.approved && 'text-[#00D2FF] [text-shadow:0_0_16px_rgba(0,210,255,0.35)]',
//               )}
//             >
//               {rma.status}
//             </p>
//             <div className="mb-3">
//               <ProgressBar progress={rma.progress} approved={rma.approved} />
//             </div>
//             <p className="text-[0.85rem] text-zinc-400 font-light leading-relaxed">
//               En cuanto aprobemos tu solicitud, te avisaremos por correo electrónico.
//             </p>
//           </section>

//           {/* Items card */}
//           <section className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-[1.6rem] mb-5">
//             <h2 className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-5">
//               Qué vas a devolver
//             </h2>
//             <div className="flex items-start gap-4 pb-5 border-b border-white/[0.07] mb-5">
//               <div className="w-[60px] h-[60px] rounded-md bg-[#0A0A0A] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
//                 <ShirtIcon className="w-[30px] h-[30px] text-zinc-600" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-[Outfit] font-semibold text-[0.95rem]">Phoenix Monarch Remaster</p>
//                 <p className="text-[0.82rem] text-zinc-400 mt-1">Acabado · Grafito</p>
//                 <p className="text-[0.82rem] text-zinc-600 mt-1 italic">Motivo: no se ajusta a lo esperado</p>
//               </div>
//               <span className="font-[Outfit] font-semibold text-[0.9rem] text-zinc-400 whitespace-nowrap">
//                 12,99 €&nbsp;×2
//               </span>
//             </div>
//             <div>
//               <h3 className="font-[Outfit] font-semibold text-[11px] tracking-[2px] uppercase text-zinc-600 mb-2">
//                 Método de devolución
//               </h3>
//               <p className="text-[0.85rem] text-zinc-400 leading-relaxed">
//                 <strong className="text-white font-medium">Envío con etiqueta de devolución.</strong>{' '}
//                 Recibirás la etiqueta una vez aprobada la solicitud.
//               </p>
//             </div>
//           </section>

//           {/* Contact card */}
//           <section className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-[1.6rem]">
//             <h2 className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-4">
//               Datos de contacto
//             </h2>
//             <div className="flex items-center gap-3 text-[0.86rem] text-zinc-400 mb-3">
//               <UserIcon className="w-4 h-4 text-zinc-600 flex-shrink-0" />
//               Sales Demo
//             </div>
//             <div className="flex items-center gap-3 text-[0.86rem] text-zinc-400 mb-3">
//               <MailIcon className="w-4 h-4 text-zinc-600 flex-shrink-0" />
//               d.zhang@aftership.com
//             </div>
//             <div className="flex items-center gap-3 text-[0.86rem] text-zinc-400">
//               <PinIcon className="w-4 h-4 text-zinc-600 flex-shrink-0" />
//               Demo address, Columbus, Ohio, 43201, USA
//             </div>
//           </section>
//         </div>

//         {/* Right */}
//         <div>
//           <section className="bg-white/[0.02] border border-white/[0.07] rounded-lg p-[1.6rem]">
//             <h2 className="font-[Outfit] font-semibold text-[11px] tracking-[2.5px] uppercase text-zinc-400 mb-4">
//               Resumen
//             </h2>
//             <div className="flex justify-between items-center text-[0.88rem] text-zinc-400 py-2">
//               <span>Artículos a devolver (2)</span>
//               <span>-25,98 €</span>
//             </div>
//             <div className="border-t border-white/[0.07] my-1" />
//             <div className="flex justify-between items-baseline pt-3">
//               <span className="font-[Outfit] font-semibold text-[0.85rem] tracking-wide uppercase">
//                 Reembolso total
//               </span>
//               <span className="font-[Outfit] font-extrabold text-[1.3rem] [text-shadow:0_0_18px_rgba(255,255,255,0.2)]">
//                 25,98 €
//               </span>
//             </div>
//             <p className="text-[0.78rem] text-zinc-600 text-right mt-1">
//               Reembolso al método de pago original
//             </p>
//             <p className="text-[0.72rem] text-zinc-600 leading-relaxed mt-4">
//               *Según nuestra política de desistimiento y los descuentos, impuestos y gastos de envío aplicables.
//             </p>
//           </section>
//         </div>
//       </div>
//     </div>
//   )
// }