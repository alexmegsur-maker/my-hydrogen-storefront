import { type ActionFunctionArgs, data } from "@shopify/remix-oxygen";

// Esta mutación va al ADMIN API (no al Storefront API).
// metaobjectCreate solo existe en el Admin API.
const CREATE_METAOBJECT_GARANTIA = `
  mutation CreateMetaobject($input: MetaobjectCreateInput!) {
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

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();

  const email = formData.get("contact[email]") as string;
  const pedido = formData.get("contact[phone]") as string;
  const urlPublicacion = formData.get("contact[body]") as string;

  if (!email || !pedido || !urlPublicacion) {
    return data(
      { success: false, error: "Por favor, completa todos los campos." },
      { status: 400 }
    );
  }

  // Leemos las env vars que Hydrogen expone en el contexto de Oxygen/Vite
  const shop = context.env.PUBLIC_STORE_DOMAIN; // ej: "mi-tienda.myshopify.com"
  const adminToken = context.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN; // Admin API token
  const apiVersion = context.env.SHOPIFY_API_VERSION ?? "2025-01"; // ej: "2025-01"

  if (!shop || !adminToken) {
    console.error(
      "Faltan variables de entorno: PUBLIC_STORE_DOMAIN o SHOPIFY_ADMIN_API_ACCESS_TOKEN"
    );
    return data(
      { success: false, error: "Configuración del servidor incompleta." },
      { status: 500 }
    );
  }

  try {
    const adminUrl = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

    const response = await fetch(adminUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // El Admin API usa X-Shopify-Access-Token, no Authorization Bearer
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: CREATE_METAOBJECT_GARANTIA,
        variables: {
          input: {
            type: "extension_de_garantia",
            fields: [
              { key: "correo", value: email },
              { key: "numero_pedido", value: pedido },
              { key: "url", value: urlPublicacion },
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Admin API HTTP error:", response.status, text);
      return data(
        { success: false, error: `Error HTTP ${response.status} del Admin API.` },
        { status: 500 }
      );
    }

    const json = (await response.json()) as {
      data?: {
        metaobjectCreate?: {
          metaobject?: { id: string; handle: string };
          userErrors?: { field: string; message: string; code: string }[];
        };
      };
      errors?: { message: string }[];
    };

    // Errores de GraphQL (sintaxis / permisos)
    if (json.errors?.length) {
      console.error("GraphQL errors:", json.errors);
      return data(
        { success: false, error: json.errors[0].message },
        { status: 400 }
      );
    }

    const result = json.data?.metaobjectCreate;

    // Errores de negocio (userErrors)
    if (result?.userErrors?.length) {
      return data(
        { success: false, error: result.userErrors[0].message },
        { status: 400 }
      );
    }

    if (result?.metaobject) {
      return data({ success: true }, { status: 201 });
    }

    return data(
      { success: false, error: "No se recibió respuesta de Shopify." },
      { status: 500 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en action extension-garantia:", message);
    return data(
      { success: false, error: "Error al conectar con Shopify: " + message },
      { status: 500 }
    );
  }
}