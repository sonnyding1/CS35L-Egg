import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = ({ isSignUpPage }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSignUpPage) {
      if (!passwordsMatch) {
        return;
      }
      fetch('http://localhost:3000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          name,
          email
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Signup failed");
          }
        })
        .then((data) => {
          console.log('User signed up successfully:', data);
          navigate("/");
        })
        .catch((error) => {
          console.error('Error signing up:', error);
          setErrorMessage("Signup failed.");
        });
    } else {
      fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Login failed");
          }
        })
        .then((data) => {
          console.log('User logged in successfully:', data);
          navigate("/");
        })
        .catch((error) => {
          console.error('Error logging in:', error);
          setErrorMessage("Invalid email or password.");
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {isSignUpPage && (
          <>
            <br />
            <label
              className="block text-sm font-medium text-foreground"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <br />
            <label
              className="block text-sm font-medium text-foreground"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </>
        )}
        <br />
        <label
          className="block text-sm font-medium text-foreground"
          htmlFor="email"
        >
          Email address
        </label>
        <input
          className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <br />
        <label
          className="block text-sm font-medium text-foreground"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className={`mt-1 block w-full px-3 py-2 border ${isSignUpPage && !passwordsMatch
            ? "border-red-500"
            : "border-input focus:border-primary"
            } rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary sm:text-sm`}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          required
        />
        {isSignUpPage && (
          <>
            <br />
            <label
              className="block text-sm font-medium text-foreground"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className={`mt-1 block w-full px-3 py-2 border ${!passwordsMatch ? "border-red-500" : "border-input focus:border-primary"
                } rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary sm:text-sm`}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              required
            />
            <p
              className={`mt-1 mb-4 text-sm ${!passwordsMatch ? "text-red-500" : "text-muted-foreground"
                }`}
            >
              {passwordsMatch ? "Passwords match" : "Passwords do not match"}
            </p>
          </>
        )}
        <div
          className={`mt-2 p-2 rounded-md ${errorMessage ? "text-red-500" : "invisible"
            }`}
        >
          {errorMessage || <span>&nbsp;</span>}
        </div>
        <button
          className="mt-4 w-full bg-primary hover:bg-slate-700 text-primary-foreground font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          type="submit"
        >
          {isSignUpPage ? "Sign Up" : "Log In"}
        </button>

        <p className="mt-4 text-center">
          {isSignUpPage ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </>
          )}
        </p>
      </form>
    </ >
  );
};

export default LoginForm;