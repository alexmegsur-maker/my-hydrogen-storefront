// app/sections/PhoenixAuth/index.tsx
//
// Componente de sección Weaverse para mostrar el resultado de autenticación NFC.
//
// FLUJO:
//  1. El tag NFC redirige al usuario a:
//     https://tu-tienda.com/pages/verificar?uid=XXX&ctr=YYY&mac=ZZZ
//  2. Esta sección lee esos parámetros de la URL y llama al endpoint /api/nfc-auth
//  3. Muestra el resultado: ✓ Original, ✕ Falsificado, o "esperando NFC"

import {
  forwardRef,
  useEffect,
  useState,
  useRef,
  type CSSProperties,
} from "react";
import { useSearchParams } from "react-router";
import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { schema } from "./schema";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AuthStatus = "IDLE" | "LOADING" | "SUCCESS" | "FAKE" | "INVALID_REQUEST" | "SERVER_ERROR";

interface PhoenixAuthProps extends HydrogenComponentProps {
  brandName?: string;
  successTitle?: string;
  successMessage?: string;
  fakeTitle?: string;
  fakeMessage?: string;
  waitingMessage?: string;
  apiEndpoint?: string;
}

// ─── Componente principal ─────────────────────────────────────────────────────

const PhoenixAuth = forwardRef<HTMLDivElement, PhoenixAuthProps>(
  (
    {
      brandName = "PHOENIX AUTHENTICATION",
      successTitle = "Producto Original",
      successMessage = "Esta unidad ha sido verificada satisfactoriamente como auténtica.",
      fakeTitle = "Error de Autenticidad",
      fakeMessage = "No se ha podido verificar la autenticidad de este producto.",
      waitingMessage = "Esperando interacción del sensor NFC...",
      apiEndpoint = "/api/nfc-auth",
      ...rest
    },
    ref
  ) => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<AuthStatus>("IDLE");
    const [uid, setUid] = useState<string | null>(null);

    const isAuthStarted = useRef(false);

    useEffect(() => {
      const uidParam = searchParams.get("uid");
      const ctrParam = searchParams.get("ctr");
      const macParam = searchParams.get("mac");

      // Si no hay parámetros NFC, mostrar pantalla de espera
      if (!uidParam || !ctrParam || !macParam) {
        setStatus("IDLE");
        return;
      }

      if (isAuthStarted.current) return
      isAuthStarted.current=true
      // Llamar al endpoint de validación
      setStatus("LOADING");

      const params = new URLSearchParams({ uid: uidParam, ctr: ctrParam, mac: macParam });

      fetch(`${apiEndpoint}?${params.toString()}`)
        .then((res) => res.json())
        .then((data: { status: AuthStatus; uid?: string }) => {
          setStatus(data.status);
          if (data.uid) setUid(data.uid);
        })
        .catch(() => {
          setStatus("SERVER_ERROR");
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiEndpoint,searchParams]); // Solo ejecutar al montar; los searchParams no cambian en esta página

    return (
      <div
        ref={ref}
        {...rest}
        style={containerStyle}
      >
        <div style={cardStyle}>
          {/* Cabecera */}
          <p style={brandStyle}>{brandName}</p>

          {/* Estados */}
          {status === "LOADING" && <LoadingState />}

          {status === "IDLE" && (
            <IdleState message={waitingMessage} />
          )}

          {status === "SUCCESS" && (
            <SuccessState title={successTitle} message={successMessage} uid={uid} />
          )}

          {status === "FAKE" && (
            <FakeState title={fakeTitle} message={fakeMessage} />
          )}

          {(status === "INVALID_REQUEST" || status === "SERVER_ERROR") && (
            <ErrorState status={status} />
          )}
        </div> 
      </div>
    );
  }
);

PhoenixAuth.displayName = "PhoenixAuth";

export default PhoenixAuth;
export { schema };

// ─── Sub-componentes de estado ────────────────────────────────────────────────

function LoadingState() {
  return (
    <div style={centeredStyle}>
      <div style={spinnerStyle} />
      <p style={{ color: "#71717a", marginTop: 16 }}>Verificando...</p>
    </div>
  );
}

function IdleState({ message }: { message: string }) {
  return <p style={idleTextStyle}>{message}</p>;
}

function SuccessState({
  title,
  message,
  uid,
}: {
  title: string;
  message: string;
  uid: string | null;
}) {
  return (
    <div style={centeredStyle}>
      <div style={iconStyle("#3b82f6")}>✓</div>
      <h2 style={titleStyle}>{title}</h2>
      <p style={bodyTextStyle}>{message}</p>
      {uid && (
        <div style={idTagStyle}>
          ID DISPOSITIVO: {uid}
        </div>
      )}
    </div>
  );
}

function FakeState({ title, message }: { title: string; message: string }) {
  return (
    <div style={centeredStyle}>
      <div style={iconStyle("#dc2626")}>✕</div>
      <h2 style={{ ...titleStyle, color: "#dc2626" }}>{title}</h2>
      <p style={bodyTextStyle}>{message}</p>
      <p style={{ color: "#52525b", fontSize: 14, marginTop: 8 }}>
        Por favor, contacte con soporte técnico.
      </p>
    </div>
  );
}

function ErrorState({ status }: { status: "INVALID_REQUEST" | "SERVER_ERROR" }) {
  return (
    <p style={idleTextStyle}>
      {status === "SERVER_ERROR"
        ? "Error interno del servidor. Contacte con el administrador."
        : "Parámetros de verificación incorrectos."}
    </p>
  );
}

// ─── Estilos (CSSProperties tipados, sin dependencias externas) ───────────────
// Se usan inline styles para máxima compatibilidad con el editor de Weaverse.
// Puedes migrarlos a Tailwind si tu proyecto lo tiene configurado.

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#000",
  color: "#fff",
  padding: "24px",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 448,
  padding: "40px",
  border: "1px solid #27272a",
  borderRadius: "24px",
  backgroundColor: "#18181b",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.9)",
  textAlign: "center",
};

const brandStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  fontStyle: "italic",
  letterSpacing: "0.2em",
  color: "#52525b",
  marginBottom: 40,
  textTransform: "uppercase",
};

const centeredStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const iconStyle = (color: string): CSSProperties => ({
  fontSize: 72,
  color,
  marginBottom: 24,
  lineHeight: 1,
});

const titleStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  textTransform: "uppercase",
  fontStyle: "italic",
  color: "#fff",
};

const bodyTextStyle: CSSProperties = {
  color: "#a1a1aa",
  marginTop: 16,
  fontWeight: 300,
};

const idleTextStyle: CSSProperties = {
  color: "#52525b",
  fontStyle: "italic",
};

const idTagStyle: CSSProperties = {
  marginTop: 40,
  paddingTop: 24,
  borderTop: "1px solid #27272a",
  fontSize: 10,
  color: "#52525b",
  fontFamily: "monospace",
  letterSpacing: "-0.05em",
};

const spinnerStyle: CSSProperties = {
  width: 48,
  height: 48,
  border: "3px solid #27272a",
  borderTopColor: "#3b82f6",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};