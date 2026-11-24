import { TruckIcon } from "@phosphor-icons/react";
import { useOptimisticCart } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { Suspense, useEffect, useState } from "react";
import { Await } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import type { CartUpsellProduct } from "~/utils/cart-upsell.server";
import { Link } from "~/components/link";
import { MONO_FONT } from "~/utils/text-style";
import { CartPageLine } from "./cart-page-line";
import { CartPageSummary } from "./cart-page-summary";
import { useCartPageTexts } from "./cart-page-texts";
import { CartUpsell } from "./cart-upsell";

/** Página /cart: líneas + entrega + "Añade a tu pedido" a la izquierda, resumen a la derecha. */
export function CartPageView({
  cart: originalCart,
  upsell,
}: {
  cart: CartApiQueryFragment | null;
  upsell: Promise<CartUpsellProduct[]>;
}) {
  const cart = useOptimisticCart<CartApiQueryFragment>(originalCart);
  const theme = useThemeSettings();
  const t = useCartPageTexts();
  const lines = cart?.lines?.nodes ?? [];

  const upsellTitle = (theme.cartUpsellTitle as string) || t.upsellTitle;

  // Carrito vacío: mensaje + "Ver productos" + tarjeta "Añade a tu pedido"
  if (!cart || lines.length === 0) {
    return (
      <div className="mx-auto w-[100%] md:w-[70%] px-4 pt-12 pb-20 md:px-8">
        <div className="text-center">
          <p className="mb-6 text-sm text-zinc-400">{t.empty}</p>
          <Link
            to="/products"
            animate={false}
            className="inline-flex min-w-48 justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-sm uppercase tracking-widest text-white transition-colors duration-300 hover:border-white"
          >
            {t.viewProducts}
          </Link>
        </div>

        <Suspense fallback={null}>
          <Await resolve={upsell} errorElement={null}>
            {(products) =>
              products.length > 0 && (
                <div className="mx-auto mt-24 w-full max-w-[530px] bg-[#0b0c0e] px-6 pt-8 pb-5 md:px-10">
                  <CartUpsell products={products} title={upsellTitle} t={t} className="" />
                </div>
              )
            }
          </Await>
        </Suspense>
      </div>
    );
  }

  const count = cart.totalQuantity ?? 0;

  return (
    <div className="mx-auto grid w-[100%] md:w-[65%] gap-12 px-4 pt-6 pb-20 md:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-[88px]">
      <div className="min-w-0">
        <header className="flex items-end justify-between gap-4 border-b border-white/10 pb-6">
          <h1 className="m-0 font-extrabold text-[2rem] uppercase leading-none text-white md:text-[2.4rem]">
            {(theme.cartPageTitle as string) || t.title}
          </h1>
          <span className="pb-1 text-[0.72rem] text-zinc-400" style={{ fontFamily: MONO_FONT }}>
            {count} {count === 1 ? t.item : t.items}
          </span>
        </header>

        <ul>
          {lines.map((line) => (
            <CartPageLine key={line.id} line={line} t={t} />
          ))}
        </ul>

        <DeliveryEstimate t={t} />

        <Suspense fallback={null}>
          <Await resolve={upsell} errorElement={null}>
            {(products) => (
              <CartUpsell products={products} title={upsellTitle} t={t} />
            )}
          </Await>
        </Suspense>
      </div>

      <CartPageSummary cart={cart} t={t} />
    </div>
  );
}

/** "Llega entre el jue 27 nov y el lun 1 dic desde Varsovia" (días laborables). */
function DeliveryEstimate({ t }: { t: ReturnType<typeof useCartPageTexts> }) {
  const theme = useThemeSettings();
  const enabled = theme.showCartDelivery !== false;
  const minDays = Number(theme.cartDeliveryMinDays ?? 3);
  const maxDays = Number(theme.cartDeliveryMaxDays ?? 5);
  const origin = (theme.cartDeliveryOrigin as string) || "";
  // Las fechas dependen del día y la zona horaria del cliente: se calculan
  // tras hidratar para que el HTML del servidor y el del navegador coincidan.
  const [dates, setDates] = useState<[string, string] | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const format = (date: Date) =>
      new Intl.DateTimeFormat(t.locale, { weekday: "short", day: "numeric", month: "short" })
        .format(date)
        .replace(/[.,]/g, "");
    setDates([format(addBusinessDays(new Date(), minDays)), format(addBusinessDays(new Date(), maxDays))]);
  }, [enabled, minDays, maxDays, t.locale]);

  if (!(enabled && dates)) return null;

  return (
    <p className="mt-7 flex items-center gap-3 text-[0.88rem] text-zinc-400">
      <TruckIcon className="size-5 shrink-0" aria-hidden="true" />
      <span>
        {t.deliveryBetween} <strong className="font-medium text-white">{dates[0]}</strong> {t.deliveryAnd}{" "}
        <strong className="font-medium text-white">{dates[1]}</strong>
        {origin && ` ${t.deliveryFrom} ${origin}`}
      </span>
    </p>
  );
}

function addBusinessDays(from: Date, days: number) {
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date;
}
