import { defineConfig } from "@solidjs/start/config";
import { readFileSync } from "fs";

// Read @solidjs/start version at build time — injected as a
// constant into both the Vite dev server and Nitro prod bundle.
let solidStartVersion = "unknown";
try {
  const pkg = JSON.parse(
    readFileSync("./node_modules/@solidjs/start/package.json", "utf-8")
  );
  solidStartVersion = pkg.version;
} catch {
  // Version unavailable — leave as "unknown"
}

export default defineConfig({
  server: {
    // node-server preset: produces .output/server/index.mjs
    // — a self-contained Nitro bundle. No node_modules needed
    // at runtime.
    preset: "node-server",
  },
  vite: {
    // Build-time constants: replaced as string literals in both
    // the Vite dev server (SSR mode) and the Nitro prod bundle.
    // Declared in src/global.d.ts for TypeScript.
    define: {
      __SOLID_START_VERSION__: JSON.stringify(solidStartVersion),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  },
});
