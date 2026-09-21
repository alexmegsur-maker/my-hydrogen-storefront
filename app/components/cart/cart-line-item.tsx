import { XIcon } from "@phosphor-icons/react";
import { useLanguage } from "~/hooks/useLanguage";
import { translations } from "~/utils/translations";
import {
  CartForm,
  Money,
  type OptimisticCart,
  OptimisticInput,
  useOptimisticData,
} from "@shopify/hydrogen";
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

  const nombreValue = (product as any).nombre?.value as string | undefined;
  const tooltipValue = (product as any).tooltip?.value as string | undefined;
  const variantLabel = [nombreValue, tooltipValue, isDefaultVariant ? null : title]
    .filter(Boolean)
    .join(" - ");

  return (
    <li
      className="flex gap-4 border-b border-white/[0.06] py-4 first:pt-0 last:border-b-0"
      style={{
        display: optimisticData?.action === "remove" ? "none" : "flex",
      }}
    >
      {/* Imagen */}
      <div className="relative shrink-0">
        {image ? (
          <Image
            width={250}
            height={250}
            data={image}
            className="h-30 w-30 rounded-lg object-cover bg-white/[0.05]"
            sizes="130px"
            alt={title}
            aspectRatio={calculateAspectRatio(image, "adapt")}
          />
        ) : (
          <div className="h-30 w-30 rounded-lg bg-white/[0.05]" />
        )}
      </div>

      {/* Contenido */}
      <div className="flex min-w-0 grow flex-col justify-between gap-2">
        {/* Fila 1: Título + X */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {product?.handle ? (
              <Link
                to={url}
                className="block font-[Outfit] text-[0.78rem] font-semibold uppercase leading-snug tracking-wide text-white hover:text-zinc-300 transition-colors"
                onClick={closeCartDrawer}
              >
                {product?.title || ""}
              </Link>
            ) : (
              <p className="font-[Outfit] text-[0.78rem] font-semibold uppercase tracking-wide text-white">
                {product?.title || ""}
              </p>
            )}
            {variantLabel && (
              <p className="mt-0.5 text-[0.7rem] leading-tight text-zinc-500">{variantLabel}</p>
            )}
          </div>
          <ItemRemoveButton lineId={id} />
        </div>

        {/* Fila 2: Cantidad + Precio */}
        <div className="flex flex-col items-start gap-2 ">
          <CartLineQuantityAdjust line={line} />
          <CartLinePrice line={line} isOptimistic={isOptimistic} />
        </div>
      </div>
    </li>
  );
}

function ItemRemoveButton({ lineId }: { lineId: CartLine["id"] }) {
  const lang = useLanguage();
  const t = translations[lang] ?? translations["ES"];
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds: [lineId] }}
    >
      <button
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-zinc-500 transition-all duration-200 hover:border-red-500/40 hover:text-red-400"
        type="submit"
        aria-label={t.removeItem}
      >
        <XIcon aria-hidden="true" className="size-3" />
      </button>
      <OptimisticInput id={lineId} data={{ action: "remove" }} />
    </CartForm>
  );
}

function CartLinePrice({
  line,
  isOptimistic,
}: {
  line: CartLine;
  isOptimistic?: boolean;
}) {
  if (!line?.cost?.amountPerQuantity) return null;

  const currentPrice = line.cost.amountPerQuantity;
  const compareAtPrice = line.cost.compareAtAmountPerQuantity;
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(currentPrice.amount);

  if (isOptimistic) return <Skeleton as="span" className="h-4 w-16 rounded" />;

  return (
    <div className="flex shrink-0 items-baseline gap-1.5">
      <Money
        withoutTrailingZeros
        as="span"
        data={currentPrice}
        className="font-[Outfit] text-[0.85rem] font-semibold text-white"
      />
      {hasDiscount && (
        <Money
          withoutTrailingZeros
          as="span"
          data={compareAtPrice}
          className="font-[Outfit] text-[0.75rem] font-normal text-zinc-500 line-through"
        />
      )}
    </div>
  );
}
