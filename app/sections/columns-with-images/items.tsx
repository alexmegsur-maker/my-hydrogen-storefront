import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
} from "@weaverse/hydrogen";
import { useIsMobile } from "~/hooks/use-is-mobile";

interface ColumnsWithImagesItemsProps extends HydrogenComponentProps {
  gap: number;
  mbGap: number;
  maxColumns: number;
  widthContainer:number;
  ref?: React.Ref<HTMLDivElement>;
}

function ColumnsWithImagesItems(props: ColumnsWithImagesItemsProps) {
  const { children, gap,mbGap, maxColumns, widthContainer, ref, ...rest } = props;
  const isMobile = useIsMobile(600);

  return (
    <div
      ref={ref}
      {...rest}
      className="flex flex-col sm:grid sm:grid-cols-12"
      style={{ 
        width:!isMobile ? `${widthContainer}%`:"90%",
        justifySelf:"center",
        gap: !isMobile ? `${gap}px`:`${mbGap}px`,
        gridTemplateColumns:`repeat(${maxColumns}, minmax(0,1fr))`
      }}
    >
      {children}
    </div>
  );
}

export default ColumnsWithImagesItems;

export const schema = createSchema({
  type: "columns-with-images--items",
  title: "Items",
  settings: [
    {
      group: "Items",
      inputs: [
        {
          type: "range",
          label: "Items gap",
          name: "gap",
          configs: {
            min: 16,
            max: 80,
            step: 4,
            unit: "px",
          },
          defaultValue: 40,
        },
        {
          type:'range',
          label:'maxColumn',
          name:'maxColumns',
          defaultValue:12,
          configs:{
            min:2,
            max:100,
            step:1,
            unit:'columns',
          }
        },
        {
          type:'range',
          label:'width',
          name:'widthContainer',
          defaultValue:100,
          configs:{
            min:10,
            max:100,
            step:1,
            unit:'%',
          }
        },
      ],
    },
    {
      group:"mobile",
      inputs:[
        {
          type: "range",
          label: "Items gap",
          name: "mbGap",
          configs: {
            min: 16,
            max: 80,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
        },
      ]
    }
  ],
  childTypes: ["column-with-image--item"],
  presets: {
    children: [
      {
        type: "column-with-image--item",
        imageSrc: IMAGES_PLACEHOLDERS.product_1,
      },
      {
        type: "column-with-image--item",
        imageSrc: IMAGES_PLACEHOLDERS.product_2,
      },
      {
        type: "column-with-image--item",
        imageSrc: IMAGES_PLACEHOLDERS.product_3,
      },
    ],
  },
});
