import { useAuth } from "@/components/AuthContext";

const Home = () => {
  const { user } = useAuth();
  return (
    <div>
      {user ? <div>Welcome, {user.name}!</div> : <div>Please log in.</div>}
    </div>
  );
};

export default Home;
