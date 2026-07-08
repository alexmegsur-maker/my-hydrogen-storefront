import "./styles/fonts.css";
import cabinLatinUrl from "@fontsource-variable/cabin/files/cabin-latin-wght-normal.woff2?url";
import montserratLatinUrl from "@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2?url";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { SeoConfig } from "@shopify/hydrogen";
import { Analytics, getSeoMeta, useNonce } from "@shopify/hydrogen";
import { useThemeSettings, withWeaverse } from "@weaverse/hydrogen";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LinksFunction, LoaderFunctionArgs, MetaArgs } from "react-router";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import { loadCriticalData, loadDeferredData } from "./.server/root";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { ScrollingAnnouncement } from "./components/layout/scrolling-announcement";
// ELIMINADO: CustomAnalytics ya no se importa para evitar la duplicidad con la Web Pixels API
import { GenericError } from "./components/root/generic-error";
import { GlobalLoading } from "./components/root/global-loading";
import {
  NewsletterPopup,
  useShouldRenderNewsletterPopup,
} from "./components/root/newsletter-popup";
import { NotFound } from "./components/root/not-found";
import styles from "./styles/app.css?url";
import { DEFAULT_LOCALE } from "./utils/const";
import { GlobalStyle } from "./weaverse/style";
import { useJudgeme } from '@judgeme/shopify-hydrogen';
import { GoogleTagManager } from "./components/google-tag-manager";
import CookieConsentBanner from "./components/CookieConsent";

export type RootLoader = typeof loader;

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      href: cabinLatinUrl,
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preload",
      href: montserratLatinUrl,
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    { rel: "icon", type: "image/svg+xml", href: "https://cdn.shopify.com/s/files/1/0777/6370/7216/files/favicon.png?v=1694621278" },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const { context } = args;
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {
    ...deferredData,
    ...criticalData,
    judgeme: {
      shopDomain: context.env.JUDGEME_SHOP_DOMAIN,
      publicToken: context.env.JUDGEME_PUBLIC_TOKEN,
      cdnHost: context.env.JUDGEME_CDN_HOST,
      delay: 3000,
    },
  };
}

export const meta = ({ data }: MetaArgs<typeof loader>) => {
  return getSeoMeta(data?.seo as SeoConfig);
};

function App() {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}/>
      <Outlet />
    </>
    
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  const routeError: { status?: number; data?: any } = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  let pageType = "page";

  if (isRouteError && routeError.status === 404) {
    pageType = routeError.data || pageType;
  }

  return isRouteError ? (
    routeError.status === 404 ? (
      <NotFound type={pageType} />
    ) : (
      <GenericError
        error={{ message: `${routeError.status} ${routeError.data}` }}
      />
    )
  ) : (
    <GenericError error={error instanceof Error ? error : undefined} />
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const nonce = useNonce(); 
  const data = useRouteLoaderData<RootLoader>("root");
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;
  const { topbarHeight, topbarText } = useThemeSettings();
  const shouldShowNewsletterPopup = useShouldRenderNewsletterPopup();
  const [isHydrated,setIsHydrated] = useState(false)

  useJudgeme(data?.judgeme ?? { shopDomain: '', publicToken: '', cdnHost: '', delay: 500 });

  useEffect(() => {
    setIsHydrated(true);
    Promise.all([
      import('gsap').then(m => m.default),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);
    });

    const ts = document.createElement('script');
    ts.src = 'https://widgets.trustedshops.com/js/X40A412C106D4EA9064551BEBCBFAD59D.js';
    ts.async = true;
    document.body.appendChild(ts);
    return () => { document.body.removeChild(ts); };
  }, []);

  if (
    location.pathname === "/subrequest-profiler" ||
    location.pathname === "/graphiql"
  ) {
    return children;
  }

  return (
    <html lang={locale.language}>
      <head> 
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={styles} />
        <Meta />
        <Links />
        <GlobalStyle /> 
         <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];
            function loadGTM(){
              if(window._gtmLoaded)return;
              window._gtmLoaded=true;
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5SSSMFKJ');
            }
            function scheduleGTM(){
              if('requestIdleCallback' in window){requestIdleCallback(loadGTM,{timeout:4000});}
              else{setTimeout(loadGTM,3500);}
            }
            function checkConsentAndLoad(){
              try{
                var c=localStorage.getItem('cookie_consent');
                if(!c)return;
                var consent=JSON.parse(c);
                if(consent.analytics||consent.marketing){scheduleGTM();}
              }catch(e){}
            }
            checkConsentAndLoad();
            window.addEventListener('storage',function(e){if(e.key==='cookie_consent')checkConsentAndLoad();});
            window.addEventListener('cookie_consent_updated',checkConsentAndLoad);`,
            }}
          />
      </head>
      <body
        style={
          {
            "--initial-topbar-height": `${topbarText ? topbarHeight : 0}px`,
          } as CSSProperties
        }
        className="bg-background text-body antialiased overflow-x-hidden"
      >

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5SSSMFKJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
            
          >
            {/* CONECTOR NATIVO: Envía de forma automática la navegación e interacciones SPA a la Web Pixels API de Shopify */}
            {/* <Analytics.Connector nonce={nonce} /> */}
            <GoogleTagManager/>
            <TooltipProvider disableHoverableContent>
              <div
                className="flex min-h-screen flex-col"
                key={`${locale.language}-${locale.country}`}
              >
                <div className="">
                  <a href="#mainContent" className="sr-only">
                    Skip to content
                  </a>
                </div>
                <CookieConsentBanner/>
                <ScrollingAnnouncement />
                <Header />
                <main id="mainContent" className="grow">
                  {children}
                </main>
                <Footer />
              </div>
              {isHydrated && shouldShowNewsletterPopup && <NewsletterPopup />}
            </TooltipProvider>
            
            {/* ELIMINADO: <CustomAnalytics /> quitado para evitar duplicar el dataLayer en el hilo principal */}
          </Analytics.Provider>
        ) : (
          children
        )}
        <GlobalLoading />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default withWeaverse(App);