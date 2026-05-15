// app/sections/PhoenixAuth/schema.ts
//
// Schema de Weaverse: define qué opciones aparecen en el editor visual
// para que el cliente pueda personalizar la sección sin tocar código.

import type { HydrogenComponentSchema } from "@weaverse/hydrogen";

export const schema: HydrogenComponentSchema = {
  type: "phoenix-auth",
  title: "Phoenix Authentication",
  // Icono visible en el panel de Weaverse Studio
  settings: [
    {
      group: "Contenido",
      inputs: [
        {
          type: "text",
          name: "brandName",
          label: "Nombre de marca",
          defaultValue: "PHOENIX AUTHENTICATION",
          placeholder: "PHOENIX AUTHENTICATION",
        },
        {
          type: "text",
          name: "successTitle",
          label: "Título cuando es original",
          defaultValue: "Producto Original",
        },
        {
          type: "text",
          name: "successMessage",
          label: "Mensaje cuando es original",
          defaultValue:
            "Esta unidad ha sido verificada satisfactoriamente como auténtica.",
        },
        {
          type: "text",
          name: "fakeTitle",
          label: "Título cuando es falsificación",
          defaultValue: "Error de Autenticidad",
        },
        {
          type: "text",
          name: "fakeMessage",
          label: "Mensaje cuando es falsificación",
          defaultValue:
            "No se ha podido verificar la autenticidad de este producto.",
        },
        {
          type: "text",
          name: "waitingMessage",
          label: "Mensaje de espera (sin interacción NFC)",
          defaultValue: "Esperando interacción del sensor NFC...",
        },
      ],
    },
    {
      group: "API",
      inputs: [
        {
          type: "text",
          name: "apiEndpoint",
          label: "Ruta del endpoint de validación",
          defaultValue: "/api/nfc-auth",
          // Permite cambiar la ruta si en el futuro la mueves
        },
      ],
    },
  ],
};