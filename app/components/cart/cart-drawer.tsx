import { HandbagIcon, XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { type CartReturn, useAnalytics } from "@shopify/hydrogen";
import clsx from "clsx";
import { Suspense, useEffect } from "react";
import { Await, useFetchers, useLocation, useRouteLoaderData } from "react-router";
import { CartMain } from "~/components/cart/cart-main";
import Link from "~/components/link";
import type { RootLoader } from "~/root";
import { useCartDrawerStore } from "./store";

export function CartDrawer() {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const { publish } = useAnalytics();
  const {
    isOpen,
    close: closeCartDrawer,
    toggle: toggleCartDrawer,
  } = useCartDrawerStore();
  const location = useLocation();
  const fetchers = useFetchers();

  // biome-ignore lint/correctness/useExhaustiveDependencies: close on route change
  useEffect(() => {
    closeCartDrawer();
  }, [location.pathname, closeCartDrawer]);

  // Cart data from any recently completed cart action fetcher — used as fallback
  // when the root loader cart is null (e.g. cross-origin cookie restriction in Weaverse editor)
  const fetcherCart = fetchers
    .find((f) => f.formData?.has("cartFormInput") && f.data?.cart)
    ?.data?.cart;

  return (
    <Suspense
      fallback={
        <Link
          to="/cart"
          className="relative flex h-8 w-8 items-center justify-center focus:ring-border"
        >
          <HandbagIcon className="h-5 w-5" />
        </Link>
      }
    >
      <Await resolve={rootData?.cart}>
        {(resolvedCart) => {
          const cart = (resolvedCart as CartReturn) ?? fetcherCart;
          return (
            <Dialog.Root open={isOpen} onOpenChange={toggleCartDrawer}>
              <Dialog.Trigger
                onClick={() => publish("custom_sidecart_viewed", { cart })}
                className="relative flex h-8 w-8 items-center justify-center focus:ring-border"
              >
                <HandbagIcon className="h-5 w-5" />
                {cart?.totalQuantity > 0 && (
                  <div
                    className={clsx(
                      "cart-count",
                      "-right-1.5 absolute top-0",
                      "flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-center",
                      "text-center font-medium text-[13px] leading-none",
                      "transition-colors duration-300",
                      "group-hover/header:bg-(--color-header-text)",
                      "group-hover/header:text-(--color-header-bg)",
                    )}
                  >
                    <span className="-mr-px">{cart?.totalQuantity}</span>
                  </div>
                )}
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay
                  className={clsx(
                    "fixed inset-0 z-10 bg-black/60",
                    "data-[state=open]:animate-[fade-in_150ms_ease-out]",
                    "data-[state=closed]:animate-[fade-out_150ms_ease-in]",
                  )}
                />
                <Dialog.Content
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  className={clsx(
                    "fixed inset-y-0 right-0 z-10 w-screen max-w-[440px]",
                    "bg-[#050505] text-white",
                    "flex flex-col",
                    "data-[state=open]:animate-[enter-from-right_200ms_ease-out]",
                    "data-[state=closed]:animate-[exit-to-right_200ms_ease-in]",
                  )}
                  aria-describedby={undefined}
                >
                  {/* Dot texture */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.03) 1.5px, transparent 1.5px)",
                      backgroundSize: "18px 18px",
                    }}
                  />

                  <div className="relative z-10 flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                      <Dialog.Title className="font-[Outfit] text-base font-semibold uppercase tracking-[3px]">
                        Tu carrito ({cart?.totalQuantity || 0})
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          aria-label="Cerrar carrito"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-all duration-200 hover:border-white hover:text-white"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <CartMain layout="drawer" cart={cart as CartReturn} />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          );
        }}
      </Await>
    </Suspense>
  );
}
