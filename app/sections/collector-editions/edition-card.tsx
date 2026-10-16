import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
  type WeaverseVideo,
} from "@weaverse/hydrogen";
import { type CSSProperties, useRef, useState } from "react";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";
import { TEXT_SIZE_CLASS } from "~/utils/text-style";
import { type EditionTextKey, useCollectorEditions } from "./context";

interface CollectorEditionCardProps extends HydrogenComponentProps {
  image: WeaverseImage | string;
  video?: WeaverseVideo;
  eyebrow: string;
  title: string;
  meta: string;
  linkText: string;
  link: string;
  cardColor: string;
  cardHoverColor: string;
  borderColor: string;
  borderHoverColor: string;
  eyebrowHoverColor: string;
  titleHoverColor: string;
  metaHoverColor: string;
  linkHoverColor: string;
  ref?: React.Ref<HTMLElement>;
}

function CollectorEditionCard(props: CollectorEditionCardProps) {
  const {
    image,
    video,
    eyebrow,
    title,
    meta,
    linkText,
    link,
    cardColor,
    cardHoverColor,
    borderColor,
    borderHoverColor,
    eyebrowHoverColor,
    titleHoverColor,
    metaHoverColor,
    linkHoverColor,
    ref,
    ...rest
  } = props;

  const { textStyles, hoverColors, imageAspectRatio } = useCollectorEditions();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHover, setIsHover] = useState(false);
  const videoUrl = video?.url;

  // Color de hover: el de la tarjeta si lo tiene; si no, el del grupo.
  const ownHoverColors: Record<EditionTextKey, string> = {
    eyebrow: eyebrowHoverColor,
    title: titleHoverColor,
    meta: metaHoverColor,
    link: linkHoverColor,
  };
  const textStyle = (key: EditionTextKey): CSSProperties => {
    const hoverColor = ownHoverColors[key] || hoverColors[key];
    return {
      ...textStyles[key],
      ...(isHover && hoverColor ? { color: hoverColor } : {}),
      transition: "color 0.3s ease",
    };
  };

  const handleEnter = () => {
    setIsHover(true);
    const el = videoRef.current;
    if (el) {
      el.play().catch(() => {
        // El navegador puede bloquear la reproducción; se queda la imagen.
      });
    }
  };
  const handleLeave = () => {
    setIsHover(false);
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  const imageData =
    typeof image === "object" ? image : { url: image, altText: title };

  return (
    <article
      ref={ref}
      {...rest}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative flex flex-col border transition-colors duration-300"
      style={{
        backgroundColor: isHover ? cardHoverColor || cardColor : cardColor,
        borderColor: isHover ? borderHoverColor || borderColor : borderColor,
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: imageAspectRatio }}
      >
        {imageData?.url && (
          <Image
            data={imageData}
            sizes="(min-width: 64em) 25vw, (min-width: 40em) 50vw, 100vw"
            width={900}
            className="absolute inset-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
          />
        )}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              isHover ? "opacity-100" : "opacity-0",
            )}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {eyebrow && (
          <span className={TEXT_SIZE_CLASS} style={textStyle("eyebrow")}>
            {eyebrow}
          </span>
        )}
        {title && (
          <h3 className={TEXT_SIZE_CLASS} style={textStyle("title")}>
            {title}
          </h3>
        )}
        {meta && (
          <span className={TEXT_SIZE_CLASS} style={textStyle("meta")}>
            {meta}
          </span>
        )}
        {linkText && link && (
          <a
            href={link}
            // after:inset-0 → toda la tarjeta es clicable con un solo enlace.
            className={cn(
              TEXT_SIZE_CLASS,
              "mt-3 self-start border-current border-b pb-0.5 after:absolute after:inset-0",
            )}
            style={textStyle("link")}
          >
            {linkText}
          </a>
        )}
      </div>
    </article>
  );
}

export default CollectorEditionCard;

export const schema = createSchema({
  type: "collector-editions--edition",
  title: "Edición",
  settings: [
    {
      group: "Medios",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Imagen",
          defaultValue: IMAGES_PLACEHOLDERS.product_1,
        },
        {
          type: "video",
          name: "video",
          label: "Vídeo al pasar el ratón",
          helpText: "Se reproduce sin sonido y en bucle mientras el ratón está encima.",
        },
      ],
    },
    {
      group: "Contenido",
      inputs: [
        {
          type: "text",
          name: "eyebrow",
          label: "Antetítulo",
          defaultValue: "Middle-earth™ · Licencia oficial",
        },
        {
          type: "text",
          name: "title",
          label: "Título",
          defaultValue: "Monarch · Mordor",
        },
        {
          type: "text",
          name: "meta",
          label: "Datos (tirada / precio)",
          defaultValue: "Tirada de [N] unidades · [precio]",
        },
        {
          type: "text",
          name: "linkText",
          label: "Texto del enlace",
          defaultValue: "Ver la edición",
        },
        {
          type: "url",
          name: "link",
          label: "Enlace",
          defaultValue: "/products",
        },
      ],
    },
    {
      group: "Colores de la tarjeta",
      inputs: [
        {
          type: "color",
          name: "cardColor",
          label: "Fondo",
          defaultValue: "#111216",
        },
        {
          type: "color",
          name: "cardHoverColor",
          label: "Fondo al pasar el ratón",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Borde",
          defaultValue: "#1f2126",
        },
        {
          type: "color",
          name: "borderHoverColor",
          label: "Borde al pasar el ratón",
        },
      ],
    },
    {
      group: "Colores del texto al pasar el ratón",
      inputs: [
        {
          type: "heading",
          label: "Vacío = el color definido en «Tarjetas de ediciones».",
        },
        {
          type: "color",
          name: "eyebrowHoverColor",
          label: "Antetítulo",
        },
        {
          type: "color",
          name: "titleHoverColor",
          label: "Título",
        },
        {
          type: "color",
          name: "metaHoverColor",
          label: "Datos (tirada / precio)",
        },
        {
          type: "color",
          name: "linkHoverColor",
          label: "Enlace",
        },
      ],
    },
  ],
});
