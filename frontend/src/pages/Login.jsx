import LoginForm from "../components/loginform";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <LoginForm isSignupPage={false} />
        <div className="mt-4 text-center">
          <span className="text-muted-foreground text-sm">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline focus:outline-none"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
