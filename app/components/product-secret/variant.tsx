import { useState } from "react"
import VariantSelectorSecret from "./variant-selector"

function Variant(){
  const [show,setShow]= useState(false)
  return(
    <div>
      <div
        data-context="pdp-chairs-size"
        data-testid=""
        className="cursor-pointer px-4 lg:px-8 py-6 lg:py-12 border-b border-t-0 border-l-0 border-solid border-r-0 colour-surface-light-grey colour-border-medium-grey e2e-selector-size sizedrawer [&amp;&amp;]:px-0 lg:[&amp;&amp;]:px-0 [&amp;&amp;]:py-0 lg:[&amp;&amp;]:py-0 border-b-0"
      >
        <div className="flex items-center">
          <div className="flex-1">
            <div className="mb-3 lg:mb-4 flex items-center justify-between">
              <div
                data-context="pdp-chairs-size"
                className="colour-text-primary subheading-alt-normal font-bold"
              >
                Tamaño
              </div>
            </div>
            <div
              data-context="pdp-chairs-size"
              className="border-b-0 border-r-0 border-l-2 border-t-0 border-solid colour-border-medium-grey ps-3 lg:ps-4 ms-1"
            >
              <div
                data-context="pdp-chairs-size"
                className="[&amp;_*]:pointer-events-none"
              >
                <div className="flex gap-1 flex-wrap e2e-section-status"></div>
                <div className="headline-3 font-bold colour-text-emphasis e2e-section-chair-size-selection">
                  Regular
                </div>
                <div className="body-normal colour-text-secondary e2e-section-chair-size-selection-description">
                  Recomendado para: 170-189cm | &lt; 100kg
                </div>
              </div>
            </div>
          </div>
          <div
            data-context="pdp-chairs-size"
            className="flex-none [&amp;_*]:pointer-events-none"
          >
            <div className="w-[20px]">
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.46967 2.46967C5.76256 2.17678 6.23744 2.17678 6.53033 2.46967L12.0607 8L6.53033 13.5303C6.23744 13.8232 5.76256 13.8232 5.46967 13.5303C5.17678 13.2374 5.17678 12.7626 5.46967 12.4697L9.93934 8L5.46967 3.53033C5.17678 3.23744 5.17678 2.76256 5.46967 2.46967Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      { show && <VariantSelectorSecret/> }
    </div>
  )
}

export default Variant