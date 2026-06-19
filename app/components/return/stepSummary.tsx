import { cn } from "~/utils/cn"
import { BackButton, BARPROGRESS, CheckIcon, ProgressBar, useOrder } from "./DesistimientoForm"
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
  const [progressData,setProgressData]=useState({progress:null,state:"",tag:""})
  const order = useOrder(state=>state.order)
  const checkExist = useOrder(state=>state.existingRequest)
  const date = new Date(order.createdAt)
  useEffect(()=>{
    if(checkExist){
      let barProgress = BARPROGRESS.find((elm)=>{if(elm.id == checkExist.state) return elm })
        console.log(barProgress)
      let progreso= barProgress.id =="Completada"?"complete":barProgress.id =="Rechazada"? "fail":"progress"
      setProgressData({progress:barProgress.progress,state:progreso,tag:barProgress.id})
    }
  },[checkExist])
  
  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <BackButton onClick={onBack} />
        <div className="text-center flex-1">
          <h1 className="font-[Outfit] font-extrabold text-2xl md:text-[2rem] uppercase tracking-wider">
            Pedido {order.name}
          </h1>
          <p className="text-[0.78rem] text-zinc-600 mt-1">{date.toDateString()}</p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="font-[Outfit] font-semibold text-[11px] tracking-[2px] uppercase text-white bg-transparent border border-white/15 rounded-full px-4 py-[0.7rem] cursor-pointer whitespace-nowrap hover:bg-white hover:text-[#050505] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 flex-shrink-0"
        >
          Crear desistimiento
        </button>
      </div>

      {order.lineItems.edges.map((rma,index) =>{
        const exist = rma.node.product.id == checkExist.producto_return ? true:false
        
        return(
         <button
           key={index}
           type="button"
           onClick={() => onViewRma()}
           className="w-full relative flex flex-col text-left bg-white/[0.02] border border-white/[0.07] rounded-lg p-5 mb-3 transition-all duration-[350ms] hover:border-white/15 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] group"
         >
           <div className="flex items-center gap-4 justify-between w-full">
             <div className="w-14 h-14 rounded-md bg-[#0A0A0A] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
               
               <Image data={rma.node.image} sizes="auto" />
             </div>
             <div className="flex-1 min-w-0">
               <p
                 className={cn(
                   'font-[Outfit] font-semibold text-[0.95rem] mt-1 tracking-[0.5px]',
                 )}
               >
                 {rma.node.title}
               </p>
               <span className="block font-[Outfit] text-[10px] tracking-[2px] uppercase text-zinc-600">
                 {rma.node.originalUnitPriceSet.shopMoney.amount} {rma.node.originalUnitPriceSet.shopMoney.currencyCode} x {rma.node.quantity}
               </span>
               <span className="py-1 px-2 text-sm rounded-full bg-white text-black absolute right-6 top-3"
                style={{
                  background:progressData.state =="complete"?"#4aaf41":progressData.state =="fail"?"#c11313":"white",
                  color:progressData.state =="progress"?"#050505":"white"
                  
                }}
               >
                {progressData.tag}
               </span>
             </div>
             <span className="text-zinc-600 text-xl group-hover:translate-x-1 group-hover:text-white transition-all duration-300">
               ›
             </span>
           </div>
           <div className="mt-4">
             { 
             exist &&
              <ProgressBar progress={progressData.progress} approved={progressData.state} />
             }
           </div>
         </button>
       )}
      )}
    </div>
  )
}