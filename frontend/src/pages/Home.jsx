import { useAuth } from "@/components/AuthContext";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Navigation />
      {user ? <div>Welcome, {user.name}!</div> : <div>Please log in.</div>}
      <Button onClick={logout}>Log Out</Button>
      <Button onClick={() => navigate("/browse")}>Browse Files</Button>
      <Button onClick={() => navigate("/posts/665c0b491909aa5f00b270b0")}>
        Sample Post
      </Button>
    </div>
  );
};

export default Home;
