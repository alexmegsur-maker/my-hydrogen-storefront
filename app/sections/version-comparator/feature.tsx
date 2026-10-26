import {
  createSchema,
  type HydrogenComponentProps,
  useItemInstance,
  useParentInstance,
} from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";
import { TEXT_SIZE_CLASS } from "~/utils/text-style";
import { useChildrenByType, useReveal, useVersionComparator } from "./context";
import { useFeatures } from "./features";
import { featureHeading, featureParagraph } from "./presets";

interface FeatureItemProps extends HydrogenComponentProps {
  mode: "diff" | "same";
  showImprovement: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Una fila de la comparativa. Hijos, en este orden:
 * - Heading: nombre de la característica.
 * - Paragraph: texto de la versión A (o el texto común si es "Igual en ambas").
 * - Paragraph: texto de la versión B (solo en modo "Diferente").
 */
function FeatureItem(props: FeatureItemProps) {
  const { mode, showImprovement, children, ref, ...rest } = props;
  const { onlyDiff, labelA, labelB } = useVersionComparator();
  const {
    sameLabel,
    improvementLabel,
    showNumbers,
    rowRadius,
    rowPadding,
    improvementStyle,
    sameStyle,
    numStyle,
    mlabelStyle,
  } = useFeatures();
  const { ref: revealRef, inView } = useReveal();
  const items = useChildrenByType(children);

  // Posición entre las filas hermanas, para el número y el retardo de entrada.
  const parent = useParentInstance();
  const self = useItemInstance();
  const index = (parent?.data?.children ?? [])
    .filter((child) => child.type === "version-comparator--feature")
    .findIndex((child) => child.id === self?.data?.id);

  const headings = items.filter((item) => item.type === "heading");
  const paragraphs = items.filter((item) => item.type !== "heading");
  const [textA, textB] = paragraphs;

  if (mode === "same" && onlyDiff) {
    return null;
  }

  return (
    <div ref={ref} {...rest}>
      <div
        ref={revealRef}
        className={cn("vc-row vc-grid", inView && "is-in")}
        style={{
          borderRadius: `${rowRadius}px`,
          padding: rowPadding,
          transitionDelay: `${(Math.max(index, 0) % 12) * 40}ms`,
        }}
      >
        <div className="flex items-center gap-3.5">
          {showNumbers && index >= 0 && (
            <span className={TEXT_SIZE_CLASS} style={{ color: "var(--vc-muted)", ...numStyle }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <div className="min-w-0 flex-1">{headings.map((item) => item.node)}</div>
        </div>

        {mode === "same" ? (
          <div className="vc-cell vc-both">
            {sameLabel && <span className={cn("vc-pill", TEXT_SIZE_CLASS)} style={sameStyle}>{sameLabel}</span>}
            <div className="min-w-0 flex-1">{textA?.node}</div>
          </div>
        ) : (
          <>
            <div className="vc-cell vc-cell-a">
              <span className={cn("vc-mlabel", TEXT_SIZE_CLASS)} style={mlabelStyle}>{labelA}</span>
              {textA?.node}
            </div>
            <div className="vc-cell vc-cell-b">
              <span className={cn("vc-mlabel", TEXT_SIZE_CLASS)} style={mlabelStyle}>{labelB}</span>
              {showImprovement && improvementLabel && (
                <span className={cn("vc-pill", TEXT_SIZE_CLASS)} style={improvementStyle}>{improvementLabel}</span>
              )}
              {textB?.node}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FeatureItem;

export const schema = createSchema({
  type: "version-comparator--feature",
  title: "Característica",
  childTypes: ["heading", "paragraph"],
  settings: [
    {
      group: "Característica",
      inputs: [
        {
          type: "select",
          name: "mode",
          label: "Tipo",
          configs: {
            options: [
              { value: "diff", label: "Diferente (2 párrafos: A y B)" },
              { value: "same", label: "Igual en ambas (1 párrafo)" },
            ],
          },
          defaultValue: "diff",
          helpText:
            "Hijos: Heading con el nombre y después los Paragraph. Las filas iguales se ocultan con «Solo diferencias».",
        },
        {
          type: "switch",
          name: "showImprovement",
          label: "Mostrar etiqueta de mejora en B",
          defaultValue: true,
          condition: (data: FeatureItemProps) => data.mode !== "same",
        },
      ],
    },
  ],
  presets: {
    mode: "diff",
    children: [
      featureHeading("Asiento"),
      featureParagraph("Texto de la versión A."),
      featureParagraph("Texto de la versión B.", "#bdf5d0"),
    ],
  },
});
