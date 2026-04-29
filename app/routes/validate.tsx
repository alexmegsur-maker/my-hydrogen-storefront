import { type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import PhoenixValidationSection from "~/components/phoenix-validation";

// Reutilizar el loader de chair-validation
export { loader } from "./chair-validation.server";

export default function ValidatePage() {
  return <PhoenixValidationSection />;
}