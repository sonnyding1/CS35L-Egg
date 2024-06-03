import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Community from "./pages/Community.jsx";
import Edit from "./pages/Edit.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp";
import Post from "./pages/Post";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Browse from "./pages/Browse";
import NotFoundPage from "./pages/NotFoundPage";
import Profile from "./pages/Profile";
import AuthCheck from "./components/AuthCheck";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/community",
    element: <Community />,
  },
  {
    path: "/edit",
    element: (
      <ProtectedRoute>
        <Edit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/browse",
    element: (
      <ProtectedRoute>
        <Browse />
      </ProtectedRoute>
    ),
  },
  {
    path: "/posts/:fileID",
    element: <Post />,
  },
  {
    path: "/profiles/:usernameURL",
    element: <Profile />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthCheck />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
