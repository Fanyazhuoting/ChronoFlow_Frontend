// auth.ts
import { ensureValidAccessToken, refresh } from "@/api/authApi";
import { redirect } from "react-router-dom";

export async function requireAuthLoader() {
  const token = await ensureValidAccessToken();
  if (!token) return redirect("/login");
  return null;
}

export async function redirectIfAuthenticated() {
  const token = await ensureValidAccessToken();
  if (token) return redirect("/");
  return null;
}

export async function hydrateAuthOnBoot() {
  await refresh();
}

export function decodeExp(token: string): number | null {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    const p = JSON.parse(json);
    return typeof p.exp === "number" ? p.exp : null;
  } catch {
    return null;
  }
}
