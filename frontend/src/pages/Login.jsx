import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "@/components/AuthContext";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      {user ? navigate("/") : <LoginForm isSignUpPage={false} />}
    </div>
  );
};

export default Login;
