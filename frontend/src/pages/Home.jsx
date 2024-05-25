import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { useAuth } from "@/components/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navigation />
      {user && <p>Hello, {user.name}</p>}
      <p className="text-red-500 text-3xl">Home</p>
      <Button>Click me</Button>
    </div>
  );
};

export default Home;
