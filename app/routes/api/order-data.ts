import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";

const EXISTING_REQUEST_QUERY = `
  query GetSolicitudesDevolucion($type: String!) {
    metaobjects(type: $type, first: 250) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
          }
        }
      }
    }
  }
`;

const ORDER_QUERY = `
  query OrderByNumberAndEmail($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          id
          name
          email
          displayFulfillmentStatus
          displayFinancialStatus
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 10) {
            edges {
              node {
                product {
                  id
                }
                title
                quantity
                image{
                  url
                  altText
                }
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          shippingAddress {
            firstName
            lastName
            address1
            city
            country
          }
        }
      }
    }
  }
`;

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const orderNumber = url.searchParams.get("order");
  const email = url.searchParams.get("email");

  if (!orderNumber || !email) {
    return Response.json(
      { error: "Se requieren los parámetros 'order' y 'email'" },
      { status: 400 }
    );
  }

  const shop = context.env.PUBLIC_STORE_DOMAIN;
  const adminToken = context.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  const apiVersion = context.env.SHOPIFY_API_VERSION ?? "2026-01";

  if (!shop || !adminToken) {
    console.error("Faltan variables de entorno: PUBLIC_STORE_DOMAIN o SHOPIFY_ADMIN_API_ACCESS_TOKEN");
    return Response.json({ error: "Configuración del servidor incompleta." }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({
          query: ORDER_QUERY,
          variables: { query: `name:#${orderNumber} email:${email}` },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`Admin API HTTP ${response.status}:`, text);
      return Response.json({ error: "Error consultando el pedido" }, { status: 500 });
    }

    const { data, errors } = await response.json() as any;

    if (errors?.length) {
      console.error("GraphQL errors:", errors);
      return Response.json({ error: "Error consultando el pedido" }, { status: 500 });
    }

    const order = data?.orders?.edges?.[0]?.node ?? null;

    if (!order) {
      return Response.json(
        { error: "No se encontró ningún pedido con esos datos" },
        { status: 404 }
      );
    }

    // Look for an existing return request in solicitud_de_devolucion metaobject
    let existingRequest: Record<string, string> | null = null;
    try {
      const metaRes = await fetch(
        `https://${shop}/admin/api/${apiVersion}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": adminToken,
          },
          body: JSON.stringify({
            query: EXISTING_REQUEST_QUERY,
            variables: { type: "solicitud_de_devolucion" },
          }),
        }
      );

      if (metaRes.ok) {
        const { data: metaData } = await metaRes.json() as any;
        const nodes = metaData?.metaobjects?.edges ?? [];

        const match = nodes.find(({ node }: any) => {
          const fields: Record<string, string> = Object.fromEntries(
            node.fields.map((f: any) => [f.key, f.value])
          );
          const orderNameNormalized = order.name.replace("#", "");
          return (
            (fields.pedido === orderNumber || fields.pedido === orderNameNormalized) &&
            fields.correo?.toLowerCase() === email.toLowerCase()
          );
        });

        if (match) {
          existingRequest = Object.fromEntries(
            match.node.fields.map((f: any) => [f.key, f.value])
          );
          existingRequest._id = match.node.id;
          existingRequest._handle = match.node.handle;
        }
      }
    } catch (_) {
      // metaobject lookup is best-effort; don't fail the whole request
    }

    return Response.json({ order, existingRequest });
  } catch (e) {
    console.error("Error inesperado:", e);
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
