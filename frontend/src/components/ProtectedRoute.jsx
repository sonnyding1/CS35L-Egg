import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import NotFoundPage from "@/pages/NotFoundPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <NotFoundPage />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
