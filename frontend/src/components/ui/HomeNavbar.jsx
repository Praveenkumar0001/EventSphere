// Navbar.js
import { useUser } from "@/context/userContext";
import React from "react";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Navbar({ toggleSidebar, isSidebarOpen, scrollToFooter }) {
  const navigate = useNavigate();

  const {isLoggedIn, userData} = useUser();

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  const handleClick = (e) => {
    e.preventDefault();
    toggleSidebar(); // Sidebar for extra options
  };

  return (
    <header className="text-white backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-150 bg-black/70  shadow-md px-6 py-3 h-[60px] flex items-center justify-between transition-all duration-300 ease-in-out  ">
      {/* Logo or App Name */}
      <div className="text-lg md:text-xl font-bold">EventSphere</div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-4">
        {[
          { text: "Home", path: "/" },
          { text: "List Your Event", path: "/add-event" },
          { text: "About Us", path: "/aboutus" },
          { text: "Contact Us", path: "/contactus", action: scrollToFooter },
        ].map(({ text, path, action }) => (
          <button
            key={text}
            onClick={() => (action ? action() : handleNavigation(path))}
            className="relative text-sm font-medium hover:text-blue-600 px-4 py-2 transition duration-200 cursor-pointer"
          >
            {text}
          
          </button>
        ))}
      </nav>

      {/* Right-side actions: Login and Sidebar */}
      <div className="flex items-center space-x-4">
        {userData?.accountType === 'company' && <button
          onClick={() => handleNavigation("/file-tender")}
          className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition duration-200"
        >
          File Tender
        </button>}
        {!isLoggedIn && <button
          onClick={() => handleNavigation("/login")}
          className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition duration-200"
        >
          Login
        </button>}

        {/* Sidebar Toggle */}
        <button
          className="hover:text-blue-600 transition-colors duration-200 cursor-pointer"
          onClick={handleClick}
        >
          {isSidebarOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;