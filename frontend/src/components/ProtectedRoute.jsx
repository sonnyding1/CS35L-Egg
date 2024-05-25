import React from "react";
import { Navigate } from "react-router-dom";
import { AuthWrapper, useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AuthWrapper>{children}</AuthWrapper>;
};

export default ProtectedRoute;
