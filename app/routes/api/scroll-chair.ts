import { data as json } from "react-router"; // O de "react-router" según tu boilerplate
import type { ComponentLoaderArgs } from "@weaverse/hydrogen";
import { CHAIR_METAOBJECT_QUERY } from "~/graphql/chair-metaobject";

export const loader = async ({ weaverse,  data }: ComponentLoaderArgs<{ metaobject: string }>) => {
  const { storefront } = weaverse;
  const handle = data?.metaobject;

  if (!handle) return null;

  try {
    const response = await storefront.query(CHAIR_METAOBJECT_QUERY, {
      variables: { handle },
    });

    if (!response || !response.metaobject) {
      console.warn(`No se encontró el metaobjeto con el handle: ${handle}`);
      return null;
    }

    // Convertimos la matriz de Shopify [ {key: "subtitle", value: "..."} ] en un objeto key-value limpio
    const fieldsRaw = response.metaobject.fields;
    const formattedData: Record<string, any> = {};

    fieldsRaw.forEach((field: any) => {
      const key = field.key;

      // 1. Si es una lista de imágenes (como imagenes_360 o imagenes)
      if (field.references && field.references.nodes.length > 0) {
        formattedData[key] = field.references.nodes
          .map((node: any) => node.image)
          .filter(Boolean);
      } 
      // 2. Si es una imagen de referencia única (como imgTitulo)
      else if (field.reference && field.reference.image) {
        formattedData[key] = field.reference.image;
      } 
      // 3. Si es un string/texto normal (titulo, subtitle, link, etc.)
      else {
        formattedData[key] = field.value;
      }
    });

    // Retornamos los datos limpios directamente para Weaverse
    return json({ ...formattedData });
  } catch (error) {
    console.error("Error en el loader de ChairSection:", error);
    return null;
  }
};