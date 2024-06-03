import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "@/components/AuthContext";
import { useContext, useEffect } from "react";

const Login = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      <LoginForm isSignUpPage={false} />
    </div>
  );
};

export default Login;
