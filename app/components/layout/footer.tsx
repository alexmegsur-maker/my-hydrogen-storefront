import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { Image } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import { useFetcher } from "react-router";
import { Banner } from "~/components/banner";
import { Button } from "~/components/button";
import Link from "~/components/link";
import { useShopMenu } from "~/hooks/use-shop-menu";
import { cn } from "~/utils/cn";
import { CountrySelector } from "./country-selector";
import { FooterMenu } from "./menu/footer-menu";
import { useEffect, useState } from "react";

const variants = cva("", {
  variants: {
    width: {
      full: "",
      stretch: "",
      fixed: "mx-auto max-w-(--page-width)",
    },
    padding: {
      full: "",
      stretch: "px-3 md:px-10 lg:px-16",
      fixed: "mx-auto px-3 md:px-4 lg:px-6",
    },
  },
});

export function Footer() {
  const { shopName } = useShopMenu();
  const {
    footerWidth,
    socialFacebook,
    socialInstagram,
    socialLinkedIn,
    socialX,
    footerLogoData,
    footerLogoWidth,
    bio,
    copyright,
    addressTitle,
    storeAddress,
    storeEmail,
    newsletterTitle,
    newsletterDescription,
    newsletterPlaceholder,
    newsletterButtonText,

    footerBorderColor,
    footerBorderCopyColor,
    showStoreInfo,
    showNewsletter,

    showLanguage,
    legal,
    privacidad,
    cookies,
    footerCopyColor,
    footerCopySize,

  } = useThemeSettings();
  const fetcher = useFetcher<{ ok: boolean; error: string }>();

  // Compute message and error from fetcher data
  const message = fetcher.data?.ok ? "Thank you for signing up! 🎉" : "";
  const error =
    fetcher.data && !fetcher.data.ok
      ? fetcher.data.error || "An error occurred while signing up."
      : "";

  const SOCIAL_ACCOUNTS = [
    {
      name: "Instagram",
      to: socialInstagram,
      Icon: InstagramLogoIcon,
    },
    {
      name: "X",
      to: socialX,
      Icon: XLogoIcon,
    },
    {
      name: "LinkedIn",
      to: socialLinkedIn,
      Icon: LinkedinLogoIcon,
    },
    {
      name: "Facebook",
      to: socialFacebook,
      Icon: FacebookLogoIcon,
    },
  ].filter((acc) => acc.to && acc.to.trim() !== "");

  return (
    <footer
      className={cn(
        "w-full bg-(--color-footer-bg) pt-9 text-(--color-footer-text) lg:pt-16",
        variants({ padding: footerWidth }),
      )}
      style={{
        borderTop:`1px solid ${footerBorderColor}`,
        fontFamily:"Montserrat"
      }}
    >
      <div
        className={cn(
          "h-full w-full space-y-9",
          variants({ width: footerWidth }),
        )}
      >
        <div className="space-y-9">
          <div className="grid w-full gap-8 lg:gap-[10rem] lg:grid-cols-3">
            <div className="flex flex-col gap-6">
              {footerLogoData ? (
                <div className="relative" style={{ width: footerLogoWidth }}>
                  <Image
                    data={footerLogoData}
                    sizes="auto"
                    width={500}
                    className="h-full w-full object-contain object-left"
                  />
                </div>
              ) : (
                <div className="font-medium text-base uppercase">
                  {shopName}
                </div>
              )}
              {bio ? <div dangerouslySetInnerHTML={{ __html: bio }} /> : null}
              <div className="flex gap-4">
                {SOCIAL_ACCOUNTS.map(({ to, name, Icon }) => (
                  <Link
                    key={name}
                    to={to}
                    target="_blank"
                    className="flex items-center gap-2 text-lg"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
            {showStoreInfo &&
              <div className="flex flex-col gap-6">
                <div className="text-base">{addressTitle}</div>
                <div className="space-y-2">
                  <p>{storeAddress}</p>
                  <p>Email: {storeEmail}</p>
                </div>
              </div>
            }
            {showNewsletter && 
              <div className="flex flex-col gap-6">
                <div className="text-base">{newsletterTitle}</div>
                <div className="space-y-2">
                  <p>{newsletterDescription}</p>
                  <fetcher.Form
                    action="/api/klaviyo"
                    method="POST"
                    encType="multipart/form-data"
                  >
                    <div className="flex">
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder={newsletterPlaceholder}
                        className="grow border border-gray-100 px-3 focus-visible:outline-hidden"
                      />
                      <Button
                        variant="custom"
                        type="submit"
                        loading={fetcher.state === "submitting"}
                      >
                        {newsletterButtonText}
                      </Button>
                    </div>
                  </fetcher.Form>
                  <div className="h-8">
                    {message && (
                      <Banner variant="success" className="mb-6">
                        {message}
                      </Banner>
                    )}
                    {error && (
                      <Banner variant="error" className="mb-6">
                        {error}
                      </Banner>
                    )}
                  </div>
                </div>
              </div>
            }
            <div className=" col-span-2">
              <FooterMenu />
            </div>
          </div>
        </div>
        <div 
          className={`flex  flex-col items-center justify-between gap-4 border-line-subtle border-t lg:flex-row`}
          style={{
            borderColor:footerBorderCopyColor,
            paddingBlock:"2rem",
            color:footerCopyColor,
            fontSize:footerCopySize,
          }}
        >
          
          {showLanguage && 
            <div className="flex gap-2">
              <CountrySelector />
            </div>
          }
          <p dangerouslySetInnerHTML={{__html:copyright}}/>

          <div className=" flex gap-2">
            <Link to={legal} className={`hover:text-white`}>Aviso Legal</Link>
            <Link to={privacidad} className={`text-[${footerCopyColor}] hover:text-white`}>Privacidad</Link>
            <Link to={cookies} className={`text-[${footerCopyColor}] hover:text-white`}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

