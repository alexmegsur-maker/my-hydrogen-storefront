import { reactRouter } from "@react-router/dev/vite";
import { hydrogen } from "@shopify/hydrogen/vite";
import { oxygen } from "@shopify/mini-oxygen/vite";
import tailwindcss from "@tailwindcss/vite";
import { createLogger, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// @judgeme/shopify-hydrogen publica sus builds con "//# sourceMappingURL"
// apuntando a los .ts fuente originales, que no vienen incluidos en el
// paquete de npm (solo se publica dist/). Vite no los encuentra al intentar
// inyectar sourcesContent y avisa "Sourcemap ... points to missing source
// files" en cada arranque/petición — inofensivo (no afecta al build ni al
// comportamiento), pero solo se puede silenciar filtrando ese aviso concreto,
// ya que ni excluirlo ni incluirlo en optimizeDeps evita que Vite lo procese.
const judgemeSourcemapFilteredLogger = createLogger();
const originalWarnOnce = judgemeSourcemapFilteredLogger.warnOnce;
judgemeSourcemapFilteredLogger.warnOnce = (msg, options) => {
  if (msg.includes("@judgeme/shopify-hydrogen") && msg.includes("missing source files")) {
    return;
  }
  originalWarnOnce(msg, options);
};

const fontDisplayOptional = {
  name: "font-display-optional",
  transform(code: string, id: string) {
    if (id.includes("@fontsource") && id.endsWith(".css")) {
      return { code: code.replace(/font-display:\s*swap/g, "font-display: optional") };
    }
  },
};

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
    tailwindcss(),
    fontDisplayOptional,
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
  },
  customLogger: judgemeSourcemapFilteredLogger,
  server: {
    warmup: {
      clientFiles: [
        "./app/routes/**/*",
        "./app/sections/**/*",
        "./app/components/**/*",
      ],
    },
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  ssr: {
    optimizeDeps: {
      include: [
        "deepmerge",
        "@radix-ui/react-primitive",
        "jsonp",
        "classnames",
        "typographic-trademark",
        "typographic-single-spaces",
        "typographic-registered-trademark",
        "typographic-math-symbols",
        "typographic-en-dashes",
        "typographic-em-dashes",
        "typographic-ellipses",
        "typographic-currency",
        "typographic-copyright",
        "typographic-apostrophes-for-possessive-plurals",
        "typographic-quotes",
        "typographic-apostrophes",
        "textr",
      ],
    },
  },
});
