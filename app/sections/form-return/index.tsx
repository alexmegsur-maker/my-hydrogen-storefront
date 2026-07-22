import { createSchema } from "@weaverse/hydrogen"
import { Section, type SectionProps } from "~/components/section"
import DesistimientoForm from "~/components/return/DesistimientoForm"

function FormReturn(props: SectionProps) {
  const { children, ...rest } = props
  return (
    <Section {...rest}>
      <DesistimientoForm />
    </Section>
  )
}

export default FormReturn

export const schema = createSchema({
  title: "Return section",
  type: "return-section",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type:'text',
          label:'className',
          name:'clName',
        },
      ],
    },
  ],
})
