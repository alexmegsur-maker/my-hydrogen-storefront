import React from 'react';
import { cn } from "~/utils/cn";
import "~/styles/aurora-background.css"
import { createSchema, type InspectorGroup } from '@weaverse/hydrogen';

export interface AuroraProps {
  enableAurora?: boolean;
  auroraColor1: string;
  auroraColor2: string;
  auroraColor3: string;
  auroraDuration: number;
  auroraBlur: number;
  auroraOpacity: number;

}

export default function   AuroraBackground  (props: AuroraProps){
  const { 
    enableAurora,
    auroraColor1,
    auroraColor2,
    auroraColor3,
    auroraDuration,
    auroraBlur,
    auroraOpacity,
  }=props
  
  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-[2000ms]",
        enableAurora ? "opacity-100" : "opacity-0"
      )}
      style={{
        "--aurora-color-1": auroraColor1,
        "--aurora-color-2": auroraColor2,
        "--aurora-color-3": auroraColor3,
        "--aurora-duration": `${auroraDuration}s`,
        "--aurora-blur": `${auroraBlur}px`,
        "--aurora-opacity": auroraOpacity / 100,
      } as React.CSSProperties}
    >
      <div className="aurora-layer primary" />
      <div className="aurora-layer secondary" />
    </div>
  );
};

export const auroraInputs: InspectorGroup["inputs"] = [

  {
    type: "color",
    label: "Aurora Color 1",
    name: "auroraColor1",
    defaultValue: "#00d2ff40", // Agregado alpha para suavidad
  },
  {
    type: "color",
    label: "Aurora Color 2",
    name: "auroraColor2",
    defaultValue: "#00ffc826",
  },
  {
    type: "color",
    label: "Aurora Color 3",
    name: "auroraColor3",
    defaultValue: "#0064ff33",
  },
  {
    type: "range",
    label: "Animation Duration (s)",
    name: "auroraDuration",
    defaultValue: 20,
    configs: { min: 5, max: 60, step: 1 }
  },
  {
    type: "range",
    label: "Blur Intensity",
    name: "auroraBlur",
    defaultValue: 80,
    configs: { min: 0, max: 150, step: 5 }
  },
  {
    type: "range",
    label: "Overall Opacity",
    name: "auroraOpacity",
    defaultValue: 100,
    configs: { min: 0, max: 100, step: 1, unit: "%" }
  }
]

export const auroraSettings:InspectorGroup[] = [
  {
    group: "Aurora Effect",
    inputs: auroraInputs
  }

]
  