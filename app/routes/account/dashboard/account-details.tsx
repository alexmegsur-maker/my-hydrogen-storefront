import type { CustomerDetailsFragment } from "customer-account-api.generated";
import { Link } from "~/components/link";

export function AccountDetails({
  customer,
}: {
  customer: CustomerDetailsFragment;
}) {
  const { firstName, lastName, emailAddress, phoneNumber } = customer;
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();

  const rows = [
    { label: "Nombre", value: fullName || "N/A" },
    { label: "Teléfono", value: phoneNumber?.phoneNumber ?? "N/A" },
    { label: "Email", value: emailAddress?.emailAddress ?? "N/A" },
  ];

  return (
    <div>
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
        Datos del Operador
        <Link
          to="/account/profile"
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
          Editar
        </Link>
      </div>

      <div
        style={{
          background: "rgba(10,10,10,0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          padding: "2rem",
          backdropFilter: "blur(10px)",
        }}
      >
        {rows.map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "0.85rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.75rem",
                color: "#52525B",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {label}
            </span>
            <span style={{ fontSize: "0.9rem", color: "#A1A1AA" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
