import { useEffect } from "react";

interface JudgemeConfig {
  shopDomain: string;
  publicToken: string;
  cdnHost: string;
  delay?: number;
}

declare global {
  interface Window {
    jdgm?: { SHOP_DOMAIN: string; PLATFORM: string; PUBLIC_TOKEN: string };
    jdgm_preloader?: () => void;
    jdgm_rerender?: number;
    jdgmCacheServer?: { reloadAll: () => void };
  }
}

/**
 * Reimplementación de `useJudgeme` de `@judgeme/shopify-hydrogen`
 * (components/providers/JudgemeLoader.js), con una única diferencia: los
 * `<script>` inline que crea (credenciales de tienda + `widget_preloader.js`
 * envuelto) llevan el `nonce` de la página antes de insertarse.
 *
 * Sin nonce, la CSP del sitio (que declara un `'nonce-...'` en `script-src`)
 * los bloquea — con un nonce presente, el navegador ignora `'unsafe-inline'`
 * por spec, así que esos scripts nunca se ejecutaban y `window.jdgm_preloader`
 * no llegaba a existir nunca (los widgets de Judge.me se quedaban vacíos en
 * toda la web, no solo en el configurador).
 */
export function useJudgemeWithNonce(
  { shopDomain, publicToken, cdnHost, delay = 500 }: JudgemeConfig,
  nonce: string,
) {
  useEffect(() => {
    if (!shopDomain || !publicToken || !cdnHost) {
      console.log("CONFIG ERROR: Missing config values for store domain, store public token, cdn host");
      return;
    }

    const shopCredentials = `
      if (typeof jdgm === 'undefined') {
        let jdgm = {};
        jdgm.SHOP_DOMAIN = '${shopDomain}';
        jdgm.PLATFORM = 'shopify';
        jdgm.PUBLIC_TOKEN = '${publicToken}';
        window.jdgm = jdgm;
      };
    `;

    fetch(`${cdnHost}/widget_preloader.js`)
      .then((res) => res.text())
      .then((text) => {
        const preloaderFunction = `function jdgm_preloader(){${text}}`;

        const shopCredentialsScript = document.createElement("script");
        const preloaderScript = document.createElement("script");
        const installedScript = document.createElement("script");

        // El nonce va en la propiedad IDL `.nonce`, no en el atributo HTML
        // (los navegadores ocultan el valor del atributo tras insertarlo).
        shopCredentialsScript.nonce = nonce;
        preloaderScript.nonce = nonce;

        shopCredentialsScript.innerText = shopCredentials;
        preloaderScript.innerText = preloaderFunction;
        installedScript.src = `${cdnHost}/assets/installed.js`;

        document.head.append(shopCredentialsScript, preloaderScript, installedScript);
        console.log("Judge.me script loaded (con nonce)");
      });
  }, [shopDomain, publicToken, cdnHost, nonce]);

  useEffect(() => {
    if (window.jdgm_rerender) {
      window.clearTimeout(window.jdgm_rerender);
    }
    window.jdgm_rerender = window.setTimeout(() => {
      window.clearTimeout(window.jdgm_rerender);
      if (window.jdgm_preloader && !window.jdgmCacheServer) {
        window.jdgm_preloader();
      } else if (window.jdgmCacheServer) {
        window.jdgmCacheServer.reloadAll();
      } else {
        console.log("missing Judge.me script");
      }
    }, delay);
  });
}
