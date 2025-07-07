import { defineConfig } from "npm:vite";
import { join, resolve } from "https://deno.land/std/path/mod.ts";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "public", // Output to project root/dist/
    emptyOutDir: true, // Clear dist/ before building
    minify: Deno.env.get("APP_ENV") === "production",
    rollupOptions: {
      input: {
        admin: join(Deno.cwd(), "src/admin", "main.js"),
        site: join(Deno.cwd(), "src/site", "main.js"),
      },
      output: {
        entryFileNames: "main.js", // Output JS path
        assetFileNames: "[name].[ext]", // Output CSS path
      },
    },
  },
  server: {
    port: 5173, // Vite dev server port
  },
  resolve: {
    alias: {
      "@": resolve(new URL(".", import.meta.url).pathname, "src"),
    },
  },
});
