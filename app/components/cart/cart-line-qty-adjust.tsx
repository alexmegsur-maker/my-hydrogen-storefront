import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import {
  CartForm,
  type OptimisticCart,
  OptimisticInput,
  useOptimisticData,
} from "@shopify/hydrogen";
import type { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";
import type { CartApiQueryFragment } from "storefront-api.generated";
import type { CartLineOptimisticData } from "./cart-line-item";

export function CartLineQuantityAdjust({
  line,
}: {
  line: OptimisticCart<CartApiQueryFragment>["lines"]["nodes"][0];
}) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<CartLineOptimisticData>(optimisticId);

  if (!line || typeof line?.quantity === "undefined") return null;

  const optimisticQuantity = optimisticData?.quantity || line.quantity;
  const { id: lineId, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Cantidad, {optimisticQuantity}
      </label>
      <div className="flex h-8 items-center rounded-full border border-white/15">
        <UpdateCartButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            type="submit"
            name="decrease-quantity"
            aria-label="Reducir cantidad"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            value={prevQuantity}
            disabled={optimisticQuantity <= 1 || isOptimistic}
          >
            <MinusIcon className="size-3" />
            <OptimisticInput id={optimisticId} data={{ quantity: prevQuantity }} />
          </button>
        </UpdateCartButton>

        <span
          id={`quantity-${lineId}`}
          className="min-w-7 text-center font-[Outfit] text-sm text-white"
        >
          {optimisticQuantity}
        </span>

        <UpdateCartButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            type="submit"
            name="increase-quantity"
            aria-label="Aumentar cantidad"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            value={nextQuantity}
            disabled={isOptimistic}
          >
            <PlusIcon className="size-3" />
            <OptimisticInput id={optimisticId} data={{ quantity: nextQuantity }} />
          </button>
        </UpdateCartButton>
      </div>
    </>
  );
}

function UpdateCartButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}
