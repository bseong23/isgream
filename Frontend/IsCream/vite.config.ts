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
        name: "아이's그림",
        short_name: "아이's그림",
        description: "AI가 해주는 아이심리 검사사",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "fullscreen",
        orientation: "portrait",
        scope: ".",
        start_url: ".",
        categories: ["education", "kids"],
        icons: [
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB 제한
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        disableDevLogs: true,
        navigateFallback: "index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/i12a407\.p\.ssafy\.io/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false, // 개발 모드에서 서비스 워커 비활성화
        type: "module"
      }
    })
  ],
  define: {
    "process.env": process.env,
    VITE_KAKAO_MAP_API_KEY: JSON.stringify(process.env.VITE_KAKAO_MAP_API_KEY)
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
