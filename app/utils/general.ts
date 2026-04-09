import type { CSSProperties } from "react"

export function selectorPaddingMargin(type:string,selector:string,value:string|null |undefined) {
  if(value!=null || value!=undefined){
    switch(type){
      case "padding":
        switch(selector){
          case "t":
            return{paddingTop:`${value}`}as CSSProperties
          case "b":
            return{paddingBottom:`${value}`}as CSSProperties
          case "l":
            return{paddingLeft:`${value}`}as CSSProperties
          case "r":
            return{paddingRight:`${value}`}as CSSProperties
          case "x":
            return{paddingInline:`${value}`}as CSSProperties
          case "y":
            return{paddingBlock:`${value}`}as CSSProperties
          case "a":
            return{padding:`${value}`}as CSSProperties
        }
      case"margin":
        switch(selector){
          case "t":
            return{marginTop:`${value}`}as CSSProperties
          case "b":
            return{marginBottom:`${value}`}as CSSProperties
          case "l":
            return{marginLeft:`${value}`}as CSSProperties
          case "r":
            return{marginRight:`${value}`}as CSSProperties
          case "x":
            return{marginInline:`${value}`}as CSSProperties
          case "y":
            return{marginBlock:`${value}`}as CSSProperties
          case "a":
            return{margin:`${value}`}as CSSProperties
        }
    }
  }
return {};
}

export function truncate(str:string,number:number){
  return str.split(" ").splice(0,number).join(" ")
}

export function setFecha(fecha:string,abreviation:boolean = false,year:boolean = false ){
  let meses=["Enero","Febrero","Marzo","Abril","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
  let mesesAbr=["Ene","Feb","Mar","Abr","Jun","Jul","Ago","Sept","Oct","Nov","Dic"]
  let e= fecha.split("-")
  if(abreviation){

    let correct =`${e[2]} ${mesesAbr[parseInt(e[1])-1]} ${year ? e[0]:""}`
    return correct
  }
  let correct =`${e[2]} ${meses[parseInt(e[1])-1]} ${year ? e[0]:""}`
  return correct
}


export function renderRichText(jsonString: string | undefined): string {
  if (!jsonString) return "";

  try {
    // 1. Parseamos y forzamos el tipo a 'any' para evitar que TS bloquee el acceso a propiedades
    const data = JSON.parse(jsonString) as any;
    
    // Si no tiene hijos, devolvemos el string original o vacío
    if (!data || !data.children) return jsonString || "";

    let html = "";

    // 2. Función para procesar el texto (bold, italic, value)
    const processChildren = (nodes: any[]): string => {
      if (!nodes) return "";
      return nodes.map((node: any) => {
        let text = node.value || "";

        // Limpiamos saltos de línea de Shopify (\n) por etiquetas <br/>
        text = text.replace(/\n/g, "<br />");

        if (node.bold) text = `<strong>${text}</strong>`;
        if (node.italic) text = `<em>${text}</em>`;
        
        return text;
      }).join("");
    };

    // 3. Recorremos los nodos principales (p, heading, list)
    data.children.forEach((node: any) => {
      switch (node.type) {
        case 'heading':
          const level = node.level || 1;
          html += `<h${level} style="color: white; margin-top: 1.5rem; font-weight: bold;">${processChildren(node.children)}</h${level}>`;
          break;

        case 'paragraph':
          html += `<p style="margin-bottom: 1.2rem; line-height: 1.6;">${processChildren(node.children)}</p>`;
          break;

        case 'list':
          const tag = node.listType === 'ordered' ? 'ol' : 'ul';
          const items = node.children?.map((li: any) => 
            `<li style="margin-bottom: 0.5rem;">${processChildren(li.children)}</li>`
          ).join("") || "";
          
          const listStyle = node.listType === 'ordered' ? 'decimal' : 'disc';
          html += `<${tag} style="padding-left: 1.5rem; margin-bottom: 1rem; list-style-type: ${listStyle};">${items}</${tag}>`;
          break;

        default:
          // Si hay texto suelto fuera de un p
          if (node.value) html += processChildren([node]);
          break;
      }
    });

    return html;
  } catch (error) {
    console.error("Error en renderRichText:", error);
    return jsonString || ""; 
  }
}
