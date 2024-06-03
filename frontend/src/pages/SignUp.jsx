import { AuthContext } from "@/components/AuthContext";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

const SignUp = () => {
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
      <LoginForm isSignUpPage={true} />
    </div>
  );
};

export default SignUp;
