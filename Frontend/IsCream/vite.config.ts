import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        // 기존 manifest 설정 그대로 유지
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        clientsClaim: false, // false로 변경
        skipWaiting: false, // false로 변경
        cleanupOutdatedCaches: true,
        disableDevLogs: true,
        navigateFallback: "index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/i12a407\.p\.ssafy\.io/,
            handler: "NetworkFirst", // StaleWhileRevalidate에서 NetworkFirst로 변경
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 24 * 60 * 60 // 24시간 캐시 유지
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false,
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
