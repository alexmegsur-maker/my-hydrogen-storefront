import { useGSAP } from "@gsap/react";
import { createSchema, type WeaverseCollection } from "@weaverse/hydrogen";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type { CollectionsByIdsQuery, GetMaterialsQuery } from "storefront-api.generated";
import Variant from "~/components/product-secret/variant";
import VariantCollections from "~/components/product-secret/variant-collections";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";

interface RequestImage{
  altText:string;
  url:string;
}
interface RequestMetafield{
  id:string;
  value:string;
}
export interface RequestVariant{
  id:string;
  title:string;
  availableForSale:boolean;
  sku:string;
  quantityAvailable:number;
  selectedOptions:RequestOption[];
  price:RequestPrice;
  nombre?:RequestMetafield;
  tooltip?:RequestMetafield;
}
interface RequestOption{
  name:string;
  value:string;
}
interface RequestPrice{
  amount:string;
  currencyCode:string;
}

export interface ProductNode{
  id:string;
  title:string;
  handle:string; 
  availableForSale:boolean;
  featuredImage:RequestImage;
  nombre?:RequestMetafield;
  tooltip?:RequestMetafield;
  variants:{
    edges:{
      node:RequestVariant[]
    }
  }
}
interface RequestProduct{
  node:ProductNode
}

interface FiltroMetafield{
  id:string;
  value:string;
}

export interface RequestCollection{
  id:string;
  handle:string;
  title:string;
  description:string;
  image:RequestImage;
  products:{edges:RequestProduct[]};
  filtro:FiltroMetafield;
}

interface ApiResponseCollection{
  result:CollectionsByIdsQuery;
  ok:boolean;
  errorMessage?:string;
}

interface ApiResponseMateriales{
  result:GetMaterialsQuery;
  ok:boolean;
  errorMessage?:string;
}

interface VariantSecretProps{
  variants:boolean;
  list:WeaverseCollection[];
  title?:string;
  varTitle:string;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  tColor:string;
  tSize:string;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  varColor:string;
  varSize:string;
  varFamily:string;
  varPaddingSelect:string;
  varPaddingText:string;
  varMarginSelect:string;
  varMarginText:string;
  varWeight:string;
  svarColor:string;
  svarSize:string;
  svarWeight:string;
  svarFamily:string;
  svarSubColor:string;
  svarSubSize:string;
  svarSubWeight:string;
  svarSubFamily:string;
  lineColor:string;
  arrowColor:string;
  dVariants:string;
  defVarColor:string;
  defVarSize:string;
  defVarFamily:string;
  defVarPaddingSelect:string;
  defVarPaddingText:string;
  defVarMarginSelect:string;
  defVarMarginText:string;
  defVarWeight:string;
  defsVarColor:string;
  defsVarSize:string;
  defsVarWeight:string;
  defsVarFamily:string;
  defsVarSubColor:string;
  defsVarSubSize:string;
  defsVarSubWeight:string;
  defsVarSubFamily:string;
  defLineColor:string;
  defArrowColor:string;
  navBgColor:string;
  navColor:string;
  navSize:string;
  navFamily:string;
  filterFamily:string;
  filterNavColor:string;
  filterNavShowColor:string;
  tFSize:string;
  tFcolor:string;
  tFWeight:string;
  cfBgColor:string;
  collectionTColor:string;
  collecitonSize:string;
  collectionFWeight:string;
  tooltipColor:string;
  tooltipBgColor:string;
  tooltipTSize:string;
  tooltipTWeight:string;
  tooltipSubTSize:string;
  tooltipSubTWeight:string;
  sProdTColor:string;
  sProdTSize:string;
  sProdTFamily:string;
  sProdTPaddingSelect:string;
  sProdTPaddingText:string;
  sProdTMarginSelect:string;
  sProdTMarginText:string;
  sProdTWeight:string;
  sProdSubTColor:string;
  sProdSubTSize:string;
  sProdSubTFamily:string;
  sProdSubTPaddingSelect:string;
  sProdSubTPaddingText:string;
  sProdSubTMarginSelect:string;
  sProdSubTMarginText:string;
  sProdSubTWeight:string;
  sProdPriceColor:string;
  sProdPriceSize:string;
  sProdPriceFamily:string;
  sProdPricePaddingSelect:string;
  sProdPricePaddingText:string;
  sProdPriceMarginSelect:string;
  sProdPriceMarginText:string;
  sProdPriceWeight:string;
  buttonColor:string;
  buttonBgColor:string;
  buttonSize:string;
  buttonFamily:string;
  buttonPaddingSelect:string;
  buttonPaddingText:string;
  buttonMarginSelect:string;
  buttonMarginText:string;
  buttonWeight:string;
  defNavBgColor:string;
  defNavColor:string;
  defNavSize:string;
  defNavFamily:string;
  defSelectColor:string;
  defTColor:string;
  defTSize:string;
  defTFamily:string;
  defTPaddingSelect:string;
  defTPaddingText:string;
  defTMarginSelect:string;
  defTMarginText:string;
  defTWeight:string;
  defsTColor:string;
  desfTSize:string;
  defsTFamily:string;
  defsTPaddingSelect:string;
  defsTPaddingText:string;
  defsTMarginSelect:string;
  defsTMarginText:string;
  defsTWeight:string;
  defButtonColor:string;
  defButtonBgColor:string;
  defButtonSize:string;
  defButtonFamily:string;
  defButtonPaddingSelect:string;
  defButtonPaddingText:string;
  defButtonMarginSelect:string;
  defButtonMarginText:string;
  defButtonWeight:string;
     
}

function VariantSecret( props:VariantSecretProps){
  const { variants,
  list,
  title,
  varTitle,
  paddingSelect,
  paddingText,
  marginSelect,
  marginText,
  tColor,
  tSize,
  tFamily,
  tPaddingSelect,
  tPaddingText,
  tMarginSelect,
  tMarginText,
  tWeight,
  varColor,
  varSize,
  varFamily,
  varPaddingSelect,
  varPaddingText,
  varMarginSelect,
  varMarginText,
  varWeight,
  svarColor,
  svarSize,
  svarWeight,
  svarFamily,
  svarSubColor,
  svarSubSize,
  svarSubWeight,
  svarSubFamily,
  lineColor,
  arrowColor,
  dVariants,
  defVarColor,
  defVarSize,
  defVarFamily,
  defVarPaddingSelect,
  defVarPaddingText,
  defVarMarginSelect,
  defVarMarginText,
  defVarWeight,
  defsVarColor,
  defsVarSize,
  defsVarWeight,
  defsVarFamily,
  defsVarSubColor,
  defsVarSubSize,
  defsVarSubWeight,
  defsVarSubFamily,
  defLineColor,
  defArrowColor,
  navBgColor,
  navColor,
  navSize,
  navFamily,
  filterFamily,
  filterNavColor,
  filterNavShowColor,
  tFSize,
  tFcolor,
  tFWeight,
  cfBgColor,
  collectionTColor,
  collecitonSize,
  collectionFWeight,
  tooltipColor,
  tooltipBgColor,
  tooltipTSize,
  tooltipTWeight,
  tooltipSubTSize,
  tooltipSubTWeight,
  sProdTColor,
  sProdTSize,
  sProdTFamily,
  sProdTPaddingSelect,
  sProdTPaddingText,
  sProdTMarginSelect,
  sProdTMarginText,
  sProdTWeight,
  sProdSubTColor,
  sProdSubTSize,
  sProdSubTFamily,
  sProdSubTPaddingSelect,
  sProdSubTPaddingText,
  sProdSubTMarginSelect,
  sProdSubTMarginText,
  sProdSubTWeight,
  sProdPriceColor,
  sProdPriceSize,
  sProdPriceFamily,
  sProdPricePaddingSelect,
  sProdPricePaddingText,
  sProdPriceMarginSelect,
  sProdPriceMarginText,
  sProdPriceWeight,
  buttonColor,
  buttonBgColor,
  buttonSize,
  buttonFamily,
  buttonPaddingSelect,
  buttonPaddingText,
  buttonMarginSelect,
  buttonMarginText,
  buttonWeight,
  defNavBgColor,
  defNavColor,
  defNavSize,
  defNavFamily,
  defSelectColor,
  defTColor,
  defTSize,
  defTFamily,
  defTPaddingSelect,
  defTPaddingText,
  defTMarginSelect,
  defTMarginText,
  defTWeight,
  defsTColor,
  desfTSize,
  defsTFamily,
  defsTPaddingSelect,
  defsTPaddingText,
  defsTMarginSelect,
  defsTMarginText,
  defsTWeight,
  defButtonColor,
  defButtonBgColor,
  defButtonSize,
  defButtonFamily,
  defButtonPaddingSelect,
  defButtonPaddingText,
  defButtonMarginSelect,
  defButtonMarginText,
  defButtonWeight,
} = props;

  const variantSecretProps={
    varColor:varColor,
    varSize:varSize,
    varFamily:varFamily,
    varPaddingSelect:varPaddingSelect,
    varPaddingText:varPaddingText,
    varMarginSelect:varMarginSelect,
    varMarginText:varMarginText,
    varWeight:varWeight,
    svarColor:svarColor,
    svarSize:svarSize,
    svarWeight:svarWeight,
    svarFamily:svarFamily,
    svarSubColor:svarSubColor,
    svarSubSize:svarSubSize,
    svarSubWeight:svarSubWeight,
    svarSubFamily:svarSubFamily,
    lineColor:lineColor,
    arrowColor:arrowColor,
    navBgColor:navBgColor,
    navColor:navColor,
    navSize:navSize,
    navFamily:navFamily,
    filterFamily:filterFamily,
    filterNavColor:filterNavColor,
    filterNavShowColor:filterNavShowColor,
    tFSize:tFSize,
    tFcolor:tFcolor,
    tFWeight:tFWeight,
    cfBgColor:cfBgColor,
    collectionTColor:collectionTColor,
    collecitonSize:collecitonSize,
    collectionFWeight:collectionFWeight,
    tooltipColor:tooltipColor,
    tooltipBgColor:tooltipBgColor,
    tooltipTSize:tooltipTSize,
    tooltipTWeight:tooltipTWeight,
    tooltipSubTSize:tooltipSubTSize,
    tooltipSubTWeight:tooltipSubTWeight,
    sProdTColor:sProdTColor,
    sProdTSize:sProdTSize,
    sProdTFamily:sProdTFamily,
    sProdTPaddingSelect:sProdTPaddingSelect,
    sProdTPaddingText:sProdTPaddingText,
    sProdTMarginSelect:sProdTMarginSelect,
    sProdTMarginText:sProdTMarginText,
    sProdTWeight:sProdTWeight,
    sProdSubTColor:sProdSubTColor,
    sProdSubTSize:sProdSubTSize,
    sProdSubTFamily:sProdSubTFamily,
    sProdSubTPaddingSelect:sProdSubTPaddingSelect,
    sProdSubTPaddingText:sProdSubTPaddingText,
    sProdSubTMarginSelect:sProdSubTMarginSelect,
    sProdSubTMarginText:sProdSubTMarginText,
    sProdSubTWeight:sProdSubTWeight,
    sProdPriceColor:sProdPriceColor,
    sProdPriceSize:sProdPriceSize,
    sProdPriceFamily:sProdPriceFamily,
    sProdPricePaddingSelect:sProdPricePaddingSelect,
    sProdPricePaddingText:sProdPricePaddingText,
    sProdPriceMarginSelect:sProdPriceMarginSelect,
    sProdPriceMarginText:sProdPriceMarginText,
    sProdPriceWeight:sProdPriceWeight,
    buttonColor:buttonColor,
    buttonBgColor:buttonBgColor,
    buttonSize:buttonSize,
    buttonFamily:buttonFamily,
    buttonPaddingSelect:buttonPaddingSelect,
    buttonPaddingText:buttonPaddingText,
    buttonMarginSelect:buttonMarginSelect,
    buttonMarginText:buttonMarginText,
    buttonWeight:buttonWeight,
  }

  const defVariant = {
    dVariants:dVariants,
    defVarColor:defVarColor,
    defVarSize:defVarSize,
    defVarFamily:defVarFamily,
    defVarPaddingSelect:defVarPaddingSelect,
    defVarPaddingText:defVarPaddingText,
    defVarMarginSelect:defVarMarginSelect,
    defVarMarginText:defVarMarginText,
    defVarWeight:defVarWeight,
    defsVarColor:defsVarColor,
    defsVarSize:defsVarSize,
    defsVarWeight:defsVarWeight,
    defsVarFamily:defsVarFamily,
    defsVarSubColor:defsVarSubColor,
    defsVarSubSize:defsVarSubSize,
    defsVarSubWeight:defsVarSubWeight,
    defsVarSubFamily:defsVarSubFamily,
    defLineColor:defLineColor,
    defArrowColor:defArrowColor,
    defNavBgColor:defNavBgColor,
    defNavColor:defNavColor,
    defNavSize:defNavSize,
    defNavFamily:defNavFamily,
    defSelectColor:defSelectColor,
    defTColor:defTColor,
    defTSize:defTSize,
    defTFamily:defTFamily,
    defTPaddingSelect:defTPaddingSelect,
    defTPaddingText:defTPaddingText,
    defTMarginSelect:defTMarginSelect,
    defTMarginText:defTMarginText,
    defTWeight:defTWeight,
    defsTColor:defsTColor,
    desfTSize:desfTSize,
    defsTFamily:defsTFamily,
    defsTPaddingSelect:defsTPaddingSelect,
    defsTPaddingText:defsTPaddingText,
    defsTMarginSelect:defsTMarginSelect,
    defsTMarginText:defsTMarginText,
    defsTWeight:defsTWeight,
    defButtonColor:defButtonColor,
    defButtonBgColor:defButtonBgColor,
    defButtonSize:defButtonSize,
    defButtonFamily:defButtonFamily,
    defButtonPaddingSelect:defButtonPaddingSelect,
    defButtonPaddingText:defButtonPaddingText,
    defButtonMarginSelect:defButtonMarginSelect,
    defButtonMarginText:defButtonMarginText,
    defButtonWeight:defButtonWeight,
  }
  const container =  useRef(null);
  const [widthSize,setWidthSize] =useState(0);
  const [collections,setCollections]=useState(null);
  const [isLoading,setIsLoading]=useState(false);
  const [showFilter,setShowFilter]=useState(false);
  const getApiUrl=usePrefixPathWithLocale(`api/collection`);
  const getMaterialsUrl=usePrefixPathWithLocale(`api/materials`);
  const activeFilter=useRef(null);
  const [materiales,setMateriales]=useState(null);
  const [overflowActive,setOverflowActive]=useState(true);
  const [selectedCollection,setSelectedCollection]=useState("");
  const currentProd = useCurrentProduct(state=>state.currentProduct)

  useEffect(()=>{
    const loadMaterials= async()=>{
      const res = await fetch(getMaterialsUrl,{
        method:"GET"
      })
      const data = await res.json() as ApiResponseMateriales
      if(data.ok) {
        setMateriales(data.result.metaobjects.edges)
      }
    }
    loadMaterials()
    
    const calculateWidth= window.innerWidth-container.current.getBoundingClientRect().x
    setWidthSize(calculateWidth)
  },[])

  useEffect(()=>{
    if(list){
      let ids= list.map((elm)=>{return `gid://shopify/Collection/${elm.id}`})
      setIsLoading(true)
      const loadCollection = async(retryCount = 0)=>{
        try{
          const res = await fetch(getApiUrl,{
            method:"POST",
            body:JSON.stringify({ids:ids})
          })
          const data = await res.json() as ApiResponseCollection;
          if(data.ok){
            setCollections(data.result.nodes)
            setIsLoading(false);
          }else{
            if(retryCount<3){
              await new Promise(resolve=>setTimeout(resolve,1500));
              return loadCollection(retryCount + 1);
            }else{
              setCollections(null);
              setIsLoading(false);
            }
            
          }

        }catch(err){
          console.error("Error de red/servidor:",err);
          if(retryCount<3){
            await new Promise(resolve => setTimeout(resolve,1500));
            return loadCollection(retryCount + 1);
          }
          setIsLoading(false)
        }
      }

      loadCollection()
    }
  },[list,getApiUrl])

  useGSAP(()=>{
    if(showFilter){
      activeFilter.current= gsap.from(".filtro-view",{
        height:0,
        opacity:0,
        duration:2,
        onComplete:()=>{
          setOverflowActive(false)
        },
        onReverseComplete:()=>{
          setShowFilter(false)
        }
      })
    }
  },{scope:container,dependencies:[showFilter]})


  useEffect(()=>{
    if(showFilter){
      activeFilter.current.play()
    }
  },[showFilter])


  // useEffect(()=>{
  //   console.log("collections",collections)
  // },[collections])

  const toogleFilter=()=>{
    if(showFilter){
      setOverflowActive(true)
      activeFilter.current.reverse()
    }else{
      setOverflowActive(true)
      setShowFilter(true)
    }
  }

  return (
    <div ref={container} className="w-full h-auto">
      <div 
        style={{
          ...selectorPaddingMargin("margin",marginSelect,marginText),
          ...selectorPaddingMargin("padding",paddingSelect,paddingText),
        }}
        className="flex flex-col  border-0 border-b-[1px] border-solid border-r-0 colour-border-medium-grey"
        >
        {title && (
          <h3 className="subheading-alt-lg"
           style={{
            fontSize:tSize,
            color:tColor,
            fontFamily:tFamily,
            ...selectorPaddingMargin('margin',tMarginSelect,tMarginText),
            ...selectorPaddingMargin('padding',tPaddingSelect,tPaddingText),
            fontWeight:tWeight,

           }}
          >{title}</h3>
        )}

        <div className="flex flex-col gap-6 lg:gap-12 mt-6 lg:mt-8">
          {variants &&
            <VariantCollections
              varTitle={varTitle}
              widthSize={widthSize}
              collections={collections}
              showFilter={showFilter}
              overflowActive={overflowActive}
              isLoading={isLoading}
              toogleFilter={toogleFilter}
              materiales={materiales}
              selectedCollection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
              variantSecretProps={variantSecretProps}
              />
          }
          {
            currentProd?.options?.map((elm , index)=>{
              if(elm.optionValues.length>1){
                return <Variant defVariant={defVariant} key={index} variante={elm} widthSize={widthSize}/>
              }
            })
          }
        </div>
      </div>
    </div>
  );
}

export default VariantSecret;

export const schema = createSchema({
  type:"variant-secret",
  title:"Variant Secret",
  settings:[
    {
      group:"general",
      inputs:[
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
          defaultValue:'24px 32px'
        },
        {
          type:'select',
          label:'Margin type ',
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
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'marginText',
        },
        {
          type:'text',
          label:'title',
          name:'title',
        },
        {
          type:'switch',
          label:'available colections Variants',
          name:'variants',
          defaultValue:true,
        },
        {
          type:'collection-list',
          label:'collections',
          name:'list',
        },
        {
          type:'heading',
          label:'Title'
        },
        {
          type:'color',
          label:'color (title)',
          name:'tColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size (title)',
          name:'tSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family (title)',
          name:'tFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type (title)',
          name:'tPaddingSelect',
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
          label:'Padding text (title)',
          name:'tPaddingText',
        },
        {
          type:'select',
          label:'Margin type (title)',
          name:'tMarginSelect',
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
          label:'Margin text (title)',
          name:'tMarginText',
        },
        {
          type:'select',
          label:'Font weight (title)',
          name:'tWeight',
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
          defaultValue:'400',
        },

        {
          type:'heading',
          label:'variants collection',
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'title (variant)',
          name:'varTitle',
          defaultValue:'Variante',
          condition:(data)=>data.variants ==true
        },
        {
          type:'color',
          label:'color (variant)',
          name:'varColor',
          defaultValue:'#000',
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'font size (variant)',
          name:'varSize',
          defaultValue:'20px',
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'font family (variant)',
          name:'varFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.variants ==true
        },
        {
          type:'select',
          label:'Padding type (variant)',
          name:'varPaddingSelect',
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
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'Padding text (variant)',
          name:'varPaddingText',
          condition:(data)=>data.variants ==true
        },
        {
          type:'select',
          label:'Margin type (variant)',
          name:'varMarginSelect',
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
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'Margin text (variant)',
          name:'varMarginText',
          condition:(data)=>data.variants ==true
        },
        {
          type:'select',
          label:'Font weight (variant)',
          name:'varWeight',
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
          defaultValue:'400',
          condition:(data)=>data.variants ==true
        },
        {
          type:'heading',
          label:'Variant selected',
          condition:(data)=>data.variants ==true
        },      
        {
          type:'color',
          label:'color (variant selected)',
          name:'svarColor',
          defaultValue:'#000',
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'font size (variant selected)',
          name:'svarSize',
          defaultValue:'20px',
          condition:(data)=>data.variants ==true
        },
        {
          type:'select',
          label:'Font weight (variant selected)',
          name:'svarWeight',
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
          defaultValue:'400',
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'font family (variant selected)',
          name:'svarFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.variants ==true
        },
        {
          type:'heading',
          label:'Variant selected subtitle',
          condition:(data)=>data.variants ==true
        },      
        {
          type:'color',
          label:'color (variant selected subtitle)',
          name:'svarSubColor',
          defaultValue:'#000',
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'font size (variant selected subtitle)',
          name:'svarSubSize',
          defaultValue:'20px',
          condition:(data)=>data.variants ==true
        },
        {
          type:'select',
          label:'Font weight (variant selected subtitle)',
          name:'svarSubWeight',
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
          defaultValue:'400',
          condition:(data)=>data.variants ==true
        },
        {
          type:'text',
          label:'font family (variant selected subtitle)',
          name:'svarSubFamily',
          defaultValue:'Monserrat',
          condition:(data)=>data.variants ==true
        },
        {
          type:'heading',
          label:'decoration variant',
          condition:(data)=>data.variants ==true
        },      
        {
          type:'color',
          label:'color (line color)',
          name:'lineColor',
          defaultValue:'#000',
          condition:(data)=>data.variants ==true
        },
        {
          type:'color',
          label:'color (arrow color)',
          name:'arrowColor',
          defaultValue:'#000',
          condition:(data)=>data.variants ==true
        },
      ]
    },
    {
      group:"default variants ",
      inputs:[ 
        {
          type:'switch',
          label:'show default variants',
          name:'dVariants',
          defaultValue:true,
        },
        {
          type:'color',
          label:'color (variant)',
          name:'defVarColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size (variant)',
          name:'defVarSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family (variant)',
          name:'defVarFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type (variant)',
          name:'defVarPaddingSelect',
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
          label:'Padding text (variant)',
          name:'defVarPaddingText',
        },
        {
          type:'select',
          label:'Margin type (variant)',
          name:'defVarMarginSelect',
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
          label:'Margin text (variant)',
          name:'defVarMarginText',
        },
        {
          type:'select',
          label:'Font weight (variant)',
          name:'defVarWeight',
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
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'Variant selected',
        },      
        {
          type:'color',
          label:'color (selected)',
          name:'defsVarColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size (selected)',
          name:'defsVarSize',
          defaultValue:'20px',
        },
        {
          type:'select',
          label:'Font weight (variant selected)',
          name:'defsVarWeight',
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
          defaultValue:'400',
        },
        {
          type:'text',
          label:'font family (variant selected)',
          name:'defsVarFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'Variant selected subtitle',
        },      
        {
          type:'color',
          label:'color (variant selected subtitle)',
          name:'defsVarSubColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size (variant selected subtitle)',
          name:'defsVarSubSize',
          defaultValue:'20px',
        },
        {
          type:'select',
          label:'Font weight (variant selected subtitle)',
          name:'defsVarSubWeight',
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
          defaultValue:'400',
        },
        {
          type:'text',
          label:'font family (variant selected subtitle)',
          name:'defsVarSubFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'decoration variant',
        },      
        {
          type:'color',
          label:'color (line color)',
          name:'defLineColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'color (arrow color)',
          name:'defArrowColor',
          defaultValue:'#000',
        },
      ],
    },
    {
      group:"lateralPopup collections",
      inputs:[
        {
          type:'heading',
          label:'navbar'
        },
        {
          type:'color',
          label:'nav background color',
          name:'navBgColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'nav color',
          name:'navColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'nav font size',
          name:'navSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'nav font Family',
          name:'navFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'filtros'
        },
        {
          type:'text',
          label:'font family nav',
          name:'filterFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'color',
          label:'color nav',
          name:'filterNavColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'color show text',
          name:'filterNavShowColor',
          defaultValue:'#000',
        },
        {
          type:'heading',
          label:'titles filter'
        },
        {
          type:'text',
          label:'font size',
          name:'tFSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'color',
          name:'tFcolor',
          defaultValue:'#000',
        },
        {
          type:'select',
          label:'Font weight',
          name:'tFWeight',
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
          defaultValue:'400',
        },
        
        {
          type:'heading',
          label:'content filter'
        },
        {
          type:'color',
          label:'bacground selected color',
          name:'cfBgColor',
          defaultValue:'#000',
        },
        {
          type:'heading',
          label:'list products'
        },
        {
          type:'color',
          label:'color collection title',
          name:'collectionTColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'size collection title',
          name:'collecitonSize',
          defaultValue:'20px',
        },
        {
          type:'select',
          label:'Font weight collection title',
          name:'collectionFWeight',
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
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'tooltip'
        },
        {
          type:'color',
          label:'color tooltip',
          name:'tooltipColor',
          defaultValue:'#fff',
        },
        {
          type:'color',
          label:'color tooltip',
          name:'tooltipBgColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'size title tooltip',
          name:'tooltipTSize',
          defaultValue:'20px',
        },
        {
          type:'select',
          label:'Font weight title tooltip',
          name:'tooltipTWeight',
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
          defaultValue:'400',
        },
        {
          type:'text',
          label:'size subtitle tooltip',
          name:'tooltipSubTSize',
          defaultValue:'20px',
        },
        {
          type:'select',
          label:'Font weight subtitle tooltip',
          name:'tooltipSubTWeight',
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
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'title selected product'
        },
        {
          type:'color',
          label:'color',
          name:'sProdTColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'sProdTSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family',
          name:'sProdTFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'sProdTPaddingSelect',
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
          label:'Padding text ',
          name:'sProdTPaddingText',
        },
        {
          type:'select',
          label:'Margin type ',
          name:'sProdTMarginSelect',
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
          label:'Margin text ',
          name:'sProdTMarginText',
        },
        {
          type:'select',
          label:'Font weight ',
          name:'sProdTWeight',
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
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'subtitle selected product'
        },
        {
          type:'color',
          label:'color ',
          name:'sProdSubTColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size ',
          name:'sProdSubTSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family ',
          name:'sProdSubTFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'sProdSubTPaddingSelect',
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
          label:'Padding text ',
          name:'sProdSubTPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'sProdSubTMarginSelect',
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
          name:'sProdSubTMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'sProdSubTWeight',
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
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'price selected product'
        },
        {
          type:'color',
          label:'color (price)',
          name:'sProdPriceColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size (price)',
          name:'sProdPriceSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family (price)',
          name:'sProdPriceFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type (price)',
          name:'sProdPricePaddingSelect',
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
          label:'Padding text (price)',
          name:'sProdPricePaddingText',
        },
        {
          type:'select',
          label:'Margin type (price)',
          name:'sProdPriceMarginSelect',
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
          label:'Margin text (price)',
          name:'sProdPriceMarginText',
        },
        {
          type:'select',
          label:'Font weight (price)',
          name:'sProdPriceWeight',
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
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'button selected product'
        },
        {
          type:'color',
          label:'color ',
          name:'buttonColor',
          defaultValue:'#fff',
        },
        {
          type:'color',
          label:'background color',
          name:'buttonBgColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size ',
          name:'buttonSize',
          defaultValue:'20px',
        },
        {
          type:'text',
          label:'font family',
          name:'buttonFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type ',
          name:'buttonPaddingSelect',
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
          label:'Padding text ',
          name:'buttonPaddingText',
        },
        {
          type:'select',
          label:'Margin type ',
          name:'buttonMarginSelect',
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
          label:'Margin text ',
          name:'buttonMarginText',
        },
        {
          type:'select',
          label:'Font weight ',
          name:'buttonWeight',
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
          defaultValue:'400',
        },
      ]
    },
    {
      group:"default variants popup",
      inputs:[
        {
          type:'heading',
          label:'navigation'
        },
        {
          type:'color',
          label:'background color',
          name:'defNavBgColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'color',
          name:'defNavColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'text',
          label:'font size',
          name:'defNavSize',
          defaultValue:'24px',
        },
        {
          type:'text',
          label:'font family',
          name:'defNavFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'heading',
          label:'selected variant'
        },
        {
          type:'color',
          label:'color',
          name:'defSelectColor',
          defaultValue:'#3790b0',
        },
        {
          type:'heading',
          label:'title'
        },
        {
          type:'color',
          label:'color',
          name:'defTColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'defTSize',
          defaultValue:'24px',
        },
        {
          type:'text',
          label:'font family ',
          name:'defTFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type ',
          name:'defTPaddingSelect',
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
          label:'Padding text ',
          name:'defTPaddingText',
        },
        {
          type:'select',
          label:'Margin type ',
          name:'defTMarginSelect',
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
          label:'Margin text (button)',
          name:'defTMarginText',
        },
        {
          type:'select',
          label:'Font weight ',
          name:'defTWeight',
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
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'subtitle'
        },
        {
          type:'color',
          label:'color',
          name:'defsTColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'desfTSize',
          defaultValue:'24px',
        },
        {
          type:'text',
          label:'font family ',
          name:'defsTFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type ',
          name:'defsTPaddingSelect',
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
          label:'Padding text ',
          name:'defsTPaddingText',
        },
        {
          type:'select',
          label:'Margin type ',
          name:'defsTMarginSelect',
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
          label:'Margin text (button)',
          name:'defsTMarginText',
        },
        {
          type:'select',
          label:'Font weight ',
          name:'defsTWeight',
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
          defaultValue:'400',
        },
        {
          type:'heading',
          label:'button'
        },
        {
          type:'color',
          label:'color',
          name:'defButtonColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'background color',
          name:'defButtonBgColor',
          defaultValue:'#000',
        },
        {
          type:'text',
          label:'font size',
          name:'defButtonSize',
          defaultValue:'24px',
        },
        {
          type:'text',
          label:'font family ',
          name:'defButtonFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type ',
          name:'defButtonPaddingSelect',
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
          label:'Padding text ',
          name:'defButtonPaddingText',
        },
        {
          type:'select',
          label:'Margin type ',
          name:'defButtonMarginSelect',
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
          name:'defButtonMarginText',
        },
        {
          type:'select',
          label:'Font weight ',
          name:'defButtonWeight',
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
          defaultValue:'400',
        },
      ]
    }
  ]
}) 