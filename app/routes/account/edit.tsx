import type {
  Customer,
  CustomerUpdateInput,
} from "@shopify/hydrogen/customer-account-api-types";
import type { CustomerUpdateMutation } from "customer-account-api.generated";
import type { ActionFunction } from "react-router";
import {
  data,
  Form,
  redirect,
  useActionData,
  useNavigation,
  useOutletContext,
} from "react-router";
import invariant from "tiny-invariant";
import { Link } from "~/components/link";
import { doLogout } from "./auth/logout";
import { CUSTOMER_UPDATE_MUTATION } from "./profile";

export interface AccountOutletContext {
  customer: Customer;
}

export interface ActionData {
  success?: boolean;
  formError?: string;
  fieldErrors?: {
    firstName?: string;
    lastName?: string;
  };
}

function formDataHas(formData: FormData, key: string) {
  if (!formData.has(key)) return false;
  const value = formData.get(key);
  return typeof value === "string" && value.length > 0;
}

export const handle = { renderInModal: true };

export const action: ActionFunction = async ({ request, context, params }) => {
  const formData = await request.formData();
  if (!(await context.customerAccount.isLoggedIn())) {
    throw await doLogout(context);
  }
  try {
    const customer: CustomerUpdateInput = {};
    if (formDataHas(formData, "firstName")) customer.firstName = formData.get("firstName") as string;
    if (formDataHas(formData, "lastName")) customer.lastName = formData.get("lastName") as string;
    const { data: updateData, errors } =
      await context.customerAccount.mutate<CustomerUpdateMutation>(
        CUSTOMER_UPDATE_MUTATION,
        { variables: { customer } },
      );
    invariant(!errors?.length, errors?.[0]?.message);
    invariant(
      !updateData?.customerUpdate?.userErrors?.length,
      updateData?.customerUpdate?.userErrors?.[0]?.message,
    );
    return redirect(params?.locale ? `${params.locale}/account` : "/account");
  } catch (error: any) {
    return data({ formError: error?.message }, { status: 400 });
  }
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#FFFFFF",
  padding: "0.75rem 1rem",
  fontSize: "0.9rem",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  borderRadius: 0,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Outfit', sans-serif",
  fontSize: "0.7rem",
  color: "#52525B",
  textTransform: "uppercase",
  letterSpacing: "2px",
  marginBottom: "0.5rem",
};

export default function AccountDetailsEdit() {
  const actionData = useActionData<ActionData>();
  const { customer } = useOutletContext<AccountOutletContext>();
  const { state } = useNavigation();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.1rem",
          fontWeight: 300,
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "#FFFFFF",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "1rem",
        }}
      >
        Editar Datos
      </div>

      <Form method="post" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {actionData?.formError && (
          <div
            style={{
              background: "rgba(255,68,68,0.08)",
              border: "1px solid rgba(255,68,68,0.3)",
              color: "#ff4444",
              padding: "0.75rem 1rem",
              fontSize: "0.85rem",
            }}
          >
            {actionData.formError}
          </div>
        )}

        <div>
          <label htmlFor="firstName" style={labelStyle}>Nombre</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Nombre"
            defaultValue={customer.firstName ?? ""}
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
            defaultValue={customer.lastName ?? ""}
            style={inputStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "1.5rem",
            paddingTop: "0.5rem",
          }}
        >
          <Link
            to="/account"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.8rem",
              color: "#A1A1AA",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Cancelar
          </Link>
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
              padding: "0.75rem 1.5rem",
              cursor: state !== "idle" ? "not-allowed" : "pointer",
              opacity: state !== "idle" ? 0.6 : 1,
            }}
          >
            {state === "submitting" ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </Form>
    </div>
  );
}
