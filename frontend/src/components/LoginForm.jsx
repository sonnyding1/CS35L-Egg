import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginField from "./LoginField";

const LoginForm = ({ isSignUpPage }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);

  useEffect(() => {
    if (isSignUpPage) {
      setIsPasswordMatched(password === confirmPassword);
    }
  }, [password, confirmPassword, isSignUpPage]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User logged in successfully:", data);
        navigate("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Invalid email or password.");
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!isPasswordMatched) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          name,
          email,
        }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User signed up successfully:", data);
        navigate("/");
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("Signup failed.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUpPage) {
      if (password != confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      handleSignup(e);
    } else {
      handleLogin(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-72">
      {isSignUpPage && (
        <LoginField
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          isMatched={true}
        />
      )}
      {isSignUpPage && (
        <LoginField
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          isMatched={true}
        />
      )}
      <LoginField
        id="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        isMatched={true}
      />
      <LoginField
        id="password"
        label="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrorMessage("");
        }}
        type="password"
        isMatched={isPasswordMatched}
      />
      {isSignUpPage && (
        <LoginField
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrorMessage("");
          }}
          type="password"
          isMatched={isPasswordMatched}
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
      </div>
    </form>
  );
};

export default LoginForm;
