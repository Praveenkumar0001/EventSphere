import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

function EventsCarousel() {
  // Mock events data to simulate API response
  const mockEvents = [
    {
      _id: "1",
      title: "Summer Music Festival",
      imageUrl: "/api/placeholder/400/320",
      genre: "MUSIC",
      date: "2025-06-15T18:00:00",
      venue: "Central Park Amphitheater",
      price: "59.99",
      availability: "Available"
    },
    {
      _id: "2",
      title: "NBA Finals Game 5",
      imageUrl: "/api/placeholder/400/320",
      genre: "SPORTS",
      date: "2025-05-23T19:30:00",
      venue: "Madison Square Garden",
      price: "120.00",
      availability: "Limited"
    },
    {
      _id: "3",
      title: "International Comedy Tour",
      imageUrl: "/api/placeholder/400/320",
      genre: "COMEDY",
      date: "2025-07-10T20:00:00",
      venue: "City Theater",
      price: "45.00",
      availability: "Available"
    },
    {
      _id: "4",
      title: "Tech Conference 2025",
      imageUrl: "/api/placeholder/400/320",
      genre: "CONFERENCE",
      date: "2025-08-05T09:00:00",
      venue: "Convention Center",
      price: "299.99",
      availability: "Limited"
    },
    {
      _id: "5",
      title: "Art Exhibition Opening",
      imageUrl: "/api/placeholder/400/320",
      genre: "ART",
      date: "2025-05-20T17:00:00",
      venue: "Metropolitan Museum",
      price: "25.00",
      availability: "Available"
    }
  ];

  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(null);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const carouselRef = useRef(null);
  const visibleCards = 3;

  // Simulate API fetch
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      // Simulate network delay
      setTimeout(() => {
        setEvents(mockEvents);
        setLoading(false);
      }, 1000);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let interval;
    if (!autoplayPaused && events.length > visibleCards) {
      interval = setInterval(() => {
        handleNext();
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [autoplayPaused, events.length, currentIndex]);

  const getVisibleEvents = () => {
    if (events.length <= visibleCards) return events;

    const result = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (currentIndex + i) % events.length;
      result.push(events[index]);
    }
    return result;
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const handleNavigate = (id) => {
    // In a real app, this would navigate to ticket booking page
    console.log(`Navigating to ticket booking for event: ${id}`);
    alert(`Redirecting to ticket booking page for event ID: ${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-black">
        <div className="animate-pulse flex space-x-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700 rounded-lg w-80 h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-black text-white">
        No events found
      </div>
    );
  }

  return (
    <div 
      className="relative py-16 bg-gradient-to-b from-black to-gray-900 overflow-hidden"
      onMouseEnter={() => setAutoplayPaused(true)}
      onMouseLeave={() => setAutoplayPaused(false)}
      ref={carouselRef}
    >
      <h2 className="text-4xl font-bold text-center mb-10 text-white">Upcoming Events</h2>
      
      <div className="flex justify-center items-center relative px-12">
        {/* Navigation buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 z-10 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-2 transition-colors duration-300 shadow-lg"
          aria-label="Previous event"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Cards container */}
        <div className="flex justify-center items-center space-x-6">
          {getVisibleEvents().map((event, index) => {
            const isMiddle = index === 1;
            return (
              <div
                key={event._id}
                className={`transition-all duration-500 transform ${
                  isMiddle ? 'scale-110 z-10' : 'scale-90 opacity-80'
                } ${isHovering === event._id ? 'shadow-2xl' : ''}`}
                onMouseEnter={() => setIsHovering(event._id)}
                onMouseLeave={() => setIsHovering(null)}
                onClick={() => handleNavigate(event._id)}
              >
                <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-xl w-80 cursor-pointer group">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={event.imageUrl || "/api/placeholder/400/320"}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute top-3 left-3 bg-pink-500 text-white rounded-full px-3 py-1 text-xs font-bold">
                      {event.genre || "SPORTS"}
                    </div>
                    {isHovering === event._id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
                        <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                          Get Tickets
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 text-white">
                    <h3 className="text-lg font-bold truncate">{event.title || "Event Title"}</h3>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar size={16} className="mr-2 text-pink-500" />
                        <span>{formatDate(event.date)}</span>
                        <Clock size={16} className="ml-4 mr-2 text-pink-500" />
                        <span>{formatTime(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin size={16} className="mr-2 text-pink-500" />
                        <span className="truncate">{event.venue || "Venue TBA"}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-pink-500 font-bold">${event.price || "TBA"}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.availability === "Limited" ? "bg-yellow-600" : "bg-green-600"
                      }`}>
                        {event.availability || "Available"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleNext}
          className="absolute right-4 z-10 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-2 transition-colors duration-300 shadow-lg"
          aria-label="Next event"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-8">
        {events.length > visibleCards && (
          <div className="flex space-x-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-pink-500 w-6" : "bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsCarousel;