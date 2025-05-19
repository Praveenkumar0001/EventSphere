import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function App({ city }) {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3002/api/event/getAllEvent"
        );
        if (response.data.success) {
          const filteredEvents = response.data.events.filter(
            (event) => event.venue.city === city
          );
          setEvents(filteredEvents);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [city]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleCardClick = (id) => {
    navigate(`/ticketbooking/${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {events.map((event, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => handleCardClick(event._id)}
        >
          <img
            src={event.imageUrl}
            alt={`Event ${index}`}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-3 left-3 bg-pink-500 text-white rounded-full px-3 py-1 text-xs font-bold">
            {event.genre}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <h3 className="text-white font-bold text-lg shadow-md">
              {event.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
