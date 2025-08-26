// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/pages/Layout";
import RootPage from "@/pages/Root";
import { requireAuthLoader } from "@/api/requireAuthLoader";
import ErrorFallback from "@/components/error";

const LoginPage = () => <div>Login</div>;
const RegisterPage = () => <div>Register</div>;
const MembersPage = () => <div>Members Page</div>;

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    path: "/",
    element: <AppLayout />, // layout for authed area
    // loader: requireAuthLoader, // <— guard here
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <RootPage /> },
      { path: "members", element: <MembersPage /> },
    ],
  },

  { path: "*", element: <RootPage /> }, // or redirect
]);

export default router;
