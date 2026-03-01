import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        sass: resolve(__dirname, "sass.html"),
        animations: resolve(__dirname, "animering.html"),
        diagram: resolve(__dirname, "diagram.html"),
        karta: resolve(__dirname, "karta.html"),
      },
    },
  },

  plugins: [
    viteStaticCopy({
      targets: [
        { src: "docs", dest: "" }
      ],
    }),
  ],
});