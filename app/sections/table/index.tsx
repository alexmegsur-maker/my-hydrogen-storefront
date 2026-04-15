import {
  createSchema,
  useChildInstances,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { Section, layoutInputs } from "~/components/section";
import { backgroundInputs } from "~/components/background-image";
import { cn } from "~/utils/cn";
import { useIsMobile } from "~/hooks/use-is-mobile";

interface DeploymentHeroProps extends HydrogenComponentProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  scrollCallout: string;
  showScrollCallout: boolean;
  titleSize: string;
  maxWidth:string;
  gapTable:string;
}

function DeploymentHero(props: DeploymentHeroProps) {
  const {
    eyebrow,
    title,
    subtitle,
    scrollCallout,
    showScrollCallout,
    titleSize,
    maxWidth,
    gapTable,
    children,
    ...rest
  } = props;
  const isMobile = useIsMobile(600)
  const childInstances =useChildInstances()
  const headerChildsId =childInstances.map(
    (instance:any)=>{ 
      if(instance.data.type=="heading"||instance.data.type=="subheading"||instance.data.type=="paragraph"){
        return instance.data.id
      }
      return null
    }
  ).filter((elm)=>elm != null)

  return (
    <Section
      {...rest}
      containerClassName="flex flex-col items-center justify-center text-center relative"
    >
      {children.map((child,idx)=>{
        if(headerChildsId.find((elm)=>elm ==child.props.id)){
          return child
        }
      })}

      {/* Hardware Manifest — children (hw-rows) */}
      {children && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: gapTable,
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            padding: "2.5rem",
            borderRadius: "4px",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
            maxWidth: maxWidth,
            width:isMobile ? "90%": "100%",
            textAlign: "left",
          }}
        >
          {children.map((child,idx)=>{
            if(!headerChildsId.find((elm)=>elm ==child.props.id)){
              return child
            }
          })}
        </div>
      )}

     
    </Section>
  );
}

export default DeploymentHero;

export const schema = createSchema({
  type: "table",
  title: "table",
  settings: [
    { 
      group:"general",
      inputs:[
        {
          type:'text',
          label:'max width',
          name:'maxWidth',
          defaultValue:'900px',
        },
        {
          type:'text',
          label:'gap Table elements',
          name:'gapTable',
          defaultValue:'1rem 3rem',
        },
      ]
    },
    {
      group: "Scroll Callout",
      inputs: [
        {
          type: "switch",
          name: "showScrollCallout",
          label: "Show scroll callout",
          defaultValue: true,
        },
        {
          type: "text",
          name: "scrollCallout",
          label: "Scroll callout text",
          defaultValue: "Desliza para iniciar protocolo ↓",
        },
      ],
    },
    {
      group: "Layout",
      inputs: layoutInputs.filter(({ name }) => name !== "gap"),
    },
    {
      group: "Background",
      inputs: backgroundInputs,
    },
  ],
  childTypes: ["hw-row","subheading","heading","paragraph"],
  presets: {
    
    showScrollCallout: true,
    scrollCallout: "Desliza para iniciar protocolo ↓",
    children: [
      {
        type:"subheading"
      },
      {
        type:"heading"
      },
      {
        type:"paragraph"
      },
      {
        type: "hw-row",
        children: [
          { type: "hw-item", label: "Respaldo de silla", quantity: "x1" },
          {
            type: "hw-item",
            label: "Asiento con reposabrazos instalados",
            quantity: "x1",
          },
          {
            type: "hw-item",
            label: "Base de ruedas de aluminio",
            quantity: "x1",
          },
          {
            type: "hw-item",
            label: "Mecanismo de inclinación FROG",
            quantity: "x1",
          },
          { type: "hw-item", label: "Ruedas de PU", quantity: "x5" },
          {
            type: "hw-item",
            label: "Pistón hidráulico Clase 4",
            quantity: "x1",
          },
          {
            type: "hw-item",
            label: "Palancas de ajuste FROG",
            quantity: "x2",
          },
          {
            type: "hw-item",
            label: "Cubiertas laterales magnéticas",
            quantity: "x2",
          },
          { type: "hw-item", label: "Tornillos M8", quantity: "x4" },
          {
            type: "hw-item",
            label: "Cojín cervical magnético",
            quantity: "x1",
          },
        ],
      },
      {
        type: "hw-row",
        isFullWidth: true,
        children: [
          {
            type: "hw-item",
            label:
              "Caja de Accesorios: Mango de destornillador magnético + Llave hexagonal H6 y H4",
            quantity: "SET",
            isFullWidth: true,
          },
        ],
      },
    ],
  },
});