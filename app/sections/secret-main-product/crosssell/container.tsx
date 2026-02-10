import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";

interface crossellContainerProps extends HydrogenComponentProps{
title:string;
}

function CrossellContainer(props:crossellContainerProps) {
  const {title, children}=props
  return (
    <div>
      <div
        data-context="pdp-chairs-fbt"
        data-testid="e2e-selector-frequently-bought-together"
        className="cursor-pointer px-4 lg:px-8 py-6 lg:py-12 border-b border-t-0 border-l-0 border-solid border-r-0 bg-[#f3f4f6]border-[#181817] e2e-selector-frequently-bought-together frequentylyboughtdrawer [&amp;&amp;]:px-0 lg:[&amp;&amp;]:px-0 [&amp;&amp;]:py-0 lg:[&amp;&amp;]:py-0 border-b-0"
      >
        <div className="flex items-center">
          <div className="flex-1">
            <div className="mb-3 lg:mb-4 flex items-center justify-between">
              <div
                data-context="pdp-chairs-fbt"
                className="text-[#181817] text-[1.125rem]font-bold"
              >
                Accesorios
              </div>
              {/* se añade cuando tiene productos */}
              <button
                data-context="pdp-chairs-fbt"
                className="bg-transparent border-0 p-0 st-link-xs st-colour-link-grey underline"
              >
                Quitar
              </button>
              {/* se añade cuando tiene productos */}
            </div>
            <div
              data-context="pdp-chairs-fbt"
              className="border-b-0 border-r-0 border-l-2 border-t-0 border-solid border-[#181817] ps-3 lg:ps-4 ms-1"
            >
              <div
                data-context="pdp-chairs-fbt"
                className="[&amp;_*]:pointer-events-none st-colour-text-placeholder text-[1.875rem] font-[400]  font-bold"
              >
                {/* 
                     "aqui estaba este texto cuando estaba vacio"
                    Seleccionar productos 
                    
                    */}

                {/* esto se añade cuando tiene productos y es uno de estos por cada producto */}
                <div
                  data-testid="e2e-addon-order"
                  data-sku="FLOORCARPET-BLACK"
                  className="flex text-[1.125rem] font-[400] items-center"
                >
                  <div className="flex-none">
                    <div className="w-[70px] h-[70px] rounded border border-solid overflow-hidden">
                      <img
                        className="w-full h-full"
                        src="https://images.secretlab.co/main/tr:n-w_150_square/FLOORCARPET-BLACK.jpg"
                      />
                    </div>
                  </div>
                  <div className="flex-1 st-colour-text-emphasis st-text-[1.125rem] font-[400] ps-4">
                    <div className="flex gap-1 flex-wrap e2e-section-status">
                      <span className="uppercase flex gap-1 items-center justify-center w-fit  text-white st-text-tag-sm p-[2px] lg:p-1 st-colour-tag-black  ">
                        Nuevo
                      </span>
                      <span className="uppercase flex gap-1 items-center justify-center w-fit  text-white st-colour-tag-orange st-text-tag-sm p-[2px] lg:p-1  ">
                        Reservar : 6 Mar 2026
                      </span>
                    </div>
                    <div className="font-bold">
                      Alfombrilla protectora para el suelo Secretlab
                    </div>
                  </div>
                  <div className="flex-none px-4">
                    <div className="font-normal">x1</div>
                  </div>
                </div>

                {/* esto se añade cuando tiene productos */}
              </div>
            </div>
          </div>
          <div
            data-context="pdp-chairs-fbt"
            className="flex-none [&amp;_*]:pointer-events-none"
          >
            <div>
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

      <div id="EZDrawer4i7qah" className="EZDrawer">
        <input
          type="checkbox"
          id="EZDrawer__checkbox4i7qah"
          className="EZDrawer__checkbox"
        />
        <nav
          role="navigation"
          id="EZDrawer__container4i7qah"
          className="EZDrawer__container undefined"
          style={{
            zIndex: 1801,
            transitionDuration: "500ms",
            top: "0px",
            right: "0px",
            transform: " translate3d(100%, 0px, 0px)",
            width: "30vw",
            height: "100%",
            bottom: "0px",
            overflow: "auto",
            backgroundColor: "rgb(244, 244, 245)",
          }}
        >
          <div
            data-testid="e2e-selector-frequently-bought-together-drawer"
            className="flex flex-col h-full relative e2e-selector-frequently-bought-together-drawer"
          >
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10">
                <div className="bg-black flex text-white relative items-center overflow-hidden">
                  <div
                    data-testid="e2e-button-drawer-close"
                    className="cursor-pointer flex-none flex flex-row py-4 pe-4 items-center w-full"
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24.4355 9.6001L14.0008 20.0349L24.4355 30.4697"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                    <div className="flex-1 font-bold font-['Soleil'] me-[30px]">
                      Accesorios
                    </div>
                  </div>
                  <div className="flex-1 py-4"></div>
                </div>
              </div>
              <div className="p-4">
                {children}
              </div>
            </div>
            <div className="flex-none">
              <button
                data-context=""
                data-color="bg-[#a72a2f] hover:bg-[#710c10]"
                className="flex gap-2 items-center justify-center text-center p-5 uppercase text-white st-text-cta-small font-bold w-full border-none e2e-button-confirm-selection sticky bottom-0 z-10 cursor-pointer bg-[#a72a2f] hover:bg-[#710c10]"
              >
                Confirmar selección
              </button>
            </div>
          </div>
        </nav>
        <label
          htmlFor="EZDrawer__checkbox4i7qah"
          id="EZDrawer__overlay4i7qah"
          className="EZDrawer__overlay "
          style={{
            backgroundColor: "rgb(0, 0, 0)",
            opacity: 0.4,
            zIndex: 1800,
          }}
        >
          <span className="sr-only">Drawer overlay label</span>
        </label>
      </div>
    </div>
  );
}
export default CrossellContainer;

export const schema = createSchema({
  type: "crossell-container",
  title: "container",
  childTypes: ["crossell-product"],
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "text",
          label: "title",
          name: "title",
          defaultValue: "texto",
          placeholder: "texto placeholder",
        },
      ],
    },
  ],
});
