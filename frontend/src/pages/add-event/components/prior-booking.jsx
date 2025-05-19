import React, { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";
import axios from "axios";

function PriorBooking({ venue }) {
  const [bookingDetails, setBookingDetails] = useState([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const details = await Promise.all(
          venue.bookings.map(async (booking) => {
            const response = await axios.get(`http://localhost:3002/api/event/get-event-by-id/${booking.eventId}`);
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
        <div className="w-1/2">
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="rounded-lg shadow-lg"
            style={{ width: '450px', height: '270px' }}
          />
        </div>
        <div className="w-1/2 pl-8">
          <h2 className="text-2xl font-bold">{venue.name}</h2>
          <div className="flex items-center text-gray-600 mt-2">
            <FaMapMarkerAlt className="mr-2" />
            <span>
              {venue.city}, {venue.state}
            </span>
          </div>
          <div className="flex items-center mt-2">
            <FaClock className="mr-2" />
            <span>{venue.roomcount} Rooms</span>
          </div>
          <div className="flex items-center mt-2">
            <FaUser className="mr-2" />
            <span>Max ({venue.paxcapacity} pax)</span>
          </div>
          <div className="mt-4">
            <p className="text-blue-500 font-bold text-xl">₹{venue.price}</p>
          </div>
          <div className="flex items-center mt-2">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="font-bold">4.7</span>
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