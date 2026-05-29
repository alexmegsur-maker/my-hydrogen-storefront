import type { ActionFunction, ActionFunctionArgs } from "react-router";
import { data } from "react-router";

const CUSTOMER_CREATE = `#graphql
  mutation newsletterPopupCustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
` as const;

const CUSTOMER_TOKEN_CREATE = `#graphql
  mutation newsletterPopupTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
      }
      customerUserErrors {
        code
        message
      }
    }
  }
` as const;

const CUSTOMER_UPDATE = `#graphql
  mutation newsletterPopupCustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        email
        acceptsMarketing
      }
      customerUserErrors {
        code
        message
      }
    }
  }
` as const;

const DEFAULT_PASSWORD = "Ph0en1x@S3cur3";

export const action: ActionFunction = async ({
  request,
  context,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email) {
    return data({ ok: false, errorMessage: "Email requerido" }, { status: 400 });
  }

  const { storefront } = context;

  // 1. Try to create new customer
  const { customerCreate } = await storefront.mutate(CUSTOMER_CREATE, {
    variables: {
      input: { email, password: DEFAULT_PASSWORD, acceptsMarketing: true },
    },
  });

  const createErrors = customerCreate?.customerUserErrors ?? [];
  const emailTaken = createErrors.some((e: any) => e.code === "TAKEN");

  // New customer created successfully
  if (customerCreate?.customer?.id) {
    return data({ ok: true }, { status: 201 });
  }

  // Customer already exists → get token and reactivate marketing consent
  if (emailTaken) {
    const { customerAccessTokenCreate } = await storefront.mutate(
      CUSTOMER_TOKEN_CREATE,
      {
        variables: { input: { email, password: DEFAULT_PASSWORD } },
      },
    );

    const token =
      customerAccessTokenCreate?.customerAccessToken?.accessToken;

    if (token) {
      await storefront.mutate(CUSTOMER_UPDATE, {
        variables: {
          customerAccessToken: token,
          customer: { acceptsMarketing: true },
        },
      });
      return data({ ok: true }, { status: 200 });
    }

    // Customer exists but different password — still count as subscribed
    return data({ ok: true }, { status: 200 });
  }

  return data(
    {
      ok: false,
      errorMessage: createErrors[0]?.message ?? "Error al suscribirse",
    },
    { status: 500 },
  );
};
