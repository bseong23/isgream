import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import childReducer from "./slices/childSlice";
import authReducer from "./slices/authSlice"; // 인증 관련 슬라이스가 있다면

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["child", "auth"] // 영구 저장할 리듀서 추가
};

const rootReducer = combineReducers({
  child: childReducer,
  auth: authReducer // 인증 관련 리듀서 추가
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
