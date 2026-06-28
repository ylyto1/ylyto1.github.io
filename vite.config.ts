// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Inside the Lovable sandbox we keep the default Cloudflare/SSR target so the
// live preview keeps working. Outside the sandbox (e.g. the GitHub Actions
// deploy workflow) we switch TanStack Start to full SPA mode and nitro to the
// `static` preset so the build emits a single `dist/index.html` that GitHub
// Pages can serve. Client-side deep links work via the SPA fallback that the
// workflow installs (copy index.html → 404.html).
const isSandbox =
  process.env.LOVABLE_SANDBOX === "1" || !!process.env.DEV_SERVER__PROJECT_PATH;

const staticNitro = {
  preset: "static",
  output: {
    dir: "dist",
    publicDir: "dist",
  },
} as unknown as { preset: string };

const spaTanstack = {
  spa: {
    enabled: true,
  },
} as unknown as { spa: { enabled: boolean } };

export default defineConfig({
  tanstackStart: isSandbox ? { server: { entry: "server" } } : spaTanstack,
  ...(isSandbox ? {} : { nitro: staticNitro }),
});
