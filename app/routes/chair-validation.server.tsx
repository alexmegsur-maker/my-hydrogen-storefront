import { type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { createHmac } from "crypto";

/**
 * Función encargada de enviar la alerta por email.
 * Debes conectar esto con SendGrid, Postmark, o tu servicio de email.
 */
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
  
  // TODO: Implementar envío de email real
  // Ejemplo con SendGrid:
  // await sendgrid.send({
  //   to: 'admin@phoenix.com',
  //   from: 'alerts@phoenix.com',
  //   subject: subject,
  //   text: emailBody
  // });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");
  const ctr = url.searchParams.get("ctr");
  const mac = url.searchParams.get("mac");
  const tt = url.searchParams.get("tt");
  
  // Captura de metadatos para el reporte
  const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "IP Privada/Desconocida";
  const userAgent = request.headers.get("user-agent") || "Desconocido";
  const now = new Date();
  
  const alertMetadata = {
    uid: uid || "DESCONOCIDO",
    ip,
    userAgent,
    date: now.toLocaleDateString('es-ES'),
    time: now.toLocaleTimeString('es-ES')
  };
  
  // 1. Verificación básica de parámetros
  if (!uid || !ctr || !mac) {
    return JSON.stringify({ status: "INVALID_REQUEST" });
  }
  
  // 2. Validación Criptográfica (Firma MAC)
  const SECRET = process.env.NFC_MASTER_KEY;
  
  if (!SECRET) {
    console.error("ERROR: NFC_MASTER_KEY no está configurada en las variables de entorno");
    return JSON.stringify({ status: "SERVER_ERROR" }), { status: 500 };
  }
  
  const dataToVerify = uid + ctr + (tt || "");
  const expectedMac = createHmac("sha256", SECRET)
    .update(dataToVerify)
    .digest("hex")
    .toUpperCase()
    .substring(0, 16);
  
  const isOriginal = mac.toUpperCase() === expectedMac;
  const isTampered = tt !== "00"; // En DNA TT, '00' significa circuito intacto
  
  // 3. Lógica de Alertas según tu requerimiento
  if (!isOriginal) {
    // ESCENARIO: Chip No Original -> ALERTA
    await triggerSecurityAlert("Silla posiblemente falsificada detectada", alertMetadata);
    return JSON.stringify({ status: "FAKE" });
  } 
  
  if (isOriginal && isTampered) {
    // ESCENARIO: Original pero manipulado -> ALERTA
    await triggerSecurityAlert("Silla con chip manipulada detectada", alertMetadata);
    return JSON.stringify({ status: "TAMPERED", uid });
  }
  
  // ESCENARIO: Original y No manipulado -> SIN ALERTA
  return JSON.stringify({ status: "SUCCESS", uid });
}