import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <div>
      <Link to=""><p>Home</p></Link>
      <Link to="/community"><p>Community</p></Link>
      <Link to="/edit"><p>Edit</p></Link>
      <Link to="/login"><p>Login</p></Link>
    </div>
  );
}

export default Home;
