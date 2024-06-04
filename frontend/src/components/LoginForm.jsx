import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthContext } from "./AuthContext";
import LoginField from "./LoginField";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";

const LoginForm = ({ isSignUpPage }) => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    errorMessage: "",
  });
  const { name, email, username, password, confirmPassword, errorMessage } =
    formState;
  const passwordsMatch = !isSignUpPage || password === confirmPassword;

  useEffect(() => {
    if (isSignUpPage && password !== confirmPassword) {
      setFormState((prev) => ({
        ...prev,
        errorMessage: "Passwords do not match.",
      }));
    } else {
      setFormState((prev) => ({ ...prev, errorMessage: "" }));
    }
  }, [password, confirmPassword, isSignUpPage]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value, errorMessage: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUpPage) {
        await signup(username, password, name, email);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (error) {
      setFormState((prev) => ({ ...prev, errorMessage: error.message }));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-72">
      {isSignUpPage && (
        <LoginField
          id="name"
          label="Name"
          value={name}
          onChange={handleChange}
          type="text"
        />
      )}
      {isSignUpPage && (
        <LoginField
          id="username"
          label="Username"
          value={username}
          onChange={handleChange}
          type="text"
        />
      )}
      <LoginField
        id="email"
        label="Email"
        value={email}
        onChange={handleChange}
        type="email"
      />
      <LoginField
        id="password"
        label="Password"
        value={password}
        onChange={handleChange}
        type="password"
        isMatched={passwordsMatch}
      />
      {isSignUpPage && (
        <LoginField
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={handleChange}
          type="password"
          isMatched={passwordsMatch}
        />
      )}
      <div className="relative">
        <Button className="w-full" type="submit">
          {isSignUpPage ? "Sign Up" : "Login"}
        </Button>
        {errorMessage && (
          <div className="absolute top-full text-red-500 mt-2">
            {errorMessage}
          </div>
        )}
        <div className="mt-3">
          <p>
            {isSignUpPage
              ? "Already have an account?"
              : "Don't have an account yet?"}{" "}
            <Link
              to={isSignUpPage ? "/login" : "/signup"}
              className="hover:underline text-blue-600"
            >
              {isSignUpPage ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-center ">
          <Separator className="h-px w-2/5 bg-gray-200 my-4" />
          <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">
            Or
          </span>
          <Separator className="h-px w-2/5 bg-gray-200 dark:text-gray-400 my-4" />
        </div>
        <div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} >
            <Icons.google className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
