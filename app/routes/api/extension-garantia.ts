import { type ActionFunctionArgs, data } from "@shopify/remix-oxygen";

// ─── Mutación: crear metaobject de garantía ───────────────────────────────────

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

// ─── Mutación: suscribir cliente a newsletter ─────────────────────────────────
// Busca si el customer ya existe. Si existe, actualiza su consentimiento.
// Si no existe, lo crea con el consentimiento activado.

const FIND_CUSTOMER_BY_EMAIL = `
  query FindCustomer($email: String!) {
    customers(first: 1, query: $email) {
      edges {
        node {
          id
          emailMarketingConsent {
            marketingState
          }
        }
      }
    }
  }
`;

const UPDATE_CUSTOMER_MARKETING = `
  mutation UpdateCustomerMarketing($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_CUSTOMER_WITH_MARKETING = `
  mutation CreateCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ─── Helper: llamada al Admin API ─────────────────────────────────────────────

async function shopifyAdmin(
  adminUrl: string,
  adminToken: string,
  query: string,
  variables: Record<string, unknown>
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

// ─── Helper: suscribir email a newsletter ─────────────────────────────────────

async function subscribeToNewsletter(
  email: string,
  adminUrl: string,
  adminToken: string
): Promise<void> {
  // 1. Buscar si el customer ya existe
  const findResult = await shopifyAdmin(adminUrl, adminToken, FIND_CUSTOMER_BY_EMAIL, {
    email: `email:${email}`,
  });

  const existingCustomer = findResult.data?.customers?.edges?.[0]?.node;

  const marketingConsent = {
    marketingState: "SUBSCRIBED",
    marketingOptInLevel: "SINGLE_OPT_IN",
    // consentUpdatedAt lo pone Shopify automáticamente
  };

  if (existingCustomer) {
    // 2a. Ya existe → actualizamos solo el consentimiento
    const alreadySubscribed =
      existingCustomer.emailMarketingConsent?.marketingState === "SUBSCRIBED";

    if (alreadySubscribed) {
      console.log(`[Newsletter] ${email} ya estaba suscrito.`);
      return;
    }

    const updateResult = await shopifyAdmin(adminUrl, adminToken, UPDATE_CUSTOMER_MARKETING, {
      input: {
        id: existingCustomer.id,
        emailMarketingConsent: marketingConsent,
      },
    });

    const errors = updateResult.data?.customerUpdate?.userErrors;
    if (errors?.length) {
      console.error("[Newsletter] Error al actualizar consentimiento:", errors);
    } else {
      console.log(`[Newsletter] ${email} suscrito (actualización).`);
    }
  } else {
    // 2b. No existe → creamos el customer con consentimiento activo
    const createResult = await shopifyAdmin(adminUrl, adminToken, CREATE_CUSTOMER_WITH_MARKETING, {
      input: {
        email,
        emailMarketingConsent: marketingConsent,
      },
    });

    const errors = createResult.data?.customerCreate?.userErrors;
    if (errors?.length) {
      console.error("[Newsletter] Error al crear customer:", errors);
    } else {
      console.log(`[Newsletter] ${email} suscrito (customer nuevo).`);
    }
  }
}

// ─── Action principal ─────────────────────────────────────────────────────────

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();

  const email          = formData.get("contact[email]") as string;
  const pedido         = formData.get("contact[phone]") as string;
  const urlPublicacion = formData.get("contact[body]") as string;

  if (!email || !pedido || !urlPublicacion) {
    return data(
      { success: false, error: "Por favor, completa todos los campos." },
      { status: 400 }
    );
  }

  const shop       = context.env.PUBLIC_STORE_DOMAIN;
  const adminToken = context.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  const apiVersion = context.env.SHOPIFY_API_VERSION ?? "2025-01";

  if (!shop || !adminToken) {
    console.error("Faltan variables de entorno: PUBLIC_STORE_DOMAIN o SHOPIFY_ADMIN_API_ACCESS_TOKEN");
    return data(
      { success: false, error: "Configuración del servidor incompleta." },
      { status: 500 }
    );
  }

  const adminUrl = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

  try {
    // Ejecutamos ambas operaciones en paralelo para no añadir latencia
    const [garantiaResult, _newsletter] = await Promise.allSettled([
      shopifyAdmin(adminUrl, adminToken, CREATE_METAOBJECT_GARANTIA, {
        input: {
          type: "extension_de_garantia",
          fields: [
            { key: "correo",         value: email },
            { key: "numero_pedido",  value: pedido },
            { key: "url",            value: urlPublicacion },
          ],
        },
      }),
      subscribeToNewsletter(email, adminUrl, adminToken),
    ]);

    // Si la newsletter falló, lo logueamos pero no bloqueamos la respuesta al usuario
    if (_newsletter.status === "rejected") {
      console.error("[Newsletter] Falló la suscripción:", _newsletter.reason);
    }

    // La garantía sí es crítica: evaluamos su resultado
    if (garantiaResult.status === "rejected") {
      throw garantiaResult.reason;
    }

    const json = garantiaResult.value as {
      data?: {
        metaobjectCreate?: {
          metaobject?: { id: string; handle: string };
          userErrors?: { field: string; message: string; code: string }[];
        };
      };
      errors?: { message: string }[];
    };

    if (json.errors?.length) {
      return data({ success: false, error: json.errors[0].message }, { status: 400 });
    }

    const result = json.data?.metaobjectCreate;

    if (result?.userErrors?.length) {
      return data({ success: false, error: result.userErrors[0].message }, { status: 400 });
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