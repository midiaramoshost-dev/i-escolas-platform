import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icon16.png", "icon32.png", "icon48.png", "icon128.png", "og-image.png"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,webp}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      },
      manifest: {
        name: "i ESCOLAS - Gestão Escolar",
        short_name: "iESCOLAS",
        description: "Plataforma completa de gestão escolar",
        theme_color: "#1e56a0",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icon16.png", sizes: "16x16", type: "image/png" },
          { src: "/icon32.png", sizes: "32x32", type: "image/png" },
          { src: "/icon48.png", sizes: "48x48", type: "image/png" },
          { src: "/icon128.png", sizes: "128x128", type: "image/png" },
          { src: "/icon128.png", sizes: "128x128", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
