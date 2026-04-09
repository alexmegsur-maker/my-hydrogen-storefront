import { createSchema } from "@weaverse/hydrogen";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Section, sectionSettings, type SectionProps } from "~/components/section";

interface SectionLegalWrapperProps extends SectionProps{
  ref?:React.Ref<HTMLDivElement>;
  showSecBorder:boolean;
  colorSecBorder:string;
  navText:string;
  nBorderColor:string;
  nColor:string;
  nhColor:string;
  nSize:string;
  nLetter:number;
  nAlignment:string;
  nUpper:boolean;
  nFamily:string;
  nPaddingSelect:string;
  nPaddingText:string;
  nMarginSelect:string;
  nMarginText:string;
  nWeight:string;
  }

export default function SectionLegalWrapper(props:SectionLegalWrapperProps){
  const {
    children,
    ref,
    showSecBorder,
    colorSecBorder,
    navText,
    nBorderColor,
    nColor,
    nhColor,
    nSize,
    nLetter,
    nAlignment,
    nUpper,
    nFamily,
    nPaddingSelect,
    nPaddingText,
    nMarginSelect,
    nMarginText,
    nWeight,
    ...rest}=props;
  const identificacion = navText.split(" ").join("-").toLowerCase() ?? null;

  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item ) return;

    // Estado inicial — invisible y desplazado
    gsap.set(item, { opacity: 0, y: 40 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // Timeline secuencial: item entra → dot aparece con rebote
        gsap
          .timeline()
          .to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
          })

        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -15% 0px",
        threshold: 0.1,
      }
    );

    observer.observe(item);
    return () => observer.disconnect();
  }, []);

  return (
  <Section id={identificacion} ref={itemRef} {...rest} 
    style={{
      borderBottom:showSecBorder ? `1px solid ${colorSecBorder}`:"unset"
    }}
  >
    {children}
  </Section>
)
}

export const schema = createSchema({
  type:"section-legal-wrapper",
  title:"Section",
  childTypes:["subheading","heading","paragraph","button"],
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'switch',
          label:'show Bottom Border',
          name:'showSecBorder',
          defaultValue:true,
        },
        {
          type:'color',
          label:'color',
          name:'colorSecBorder',
          defaultValue:'#FFFFFF0d',
        },
      ]
    },

    {
      group:"navItem",
      inputs:[
        {
          type:'text',
          label:'navItem text',
          name:'navText',
          defaultValue:'titulo',
        },
        {
          type:'color',
          label:'border color',
          name:'nBorderColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color',
          name:'nColor',
          defaultValue:'#71717A',
        },
        {
          type:'color',
          label:'color hover',
          name:'nhColor',
          defaultValue:'#ffffff',
        },
        {
          type:'text',
          label:'font size',
          name:'nSize',
          defaultValue:'0.85rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'nLetter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type: "select",
          label: "text alignment",
          name: "nAlignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
              { value: "justify", label: "Justify" },
            ],
          },
          defaultValue: "left",
        },
        {
          type:'switch',
          label:'uppercase',
          name:'nUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'nFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'nPaddingSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'l',
        },
        {
          type:'text',
          label:'Padding text',
          name:'nPaddingText',
          defaultValue:"1rem"
        },
        {
          type:'select',
          label:'Margin type',
          name:'nMarginSelect',
          configs:{
            options:[
              {value:'t',label:'Top'},
              {value:'b',label:'Bottom'},
              {value:'l',label:'Left'},
              {value:'r',label:'Right'},
              {value:'x',label:'Inline'},
              {value:'y',label:'Block'},
              {value:'a',label:'Custom'},
            ]
          },
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'nMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'nWeight',
          configs:{
            options:[
              {value:'100',label:'100'},
              {value:'200',label:'200'},
              {value:'300',label:'300'},
              {value:'400',label:'400'},
              {value:'500',label:'500'},
              {value:'600',label:'600'},
              {value:'700',label:'700'},
              {value:'800',label:'800'},
              {value:'900',label:'900'},
            ]
          },
          defaultValue:'300',
        },   
      
      ]
    },
    ...sectionSettings
  ]
})