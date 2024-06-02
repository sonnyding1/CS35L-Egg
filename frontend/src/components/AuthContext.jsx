import { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (response.status === 204) {
        setUser(null);
      } else if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user login:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

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
      value={{ user, login, signup, logout, loading, checkUserLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
