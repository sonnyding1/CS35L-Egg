import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, password, name, email) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, name, email }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Signup failed");
      const data = await response.json();
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3000/user/logout", {
        method: "GET",
        credentials: "include",
      }).then((response) => {
        if (response.ok) {
          console.log("Logout successful");
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.log("Logout failed");
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
        user,
        setUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
