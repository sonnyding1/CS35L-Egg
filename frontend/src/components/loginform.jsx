import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NameField = ({ value, onChange }) => (
  <div>
    <Label htmlFor="name">Name</Label>
    <Input id="name" value={value} onChange={onChange} type="text" required />
  </div>
);

const EmailField = ({ value, onChange }) => (
  <div>
    <Label htmlFor="email">Email</Label>
    <Input id="email" value={value} onChange={onChange} type="email" required />
  </div>
);

const UsernameField = ({ value, onChange }) => (
  <div>
    <Label htmlFor="username">Username</Label>
    <Input
      id="username"
      value={value}
      onChange={onChange}
      type="text"
      required
    />
  </div>
);

const PasswordField = ({ value, onChange, isMatched }) => (
  <div>
    <Label htmlFor="password">Password</Label>
    <Input
      id="password"
      value={value}
      onChange={onChange}
      type="password"
      required
      className={
        !isMatched ? "border-red-500 ring-red-500 focus-visible:ring-red" : ""
      }
    />
  </div>
);

const ConfirmPasswordField = ({ value, onChange, isMatched }) => (
  <div>
    <Label htmlFor="confirmPassword">Confirm Password</Label>
    <Input
      id="confirmPassword"
      value={value}
      onChange={onChange}
      type="password"
      required
      className={
        !isMatched ? "border-red-500 ring-red-500 focus-visible:ring-red" : ""
      }
    />
  </div>
);

const LoginSignUpMessage = ({ isSignUpPage }) => {
  return (
    <p>
      {isSignUpPage ? "Already have an account?" : "Don't have an account yet?"}{" "}
      <Link
        to={isSignUpPage ? "/login" : "/signup"}
        className="hover:underline text-blue-600"
      >
        {isSignUpPage ? "Log in" : "Sign up"}
      </Link>
    </p>
  );
};
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
        <NameField value={name} onChange={(e) => setName(e.target.value)} />
      )}
      {isSignUpPage && (
        <UsernameField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordField
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrorMessage("");
        }}
        isMatched={isPasswordMatched}
      />
      {isSignUpPage && (
        <ConfirmPasswordField
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrorMessage("");
          }}
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
          <LoginSignUpMessage isSignUpPage={isSignUpPage} />
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
