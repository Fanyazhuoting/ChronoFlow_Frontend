// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/pages/Layout";
import RootPage from "@/pages/Root";
import ErrorFallback from "@/components/error";
import { redirectIfAuthenticated, requireAuthLoader } from "@/lib/auth";

const LoginPage = () => <div>Login</div>;
const RegisterPage = () => <div>Register</div>;
const MembersPage = () => <div>Members Page</div>;

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    loader: redirectIfAuthenticated,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: redirectIfAuthenticated,
  },

  {
    path: "/",
    element: <AppLayout />,
    loader: requireAuthLoader,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <RootPage /> },
      { path: "members", element: <MembersPage /> },
      // Add more protected routes here
    ],
  },

  { path: "*", element: <div>404 - Page Not Found</div> },
]);

export default router;
