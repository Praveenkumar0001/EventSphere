import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VenueCard from "./components/venue-card";
import PriorBooking from "./components/Prior_booking";
import Venuedetailpage from "./components/Venuedetailpage";
import { Button } from "@/components/ui/button";

const SecondPage = ({ formData, setFormData, handlePageChange }) => {
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalVenue, setModalVenue] = useState(null);

  useEffect(() => {
    const handleGetVenues = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:3002/api/venue/getvenue",
          {
            state: formData.state,
            city: formData.city,
          }
        );

        const data = await res.data;
        setVenues(data.venues);
      } catch (error) {
        toast.error("Failed to retrieve venues. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    handleGetVenues();
  }, [formData.state, formData.city]);

  const openModal = (venue) => {
    setModalVenue(venue);
  };

  const closeModal = () => {
    setModalVenue(null);
  };

  return (
    <div className="relative">
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-20 gap-x-10 transition ${
          modalVenue || selectedVenue ? "blur-sm" : ""
        }`}
      >
        {venues.map((venue, index) => (
          <VenueCard
            key={index}
            venue={venue}
            formData={formData}
            setFormData={setFormData}
            handlePageChange={handlePageChange}
            onPriorBookingClick={() => setSelectedVenue(venue)}
            onCardClick={openModal}
          />
        ))}
      </div>

      {modalVenue && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600"
            >
              &times;
            </button>
            <Venuedetailpage venue={modalVenue} onClose={closeModal} />
          </div>
        </div>
      )}

      {selectedVenue && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
            <button
              onClick={() => setSelectedVenue(null)}
              className="absolute top-2 right-2 text-gray-600"
            >
              &times;
            </button>
            <PriorBooking venue={selectedVenue} />
          </div>
        </div>
      )}

      <div className="flex justify-center items-center mt-4">
        <Button
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md cursor-pointer transform transition-transform duration-200 hover:scale-105 px-4 py-2 rounded"
          type="button"
          onClick={() => handlePageChange(1)}
        >
          Back to Event Information
        </Button>
      </div>
    </div>
  );
};

export default SecondPage;