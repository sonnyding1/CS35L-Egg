import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

const NavBarLink = ({ title, link }) => {
  return (
    <NavLink to={link}>
      {({ isActive }) => (
        <Button variant={isActive ? "default" : "ghost"} size="sm">
          {title}
        </Button>
      )}
    </NavLink>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-xl font-semibold text-gray-800">
              Egg
            </NavLink>
          </div>
          <div className="flex space-x-4">
            <NavBarLink title="Home" link="/" />
            <NavBarLink title="Files" link="/browse" />
            <NavBarLink title="Community" link="/community" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
