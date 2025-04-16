import { defineConfig } from "npm:vite";
import { join } from "https://deno.land/std/path/mod.ts";

export default defineConfig({
  root: "client", // Source directory for frontend
  build: {
    outDir: "../dist", // Output to project root/dist/
    emptyOutDir: true, // Clear dist/ before building
    rollupOptions: {
      input: join(Deno.cwd(), "resources", "main.js"), // JS entry point
      output: {
        entryFileNames: "main.js", // Output JS path
        assetFileNames: "[name].[ext]", // Output CSS path
      },
    },
  },
  server: {
    port: 5173, // Vite dev server port
  },
});
