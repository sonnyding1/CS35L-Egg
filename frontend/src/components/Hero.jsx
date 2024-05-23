import React from "react";
import Navbar from "./Navbar";
import { Button } from "./ui/button";
import "../markdown.css";
import "katex/dist/katex.min.css";

const Hero = ({
  title = "Default Title",
  subtitle = "This is a default subtitle.",
}) => {
  return (
    <div className="bg-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">{title}</h1>
          <p className="text-xl text-foreground mb-8">{subtitle}</p>
          <Button variant="default">Click Me!</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
