import { CheckIcon } from "@phosphor-icons/react";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Dialog from "@radix-ui/react-dialog";
import { flattenConnection } from "@shopify/hydrogen";
import type { CustomerAddressInput } from "@shopify/hydrogen/customer-account-api-types";
import type {
  CustomerAddressCreateMutation,
  CustomerAddressDeleteMutation,
  CustomerAddressUpdateMutation,
} from "customer-account-api.generated";
import type { ActionFunction } from "react-router";
import {
  data,
  Form,
  redirect,
  useActionData,
  useNavigation,
  useOutletContext,
  useParams,
} from "react-router";
import invariant from "tiny-invariant";
import { Link } from "~/components/link";
import type { AccountOutletContext } from "~/routes/account/edit";
import { doLogout } from "../auth/logout";
import {
  CREATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from "./address-mutation-queries";

export const handle = { renderInModal: true };

const ADDRESS_INPUT_KEYS: (keyof CustomerAddressInput)[] = [
  "lastName", "firstName", "address1", "address2", "city",
  "zoneCode", "territoryCode", "zip", "phoneNumber", "company",
];

export const action: ActionFunction = async ({ request, context, params }) => {
  const { customerAccount } = context;
  const formData = await request.formData();
  if (!(await customerAccount.isLoggedIn())) throw await doLogout(context);
  const addressId = formData.get("addressId");
  invariant(typeof addressId === "string", "You must provide an address id.");

  if (request.method === "DELETE") {
    try {
      const { data: deleteData, errors } =
        await customerAccount.mutate<CustomerAddressDeleteMutation>(DELETE_ADDRESS_MUTATION, {
          variables: { addressId, language: customerAccount.i18n.language },
        });
      invariant(!errors?.length, errors?.[0]?.message);
      invariant(!deleteData?.customerAddressDelete?.userErrors?.length, deleteData?.customerAddressDelete?.userErrors?.[0]?.message);
      return redirect(params?.locale ? `${params?.locale}/account` : "/account");
    } catch (error: unknown) {
      return data({ formError: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
    }
  }

  const address: CustomerAddressInput = {};
  for (const key of ADDRESS_INPUT_KEYS) {
    const value = formData.get(key);
    if (typeof value === "string") address[key] = value;
  }
  const defaultAddress = formData.has("defaultAddress")
    ? String(formData.get("defaultAddress")) === "on"
    : false;

  if (addressId === "add") {
    try {
      const { data: createData, errors } =
        await customerAccount.mutate<CustomerAddressCreateMutation>(CREATE_ADDRESS_MUTATION, {
          variables: { address, defaultAddress, language: customerAccount.i18n.language },
        });
      invariant(!errors?.length, errors?.[0]?.message);
      invariant(!createData?.customerAddressCreate?.userErrors?.length, createData?.customerAddressCreate?.userErrors?.[0]?.message);
      invariant(createData?.customerAddressCreate?.customerAddress?.id, "Expected customer address to be created");
      return redirect(params?.locale ? `${params?.locale}/account` : "/account");
    } catch (error: unknown) {
      return data({ formError: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
    }
  } else {
    try {
      const { data: updateData, errors } =
        await customerAccount.mutate<CustomerAddressUpdateMutation>(UPDATE_ADDRESS_MUTATION, {
          variables: { address, addressId, defaultAddress, language: customerAccount.i18n.language },
        });
      invariant(!errors?.length, errors?.[0]?.message);
      invariant(!updateData?.customerAddressUpdate?.userErrors?.length, updateData?.customerAddressUpdate?.userErrors?.[0]?.message);
      return redirect(params?.locale ? `${params?.locale}/account` : "/account");
    } catch (error: unknown) {
      return data({ formError: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
    }
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

export default function AccountEditAddressForm() {
  const { id: addressId } = useParams();
  const isNewAddress = addressId === "add";
  const actionData = useActionData<{ formError?: string }>();
  const { state } = useNavigation();
  const { customer } = useOutletContext<AccountOutletContext>();
  const addresses = flattenConnection(customer.addresses);
  const defaultAddress = customer.defaultAddress;
  const normalizedAddress = decodeURIComponent(addressId ?? "").split("?")[0];
  const address = addresses.find((ad) => ad.id?.startsWith(normalizedAddress));

  const fields: { id: string; name: string; label: string; autoComplete?: string; required?: boolean; type?: string }[] = [
    { id: "firstName", name: "firstName", label: "Nombre", autoComplete: "given-name", required: true },
    { id: "lastName", name: "lastName", label: "Apellidos", autoComplete: "family-name", required: true },
    { id: "company", name: "company", label: "Empresa", autoComplete: "organization" },
    { id: "address1", name: "address1", label: "Dirección línea 1", autoComplete: "address-line1", required: true },
    { id: "address2", name: "address2", label: "Dirección línea 2", autoComplete: "address-line2" },
    { id: "city", name: "city", label: "Ciudad", autoComplete: "address-level2", required: true },
    { id: "zoneCode", name: "zoneCode", label: "Provincia / Estado", autoComplete: "address-level1", required: true },
    { id: "zip", name: "zip", label: "Código Postal", autoComplete: "postal-code", required: true },
    { id: "territoryCode", name: "territoryCode", label: "País (Código territorio)", autoComplete: "country", required: true },
    { id: "phoneNumber", name: "phoneNumber", label: "Teléfono", autoComplete: "tel", type: "tel" },
  ];

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
        {isNewAddress ? "Nueva Coordenada" : "Editar Coordenada"}
      </div>

      <Form method="post" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <input type="hidden" name="addressId" value={address?.id ?? addressId} />

        {actionData?.formError && (
          <div style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.3)", color: "#ff4444", padding: "0.75rem 1rem", fontSize: "0.85rem" }}>
            {actionData.formError}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {fields.map((field) => (
            <div
              key={field.id}
              style={{ gridColumn: ["address1", "address2", "company"].includes(field.id) ? "1 / -1" : undefined }}
            >
              <label htmlFor={field.id} style={labelStyle}>{field.label}</label>
              <input
                id={field.id}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                required={field.required}
                placeholder={field.label}
                defaultValue={(address as any)?.[field.name] ?? ""}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        {/* Checkbox default */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Checkbox.Root
            name="defaultAddress"
            id="defaultAddress"
            defaultChecked={defaultAddress?.id === address?.id}
            style={{
              width: "18px",
              height: "18px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Checkbox.Indicator>
              <CheckIcon style={{ width: "12px", height: "12px", color: "#FFFFFF" }} weight="bold" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label
            htmlFor="defaultAddress"
            style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}
          >
            Establecer como coordenada principal
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1.5rem", paddingTop: "0.5rem" }}>
          <Dialog.Close asChild>
            <Link
              to="/account"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "#A1A1AA", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px" }}
            >
              Cancelar
            </Link>
          </Dialog.Close>
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
