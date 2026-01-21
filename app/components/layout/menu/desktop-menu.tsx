import { CaretDownIcon } from "@phosphor-icons/react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Image } from "~/components/image";
import Link from "~/components/link";
import { RevealUnderline } from "~/components/reveal-underline";
import { useShopMenu } from "~/hooks/use-shop-menu";
import type { SingleMenuItem } from "~/types/menu";
import { cn } from "~/utils/cn";
import { DropdownMenu } from "./dropdown-menu";
import HeaderEdit from "~/sections/header-edit";
import { useComponentStore } from "~/stores/headerDataStore";
import { TextHeader } from "~/components/header/text";
import type { HeaderGeneralEditProps } from "~/types/header";
import { selectorPaddingMargin } from "~/utils/general";
import { BannerHeader } from "~/components/header/banner";
import { ImageLinkHeader } from "~/components/header/image-link";
import { TopTextHeader } from "~/components/header/top-text";
import { ProductTopHeader } from "~/components/header/top-product";

export function DesktopMenu() {
  const { headerMenu } = useShopMenu();
  const [value, setValue] = useState<string>("");
  const components = useComponentStore((state)=>state.headerMenuItems)

  if (headerMenu?.items?.length) {
    const items = headerMenu.items as unknown as SingleMenuItem[];

    return (
      <NavigationMenu.Root value={value} onValueChange={setValue}>
        <NavigationMenu.List className="hidden h-full grow justify-center lg:flex">
          {items.map((menuItem) => {
            const { id, items: childItems = [], title, to } = menuItem;
            const level = getMaxDepth(menuItem);
            const hasSubmenu = level > 1;
            const isDropdown =
              level === 2 &&
              childItems.every(({ resource }) => !resource?.image);
            const hasEdition = components.find((elm)=>elm.heading === menuItem.title)
            if ( isDropdown && hasEdition == undefined ) {
              return <DropdownMenu key={id} menuItem={menuItem} />;
            }

            // Use NavigationMenu for mega menu items and items without submenu
            return (
              <NavigationMenu.Item key={id} value={id}>
                <NavigationMenu.Trigger
                  className={clsx([
                    "flex h-full cursor-pointer items-center gap-1.5 px-3 py-2",
                    'data-[state="open"]:[&>svg]:rotate-180',
                    "uppercase focus:outline-hidden",
                  ])}
                  data-navigation-elm={title}
                >
                  {hasSubmenu ? (
                    <>
                      <span>{title}</span>
                      <CaretDownIcon className="h-3.5 w-3.5 transition-transform" />
                    </>
                  ) : (
                    <NavigationMenu.Link asChild>
                      <Link to={to} className="transition-none">
                        {title}
                      </Link>
                    </NavigationMenu.Link>
                  )}
                </NavigationMenu.Trigger>
                {level > 1  && (
                  <NavigationMenu.Content
                    className={cn([
                      "absolute top-0 left-0 w-full bg-white"
                    ])}
                  >
                    <MegaMenu items={childItems} title={title}/>
                  </NavigationMenu.Content>
                )}
                {
                  level === 1 && hasEdition != undefined && (
                    <NavigationMenu.Content
                      className={cn([
                        "absolute top-0 left-0 w-full bg-white"
                      ])}
                    >
                      <MegaMenu items={childItems} title={title}/>
                    </NavigationMenu.Content>
                  )
                }
              </NavigationMenu.Item>
            );
          })}
        </NavigationMenu.List>
        <div className="absolute inset-x-0 top-full flex w-full justify-center shadow-header bg-white">
          <NavigationMenu.Viewport
            // className={cn(
            //   "relative origin-[top_center] overflow-hidden bg-(--color-header-bg)",
            //   "data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in",
            //   "transition-[width,height] duration-200",
            //   "h-(--radix-navigation-menu-viewport-height) w-full",
            // )}
          />
        </div>
      </NavigationMenu.Root>
    );
  }
  return null;
}


function MegaMenu({ items,title }: { items: SingleMenuItem[],title:string }) {
  const components = useComponentStore((state)=>state.headerMenuItems)
  const hasRight = components.find((elm)=>elm.position === "right" && elm.heading === title)
  const hasTop = components.find((elm)=>elm.position === "top" && elm.heading === title)
  const general = components.find((elm)=>elm.position ==="general" && elm.heading===title) as HeaderGeneralEditProps | undefined;
  
  return (
    <>
      <div 
        className="flex w-full"
        style={
          general != undefined  ?
            {
              height:general.height && general.height,
              backgroundColor:`${general.bgColor}`,
              ...selectorPaddingMargin("padding",general.paddingSelect,general.padding),
            }:null
        }
      >
        <div 
          className='flex flex-col'
          style={general != undefined ? {
            width:`${general.size}%`,
            backgroundColor:`${general.bgLeftColor}`
          }:null}
          >
          {hasTop &&  components.map((data)=>{
            if(data.heading=== title ){
              if(data.type ==="textTop"){
                return <TopTextHeader {...data} key={data.id}/>
              }
              if(data.type ==="productTop"){
                return <ProductTopHeader {...data} key={data.id}/>
              }
            }
          }
          )
            
          }
          <ul 
            className='flex flex-wrap'
            >
            {items.map(({ id, title, to, items: children, resource }, idx) =>
              resource?.image && children.length === 0 ? ( 
                <SlideIn
                  key={id}
                  className="group/item relative aspect-square grow overflow-hidden bg-gray-100"
                  style={{ "--idx": idx } as React.CSSProperties}
                >
                  <Image
                    sizes="auto"
                    data={resource.image}
                    className="transition-transform duration-300 group-hover/item:scale-[1.03]"
                    width={300}
                  />
                  <NavigationMenu.Link asChild>
                    <Link
                      to={to}
                      prefetch="intent"
                      className={clsx([
                        "absolute inset-0 flex items-center justify-center p-2 text-center",
                        "bg-black/20 group-hover/item:bg-black/40",
                        "h6 text-body-inverse transition-all duration-300",
                      ])}
                    >
                      {title}
                    </Link>
                  </NavigationMenu.Link>
                </SlideIn>
              ) : ( 
                <SlideIn
                  key={id}
                  style={
                    { width:general!=undefined ? `${general.mSize}%`:'100%',
                      "--idx": idx } as React.CSSProperties}
                >
                  <NavigationMenu.Link asChild>
                    <Link
                      to={to}
                      prefetch="intent"
                      className="uppercase transition-none"
                      style={general!=undefined?{
                        color:`${general.tColor}`,
                        letterSpacing:`${general.tSpacing}`,
                        fontWeight:`${general.tWeight}`,
                        ...selectorPaddingMargin('padding',general.tPaddingSelect,general.tPadding),  
                        ...selectorPaddingMargin('margin',general.tMarginSelect,general.tMargin)   

                      }:null}
                    >
                      <RevealUnderline>{title}</RevealUnderline>
                    </Link>
                  </NavigationMenu.Link>
                  {children && (
                    <div>
                      <ul className="flex flex-col gap-1.5 "> 
                        {children.map((cItem) => (
                          <li key={cItem.id}>
                            <NavigationMenu.Link asChild>
                              <Link
                                to={cItem.to}
                                prefetch="intent"
                                className="group relative items-center gap-2 transition-none"
                                style={general != undefined ? {
                                  color:`${general.sColor}`,
                                  letterSpacing:`${general.sSpacing}`,
                                  fontWeight:`${general.sWeight}`,
                                  ...selectorPaddingMargin("padding",general.sPaddingSelect,general.sPadding),
                                  ...selectorPaddingMargin("margin",general.sMarginSelect,general.sMargin)

                                }:null }
                              >
                                <RevealUnderline>{cItem.title}</RevealUnderline>
                                {cItem.isExternal && (
                                  <span className="invisible text-sm group-hover:visible">
                                    ↗
                                  </span>
                                )}
                              </Link>
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </SlideIn>
              ),
            )}
            
          </ul>
        </div>

      {
        general != undefined && general.showDivisor &&(
          <div style={{
            backgroundColor:`${general.colorDivisor}`,
            width:`${general.divisorWidth}`,
            height:`${general.divisorHeight}`,
  
          }}></div>
        ) 
      }
      {
       hasRight &&(
        <div 
          id={`subMenuLeft-${title.toLowerCase()}`} 
          className=' flex flex-col w-full' 
          style={general != undefined ? {
            width:`${100-general.size}%`,
            backgroundColor:`${general.bgRightColor}`
          }:null}
          >
          {components.map((data)=>{
            if(data.heading=== title ){
              if(data.type ==="textLeft"){
                return <TextHeader {...data} key={data.id}/>
              }
              if( data.type === "banner" ){
                return <BannerHeader {...data} key={data.id}/>
              }
              if( data.type === "imageLink"){
                return <ImageLinkHeader {...data} key={data.id} />
              }
            }
          }
          )}
        </div>
       ) 
      }
      </div>
    </>
  );
}

function SlideIn(props: {
  className?: string;
  children: React.ReactNode;
  style: React.CSSProperties;
}) {
  const { className, children, style } = props;
  return (
    <li
      className={cn(
        "[animation-delay:calc(var(--idx)*100ms+100ms)]",
        "animate-slide-left [--slide-left-from:40px] [animation-duration:200ms]",
        "opacity-0",
        className,
      )}
      style={style}
    >
      {children}
    </li>
  );
}

function getMaxDepth(item: { items: any[] }): number {
  if (item.items?.length > 0) {
    return Math.max(...item.items.map(getMaxDepth)) + 1;
  }
  return 1;
}

