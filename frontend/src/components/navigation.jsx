
// Navigation.js

import { NavLink } from "react-router-dom"; // Using React Router
import { Button } from "./ui/button";

export default function Navigation() {
  return (
    //Commenting out the Edit page.
    <div
      className="container mx-auto bg-slate-700 drop-shadow-2xl p-8
    grid grid-cols-3"
    >
      <div>
        <nav>
          {/* <button
            className="bg-neutral-100 p-3 rounded-2xl focus:ring-2 
      transition-all ease-in-out delay-150 hover:bg-neutral-200 hover:overline hover:decoration-slate-900
      text-slate-700 hover:text-slate-900
      mr-4
      "
          >
            <NavLink to="/" activeclassname="active">
              <b>Home </b>
            </NavLink>
          </button> */}

          <Button variant="navButton">
            <NavLink to="/Home" activeclassname="active">
              <b>Home </b>
            </NavLink>
          </Button>

          {/* <li>    
        <NavLink to="/Edit" activeclassname="active">
          Edit
        </NavLink>
      </li> */}

          <Button variant="navButton">
            <NavLink to="/Community" activeclassname="active">
              <b>Community</b>
            </NavLink>
          </Button>
        </nav>
      </div>
      <div></div> {/* wasting the second column*/}
      <div className="flex justify-end">
        <p className="text-slate-100 font-serif text-4xl">Egg</p>
      </div>
    </div>
  );
}
