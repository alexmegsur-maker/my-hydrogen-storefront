import { createSchema } from "@weaverse/hydrogen";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

interface CommunityGridProps extends SectionProps{
  ref?:React.Ref<HTMLElement>
}

export default function CommunityGrid(props:CommunityGridProps){
  const {children,ref,...rest}=props
  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  )
}

export const schema = createSchema({
  type:"community-grid",
  title:"comunity-grid",
  childTypes:["subheading","heading","columns-with-posts--items"],
  settings:sectionSettings
})