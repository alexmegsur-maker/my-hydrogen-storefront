import { TrashIcon } from "@phosphor-icons/react";
import {
  CartForm,
  Money,
  type OptimisticCart,
  OptimisticInput,
  useOptimisticData,
} from "@shopify/hydrogen";
import clsx from "clsx";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { Skeleton } from "~/components/skeleton";
import type { CartLayoutType } from "~/types/others";
import { calculateAspectRatio } from "~/utils/image";
import { CartLineQuantityAdjust } from "./cart-line-qty-adjust";
import { useCartDrawerStore } from "./store";

type CartLine = OptimisticCart<CartApiQueryFragment>["lines"]["nodes"][0];

export type CartLineOptimisticData = {
  action?: string;
  quantity?: number;
};

export function CartLineItem({
  line,
  layout,
}: {
  line: CartLine;
  layout: CartLayoutType;
}) {
  const { close: closeCartDrawer } = useCartDrawerStore();
  const optimisticData = useOptimisticData<CartLineOptimisticData>(line?.id);

  if (!line?.id) return null;

  const { id, quantity, merchandise, isOptimistic: lineOptimistic } = line;
  const isOptimistic =
    lineOptimistic === undefined
      ? JSON.stringify(optimisticData) !== "{}"
      : lineOptimistic;

  if (typeof quantity === "undefined" || !merchandise?.product) return null;

  const { image, title, product, selectedOptions } = merchandise;
  let url = `/products/${product.handle}`;
  if (selectedOptions?.length) {
    const params = new URLSearchParams();
    for (const option of selectedOptions) params.append(option.name, option.value);
    url += `?${params.toString()}`;
  }
  const isDefaultVariant =
    selectedOptions?.length === 1 &&
    selectedOptions[0].name === "Title" &&
    selectedOptions[0].value === "Default Title";

  return (
    <li
      className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
      style={{
        display: optimisticData?.action === "remove" ? "none" : "flex",
      }}
    >
      {/* Imagen */}
      <div className="relative shrink-0">
        {image ? (
          <Image
            width={200}
            height={200}
            data={image}
            className="h-20 w-20 rounded-xl object-cover"
            sizes="80px"
            alt={title}
            aspectRatio={calculateAspectRatio(image, "adapt")}
          />
        ) : (
          <div className="h-20 w-20 rounded-xl bg-white/[0.05]" />
        )}
      </div>

      {/* Contenido */}
      <div className="flex min-w-0 grow flex-col gap-2">
        {/* Título + precio */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product?.handle ? (
              <Link
                to={url}
                className="block font-[Outfit] text-[0.9rem] font-medium leading-snug text-white hover:text-zinc-300 transition-colors"
                onClick={closeCartDrawer}
              >
                {product?.title || ""}
              </Link>
            ) : (
              <p className="font-[Outfit] text-[0.9rem] font-medium text-white">
                {product?.title || ""}
              </p>
            )}
            {!isDefaultVariant && (
              <p className="mt-0.5 text-xs text-zinc-500">{title}</p>
            )}
          </div>
          <CartLinePrice line={line} isOptimistic={isOptimistic} />
        </div>

        {/* Cantidad + eliminar */}
        <div className="flex items-center justify-between">
          <CartLineQuantityAdjust line={line} />
          <ItemRemoveButton lineId={id} />
        </div>
      </div>
    </li>
  );
}

function ItemRemoveButton({
  lineId,
  className,
}: {
  lineId: CartLine["id"];
  className?: string;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds: [lineId] }}
    >
      <button
        className={clsx(
          "flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] text-zinc-500 transition-all duration-200 hover:border-red-500/40 hover:text-red-400",
          className,
        )}
        type="submit"
        aria-label="Eliminar"
      >
        <TrashIcon aria-hidden="true" className="size-3.5" />
      </button>
      <OptimisticInput id={lineId} data={{ action: "remove" }} />
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = "regular",
  isOptimistic,
}: {
  line: CartLine;
  priceType?: "regular" | "compareAt";
  isOptimistic?: boolean;
}) {
  if (!(line?.cost?.amountPerQuantity && line?.cost?.totalAmount)) return null;

  const moneyV2 =
    priceType === "regular"
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) return null;

  if (isOptimistic)
    return <Skeleton as="span" className="h-4 w-14 rounded" />;

  return (
    <Money
      withoutTrailingZeros
      as="span"
      data={moneyV2}
      className="shrink-0 font-[Outfit] text-[0.9rem] font-semibold text-white"
    />
  );
}
