import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";

interface SliderElementsProps extends HydrogenComponentProps{
  typeIcon:"img"|"svg",
  image:WeaverseImage,
  svg:string;
  title:string;
  colorSvg:string;
}

export default function SliderElements(props:SliderElementsProps){
  const{title,children,...rest}=props
  const ref=useRef(null)
  const [active,setActive]=useState(false)
  
useEffect(() => {
  const parent = ref.current?.parentElement
  if (!parent) return

  // Función que evalúa si este slide debe estar activo
  const checkActive = () => {
    const visible = parent.dataset.elementVisible  // nota: ajusta el nombre del atributo
    setActive(visible === title.toLowerCase())
  }

  // Ejecutar al montar
  checkActive()

  // Observar cambios en atributos del padre
  const observer = new MutationObserver(checkActive)
  observer.observe(parent, { attributes: true, attributeFilter: ["data-element-visible"] })

  return () => observer.disconnect()
}, [title])

  return (
    <div {...rest} ref={ref}
      style={{
        opacity:active ? 1:0,
        visibility:active ? "visible":"hidden",
        position:active ? "relative":"absolute",
        pointerEvents:active ? "auto":"none",
        transition:"opacity 0.6s cubic-bezier(0.19,1,0.22,1)",
        width:"100%"
      }}
    >
      {children}      
    </div>
  )
}

export const schema = createSchema({
  type:"slide-elements",
  title:"Slide elements",
  childTypes:["subheading","heading","paragraph","group-elements","image-with-text"],
  settings:[
    {
      group:"Selector",
      inputs:[
        {
          type:'text',
          label:'title',
          name:'title',
          defaultValue:"title"
        },
        {
          type:'select',
          label:'type Icon',
          name:'typeIcon',
          configs:{
            options:[
              {value:'img',label:'imagen'},
              {value:'svg',label:'svg'},
            ]
          },
          defaultValue:"svg",
        },
        {
          type:'image',
          label:'image',
          name:'image',
          condition:(data:SliderElementsProps)=>data.typeIcon =="img"
        },
        {
          type:'textarea',
          label:'svg',
          name:'svg',  
          condition:(data:SliderElementsProps)=>data.typeIcon =="svg"
        },
        {
          type:'color',
          label:'color svg',
          name:'colorSvg',  
          condition:(data:SliderElementsProps)=>data.typeIcon =="svg"
        },
      ]
    }
  ]
  
})