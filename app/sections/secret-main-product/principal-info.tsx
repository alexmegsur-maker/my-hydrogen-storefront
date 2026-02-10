import { createSchema } from "@weaverse/hydrogen"
import { useEffect } from "react"
import { Link, useLocation } from "react-router"
import { useInfoSecret } from "~/stores/infoSecretStore"
import { selectorPaddingMargin, truncate } from "~/utils/general"

interface PrincipalInfoProps{
  bread:boolean;
  stars:boolean;
  pageView:boolean;
  separator:boolean;
  space:number;
  paddingSelect:string;
  paddingText:string;
  marginSelect:string;
  marginText:string;
  breadSize:string;
  breadColor:string;
  breadResalColor:string;
  resalt:string;
  tSize:string;
  tColor:string;
  tAlignment:"left"|"center"|"right"|"justify";
  tPaddingSelect:string;
  tPaddingText:string;
  tMarginSelect:string;
  tMarginText:string;
  tWeight:string;
  dSize:string;
  tFamily:string;
  dColor:string;
  dAlignment:"left"|"center"|"right"|"justify";
  dPaddingSelect:string;
  dPaddingText:string;
  dMarginSelect:string;
  dMarginText:string;
  dWeight:string;
  dFamily:string;
  bSize:string;
  bColor:string;
  bBgColor:string;
  bAlignment:"left"|"center"|"right";
  bPaddingSelect:string;
  bPaddingText:string;
  bMarginSelect:string;
  bMarginText:string;
  bWeight:string;
  bFamily:string;
  bRadius:number;
  borderSize:number;
   
}

function  PrincipalInfo(props:PrincipalInfoProps){
  const {bread,
  stars,
  pageView,
  separator,
  space,
  paddingSelect,
  paddingText,
  marginSelect,
  marginText,
  breadSize,
  breadColor,
  breadResalColor,
  resalt,
  tSize,
  tColor,
  tAlignment,
  tPaddingSelect,
  tPaddingText,
  tMarginSelect,
  tMarginText,
  tWeight,
  tFamily,
  dSize,
  dColor,
  dAlignment,
  dPaddingSelect,
  dPaddingText,
  dMarginSelect,
  dMarginText,
  dWeight,
  dFamily,
  bSize,
  bColor,
  bBgColor,
  bAlignment,
  bPaddingSelect,
  bPaddingText,
  bMarginSelect,
  bMarginText,
  bWeight,
  bFamily,
  bRadius,
  borderSize,
  } = props

  const info = useInfoSecret((state)=>state.infoSecret)
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x)=>x)

  if(info){
    
    return(
      <section
        style={{
          borderBottom:separator && "1px solid gray",
          ...selectorPaddingMargin('padding',paddingSelect,paddingText),
          ...selectorPaddingMargin('margin',marginSelect,marginText),
        }}
      >
        <div
          className="flex flex-col"
          style={{
            gap:`${space}px`
          }}
        >
          <div>
            {bread && 
              <div 
                className="flex"
                style={{
                  color:breadColor,
                  fontSize:breadSize,
                }}
              >
                <Link to="/">Home</Link>
                {pathnames.map((name,index)=>{
                  const routeTo= `${pathnames.slice(0,index+1).join('/')}`;
                  return(
                    <div key={index}>
                      <span> / </span>
                      {index === pathnames.length - 1 ? (
                        <span 
                          style={{
                            fontWeight:resalt && 'bold',
                            color:resalt ? breadResalColor : breadColor
                          }}
                          >
                            {name == info.handle ? info.title : name}
                          </span>
                      ):(
                        <Link to={ `/${routeTo}`}>{ name == info.handle ? info.title : name}</Link>
                      )}
                    </div>
                  )
                })}
              </div>
            }
            {stars && 
              <div>
                {/* reseñas queda pendiente hasta que se ponga en marcha */}
              </div>
            }
          </div>

          <h2
            style={{
              fontSize:tSize,
              color:tColor,
              textAlign:tAlignment,
              ...selectorPaddingMargin('padding',tPaddingSelect,tPaddingText),
              ...selectorPaddingMargin('margin',tMarginSelect,tMarginText),
              fontWeight:tWeight,
              fontFamily:tFamily
            }}
          >
            {info.title}
          </h2>
          <p
            style={{
              fontSize:dSize,
              color:dColor,
              textAlign:dAlignment,
              ...selectorPaddingMargin('padding',dPaddingSelect,dPaddingText),
              ...selectorPaddingMargin('margin',dMarginSelect,dMarginText),
              fontWeight:dWeight,
              fontFamily:dFamily
            }}
          >
            {truncate(info.description,41)}
          </p>
          {info.showPage &&
            pageView &&
              <div 
                className="flex w-full"
                style={{
                  justifyContent:bAlignment
                }}
              >
                <button 
                  onClick={()=>info.showPageFun()}
                  className="border-solid" 
                  style={{
                    fontSize:bSize,
                    color:bColor,
                    background:bBgColor,
                    ...selectorPaddingMargin('padding',bPaddingSelect,bPaddingText),
                    ...selectorPaddingMargin('margin',bMarginSelect,bMarginText),
                    fontWeight:bWeight,
                    borderRadius:bRadius,
                    borderWidth: borderSize,
                    borderColor:bColor,
                    fontFamily:bFamily
                  }}  
                  >
                  EXPLORAR CARACTERÍSTICAS
                </button>
              </div>
          }
        </div>
      </section>
    )

  }
  return (
    <h5>no se ha podido cargar informacion</h5>
  )
}

export default PrincipalInfo

export const schema = createSchema({
  type:"secret-info",
  title:"general info",
  limit:1,
  settings:[
    {
      group:"general",
      inputs:[
        {
          type:'switch',
          label:'show breadcrumbs',
          name:'bread',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show stars',
          name:'stars',
          defaultValue:true,
        },
        {
          type:'switch',
          label:'show page',
          name:'pageView',
          defaultValue:true,
        },
        
        {
          type:'switch',
          label:'separator',
          name:'separator',
          defaultValue:true,
        },

        {
          type:'range',
          label:'space between',
          name:'space',
          defaultValue:10,
          configs:{
            min:5,
            max:100,
            step:1,
            unit:'px',
          }
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
      ]
    },
    {
      group:"breadcrumbs",
      inputs:[
        {
          type:'text',
          label:'size',
          name:'breadSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'color',
          name:'breadColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'resalt color',
          name:'breadResalColor',
          defaultValue:'#000',
        },
        {
          type:'switch',
          label:'resalt current',
          name:'resalt',
          defaultValue:true,
        },
      ]
    },
    {
      group:"title",
      inputs:[
        {
          type:'text',
          label:'size',
          name:'tSize',
          defaultValue:'36px',
        },
        {
          type:'color',
          label:'color',
          name:'tColor',
          defaultValue:'#000',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'tAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
              {value:'justify',label:'Justify'},
            ]
          },
          defaultValue:"center",
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
          defaultValue:'400',
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
      group:"description",
      inputs:[
        {
          type:'text',
          label:'size',
          name:'dSize',
          defaultValue:'18px',
        },
        {
          type:'color',
          label:'color',
          name:'dColor',
          defaultValue:'#000',
        },
        {
          type:'select',
          label:'Content alignment',
          name:'dAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
              {value:'justify',label:'Justify'},
            ]
          },
          defaultValue:"center",
        },
        {
          type:'select',
          label:'Padding type',
          name:'dPaddingSelect',
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
          name:'dPaddingText',
        },
        {
          type:'select',
          label:'Margin type',
          name:'dMarginSelect',
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
          name:'dMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'dWeight',
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
          label:'font family',
          name:'dFamily',
          defaultValue:'Monserrat',
        },
      ]
    },
    {
      group:"button",
      inputs:[
        {
          type:'text',
          label:'size',
          name:'bSize',
          defaultValue:'16px',
        },
        {
          type:'color',
          label:'color',
          name:'bColor',
          defaultValue:'#000',
        },
        {
          type:'color',
          label:'background color',
          name:'bBgColor',
          defaultValue:'#00000000',
        },
                {
          type:'select',
          label:'Content alignment',
          name:'bAlignment',
          configs:{
            options:[
              {value:'left',label:'Left'},
              {value:'center',label:'Center'},
              {value:'right',label:'Right'},
            ]
          },
          defaultValue:"center",
        },
        {
          type:'select',
          label:'Padding type',
          name:'bPaddingSelect',
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
          name:'bPaddingText',
          defaultValue:'0.75rem 1.5rem'
        },
        {
          type:'select',
          label:'Margin type',
          name:'bMarginSelect',
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
          name:'bMarginText',
        },
        {
          type:'select',
          label:'Font weight',
          name:'bWeight',
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
          label:'font family',
          name:'bFamily',
          defaultValue:'Monserrat',
        },
        {
          type:'range',
          label:'Border radius',
          name:'bRadius',
          defaultValue:50,
          configs:{
            min:0,
            max:100,
            step:1,
            unit:'px',
          }
        },
        {
          type:'range',
          label:'Border size',
          name:'borderSize',
          defaultValue:1,
          configs:{
            min:0,
            max:10,
            step:1,
            unit:'px',
          }
        },
      ]
    },
  ]
})