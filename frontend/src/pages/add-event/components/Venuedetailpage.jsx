import React, { useState } from "react";
import { X } from "lucide-react";
import Similarvenues from "./Similarvenues";

const VenueDetailsModal = ({ venue, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!venue) return null;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionPreview = venue.description.split(" ").slice(0, 50).join(" ");

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 h-3/4 overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600"
        >
          <X size={24} />
        </button>
        <div className="flex">
          <img
            src={venue.imageUrl || "/placeholder.svg"}
            alt={venue.name}
            className="w-1/2 h-auto object-cover rounded-lg"
          />
          <div className="w-1/3 p-6 bg-white shadow-md rounded-lg border border-gray-200 ml-10">
            <div>
              <h2 className="text-2xl font-bold">{venue.name}</h2>
              <p className="text-gray-600 mt-2">
                <strong>Location:</strong> {venue.city}, {venue.state}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Price:</strong> ₹{venue.price.toLocaleString()}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Capacity:</strong> {venue.paxcapacity} pax
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Rooms:</strong> {venue.roomcount}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-bold">About the Venue</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {isExpanded ? venue.description : descriptionPreview}
          </p>
          <button
            onClick={toggleDescription}
            className="text-blue-500 mt-2"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        </div>
        <div className="mt-8">
          <Similarvenues city={venue.city} state={venue.state} />
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsModal;