import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/auth-store";

type Options = { bufferMs?: number };

export function useTokenAutoRefresh(options?: Options) {
  const accessTokenExp = useAuthStore((state) => state.accessTokenExp);
  const isTokenValid = useAuthStore((state) => state.isTokenValid);
  const refresh = useAuthStore((state) => state.refresh);

  const timerRef = useRef<number | null>(null);

  const DEFAULT_BUFFER_MS = 30_000;
  const configuredBuffer =
    typeof options?.bufferMs === "number"
      ? options.bufferMs
      : Number(
          import.meta.env.VITE_TOKEN_REFRESH_BUFFER ?? DEFAULT_BUFFER_MS
        ) || DEFAULT_BUFFER_MS;

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!accessTokenExp) {
      return;
    }

    const expiryTimeInMs = accessTokenExp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiryTimeInMs - now;
    const refreshDueIn = timeUntilExpiry - configuredBuffer;

    if (refreshDueIn <= 0) {
      console.log("Token expired or close to expiry → refreshing now");
      void refresh();
      return;
    }

    timerRef.current = window.setTimeout(function scheduledRefreshCheck() {
      if (typeof isTokenValid === "function") {
        const stillValid = isTokenValid();
        if (!stillValid) {
          console.log("Token invalid on scheduled check → refreshing");
          void refresh();
        }
      } else {
        console.warn("isTokenValid not available → attempting refresh anyway");
        void refresh();
      }
    }, Math.max(0, refreshDueIn));

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [accessTokenExp, configuredBuffer, isTokenValid, refresh]);

  useEffect(() => {
    let lastRun = 0;

    const onFocusOrVisible = () => {
      const now = Date.now();

      if (now - lastRun < 1000) return;

      lastRun = now;
      if (!isTokenValid?.()) void refresh();
    };

    window.addEventListener("focus", onFocusOrVisible);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        onFocusOrVisible();
      }
    });

    return () => {
      window.removeEventListener("focus", onFocusOrVisible);
      document.removeEventListener("visibilitychange", onFocusOrVisible);
    };
  }, [isTokenValid, refresh]);
}
