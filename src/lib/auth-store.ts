import { create } from "zustand";
import { type User } from "./type";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExp: number | null;
  setAuth: (v: {
    user: User;
    accessToken: string;
    refreshToken?: string;
    accessTokenExp?: number;
  }) => void;
  clear: () => void;
  _refreshing: Promise<boolean> | null;
  refresh: () => Promise<boolean>;
};

function decodeExp(token: string): number | null {
  try {
    const p = JSON.parse(atob(token.split(".")[1]));
    return typeof p.exp === "number" ? p.exp : null;
  } catch {
    return null;
  }
}

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
    localStorage.setItem("auth", JSON.stringify(next)); // optional persistence
  },

  clear: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExp: null,
    });
    localStorage.removeItem("auth");
  },

  refresh: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;
    if (get()._refreshing) return get()._refreshing!;

    const p = (async () => {
      try {
        const r = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
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
          localStorage.setItem("auth", JSON.stringify(next));
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
}));

export function hydrateAuthFromStorage() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    useAuthStore.setState({
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      accessTokenExp: parsed.accessTokenExp ?? null,
    });
  } catch {}
}
