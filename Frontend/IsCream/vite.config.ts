import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __VITE_KAKAO_MAP_API_KEY__: JSON.stringify(
      process.env.VITE_KAKAO_MAP_API_KEY
    )
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
