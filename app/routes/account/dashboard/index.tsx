import { flattenConnection } from "@shopify/hydrogen";
import { Suspense } from "react";
import { Await, useLoaderData, useOutletContext } from "react-router";
import { ProductCard } from "~/components/product/product-card";
import { Swimlane } from "~/components/swimlane";
import type { loader as accountLoader } from "../layout";
import { AccountDetails } from "./account-details";
import { AddressBook } from "./address-book";
import { OrdersHistory } from "./orders-history";

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
    `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() ||
    "Operador";

  // Último pedido para la tarjeta de estado
  const latestOrder = orders[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
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
        <div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "2px",
              lineHeight: 1.2,
              color: "#FFFFFF",
            }}
          >
            Identidad Confirmada.
          </h1>
          <p style={{ color: "#A1A1AA", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Bienvenido de nuevo, <strong style={{ color: "#FFFFFF" }}>{fullName}</strong>
          </p>
        </div>
        <div
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

      {/* Tarjeta del último pedido */}
      {latestOrder && <LatestOrderCard order={latestOrder} />}

      {/* Historial de pedidos */}
      {orders.length > 0 && <OrdersHistory orders={orders} />}

      {/* Detalles de cuenta */}
      <AccountDetails customer={customer} />

      {/* Libreta de direcciones */}
      <AddressBook addresses={addresses} customer={customer} />

     
    </div>
  );
}

// ─── Tarjeta del último pedido activo ────────────────────────────────────────

function LatestOrderCard({ order }: { order: any }) {
  const orderId = order.id.split("/").pop();
  const status = order.fulfillmentStatus ?? "OPEN";

  const STAGES = ["Procesado", "En Ensamblaje", "Control de Calidad", "Despliegue"];
  const statusToStage: Record<string, number> = {
    OPEN: 0,
    PENDING: 1,
    IN_PROGRESS: 2,
    SUCCESS: 3,
  };
  const activeStage = statusToStage[status] ?? 0;
  const progressPct = Math.round(((activeStage + 1) / STAGES.length) * 100);

  return (
    <div
      style={{
        background: "rgba(10,10,10,0.7)",
        border: "1px solid rgba(255,255,255,0.3)",
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
          background: "#FFFFFF",
          boxShadow: "0 0 15px rgba(255,255,255,0.5)",
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
            transition: "all 0.3s",
            background: "transparent",
            display: "inline-block",
            flexShrink: 0,
          }}
        >
          Ver Detalles
        </a>
      </div>

      {/* Fases */}
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
              textShadow:
                i === activeStage ? "0 0 10px rgba(255,255,255,0.5)" : "none",
              fontWeight: i === activeStage ? 600 : 400,
            }}
          >
            {stage}
          </span>
        ))}
      </div>

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
            width: `${progressPct}%`,
            background: "#FFFFFF",
            boxShadow: "0 0 10px rgba(255,255,255,0.8)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              animation: "barEnergy 2s infinite linear",
            }}
          />
        </div>
      </div>

      {/* ETA */}
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
            background: "#FFFFFF",
            borderRadius: "50%",
            animation: "pulseWhite 2s infinite",
            flexShrink: 0,
          }}
        />
        Estado: {order.financialStatus} · Procesado el{" "}
        {new Date(order.processedAt).toLocaleDateString("es-ES")}
      </div>

      <style>{`
        @keyframes barEnergy { 0% { left: -100%; } 100% { left: 100%; } }
        @keyframes pulseWhite { 0%,100% { opacity:1; box-shadow: 0 0 8px rgba(255,255,255,0.8); } 50% { opacity:0.3; box-shadow: none; } }
      `}</style>
    </div>
  );
}
