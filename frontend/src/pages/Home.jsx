import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  MessageCircle,
  Share2,
  Sigma,
  ThumbsUp,
  Upload,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Home = () => {
  const features = [
    {
      title: "WYSIWYG",
      description:
        "What you see is what you get. The editor renders Markdown as you type.",
      icon: <Eye size={64} />,
    },
    {
      title: "Latex Support",
      description:
        "Support for Latex equations. Write complex equations with ease.",
      icon: <Sigma size={64} />,
    },
    {
      title: "Upload Files",
      description:
        "Upload your local files to the editor. Edit them on the go.",
      icon: <Upload size={64} />,
    },
    {
      title: "Share",
      description:
        "Share your files with the community. Let the world know your thoughts.",
      icon: <Share2 size={64} />,
    },
    {
      title: "Comment",
      description:
        "Comment on other's files. Share your thoughts and feedback.",
      icon: <MessageCircle size={64} />,
    },
    {
      title: "Like",
      description: "Like the files you love. Show your appreciation.",
      icon: <ThumbsUp size={64} />,
    },
  ];

  return (
    <>
      <div className="flex flex-col w-screen px-8">
        {/* hero */}
        <div className="items-center text-center">
          <div className="text-4xl font-thin py-48">
            Egg Editor, a handy Markdown editor
          </div>
        </div>
        {/* features */}
        <div className="grid grid-cols-3 gap-4">
          {features.map((feature) => (
            <Card
              className="transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-lg"
              key={feature.title}
            >
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <div className="text-2xl p-4">{feature.title}</div>
                  <div className="text-lg p-4">{feature.description}</div>
                  {feature.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* call to action */}
        <div className="flex flex-col items-center text-center py-24">
          <div className="text-4xl font-thin p-16">
            Are you ready to get started?
          </div>
          <NavLink to="/login">
            <Button variant="outline" className="w-72">
              Login
            </Button>
          </NavLink>
          <NavLink to="/signup" className="mt-4">
            <Button variant="default" className="w-72">
              Sign Up
            </Button>
          </NavLink>
        </div>
        {/* footer */}
        <footer className="flex justify-center items-center h-16 text-gray-400">
          <p>Made with &hearts; by Egg</p>
        </footer>
      </div>
    </>
  );
};

export default Home;
