import {
  createSchema,
  type HydrogenComponentProps,
  type InspectorGroup,
 
} from "@weaverse/hydrogen";
import { type HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FaqSectionStyles {
  maxWidth: number;
  itemGap: number;
  // Modo acordeón: solo uno abierto a la vez
  // (se gestiona elevando el estado al contenedor)
  accordionMode: boolean;
}

export interface FaqSectionProps
  extends HTMLAttributes<HTMLDivElement>,
    Partial<Omit<HydrogenComponentProps, "children">>,
    Partial<FaqSectionStyles> {

}

// ─── Component ────────────────────────────────────────────────────────────────

export function FaqSection(props: FaqSectionProps) {
  const {
    maxWidth = 800,
    itemGap = 16,
    children,
    className,
    style,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      className={cn("w-full", className)}
      style={{
        maxWidth: `${maxWidth}px`,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: `${itemGap}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default FaqSection;

// ─── Inspector inputs ─────────────────────────────────────────────────────────

export const faqSectionInputs: InspectorGroup["inputs"] = [
  { type: "heading", label: "Layout" },
  {
    type: "range",
    name: "maxWidth",
    label: "Ancho máximo",
    defaultValue: 800,
    configs: { min: 320, max: 1400, step: 40, unit: "px" },
  },
  {
    type: "range",
    name: "itemGap",
    label: "Espaciado entre ítems",
    defaultValue: 16,
    configs: { min: 0, max: 80, step: 4, unit: "px" },
  },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

export const schema = createSchema({
  type: "faq-section",
  title: "tab section",
  childTypes: ["faq-item","heading","subheading","paragraph"],
  settings: [
    {
      group: "FAQ",
      inputs: faqSectionInputs,
    },
  ],
  presets: {
    maxWidth: 800,
    itemGap: 16,
    children: [
      {
        type: "faq-item",
        question: "¿Cuánto tiempo tarda la entrega?",
        answer:
          "Las entregas para fundadores comienzan en Mayo. Una vez confirmada tu reserva, recibirás actualizaciones mensuales sobre el estado de tu pedido.",
      },
      {
        type: "faq-item",
        question: "¿Qué incluye la garantía extendida?",
        answer:
          "5 años de cobertura total en todos los componentes estructurales, incluyendo el pistón hidráulico, mecanismo de balanceo y chasis interno.",
      },
      {
        type: "faq-item",
        question: "¿Puedo cambiar mi configuración después de reservar?",
        answer:
          "Sí, puedes modificar tu elección de acabado (Prime Hybrid o AeroWeave) hasta 2 semanas antes del inicio de envíos.",
      },
      {
        type: "faq-item",
        question: "¿El código FOUNDER es transferible?",
        answer:
          "No, cada código está vinculado a la cuenta de correo registrada. Solo el titular original puede utilizarlo.",
      },
      {
        type: "faq-item",
        question: "¿Qué pasa si se agotan las 500 unidades?",
        answer:
          "El acceso Founders se cerrará automáticamente. Podrás unirte a la lista de espera para el lanzamiento público en Junio.",
      },
    ],
  },
});