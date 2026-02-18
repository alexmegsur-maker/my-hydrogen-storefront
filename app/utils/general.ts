export function selectorPaddingMargin(type:string,selector:string,value:string|null |undefined) {
  if(value!=null || value!=undefined){
    switch(type){
      case "padding":
        switch(selector){
          case "t":
            return{paddingTop:`${value}`}
          case "b":
            return{paddingBottom:`${value}`}
          case "l":
            return{paddingLeft:`${value}`}
          case "r":
            return{paddingRight:`${value}`}
          case "x":
            return{paddingInline:`${value}`}
          case "y":
            return{paddingBlock:`${value}`}
          case "a":
            return{padding:`${value}`}
        }
      case"margin":
        switch(selector){
          case "t":
            return{marginTop:`${value}`}
          case "b":
            return{marginBottom:`${value}`}
          case "l":
            return{marginLeft:`${value}`}
          case "r":
            return{marginRight:`${value}`}
          case "x":
            return{marginInline:`${value}`}
          case "y":
            return{marginBlock:`${value}`}
          case "a":
            return{margin:`${value}`}
        }
    }
  }
return {};
}

export function truncate(str:string,number:number){
  return str.split(" ").splice(0,number).join(" ")
}

export function setFecha(fecha:string,abreviation:boolean = false ){
  let meses=["Enero","Febrero","Marzo","Abril","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
  let mesesAbr=["Ene","Feb","Mar","Abr","Jun","Jul","Ago","Sept","Oct","Nov","Dic"]
  let e= fecha.split("-")
  if(abreviation){

    let correct =`${e[2]} ${mesesAbr[parseInt(e[1])-1]} ${e[0]}`
    return correct
  }
  let correct =`${e[2]} ${meses[parseInt(e[1])-1]} ${e[0]}`
  return correct
}