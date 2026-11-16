import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";

/**
 * Una opción del menú "Tabs menu". El texto del menú (label) y la imagen los
 * lee el padre desde los datos de Weaverse; aquí solo se pinta el contenido.
 */
export interface TabsMenuItemProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLDivElement>;
  label: string;
  image?: WeaverseImage | string;
  targetId?: string;
}

function TabsMenuItem(props: TabsMenuItemProps) {
  const { ref, label, image, targetId, className, children, ...rest } = props;

  return (
    <div ref={ref} {...rest} className={cn("flex w-full flex-col", className)}>
      {children}
    </div>
  );
}

export default TabsMenuItem;

export const schema = createSchema({
  type: "tabs-menu--item",
  title: "Menu item",
  childTypes: [
    "group-elements",
    "heading",
    "subheading",
    "paragraph",
    "button",
    "group-buttons",
  ],
  settings: [
    {
      group: "Menu item",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Menu label",
          defaultValue: "Opción",
        },
        {
          type: "image",
          name: "image",
          label: "Image to show",
          helpText:
            'Se muestra en el componente Image cuyo id indiques en el menú (o abajo). Vacío = imagen original.',
        },
        {
          type: "text",
          name: "targetId",
          label: "Image id (override)",
          helpText: "Opcional: solo si esta opción debe cambiar otra imagen distinta a la del menú.",
        },
      ],
    },
  ],
  presets: {
    label: "Opción",
    children: [
      {
        type: "group-elements",
        displayDiv: "flex",
        direction: "column",
        mbDisplayDiv: "flex",
        mbDirection: "column",
        showBorder: false,
        children: [
          { type: "heading", content: "Una superficie suave. Un acabado sobrio." },
          {
            type: "paragraph",
            content:
              "Cuero sintético de tacto suave y textura lisa que realza las formas y las costuras de la silla.",
          },
        ],
      },
    ],
  },
});
