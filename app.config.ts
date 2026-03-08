import { defineConfig } from "@solidjs/start/config";
import { readFileSync } from "fs";

// Read @solidjs/start version at build time — injected into the server
// bundle as a constant (no node_modules access at runtime in Nitro).
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

    // Build-time constants injected into the Nitro server bundle.
    // At runtime these are literals, not env vars — safe and fast.
    define: {
      __SOLID_START_VERSION__: JSON.stringify(solidStartVersion),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  },
});
