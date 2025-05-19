import React from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function VenueCard({ venue, formData }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/listevent2", { state: { venue, formData } });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      style={{ width: "360px", height: "410px" }} // Increased card height
    >
      <div className="relative">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="w-full"
          style={{ height: "214px" }} // Set image height
          loading="lazy"
          decoding="async"
        />
        <button
          onClick={handleBookNow}
          className="absolute bottom-2 right-2 bg-pink-500 text-white py-1 px-3 rounded"
        >
          Book Now
        </button>
        <div className="absolute top-2 right-2 bg-white bg-opacity-75 p-1 rounded">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="font-bold">4.7</span>
          <span className="text-gray-600 ml-1">(40 reviews)</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{venue.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-1" />
          <span>
            {venue.city} ({venue.state})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Price</p>
            <p className="text-blue-500 font-bold text-xl">₹{venue.price}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">
              {venue.platformPrice} [PLATFORM] | {venue.vendorPrice} [VENDOR]
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded">
            {venue.paxcapacity} pax
          </span>
          <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded">
            {venue.roomcount} Rooms
          </span>
          <button className="bg-pink-500 text-white py-1 px-3 rounded">
            Prior Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default VenueCard;
