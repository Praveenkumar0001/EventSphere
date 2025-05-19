import React, { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
function PriorBooking({ venue }) {
  const [bookingDetails, setBookingDetails] = useState([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const details = await Promise.all(
          venue.bookings.map(async (eventId) => {
            const response = await axios.get(`http://localhost:3002/api/event/get-event-by-id/${eventId}`);
            return response.data;
          })
        );
        setBookingDetails(details);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    if (venue?.bookings) {
      fetchBookingDetails();
    }
  }, [venue]);

  if (!venue) {
    return <div>No venue data available.</div>;
  }

  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex w-full max-w-4xl">
      <div className="flex">
          <img
            src={venue.imageUrl || "/placeholder.svg"}
            alt={venue.name}
            className="w-1/2 h-auto object-cover rounded-lg"
          />
          <div className="w-1/2 p-6 bg-white shadow-md rounded-lg border border-gray-200 ml-10">
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
        
      </div>
      <div className="w-full max-w-4xl mt-8">
        <h3 className="text-xl font-bold text-pink-600">Prior Bookings</h3>
        <div className="overflow-y-auto max-h-64 mt-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2">Title</th>
                <th className="pb-2">Opening Time</th>
                <th className="pb-2">Closing Time</th>
              </tr>
            </thead>
            <tbody>
              {bookingDetails.map((event, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{event.title}</td>
                  <td className="py-2">{new Date(event.start).toLocaleString()}</td>
                  <td className="py-2">{new Date(event.end).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PriorBooking;