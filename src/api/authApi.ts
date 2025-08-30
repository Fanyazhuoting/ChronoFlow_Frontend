import { useAuthStore } from "@/lib/auth-store";
import { http } from "@/lib/http";
import type { User } from "@/lib/type";

export const login = async (credentials: User) => {
  const res = await http.post("/auth/login", credentials, {
    withCredentials: true,
  });
  const { user, accessToken, accessTokenExpires } = res.data;

  useAuthStore.getState().setAuth({
    user,
    accessToken,
    accessTokenExp: accessTokenExpires,
  });

  return res.data;
};

export const logout = async () => {
  try {
    await http.post("/auth/logout", {}, { withCredentials: true });
  } finally {
    useAuthStore.getState().clear();
  }
};
