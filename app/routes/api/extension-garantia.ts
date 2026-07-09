import { type ActionFunctionArgs, data } from "@shopify/remix-oxygen";

// ─── Mutación: crear metaobject de garantía ───────────────────────────────────

const CREATE_METAOBJECT_LIVE_SYSTEM = `
  mutation CreateLiveSystem($input: MetaobjectCreateInput!) {
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

const UPDATE_CUSTOMER_MARKETING_CONSENT = `
  mutation CustomerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
        code
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

// ─── Helper: crear metaobject live_system (reemplaza el Flow de Shopify) ──────

async function createLiveSystemMetaobject(
  customerId: string,
  email: string,
  adminUrl: string,
  adminToken: string
): Promise<void> {
  // Extraer ID numérico del GID: "gid://shopify/Customer/123" → "123"
  const numericId = customerId.replace("gid://shopify/Customer/", "");
  const handle = `newsletter-${numericId}-${Date.now()}`;
  const date = new Date().toISOString();

  const result = await shopifyAdmin(adminUrl, adminToken, CREATE_METAOBJECT_LIVE_SYSTEM, {
    input: {
      type: "live_system",
      handle,
      fields: [
        { key: "nombre", value: email },
        { key: "type",   value: "newsletter-signup" },
        { key: "date",   value: date },
      ],
    },
  });

  if (result.errors?.length) {
    console.error("[Newsletter] Error de API al crear live_system:", result.errors);
    return;
  }

  const errors = result.data?.metaobjectCreate?.userErrors;
  if (errors?.length) {
    console.error("[Newsletter] Error al crear metaobject live_system:", errors);
  } else {
    console.log(`[Newsletter] Metaobject live_system creado para ${email} (handle: ${handle})`);
  }
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

  if (existingCustomer) {
    // 2a. Ya existe → comprobamos su estado de marketing
    const marketingState = existingCustomer.emailMarketingConsent?.marketingState;

    if (marketingState === "SUBSCRIBED") {
      console.log(`[Newsletter] ${email} ya estaba suscrito.`);
      return;
    }

    if (marketingState === "UNSUBSCRIBED") {
      console.log(`[Newsletter] ${email} estaba dado de baja. Re-suscribiendo...`);
    }

    // Usamos la mutación dedicada de consentimiento: funciona tanto para
    // NOT_SUBSCRIBED como para UNSUBSCRIBED (re-suscripción).
    const consentResult = await shopifyAdmin(adminUrl, adminToken, UPDATE_CUSTOMER_MARKETING_CONSENT, {
      input: {
        customerId: existingCustomer.id,
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
          consentUpdatedAt: new Date().toISOString(),
        },
      },
    });

    if (consentResult.errors?.length) {
      console.error("[Newsletter] Error de API al actualizar consentimiento:", consentResult.errors);
      return;
    }

    const consentErrors = consentResult.data?.customerEmailMarketingConsentUpdate?.userErrors;
    const updatedCustomer = consentResult.data?.customerEmailMarketingConsentUpdate?.customer;

    if (consentErrors?.length) {
      console.error("[Newsletter] Error al actualizar consentimiento:", consentErrors);
    } else if (!updatedCustomer) {
      console.error("[Newsletter] customerEmailMarketingConsentUpdate no retornó customer. Verificar scopes (write_customers).");
    } else {
      console.log(`[Newsletter] ${email} suscrito correctamente (estado anterior: ${marketingState ?? "desconocido"}).`);
      await createLiveSystemMetaobject(existingCustomer.id, email, adminUrl, adminToken);
    }
  } else {
    // 2b. No existe → creamos el customer con consentimiento activo
    const createResult = await shopifyAdmin(adminUrl, adminToken, CREATE_CUSTOMER_WITH_MARKETING, {
      input: {
        email,
        emailMarketingConsent: marketingConsent,
      },
    });

    if (createResult.errors?.length) {
      console.error("[Newsletter] Error de API al crear customer:", createResult.errors);
      return;
    }

    const createErrors = createResult.data?.customerCreate?.userErrors;
    const newCustomer = createResult.data?.customerCreate?.customer;

    if (createErrors?.length) {
      console.error("[Newsletter] Error al crear customer:", createErrors);
    } else if (!newCustomer) {
      console.error("[Newsletter] customerCreate no retornó customer ni errores. Verificar scopes del token (write_customers).");
    } else {
      console.log(`[Newsletter] ${email} suscrito (customer nuevo).`);
      await createLiveSystemMetaobject(newCustomer.id, email, adminUrl, adminToken);
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