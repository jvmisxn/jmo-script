import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const jmoCore = path.resolve(__dirname, "../jmo-core/packages/core");

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  resolve: {
    alias: {
      "@jmo/core/theme.css": path.join(jmoCore, "src/theme/theme.css"),
      "@jmo/core/components": path.join(jmoCore, "src/components/index.ts"),
      "@jmo/core/hooks": path.join(jmoCore, "src/hooks/index.ts"),
      "@jmo/core/utils": path.join(jmoCore, "src/utils/index.ts"),
      "@jmo/core/types": path.join(jmoCore, "src/types/index.ts"),
      "@jmo/core": path.join(jmoCore, "src/index.ts"),
      "@": path.resolve("./src"),
    },
  },
  server: {
    port: 1425,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    target: "esnext",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
