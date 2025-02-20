import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import "./index.css";
import App from "./App";
import { registerSW } from "virtual:pwa-register";

// PWA 업데이트 핸들러
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("새로운 버전이 있습니다. 업데이트하시겠습니까?")) {
      updateSW();
      location.reload(); // 강제 새로고침
    }
  },
  onOfflineReady() {
    console.log("앱이 오프라인에서도 사용할 수 있습니다.");
  }
});

// React 앱 렌더링
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
