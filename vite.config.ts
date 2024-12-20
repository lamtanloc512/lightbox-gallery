import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno()],
  build: {
    lib: {
      entry: "src/main.ts",
      name: "LightboxGallery",
      // formats: ["es"],
      formats: ["umd", "es", "cjs"],
    },
    minify: true,
    rollupOptions: {
      // external: /^@microsoft\/fast-(element|components)/,
      output: {
        globals: {
          lightboxGallery: "LightboxGallery",
        },
      },
    },
  },
});
