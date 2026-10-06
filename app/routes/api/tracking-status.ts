// GET /api/tracking-status?trackingNumber=1805152510
// Solo consulta al transportista y devuelve el estado actual. No escribe nada
// en Shopify: la lógica de actualización del pedido vive en el Flow.

import type { LoaderFunctionArgs } from "react-router";
import { resolveTracking } from "~/lib/tracking/resolver.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const env = context.env as unknown as Record<string, string | undefined>;

  const trackingNumber = new URL(request.url).searchParams.get("trackingNumber")?.trim();
  if (!trackingNumber) {
    return Response.json({ error: "Falta el parámetro trackingNumber." }, { status: 400 });
  }

  try {
    const tracking = await resolveTracking({ trackingNumber, env });
    if (!tracking || tracking.error) {
      return Response.json(
        { error: tracking?.error ?? "El transportista no respondió." },
        { status: 502 },
      );
    }
    return Response.json({ status: tracking.currentStatus });
  } catch (e) {
    console.error("[api/tracking-status] Error:", e);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
};
