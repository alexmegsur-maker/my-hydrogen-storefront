import { createSchema } from "@weaverse/hydrogen"

function VideoSliderV2(){

  return(
    <></>
  )
}

export default VideoSliderV2

export const schema= createSchema({
  type:"videoSliderV2",
  title:"Silder video/imagen",
  settings:[ 
    {
      group:"General",
      inputs:[
        {
          type:'switch',
          label:'show Arrows',
          name:'showArrows',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show bar',
          name:'showBar',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show lateral slide',
          name:'',
          defaultValue:true,
        },
      ]
    }
  ]
})