import type { CustomerUpdateInput } from "@shopify/hydrogen/customer-account-api-types";
import type { CustomerUpdateMutation } from "customer-account-api.generated";
import {
  type ActionFunctionArgs,
  data,
  Form,
  type LoaderFunctionArgs,
  type MetaFunction,
  useActionData,
  useNavigation,
  useOutletContext,
} from "react-router";

export const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate(
    $customer: CustomerUpdateInput!
    $language: LanguageCode
  ) @inContext(language: $language) {
    customerUpdate(input: $customer) {
      customer {
        firstName
        lastName
        emailAddress { emailAddress }
        phoneNumber { phoneNumber }
      }
      userErrors { code field message }
    }
  }
` as const;

export type ActionResponse = {
  error: string | null;
  customer: CustomerUpdateMutation["customerUpdate"]["customer"] | null;
};

export const meta: MetaFunction = () => [{ title: "Datos Operador | Phoenix" }];

export async function loader({ context }: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { customerAccount } = context;
  if (request.method !== "PUT") return data({ error: "Method not allowed" }, { status: 405 });
  const form = await request.formData();
  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ["firstName", "lastName"] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) continue;
      if (typeof value === "string" && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }
    const { data: updateData, errors } = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      { variables: { customer, language: customerAccount.i18n.language } },
    );
    if (errors?.length) throw new Error(errors[0].message);
    if (!updateData?.customerUpdate?.customer) throw new Error("Customer profile update failed.");
    return { error: null, customer: updateData?.customerUpdate?.customer };
  } catch (error: unknown) {
    return data(
      { error: error instanceof Error ? error.message : "Unknown error", customer: null },
      { status: 400 },
    );
  }
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(10,10,10,0.7)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#FFFFFF",
  padding: "0.85rem 1rem",
  fontSize: "0.9rem",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  transition: "border-color 0.3s",
  borderRadius: 0,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Outfit', sans-serif",
  fontSize: "0.75rem",
  color: "#52525B",
  textTransform: "uppercase",
  letterSpacing: "2px",
  marginBottom: "0.5rem",
};

export default function AccountProfile() {
  const account = useOutletContext<{
    customer: CustomerUpdateMutation["customerUpdate"]["customer"];
  }>();
  const { state } = useNavigation();
  const actionData = useActionData<ActionResponse>();
  const customer = actionData?.customer ?? account?.customer;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 300,
          textTransform: "uppercase",
          letterSpacing: "2px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "1rem",
          color: "#FFFFFF",
        }}
      >
        Datos del Operador
      </div>

      <div
        style={{
          background: "rgba(10,10,10,0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          padding: "2.5rem",
          backdropFilter: "blur(10px)",
        }}
      >
        <Form method="PUT" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label htmlFor="firstName" style={labelStyle}>Nombre</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Nombre"
                defaultValue={customer?.firstName ?? ""}
                minLength={2}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="lastName" style={labelStyle}>Apellidos</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Apellidos"
                defaultValue={customer?.lastName ?? ""}
                minLength={2}
                style={inputStyle}
              />
            </div>
          </div>

          {actionData?.error && (
            <div
              style={{
                background: "rgba(255,68,68,0.08)",
                border: "1px solid rgba(255,68,68,0.3)",
                color: "#ff4444",
                padding: "0.85rem 1rem",
                fontSize: "0.85rem",
                borderRadius: "2px",
              }}
            >
              {actionData.error}
            </div>
          )}

          {actionData?.customer && !actionData?.error && (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#FFFFFF",
                padding: "0.85rem 1rem",
                fontSize: "0.85rem",
                borderRadius: "2px",
              }}
            >
              Datos actualizados correctamente.
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={state !== "idle"}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#050505",
                background: "#FFFFFF",
                border: "none",
                padding: "0.85rem 2rem",
                cursor: state !== "idle" ? "not-allowed" : "pointer",
                opacity: state !== "idle" ? 0.6 : 1,
                transition: "all 0.3s",
              }}
            >
              {state !== "idle" ? "Actualizando..." : "Confirmar Cambios"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
