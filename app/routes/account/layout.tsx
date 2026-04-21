import { XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { CacheNone, generateCacheControlHeader } from "@shopify/hydrogen";
import { clsx } from "clsx";
import type { CustomerDetailsQuery } from "customer-account-api.generated";
import type { LoaderFunctionArgs } from "react-router";
import { data, Link, Outlet, useLoaderData, useLocation, useMatches } from "react-router";
import { routeHeaders } from "~/utils/cache";
import { getFeaturedProducts } from "~/utils/featured-products";
import { doLogout } from "./auth/logout";
import AccountDashboard from "./dashboard";

export const headers = routeHeaders;

export async function loader({ context }: LoaderFunctionArgs) {
  const { data: d, errors } =
    await context.customerAccount.query<CustomerDetailsQuery>(
      CUSTOMER_DETAILS_QUERY,
      {
        variables: {
          language: context.customerAccount.i18n.language,
        },
      },
    );

  if (errors?.length || !d?.customer) {
    throw await doLogout(context);
  }

  const customer = d?.customer;
  const heading = customer ? "My Account" : "Account Details";

  return data(
    {
      customer,
      heading,
      featuredProducts: getFeaturedProducts(context.storefront),
    },
    { headers: { "Cache-Control": generateCacheControlHeader(CacheNone()) } },
  );
}

const NAV_LINKS = [
  { to: "/account", label: "Panel Principal", exact: true },
  { to: "/account/orders", label: "Historial Despliegues" },
  { to: "/account/address", label: "Coordenadas Envío" },
  { to: "/account/profile", label: "Datos Operador" },
];

export default function AccountLayout() {
  const loaderData = useLoaderData<typeof loader>();
  const location = useLocation();
  const matches = useMatches();

  const renderInModal = matches.find(
    (match: { handle?: { renderInModal?: boolean } }) =>
      match?.handle?.renderInModal,
  );

  const { customer } = loaderData;
  const fullName =
    `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim() ||
    "Operador";

  const sidebar = (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        minWidth: "220px",
      }}
    >
      {/* Header del sidebar */}
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.7rem",
          color: "#52525B",
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "1rem",
        }}
      >
        ID Operador: {customer?.firstName ?? "–"}
      </div>

      {NAV_LINKS.map(({ to, label, exact }) => {
        const isActive = exact
          ? location.pathname === to
          : location.pathname.startsWith(to) && to !== "/account";
        const isDashboardActive =
          to === "/account" && location.pathname === "/account";

        const active = isActive || isDashboardActive;

        return (
          <Link
            key={to}
            to={to}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1rem",
              color: active ? "#FFFFFF" : "#A1A1AA",
              textDecoration: "none",
              padding: "0.8rem 1rem",
              borderLeft: active
                ? "2px solid #FFFFFF"
                : "2px solid transparent",
              background: active
                ? "linear-gradient(90deg, rgba(255,255,255,0.05), transparent)"
                : "transparent",
              fontWeight: active ? 600 : 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.3s ease",
            }}
          >
            {label}
            <span style={{ opacity: active ? 1 : 0.4 }}>→</span>
          </Link>
        );
      })}

      {/* Logout */}
      <form
        method="post"
        action="/account/logout"
        style={{ marginTop: "3rem" }}
      >
        <button
          type="submit"
          style={{
            width: "100%",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.8rem",
            color: "#ff4444",
            textTransform: "uppercase",
            letterSpacing: "2px",
            padding: "0.8rem 1rem",
            background: "transparent",
            border: "1px solid transparent",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.border =
              "1px solid #ff4444";
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,68,68,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.border =
              "1px solid transparent";
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
        >
          Abortar Sesión [Cerrar]
        </button>
      </form>
    </aside>
  );

  if (renderInModal) {
    return (
      <>
        <Dialog.Root defaultOpen>
          <Dialog.Portal>
            <Dialog.Overlay
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)",
              }}
            />
            <Dialog.Content
              onCloseAutoFocus={(e) => e.preventDefault()}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
              }}
              aria-describedby={undefined}
            >
              <div
                style={{
                  position: "relative",
                  width: "500px",
                  maxWidth: "90vw",
                  background: "#0A0A0A",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "2rem 2rem 1.5rem",
                }}
              >
                <VisuallyHidden.Root asChild>
                  <Dialog.Title>Account modal</Dialog.Title>
                </VisuallyHidden.Root>
                <Outlet context={loaderData} />
                <Dialog.Close asChild>
                  <Link
                    to="/account"
                    style={{
                      position: "absolute",
                      top: "1.25rem",
                      right: "1rem",
                      padding: "0.5rem",
                      color: "#A1A1AA",
                      display: "flex",
                    }}
                    aria-label="Close account modal"
                  >
                    <XIcon style={{ width: "1rem", height: "1rem" }} />
                  </Link>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Dashboard visible detrás del modal */}
        <PhoenixAccountShell sidebar={sidebar} fullName={fullName}>
          <AccountDashboard />
        </PhoenixAccountShell>
      </>
    );
  }

  return (
    <PhoenixAccountShell sidebar={sidebar} fullName={fullName}>
      <Outlet context={loaderData} />
    </PhoenixAccountShell>
  );
}

// ─── Shell con nav + grid lateral ────────────────────────────────────────────

function PhoenixAccountShell({
  sidebar,
  fullName,
  children,
}: {
  sidebar: React.ReactNode;
  fullName: string;
  children: React.ReactNode;
})
 {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        color: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >

      {/* Layout grid */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "4rem auto 4rem",
          padding: "0 2rem",
          gridTemplateColumns: "250px 1fr",
          gap: "4rem",

        }}
        className="flex md:grid flex-col"
      >
        {sidebar}
        <main>{children}</main>
      </div>
    </div>
  );
}

const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails($language: LanguageCode) @inContext(language: $language) {
    customer {
      ...CustomerDetails
    }
  }
  fragment OrderCard on Order {
    id
    number
    processedAt
    financialStatus
    fulfillmentStatus
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    totalPrice {
      amount
      currencyCode
    }
    lineItems(first: 2) {
      edges {
        node {
          title
          image {
            altText
            height
            url
            width
          }
        }
      }
    }
  }
  fragment AddressPartial on CustomerAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    territoryCode
    zoneCode
    city
    zip
    phoneNumber
  }
  fragment CustomerDetails on Customer {
    firstName
    lastName
    phoneNumber {
      phoneNumber
    }
    emailAddress {
      emailAddress
    }
    defaultAddress {
      ...AddressPartial
    }
    addresses(first: 6) {
      edges {
        node {
          ...AddressPartial
        }
      }
    }
    orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          ...OrderCard
        }
      }
    }
  }
` as const;
