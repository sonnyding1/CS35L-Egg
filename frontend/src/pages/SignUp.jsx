import { useAuth } from "@/components/AuthContext";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      {user ? navigate("/") : <LoginForm isSignUpPage={true} />}
    </div>
  );
};

export default SignUp;
