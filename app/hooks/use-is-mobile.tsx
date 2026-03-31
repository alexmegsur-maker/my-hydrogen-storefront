import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    checkSize(); // Comprobación inicial
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isMobile;
}