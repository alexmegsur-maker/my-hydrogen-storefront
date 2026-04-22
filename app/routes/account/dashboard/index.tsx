import { flattenConnection } from "@shopify/hydrogen";
import { Suspense, useRef } from "react";
import { Await, useLoaderData, useOutletContext } from "react-router";
import { ProductCard } from "~/components/product/product-card";
import { Swimlane } from "~/components/swimlane";
import type { loader as accountLoader } from "../layout";
import { AccountDetails } from "./account-details";
import { AddressBook } from "./address-book";
import { ORDER_STATUS, OrdersHistory, resolveOrderStatus } from "./orders-history";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export const splitText = (text) => {
  const words =text.split(" ")
  const texto = words.map((word,idx)=>{
    return (
      <div key={idx} className="w-full flex justify-center">
        {word.split("").map((char, index) => (
          <span key={index} className="char" style={{ display: 'flex' }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    )
  })
  return texto ;
};

export default function AccountDashboard() {
  const loaderData = useLoaderData<typeof accountLoader>();
  const outletContext =
  useOutletContext<Awaited<ReturnType<typeof accountLoader>>["data"]>();
  

  let { customer, heading, featuredProducts } = loaderData || {};
  if (!customer) {
    customer = outletContext?.customer;
    heading = outletContext?.heading;
    featuredProducts = outletContext?.featuredProducts;
  }

  if (!customer) return null;

  const orders = flattenConnection(customer.orders);
  const addresses = flattenConnection(customer.addresses);
  const fullName =
    `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || "Operador";

  const latestOrder = orders[0];

  const container = useRef(null)

  useGSAP(() => {
    // 1. Animación de revelado inicial (Letra a Letra)
    const introTl =gsap.timeline();
    introTl.from(".char", {
      opacity: 0,
      y: 20,
      rotateX: -90,
      stagger: 0.08,
      duration: 1,
      ease: "power3.out",
    })
    
    .from([".tagFounder",".welcome-text"], {
      opacity: 0,
      x: 20,
      duration: 1,
      ease: "power3.out",
    });

    const sections = gsap.utils.toArray('.fade-up-trigger');
    sections.forEach((section:any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 90%", // Empieza cuando el tope de la sección está al 90% del viewport
          toggleActions: "play none none none", // Solo se reproduce una vez al entrar
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
    });


  }, { scope: container, dependencies:[customer] });


  return (
    <div ref={container} style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      {/* Bienvenida */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div className="w-full" >
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "2px",
              lineHeight: 1.2,
              color: "#FFFFFF",
              maxWidth: "50%",
            }}
          >
           <span>
            {splitText( "Identidad")}
           </span>
           <br/>
           <span>
            {splitText( "Confirmada.")}
           </span>
          </h1>
          <div className="w-full flex justify-between">
            <p className="welcome-text" style={{ color: "#A1A1AA", fontSize: "0.9rem", marginTop: "0.5rem" }}>
              Bienvenido de nuevo,{" "}
              <strong style={{ color: "#FFFFFF" }}>{fullName}</strong>
            </p>
            <div 
              className="tagFounder"
              style={{
                background: "#FFFFFF",
                color: "#050505",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "3px",
                padding: "6px 12px",
                borderRadius: "2px",
                boxShadow: "0 0 15px rgba(255,255,255,0.3)",
                display: "inline-block",
                flexShrink: 0,
              }}
            >
              Autorización Nivel 1 (Founder)
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta del último pedido */}
      {latestOrder && (
        <div className="fade-up-trigger">
          <LatestOrderCard order={latestOrder} />
        </div>
      )}

      {/* Historial de pedidos */}
      {orders.length > 0 &&(
        <div className="fade-up-trigger">
          <OrdersHistory orders={orders} />
        </div>  
      )}

      {/* Detalles de cuenta */}
      <div className="fade-up-trigger">
        <AccountDetails customer={customer} />
      </div>

      {/* Libreta de direcciones */}
      <div className="fade-up-trigger">
        <AddressBook addresses={addresses} customer={customer} />
      </div>

      {/* Productos destacados si no hay pedidos */}
      {!orders.length && (
        <div className="fade-up-trigger">
          <Suspense>
            <Await
              resolve={featuredProducts}
              errorElement="There was a problem loading featured products."
            >
              {({ featuredProducts: products }) => (
                <div style={{ paddingTop: "2rem" }}>
                  <h5
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "0.8rem",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      color: "#52525B",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Productos destacados
                  </h5>
                  <Swimlane>
                    {products.nodes.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        className="w-80 snap-start"
                      />
                    ))}
                  </Swimlane>
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      )}
    </div>
  );
}

// ─── Tarjeta del último pedido ────────────────────────────────────────────────

// Mapeo de estados a posición en el pipeline de producción
const STATUS_TO_STAGE: Record<string, number> = {
  UNFULFILLED:         0,
  PENDING:             0,
  AUTHORIZED:          0,
  IN_PROGRESS:         1,
  ON_HOLD:             1,
  PARTIALLY_FULFILLED: 2,
  SCHEDULED:           2,
  FULFILLED:           3,
  SUCCESS:             3,
};

const STAGES = ["Procesado", "En Producción", "Control Calidad", "Enviado"];

function LatestOrderCard({ order }: { order: any }) {
  const orderId = order.id.split("/").pop();

  // Reutilizamos la misma lógica que la tabla para consistencia
  const effectiveStatus = resolveOrderStatus(order);
  const activeStage = STATUS_TO_STAGE[effectiveStatus] ?? 0;
  const progressPct = Math.round(((activeStage + 1) / STAGES.length) * 100);

  // Pedido cancelado/reembolsado → barra en rojo y progreso fijo al 100%
  const isCancelled = ["CANCELLED", "VOIDED", "REFUNDED", "PARTIALLY_REFUNDED"].includes(effectiveStatus);
  const barColor = isCancelled ? "rgba(255,68,68,0.7)" : "#FFFFFF";
  const barGlow  = isCancelled ? "0 0 10px rgba(255,68,68,0.5)" : "0 0 10px rgba(255,255,255,0.8)";
  const displayPct = isCancelled ? 100 : progressPct;

  return (
    <div
      style={{
        background: "rgba(10,10,10,0.7)",
        border: `1px solid ${isCancelled ? "rgba(255,68,68,0.3)" : "rgba(255,255,255,0.3)"}`,
        borderRadius: "4px",
        padding: "2.5rem",
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Acento lateral */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          background: barColor,
          boxShadow: barGlow,
        }}
      />

      {/* Cabecera */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#FFFFFF",
              marginBottom: "0.5rem",
            }}
          >
            Orden #{order.number}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#A1A1AA" }}>
            {order.lineItems?.edges?.[0]?.node?.title ?? "Monarch Remaster"}
          </div>
        </div>
        <a
          href={`/account/orders/${orderId}`}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 16px",
            textDecoration: "none",
            background: "transparent",
            display: "inline-block",
            flexShrink: 0,
          }}
        >
          Ver Detalles
        </a>
      </div>

      {/* Fases — se ocultan si está cancelado */}
      {!isCancelled && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.75rem",
            color: "#A1A1AA",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "1rem",
          }}
        >
          {STAGES.map((stage, i) => (
            <span
              key={stage}
              style={{
                color: i === activeStage ? "#FFFFFF" : "#A1A1AA",
                textShadow: i === activeStage ? "0 0 10px rgba(255,255,255,0.5)" : "none",
                fontWeight: i === activeStage ? 600 : 400,
              }}
            >
              {stage}
            </span>
          ))}
        </div>
      )}

      {/* Barra de progreso */}
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${displayPct}%`,
            background: barColor,
            boxShadow: barGlow,
            overflow: "hidden",
            transition: "width 1s ease",
          }}
        >
          {/* Efecto láser solo si no está cancelado */}
          {!isCancelled && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                animation: "barEnergy 2s infinite linear",
              }}
            />
          )}
        </div>
      </div>

      {/* Estado + fecha */}
      <div
        style={{
          fontSize: "0.85rem",
          color: "#52525B",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            background: barColor,
            borderRadius: "50%",
            animation: isCancelled ? "none" : "pulseWhite 2s infinite",
            flexShrink: 0,
          }}
        />
        {ORDER_STATUS[effectiveStatus] ?? effectiveStatus} · Procesado el{" "}
        {new Date(order.processedAt).toLocaleDateString("es-ES")}
      </div>

      <style>{`
        @keyframes barEnergy { 0% { left: -100%; } 100% { left: 100%; } }
        @keyframes pulseWhite { 0%,100% { opacity:1; box-shadow: 0 0 8px rgba(255,255,255,0.8); } 50% { opacity:0.3; box-shadow: none; } }
      `}</style>
    </div>
  );
}