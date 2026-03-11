import { useEffect, useState } from "react";
import type { ReservaQuery } from "storefront-api.generated";
import { usePrefixPathWithLocale } from "~/hooks/use-prefix-path-with-locale";
import "~/styles/reserva-bar.css";
import { setFecha } from "~/utils/general";

type ReservaBarEstilo ={
  barColor1?:string;
  barColor2?:string;
  barFamily?:string;
  barTSize?:string;
  barTColor?:string;
  barTWeight?:string;
  barPsize?:string;
  barPColor?:string;
  barPWeight?:string;
  barFsize?:string;
  barFColor?:string;
  barFWeight?:string;  
}

interface ReservaBarProps{
  productHandle:string
  estilos:ReservaBarEstilo
}



interface ApiResponseReserva{
  result:ReservaQuery;
  ok:boolean;
  errorMessage?:string;
}

function ReservaBar(props:ReservaBarProps) {
  const { productHandle,estilos } = props
  const getReservaUrl=usePrefixPathWithLocale(`api/reserva`);
  const [reserva,setReserva] = useState(null)
  const [porcentaje,setPorcentaje] =useState(100)

  useEffect(()=>{
    if(productHandle ){
      console.log("productHandle",productHandle)
      const loadReservas= async()=>{
        const res = await fetch(getReservaUrl,{
          method:"POST",
          headers:{"content-Type":"application/json"},
          body:JSON.stringify({handle:productHandle})
        })
        console.log("res",res)
        const data = await res.json() as ApiResponseReserva
        if(data.ok){
          setReserva(data.result.product)
        }
      }
      loadReservas()
    }
  },[productHandle])

  useEffect(()=>{
    if(reserva){
      if( reserva.total && reserva.vendido){
        let aux = 100 - (parseInt(reserva.vendido.value)/parseInt(reserva.total.value))*100
        setPorcentaje(Math.floor(aux))
      }
    }
  },[reserva])

  return (
    <>
      <div 
        className="reserva-progress relative mb-2"
        style={{
          fontFamily:estilos.barFamily
        }}
      >
        <div className="flex justify-between">
          <p 
            className="font-bold"
            style={{
              fontSize:estilos.barTSize,
              color:estilos.barTColor,
              fontWeight:estilos.barTWeight
            }}
          >
            Reserva fase <span>1</span> 
          </p>
        </div>
        <div className="progress-bar">
          <div className="wave"></div>
          <div 
          className="sold"
          style={{
            width:`${Math.floor(porcentaje)}%`,
            marginLeft:`${porcentaje}%`
          }}
          ></div>
        </div>
        <p className="mb-2 ">
          <span 
            className="font-bold"
            style={{
              fontSize:estilos.barPsize,
              color:estilos.barPColor,
              fontWeight:estilos.barPWeight
            }}
          >{porcentaje}% de unidades disponibles </span>
          {reserva?.fecha?.value && 
          <span style={{
              fontSize:estilos.barFsize,
              color:estilos.barFColor,
              fontWeight:estilos.barFWeight
            }}>
            -Envío estimado para el {setFecha(reserva?.fecha?.value)} o antes
          </span>}
        </p>
      </div>
    </>
  );
}
export default ReservaBar;
