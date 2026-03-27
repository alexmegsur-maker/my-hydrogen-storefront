import { createSchema } from "@weaverse/hydrogen"
import type{HydrogenComponentProps} from "@weaverse/hydrogen"
import { Section } from "~/components/section";

function HeaderEdit(props:HydrogenComponentProps){
  const {
    children,
    ...rest
  }=props;

  return (
    <Section {...rest}>
    {children}
    </Section>
  )
}

export default HeaderEdit

export const schema = createSchema({
  type:"header-edit",
  title:"Header edit",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'switch',
          label:'show',
          name:'show',
          defaultValue:true,
        },
      ]
    }
  ],childTypes:['text-left','general','banner','image-link','text-top','product-top','register_color']
}) 