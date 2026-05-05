import { createSchema, useChildInstances, type HydrogenComponentProps } from "@weaverse/hydrogen";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import LegalWrapperNavItem from "~/components/legal-wrapper-nav-item";
import { Section, sectionSettings, type SectionProps } from "~/components/section";
import { selectorPaddingMargin } from "~/utils/general";

interface LegalWrapperProps extends SectionProps{
  ref?:React.Ref<HTMLElement>;
  showTopBar:boolean;
  topBarColor:string;
  gapContent:number;
}


export default function LegalWrapper(props:LegalWrapperProps & HydrogenComponentProps){
  const {children = [],showTopBar,topBarColor,gapContent, ref,...rest}=props

  const childInstances=useChildInstances()
  const [activeId,setActiveId]=useState("")
  useEffect(() => {
  if (!childInstances.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      // Toma la entrada más visible
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      
      if (visible) setActiveId(visible.target.id)
    },
    { threshold: 0.3, rootMargin: "0px 0px -50% 0px" }
  )

  childInstances.forEach((instance: any) => {
    const id = instance.data.navText.trim().split(" ").join("-").toLowerCase()
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  return () => observer.disconnect() // 👈 un solo disconnect limpia todo

}, [childInstances])
 const lineRef = useRef<HTMLDivElement>(null);
 const asideRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!lineRef.current ) return;

    // La línea crece desde 0% hasta 100% de altura al cargar
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 1.8, ease: "power4.out", delay: 0.5 }
    );
    gsap.fromTo(
      asideRef.current,
      { scale: 0, transformOrigin: "left center" },
      { scale: 1, duration: 1.8, ease: "power4.out", delay: 0.5 }
    );

  }, []);

  return(
    <Section 
      ref={ref} 
      {...rest} 
      overflow="unset"
      containerClassName="flex relative items-start"
      style={{
        borderTop:showTopBar ?`1px solid ${topBarColor}`:"unset",
        transition:"all 0.5s ease"
      }}
      containerStyle={{
        gap:`${gapContent}rem`,
      }}
    >
      <aside className="w-[350px] sticky top-[100px] self-start hidden lg:flex">
        <nav ref={asideRef} className="  flex flex-col gap-[1rem]">
          {childInstances.map((instance:any,idx)=>{
            const targetId = instance.data.navText.trim().split(" ").join("-").toLowerCase()
            return (
              <LegalWrapperNavItem 
                key={idx}
                data={instance.data}
                active ={activeId === targetId}
                />
              
            )
          })}

        </nav>
      </aside>
      <main style={{flexGrow:1}} className="w-[0] md:w-auto" ref={lineRef}>
        {children}
      </main>
    </Section>
  )
}
export const schema = createSchema({
  type:"legal-wrapper",
  title:"Legal Wrapper",
  childTypes:["section-legal-wrapper"],
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'switch',
          label:'show top bar',
          name:'showTopBar',
          defaultValue:true,
        },
        {
          type:'color',
          label:'color border',
          name:'topBarColor',
          defaultValue:'#ffffff0d',
        },
        {
          type:'range',
          label:'gap content',
          name:'gapContent',
          defaultValue:3,
          configs:{
            min:0,
            max:10,
            step:0.1,
            unit:'rem',
          }
        },
      ]
    },
    ...sectionSettings
  ]
})