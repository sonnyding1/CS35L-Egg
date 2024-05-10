// Import necessary modules
import React, { useState } from "react";

// Define the LoginForm
const LoginForm = () => {
  // State for storing user inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Process login logic here. For example:
    console.log("Logging in with:", email, password);
    // You would typically call a backend API here for authentication
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  // Render the login form
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="mx-auto p-4 max-w-lg" onSubmit={handleSubmit}>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="email"
        >
          Email address
        </label>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleEmail}
          required
        />
        <br />
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePassword}
          required
        />

        <button
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

// Export the component
export default LoginForm;
