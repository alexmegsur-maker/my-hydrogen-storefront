import { TruckIcon } from "@phosphor-icons/react";
import { CartForm, type OptimisticCart } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { useState } from "react";
import { useFetcher } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { pushBeginCheckout } from "~/utils/dataLayer";
import { MONO_FONT } from "~/utils/text-style";
import { ICON_MAP } from "../cart-summary";
import { type CartPageTexts, formatMoney } from "./cart-page-texts";

type Cart = OptimisticCart<CartApiQueryFragment>;

/** Resumen de la página /cart: importes, checkout, ventajas y valoración. */
export function CartPageSummary({ cart, t }: { cart: Cart; t: CartPageTexts }) {
  const theme = useThemeSettings();
  const [showCode, setShowCode] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const removeCodeFetcher = useFetcher({ key: "cart-page-code-remove" });

  const { cost, discountCodes, checkoutUrl, lines, isOptimistic } = cart;
  const isUpdating = Boolean(isOptimistic) || removeCodeFetcher.state !== "idle";
  const currency = cost?.totalAmount?.currencyCode ?? "EUR";
  const money = (amount: number) => formatMoney(amount, currency, t.locale);

  const lineNodes = lines?.nodes ?? [];
  // Precio "antes" (precio tachado) de todas las líneas
  const compareAtSubtotal = lineNodes.reduce((sum, line) => {
    const qty = line.quantity ?? 1;
    const compareAt = line.cost?.compareAtAmountPerQuantity?.amount;
    const current = line.cost?.amountPerQuantity?.amount;
    return sum + Number.parseFloat(compareAt ?? current ?? "0") * qty;
  }, 0);
  const subtotal = Number.parseFloat(cost?.subtotalAmount?.amount ?? "0");
  const total = Number.parseFloat(cost?.totalAmount?.amount ?? "0");

  const appliedCodes = (discountCodes ?? []).filter((code) => code.applicable);
  const appliedCodeStrings = appliedCodes.map((code) => code.code);
  const productSavings = compareAtSubtotal - subtotal;
  const codeSavings = appliedCodes.length > 0 ? subtotal - total : 0;
  const hasProductSavings = productSavings > 0.01;

  const installments = Number(theme.cartInstallments ?? 3);
  const benefits = [1, 2, 3, 4]
    .map((n) => ({
      icon: (theme[`cartBenefit${n}Icon`] as string) || "",
      label: (theme[`cartBenefit${n}Label`] as string) || "",
    }))
    .filter((benefit) => benefit.label);

  const ratingValue = (theme.cartRatingValue as string) || "";
  const ratingSource = (theme.cartRatingSource as string) || "";
  const ratingUrl = (theme.cartRatingUrl as string) || "";
  const phone = (theme.cartSupportPhone as string) || "";

  const onCheckout = () => {
    const items = lineNodes.map((line) => ({
      item_id: line.merchandise?.sku || line.merchandise?.product?.id || "",
      item_name: line.merchandise?.product?.title,
      item_variant: line.merchandise?.title,
      price: Number.parseFloat(line.cost?.amountPerQuantity?.amount ?? "0"),
      quantity: line.quantity,
    }));
    pushBeginCheckout(items, total, currency);
  };

  const Row = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <span className="text-[0.9rem] text-zinc-400">{label}</span>
      <span
        className="text-[0.85rem]"
        style={{ fontFamily: MONO_FONT, color: accent ? "var(--cart-accent, #e0623a)" : "#fff" }}
      >
        {isUpdating ? "…" : value}
      </span>
    </div>
  );

  return (
    <aside className="lg:sticky lg:top-[calc(var(--height-nav,0px)+24px)]">
      <div className="border border-white/10 bg-[#0b0c0e] px-6 py-7 md:px-8">
        <Row label={t.subtotal} value={money(hasProductSavings ? compareAtSubtotal : subtotal)} />
        {hasProductSavings && (
          <Row
            label={(theme.cartSavingsLabel as string) || t.savings}
            value={`-${money(productSavings)}`}
            accent
          />
        )}
        {codeSavings > 0.01 && (
          <Row label={appliedCodeStrings.join(", ")} value={`-${money(codeSavings)}`} accent />
        )}
        <div className="flex items-baseline justify-between gap-4 py-2.5">
          <span className="text-[0.9rem] text-zinc-400">{t.shippingTaxes}</span>
          <span className="text-[0.85rem] text-white" style={{ fontFamily: MONO_FONT }}>
            {(theme.cartShippingText as string) || t.included}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/10 pt-6">
          <span className="pb-2 text-[0.95rem] text-white">{t.total}</span>
          <div className="text-right">
            <p className="font-extrabold text-[2.4rem] leading-none text-white">
              {isUpdating ? "…" : money(total)}
            </p>
            {installments > 1 && !isUpdating && (
              <p className="mt-2 text-[0.72rem] text-zinc-400" style={{ fontFamily: MONO_FONT }}>
                {t.installments
                  .replace("{n}", String(installments))
                  .replace("{amount}", formatMoney(Math.round((total / installments) * 100) / 100, currency, t.locale))}
              </p>
            )}
          </div>
        </div>

        {checkoutUrl && (
          <a
            href={checkoutUrl}
            target="_self"
            onClick={onCheckout}
            className="mt-7 flex h-14 w-full items-center justify-center bg-white text-[0.85rem] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-zinc-200"
          >
            {(theme.checkoutButtonText as string) || t.checkout}
          </a>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowCode((open) => !open)}
            aria-expanded={showCode}
            className="cursor-pointer border-0 border-b border-white/40 bg-transparent p-0 text-[0.82rem] text-zinc-300 transition-colors hover:border-white hover:text-white"
          >
            {t.haveCode}
          </button>
          {(theme.cartPaymentMethods as string) && (
            <span className="text-[0.68rem] text-zinc-400" style={{ fontFamily: MONO_FONT }}>
              {theme.cartPaymentMethods as string}
            </span>
          )}
        </div>

        {showCode && (
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.DiscountCodesUpdate}
            inputs={{ discountCodes: [...appliedCodeStrings, codeInput] }}
          >
            <div className="mt-4 flex">
              <input
                type="text"
                name="discountCode"
                value={codeInput}
                onChange={(event) => setCodeInput(event.target.value)}
                placeholder={t.codePlaceholder}
                autoComplete="off"
                className="min-w-0 flex-1 border border-r-0 border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 cursor-pointer border border-white bg-white px-5 text-[0.72rem] font-bold uppercase tracking-[0.15em] text-black transition-colors hover:bg-zinc-200"
              >
                {t.apply}
              </button>
            </div>
          </CartForm>
        )}

        {appliedCodes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {appliedCodes.map((discount) => (
              <CartForm
                key={discount.code}
                route="/cart"
                action={CartForm.ACTIONS.DiscountCodesUpdate}
                inputs={{ discountCodes: appliedCodeStrings.filter((code) => code !== discount.code) }}
                fetcherKey="cart-page-code-remove"
              >
                <button
                  type="submit"
                  aria-label={`${t.removeCode}: ${discount.code}`}
                  className="flex cursor-pointer items-center gap-2 border border-white/20 bg-transparent px-3 py-1 text-xs text-white transition-colors hover:border-white"
                  style={{ fontFamily: MONO_FONT }}
                >
                  {discount.code} <span aria-hidden="true">×</span>
                </button>
              </CartForm>
            ))}
          </div>
        )}
      </div>

      {theme.showCartBenefits !== false && benefits.length > 0 && (
        <ul className="mt-8 grid grid-cols-4 gap-2 border-b border-white/10 pb-8">
          {benefits.map(({ icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-3 text-center">
              <span className="flex size-14 items-center justify-center rounded-full border border-white/20 text-white">
                <BenefitIcon icon={icon} />
              </span>
              <span
                className="text-[0.62rem] uppercase leading-relaxed tracking-[0.15em] text-zinc-400"
                style={{ fontFamily: MONO_FONT }}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {(ratingValue || phone) && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {ratingValue && (
            <RatingWrapper url={ratingUrl}>
              <span className="font-extrabold text-[1.15rem] text-white">{ratingValue}</span>
              <span className="text-[0.7rem] tracking-[0.15em] text-[#c9a96e]" aria-hidden="true">
                ★★★★★
              </span>
              {ratingSource && (
                <span className="text-[0.72rem] text-zinc-400" style={{ fontFamily: MONO_FONT }}>
                  {ratingSource}
                </span>
              )}
            </RatingWrapper>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="text-[0.72rem] text-zinc-400 transition-colors hover:text-white"
              style={{ fontFamily: MONO_FONT }}
            >
              {t.questions} {phone}
            </a>
          )}
        </div>
      )}
    </aside>
  );
}

function RatingWrapper({ url, children }: { url: string; children: React.ReactNode }) {
  const className = "flex items-center gap-3";
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  );
}

function BenefitIcon({ icon }: { icon: string }) {
  if (icon.trim().startsWith("<")) {
    return (
      <span
        className="flex size-5 items-center justify-center [&_svg]:h-full [&_svg]:w-full"
        // SVG configurado en el editor de Weaverse (no es contenido de usuario)
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  }
  const Icon = ICON_MAP[icon] ?? TruckIcon;
  return <Icon className="size-5" />;
}
