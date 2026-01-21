import { Pagination, type Storefront } from "@shopify/hydrogen";
import {createSchema, type HydrogenComponentProps, type WeaverseCollection} from "@weaverse/hydrogen"
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { type ComponentLoaderArgs } from "@weaverse/hydrogen";
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SectionProps } from "~/components/section";
import { Navigation } from "swiper/modules";
import './collection-slider.css'
import LinkCollection from "./linkCollection";
import SliderCard from "./sliderCard";

interface MyCollectionSliderLoaderData{
  collectionsData:any[]
}

interface CollectionSliderProps extends SectionProps<MyCollectionSliderLoaderData>{
  
  titulo:string;
  collections:WeaverseCollection[];
  spaceS:number;
  spaceC:number;
  numSelectorSlider:number;
  numCardSlider:number;
  tSize:string;
  tColor:string;
  tAlign:"left"|"center"|"right"|"justify";
  tWeight:number;
  tFamily:string;
  sSize:string;
  sColor:string;
  sActiveColor:string;
  sActiveBgColor:string;
  sFamily:string;
  sUppercase:boolean;
  sWeight:number;
  aColor:string;
  aBgColor:string;
  aDisabledColor:string;
  cColor:string;
  cRadius:number;
  cTagSize:string;
  cTagColor:string;
  cTagBgColor:string;
  cTagBRadius:number;
  cTagUppercase:boolean;
  cTagWeight:number;
  cTSize:string;
  cTColor:string;
  cTWeight:number;
  cTFamily:string;
  cDSize:string;
  cDColor:string;
  cDWeight:number;
  cDFamily:string;
  cBSize:string;
  cBColor:string;
  cBBgColor:string;
  cBBradius:number;
  cBUppercase:boolean;
  cBWeight:number;
  pageText:string;
  pageColor:string;
  pageSize:string;
  pageFont:string;
  show:boolean,
  collectionColor:string;
  collectionColorHover:string;
  collectionSize:string;
  collectionFont:string;
}

const GET_COLLECTIONS_BY_ID_QUERY=`
  query getCollectionsWithProductsById(
    $ids:[ID!]!
    $productsFirst:Int=8
    $name:String!
    $keycol:String!
    $namespace:String!

  ){
    nodes(ids:$ids){
      ... on Collection{
        id
        title
        onlineStoreUrl
        metafield(namespace:$name, key:$keycol){
          id
          key
          namespace
          type
          value
        }
        products(first:$productsFirst){
          edges{
            node{
              id
              title
              handle
              availableForSale
              onlineStoreUrl
              tags
              featuredImage{
                url
                altText
              }
              variants(first:1){
                edges{
                  node{
                    id
                  }
                }
              }
              metafields(identifiers:[{namespace:$namespace,key:"subdescription"},{namespace:$namespace,key:"pagina"},{namespace:$namespace,key:"etiquetas"}]){
                id
                key
                namespace
                type
                value
              }
            }
          }
        }
      }
    }
  }
`

export async function loader({weaverse,data}:ComponentLoaderArgs<CollectionSliderProps>){
  const {storefront} = weaverse
  const collectionIds : Array<string>=[]
  
  const {collections }= data 
  
  if(collections==undefined) return {collectionsData:[]}

  collections.forEach((elm)=>{
    let complete = `gid://shopify/Collection/${elm.id}`
    collectionIds.push(complete)
  })
  const datos = await storefront.query(GET_COLLECTIONS_BY_ID_QUERY,{
    variables:{
      ids:collectionIds,
      productsFirst:8,
      name:"custom",
      keycol:"preposition",
      namespace:"custom",
    }
  })
  
  const collectionsData = datos.nodes?.filter((node:any)=>node != null ) ?? [];
  return {collectionsData}
}

function CollectionSlider(props:CollectionSliderProps) {
  
  const {
    loaderData,
    titulo,
    spaceS,
    spaceC,
    numSelectorSlider,
    numCardSlider,
    tSize,
    tColor,
    tAlign,
    tWeight,
    tFamily,
    sSize,
    sColor,
    sActiveColor,
    sActiveBgColor,
    sFamily,
    sUppercase,
    sWeight,
    aColor,
    aBgColor,
    aDisabledColor,
    cColor,
    cRadius,
    cTagSize,
    cTagColor,
    cTagBgColor,
    cTagBRadius,
    cTagUppercase,
    cTagWeight,
    cTSize,
    cTColor,
    cTWeight,
    cTFamily,
    cDSize,
    cDColor,
    cDWeight,
    cDFamily,
    cBSize,
    cBColor,
    cBBgColor,
    cBBradius,
    cBUppercase,
    cBWeight,
    pageText,
    pageColor,
    pageSize,
    pageFont,
    show,
    collectionColor,
    collectionColorHover,
    collectionSize,
    collectionFont,
  }=props 

  const [swiperRef,setSwiperRef]=useState(null)
  const [visibleSlides,setVisibleSlides]=useState(numCardSlider)
  const [visibleTitles,setVisibleTitles]=useState(3)
  const [actualTitle,setActualTitle]=useState(null)
  const [tSlides,setTSlides ] = useState(null)
  const [currentCollection,setCurrentCollection] = useState(null)
  const [slideIndex,setSlideIndex]=useState(0)
  const [headTitleContainer,setHeadTitleContainer]=useState(0)
  const [isMobile,setIsMobile]=useState(false)

  const collections = loaderData?.collectionsData || []  

  useEffect(()=>{
    if(actualTitle!=null){
      setTSlides(actualTitle.slides)
      setCurrentCollection(actualTitle.slides[0].dataset.collection)
    }
  },[actualTitle])

  useEffect(()=>{
    if(collections.length >= numSelectorSlider){
      setVisibleTitles(numSelectorSlider)
    }

    if(window.innerWidth < 1280){
      setVisibleSlides(3)
    }

    if(window.innerWidth < 700){
      setIsMobile(true)
      setVisibleSlides(1)
    }

    console.log("collection",collections)

  },[])
  
  useEffect(()=>{
    if(swiperRef){
      setHeadTitleContainer(swiperRef.el.getBoundingClientRect().width)
    }
  },[swiperRef])

  const nextSlide =()=>{
    swiperRef.slideNext();
  }

  const prevSlide =()=>{
    swiperRef.slidePrev();
  }
  const changeTitle=(list,elm)=>{
    list.forEach((b)=>{
        
      let elmSlider = b.querySelector(".tituloCollection")

      if(elmSlider.classList.contains("activeCollection")){
        elmSlider.classList.remove("activeCollection")
      }  

      if(b.dataset.collection == elm.dataset.collection){
        if(!elmSlider.classList.contains("activeCollection")){
          elmSlider.classList.add("activeCollection")
          setCurrentCollection(elm.dataset.collection)
        }  
      }
      if( elm.dataset.end == "final" && elm.dataset.collection == b.dataset.collection){
        if(!elmSlider.classList.contains("activeCollection")){
          elmSlider.classList.add("activeCollection")
          setCurrentCollection(elm.dataset.collection)
        }
      }
    })
  }

  const slideToCollection = (title:string) =>{
    
    swiperRef.slides.forEach((elm:any,index:number)=>{
      if(elm.dataset.collection == title && elm.dataset.index == 0){
        swiperRef.slideTo(index)
      }
    })
  }

  const checkTitle=(element:any,index:number)=>{
    const elm = element.slides[index]
    if(elm.dataset.index == 0 ){
      changeTitle(tSlides,elm)
    }

    if(elm.dataset.end == "final"){
      changeTitle(tSlides,elm)
    }
  }

  
  
  return (
    <div className="py-16 lg:py-20">
      <h3 
        className="container mx-auto text-center lg:text-start"
        style={{
          width:headTitleContainer!=0 ? headTitleContainer:"auto",
          fontSize:isMobile?"42px":tSize,
          color:tColor,
          textAlign:isMobile ? "center":tAlign,
          fontWeight:tWeight,
          fontFamily:tFamily
        }}
      >
        {titulo}
      </h3>

      <div className="mx-auto flex gap-4 container px-0 md:px-4 xl:px-6 justify-between items-center mt-8 lg:mt-12 overflow-hidden">
        <div className="max-w-[100%]">
          <Swiper 
            onSwiper={setActualTitle}            
            style={{ height: "33px" }}
            effect="slide"
            className="mySwiperCollectionName relative ml-10 lg:ml-0"
            autoHeight
            slidesPerView={isMobile ? "auto":visibleTitles} //aqui no debes olvidar cambiarlo con un range de weaverse
            >
            {collections.map((elm,index)=>{
              let activeSlide = useRef(null)
              let active = false
              if(activeSlide.current){
                active = activeSlide.current.classList.contains("activeCollection")
              }
              return(
                <SwiperSlide
                  key={elm.id}
                  data-collection={elm.title}
                  className="!w-auto"
                  style={{ width:"auto" }}
                >
                  <div 
                    ref={activeSlide}
                    onClick={()=>{slideToCollection(elm.title)}}
                    className={`tituloCollection w-auto caption-lg rounded-lg px-2 py-1 cursor-pointer text-bold  transition-all duration-500 ${index == 0 && "activeCollection"}`}
                    style={{
                      marginRight:isMobile?"32px":`${spaceS}px`,
                      fontSize:isMobile? "16px": sSize,
                      color:active ? sActiveColor:sColor,
                      backgroundColor:active ? sActiveBgColor:"transparent",
                      fontFamily:sFamily,
                      textTransform:sUppercase && "uppercase",
                      fontWeight:sWeight,

                    }as CSSProperties } 
                  >
                    {elm.title}
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        <div className="hidden lg:flex items-center flex gap-2">
          <button
            aria-label="previous-products"
            data-context="products-arrow"
            disabled={slideIndex == 0 &&  true}
            className="group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  p-3 border-solid border-[1px] "
            onClick={prevSlide}
            style={{
              color:slideIndex == 0 ? aDisabledColor:aColor,
              background:slideIndex == 0 ? "transparent":aBgColor,
            }}
          >
            <div
              className="border-rounded-full flex items-center justify-content colour-icons-on-light group-hover:colour-icons-on-light group-disabled:colour-icons-grey pointer-events-none w-[24px] h-[24px]">
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.5303 2.46967C10.2374 2.17678 9.76256 2.17678 9.46967 2.46967L3.93934 8L9.46967 13.5303C9.76256 13.8232 10.2374 13.8232 10.5303 13.5303C10.8232 13.2374 10.8232 12.7626 10.5303 12.4697L6.06066 8L10.5303 3.53033C10.8232 3.23744 10.8232 2.76256 10.5303 2.46967Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button>

          <button
            aria-label="next-products"
            data-context="products-arrow"
            disabled={slideIndex == 1 && true}
            className="group box-border flex gap-2 items-center justify-center w-fit rounded-full cursor-pointer  p-3 border-solid border-[1px]"
            onClick={nextSlide}
            style={{
              color:slideIndex == 1 ? aDisabledColor:aColor,
              background:slideIndex == 1 ? "transparent":aBgColor,
            }}
          >
            <div className="border-rounded-full flex items-center justify-content colour-icons-on-colour pointer-events-none w-[24px] h-[24px]">
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-4 lg:mt-8">
        <div className="overflow-hidden">
          <div className="container mx-auto overflow-visible">
            <Swiper 
              onSwiper={setSwiperRef}
              slidesPerView={isMobile ? "auto":visibleSlides}
              onSlideChange={(s)=>{
                setSlideIndex(s.progress)
                checkTitle(s,s.realIndex)
              }}
              spaceBetween={16}
              className="relative overflow-visible products-swiper items-stretch w-full h-full ml-10 lg:ml-0"
              style={{
                  height: isMobile ? "480px":"532px",
                }}
              >
              {collections.map((col)=>{
                return (
                  col.products.edges.map((edge,index)=>{
                    const product = edge.node;
                    return(
                      <SwiperSlide
                        key={product.id}
                        className="!w-auto pb-[2px]"
                        data-collection={col.title}
                        data-index={index}
                        data-end={col.products.edges.length-1 == index ? "final" : "none"}
                        style={{
                          width:"300px"
                        }}
                      >
                        
                        <SliderCard  
                          isMobile={isMobile} 
                          space={spaceC} 
                          tag={product?.metafields[2]?.value} 
                          tagSize={cTagSize} 
                          tagColor={cTagColor} 
                          tagBgColor={cTagBgColor}
                          tagUppercase={cTagUppercase}
                          tagRadius={cTagBRadius}
                          tagWeight={cTagWeight}
                          url={product?.onlineStoreUrl}
                          imagen={product.featuredImage?.url}
                          title={product.title}
                          tSize={cTSize}
                          tColor={cTColor}
                          tWeight={cTWeight}
                          tFamily={cTFamily}
                          description={product?.metafields[0]?.value}
                          dSize={cDSize}
                          dColor={cDColor}
                          dWeight={cDWeight}
                          dFamily={cDFamily}
                          bSize={cBSize}
                          bColor={cBColor}
                          bBgColor={cBBgColor}
                          bRadius={cBBradius}
                          bUppercase={cBUppercase}
                          bWeight={cBWeight}
                          page={product?.metafields[1]?.value}
                          pText={pageText}
                          pColor={pageColor}
                          pSize={pageSize}
                          pFamily={pageFont}
                          variantId={product?.variants.edges[0].node.id}
                          cColor={cColor}
                          cRadius={cRadius}
                          />
                      </SwiperSlide>
                    )
                  })
                )
              })}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="mt-4 lg:mt-8 relative">
        {show &&
          collections.map((elm)=>{
            let opacity = currentCollection == elm.title
            return (
              <LinkCollection  
                isMobile={isMobile}
                key={elm.id} 
                url={elm.onlineStoreUrl} 
                preposition={elm.metafield?.value} 
                title={elm.title} 
                active={opacity} 
                color={collectionColor}
                hoverColor={collectionColorHover}
                fontSize={collectionSize}
                fontFamily={collectionFont}
                />
            )
          })
        
        }
      </div>
    </div> 
  );
}
export default CollectionSlider;

export const schema = createSchema({
  type:"colections-slider",
  title:"Collections Slider",
  settings:[
    {
      group:"Info", 
      inputs:[
        {
          type:'text',
          label:'titulo',
          name:'titulo',
          defaultValue:'Añade tu titulo a los slider',
        },
        {
          type:'collection-list',
          label:'collections',
          name:'collections',
        },
        {
          type:'range',
          label:'space between selector',
          name:'spaceS',
          defaultValue:10,
          configs:{
            min:5,
            max:100,
            step:1,
            unit:'px',
          }
        },
        {
          type:'range',
          label:'space between cards',
          name:'spaceC',
          defaultValue:10,
          configs:{
            min:5,
            max:100,
            step:1,
            unit:'px',
          }
        },
        {
          type:'range',
          label:'num slides Selector',
          name:'numSelectorSlider',
          defaultValue:3,
          configs:{
            min:1,
            max:10,
            step:1,
            unit:'slider',
          }
        },
        {
          type:'range',
          label:'num slides card',
          name:'numCardSlider',
          defaultValue:4,
          configs:{
            min:1,
            max:10,
            step:1,
            unit:'slider',
          }
        },
      ]
    },
    {
      group:"title",
      inputs:[
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'42px',
          placeholder:'12px',
        },
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#000',
        },
        {
          type:'select',
          label:'text align',
          name:'tAlign',
          configs:{
            options:[
              {value:'left',label:'left'},
              {value:'center',label:'center'},
              {value:'right',label:'right'},
              {value:'justify',label:'justify'},
            ]
          },
          defaultValue:'left',
        },
        {
          type:'range',
          label:'font weight',
          name:'tWeight',
          defaultValue:500,
          configs:{
            min:100,
            max:900,
            step:100,
            unit:'weight',
          }
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Monserrat',
        },

      ]
    },
    {
      group:"Selector collection",
      inputs:[
        {
          type:'text',
          label:'font size',
          name:'sSize',
          defaultValue:'16px',
          placeholder:'12px',
        },
        {
          type:'color',
          label:'color',
          name:'sColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'active color',
          name:'sActiveColor',
          defaultValue:'#fff',
        },
        {
          type:'color',
          label:'active background color',
          name:'sActiveBgColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font family',
          name:'sFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'switch',
          label:'uppercase',
          name:'sUppercase',
          defaultValue:true,
        },
        {
          type:'range',
          label:'font weight',
          name:'sWeight',
          defaultValue:500,
          configs:{
            min:100,
            max:900,
            step:100,
            unit:'weight',
          }
        },
        {
          type:'color',
          label:'arrow color',
          name:'aColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'arrow background color',
          name:'aBgColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'disabled arrow color',
          name:'aDisabledColor',
          defaultValue:'#4F4F4F',
        },

      ]
    },
    {
      group:"Card product",
      inputs:[
        {
          type:'color',
          label:'border color',
          name:'cColor',
          defaultValue:'#000',
        },
        {
          type:'range',
          label:'border radius',
          name:'cRadius',
          defaultValue:10,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'heading',
          label:'tag'
        },
        {
          type:'text',
          label:'font size',
          name:'cTagSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'color',
          name:'cTagColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'background color',
          name:'cTagBgColor',
          defaultValue:'#000',
        },
        {
          type:'range',
          label:'border radius',
          name:'cTagBRadius',
          defaultValue:10,
          configs:{
            min:5,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'cTagUppercase',
          defaultValue:true,
        },
        {
          type:'range',
          label:'font weight',
          name:'cTagWeight',
          defaultValue:700,
          configs:{
            min:100,
            max:900,
            step:100,
            unit:'weight',
          }
        },
        {
          type:'heading',
          label:'title'
        },
        {
          type:'text',
          label:'font size',
          name:'cTSize',
          defaultValue:'16px',
          placeholder:'12px',
        },
        {
          type:'color',
          label:'color',
          name:'cTColor',
          defaultValue:'#000',
        },
        {
          type:'range',
          label:'font weight',
          name:'cTWeight',
          defaultValue:700,
          configs:{
            min:100,
            max:900,
            step:100,
            unit:'weight',
          }
        },
        {
          type:'text',
          label:'font family',
          name:'cTFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'description'
        },
        {
          type:'text',
          label:'font size',
          name:'cDSize',
          defaultValue:'16px',
          placeholder:'12px',
        },
        {
          type:'color',
          label:'color',
          name:'cDColor',
          defaultValue:'#000',
        },
        {
          type:'range',
          label:'font weight',
          name:'cDWeight',
          defaultValue:500,
          configs:{
            min:100,
            max:900,
            step:100,
            unit:'weight',
          }
        },
        {
          type:'text',
          label:'font family',
          name:'cDFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'button'
        },
        {
          type:'text',
          label:'font size',
          name:'cBSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'color',
          name:'cBColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'background color',
          name:'cBBgColor',
          defaultValue:'#000',
        },
        {
          type:'range',
          label:'border radius',
          name:'cBBradius',
          defaultValue:10,
          configs:{
            min:5,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'cBUppercase',
          defaultValue:true,
        },
        {
          type:'range',
          label:'font weight',
          name:'cBWeight',
          defaultValue:700,
          configs:{
            min:100,
            max:900,
            step:100,
            unit:'weight',
          }
        },
        {
          type:'heading',
          label:'page link'
        },
        {
          type:'text',
          label:'text',
          name:'pageText',
          defaultValue:'Más información',
        },
        {
          type:'color',
          label:'color',
          name:'pageColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'pageSize',
          defaultValue:'16px',
        },
        {
          type:'text',
          label:'font size',
          name:'pageFont',
          defaultValue:'Monserrat',
        },

      ]
    },
    {
      group:"collection link",
      inputs:[
        {
          type:'switch',
          label:'show link',
          name:'show',
          defaultValue:true,
        },
        {
          type:'color',
          label:'color',
          name:'collectionColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'hover color',
          name:'collectionColorHover',
          defaultValue:'#9f9f9f',
        },
        {
          type:'text',
          label:'font size',
          name:'collectionSize',
          defaultValue:'16px',
        },
        {
          type:'text',
          label:'font family',
          name:'collectionFont',
          defaultValue:'Monserrat',
        },

      ]
    }

  ]
})