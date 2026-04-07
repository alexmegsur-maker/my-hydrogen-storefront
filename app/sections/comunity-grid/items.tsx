import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useIsMobile } from "~/hooks/use-is-mobile";

interface ColumnsWithPostsItemsProps extends HydrogenComponentProps {
  gap: number;
  mbGap: number;
  maxColumns: number;
  widthContainer:number;
  ref?: React.Ref<HTMLDivElement>;
}

function ColumnsWithPostsItems(props: ColumnsWithPostsItemsProps) {
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

export default ColumnsWithPostsItems;

export const schema = createSchema({
  type: "columns-with-posts--items",
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
  childTypes: ["column-with-post--item"],
  // presets: {
  //   children: [
  //     {
  //       type: "column-with-product--item",
  //     },
  //     {
  //       type: "column-with-product--item",
  //     },
  //     {
  //       type: "column-with-product--item",
  //     },
  //   ],
  // },
});
