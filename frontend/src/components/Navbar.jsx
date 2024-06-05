import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <div className="flex space-x-4">
        <NavLink to="/">
          {({ isActive }) => (
            <Button variant={isActive ? "default" : "outline"}>Home</Button>
          )}
        </NavLink>
        <NavLink to="/browse">
          {({ isActive }) => (
            <Button variant={isActive ? "default" : "outline"}>Browse</Button>
          )}
        </NavLink>
        <NavLink to="/community">
          {({ isActive }) => (
            <Button variant={isActive ? "default" : "outline"}>
              Community
            </Button>
          )}
        </NavLink>
        <NavLink to="/posts/665d6405c449c8f4044139b5">
          {({ isActive }) => (
            <Button variant={isActive ? "default" : "outline"}>
              Sample Post
            </Button>
          )}
        </NavLink>
      </div>
      <div className="flex space-x-2">
        {!loading && (
          <>
            {!user ? (
              <>
                <NavLink to="/login">
                  <Button variant="outline">Login</Button>
                </NavLink>
                <NavLink to="/signup">
                  <Button variant="default">Sign Up</Button>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to={`/profiles/${user.username}`}>
                  {({ isActive }) => (
                    <Button variant={isActive ? "default" : "outline"}>
                      {user.name}&apos;s Profile
                    </Button>
                  )}
                </NavLink>
                <Button variant="outline" onClick={logout}>
                  Log Out
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
