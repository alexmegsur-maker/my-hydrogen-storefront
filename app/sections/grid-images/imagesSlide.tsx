import { createSchema, IMAGES_PLACEHOLDERS, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen"
import { useEffect, useState } from "react";
import { Image } from "~/components/image";

interface imagesSlideProps extends HydrogenComponentProps {
  reverse:boolean;
  img1Desk:WeaverseImage;
  img1Mobile:WeaverseImage;
  img2Desk:WeaverseImage;
  img2Mobile:WeaverseImage;
  aspectContainer:string;
  radius1:number;
  radius2:number;
}

function imagesSlide(props:imagesSlideProps){
  const {reverse,img1Desk,img1Mobile,img2Desk,img2Mobile,aspectContainer,radius1,radius2} = props
  const [isMobile,setIsMobile]=useState(false)

  useEffect(()=>{
    if(window.innerWidth<700){
      setIsMobile(true)
    }
  },[])

  return(
    <div 
      className="flex items-end gap-4 lg:gap-8 flex-1 px-4 lg:px-0"
      style={{
        flexDirection:isMobile ? reverse ? "row-reverse":"row" : reverse ? "column-reverse":"column",
        aspectRatio:!isMobile && aspectContainer
      }}
      >
      <div className="w-[50%] lg:w-full lg:h-[55%]">
        <Image
          loading="lazy" 
          src={img1Desk.url} 
          className="hidden lg:block w-full h-full object-cover"
          alt={img1Desk.altText}
          width={img1Desk.width}
          height={img1Desk.height}
          style={{
            borderRadius:radius1
          }} 
          />         
        <Image 
          loading="lazy" 
          src={img1Mobile.url} 
          className="block lg:hidden w-full h-full object-cover" 
          alt={img1Mobile.altText}
          width={img1Mobile.width}
          height={img1Mobile.height}
          style={{
            borderRadius:radius1
          }} 
          />
      </div>
      <div className="w-[50%] lg:w-[70%] flex-1">
        <Image
          loading="lazy" 
          src={img2Desk.url} 
          className="hidden lg:block w-full lg:h-full object-cover"
          alt={img2Desk.altText}
          width={img2Desk.width}
          height={img2Desk.height}
          style={{
            borderRadius:radius2
          }} 
          />
        <Image
          loading="lazy" 
          src={img2Mobile.url} 
          className="block lg:hidden w-full object-cover" 
          alt={img2Mobile.altText}
          width={img2Mobile.width}
          height={img2Mobile.height}
          style={{
            borderRadius:radius2
          }} 
          />
      </div>
    </div>
  )
}
export default imagesSlide

export const schema =createSchema({
  type:"slideImages",
  title:"Slide",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'switch',
          label:'reverse',
          name:'reverse',
          defaultValue:true,
        },
        {
          type:'text',
          label:'aspect ratio container',
          name:'aspectContainer',
          defaultValue:'1/2',
        },
      ]
    },
    {
      group:"first Image",
      inputs:[
        {
          type:'image',
          label:'desktop image',
          name:'img1Desk',
          defaultValue:{
            url:IMAGES_PLACEHOLDERS.product_1,
            altText:'Alt text',
            width:689,
            height:1034,
          }
        },
        {
          type:'image',
          label:'mobile image',
          name:'img1Mobile',
          defaultValue:{
            url:IMAGES_PLACEHOLDERS.product_1,
            altText:'Alt text',
            width:689,
            height:1034,
          }
        },
        {
          type:'range',
          label:'border radius',
          name:'radius1',
          defaultValue:10,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        

      ]
    },
    {
      group:"second Image",
      inputs:[
        {
          type:'image',
          label:'desktop image',
          name:'img2Desk',          
          defaultValue:{
            url:IMAGES_PLACEHOLDERS.product_2,
            altText:'Alt text',
            width:689,
            height:1034,
          }
        },
        {
          type:'image',
          label:'mobile image',
          name:'img2Mobile',
          defaultValue:{
            url:IMAGES_PLACEHOLDERS.product_2,
            altText:'Alt text',
            width:689,
            height:1034,
          }
        },
        {
          type:'range',
          label:'border radius',
          name:'radius2',
          defaultValue:10,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
      ]
    }
  ],
})