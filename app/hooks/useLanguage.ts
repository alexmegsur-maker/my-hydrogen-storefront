import { useLocation } from "react-router";

export function useLanguage() {
  const { pathname } = useLocation();
  
  // Si tu tienda usa rutas tipo /en/, /fr/, etc.
  const match = pathname.match(/^\/(en|fr|es)\//i);
  if (match) return match[1].toUpperCase();

  // Alternativa: leer del localStorage o un contexto global
  return "ES"; // fallback
}