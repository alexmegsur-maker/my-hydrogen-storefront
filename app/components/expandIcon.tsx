interface expandIconProps{
  clase:string;
  size?:string;
  color?:string;
  background?:string;
  padding?:string;
  radius?:string;
} 

export default function expandIcon (props:expandIconProps){
  const {
    clase,
    size ="4em",
    color="#fff",
    background="#050505",
    padding="1em",
    radius="50%"
  }=props
  return (
    <span
      className={clase}
      style={{
        width: size,
        height: size,
        position: "absolute",
        bottom: "1.5rem",
        right: "1.5rem",
        backgroundColor: background,
        padding: padding,
        borderRadius: radius,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#ffffff"
          strokeWidth="0.048"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M14 10L21 3M21 3H16.5M21 3V7.5M10 14L3 21M3 21H7.5M3 21L3 16.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </svg>
    </span>
  );
}