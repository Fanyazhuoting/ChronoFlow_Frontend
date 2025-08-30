import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { ensureValidAccessToken, refresh } from "@/api/authApi";

type Options = { bufferMs?: number };

export function useTokenAutoRefresh(options?: Options) {
  const accessTokenExp = useAuthStore((s) => s.accessTokenExp); 
  const timerRef = useRef<number | null>(null);
  const lastFocusRunRef = useRef(0);

  const DEFAULT_BUFFER_MS = 30_000;
  const envBuf = Number(import.meta.env.VITE_TOKEN_REFRESH_BUFFER);
  const configuredBuffer =
    typeof options?.bufferMs === "number"
      ? options.bufferMs
      : Number.isFinite(envBuf)
      ? Math.max(0, envBuf)
      : DEFAULT_BUFFER_MS;

  const isExpValid = (expSec: number | null | undefined, bufMs: number) => {
    if (!expSec) return false;
    return expSec * 1000 > Date.now() + bufMs;
  };

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!accessTokenExp) return;

    const expiryMs = accessTokenExp * 1000;
    const delay = Math.max(0, expiryMs - Date.now() - configuredBuffer);

    if (delay === 0) {
      void refresh();
      return;
    }

    timerRef.current = window.setTimeout(async () => {
      await ensureValidAccessToken();
    }, delay);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [accessTokenExp, configuredBuffer]);

  useEffect(() => {
    const onFocusOrVisible = async () => {
      const now = Date.now();
      if (now - lastFocusRunRef.current < 1000) return;
      lastFocusRunRef.current = now;

      if (!isExpValid(accessTokenExp, configuredBuffer)) {
        await ensureValidAccessToken();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void onFocusOrVisible();
      }
    };

    window.addEventListener("focus", onFocusOrVisible);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocusOrVisible);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [accessTokenExp, configuredBuffer]);
}
