import { create } from "zustand";
import { type AuthState } from "./type";
import { decodeExp } from "./auth";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExp: null,
  _refreshing: null,

  setAuth: ({ user, accessToken, refreshToken, accessTokenExp }) => {
    const exp = accessTokenExp ?? decodeExp(accessToken) ?? null;
    const next = {
      user,
      accessToken,
      refreshToken: refreshToken ?? get().refreshToken,
      accessTokenExp: exp,
    };
    set(next);
    localStorage.setItem(
      import.meta.env.VITE_AUTH_STORAGE_KEY,
      JSON.stringify(next)
    );
  },

  clear: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExp: null,
      _refreshing: null,
    });
    localStorage.removeItem(import.meta.env.VITE_AUTH_STORAGE_KEY);
  },

  refresh: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;
    if (get()._refreshing) return get()._refreshing!;

    const p = (async () => {
      try {
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!r.ok) throw new Error("refresh failed");

        const data: {
          accessToken: string;
          accessTokenExpires?: number;
          refreshToken?: string;
        } = await r.json();

        const exp =
          data.accessTokenExpires ?? decodeExp(data.accessToken) ?? null;

        set((s) => {
          const next = {
            user: s.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken ?? s.refreshToken,
            accessTokenExp: exp,
          };
          localStorage.setItem(
            import.meta.env.VITE_AUTH_STORAGE_KEY,
            JSON.stringify(next)
          );
          return next;
        });

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
    const buf = Number(import.meta.env.VITE_TOKEN_REFRESH_BUFFER ?? 0) || 0;
    return accessTokenExp * 1000 > Date.now() + buf;
  },
}));
