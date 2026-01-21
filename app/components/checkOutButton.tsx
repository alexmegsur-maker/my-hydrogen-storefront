import type React from "react";

type CheckoutProps = React.ButtonHTMLAttributes<HTMLButtonElement> &{
  text:string;
  variantId:string;
  quantity:number;
  clase:string;
}

function CheckoutButton (props:CheckoutProps){
  const {text,variantId,quantity,clase,...rest}=props
  const handleCheckout=()=>{
    const cleanId = variantId.split("/").pop();
    const checkoutUrl = `/cart/${cleanId}:${quantity}`
    window.location.href=checkoutUrl
  }
  return(
    <button 
      className={clase}
      onClick={handleCheckout}
      {...rest}
      >
      {text}
    </button>
  )
}

export default CheckoutButton;