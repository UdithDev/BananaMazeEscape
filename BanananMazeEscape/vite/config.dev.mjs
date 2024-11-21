import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  server: {
    port: 8080,
    proxy: {
      // Proxy for the API endpoint
      "/api/question": {
        target: "https://marcconrad.com/uob/banana/api.php",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/question", ""),
      },
      // Proxy for the image URLs
      "/image-proxy": {
        target: "https://www.sanfoh.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace("/image-proxy", ""),
      },
    },
  },
});
