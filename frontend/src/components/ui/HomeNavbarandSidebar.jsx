import React, { useState, useEffect, useRef } from "react";
import Navbar from "./HomeNavbar";
import Sidebar from "./Homesidebar";

function NavSidebar({ scrollToFooter }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    console.log("isSidebaropen", isSidebarOpen);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    console.log("Toggling sidebar");
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        console.log("Clicked outside, closing sidebar");
        if (isSidebarOpen) setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 ${
        isSidebarOpen ? "inset-0 bg-black/50 z-40" : ""
      }`}
    >
      <div ref={sidebarRef}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} scrollToFooter={scrollToFooter} />
        {isSidebarOpen && (
          <div className="fixed top-16 right-0 w-80 h-[calc(100%-4rem)] z-40">
            <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default NavSidebar;