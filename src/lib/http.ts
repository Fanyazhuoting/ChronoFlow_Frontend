import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/auth-store";
import { ensureValidAccessToken, refresh } from "@/api/authApi";

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

export const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

const isAuthPath = (url?: string) => {
  if (!url) return false;
  const path = url.startsWith("http") ? new URL(url).pathname : url;
  return path.startsWith("/auth/");
};

http.interceptors.request.use(async (config) => {
  if (!isAuthPath(config.url)) {
    const token = await ensureValidAccessToken();
    if (!token) {
      useAuthStore.getState().clear();
      if (typeof window !== "undefined") window.location.assign("/login");
      throw new Error("Token refresh failed");
    }
    config.headers = config.headers ?? {};
    (
      config.headers as Record<string, string>
    ).Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const response = error.response;
    const config = (error.config || {}) as RetriableConfig;

    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    if (isAuthPath(config.url)) {
      useAuthStore.getState().clear();
      if (typeof window !== "undefined") window.location.assign("/login");
      return Promise.reject(error);
    }

    config._retry = true;
    const ok = await refresh();
    if (!ok) {
      useAuthStore.getState().clear();
      if (typeof window !== "undefined") window.location.assign("/login");
      return Promise.reject(error);
    }

    const newToken = useAuthStore.getState().accessToken;
    config.headers = config.headers ?? {};
    if (newToken) {
      (
        config.headers as Record<string, string>
      ).Authorization = `Bearer ${newToken}`;
    } else {
      delete (config.headers as Record<string, string>).Authorization;
    }

    return http(config);
  }
);
