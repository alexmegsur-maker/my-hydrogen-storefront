import { createSchema } from "@weaverse/hydrogen"
import { Section, sectionSettings, type SectionProps } from "~/components/section"

function ComunityReviews (props:SectionProps){
  const {children, ...rest}=props
  return(
    <Section {...rest}>
      {children}
    </Section>
  )
}

export default ComunityReviews

export const schema = createSchema({
  type:"comunity-reviews",
  title:"Comunity reviews",
  childTypes:["heading","subheading","recent-activity","columns-with-images--items","live-activity"],
  settings:[
    ...sectionSettings
  ]
})