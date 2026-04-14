import { useEffect, useState } from "react";

export function useDeviceSize(mobile = 640,tablet=1024,laptop=1440) {
  const [screenType, setScreenType] = useState("screen");

  useEffect(() => {
    const checkSize = () => {
      const screen = window.innerWidth 
      if(screen <= mobile){
        setScreenType("mb")
      }
      if(screen <= tablet && screen > mobile){
        setScreenType("tb")
      }
      if(screen <= laptop && screen>mobile&& screen>tablet){
        setScreenType("lp")
      }
      if(screen > laptop){
        setScreenType("screen")

      }
    };

    checkSize(); // Comprobación inicial
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [mobile]);

  return screenType;
}