import { useState } from "react"

export function Afiliados(){
  const [isHover,setIsHover] = useState(false)
  return (
    <div 
      className="affiliate-mission-card"
      style={{
        background:"linear-gradient(145deg,rgba(15,15,15,0.8),rgba(5,5,5,0.9))",
        border:"1px solid rgba(255, 255, 255, 0.1)",
        borderRadius:"4px",
        padding:"2.5rem",
        position:"relative",
        overflow:"hidden",
        marginTop:"2rem",
        transition:"all 0.4s ease"
      }}
      >
      <div 
        className="mission-header"
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"flex-start",
          marginBottom:"2rem"
        }}
        >
        <div className="mission-title">
          <span className="mission-eyebrow"
            style={{
              fontFamily:"Montserrat",
              fontSize:"0.65rem",
              color:"#52525B",
              letterSpacing:"3px",
              textTransform:"uppercase",
              display:"block",
              marginBottom:"0.5rem"
            }}
            >
            Protocolo de Reclutamiento
          </span>
          <h2
            style={{
              fontFamily:"Montserrat",
              fontSize:"1.5rem",
              fontWeight:"300",
              textTransform:"uppercase",
              letterSpacing:"2px"
            }}
            >
            Misión de Expansión: Nivel 1
          </h2>
        </div>
        <div className="commission-badge"
          style={{
            border: "1px solid #FFF",
            color: "#FFF",
            fontFamily: 'Outfit',
            fontSize: "0.7rem",
            fontWeight: 800,
            padding: "6px 12px",
            letterSpacing: "1px",
            textShadow:" 0 0 10px rgba(255,255,255,0.5)",
          }}
          >
          10% Comisión
        </div>
      </div>

      <div className="mission-body"
        style={{
          color: "#A1A1AA", 
          fontSize: "0.9rem", 
          lineHeight: 1.6,
          marginBottom: "2rem", 
          maxWidth: "80%",
        }}
        >
        <p>Como Operador de nuestra base fundacional, tienes la autorización para expandir la influencia de Phoenix en Europa. Activa tu perfil de afiliado y obtén beneficios por cada unidad Monarch Remaster desplegada a través de tu enlace único.</p>
        
        
      </div>

      <a 
        onMouseEnter={()=>setIsHover(true)}
        onMouseLeave={()=>setIsHover(false)}
        href="https://phoenixtechnologies.goaffpro.com/" 
        className="btn-mission"
        style={{
          display: "block", 
          width: "100%", 
          textAlign: "center", 
          padding: "1.2rem",
          background: isHover?"#fff":"transparent", 
          border: `1px solid ${isHover ? "#000":"#fff3"}`,
          color: isHover ? "#050505":"#fff", 
          fontFamily: 'Outfit', 
          fontWeight: 800,
          textTransform: "uppercase", 
          letterSpacing: "3px", 
          textDecoration: "none",
          transition: "all 0.3s",
          transform: isHover ? "translateY(-2px)":"unset",
          boxShadow:isHover ? "0 0 30px rgba(255,255,255,0.2)":"unset",
        }}
        >
          Activar Perfil de Afiliado
      </a>
    </div>
  )
}