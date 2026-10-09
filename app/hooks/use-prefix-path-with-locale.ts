import { useRouteLoaderData } from "react-router";
import type { RootLoader } from "~/root";
import { DEFAULT_LOCALE } from "~/utils/const";
import { localizePath } from "~/utils/localized-paths";

export function usePrefixPathWithLocale(path: string) {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const { pathPrefix } = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return pathPrefix + localizePath(suffix, pathPrefix);
}
