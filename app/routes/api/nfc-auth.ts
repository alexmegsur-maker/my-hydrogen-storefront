// app/routes/api/nfc-auth.ts

import { data, type LoaderFunctionArgs } from "react-router";

// ─── Web Crypto API ───────────────────────────────────────────────────────────

async function computeHmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", keyMaterial, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
    .substring(0, 16);
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

// ─── Mutation GraphQL Admin API ───────────────────────────────────────────────

const CREATE_FAKE_ALERT = `
  mutation CreateFakeAlert($fields: [MetaobjectFieldInput!]!) {
    metaobjectCreate(metaobject: {
      type: "alerta_falsificacion"
      fields: $fields
    }) {
      metaobject {
        id
        handle
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

// ─── Registro de alerta via Admin API REST ────────────────────────────────────
// Hydrogen no expone context.admin en rutas públicas.
// La Admin API se llama directamente con fetch + token privado.

async function createFakeAlertMetaobject(
  details: SecurityMetadata,
  shopDomain: string,
  adminToken: string
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
      }
    );

    const result = await response.json() as any;

    if (result.errors) {
      console.error("[PHOENIX] Error GraphQL:", result.errors);
      return;
    }

    const userErrors = result.data?.metaobjectCreate?.userErrors;
    if (userErrors?.length > 0) {
      console.error("[PHOENIX] userErrors al crear metaobject:", userErrors);
    } else {
      console.warn("[PHOENIX] Alerta registrada:", result.data?.metaobjectCreate?.metaobject?.id);
    }
  } catch (error) {
    console.error("[PHOENIX] Fallo al llamar a la Admin API:", error);
  }
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");
  const ctr = url.searchParams.get("ctr");
  const mac = url.searchParams.get("mac");

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "IP Desconocida";
  const userAgent = request.headers.get("user-agent") ?? "Desconocido";
  const now = new Date();

  const metadata: SecurityMetadata = {
    uid: uid ?? "N/A",
    ip,
    userAgent,
    date: now.toLocaleDateString("es-ES"),
    time: now.toLocaleTimeString("es-ES"),
  };

  if (!uid || !ctr || !mac) {
    return data<AuthResponse>(
      { status: "INVALID_REQUEST" },
      { status: 400, headers: corsHeaders }
    );
  }

  const SECRET = context.env.NFC_MASTER_KEY;
  if (!SECRET) {
    console.error("[PHOENIX] NFC_MASTER_KEY no está definida.");
    return data<AuthResponse>(
      { status: "SERVER_ERROR", error: "Configuración incompleta." },
      { status: 500, headers: corsHeaders }
    );
  }

  // Lee las variables necesarias para la Admin API
  const SHOP_DOMAIN = context.env.PUBLIC_STORE_DOMAIN;
  const ADMIN_TOKEN = context.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

  const dataToVerify = uid + ctr;
  const expectedMac = await computeHmacSha256(SECRET, dataToVerify);
  const isOriginal = mac.toUpperCase() === expectedMac;

  if (!isOriginal) {
    if (SHOP_DOMAIN && ADMIN_TOKEN) {
      await createFakeAlertMetaobject(metadata, SHOP_DOMAIN, ADMIN_TOKEN);
    } else {
      console.error("[PHOENIX] PUBLIC_STORE_DOMAIN o SHOPIFY_ADMIN_API_TOKEN no definidos.");
    }
    return data<AuthResponse>({ status: "FAKE" }, { status: 200, headers: corsHeaders });
  }

  return data<AuthResponse>({ status: "SUCCESS", uid }, { status: 200, headers: corsHeaders });
}