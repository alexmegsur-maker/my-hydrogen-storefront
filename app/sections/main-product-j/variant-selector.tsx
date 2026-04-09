import { createSchema, type HydrogenComponentProps, type WeaverseCollection } from "@weaverse/hydrogen";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CollectionsByIdsQuery } from "storefront-api.generated";
import LateralCollection from "~/components/product-j/lateral-collection";
import { Section } from "~/components/section";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import { createCurProVar } from "~/routes/collections/utils";
import { useCurrentProduct } from "~/stores/currentProduct";
import { selectorPaddingMargin } from "~/utils/general";

interface ApiResponseCollection{
  result:CollectionsByIdsQuery;
  ok:boolean;
  errorMessage?:string;
}

interface SelectorVariantProps extends HydrogenComponentProps{
  title:string;
  list:WeaverseCollection[]
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  tColor:string;
  tSize:string;
  tLetter:number;
  tUpper:boolean;
  tFamily:string;
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  cColor:string;
  cSize:string;
  cLetter:number;
  cUpper:boolean;
  cFamily:string;
  cPaddingSelect:string;
  cPaddingText:string;
  cMarginSelect:string;
  cMarginText:string;
  cWeight:string;
  pColor:string;
  pSize:string;
  pLetter:number;
  pUpper:boolean;
  pFamily:string;
  pPaddingSelect:string;
  pPaddingText:string;
  pMarginSelect:string;
  pMarginText:string;
  pWeight:string;
  bgColor:string;
  borderColor:string;
  lcPaddingSelect:string;
  lcPaddingText:string;
  lcMarginSelect:string;
  lcMarginText:string;
  brColor:string;
  brSize:string;
  brLetter:number;
  brUpper:boolean;
  brFamily:string;
  brPaddingSelect:string;
  brPaddingText:string;
  brMarginSelect:string;
  brMarginText:string;
  brWeight:string;
  ntColor:string;
  ntSize:string;
  ntLetter:number;
  ntUpper:boolean;
  ntFamily:string;
  ntPaddingSelect:string;
  ntPaddingText:string;
  ntMarginSelect:string;
  ntMarginText:string;
  ntWeight:string;
  ltTitle:string;
  ltColor:string;
  ltSize:string;
  ltLetter:number;
  ltUpper:boolean;
  ltFamily:string;
  ltPaddingSelect:string;
  ltPaddingText:string;
  ltMarginSelect:string;
  ltMarginText:string;
  ltWeight:string;
  lbText:string;
  lbColor:string;
  lbBgColor:string;
  lbRadius:number;
  lbSize:string;
  lbLetter:number;
  lbUpper:boolean;
  lbFamily:string;
  lbPaddingSelect:string;
  lbPaddingText:string;
  lbMarginSelect:string;
  lbMarginText:string;
  lbWeight:string;
  cpBgColor:string;
  cpBgAColor:string;
  cpBgHColor:string;
  cpBColor:string;
  cpBAColor:string;
  cpBHColor:string;
  cpRadius:number;
  cpPaddingSelect:string;
  cpPaddingText:string;
  cpMarginSelect:string;
  cpMarginText:string;
  cpiWidth:number;
  cpiHeight:number;
  cpiRadius:number;
  cptColor:string;
  cptSize:string;
  cptLetter:number;
  cptUpper:boolean;
  cptFamily:string;
  cptPaddingSelect:string;
  cptPaddingText:string;
  cptMarginSelect:string;
  cptMarginText:string;
  cptWeight:string;
  cptlColor:string;
  cptlSize:string;
  cptlLetter:number;
  cptlUpper:boolean;
  cptlFamily:string;
  cptlPaddingSelect:string;
  cptlPaddingText:string;
  cptlMarginSelect:string;
  cptlMarginText:string;
  cptlWeight:string;

}

export default function SelectorVariant(props:SelectorVariantProps){
 const{
    title,
    list,
    paddingSelect,
    paddingText,
    marginSelect,
    marginText,
    tColor,
    tSize,
    tLetter,
    tUpper,
    tFamily,
    tPaddingSelect,
    tPaddingText,
    tMarginSelect,
    tMarginText,
    tWeight,
    cColor,
    cSize,
    cLetter,
    cUpper,
    cFamily,
    cPaddingSelect,
    cPaddingText,
    cMarginSelect,
    cMarginText,
    cWeight,
    pColor,
    pSize,
    pLetter,
    pUpper,
    pFamily,
    pPaddingSelect,
    pPaddingText,
    pMarginSelect,
    pMarginText,
    pWeight,
    bgColor,
    borderColor,
    lcPaddingSelect,
    lcPaddingText,
    lcMarginSelect,
    lcMarginText,
    brColor,
    brSize,
    brLetter,
    brUpper,
    brFamily,
    brPaddingSelect,
    brPaddingText,
    brMarginSelect,
    brMarginText,
    brWeight,
    ntColor,
    ntSize,
    ntLetter,
    ntUpper,
    ntFamily,
    ntPaddingSelect,
    ntPaddingText,
    ntMarginSelect,
    ntMarginText,
    ntWeight,
    ltTitle,
    ltColor,
    ltSize,
    ltLetter,
    ltUpper,
    ltFamily,
    ltPaddingSelect,
    ltPaddingText,
    ltMarginSelect,
    ltMarginText,
    ltWeight,
    lbText,
    lbColor,
    lbBgColor,
    lbRadius,
    lbSize,
    lbLetter,
    lbUpper,
    lbFamily,
    lbPaddingSelect,
    lbPaddingText,
    lbMarginSelect,
    lbMarginText,
    lbWeight,
    cpBgColor,
    cpBgAColor,
    cpBgHColor,
    cpBColor,
    cpBAColor,
    cpBHColor,
    cpRadius,
    cpPaddingSelect,
    cpPaddingText,
    cpMarginSelect,
    cpMarginText,
    cpiWidth,
    cpiHeight,
    cpiRadius,
    cptColor,
    cptSize,
    cptLetter,
    cptUpper,
    cptFamily,
    cptPaddingSelect,
    cptPaddingText,
    cptMarginSelect,
    cptMarginText,
    cptWeight,
    cptlColor,
    cptlSize,
    cptlLetter,
    cptlUpper,
    cptlFamily,
    cptlPaddingSelect,
    cptlPaddingText,
    cptlMarginSelect,
    cptlMarginText,
    cptlWeight,
    ...rest
  }=props
  const getApiUrl = usePrefixPathWithLocale(`api/collection`) 
  const [isLoading,setIsLoading] = useState(false)
  const [show,setShow] = useState(false)
  const [collections,setCollections]=useState(null)
  const [collection,setCollection]=useState(null)
  const [idSelect,setIdSelect]=useState("")
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const currentProduct = useCurrentProduct((state)=>state.currentProduct)
  const setProduct = useCurrentProduct((state)=>state.setProduct)
  const contenedor = useRef(null)
  const isMobile = useIsMobile(600);
  
  const openDrawer=(elm)=>{
    setCollection({
      title:elm.title,
      products:elm.products.edges
    })
    setShow(true)
    setIdSelect(currentProduct.id)
  }
  useEffect(()=>{
    if(contenedor.current){
      if(contenedor.current.parentNode.hasAttribute("class"))contenedor.current.parentNode.removeAttribute("class")
    }
  },[contenedor.current])

  useEffect(()=>{
    if(list){
      let ids= list.map((elm)=>{return `gid://shopify/Collection/${elm.id}`})
      setIsLoading(true)

      const loadCollection = async(retryCount=0)=>{
        try{
          const res = await fetch(getApiUrl,{
            method:"POST",
            body:JSON.stringify({ids:ids})
          })
          const data = await res.json() as ApiResponseCollection
          if(data.ok){
            setCollections(data.result.nodes)
            setIsLoading(false)
          }else{
            if(retryCount<3){
              await new Promise(resolve=>setTimeout(resolve,1500));
              return loadCollection(retryCount)
            }else{
              setCollections(null);
              setIsLoading(false);
            }
          }
        }catch(err){
          console.error("Error de red/servidor:",err)
          if(retryCount<3){
            await new Promise(resolve=>setTimeout(resolve,1500));
            return loadCollection(retryCount+1)
          }
          setIsLoading(false)
        }
      }
      loadCollection()
    }
  },[list,getApiUrl])
  
  useEffect(()=>{
    if(currentProduct){
      setIdSelect(currentProduct.id)
    }
  },[currentProduct])

  const selectModel=(e:string)=>{
    setIdSelect(e)
  }
  
  const selectProduct=()=>{
    const producto = collection?.products?.find((elm)=>elm.node.id === idSelect)
    if(producto){
      let formatedProduct= createCurProVar(producto.node)
      setProduct(formatedProduct)
    }
  } 

  if(collections != null){
    return (
      <Section  {...rest} className="static" >
        <div
          ref={contenedor}
          style={{
            ...selectorPaddingMargin("padding",paddingSelect,paddingText),
            ...selectorPaddingMargin("margin",marginSelect,marginText),
          }}
        >
          <div className="flex justify-between mb-[1.5rem] items-baseline" >
            <div 
              style={{
                fontFamily:tFamily,
                fontSize:tSize,
                fontWeight:tWeight,
                textTransform:tUpper ?"uppercase":"unset",
                letterSpacing:`${tLetter}px`,
                color:tColor,
                ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
                ...selectorPaddingMargin("margin",tMarginSelect,tMarginText),
              }}
              >
              {title}
            </div>
          </div>
          <div className="options-list flex flex-col gap-[0.5rem]" id="universo-list">
            {collections.map((col)=>{
              const products = col.products.edges
              const findProduct = products.find((elm)=>elm.node.id == currentProduct.id)
              const isHoverCol = col.id === hoveredCol
              return (
                <div 
                  key={col.id}
                  onMouseEnter={()=>setHoveredCol(col.id)}
                  onMouseLeave={()=>setHoveredCol(null)}
                  className="option-item active hover:pl-[10px] flex justify-between items-center cursor-pointer" 
                  data-target="view-origin" 
                  onClick={()=>openDrawer(col)}
                  style={{
                    padding: isHoverCol ?"1rem 0 1rem 10px":"1rem 0",
                    borderBottom:`1px solid ${findProduct || isHoverCol? "#fff3":"#ffffff08"}`,
                    transition:"all 0.4s ease",
                    opacity:findProduct || isHoverCol ?  "1":"0.6",
                  }}
                  >
                  <div className="option-left flex flex-col gap-[4px]">
                    <span 
                      className="option-title"
                      style={{
                        fontFamily:cFamily,
                        fontSize:cSize,
                        fontWeight:findProduct ? cWeight:"400",
                        textTransform:cUpper ?"uppercase":"unset",
                        letterSpacing:findProduct ?`${cLetter}px`:"normal",
                        color:cColor,
                        ...selectorPaddingMargin("padding",tPaddingSelect,tPaddingText),
                        ...selectorPaddingMargin("margin",tMarginSelect,tMarginText),
                        transition:"all 0.3s",
                        
                      }}
                      >
                      {col.title}
                    </span>
                    <span 
                      className="option-desc"
                      style={{
                        fontFamily:pFamily,
                        fontSize:pSize,
                        fontWeight:pWeight,
                        textTransform:pUpper ?"uppercase":"unset",
                        letterSpacing:pLetter>0 ?`${pLetter}px`:"normal",
                        color:pColor,
                        ...selectorPaddingMargin("padding",pPaddingSelect,pPaddingText),
                        ...selectorPaddingMargin("margin",pMarginSelect,pMarginText),
                        
                      }}
                    >
                      {findProduct ? 
                      `${currentProduct.nombre ?currentProduct.nombre :currentProduct.title} ${currentProduct.tooltip ? `-${currentProduct.tooltip}`:""}`
                      :
                      "Seleccionar modelo..."}
                    </span>
                  </div>
                  <div 
                    className="selector-dot flex items-center justify-center"
                    style={{
                      backgroundColor:`${findProduct? cColor:"transparent"}`,
                      boxShadow:findProduct ? "0 0 10px #fff6":"none",
                      width:"8px",
                      height:"8px",
                      borderRadius:"50%",
                      border:`1px solid ${findProduct ? cColor:"#52525B"}`,
                      transition:"all 0.3s"
                    }}
                  ></div>
                </div>
              )
            })}
          </div>
        </div>
        <LateralCollection 
          title={collection?.title} 
          confirmBtn={true}
          show={show}
          close={()=>setShow(false)}
          sendProduct={selectProduct}
          style={{
            background:bgColor,
          }}
          buttonText={lbText}
          estilos={{
            "--brColor":brColor,
            "--brSize":brSize,
            "--brLetter":brLetter,
            "--brUpper":brUpper,
            "--brFamily":brFamily,
            "--brPaddingSelect":brPaddingSelect,
            "--brPaddingText":brPaddingText,
            "--brMarginSelect":brMarginSelect,
            "--brMarginText":brMarginText,
            "--brWeight":brWeight,
            "--ntColor":ntColor,
            "--ntSize":ntSize,
            "--ntLetter":ntLetter,
            "--ntUpper":ntUpper,
            "--ntFamily":ntFamily,
            "--ntPaddingSelect":ntPaddingSelect,
            "--ntPaddingText":ntPaddingText,
            "--ntMarginSelect":ntMarginSelect,
            "--ntMarginText":ntMarginText,
            "--ntWeight":ntWeight,
            "--lbColor":lbColor,
            "--lbBgColor":lbBgColor,
            "--lbRadius":lbRadius,
            "--lbSize":lbSize,
            "--lbLetter":lbLetter,
            "--lbUpper":lbUpper,
            "--lbFamily":lbFamily,
            "--lbPaddingSelect":lbPaddingSelect,
            "--lbPaddingText":lbPaddingText,
            "--lbMarginSelect":lbMarginSelect,
            "--lbMarginText":lbMarginText,
            "--lbWeight":lbWeight,
          } as CSSProperties}
        
        >
         <div
          style={{
            flexGrow:1,
            overflowY:"auto",
            ...selectorPaddingMargin("padding",lcPaddingSelect,!isMobile ? lcPaddingText:"2rem 1.5rem 0px"),
            ...selectorPaddingMargin("padding",lcMarginSelect,lcMarginText)
          }}
          >
            <h2 
              style={{
                fontFamily:ltFamily,
                fontSize:ltSize,
                fontWeight:ltWeight,
                textTransform:ltUpper ?"uppercase":"unset",
                letterSpacing:ltLetter>0 ?`${ltLetter}px`:"normal",
                color:ltColor,
                ...selectorPaddingMargin("padding",ltPaddingSelect,ltPaddingText),
                ...selectorPaddingMargin("margin",ltMarginSelect,ltMarginText),
              
              }}
            >
              {ltTitle}
            </h2>
            <div className="flex flex-col gap-[1rem]">
              {collection?.products?.map((elm)=>{
                const active = elm.node.id === idSelect
                const isHovered = elm.node.id ===hoveredId

                return (
                  <div  
                    key={elm.node.id}
                    onClick={()=>selectModel(elm.node.id)}
                    onMouseEnter={()=>setHoveredId(elm.node.id)}
                    onMouseLeave={()=>setHoveredId(null)}
                    className="group flex gap-[1.5rem] cursor-pointer items-center "
                    style={{
                      border:`1px solid ${active || isHovered ? isHovered ? cpBHColor:cpBAColor:cpBColor}`,
                      backgroundColor:active || isHovered ?  isHovered ? cpBgHColor:cpBgAColor:cpBgColor,
                      borderRadius:`${cpRadius}px`,
                      ...selectorPaddingMargin("padding",cpPaddingSelect,cpPaddingText),                      
                      ...selectorPaddingMargin("margin",cpMarginSelect,cpMarginText),                      
                      transition:"all 0.3s ease",
                    }}
                    >
                    <div
                      className="overflow-hidden"
                      style={{
                        width:`${cpiWidth}px`,
                        height:`${cpiHeight}px`,
                        borderRadius:`${cpiRadius}px`,
                      }}
                    >
                      <img 
                        className={`${active ? "grayscale-0":"grayscale"} group-hover:grayscale-0 w-full h-full object-contain object-center` }
                        src={elm?.node.featuredImage?.url} 
                        alt={elm?.node.featuredImage?.altText} 
                        />
                    </div>
                    <div className="flex grow flex-col justify-center">
                      <span
                        style={{
                          fontFamily:cptFamily,
                          fontSize:cptSize,
                          fontWeight:cptWeight,
                          textTransform:cptUpper ?"uppercase":"unset",
                          letterSpacing:cptLetter>0 ?`${cptLetter}px`:"normal",
                          color:cptColor,
                          ...selectorPaddingMargin("padding",cptPaddingSelect,cptPaddingText),
                          ...selectorPaddingMargin("margin",cptMarginSelect,cptMarginText),
              
                        }}
                      >
                        {elm?.node.nombre?.value ? elm.node.nombre.value:elm.node.title}
                      </span>
                      <span
                        style={{
                          fontFamily:cptlFamily,
                          fontSize:cptlSize,
                          fontWeight:cptlWeight,
                          textTransform:cptlUpper ?"uppercase":"unset",
                          letterSpacing:cptlLetter>0 ?`${cptLetter}px`:"normal",
                          color:cptlColor,
                          ...selectorPaddingMargin("padding",cptlPaddingSelect,cptlPaddingText),
                          ...selectorPaddingMargin("margin",cptlMarginSelect,cptlMarginText),
                          lineHeight:"1.4"
                        }}
                        >
                        {elm?.node.tooltip?.value ? elm.node.tooltip.value:"Calidad, confort y exclusividad en un solo sitio."}
                      </span>
                    </div>
                    <div 
                      className=" md:mr-[10px] w-[10px] h-[10px] md:w-[16px] md:h-[16px] rounded-[50%] flex justify-content items-center"
                      style={{
                        border:`1px solid ${active?"#fff":"#52525B"}`,
                        background:active?"#fff":"unset",
                        boxShadow:active?"0 0 10px #fff6":"unset",
                        transition:"all 0.3s"
                      }}
                    ></div>
                  </div>
                )
              })}
            </div>

         </div>
        </LateralCollection>
      </Section>
    )
  }
  return (
    <Section {...rest} >

    </Section>
  )
}

export const schema = createSchema({
  title:"selector variant",
  type:"selector-variant",
  settings:[
    {
      group:"General",
      inputs:[
        {
          type:'text',
          label:'title',
          name:'title',
          defaultValue:'0.1 UNIVERSO & MODELO',
        },
        {
          type:'collection-list',
          label:'collections',
          name:'list',
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
          defaultValue:'b',
        },
        {
          type:'text',
          label:'Padding text',
          name:'paddingText',
          defaultValue:"3.5rem"
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
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'marginText',
        },
        {
          type:'heading',
          label:'title'
        },
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'tSize',
          defaultValue:'0.9rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'tLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'tUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'tFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
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
          label:'Padding text',
          name:'tPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
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
          label:'Margin text',
          name:'tMarginText',
        },
        {
          type:'select',
          label:'Font weight',
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
          defaultValue:'600',
        },    
      ]
    },
    {
      group:"collection selector",
      inputs:[
        {
          type:'heading',
          label:'title collection'
        },
        {
          type:'color',
          label:'color',
          name:'cColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'cSize',
          defaultValue:'1rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'cLetter',
          defaultValue:0.5,
          configs:{
            min:0,
            max:50,
            step:0.5,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'cUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'cFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'cPaddingSelect',
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
          name:'cPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'cMarginSelect',
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
          name:'cMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'cWeight',
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
          defaultValue:'600',
        },    
        {
          type:'heading',
          label:'selected product'
        },
        {
          type:'color',
          label:'color',
          name:'pColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'pSize',
          defaultValue:'0.75rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'pLetter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'pUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'pFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'pPaddingSelect',
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
          name:'pPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'pMarginSelect',
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
          name:'pMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'pWeight',
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
    {
      group:"lateral selector",
      inputs:[
        {
          type:'color',
          label:'color',
          name:'bgColor',
          defaultValue:'#050505',
        },
        // nose donde va ahora mismo
        {
          type:'color',
          label:'color',
          name:'borderColor',
          defaultValue:'#FFFFFF',
        },
        // nose donde va ahora mismo
        {
          type:'select',
          label:'Padding type content',
          name:'lcPaddingSelect',
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
          label:'Padding text content',
          name:'lcPaddingText',
          defaultValue:"3rem 4rem 0 4rem"
        },
        {
          type:'select',
          label:'Margin type content',
          name:'lcMarginSelect',
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
          label:'Margin text content',
          name:'lcMarginText',
        },
        {
          type:'heading',
          label:'button return'
        },
        {
          type:'color',
          label:'color',
          name:'brColor',
          defaultValue:'#A1A1AA',
        },
        {
          type:'text',
          label:'font size',
          name:'brSize',
          defaultValue:'0.75rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'brLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'brUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'brFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'brPaddingSelect',
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
          name:'brPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'brMarginSelect',
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
          name:'brMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'brWeight',
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
          defaultValue:'600',
        },    
        {
          type:'heading',
          label:'nav title'
        },
        {
          type:'color',
          label:'color',
          name:'ntColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'ntSize',
          defaultValue:'0.75rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'ntLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'ntUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'ntFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'ntPaddingSelect',
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
          name:'ntPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'ntMarginSelect',
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
          name:'ntMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'ntWeight',
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
          defaultValue:'600',
        },    
        {
          type:'heading',
          label:'title'
        },
        {
          type:'text',
          label:'title',
          name:'ltTitle',
          defaultValue:'Modelos Disponibles',
        },
        {
          type:'color',
          label:'color',
          name:'ltColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'ltSize',
          defaultValue:'2rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'ltLetter',
          defaultValue:1,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'ltUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'ltFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'ltPaddingSelect',
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
          name:'ltPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'ltMarginSelect',
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
          name:'ltMarginText',
          defaultValue:'2rem'
        },
        {
          type:'select',
          label:'Font weight',
          name:'ltWeight',
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
        {
          type:'heading',
          label:'button'
        },
        {
          type:'text',
          label:'text',
          name:'lbText',
          defaultValue:'Confirmar Selección',
        },
        {
          type:'color',
          label:'color',
          name:'lbColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'background color',
          name:'lbBgColor',
          defaultValue:'#fff',
        },
        {
          type:'range',
          label:'border radius',
          name:'lbRadius',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'text',
          label:'font size',
          name:'lbSize',
          defaultValue:'0.85rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'lbLetter',
          defaultValue:2,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'lbUpper',
          defaultValue:true,
        },
        {
          type:'text',
          label:'font family',
          name:'lbFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'lbPaddingSelect',
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
          name:'lbPaddingText',
          defaultValue:"1.2rem"
        },
        {
          type:'select',
          label:'Margin type',
          name:'lbMarginSelect',
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
          name:'lbMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'lbWeight',
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
          defaultValue:'600',
        },    
      
      ]
    },
    {
      group:"lateral selector card product",
      inputs:[
        {
          type:'color',
          label:'background color (default)',
          name:'cpBgColor',
          defaultValue:'#ffffff05',
        },
        {
          type:'color',
          label:'background color (active)',
          name:'cpBgAColor',
          defaultValue:'#ffffff0d',
        },
        {
          type:'color',
          label:'background color (hover)',
          name:'cpBgHColor',
          defaultValue:'#ffffff0a',
        },
        {
          type:'color',
          label:'border color (default)',
          name:'cpBColor',
          defaultValue:'#ffffff0d',
        },
        {
          type:'color',
          label:'border color (active)',
          name:'cpBAColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'border color (hover)',
          name:'cpBHColor',
          defaultValue:'#ffffff33',
        },
        {
          type:'range',
          label:'border radius',
          name:'cpRadius',
          defaultValue:8,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'px',
          }
        },
        {
          type:'select',
          label:'Padding type',
          name:'cpPaddingSelect',
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
          name:'cpPaddingText',
          defaultValue:"1rem"
        },
        {
          type:'select',
          label:'Margin type',
          name:'cpMarginSelect',
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
          name:'cpMarginText',
        },

        {
          type:'heading',
          label:'img'
        },
        {
          type:'range',
          label:'width',
          name:'cpiWidth',
          defaultValue:80,
          configs:{
            min:0,
            max:500,
            step:1,
            unit:'px',
          }
        },
        {
          type:'range',
          label:'height',
          name:'cpiHeight',
          defaultValue:100,
          configs:{
            min:0,
            max:500,
            step:1,
            unit:'px',
          }
        },
        {
          type:'range',
          label:'borderRadius',
          name:'cpiRadius',
          defaultValue:4,
          configs:{
            min:0,
            max:500,
            step:1,
            unit:'px',
          }
        },
        {
          type:'heading',
          label:'title'
        },
        {
          type:'color',
          label:'color',
          name:'cptColor',
          defaultValue:'#fff',
        },
        {
          type:'text',
          label:'font size',
          name:'cptSize',
          defaultValue:'1.1rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'cptLetter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'cptUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'cptFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'cptPaddingSelect',
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
          name:'cptPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'cptMarginSelect',
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
          name:'cptMarginText',
          defaultValue:"4px"
        },
        {
          type:'select',
          label:'Font weight',
          name:'cptWeight',
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
          defaultValue:'500',
        },   
        {
          type:'heading',
          label:'tooltip'
        },
          {
          type:'color',
          label:'color',
          name:'cptlColor',
          defaultValue:'#71717A',
        },
        {
          type:'text',
          label:'font size',
          name:'cptlSize',
          defaultValue:'0.8rem',
        },
        {
          type:'range',
          label:'letter spacing',
          name:'cptlLetter',
          defaultValue:0,
          configs:{
            min:0,
            max:50,
            step:1,
            unit:'px',
          }
        },
        {
          type:'switch',
          label:'uppercase',
          name:'cptlUpper',
          defaultValue:false,
        },
        {
          type:'text',
          label:'font family',
          name:'cptlFamily',
          defaultValue:'Montserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'cptlPaddingSelect',
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
          name:'cptlPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'cptlMarginSelect',
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
          name:'cptlMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'cptlWeight',
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
    }

  ]
})