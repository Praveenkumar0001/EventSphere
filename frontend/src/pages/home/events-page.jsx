import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Filter, 
  Map, 
  Search,
  X,
  Loader2,
  Star,
  Users,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced EventCard with improved visuals
const EventCard = ({ event, onClick }) => {
  const startDate = new Date(event.start);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get day number for the date display
  const day = startDate.getDate();
  const month = startDate.toLocaleDateString('en-US', { month: 'short' });

  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden w-72 cursor-pointer relative border border-purple-100"
      onClick={onClick}
    >
      {/* Date badge */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 flex flex-col items-center z-10 w-14">
        <span className="text-xs font-medium text-purple-600">{month}</span>
        <span className="text-2xl font-bold text-pink-600">{day}</span>
      </div>
      
      {/* Like button */}
      <motion.button 
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Heart className="h-4 w-4 text-pink-500" />
      </motion.button>

      <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600 relative">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl"></div>
              {event.categories?.includes('Workshop') && (
                <Users className="h-20 w-20 text-white" />
              )}
              {event.categories?.includes('Conference') && (
                <Star className="h-20 w-20 text-white" />
              )}
              {event.categories?.includes('Networking') && (
                <Users className="h-20 w-20 text-white" />
              )}
              {event.categories?.includes('Social') && (
                <Users className="h-20 w-20 text-white" />
              )}
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent w-full pt-12">
          <h3 className="text-white font-bold text-xl truncate">{event.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center text-gray-700 mb-2">
          <Clock className="h-4 w-4 mr-2 text-pink-500" />
          <span className="text-sm">{formattedTime}</span>
        </div>
        {event.location && (
          <div className="flex items-center text-gray-700">
            <Map className="h-4 w-4 mr-2 text-pink-500" />
            <span className="text-sm truncate">{event.location}</span>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-1">
          {event.categories?.map((category, idx) => (
            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
    </motion.div>
  );
};

// Main component with enhanced UI
function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [animateHero, setAnimateHero] = useState(true);
  const visibleCards = 3;

  // Categories for filtering - in real app would be derived from the events
  const categories = ["All", "Workshop", "Conference", "Networking", "Social"];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // In a real app, this would be your axios call
        // Simulating API call with timeout for demo purposes
        setTimeout(() => {
          // Example events data with some added fields for visual enhancement
          const mockEvents = [
            {
              _id: "1",
              title: "Web Development Workshop",
              start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
              location: "Tech Hub, Building A",
              categories: ["Workshop", "Technology"],
              description: "Learn the fundamentals of modern web development including React, Node.js, and responsive design principles. This hands-on workshop will guide you through building a complete web application from scratch.",
              attendees: 45,
              featuredSpeaker: "Sarah Johnson"
            },
            {
              _id: "2",
              title: "Networking Mixer",
              start: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
              location: "Downtown Business Center",
              categories: ["Networking", "Social"],
              description: "Connect with professionals in your industry at this casual networking event. Enjoy refreshments and structured networking activities designed to help you build meaningful professional relationships.",
              attendees: 120,
              organizer: "Business Network International"
            },
            {
              _id: "3",
              title: "Design Conference 2025",
              start: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
              location: "Design Center",
              categories: ["Conference", "Design"],
              description: "Annual gathering of design professionals featuring keynote speakers, workshops, and portfolio reviews. Explore the latest trends in UX/UI, graphic design, and product design.",
              attendees: 350,
              featuredSpeaker: "Michael Chen"
            },
            {
              _id: "4",
              title: "AI & Machine Learning Summit",
              start: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
              location: "Innovation Campus",
              categories: ["Conference", "Technology"],
              description: "Explore the latest advances in artificial intelligence and machine learning with experts from around the world. Sessions will cover practical applications, research breakthroughs, and ethical considerations.",
              attendees: 280,
              featuredSpeaker: "Dr. Emily Roberts"
            },
            {
              _id: "5",
              title: "Startup Pitch Night",
              start: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
              location: "Venture Capital Building",
              categories: ["Networking", "Business"],
              description: "Entrepreneurs pitch their ideas to potential investors in this high-energy event. Watch innovative startups present their business plans and compete for funding and mentorship opportunities.",
              attendees: 85,
              prizes: "$50,000 in seed funding"
            }
          ];
          
          setEvents(mockEvents);
          setFilteredEvents(mockEvents);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search term and active filter
    let results = events;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.description?.toLowerCase().includes(term) ||
        event.location?.toLowerCase().includes(term)
      );
    }
    
    if (activeFilter !== "All") {
      results = results.filter(event => 
        event.categories?.some(cat => cat === activeFilter)
      );
    }
    
    setFilteredEvents(results);
    setCurrentIndex(0); // Reset carousel position when filters change
  }, [searchTerm, activeFilter, events]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, Math.max(0, filteredEvents.length - visibleCards))
    );
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  // Reset animation on hero element
  useEffect(() => {
    const timer = setTimeout(() => setAnimateHero(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Hero section with animated elements */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 to-pink-700 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-x-1/2 -top-40 transform-gpu blur-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: animateHero ? [0, 1, 0.5] : 0.5, scale: animateHero ? [0.5, 1.5, 1] : 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-pink-400 to-purple-500 opacity-30"
              style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
            />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-extrabold mb-4">
              <span className="block">Discover Amazing</span> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
                Events Near You
              </span>
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Connect with like-minded people and expand your horizons
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and filter with improved styling */}
        <div className="max-w-4xl mx-auto mb-12 -mt-16 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search events, locations, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
                {categories.map(category => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(category)}
                    className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all ${
                      activeFilter === category
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-md"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Event cards carousel with enhanced styles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-purple-800">
              {activeFilter === "All" ? "Upcoming Events" : `${activeFilter} Events`}
              <span className="ml-2 text-sm font-normal text-pink-500">{filteredEvents.length} found</span>
            </h2>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`p-3 rounded-full bg-white shadow-md ${
                  currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-50"
                }`}
              >
                <ChevronLeft className="h-6 w-6 text-pink-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                disabled={currentIndex >= filteredEvents.length - visibleCards}
                className={`p-3 rounded-full bg-white shadow-md ${
                  currentIndex >= filteredEvents.length - visibleCards
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-pink-50"
                }`}
              >
                <ChevronRight className="h-6 w-6 text-pink-600" />
              </motion.button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl shadow-lg p-8">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-100 opacity-50 rounded-full blur-xl"></div>
                <Loader2 className="h-16 w-16 text-pink-600 animate-spin relative" />
              </div>
              <p className="text-purple-700 mt-6 font-medium text-lg">Discovering exciting events...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 p-8 text-center bg-red-50 rounded-3xl shadow-lg border border-red-100">
              <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl shadow-lg p-8">
              <Filter className="h-16 w-16 text-purple-300 mb-4" />
              <p className="text-purple-700 text-center text-lg font-medium">No events match your search criteria</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {setSearchTerm(""); setActiveFilter("All");}}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Clear filters
              </motion.button>
            </div>
          ) : (
            <div className="relative w-full">
              <AnimatePresence initial={false} mode="wait">
                <motion.div 
                  key={currentIndex}
                  className="flex gap-8 justify-center"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {filteredEvents
                    .slice(currentIndex, currentIndex + visibleCards)
                    .map((event) => (
                      <EventCard 
                        key={event._id} 
                        event={event} 
                        onClick={() => openEventDetails(event)}
                      />
                    ))}
                </motion.div>
              </AnimatePresence>
              
              {/* Pagination dots */}
              <div className="flex justify-center mt-10">
                {Array.from({ length: Math.ceil(filteredEvents.length / visibleCards) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * visibleCards)}
                    className={`mx-1 h-3 rounded-full transition-all ${
                      index === Math.floor(currentIndex / visibleCards)
                        ? "w-10 bg-gradient-to-r from-purple-500 to-pink-500"
                        : "w-3 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Enhanced event details modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={closeEventDetails}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-64 bg-gradient-to-r from-purple-600 to-pink-600 relative">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 -left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                    <div className="absolute -bottom-8 -right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                  </div>
                </div>
                
                <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-3 flex flex-col items-center z-10">
                  <span className="text-xs font-medium text-purple-600">
                    {new Date(selectedEvent.start).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-3xl font-bold text-pink-600">
                    {new Date(selectedEvent.start).getDate()}
                  </span>
                </div>
                
                <button
                  onClick={closeEventDetails}
                  className="absolute top-6 right-6 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 backdrop-blur-sm transition-all"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
                
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex gap-3 mb-3">
                    {selectedEvent.categories?.map((category, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                        {category}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl font-bold text-white">{selectedEvent.title}</h2>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-2 text-pink-500" />
                    <span className="text-lg">
                      {new Date(selectedEvent.start).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-2 text-pink-500" />
                    <span className="text-lg">
                      {new Date(selectedEvent.start).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center text-gray-700 mb-6 bg-purple-50 p-4 rounded-xl">
                    <Map className="h-6 w-6 mr-3 text-purple-600" />
                    <span className="text-lg text-purple-800">{selectedEvent.location}</span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">About this event</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {selectedEvent.attendees && (
                    <div className="bg-pink-50 rounded-xl p-4 flex items-center">
                      <Users className="h-8 w-8 text-pink-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-pink-800">Attendees</h4>
                        <p className="text-pink-700">{selectedEvent.attendees} people attending</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.featuredSpeaker && (
                    <div className="bg-purple-50 rounded-xl p-4 flex items-center">
                      <Star className="h-8 w-8 text-purple-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-purple-800">Featured Speaker</h4>
                        <p className="text-purple-700">{selectedEvent.featuredSpeaker}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.organizer && (
                    <div className="bg-purple-50 rounded-xl p-4 flex items-center">
                      <Users className="h-8 w-8 text-purple-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-purple-800">Organizer</h4>
                        <p className="text-purple-700">{selectedEvent.organizer}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.prizes && (
                    <div className="bg-pink-50 rounded-xl p-4 flex items-center">
                      <Star className="h-8 w-8 text-pink-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-pink-800">Prizes</h4>
                        <p className="text-pink-700">{selectedEvent.prizes}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Register Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EventsPage;