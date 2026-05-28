import { CaretDownIcon, CheckCircleIcon } from "@phosphor-icons/react";
import * as Popover from "@radix-ui/react-popover";
import { CartForm } from "@shopify/hydrogen";
import type { CartBuyerIdentityInput } from "@shopify/hydrogen/storefront-api-types";
import { useEffect, useRef } from "react";
import ReactCountryFlag from "react-country-flag";
import { useInView } from "react-intersection-observer";
import {
  useFetcher,
  useLocation,
  useRouteLoaderData,
  useSubmit,
} from "react-router";
import type { RootLoader } from "~/root";
import type { Localizations } from "~/types/others";
import { DEFAULT_LOCALE } from "~/utils/const";

export function CountrySelector() {
  const fetcher = useFetcher();
  const submit = useSubmit();
  const rootData = useRouteLoaderData<RootLoader>("root");
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const { pathname, search } = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    "",
  )}${search}`;

  const countries = (fetcher.data ?? {}) as Localizations;

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const observerRef = useRef(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation> --- IGNORE ---
  useEffect(() => {
    ref(observerRef.current);
  }, [ref, observerRef]);

  // Get available countries list when in view
  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === "loading") {
      return;
    }
    fetcher.load("/api/countries");
  }, [inView, fetcher]);

  function handleLocaleChange({
    redirectTo,
    buyerIdentity,
  }: {
    redirectTo: string;
    buyerIdentity: CartBuyerIdentityInput;
  }) {
    submit(
      {
        redirectTo,
        cartFormInput: JSON.stringify({
          action: CartForm.ACTIONS.BuyerIdentityUpdate,
          inputs: { buyerIdentity },
        }),
      },
      { method: "POST", action: "/cart" },
    );
  }

  return (
    <div ref={observerRef} className="grid w-80 gap-4">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 overflow-clip border border-line-subtle px-4 py-3 text-left outline-hidden"
            aria-label="Select country"
          >
            <ReactCountryFlag
              svg
              countryCode={selectedLocale.country}
              style={{ width: "24px", height: "14px" }}
            />
            <span>{selectedLocale.label}</span>
            <CaretDownIcon className="ml-auto h-4 w-4" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <div className="my-2 max-h-40 w-80 overflow-auto bg-neutral-800 py-2">
              {countries &&
                Object.keys(countries).map((countryPath) => {
                  const countryLocale = countries[countryPath];
                  const isSelected =
                    countryLocale.language === selectedLocale.language &&
                    countryLocale.country === selectedLocale.country;
                  // El prefijo real es la clave del mapa ("default" → sin prefijo)
                  const localePrefix =
                    countryPath === "default" ? "" : countryPath;

                  return (
                    <Popover.Close
                      aria-label={`Select ${countryLocale.label} country`}
                      key={countryPath}
                      type="button"
                      onClick={() => {
                        // Guardar la elección manual en cookie para que el geo-redirect la respete
                        document.cookie = `locale_pref=${encodeURIComponent(localePrefix)}; Path=/; Max-Age=31536000; SameSite=Lax`;
                        handleLocaleChange({
                          redirectTo: `${localePrefix}${pathWithoutLocale}`,
                          buyerIdentity: {
                            countryCode: countryLocale.country,
                          },
                        });
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 bg-neutral-800 p-2 px-4 py-2 text-left text-sm text-white transition hover:bg-neutral-600"
                    >
                      <ReactCountryFlag
                        svg
                        countryCode={countryLocale.country}
                        style={{ width: "24px", height: "14px" }}
                      />
                      <span>{countryLocale.label}</span>
                      {isSelected ? (
                        <span className="ml-auto">
                          <CheckCircleIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </Popover.Close>
                  );
                })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

