import { createContext, useContext } from "react";

/**
 * Best-effort guess of whether the request came from a mobile device,
 * computed server-side from the User-Agent header. Used only to seed
 * useIsMobile's initial value so SSR markup already matches the real
 * device on first paint, before any JS runs or hydration completes.
 */
export const IsMobileContext = createContext(false);

export function useIsMobileGuess() {
  return useContext(IsMobileContext);
}
