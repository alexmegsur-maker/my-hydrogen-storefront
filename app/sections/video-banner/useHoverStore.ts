import { create } from "zustand";

type hoverViBanner={
  active:boolean;

  changeActive:(isHover:boolean)=>void;
}

export const useHoverStore = create<hoverViBanner>((set)=>({
  active:false,
  changeActive:(isHover)=> set({active:isHover})
}))