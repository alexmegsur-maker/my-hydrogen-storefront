import { createSchema } from "@weaverse/hydrogen"
import type{HydrogenComponentProps} from "@weaverse/hydrogen"
import { useEffect } from "react";
import { Section } from "~/components/section";
interface HeaderEditProps extends HydrogenComponentProps{
  announcement:string;
  footerText:string;
  copyright:string;
}

function HeaderEdit(props:HeaderEditProps){
  const {
    children,
    announcement,
    footerText,
    copyright,
    ...rest

  }=props;

  useEffect(()=>{
    const getAnnouncement= document.getElementById("announcement-text") 
    const getFooter= document.getElementById("footer-bio")
    const getCopyright= document.getElementById("copyright-text")
    if(getAnnouncement && announcement){
      setTimeout(()=>{
        getAnnouncement.innerHTML= announcement
      },500)
    } 
    if(getFooter && footerText){
      setTimeout(()=>{
        getFooter.innerHTML= footerText
      },500)
    } 
    if(getCopyright && copyright){
      setTimeout(()=>{
        getCopyright.innerHTML= copyright
      },500)
    } 
 
  },[announcement,footerText,copyright])

  return (
    <Section {...rest}>
    {children}
    </Section>
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
        {
          type:'richtext',
          label:'announcement',
          name:'announcement',
        },
        {
          type:'richtext',
          label:'footer Text',
          name:'footerText',
        },
        {
          type:'richtext',
          label:'copyright',
          name:'copyright',
        },
      ]
    }
  ],childTypes:['text-left','general','banner','image-link','text-top','product-top','register_color']
}) 