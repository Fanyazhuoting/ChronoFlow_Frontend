import { redirect } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";

export async function requireAuthLoader() {
  const { accessToken, isTokenValid, refresh } = useAuthStore.getState();

  // No token at all - redirect to login
  if (!accessToken) {
    return redirect("/login");
  }

  // Token exists but is expired/invalid - try to refresh
  if (!isTokenValid?.()) {
    try {
      const refreshSuccess = await refresh();

      // Refresh failed - redirect to login
      if (!refreshSuccess) {
        return redirect("/login");
      }

      // Refresh succeeded - continue to route
      return null;
    } catch (error) {
      return redirect("/login");
    }
  }

  // Token is valid - allow access
  return null;
}

export async function redirectIfAuthenticated() {
  const { accessToken, isTokenValid } = useAuthStore.getState();

  if (accessToken && isTokenValid?.()) {
    return redirect("/");
  }

  return null;
}

export function hydrateAuthFromStorage() {
  try {
    const raw = localStorage.getItem(import.meta.env.VITE_AUTH_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);

    if (parsed.accessTokenExp && parsed.accessTokenExp * 1000 <= Date.now()) {
      localStorage.removeItem(import.meta.env.VITE_AUTH_STORAGE_KEY);
      return;
    }

    useAuthStore.getState().setAuth({
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      accessTokenExp: parsed.accessTokenExp ?? null,
    });
  } catch {}
}

export function decodeExp(token: string): number | null {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    const p = JSON.parse(json);
    return typeof p.exp === "number" ? p.exp : null; 
  } catch {
    return null;
  }
}