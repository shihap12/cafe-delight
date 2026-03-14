import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to XAMPP backend under /cafe_backend/server/api
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/cafe_backend/server/api"),
      },
      "/uploads": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uploads/, "/cafe_backend/uploads"),
      },
    },
  },
});
