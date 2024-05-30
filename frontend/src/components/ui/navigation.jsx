// Navigation.js

import React from "react";
import { NavLink } from "react-router-dom"; // Using React Router
import { Button } from "./button";
import DropDown from "./dropdown";

export default function Navigation() {
  const userName = "*UserNameHere"; // Change these two to dynamic user names and avatars
  const userAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4B1c-dIVDdMYhaR9HJ0SRZufvqIZY0zlOGw&s";

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Implement your search logic here
  };

  return (
    //Commenting out the Edit page.
    <div
      className="container mx-auto bg-slate-700 drop-shadow-2xl p-8 grid grid-cols-3"
    >
      <div>
        <nav>
          <Button variant="gabe">
            <NavLink to="/" activeclassname="active">
              <b>Home</b>
            </NavLink>
          </Button>

          <Button variant="gabe">
            <NavLink to="/" activeclassname="active">
              <b>Workspace</b>
            </NavLink>
          </Button>

          <Button variant="gabe">
            <NavLink to="/Community" activeclassname="active">
              <b>Community</b>
            </NavLink>
          </Button>
        </nav>
      </div>
      
      <div></div> {/* Wasting the second column */}

      <div className="flex justify-end space-x-4">
        <p className="text-slate-100 font-serif text-4xl">Egg</p>
        <div className="gabe right-4 w-48"> {}
        <DropDown userName = {userName} userAvatar = {userAvatar} />
        </div>
      </div>

    </div>
  );
}
