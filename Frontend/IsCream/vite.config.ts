import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "My PWA App",
        short_name: "PWA App",
        description: "A simple PWA using React and Vite",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  define: {
    "process.env": process.env
  },
  server: {
    proxy: {
      "/api": {
        target: "https://i12a407.p.ssafy.io",
        changeOrigin: true,
        secure: true,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    }
  }
});
