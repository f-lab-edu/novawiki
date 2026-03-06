import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MarkdownEditor",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["@f-wiki/markdown-parser"],
    },
  },
  plugins: [
    tailwindcss(),
    dts({
      insertTypesEntry: true,
    }),
  ],
});
