import { useAuth } from "@/components/AuthContext";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <Navigation />
      {user ? <div>Welcome, {user.name}!</div> : <div>Please log in.</div>}
      <Button onClick={logout}>Log Out</Button>
    </div>
  );
};

export default Home;
