interface BarProps {
  names: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  barBgColor:string;
  barColor:string;
  barBgColorA:string;
  barColorA:string;
  borderColor:string;
  borderColorA:string;
  barSize:string;
  barFamily:string;
  barWeight:string;
  barLetterSpacing:number;
  barRounded:number;
}

export function Bar(props: BarProps) {
  const {
    names, 
    activeIndex, 
    onSelect,
    barBgColor,
    barColor,
    barBgColorA,
    barColorA,
    borderColor,
    borderColorA,
    barSize,
    barFamily,
    barWeight,
    barLetterSpacing,
    barRounded,
  }= props
  return (
    <div className="hero-pill-container absolute bottom-[3rem] left-[50%] -translate-x-[50%] z-[5]">
      <div className="phoenix-pill-menu flex gap-[4px]"
        style={{
          backgroundColor:barBgColor,
          backdropFilter:"blur(16px)",
          WebkitBackdropFilter:"blur(16px)",
          border:`1px solid ${borderColor}`,
          borderRadius:`${barRounded}px`,
          padding:"6px",
          width:window.innerWidth > 600 ? "auto":"99dvw"
        }}
      >
        {names.map((name, idx) => {

          const active = activeIndex == idx
          return (
            <button
              key={idx}
              className={`pill-btn  `}
              onClick={() => onSelect(idx)}
              style={{
                backgroundColor: active ? barBgColor:"transparent",
                border:active ? `1px solid ${borderColorA}`:"unset",
                color:active ? barColorA:barColor,
                fontWeight:active ? barWeight :"400",
                boxShadow:active ? `0 4px 15px ${barBgColorA}`:"unset",
                borderRadius:`${barRounded}px`,
                padding: window.innerWidth > 600?"10px 24px":"10px 10px",
                fontFamily:barFamily,
                letterSpacing:barLetterSpacing>0?`${barLetterSpacing}px`:"normal",
                fontSize:barSize,
                transition:"all 0.4s ease"
              }}
            >
              { active && window.innerWidth > 600 &&
                <span 
                  className="inline-block w-[6px] h-[6px] "
                  style={{
                    background:barColorA,
                    borderRadius:"50%",
                    marginRight:"8px",
                    verticalAlign:"middle",
                    marginTop:"-2px",
                    boxShadow:`0 0 8px ${barColorA}80`
                  }}
                >

                </span>
              }
              {name}
            </button>
          )
        })}
      </div>
    </div>
  );
}