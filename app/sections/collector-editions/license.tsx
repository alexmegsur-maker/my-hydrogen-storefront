import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { Image } from "~/components/image";

interface CollectorLicenseProps extends HydrogenComponentProps {
  backgroundImage: WeaverseImage | string;
  logo: WeaverseImage | string;
  logoMaxHeight: number;
  logoMaxWidth: number;
  overlayOpacity: number;
  borderColor: string;
  link: string;
  ref?: React.Ref<HTMLDivElement>;
}

function toData(image: WeaverseImage | string, alt: string) {
  return typeof image === "object" ? image : { url: image, altText: alt };
}

function CollectorLicense(props: CollectorLicenseProps) {
  const {
    backgroundImage,
    logo,
    logoMaxHeight,
    logoMaxWidth,
    overlayOpacity,
    borderColor,
    link,
    ref,
    ...rest
  } = props;

  const logoData = logo ? toData(logo, "Logo") : null;

  const content = (
    <>
      {backgroundImage && (
        <Image
          data={toData(backgroundImage, "")}
          sizes="(min-width: 64em) 25vw, 50vw"
          width={800}
          className="absolute inset-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
          aria-hidden
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-black"
        style={{ opacity: (overlayOpacity ?? 0) / 100 }}
      />
      {logoData?.url && (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <img
            src={logoData.url}
            alt={logoData.altText || ""}
            loading="lazy"
            className="h-auto w-auto object-contain"
            style={{
              maxHeight: `${logoMaxHeight || 40}px`,
              maxWidth: `${logoMaxWidth || 70}%`,
            }}
          />
        </div>
      )}
    </>
  );

  return (
    <div
      ref={ref}
      {...rest}
      className="relative overflow-hidden border"
      style={{ borderColor: borderColor || "#24262b" }}
    >
      {link ? (
        <a href={link} className="block h-full w-full">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export default CollectorLicense;

export const schema = createSchema({
  type: "collector-editions--license",
  title: "Licencia",
  settings: [
    {
      group: "Licencia",
      inputs: [
        {
          type: "image",
          name: "logo",
          label: "Logo",
        },
        {
          type: "image",
          name: "backgroundImage",
          label: "Imagen de fondo",
          defaultValue: IMAGES_PLACEHOLDERS.banner_1,
        },
        {
          type: "range",
          name: "logoMaxHeight",
          label: "Alto máximo del logo",
          defaultValue: 40,
          configs: { min: 10, max: 200, step: 1, unit: "px" },
        },
        {
          type: "range",
          name: "logoMaxWidth",
          label: "Ancho máximo del logo",
          defaultValue: 70,
          configs: { min: 10, max: 100, step: 5, unit: "%" },
        },
        {
          type: "range",
          name: "overlayOpacity",
          label: "Oscurecer el fondo",
          defaultValue: 0,
          configs: { min: 0, max: 100, step: 5, unit: "%" },
        },
        {
          type: "color",
          name: "borderColor",
          label: "Borde",
          defaultValue: "#24262b",
        },
        {
          type: "url",
          name: "link",
          label: "Enlace (opcional)",
        },
      ],
    },
  ],
});
