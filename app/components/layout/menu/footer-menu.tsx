import { CaretRightIcon } from "@phosphor-icons/react";
import * as Accordion from "@radix-ui/react-accordion";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import type { CSSProperties } from "react";
import Link from "~/components/link";
import { RevealUnderline } from "~/components/reveal-underline";
import { useShopMenu } from "~/hooks/use-shop-menu";
import type { SingleMenuItem } from "~/types/menu";


export function FooterMenu() {
  const {
    footerStgap,
    footerTcolor,
    footertSize,
    footertLetter,
    footertUpper,
    footertFamily,
    footertWeight,
    footerSTcolor,
    footerStSize,
    footerStLetter,
    footerStUpper,
    footerStFamily,
    footerStWeight
  }=useThemeSettings()
  const styleTitle= {
    color: footerTcolor,
    fontFamily: footertFamily,
    fontSize: footertSize,
    fontWeight: footertWeight,
    textTransform: footertUpper ? "uppercase" : "unset",
    letterSpacing: footertLetter > 0?`${footertLetter}px`:"normal",

  }as CSSProperties
  const styleLink={
    color: footerSTcolor,
    fontFamily: footerStFamily,
    fontSize: footerStSize,
    fontWeight: footerStWeight,
    textTransform: footerStUpper ? "uppercase" : "unset",
    letterSpacing: footerStLetter > 0?`${footerStLetter}px`:"normal",
  } as CSSProperties

  const { footerMenu } = useShopMenu();
  const items = footerMenu.items as unknown as SingleMenuItem[];
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={items.map(({ id }) => id)}
      className="grid w-full lg:grid-cols-3 lg:gap-8"
    >
      {items.map(({ id, to, title, items: childItems }) => (
        <Accordion.Item key={id} value={id} className="flex flex-col">
          <Accordion.Trigger className="flex items-center justify-between py-4 text-left font-medium lg:hidden data-[state=open]:[&>svg]:rotate-90">
            {["#", "/"].includes(to) ? (
              <span style={styleTitle} >{title}</span>
            ) : (
              <Link to={to} style={styleTitle}>{title}</Link>
            )}
            <CaretRightIcon className="h-4 w-4 rotate-0 transition-transform" />
          </Accordion.Trigger>
          <div className="hidden font-medium text-lg lg:block"
            style={styleTitle}
          >
            {["#", "/"].includes(to) ? title : <Link to={to}>{title}</Link>}
          </div>
          <Accordion.Content
            className={clsx([
              "[--expand-to:var(--radix-accordion-content-height)]",
              "[--collapse-from:var(--radix-accordion-content-height)]",
              "data-[state=closed]:animate-collapse",
              "data-[state=open]:animate-expand",
              "overflow-hidden",
            ])}
          >
            <div className="flex flex-col gap-2 pb-4 lg:pt-4"
              style={styleLink}
            >
              {childItems.map((child) => (
                <Link
                  to={child.to}
                  key={child.id}
                  className="group relative items-center gap-2 hover:text-white"
                  
                >
                    {child.title}
                  {/* <RevealUnderline className="[--underline-color:var(--color-footer-text)]">
                  </RevealUnderline> */}
                  {child.isExternal && (
                    <span className="invisible text-sm group-hover:visible">
                      ↗
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
