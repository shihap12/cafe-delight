import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to XAMPP backend under /cafe/server/api
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
        // Backend moved to `cafe-backend/server`
        rewrite: (path) => path.replace(/^\/api/, "/cafe-backend/server/api"),
      },
      "/uploads": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uploads/, "/cafe-backend/uploads"),
      },
    },
  },
});
