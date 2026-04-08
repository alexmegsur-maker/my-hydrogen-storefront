import { useThemeSettings } from "@weaverse/hydrogen";
import { useEffect } from "react";
import { useIsMobile } from "~/hooks/use-is-mobile";

const MAX_DURATION = 20;

export function ScrollingAnnouncement() {
  const themeSettings = useThemeSettings();
  const {
    topbarText,
    topbarHeight,
    topbarTextColor,
    topbarBgColor,
    topbarScrollingGap,
    topbarScrollingSpeed,
    activeSpin,
    repeat,
    topbarSize,
    headerBorderColor
  } = themeSettings;

  function updateStyles() {
    if (topbarText) {
      document.body.style.setProperty(
        "--topbar-height",
        `${Math.max(topbarHeight - window.scrollY, 0)}px`,
      );
    } else {
      document.body.style.setProperty("--topbar-height", "0px");
    }
  }
  const isMobile= useIsMobile(600)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation> --- IGNORE ---
  useEffect(() => {
    updateStyles();
    window.addEventListener("scroll", updateStyles);
    return () => window.removeEventListener("scroll", updateStyles);
  }, [topbarText]);

  if (topbarText?.replace(/<[^>]*>/g, "").trim() === "") {
    return null;
  }
  const AnunceBar = <div
            className="animate-marquee px-[calc(var(--gap)/2)] [animation-duration:var(--marquee-duration)]"
            style={{
            }}
          >
            <div
              className="flex items-center gap-(--gap) whitespace-nowrap [&_p]:flex [&_p]:items-center [&_p]:gap-2"
              dangerouslySetInnerHTML={{ __html: topbarText }}
            />
          </div>

  return (
    <div
      id="announcement-bar"
      className= {`relative flex items-center overflow-hidden overflow-hidden whitespace-nowrap text-center ${!repeat ? "justify-center ":""}`}
      style={
        {
          height: `${topbarHeight}px`,
          backgroundColor: topbarBgColor,
          color: topbarTextColor,
          "--marquee-duration": activeSpin || isMobile ?`${MAX_DURATION / topbarScrollingSpeed}s`:"unset",
          "--gap": `${topbarScrollingGap}px`,
          fontSize:topbarSize,
          borderBottom:`1px solid ${headerBorderColor}`,
        } as React.CSSProperties
      }
    >
      
      {repeat ? new Array(10).fill("").map((_, idx) => {
        return AnunceBar;
      }):AnunceBar}
    </div>
  );
}
