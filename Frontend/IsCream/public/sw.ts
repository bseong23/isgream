/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;
declare const workbox: any;

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

if (workbox) {
  console.log("✅ Workbox is loaded");

  // 기존 캐시된 리소스를 미리 저장 및 라우팅
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // API 요청 캐싱 (NetworkFirst 전략)
  workbox.routing.registerRoute(
    ({ url }: { url: URL }) => url.href.includes("i12a407.p.ssafy.io"),
    new workbox.strategies.NetworkFirst({
      cacheName: "api-cache",
      networkTimeoutSeconds: 5
    })
  );
} else {
  console.log("❌ Workbox failed to load");
}

// 서비스 워커 설치 이벤트
self.addEventListener("install", (event) => {
  console.log("🛠 Service Worker installing...");
});

// 서비스 워커 활성화 이벤트
self.addEventListener("activate", async (event) => {
  console.log("🚀 Service Worker activated!");

  // 기존 클라이언트 강제 새로고침 방지 (skipWaiting 사용 X)
  const clients = await self.clients.matchAll();
  clients.forEach((client) => client.postMessage({ type: "UPDATE_READY" }));
});
