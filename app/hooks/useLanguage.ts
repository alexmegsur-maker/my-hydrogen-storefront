import { useLocation } from "react-router";
import { COUNTRIES } from "~/utils/const";

/**
 * Idioma de la URL actual ("ES", "EN", "PL"...), sacado del prefijo
 * (/en, /pl...) según COUNTRIES. Así un idioma nuevo añadido en
 * ~/utils/const.ts funciona sin tocar este hook.
 */
export function useLanguage() {
  const { pathname } = useLocation();

  const prefix = `/${pathname.split("/")[1]?.toLowerCase() ?? ""}`;
  return (COUNTRIES[prefix] ?? COUNTRIES.default).language;
}
