import axios from "axios";
import { useAuthStore } from "./auth-store";

export const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<boolean> | null = null;

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (!response || response.status !== 401 || (config as any)._retry) {
      return Promise.reject(error);
    }
    (config as any)._retry = true;

    if (!refreshing) {
      refreshing = useAuthStore
        .getState()
        .refresh()
        .finally(() => {
          refreshing = null;
        });
    }
    const ok = await refreshing;
    if (!ok) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    const newToken = useAuthStore.getState().accessToken;
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = newToken
      ? `Bearer ${newToken}`
      : "";
    return http(config);
  }
);
