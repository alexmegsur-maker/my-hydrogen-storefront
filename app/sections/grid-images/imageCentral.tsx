import { createSchema, IMAGES_PLACEHOLDERS, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen"
import { useEffect, useState } from "react";

interface imageCentralProps extends HydrogenComponentProps {
  desktop:WeaverseImage;
  mobile:WeaverseImage;
  radius:number;
  aspectContainer:string;
  aspect:string;
}

function ImageCentral(props:imageCentralProps){
  const {desktop,mobile,radius,aspectContainer,aspect}=props
  const [image,setImage]=useState(desktop)
  const [isMobile,setIsMobile] = useState(false)
  useEffect(()=>{
    if(window.innerWidth<700){
      setImage(mobile)
      setIsMobile(true)
    }
  },[])

  return (
    <div 
      className="w-full lg:w-[55%] lg:aspect-[2/1]"
      style={{
        aspectRatio:!isMobile && aspectContainer
      }}
      >
      <img 
        loading="lazy" 
        src={image.url} 
        className="w-full h-full object-cover"
        alt="Secretlab Community Setup 3"
        width={image.width}
        height={image.height}
        style={{
          aspectRatio:aspect,
          borderRadius:!isMobile && radius
        }} 
        />
    </div>
  )
}

export default ImageCentral

export const schema =createSchema({
  type:"central",
  title:"central",
  limit:1,
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'image',
          label:'desktop',
          name:'desktop',
          defaultValue:{
            url:IMAGES_PLACEHOLDERS.banner_2,
            altText:'Alt text',
            width:689,
            height:1034,
          }
        },
        {
          type:'image',
          label:'mobile',
          name:'mobile',
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
          name:'radius',
          defaultValue:10,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'aspect ratio container',
          name:'aspectContainer',
          defaultValue:'2/1',
        },
        {
          type:'text',
          label:'aspect ratio img',
          name:'aspect',
          defaultValue:'3/2',
        },
      ]
    }
  ]
})