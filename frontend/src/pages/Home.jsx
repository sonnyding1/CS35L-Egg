import { AuthContext } from "@/components/AuthContext";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <Navigation />
      {isAuthenticated && user ? (
        <div>Welcome, {user.name}!</div>
      ) : (
        <div>Please log in.</div>
      )}
      <Button onClick={logout}>Log Out</Button>
      <Button onClick={() => navigate("/browse")}>Browse Files</Button>
      <Button onClick={() => navigate("/posts/665d6405c449c8f4044139b5")}>
        Sample Post
      </Button>
      <Button
        onClick={() => {
          user && navigate("/profiles/" + user.username);
        }}
      >
        Your Profile
      </Button>
    </div>
  );
};

export default Home;
