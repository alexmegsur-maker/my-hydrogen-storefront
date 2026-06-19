import { CaretDownIcon, TagIcon, XIcon } from "@phosphor-icons/react";
import { CartForm, Money, type OptimisticCart } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import { useState } from "react";
import { useFetcher } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { Spinner } from "~/components/spinner";
import type { CartLayoutType } from "~/types/others";

export function CartSummary({
  cart,
  layout,
}: {
  cart: OptimisticCart<CartApiQueryFragment>;
  layout: CartLayoutType;
}) {
  const { enableDiscountCode, checkoutButtonText } = useThemeSettings();
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [removingCode, setRemovingCode] = useState<string | null>(null);
  const dcRemoveFetcher = useFetcher({ key: "discount-code-remove" });

  const { cost, discountCodes, isOptimistic, checkoutUrl } = cart;

  const isCartUpdating =
    isOptimistic || dcRemoveFetcher.state !== "idle";

  const appliedCodes = (discountCodes ?? []).filter((d) => d.applicable);

  return (
    <div
      className={clsx(
        "border-t border-white/10 bg-[#050505]",
        layout === "drawer" && "px-6 pb-6 pt-4",
        layout === "page" &&
          "sticky top-(--height-nav) rounded-xl border border-white/10 p-6",
      )}
    >
      {/* Códigos de descuento aplicados */}
      {appliedCodes.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {appliedCodes.map((discount) => {
            const allCodes = appliedCodes.map((d) => d.code);
            const updatedCodes = allCodes.filter((c) => c !== discount.code);
            const isRemoving =
              dcRemoveFetcher.state !== "idle" &&
              removingCode === discount.code;
            return (
              <div
                key={discount.code}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs text-white"
              >
                <TagIcon className="size-3 text-zinc-400" />
                <span>{discount.code}</span>
                <CartForm
                  route="/cart"
                  action={CartForm.ACTIONS.DiscountCodesUpdate}
                  inputs={{ discountCodes: updatedCodes }}
                  fetcherKey="discount-code-remove"
                >
                  <button
                    type="submit"
                    aria-label={`Quitar ${discount.code}`}
                    className="ml-0.5 text-zinc-500 transition hover:text-red-400"
                    onClick={() => setRemovingCode(discount.code)}
                  >
                    {isRemoving ? <Spinner size={12} /> : <XIcon className="size-3" />}
                  </button>
                </CartForm>
              </div>
            );
          })}
        </div>
      )}

      {/* Toggle código de descuento */}
      {enableDiscountCode !== false && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setDiscountOpen((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="font-[Outfit] text-sm text-zinc-400">
              ¿Tienes un código de descuento?
            </span>
            <span className="font-[Outfit] text-sm font-medium text-white flex items-center gap-1 transition-all duration-200">
              Aplicar código
              <CaretDownIcon
                className={clsx(
                  "size-3.5 transition-transform duration-200",
                  discountOpen && "rotate-180",
                )}
              />
            </span>
          </button>

          {discountOpen && (
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.DiscountCodesUpdate}
              inputs={{
                discountCodes: [
                  ...appliedCodes.map((d) => d.code),
                  discountInput,
                ],
              }}
            >
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  name="discountCode"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  placeholder="Código de descuento"
                  autoComplete="off"
                  className="flex-1 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  className="rounded-full border border-white/20 px-4 py-2 font-[Outfit] text-sm font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                >
                  OK
                </button>
              </div>
            </CartForm>
          )}
        </div>
      )}

      {/* Separador */}
      <div className="mb-4 h-px bg-white/10" />

      {/* Total */}
      <div className="mb-5 flex items-center justify-between">
        <span className="font-[Outfit] text-base font-semibold text-white">
          Total:
        </span>
        {isCartUpdating ? (
          <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
        ) : (
          <Money
            data={cost?.totalAmount}
            className="font-[Outfit] text-base font-bold text-white"
          />
        )}
      </div>

      {/* Botón checkout */}
      {checkoutUrl && (
        <a href={checkoutUrl} target="_self">
          <button
            type="button"
            className="w-full rounded-full bg-[#f59e0b] py-4 font-[Outfit] text-sm font-bold uppercase tracking-[2px] text-[#050505] transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:-translate-y-0.5"
          >
            {checkoutButtonText || "Finalizar compra"}
          </button>
        </a>
      )}

      {/* Métodos de pago */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        {PAYMENT_ICONS.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className="h-5 w-auto rounded opacity-60"
          />
        ))}
      </div>
    </div>
  );
}

const PAYMENT_ICONS = [
  "https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169ce6e23043e3c22960f0a7ee21e41.svg", // Visa
  "https://cdn.shopify.com/shopifycloud/checkout-web/assets/ae9ceec48985d7f5e94d55b61f2b6977.svg", // Mastercard
  "https://cdn.shopify.com/shopifycloud/checkout-web/assets/f5d91f3e27dd5a1df37e58b99d9b4240.svg", // Amex
  "https://cdn.shopify.com/shopifycloud/checkout-web/assets/6e8cbf9b7b37a5a4eeeb40f16c8d60ea.svg", // PayPal
  "https://cdn.shopify.com/shopifycloud/checkout-web/assets/apple-pay.svg",                       // Apple Pay
  "https://cdn.shopify.com/shopifycloud/checkout-web/assets/google-pay.svg",                      // Google Pay
];
