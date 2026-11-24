import {
  CartForm,
  type OptimisticCart,
  OptimisticInput,
  useOptimisticData,
} from "@shopify/hydrogen";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { Skeleton } from "~/components/skeleton";
import { MONO_FONT } from "~/utils/text-style";
import type { CartLineOptimisticData } from "../cart-line-item";
import { type CartPageTexts, formatMoney } from "./cart-page-texts";

type CartLine = OptimisticCart<CartApiQueryFragment>["lines"]["nodes"][0];

/** Una línea del carrito en la página /cart (el drawer usa cart-line-item). */
export function CartPageLine({ line, t }: { line: CartLine; t: CartPageTexts }) {
  const optimisticData = useOptimisticData<CartLineOptimisticData>(line?.id);
  if (!line?.id) return null;

  const { id, quantity, merchandise, cost, isOptimistic: lineOptimistic } = line;
  if (typeof quantity === "undefined" || !merchandise?.product) return null;
  const isOptimistic =
    lineOptimistic === undefined ? JSON.stringify(optimisticData) !== "{}" : lineOptimistic;

  const { image, product, selectedOptions } = merchandise;
  const options = (selectedOptions ?? [])
    .filter((option) => !(option.name === "Title" && option.value === "Default Title"))
    .map((option) => option.value);
  const extra = [product.tooltip?.value, "sellingPlanAllocation" in line ? line.sellingPlanAllocation?.sellingPlan?.name : undefined].filter(
    Boolean,
  );

  let url = `/products/${product.handle}`;
  if (options.length) {
    const params = new URLSearchParams();
    for (const option of selectedOptions) params.append(option.name, option.value);
    url += `?${params.toString()}`;
  }

  const shownQuantity = optimisticData?.quantity || quantity;
  const currency = cost?.totalAmount?.currencyCode ?? "EUR";
  const lineTotal = Number.parseFloat(cost?.totalAmount?.amount ?? "0");
  const compareAtUnit = Number.parseFloat(cost?.compareAtAmountPerQuantity?.amount ?? "0");
  const compareAtTotal = compareAtUnit * quantity;
  const hasCompareAt = compareAtTotal > lineTotal + 0.01;

  return (
    <li
      className="flex gap-5 border-b border-white/10 py-7 md:gap-7"
      style={{ display: optimisticData?.action === "remove" ? "none" : "flex" }}
    >
      <Link
        to={url}
        animate={false}
        className="relative block aspect-[150/170] w-24 shrink-0 overflow-hidden border border-white/10 bg-white/[0.03] md:w-[150px]"
      >
        {image && (
          <Image
            data={image}
            sizes="150px"
            width={300}
            alt={image.altText || product.title}
            className="h-full w-full object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 grow flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              to={url}
              animate={false}
              className="block font-bold text-[1.05rem] uppercase leading-tight tracking-[0.04em] text-white transition-colors hover:text-zinc-300 md:text-[1.3rem]"
            >
              {product.title}
            </Link>
            {options.length > 0 && (
              <p className="mt-2 text-[0.82rem] leading-relaxed text-zinc-400">
                {options.join(" · ")}
              </p>
            )}
            {extra.map((text) => (
              <p key={text} className="mt-1 text-[0.82rem] leading-relaxed text-zinc-400">
                {text}
              </p>
            ))}
          </div>

          <div className="shrink-0 text-right">
            {isOptimistic ? (
              <Skeleton as="span" className="block h-6 w-16 rounded" />
            ) : (
              <>
                <p className="font-bold text-[1.1rem] text-white md:text-[1.35rem]">
                  {formatMoney(lineTotal, currency, t.locale)}
                </p>
                {hasCompareAt && (
                  <p className="mt-0.5 text-[0.75rem] text-zinc-500 line-through" style={{ fontFamily: MONO_FONT }}>
                    {formatMoney(compareAtTotal, currency, t.locale)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-7 pt-6">
          <QuantityAdjust lineId={id} quantity={shownQuantity} disabled={Boolean(line.isOptimistic)} t={t} />
          <CartForm route="/cart" action={CartForm.ACTIONS.LinesRemove} inputs={{ lineIds: [id] }}>
            <button
              type="submit"
              className="cursor-pointer border-0 border-b border-white/40 bg-transparent p-0 text-[0.82rem] text-zinc-300 transition-colors hover:border-white hover:text-white"
            >
              {t.remove}
            </button>
            <OptimisticInput id={id} data={{ action: "remove" }} />
          </CartForm>
        </div>
      </div>
    </li>
  );
}

function QuantityAdjust({
  lineId,
  quantity,
  disabled,
  t,
}: {
  lineId: string;
  quantity: number;
  disabled: boolean;
  t: CartPageTexts;
}) {
  const prev = Math.max(0, quantity - 1);
  const next = quantity + 1;
  const buttonClass =
    "flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div className="flex h-10 items-center border border-white/25">
      <CartForm route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{ lines: [{ id: lineId, quantity: prev }] }}>
        <button type="submit" aria-label={t.decrease} className={buttonClass} disabled={quantity <= 1 || disabled}>
          −
          <OptimisticInput id={lineId} data={{ quantity: prev }} />
        </button>
      </CartForm>
      <span className="min-w-8 text-center text-sm text-white" aria-label={`${t.quantity}: ${quantity}`}>
        {quantity}
      </span>
      <CartForm route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{ lines: [{ id: lineId, quantity: next }] }}>
        <button type="submit" aria-label={t.increase} className={buttonClass} disabled={disabled}>
          +
          <OptimisticInput id={lineId} data={{ quantity: next }} />
        </button>
      </CartForm>
    </div>
  );
}
