import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
