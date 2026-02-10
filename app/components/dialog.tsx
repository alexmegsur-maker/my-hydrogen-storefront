import { useEffect, useRef, type ReactNode } from "react";
import "~/styles/dialog.css"

interface DialogProps{
  className?:string;
  show:boolean;
  onClose:()=>void;
  children:ReactNode;
}

function Dialog(props:DialogProps){
  const{children,show,className,onClose}=props
  const dialogRef= useRef<HTMLDialogElement>(null)
  
  const handleKeyUp=(e)=>{
    if(e.key=="Escape"){
      closeDialog()
    }
  }
  useEffect(()=>{
    const dialog = dialogRef.current
    if(!dialog) return
    if(show==false){
      setTimeout(()=>{
        dialog.style.display="none"
      },250)
      document.removeEventListener('keyup',handleKeyUp)
    }else{
      dialog.style.display="flex"
    }

  },[show])
  const closeDialog=()=>{
    setTimeout(()=>{
      onClose()
    },250) 
  }
  
  useEffect(()=>{
    let dialog= dialogRef.current
    if(dialog){
      document.addEventListener('keyup',handleKeyUp)
    }
    return()=>{
      if(dialog){
        document.removeEventListener('keyup',handleKeyUp)
      }
    }
  },[])
  return(
    <dialog
      ref={dialogRef}
      className={`${className} z-11 flex flex-col duration-300 transition-all ease-in-out`}
      style={{
        opacity:show ? 1 : 0,
      }}
    >
      <div className="content relative">
        <div className="w-full h-auto absolute top-0 flex justify-end">
          <button 
            onClick={closeDialog} 
            aria-label="Cerrar" 
            className="border-solid border rounded-full p-2 m-2 "
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
export default Dialog