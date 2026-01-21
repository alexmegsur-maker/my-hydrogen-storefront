export interface InfoSecret {
  title:string;
  handle:string;
  description:string;
  showPage:boolean;
  showPageFun:()=>void;
}

export interface  infoSecretStore{
  infoSecret:InfoSecret;
  setComponents:(newComponents:InfoSecret)=>void;
  setUpdatePage:(page:boolean)=>void;

}