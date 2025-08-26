import { useAuthStore } from "@/lib/auth-store";
import { http } from "../lib/http";

export async function login(payload: Record<string, string>) {
  const { data } = await http.post("/auth/login", payload);
  useAuthStore.getState().setAuth({
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessTokenExp: data.accessTokenExpires,
  });
}

export async function logout() {
  try {
    await http.post("/auth/logout", {});
  } catch {}
  useAuthStore.getState().clear();
  window.location.href = "/login";
}
