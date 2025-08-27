import { useAuthStore } from "@/lib/auth-store";
import { http } from "@/lib/http";
import type { User } from "@/lib/type";

export const login = async (credentials: User) => {
  try {
    const response = await http.post("/auth/login", credentials);
    const { user, accessToken, refreshToken, accessTokenExpires } =
      response.data;

    useAuthStore.getState().setAuth({
      user,
      accessToken,
      refreshToken,
      accessTokenExp: accessTokenExpires,
    });

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await http.post("/auth/logout");
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    useAuthStore.getState().clear();
  }
};
