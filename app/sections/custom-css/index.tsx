import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";

interface CustomCssSectionProps extends HydrogenComponentProps {
  customCss?: string;
}

const CustomCssSection = forwardRef<HTMLDivElement, CustomCssSectionProps>(
  ({ customCss }, ref) => {
    return (
      <>
        {customCss?.trim() && (
          <style
            id="weaverse-custom-css"
            dangerouslySetInnerHTML={{ __html: customCss }}
          />
        )}
        {/* Nodo invisible requerido por Weaverse para seleccionar la sección en el editor */}
        <div ref={ref} style={{ display: "none" }} aria-hidden="true" />
      </>
    );
  },
);

CustomCssSection.displayName = "CustomCssSection";
export default CustomCssSection;

export const schema: HydrogenComponentSchema = {
  type: "custom-css",
  title: "CSS Personalizado",
  inspector: [
    {
      group: "Editor CSS",
      inputs: [
        {
          type: "textarea",
          name: "customCss",
          label: "CSS de la página",
          defaultValue: "",
          placeholder:
            "/* Escribe aquí tu CSS — se aplica a toda la página */\n\n/* Ejemplo:\nbody {\n  background: #000;\n  color: #fff;\n}\n\n.header {\n  border-bottom: 1px solid red;\n}\n*/",
          helpText:
            "El CSS solo se aplica en esta página. Al navegar a otra página desaparece automáticamente. Puedes usar cualquier selector, variable CSS o media query.",
        },
      ],
    },
  ],
};
