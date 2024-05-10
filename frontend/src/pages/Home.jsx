import { Button } from "@/components/ui/button";

function Home() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <div>
      <p className="text-primary text-3xl">Home</p>
      <p className="text-slate-300">lorum ipsum...</p>
      <form onSubmit={handleSubmit}>
        <input type="text" id="username" />
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
      <Button>Click me</Button>
    </div>
  );
}

export default Home;
