import type { CurrentProduct, Variants } from "~/types/currentProduct";
import type { ResolvedOptionValue } from "./types";

/** Compara nombres de opción/valor sin distinguir mayúsculas ni espacios. */
function equals(a: string | undefined | null, b: string | undefined | null): boolean {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}

/** Valor que tiene una variante para una opción concreta (ej. "talla" -> "XL"). */
export function getSelectedOptionValue(
  variant: Variants | null | undefined,
  optionName: string,
): string | null {
  if (!variant?.selectedOptions) return null;
  const option = variant.selectedOptions.find((elm) => equals(elm.name, optionName));
  return option?.value ?? null;
}

/** Valores declarados para una opción del producto, en el orden de Shopify. */
export function getOptionValues(
  product: CurrentProduct | null | undefined,
  optionName: string,
): string[] {
  const option = product?.options?.find((elm) => equals(elm.name, optionName));
  return option?.optionValues?.map((elm) => elm.name) ?? [];
}

/**
 * Busca la variante que corresponde a cambiar UNA opción manteniendo el resto
 * de opciones ya elegidas. Si esa combinación no existe (p. ej. un material
 * que no viene en XL), cae a la primera variante que tenga ese valor.
 */
export function resolveVariantForOption(
  product: CurrentProduct | null | undefined,
  optionName: string,
  value: string,
): Variants | null {
  const variants = product?.variants?.nodes ?? [];
  if (!variants.length) return null;

  const current = product?.selectedVariant;
  const others = (current?.selectedOptions ?? []).filter(
    (elm) => !equals(elm.name, optionName),
  );

  const exact = variants.find((variant) => {
    const matchesValue = variant.selectedOptions?.some(
      (elm) => equals(elm.name, optionName) && equals(elm.value, value),
    );
    if (!matchesValue) return false;
    return others.every((other) =>
      variant.selectedOptions?.some(
        (elm) => equals(elm.name, other.name) && equals(elm.value, other.value),
      ),
    );
  });
  if (exact) return exact;

  return (
    variants.find((variant) =>
      variant.selectedOptions?.some(
        (elm) => equals(elm.name, optionName) && equals(elm.value, value),
      ),
    ) ?? null
  );
}

/**
 * Resuelve todos los valores de una opción contra las variantes: variante,
 * disponibilidad, precio y sobrecoste respecto al valor más barato (lo que en
 * el boceto se pinta como "· +40€").
 */
export function buildResolvedOptionValues(
  product: CurrentProduct | null | undefined,
  optionName: string,
): ResolvedOptionValue[] {
  const values = getOptionValues(product, optionName);
  if (!values.length) return [];

  const selected = getSelectedOptionValue(product?.selectedVariant, optionName);

  const resolved = values.map((value) => {
    const variant = resolveVariantForOption(product, optionName, value);
    return {
      value,
      variant,
      available: Boolean(variant?.availableForSale),
      price: Number.parseFloat(variant?.price?.amount ?? "0"),
      priceDelta: 0,
      active: equals(selected, value),
    } satisfies ResolvedOptionValue;
  });

  const prices = resolved.map((elm) => elm.price).filter((price) => price > 0);
  const base = prices.length ? Math.min(...prices) : 0;

  return resolved.map((elm) => ({ ...elm, priceDelta: elm.price - base }));
}

/**
 * Parsea el mapeo `valor|texto` que se configura desde el Studio, una entrada
 * por línea. Permite describir cada talla/material sin depender del metaobjeto:
 *
 *   R|1.50–1.85m · hasta 100kg
 *   XL|1.80–2.05m · hasta 180kg
 */
export function parseKeyValueLines(raw: string | undefined | null): Record<string, string> {
  if (!raw) return {};
  return raw.split("\n").reduce<Record<string, string>>((acc, line) => {
    const [key, ...rest] = line.split("|");
    const value = rest.join("|").trim();
    if (key?.trim() && value) acc[key.trim().toLowerCase()] = value;
    return acc;
  }, {});
}

/** Lee del mapeo el texto asociado a un valor de opción. */
export function lookupLine(
  map: Record<string, string>,
  value: string | null | undefined,
): string {
  return map[(value ?? "").trim().toLowerCase()] ?? "";
}

/** Una fila de la ficha de configuración: `etiqueta` a la izquierda, `valor` a la derecha. */
export interface SpecRow {
  label: string;
  value: string;
}

/**
 * Parsea el metafield de variante `custom.especification`
 * (list.single_line_text_field): su `value` llega como string JSON con un array
 * de líneas del tipo `"Etiqueta: valor"`. Se parte por el primer `": "`; si una
 * línea no lo tiene, se trata como valor sin etiqueta.
 */
export function parseSpecList(raw: string | null | undefined): SpecRow[] {
  if (!raw) return [];
  let items: unknown;
  try {
    items = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => {
      const separator = item.indexOf(": ");
      if (separator === -1) return { label: "", value: item.trim() };
      return {
        label: item.slice(0, separator).trim(),
        value: item.slice(separator + 2).trim(),
      };
    });
}

/** Formatea un importe numérico como precio con separador decimal español. */
export function formatAmount(amount: number): string {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(".", ",");
}

/**
 * Metaobjeto `option` (namespace type "option", campos title/description/product):
 * define el nombre "de marca" de cada valor de opción —p. ej. product:"cuero" ->
 * title:"Prime Hybrid™", product:"xl" -> title:"Extra Large (XL)"—. Un único
 * catálogo compartido por talla y material, en vez de mantener el mapeo a mano
 * en cada sección.
 */
export const OPTION_METAOBJECTS_QUERY = `#graphql
  query OptionMetaobjects($first: Int = 50) {
    metaobjects(type: "option", first: $first) {
      edges {
        node {
          handle
          fields {
            key
            value
          }
        }
      }
    }
  }
`;

export interface OptionMetaobjectNode {
  handle: string;
  fields: { key: string; value: string | null }[];
}

export interface OptionMetaobjectsResult {
  metaobjects: { edges: { node: OptionMetaobjectNode }[] } | null;
}

/**
 * A partir del resultado de `OPTION_METAOBJECTS_QUERY`, arma un mapa
 * `product` (en minúsculas) -> `title`. El producto se conecta con la opción
 * a través del campo `product` del metaobjeto: un producto con
 * `custom.material = "cuero"` encuentra la entrada `option` cuyo campo
 * `product` valga "cuero" y usa su `title` ("Prime Hybrid™") como nombre.
 */
export function buildOptionTitleMap(
  result: OptionMetaobjectsResult | null | undefined,
): Record<string, string> {
  const edges = result?.metaobjects?.edges ?? [];
  return edges.reduce<Record<string, string>>((acc, { node }) => {
    const fields = Object.fromEntries(node.fields.map((field) => [field.key, field.value ?? ""]));
    const key = (fields.product ?? "").trim().toLowerCase();
    if (key && fields.title) acc[key] = fields.title;
    return acc;
  }, {});
}
