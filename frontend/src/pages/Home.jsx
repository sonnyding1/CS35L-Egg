import { Button } from "@/components/ui/button";
import  Navigation from "@/components/ui/navigation";


function Home() {
  return (
    <div>
      <Navigation />
      <p className="text-red-500 text-3xl">Home</p>
      <Button>Click me</Button>
    </div>
  );
}

export default Home;
