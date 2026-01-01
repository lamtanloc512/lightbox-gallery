import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno()],
  build: {
    lib: {
      entry: "src/main.ts",
      name: "LightboxGallery",
      formats: ["es"],
      fileName: "lightbox-gallery",
    },
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
