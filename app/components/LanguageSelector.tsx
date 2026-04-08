import { Value } from '@radix-ui/react-select';
import { useThemeSettings } from '@weaverse/hydrogen';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {COUNTRIES} from '~/utils/const';

export function LanguageSelector() {
  const {pathname, search} = useLocation();
  const navigate = useNavigate();
  const [selectLang,setSelectLang] = useState("ES / EUR");
  const [show,setShow] = useState(false);
  const {headerTColor,headerTHColor,headerTSize}=useThemeSettings()
  const [isHover,setIsHover]=useState(false)

  // Obtenemos el prefijo actual (ej: /en o vacío para default)
  const currentPathPart = `/${pathname.substring(1).split('/')[0].toLowerCase()}`;
  const currentLocale = COUNTRIES[currentPathPart] ? currentPathPart : 'default';

  const handleChange = (e:string,c:string) => {
    const newPrefix = e;
    if(newPrefix === "default"){
      setSelectLang(`ES / ${c.toUpperCase()}`)
      
    }else{
      setSelectLang(`${e.replace("/","").toUpperCase()} / ${c.toUpperCase()}`)
    }
    // Limpiamos el pathname actual de cualquier prefijo previo
    const pathWithoutLocale = COUNTRIES[currentPathPart] 
      ? pathname.replace(currentPathPart, '') 
      : pathname;

    // Construimos la nueva ruta: prefijo + resto del path + query params
    const newPath = `${newPrefix === 'default' ? '' : newPrefix}${pathWithoutLocale}${search}`;
    
    // Redirigimos
    window.location.href = newPath; 
    // Usamos window.location en lugar de navigate para forzar 
    // la recarga del contexto del servidor con el nuevo i18n
  };

  useEffect(()=>{
    let elm = `/${pathname.split("/")[1]}`
    if(COUNTRIES[elm]){
      setSelectLang(`${COUNTRIES[elm].language} / ${COUNTRIES[elm].currency}`)
    }
  },[])

  return (
    <div  onClick={()=>setShow((state)=>!state)}  className="bg-transparent p-1 relative flex cursor-pointer">
        <button 
          onMouseEnter={()=>setIsHover(true)}
          onMouseLeave={()=>setIsHover(false)}
          style={{
            color: isHover ? headerTHColor:headerTColor,
            fontSize:headerTSize
          }}
        >
          {selectLang}
        </button>
        {show && 
          <div 
            className='absolute flex  flex-col w-[200px] right-0  text-white'
            style={{
              marginTop:"26px",
              borderRadius:"5px",
              boxShadow:"0 20px 50px 0 rgba(151, 151, 151, 0.1)",
              border:"1px solid #5757571c",
              background:"#131313"
            }}
          >
            <span
              className='absolute top-0'
              style={{
              width:0,
              height:0,
              borderLeft:"5px solid transparent",
              borderRight:"5px solid transparent",
              borderBottom:"6px solid #131313",
              display:show ? "block":"none",
              transform:"translateY(-100%)",
              right:"20px"
            }}
            ></span>
            {Object.entries(COUNTRIES).map(([key, value]) => (
              <div 
                key={key} 
                className='flex py-[8px] px-[16px] hover:bg-stone-500'
                onClick={()=>handleChange(key,value.currency)}>
                    <img 
                      className='me-1'
                      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${value.country.toLowerCase()}.svg`} 
                      alt={value.country}  
                      style={{
                        width:"30px",
                        height:"20px"
                      }}
                      />
                    {value.label}
              </div>
            ))}
          </div>
        }
    </div>
  );
} 
