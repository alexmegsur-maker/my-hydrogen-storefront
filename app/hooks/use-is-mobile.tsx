import { useEffect, useState } from "react";
import { useIsMobileGuess } from "./is-mobile-context";

export function useIsMobile(breakpoint = 600) {
  const uaGuess = useIsMobileGuess();
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return uaGuess;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth <= breakpoint);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isMobile;
}
