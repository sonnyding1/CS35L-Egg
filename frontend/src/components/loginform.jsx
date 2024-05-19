import { useEffect, useState } from "react";

const LoginForm = ({ isSignUpPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSignUpPage) {
      if (!passwordsMatch) {
        return;
      }
      // Call a backend API for signing up authentication
      console.log("User signed up with: ", email, password, confirmPassword);
    } else {
      console.log("Logging in with:", email, password);
      // Call a backend API here for authentication
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        className={`mt-1 block w-full px-3 py-2 border ${
          !passwordsMatch
            ? " border-red-500"
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
            className={`mt-1 block w-full px-3 py-2 border ${
              !passwordsMatch
                ? " border-red-500"
                : "border-input focus:border-primary"
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
            className={`mt-1 mb-4 text-sm ${
              !passwordsMatch ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        </>
      )}
      <button
        className="mt-4 w-full bg-primary hover:bg-slate-700 text-primary-foreground font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        type="submit"
      >
        {isSignUpPage ? "Sign Up" : "Log In"}
      </button>
    </form>
  );
};

export default LoginForm;
