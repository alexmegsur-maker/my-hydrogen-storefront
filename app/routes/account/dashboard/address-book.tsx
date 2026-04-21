import type { CustomerAddress } from "@shopify/hydrogen/customer-account-api-types";
import type { CustomerDetailsFragment } from "customer-account-api.generated";
import { Form, Link } from "react-router";
import { Button } from "~/components/button";

export function AddressBook({
  customer,
  addresses,
}: {
  customer: CustomerDetailsFragment;
  addresses: CustomerAddress[];
}) {
  return (
    <div>
      {/* Título */}
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 300,
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#FFFFFF",
        }}
      >
        Coordenadas de Envío
        <Link
          to="/account/address/add"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 16px",
            textDecoration: "none",
          }}
        >
          + Nueva
        </Link>
      </div>

      {!addresses?.length && (
        <p style={{ color: "#52525B", fontSize: "0.9rem" }}>
          No hay coordenadas registradas.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Default primero */}
        {customer.defaultAddress && (
          <AddressCard
            address={customer.defaultAddress}
            isDefault
          />
        )}

        {/* Resto */}
        {addresses
          .filter((a) => a.id !== customer.defaultAddress?.id)
          .map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}

        {/* Añadir nueva */}
        <Link
          to="/account/address/add"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "transparent",
            border: "1px dashed #52525B",
            borderRadius: "4px",
            padding: "2rem",
            textDecoration: "none",
            minHeight: "180px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#FFFFFF";
            (e.currentTarget as HTMLAnchorElement).style.background =
              "rgba(255,255,255,0.02)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#52525B";
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              color: "#52525B",
              marginBottom: "1rem",
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            +
          </div>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1rem",
              color: "#52525B",
              letterSpacing: "1px",
            }}
          >
            Registrar Nueva Coordenada
          </span>
        </Link>
      </div>
    </div>
  );
}

function AddressCard({
  address,
  isDefault,
}: {
  address: CustomerAddress;
  isDefault?: boolean;
}) {
  const name =
    `${address.firstName ?? ""} ${address.lastName ?? ""}`.trim() || "–";

  return (
    <div
      style={{
        background: "rgba(10,10,10,0.7)",
        border: `1px solid ${isDefault ? "#FFFFFF" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "4px",
        padding: "2rem",
        position: "relative",
        transition: "border-color 0.3s",
        backdropFilter: "blur(10px)",
      }}
    >
      {isDefault && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "20px",
            background: "#FFFFFF",
            color: "#050505",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "2px",
            textTransform: "uppercase",
            padding: "2px 8px",
            borderRadius: "2px",
          }}
        >
          PRINCIPAL
        </div>
      )}

      <h3
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.1rem",
          letterSpacing: "1px",
          marginBottom: "1rem",
          color: "#FFFFFF",
        }}
      >
        {name}
      </h3>

      <address
        style={{
          fontSize: "0.9rem",
          color: "#A1A1AA",
          lineHeight: 1.8,
          marginBottom: "1.5rem",
          fontStyle: "normal",
        }}
      >
        {address.formatted?.map((line: string) => (
          <span key={line} style={{ display: "block" }}>
            {line}
          </span>
        ))}
        {address.phoneNumber && <span style={{ display: "block" }}>T: {address.phoneNumber}</span>}
      </address>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link
          to={`/account/address/${encodeURIComponent(address.id ?? "")}`}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.8rem",
            color: "#A1A1AA",
            textTransform: "uppercase",
            letterSpacing: "1px",
            textDecoration: "none",
            borderBottom: "1px dashed rgba(255,255,255,0.1)",
            transition: "all 0.3s",
            paddingBottom: "2px",
          }}
        >
          Editar
        </Link>
        <Form action="/account/address/delete" method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button
            type="submit"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.8rem",
              color: "#A1A1AA",
              textTransform: "uppercase",
              letterSpacing: "1px",
              background: "transparent",
              border: "none",
              borderBottom: "1px dashed rgba(255,255,255,0.1)",
              cursor: "pointer",
              padding: "0 0 2px",
              transition: "all 0.3s",
            }}
          >
            Eliminar
          </button>
        </Form>
      </div>
    </div>
  );
}
