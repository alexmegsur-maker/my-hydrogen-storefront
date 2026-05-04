// app/routes/validate.tsx
import { type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { createHmac } from "crypto";
import PhoenixValidationSection from "~/components/phoenix-validation";

async function triggerSecurityAlert(subject: string, details: any) {
  const emailBody = `
    ALERTA DE SEGURIDAD PHOENIX TECHNOLOGIES
    ---------------------------------------
    MOTIVO: ${subject}
    UID CHIP: ${details.uid}
    FECHA: ${details.date}
    HORA: ${details.time}
    IP: ${details.ip}
    LOCALIZACIÓN (ESTIMADA): https://www.ip2location.com/${details.ip}
    DISPOSITIVO (User-Agent): ${details.userAgent}
  `;

  console.log("Enviando Email de Alerta...", emailBody);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");
  const ctr = url.searchParams.get("ctr");
  const mac = url.searchParams.get("mac");
  const tt = url.searchParams.get("tt");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "IP Privada/Desconocida";
  const userAgent = request.headers.get("user-agent") || "Desconocido";
  const now = new Date();

  const alertMetadata = {
    uid: uid || "DESCONOCIDO",
    ip,
    userAgent,
    date: now.toLocaleDateString("es-ES"),
    time: now.toLocaleTimeString("es-ES"),
  };

  if (!uid || !ctr || !mac) {
    return new Response(JSON.stringify({ status: "INVALID_REQUEST" }), { status: 400 });
  }

  const SECRET = process.env.NFC_MASTER_KEY;

  if (!SECRET) {
    console.error("ERROR: NFC_MASTER_KEY no está configurada");
    return new Response(JSON.stringify({ status: "SERVER_ERROR" }), { status: 500 });
  }

  const dataToVerify = uid + ctr + (tt || "");
  const expectedMac = createHmac("sha256", SECRET)
    .update(dataToVerify)
    .digest("hex")
    .toUpperCase()
    .substring(0, 16);

  const isOriginal = mac.toUpperCase() === expectedMac;
  const isTampered = tt !== "00";

  if (!isOriginal) {
    await triggerSecurityAlert("Silla posiblemente falsificada detectada", alertMetadata);
    return new Response(JSON.stringify({ status: "FAKE" }), { status: 200 });
  }

  if (isOriginal && isTampered) {
    await triggerSecurityAlert("Silla con chip manipulada detectada", alertMetadata);
    return new Response(JSON.stringify({ status: "TAMPERED", uid }), { status: 200 });
  }

  return new Response(JSON.stringify({ status: "SUCCESS", uid }), { status: 200 });
}

export default function ValidatePage() {
  return <PhoenixValidationSection />;
}