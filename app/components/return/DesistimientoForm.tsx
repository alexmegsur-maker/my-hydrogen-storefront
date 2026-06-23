'use client'

import { useState } from 'react'
import { cn } from '~/utils/cn'
import { StepLogin } from './stepLogin'
import { StepSummary } from './stepSummary'
import { StepCreate } from './stepCreate'
import { StepDetail } from './stepDetail'
import { create } from 'zustand'
type Step = 'login' | 'summary' | 'create' | 'detail'

export interface OrderQuery {
  id: string;
  name: string;
  email: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  createdAt: string;
  totalPriceSet: {
    shopMoney: { amount: string; currencyCode: string };
  };
  lineItems: {
    edges: {
      node: {
        product:{
          id:string;
        }
        title: string;
        quantity: number;
        image:{
          url:string;
          altText:string;
        };
        originalUnitPriceSet: {
          shopMoney: { amount: string; currencyCode: string };
        };
      };
    }[];
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    country: string;
  };
}

type OrderStore = {
  order: OrderQuery,
  productDetail:string | null,
  existingRequest: Record<string, string> | null,
  setOrder: (newOrder: OrderQuery, existingRequest?: Record<string, string> | null) => void
  setProductDetail:(newOrderDetail:string)=>void,
}

export const useOrder = create<OrderStore>()((set) => ({
  order: null,
  productDetail:null,
  existingRequest: null,
  setOrder: (newOrder: OrderQuery, existingRequest: Record<string, string> | null = null) => {
    set(() => ({ order: newOrder, existingRequest }))
  },
  setProductDetail:(newOrderDetail:string)=>{
    set(()=>({productDetail:newOrderDetail}))
  }
}))

// ── Mock data ──────────────────────────────────────────────


export const BARPROGRESS = [
  { id: 'Solicitada', progress: 20  },
  { id: 'Autorizada', progress: 40  },
  { id: 'En tránsito', progress: 60  },
  { id: 'Recibida', progress: 80  },
  { id: 'Completada', progress: 100  },
  { id: 'Rechazada', progress: 100  },
]

// ── Icons ──────────────────────────────────────────────────
export function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export function ShirtIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  )
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

export function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  )
}

export function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

// ── Shared sub-components ──────────────────────────────────
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Volver"
      className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center border border-white/15 rounded-full text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300"
    >
      <ChevronLeft />
    </button>
  )
}

export function ProgressBar({ progress, approved }: { progress: number; approved: string }) {
  return (
    <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden">
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          approved=="complete"
            ? 'bg-[#4aaf41] shadow-[0_0_14px_rgba(0,210,255,0.8)]':
            approved=="fail" ? 'bg-[#c11313] shadow-[0_0_14px_rgba(0,210,255,0.8)]'
            : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]',
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function ItemThumb() {
  return (
    <div className="w-[56px] h-[56px] rounded-md bg-[#0A0A0A] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
      <ShirtIcon className="w-7 h-7 text-zinc-600" />
    </div>
  )
}


export default function DesistimientoForm() {
  const [step, setStep] = useState<Step>('login')

  function goToDetail() {
    // setSelectedRma(rma)
    setStep('detail')
  }

  return (
    <div className="relative min-h-[60vh] overflow-x-hidden bg-[#050505] text-white">
      {/* Dot texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1.5px, transparent 1.5px)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="relative z-10">
        {step === 'login' && (
          <StepLogin onSearch={() => setStep('summary')} />
        )}
        {step === 'summary' && (
          <StepSummary
            onBack={() => setStep('login')}
            onCreateNew={() => setStep('create')}
            onViewRma={goToDetail}
          />
        )}
        {step === 'create' && (
          <StepCreate
            onBack={() => setStep('summary')}
            onNext={goToDetail}
          />
        )}
        {step === 'detail' && (
          <StepDetail  onBack={() => setStep('summary')} />
        )}
      </div>
    </div>
  )
}
