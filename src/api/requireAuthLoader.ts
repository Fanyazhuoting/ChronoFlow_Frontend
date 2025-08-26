import { redirect } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";

export function requireAuthLoader() {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw redirect("/login");
  return null;
}
