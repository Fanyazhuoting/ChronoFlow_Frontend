import { useAuthStore } from "@/lib/auth-store";
import { http } from "@/lib/http";
import { decodeExp } from "@/lib/auth";
import type { User, AuthCredentials } from "@/lib/type";

let refreshing: Promise<boolean> | null = null;

function setAuthFromServer(payload: {
  user?: User;
  accessToken: string;
  accessTokenExpires?: number;
}) {
  const s = useAuthStore.getState();
  const exp =
    payload.accessTokenExpires ?? decodeExp(payload.accessToken) ?? null;

  const credentials: AuthCredentials = {
    user: (payload.user ?? s.user) as User,
    accessToken: payload.accessToken,
    accessTokenExp: exp ?? undefined,
  };

  s.setAuth(credentials);
}

export async function login(credentials: User) {
  const res = await http.post("/auth/login", credentials, {
    withCredentials: true,
  });

  const { user, accessToken, accessTokenExpires } = res.data as {
    user: User;
    accessToken: string;
    accessTokenExpires?: number;
  };

  setAuthFromServer({ user, accessToken, accessTokenExpires });

  return res.data;
}

export async function logout() {
  try {
    await http.post("/auth/logout", {}, { withCredentials: true });
  } finally {
    useAuthStore.getState().clear();
  }
}

export function refresh(): Promise<boolean> {
  if (refreshing) return refreshing;

  const base = import.meta.env.VITE_BACKEND_URL as string;

  refreshing = (async () => {
    try {
      const r = await fetch(`${base}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!r.ok) throw new Error("refresh failed");

      const { accessToken, accessTokenExpires, user } = (await r.json()) as {
        accessToken: string;
        accessTokenExpires?: number;
        user?: User;
      };

      setAuthFromServer({ user, accessToken, accessTokenExpires });
      return true;
    } catch {
      useAuthStore.getState().clear();
      return false;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

export async function ensureValidAccessToken(): Promise<string | null> {
  const s = useAuthStore.getState();
  if (!s.isTokenValid()) {
    const ok = await refresh();
    if (!ok) return null;
  }
  return useAuthStore.getState().accessToken;
}
