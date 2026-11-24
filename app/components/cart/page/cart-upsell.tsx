import { CartForm } from "@shopify/hydrogen";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import type { CartUpsellProduct } from "~/utils/cart-upsell.server";
import { MONO_FONT } from "~/utils/text-style";
import { type CartPageTexts, formatMoney } from "./cart-page-texts";

/** "Añade a tu pedido": productos complementarios con botón + para añadirlos al carrito. */
export function CartUpsell({
  products,
  title,
  t,
  className = "mt-16",
}: {
  products: CartUpsellProduct[];
  title: string;
  t: CartPageTexts;
  className?: string;
}) {
  if (!products.length) return null;

  return (
    <section className={className}>
      <h2
        className="mb-5 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-zinc-400"
        style={{ fontFamily: MONO_FONT }}
      >
        {title}
      </h2>
      <ul className="border-t border-white/10">
        {products.map((product) => (
          <UpsellItem key={product.id} product={product} t={t} />
        ))}
      </ul>
    </section>
  );
}

function UpsellItem({ product, t }: { product: CartUpsellProduct; t: CartPageTexts }) {
  const variant = product.selectedOrFirstAvailableVariant;
  if (!variant) return null;
  const price = Number.parseFloat(variant.price.amount);
  const url = `/products/${product.handle}`;

  return (
    <li className="flex items-center gap-4 border-b border-white/10 py-3.5">
      <Link
        to={url}
        animate={false}
        className="block size-14 shrink-0 overflow-hidden border border-white/10 bg-white/[0.03]"
      >
        {product.featuredImage && (
          <Image
            data={product.featuredImage}
            sizes="56px"
            width={112}
            alt={product.featuredImage.altText || product.title}
            className="h-full w-full object-cover"
          />
        )}
      </Link>

      <div className="min-w-0 grow">
        <Link
          to={url}
          animate={false}
          className="block truncate text-[0.95rem] text-white transition-colors hover:text-zinc-300"
        >
          {product.title}
        </Link>
        {product.subtitle?.value && (
          <p className="truncate text-[0.8rem] text-zinc-500">{product.subtitle.value}</p>
        )}
      </div>

      <span className="shrink-0 text-[0.85rem] text-zinc-200" style={{ fontFamily: MONO_FONT }}>
        {formatMoney(price, variant.price.currencyCode, t.locale)}
      </span>

      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesAdd}
        inputs={{ lines: [{ merchandiseId: variant.id, quantity: 1 }] }}
      >
        {(fetcher) => (
          <button
            type="submit"
            aria-label={`${t.add}: ${product.title}`}
            disabled={fetcher.state !== "idle"}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center border border-white/25 bg-transparent text-lg text-white transition-colors hover:bg-white hover:text-black disabled:cursor-wait disabled:opacity-40"
          >
            {fetcher.state !== "idle" ? "…" : "+"}
          </button>
        )}
      </CartForm>
    </li>
  );
}
