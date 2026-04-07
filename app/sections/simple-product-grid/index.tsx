import { createSchema } from "@weaverse/hydrogen";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

interface SimpleProductGridProps extends SectionProps {
  ref?: React.Ref<HTMLElement>;
}

export default function SimpleProductGrid( props:SimpleProductGridProps){
  const{children,ref,...rest} = props
  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  )
}

export const schema = createSchema({
  type:"simple-product-grid",
  title:"Simple product  grid",
  childTypes:["subheading","heading","columns-with-products--items"],
  settings:sectionSettings,
  presets:{
    children:[
      {
        type:"subheading",
        content:"COMPLETA TU SETUP"
      },
      {
        type:"heading",
        content:"ECOSISTEMA PHOENIX"
      },
      {
        type:"columns-with-products--items"
      }

    ]
  }
})