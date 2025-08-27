import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./lib/auth-store";
import router from "./router/route";
import { hydrateAuthFromStorage } from "./lib/auth";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateAuthFromStorage(); // sync-load tokens
    const { accessToken, isTokenValid, refresh } = useAuthStore.getState();
    (async () => {
      if (accessToken && !(isTokenValid?.() ?? false)) {
        await refresh(); // silent refresh if needed
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null; //spinner later
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  );
}
