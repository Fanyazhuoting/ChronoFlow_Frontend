import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./lib/auth-store";
import router from "./router/route";
import { hydrateAuthFromStorage } from "./lib/auth";

function App() {
  useEffect(() => {
    // Hydrate auth state on app start
    hydrateAuthFromStorage();

    // Optional: Check token validity on app start
    const { accessToken, isTokenValid, refresh } = useAuthStore.getState();
    if (accessToken && !isTokenValid?.()) {
      refresh(); // Silent refresh
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
