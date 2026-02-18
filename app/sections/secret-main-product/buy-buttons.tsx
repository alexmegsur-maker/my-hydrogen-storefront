import { createSchema } from "@weaverse/hydrogen";

function BuyButtons() {
  return (
    <>
      <div className="st-colour-surface-lightest-grey e2e-section-order-summary  tw-border-solid tw-border-0 tw-border-b st-colour-border-medium-grey">
        <div>
          <div className="tw-pt-4 lg:tw-pt-8 tw-px-4 lg:tw-px-8">
            <div className="tw-grid tw-grid-cols-9 tw-mb-4">
              <div className="tw-col-span-6">
                <div className="st-body-lg st-colour-text-primary tw-font-bold">
                  Secretlab MAGNUS Pro
                </div>
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-9 tw-mb-4">
              <div className="tw-col-span-6">
                <div className="st-label-normal st-colour-text-primary tw-font-bold">
                  Black
                </div>
                <div className="st-label-normal st-colour-text-primary tw-font-bold">
                  1500 mm (L) x 700 mm (A)
                </div>
                <div className="st-colour-text-secondary st-label-sm">
                  Enchufe Tipo F
                </div>
              </div>
              <div className="tw-text-right st-label-lg tw-pt-1 st-colour-text-tertiary">
                x1
              </div>
              <div className="tw-col-span-2 tw-text-right st-label-lg tw-pt-1">
                849 €
              </div>
            </div>
            <div className="tw-uppercase st-label-normal st-colour-text-tertiary tw-font-bold tw-mb-2">
              Alfombrillas de escritorio
            </div>
            <div className="tw-grid tw-grid-cols-9 st-label-normal">
              <div className="tw-col-span-6 tw-font-bold">
                <div>Stealth</div>
              </div>
              <div className="tw-text-right st-label-lg st-colour-text-tertiary">
                x1
              </div>
              <div className="tw-col-span-2 st-label-lg tw-text-right tw-flex tw-justify-end tw-gap-1">
                <div>79 €</div>
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-9 st-colour-text-emphasis st-label-normal tw-font-bold">
              <div className="tw-col-span-6">
                Paquete MAGPAD™ + Descuento de la oferta
              </div>
              <div className="tw-text-right"></div>
              <div className="tw-col-span-2 tw-text-right tw-flex tw-justify-end tw-gap-1 st-label-lg tw-font-bold tw-mt-[2px]">
                <div>-79 €</div>
              </div>
            </div>
            <hr className="tw-my-4 st-colour-border-medium-grey" />
          </div>
        </div>
        <div className="tw-px-4 lg:tw-px-8 tw-pb-4 lg:tw-pb-8">
          <div className="tw-grid tw-grid-cols-9 tw-body-normal tw-items-center">
            <div className="tw-col-span-7 tw-text-right"></div>
            <div className="tw-col-span-2 tw-text-right st-colour-text-tertiary st-label-lg">
              <div className="tw-line-through">928 €</div>
            </div>
            <div className="tw-col-span-7 tw-text-right st-colour-text-secondary st-label-lg">
              Precio de venta
            </div>
            <div className="tw-col-span-2 tw-text-right tw-flex tw-justify-end tw-gap-1">
              <div className="st-label-lg tw-font-bold">849 €</div>
            </div>
          </div>
        </div>
      </div>

      <div className="st-body-xs tw-font-normal e2e-section-finance st-colour-text-primary tw-px-4 lg:tw-px-8 tw-py-3 lg:tw-py-4">
        <div
          className="financing"
          data-total-price="849"
          data-instalment-split="3"
        >
          Opciones de financiación disponibles.
          <a
            href="#"
            data-financing-modal-react="true"
            data-react-total="849"
            className="hover:tw-underline focus:tw-underline hover:st-colour-link-primary-hover focus:st-colour-link-primary-hover"
          >
            Saber más
          </a>
        </div>
      </div>

      <button
        data-context="pdp-addtocart"
        data-color="st-colour-buttons-primary-default hover:st-colour-buttons-primary-hover"
        className="tw-flex tw-gap-2 tw-items-center tw-justify-center tw-text-center tw-p-5 tw-uppercase tw-text-white st-text-cta-small tw-font-bold tw-w-full tw-border-none e2e-button-confirm-selection tw-cursor-pointer st-colour-buttons-primary-default hover:st-colour-buttons-primary-hover add-to-cart e2e-button-add-to-cart ab-feature-shop-now-magnus ab-add-to-cart-magnus-pro desks-addtocart"
      >
        <div
          data-context="pdp-addtocart"
          className="tw-w-full tw-flex tw-gap-2 tw-items-center tw-justify-center tw-text-center [&amp;_*]:tw-pointer-events-none"
        >
          <div className="st-colour-icons-on-colour">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.75442 11.1547C4.87725 10.7363 5.03455 10.2087 5.17028 9.7797L6.12371 10.0813C5.99121 10.5002 5.83627 11.0197 5.71392 11.4364C5.70511 11.4664 5.69648 11.4959 5.68803 11.5247H13.7531C14.0292 11.5247 14.2531 11.7486 14.2531 12.0247C14.2531 12.3009 14.0292 12.5247 13.7531 12.5247H5.02252C4.86562 12.5247 4.71781 12.4511 4.62333 12.3258C4.52885 12.2006 4.49865 12.0382 4.54177 11.8873L4.55779 11.8315L4.60202 11.678C4.63977 11.5473 4.69288 11.3644 4.75442 11.1547Z"
                fill="currentColor"
              ></path>
              <path
                d="M13.4411 9.93048H5.64652L4.22479 4.00662H15L13.4411 9.93048Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.38163 2.63593H0.969788V1.63593H3.77583C4.00702 1.63593 4.20807 1.79443 4.26202 2.01924L4.61899 3.50662H15C15.155 3.50662 15.3013 3.57855 15.396 3.70135C15.4907 3.82415 15.523 3.98392 15.4835 4.13387L13.9246 10.0577C13.8668 10.2774 13.6682 10.4305 13.4411 10.4305H5.64652C5.41533 10.4305 5.21428 10.272 5.16033 10.0472L3.38163 2.63593ZM4.85899 4.50662L6.04072 9.43048H13.0556L14.3514 4.50662H4.85899Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.469788 2.13593C0.469788 1.85978 0.693645 1.63593 0.969788 1.63593H3.67853V2.63593H0.969788C0.693645 2.63593 0.469788 2.41207 0.469788 2.13593Z"
                fill="currentColor"
              ></path>
              <path
                d="M11.2589 13.5805C11.2589 14.2682 11.8183 14.8277 12.506 14.8277C13.1936 14.8277 13.7531 14.2682 13.7531 13.5805C13.7531 12.8929 13.1936 12.3334 12.506 12.3334C11.8183 12.3334 11.2589 12.8929 11.2589 13.5805ZM12.506 13.1648C12.7352 13.1648 12.9217 13.3514 12.9217 13.5805C12.9217 13.8097 12.7352 13.9962 12.506 13.9962C12.2768 13.9962 12.0903 13.8097 12.0903 13.5805C12.0903 13.3514 12.2768 13.1648 12.506 13.1648Z"
                fill="currentColor"
              ></path>
              <path
                d="M5.02252 13.5805C5.02252 14.2682 5.582 14.8277 6.26965 14.8277C6.9573 14.8277 7.51678 14.2682 7.51678 13.5805C7.51678 12.8929 6.9573 12.3334 6.26965 12.3334C5.582 12.3334 5.02252 12.8929 5.02252 13.5805ZM6.26965 13.1648C6.49883 13.1648 6.68536 13.3514 6.68536 13.5805C6.68536 13.8097 6.49883 13.9962 6.26965 13.9962C6.04047 13.9962 5.85394 13.8097 5.85394 13.5805C5.85394 13.3514 6.04047 13.1648 6.26965 13.1648Z"
                fill="currentColor"
              ></path>
              <path
                d="M7.03577 13.5903C7.03577 13.9207 6.76794 14.1885 6.43756 14.1885C6.10718 14.1885 5.83936 13.9207 5.83936 13.5903C5.83936 13.2599 6.10718 12.9921 6.43756 12.9921C6.76794 12.9921 7.03577 13.2599 7.03577 13.5903Z"
                fill="currentColor"
              ></path>
              <path
                d="M13.1042 13.5903C13.1042 13.9207 12.8364 14.1885 12.506 14.1885C12.1756 14.1885 11.9078 13.9207 11.9078 13.5903C11.9078 13.2599 12.1756 12.9921 12.506 12.9921C12.8364 12.9921 13.1042 13.2599 13.1042 13.5903Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          Añadir al carrito
        </div>
      </button>
    </>
  );
}
export default BuyButtons;

export const schema = createSchema({
  type: "buy-buttons",
  title: "Buy buttons",
  settings: [
    {
      group: "General",
      inputs: [
        {
          type: "text",
          label: "title",
          name: "",
          defaultValue: "texto",
          placeholder: "texto placeholder",
        },
      ],
    },
  ],
});
