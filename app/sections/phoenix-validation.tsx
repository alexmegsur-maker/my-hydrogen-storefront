import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import PhoenixValidationSection from "~/components/phoenix-validation";

interface PhoenixValidationProps extends HydrogenComponentProps {
  // Puedes agregar props personalizables aquí
}

export default function PhoenixValidation(props: PhoenixValidationProps) {
  return <PhoenixValidationSection />;
}

export const schema = createSchema({
  title: "Phoenix Validation",
  type: "phoenix-validation",
  settings: [],
});