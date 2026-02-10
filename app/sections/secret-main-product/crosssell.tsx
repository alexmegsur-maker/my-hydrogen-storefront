import { createSchema, type HydrogenComponentProps, type WeaverseProduct } from "@weaverse/hydrogen";
import { useEffect } from "react";

interface CrosssellProps extends HydrogenComponentProps {
  productList: WeaverseProduct[];
  producto: WeaverseProduct;
}

function Crosssell(props: CrosssellProps) {
  const { productList, producto, children} = props;


  return (
    <div className="flex flex-col px-4 lg:px-8 py-6 lg:py-12 bg-[#f3f4f6] text-[#181817] border-0 border-b-[1px] border-solid border-r-0 border-[#181817]">
      <h3 className="text-[1.25rem] font-[700]">2. Elige tus complementos</h3>
      <div className="flex flex-col gap-6 lg:gap-12 ">
        <div className="flex flex-col mt-3 p-2 lg:p-4 bg-white rounded-lg border-solid border-[1px] border-[#181817]">
          <button
            className="flex justify-between items-end gap-2.5 bg-transparent border-0 p-0 text-left"
            aria-expanded="false"
            aria-controls="preset-options"
            data-context="pdp-addon-presets-accordion-titan-evo"
          >
            <span
              className="st-text-[1.125rem] font-[400] text-[#181817]"
              data-context="pdp-addon-presets-accordion-titan-evo"
            >
              ¿No sabes por dónde empezar? Aquí tienes nuestros ajustes
              preestablecidos recomendados.
            </span>
            <span
              className="group border-0 bg-[transparent] p-0 hover:text-[#181817] flex gap-1 items-center justify-center w-fit cursor-pointer text-[1rem] font-[400] st-colour-text-secondary  undefined"
              data-context="pdp-addon-presets-accordion-titan-evo"
            >
              Mostrar
              <div className="st-colour-icons-dark-grey group-hover:fill-[black]  text-black">
                <svg
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.5303 5.46967C13.8232 5.76256 13.8232 6.23744 13.5303 6.53033L8 12.0607L2.46967 6.53033C2.17678 6.23744 2.17678 5.76256 2.46967 5.46967C2.76256 5.17678 3.23744 5.17678 3.53033 5.46967L8 9.93934L12.4697 5.46967C12.7626 5.17678 13.2374 5.17678 13.5303 5.46967Z"
                    fill="currentColor"
                    className="st-colour-icons-dark-grey group-hover:fill-[black]  text-black"
                  ></path>
                </svg>
              </div>
            </span>
          </button>
          {/* aqui se ponen las opciones */}
          <div id="preset-options" className="mt-4 gap-2 flex-wrap hidden">
            <div className="relative text-left w-[calc(50%-5px)]">
              <button
                className="h-full text-left flex flex-col items-start gap-1 p-3 lg:p-4 bg-white rounded border-solid text-[#181817] border-[1px] border-[#181817]"
                data-context="pdp-addon-preset-starter-titan-evo"
              >
                <span
                  className="text-[1.25rem] font-[700]"
                  data-context="pdp-addon-preset-starter-titan-evo"
                >
                  Para principiantes
                </span>
                <span
                  className="text-[1rem] font-[400]"
                  data-context="pdp-addon-preset-starter-titan-evo"
                >
                  Disfruta de un mayor soporte con una selección de accesorios
                  para principiantes.
                </span>
              </button>
            </div>
            <div className="relative text-left w-[calc(50%-5px)]">
              <div
                className="absolute top-[-5px] left-[0] z-[2] w-full z-10"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="radix-:r9e:"
                data-state="closed"
              >
                <div className="flex">
                  <div className="flex-1">
                    <span className="uppercase flex gap-1 items-center justify-center w-fit  text-white st-colour-tag-red st-text-tag-sm p-[2px] lg:p-1 rounded-tl-[4px] rounded-tr-[4px] rounded-br-[4px] ">
                      Consigue 50 € de descuento
                      <div className="flex items-center justify-content st-colour-icons-on-colour">
                        <svg
                          width="14"
                          height="12"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M15 7.99988C15 11.8659 11.866 14.9999 8 14.9999C4.13401 14.9999 1 11.8659 1 7.99988C1 4.13388 4.13401 0.999878 8 0.999878C11.866 0.999878 15 4.13388 15 7.99988Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M8.56008 9.53359H7.28958V8.80909C7.28958 8.36809 7.36308 8.10559 7.69908 7.78009L8.17158 7.32859C8.59158 6.92959 8.84358 6.66709 8.84358 6.17359C8.84358 5.69059 8.49708 5.40709 8.03508 5.40709C7.60458 5.40709 7.22658 5.64859 7.21608 6.12109H5.83008C5.83008 4.81909 6.83808 4.17859 8.03508 4.17859C9.26358 4.17859 10.3136 4.81909 10.3136 6.18409C10.3136 7.02409 9.84108 7.61209 9.26358 8.17909L8.91708 8.51509C8.70708 8.72509 8.56008 8.86159 8.56008 9.20809V9.53359Z"
                            fill="black"
                          ></path>
                          <path
                            d="M8.64407 11.8212V10.3932H7.20557V11.8212H8.64407Z"
                            fill="black"
                          ></path>
                        </svg>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="h-full text-left flex flex-col items-start gap-1 p-3 lg:p-4 bg-white rounded border-solid text-[#181817] border-[1px] border-[#181817]"
                data-context="pdp-addon-preset-popular-titan-evo"
              >
                <span
                  className="text-[1.25rem] font-[700]"
                  data-context="pdp-addon-preset-popular-titan-evo"
                >
                  Máx. Rendimiento
                </span>
                <span
                  className="text-[1rem] font-[400]"
                  data-context="pdp-addon-preset-popular-titan-evo"
                >
                  Maximiza tu comodidad y rendimiento con nuestros accesorios
                  más vendidos.
                </span>
              </button>
            </div>
          </div>
          {/*  aqui se pondran las opciones  */}
        </div>

        {children}
      </div>
    </div>
  );
}

export default Crosssell;

export const schema = createSchema({
  type: "crosssell",
  title: "crosssell",
  childTypes: ["crossell-container"],
  settings: [
    {
      group: "general",
      inputs: [
        {
          type: "product-list",
          label: "Select products",
          name: "productList",
        },
        {
          type: "product",
          label: "Featured product",
          name: "producto",
        },
      ],
    },
  ],
});
