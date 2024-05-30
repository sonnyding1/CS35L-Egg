// DropdownMenu.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from './button'; // Import the Button component

export default function DropDown({ userName, userAvatar }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
    <div className="relative">
        <Button
        variant="gabe"
        onClick={toggleDropdown}
        className="focus:outline-none"
        >
        <img src={userAvatar} className="w-8 h-8 rounded-full mr-2" />
        <span> {userName} </span>
        </Button>
        {isOpen && <div 
        className="absolute right-4 mt-2 w-44 bg-white border border-gray-300 rounded-md shadow-lg">
        <ul>
            <li className="p-2 hover:bg-gray-200"><NavLink to="/profile">Profile</NavLink></li>
            <li className="p-2 hover:bg-gray-200"><NavLink to="/settings">Settings</NavLink></li>
            <li className="p-2 hover:bg-gray-200"><NavLink to="/logout">Logout</NavLink></li>
        </ul>
        </div>}
    </div>
    );
}
