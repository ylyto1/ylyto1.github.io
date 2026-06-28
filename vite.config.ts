// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Inside the Lovable sandbox keep the default Cloudflare/SSR build so the live
// preview keeps working. Outside the sandbox (e.g. the GitHub Actions deploy
// workflow), switch to a pure SPA build: disable nitro entirely and enable
// TanStack Start's SPA mode so the build only emits a client bundle + a
// single index.html shell that any static host (GitHub Pages, S3, …) can
// serve. Client-side deep links are handled by the SPA fallback the workflow
// installs (copy index.html → 404.html).
const isSandbox =
  process.env.LOVABLE_SANDBOX === "1" || !!process.env.DEV_SERVER__PROJECT_PATH;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    ...(isSandbox
      ? {}
      : {
          spa: { enabled: true },
        }),
  } as any,
  ...(isSandbox ? {} : { nitro: false as any }),
});
