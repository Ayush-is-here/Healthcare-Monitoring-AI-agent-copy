import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const API_TARGET = process.env.API_TARGET ?? "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // The FastAPI app registers no CORS middleware, so proxy in dev
    // rather than making the browser issue cross-origin requests.
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
