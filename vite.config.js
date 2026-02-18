import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        sass: resolve(__dirname, "sass.html"),
        animations: resolve(__dirname, "animering.html")
      }
    }
  }
});