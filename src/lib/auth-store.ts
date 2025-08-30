import { create } from "zustand";
import { type AuthState } from "./type";
import { decodeExp } from "./auth";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  accessTokenExp: null,
  _refreshing: null,

  setAuth: ({ user, accessToken, accessTokenExp }) => {
    const exp = accessTokenExp ?? decodeExp(accessToken) ?? null;
    set({
      user,
      accessToken,
      accessTokenExp: exp,
    });
  },

  clear: () => {
    set({
      user: null,
      accessToken: null,
      accessTokenExp: null,
      _refreshing: null,
    });
  },

  refresh: async () => {
    if (get()._refreshing) return get()._refreshing!;

    const p = (async () => {
      try {
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!r.ok) throw new Error("refresh failed");

        const data: {
          accessToken: string;
          accessTokenExpires?: number;
          user?: any;
        } = await r.json();

        const exp =
          data.accessTokenExpires ?? decodeExp(data.accessToken) ?? null;

        set((s) => ({
          user: data.user ?? s.user,
          accessToken: data.accessToken,
          accessTokenExp: exp,
        }));

        return true;
      } catch {
        get().clear();
        return false;
      } finally {
        set({ _refreshing: null });
      }
    })();

    set({ _refreshing: p });
    return p;
  },

  isTokenValid: (): boolean => {
    const { accessTokenExp } = get();

    if (!accessTokenExp) return false;

    const DEFAULT_BUFFER_MS = 30_000;
    const MAX_BUFFER_MS = 5 * 60_000;
    const SKEW_MS = 5_000;

    const raw = Number(import.meta.env.VITE_TOKEN_REFRESH_BUFFER);
    const buf = Number.isFinite(raw)
      ? Math.max(0, Math.min(raw, MAX_BUFFER_MS))
      : DEFAULT_BUFFER_MS;

    const now = Date.now();
    const expMs = accessTokenExp * 1000;
    return expMs > now + buf - SKEW_MS;
  },
}));
