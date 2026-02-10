import { 
  PayPalMessages, 
} from "@paypal/react-paypal-js";

interface PayPalBannerProps {
  amount: string | number;
}

export function PayPalBanner({ amount }: PayPalBannerProps) {
  let precio = typeof amount == "string" ? parseFloat(amount):amount 
  return (
    <PayPalMessages amount={precio} style={{layout:"text", logo:{type:"primary"}}}/>
  );
}