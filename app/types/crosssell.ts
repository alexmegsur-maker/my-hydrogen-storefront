interface Imagen{
  alt:string;
  url:string;
}

export interface CrossellProduct{
  id:string;
  title:string;
  handle:string;
  description:string;
  media:Imagen[];
  especificaciones?:string;
  price:string;
  comparePrice?:string;
  tooltip?:string;
  available:boolean;
  variantId:string;
  inventory:number;
  fecha:string;
  fechaReserva?:string;
  selector:string | null;

}
export interface CrossellSelected{
  id:string;
  quantity:number;
}

export interface CrossellObject {
  id:string;
  title:string;
  products:CrossellProduct[];
  selecteds:CrossellSelected[];
}

export interface selectorIds{
  crossId:string;
  productsId:string[];
}

export interface Crossell{
  crossell:CrossellObject[];
  dialog:DialogCrossell;
  open:boolean;
  selector:string | null;
  selectorIds:selectorIds[];
}

export interface DialogCrossell{
  crossId:string;
  productId:string;
}

export interface CrosssellStore{
  crossellObjects:Crossell;
  addCrossell:(newCrossell:CrossellObject)=>void;
  addSelected:(idCross:string,idProduct:string,quantity:number)=>void;
  removeSelected:(idCross:string,idProduct:string)=>void;
  resetSelecteds:(idCross:string)=>void;
  changeVisibility:(check:boolean)=>void;
  setDialog:(idProduct:string)=>void;
  addProduct:(idCross:string,product:CrossellProduct)=>void;
  setSelector:(selector:string)=>void;
  setSelectorIds:(id:string,selector:string[])=>void;
  resetSelectorIds:()=>void;
}