import { useEffect, useRef, useState, type CSSProperties } from "react";

interface MaterialObject{
  title:string;
  description:string;
  img?:string
  
}

interface MaterialProps{
  widthSize:number;
  material:MaterialObject;
  defaultTitle:string;
  value:string;
  isChecked:boolean;
  colorChecked?:string;
  bgChecked?:string;
  color?:string;
  borderColor? :string;
  bg?:string;
  handleCheckboxChange:(elm:string)=>void;
  style?:CSSProperties;
}

function Material(props:MaterialProps){
  const {
    material, widthSize, defaultTitle, value, isChecked,
    handleCheckboxChange, colorChecked, color, bg, bgChecked, borderColor, style,
  } = props;

  const [show, setShow] = useState(false);
  const [rightPos, setRightPos] = useState(false);
  const info = useRef<HTMLSpanElement>(null);
  const [check,setCheck]=useState(isChecked)

  useEffect(() => {
    if (!info.current) return;
    const infoPos = info.current.getBoundingClientRect();
    const wWidth = window.innerWidth;
    // Si el tooltip se saldría por la derecha, lo abrimos hacia la izquierda
    const distanceToRight = wWidth - infoPos.right;
    setRightPos(distanceToRight < 250); // 250 = ancho del tooltip
  }, []);
  
  return (
    <label
      key={value}
      htmlFor={`check-${value}`}
      className={`transition duration-300 block rounded-full border border-solid relative cursor-pointer mb-[5px]`}
      style={{
        backgroundColor: check ? bgChecked : bg, 
        borderColor:check ? borderColor:"gray"
      }}
    >
      <div 
        className="flex items-stretch e2e-upholstery-filter-content overflow-hidden rounded-full w-full e2e-upholstery-filter-neo-leatherette"
        onClick={()=>setCheck(state=>!state)}
      >
        {material.img &&
          <div
            className="flex-none w-[60px] overflow-hidden me-3"
            data-context="pdp-chairs-filter-neo"
          >
            <img
              loading="lazy"
              src={material.img}
              alt={material.title}
              className="object-cover w-full h-full"
              data-context="pdp-chairs-filter-neo"
            />
          </div>
        }

        <div
          className="flex flex-1 py-[12px]"
          data-context="pdp-chairs-filter-neo"
        >
          <div className="body-sm text-[14px] w-full">
            <div
              className="flex items-center"
              data-context="pdp-chairs-filter-neo"
            >
              <div className="flex-1 px-[5px]">
                <span
                  className="label-sm"
                  data-context="pdp-chairs-filter-neo"
                  style={{
                    color: check ? colorChecked : color, 
                    ...style
                  }}
                >
                  {material.title ? material.title:defaultTitle}
                </span>
              </div>

              <div className="flex-none me-4 hidden lg:flex">
                <span
                  ref={info}
                  className={`relative justify-center cursor-pointer rounded-full items-center ms-1 p-1  flex w-[18px] h-[18px]`}
                  style={{
                    backgroundColor: isChecked ? bg:bgChecked,
                    color: isChecked ? colorChecked:color
                  }}
                  onMouseEnter={()=>setShow(true)}
                  onMouseLeave={()=>setShow(false)}
                >
                  ?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div 
        className="tooltip-material absolute  text-white flex-col gap-2 top-0 bg-black rounded-lg "
        style={{
          width:`250px`, 
          transform: "translateY(-100%)",
          display:show ? "flex":"none",
          zIndex:999,
          right:rightPos?"unset":"0",
          left:rightPos ? 0:"unset"
        }}
        >
        <div className="px-3 py-2 flex flex-col gap-2">
          {material.img &&
            <div className="w-full rounded-lg border border-white border-2 overflow-hidden">
              <img src={material.img} alt={material.title} className="w-full" />
            </div>
          }
          <div className="text-left flex flex-col gap">
            <h4 className="text-[16px] font-bold">{material.title}</h4>
            <p className="text-[14px]">{material.description}</p>
          </div>
        </div>
      </div>
      <div 
        className=" absolute top-0"
        style={{
          width:0,
          height:0,
          borderLeft:"5px solid transparent",
          borderRight:"5px solid transparent",
          borderBottom:"6px solid black",
          rotate:"180deg",
          display:show ? "block":"none",
          transform:"translateY(10%)",
          right: rightPos ? "18px" : "unset",
          left: rightPos ? "unset" : "18px",
        }}
      ></div>
      <input 
        className="hidden" 
        type="checkbox" 
        id={`check-${value}`}
        value={value}
        checked={isChecked}
        onChange={()=>handleCheckboxChange(value)}
      />
    </label>
  )
}
export default Material