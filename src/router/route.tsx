import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/pages/Layout";
import RootPage from "@/pages/Root";
import ErrorFallback from "@/components/error";
import TestPage from "@/pages/test";
import RequireAuth from "@/components/auth/require-auth";
import Login from "@/pages/login";

const MembersPage = () => <h2>Members Page</h2>;

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <RootPage /> },
          { path: "members", element: <MembersPage /> },
          { path: "test", element: <TestPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <ErrorFallback /> },
]);

export default router;
