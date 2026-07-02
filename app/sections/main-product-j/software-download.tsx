import { createSchema, type ComponentLoaderArgs, type HydrogenComponentProps } from "@weaverse/hydrogen"
import { useState } from "react"
import { Section } from "~/components/section"
import { selectorPaddingMargin } from "~/utils/general"

// ─── Types ─────────────────────────────────────────────────────────────────

interface SoftwareFile {
  id: string
  url: string
  name: string
  mimeType?: string | null
}

type LoaderData = { files: SoftwareFile[] }

interface ProductSoftwareDownloadProps extends HydrogenComponentProps {
  title: string
  // section
  paddingSelect: string
  paddingText: string
  marginSelect: string
  marginText: string
  // title
  tColor: string
  tSize: string
  tLetter: number
  tUpper: boolean
  tFamily: string
  tWeight: string
  tPaddingSelect: string
  tPaddingText: string
  tMarginSelect: string
  tMarginText: string
  // container
  cBgColor: string
  cBorderColor: string
  cBorderRadius: string
  cPaddingSelect: string
  cPaddingText: string
  cMarginSelect: string
  cMarginText: string
  // file name
  fnColor: string
  fnSize: string
  fnFamily: string
  fnWeight: string
  // mime badge
  mbColor: string
  mbBgColor: string
  mbSize: string
  // download button
  dbColor: string
  dbHoverColor: string
  dbBgColor: string
  dbHoverBgColor: string
  dbBorderColor: string
  dbSize: string
  dbRadius: string
  dbLetter: number
  dbUpper: boolean
  dbFamily: string
  dbWeight: string
  dbPaddingSelect: string
  dbPaddingText: string
  dbMarginSelect: string
  dbMarginText: string
}

// ─── GraphQL ───────────────────────────────────────────────────────────────

const SOFTWARE_METAFIELD_QUERY = `#graphql
  query ProductSoftware(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      software: metafield(namespace: "custom", key: "software") {
        references(first: 20) {
          nodes {
            ... on GenericFile {
              id
              url
              alt
              mimeType
            }
            ... on MediaImage {
              id
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`

// ─── Helpers ───────────────────────────────────────────────────────────────

function getFileName(url: string): string {
  try {
    const segments = new URL(url).pathname.split("/")
    return decodeURIComponent(segments[segments.length - 1] ?? "archivo")
  } catch {
    return url.split("/").pop() ?? "archivo"
  }
}

function getMimeLabel(mimeType?: string | null): string {
  if (!mimeType) return "FILE"
  if (mimeType.includes("pdf")) return "PDF"
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return "ZIP"
  if (mimeType.includes("exe") || mimeType.includes("octet-stream")) return "EXE"
  if (mimeType.includes("image")) return "IMG"
  if (mimeType.includes("video")) return "VID"
  return "FILE"
}

function parseNodes(nodes: any[]): SoftwareFile[] {
  return nodes
    .map((node: any): SoftwareFile | null => {
      if (node?.url) {
        return { id: node.id, url: node.url, name: node.alt || getFileName(node.url), mimeType: node.mimeType ?? null }
      }
      if (node?.image?.url) {
        return { id: node.id, url: node.image.url, name: node.image.altText || getFileName(node.image.url), mimeType: "image/*" }
      }
      return null
    })
    .filter((f): f is SoftwareFile => f !== null)
}

// ─── Loader ────────────────────────────────────────────────────────────────

export const loader = async ({ weaverse }: ComponentLoaderArgs<ProductSoftwareDownloadProps>): Promise<LoaderData> => {
  const { country, language } = weaverse.storefront.i18n

  // Extract product handle from the page URL  (/products/:handle or /en/products/:handle)
  const url = new URL(weaverse.request.url)
  const segments = url.pathname.split("/").filter(Boolean)
  const prodIndex = segments.indexOf("products")
  const handle = prodIndex !== -1 ? segments[prodIndex + 1] : null

  if (!handle) return { files: [] }

  try {
    const result = await weaverse.storefront.query(SOFTWARE_METAFIELD_QUERY, {
      variables: { handle, country, language },
    })
    const nodes: any[] = result?.product?.software?.references?.nodes ?? []
    return { files: parseNodes(nodes) }
  } catch {
    return { files: [] }
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function ProductSoftwareDownload(props: ProductSoftwareDownloadProps) {
  const {
    title,
    paddingSelect, paddingText, marginSelect, marginText,
    tColor, tSize, tLetter, tUpper, tFamily, tWeight,
    tPaddingSelect, tPaddingText, tMarginSelect, tMarginText,
    cBgColor, cBorderColor, cBorderRadius,
    cPaddingSelect, cPaddingText, cMarginSelect, cMarginText,
    fnColor, fnSize, fnFamily, fnWeight,
    mbColor, mbBgColor, mbSize,
    dbColor, dbHoverColor, dbBgColor, dbHoverBgColor, dbBorderColor,
    dbSize, dbRadius, dbLetter, dbUpper, dbFamily, dbWeight,
    dbPaddingSelect, dbPaddingText, dbMarginSelect, dbMarginText,
    loaderData,
    ...rest
  } = props

  const files: SoftwareFile[] = (loaderData as LoaderData)?.files ?? []
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (!files.length) return null

  return (
    <Section {...rest}>
      <div
        className="config-section"
        style={{
          ...selectorPaddingMargin("padding", paddingSelect, paddingText),
          ...selectorPaddingMargin("margin", marginSelect, marginText),
        }}
      >
        {/* Title */}
        {title && (
          <div
            className="config-label"
            style={{
              color: tColor,
              fontSize: tSize,
              fontFamily: tFamily,
              fontWeight: tWeight,
              letterSpacing: tLetter > 0 ? `${tLetter}px` : "normal",
              textTransform: tUpper ? "uppercase" : "unset",
              ...selectorPaddingMargin("padding", tPaddingSelect, tPaddingText),
              ...selectorPaddingMargin("margin", tMarginSelect, tMarginText),
            }}
          >
            {title} 
          </div>
        )}

        {/* File list container */}
        <div
          style={{
            backgroundColor: cBgColor,
            border: `1px solid ${cBorderColor}`,
            borderRadius: cBorderRadius,
            ...selectorPaddingMargin("padding", cPaddingSelect, cPaddingText),
            ...selectorPaddingMargin("margin", cMarginSelect, cMarginText),
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {files.map((file, index) => {
              const isHovered = hoveredId === file.id
              const isLast = index === files.length - 1

              return (
                <li
                  key={file.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    paddingBlock: "0.75rem",
                    borderBottom: isLast ? "none" : `1px solid ${cBorderColor}`,
                  }}
                >
                  {/* Mime badge */}
                  <span
                    style={{
                      fontSize: mbSize,
                      color: mbColor,
                      backgroundColor: mbBgColor,
                      padding: "0.2rem 0.45rem",
                      borderRadius: "4px",
                      fontFamily: fnFamily,
                      fontWeight: "600",
                      flexShrink: 0,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {getMimeLabel(file.mimeType)}
                  </span>

                  {/* File name */}
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: fnColor,
                      fontSize: fnSize,
                      fontFamily: fnFamily,
                      fontWeight: fnWeight,
                    }}
                  >
                    {file.name}
                  </span>

                  {/* Download button */}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onMouseEnter={() => setHoveredId(file.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      flexShrink: 0,
                      textDecoration: "none",
                      color: isHovered ? dbHoverColor : dbColor,
                      backgroundColor: isHovered ? dbHoverBgColor : dbBgColor,
                      border: `1px solid ${dbBorderColor}`,
                      borderRadius: dbRadius,
                      fontSize: dbSize,
                      fontFamily: dbFamily,
                      fontWeight: dbWeight,
                      letterSpacing: dbLetter > 0 ? `${dbLetter}px` : "normal",
                      textTransform: dbUpper ? "uppercase" : "unset",
                      transition: "color 0.2s, background-color 0.2s",
                      ...selectorPaddingMargin("padding", dbPaddingSelect, dbPaddingText),
                      ...selectorPaddingMargin("margin", dbMarginSelect, dbMarginText),
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: "0.85em", height: "0.85em", flexShrink: 0 }}
                    >
                      <path d="M12 4v12m0 0-3.5-3.5M12 16l3.5-3.5M4 20h16" />
                    </svg>
                    Descargar
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </Section>
  )
}

// ─── Schema ────────────────────────────────────────────────────────────────

const FONT_WEIGHT_OPTIONS = [
  { value: "100", label: "100" }, { value: "200", label: "200" },
  { value: "300", label: "300" }, { value: "400", label: "400" },
  { value: "500", label: "500" }, { value: "600", label: "600" },
  { value: "700", label: "700" }, { value: "800", label: "800" },
  { value: "900", label: "900" },
]

const PADDING_OPTIONS = [
  { value: "t", label: "Top" }, { value: "b", label: "Bottom" },
  { value: "l", label: "Left" }, { value: "r", label: "Right" },
  { value: "x", label: "Inline" }, { value: "y", label: "Block" },
  { value: "a", label: "Custom" },
]

export const schema = createSchema({
  type: "product-software-download",
  title: "Software Download",
  settings: [
    {
      group: "General",
      inputs: [
        { type: "text", label: "Title", name: "title", defaultValue: "Software disponible" },
      ],
    },
    {
      group: "Section",
      inputs: [
        { type: "heading", label: "padding / margin" },
        { type: "select", label: "Padding type", name: "paddingSelect", configs: { options: PADDING_OPTIONS }, defaultValue: "b" },
        { type: "text", label: "Padding value", name: "paddingText" },
        { type: "select", label: "Margin type", name: "marginSelect", configs: { options: PADDING_OPTIONS }, defaultValue: "b" },
        { type: "text", label: "Margin value", name: "marginText", defaultValue: "3.5rem" },
      ],
    },
    {
      group: "Title",
      inputs: [
        { type: "color", label: "Color", name: "tColor", defaultValue: "#ffffff" },
        { type: "text", label: "Font size", name: "tSize", defaultValue: "0.9rem" },
        { type: "range", label: "Letter spacing", name: "tLetter", defaultValue: 2, configs: { min: 0, max: 50, step: 1, unit: "px" } },
        { type: "switch", label: "Uppercase", name: "tUpper", defaultValue: true },
        { type: "text", label: "Font family", name: "tFamily", defaultValue: "Montserrat" },
        { type: "select", label: "Font weight", name: "tWeight", configs: { options: FONT_WEIGHT_OPTIONS }, defaultValue: "600" },
        { type: "select", label: "Padding type", name: "tPaddingSelect", configs: { options: PADDING_OPTIONS }, defaultValue: "a" },
        { type: "text", label: "Padding value", name: "tPaddingText" },
        { type: "select", label: "Margin type", name: "tMarginSelect", configs: { options: PADDING_OPTIONS }, defaultValue: "a" },
        { type: "text", label: "Margin value", name: "tMarginText" },
      ],
    },
    {
      group: "Container",
      inputs: [
        { type: "color", label: "Background color", name: "cBgColor", defaultValue: "rgba(255,255,255,0.02)" },
        { type: "color", label: "Border color", name: "cBorderColor", defaultValue: "rgba(255,255,255,0.08)" },
        { type: "text", label: "Border radius", name: "cBorderRadius", defaultValue: "12px" },
        { type: "select", label: "Padding type", name: "cPaddingSelect", configs: { options: PADDING_OPTIONS }, defaultValue: "a" },
        { type: "text", label: "Padding value", name: "cPaddingText", defaultValue: "1.5rem" },
        { type: "select", label: "Margin type", name: "cMarginSelect", configs: { options: PADDING_OPTIONS }, defaultValue: "b" },
        { type: "text", label: "Margin value", name: "cMarginText", defaultValue: "2rem" },
      ],
    },
    {
      group: "File name",
      inputs: [
        { type: "color", label: "Color", name: "fnColor", defaultValue: "#A1A1AA" },
        { type: "text", label: "Font size", name: "fnSize", defaultValue: "0.85rem" },
        { type: "text", label: "Font family", name: "fnFamily", defaultValue: "Montserrat" },
        { type: "select", label: "Font weight", name: "fnWeight", configs: { options: FONT_WEIGHT_OPTIONS }, defaultValue: "400" },
        { type: "heading", label: "Mime badge" },
        { type: "color", label: "Badge text color", name: "mbColor", defaultValue: "#E4E4E7" },
        { type: "color", label: "Badge background", name: "mbBgColor", defaultValue: "rgba(255,255,255,0.06)" },
        { type: "text", label: "Badge font size", name: "mbSize", defaultValue: "0.65rem" },
      ],
    },
    {
      group: "Download button",
      inputs: [
        { type: "color", label: "Text color", name: "dbColor", defaultValue: "#f1e2b7" },
        { type: "color", label: "Text hover color", name: "dbHoverColor", defaultValue: "#ffffff" },
        { type: "color", label: "Background color", name: "dbBgColor", defaultValue: "rgba(153,113,36,0.15)" },
        { type: "color", label: "Background hover color", name: "dbHoverBgColor", defaultValue: "rgba(153,113,36,0.35)" },
        { type: "color", label: "Border color", name: "dbBorderColor", defaultValue: "rgba(153,113,36,0.3)" },
        { type: "text", label: "Font size", name: "dbSize", defaultValue: "0.7rem" },
        { type: "text", label: "Border radius", name: "dbRadius", defaultValue: "8px" },
        { type: "range", label: "Letter spacing", name: "dbLetter", defaultValue: 1, configs: { min: 0, max: 30, step: 1, unit: "px" } },
        { type: "switch", label: "Uppercase", name: "dbUpper", defaultValue: true },
        { type: "text", label: "Font family", name: "dbFamily", defaultValue: "Montserrat" },
        { type: "select", label: "Font weight", name: "dbWeight", configs: { options: FONT_WEIGHT_OPTIONS }, defaultValue: "600" },
        { type: "select", label: "Padding type", name: "dbPaddingSelect", configs: { options: PADDING_OPTIONS }, defaultValue: "a" },
        { type: "text", label: "Padding value", name: "dbPaddingText", defaultValue: "0.4rem 0.8rem" },
        { type: "select", label: "Margin type", name: "dbMarginSelect", configs: { options: PADDING_OPTIONS }, defaultValue: "a" },
        { type: "text", label: "Margin value", name: "dbMarginText" },
      ],
    },
  ],
})
