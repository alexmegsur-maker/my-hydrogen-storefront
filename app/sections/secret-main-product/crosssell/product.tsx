import { createSchema, type ComponentLoaderArgs, type WeaverseProduct } from "@weaverse/hydrogen";
import { useEffect } from "react";
import type { ProductQuery } from "storefront-api.generated";
import type { SectionProps } from "~/components/section";
import { PRODUCT_CARD_FRAGMENT } from "~/graphql/fragments";
import { PRODUCT_QUERY } from "~/graphql/queries";

interface CrossProductSettings {
  producto:WeaverseProduct;
  title:string;
  showT:boolean;
  description:string;
  showD:boolean;

}

type CrossProductProps = SectionProps<ProductCrossellLoaderData> & CrossProductSettings;

function CrossellProduct(props:CrossProductProps) {
  const {loaderData,title,showT,description,showD}=props;
  const product = loaderData?.product
  useEffect(()=>{
    console.log("productDAta crossell",product)
  },[product])
  if(product){
    
    return (
      <div>
        <div className="mb-8">
          <div className="flex items-center">
            <div className="font-['Soleil'] font-bold text-[24px] leading-[125%] flex-none me-4">
              {title}
            </div>
            <div className="flex-1">
              <div className="h-[1px] w-100 bg-[#6C757D]"></div>
            </div>
          </div>
          <div className="text-[16px] leading-[125%] font-bold">
            {description}
          </div>
        </div>
        <div
          className="bg-white rounded border-solid p-4 my-4 atc-item e2e-selector-chair-addons-card-2 border-2 border-[#A72A2F]"
          data-atc-id=""
          data-quantity="0"
          data-status="available sale"
          data-sku="RRCLNR-BLACK1RV2"
          data-sku-handle="secretlab-ergonomic-recliner"
          data-shopify="189"
          data-direct="199"
          data-msrp="199"
          data-testid="e2e-selector-chair-addons-card-2"
        >
          <div className="flex w-full">
            <div className="flex-none pt-4">
              <label
                className="flex gap-2 items-center cursor-pointer  "
                aria-label="checkbox"
              >
                <span className="relative border border-solid rounded flex justify-center items-center p-1 w-[16px] h-[16px] bg-[#A72A2F] border-[#A72A2F]">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    color="#FFFFFF"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: "rgb(255, 255, 255)" }}
                  >
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                  </svg>
                  <input
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                    type="checkbox"
                  />
                </span>
              </label>
            </div>
            <div className="flex-none mx-3 w-[55px]">
              <img
                loading="lazy"
                className="w-full cursor-zoom-in"
                src={product.featuredImage?.url}
                alt=""
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="radix-:rae:"
                data-state="closed"
              />
            </div>
            <div className="flex-1">
              <div className="subheading-1 font-bold text-[#18181B]">
                {product.title}
              </div>
              <div className="text-[1.125rem] font-[400] text-[#18181B]">
                {product.tooltip?.value &&
                  <div>
                    {product.tooltip?.value}
                  </div>
                }                
              </div>
              <div className="mt-3">
                <div className="flex gap-1 flex-wrap e2e-section-status">
                  {product.selectedOrFirstAvailableVariant.compareAtPrice?.amount &&
                    <span className="uppercase flex gap-1 items-center justify-center w-fit  text-white st-colour-tag-red st-text-tag-sm p-[2px] lg:p-1  ">
                      Oferta
                    </span>
                  }
                </div>
                <div className="text-right flex gap-1">
                  <div>+€{product.selectedOrFirstAvailableVariant.price.amount}</div>
                  {
                    product.selectedOrFirstAvailableVariant.compareAtPrice?.amount &&
                    <div className="line-through text-gray-400">{product.selectedOrFirstAvailableVariant.compareAtPrice.amount}€</div>
                  }
                </div>
              </div>
              <hr className="mt-4 mb-2" />
              <div className="mb-2"></div>
              <div className="mb-2 mt-4">
                <div
                  className="flex bg-white e2e-form-input-counter"
                  data-testid="e2e-form-input-counter"
                >
                  <button className="h-8 w-8 bg-white p-0 border-solid border-0 border-[#181817] border-[1px] border-r-0 rounded-l flex justify-center items-center cursor-pointer e2e-minus">
                    <div className="fill-[black]  text-black">
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
                          d="M7.27574 7.27571C7.67575 7.27571 8.72431 7.2757 8.72431 7.2757L13.7943 7.27571C14.1943 7.27571 14.5185 7.59998 14.5185 7.99999C14.5185 8.4 14.1943 8.72427 13.7943 8.72427H8.72431C8.3243 8.72427 7.27574 8.72427 7.27574 8.72427H2.20579C1.80578 8.72427 1.48151 8.4 1.48151 7.99999C1.48151 7.59998 1.80578 7.27571 2.20579 7.27571H7.27574Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button>
                  <input
                    className="border-solid border-0 border-[#181817] w-10 h-8 bg-white text-[#181817] text-center border-[1px] text-[1rem]  z-[2] p-0"
                    name="number-selector"
                    aria-label="selected quantity"
                    value="1"
                  />
                  <button className="h-8 w-8 bg-white p-0 border-solid border-0 border-[#181817] border-[1px] border-l-0 rounded-r flex justify-center items-center cursor-pointer e2e-plus">
                    <div className="fill-[black]  text-black">
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
                          d="M8.00003 1.48148C8.40003 1.48148 8.72431 1.80575 8.72431 2.20576V7.27571H13.7943C14.1943 7.27571 14.5185 7.59999 14.5185 7.99999C14.5185 8.4 14.1943 8.72428 13.7943 8.72428H8.72431V13.7942C8.72431 14.1942 8.40003 14.5185 8.00003 14.5185C7.60002 14.5185 7.27575 14.1942 7.27575 13.7942V8.72428H2.20579C1.80578 8.72428 1.48151 8.4 1.48151 7.99999C1.48151 7.59999 1.80578 7.27571 2.20579 7.27571H7.27575V2.20576C7.27575 1.80575 7.60002 1.48148 8.00003 1.48148Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              <div
                className="col-span-6 inline-block justify-end"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls="radix-:rah:"
                data-state="closed"
              >
                <div className="cursor-pointer">
                  <div className="text-[#a72a2f] text-[1.125rem] font-[400] flex items-center">
                    <span className="me-1">Detalles</span>
                    <svg
                      className="plus"
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "rgb(167, 42, 47)",
                      }}
                    >
                      <path
                        d="M13.25 7.5C13.25 10.6756 10.6756 13.25 7.5 13.25C4.32436 13.25 1.75 10.6756 1.75 7.5C1.75 4.32436 4.32436 1.75 7.5 1.75C10.6756 1.75 13.25 4.32436 13.25 7.5Z"
                        stroke="#A72A2F"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      ></path>
                      <path
                        d="M5 7.5H10"
                        stroke="#A72A2F"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      ></path>
                      <path
                        d="M7.5 5L7.5 10"
                        stroke="#A72A2F"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CrossellProduct;


export type ProductCrossellLoaderData = Awaited<ReturnType<typeof loader>>

export const loader = async({
data,
weaverse,
}:ComponentLoaderArgs<CrossProductSettings>)=>{
  const {language,country}=weaverse.storefront.i18n;
  const {producto}=data;

  if(producto){
    const handle = producto.handle

    const {product} = await weaverse.storefront.query<ProductQuery>(
      PRODUCT_QUERY,
      {
        variables:{
          country,
          language,
          selectedOptions:[],
          handle:handle,
        }
      }
    );
    return{
      product
    }
  }
  return{
    product:null
  }
}

export const schema = createSchema({
  type: "crossell-product",
  title: "Product", 
  settings: [
    {
      group: "General",
      inputs: [
        {
          type:'product',
          label:'Producto',
          name:'producto',
        },
        {
          type: "text",
          label: "title",
          name: "title",
          defaultValue: "texto",
          placeholder: "texto placeholder",
        },
        {
          type:'switch',
          label:'show title',
          name:'showT',
          defaultValue:true,
        },
        {
          type:'textarea',
          label:'description',
          name:'description',
          defaultValue:'texto',
          placeholder:'texto placeholder',
        },
        {
          type:'switch',
          label:'show description',
          name:'showD',
          defaultValue:true,
        },
      ],
    },
  ],
});
