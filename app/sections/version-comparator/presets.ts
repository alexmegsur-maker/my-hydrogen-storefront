// Presets de los componentes atómicos (Heading / Paragraph) con el estilo de la
// landing. Se reutilizan en los presets de la sección y de cada subcomponente.

const SPACE_GROTESK = "'Space Grotesk', sans-serif";

export function sectionHeading(content: string) {
  return {
    type: "heading",
    content,
    as: "h2",
    size: "custom",
    mobileSize: "26px",
    desktopSize: "40px",
    weight: "700",
    letterSpacing: 0,
    lineH: 1.1,
    alignment: "left",
    family: SPACE_GROTESK,
    color: "#e9ecef",
    marginSelect: "b",
    marginText: "10px",
    animacion: "fade",
  };
}

export function cardHeading(content: string) {
  return {
    ...sectionHeading(content),
    as: "h3",
    desktopSize: "36px",
    marginSelect: "y",
    marginText: "12px 10px",
    animacion: "none",
  };
}

export function featureHeading(content: string) {
  return {
    ...sectionHeading(content),
    as: "h4",
    mobileSize: "16px",
    desktopSize: "16px",
    weight: "600",
    lineH: 1.3,
    family: "",
    marginSelect: "a",
    marginText: "0",
    animacion: "none",
  };
}

export function sectionParagraph(content: string) {
  return {
    type: "paragraph",
    content,
    as: "p",
    width: "full",
    contWidth: 100,
    alignment: "left",
    textSize: "16px",
    lineH: 1.55,
    color: "#8b939b",
    family: "",
    marginSelect: "b",
    marginText: "32px",
    animacion: "fade",
  };
}

export function cardParagraph(content: string) {
  return {
    ...sectionParagraph(content),
    textSize: "15px",
    marginText: "0",
    animacion: "none",
  };
}

export function featureParagraph(content: string, color = "#8b939b") {
  return {
    ...cardParagraph(content),
    as: "div",
    color,
  };
}

// ---------------------------------------------------------------------------
// Contenido por defecto de cada subcomponente (el de la landing original)
// ---------------------------------------------------------------------------

export const SELECTOR_CHILDREN = [
  {
    type: "version-comparator--card",
    version: "a",
    tag: "Versión anterior",
    children: [
      cardHeading("Remaster V2"),
      cardParagraph("Sentada firme con espuma de doble densidad 60+50 kg/m³."),
    ],
  },
  {
    type: "version-comparator--card",
    version: "b",
    tag: "Versión actual",
    badge: "Nueva",
    highlight: true,
    children: [
      cardHeading("Remaster V3"),
      cardParagraph(
        "Sentada más blanda y acogedora, con viscoelástico en el respaldo y verificación NFC.",
      ),
    ],
  },
];

export const CHANGES_CHILDREN = [
  sectionHeading("El cambio que más vas a notar: el asiento"),
  sectionParagraph(
    "La V3 pasa a espuma fría con microespuma de celda abierta y densidades algo menores, para una sentada más blanda.",
  ),
  {
    type: "version-comparator--foam-card",
    title: "V2 · Core MATRIIX™",
    valueLabel: "60 + 50 kg/m³",
    firmness: 4,
    firmnessText: "Más firme",
    children: [
      { type: "version-comparator--layer", label: "Capa superior", value: "60 kg/m³", percent: 100 },
      { type: "version-comparator--layer", label: "Capa inferior", value: "50 kg/m³", percent: 83 },
    ],
  },
  {
    type: "version-comparator--foam-card",
    title: "V3 · Core MATRIIX™ V2",
    valueLabel: "55 + 45 kg/m³",
    highlight: true,
    firmness: 2,
    firmnessText: "Más blanda y acogedora",
    children: [
      { type: "version-comparator--layer", label: "Espuma fría", value: "55 kg/m³", percent: 92 },
      { type: "version-comparator--layer", label: "Microespuma celda abierta", value: "45 kg/m³", percent: 75 },
    ],
  },
];

const B_COLOR = "#bdf5d0";

function diffFeature(label: string, a: string, b: string) {
  return {
    type: "version-comparator--feature",
    mode: "diff",
    children: [
      featureHeading(label),
      featureParagraph(a),
      featureParagraph(b, B_COLOR),
    ],
  };
}

function sameFeature(label: string, text: string) {
  return {
    type: "version-comparator--feature",
    mode: "same",
    children: [featureHeading(label), featureParagraph(text)],
  };
}

export const FEATURES_CHILDREN = [
  sectionHeading("Característica a característica"),
  sectionParagraph(
    "Elige una versión para centrarte en ella, o muestra solo lo que cambia.",
  ),
  diffFeature(
    "Asiento",
    "Core MATRIIX™ Espuma de doble densidad <strong>60+50 kg/m³</strong>, con una sentada más firme.",
    "Core MATRIIX™ <strong>V2</strong> Espuma fría + microespuma de celda abierta <strong>55+45 kg/m³</strong>, con una sentada más blanda y acogedora.",
  ),
  diffFeature(
    "Forma del asiento",
    "Asiento ergonómico.",
    "Nueva forma ergonómica más abierta que facilita la posición deseada.",
  ),
  diffFeature(
    "Respaldo",
    "Sin lámina de viscoelástico.",
    "<strong>Lámina de viscoelástico integrada</strong> para mejorar el confort de la espalda.",
  ),
  diffFeature(
    "Forma del respaldo",
    "Respaldo ergonómico.",
    "Nueva forma ergonómica más adaptada a la espalda.",
  ),
  sameFeature(
    "Soporte lumbar ajustable",
    "Integrado, ajustable en altura y profundidad.",
  ),
  diffFeature(
    "Tapizado de tela",
    "Tejido transpirable <strong>AeroWeave™</strong>.",
    "Nuevo <strong>AeroWeave™ 2.0</strong>, más resistente.",
  ),
  sameFeature(
    "Reposabrazos",
    "<strong>4D:</strong> altura, profundidad, giro y desplazamiento lateral. Estructura interna metálica y PU mullido.",
  ),
  sameFeature("Pistón hidráulico", "<strong>Clase 4</strong>, con altura regulable."),
  diffFeature(
    "Cojín cervical",
    "Cojín viscoelástico magnético con 4 imanes y gel frío con tecnología OMNI-COOL™ en toda la superficie.",
    "Mantiene la espuma, el gel frío con tecnología OMNI-COOL™ y la fijación magnética e incorpora una <strong>nueva forma más ergonómica</strong>.",
  ),
  sameFeature("Base", "Aleación de aluminio reforzado de cinco radios."),
  diffFeature(
    "Verificación de autenticidad",
    "Sin tag NFC.",
    "<strong>Tag NFC integrado</strong> para verificar la autenticidad de la silla.",
  ),
  sameFeature("Carga máxima", "150 kg."),
];
