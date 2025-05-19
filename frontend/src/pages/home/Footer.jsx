import React, { useState } from "react";
import { Mail, Phone, Instagram, Twitter, Facebook, Music, Calendar, MapPin } from "lucide-react";

const Footer = React.forwardRef((props, ref) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer ref={ref} className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Evently
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Discover, explore, and book tickets for the best events happening around you. Browse curated event listings across categories like music, tech, art, and more.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600 transition-all duration-300 transform hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-400 transition-all duration-300 transform hover:scale-110"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-pink-600 transition-all duration-300 transform hover:scale-110"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 transition-all duration-300 group-hover:w-3"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 transition-all duration-300 group-hover:w-3"></span>
                  Upcoming Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 transition-all duration-300 group-hover:w-3"></span>
                  Trending Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 transition-all duration-300 group-hover:w-3"></span>
                  Event Genres
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 transition-all duration-300 group-hover:w-3"></span>
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-gray-700 pb-2">Explore Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="#" className="py-1 px-3 bg-gray-800 rounded-full text-sm flex items-center hover:bg-purple-900 transition-colors">
                <Music className="w-4 h-4 mr-1" />
                Concerts
              </a>
              <a href="#" className="py-1 px-3 bg-gray-800 rounded-full text-sm flex items-center hover:bg-purple-900 transition-colors">
                <MapPin className="w-4 h-4 mr-1" />
                Festivals
              </a>
              <a href="#" className="py-1 px-3 bg-gray-800 rounded-full text-sm flex items-center hover:bg-purple-900 transition-colors">
                Sports
              </a>
              <a href="#" className="py-1 px-3 bg-gray-800 rounded-full text-sm flex items-center hover:bg-purple-900 transition-colors">
                Workshops
              </a>
              <a href="#" className="py-1 px-3 bg-gray-800 rounded-full text-sm flex items-center hover:bg-purple-900 transition-colors">
                Tech
              </a>
              <a href="#" className="py-1 px-3 bg-gray-800 rounded-full text-sm flex items-center hover:bg-purple-900 transition-colors">
                Theater
              </a>
              <a href="#" className="py-1 px-3 bg-gray-800 rounded-full text-sm flex items-center hover:bg-purple-900 transition-colors">
                Art
              </a>
              <a href="#" className="py-1 px-3 bg-gray-800 rounded-full text-sm flex items-center hover:bg-purple-900 transition-colors">
                Food
              </a>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-gray-700 pb-2">Stay Updated</h3>
            <p className="text-gray-300 text-sm">Subscribe to our newsletter for exclusive updates and offers.</p>
            
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-3 px-4 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSubscribe}
                className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-1 px-4 rounded-md hover:opacity-90 transition-opacity"
              >
                {subscribed ? "Thanks!" : "Subscribe"}
              </button>
            </div>

            <div className="mt-6">
              <h4 className="font-bold mb-3">Contact Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-purple-400" />
                  <span>info@evently.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-purple-400" />
                  <span>+1 (123) 456-7890</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Evently. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;