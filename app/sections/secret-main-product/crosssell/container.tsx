import { useGSAP } from "@gsap/react";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useCrossell } from "~/stores/crosssellStore";
import { selectorPaddingMargin } from "~/utils/general";

interface crossellContainerProps extends HydrogenComponentProps{
title:string;
color:string;
size:string;
family:string;
paddingSelect:string;
paddingText:string;
marginSelect:string;
marginText:string;
weight:string;
defColor:string;
defColorIcons:string;
defSize:string;
defFamily:string;
defPaddingSelect:string;
defPaddingText:string;
defMarginSelect:string;
defMarginText:string;
defWeight:string;
selectColor:string;
selectColorIcons:string;
selectSize:string;
selectFamily:string;
selectPaddingSelect:string;
selectPaddingText:string;
selectMarginSelect:string;
selectMarginText:string;
selectWeight:string;
selectToolColor:string;
selectToolSize:string;
selectToolFamily:string;
selectToolPaddingSelect:string;
selectToolPaddingText:string;
selectToolMarginSelect:string;
selectToolMarginText:string;
selectToolWeight:string;
selectQtyColor:string;
selectQtySize:string;
navColor:string;
navColorIcons:string;
navSize:string;
navFamily:string;
navWeight:string;
buttonText:string;
buttonColor:string;
buttonBgColor:string;
buttonSize:string;
buttonFamily:string;
buttonWeight:string;
headColor:string;
headSize:string;
headFamily:string;
headPaddingSelect:string;
headPaddingText:string;
headMarginSelect:string;
headMarginText:string;
headWeight:string;
subHeadColor:string;
subHeadSize:string;
subHeadFamily:string;
subHeadPaddingSelect:string;
subHeadPaddingText:string;
subHeadMarginSelect:string;
subHeadMarginText:string;
subHeadWeight:string;
borderColor:string;
selectedColor:string;
cardTColor:string;
cardTSize:string;
cardTFamily:string;
cardTPaddingSelect:string;
cardTPaddingText:string;
cardTMarginSelect:string;
cardTMarginText:string;
cardTWeight:string;
cardToolColor:string;
cardToolSize:string;
cardToolFamily:string;
cardToolPaddingSelect:string;
cardToolPaddingText:string;
cardToolMarginSelect:string;
cardToolMarginText:string;
cardToolWeight:string;
cardPColor:string;
cardPSize:string;
cardPFamily:string;
cardPPaddingSelect:string;
cardPPaddingText:string;
cardPMarginSelect:string;
cardPMarginText:string;
cardPWeight:string;
cardBColor:string;
cardBSize:string;
cardBFamily:string;
cardBPaddingSelect:string;
cardBPaddingText:string;
cardBMarginSelect:string;
cardBMarginText:string;
cardBWeight:string;
}

function CrossellContainer(props:crossellContainerProps) {
  const {title, children}=props
  const container = useRef(null)
  const show = useRef(null)
  const lateral = useRef(null)
  const [size,setSize] = useState(0)
  const addCrossell = useCrossell(state=>state.addCrossell)
  const crossellList =useCrossell(state=>state.crossellObjects)
  const resetSelecteds = useCrossell(state=>state.resetSelecteds)
  const addSelectedProduct = useCrossell(state=>state.addSelected)
  const [currentCrossell,setCurrentCrossell]=useState(null)
  const date = new Date()
  const cardProdTitleStyle={
    c:props.headColor,
    s:props.headSize,
    f:props.headFamily,
    ps:props.headPaddingSelect,
    pt:props.headPaddingText,
    ms:props.headMarginSelect,
    mt:props.headMarginText,
    w:props.headWeight
    
  }
                
  const cardProdDescStyle={
    c:props.subHeadColor,
    s:props.subHeadSize,
    f:props.subHeadFamily,
    ps:props.subHeadPaddingSelect,
    pt:props.subHeadPaddingText,
    ms:props.subHeadMarginSelect,
    mt:props.subHeadMarginText,
    w:props.subHeadWeight
  }

  const cardProdStyle={
    bc:props.borderColor,  
    sc:props.selectedColor,  
    tc:props.cardTColor,
    ts:props.cardTSize,
    tf:props.cardTFamily,
    tps:props.cardTPaddingSelect,
    tpt:props.cardTPaddingText,
    tms:props.cardTMarginSelect,
    tmt:props.cardTMarginText,
    tw:props.cardTWeight,
    ttc:props.cardToolColor,
    tts:props.cardToolSize,
    ttf:props.cardToolFamily,
    ttps:props.cardToolPaddingSelect,
    ttpt:props.cardToolPaddingText,
    ttms:props.cardToolMarginSelect,
    ttmt:props.cardToolMarginText,
    ttw:props.cardToolWeight,
    pc:props.cardPColor,
    ps:props.cardPSize,
    pf:props.cardPFamily,
    pps:props.cardPPaddingSelect,
    ppt:props.cardPPaddingText,
    pms:props.cardPMarginSelect,
    pmt:props.cardPMarginText,
    pw:props.cardPWeight,
    btnc:props.cardBColor,
    btns:props.cardBSize,
    btnf:props.cardBFamily,
    btnps:props.cardBPaddingSelect,
    btnpt:props.cardBPaddingText,
    btnms:props.cardBMarginSelect,
    btnmt:props.cardBMarginText,
    btnw:props.cardBWeight,
  }

  useGSAP(()=>{
    show.current = gsap.timeline({paused:true}).to(lateral.current,{
      x:0,
      duration:1,
      ease:"none"
    })
  },{scope:container})

  const showLateral=()=>{
    if(show.current){
      show.current.play()
    }
  }

  const closeLateral=()=>{
    if(crossellList){
      let cross = crossellList.crossell.find((elm)=>elm.id===`crossell-${title.trim().toLowerCase()}`)
      let checkBox = lateral.current.querySelectorAll("input[type='checkbox']")
      
      if(cross.selecteds.length==0){
        checkBox.forEach(element => {
          if(element.checked == true){
            element.click()
          }
        });
      }else{
        
        checkBox.forEach(element => {
          let has = cross.selecteds.find((elm)=>elm.id == element.dataset.productid)
          if(!has && element.checked==true){
            element.click()
          }else if(has && element.checked==false){
            element.click()
          }
        });
      }
    }
    
    if(show.current){
      show.current.reverse()
    }
  }

  const sendProducts =()=>{
    let inputs = [...lateral.current.querySelectorAll("input[type='number']")].filter((elm)=>elm.value != 0)
    resetSelecteds(`crossell-${title.trim().toLowerCase()}`)
    if(inputs.length == 0){
      show.current.reverse()
      return
    }
    

    inputs.forEach(element=>{
        addSelectedProduct(`crossell-${title.trim().toLowerCase()}` , element.dataset.productid,element.value)
      }
    )
    show.current.reverse()
  }

  useEffect(()=>{
    if(container.current){
      let wSize = container.current.parentElement.parentElement.getBoundingClientRect().width

      setSize(wSize)
    }
  },[container])

  useEffect(()=>{
    const cross= {
      id:`crossell-${title.trim().toLowerCase()}`,
      products:[],
      selecteds:[],
    }
    addCrossell(cross)
  },[])

  useEffect(()=>{
    if(crossellList){
      const cross=crossellList.crossell.find((elm)=>elm.id == `crossell-${title.trim().toLowerCase()}`)
      setCurrentCrossell(cross)
    }
  },[crossellList])

  return (
    <div ref={container}>
      <div
        data-context="pdp-chairs-fbt"
        data-testid="e2e-selector-frequently-bought-together"
        className="cursor-pointer border-b border-t-0 border-l-0 border-solid border-r-0 bg-[#f3f4f6]border-[#181817] e2e-selector-frequently-bought-together frequentylyboughtdrawer [&amp;&amp;]:px-0 lg:[&amp;&amp;]:px-0 [&amp;&amp;]:py-0 lg:[&amp;&amp;]:py-0 border-b-0"
      >
        <div 
          className="flex items-center"
          onClick={showLateral}
          >
          <div className="flex-1">
            <div className="mb-3 lg:mb-4 flex items-center justify-between">
              <div
                className="text-[#181817] text-[1.125rem]font-bold"
                style={{
                  color:props.color,
                  fontSize:props.size,
                  fontFamily:props.family,
                  ...selectorPaddingMargin("padding",props.paddingSelect,props.paddingText),
                  ...selectorPaddingMargin("margin",props.marginSelect,props.marginText),
                  fontWeight:props.weight
                }}
              >
                {title}
              </div>
              {currentCrossell?.selecteds.length > 0 &&(
                <button
                  onClick={
                    (e)=>{
                      e.stopPropagation()
                      resetSelecteds(`crossell-${title.trim().toLowerCase()}`)
                    }
                  }
                  className="bg-transparent border-0 p-0 st-link-xs st-colour-link-grey underline"
                >
                  Quitar
                </button>
              ) }
            </div>
            <div
              data-context="pdp-chairs-fbt"
              className="border-b-0 border-r-0 border-l-2 border-t-0 border-solid ps-3 lg:ps-4 ms-1"
              style={{
                borderColor:props.selectColorIcons
              }}
              >
              <div
                data-context="pdp-chairs-fbt"
                className="[&amp;_*]:pointer-events-none st-colour-text-placeholder text-[1.875rem] font-[400]  font-bold"
              >
                {currentCrossell?.selecteds.length > 0 ? 
                  currentCrossell.selecteds.map((elm,index)=>{
                    let currentProduct = currentCrossell.products.find((e)=>e.id==elm.id)
                    let publisedDate= currentProduct.fecha.split("-")
                    let checkYear =  publisedDate[0]<date.getFullYear()?true:false 
                    let checkDate= checkYear ? false :((date.getMonth()+1)-parseInt(publisedDate[1]))< 6&& true
                    return(
                    <div
                      key={index}
                      className="flex text-[1.125rem] font-[400] items-center"
                      style={{
                        marginTop:index != 0 && "1rem"
                      }}
                    >
                      <div className="flex-none">
                        <div className="w-[70px] h-[70px] rounded border border-solid overflow-hidden">
                          <img
                            className="w-full h-full"
                            src={currentProduct.media[0].url}
                            alt={currentProduct.media[0].alt}
                          />
                        </div>
                      </div>
                      <div className="flex-1 st-colour-text-emphasis st-text-[1.125rem] font-[400] ps-4">
                        <div className="flex gap-1 flex-wrap e2e-section-status">
                          {currentProduct.comparePrice &&
                            <span className="uppercase flex gap-1 items-center justify-center w-fit  text-white st-text-tag-sm p-[2px] lg:p-1 bg-[#dc2626]  ">
                              Oferta
                            </span>
                          }
                          {checkDate &&
                            <span className="uppercase flex gap-1 items-center justify-center w-fit  text-white st-text-tag-sm p-[2px] lg:p-1 bg-black  ">
                              Nuevo
                            </span>
                          }
                          {currentProduct.available && currentProduct.inventory<=0 &&
                            <span className="uppercase flex gap-1 items-center justify-center w-fit  text-white bg-[#F99704] st-text-tag-sm p-[2px] lg:p-1  ">
                              Reservar {currentProduct.fechaReserva && `: ${currentProduct.fechaReserva}`}
                            </span>
                          }
                        </div>
                        <div 
                          style={{
                            color:props.selectColor,
                            fontSize:props.selectSize,
                            fontFamily:props.selectFamily,
                            ...selectorPaddingMargin("padding",props.selectPaddingSelect,props.selectPaddingText),
                            ...selectorPaddingMargin("margin",props.selectMarginSelect,props.selectMarginText),
                            fontWeight:props.selectWeight
                          }}
                        >
                          {currentProduct.title}
                        </div>
                        {currentProduct.tooltip &&
                        <div
                         style={{
                            color:props.selectToolColor,
                            fontSize:props.selectToolSize,
                            fontFamily:props.selectToolFamily,
                            ...selectorPaddingMargin("padding",props.selectToolPaddingSelect,props.selectToolPaddingText),
                            ...selectorPaddingMargin("margin",props.selectToolMarginSelect,props.selectToolMarginText),
                            fontWeight:props.selectToolWeight
                         }}
                        >
                          {currentProduct.tooltip}
                        </div>
                        }
                      </div>
                      <div className="flex-none px-4">
                        <div 
                          className="font-normal"
                          style={{
                            color:props.selectQtyColor,
                            fontSize:props.selectQtySize
                          }}
                        >
                          x{elm.quantity}
                        </div>
                      </div>
                    </div>
                    )
                  })
                  : 
                  <p
                    style={{
                      color:props.defColor,
                      fontSize:props.defSize,
                      fontFamily:props.defFamily,
                      ...selectorPaddingMargin("padding",props.defPaddingSelect,props.defPaddingText),
                      ...selectorPaddingMargin("margin",props.defMarginSelect,props.defMarginText),
                      fontWeight:props.defWeight
                    }}
                  >
                    Seleccionar productos
                  </p>
                }
                
              </div>
            </div>
          </div>
          <div
            data-context="pdp-chairs-fbt"
            className="flex-none [&amp;_*]:pointer-events-none"
          >
            <div>
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z"
                  fill={props.selectColorIcons}
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={lateral}
        className="fixed" 
        style={{
            zIndex: 10,
            transitionDuration: "500ms",
            top: "0px",
            right:`0px`,
            transform: "translate3d(100%, 0px, 0px)",
            width: `${size}px`,
            height: "100vh",
            bottom: "0px",
            overflow: "auto",
            backgroundColor: "rgb(244, 244, 245)",
          }}
        >
        <nav
          role="navigation"
          id="EZDrawer__container4i7qah"
          className="EZDrawer__container undefined"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <div
            data-testid="e2e-selector-frequently-bought-together-drawer"
            className="flex flex-col h-full  e2e-selector-frequently-bought-together-drawer"
          >
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10">
                <div className="bg-black flex text-white  items-center overflow-hidden">
                  <div
                    data-testid="e2e-button-drawer-close"
                    className="cursor-pointer flex-none flex flex-row py-4 pe-4 items-center w-full"
                    onClick={closeLateral}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24.4355 9.6001L14.0008 20.0349L24.4355 30.4697"
                        stroke={props.navColorIcons}
                        strokeWidth="2"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                    <div 
                      className="flex-1 me-[30px]"
                      style={{
                        color:props.navColor,
                        fontSize:props.navSize,
                        fontWeight:props.navWeight,  
                      }}
                      >
                      {title}
                    </div>
                  </div>
                  <div className="flex-1 py-4"></div>
                </div>
              </div>
              <div 
                id={`crossell-${title.trim().toLowerCase()}`}
                className="p-4" 
                data-cardProdTitle={JSON.stringify(cardProdTitleStyle)}
                data-cardProdDesc={JSON.stringify(cardProdDescStyle)}
                data-cardProd={JSON.stringify(cardProdStyle)}
                >
                {children}
              </div>
            </div>
            <div className="flex-none">
              <button
                className="flex gap-2 items-center justify-center text-center p-5 uppercase text-white st-text-cta-small font-bold w-full border-none e2e-button-confirm-selection sticky bottom-0 z-10 cursor-pointer bg-[#a72a2f] hover:bg-[#710c10]"
                onClick={sendProducts}
                style={{
                  color:props.buttonColor,
                  fontSize:props.buttonSize,
                  fontFamily:props.buttonFamily,
                  fontWeight:props.buttonWeight,
                  background:props.buttonBgColor,
                }}
              >
                {props.buttonText}
              </button>
            </div>
          </div>
        </nav>
        <label
          htmlFor="EZDrawer__checkbox4i7qah"
          id="EZDrawer__overlay4i7qah"
          className="EZDrawer__overlay "
          style={{
            backgroundColor: "rgb(0, 0, 0)",
            opacity: 0.4,
            zIndex: 1800,
          }}
        >
          <span className="sr-only">Drawer overlay label</span>
        </label>
      </div>
    </div>
  );
}
export default CrossellContainer;

export const schema = createSchema({
  type: "crossell-container",
  title: "container",
  childTypes: ["crossell-product"],
  settings: [
    {
      group: "title",
      inputs: [
        {
          type: "text",
          label: "text",
          name: "title",
          defaultValue: "texto",
          placeholder: "texto placeholder",
        },
        {
          type:'color',
          label:'color',
          name:'color',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'size',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'family',
          defaultValue:'Monserrat',
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
          defaultValue:'a',
        },
        {
          type:'text',
          label:'Margin text',
          name:'marginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'weight',
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
      ],
    },
    {
      group: "empty products selector",
      inputs: [
        
        {
          type:'color',
          label:'color',
          name:'defColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'color',
          label:'color icons',
          name:'defColorIcons',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'defSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'defFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'defPaddingSelect',
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
          defaultValue:'l',
        },
        {
          type:'text',
          label:'Padding text',
          name:'defPaddingText',
          defaultValue:'16px'
        },
        {
          type:'select',
          label:'Margin type',
          name:'defMarginSelect',
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
          defaultValue:'l',
        },
        {
          type:'text',
          label:'Margin text',
          name:'defMarginText',
          defaultValue:"4px"
        },
        {
          type:'select',
          label:'Font weight',
          name:'defWeight',
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
      ],
    },
    {
      group: "products selector",
      inputs: [
        
        {
          type:'color',
          label:'color',
          name:'selectColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'color',
          label:'color icons',
          name:'selectColorIcons',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'selectSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'selectFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'selectPaddingSelect',
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
          name:'selectPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'selectMarginSelect',
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
          name:'selectMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'selectWeight',
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
          label:'tooltip'
        },
         {
          type:'color',
          label:'color',
          name:'selectToolColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'selectToolSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'selectToolFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Padding type',
          name:'selectToolPaddingSelect',
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
          name:'selectToolPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'selectToolMarginSelect',
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
          name:'selectToolMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'selectToolWeight',
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
          label:'quantity'
        },
        {
          type:'color',
          label:'color',
          name:'selectQtyColor',
          defaultValue:'#FFFFFF',
        },        
        {
          type:'text',
          label:'Font size',
          name:'selectQtySize',
          defaultValue:'16px',
        },

      ],
    },
    {
      group: "lateral popup general",
      inputs: [
        {
          type:'heading',
          label:'nav'
        },
        {
          type:'color',
          label:'color',
          name:'navColor',
          defaultValue:'#fff',
        },
        {
          type:'color',
          label:'color icons',
          name:'navColorIcons',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'navSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'navFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Font weight',
          name:'navWeight',
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
          label:'button'
        },
        {
          type:'text',
          label:'button text',
          name:'buttonText',
          defaultValue:'Confirmar Selección',
        },
        {
          type:'color',
          label:'color',
          name:'buttonColor',
          defaultValue:'#fff',
        },
        {
          type:'color',
          label:'color',
          name:'buttonBgColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'buttonSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'buttonFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'select',
          label:'Font weight',
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
          defaultValue:'600',
        },
      ],
    },
    {
      group: "product heading",
      inputs: [
        {
          type:'heading',
          label:'heading title'
        },
        {
          type:'color',
          label:'title color',
          name:'headColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'headSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'headFamily',
          defaultValue:'Monserrat',
        },
                {
          type:'select',
          label:'Padding type',
          name:'headPaddingSelect',
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
          name:'headPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'headMarginSelect',
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
          defaultValue:'r',
        },
        {
          type:'text',
          label:'Margin text',
          name:'headMarginText',
          defaultValue:"16px"
        },
        {
          type:'select',
          label:'Font weight',
          name:'headWeight',
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
          label:'description'
        },
        {
          type:'color',
          label:'color',
          name:'subHeadColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'subHeadSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'subHeadFamily',
          defaultValue:'Monserrat',
        },
                {
          type:'select',
          label:'Padding type',
          name:'subHeadPaddingSelect',
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
          name:'subHeadPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'subHeadMarginSelect',
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
          defaultValue:'r',
        },
        {
          type:'text',
          label:'Margin text',
          name:'subHeadMarginText',
          defaultValue:"16px"
        },
        {
          type:'select',
          label:'Font weight',
          name:'subHeadWeight',
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
      ],
    },
     {
      group: "product card",
      inputs: [
        {
          type:'color',
          label:'border color',
          name:'borderColor',
          defaultValue:'#FFFFFF',
        },
        {
          type:'color',
          label:'selected color',
          name:'selectedColor',
          defaultValue:'#3790b0',
        },
        {
          type:'heading',
          label:'card title'
        },
        {
          type:'color',
          label:'color',
          name:'cardTColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'cardTSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'cardTFamily',
          defaultValue:'Monserrat',
        },
                {
          type:'select',
          label:'Padding type',
          name:'cardTPaddingSelect',
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
          name:'cardTPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'cardTMarginSelect',
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
          name:'cardTMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'cardTWeight',
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
          label:'tooltip'
        },
        {
          type:'color',
          label:'color',
          name:'cardToolColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'cardToolSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'cardToolFamily',
          defaultValue:'Monserrat',
        },
                {
          type:'select',
          label:'Padding type',
          name:'cardToolPaddingSelect',
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
          name:'cardToolPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'cardToolMarginSelect',
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
          name:'cardToolMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'cardToolWeight',
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
          label:'card price'
        },
        {
          type:'color',
          label:'color',
          name:'cardPColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'cardPSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'cardPFamily',
          defaultValue:'Monserrat',
        },
                {
          type:'select',
          label:'Padding type',
          name:'cardPPaddingSelect',
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
          name:'cardPPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'cardPMarginSelect',
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
          name:'cardPMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'cardPWeight',
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
          label:'button'
        },
        {
          type:'color',
          label:'color',
          name:'cardBColor',
          defaultValue:'#2b2b2b',
        },
        {
          type:'text',
          label:'font size',
          name:'cardBSize',
          defaultValue:'18px',
        },
        {
          type:'text',
          label:'font family',
          name:'cardBFamily',
          defaultValue:'Monserrat',
        },
                {
          type:'select',
          label:'Padding type',
          name:'cardBPaddingSelect',
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
          name:'cardBPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'cardBMarginSelect',
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
          name:'cardBMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'cardBWeight',
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

      ],
    },
  ],
});
