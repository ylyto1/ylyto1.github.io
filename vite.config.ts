// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Inside the Lovable sandbox we keep the default Cloudflare/SSR target so the
// live preview keeps working. For GitHub Pages (and any other static host) we
// switch nitro to the `static` preset and prerender the landing page so the
// build emits a real `dist/index.html` that GitHub Pages can serve. Client-side
// routes (/auth, /admin, ...) are handled via the SPA fallback (404.html copy)
// configured in .github/workflows/deploy.yml.
const isSandbox =
  process.env.LOVABLE_SANDBOX === "1" || !!process.env.DEV_SERVER__PROJECT_PATH;

const staticNitro = {
  preset: "static",
  output: {
    dir: "dist",
    publicDir: "dist",
  },
  prerender: {
    crawlLinks: false,
    routes: ["/"],
  },
} as unknown as { preset: string };

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  ...(isSandbox ? {} : { nitro: staticNitro }),
});
