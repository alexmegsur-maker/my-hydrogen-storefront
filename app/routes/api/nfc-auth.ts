// app/routes/api/nfc-auth.ts
// Verificación NTAG 424 DNA — AES-128 CMAC / NXP SDM (AN12196)
// Compatible con Cloudflare Workers (Web Crypto API nativa, sin dependencias npm)

import { data, type LoaderFunctionArgs } from "react-router";

// ─── AES-ECB single block via AES-CBC con IV=0 ───────────────────────────────
// Web Crypto no expone AES-ECB directamente. Usamos AES-CBC con IV cero:
// C[0] = AES_K(P[0] XOR 0) = AES_K(P[0])  ← equivalente a ECB para un bloque.

function buf(size: number): Uint8Array<ArrayBuffer> {
  return new Uint8Array(new ArrayBuffer(size));
}

function u8(data: ArrayBuffer | ArrayBufferLike): Uint8Array<ArrayBuffer> {
  return new Uint8Array(data instanceof ArrayBuffer ? data : data.slice(0)) as Uint8Array<ArrayBuffer>;
}

async function aesBlock(key: Uint8Array<ArrayBuffer>, block: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "AES-CBC" }, false, ["encrypt"],
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: buf(16) },
    cryptoKey,
    block,
  );
  // AES-CBC con un bloque produce 32 bytes (bloque + padding PKCS7).
  // Solo nos interesa el primer bloque = AES_K(block).
  return u8(encrypted).slice(0, 16) as Uint8Array<ArrayBuffer>;
}

// ─── AES-128 CMAC (RFC 4493) ─────────────────────────────────────────────────

function xor16(a: Uint8Array, b: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = buf(16);
  for (let i = 0; i < 16; i++) out[i] = a[i] ^ b[i];
  return out;
}

function shiftLeft(src: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = buf(src.length);
  for (let i = 0; i < src.length - 1; i++) {
    out[i] = ((src[i] << 1) | (src[i + 1] >> 7)) & 0xff;
  }
  out[src.length - 1] = (src[src.length - 1] << 1) & 0xff;
  return out;
}

async function aesCmac(key: Uint8Array<ArrayBuffer>, msg: Uint8Array): Promise<Uint8Array<ArrayBuffer>> {
  const Rb = buf(16);
  Rb[15] = 0x87;

  const L = await aesBlock(key, buf(16));
  const K1 = L[0] & 0x80 ? xor16(shiftLeft(L), Rb) : shiftLeft(L);
  const K2 = K1[0] & 0x80 ? xor16(shiftLeft(K1), Rb) : shiftLeft(K1);

  let n = Math.ceil(msg.length / 16);
  let complete: boolean;
  if (n === 0) { n = 1; complete = false; }
  else complete = msg.length % 16 === 0;

  let mLast: Uint8Array<ArrayBuffer>;
  if (complete) {
    mLast = xor16(msg.slice((n - 1) * 16), K1);
  } else {
    const pad = buf(16);
    const tail = msg.slice((n - 1) * 16);
    pad.set(tail);
    pad[tail.length] = 0x80;
    mLast = xor16(pad, K2);
  }

  let X = buf(16);
  for (let i = 0; i < n - 1; i++) {
    X = await aesBlock(key, xor16(X, msg.slice(i * 16, i * 16 + 16)));
  }
  return aesBlock(key, xor16(X, mLast));
}

// ─── Verificación NXP SDM (AN12196) ──────────────────────────────────────────
// SV2 = 0x3C 0xC3 0x00 0x01 0x00 0x80 | UID[7] | CTR_LE[3]   (16 bytes)
// K_ses = AES-CMAC(masterKey, SV2)
// MAC   = AES-CMAC(K_ses, "")   ← SUN sin datos de fichero
// MAC_t = bytes [1,3,5,7,9,11,13,15] de MAC  (8 bytes = 16 hex)

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const out = buf(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    out[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return out;
}

function toHex(b: Uint8Array): string {
  return Array.from(b).map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function verifyNtag424Mac(params: {
  masterKey: string; // 32 hex chars = 16 bytes
  uid: string;       // 14 hex chars = 7 bytes
  counter: string;   // 6 hex chars LE (ej: "0A0000") o número decimal
  mac: string;       // 16 hex chars = 8 bytes (MAC truncada)
}): Promise<boolean> {
  const { masterKey, uid, counter, mac } = params;

  const keyBytes = fromHex(masterKey);
  const uidBytes = fromHex(uid);

  // Contador: puede llegar como:
  //   - 6 hex chars LE con letras (estándar NXP SDM): "1A0000" → counter=26
  //   - 6 hex chars LE solo dígitos: "180000" → counter=24
  //   - decimal puro con ceros: "000018" = 18 (algunos programadores NFC usan decimal)
  // Regla: si contiene letras a-f es hex LE; si son solo dígitos y empieza con ceros
  // significativos (ej. "0001XX") es decimal, pues LE empezaría por el byte bajo.
  let ctrBytes: Uint8Array;
  if (/[a-fA-F]/.test(counter)) {
    // Contiene letras → hex LE directo del chip
    ctrBytes = fromHex(counter);
  } else if (/^0{3}/.test(counter)) {
    // Empieza con 3+ ceros → casi seguro decimal (en LE hex el byte bajo iría primero)
    const v = parseInt(counter, 10);
    ctrBytes = new Uint8Array([v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff]);
  } else {
    // 6 dígitos sin ceros líderes significativos → tratar como hex LE
    ctrBytes = fromHex(counter);
  }

  // SV2: 16 bytes
  const sv2 = new Uint8Array([0x3c, 0xc3, 0x00, 0x01, 0x00, 0x80, ...uidBytes, ...ctrBytes]);

  const sessionKey = await aesCmac(keyBytes, sv2);
  const fullMac    = await aesCmac(sessionKey, new Uint8Array(0));

  // Truncar: bytes en posiciones impares [1,3,5,7,9,11,13,15]
  const truncated = new Uint8Array(8);
  for (let i = 0; i < 8; i++) truncated[i] = fullMac[i * 2 + 1];

  return mac.toUpperCase() === toHex(truncated);
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SecurityMetadata {
  uid: string;
  ip: string;
  userAgent: string;
  date: string;
  time: string;
}

type AuthStatus = "SUCCESS" | "FAKE" | "INVALID_REQUEST" | "SERVER_ERROR";

interface AuthResponse {
  status: AuthStatus;
  uid?: string;
  error?: string;
}

// ─── Registro de alerta de falsificación via Admin API ───────────────────────

const CREATE_FAKE_ALERT = `
  mutation CreateFakeAlert($fields: [MetaobjectFieldInput!]!) {
    metaobjectCreate(metaobject: {
      type: "alerta_falsificacion"
      fields: $fields
    }) {
      metaobject { id handle }
      userErrors { field message code }
    }
  }
`;

async function createFakeAlertMetaobject(
  details: SecurityMetadata,
  shopDomain: string,
  adminToken: string,
): Promise<void> {
  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({
          query: CREATE_FAKE_ALERT,
          variables: {
            fields: [
              { key: "uid",              value: details.uid },
              { key: "ip",               value: details.ip },
              { key: "user_agent",       value: details.userAgent },
              { key: "fecha",            value: details.date },
              { key: "hora",             value: details.time },
              { key: "url_localizacion", value: `https://www.ip2location.com/${details.ip}` },
            ],
          },
        }),
      },
    );

    const result = await response.json() as any;
    if (result.errors) { console.error("[PHOENIX] GraphQL error:", result.errors); return; }
    const ue = result.data?.metaobjectCreate?.userErrors;
    if (ue?.length) console.error("[PHOENIX] userErrors:", ue);
    else console.warn("[PHOENIX] Alerta registrada:", result.data?.metaobjectCreate?.metaobject?.id);
  } catch (err) {
    console.error("[PHOENIX] Fallo Admin API:", err);
  }
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url   = new URL(request.url);
  const uid   = url.searchParams.get("uid");
  const ctr   = url.searchParams.get("ctr");
  const mac   = url.searchParams.get("mac");

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };

  const ip        = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "IP Desconocida";
  const userAgent = request.headers.get("user-agent") ?? "Desconocido";
  const now       = new Date();

  const metadata: SecurityMetadata = {
    uid: uid ?? "N/A",
    ip,
    userAgent,
    date: now.toLocaleDateString("es-ES"),
    time: now.toLocaleTimeString("es-ES"),
  };

  if (!uid || !ctr || !mac) {
    return data<AuthResponse>({ status: "INVALID_REQUEST" }, { status: 400, headers: corsHeaders });
  }

  const SECRET = context.env.NFC_MASTER_KEY;
  if (!SECRET) {
    console.error("[PHOENIX] NFC_MASTER_KEY no definida.");
    return data<AuthResponse>(
      { status: "SERVER_ERROR", error: "Configuración incompleta." },
      { status: 500, headers: corsHeaders },
    );
  }

  const SHOP_DOMAIN  = context.env.PUBLIC_STORE_DOMAIN;
  const ADMIN_TOKEN  = context.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

  try {
    const isOriginal = await verifyNtag424Mac({
      masterKey: SECRET,
      uid,
      counter: ctr,
      mac,
    });

    if (!isOriginal) {
      if (SHOP_DOMAIN && ADMIN_TOKEN) {
        await createFakeAlertMetaobject(metadata, SHOP_DOMAIN, ADMIN_TOKEN);
      }
      return data<AuthResponse>({ status: "FAKE" }, { status: 200, headers: corsHeaders });
    }

    return data<AuthResponse>({ status: "SUCCESS", uid }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[PHOENIX] Error en validación criptográfica:", err);
    return data<AuthResponse>(
      { status: "SERVER_ERROR", error: "Error interno." },
      { status: 500, headers: corsHeaders },
    );
  }
}
