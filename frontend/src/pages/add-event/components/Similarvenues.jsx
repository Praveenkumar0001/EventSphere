import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SimilarEvents = ({ city, state, onVenueClick }) => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const handleGetVenues = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3002/api/venue/getvenue",
          {
            state: state,
            city: city,
          }
        );

        const data = await res.data;
        setVenues(data.venues);
      } catch (error) {
        toast.error("Failed to retrieve venues. Please try again.");
      }
    };
    handleGetVenues();
  }, [state, city]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Similar events in your {city}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {venues.map((venue, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => onVenueClick(venue)}
          >
            <img
              src={venue.imageUrl}
              alt={venue.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
              <h3 className="text-white font-bold text-lg shadow-md">
                {venue.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarEvents;