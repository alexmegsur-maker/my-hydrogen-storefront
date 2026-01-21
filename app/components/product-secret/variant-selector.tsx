function VariantSelectorSecret() {
  return (
    <div id="EZDrawery2vlw" className="EZDrawer">
      <input
        type="checkbox"
        id="EZDrawer__checkboxy2vlw"
        className="EZDrawer__checkbox"
      />
      <nav
        role="navigation"
        id="EZDrawer__containery2vlw"
        className="EZDrawer__container undefined"
        style={{
          zIndex: 1801,
          transitionDuration: "500ms",
          top: "0px",
          right: "0px",
          transform: "translate3d(100%, 0px, 0px)",
          width: "30vw",
          height: "100%",
          bottom: "0px",
          overflow: "auto",
        }}
      >
        <div className="h-full flex relative flex-col">
          <div className="flex-1">
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
                    strokeWidth="2"
                    strokeLinecap="round"
                  ></path>
                </svg>
                <div className="flex-1 font-bold font-['Soleil'] me-[30px]">
                  Tamaño
                </div>
              </div>
              <div className="flex-1 py-4"></div>
            </div>
            <div className="p-5 border-l-0 border-t-0 border-r-0 border-solid border-[#D4D4D8] e2e-button-size test321 bg-[#F4F4F5]">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex gap-1 flex-wrap e2e-section-status">
                    <span className="uppercase flex gap-1 items-center justify-center w-fit   colour-text-on-colour-primary colour-tag-light-grey text-tag-sm p-[2px] lg:p-1 flex flex-wrap e2e-section-status ">
                      No disponible
                    </span>
                  </div>
                  <div className="headline-3 font-bold text-[#71717A]">
                    Small
                  </div>
                  <div className="subheading-3 text-[#71717A]">
                    Recomendado para: ≤169cm | &lt;90kg
                  </div>
                </div>
                <div className="flex items-center invisible">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "25px", color: "rgb(167, 42, 47)" }}
                  >
                    <path
                      d="M11.25 2.625L4.5 9.375L0.75 5.72679"
                      stroke="#A72A2F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-5 border-l-0 border-t-0 border-r-0 border-solid border-[#D4D4D8] e2e-button-size test321 bg-[#FFFFFF] cursor-pointer">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex gap-1 flex-wrap e2e-section-status"></div>
                  <div className="headline-3 font-bold text-[#A72A2F] e2e-state-active">
                    Regular
                  </div>
                  <div className="subheading-3 text-[#18181B]">
                    Recomendado para: 170-189cm | &lt; 100kg
                  </div>
                  <div className="subheading-3 font-bold uppercase text-[#18181B]">
                    624 €
                  </div>
                </div>
                <div className="flex items-center e2e-state-selected">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "25px", color: " rgb(167, 42, 47)" }}
                  >
                    <path
                      d="M11.25 2.625L4.5 9.375L0.75 5.72679"
                      stroke="#A72A2F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-5 border-l-0 border-t-0 border-r-0 border-solid border-[#D4D4D8] e2e-button-size test321 bg-[#FFFFFF] cursor-pointer">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex gap-1 flex-wrap e2e-section-status"></div>
                  <div className="headline-3 font-bold text-[#18181B]">XL</div>
                  <div className="subheading-3 text-[#18181B]">
                    Recomendado para: 181-205cm | 80-180kg
                  </div>
                  <div className="subheading-3 font-bold uppercase text-[#18181B]">
                    674 €
                  </div>
                </div>
                <div className="flex items-center invisible">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "25px", color: "rgb(167, 42, 47" }}
                  >
                    <path
                      d="M11.25 2.625L4.5 9.375L0.75 5.72679"
                      stroke="#A72A2F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none">
            <button
              data-context=""
              data-color="colour-buttons-primary-default hover:colour-buttons-primary-hover"
              className="flex gap-2 items-center justify-center text-center p-5 uppercase text-white text-cta-small font-bold w-full border-none e2e-button-confirm-selection sticky bottom-0 z-10 cursor-pointer colour-buttons-primary-default hover:colour-buttons-primary-hover e2e-button-confirm-selection"
            >
              Confirmar selección
            </button>
          </div>
        </div>
      </nav>
      <label
        htmlFor="EZDrawer__checkboxy2vlw"
        id="EZDrawer__overlayy2vlw"
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
  );
}
export default VariantSelectorSecret;
