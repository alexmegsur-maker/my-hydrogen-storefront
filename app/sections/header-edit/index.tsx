import { createSchema } from "@weaverse/hydrogen"
import type{HydrogenComponentProps} from "@weaverse/hydrogen"

function HeaderEdit(props:HydrogenComponentProps){
  const {
    children,
  }=props;

  return (
    <>
    {children}
    </>
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
      ]
    }
  ],childTypes:['text-left','general','banner','image-link','text-top','product-top','register_color']
}) 