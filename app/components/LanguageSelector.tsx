import { useThemeSettings } from '@weaverse/hydrogen';
import { useState } from 'react';
import { useLocation, useMatches } from 'react-router';
import {COUNTRIES} from '~/utils/const';
import { getHreflangLinks, getLocaleSwitchPath } from '~/utils/hreflang-links';
import { splitLocale } from '~/utils/localized-paths';

function localeLabel(key: string) {
  const locale = COUNTRIES[key] ?? COUNTRIES.default;
  return `${locale.language} / ${locale.currency}`;
}

export function LanguageSelector() {
  const {pathname, search} = useLocation();
  const matches = useMatches();
  const [show,setShow] = useState(false);
  const {headerTColor,headerTHColor,headerTSize}=useThemeSettings()
  const [isHover,setIsHover]=useState(false)

  // Prefijo actual (ej: /en o vacío para default)
  const {prefix: currentPrefix} = splitLocale(pathname);
  // Mismo clúster hreflang que el <head> (root.tsx): productos, colecciones y
  // artículos tienen el handle traducido por idioma, así que la URL correcta en
  // el idioma destino sale de ahí. Reutilizar el handle actual falla al
  // cambiar entre dos idiomas que no son el español (Shopify no lo reconoce).
  const links = getHreflangLinks({ pathname, matches, hasError: false });

  const rememberChoice = (prefix: string) => {
    // Guardar preferencia para que el geo-redirect no sobreescriba la elección
    document.cookie = `locale_pref=${encodeURIComponent(prefix)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };

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
          {localeLabel(currentPrefix || 'default')}
        </button>
        {/* Siempre en el HTML (oculto si está cerrado): así los enlaces entre
            versiones de idioma son rastreables, no solo clics de JavaScript */}
        <div
          className='absolute flex  flex-col w-[200px] right-0  text-white'
          style={{
            display: show ? "flex" : "none",
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
          {Object.entries(COUNTRIES).map(([key, value]) => {
            const prefix = key === 'default' ? '' : key;
            const lang = value.language.toLowerCase();
            return (
              <a
                key={key}
                href={getLocaleSwitchPath({ pathname, search, links, targetPrefix: prefix })}
                hrefLang={lang}
                lang={lang}
                className='flex py-[8px] px-[16px] hover:bg-stone-500'
                onClick={()=>rememberChoice(prefix)}>
                    <img
                      className='me-1'
                      // lazy: con el menú cerrado (display:none) no se descargan
                      loading='lazy'
                      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${value.country.toLowerCase()}.svg`}
                      alt={value.country}
                      style={{
                        width:"30px",
                        height:"20px"
                      }}
                      />
                    {value.label}
              </a>
            );
          })}
        </div>
    </div>
  );
}
