import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/pages/Layout";
import RootPage from "@/pages/Root";
import ErrorFallback from "@/components/error";
import TestPage from "@/pages/test";
import LoginForm from "@/pages/test/LoginForm";
import RequireAuth from "@/components/auth/require-auth";

const LoginPage = () => <LoginForm />;
const RegisterPage = () => <div>Register</div>;
const MembersPage = () => <div>Members Page</div>;

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
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
