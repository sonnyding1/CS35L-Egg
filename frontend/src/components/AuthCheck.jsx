import { useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

const AuthCheck = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
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
          setIsAuthenticated(false);
        } else if (response.ok) {
          const data = await response.json();
          setUser(data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking user login:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkUserLoggedIn();
  }, [setIsAuthenticated, setUser]);

  return null;
};

export default AuthCheck;
