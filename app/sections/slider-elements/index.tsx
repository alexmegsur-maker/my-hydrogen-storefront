import { createSchema, useChildInstances, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useState, type CSSProperties } from "react";
import { Image } from "~/components/image";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { useScrollAnimation } from "~/hooks/use-scroll-animation";
import { selectorPaddingMargin } from "~/utils/general";

interface SliderElementsProps extends HydrogenComponentProps{
  gap:number;
  contPaddingSelect:string;
  contPaddingText:string;
  bgColorCont:string;
  borderContcolor:string;
  showBorderT:boolean;
  showBorderB:boolean;
  radius:number;
  iconContSize:number;
  iconSize:number;
  bgColor:string;
  bgSelColor:string;
  borderColor:string;
  borderSelColor:string;
  boxShadow:string;
  color:string;
  colorSel:string;
  mobileSize:string;
  desktopSize:string;
  weight:string;
  letterSpacing:number;
  lineH:number;
  alignment:"left"|"center"|"right";
  activeShadow:boolean;
  textShadow:string;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  family:string;
}

export default function SliderElements(props:SliderElementsProps){
  const {
    gap,
    contPaddingSelect,
    contPaddingText,
    bgColorCont,
    borderContcolor,
    showBorderT,
    showBorderB,
    radius,
    iconContSize,
    iconSize,
    bgColor,
    bgSelColor,
    borderColor,
    borderSelColor,
    boxShadow,
    color,
    colorSel,
    mobileSize,
    desktopSize,
    weight,
    letterSpacing,
    lineH,
    alignment,
    activeShadow,
    textShadow,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    family,
    children,
    ...rest
  }=props
  const [selected,setSelected]= useState("")
  const isMobile= useIsMobile(600)

  const childInstances =useChildInstances()
  

  useEffect(() => {
    if (childInstances.length > 0) {
      setSelected(childInstances[0].data.title.toLowerCase())
    }
  }, []) 
  
  return(
    <div {...rest} className="flex flex-col">
      <section 
        className="selector-wrapper justify-center items-start"
        style={{
          gap:`${gap}rem`,
          backgroundColor:bgColorCont,
          borderTop:showBorderT ?`1px solid ${borderContcolor}`:"unset",
          borderBottom:showBorderB ?`1px solid ${borderContcolor}`:"unset",
          ...selectorPaddingMargin("padding",contPaddingSelect,contPaddingText),
          display:isMobile?"grid":"flex",
          gridTemplateColumns:isMobile?"repeat(3,1fr)":"unset"

        }}
      >
        {childInstances.map((instance:any,idx)=>{
          const active = instance.data.title.toLowerCase() === selected 
          
          return(
            <div 
              key={idx}
              className="selector-item  flex flex-col items-center cursor-pointer"
              style={{
                opacity:active ? 1:0.5,
                transition:"all 0.3s ease"
              }}
              onClick={()=>setSelected(instance.data.title.toLowerCase())}
            >
              <div 
                className="circle-icon flex items-center justify-center overflow-hidden"
                style={{
                  transition:"all 0.4s cubic(0.19,1, 0.22,1)",
                  width:`${iconContSize}rem`,
                  height:`${iconContSize}rem`,
                  border:`1px solid ${borderColor}`,
                  borderRadius:`${radius}px`,
                  background:active ? bgSelColor:bgColor,
                  boxShadow:active ? boxShadow : "unset"
                }}
              >
                {instance.data.typeIcon =="img" &&
                  <Image  
                  data={instance.data.image} 
                  containerStyle={{
                    width:`${iconSize}rem`,
                    height:`${iconSize}rem`,
                  }as CSSProperties}
                  aspectRatio="1/1"
                  sizes="auto"
                  
                  />
                }
                {instance.data.typeIcon =="svg" &&
                  <span 
                   dangerouslySetInnerHTML={{__html:instance.data.svg}}
                   style={{
                    width:`${iconSize}rem`,
                    height:`${iconSize}rem`,
                    color:instance.data.colorSvg
                   }}
                   ></span>
                }
              </div>
              <span 
                className="selector-label"
                style={{
                  color:active ? colorSel:color,
                  fontSize:isMobile ? mobileSize:desktopSize,
                  letterSpacing:letterSpacing>0 ? `${letterSpacing}px`:"normal",
                  lineHeight:lineH>0 ? lineH:"unset",
                  fontWeight:weight,
                  textAlign:alignment,
                  fontFamily:family,
                  textShadow:activeShadow ? textShadow:"unset",
                  justifyContent: alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
                  ...selectorPaddingMargin("padding",paddingSelect,paddingText),
                  ...selectorPaddingMargin("margin",marginSelect,marginText),
                }}
              >
                {instance.data.title}
              </span>
            </div>
          ) 

        })}
        
      </section>
      <section 
        className="relative w-full min-h-[800px]" 
        data-element-visible={selected}
        style={{
          transition:"all 2s cubic-bezier(0.19,1,0.22,1)",
          transitionDelay:"2s"
        }}
        >
        {children}
      </section>
    </div>
  )
}

export const schema = createSchema({
  type:"slider-elements",
  title:"Slider elements",
  childTypes:["slide-elements"],
  settings:[
    {
      group:"general",
      inputs:[
        {
          type:'range',
          label:'gap',
          name:'gap',
          defaultValue:1,
          configs:{
            min:0,
            max:7,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type:'select',
          label:'Padding type',
          name:'contPaddingSelect',
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
          label:'Padding text',
          name:'contPaddingText',
          defaultValue:'3rem 2rem'
        },
        {
          type:'color',
          label:'background color',
          name:'bgColorCont',
          defaultValue:'#050505',
        },
        {
          type:'color',
          label:'border color',
          name:'borderContcolor',
          defaultValue:'#FFFFFF0d',
        },
        {
          type:'switch',
          label:'show border top',
          name:'showBorderT',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show border bottom',
          name:'showBorderB',
          defaultValue:true,
        },
      ]
    },
    {
      group:"selector",
      inputs:[
        {
          type:'range',
          label:'border radius',
          name:'radius',
          defaultValue:100,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'px',
          }
        },
        {
          type:'range',
          label:'icon container size',
          name:'iconContSize',
          defaultValue:4,
          configs:{
            min:1,
            max:10,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type:'range',
          label:'icon size',
          name:'iconSize',
          defaultValue:3,
          configs:{
            min:1,
            max:10,
            step:0.1,
            unit:'rem',
          }
        },
        {
          type:'color',
          label:'background color',
          name:'bgColor',
          defaultValue:'#FFFFFF02',
        },
        {
          type:'color',
          label:'background color (selected)',
          name:'bgSelColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'border color',
          name:'borderColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'border color (selected)',
          name:'borderSelColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'box shadow(selected)',
          name:'boxShadow',
          defaultValue:'0 0 20px #ffffff80',
        },
        
        {
          type:'heading',
          label:'text'
        },
        {
          type: "color",
          name: "color",
          label: "Text color",
        },
        {
          type: "color",
          name: "colorSel",
          label: "Text color (selected)",
        },
        
        {
          type: "text",
          name: "mobileSize",
          label: "Mobile text size",
          defaultValue: "1.1rem",
        },
        {
          type: "text",
          name: "desktopSize",
          label: "Desktop text size",
          defaultValue: "1.1rem",
        },
        {
          type: "select",
          name: "weight",
          label: "Weight",
          configs: {
            options: [
              { value: "100", label: "100 - Thin" },
              { value: "200", label: "200 - Extra Light" },
              { value: "300", label: "300 - Light" },
              { value: "400", label: "400 - Normal" },
              { value: "500", label: "500 - Medium" },
              { value: "600", label: "600 - Semi Bold" },
              { value: "700", label: "700 - Bold" },
              { value: "800", label: "800 - Extra Bold" },
              { value: "900", label: "900 - Black" },
            ],
          },
          defaultValue: "400",
        },
        {
          type:'range',
          label:'Letter spacing',
          name:'letterSpacing',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'range',
          label:'line heading',
          name:'lineH',
          defaultValue:1.1,
          configs:{
            min:0,
            max:5,
            step:0.1,
            unit:'u',
          }
        },
        {
          type: "toggle-group",
          name: "alignment",
          label: "Alignment",
          configs: {
            options: [
              { value: "left", label: "Left", icon: "align-start-vertical" },
              {
                value: "center",
                label: "Center",
                icon: "align-center-vertical",
              },
              { value: "right", label: "Right", icon: "align-end-vertical" },
            ],
          },
          defaultValue: "center",
        },
        {
          type:'switch',
          label:'active text shadow',
          name:'activeShadow',
          defaultValue:false,
        },
        {
          type:'text',
          label:'text shadow',
          name:'textShadow',
          defaultValue:'0 0 20px #00d2ffcc',
          condition:(data)=>data.activeShadow ===true
        },
      
        {
          type:'select',
          label:'Padding type',
          name:'paddingSelect',
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
          label:'Padding text',
          name:'paddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'marginSelect',
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
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Margin text',
          name:'marginText',
          defaultValue:"0.8rem"
        },
        {
          type:'text',
          label:'Font family',
          name:'family',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'animation',
          name:'animacion',
          configs:{
            options:[
              {value:'none',label:'None'},
              {value:'typer',label:'typer'},
              {value:'fade',label:'fade'},
              {value:'neonPulse',label:'neon pulse'},
              {value:'spaceNeonPulse',label:'space neon pulse'},
            ]
          },
          defaultValue:"fade",
        },
      ]
    }
  ]
})