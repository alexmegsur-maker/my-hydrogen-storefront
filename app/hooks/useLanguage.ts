import { useLocation } from "react-router";

export function useLanguage() {
  const { pathname } = useLocation();

  const match = pathname.match(/^\/(en|fr|es|de|it)(\/|$)/i);
  if (match) return match[1].toUpperCase();

  return "ES"; // fallback
}
