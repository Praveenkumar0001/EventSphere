"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  Home,
  Calendar,
  Compass,
  Ticket,
  Heart,
  Settings,
  LogOut,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and mobile menu button */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="mr-2 p-2 rounded-md lg:hidden hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-pink-600">
                  EventHub
                </span>
              </Link>
            </div>

            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for events..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Navigation - hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                Home
              </Link>
              <Link
                to="/events"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Events
              </Link>
              <Link
                to="/categories"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                About
              </Link>
            </nav>

            {/* User actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Bell className="h-5 w-5" />
              </Button>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full"
                      size="icon"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>My Tickets</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" className="text-gray-700">
                    Log in
                  </Button>
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search - only visible on mobile */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for events..."
              className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300"
            />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={toggleSidebar}
        ></div>

        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-xl font-bold text-pink-600">EventHub</span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={toggleSidebar}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={toggleSidebar}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Events</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={toggleSidebar}
                >
                  <Compass className="h-5 w-5" />
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center gap-3 px-3 py-2 rounded-md  text-gray-700 hover:bg-gray-100"
                  onClick={toggleSidebar}
                >
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </Link>
              </li>
            </ul>

            <div className="mt-8 pt-4 border-t">
              {isLoggedIn ? (
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={toggleSidebar}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tickets"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={toggleSidebar}
                    >
                      <Ticket className="h-5 w-5" />
                      <span>My Tickets</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={toggleSidebar}
                    >
                      <Heart className="h-5 w-5" />
                      <span>Favorites</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={toggleSidebar}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={toggleSidebar}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log out</span>
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Log in
                  </Button>
                  <Button className="w-full justify-start bg-pink-600 hover:bg-pink-700">
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
