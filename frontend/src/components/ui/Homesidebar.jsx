import { useState } from "react";
import { FaUser, FaCalendarAlt, FaTicketAlt, FaLifeRing, FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser } from "@/context/userContext";

function Sidebar({ closeSidebar }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const { logout, userData } = useUser();

  const handleProfileClick = () => {
    navigate("/myprofile");
  };

  const handleEventsClick = () => {
    navigate("/myevent");
  };

  const handleBookingsClick = () => {
    navigate("/myticket");
  };

  const handleSupportClick = () => {
    navigate("/support");
  };

  const handleLogOut = () => {
    setIsModalOpen(true);
  };

  const confirmLogOut = async () => {
    try {
      const res = await axios.post("http://localhost:3002/api/auth/logout", {}, {
        withCredentials: true,
      });
      logout();

      if (res.data.success) {
        toast.success("Logout successful");
        closeSidebar(); // Close the sidebar on successful logout
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error logging out");
    } finally {
      setIsModalOpen(false);
    }
  };

  const cancelLogOut = () => {
    setIsModalOpen(false);
  };

  const menuItems = [
    {
      icon: <FaUser className="text-gray-600" />,
      text: "My Profile",
      subtext: "View and edit your profile",
      onClick: handleProfileClick,
    },
    {
      icon: <FaCalendarAlt className="text-gray-600" />,
      text: "My Events",
      subtext: "View all your events",
      onClick: handleEventsClick,
    },
    {
      icon: <FaTicketAlt className="text-gray-600" />,
      text: "My Tickets",
      subtext: "View all your bookings and purchases",
      onClick: handleBookingsClick,
    },
    {
      icon: <FaLifeRing className="text-gray-600" />,
      text: "Help & Support",
      subtext: "Get help and support",
      onClick: handleSupportClick,
    },
  ];

  return (
    <div className="h-full bg-white rounded-xl flex flex-col relative overflow-hidden border border-gray-100 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Hey! {userData?.name?.split(" ")[0]}{" "}
          <span className="text-yellow-400 bg-none text-2xl">👋</span>
        </h2>
      </div>

      {/* Menu Items */}
      <ul className="p-4 flex-grow space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <li key={index} className="relative">
            <div
              className={`
                flex items-center justify-between cursor-pointer 
                p-4 rounded-xl transition-all duration-300 ease-in-out
                ${activeItem === index ? "bg-gray-50" : "hover:bg-gray-50"}
              `}
              onClick={() => {
                setActiveItem(index);
                item.onClick();
              }}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700">
                  {item.icon}
                </div>
                <div className="flex-grow">
                  <p className="text-gray-800 font-medium">{item.text}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.subtext}</p>
                </div>
              </div>
              <FaChevronRight className="text-gray-400 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
            </div>
          </li>
        ))}
      </ul>

      {/* Footer with Logout Button */}
      <div className="p-6 border-t border-gray-100">
        <Button
          onClick={handleLogOut}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white rounded-xl py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer"
          size="sm"
        >
          Log Out
        </Button>
      </div>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-scaleIn">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={cancelLogOut}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmLogOut}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;