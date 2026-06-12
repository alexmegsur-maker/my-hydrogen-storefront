import { type ActionFunctionArgs, data } from "@shopify/remix-oxygen";

const GET_ORDER_BY_NAME = `
  query GetOrderByName($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          id
          name
          createdAt
          email
          customer {
            email
          }
        }
      }
    }
  }
`;

const CREATE_METAOBJECT_DESISTIMIENTO = `
  mutation CreateDesistimiento($input: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $input) {
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

async function shopifyAdmin(
  adminUrl: string,
  adminToken: string,
  query: string,
  variables: Record<string, unknown>,
) {
  const res = await fetch(adminUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin API HTTP ${res.status}: ${text}`);
  }

  return res.json() as Promise<{ data?: any; errors?: { message: string }[] }>;
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const actionType = formData.get("_action") as string;

  const shop = context.env.PUBLIC_STORE_DOMAIN;
  const adminToken = context.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  const apiVersion = context.env.SHOPIFY_API_VERSION ?? "2025-01";

  if (!shop || !adminToken) {
    console.error("Faltan variables de entorno: PUBLIC_STORE_DOMAIN o SHOPIFY_ADMIN_API_ACCESS_TOKEN");
    return data(
      { success: false, error: "Configuración del servidor incompleta." },
      { status: 500 },
    );
  }

  const adminUrl = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

  // ─── Verificar pedido ─────────────────────────────────────────────────────────
  if (actionType === "verify") {
    const orderNumber = (formData.get("orderNumber") as string)?.trim();

    if (!orderNumber) {
      return data({ success: false, error: "Número de pedido requerido." }, { status: 400 });
    }

    try {
      const result = await shopifyAdmin(adminUrl, adminToken, GET_ORDER_BY_NAME, {
        query: `name:#${orderNumber}`,
      });

      if (result.errors?.length) {
        return data({ success: false, error: result.errors[0].message }, { status: 400 });
      }

      const order = result.data?.orders?.edges?.[0]?.node;

      if (!order) {
        return data(
          { success: false, error: "Pedido no encontrado. Verifica el número introducido." },
          { status: 404 },
        );
      }

      const createdAt = new Date(order.createdAt);
      const now = new Date();
      const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays > 14) {
        return data({
          success: false,
          expired: true,
          error: "No es aplicable por sobrepasar los 14 días de desistimiento.",
        });
      }

      const email: string = order.email || order.customer?.email || "";

      return data({ success: true, email, orderName: order.name as string });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      console.error("[Desistimiento] Error al verificar pedido:", message);
      return data(
        { success: false, error: "Error al verificar el pedido: " + message },
        { status: 500 },
      );
    }
  }

  // ─── Crear metaobjeto desistimiento ──────────────────────────────────────────
  if (actionType === "submit") {
    const orderNumber = (formData.get("orderNumber") as string)?.trim();
    const nombre = (formData.get("nombre") as string)?.trim();
    const correo = (formData.get("correo") as string)?.trim();

    if (!orderNumber || !nombre || !correo) {
      return data(
        { success: false, error: "Faltan datos para procesar la solicitud." },
        { status: 400 },
      );
    }

    try {
      const handle = `desistimiento-${orderNumber}-${Date.now()}`;

      const result = await shopifyAdmin(adminUrl, adminToken, CREATE_METAOBJECT_DESISTIMIENTO, {
        input: {
          type: "desistimiento_de_pedido",
          handle,
          fields: [
            { key: "pedido", value: orderNumber },
            { key: "nombre", value: nombre },
            { key: "correo", value: correo },
          ],
        },
      });

      if (result.errors?.length) {
        return data({ success: false, error: result.errors[0].message }, { status: 400 });
      }

      const metaResult = result.data?.metaobjectCreate;

      if (metaResult?.userErrors?.length) {
        return data(
          { success: false, error: metaResult.userErrors[0].message },
          { status: 400 },
        );
      }

      if (metaResult?.metaobject) {
        console.log(`[Desistimiento] Metaobjeto creado: ${metaResult.metaobject.handle}`);
        return data({ success: true });
      }

      return data(
        { success: false, error: "No se recibió respuesta de Shopify." },
        { status: 500 },
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      console.error("[Desistimiento] Error al crear metaobjeto:", message);
      return data(
        { success: false, error: "Error al procesar la solicitud: " + message },
        { status: 500 },
      );
    }
  }

  return data({ success: false, error: "Acción no reconocida." }, { status: 400 });
}
